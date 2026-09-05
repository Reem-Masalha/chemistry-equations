(()=>{
'use strict';
// Quiz mode must never expose immediate answer feedback. Practice keeps it.
const style=document.createElement('style');style.id='quiz-feedback-mode-fix';style.textContent=`
body:has(input[name="experience"][value="quiz"]:checked) .practice-choice.answer-correct,
body:has(input[name="experience"][value="quiz"]:checked) .practice-choice.answer-wrong{border-color:var(--line)!important;background:var(--surface)!important;color:inherit!important}
body:has(input[name="experience"][value="quiz"]:checked) .coefficient-entry.answer-correct,
body:has(input[name="experience"][value="quiz"]:checked) .coefficient-entry.answer-wrong{border-color:var(--line)!important;background:var(--surface)!important}
body:has(input[name="experience"][value="quiz"]:checked) .coefficient-entry input.answer-correct,
body:has(input[name="experience"][value="quiz"]:checked) .coefficient-entry input.answer-wrong{border-color:var(--line)!important;background:var(--surface)!important;color:inherit!important}
body:has(input[name="experience"][value="quiz"]:checked) #answerFeedback > *:not(.next-question){display:none!important}
body:has(input[name="experience"][value="quiz"]:checked) .answer-feedback{color:inherit!important;background:transparent!important;border-color:transparent!important}
`;(document.head||document.documentElement).appendChild(style);
function scrub(){const quiz=document.querySelector('input[name="experience"][value="quiz"]:checked');if(!quiz)return;document.querySelectorAll('.answer-feedback').forEach(f=>{f.querySelectorAll(':scope > *:not(.next-question)').forEach(x=>x.remove());f.classList.remove('feedback-correct','feedback-wrong');f.classList.add('quiz-neutral')});document.querySelectorAll('.practice-choice.answer-correct,.practice-choice.answer-wrong,.coefficient-entry.answer-correct,.coefficient-entry.answer-wrong,.coefficient-entry input.answer-correct,.coefficient-entry input.answer-wrong').forEach(x=>{x.classList.remove('answer-correct','answer-wrong')})}
new MutationObserver(scrub).observe(document.body,{childList:true,subtree:true});scrub();
})();
