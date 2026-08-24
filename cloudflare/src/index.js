const encoder = new TextEncoder();

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = { 'content-type': 'application/json', 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': 'content-type,x-admin-key' };
    if (request.method === 'OPTIONS') return new Response(null, { headers });
    try {
      if (url.pathname === '/health') return new Response(JSON.stringify({ ok: true }), { headers });
      if (url.pathname === '/api/track-visit' && request.method === 'POST') {
        const { visitorId, path } = await request.json();
        if (!visitorId || !path) return json({ error: 'visitorId and path are required.' }, headers, 400);
        await env.DB.prepare('INSERT INTO visits (visitor_id,path,created_at) VALUES (?,?,?)').bind(String(visitorId), String(path).slice(0,200), new Date().toISOString()).run();
        return json({ ok: true }, headers);
      }
      if (url.pathname === '/api/create-account' && request.method === 'POST') {
        const { name, username, password } = await request.json();
        if (!name || !username || !password) return json({ error: 'Name, username and password are required.' }, headers, 400);
        if (String(password).length < 8) return json({ error: 'Password must be at least 8 characters.' }, headers, 400);
        const u = String(username).trim().toLowerCase();
        const exists = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(u).first();
        if (exists) return json({ error: 'Username already exists.' }, headers, 409);
        const salt = crypto.randomUUID(); const hash = await hashPassword(String(password), salt); const id = crypto.randomUUID();
        await env.DB.prepare('INSERT INTO users (id,name,username,password_hash,password_salt,created_at) VALUES (?,?,?,?,?,?)').bind(id, String(name).trim(), u, hash, salt, new Date().toISOString()).run();
        return json({ ok: true, user: { id, name: String(name).trim(), username: u } }, headers);
      }
      if (url.pathname === '/api/set-password' && request.method === 'POST') {
        const { username, password, confirmPassword } = await request.json(); const u = String(username || '').trim().toLowerCase();
        if (!u) return json({ error: 'Username is required.' }, headers, 400); if (!password) return json({ error: 'Password is required.' }, headers, 400);
        if (String(password).length < 8) return json({ error: 'Password must be at least 8 characters.' }, headers, 400); if (password !== confirmPassword) return json({ error: 'Passwords do not match.' }, headers, 400);
        const user = await env.DB.prepare('SELECT id,name,username,password_hash,password_salt FROM users WHERE username = ?').bind(u).first();
        if (!user) return json({ error: 'No existing account was found with that username.' }, headers, 404);
        if (user.password_hash && user.password_salt) return json({ error: 'This account already has a password. Please use Sign in.' }, headers, 409);
        const salt = crypto.randomUUID(); const hash = await hashPassword(String(password), salt);
        await env.DB.prepare('UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?').bind(hash, salt, user.id).run();
        return json({ ok: true, user: { id: user.id, name: user.name, username: user.username } }, headers);
      }
      if (url.pathname === '/api/sign-in' && request.method === 'POST') {
        const { username, password } = await request.json(); if (!username || !password) return json({ error: 'Username and password are required.' }, headers, 400);
        const user = await env.DB.prepare('SELECT id,name,username,password_hash,password_salt FROM users WHERE username = ?').bind(String(username).trim().toLowerCase()).first();
        if (!user || !user.password_hash || !user.password_salt) return json({ error: 'Incorrect username or password.' }, headers, 401);
        const hash = await hashPassword(String(password), user.password_salt); if (!timingSafeEqual(hash, user.password_hash)) return json({ error: 'Incorrect username or password.' }, headers, 401);
        return json({ ok: true, user: { id: user.id, name: user.name, username: user.username } }, headers);
      }
      if (url.pathname === '/api/scores' && request.method === 'GET') {
        const userId = url.searchParams.get('userId'); const rows = await env.DB.prepare('SELECT stage,score,total,created_at FROM scores WHERE user_id = ? ORDER BY created_at DESC').bind(userId).all();
        return json({ scores: rows.results }, headers);
      }
      if (url.pathname === '/api/scores' && request.method === 'POST') {
        const { userId, stage, score, total } = await request.json(); await env.DB.prepare('INSERT INTO scores (user_id,stage,score,total,created_at) VALUES (?,?,?,?,?)').bind(userId, stage, score, total, new Date().toISOString()).run(); return json({ ok: true }, headers);
      }
      if (url.pathname === '/api/admin/stats' && request.method === 'GET') {
        if (!env.ADMIN_KEY || request.headers.get('x-admin-key') !== env.ADMIN_KEY) return json({ error: 'Unauthorized.' }, headers, 401);
        const users = await env.DB.prepare('SELECT id,name,username,created_at FROM users ORDER BY created_at DESC').all();
        const totals = await env.DB.prepare('SELECT COUNT(*) AS visits, COUNT(DISTINCT visitor_id) AS unique_visitors FROM visits').first();
        const pages = await env.DB.prepare('SELECT path,COUNT(*) AS views FROM visits GROUP BY path ORDER BY views DESC').all();
        const recent = await env.DB.prepare('SELECT visitor_id,path,created_at FROM visits ORDER BY created_at DESC LIMIT 100').all();
        const scores = await env.DB.prepare('SELECT u.username,u.name,s.stage,s.score,s.total,s.created_at FROM scores s JOIN users u ON u.id=s.user_id ORDER BY s.created_at DESC LIMIT 200').all();
        return json({ users: users.results, totals, pages: pages.results, recent: recent.results, scores: scores.results }, headers);
      }
      return json({ error: 'Not found' }, headers, 404);
    } catch (e) { return json({ error: e.message || 'Server error' }, headers, 500); }
  }
};
async function hashPassword(password, salt) { const digest = await crypto.subtle.digest('SHA-256', encoder.encode(salt + ':' + password)); return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join(''); }
function timingSafeEqual(a,b) { if(a.length!==b.length)return false; let d=0; for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i); return d===0; }
function json(data,headers,status=200){return new Response(JSON.stringify(data),{status,headers});}
