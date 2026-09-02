(()=>{
'use strict';
if(!location.pathname.endsWith('learn.html')||window.__dailyBehaviorFix)return;
window.__dailyBehaviorFix=true;
const T=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const BANK=[
['H₂ + O₂ → H₂O','2H₂ + O₂ → 2H₂O','Balance H first: put 2 before H₂O. Oxygen then matches.'],
['Na + Cl₂ → NaCl','2Na + Cl₂ → 2NaCl','Cl₂ has two chlorine atoms, so use 2NaCl, then match sodium.'],
['Mg + O₂ → MgO','2Mg + O₂ → 2MgO','O₂ has two oxygen atoms, so use 2MgO, then 2Mg.'],
['N₂ + H₂ → NH₃','N₂ + 3H₂ → 2NH₃','Use 2NH₃ to match N₂, then use 3H₂ for hydrogen.'],
['Fe + O₂ → Fe₂O₃','4Fe + 3O₂ → 2Fe₂O₃','Use 2Fe₂O₃ to make six oxygen atoms, then match iron and O₂.'],
['Zn + HCl → ZnCl₂ + H₂','Zn + 2HCl → ZnCl₂ + H₂','Zn is already balanced. Use 2HCl to supply two chlorine atoms.'],
['KClO₃ → KCl + O₂','2KClO₃ → 2KCl + 3O₂','Make six oxygen atoms with 2KClO₃, then use 3O₂.'],
['Na₂O + H₂O → NaOH','Na₂O + H₂O → 2NaOH','There are two sodium atoms, so use 2NaOH.'],
['C₃H₈ + O₂ → CO₂ + H₂O','C₃H₈ + 5O₂ → 3CO₂ + 4H₂O','For combustion, balance C first, H second, and O last.'],
['NH₃ + O₂ → NO + H₂O','4NH₃ + 5O₂ → 4NO + 6H₂O','Balance H first, then finish oxygen.'],
['FeS₂ + O₂ → Fe₂O₃ + SO₂','4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂','Balance Fe first, then S, and leave O until last.'],
['Ca(OH)₂ + HCl → CaCl₂ + H₂O','Ca(OH)₂ + 2HCl → CaCl₂ + 2H₂O','Use 2HCl for Cl₂, then 2H₂O balances H and O.'],
['Al + O₂ → Al₂O₃','4Al + 3O₂ → 2Al₂O₃','Make six O atoms with 2Al₂O₃, then match aluminum.'],
['CO + O₂ → CO₂','2CO + O₂ → 2CO₂','Use 2CO₂ so carbon and oxygen balance.'],
['P + O₂ → P₂O₅','4P + 5O₂ → 2P₂O₅','Use 2P₂O₅ for four phosphorus atoms, then 5O₂.'],
['H₂ + Cl₂ → HCl','H₂ + Cl₂ → 2HCl','Both reactants contain two atoms, so use 2HCl.'],
['Ag + S → Ag₂S','2Ag + S → Ag₂S','Ag₂S contains two Ag atoms, so use 2Ag.'],
['CH₄ + O₂ → CO₂ + H₂O','CH₄ + 2O₂ → CO₂ + 2H₂O','Balance C first, H second, and O last.'],
['C₂H₆ + O₂ → CO₂ + H₂O','2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O','Balance C and H first, then oxygen.'],
['CaCO₃ → CaO + CO₂','CaCO₃ → CaO + CO₂','All elements are already balanced, so all coefficients are 1.'],
['Cu + O₂ → CuO','2Cu + O₂ → 2CuO','Use 2CuO to match O₂, then use 2Cu.'],
['Cl₂ + NaBr → NaCl + Br₂','2NaBr + Cl₂ → 2NaCl + Br₂','Keep Br₂ together; use 2NaBr and 2NaCl.'],
['H₂O₂ → H₂O + O₂','2H₂O₂ → 2H₂O + O₂','Use 2H₂O₂ so the remaining oxygen forms O₂.'],
['SO₂ + O₂ → SO₃','2SO₂ + O₂ → 2SO₃','Use 2SO₃ so sulfur and oxygen balance.'],
['NO + O₂ → NO₂','2NO + O₂ → 2NO₂','Use 2NO₂ so nitrogen is 2:2 and oxygen is 4:4.']
];
const normalize=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)]).replace(/\s+/g,'').replace(/→|->|=/g,'>').toUpperCase().replace(/(^|>)1(?=[A-Z(])/g,'$1');
const dayNumber=()=>Math.floor((Date.parse(today()+'T00:00:00')-Date.parse('2020-01-01T00:00:00'))/86400000);
const QUESTIONS=()=>Array.from({length:5},(_,i)=>BANK[(dayNumber()*5+i)%BANK.length]);
const key=()=>`chemistryDailyStable:${today()}`;
const read=()=>{try{return JSON.parse(localStorage.getItem(key())||'{}')}catch{return{}}};
const write=s=>{try{localStorage.setItem(key(),JSON.stringify(s))}catch{}};
const questionIndex=()=>{const s=read();return Math.max(0,Math.min(4,Number(s.index)||0))};
const replaceButton=id=>{const old=document.getElementById(id);if(!old||old.dataset.behaviorFix)return null;const b=old.cloneNode(true);b.dataset.behaviorFix='1';old.replaceWith(b);return b};
function attach(){
 const root=document.getElementById('daily-stable');if(!root||root.dataset.behaviorFixed)return;
 const input=root.querySelector('#dsvInput'),feedback=root.querySelector('#dsvFeedback'),note=root.querySelector('#dsvNote');
 const check=replaceButton('dsvCheck'),submit=replaceButton('dsvSubmit'),next=replaceButton('dsvNext');
 if(!input||!feedback||!note||!check||!submit||!next)return;
 root.dataset.behaviorFixed='1';
 next.hidden=false;
 check.addEventListener('click',e=>{
   e.preventDefault();e.stopImmediatePropagation();
   const i=questionIndex(),q=QUESTIONS()[i],value=input.value.trim();
   if(!value){feedback.textContent='⚠️ '+T('Enter an answer first.','اكتب إجابة أولًا.','הקלידו תשובה קודם.');return}
   const correct=normalize(value)===normalize(q[1]);
   const s=read();s.answers=Array.isArray(s.answers)?s.answers.slice(0,5):[];s.answers[i]=value;write(s);
   feedback.textContent=correct?'✓ '+T('Correct! Great job.','صحيح! أحسنت.','נכון! עבודה מצוינת.'):'❌ '+T('Not quite. Edit your answer and check again, or submit it.','ليس تمامًا. عدّل إجابتك وتحقق مرة أخرى، أو أرسلها.','לא בדיוק. ערכו את התשובה ובדקו שוב, או שלחו אותה.');
   note.textContent=correct?T('Checked only — your answer is still editable. Submit or choose Next question to record it and continue.','تم التحقق فقط — ما زال بإمكانك تعديل الإجابة. أرسلها أو اختر السؤال التالي لتسجيلها والمتابعة.','נבדק בלבד — עדיין אפשר לערוך. שלחו או עברו לשאלה הבאה כדי לרשום ולהמשיך.'):T('Checked only — your answer is still editable.','تم التحقق فقط — ما زال بإمكانك تعديل الإجابة.','נבדק בלבד — עדיין אפשר לערוך.');
 },true);
 const finalize=e=>{
   e.preventDefault();e.stopImmediatePropagation();
   const s=read(),i=questionIndex(),value=input.value.trim();
   if(!value){feedback.textContent='⚠️ '+T('Enter an answer first.','اكتب إجابة أولًا.','הקלידו תשובה קודם.');return}
   if(s.status&&s.status[i]>0)return;
   const q=QUESTIONS()[i],correct=normalize(value)===normalize(q[1]);
   s.answers=Array.isArray(s.answers)?s.answers.slice(0,5):[];s.status=Array.isArray(s.status)?s.status.slice(0,5):[];
   s.answers[i]=value;s.status[i]=correct?1:2;
   s.score=Math.min(5,(Number(s.score)||0)+(correct?1:0));
   if(i<4){s.index=i+1;s.complete=false;s.started=true;write(s);location.reload()}
   else{s.index=5;s.complete=true;s.started=false;write(s);location.reload()}
 };
 submit.addEventListener('click',finalize,true);
 next.addEventListener('click',finalize,true);
}
function addReview(){
 const root=document.getElementById('daily-stable');if(!root)return;
 const result=root.querySelector('#dsvResult');if(!result||result.hidden||result.querySelector('#dsvReviewBtn'))return;
 const state=read();if(!state.complete)return;
 const btn=document.createElement('button');btn.id='dsvReviewBtn';btn.className='primary';btn.type='button';btn.textContent='📋 '+T('Review daily quiz answers','مراجعة إجابات الاختبار اليومي','סקירת תשובות החידון היומי');
 result.appendChild(btn);
 btn.addEventListener('click',()=>{
   result.querySelector('.daily-stable-review')?.remove();
   const review=document.createElement('div');review.className='daily-stable-review';review.style.cssText='display:grid;gap:12px;margin-top:16px;text-align:start';
   const saved=read();const answers=Array.isArray(saved.answers)?saved.answers:[];const status=Array.isArray(saved.status)?saved.status:[];
   QUESTIONS().forEach((q,n)=>{
     const item=document.createElement('div');item.style.cssText='padding:14px;border:1px solid var(--line);border-radius:13px;background:var(--surface-2,#f7f9fc)';
     const ok=status[n]===1;
     const title=document.createElement('div');title.textContent=(ok?'✓ ':'✕ ')+T('Question '+(n+1),'السؤال '+(n+1),'שאלה '+(n+1));title.style.fontWeight='900';
     const eq=document.createElement('div');eq.textContent=q[0];eq.style.cssText='direction:ltr;text-align:left;font-weight:900;margin-top:7px';
     const ua=document.createElement('div');ua.textContent=T('Your answer: ','إجابتك: ','התשובה שלך: ')+(answers[n]||T('No answer','لم تتم الإجابة','לא ניתנה תשובה'));ua.style.cssText='direction:ltr;text-align:left;margin-top:7px;word-break:break-word';
     const ca=document.createElement('div');ca.textContent=T('Correct answer: ','الإجابة الصحيحة: ','התשובה הנכונה: ')+q[1];ca.style.cssText='direction:ltr;text-align:left;margin-top:5px;word-break:break-word';
     const ex=document.createElement('div');ex.textContent=T('Explanation: ','الشرح: ','הסבר: ')+q[2];ex.style.cssText='margin-top:8px;color:var(--muted)';
     item.append(title,eq,ua,ca,ex);review.appendChild(item);
   });
   result.appendChild(review);review.scrollIntoView({behavior:'smooth',block:'nearest'});
 });
}
const run=()=>{attach();addReview()};
run();new MutationObserver(run).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','disabled']});
})();
