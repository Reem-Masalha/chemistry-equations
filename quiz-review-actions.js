(()=>{
'use strict';
const ui=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const getReview=()=>document.querySelector('.quiz-review');
const printReview=()=>{
 const review=getReview();
 if(!review)return;
 document.body.classList.add('printing-quiz-review');
 const cleanup=()=>document.body.classList.remove('printing-quiz-review');
 window.addEventListener('afterprint',cleanup,{once:true});
 setTimeout(()=>{window.print();setTimeout(cleanup,1500)},50);
};
const addReviewActions=()=>{
 const review=getReview();
 if(!review||review.querySelector('.quiz-review-actions'))return;
 const actions=document.createElement('div');
 actions.className='quiz-review-actions no-print';
 actions.innerHTML=`<button type="button" class="secondary" data-review-print>🖨 ${ui('Print review','طباعة المراجعة','הדפסת הסקירה')}</button><button type="button" class="primary" data-review-pdf>📄 ${ui('Save as PDF','حفظ كملف PDF','שמירה כ-PDF')}</button>`;
 actions.querySelector('[data-review-print]').addEventListener('click',printReview);
 actions.querySelector('[data-review-pdf]').addEventListener('click',printReview);
 review.prepend(actions);
};
new MutationObserver(addReviewActions).observe(document.body,{childList:true,subtree:true});
addReviewActions();
})();
