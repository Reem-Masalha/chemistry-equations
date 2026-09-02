(()=>{
'use strict';
const ui=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const userKey=()=>{try{const u=JSON.parse(localStorage.getItem('chemistryCurrentUser')||'null');return u?.id||u?.username||'guest'}catch{return'guest'}};
const historyKey=()=>`chemistryQuizHistory:${userKey()}`;
const read=()=>{try{const h=JSON.parse(localStorage.getItem(historyKey())||'[]');return Array.isArray(h)?h:[]}catch{return[]}};
const save=h=>localStorage.setItem(historyKey(),JSON.stringify(h.slice(0,20)));
const captureReview=()=>{
 const review=document.querySelector('.quiz-review');
 if(!review)return;
 const h=read();
 if(!h.length)return;
 const clone=review.cloneNode(true);
 clone.querySelector('.quiz-review-actions')?.remove();
 h[0].reviewHtml=clone.innerHTML;
 save(h);
};
const addClearHistory=()=>{
 const list=document.getElementById('historyList');
 const card=list?.closest('.stats-card');
 if(!card||card.querySelector('[data-clear-history]'))return;
 const head=card.querySelector('.section-head');
 if(!head)return;
 const b=document.createElement('button');
 b.type='button';b.className='secondary clear-history-btn no-print';b.dataset.clearHistory='true';
 b.textContent=ui('Clear history','مسح السجل','ניקוי ההיסטוריה');head.appendChild(b);
};
const addHistoryButtons=()=>{
 const list=document.getElementById('historyList');
 if(!list||list.classList.contains('hidden'))return;
 const h=read();
 const rows=[...list.querySelectorAll('.history-row')];
 rows.forEach((row,i)=>{
  if(row.querySelector('[data-history-review]'))return;
  if(!h[i])return;
  const b=document.createElement('button');
  b.type='button';
  b.className='secondary history-review-btn';
  b.dataset.historyReview=String(i);
  b.textContent=ui('Review this quiz','مراجعة هذا الاختبار','סקירת החידון הזה');
  row.appendChild(b);
 });
};
const closeReview=()=>{
 const area=document.getElementById('scoreArea');
 if(area){
  area.innerHTML='';
  area.scrollIntoView({behavior:'smooth',block:'start'});
 }
};
const showReview=i=>{
 const record=read()[i];if(!record)return;
 const area=document.getElementById('scoreArea');if(!area)return;
 if(!record.reviewHtml){
  area.innerHTML=`<div class="history-review-panel"><div class="history-review-heading"><div class="history-review-heading-row"><div><h3>${ui('Review unavailable','المراجعة غير متاحة','הסקירה אינה זמינה')}</h3><p>${ui('Detailed review was not saved for this older quiz. New quizzes will keep their full review.','لم يتم حفظ المراجعة التفصيلية لهذا الاختبار القديم. ستحتفظ الاختبارات الجديدة بالمراجعة الكاملة.','הסקירה המפורטת לא נשמרה עבור החידון הישן הזה. חידונים חדשים ישמרו את הסקירה המלאה.')}</p></div><button type="button" class="primary close-review-btn no-print" data-close-review>✕ ${ui('Close review','إغلاق المراجعة','סגירת הסקירה')}</button></div></div></div>`;
  area.scrollIntoView({behavior:'smooth',block:'start'});return;
 }
 const d=new Date(record.date),date=d.toLocaleString();
 const mode=record.experience==='quiz'?ui('Quiz','اختبار','חידון'):ui('Practice','تدريب','תרגול');
 const difficulty=record.difficulty?record.difficulty.charAt(0).toUpperCase()+record.difficulty.slice(1):'';
 area.innerHTML=`<div class="history-review-panel"><div class="history-review-context"><div><span>${ui('Reviewing','تراجع الآن','סקירה של')}</span><strong>${mode} · ${difficulty}</strong><small>${date}</small></div><div><span>${ui('Result','النتيجة','תוצאה')}</span><strong>${record.score} · ${record.pct}%</strong><small>${record.correct}/${record.answered} ${ui('correct','صحيح','נכון')}</small></div></div><div class="history-review-heading"><div class="history-review-heading-row"><div><h3>${ui('Quiz review','مراجعة الاختبار','סקירת החידון')}</h3><p>${mode} · ${difficulty} · ${date}</p></div><button type="button" class="primary close-review-btn no-print" data-close-review>✕ ${ui('Close review','إغلاق المراجعة','סגירת הסקירה')}</button></div></div><div class="history-review-content quiz-review">${record.reviewHtml}</div></div>`;
 area.scrollIntoView({behavior:'smooth',block:'start'});
};
const clearHistory=()=>{
 if(!read().length)return;
 const ok=window.confirm(ui('Clear all quiz history? This cannot be undone.','هل تريد مسح سجل الاختبارات بالكامل؟ لا يمكن التراجع عن ذلك.','לנקות את כל היסטוריית החידונים? לא ניתן לבטל פעולה זו.'));if(!ok)return;
 localStorage.removeItem(historyKey());const list=document.getElementById('historyList');if(list){list.innerHTML='';list.classList.add('hidden')}
};
document.addEventListener('click',e=>{
 const reviewButton=e.target.closest('[data-history-review]');
 if(reviewButton){e.preventDefault();showReview(Number(reviewButton.dataset.historyReview));return}
 const closeButton=e.target.closest('[data-close-review]');
 if(closeButton){e.preventDefault();closeReview();return}
 const clearButton=e.target.closest('[data-clear-history]');
 if(clearButton){e.preventDefault();clearHistory();return}
});
const refresh=()=>{captureReview();addHistoryButtons();addClearHistory()};
const observer=new MutationObserver(()=>{addHistoryButtons();addClearHistory()});
if(document.body)observer.observe(document.body,{childList:true,subtree:true});
setInterval(refresh,1000);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh);else refresh();
})();
