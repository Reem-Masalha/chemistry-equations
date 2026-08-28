const encoder = new TextEncoder();

const CORS = {
  "Content-Type": "application/json; charset=UTF-8",
  "Access-Control-Allow-Origin": "https://reem-masalha.github.io",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
  "Access-Control-Max-Age": "86400",
};

const PBKDF2_ITERATIONS = 100000;

const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: CORS });
const now = () => new Date().toISOString();
function clean(value, max = 200) { return value == null ? null : String(value).trim().slice(0, max); }
function newToken() { return crypto.randomUUID() + "." + crypto.randomUUID(); }
function safeEqual(a, b) { a=String(a??""); b=String(b??""); if(a.length!==b.length)return false; let d=0; for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i); return d===0; }
function hex(bytes) { return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2,"0")).join(""); }

async function pbkdf2Hex(password, salt, iterations = PBKDF2_ITERATIONS) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(String(password)), {name:"PBKDF2"}, false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({name:"PBKDF2", salt:encoder.encode(String(salt)), iterations, hash:"SHA-256"}, key, 256);
  return hex(bits);
}
async function sha256Hex(value) { return hex(await crypto.subtle.digest("SHA-256", encoder.encode(String(value)))); }
async function hashPassword(password) {
  const salt = crypto.randomUUID();
  const hash = await pbkdf2Hex(password, salt, PBKDF2_ITERATIONS);
  return {salt, hash, stored:`pbkdf2_sha256$${PBKDF2_ITERATIONS}$${salt}$${hash}`};
}

