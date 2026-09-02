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
  const i=h.findIndex(x=>x.date===h[0].date);
  if(i<0||h[i].reviewHtml)return;
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
    b.textContent=ui('Review','مراجعة','סקירה');
    row.appendChild(b);
  });
};
const showReview=i=>{
  const record=read()[i];
  if(!record?.reviewHtml)return;
  const area=document.getElementById('scoreArea');
  if(!area)return;
  area.innerHTML=`<div class="quiz-review">${record.reviewHtml}</div>`;
  area.scrollIntoView({behavior:'smooth',block:'start'});
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-history-review]');if(b){e.preventDefault();showReview(Number(b.dataset.historyReview))}});
const observer=new MutationObserver(()=>{captureReview();addHistoryButtons()});
observer.observe(document.body,{childList:true,subtree:true});
setInterval(()=>{captureReview();addHistoryButtons()},500);
})();
