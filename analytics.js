(()=>{
'use strict';
const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
const visitorId=(()=>{try{const k='chemistryVisitorId',v=localStorage.getItem(k);if(v)return v;const n=crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);localStorage.setItem(k,n);return n}catch{return''}})();
let userId=null;try{const u=JSON.parse(localStorage.getItem('chemistryCurrentUser')||sessionStorage.getItem('chemistryCurrentUser')||'null');userId=u?.id||null}catch{}
const send=p=>{if(!visitorId)return;try{fetch(API+'/api/track-event',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...p,visitorId,userId}),keepalive:true}).catch(()=>{})}catch{}};
const feature=()=>{const p=location.pathname.toLowerCase();if(p.includes('personal-quiz'))return'Quiz';if(p.includes('challenges'))return'Challenges';if(p.includes('learn'))return'Learning';if(p.includes('checker'))return'Checker';if(p.includes('balancer'))return'Balancer';if(p==='/'||p.endsWith('/index.html'))return'Learning';return null};
send({eventType:'feature_visit',feature:feature()});
document.addEventListener('click',e=>{const b=e.target.closest?.('button,a');if(!b)return;const text=(b.textContent||'').trim().toLowerCase();let f=feature();if(text.includes('balance'))f='Balancer';else if(text.includes('quiz'))f='Quiz';else if(text.includes('learn'))f='Learning';else if(text.includes('check'))f='Checker';else if(text.includes('challenge'))f='Challenges';if(f)send({eventType:'feature_use',feature:f,metadata:{action:text.slice(0,80)}})},true);
let lastQuizSignature='';
const reportQuiz=()=>{const label=document.querySelector('#stageLabel'),score=document.querySelector('.big-score');if(!score||!label)return;const sig=score.textContent+'|'+label.textContent;if(sig===lastQuizSignature)return;lastQuizSignature=sig;const difficulty=label.textContent.trim().toLowerCase(),total=Number((score.textContent.match(/\/\s*(\d+)/)||[])[1])||0,value=Number(score.textContent.split('/')[0].trim());send({eventType:'quiz_completed',feature:'Quiz',difficulty,score:value,total});document.querySelectorAll('.quiz-q').forEach(q=>{const question=q.querySelector('.qtext')?.textContent?.replace(/^\d+\.\s*/,'').trim();if(question)send({eventType:'question_result',feature:'Quiz',difficulty,question,correct:q.classList.contains('correct')})})};
const scheduleReport=()=>setTimeout(reportQuiz,100);
document.addEventListener('click',e=>{const b=e.target.closest?.('button');if(!b)return;const t=(b.textContent||'').toLowerCase();if(/submit|finish|complete|check answer|next question|show results/.test(t))scheduleReport()},true);
})();
