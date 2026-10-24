(()=> {
'use strict';
const $=id=>document.getElementById(id);

/* The quiz engine owns scoring and history. This runtime only enforces the
   quiz-mode feedback rule, avoiding a second history renderer/source of truth. */
function enforceFinalOnlyQuizFeedback(){
 const area=$('quizArea'),score=$('scoreArea');
 if(!area||!score||document.querySelector('.quiz-finish-card'))return;
 const question=area.querySelector('.practice-question-card');
 if(!question)return;
 const title=($('quizTitle')?.textContent||'').trim().toLowerCase();
 const quizSelected=document.querySelector('input[name="experience"][value="quiz"]')?.checked;
 if(!quizSelected&&!title.includes('quiz'))return;
 const meta=question.querySelector('.practice-question-meta')?.textContent||'';
 const match=meta.match(/Question\s+(\d+)\s*\/\s*(\d+)/i);
 const current=match?Number(match[1]):1;
 const total=match?Number(match[2]):1;
 const desired='<div class="practice-live-stats quiz-live-progress"><div><b>'+current+'</b><span>Question</span></div><div><b>'+total+'</b><span>Total</span></div></div>';
 if(score.innerHTML!==desired)score.innerHTML=desired;
}
function init(){
 const area=$('quizArea'),score=$('scoreArea');
 if(area)new MutationObserver(enforceFinalOnlyQuizFeedback).observe(area,{childList:true,subtree:true});
 if(score)new MutationObserver(enforceFinalOnlyQuizFeedback).observe(score,{childList:true,subtree:true,characterData:true});
 enforceFinalOnlyQuizFeedback();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();