const encoder = new TextEncoder();

function corsHeaders() {
  return {
    'content-type': 'application/json; charset=UTF-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type,x-admin-key',
    'access-control-max-age': '86400',
  };
}
const now=()=>new Date().toISOString();
async function event(env,p){
  const v=p.visitorId?String(p.visitorId):null,u=p.userId?String(p.userId):null;
  await env.DB.prepare('INSERT INTO analytics_events (visitor_id,user_id,event_type,feature,difficulty,question,correct,score,total,metadata,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
    .bind(v,u,String(p.eventType||'event'),p.feature?String(p.feature):null,p.difficulty?String(p.difficulty):null,p.question?String(p.question).slice(0,500):null,p.correct==null?null:(p.correct?1:0),p.score==null?null:Number(p.score),p.total==null?null:Number(p.total),p.metadata?JSON.stringify(p.metadata):null,now()).run();
}
export default { async fetch(request,env){
 const url=new URL(request.url),headers=corsHeaders();
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 try{
  if(url.pathname==='/health')return json({ok:true},headers);
  if(url.pathname==='/api/track-visit'&&request.method==='POST'){
   const {visitorId,path}=await request.json();if(!visitorId||!path)return json({error:'visitorId and path are required.'},headers,400);
   await env.DB.prepare('INSERT INTO visits (visitor_id,path,created_at) VALUES (?,?,?)').bind(String(visitorId),String(path).slice(0,200),now()).run();return json({ok:true},headers);
  }
  if(url.pathname==='/api/track-event'&&request.method==='POST'){
   const p=await request.json();if(!p.eventType)return json({error:'eventType is required.'},headers,400);await event(env,p);return json({ok:true},headers);
  }
  if(url.pathname==='/api/create-account'&&request.method==='POST'){
   const {name,username,password}=await request.json();if(!name||!username||!password)return json({error:'Name, username and password are required.'},headers,400);if(String(password).length<8)return json({error:'Password must be at least 8 characters.'},headers,400);const u=String(username).trim().toLowerCase();const exists=await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(u).first();if(exists)return json({error:'Username already exists.'},headers,409);const salt=crypto.randomUUID(),hash=await hashPassword(String(password),salt),id=crypto.randomUUID();await env.DB.prepare('INSERT INTO users (id,name,username,password_hash,password_salt,created_at) VALUES (?,?,?,?,?,?)').bind(id,String(name).trim(),u,hash,salt,now()).run();return json({ok:true,user:{id,name:String(name).trim(),username:u}},headers);
  }
  if(url.pathname==='/api/set-password'&&request.method==='POST'){
   const {username,password,confirmPassword}=await request.json(),u=String(username||'').trim().toLowerCase();if(!u)return json({error:'Username is required.'},headers,400);if(!password)return json({error:'Password is required.'},headers,400);if(String(password).length<8)return json({error:'Password must be at least 8 characters.'},headers,400);if(password!==confirmPassword)return json({error:'Passwords do not match.'},headers,400);const user=await env.DB.prepare('SELECT id,name,username,password_hash,password_salt FROM users WHERE username = ?').bind(u).first();if(!user)return json({error:'No existing account was found with that username.'},headers,404);if(user.password_hash&&user.password_salt)return json({error:'This account already has a password. Please use Sign in.'},headers,409);const salt=crypto.randomUUID(),hash=await hashPassword(String(password),salt);await env.DB.prepare('UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?').bind(hash,salt,user.id).run();return json({ok:true,user:{id:user.id,name:user.name,username:user.username}},headers);
  }
  if(url.pathname==='/api/sign-in'&&request.method==='POST'){
   const {username,password}=await request.json();if(!username||!password)return json({error:'Username and password are required.'},headers,400);const user=await env.DB.prepare('SELECT id,name,username,password_hash,password_salt FROM users WHERE username = ?').bind(String(username).trim().toLowerCase()).first();if(!user||!user.password_hash||!user.password_salt)return json({error:'Incorrect username or password.'},headers,401);const hash=await hashPassword(String(password),user.password_salt);if(!timingSafeEqual(hash,user.password_hash))return json({error:'Incorrect username or password.'},headers,401);return json({ok:true,user:{id:user.id,name:user.name,username:user.username}},headers);
  }
  if(url.pathname==='/api/scores'&&request.method==='GET'){const userId=url.searchParams.get('userId');const rows=await env.DB.prepare('SELECT stage,score,total,created_at FROM scores WHERE user_id = ? ORDER BY created_at DESC').bind(userId).all();return json({scores:rows.results},headers);}
  if(url.pathname==='/api/scores'&&request.method==='POST'){const {userId,stage,score,total}=await request.json();await env.DB.prepare('INSERT INTO scores (user_id,stage,score,total,created_at) VALUES (?,?,?,?,?)').bind(userId,stage,score,total,now()).run();return json({ok:true},headers);}
  if(url.pathname==='/api/admin/stats'&&request.method==='POST'){
   const key=request.headers.get('x-admin-key')||'';if(!env.ADMIN_KEY)return json({error:'ADMIN_KEY is not configured on the Cloudflare Worker.'},headers,500);if(!key||key!==env.ADMIN_KEY)return json({error:'Incorrect admin key.'},headers,401);
   const users=await env.DB.prepare('SELECT id,name,username,created_at FROM users ORDER BY created_at DESC').all();
   const totals=await env.DB.prepare('SELECT COUNT(*) AS visits,COUNT(DISTINCT visitor_id) AS unique_visitors FROM visits').first();
   const periods=await env.DB.prepare("SELECT COUNT(DISTINCT CASE WHEN created_at>=datetime('now','-1 day') THEN visitor_id END) AS daily,COUNT(DISTINCT CASE WHEN created_at>=datetime('now','-7 day') THEN visitor_id END) AS weekly,COUNT(DISTINCT CASE WHEN created_at>=datetime('now','-30 day') THEN visitor_id END) AS monthly FROM visits").first();
   const visitorsByDay=await env.DB.prepare("SELECT date(created_at) AS day,COUNT(*) AS views,COUNT(DISTINCT visitor_id) AS visitors FROM visits WHERE created_at>=datetime('now','-30 day') GROUP BY date(created_at) ORDER BY day").all();
   const pages=await env.DB.prepare('SELECT path,COUNT(*) AS views,COUNT(DISTINCT visitor_id) AS visitors FROM visits GROUP BY path ORDER BY views DESC').all();
   const recent=await env.DB.prepare('SELECT visitor_id,path,created_at FROM visits ORDER BY created_at DESC LIMIT 100').all();
   const scores=await env.DB.prepare('SELECT u.username,u.name,s.stage,s.score,s.total,s.created_at FROM scores s JOIN users u ON u.id=s.user_id ORDER BY s.created_at DESC LIMIT 500').all();
   const active=await env.DB.prepare("SELECT COUNT(DISTINCT user_id) AS active_users FROM analytics_events WHERE user_id IS NOT NULL AND created_at>=datetime('now','-30 day')").first();
   const quizTotals=await env.DB.prepare("SELECT COUNT(*) AS quizzes,COALESCE(AVG(CASE WHEN total>0 THEN score*100.0/total END),0) AS average_score FROM scores").first();
   const difficulty=await env.DB.prepare("SELECT difficulty,COUNT(*) AS uses FROM analytics_events WHERE event_type='quiz_completed' AND difficulty IS NOT NULL GROUP BY difficulty ORDER BY uses DESC").all();
   const features=await env.DB.prepare("SELECT feature,COUNT(*) AS uses FROM analytics_events WHERE feature IS NOT NULL GROUP BY feature ORDER BY uses DESC").all();
   const missed=await env.DB.prepare("SELECT question,COUNT(*) AS misses FROM analytics_events WHERE event_type='question_result' AND correct=0 AND question IS NOT NULL GROUP BY question ORDER BY misses DESC LIMIT 15").all();
   const featurePeriod=await env.DB.prepare("SELECT feature,COUNT(*) AS uses FROM analytics_events WHERE feature IS NOT NULL AND created_at>=datetime('now','-30 day') GROUP BY feature ORDER BY uses DESC").all();
   return json({users:users.results,totals,periods,active_users:active.active_users,quiz_totals:quizTotals,difficulty:difficulty.results,features:features.results,featurePeriod:featurePeriod.results,missed:missed.results,visitorsByDay:visitorsByDay.results,pages:pages.results,recent:recent.results,scores:scores.results},headers);
  }
  return json({error:'Not found'},headers,404);
 }catch(e){return json({error:e?.message||'Server error'},headers,500);}
}};
async function hashPassword(password,salt){const digest=await crypto.subtle.digest('SHA-256',encoder.encode(salt+':'+password));return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');}
function timingSafeEqual(a,b){if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0;}
function json(data,headers,status=200){return new Response(JSON.stringify(data),{status,headers});}
