(()=>{
'use strict';
const HISTORY_KEY='chemistryQuizHistory:runtime-v1';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
function read(){try{const x=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
function write(list){try{localStorage.setItem(HISTORY_KEY,JSON.stringify(list.slice(0,20)))}catch{}}
function collectExisting(){
 const out=read();
 const keys=['chemistryQuizHistory:guest'];
 try{const u=JSON.parse(localStorage.getItem('chemistryCurrentUser')||sessionStorage.getItem('chemistryCurrentUser')||'null');if(u?.id)keys.push('chemistryQuizHistory:'+u.id);if(u?.username)keys.push('chemistryQuizHistory:'+u.username)}catch{}
 keys.forEach(k=>{try{const x=JSON.parse(localStorage.getItem(k)||'[]');if(Array.isArray(x))out.push(...x)}catch{}});
 const seen=new Set();const merged=out.filter(h=>{const k=[h?.date,h?.difficulty,h?.experience,h?.score,h?.answered].join('|');if(seen.has(k))return false;seen.add(k);return true}).sort((a,b)=>String(b?.date||'').localeCompare(String(a?.date||''))).slice(0,20);
 write(merged);return merged;
}
function render(){
 const box=$('historyList');if(!box)return;
 const rows=collectExisting();
 box.classList.remove('hidden');
 box.innerHTML=rows.length?rows.map((h,i)=>`<div class="history-row"><span><b>#${rows.length-i}</b> ${esc(h.experience==='quiz'?'Quiz':'Practice')} · ${esc(h.difficulty||'')}</span><span>${Number(h.correct)||0}/${Number(h.answered)||0} · ${Number(h.accuracy)||0}% · ${Number(h.score)||0} pts</span><small>${new Date(h.date).toLocaleString()}</small></div>`).join(''):'<div class="history-empty">No completed sessions yet. Finish a practice or quiz session and it will appear here.</div>';
}
function capture(){
 const card=document.querySelector('.quiz-finish-card');if(!card)return;
 const score=Number(card.querySelector('.finish-score b')?.textContent)||0;
 const p=[...card.querySelectorAll('p')].find(x=>/answered/i.test(x.textContent||''));
 const answered=Number(p?.querySelector('b')?.textContent)||0;
 if(!answered)return;
 const difficulty=($('stageLabel')?.textContent||'BEGINNER').trim().toLowerCase();
 const experience=($('quizTitle')?.textContent||'Practice').trim().toLowerCase().includes('quiz')?'quiz':'practice';
 const list=collectExisting();
 const now=new Date().toISOString();
 const duplicate=list.some(h=>h&&Number(h.score)===score&&Number(h.answered)===answered&&h.difficulty===difficulty&&h.experience===experience&&Math.abs(new Date(now)-new Date(h.date||0))<10000);
 if(!duplicate){list.unshift({date:now,difficulty,experience,type:'choice',score,correct:Math.round(score/10),answered,accuracy:Math.round((score/10)/answered*100),time:0});write(list)}
 render();
 const b=$('backToSettings');if(b){b.classList.add('finish-settings-button');b.style.setProperty('background','var(--accent)','important');b.style.setProperty('background-color','var(--accent)','important');b.style.setProperty('color','#fff','important');b.style.setProperty('border','1px solid var(--accent)','important');b.style.setProperty('opacity','1','important')}
}
function guardQuizProgress(){
 const finish=document.querySelector('.quiz-finish-card');
 if(finish)return;
 const area=$('quizArea'),score=$('scoreArea');
 if(!area||!score)return;
 const active=area.querySelector('button, input, .quiz-question, .question-card');
 if(active && score.querySelector('.practice-live-stats') && /correct|accuracy|score/i.test(score.textContent||'')){
   const question=area.querySelector('.practice-question-card');
   if(question){
     const meta=question.querySelector('.practice-question-meta')?.textContent||'';
     const match=meta.match(/Question\s+(\d+)\s*\/\s*(\d+)/i);
     const current=match?Number(match[1]):1;
     const total=match?Number(match[2]):1;
     score.innerHTML=`<div class="practice-live-stats quiz-live-progress"><div><b>${current}</b><span>Question</span></div><div><b>${total}</b><span>Total</span></div></div>`;
   }
 }
}
function init(){
 render();
 const target=$('quizArea');if(!target)return;
 const obs=new MutationObserver(()=>{capture();guardQuizProgress()});
 obs.observe(target,{childList:true,subtree:true});
 const score=$('scoreArea');if(score)new MutationObserver(guardQuizProgress).observe(score,{childList:true,subtree:true,characterData:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
