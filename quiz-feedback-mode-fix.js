(()=>{
'use strict';

// Quiz mode must never show immediate red/green answer feedback.
// Practice mode keeps its existing instant feedback unchanged.
const style=document.createElement('style');
style.id='quiz-feedback-mode-fix';
style.textContent=`
body:has(input[name="experience"][value="quiz"]:checked) .practice-choice.answer-correct,
body:has(input[name="experience"][value="quiz"]:checked) .practice-choice.answer-wrong{
  border-color:var(--line)!important;
  background:var(--surface)!important;
  color:inherit!important;
}
body:has(input[name="experience"][value="quiz"]:checked) .coefficient-entry.answer-correct,
body:has(input[name="experience"][value="quiz"]:checked) .coefficient-entry.answer-wrong{
  border-color:var(--line)!important;
  background:var(--surface)!important;
}
body:has(input[name="experience"][value="quiz"]:checked) .coefficient-entry input.answer-correct,
body:has(input[name="experience"][value="quiz"]:checked) .coefficient-entry input.answer-wrong{
  border-color:var(--line)!important;
  background:var(--surface)!important;
  color:inherit!important;
}
body:has(input[name="experience"][value="quiz"]:checked) #answerFeedback > *:not(.next-question){
  display:none!important;
}
`;
(document.head||document.documentElement).appendChild(style);
})();