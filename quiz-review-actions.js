(()=>{
'use strict';
const ui=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const getReview=()=>document.querySelector('.quiz-review');
const printReview=()=>{
  const review=getReview();
  if(!review)return;
  const w=window.open('','_blank');
  if(!w){alert(ui('Please allow pop-ups to print the review.','يرجى السماح بالنوافذ المنبثقة لطباعة المراجعة.','יש לאפשר חלונות קופצים כדי להדפיס את הסקירה.'));return}
  const clone=review.cloneNode(true);
  clone.querySelector('.quiz-review-actions')?.remove();
  const css=[...document.querySelectorAll('link[rel="stylesheet"]')].map(x=>x.href).filter(Boolean).map(h=>`<link rel="stylesheet" href="${h}">`).join('');
  w.document.open();
  w.document.write(`<!doctype html><html lang="${document.documentElement.lang||'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${ui('Quiz Review','مراجعة الاختبار','סקירת החידון')}</title>${css}<style>body{background:#fff!important;color:#000!important;padding:24px}.quiz-review{max-width:900px;margin:0 auto}.quiz-review-item{break-inside:avoid;page-break-inside:avoid}@media print{body{padding:0}}</style></head><body>${clone.outerHTML}<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),250));<\/script></body></html>`);
  w.document.close();
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
