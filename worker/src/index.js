const cors = {
  'Access-Control-Allow-Origin': 'https://reem-masalha.github.io',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const QUESTIONS = [
  ['H2 + O2 → H2O','2H2 + O2 → 2H2O'],
  ['Fe + O2 → Fe2O3','4Fe + 3O2 → 2Fe2O3'],
  ['C3H8 + O2 → CO2 + H2O','C3H8 + 5O2 → 3CO2 + 4H2O'],
  ['KClO3 → KCl + O2','2KClO3 → 2KCl + 3O2'],
  ['N2 + H2 → NH3','N2 + 3H2 → 2NH3'],
  ['CH4 + O2 → CO2 + H2O','CH4 + 2O2 → CO2 + 2H2O'],
  ['Al + HCl → AlCl3 + H2','2Al + 6HCl → 2AlCl3 + 3H2'],
  ['Na + Cl2 → NaCl','2Na + Cl2 → 2NaCl'],
  ['P + O2 → P2O5','4P + 5O2 → 2P2O5']
];

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    const url = new URL(request.url);

    if (url.pathname === '/recognize') return recognize(request, env);
    if (url.pathname.startsWith('/challenge/')) return challenge(request, env, url);
    return json({ error: 'Not found' }, 404);
  }
};

async function recognize(request, env) {
  if (request.method !== 'POST') return json({ error: 'POST an image to /recognize' }, 405);
  try {
    const body = await request.json();
    if (!body.image || typeof body.image !== 'string') return json({ error: 'Missing image' }, 400);
    const image = body.image.includes(',') ? body.image.split(',')[1] : body.image;
    const result = await env.AI.run('@cf/meta/llama-3.2-11b-vision-instruct', {
      messages: [
        { role: 'system', content: 'You are a chemistry handwriting OCR engine. Read only the handwritten chemical equation. Return ONLY normalized plain text. Use element symbols such as H2, O2, Fe2O3; use + and ->; preserve coefficients. Never explain.' },
        { role: 'user', content: 'Transcribe this handwritten chemical equation exactly enough to balance it. Return only the equation.' }
      ], image, max_tokens: 128
    });
    return json({ text: (result?.response || result?.result || '').toString().trim() });
  } catch (e) { return json({ error: e?.message || 'Recognition failed' }, 500); }
}

async function challenge(request, env, url) {
  const path = url.pathname;
  if (path === '/challenge/create' && request.method === 'POST') {
    const id = env.CHALLENGE.idFromName('global');
    return env.CHALLENGE.get(id).fetch(new Request('https://challenge/create', { method:'POST', body: JSON.stringify({ questions: QUESTIONS }) }));
  }
  if (path === '/challenge/leaderboard' && request.method === 'GET') {
    const id = env.CHALLENGE.idFromName('global');
    return env.CHALLENGE.get(id).fetch(new Request('https://challenge/leaderboard'));
  }
  const match = path.match(/^\/challenge\/([A-Z0-9]{4,8})\/(join|status|submit)$/i);
  if (!match) return json({ error: 'Not found' }, 404);
  const room = env.CHALLENGE.get(env.CHALLENGE.idFromName(match[1].toUpperCase()));
  return room.fetch(new Request('https://challenge/' + match[2], request));
}

export class ChallengeRoom {
  constructor(state, env) { this.state = state; this.env = env; }
  async fetch(request) {
    const path = new URL(request.url).pathname;
    if (path === '/create') return this.create();
    if (path === '/join' && request.method === 'POST') return this.join(request);
    if (path === '/status' && request.method === 'GET') return this.status();
    if (path === '/submit' && request.method === 'POST') return this.submit(request);
    if (path === '/leaderboard') return this.leaderboard();
    return json({ error: 'Not found' }, 404);
  }
  async create() {
    const existing = await this.state.storage.get('room');
    if (existing) return json(existing);
    const code = randomCode();
    const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    const room = { code, question:q[0], answer:q[1], players:[], createdAt:Date.now(), finished:false };
    await this.state.storage.put('room', room);
    return json({ code, question:q[0], playerId:null, waiting:true });
  }
  async join(request) {
    const room = await this.state.storage.get('room');
    if (!room) return json({ error:'Challenge not found' },404);
    if (room.players.length >= 2) return json({ error:'This challenge already has two players' },409);
    const body = await request.json().catch(()=>({}));
    const name = String(body.name || 'Player').slice(0,30);
    const playerId = crypto.randomUUID();
    room.players.push({ id:playerId, name, joinedAt:Date.now(), startedAt:null, submitted:false });
    await this.state.storage.put('room', room);
    return json({ code:room.code, playerId, question:room.question, players:room.players.length, waiting:room.players.length<2 });
  }
  async status() {
    const room = await this.state.storage.get('room');
    if (!room) return json({ error:'Challenge not found' },404);
    if (room.players.length === 2 && !room.startedAt) {
      room.startedAt=Date.now();
      room.players.forEach(p=>p.startedAt=room.startedAt);
      await this.state.storage.put('room',room);
    }
    return json({ code:room.code, question:room.question, players:room.players.map(p=>({id:p.id,name:p.name,submitted:p.submitted})), startedAt:room.startedAt, finished:room.finished, winner:room.winner||null });
  }
  async submit(request) {
    const room = await this.state.storage.get('room');
    if (!room || !room.startedAt) return json({ error:'Challenge has not started' },409);
    const body = await request.json().catch(()=>({}));
    const p=room.players.find(x=>x.id===body.playerId);
    if(!p) return json({error:'Player not found'},403);
    if(p.submitted) return json({error:'Already submitted'},409);
    if(normalize(body.answer)!==normalize(room.answer)) return json({correct:false,error:'Incorrect answer'});
    const time=Date.now()-p.startedAt;
    p.submitted=true;p.time=time;
    if(!room.winner){room.winner={id:p.id,name:p.name,time};room.finished=true;await this.state.storage.put('room',room);await this.addScore(p.name,time,room.question);return json({correct:true,winner:true,time});}
    await this.state.storage.put('room',room);return json({correct:true,winner:false,time,winner:room.winner});
  }
  async addScore(name,time,question){
    const rows=await this.state.storage.get('leaderboard')||[];
    rows.push({name,time,question,date:new Date().toISOString()});
    rows.sort((a,b)=>a.time-b.time);
    await this.state.storage.put('leaderboard',rows.slice(0,100));
  }
  async leaderboard(){return json({entries:(await this.state.storage.get('leaderboard'))||[]});}
}
function normalize(s){return String(s||'').toLowerCase().replace(/[→⟶⇒]/g,'->').replace(/\s+/g,'').replace(/^1(?=[A-Z])/,'');}
function randomCode(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<5;i++)s+=chars[Math.floor(Math.random()*chars.length)];return s;}
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json'}});}
