import original from './index.js';

const encoder = new TextEncoder();

const CORS = {
  "Content-Type": "application/json; charset=UTF-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
  "Access-Control-Max-Age": "86400",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS });
}

async function createSession(env, userId) {
  const token = crypto.randomUUID() + '.' + crypto.randomUUID();
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const tokenHash = await sha256Hex(token);
  await env.DB.prepare(
    'INSERT INTO sessions (id,user_id,token_hash,created_at,expires_at) VALUES (?,?,?,?,?)'
  ).bind(crypto.randomUUID(), String(userId), tokenHash, now.toISOString(), expires.toISOString()).run();
  return token;
}

async function authenticatedUser(request, env) {
  const header = request.headers.get('authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const tokenHash = await sha256Hex(match[1].trim());
  return env.DB.prepare(
    'SELECT u.id,u.name,u.username,s.id AS session_id FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? LIMIT 1'
  ).bind(tokenHash, new Date().toISOString()).first();
}

async function signOut(request, env, all = false) {
  const user = await authenticatedUser(request, env);
  const header = request.headers.get('authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!user || !match) return json({ error: 'Please sign in again.' }, 401);
  if (all) {
    await env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(user.id).run();
  } else {
    await env.DB.prepare('DELETE FROM sessions WHERE id=?').bind(user.session_id).run();
  }
  return json({ ok: true });
}

async function handleProgress(request, env, method) {
  const user = await authenticatedUser(request, env);
  if (!user) return json({ error: 'Please sign in again to sync your progress.' }, 401);
  if (method === 'GET') {
    const row = await env.DB.prepare('SELECT progress_json,updated_at FROM user_progress WHERE user_id=?').bind(user.id).first();
    let progress = null;
    if (row?.progress_json) {
      try { progress = JSON.parse(row.progress_json); } catch { progress = null; }
    }
    return json({ ok: true, progress, updatedAt: row?.updated_at || null });
  }
  const body = await request.json().catch(() => ({}));
  const progress = body?.progress;
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) {
    return json({ error: 'A valid progress object is required.' }, 400);
  }
  const serialized = JSON.stringify(progress);
  if (serialized.length > 100000) return json({ error: 'Progress data is too large.' }, 413);
  const updatedAt = new Date().toISOString();
  await env.DB.prepare(
    'INSERT INTO user_progress (user_id,progress_json,updated_at) VALUES (?,?,?) ON CONFLICT(user_id) DO UPDATE SET progress_json=excluded.progress_json,updated_at=excluded.updated_at'
  ).bind(user.id, serialized, updatedAt).run();
  return json({ ok: true, updatedAt });
}

async function handleScores(request, env, method) {
  const user = await authenticatedUser(request, env);
  if (!user) return json({ error: 'Please sign in to access account scores.' }, 401);
  if (method === 'GET') {
    const rows = await env.DB.prepare('SELECT stage,score,total,created_at FROM scores WHERE user_id=? ORDER BY created_at DESC').bind(user.id).all();
    return json({ scores: rows.results || [] });
  }
  const body = await request.json().catch(() => ({}));
  const stage = String(body.stage || '').slice(0,80);
  const score = Number(body.score), total = Number(body.total);
  if (!stage || !Number.isFinite(score) || !Number.isInteger(total) || total < 1 || score < 0 || score > total) {
    return json({ error: 'A valid stage, score, and total are required.' }, 400);
  }
  await env.DB.prepare('INSERT INTO scores (user_id,stage,score,total,created_at) VALUES (?,?,?,?,?)').bind(user.id,stage,score,total,new Date().toISOString()).run();
  return json({ ok: true });
}

function safeEqual(a, b) {
  a = String(a ?? '').toLowerCase();
  b = String(b ?? '').toLowerCase();
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(String(value)));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSha256Hex(key, value) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(String(key)),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(String(value)));
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function pbkdf2Hex(password, salt, iterations) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(String(password)),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(String(salt)), iterations },
    key,
    256
  );
  return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function legacyMatch(password, user) {
  if (!user?.password_hash) return false;
  const stored = String(user.password_hash).trim();

  // Older accounts use PBKDF2-SHA256 encoded as
  // scheme$iterations$salt$hex_digest. Support both observed legacy
  // schemes, using the salt embedded in the encoded hash.
  const pbkdfParts = stored.split('$');
  if (
    pbkdfParts.length === 4 &&
    ['pbkdf2', 'pbkdf2_sha256'].includes(pbkdfParts[0].toLowerCase()) &&
    /^\d+$/.test(pbkdfParts[1]) &&
    pbkdfParts[2].length > 0 &&
    /^[a-f0-9]{64}$/i.test(pbkdfParts[3])
  ) {
    const iterations = Number(pbkdfParts[1]);
    if (Number.isSafeInteger(iterations) && iterations >= 1 && iterations <= 1000000) {
      const embeddedSalt = pbkdfParts[2];
      const expectedPbkdf = pbkdfParts[3].toLowerCase();
      const exactPassword = String(password);
      const trimmedPassword = exactPassword.trim();
      if (safeEqual(await pbkdf2Hex(exactPassword, embeddedSalt, iterations), expectedPbkdf)) return true;
      if (trimmedPassword !== exactPassword &&
          safeEqual(await pbkdf2Hex(trimmedPassword, embeddedSalt, iterations), expectedPbkdf)) return true;
    }
    return false;
  }

  const parts = stored.split('$');
  if (parts.length !== 3) return false;

  const salt = parts[1];
  const expected = parts[2].trim().toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(expected)) return false;

  const passwordExact = String(password);
  const passwordTrim = passwordExact.trim();
  const passwordLower = passwordExact.toLowerCase();
  const username = String(user.username || '');

  // Exact legacy Werkzeug sha256$salt$hash format.
  const werkzeug = await hmacSha256Hex(salt, passwordExact);
  if (safeEqual(werkzeug, expected)) return true;

  // Also support the less-common reversed HMAC convention.
  if (safeEqual(await hmacSha256Hex(passwordExact, salt), expected)) return true;
  if (passwordTrim !== passwordExact && safeEqual(await hmacSha256Hex(salt, passwordTrim), expected)) return true;
  if (passwordLower !== passwordExact && safeEqual(await hmacSha256Hex(salt, passwordLower), expected)) return true;

  // Compatibility with salted SHA-256 variants.
  const values = [
    salt + passwordExact,
    passwordExact + salt,
    salt + ':' + passwordExact,
    passwordExact + ':' + salt,
    salt + '$' + passwordExact,
    passwordExact + '$' + salt,
    salt + '|' + passwordExact,
    passwordExact + '|' + salt,
    salt + '.' + passwordExact,
    passwordExact + '.' + salt,
    salt + '-' + passwordExact,
    passwordExact + '-' + salt,
    salt + '_' + passwordExact,
    passwordExact + '_' + salt,
    salt + username + passwordExact,
    username + salt + passwordExact,
    username + ':' + salt + ':' + passwordExact,
    salt + ':' + username + ':' + passwordExact,
    passwordExact + ':' + username + ':' + salt,
    username + ':' + passwordExact + ':' + salt,
    salt + passwordTrim,
    passwordTrim + salt,
    salt + ':' + passwordTrim,
    passwordTrim + ':' + salt,
    salt + passwordLower,
    passwordLower + salt,
    salt + ':' + passwordLower,
    passwordLower + ':' + salt,
  ];

  for (const value of values) {
    if (safeEqual(await sha256Hex(value), expected)) return true;
  }

  // Double-hash variants.
  const pHash = await sha256Hex(passwordExact);
  const pTrimHash = await sha256Hex(passwordTrim);
  const doubleValues = [
    salt + pHash,
    pHash + salt,
    salt + ':' + pHash,
    pHash + ':' + salt,
    salt + pTrimHash,
    pTrimHash + salt,
  ];

  for (const value of doubleValues) {
    if (safeEqual(await sha256Hex(value), expected)) return true;
  }

  // Legacy PBKDF2-SHA256 variants.
  for (const iterations of [1000, 2000, 5000, 10000, 20000, 60000, 80000, 150000, 260000]) {
    if (safeEqual(await pbkdf2Hex(passwordExact, salt, iterations), expected)) return true;
    if (passwordTrim !== passwordExact && safeEqual(await pbkdf2Hex(passwordTrim, salt, iterations), expected)) return true;
  }

  return false;
}

