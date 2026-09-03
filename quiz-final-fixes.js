(()=>{
'use strict';
const ui=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const norm=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)]).replace(/\s+/g,' ').trim().replace(/=>|->|⟶|⇒|➜|⟹|⟾/g,'→');
const chem=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)]).replace(/([A-Za-z\)])(\d+)/g,(m,a,n)=>a+n.split('').map(x=>'₀₁₂₃₄₅₆₇₈₉'[Number(x)]).join(''));
const bank={
'H2 + O2 → H2O':['2H2 + O2 → 2H2O','Hydrogen and oxygen must both be equal.'],
'Na + Cl2 → NaCl':['2Na + Cl2 → 2NaCl','Cl₂ has two chlorine atoms, so use 2 NaCl.'],
'Mg + O2 → MgO':['2Mg + O2 → 2MgO','O₂ contains two oxygen atoms.'],
'N2 + H2 → NH3':['N2 + 3H2 → 2NH3','Balance nitrogen first, then hydrogen.'],
'Cl2 + H2 → HCl':['H2 + Cl2 → 2HCl','Two chlorine atoms require two HCl molecules.'],
'Fe + S → FeS':['Fe + S → FeS','One Fe and one S already match.'],
'Fe + O2 → Fe2O3':['4Fe + 3O2 → 2Fe2O3','Use six oxygen atoms on each side.'],
'Ca + H2O → Ca(OH)2 + H2':['Ca + 2H2O → Ca(OH)2 + H2','Two H₂O molecules provide two oxygen atoms.'],
'Zn + HCl → ZnCl2 + H2':['Zn + 2HCl → ZnCl2 + H2','ZnCl₂ requires two chlorine atoms.'],
'CH4 + O2 → CO2 + H2O':['CH4 + 2O2 → CO2 + 2H2O','Balance carbon, then hydrogen, then oxygen.'],
'Na2O + H2O → NaOH':['Na2O + H2O → 2NaOH','Two sodium atoms require two NaOH.'],
'KClO3 → KCl + O2':['2KClO3 → 2KCl + 3O2','Use six oxygen atoms on both sides.'],
'C3H8 + O2 → CO2 + H2O':['C3H8 + 5O2 → 3CO2 + 4H2O','For combustion, balance C, then H, then O.'],
'C2H5OH + O2 → CO2 + H2O':['C2H5OH + 3O2 → 2CO2 + 3H2O','Balance carbon and hydrogen before oxygen.'],
'NH3 + O2 → NO + H2O':['4NH3 + 5O2 → 4NO + 6H2O','Balance nitrogen, hydrogen, then oxygen.'],
'FeS2 + O2 → Fe2O3 + SO2':['4FeS2 + 11O2 → 2Fe2O3 + 8SO2','Balance Fe, then S, then O.'],
'C4H10 + O2 → CO2 + H2O':['2C4H10 + 13O2 → 8CO2 + 10H2O','Balance C and H, then use oxygen to finish.'],
'KMnO4 + HCl → KCl + MnCl2 + H2O + Cl2':['2KMnO4 + 16HCl → 2KCl + 2MnCl2 + 8H2O + 5Cl2','Balance K and Mn first, then H, Cl, and O.']};
const key='chemistryExamReviewSession';
const read=()=>{try{return JSON.parse(sessionStorage.getItem(key)||'[]')}catch{return[]}};
const write=a=>{try{sessionStorage.setItem(key,JSON.stringify(a))}catch{}};
const equationFromCoefficients=(raw,values)=>{let i=0;return norm(raw).split('→').map(side=>side.split('+').map(part=>{const f=part.trim(),c=Number(values[i++]||0);return `${c===1?'':c}${f}`}).join(' + ')).join(' → ')};
function recordChoice(btn){const card=btn.closest('.practice-question-card');if(!card)return;const q=norm(card.querySelector('.practice-equation')?.textContent||'');if(!bank[q])return;const answer=decodeURIComponent(btn.dataset.choice||'');const a=read();a.push({question:q,user:answer,correct:bank[q][0],hint:bank[q][1]});write(a)}
function recordTyped(card){const q=norm(card.querySelector('.practice-equation')?.textContent||'');if(!bank[q])return;const vals=[...card.querySelectorAll('[data-coef]')].map(x=>Number(x.value||0));if(!vals.some(Boolean))return;const answer=equationFromCoefficients(q,vals);const a=read();a.push({question:q,user:answer,correct:bank[q][0],hint:bank[q][1]});write(a)}
function clearPreviousDuplicate(){const old=document.querySelector('.quiz-result-review');if(old)old.remove()}
function addExamReview(){const records=read();if(!records.length)return;const area=document.getElementById('scoreArea');if(!area)return;clearPreviousDuplicate();const wrap=document.createElement('section');wrap.className='quiz-result-review quiz-exam-review';const wrong=records.filter(x=>norm(x.user)!==norm(x.correct));wrap.innerHTML=`<div class="quiz-result-review-title"><h3>${ui('Review your exam','راجع الاختبار','סקירת המבחן')}</h3><p>${ui(`${wrong.length} question${wrong.length===1?'':'s'} need review.` ,`يحتاج ${wrong.length} سؤال للمراجعة.` ,`צריך לבדוק ${wrong.length} שאלות.`)}</p></div><div class="quiz-exam-review-list"></div><div class="quiz-result-review-next"><button type="button" class="secondary" data-exam-retry>↻ ${ui('Try again','حاول مرة أخرى','נסו שוב')}</button></div>`;
const list=wrap.querySelector('.quiz-exam-review-list');list.innerHTML=records.map((r,i)=>{const ok=norm(r.user)===norm(r.correct);return `<article class="quiz-result-review-item ${ok?'is-correct':'is-wrong'}"><div class="quiz-result-review-head"><b>${i+1}. ${ok?'✓':'✕'}</b><strong>${ok?ui('Correct','صحيح','נכון'):ui('Needs review','يحتاج مراجعة','דורש בדיקה')}</strong></div><div><b>${chem(r.question)}</b></div><div class="quiz-result-review-answer"><b>${ui('Your answer','إجابتك','התשובה שלך')}:</b> <span dir="ltr">${chem(r.user||ui('No answer','لا توجد إجابة','אין תשובה'))}</span></div><div class="quiz-result-review-answer"><b>${ui('Correct answer','الإجابة الصحيحة','התשובה הנכונה')}:</b> <span dir="ltr">${chem(r.correct)}</span></div><div class="quiz-result-review-explanation"><b>${ui('Explanation','الشرح','הסבר')}:</b> ${r.hint}</div></article>`}).join('');
wrap.querySelector('[data-exam-retry]').onclick=()=>{sessionStorage.removeItem(key);document.getElementById('newQuiz')?.click();setTimeout(()=>document.querySelector('.section.alt')?.scrollIntoView({behavior:'smooth',block:'start'}),50)};area.appendChild(wrap);wrap.scrollIntoView({behavior:'smooth',block:'start'});sessionStorage.removeItem(key)}
function addTopExamControls(){let host=document.querySelector('.section.alt .section-head');if(!host)return;let box=document.getElementById('examTopControls');if(!box){box=document.createElement('div');box.id='examTopControls';box.className='exam-top-controls';box.innerHTML=`<button type="button" class="secondary" data-top-cancel>✕ ${ui('Cancel exam','إلغاء الاختبار','ביטול המבחן')}</button>`;host.parentElement.insertBefore(box,host)}const running=!!document.querySelector('#timer:not(.hidden)')&&!document.querySelector('.quiz-result-review');box.hidden=!running;box.querySelector('[data-top-cancel]').onclick=()=>document.getElementById('cancelQuiz')?.click();}
function finishObserver(){const score=document.getElementById('scoreArea');if(!score)return;const hasResult=!!score.querySelector('.score-animation');if(hasResult){addExamReview();document.getElementById('examTopControls')?.setAttribute('hidden','');}}
function injectStyles(){if(document.getElementById('quiz-final-fixes-style'))return;const s=document.createElement('style');s.id='quiz-final-fixes-style';s.textContent=`
.experience-options,.type-options,.mode-list{display:flex;gap:10px;flex-wrap:wrap}
.experience-options label,.type-options label,.mode-list label{min-height:42px;padding:10px 14px;border:1px solid var(--line);border-radius:10px;background:var(--surface);font-weight:700;display:flex;align-items:center;gap:7px;box-sizing:border-box}
#newQuiz{min-height:44px}
.exam-top-controls{display:flex;justify-content:flex-end;gap:10px;margin:0 0 12px;position:sticky;top:8px;z-index:20}
.exam-top-controls[hidden]{display:none!important}
.quiz-result-review{margin-top:18px;padding-top:6px}
.quiz-result-review-title h3{margin:0 0 5px}.quiz-result-review-title p{margin:0;color:var(--muted)}
.quiz-exam-review-list{margin-top:10px}.quiz-result-review-item{padding:14px 15px;margin-top:10px;border:1px solid var(--line);border-radius:12px;background:var(--surface-2,#f7f9fc)}
.quiz-result-review-item.is-correct{border-inline-start:4px solid #168553}.quiz-result-review-item.is-wrong{border-inline-start:4px solid #c23636}.quiz-result-review-head{display:flex;justify-content:space-between;gap:10px;margin-bottom:9px}.quiz-result-review-answer{margin-top:7px}.quiz-result-review-explanation{margin-top:10px;padding:10px 12px;border-radius:9px;background:var(--surface,#fff);line-height:1.5}.quiz-result-review-next{margin-top:12px;display:flex;gap:10px;flex-wrap:wrap}
.practice-equation,.practice-choice,.feedback-correct-answer{font-variant-numeric:normal}
@media(max-width:760px){.experience-options,.type-options,.mode-list{display:grid;grid-template-columns:1fr}.experience-options label,.type-options label,.mode-list label{width:100%}.exam-top-controls{position:sticky;top:4px}.quiz-result-review-item{font-size:13px}}
`;document.head.appendChild(s)}
function fixEquationDigits(){document.querySelectorAll('.practice-equation,.practice-choice,.feedback-correct-answer,.quiz-review-question,.quiz-review-answer').forEach(el=>{if(el.dataset.chemFormatted)return;el.dataset.chemFormatted='1';const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(n=>{n.nodeValue=chem(n.nodeValue)})})}
function bind(){document.addEventListener('click',e=>{const c=e.target.closest('.practice-choice');if(c)recordChoice(c);const submit=e.target.closest('.practice-submit');if(submit)recordTyped(submit.closest('.practice-question-card'));const p=e.target.closest('#newQuiz');if(p){sessionStorage.removeItem(key);setTimeout(()=>document.querySelector('.section.alt')?.scrollIntoView({behavior:'smooth',block:'start'}),80)}});}
injectStyles();bind();new MutationObserver(()=>{fixEquationDigits();addTopExamControls();finishObserver()}).observe(document.body,{childList:true,subtree:true});fixEquationDigits();addTopExamControls();finishObserver();
})();
