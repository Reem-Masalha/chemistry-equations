(()=>{
'use strict';
const ui=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const addReviewActions=()=>{
  const review=document.querySelector('.quiz-review');
  if(!review||review.querySelector('.quiz-review-actions'))return;
  const actions=document.createElement('div');
  actions.className='quiz-review-actions no-print';
  actions.innerHTML=`<button type="button" class="secondary" data-review-print>🖨 ${ui('Print review','طباعة المراجعة','הדפסת הסקירה')}</button><button type="button" class="primary" data-review-pdf>📄 ${ui('Save as PDF','حفظ كملف PDF','שמירה כ-PDF')}</button>`;
  actions.querySelector('[data-review-print]').addEventListener('click',()=>window.print());
  actions.querySelector('[data-review-pdf]').addEventListener('click',()=>window.print());
  review.prepend(actions);
};
new MutationObserver(addReviewActions).observe(document.body,{childList:true,subtree:true});
addReviewActions();
})();
