import legacy from './index-legacy.js';

const CORS = {
  'Content-Type': 'application/json; charset=UTF-8',
  'Access-Control-Allow-Origin': 'https://reem-masalha.github.io',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Key',
  'Access-Control-Max-Age': '86400',
};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:CORS});
const clean=(v,max=3000)=>v==null?'':String(v).trim().slice(0,max);
const adminOk=(request,env)=>{const key=String(request.headers.get('X-Admin-Key')||''),configured=String(env.ADMIN_KEY||'');return configured&&key===configured};
async function ensureFeedback(env){
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT NOT NULL,name TEXT,email TEXT,message TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'New',created_at TEXT NOT NULL)`).run();
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at)`).run();
}
async function feedback(request,env){
  await ensureFeedback(env);
  const p=await request.json().catch(()=>({}));
  const type=clean(p.type,40)||'suggestion',name=clean(p.name,80),email=clean(p.email,160),message=clean(p.message,3000);
  if(!message)return json({error:'A message is required.'},400);
  await env.DB.prepare(`INSERT INTO feedback (type,name,email,message,status,created_at) VALUES (?,?,?,?,?,?)`).bind(type,name,email,message,'New',new Date().toISOString()).run();
  return json({ok:true});
}
async function adminFeedback(request,env){
  if(!adminOk(request,env))return json({error:'Unauthorized.'},401);
  await ensureFeedback(env);
  const rows=await env.DB.prepare(`SELECT id,type,name,email,message,status,created_at FROM feedback ORDER BY created_at DESC,id DESC LIMIT 500`).all();
  return json({feedback:rows.results||[]});
}
export default {async fetch(request,env,ctx){
  const url=new URL(request.url);
  try{
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:CORS});
    if(url.pathname==='/api/feedback'&&request.method==='POST')return await feedback(request,env);
    if(url.pathname==='/api/admin/feedback'&&request.method==='GET')return await adminFeedback(request,env);
    return legacy.fetch(request,env,ctx);
  }catch(e){return json({error:e?.message||'Server error'},500)}
}};
