(()=>{
'use strict';
const ui=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const getReview=()=>document.querySelector('.quiz-review');
const printReview=()=>{
 const review=getReview();
 if(!review)return;
 const title=ui('Quiz Review','مراجعة الاختبار','סקירת החידון');
 const printWindow=window.open('','_blank');
 if(!printWindow){window.print();return;}
 const doc=printWindow.document;
 doc.open();
 doc.write('<!doctype html><html><head><meta charset="utf-8"><title>'+title+'</title><style>html,body{margin:0;padding:24px;background:#fff;color:#000;font-family:Arial,sans-serif}body{font-size:14px;line-height:1.55}.quiz-review{max-width:900px;margin:0 auto}.quiz-review-actions,.no-print{display:none!important}.quiz-review-title{margin-bottom:18px}.quiz-review-title h3{margin:0 0 6px;font-size:24px}.quiz-review-title p{margin:0}.quiz-review-item{padding:18px 20px;margin-top:14px;border:1px solid #999;border-radius:12px;background:#fff;break-inside:avoid;page-break-inside:avoid}.quiz-review-head{display:flex;justify-content:space-between;gap:12px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid #ccc}.quiz-review-head span,.quiz-review-head strong{font-weight:700}.review-correct .quiz-review-head strong{color:#168553}.review-wrong .quiz-review-head strong{color:#c23636}.quiz-review-question,.quiz-review-answer{margin-top:10px}.quiz-review-explanation{margin-top:12px;padding:12px 14px;border-top:1px solid #ccc;background:#fafafa;border-radius:8px}.history-review-context{display:none!important}@media print{html,body{padding:0}.quiz-review-item{break-inside:avoid;page-break-inside:avoid}}</style></head><body><div id="printRoot"></div></body></html>');
 doc.close();
 const root=doc.getElementById('printRoot');
 root.appendChild(review.cloneNode(true));
 printWindow.focus();
 setTimeout(()=>{printWindow.print();setTimeout(()=>printWindow.close(),500)},250);
};
const addReviewActions=()=>{
 const review=getReview();
 if(!review||review.querySelector('.quiz-review-actions'))return;
 const actions=document.createElement('div');
 actions.className='quiz-review-actions no-print';
 actions.innerHTML=`<button type="button" class="secondary" data-review-print>🖨 ${ui('Print review','طباعة المراجعة','הדפסת הסקירה')}</button><button type="button" class="secondary" data-review-pdf>📄 ${ui('Save as PDF','حفظ كملف PDF','שמירה כ-PDF')}</button>`;
 actions.querySelector('[data-review-print]').addEventListener('click',printReview);
 actions.querySelector('[data-review-pdf]').addEventListener('click',printReview);
 review.prepend(actions);
};
new MutationObserver(addReviewActions).observe(document.body,{childList:true,subtree:true});
addReviewActions();
})();
