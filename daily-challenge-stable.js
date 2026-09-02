(()=>{
'use strict';
if(!location.pathname.endsWith('learn.html')||window.__dailyStableLoaded)return;
window.__dailyStableLoaded=true;
const lang=()=>localStorage.getItem('chemistryLanguage')||'en';
const T=(en,ar,he)=>lang()==='ar'?ar:lang()==='he'?he:en;
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const KEY=()=>`chemistryDailyStable:${today()}`;
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
const norm=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)]).replace(/\s+/g,'').replace(/→|->|=/g,'>').toUpperCase().replace(/(^|>)1(?=[A-Z(])/g,'$1');
const dayNumber=()=>Math.floor((Date.parse(today()+'T00:00:00')-Date.parse('2020-01-01T00:00:00'))/86400000);
const questions=()=>Array.from({length:5},(_,i)=>BANK[(dayNumber()*5+i)%BANK.length]);
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY())||'{}')}catch{return{}}};
const write=s=>{try{localStorage.setItem(KEY(),JSON.stringify(s))}catch{}};
function mount(){
 if(document.getElementById('daily-stable'))return;
 const main=document.querySelector('main');if(!main)return;
 const qs=questions();let s=read();
 s.index=Math.max(0,Math.min(5,Number(s.index)||0));s.score=Math.max(0,Math.min(5,Number(s.score)||0));s.status=Array.isArray(s.status)?s.status.slice(0,5):[];s.answers=Array.isArray(s.answers)?s.answers.slice(0,5):[];s.started=!!s.started;s.complete=!!s.complete;s.endAt=Number(s.endAt)||0;
 const section=document.createElement('section');section.id='daily-stable';section.className='section';
 section.innerHTML=`<div class="daily-stable-card"><div class="daily-stable-head"><div><div class="daily-stable-kicker">🧪 ${T('DAILY CHEMISTRY CHALLENGE','التحدي اليومي للكيمياء','אתגר הכימיה היומי')}</div><h2>${T('5 questions · 2 minutes','٥ أسئلة · دقيقتان','5 שאלות · 2 דקות')}</h2><p>${T('One completed attempt per day.','محاولة مكتملة واحدة يوميًا.','ניסיון שהושלם פעם אחת ביום.')}</p></div><span id="dsvBadge" class="daily-stable-badge"></span></div><div id="dsvProgress" class="daily-stable-progress"></div><div class="daily-stable-meta"><span>⏱ <b id="dsvTimer">2:00</b></span><span>🏆 ${T('Score','النتيجة','ציון')} <b id="dsvScore">0</b>/5</span></div><div id="dsvEquation" class="daily-stable-equation"></div><input id="dsvInput" class="daily-stable-input" autocomplete="off" spellcheck="false" placeholder="${T('Type your balanced equation','اكتب المعادلة الموازنة','הקלידו את המשוואה המאוזנת')}"><div class="daily-stable-actions"><button id="dsvStart" class="primary" type="button">▶ ${T('Start challenge','ابدأ التحدي','התחילו אתגר')}</button><button id="dsvCheck" class="primary" type="button">${T('Check answer','تحقق من الإجابة','בדוק תשובה')}</button><button id="dsvSubmit" class="secondary" type="button">${T('Submit answer','أرسل الإجابة','שלחו תשובה')}</button><button id="dsvNext" class="primary" type="button" hidden>${T('Next question','السؤال التالي','השאלה הבאה')} →</button><button id="dsvHintBtn" class="secondary" type="button">💡 ${T('Hint','تلميح','רמז')}</button></div><div id="dsvFeedback" class="daily-stable-feedback"></div><div id="dsvNote" class="daily-stable-note"></div><div id="dsvHint" class="daily-stable-hint" hidden></div><div id="dsvResult" class="daily-stable-result" hidden></div></div>`;
 const hero=main.querySelector('.hero');if(hero)hero.insertAdjacentElement('afterend',section);else main.prepend(section);
 const $=id=>section.querySelector('#'+id),input=$('dsvInput'),start=$('dsvStart'),check=$('dsvCheck'),submit=$('dsvSubmit'),next=$('dsvNext'),hint=$('dsvHintBtn'),feedback=$('dsvFeedback'),note=$('dsvNote'),hintBox=$('dsvHint'),result=$('dsvResult'),eq=$('dsvEquation'),badge=$('dsvBadge'),progress=$('dsvProgress'),timer=$('dsvTimer'),score=$('dsvScore');
 let interval=null;
 const save=()=>write(s);
 const controls=on=>{input.disabled=!on;check.disabled=!on;submit.disabled=!on;hint.disabled=!on};
 const renderProgress=()=>progress.replaceChildren(...Array.from({length:5},(_,i)=>{const d=document.createElement('span');d.className='daily-stable-dot'+(i<s.index?' done':'')+(i===s.index&&!s.complete?' current':'');return d}));
 const finish=()=>{if(s.complete)return;clearInterval(interval);interval=null;s.complete=true;s.started=false;s.index=5;save();controls(false);next.hidden=true;start.hidden=true;badge.textContent='✓ '+T('Completed today','أكملت تحدي اليوم','הושלם היום');renderProgress();eq.textContent=T('Challenge complete!','اكتمل التحدي!','האתגר הושלם!');score.textContent=String(s.score);result.hidden=false;result.innerHTML=`<h3>${T('Your result','نتيجتك','התוצאה שלך')}: ${s.score}/5</h3><p>${s.score===5?T('Perfect score!','نتيجة كاملة!','ציון מושלם!'):T('Great work! Review your answers below.','أحسنت! راجع إجاباتك أدناه.','עבודה מצוינת! עברו על התשובות למטה.')}</p><div class="daily-review">${qs.map((q,i)=>{const a=s.answers[i]||T('No answer','لا توجد إجابة','אין תשובה');const ok=s.status[i]===1;return `<article class="daily-review-item"><b>${i+1}. ${q[0]}</b><div>${T('Your answer','إجابتك','התשובה שלך')}: <span>${a}</span></div><div>${T('Correct answer','الإجابة الصحيحة','התשובה הנכונה')}: <span>${q[1]}</span></div><div>${ok?'✓ '+T('Correct','صحيح','נכון'):'✕ '+T('Incorrect','غير صحيح','לא נכון')}</div><p>${q[2]}</p></article>`}).join('')}</div>`};
 const render=()=>{clearInterval(interval);interval=null;feedback.textContent='';hintBox.hidden=true;result.hidden=true;if(s.complete||s.index>=5){finish();return}const q=qs[s.index];eq.textContent=q[0];badge.textContent='🔥 '+T('Question '+(s.index+1)+' of 5','السؤال '+(s.index+1)+' من 5','שאלה '+(s.index+1)+' מתוך 5');score.textContent=String(s.score);renderProgress();input.value=s.answers[s.index]||'';const recorded=s.status[s.index]>0;start.hidden=s.started;controls(s.started&&!recorded);next.hidden=!recorded;note.textContent=recorded?T('Answer submitted. Continue to the next question.','تم إرسال الإجابة. انتقل إلى السؤال التالي.','התשובה נשלחה. המשיכו לשאלה הבאה.'):T('Check gives feedback only. Submit records the answer and moves on.','التحقق يعطي ملاحظات فقط. الإرسال يسجل الإجابة وينتقل للسؤال التالي.','בדיקה נותנת משוב בלבד. שליחה רושמת את התשובה וממשיכה לשאלה הבאה.');if(s.started){interval=setInterval(tick,500);tick()}};
 const tick=()=>{if(!s.started||s.complete)return;const left=Math.max(0,s.endAt-Date.now());timer.textContent=Math.floor(left/60000)+':'+String(Math.floor(left%60000/1000)).padStart(2,'0');if(left<=0)finish()};
 const startChallenge=()=>{if(s.complete){finish();return}s.started=true;s.endAt=Date.now()+120000;save();render();input.focus()};
 const checkAnswer=()=>{if(!s.started){feedback.textContent='⚠️ '+T('Start the challenge first.','⚠️ ابدأ التحدي أولًا.','⚠️ התחילו אתגר קודם.');return}const v=input.value.trim();if(!v){feedback.textContent='⚠️ '+T('Enter an answer first.','⚠️ اكتب إجابة أولًا.','⚠️ הקלידו תשובה קודם.');return}s.answers[s.index]=v;save();const ok=norm(v)===norm(qs[s.index][1]);feedback.textContent=ok?'✓ '+T('Correct! You can still edit it, or submit it.','✓ صحيح! يمكنك تعديلها أو إرسالها.','✓ נכון! עדיין אפשר לערוך או לשלוח.'): '❌ '+T('Not quite. Edit your answer and check again, or submit it.','❌ ليس تمامًا. عدّل إجابتك وتحقق مرة أخرى، أو أرسلها.','❌ לא בדיוק. ערכו ובדקו שוב, או שלחו.');note.textContent=T('Check answer only gives feedback. It does not submit or score the question.','التحقق من الإجابة يعطي ملاحظات فقط. لا يرسل السؤال ولا يحتسب النقاط.','בדיקת תשובה נותנת משוב בלבד. היא לא שולחת ולא מנקדת את השאלה.');next.hidden=false};
 const finalize=()=>{if(!s.started){feedback.textContent='⚠️ '+T('Start the challenge first.','⚠️ ابدأ التحدي أولًا.','⚠️ התחילו אתגר קודם.');return}const v=input.value.trim();if(!v){feedback.textContent='⚠️ '+T('Enter an answer first.','⚠️ اكتب إجابة أولًا.','⚠️ הקלידו תשובה קודם.');return}s.answers[s.index]=v;const ok=norm(v)===norm(qs[s.index][1]);if(!s.status[s.index]){s.status[s.index]=ok?1:2;if(ok)s.score++}if(s.index<4){s.index++;save();render();input.focus()}else{save();finish()}};
 const showHint=()=>{if(!s.started)return;hintBox.hidden=false;hintBox.textContent=qs[s.index][2]};
 start.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();startChallenge()},true);check.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();checkAnswer()},true);submit.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();finalize()},true);next.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();finalize()},true);hint.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();showHint()},true);
 render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();