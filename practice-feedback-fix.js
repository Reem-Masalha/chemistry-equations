(()=>{
'use strict';
function ui(en,ar,he){const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en}
function install(){
 const area=document.getElementById('quizArea');if(!area||area.dataset.feedbackPersist)return;
 area.dataset.feedbackPersist='1';
 let panel=document.getElementById('persistentAnswerFeedback');
 if(!panel){panel=document.createElement('div');panel.id='persistentAnswerFeedback';panel.className='persistent-answer-feedback hidden';document.body.appendChild(panel)}
 let hideTimer=null,last='';
 const show=()=>{
  const f=area.querySelector('#answerFeedback');
  if(!f||!f.textContent.trim())return;
  const text=f.innerHTML.trim();
  if(text===last)return;
  last=text;panel.innerHTML=`<div class="persistent-answer-title">${ui('Answer feedback','ملاحظات الإجابة','משוב על התשובה')}</div><div>${text}</div>`;panel.classList.remove('hidden');clearTimeout(hideTimer);hideTimer=setTimeout(()=>panel.classList.add('hidden'),6000);
 };
 new MutationObserver(show).observe(area,{childList:true,subtree:true,characterData:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
