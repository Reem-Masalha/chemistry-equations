(()=>{
'use strict';
const ui=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const getReview=()=>document.querySelector('.quiz-review');
const printReview=()=>{
 const review=getReview();
 if(!review)return;
 const old=document.getElementById('quizPrintFrame');
 if(old)old.remove();
 const frame=document.createElement('iframe');
 frame.id='quizPrintFrame';
 frame.setAttribute('aria-hidden','true');
 frame.style.cssText='position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;';
 document.body.appendChild(frame);
 const doc=frame.contentDocument;
 const clone=review.cloneNode(true);
 clone.querySelector('.quiz-review-actions')?.remove();
 const css=[...document.querySelectorAll('link[rel="stylesheet"]')].map(x=>x.href).filter(Boolean).map(h=>`<link rel="stylesheet" href="${h}">`).join('');
 doc.open();
 doc.write(`<!doctype html><html lang="${document.documentElement.lang||'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${css}<style>html,body{background:#fff!important;color:#000!important;margin:0;padding:0}.quiz-review{max-width:900px;margin:0 auto;padding:24px}.quiz-review-item{break-inside:avoid;page-break-inside:avoid}.no-print,.quiz-review-actions{display:none!important}@media print{.quiz-review{padding:0}body{background:#fff!important}}</style></head><body>${clone.outerHTML}</body></html>`);
 doc.close();
 const doPrint=()=>{try{frame.contentWindow.focus();frame.contentWindow.print()}catch(e){window.print()}setTimeout(()=>frame.remove(),1000)};
 setTimeout(doPrint,400);
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
