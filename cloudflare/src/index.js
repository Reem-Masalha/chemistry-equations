const encoder = new TextEncoder();

const CORS = {
  "Content-Type": "application/json; charset=UTF-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
  "Access-Control-Max-Age": "86400",
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: CORS });

const now = () => new Date().toISOString();

function clean(value, max = 200) {
  return value == null ? null : String(value).trim().slice(0, max);
}

function token() {
  return crypto.randomUUID() + "." + crypto.randomUUID();
}

function safeEqual(a, b) {
  a = String(a ?? "");
  b = String(b ?? "");
  if (a.length !== b.length) return false;
  let n = 0;
  for (let i = 0; i < a.length; i++) n |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return n === 0;
}

async function sha256(value) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(String(value))
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256Hex(key, message) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(String(key)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(String(message))
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function modernHash(password, salt) {
  return sha256(String(salt) + ":" + String(password));
}

async function verifyPassword(password, user) {
  if (!user || !user.password_hash) return false;

  const stored = String(user.password_hash);

  // Current records: SHA-256(salt:password) with a separate password_salt.
  if (user.password_salt) {
    const hash = await modernHash(password, user.password_salt);
    return safeEqual(hash, stored);
  }

  // Legacy Werkzeug format: sha256$salt$hash.
  // Werkzeug's legacy sha256 method is HMAC-SHA256 with the salt as the key.
  if (stored.toLowerCase().startsWith("sha256$")) {
    const parts = stored.split("$");
    if (parts.length === 3) {
      const salt = parts[1];
      const expected = parts[2];

      if (/^[a-f0-9]{64}$/i.test(expected)) {
        const werkzeugHash = await hmacSha256Hex(salt, password);
        if (safeEqual(werkzeugHash, expected)) return true;

        // Compatibility with any custom SHA-256 records created before migration.
        const candidates = [
          await sha256(salt + password),
          await sha256(salt + ":" + password),
          await sha256(password + salt),
          await sha256(password + ":" + salt),
        ];
        if (candidates.some((x) => safeEqual(x, expected))) return true;
      }
    }
  }

  // Other legacy delimiter-based records.
  for (const sep of ["$", ":", "|", "."]) {
    const parts = stored.split(sep);
    if (parts.length === 2) {
      const [a, b] = parts;

      if (/^[a-f0-9]{64}$/i.test(b)) {
        const candidates = [
          await sha256(a + password),
          await sha256(a + ":" + password),
          await sha256(password + a),
          await sha256(password + ":" + a),
        ];
        if (candidates.some((x) => safeEqual(x, b))) return true;
      }

      if (/^[a-f0-9]{64}$/i.test(a)) {
        const candidates = [
          await sha256(b + password),
          await sha256(b + ":" + password),
          await sha256(password + b),
          await sha256(password + ":" + b),
        ];
        if (candidates.some((x) => safeEqual(x, a))) return true;
      }
    }
  }

  return safeEqual(await sha256(password), stored);
}

function geo(request) {
  const cf = request.cf || {};
  return {
    country: clean(cf.country, 10),
    region: clean(cf.region, 120),
    city: clean(cf.city, 120),
    timezone: clean(cf.timezone, 120),
    continent: clean(cf.continent, 10),
  };
}

async function ensureLocationTable(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS visitor_locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_id TEXT NOT NULL,
      path TEXT NOT NULL,
      country TEXT,
      region TEXT,
      city TEXT,
      timezone TEXT,
      continent TEXT,
      created_at TEXT NOT NULL
    )
  `).run();
}

async function trackVisit(request, env) {
  const body = await request.json();
  const visitorId = clean(body?.visitorId, 200);
  const path = clean(body?.path, 200);

  if (!visitorId || !path) {
    return json({ error: "visitorId and path are required." }, 400);
  }

  const existing = await env.DB.prepare(`
    SELECT id FROM visits
    WHERE visitor_id = ? AND path = ?
      AND created_at >= datetime('now', '-30 minutes')
    LIMIT 1
  `).bind(visitorId, path).first();

  if (existing) return json({ ok: true, counted: false });

  const created = now();

  await env.DB.prepare(`
    INSERT INTO visits (visitor_id, path, created_at)
    VALUES (?, ?, ?)
  `).bind(visitorId, path, created).run();

  await ensureLocationTable(env);
  const loc = geo(request);

  await env.DB.prepare(`
    INSERT INTO visitor_locations
      (visitor_id, path, country, region, city, timezone, continent, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    visitorId, path, loc.country, loc.region, loc.city,
    loc.timezone, loc.continent, created
  ).run();

  return json({ ok: true, counted: true });
}

