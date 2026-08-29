(()=>{
'use strict';
const $=id=>document.getElementById(id);
const originalSetInterval=window.setInterval.bind(window);
window.setInterval=function(fn,ms,...args){
  const quizSelected=document.querySelector('input[name="experience"][value="quiz"]:checked');
  const minutes=Math.max(1,Math.min(5,Number(localStorage.getItem('chemistryTimerMinutes')||5)));
  if(ms===1000&&document.getElementById('timer')&&quizSelected)ms=1000*minutes/5;
  return originalSetInterval(fn,ms,...args);
};
function installUI(){
 const wrap=document.querySelector('.mode-list');if(!wrap||wrap.dataset.timerEnhanced==='1')return;
 wrap.dataset.timerEnhanced='1';
 let saved=5;try{saved=Math.max(1,Math.min(5,Number(localStorage.getItem('chemistryTimerMinutes')||5)))}catch{}
 wrap.innerHTML=`<div class="timer-option"><label class="timer-toggle"><input id="timerEnabled" type="checkbox" checked> <span><b>Timed quiz</b><small>Optional — choose the time limit</small></span></label><label class="timer-duration" for="timerMinutes">Time limit<select id="timerMinutes"><option value="1">1 minute</option><option value="2">2 minutes</option><option value="3">3 minutes</option><option value="4">4 minutes</option><option value="5">5 minutes</option></select></label></div>`;
 const checkbox=$('timerEnabled'),select=$('timerMinutes');if(select)select.value=String(saved);
 const sync=()=>{if(!checkbox||!select)return;select.disabled=!checkbox.checked;try{localStorage.setItem('chemistryTimerMinutes',select.value);localStorage.setItem('chemistryTimerEnabled',checkbox.checked?'1':'0')}catch{};document.body.dataset.customTimer=checkbox.checked?'on':'off'};
 checkbox?.addEventListener('change',sync);select?.addEventListener('change',sync);sync();
}
function prepareStart(){
 const exp=document.querySelector('input[name="experience"][value="quiz"]:checked');const enabled=localStorage.getItem('chemistryTimerEnabled')!=='0';
 if(exp&&enabled){setTimeout(()=>{const t=$('timer');const minutes=Math.max(1,Math.min(5,Number(localStorage.getItem('chemistryTimerMinutes')||5)));if(t){t.classList.remove('hidden');t.textContent=`⏱ ${minutes}:00`;const target=Date.now()+minutes*60000;clearInterval(window.__chemistryDisplayTimer);window.__chemistryDisplayTimer=setInterval(()=>{const left=Math.max(0,target-Date.now());const sec=Math.ceil(left/1000);const m=Math.floor(sec/60),s=String(sec%60).padStart(2,'0');t.textContent=`⏱ ${m}:${s}`;if(sec<=0)clearInterval(window.__chemistryDisplayTimer)},250)}},0)}
 if(exp&&!enabled){const practice=document.querySelector('input[name="experience"][value="practice"]');if(practice){practice.checked=true;practice.dispatchEvent(new Event('change',{bubbles:true}))}}
}
function watch(){
 installUI();
 const settings=document.querySelector('.quiz-settings');
 if(settings&&!settings.dataset.timerWatcher){settings.dataset.timerWatcher='1';new MutationObserver(()=>{installUI()}).observe(settings,{childList:true,subtree:true})}
 document.addEventListener('click',e=>{if(e.target.closest?.('#newQuiz'))prepareStart()},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
})();
