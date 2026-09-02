(()=>{
'use strict';
const ui=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const getReview=()=>document.querySelector('.quiz-review');
const printReview=()=>{
 const review=getReview();
 if(!review)return;
 const printable=review.cloneNode(true);
 printable.querySelectorAll('.quiz-review-actions,.no-print').forEach(el=>el.remove());
 const title=ui('Quiz Review','مراجعة الاختبار','סקירת החידון');
 const win=window.open('','_blank','noopener,noreferrer');
 if(!win){window.print();return;}
 const css=`
 *{box-sizing:border-box}html,body{margin:0;padding:0;background:#fff;color:#000;font-family:Arial,sans-serif}body{padding:28px}
 .quiz-review{max-width:900px;margin:0 auto}.quiz-review-title{margin-bottom:22px}.quiz-review-title h3{margin:0 0 8px;font-size:24px}.quiz-review-title p{margin:0;line-height:1.55;color:#333}
 .quiz-review-item{padding:18px 20px;margin:14px 0;border:1px solid #999;border-radius:12px;background:#fff;color:#000;break-inside:avoid;page-break-inside:avoid;box-shadow:none}
 .quiz-review-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #ccc}.quiz-review-head span{font-weight:700}
 .review-correct .quiz-review-head strong{color:#168553}.review-wrong .quiz-review-head strong{color:#c23636}
 .quiz-review-question,.quiz-review-answer{margin-top:10px;line-height:1.6}.quiz-review-explanation{margin-top:12px;padding:12px 14px;border-top:1px solid #ccc;background:#f7f7f7;border-radius:8px;color:#333;line-height:1.6}
 @media print{body{padding:12mm}.quiz-review-item{break-inside:avoid;page-break-inside:avoid}}
 `;
 win.document.open();
 win.document.write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title.replace(/</g,'&lt;')+'</title><style>'+css+'</style></head><body>'+printable.outerHTML+'</body></html>');
 win.document.close();
 const doPrint=()=>{win.focus();win.print();};
 if(win.document.readyState==='complete')setTimeout(doPrint,150);
 else win.addEventListener('load',()=>setTimeout(doPrint,150),{once:true});
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
