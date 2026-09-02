(()=>{
'use strict';
const $=id=>document.getElementById(id);
const originalSetInterval=window.setInterval.bind(window);
function getSettings(){
 let minutes=5,enabled=true;
 try{minutes=Math.max(1,Math.min(5,Number(localStorage.getItem('chemistryTimerMinutes')||5)));enabled=localStorage.getItem('chemistryTimerEnabled')!=='0'}catch{}
 return{minutes,enabled};
}
function setQuizVisualMode(){
 const quiz=!!document.querySelector('input[name="experience"][value="quiz"]:checked');
 document.body.classList.toggle('quiz-mode',quiz);
}
window.setInterval=function(fn,ms,...args){
 const quizSelected=document.querySelector('input[name="experience"][value="quiz"]:checked');
 const timer=document.getElementById('timer');
 if(ms===1000&&timer&&quizSelected){
  const {minutes,enabled}=getSettings();
  if(!enabled){timer.classList.add('hidden');return originalSetInterval(()=>{},86400000)}
  const started=Date.now(),duration=minutes*60000;
  return originalSetInterval(()=>{
   const elapsed=Date.now()-started;
   if(elapsed<duration){
    fn();
    const left=Math.max(0,duration-(Date.now()-started)),sec=Math.ceil(left/1000),m=Math.floor(sec/60),s=String(sec%60).padStart(2,'0');
    const t=$('timer');if(t)t.textContent=`⏱ ${m}:${s}`;
   }else{
    const leftTicks=Math.max(1,300-Math.floor(elapsed/1000));
    for(let i=0;i<leftTicks;i++)fn();
   }
  },1000);
 }
 return originalSetInterval(fn,ms,...args);
};
function renderTimerChoice(){
 const wrap=document.querySelector('.mode-list');
 if(!wrap)return;
 const quiz=document.querySelector('input[name="experience"][value="quiz"]:checked');
 document.body.classList.toggle('quiz-mode',!!quiz);
 if(!quiz){wrap.innerHTML='';return;}
 let saved=5,enabled=true;
 try{saved=Math.max(1,Math.min(5,Number(localStorage.getItem('chemistryTimerMinutes')||5)));enabled=localStorage.getItem('chemistryTimerEnabled')!=='0'}catch{}
 wrap.innerHTML=`<div class="timer-option"><label class="timer-toggle"><input id="timerEnabled" type="checkbox" ${enabled?'checked':''}> <span><b>Timed quiz</b><small>Choose the time limit for the quiz</small></span></label><label class="timer-duration" for="timerMinutes">Time limit<select id="timerMinutes" ${enabled?'':'disabled'}><option value="1">1 minute</option><option value="2">2 minutes</option><option value="3">3 minutes</option><option value="4">4 minutes</option><option value="5">5 minutes</option></select></label></div>`;
 const checkbox=$('timerEnabled'),select=$('timerMinutes');
 if(select)select.value=String(saved);
 const sync=()=>{if(!checkbox||!select)return;select.disabled=!checkbox.checked;try{localStorage.setItem('chemistryTimerMinutes',select.value);localStorage.setItem('chemistryTimerEnabled',checkbox.checked?'1':'0')}catch{}};
 checkbox?.addEventListener('change',sync);
 select?.addEventListener('change',sync);
 sync();
}
function normalizeQuizFeedback(){
 const quiz=document.querySelector('input[name="experience"][value="quiz"]:checked');
 if(!quiz)return;
 const f=$('answerFeedback');
 if(f)f.querySelectorAll(':scope > *:not(.next-question)').forEach(el=>el.remove());
 document.querySelectorAll('.practice-choice.answer-correct,.practice-choice.answer-wrong,.coefficient-entry.answer-correct,.coefficient-entry.answer-wrong,[data-coef].answer-correct,[data-coef].answer-wrong').forEach(el=>el.classList.remove('answer-correct','answer-wrong'));
}
function markQuizStartTime(){
 const quiz=document.querySelector('input[name="experience"][value="quiz"]:checked');
 if(!quiz)return;
 const {minutes,enabled}=getSettings();
 if(!enabled)return;
 setTimeout(()=>{
  const t=$('timer');
  if(t)t.textContent=`⏱ ${minutes}:00`;
 },0);
}
function watchExperience(){
 document.querySelectorAll('input[name="experience"]').forEach(r=>r.addEventListener('change',()=>{setTimeout(()=>{setQuizVisualMode();renderTimerChoice()},0)}));
}
function install(){
 renderTimerChoice();
 watchExperience();
 document.addEventListener('click',e=>{
  const target=e.target.closest?.('.practice-choice,.practice-submit');
  if(!target)return;
  setTimeout(normalizeQuizFeedback,0);
  const quiz=document.querySelector('input[name="experience"][value="quiz"]:checked');
  if(quiz)setTimeout(()=>normalizeQuizFeedback(),0);
 });
 document.addEventListener('click',e=>{if(e.target.closest?.('#newQuiz'))markQuizStartTime()},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
