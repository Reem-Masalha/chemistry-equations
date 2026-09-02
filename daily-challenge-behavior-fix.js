(()=>{
'use strict';
if(!location.pathname.endsWith('learn.html')||window.__dailyQuizBehaviorFix)return;
window.__dailyQuizBehaviorFix=true;
const T=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const today=()=>new Date().toISOString().slice(0,10);
const key=()=>`chemistryDailyV5:${today()}`;
const read=()=>{try{return JSON.parse(localStorage.getItem(key())||'{}')}catch{return{}}};
const write=s=>{try{localStorage.setItem(key(),JSON.stringify(s))}catch{}};
const normalize=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)]).replace(/\s+/g,'').replace(/→|->|=/g,'>').toUpperCase().replace(/(^|>)1(?=[A-Z(])/g,'$1');
const BANK=[
['H₂ + O₂ → H₂O','2H₂ + O₂ → 2H₂O','Make the product oxygen count even: use 2H₂O. Then match H.'],['Na + Cl₂ → NaCl','2Na + Cl₂ → 2NaCl','Cl₂ has two chlorine atoms, so use 2NaCl. Then match Na.'],['Mg + O₂ → MgO','2Mg + O₂ → 2MgO','O₂ has two oxygen atoms, so use 2MgO. Then match Mg.'],['N₂ + H₂ → NH₃','N₂ + 3H₂ → 2NH₃','Use 2NH₃ to match N₂. Then use 3H₂ for the six H atoms.'],['Fe + O₂ → Fe₂O₃','4Fe + 3O₂ → 2Fe₂O₃','Make six O atoms with 2Fe₂O₃. Then match Fe and O₂.'],['Zn + HCl → ZnCl₂ + H₂','Zn + 2HCl → ZnCl₂ + H₂','Zn is already balanced. ZnCl₂ needs two Cl, so use 2HCl.'],['KClO₃ → KCl + O₂','2KClO₃ → 2KCl + 3O₂','Make six O atoms with 2KClO₃, then use 3O₂.'],['Na₂O + H₂O → NaOH','Na₂O + H₂O → 2NaOH','There are two Na atoms, so use 2NaOH.'],['C₃H₈ + O₂ → CO₂ + H₂O','C₃H₈ + 5O₂ → 3CO₂ + 4H₂O','For combustion: balance C first, H second, and O last.'],['NH₃ + O₂ → NO + H₂O','4NH₃ + 5O₂ → 4NO + 6H₂O','N is already 1:1. Start with H, then finish O.'],['FeS₂ + O₂ → Fe₂O₃ + SO₂','4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂','Balance Fe first, then S. Leave O until the end.'],['Ca(OH)₂ + HCl → CaCl₂ + H₂O','Ca(OH)₂ + 2HCl → CaCl₂ + 2H₂O','Use 2HCl for two Cl atoms, then 2H₂O balances H and O.'],['Al + O₂ → Al₂O₃','4Al + 3O₂ → 2Al₂O₃','Make six O atoms with 2Al₂O₃. Then match Al.'],['CO + O₂ → CO₂','2CO + O₂ → 2CO₂','Use 2CO₂ so the product side has four O atoms.'],['P + O₂ → P₂O₅','4P + 5O₂ → 2P₂O₅','Use 2P₂O₅ for four P atoms, then 5O₂.'],['H₂ + Cl₂ → HCl','H₂ + Cl₂ → 2HCl','H₂ and Cl₂ each have two atoms, so use 2HCl.'],['Ag + S → Ag₂S','2Ag + S → Ag₂S','Ag₂S contains two Ag atoms, so use 2Ag.'],['CH₄ + O₂ → CO₂ + H₂O','CH₄ + 2O₂ → CO₂ + 2H₂O','Balance C first, H second, and O last.'],['C₂H₆ + O₂ → CO₂ + H₂O','2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O','Balance C and H first. Fourteen O atoms require 7O₂.'],['CaCO₃ → CaO + CO₂','CaCO₃ → CaO + CO₂','All elements are already balanced.'],['Cu + O₂ → CuO','2Cu + O₂ → 2CuO','O₂ needs two O atoms, so use 2CuO, then match Cu.'],['Cl₂ + NaBr → NaCl + Br₂','2NaBr + Cl₂ → 2NaCl + Br₂','Keep Br₂ together. Use 2NaBr and 2NaCl.'],['H₂O₂ → H₂O + O₂','2H₂O₂ → 2H₂O + O₂','Use 2H₂O₂ so the remaining oxygen forms O₂.'],['SO₂ + O₂ → SO₃','2SO₂ + O₂ → 2SO₃','Use 2SO₃ so each side has six O atoms.'],['NO + O₂ → NO₂','2NO + O₂ → 2NO₂','Use 2NO₂ so N is 2:2 and O is 4:4.']
];
const dayNumber=()=>Math.floor((Date.parse(today()+'T00:00:00Z')-Date.parse('2020-01-01T00:00:00Z'))/86400000);
const questions=()=>Array.from({length:5},(_,i)=>BANK[(dayNumber()*5+i)%BANK.length]);
const replace=id=>{const old=document.getElementById(id);if(!old)return null;if(old.dataset.quizFix==='1')return old;const b=old.cloneNode(true);b.dataset.quizFix='1';old.replaceWith(b);return b};
function attach(){
 const root=document.getElementById('daily-v5');if(!root)return;
 const input=root.querySelector('#dailyInput'),feedback=root.querySelector('#dailyFeedback'),note=root.querySelector('#dailyNote');
 if(!input||!feedback||!note)return;
 const check=replace('dailyCheck'),submit=replace('dailySubmit'),next=replace('dailyNext');
 if(!check||!submit||!next)return;
 const state=read();
 if(state.complete)return;
 check.addEventListener('click',e=>{
   e.preventDefault();e.stopImmediatePropagation();
   const i=Math.max(0,Math.min(4,Number(read().index)||0)),value=input.value.trim();
   if(!value){feedback.textContent='⚠️ '+T('Enter an answer first.','اكتب إجابة أولًا.','הקלידו תשובה קודם.');return}
   const correct=normalize(value)===normalize(questions()[i][1]);
   const s=read();s.answers=Array.isArray(s.answers)?s.answers.slice(0,5):[];s.answers[i]=value;write(s);
   feedback.textContent=correct?'✓ '+T('Correct! Great job.','صحيح! أحسنت.','נכון! עבודה מצוינת.'):'❌ '+T('Not quite. You can edit your answer and check again.','ليس تمامًا. يمكنك تعديل إجابتك والتحقق مرة أخرى.','לא בדיוק. אפשר לערוך את התשובה ולבדוק שוב.');
   note.textContent=correct?T('Check only gives feedback. Submit or Next question records this answer.','التحقق يعطي ملاحظات فقط. أرسل الإجابة أو انتقل للسؤال التالي لتسجيلها.','בדיקה רק נותנת משוב. שלחו או עברו לשאלה הבאה כדי לרשום את התשובה.'):T('Your answer is still editable.','ما زال بإمكانك تعديل إجابتك.','עדיין אפשר לערוך את התשובה.');
 },true);
 const finalize=e=>{
   e.preventDefault();e.stopImmediatePropagation();
   const s=read(),i=Math.max(0,Math.min(4,Number(s.index)||0)),value=input.value.trim();
   if(!value){feedback.textContent='⚠️ '+T('Enter an answer first.','اكتب إجابة أولًا.','הקלידו תשובה קודם.');return}
   if(!s.started){feedback.textContent='⚠️ '+T('Start the challenge first.','ابدأ التحدي أولًا.','התחילו אתגר קודם.');return}
   if(Array.isArray(s.status)&&s.status[i]>0)return;
   const q=questions()[i],correct=normalize(value)===normalize(q[1]);
   s.answers=Array.isArray(s.answers)?s.answers.slice(0,5):[];s.status=Array.isArray(s.status)?s.status.slice(0,5):[];
   s.answers[i]=value;s.status[i]=correct?1:2;s.score=Math.min(5,(Number(s.score)||0)+(correct?1:0));
   if(i<4){s.index=i+1;s.complete=false;s.started=true;write(s);location.reload();}
   else{s.index=5;s.complete=true;s.started=false;write(s);location.reload();}
 };
 submit.addEventListener('click',finalize,true);
 next.addEventListener('click',finalize,true);
}
const run=()=>{attach();};
run();
new MutationObserver(run).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','disabled']});
})();