(()=>{
const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
const cookieName='chemistryVisitorId';
const getCookie=()=>document.cookie.split('; ').find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1)||null;
const setCookie=v=>{document.cookie=cookieName+'='+encodeURIComponent(v)+'; Max-Age=31536000; Path=/; SameSite=Lax'};
let anonymousId=getCookie()||localStorage.getItem('chemistryVisitorId');
if(!anonymousId)anonymousId=crypto.randomUUID();
setCookie(anonymousId);try{localStorage.setItem('chemistryVisitorId',anonymousId)}catch{}
const readUser=()=>{try{const u=JSON.parse(localStorage.getItem('chemistryCurrentUser')||sessionStorage.getItem('chemistryCurrentUser')||'null');return u&&u.id?u:null}catch{return null}};
const accountVisitorId=u=>u?'account:'+String(u.id):'anonymous:'+anonymousId;
const identity=()=>accountVisitorId(readUser());
const userId=()=>readUser()?.id||null;
const send=(p)=>fetch(API+'/api/track-event',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...p,visitorId:identity(),userId:userId()})}).catch(()=>{});
const trackVisit=()=>fetch(API+'/api/track-visit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({visitorId:identity(),userId:userId(),path:location.pathname})}).catch(()=>{});
trackVisit();
const feature=()=>{const p=location.pathname.toLowerCase();if(p.includes('personal-quiz'))return 'Quiz';if(p.includes('challenges'))return 'Challenges';if(p.includes('learn')||p.includes('beginner-lessons'))return 'Learning';if(p.includes('checker'))return 'Checker';if(p.endsWith('/index.html')||p==='/'||p==='')return 'Balancer';return null};
send({eventType:'feature_visit',feature:feature()});
document.addEventListener('click',e=>{const b=e.target.closest('button,a');if(!b)return;const text=(b.textContent||'').trim().toLowerCase();let f=feature();if(text.includes('balance'))f='Balancer';else if(text.includes('quiz'))f='Quiz';else if(text.includes('learn'))f='Learning';else if(text.includes('check'))f='Checker';else if(text.includes('challenge'))f='Challenges';if(f)send({eventType:'feature_use',feature:f,metadata:{action:text.slice(0,80)}})},true);
let sent='';const scan=()=>{const label=document.querySelector('#stageLabel'),score=document.querySelector('.big-score');if(!label||!score)return;const sig=score.textContent+'|'+label.textContent;if(sig===sent)return;sent=sig;const difficulty=label.textContent.trim().toLowerCase(),m=score.textContent.match(/^\s*([\d.]+)\s*\/\s*(\d+)/);if(!m)return;send({eventType:'quiz_completed',feature:'Quiz',difficulty,score:Number(m[1]),total:Number(m[2])});document.querySelectorAll('.quiz-q').forEach(q=>{const question=q.querySelector('.qtext')?.textContent?.replace(/^\d+\.\s*/,'').trim();if(question)send({eventType:'question_result',feature:'Quiz',difficulty,question,correct:q.classList.contains('correct')})})};new MutationObserver(scan).observe(document.body,{subtree:true,childList:true});scan();
})();