async function signIn(env, body) {
  const username = clean(body?.username, 120)?.toLowerCase();
  const password = String(body?.password ?? "");

  if (!username || !password) {
    return json({ error: "Username and password are required." }, 400);
  }

  const user = await env.DB.prepare(`
    SELECT id, name, username, password_hash, password_salt
    FROM users WHERE username = ? LIMIT 1
  `).bind(username).first();

  if (!(await verifyPassword(password, user))) {
    return json({ error: "Incorrect username or password." }, 401);
  }

  // Convert a verified legacy password to the current format.
  if (!user.password_salt) {
    const salt = crypto.randomUUID();
    const hash = await modernHash(password, salt);
    await env.DB.prepare(`
      UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?
    `).bind(hash, salt, user.id).run();
  }

  const sessionToken = token();
  return json({
    ok: true,
    token: sessionToken,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      token: sessionToken,
    },
  });
}

async function createAccount(env, body) {
  const name = clean(body?.name, 120);
  const username = clean(body?.username, 120)?.toLowerCase();
  const password = String(body?.password ?? "");

  if (!name || !username || !password) {
    return json({ error: "Name, username and password are required." }, 400);
  }
  if (password.length < 8) {
    return json({ error: "Password must be at least 8 characters." }, 400);
  }

  const exists = await env.DB.prepare(
    `SELECT id FROM users WHERE username = ? LIMIT 1`
  ).bind(username).first();

  if (exists) return json({ error: "Username already exists." }, 409);

  const id = crypto.randomUUID();
  const salt = crypto.randomUUID();
  const hash = await modernHash(password, salt);

  await env.DB.prepare(`
    INSERT INTO users (id,name,username,password_hash,password_salt,created_at)
    VALUES (?,?,?,?,?,?)
  `).bind(id, name, username, hash, salt, now()).run();

  const sessionToken = token();
  return json({
    ok: true,
    token: sessionToken,
    user: { id, name, username, token: sessionToken },
  });
}

async function setPassword(env, body) {
  const username = clean(body?.username, 120)?.toLowerCase();
  const password = String(body?.password ?? "");
  const confirmPassword = String(body?.confirmPassword ?? "");

  if (!username) return json({ error: "Username is required." }, 400);
  if (password.length < 8) return json({ error: "Password must be at least 8 characters." }, 400);
  if (password !== confirmPassword) return json({ error: "Passwords do not match." }, 400);

  const user = await env.DB.prepare(`
    SELECT id,name,username FROM users WHERE username = ? LIMIT 1
  `).bind(username).first();

  if (!user) return json({ error: "No existing account was found with that username." }, 404);

  const salt = crypto.randomUUID();
  const hash = await modernHash(password, salt);

  await env.DB.prepare(`
    UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?
  `).bind(hash, salt, user.id).run();

  const sessionToken = token();
  return json({
    ok: true,
    token: sessionToken,
    user: { id: user.id, name: user.name, username: user.username, token: sessionToken },
  });
}

