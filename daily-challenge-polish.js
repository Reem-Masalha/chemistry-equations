(()=>{
'use strict';
if(!location.pathname.endsWith('learn.html'))return;
const tr=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const explain=(equation,answer)=>{
  const compact=String(answer||'').replace(/\s+/g,' ').trim();
  return tr(
    `The balanced coefficients in ${compact} make the total number of atoms of every element equal on both sides. The formulas stay unchanged; only coefficients are adjusted.`,
    `المعاملات في ${compact} تجعل العدد الكلي لذرات كل عنصر متساويًا في الطرفين. تبقى الصيغ كما هي؛ الذي يتغير هو المعاملات فقط.`,
    `המקדמים ב-${compact} משווים את המספר הכולל של האטומים מכל יסוד בשני הצדדים. הנוסחאות נשארות ללא שינוי; רק המקדמים משתנים.`
  );
};
const enhance=()=>{
  const root=document.getElementById('daily-v5');
  if(!root)return;
  const submit=root.querySelector('#dailySubmit');
  if(submit&&!submit.dataset.polished){submit.dataset.polished='1';submit.textContent='↪ '+tr('Submit & next','שלח והמשך','שלחו והמשיכו')}
  const panel=root.querySelector('#dailyReviewPanel');
  if(!panel||panel.hidden||panel.dataset.explained==='1')return;
  panel.dataset.explained='1';
  panel.querySelectorAll('div').forEach(card=>{
    if(card.querySelector('.daily-review-explanation'))return;
    const html=card.innerHTML||'';
    const m=html.match(/<b>\d+\.\s*([^<]+)<\/b>/);
    if(!m)return;
    const equation=m[1];
    const answerMatch=html.match(/Correct answer:\s*<\/span>\s*([^<]+)/i);
    const answer=answerMatch?answerMatch[1].trim():'';
    const e=document.createElement('div');
    e.className='daily-review-explanation';
    e.style.cssText='margin-top:8px;padding-top:8px;border-top:1px solid var(--line);color:var(--muted);line-height:1.45';
    e.innerHTML='<b>'+tr('Explanation','الشرح','הסבר')+':</b> '+explain(equation,answer);
    card.appendChild(e);
  });
};
enhance();
document.addEventListener('click',e=>{if(e.target.closest?.('#daily-v5'))setTimeout(enhance,0)},true);
})();
