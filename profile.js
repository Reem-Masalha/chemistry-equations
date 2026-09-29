(()=>{
const SESSION='chemistryCurrentUser';
const HISTORY='chemistryQuizHistory';
const COURSE='chemistryCourseProgress';
const root=document.getElementById('profileContent');
if(!root)return;
function get(key,fallback){try{const x=localStorage.getItem(key);return x?JSON.parse(x):fallback}catch(e){return fallback}}
const user=get(SESSION,null);
if(!user||!user.token){root.innerHTML='<div class="dashboard-card"><h2>Please sign in</h2><p>Your session has expired.</p></div>';return}
function esc(x){return String(x==null?'':x).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
function courseRows(){const p=get(COURSE,{});const cfg=[['beginner','Beginner',6],['intermediate','Intermediate',4],['advanced','Advanced',4]];return cfg.map(function(x){const done=Array.isArray(p[x[0]])?p[x[0]].length:0;return [x[1],done,x[2],Math.min(100,Math.round(done/x[2]*100))]})}
function quizHistory(){const x=get(HISTORY,[]);return Array.isArray(x)?x:[]}
function daily(){const a=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)||'';if(k.indexOf('chemistryDailyChallenge:')===0){try{const x=JSON.parse(localStorage.getItem(k));if(x)a.push(x)}catch(e){}}}return a}
root.innerHTML='<div class="profile-dashboard"><div class="profile-summary"><div class="profile-avatar">'+esc((user.name||user.username||'?').charAt(0).toUpperCase())+'</div><div><span class="eyebrow">ACCOUNT</span><h1>Your Chemistry Progress</h1><p>'+esc(user.name||user.username)+'</p></div></div><div class="dashboard-card progress-panel"><span class="eyebrow">LEARNING PATH</span><h2>Course progress</h2><div id="profileProgress"></div></div><div class="metric-grid"><div class="metric"><b id="questions">0</b><span>Questions answered</span></div><div class="metric"><b id="average">0%</b><span>Quiz average</span></div><div class="metric"><b id="best">—</b><span>Best challenge score</span></div><div class="metric"><b id="streak">0 days</b><span>Current streak</span></div><div class="metric"><b id="accuracy">0%</b><span>Overall accuracy</span></div><div class="metric"><b id="quizCount">0</b><span>Quizzes completed</span></div></div><div id="continueCard" class="continue-card"></div><div class="dashboard-grid"><div class="dashboard-card"><h2>Weak topics</h2><div id="weakAreas" class="weak-list"></div></div><div class="dashboard-card"><h2>Recent activity</h2><div id="activity" class="activity-list"></div></div></div><button id="profileSignOut" class="secondary" type="button">Sign out</button></div>';
const rows=courseRows();
document.getElementById('profileProgress').innerHTML=rows.map(function(x){return '<div class="progress-row"><div class="progress-label"><span>'+x[0]+'</span><b>'+x[3]+'%</b></div><div class="progress-track"><div class="progress-fill" style="width:'+x[3]+'%"></div></div><span class="muted">'+x[1]+' of '+x[2]+' lessons completed</span></div>'}).join('');
const h=quizHistory();
let questions=0,correct=0,sum=0;
h.forEach(function(q){if(Array.isArray(q.questions)){questions+=q.questions.length;q.questions.forEach(function(a){if(a.correct)correct++})}if(Number(q.total))sum+=Number(q.score)/Number(q.total)*100});
document.getElementById('questions').textContent=questions;
document.getElementById('accuracy').textContent=(questions?Math.round(correct/questions*100):0)+'%';
document.getElementById('average').textContent=(h.length?Math.round(sum/h.length):0)+'%';
document.getElementById('quizCount').textContent=h.length;
const ds=daily();
let best=null;
ds.forEach(function(x){if(!best||Number(x.score)/Math.max(1,Number(x.total))>Number(best.score)/Math.max(1,Number(best.total)))best=x});
document.getElementById('best').textContent=best?Number(best.score)+'/'+Number(best.total):'—';
let daySet={};ds.forEach(function(x){const d=new Date(x.date);if(!isNaN(d))daySet[d.toISOString().slice(0,10)]=1});
let streak=0,now=new Date();
while(daySet[now.toISOString().slice(0,10)]){streak++;now.setDate(now.getDate()-1)}
document.getElementById('streak').textContent=streak+' day'+(streak===1?'':'s');
const p=get(COURSE,{});
let level='beginner',lesson=1;
if(p.current&&p.current.level&&Number.isInteger(p.current.index)){level=p.current.level;lesson=p.current.index+1}
const labels={beginner:'Beginner',intermediate:'Intermediate',advanced:'Advanced'};
const pages={beginner:'beginner-lessons.html',intermediate:'intermediate-lessons.html',advanced:'advanced-lessons.html'};
const target=pages[level]+'?lesson='+lesson;
document.getElementById('continueCard').innerHTML='<div><span class="eyebrow">NEXT STEP</span><h2>Continue learning →</h2><p>'+labels[level]+' · Lesson '+lesson+'</p></div><a class="primary" href="'+target+'">Continue learning →</a>';
const misses={};
h.forEach(function(q){if(Array.isArray(q.questions))q.questions.forEach(function(a){if(!a.correct){const k=String(a.question||a.topic||'Chemistry question');misses[k]=(misses[k]||0)+1}})});
const weak=Object.keys(misses).sort(function(a,b){return misses[b]-misses[a]}).slice(0,5);
document.getElementById('weakAreas').innerHTML=weak.length?weak.map(function(k){return '<div class="weak-row"><span>'+esc(k)+'</span><b>'+misses[k]+' misses</b></div>'}).join(''):'<p class="muted">Complete quizzes to identify your weakest topics.</p>';
const activity=[];
h.slice().reverse().slice(0,5).forEach(function(x){activity.push({icon:'🧪',text:(x.stage||'Quiz')+' quiz · '+x.score+'/'+x.total,date:x.date})});
ds.slice().reverse().slice(0,3).forEach(function(x){activity.push({icon:'⚡',text:'Daily challenge · '+x.score+'/'+x.total,date:x.date})});
document.getElementById('activity').innerHTML=activity.length?activity.slice(0,6).map(function(x){return '<div class="activity-item"><span class="activity-icon">'+x.icon+'</span><span>'+esc(x.text)+'</span><small>'+esc(x.date||'')+'</small></div>'}).join(''):'<p class="muted">Your recent quizzes and challenges will appear here.</p>';
document.getElementById('profileSignOut').onclick=function(){localStorage.removeItem(SESSION);sessionStorage.removeItem(SESSION);location.href='learn.html'};
})();