async function signInLegacy(request, env) {
  const body = await request.json().catch(() => ({}));
  const username = String(body?.username ?? '').trim().toLowerCase();
  const password = String(body?.password ?? '');

  if (!username || !password) {
    return json({ error: 'Username and password are required.' }, 400);
  }

  const user = await env.DB.prepare(`
    SELECT id,name,username,password_hash,password_salt
    FROM users
    WHERE username = ?
    LIMIT 1
  `).bind(username).first();

  if (!user) {
    return json({ error: 'Incorrect username or password.' }, 401);
  }

  let ok = false;

  // First verify the current salted-SHA256 format. If that fails, try the
  // legacy encoded formats even when password_salt is populated: older
  // PBKDF2 accounts may have both an embedded salt and a separate column.
  if (user.password_salt) {
    const expected = await sha256Hex(String(user.password_salt) + ':' + password);
    ok = safeEqual(expected, user.password_hash);
  }

  if (!ok) {
    ok = await legacyMatch(password, user);
  }

  if (!ok) {
    return json({ error: 'Incorrect username or password.' }, 401);
  }

  // Upgrade only after successful verification.
  const salt = crypto.randomUUID();
  const hash = await sha256Hex(salt + ':' + password);

  await env.DB.prepare(`
    UPDATE users
    SET password_hash = ?, password_salt = ?
    WHERE id = ?
  `).bind(hash, salt, user.id).run();

  const sessionToken = await createSession(env, user.id);
  const safeUser = {
    id: user.id,
    name: user.name,
    username: user.username,
    token: sessionToken,
  };

  return json({ ok: true, token: sessionToken, user: safeUser });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (url.pathname === '/api/create-account' && request.method === 'POST') {
      try {
        const response = await original.fetch(request.clone(), env, ctx);
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.user?.id) return json(data, response.status);
        const token = await createSession(env, data.user.id);
        data.token = token;
        data.user = { ...data.user, token };
        return json(data, response.status);
      } catch (e) {
        console.error('Account creation/session error:', e);
        return json({ error: 'Could not create a secure account session. You can try signing in.' }, 500);
      }
    }

    if (url.pathname === '/api/progress' && (request.method === 'GET' || request.method === 'POST')) {
      try { return await handleProgress(request, env, request.method); }
      catch (e) { console.error('Progress sync error:', e); return json({ error: 'Could not sync learning progress.' }, 500); }
    }

    if (url.pathname === '/api/scores' && (request.method === 'GET' || request.method === 'POST')) {
      try { return await handleScores(request, env, request.method); }
      catch (e) { console.error('Score access error:', e); return json({ error: 'Could not access account scores.' }, 500); }
    }

    if (url.pathname === '/api/sign-out' && request.method === 'POST') {
      try { return await signOut(request, env, false); }
      catch (e) { console.error('Sign-out error:', e); return json({ error: 'Could not sign out.' }, 500); }
    }

    if (url.pathname === '/api/sign-out-all' && request.method === 'POST') {
      try { return await signOut(request, env, true); }
      catch (e) { console.error('Sign-out-all error:', e); return json({ error: 'Could not sign out all sessions.' }, 500); }
    }

    if (url.pathname === '/api/sign-in' && request.method === 'POST') {
      try {
        return await signInLegacy(request, env);
      } catch (e) {
        console.error('Legacy sign-in error:', e);
        return json({ error: 'Sign-in service error.' }, 500);
      }
    }

    return original.fetch(request, env, ctx);
  },
};