async function stats(env, request) {
  const adminKey = request.headers.get("X-Admin-Key") || "";
  if (!env.ADMIN_KEY) return json({ error: "ADMIN_KEY is not configured." }, 500);
  if (!safeEqual(adminKey, env.ADMIN_KEY)) return json({ error: "Incorrect admin key." }, 401);

  await ensureLocationTable(env);

  const [users, totals, periods, pages, visitorsByDay, scores, countries, cities, recent] = await Promise.all([
    env.DB.prepare(`SELECT id,name,username,created_at FROM users ORDER BY created_at DESC`).all(),
    env.DB.prepare(`SELECT COUNT(*) AS visits, COUNT(DISTINCT visitor_id) AS unique_visitors FROM visits`).first(),
    env.DB.prepare(`SELECT COUNT(DISTINCT CASE WHEN created_at>=datetime('now','-1 day') THEN visitor_id END) AS daily,COUNT(DISTINCT CASE WHEN created_at>=datetime('now','-7 day') THEN visitor_id END) AS weekly,COUNT(DISTINCT CASE WHEN created_at>=datetime('now','-30 day') THEN visitor_id END) AS monthly FROM visits`).first(),
    env.DB.prepare(`SELECT path,COUNT(*) AS views,COUNT(DISTINCT visitor_id) AS visitors FROM visits GROUP BY path ORDER BY views DESC`).all(),
    env.DB.prepare(`SELECT date(created_at) AS day,COUNT(*) AS views,COUNT(DISTINCT visitor_id) AS visitors FROM visits WHERE created_at>=datetime('now','-30 day') GROUP BY date(created_at) ORDER BY day`).all(),
    env.DB.prepare(`SELECT u.username,u.name,s.stage,s.score,s.total,s.created_at FROM scores s JOIN users u ON u.id=s.user_id ORDER BY s.created_at DESC LIMIT 500`).all(),
    env.DB.prepare(`SELECT COALESCE(NULLIF(country,''),'Unknown') AS country,COUNT(DISTINCT visitor_id) AS visitors,COUNT(*) AS views FROM visitor_locations GROUP BY COALESCE(NULLIF(country,''),'Unknown') ORDER BY visitors DESC,views DESC`).all(),
    env.DB.prepare(`SELECT COALESCE(NULLIF(city,''),'Unknown') AS city,COALESCE(NULLIF(country,''),'Unknown') AS country,COUNT(DISTINCT visitor_id) AS visitors,COUNT(*) AS views FROM visitor_locations GROUP BY COALESCE(NULLIF(city,''),'Unknown'),COALESCE(NULLIF(country,''),'Unknown') ORDER BY visitors DESC,views DESC`).all(),
    env.DB.prepare(`SELECT path,created_at FROM visits ORDER BY created_at DESC LIMIT 100`).all(),
  ]);

  return json({
    users: users.results,
    totals,
    periods,
    pages: pages.results,
    visitorsByDay: visitorsByDay.results,
    scores: scores.results,
    recent: recent.results,
    countries: countries.results,
    cities: cities.results,
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    const url = new URL(request.url);

    try {
      if (url.pathname === "/health" && request.method === "GET") return json({ ok: true });
      if (url.pathname === "/api/track-visit" && request.method === "POST") return await trackVisit(request, env);
      if (url.pathname === "/api/create-account" && request.method === "POST") return await createAccount(env, await request.json());
      if (url.pathname === "/api/sign-in" && request.method === "POST") return await signIn(env, await request.json());
      if (url.pathname === "/api/set-password" && request.method === "POST") return await setPassword(env, await request.json());

      if (url.pathname === "/api/track-event" && request.method === "POST") {
        const p = await request.json();
        if (!p?.eventType) return json({ error: "eventType is required." }, 400);
        await env.DB.prepare(`
          INSERT INTO analytics_events
            (visitor_id,user_id,event_type,feature,difficulty,question,correct,score,total,metadata,created_at)
          VALUES (?,?,?,?,?,?,?,?,?,?,?)
        `).bind(
          clean(p.visitorId,200), clean(p.userId,200), clean(p.eventType,120),
          clean(p.feature,120), clean(p.difficulty,120), clean(p.question,500),
          p.correct == null ? null : (p.correct ? 1 : 0),
          p.score == null ? null : Number(p.score),
          p.total == null ? null : Number(p.total),
          p.metadata == null ? null : JSON.stringify(p.metadata), now()
        ).run();
        return json({ ok: true });
      }

      if (url.pathname === "/api/scores" && request.method === "GET") {
        const userId = url.searchParams.get("userId");
        if (!userId) return json({ scores: [] });
        const rows = await env.DB.prepare(`SELECT stage,score,total,created_at FROM scores WHERE user_id=? ORDER BY created_at DESC`).bind(userId).all();
        return json({ scores: rows.results });
      }

      if (url.pathname === "/api/scores" && request.method === "POST") {
        const p = await request.json();
        await env.DB.prepare(`INSERT INTO scores (user_id,stage,score,total,created_at) VALUES (?,?,?,?,?)`).bind(clean(p.userId,200),clean(p.stage,120),Number(p.score),Number(p.total),now()).run();
        return json({ ok: true });
      }

      if (url.pathname === "/api/admin/stats" && request.method === "POST") return await stats(env, request);

      return json({ error: "Not found" }, 404);
    } catch (error) {
      console.error("Worker error:", error);
      return json({ error: error?.message || "Internal Worker error" }, 500);
    }
  }
};
