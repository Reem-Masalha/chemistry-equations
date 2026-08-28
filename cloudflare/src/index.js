const encoder = new TextEncoder();

function corsHeaders() {
  return {
    'content-type': 'application/json; charset=UTF-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type,authorization,x-admin-key',
    'access-control-max-age': '86400',
  };
}
const now = () => new Date().toISOString();

async function event(env, p) {
  const v = p.visitorId ? String(p.visitorId) : null;
  const u = p.userId ? String(p.userId) : null;
  await env.DB.prepare('INSERT INTO analytics_events (visitor_id,user_id,event_type,feature,difficulty,question,correct,score,total,metadata,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
    .bind(v, u, String(p.eventType || 'event'), p.feature ? String(p.feature) : null, p.difficulty ? String(p.difficulty) : null, p.question ? String(p.question).slice(0,500) : null, p.correct == null ? null : (p.correct ? 1 : 0), p.score == null ? null : Number(p.score), p.total == null ? null : Number(p.total), p.metadata ? JSON.stringify(p.metadata) : null, now()).run();
}

function cleanLocation(value) {
  return value ? String(value).trim().slice(0, 120) : null;
}

function locationFromRequest(request) {
  const cf = request.cf || {};
  return {
    country: cleanLocation(cf.country),
    region: cleanLocation(cf.region),
    city: cleanLocation(cf.city),
    timezone: cleanLocation(cf.timezone),
    continent: cleanLocation(cf.continent)
  };
}

async function ensureLocationTable(env) {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS visitor_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id TEXT NOT NULL,
    path TEXT NOT NULL,
    country TEXT,
    region TEXT,
    city TEXT,
    timezone TEXT,
    continent TEXT,
    created_at TEXT NOT NULL
  )`).run();
}

async function trackVisit(request, env) {
  const body = await request.json();
  const visitorId = body.visitorId ? String(body.visitorId).slice(0, 200) : '';
  const path = body.path ? String(body.path).slice(0, 200) : '';
  if (!visitorId || !path) return json({ error: 'visitorId and path are required.' }, corsHeaders(), 400);

  const created = now();
  const recent = await env.DB.prepare("SELECT id FROM visits WHERE visitor_id=? AND path=? AND created_at>=datetime('now','-30 minutes') LIMIT 1").bind(visitorId, path).first();
  if (!recent) {
    await env.DB.prepare('INSERT INTO visits (visitor_id,path,created_at) VALUES (?,?,?)').bind(visitorId, path, created).run();
    await ensureLocationTable(env);
    const loc = locationFromRequest(request);
    await env.DB.prepare('INSERT INTO visitor_locations (visitor_id,path,country,region,city,timezone,continent,created_at) VALUES (?,?,?,?,?,?,?,?)')
      .bind(visitorId, path, loc.country, loc.region, loc.city, loc.timezone, loc.continent, created).run();
  }
  await event(env, { visitorId, eventType: 'page_view', metadata: { path } });
  return json({ ok: true, deduplicated: Boolean(recent) }, corsHeaders());
}

function makeSessionToken() {
  return crypto.randomUUID() + '.' + crypto.randomUUID();
}

function userResponse(user, token) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    token
  };
}

async function verifyLegacyPassword(password, stored) {
  if (!stored) return false;
  const value = String(stored);

  // Current format: separate password_salt + SHA-256(salt:password)
  // Legacy accounts in this database have password_salt NULL. Support the
  // common legacy layouts without changing the stored hash.
  const candidates = [];

  const add = async (salt, mode) => {
    if (!salt) return;
    const raw = String(salt);
    const forms = mode === 'password-first'
      ? [raw + ':' + password, raw + password]
      : [raw + ':' + password, password + ':' + raw, raw + password, password + raw];
    for (const text of forms) {
      const digest = await crypto.subtle.digest('SHA-256', encoder.encode(text));
      const hex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
      candidates.push(hex);
    }
  };

  // Try explicit salt/hash containers such as salt:hash, salt$hash,
  // salt|hash and the same forms with a recognizable SHA-256 hash half.
  for (const separator of [':', '$', '|', '.']) {
    const parts = value.split(separator);
    if (parts.length === 2) {
      const [a, b] = parts;
      if (b && /^[a-f0-9]{64}$/i.test(b)) {
        await add(a, 'salt-first');
        if (timingSafeEqual(candidates.at(-1) || '', b)) return true;
      }
      if (a && /^[a-f0-9]{64}$/i.test(a)) {
        const before = candidates.length;
        await add(b, 'password-first');
        for (let i = before; i < candidates.length; i++) {
          if (timingSafeEqual(candidates[i], a)) return true;
        }
      }
    }
  }

  // Some older records used a fixed-length salt prefix followed by a raw
  // 64-character SHA-256 digest. Try plausible split points.
  if (value.length > 64) {
    const tail = value.slice(-64);
    if (/^[a-f0-9]{64}$/i.test(tail)) {
      const salt = value.slice(0, -64).replace(/[:$|.]+$/g, '');
      await add(salt, 'salt-first');
      if (candidates.some(x => timingSafeEqual(x, tail))) return true;
    }
  }

  // Final legacy fallbacks for an unsalted SHA-256 record.
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(String(password)));
  const hex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  if (timingSafeEqual(hex, value)) return true;

  return false;
}

async function verifyPassword(password, user) {
  if (!user || !user.password_hash) return false;
  if (user.password_salt) {
    const hash = await hashPassword(String(password), user.password_salt);
    return timingSafeEqual(hash, user.password_hash);
  }
  return verifyLegacyPassword(String(password), user.password_hash);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url), headers = corsHeaders();
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    try {
      if (url.pathname === '/health') return json({ ok: true }, headers);

      if (url.pathname === '/api/track-visit' && request.method === 'POST') return trackVisit(request, env);

      if (url.pathname === '/api/track-event' && request.method === 'POST') {
        const p = await request.json();
        if (!p.eventType) return json({ error: 'eventType is required.' }, headers, 400);
        await event(env, p);
        return json({ ok: true }, headers);
      }

      if (url.pathname === '/api/create-account' && request.method === 'POST') {
        const { name, username, password } = await request.json();
        if (!name || !username || !password) return json({ error: 'Name, username and password are required.' }, headers, 400);
        if (String(password).length < 8) return json({ error: 'Password must be at least 8 characters.' }, headers, 400);
        const u = String(username).trim().toLowerCase();
        const exists = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(u).first();
        if (exists) return json({ error: 'Username already exists.' }, headers, 409);
        const salt = crypto.randomUUID();
        const hash = await hashPassword(String(password), salt);
        const id = crypto.randomUUID();
        await env.DB.prepare('INSERT INTO users (id,name,username,password_hash,password_salt,created_at) VALUES (?,?,?,?,?,?)').bind(id, String(name).trim(), u, hash, salt, now()).run();
        const token = makeSessionToken();
        return json({ ok: true, user: userResponse({ id, name: String(name).trim(), username: u }, token), token }, headers);
      }

      if (url.pathname === '/api/set-password' && request.method === 'POST') {
        const { username, password, confirmPassword } = await request.json();
        const u = String(username || '').trim().toLowerCase();
        if (!u) return json({ error: 'Username is required.' }, headers, 400);
        if (!password) return json({ error: 'Password is required.' }, headers, 400);
        if (String(password).length < 8) return json({ error: 'Password must be at least 8 characters.' }, headers, 400);
        if (password !== confirmPassword) return json({ error: 'Passwords do not match.' }, headers, 400);
        const user = await env.DB.prepare('SELECT id,name,username,password_hash,password_salt FROM users WHERE username = ?').bind(u).first();
        if (!user) return json({ error: 'No existing account was found with that username.' }, headers, 404);
        if (user.password_hash && user.password_salt) return json({ error: 'This account already has a password. Please use Sign in.' }, headers, 409);
        const salt = crypto.randomUUID();
        const hash = await hashPassword(String(password), salt);
        await env.DB.prepare('UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?').bind(hash, salt, user.id).run();
        const token = makeSessionToken();
        return json({ ok: true, user: userResponse({ id: user.id, name: user.name, username: user.username }, token), token }, headers);
      }

      if (url.pathname === '/api/sign-in' && request.method === 'POST') {
        const { username, password } = await request.json();
        if (!username || !password) return json({ error: 'Username and password are required.' }, headers, 400);
        const user = await env.DB.prepare('SELECT id,name,username,password_hash,password_salt FROM users WHERE username = ?').bind(String(username).trim().toLowerCase()).first();
        if (!user || !(await verifyPassword(String(password), user))) return json({ error: 'Incorrect username or password.' }, headers, 401);

        // Successful legacy login: migrate the record immediately to the
        // current salt+hash format. This preserves the user's password while
        // fixing future logins permanently.
        if (!user.password_salt) {
          const salt = crypto.randomUUID();
          const hash = await hashPassword(String(password), salt);
          await env.DB.prepare('UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?').bind(hash, salt, user.id).run();
          user.password_hash = hash;
          user.password_salt = salt;
        }

        const token = makeSessionToken();
        return json({ ok: true, user: userResponse(user, token), token }, headers);
      }

      if (url.pathname === '/api/scores' && request.method === 'GET') {
        const userId = url.searchParams.get('userId');
        const rows = await env.DB.prepare('SELECT stage,score,total,created_at FROM scores WHERE user_id = ? ORDER BY created_at DESC').bind(userId).all();
        return json({ scores: rows.results }, headers);
      }

      if (url.pathname === '/api/scores' && request.method === 'POST') {
        const { userId, stage, score, total } = await request.json();
        await env.DB.prepare('INSERT INTO scores (user_id,stage,score,total,created_at) VALUES (?,?,?,?,?)').bind(userId, stage, score, total, now()).run();
        return json({ ok: true }, headers);
      }

      if (url.pathname === '/api/admin/stats' && request.method === 'POST') {
        const key = request.headers.get('x-admin-key') || '';
        if (!env.ADMIN_KEY) return json({ error: 'ADMIN_KEY is not configured on the Cloudflare Worker.' }, headers, 500);
        if (!key || key !== env.ADMIN_KEY) return json({ error: 'Incorrect admin key.' }, headers, 401);
        const users = await env.DB.prepare('SELECT id,name,username,created_at FROM users ORDER BY created_at DESC').all();
        const totals = await env.DB.prepare('SELECT COUNT(*) AS visits,COUNT(DISTINCT visitor_id) AS unique_visitors FROM visits').first();
        const periods = await env.DB.prepare("SELECT COUNT(DISTINCT CASE WHEN created_at>=datetime('now','-1 day') THEN visitor_id END) AS daily,COUNT(DISTINCT CASE WHEN created_at>=datetime('now','-7 day') THEN visitor_id END) AS weekly,COUNT(DISTINCT CASE WHEN created_at>=datetime('now','-30 day') THEN visitor_id END) AS monthly FROM visits").first();
        const visitorsByDay = await env.DB.prepare("SELECT date(created_at) AS day,COUNT(*) AS views,COUNT(DISTINCT visitor_id) AS visitors FROM visits WHERE created_at>=datetime('now','-30 day') GROUP BY date(created_at) ORDER BY day").all();
        const pages = await env.DB.prepare('SELECT path,COUNT(*) AS views,COUNT(DISTINCT visitor_id) AS visitors FROM visits GROUP BY path ORDER BY views DESC').all();
        const recent = await env.DB.prepare('SELECT path,created_at FROM visits ORDER BY created_at DESC LIMIT 100').all();
        const scores = await env.DB.prepare('SELECT u.username,u.name,s.stage,s.score,s.total,s.created_at FROM scores s JOIN users u ON u.id=s.user_id ORDER BY s.created_at DESC LIMIT 500').all();
        const active = await env.DB.prepare("SELECT COUNT(DISTINCT user_id) AS active_users FROM analytics_events WHERE user_id IS NOT NULL AND created_at>=datetime('now','-30 day')").first();
        const quizTotals = await env.DB.prepare("SELECT COUNT(*) AS quizzes,COALESCE(AVG(CASE WHEN total>0 THEN score*100.0/total END),0) AS average_score FROM scores").first();
        const difficulty = await env.DB.prepare("SELECT difficulty,COUNT(*) AS uses FROM analytics_events WHERE event_type='quiz_completed' AND difficulty IS NOT NULL GROUP BY difficulty ORDER BY uses DESC").all();
        const features = await env.DB.prepare("SELECT feature,COUNT(*) AS uses FROM analytics_events WHERE feature IS NOT NULL GROUP BY feature ORDER BY uses DESC").all();
        const missed = await env.DB.prepare("SELECT question,COUNT(*) AS misses FROM analytics_events WHERE event_type='question_result' AND correct=0 AND question IS NOT NULL GROUP BY question ORDER BY misses DESC LIMIT 15").all();
        const featurePeriod = await env.DB.prepare("SELECT feature,COUNT(*) AS uses FROM analytics_events WHERE feature IS NOT NULL AND created_at>=datetime('now','-30 day') GROUP BY feature ORDER BY uses DESC").all();
        await ensureLocationTable(env);
        const countries = await env.DB.prepare("SELECT COALESCE(NULLIF(country,''),'Unknown') AS country,COUNT(DISTINCT visitor_id) AS visitors,COUNT(*) AS views FROM visitor_locations GROUP BY COALESCE(NULLIF(country,''),'Unknown') ORDER BY visitors DESC,views DESC").all();
        const cities = await env.DB.prepare("SELECT COALESCE(NULLIF(city,''),'Unknown') AS city,COALESCE(NULLIF(country,''),'Unknown') AS country,COUNT(DISTINCT visitor_id) AS visitors,COUNT(*) AS views FROM visitor_locations GROUP BY COALESCE(NULLIF(city,''),'Unknown'),COALESCE(NULLIF(country,''),'Unknown') ORDER BY visitors DESC,views DESC").all();
        return json({ users: users.results, totals, periods, active_users: active.active_users, quiz_totals: quizTotals, difficulty: difficulty.results, features: features.results, featurePeriod: featurePeriod.results, missed: missed.results, visitorsByDay: visitorsByDay.results, pages: pages.results, recent: recent.results, scores: scores.results, countries: countries.results, cities: cities.results }, headers);
      }

      return json({ error: 'Not found' }, headers, 404);
    } catch (e) {
      console.error('API error', e);
      return json({ error: e?.message || 'Server error' }, headers, 500);
    }
  }
};

async function hashPassword(password, salt) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(salt + ':' + password));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

function json(data, headers, status = 200) {
  return new Response(JSON.stringify(data), { status, headers });
}
