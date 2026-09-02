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
 const i=0;
 const clone=review.cloneNode(true);
 clone.querySelector('.quiz-review-actions')?.remove();
 h[i].reviewHtml=clone.innerHTML;
 save(h);
};
const addHistoryButtons=()=>{
 const list=document.getElementById('historyList');
 if(!list||list.classList.contains('hidden'))return;
 const h=read();
 [...list.querySelectorAll('.history-row')].forEach((row,i)=>{
  if(row.querySelector('[data-history-review]'))return;
  const record=h[i];
  if(!record?.reviewHtml)return;
  const b=document.createElement('button');
  b.type='button';
  b.className='secondary history-review-btn';
  b.dataset.historyReview=String(i);
  b.textContent=ui('Review this quiz','مراجعة هذا الاختبار','סקירת החידון הזה');
  row.appendChild(b);
 });
};
const showReview=i=>{
 const record=read()[i];
 if(!record?.reviewHtml)return;
 const area=document.getElementById('scoreArea');
 if(!area)return;
 const d=new Date(record.date);
 const date=d.toLocaleString();
 const mode=record.experience==='quiz'?ui('Quiz','اختبار','חידון'):ui('Practice','تدريب','תרגול');
 const difficulty=record.difficulty?record.difficulty.charAt(0).toUpperCase()+record.difficulty.slice(1):'';
 const title=ui('Quiz review','مراجعة الاختبار','סקירת החידון');
 const subtitle=ui(`${mode} · ${difficulty} · ${date}`,`${mode} · ${difficulty} · ${date}`,`${mode} · ${difficulty} · ${date}`);
 area.innerHTML=`<div class="history-review-panel"><div class="history-review-context"><div><span>${ui('Reviewing','تراجع الآن','סקירה של')}</span><strong>${mode} · ${difficulty}</strong><small>${date}</small></div><div><span>${ui('Result','النتيجة','תוצאה')}</span><strong>${record.score} · ${record.pct}%</strong><small>${record.correct}/${record.answered} ${ui('correct','صحيح','נכון')}</small></div></div><div class="history-review-heading"><h3>${title}</h3><p>${subtitle}</p></div><div class="history-review-content quiz-review">${record.reviewHtml}</div></div>`;
 area.scrollIntoView({behavior:'smooth',block:'start'});
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-history-review]');if(b){e.preventDefault();showReview(Number(b.dataset.historyReview))}});
const observer=new MutationObserver(()=>{captureReview();addHistoryButtons()});
observer.observe(document.body,{childList:true,subtree:true});
setInterval(()=>{captureReview();addHistoryButtons()},500);
})();