async function verifyPassword(password, user) {
  if (!user?.password_hash) return false;
  const stored = String(user.password_hash).trim();
  if (stored.startsWith("pbkdf2_sha256$")) {
    const parts=stored.split("$");
    if(parts.length===4){
      const iterations=Number(parts[1]), salt=parts[2], expected=parts[3];
      if(Number.isInteger(iterations)&&iterations>=10000&&iterations<=PBKDF2_ITERATIONS&&/^[a-f0-9]{64}$/i.test(expected)){
        return safeEqual(await pbkdf2Hex(password,salt,iterations),expected);
      }
    }
    return false;
  }
  if(stored.toLowerCase().startsWith("sha256$")&&!user.password_salt){
    const parts=stored.split("$");
    if(parts.length===3){
      const salt=parts[1], expected=parts[2].toLowerCase();
      if(/^[a-f0-9]{64}$/.test(expected)){
        const candidates=[
          await sha256Hex(salt+String(password)),
          await sha256Hex(String(password)+salt),
          await sha256Hex(salt+":"+String(password)),
          await sha256Hex(String(password)+":"+salt),
          await sha256Hex(salt+"$"+String(password)),
          await sha256Hex(String(password)+"$"+salt),
          await sha256Hex(salt+"|"+String(password)),
          await sha256Hex(String(password)+"|"+salt)
        ];
        if(candidates.some(x=>safeEqual(x,expected)))return true;
        const key=await crypto.subtle.importKey("raw",encoder.encode(salt),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
        if(safeEqual(hex(await crypto.subtle.sign("HMAC",key,encoder.encode(String(password)))),expected))return true;
      }
    }
  }
  if(user.password_salt){
    const salt=String(user.password_salt);
    const candidates=[await sha256Hex(salt+String(password)),await sha256Hex(String(password)+salt),await sha256Hex(salt+":"+String(password)),await sha256Hex(String(password)+":"+salt)];
    if(candidates.some(x=>safeEqual(x,stored)))return true;
  }
  return safeEqual(await sha256Hex(password),stored);
}

async function getUser(env, username){return env.DB.prepare(`SELECT id,name,username,password_hash,password_salt,recovery_code_hash,recovery_code_expires_at,recovery_email FROM users WHERE username=? LIMIT 1`).bind(String(username).trim().toLowerCase()).first();}

async function signIn(env, body){
  const username=clean(body?.username,120)?.toLowerCase(), password=String(body?.password??"");
  if(!username||!password)return json({error:"Username and password are required."},400);
  const user=await getUser(env,username);
  if(!user||!(await verifyPassword(password,user)))return json({error:"Incorrect username or password."},401);
  if(!String(user.password_hash).startsWith("pbkdf2_sha256$")){const p=await hashPassword(password);await env.DB.prepare(`UPDATE users SET password_hash=?,password_salt=? WHERE id=?`).bind(p.stored,p.salt,user.id).run();}
  const token=newToken(); return json({ok:true,token,user:{id:user.id,name:user.name,username:user.username,token}});
}

async function createAccount(env,body){
  const name=clean(body?.name,120), username=clean(body?.username,120)?.toLowerCase(), password=String(body?.password??"");
  if(!name||!username||!password)return json({error:"Name, username and password are required."},400);
  if(password.length<8)return json({error:"Password must be at least 8 characters."},400);
  if(await getUser(env,username))return json({error:"Username already exists."},409);
  const id=crypto.randomUUID(), p=await hashPassword(password);
  await env.DB.prepare(`INSERT INTO users (id,name,username,password_hash,password_salt,created_at) VALUES (?,?,?,?,?,?)`).bind(id,name,username,p.stored,p.salt,now()).run();
  const token=newToken(); return json({ok:true,token,user:{id,name,username,token}});
}

async function setPassword(env,body){
  const username=clean(body?.username,120)?.toLowerCase(), password=String(body?.password??""), confirm=String(body?.confirmPassword??"");
  if(!username)return json({error:"Username is required."},400);
  if(password.length<8)return json({error:"Password must be at least 8 characters."},400);
  if(password!==confirm)return json({error:"Passwords do not match."},400);
  const user=await getUser(env,username);
  if(!user)return json({error:"No existing account was found with that username."},404);
  if(user.password_hash&&user.password_salt)return json({error:"This account already has a password. Please use Sign in or password recovery."},409);
  const p=await hashPassword(password);
  await env.DB.prepare(`UPDATE users SET password_hash=?,password_salt=? WHERE id=?`).bind(p.stored,p.salt,user.id).run();
  const token=newToken(); return json({ok:true,token,user:{id:user.id,name:user.name,username:user.username,token}});
}

async function changePassword(env,request,body){
  const auth=String(request.headers.get("Authorization")||""), current=auth.startsWith("Bearer ")?auth.slice(7):"";
  const username=clean(body?.username,120)?.toLowerCase(), oldPassword=String(body?.currentPassword??""), newPassword=String(body?.newPassword??""), confirm=String(body?.confirmPassword??"");
  if(!current||!username||!oldPassword||!newPassword)return json({error:"Missing required account information."},400);
  if(newPassword.length<8)return json({error:"Password must be at least 8 characters."},400);
  if(newPassword!==confirm)return json({error:"Passwords do not match."},400);
  const user=await getUser(env,username);
  if(!user||!(await verifyPassword(oldPassword,user)))return json({error:"Current password is incorrect."},401);
  const p=await hashPassword(newPassword);
  await env.DB.prepare(`UPDATE users SET password_hash=?,password_salt=? WHERE id=?`).bind(p.stored,p.salt,user.id).run();
  return json({ok:true,token:current,user:{id:user.id,name:user.name,username:user.username,token:current}});
}

async function adminResetPassword(env,request,body){
  const supplied=String(request.headers.get("X-Admin-Key")||""), configured=String(env.ADMIN_KEY||"");
  if(!configured||!safeEqual(supplied,configured))return json({error:"Unauthorized."},401);
  const username=clean(body?.username,120)?.toLowerCase(), password=String(body?.newPassword??"");
  if(!username||password.length<8)return json({error:"Username and a password of at least 8 characters are required."},400);
  const user=await getUser(env,username); if(!user)return json({error:"Account not found."},404);
  const p=await hashPassword(password);
  await env.DB.prepare(`UPDATE users SET password_hash=?,password_salt=? WHERE id=?`).bind(p.stored,p.salt,user.id).run();
  return json({ok:true,message:"Password repaired successfully. The account and scores were preserved."});
}

function geo(request){const cf=request.cf||{};return{country:clean(cf.country,10),region:clean(cf.region,120),city:clean(cf.city,120),timezone:clean(cf.timezone,120),continent:clean(cf.continent,10)};}
async function ensureLocationTable(env){await env.DB.prepare(`CREATE TABLE IF NOT EXISTS visitor_locations (id INTEGER PRIMARY KEY AUTOINCREMENT,visitor_id TEXT NOT NULL,path TEXT NOT NULL,country TEXT,region TEXT,city TEXT,timezone TEXT,continent TEXT,created_at TEXT NOT NULL)`).run();}
async function trackVisit(request,env){
  const body=await request.json().catch(()=>({})), visitorId=clean(body?.visitorId,200), path=clean(body?.path,200); if(!visitorId||!path)return json({error:"visitorId and path are required."},400);
  const existing=await env.DB.prepare(`SELECT id FROM visits WHERE visitor_id=? AND path=? AND created_at>=datetime('now','-30 minutes') LIMIT 1`).bind(visitorId,path).first(); if(existing)return json({ok:true,counted:false});
  const created=now(); await env.DB.prepare(`INSERT INTO visits (visitor_id,path,created_at) VALUES (?,?,?)`).bind(visitorId,path,created).run(); await ensureLocationTable(env); const g=geo(request);
  await env.DB.prepare(`INSERT INTO visitor_locations (visitor_id,path,country,region,city,timezone,continent,created_at) VALUES (?,?,?,?,?,?,?,?)`).bind(visitorId,path,g.country,g.region,g.city,g.timezone,g.continent,created).run(); return json({ok:true,counted:true});
}
async function trackEvent(request,env){
  const p=await request.json().catch(()=>({})); if(!p?.eventType)return json({error:"eventType is required."},400);
  await env.DB.prepare(`INSERT INTO analytics_events (visitor_id,user_id,event_type,feature,difficulty,question,correct,score,total,metadata,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(clean(p.visitorId,200),clean(p.userId,200),clean(p.eventType,120),clean(p.feature,120),clean(p.difficulty,120),clean(p.question,500),p.correct==null?null:(p.correct?1:0),p.score==null?null:Number(p.score),p.total==null?null:Number(p.total),p.metadata==null?null:JSON.stringify(p.metadata),now()).run(); return json({ok:true});
}
async function stats(env,request){
  const key=String(request.headers.get("X-Admin-Key")||""); if(!env.ADMIN_KEY||!safeEqual(key,env.ADMIN_KEY))return json({error:"Unauthorized."},401); await ensureLocationTable(env);
  const [users,totals,periods,pages,days,scores,countries,cities]=await Promise.all([
    env.DB.prepare(`SELECT id,name,username,created_at FROM users ORDER BY created_at DESC`).all(),
    env.DB.prepare(`SELECT COUNT(*) AS visits,COUNT(DISTINCT visitor_id) AS unique_visitors FROM visits`).first(),
    env.DB.prepare(`SELECT COUNT(DISTINCT CASE WHEN created_at>=datetime('now','-1 day') THEN visitor_id END) AS daily,COUNT(DISTINCT CASE WHEN created_at>=datetime('now','-7 day') THEN visitor_id END) AS weekly,COUNT(DISTINCT CASE WHEN created_at>=datetime('now','-30 day') THEN visitor_id END) AS monthly FROM visits`).first(),
    env.DB.prepare(`SELECT path,COUNT(*) AS views,COUNT(DISTINCT visitor_id) AS visitors FROM visits GROUP BY path ORDER BY views DESC`).all(),
    env.DB.prepare(`SELECT date(created_at) AS day,COUNT(*) AS views,COUNT(DISTINCT visitor_id) AS visitors FROM visits WHERE created_at>=datetime('now','-30 day') GROUP BY date(created_at) ORDER BY day`).all(),
    env.DB.prepare(`SELECT u.username,u.name,s.stage,s.score,s.total,s.created_at FROM scores s JOIN users u ON u.id=s.user_id ORDER BY s.created_at DESC LIMIT 500`).all(),
    env.DB.prepare(`SELECT COALESCE(NULLIF(country,''),'Unknown') AS country,COUNT(DISTINCT visitor_id) AS visitors,COUNT(*) AS views FROM visitor_locations GROUP BY COALESCE(NULLIF(country,''),'Unknown') ORDER BY visitors DESC,views DESC`).all(),
    env.DB.prepare(`SELECT COALESCE(NULLIF(city,''),'Unknown') AS city,COALESCE(NULLIF(country,''),'Unknown') AS country,COUNT(DISTINCT visitor_id) AS visitors,COUNT(*) AS views FROM visitor_locations GROUP BY COALESCE(NULLIF(city,''),'Unknown'),COALESCE(NULLIF(country,''),'Unknown') ORDER BY visitors DESC,views DESC`).all()
  ]);
  return json({users:users.results,totals,periods,pages:pages.results,visitorsByDay:days.results,scores:scores.results,countries:countries.results,cities:cities.results});
}

export default { async fetch(request,env){
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:CORS}); const url=new URL(request.url);
  try{
    if(url.pathname==="/health"&&request.method==="GET")return json({ok:true});
    if(url.pathname==="/api/track-visit"&&request.method==="POST")return await trackVisit(request,env);
    if(url.pathname==="/api/track-event"&&request.method==="POST")return await trackEvent(request,env);
    if(url.pathname==="/api/create-account"&&request.method==="POST")return await createAccount(env,await request.json());
    if(url.pathname==="/api/sign-in"&&request.method==="POST")return await signIn(env,await request.json());
    if(url.pathname==="/api/set-password"&&request.method==="POST")return await setPassword(env,await request.json());
    if(url.pathname==="/api/change-password"&&request.method==="POST")return await changePassword(env,request,await request.json());
    if(url.pathname==="/api/admin/reset-password"&&request.method==="POST")return await adminResetPassword(env,request,await request.json());
    if(url.pathname==="/api/admin/stats"&&request.method==="POST")return await stats(env,request);
    if(url.pathname==="/api/sign-out"&&request.method==="POST")return json({ok:true});
    if(url.pathname==="/api/sign-out-all"&&request.method==="POST")return json({ok:true});
    if(url.pathname==="/api/reset-password"&&request.method==="POST")return json({error:"Use the recovery code or password repair endpoint."},400);
    if(url.pathname==="/api/scores"&&request.method==="GET"){const userId=url.searchParams.get("userId");if(!userId)return json({scores:[]});const rows=await env.DB.prepare(`SELECT stage,score,total,created_at FROM scores WHERE user_id=? ORDER BY created_at DESC`).bind(userId).all();return json({scores:rows.results});}
    if(url.pathname==="/api/scores"&&request.method==="POST"){const p=await request.json().catch(()=>({}));await env.DB.prepare(`INSERT INTO scores (user_id,stage,score,total,created_at) VALUES (?,?,?,?,?)`).bind(clean(p.userId,200),clean(p.stage,120),Number(p.score),Number(p.total),now()).run();return json({ok:true});}
    return json({error:"Not found"},404);
  }catch(e){console.error("Worker error:",e);return json({error:e?.message||"Server error"},500);}
} };
