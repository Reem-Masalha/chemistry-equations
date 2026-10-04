(()=>{
'use strict';
const HISTORY_KEY='chemistryQuizHistory:guest';
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function readHistory(){try{const x=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
function writeHistory(entry){
  const history=readHistory();
  const duplicate=history.some(h=>h&&h.difficulty===entry.difficulty&&h.experience===entry.experience&&h.score===entry.score&&h.correct===entry.correct&&h.answered===entry.answered&&Math.abs(new Date(entry.date)-new Date(h.date))<15000);
  if(!duplicate){history.unshift(entry);history.splice(20);try{localStorage.setItem(HISTORY_KEY,JSON.stringify(history))}catch{}}
  renderHistory(history);
}
function renderHistory(history=readHistory()){
  const box=document.getElementById('historyList');
  if(!box)return;
  box.classList.remove('hidden');
  if(!history.length){box.innerHTML='<div class="history-empty">No completed sessions yet. Finish a practice or quiz session and it will appear here.</div>';return}
  box.innerHTML=history.map((h,i)=>{
    const type=h.experience==='quiz'?'Quiz':'Practice';
    return `<div class="history-row"><span><b>#${history.length-i}</b> ${escapeHtml(type)} · ${escapeHtml(h.difficulty||'')}</span><span>${Number(h.correct)||0}/${Number(h.answered)||0} · ${Number(h.accuracy)||0}% · ${Number(h.score)||0} pts</span><small>${new Date(h.date).toLocaleString()}</small></div>`;
  }).join('');
}
function protectFinishButton(){
  const b=document.getElementById('backToSettings');
  if(!b)return;
  b.style.setProperty('background','var(--accent)','important');
  b.style.setProperty('border','1px solid var(--accent)','important');
  b.style.setProperty('color','#fff','important');
}
function captureFinishedSession(){
  const card=document.querySelector('.quiz-finish-card');
  if(!card)return;
  protectFinishButton();
  const score=Number(card.querySelector('.finish-score b')?.textContent)||0;
  const answered=Number(card.querySelector('p b')?.textContent)||0;
  const pct=answered?Math.round((score/10)/answered*100):0;
  const correct=Math.round((score/10));
  const difficulty=(document.getElementById('stageLabel')?.textContent||'BEGINNER').trim().toLowerCase();
  const experience=(document.getElementById('quizTitle')?.textContent||'Practice').trim().toLowerCase().includes('quiz')?'quiz':'practice';
  writeHistory({date:new Date().toISOString(),difficulty,experience,type:'choice',score,correct,answered,accuracy:pct,time:0});
}
function init(){
  renderHistory();
  const target=document.getElementById('quizArea');
  if(!target)return;
  const observer=new MutationObserver(()=>{protectFinishButton();if(document.querySelector('.quiz-finish-card'))captureFinishedSession()});
  observer.observe(target,{childList:true,subtree:true});
  protectFinishButton();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
