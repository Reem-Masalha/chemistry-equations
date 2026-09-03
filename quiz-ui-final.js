(()=>{
'use strict';
const ui=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const sub=s=>String(s||'').replace(/([A-Za-z\)])(\d+)/g,(m,a,n)=>a+n.split('').map(d=>'₀₁₂₃₄₅₆₇₈₉'[+d]).join(''));
const norm=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)]).replace(/\s+/g,' ').trim();
const answerBank={
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
function style(){if(document.getElementById('quiz-ui-final-style'))return;const s=document.createElement('style');s.id='quiz-ui-final-style';s.textContent=`
.quiz-settings .mode-list,.quiz-settings .sp-actions,.quiz-settings .quiz-mode-actions{display:flex!important;gap:10px!important;flex-wrap:wrap!important;align-items:stretch!important}
.quiz-settings .mode-list>* ,.quiz-settings .sp-actions>* ,.quiz-settings .quiz-mode-actions>*{box-sizing:border-box!important;min-height:46px!important;height:46px!important;padding:10px 16px!important;border-radius:10px!important;font-weight:700!important;line-height:1.2!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;flex:1 1 180px!important;width:auto!important;margin:0!important;transition:none!important;transform:none!important}
.quiz-settings .mode-list label{background:var(--surface)!important;color:var(--text)!important;border:1px solid var(--line)!important}
.quiz-settings .mode-list input{margin-inline-end:7px}
.exam-top-fixed{position:fixed;top:82px;right:18px;z-index:1000;display:flex;gap:8px}
.exam-top-fixed button{min-height:44px!important}
.exam-top-fixed[hidden]{display:none!important}
.quiz-finish-tools{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:16px 0 4px}
.quiz-finish-tools button{min-height:44px!important}
.quiz-result-summary{margin:0 auto 14px;max-width:720px;padding:16px;border:1px solid var(--line);border-radius:16px;background:var(--surface);display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center}
.quiz-result-summary b{display:block;font-size:24px;color:var(--accent)}
.quiz-result-summary span{font-size:12px;color:var(--muted)}
.quiz-review-item .quiz-review-question,.quiz-review-item .quiz-review-answer{direction:ltr;text-align:left}
@media(max-width:760px){.quiz-settings .mode-list>* ,.quiz-settings .sp-actions>* ,.quiz-settings .quiz-mode-actions>*{flex-basis:100%!important}.exam-top-fixed{top:70px;right:10px}.quiz-result-summary{grid-template-columns:1fr 1fr}.quiz-result-summary>div:last-child{grid-column:1/-1}}
`;document.head.appendChild(s)}
function chemicalText(){document.querySelectorAll('.practice-equation,.practice-choice,.quiz-review-question,.quiz-review-answer,.quiz-finish-card,.quiz-result-summary').forEach(el=>{const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),a=[];while(w.nextNode())a.push(w.currentNode);a.forEach(n=>{if(n.parentElement?.tagName==='SCRIPT')return;n.nodeValue=sub(n.nodeValue)})})}
function modeButtons(){const scope=document.querySelector('.quiz-settings');if(!scope)return;const rx=/^(?:🧪\s*)?Start practice(?:\s*[→←])?$|^(?:⏱\s*)?Exam mode(?:\s*[→←])?$|^(?:🏆\s*)?Challenge(?:\s*[→←])?$/i;scope.querySelectorAll('button,a').forEach(b=>{const t=b.textContent.replace(/\s+/g,' ').trim();if(rx.test(t)){b.classList.remove('full');b.removeAttribute('style');b.style.cssText='min-height:46px;height:46px;padding:10px 16px;border-radius:10px;font-weight:700;line-height:1.2;display:inline-flex;align-items:center;justify-content:center;text-align:center;flex:1 1 180px;width:auto;margin:0;box-sizing:border-box;transition:none;transform:none'}})}
function startTarget(){const section=document.querySelector('.section.alt');if(!section)return;const y=section.getBoundingClientRect().top+window.scrollY-84;window.scrollTo({top:Math.max(0,y),behavior:'smooth'})}
function wireStart(){document.addEventListener('click',e=>{const b=e.target.closest('.quiz-settings a,.quiz-settings button');if(!b)return;const t=b.textContent.replace(/\s+/g,' ').trim();if(/^(?:🧪\s*)?Start practice(?:\s*[→←])?$/i.test(t)&&b.id!=='newQuiz'){e.preventDefault();e.stopImmediatePropagation();document.getElementById('newQuiz')?.click();setTimeout(startTarget,120)}else if(b.id==='newQuiz'){setTimeout(startTarget,120)}} ,true)}
function topCancel(){const timer=document.getElementById('timer');const exam=document.querySelector('input[name="experience"][value="quiz"]:checked');let box=document.getElementById('examTopFixed');if(!box){box=document.createElement('div');box.id='examTopFixed';box.className='exam-top-fixed';box.innerHTML=`<button type="button" class="secondary" data-top-exam-cancel>✕ ${ui('Cancel exam','إلغاء الاختبار','ביטול המבחן')}</button>`;document.body.appendChild(box);box.querySelector('[data-top-exam-cancel]').onclick=()=>document.getElementById('cancelQuiz')?.click()}const running=!!exam&&!!timer&&!timer.classList.contains('hidden')&&!document.querySelector('.quiz-finish-card');box.hidden=!running}
function resultEnhance(){const finish=document.querySelector('.quiz-finish-card');if(!finish||finish.dataset.uiFinal)return;finish.dataset.uiFinal='1';const review=document.querySelector('.quiz-review');const score=finish.querySelector('.finish-score')?.innerText||'';const text=review?.querySelectorAll('.quiz-review-item')||[];const correct=[...text].filter(x=>x.classList.contains('review-correct')).length;const total=text.length;const pct=total?Math.round(correct/total*100):'';const sum=document.createElement('div');sum.className='quiz-result-summary';sum.innerHTML=`<div><b>${score.match(/\d+/)?.[0]||0}</b><span>${ui('Points','النقاط','נקודות')}</span></div><div><b>${correct}/${total||'—'}</b><span>${ui('Correct','صحيح','נכון')}</span></div><div><b>${pct!==''?pct+'%':'—'}</b><span>${ui('Accuracy','الدقة','דיוק')}</span></div>`;finish.insertAdjacentElement('afterend',sum);if(review){const actions=document.createElement('div');actions.className='quiz-finish-tools';actions.innerHTML=`<button type="button" class="primary" data-jump-review>▾ ${ui('Review your answers','راجع إجاباتك','סקירת התשובות שלך')}</button><button type="button" class="secondary" data-jump-retry>↻ ${ui('Try again','حاول مرة أخرى','נסו שוב')}</button>`;sum.insertAdjacentElement('afterend',actions);actions.querySelector('[data-jump-review]').onclick=()=>review.scrollIntoView({behavior:'smooth',block:'start'});actions.querySelector('[data-jump-retry]').onclick=()=>finish.querySelector('#restartQuiz')?.click()}}
function observe(){new MutationObserver(()=>{modeButtons();chemicalText();topCancel();resultEnhance()}).observe(document.body,{childList:true,subtree:true});modeButtons();chemicalText();topCancel();resultEnhance()}
style();wireStart();observe();
})();
