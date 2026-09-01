(()=>{
'use strict';
if(!location.pathname.endsWith('learn.html')||window.__dailyStableLoaded)return;
window.__dailyStableLoaded=true;
const lang=()=>localStorage.getItem('chemistryLanguage')||'en';
const T=(en,ar,he)=>lang()==='ar'?ar:lang()==='he'?he:en;
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
const questions=()=>Array.from({length:5},(_,i)=>BANK[(dayNumber()*5+i)%BANK.length]);
const key=()=>`chemistryDailyStable:${today()}`;
const read=()=>{try{return JSON.parse(localStorage.getItem(key())||'{}')}catch{return{}}};
const write=s=>{try{localStorage.setItem(key(),JSON.stringify(s))}catch{}};
const isAdminReplay=()=>{try{return sessionStorage.getItem('chemistryAdminReplayGranted')==='1'}catch{return false}};
const consumeAdminReplay=()=>{try{sessionStorage.removeItem('chemistryAdminReplayGranted')}catch{}};
function clearChallengeState(){try{Object.keys(localStorage).filter(k=>/^(chemistrydaily|dailychallenge|dailystreak|dailyxp|daily-home-challenge|dailyhomechallenge|dhc|dc5|dc6|dailychallengecard|ce3-daily-card|real-daily)/i.test(k)).forEach(k=>localStorage.removeItem(k));localStorage.removeItem(key())}catch{}}
function mount(){
 if(document.getElementById('daily-stable'))return;
 const main=document.querySelector('main');if(!main)return;
 const adminReplay=isAdminReplay();
 if(adminReplay){clearChallengeState();consumeAdminReplay()}
 const qs=questions();
 let state=read();
 let index=Math.max(0,Math.min(5,Number(state.index)||0));
 let score=Math.max(0,Math.min(5,Number(state.score)||0));
 let started=!!state.started;
 let complete=!!state.complete;
 let endAt=Number(state.endAt)||0;
 let status=Array.isArray(state.status)?state.status.slice(0,5):[];
 let answers=Array.isArray(state.answers)?state.answers.slice(0,5):[];
 let timer=null;
 const section=document.createElement('section');section.id='daily-stable';section.className='section';
 section.innerHTML=`<div class="daily-stable-card"><div class="daily-stable-head"><div><div class="daily-stable-kicker">🧪 ${T('DAILY CHEMISTRY CHALLENGE','التحدي اليومي للكيمياء','אתגר הכימיה היומי')}</div><h2>${T('5 questions · 2 minutes','٥ أسئلة · دقيقتان','5 שאלות · 2 דקות')}</h2><p>${T('One completed attempt per day.','محاولة مكتملة واحدة يوميًا.','ניסיון שהושלם פעם אחת ביום.')}</p></div><span id="dsvBadge" class="daily-stable-badge"></span></div><div id="dsvProgress" class="daily-stable-progress"></div><div class="daily-stable-meta"><span>⏱ <b id="dsvTimer">2:00</b></span><span>🏆 ${T('Score','النتيجة','ציון')} <b id="dsvScore">0</b>/5</span></div><div id="dsvEquation" class="daily-stable-equation"></div><input id="dsvInput" class="daily-stable-input" autocomplete="off" spellcheck="false" placeholder="${T('Type your balanced equation','اكتب المعادلة الموازنة','הקלידו את המשוואה המאוזנת')}"><div class="daily-stable-actions"><button id="dsvStart" class="primary" type="button">▶ ${T('Start challenge','ابدأ التحدي','התחילו אתגר')}</button><button id="dsvCheck" class="primary" type="button">${T('Check answer','تحقق من الإجابة','בדוק תשובה')}</button><button id="dsvSubmit" class="secondary" type="button">${T('Submit answer','أرسل الإجابة','שלחו תשובה')}</button><button id="dsvNext" class="primary" type="button" hidden>${T('Next question','السؤال التالي','השאלה הבאה')} →</button><button id="dsvHintBtn" class="secondary" type="button">💡 ${T('Hint','تلميح','רמז')}</button></div><div id="dsvFeedback" class="daily-stable-feedback"></div><div id="dsvNote" class="daily-stable-note"></div><div id="dsvHint" class="daily-stable-hint" hidden></div><div id="dsvResult" class="daily-stable-result" hidden></div></div>`;
 const hero=main.querySelector('.hero');
 if(hero)hero.insertAdjacentElement('afterend',section);else{const curriculum=main.querySelector('#course-map');if(curriculum)curriculum.insertAdjacentElement('afterend',section);else main.prepend(section)}
 const $=id=>section.querySelector('#'+id);
 const equation=$('dsvEquation'),input=$('dsvInput'),startButton=$('dsvStart'),checkButton=$('dsvCheck'),submitButton=$('dsvSubmit'),nextButton=$('dsvNext'),hintButton=$('dsvHintBtn'),feedback=$('dsvFeedback'),note=$('dsvNote'),hintBox=$('dsvHint'),result=$('dsvResult'),badge=$('dsvBadge'),progress=$('dsvProgress'),timerLabel=$('dsvTimer'),scoreLabel=$('dsvScore');
 function save(){write({index,score,started,complete,endAt,status,answers})}
 function resetHint(){hintBox.hidden=true;hintBox.textContent=''}
 function render(){
   resetHint();feedback.textContent='';result.hidden=true;
   if(complete||index>=5){finish();return}
   const q=qs[index];equation.textContent=q[0];badge.textContent='🔥 '+T('Question '+(index+1)+' of 5','السؤال '+(index+1)+' من 5','שאלה '+(index+1)+' מתוך 5');scoreLabel.textContent=String(score);
   progress.replaceChildren(...Array.from({length:5},(_,n)=>{const d=document.createElement('span');d.className='daily-stable-dot'+(n<index?' done ':'')+(n===index?' current':'');return d}));
   const recorded=status[index]>0;input.value=answers[index]||'';input.disabled=!started||recorded;checkButton.disabled=!started||recorded;submitButton.disabled=!started||recorded;hintButton.disabled=!started;nextButton.hidden=!recorded;startButton.hidden=started;
   note.textContent=recorded?T('Answer recorded. Continue to the next question.','تم تسجيل الإجابة. انتقل إلى السؤال التالي.','התשובה נרשמה. עברו לשאלה הבאה.'):T('Check your answer or submit it when ready.','تحقق من إجابتك أو أرسلها عندما تكون مستعدًا.','בדקו את התשובה או שלחו אותה כשתהיו מוכנים.');
   if(!started){input.disabled=true;checkButton.disabled=true;submitButton.disabled=true;hintButton.disabled=true}
 }
 function startChallenge(){if(complete)return;if(!started){started=true;endAt=Date.now()+120000;save();render();timer=setInterval(tick,500);tick();input.focus()}}
 function tick(){if(!started||complete)return;const r=Math.max(0,endAt-Date.now());timerLabel.textContent=Math.floor(r/60000)+':'+String(Math.floor((r%60000)/1000)).padStart(2,'0');if(r<=0)finish()}
 function evaluate(finalSubmission){if(!started||complete||status[index]>0)return;const value=input.value.trim();if(!value){feedback.textContent='⚠️ '+T('Enter an answer first.','اكتب إجابة أولًا.','הקלידו תשובה קודם.');return}answers[index]=value;const correct=normalize(value)===normalize(qs[index][1]);if(correct){status[index]=1;score++;feedback.textContent='✓ '+T('Correct! Great job.','صحيح! أحسنت.','נכון! עבודה מצוינת.');note.textContent=T('Correct. Continue when ready.','إجابة صحيحة. انتقل عندما تكون مستعدًا.','נכון. המשיכו כשתהיו מוכנים.')}else if(finalSubmission){status[index]=2;feedback.textContent='✕ '+T('Answer submitted. No point added.','تم إرسال الإجابة. لم تُضف نقطة.','התשובה נשלחה. לא נוספה נקודה.');note.textContent=T('Final answer recorded.','تم تسجيل الإجابة النهائية.','התשובה הסופית נרשמת.')}else{feedback.textContent='❌ '+T('Not quite. Edit your answer and check again, or submit it.','ليس تمامًا. عدّل إجابتك وتحقق مرة أخرى، أو أرسلها.','לא בדיוק. ערכו ובדקו שוב, או שלחו.');save();return}save();input.disabled=true;checkButton.disabled=true;submitButton.disabled=true;nextButton.hidden=false}
 function nextQuestion(){if(complete||status[index]===0)return;if(index<4){index++;save();render();if(started){input.disabled=false;checkButton.disabled=false;submitButton.disabled=false;hintButton.disabled=false;input.focus()}}else finish()}
 function finish(){if(complete)return;clearInterval(timer);timer=null;complete=true;started=false;save();input.disabled=true;checkButton.disabled=true;submitButton.disabled=true;nextButton.hidden=true;startButton.hidden=true;hintButton.disabled=true;badge.textContent='✓ '+T('Completed today','أكملت تحدي اليوم','הושלם היום');progress.replaceChildren(...Array.from({length:5},()=>{const d=document.createElement('span');d.className='daily-stable-dot done';return d}));equation.textContent=T('Challenge complete!','اكتمل التحدي!','האתגר הושלם!');scoreLabel.textContent=String(score);hintBox.hidden=true;hintBox.textContent='';result.hidden=false;const message=score===5?T('Perfect score! 5/5 correct.','نتيجة كاملة! 5/5 صحيحة.','תוצאה מושלמת! 5/5 נכונות.'):score>=4?T('Great work! '+score+'/5 correct.','عمل رائع! '+score+'/5 صحيحة.','עבודה נהדרת! '+score+'/5 נכונות.'):T('Good effort! '+score+'/5 correct.','محاولة جيدة! '+score+'/5 صحيحة.','מאמץ טוב! '+score+'/5 נכונות.');result.innerHTML='<div class="daily-stable-score">'+score+'/5</div><p><b>'+message+'</b></p><p>'+T('Come back tomorrow for a new challenge.','عد غدًا لتحدٍ جديد.','חזרו מחר לאתגר חדש.')+'</p><div class="daily-stable-completion-links"><a class="primary" href="beginner-lessons.html">'+T('Keep learning','تابع التعلّم','המשיכו ללמוד')+'</a><a class="secondary" href="personal-quiz.html">'+T('Practice more','تدرّب أكثر','תרגלו עוד')+'</a></div>'}
 startButton.addEventListener('click',startChallenge);checkButton.addEventListener('click',()=>evaluate(false));submitButton.addEventListener('click',()=>evaluate(true));nextButton.addEventListener('click',nextQuestion);hintButton.addEventListener('click',()=>{if(!started||complete)return;hintBox.textContent='💡 '+qs[index][2];hintBox.hidden=false});input.addEventListener('keydown',e=>{if(e.key==='Enter')evaluate(false)});
 if(adminReplay){started=true;complete=false;index=0;score=0;status=[];answers=[];endAt=Date.now()+120000;save();render();input.disabled=false;checkButton.disabled=false;submitButton.disabled=false;hintButton.disabled=false;timer=setInterval(tick,500);tick();input.focus()}else if(complete){render()}else{render();if(started&&endAt>Date.now()){timer=setInterval(tick,500);tick()}else if(started){finish()}}
}
const style=document.createElement('style');style.id='daily-stable-style';style.textContent=`#daily-stable{margin:12px 0 16px}.daily-stable-card{padding:24px;border:1px solid var(--line,#dce3ee);border-radius:20px;background:var(--surface,#fff);box-shadow:0 10px 28px rgba(25,43,76,.07)}.daily-stable-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.daily-stable-kicker{font-size:11px;letter-spacing:.12em;font-weight:800;color:var(--accent)}.daily-stable-head h2{margin:6px 0}.daily-stable-head p{margin:0;color:var(--muted)}.daily-stable-badge{padding:7px 10px;border-radius:999px;background:#edf1ff;font-size:12px;font-weight:800;white-space:nowrap}.daily-stable-progress{display:flex;gap:6px;margin:16px 0}.daily-stable-dot{height:8px;flex:1;border-radius:99px;background:#e4e9f1}.daily-stable-dot.done{background:var(--accent)}.daily-stable-dot.current{box-shadow:0 0 0 2px rgba(49,88,214,.2)}.daily-stable-meta{display:flex;justify-content:space-between;gap:12px;color:var(--muted);font-size:13px}.daily-stable-equation{direction:ltr;text-align:center;font-size:clamp(25px,4vw,40px);font-weight:900;padding:20px 10px;margin:18px 0;border:1px solid var(--line);border-radius:15px}.daily-stable-input{width:100%;box-sizing:border-box;padding:14px;border:1px solid var(--line);border-radius:11px;font-size:18px;text-align:center;direction:ltr;background:transparent;color:inherit}.daily-stable-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:10px}.daily-stable-actions>*{min-height:44px}.daily-stable-feedback{min-height:30px;margin-top:12px;font-weight:800}.daily-stable-note,.daily-stable-hint{margin-top:9px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:var(--surface-2,#f7f9fc);color:var(--muted)}.daily-stable-result{margin-top:16px;padding:18px;border:1px solid var(--line);border-radius:15px}.daily-stable-score{font-size:38px;font-weight:900}.daily-stable-completion-links{display:flex;flex-wrap:wrap;gap:9px;margin-top:14px}.daily-stable-completion-links>*{flex:1 1 170px;text-align:center;min-height:44px;display:flex;align-items:center;justify-content:center;text-decoration:none;box-sizing:border-box}@media(max-width:760px){.daily-stable-card{padding:17px}.daily-stable-head,.daily-stable-meta{flex-direction:column}.daily-stable-badge{align-self:flex-start}.daily-stable-actions>*{flex:1 1 145px}}`;document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();