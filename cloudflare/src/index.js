export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = { 'content-type': 'application/json', 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': 'content-type' };
    if (request.method === 'OPTIONS') return new Response(null, { headers });
    try {
      if (url.pathname === '/health') return new Response(JSON.stringify({ ok: true }), { headers });
      if (url.pathname === '/api/create-account' && request.method === 'POST') {
        const { name, username } = await request.json();
        if (!name || !username) return json({ error: 'Name and username are required.' }, headers, 400);
        const u = String(username).trim().toLowerCase();
        const exists = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(u).first();
        if (exists) return json({ error: 'Username already exists.' }, headers, 409);
        const id = crypto.randomUUID();
        await env.DB.prepare('INSERT INTO users (id,name,username,created_at) VALUES (?,?,?,?)').bind(id, String(name).trim(), u, new Date().toISOString()).run();
        return json({ ok: true, user: { id, name: String(name).trim(), username: u } }, headers);
      }
      if (url.pathname === '/api/sign-in' && request.method === 'POST') {
        const { username } = await request.json();
        const user = await env.DB.prepare('SELECT id,name,username FROM users WHERE username = ?').bind(String(username || '').trim().toLowerCase()).first();
        if (!user) return json({ error: 'No account found.' }, headers, 404);
        return json({ ok: true, user }, headers);
      }
      if (url.pathname === '/api/scores' && request.method === 'GET') {
        const userId = url.searchParams.get('userId');
        const rows = await env.DB.prepare('SELECT stage,score,total,created_at FROM scores WHERE user_id = ? ORDER BY created_at DESC').bind(userId).all();
        return json({ scores: rows.results }, headers);
      }
      if (url.pathname === '/api/scores' && request.method === 'POST') {
        const { userId, stage, score, total } = await request.json();
        await env.DB.prepare('INSERT INTO scores (user_id,stage,score,total,created_at) VALUES (?,?,?,?,?)').bind(userId, stage, score, total, new Date().toISOString()).run();
        return json({ ok: true }, headers);
      }
      return json({ error: 'Not found' }, headers, 404);
    } catch (e) { return json({ error: e.message }, headers, 500); }
  }
};
function json(data, headers, status=200) { return new Response(JSON.stringify(data), { status, headers }); }
