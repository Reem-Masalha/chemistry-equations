(()=>{
'use strict';
const $=id=>document.getElementById(id);
let duration=5;
try{duration=Math.max(1,Math.min(5,Number(localStorage.getItem('chemistryTimerMinutes')||5)))}catch{}
const originalSetInterval=window.setInterval.bind(window);
window.setInterval=function(fn,ms,...args){
  if(ms===1000 && document.getElementById('timer') && document.querySelector('input[name="experience"][value="quiz"]:checked')){
    const minutes=Math.max(1,Math.min(5,Number(localStorage.getItem('chemistryTimerMinutes')||5)));
    ms=1000*minutes/5;
  }
  return originalSetInterval(fn,ms,...args);
};
function installUI(){
 const wrap=document.querySelector('.mode-list');if(!wrap||wrap.dataset.timerEnhanced)return;
 wrap.dataset.timerEnhanced='1';
 wrap.innerHTML=`<div class="timer-option"><label class="timer-toggle"><input id="timerEnabled" type="checkbox" checked> <span><b>Timed quiz</b><small>Optional — choose the time limit</small></span></label><label class="timer-duration" for="timerMinutes">Time limit<select id="timerMinutes"><option value="1">1 minute</option><option value="2">2 minutes</option><option value="3">3 minutes</option><option value="4">4 minutes</option><option value="5">5 minutes</option></select></label></div>`;
 const checkbox=$('timerEnabled'),select=$('timerMinutes');select.value=String(duration);checkbox.checked=true;
 const sync=()=>{const on=checkbox.checked;select.disabled=!on;try{localStorage.setItem('chemistryTimerMinutes',select.value)}catch{};document.body.dataset.customTimer=on?'on':'off'};
 checkbox.addEventListener('change',sync);select.addEventListener('change',sync);sync();
 document.addEventListener('click',e=>{
  const start=e.target.closest?.('#newQuiz');if(!start)return;
  const exp=document.querySelector('input[name="experience"][value="quiz"]:checked');
  if(exp&&checkbox.checked){setTimeout(()=>{const t=$('timer');if(t)t.textContent=`⏱ ${select.value}:00`},0)}
  if(exp&&!checkbox.checked){
    // Make the timer genuinely optional: start this session as untimed practice.
    const practice=document.querySelector('input[name="experience"][value="practice"]');
    if(practice){practice.checked=true;practice.dispatchEvent(new Event('change',{bubbles:true}))}
  }
 },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installUI,{once:true});else installUI();
})();
