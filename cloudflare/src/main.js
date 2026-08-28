import original from './index.js';

const CORS = {
  "Content-Type": "application/json; charset=UTF-8",
  "Access-Control-Allow-Origin": "https://reem-masalha.github.io",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
  "Access-Control-Max-Age": "86400",
};

const clean = (v, max = 200) => v == null ? null : String(v).trim().slice(0, max);
const json = (d, status = 200) => new Response(JSON.stringify(d), { status, headers: CORS });

async function captureLocation(request, env) {
  const body = await request.clone().json().catch(() => ({}));
  const visitorId = clean(body?.visitorId || body?.userId, 200);
  if (!visitorId || !env?.DB) return;

  const cf = request.cf || {};
  const country = clean(cf.country || request.headers.get('CF-IPCountry'), 64);
  const city = clean(cf.city || request.headers.get('CF-IPCity') || request.headers.get('X-Geo-City'), 120);
  const region = clean(cf.region || request.headers.get('X-Geo-Region'), 120);
  const timezone = clean(cf.timezone, 120);
  const continent = clean(cf.continent, 32);
  if (!country && !city && !region) return;

  const path = clean(body?.path || new URL(request.url).pathname, 200) || '/';
  const created = new Date().toISOString();

  try {
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

    const existing = await env.DB.prepare(`
      SELECT id FROM visitor_locations
      WHERE visitor_id=? AND path=? AND created_at>=datetime('now','-30 minutes')
      LIMIT 1
    `).bind(visitorId, path).first();

    if (!existing) {
      await env.DB.prepare(`
        INSERT INTO visitor_locations
          (visitor_id,path,country,region,city,timezone,continent,created_at)
        VALUES (?,?,?,?,?,?,?,?)
      `).bind(visitorId, path, country, region, city, timezone, continent, created).run();
    } else {
      await env.DB.prepare(`
        UPDATE visitor_locations
        SET country=COALESCE(NULLIF(?,''),country),
            region=COALESCE(NULLIF(?,''),region),
            city=COALESCE(NULLIF(?,''),city),
            timezone=COALESCE(NULLIF(?,''),timezone),
            continent=COALESCE(NULLIF(?,''),continent)
        WHERE id=?
      `).bind(country || '', region || '', city || '', timezone || '', continent || '', existing.id).run();
    }
  } catch (e) {
    console.error('Location capture failed:', e);
  }
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

    const path = new URL(request.url).pathname;
    if ((path === '/api/track-event' || path === '/api/track-visit') && request.method === 'POST') {
      await captureLocation(request, env);
    }

    return original.fetch(request, env, ctx);
  }
};
