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

function safeEqual(a, b) {
  a = String(a ?? '').toLowerCase();
  b = String(b ?? '').toLowerCase();
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

async function sha256Bytes(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(String(value)));
  return new Uint8Array(digest);
}

async function sha256Hex(value) {
  const bytes = await sha256Bytes(value);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
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
  if (!stored.toLowerCase().startsWith('sha256$')) return false;

  const parts = stored.split('$');
  if (parts.length !== 3) return false;

  const salt = parts[1];
  const expected = parts[2].trim().toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(expected)) return false;

  const passwordExact = String(password);
  const passwordTrim = passwordExact.trim();
  const passwordLower = passwordExact.toLowerCase();
  const username = String(user.username || '');

  const candidates = new Set();
  const addHash = async (text) => candidates.add((await sha256Hex(text)).toLowerCase());

  // Common legacy salted SHA-256 constructions.
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

  for (const value of values) await addHash(value);

  // Common double-hash constructions.
  const pHash = await sha256Hex(passwordExact);
  const pTrimHash = await sha256Hex(passwordTrim);
  const combinations = [
    salt + pHash,
    pHash + salt,
    salt + ':' + pHash,
    pHash + ':' + salt,
    salt + pTrimHash,
    pTrimHash + salt,
    sha256Hex(salt + passwordExact),
  ];

  for (const value of combinations) {
    const resolved = value instanceof Promise ? await value : value;
    candidates.add((await sha256Hex(resolved)).toLowerCase());
    if (safeEqual(resolved, expected)) return true;
  }

  if (candidates.has(expected)) return true;

  // A few practical PBKDF2-SHA256 iteration counts used by older systems.
  for (const iterations of [1000, 2000, 5000, 10000, 20000]) {
    const hashes = [
      await pbkdf2Hex(passwordExact, salt, iterations),
      await pbkdf2Hex(passwordTrim, salt, iterations),
    ];
    if (hashes.some(h => safeEqual(h, expected))) return true;
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

  if (user.password_salt) {
    const expected = await sha256Hex(String(user.password_salt) + ':' + password);
    ok = safeEqual(expected, user.password_hash);
  } else {
    ok = await legacyMatch(password, user);
  }

  if (!ok) {
    return json({ error: 'Incorrect username or password.' }, 401);
  }

  // Upgrade only after the password has been successfully verified.
  const salt = crypto.randomUUID();
  const hash = await sha256Hex(salt + ':' + password);
  await env.DB.prepare(`
    UPDATE users
    SET password_hash = ?, password_salt = ?
    WHERE id = ?
  `).bind(hash, salt, user.id).run();

  const token = crypto.randomUUID() + '.' + crypto.randomUUID();
  const safeUser = {
    id: user.id,
    name: user.name,
    username: user.username,
    token,
  };

  return json({ ok: true, token, user: safeUser });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
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
