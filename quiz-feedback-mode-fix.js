(()=>{
'use strict';
// Quiz mode must never expose immediate answer feedback. Keep this CSS-only so
// answer rendering cannot trigger a DOM mutation loop while a quiz is running.
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
})();
