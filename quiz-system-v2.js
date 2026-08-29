(()=>{
'use strict';
const $=id=>document.getElementById(id);
const SUB={'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
const REV={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
const ui=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>REV[c]).replace(/\s+/g,' ').trim().replace(/=>|->|⟶|⇒|➜|⟹|⟾/g,'→');
function formatFormula(f){let s=String(f||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>REV[c]);let out='';for(let i=0;i<s.length;i++){if(/\d/.test(s[i])){let j=i;while(j<s.length&&/\d/.test(s[j]))j++;out+=s.slice(i,j).replace(/\d/g,d=>SUB[d]);i=j-1}else out+=s[i]}return escapeHtml(out)}
function formatMolecule(part){const p=String(part||'').trim();const m=p.match(/^(\d+)\s*(.*)$/);return m?`${escapeHtml(m[1])}${formatFormula(m[2])}`:formatFormula(p)}
function chem(eq){return normalize(eq).split('→').map(side=>side.split('+').map(formatMolecule).join(' + ')).join(' → ')}
const questions={
 easy:[
  ['H2 + O2 → H2O','2H2 + O2 → 2H2O','Hydrogen and oxygen must both be equal.'],
  ['Na + Cl2 → NaCl','2Na + Cl2 → 2NaCl','Cl₂ has two chlorine atoms, so use 2 NaCl.'],
  ['Mg + O2 → MgO','2Mg + O2 → 2MgO','O₂ contains two oxygen atoms.'],
  ['N2 + H2 → NH3','N2 + 3H2 → 2NH3','Balance nitrogen first, then hydrogen.'],
  ['Cl2 + H2 → HCl','H2 + Cl2 → 2HCl','Two chlorine atoms require two HCl molecules.'],
  ['Fe + S → FeS','Fe + S → FeS','One Fe and one S already match.']
 ],
 medium:[
  ['Fe + O2 → Fe2O3','4Fe + 3O2 → 2Fe2O3','Use six oxygen atoms on each side.'],
  ['Ca + H2O → Ca(OH)2 + H2','Ca + 2H2O → Ca(OH)2 + H2','Two H₂O molecules provide two oxygen atoms.'],
  ['Zn + HCl → ZnCl2 + H2','Zn + 2HCl → ZnCl2 + H2','ZnCl₂ requires two chlorine atoms.'],
  ['CH4 + O2 → CO2 + H2O','CH4 + 2O2 → CO2 + 2H2O','Balance carbon, then hydrogen, then oxygen.'],
  ['Na2O + H2O → NaOH','Na2O + H2O → 2NaOH','Two sodium atoms require two NaOH.'],
  ['KClO3 → KCl + O2','2KClO3 → 2KCl + 3O2','Use six oxygen atoms on both sides.']
 ],
 hard:[
  ['C3H8 + O2 → CO2 + H2O','C3H8 + 5O2 → 3CO2 + 4H2O','For combustion, balance C, then H, then O.'],
  ['C2H5OH + O2 → CO2 + H2O','C2H5OH + 3O2 → 2CO2 + 3H2O','Balance carbon and hydrogen before oxygen.'],
  ['NH3 + O2 → NO + H2O','4NH3 + 5O2 → 4NO + 6H2O','Balance nitrogen, hydrogen, then oxygen.'],
  ['FeS2 + O2 → Fe2O3 + SO2','4FeS2 + 11O2 → 2Fe2O3 + 8SO2','Balance Fe, then S, then O.'],
  ['C4H10 + O2 → CO2 + H2O','2C4H10 + 13O2 → 8CO2 + 10H2O','Balance C and H, then use oxygen to finish.'],
  ['KMnO4 + HCl → KCl + MnCl2 + H2O + Cl2','2KMnO4 + 16HCl → 2KCl + 2MnCl2 + 8H2O + 5Cl2','Balance K and Mn first, then H, Cl, and O.']
 ]
};
const state={difficulty:'easy',experience:'practice',type:'choice',timed:false,time:300,index:0,score:0,correct:0,answers:[],items:[],timer:null,running:false};
function currentUser(){try{return JSON.parse(localStorage.getItem('chemistryCurrentUser')||'null')}catch{return null}}
function statKey(){return 'chemistryQuizStats:'+(currentUser()?.id||currentUser()?.username||'guest')}
function readStats(){try{return JSON.parse(localStorage.getItem(statKey())||'{"sessions":0,"correct":0,"answered":0,"best":0}')}catch{return{sessions:0,correct:0,answered:0,best:0}}}
function saveStats(score,correct,answered){const s=readStats();s.sessions=(s.sessions||0)+(answered?1:0);s.correct=(s.correct||0)+correct;s.answered=(s.answered||0)+answered;s.best=Math.max(s.best||0,score);localStorage.setItem(statKey(),JSON.stringify(s));return s}
function coefficients(sol){return normalize(sol).split('→').flatMap(side=>side.split('+').map(x=>x.trim()).filter(Boolean)).map(x=>{const m=x.match(/^(\d+)\s*/);return m?Number(m[1]):1})}
function formulaParts(eq){return normalize(eq).split('→').flatMap(side=>side.split('+').map(x=>x.trim()).filter(Boolean))}
function withCoefficients(eq,cs){let i=0;return normalize(eq).split('→').map(side=>side.split('+').map(p=>{const m=p.trim().match(/^(\d+)\s*(.+)$/),formula=(m?m[2]:p).trim(),c=cs[i++]??1;return `${c===1?'':c}${formula}`}).join(' + ')).join(' → ')}
function makeChoices(solution){const correct=coefficients(solution);const options=[solution];const candidates=[
  correct.map((n,i)=>Math.max(1,n+(i%2?1:-1))),
  correct.map((n,i)=>Math.max(1,n+(i===0?1:0))),
  correct.map((n,i)=>Math.max(1,n-(i%3===0?1:0)))
 ];
 candidates.forEach(c=>{const x=withCoefficients(solution,c);if(!options.includes(x))options.push(x)});
 while(options.length<4){const c=correct.map((n,i)=>Math.max(1,n+(i%4)+1));const x=withCoefficients(solution,c);if(!options.includes(x))options.push(x);else break}
 return options.sort(()=>Math.random()-.5).slice(0,4);
}
function renderConfig(){
 document.querySelectorAll('[data-stage]').forEach(b=>b.classList.toggle('active-stage',b.dataset.stage===state.difficulty));
 const start=$('newQuiz');
 if(start)start.textContent=state.experience==='quiz'?ui('Start quiz','ابدأ الاختبار','התחל חידון'):ui('Start practice','ابدأ التدريب','התחל תרגול');
 document.querySelectorAll('input[name="experience"]').forEach(r=>r.checked=r.value===state.experience);
 document.querySelectorAll('input[name="qtype"]').forEach(r=>r.checked=r.value===state.type);
 document.querySelectorAll('input[name="mode"]').forEach(r=>r.checked=r.value==='timed');
 const modeWrap=document.querySelector('.mode-list');
 if(modeWrap)modeWrap.innerHTML=`<label><input type="radio" name="mode" value="timed" checked> ${ui('Timed · 5 minutes','مؤقت · 5 دقائق','مؤقت · 5 دقائق')}</label>`;
 const badge=$('practiceBadge');if(badge)badge.textContent=state.experience==='quiz'?ui('QUIZ','اختبار','חידון'):ui('PRACTICE','تدريب','תרגול');
}
function bindConfig(){
 document.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',()=>{if(state.running)return;state.difficulty=b.dataset.stage;renderConfig()}));
 document.querySelectorAll('input[name="experience"]').forEach(r=>r.addEventListener('change',()=>{if(state.running)return;state.experience=r.value;renderConfig()}));
 document.querySelectorAll('input[name="qtype"]').forEach(r=>r.addEventListener('change',()=>{if(state.running)return;state.type=r.value;renderConfig()}));
 const oldStart=$('newQuiz');
 if(oldStart){const start=oldStart.cloneNode(true);oldStart.replaceWith(start);start.addEventListener('click',startSession)}
}
function updateHeader(){
 const title=$('quizTitle');if(title)title.textContent=state.experience==='quiz'?ui('Quiz','الاختبار','חידון'):ui('Practice','التدريب','תרגול');
 const timerText=$('timerText');if(timerText)timerText.textContent=state.experience==='quiz'?ui('Answer each question. Your results appear when you finish.','أجب عن كل سؤال. ستظهر نتيجتك عند الانتهاء.','ענה על כל שאלה. התוצאה תופיע בסיום.'):ui('Get feedback after each answer and learn from mistakes.','احصل على ملاحظات بعد كل إجابة وتعلم من أخطائك.','קבל משוב לאחר כל תשובה ולמד מהטעויות.');
}
function startSession(){
 stopTimer();state.running=true;state.index=0;state.score=0;state.correct=0;state.answers=[];state.items=[...questions[state.difficulty]].sort(()=>Math.random()-.5).slice(0,Math.min(8,questions[state.difficulty].length));
 $('quizArea').innerHTML='';$('scoreArea').innerHTML='';$('retryMistakes')?.classList.add('hidden');
 updateHeader();renderStats();renderQuestion();showCancel(true);
 if(state.experience==='quiz'){state.timed=true;state.time=300;startTimer()}
 window.scrollTo({top:document.querySelector('.section.alt')?.offsetTop||0,behavior:'smooth'});
}
function showCancel(show){const area=document.querySelector('.quiz-actions');if(!area)return;let b=$('cancelQuiz');if(show&&!b){b=document.createElement('button');b.id='cancelQuiz';b.type='button';b.className='secondary';b.textContent=ui('Cancel quiz','إلغاء الاختبار','ביטול חידון');area.prepend(b);b.addEventListener('click',cancelSession)}if(b)b.classList.toggle('hidden',!show)}
function cancelSession(){stopTimer();state.running=false;state.items=[];state.answers=[];state.score=0;state.correct=0;state.index=0;$('quizArea').innerHTML=`<div class="quiz-empty-state">${ui('Quiz cancelled. Choose your settings and start again when you are ready.','تم إلغاء الاختبار. اختر الإعدادات وابدأ من جديد عندما تكون جاهزًا.','החידון בוטל. בחר את ההגדרות והתחל שוב כשתהיה מוכן.')}</div>`;$('scoreArea').innerHTML='';$('timer')?.classList.add('hidden');showCancel(false);renderStats();renderConfig()}
function startTimer(){const t=$('timer');if(!t)return;t.classList.remove('hidden');drawTimer();state.timer=setInterval(()=>{state.time--;drawTimer();if(state.time<=0){stopTimer();finishSession(true)}},1000)}
function stopTimer(){if(state.timer){clearInterval(state.timer);state.timer=null}}
function drawTimer(){const m=Math.floor(state.time/60),s=String(state.time%60).padStart(2,'0');const t=$('timer');if(t)t.textContent=`⏱ ${m}:${s}`}
function renderStats(){const box=$('scoreArea');if(!box)return;const s=readStats();box.innerHTML=`<div class="practice-live-stats"><div><b>${state.score}</b><span>${ui('Score','النقاط','ניקוד')}</span></div><div><b>${state.correct}</b><span>${ui('Correct','صحيح','נכון')}</span></div><div><b>${state.running?state.index+1:0}</b><span>${ui('Question','السؤال','שאלה')}</span></div><div><b>${s.best||0}</b><span>${ui('Best score','أفضل نتيجة','שיא')}</span></div></div>`}
function renderQuestion(){
 const item=state.items[state.index];if(!item)return finishSession(false);
 const [raw,solution,hint]=item;const area=$('quizArea');if(!area)return;
 let controls='';
 if(state.type==='choice')controls=makeChoices(solution).map((x,i)=>`<button type="button" class="practice-choice" data-answer="${encodeURIComponent(x)}">${String.fromCharCode(65+i)}. ${chem(x)}</button>`).join('');
 else controls=`<div class="coefficient-entry"><div class="coefficient-slots">${formulaParts(solution).map((_,i)=>`<input inputmode="numeric" pattern="[0-9]*" data-coef="${i}" placeholder="?" aria-label="Coefficient ${i+1}">`).join('')}</div><p class="muted">${ui('Enter coefficients from left to right. Include both sides and use 1 when needed.','أدخل المعاملات من اليسار إلى اليمين، للجانبين معًا، واستخدم 1 عند الحاجة.','הקלד את המקדמים משמאל לימין, לשני הצדדים, והשתמש ב-1 כשצריך.')}</p><button class="primary practice-submit" type="button">${ui('Submit answer','أرسل الإجابة','שלח תשובה')}</button></div>`;
 area.innerHTML=`<article class="practice-question-card"><div class="practice-question-meta"><span>${ui('Question','السؤال','שאלה')} ${state.index+1} / ${state.items.length}</span><span>${state.difficulty.toUpperCase()}</span></div><div class="practice-equation">${chem(raw)}</div><h3>${state.type==='choice'?ui('Choose the balanced equation','اختر المعادلة الموزونة','בחר את המשוואה המאוזנת'):ui('Type the coefficients','اكتب المعاملات','הקלד את המקדמים')}</h3><div class="practice-controls">${controls}</div><div id="answerFeedback" class="answer-feedback hidden"></div></article>`;
 area.querySelectorAll('.practice-choice').forEach(b=>b.addEventListener('click',()=>answerQuestion(decodeURIComponent(b.dataset.answer),solution,hint,b)));
 area.querySelector('.practice-submit')?.addEventListener('click',()=>{const vals=[...area.querySelectorAll('[data-coef]')].map(x=>Number(x.value||0));const wanted=coefficients(solution);answerQuestion(vals.map(String).join(','),wanted.map(String).join(','),hint,null,vals,wanted,solution)});
 renderStats();
}
function answerQuestion(answer,solution,hint,button,typed,wanted,solutionText){
 if(!state.running)return;const ok=typed?typed.length===wanted.length&&typed.every((x,i)=>x===wanted[i]):normalize(answer)===normalize(solution);
 state.answers.push({ok});if(ok){state.correct++;state.score+=10;}
 if(state.experience==='practice'){showFeedback(ok,hint,solutionText||solution,answer,typed);document.querySelectorAll('.practice-choice').forEach(b=>b.disabled=true);const submit=document.querySelector('.practice-submit');if(submit)submit.disabled=true;setTimeout(()=>{state.index++;if(state.index<state.items.length)renderQuestion();else finishSession(false)},650)}
 else {document.querySelectorAll('.practice-choice').forEach(b=>b.disabled=true);const submit=document.querySelector('.practice-submit');if(submit)submit.disabled=true;state.index++;setTimeout(()=>{if(state.index<state.items.length)renderQuestion();else finishSession(false)},250)}
 renderStats();
}
function showFeedback(ok,hint,correct,answer,typed){const f=$('answerFeedback');if(!f)return;f.className=`answer-feedback ${ok?'feedback-correct':'feedback-wrong'}`;f.innerHTML=ok?`<b>✓ ${ui('Correct','صحيحة','صحيحة')}</b><div>${ui('Great work!','أحسنت!','عمل رائع!')}</div>`:`<b>✗ ${ui('Not quite','ليست صحيحة','ليست صحيحة')}</b><div><strong>${ui('Correct answer:','الإجابة الصحيحة:','התשובה הנכונה:')}</strong> ${chem(correct)}</div><div class="muted">${escapeHtml(hint||'')}</div>`}
function finishSession(timeUp){
 if(!state.running)return;stopTimer();state.running=false;state.timed=false;const answered=state.answers.length;const stats=saveStats(state.score,state.correct,answered);
 const pct=answered?Math.round(state.correct/answered*100):0;
 showCancel(false);$('timer')?.classList.add('hidden');
 $('quizArea').innerHTML=`<article class="quiz-finish-card"><div class="finish-icon">${timeUp?'⏱':'✓'}</div><h2>${timeUp?ui('Time is up','انتهى الوقت','انتهى الوقت'):ui('Quiz complete','اكتمل الاختبار','החידון הסתיים')}</h2><p>${ui('You answered','أجبت عن','ענית על')} <b>${answered}</b> ${ui('questions','أسئلة','שאלות')}.</p><div class="finish-score"><b>${state.score}</b><span>${ui('points','نقطة','נקודות')} · ${pct}% ${ui('correct','correct','נכון')}</span></div><div class="finish-actions"><button id="restartQuiz" class="primary" type="button">${ui('Try again','حاول مرة أخرى','נסה שוב')}</button><button id="backToSettings" class="secondary" type="button">${ui('Change settings','تغيير الإعدادات','שנה הגדרות')}</button></div></article>`;
 $('restartQuiz').onclick=startSession;$('backToSettings').onclick=()=>{$('quizArea').innerHTML='';renderConfig()};
 $('scoreArea').innerHTML=`<div class="practice-live-stats"><div><b>${state.score}</b><span>${ui('Score','النقاط','ניקוד')}</span></div><div><b>${state.correct}</b><span>${ui('Correct','صحيح','נכון')}</span></div><div><b>${pct}%</b><span>${ui('Accuracy','الدقة','דיוק')}</span></div><div><b>${stats.best||0}</b><span>${ui('Best score','أفضل نتيجة','שיא')}</span></div></div>`;
}
function setup(){
 if(!$('quizArea'))return;
 const retry=$('retryMistakes');if(retry)retry.classList.add('hidden');
 const badge=$('practiceBadge');if(badge)badge.textContent=ui('PRACTICE','تدريب','תרגול');
 renderConfig();bindConfig();updateHeader();showCancel(false);
 $('quizArea').innerHTML=`<div class="quiz-empty-state">${ui('Choose your settings, then press Start.','اختر إعداداتك ثم اضغط ابدأ.','בחר את ההגדרות שלך ולחץ על התחל.')}</div>`;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
