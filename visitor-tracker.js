(()=>{
'use strict';
const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
const cookieName='chemistryVisitorId';
const getCookie=()=>document.cookie.split('; ').find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1)||null;
const setCookie=v=>{try{document.cookie=cookieName+'='+encodeURIComponent(v)+'; Max-Age=31536000; Path=/; SameSite=Lax'}catch{}};
let anonymousId=getCookie()||localStorage.getItem(cookieName);
if(!anonymousId){anonymousId=crypto.randomUUID();try{localStorage.setItem(cookieName,anonymousId)}catch{}}
setCookie(anonymousId);
const readUser=()=>{try{const u=JSON.parse(localStorage.getItem('chemistryCurrentUser')||sessionStorage.getItem('chemistryCurrentUser')||'null');return u&&u.id?u:null}catch{return null}};
const identity=()=>{const u=readUser();return u?'account:'+String(u.id):'anonymous:'+anonymousId};
const userId=()=>readUser()?.id||null;
const path=location.pathname||'/';
const visitKey='chemistryTrackedVisit:'+path;
const featureKey='chemistryTrackedFeature:'+path;
const oncePerTab=(key)=>{try{if(sessionStorage.getItem(key))return false;sessionStorage.setItem(key,'1');return true}catch{return true}};
const post=(url,p)=>{try{return fetch(API+url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(p),keepalive:true}).catch(()=>{})}catch{return Promise.resolve()}};
const base=()=>({visitorId:identity(),userId:userId()});
// One page-view record per page per browser tab. Repeated renders/history events do not create duplicates.
if(oncePerTab(visitKey))post('/api/track-visit',{...base(),path:path.slice(0,200)});
const feature=()=>{const p=path.toLowerCase();if(p.includes('personal-quiz'))return 'Quiz';if(p.includes('challenges'))return 'Challenges';if(p.includes('learn')||p.includes('beginner-lessons'))return 'Learning';if(p.includes('checker'))return 'Checker';if(p.endsWith('/index.html')||p==='/'||p==='')return 'Balancer';return null};
const f=feature();
if(f&&oncePerTab(featureKey))post('/api/track-event',{...base(),eventType:'feature_visit',feature:f});
// Throttle feature-use analytics. Analytics must never block or slow the application UI.
let lastUse=0,lastAction='';
document.addEventListener('click',e=>{const b=e.target.closest?.('button,a');if(!b)return;const now=Date.now(),text=(b.textContent||'').trim().toLowerCase().slice(0,80);if(!text||text===lastAction&&now-lastUse<1500)return;let used=feature();if(text.includes('balance'))used='Balancer';else if(text.includes('quiz'))used='Quiz';else if(text.includes('learn'))used='Learning';else if(text.includes('check'))used='Checker';else if(text.includes('challenge'))used='Challenges';if(!used)return;lastUse=now;lastAction=text;post('/api/track-event',{...base(),eventType:'feature_use',feature:used,metadata:{action:text}})},true);
// Quiz completion is checked only after user interaction, not with a permanent MutationObserver.
let lastQuizSignature='';
const scanQuiz=()=>{const label=document.querySelector('#stageLabel'),score=document.querySelector('.big-score');if(!label||!score)return;const sig=score.textContent+'|'+label.textContent;if(!sig||sig===lastQuizSignature)return;const m=score.textContent.match(/^\s*([\d.]+)\s*\/\s*(\d+)/);if(!m)return;lastQuizSignature=sig;const difficulty=label.textContent.trim().toLowerCase();post('/api/track-event',{...base(),eventType:'quiz_completed',feature:'Quiz',difficulty,score:Number(m[1]),total:Number(m[2])});const results=[];document.querySelectorAll('.quiz-q').forEach(q=>{const question=q.querySelector('.qtext')?.textContent?.replace(/^\d+\.\s*/,'').trim();if(question)results.push({question,correct:q.classList.contains('correct')})});results.slice(0,30).forEach(r=>post('/api/track-event',{...base(),eventType:'question_result',feature:'Quiz',difficulty,question:r.question,correct:r.correct}));};
document.addEventListener('click',()=>{window.setTimeout(scanQuiz,250)},true);
})();
