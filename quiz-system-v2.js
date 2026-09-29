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
  {category:'basic balancing',raw:'H2 + O2 → H2O',solution:'2H2 + O2 → 2H2O',hint:'Balance oxygen first, then hydrogen.'},
  {category:'basic balancing',raw:'Mg + O2 → MgO',solution:'2Mg + O2 → 2MgO',hint:'O₂ contains two oxygen atoms.'},
  {category:'basic balancing',raw:'Al + O2 → Al2O3',solution:'4Al + 3O2 → 2Al2O3',hint:'Use six oxygen atoms on each side.'},
  {category:'coefficients',raw:'Na + Cl2 → NaCl',solution:'2Na + Cl2 → 2NaCl',hint:'Cl₂ requires two NaCl molecules.'},
  {category:'coefficients',raw:'N2 + H2 → NH3',solution:'N2 + 3H2 → 2NH3',hint:'Balance nitrogen, then hydrogen.'},
  {category:'coefficients',raw:'Cl2 + H2 → HCl',solution:'H2 + Cl2 → 2HCl',hint:'Two chlorine atoms require two HCl molecules.'},
  {category:'diatomic elements',raw:'O2 + H2 → H2O',solution:'O2 + 2H2 → 2H2O',hint:'Elemental oxygen and hydrogen are diatomic.'},
  {category:'diatomic elements',raw:'Br2 + Na → NaBr',solution:'Br2 + 2Na → 2NaBr',hint:'Br₂ contains two bromine atoms.'},
  {category:'already-balanced equations',raw:'Fe + S → FeS',solution:'Fe + S → FeS',hint:'One Fe and one S already match.'},
  {category:'already-balanced equations',raw:'CaCO3 → CaO + CO2',solution:'CaCO3 → CaO + CO2',hint:'Every element already has equal counts.'},
  {category:'tricky formulas',raw:'Na2O + H2O → NaOH',solution:'Na2O + H2O → 2NaOH',hint:'The subscript 2 belongs to Na.'},
  {category:'tricky formulas',raw:'CaCl2 + AgNO3 → Ca(NO3)2 + AgCl',solution:'CaCl2 + 2AgNO3 → Ca(NO3)2 + 2AgCl',hint:'Keep NO₃ together while balancing Ag and Cl.'}
 ],
 medium:[
  {category:'basic balancing',raw:'Fe + O2 → Fe2O3',solution:'4Fe + 3O2 → 2Fe2O3',hint:'Make six oxygen atoms on each side.'},
  {category:'basic balancing',raw:'KClO3 → KCl + O2',solution:'2KClO3 → 2KCl + 3O2',hint:'Six oxygen atoms become 3 O₂.'},
  {category:'coefficients',raw:'Zn + HCl → ZnCl2 + H2',solution:'Zn + 2HCl → ZnCl2 + H2',hint:'ZnCl₂ needs two chlorine atoms.'},
  {category:'coefficients',raw:'Na2O + H2O → NaOH',solution:'Na2O + H2O → 2NaOH',hint:'Two sodium atoms require two NaOH units.'},
  {category:'diatomic elements',raw:'Al + Cl2 → AlCl3',solution:'2Al + 3Cl2 → 2AlCl3',hint:'Match six chlorine atoms on both sides.'},
  {category:'parentheses',raw:'Ca + H2O → Ca(OH)2 + H2',solution:'Ca + 2H2O → Ca(OH)2 + H2',hint:'The subscript 2 applies to the entire OH group.'},
  {category:'parentheses',raw:'Al(OH)3 + HCl → AlCl3 + H2O',solution:'Al(OH)3 + 3HCl → AlCl3 + 3H2O',hint:'Balance the three OH groups with three water molecules.'},
  {category:'polyatomic ions',raw:'Na2SO4 + BaCl2 → BaSO4 + NaCl',solution:'Na2SO4 + BaCl2 → BaSO4 + 2NaCl',hint:'SO₄ stays together; balance Na and Cl.'},
  {category:'polyatomic ions',raw:'Ca(OH)2 + H3PO4 → Ca3(PO4)2 + H2O',solution:'3Ca(OH)2 + 2H3PO4 → Ca3(PO4)2 + 6H2O',hint:'Treat PO₄ as a unit, then balance H and O.'},
  {category:'combustion',raw:'CH4 + O2 → CO2 + H2O',solution:'CH4 + 2O2 → CO2 + 2H2O',hint:'Balance C, then H, then O.'},
  {category:'combustion',raw:'C2H6 + O2 → CO2 + H2O',solution:'2C2H6 + 7O2 → 4CO2 + 6H2O',hint:'Balance carbon and hydrogen before oxygen.'},
  {category:'redox',raw:'Zn + CuSO4 → ZnSO4 + Cu',solution:'Zn + CuSO4 → ZnSO4 + Cu',hint:'The redox equation is already balanced.'},
  {category:'redox',raw:'Fe + CuSO4 → FeSO4 + Cu',solution:'Fe + CuSO4 → FeSO4 + Cu',hint:'The atom counts already match.'},
  {category:'ionic equations',raw:'AgNO3 + NaCl → AgCl + NaNO3',solution:'AgNO3 + NaCl → AgCl + NaNO3',hint:'The precipitation equation is already balanced.'},
  {category:'ionic equations',raw:'HCl + NaOH → NaCl + H2O',solution:'HCl + NaOH → NaCl + H2O',hint:'One acid and one base give one salt and one water.'},
  {category:'tricky formulas',raw:'Fe2O3 + CO → Fe + CO2',solution:'Fe2O3 + 3CO → 2Fe + 3CO2',hint:'The subscript 2 belongs only to Fe.'},
  {category:'tricky formulas',raw:'NH4NO3 → N2O + H2O',solution:'NH4NO3 → N2O + 2H2O',hint:'There are four hydrogen atoms in NH₄NO₃.'},
  {category:'already-balanced equations',raw:'CaCO3 → CaO + CO2',solution:'CaCO3 → CaO + CO2',hint:'No coefficient changes are needed.'}
 ],
 hard:[
  {category:'basic balancing',raw:'FeS2 + O2 → Fe2O3 + SO2',solution:'4FeS2 + 11O2 → 2Fe2O3 + 8SO2',hint:'Balance Fe, then S, then O.'},
  {category:'basic balancing',raw:'KMnO4 + HCl → KCl + MnCl2 + H2O + Cl2',solution:'2KMnO4 + 16HCl → 2KCl + 2MnCl2 + 8H2O + 5Cl2',hint:'Balance K and Mn, then O, H, and Cl.'},
  {category:'coefficients',raw:'P4 + O2 → P2O5',solution:'P4 + 5O2 → 2P2O5',hint:'Match four phosphorus and ten oxygen atoms.'},
  {category:'diatomic elements',raw:'Na + Cl2 → NaCl',solution:'2Na + Cl2 → 2NaCl',hint:'Elemental chlorine is Cl₂.'},
  {category:'parentheses',raw:'Fe2(SO4)3 + KOH → Fe(OH)3 + K2SO4',solution:'Fe2(SO4)3 + 6KOH → 2Fe(OH)3 + 3K2SO4',hint:'Treat SO₄ and OH as groups.'},
  {category:'parentheses',raw:'Al2(SO4)3 + Ca(OH)2 → Al(OH)3 + CaSO4',solution:'Al2(SO4)3 + 3Ca(OH)2 → 2Al(OH)3 + 3CaSO4',hint:'Balance the repeated sulfate and hydroxide groups.'},
  {category:'polyatomic ions',raw:'Na3PO4 + MgCl2 → Mg3(PO4)2 + NaCl',solution:'2Na3PO4 + 3MgCl2 → Mg3(PO4)2 + 6NaCl',hint:'Keep PO₄ intact while balancing Mg and NaCl.'},
  {category:'polyatomic ions',raw:'Al2(SO4)3 + BaCl2 → BaSO4 + AlCl3',solution:'Al2(SO4)3 + 3BaCl2 → 3BaSO4 + 2AlCl3',hint:'Three sulfate groups require three BaSO₄ units.'},
  {category:'combustion',raw:'C3H8 + O2 → CO2 + H2O',solution:'C3H8 + 5O2 → 3CO2 + 4H2O',hint:'Balance C, then H, then O.'},
  {category:'combustion',raw:'C4H10 + O2 → CO2 + H2O',solution:'2C4H10 + 13O2 → 8CO2 + 10H2O',hint:'Use the smallest whole-number coefficients.'},
  {category:'combustion',raw:'C2H5OH + O2 → CO2 + H2O',solution:'C2H5OH + 3O2 → 2CO2 + 3H2O',hint:'Account for the oxygen already present in ethanol.'},
  {category:'redox',raw:'MnO2 + HCl → MnCl2 + H2O + Cl2',solution:'MnO2 + 4HCl → MnCl2 + 2H2O + Cl2',hint:'Four HCl molecules are needed.'},
  {category:'redox',raw:'Cr2O3 + Al → Al2O3 + Cr',solution:'Cr2O3 + 2Al → Al2O3 + 2Cr',hint:'Match oxygen, then Al and Cr.'},
  {category:'ionic equations',raw:'BaCl2 + Na2SO4 → BaSO4 + NaCl',solution:'BaCl2 + Na2SO4 → BaSO4 + 2NaCl',hint:'Balance the two Na and two Cl atoms.'},
  {category:'ionic equations',raw:'H2SO4 + NaOH → Na2SO4 + H2O',solution:'H2SO4 + 2NaOH → Na2SO4 + 2H2O',hint:'Two NaOH molecules supply two Na atoms.'},
  {category:'tricky formulas',raw:'Al2(SO4)3 + KOH → K2SO4 + Al(OH)3',solution:'Al2(SO4)3 + 6KOH → 3K2SO4 + 2Al(OH)3',hint:'Do not change subscripts; balance groups with coefficients.'},
  {category:'tricky formulas',raw:'(NH4)2CO3 → NH3 + CO2 + H2O',solution:'(NH4)2CO3 → 2NH3 + CO2 + H2O',hint:'The 2 outside parentheses applies to the whole NH₄ group.'},
  {category:'already-balanced equations',raw:'2H2 + O2 → 2H2O',solution:'2H2 + O2 → 2H2O',hint:'It is already balanced; keep the smallest coefficients.'},
  {category:'already-balanced equations',raw:'Fe2O3 + 3CO → 2Fe + 3CO2',solution:'Fe2O3 + 3CO → 2Fe + 3CO2',hint:'Every element already has equal counts.'}
 ]
}function selectQuestionMix(bank,count=8){
 const byCategory={};
 bank.forEach(q=>(byCategory[q.category]||(byCategory[q.category]=[])).push(q));
 Object.values(byCategory).forEach(list=>list.sort(()=>Math.random()-.5));
 const categories=Object.keys(byCategory).sort(()=>Math.random()-.5);
 const selected=[];
 for(let round=0;selected.length<count;round++){
   let added=false;
   for(const category of categories){
     const q=byCategory[category][round];
     if(q){selected.push(q);added=true;if(selected.length>=count)break}
   }
   if(!added)break;
 }
 return selected.sort(()=>Math.random()-.5);
}
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
 const modeWrap=document.querySelector('.mode-list');
 if(modeWrap)modeWrap.innerHTML=state.experience==='quiz'
   ? `<span class="mode-label">${ui('Time limit','الوقت المحدد','מגבלת הזמן')}</span><div class="mode-options"><label><input type="radio" name="mode" value="5" ${state.time===300?'checked':''}> 5 minutes</label><label><input type="radio" name="mode" value="7" ${state.time===420?'checked':''}> 7 minutes</label><label><input type="radio" name="mode" value="10" ${state.time===600?'checked':''}> 10 minutes</label></div>`
   : '';
 const badge=$('practiceBadge');if(badge)badge.textContent=state.experience==='quiz'?ui('QUIZ','اختبار','חידון'):ui('PRACTICE','تدريب','תרגול');
}
function bindConfig(){
 document.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',()=>{if(state.running)return;state.difficulty=b.dataset.stage;renderConfig()}));
 document.querySelectorAll('input[name="experience"]').forEach(r=>r.addEventListener('change',()=>{if(state.running)return;state.experience=r.value;renderConfig()}));
 document.querySelectorAll('input[name="qtype"]').forEach(r=>r.addEventListener('change',()=>{if(state.running)return;state.type=r.value;renderConfig()}));
 document.querySelectorAll('input[name="mode"]').forEach(r=>r.addEventListener('change',()=>{if(state.running)return;state.time=Number(r.value)*60;renderConfig()}));
 const oldStart=$('newQuiz');
 if(oldStart){const start=oldStart.cloneNode(true);oldStart.replaceWith(start);start.addEventListener('click',startSession)}
}
function updateHeader(){
 const title=$('quizTitle');if(title)title.textContent=state.experience==='quiz'?ui('Quiz','الاختبار','חידון'):ui('Practice','التدريب','תרגול');
 const timerText=$('timerText');if(timerText)timerText.textContent=state.experience==='quiz'?ui('Answer each question. Your results appear when you finish.','أجب عن كل سؤال. ستظهر نتيجتك عند الانتهاء.','ענה על כל שאלה. התוצאה תופיע בסיום.'):ui('Get feedback after each answer and learn from mistakes.','احصل على ملاحظات بعد كل إجابة وتعلم من أخطائك.','קבל משוב לאחר כל תשובה ולמד מהטעויות.');
}
function startSession(){
 stopTimer();state.running=true;state.index=0;state.score=0;state.correct=0;state.answers=[];state.items=selectQuestionMix(questions[state.difficulty],Math.min(8,questions[state.difficulty].length));
 $('quizArea').innerHTML='';$('scoreArea').innerHTML='';$('retryMistakes')?.classList.add('hidden');
 updateHeader();renderStats();renderQuestion();showCancel(true);
 if(state.experience==='quiz'){
   const selected=document.querySelector('input[name="mode"]:checked');
   state.time=selected?Number(selected.value)*60:300;
   state.timed=true;
   startTimer();
 }
 window.scrollTo({top:document.querySelector('.section.alt')?.offsetTop||0,behavior:'smooth'});
}
function showCancel(show){const area=document.querySelector('.quiz-actions');if(!area)return;let b=$('cancelQuiz');if(show&&!b){b=document.createElement('button');b.id='cancelQuiz';b.type='button';b.className='secondary';area.prepend(b);b.addEventListener('click',cancelSession)}if(b){b.textContent=state.experience==='quiz'?ui('Cancel quiz','إلغاء الاختبار','ביטול حيدون'):ui('Cancel practice','إلغاء التدريب','ביטול תרגול');b.classList.toggle('hidden',!show)}}
function cancelSession(){stopTimer();state.running=false;state.items=[];state.answers=[];state.score=0;state.correct=0;state.index=0;$('quizArea').innerHTML=`<div class="quiz-empty-state">${ui('Quiz cancelled. Choose your settings and start again when you are ready.','تم إلغاء الاختبار. اختر الإعدادات وابدأ من جديد عندما تكون جاهزًا.','החידון בוטל. בחר את ההגדרות והתחל שוב כשתהיה מוכן.')}</div>`;$('scoreArea').innerHTML='';$('timer')?.classList.add('hidden');showCancel(false);renderStats();renderConfig()}
function startTimer(){const t=$('timer');if(!t)return;t.classList.remove('hidden');drawTimer();state.timer=setInterval(()=>{state.time--;drawTimer();if(state.time<=0){stopTimer();finishSession(true)}},1000)}
function stopTimer(){if(state.timer){clearInterval(state.timer);state.timer=null}}
function drawTimer(){const m=Math.floor(state.time/60),s=String(state.time%60).padStart(2,'0');const t=$('timer');if(t)t.textContent=`⏱ ${m}:${s}`}
function renderStats(){const box=$('scoreArea');if(!box)return;const s=readStats();box.innerHTML=`<div class="practice-live-stats"><div><b>${state.score}</b><span>${ui('Score','النقاط','ניקוד')}</span></div><div><b>${state.correct}</b><span>${ui('Correct','صحيح','נכון')}</span></div><div><b>${state.running?state.index+1:0}</b><span>${ui('Question','السؤال','שאלה')}</span></div><div><b>${s.best||0}</b><span>${ui('Best score','أفضل نتيجة','שיא')}</span></div></div>`}
function renderQuestion(){
 const item=state.items[state.index];if(!item)return finishSession(false);
 const {raw,solution,hint,category}=item;const area=$('quizArea');if(!area)return;
 let controls='';
 if(state.type==='choice')controls=makeChoices(solution).map((x,i)=>`<button type="button" class="practice-choice" data-answer="${encodeURIComponent(x)}">${String.fromCharCode(65+i)}. ${chem(x)}</button>`).join('');
 else{
   const parts=formulaParts(raw),left=parts.slice(0,raw.split('→')[0].split('+').length),right=parts.slice(left.length);
   const molecule=(p,i)=>{const m=p.trim().match(/^(\d+)\s*(.+)$/),formula=(m?m[2]:p).trim();return `<span class="build-molecule"><input class="build-coef-inline" inputmode="numeric" pattern="[0-9]*" data-coef="${i}" placeholder="?" aria-label="Coefficient ${i+1}">${formatFormula(formula)}</span>`};
   controls=`<div class="build-equation"><div><span class="build-label">${ui('Reactants','المتفاعلات','المتفاعلات')}</span><div class="build-side">${left.map((p,i)=>molecule(p,i)+(i<left.length-1?' <span class="build-plus">+</span>':'')).join('')}</div></div><div class="build-arrow">→</div><div><span class="build-label">${ui('Product','الناتج','الناتج')}</span><div class="build-side">${right.map((p,i)=>molecule(p,left.length+i)+(i<right.length-1?' <span class="build-plus">+</span>':'')).join('')}</div></div></div><p class="muted">${ui('Type each coefficient directly beside its molecule. Use 1 when needed.','أدخل كل معامل مباشرة بجانب الجزيء. استخدم 1 عند الحاجة.','הקלד כל מקדם ישירות ליד המולקולה. השתמש ב־1 כשצריך.')}</p><button class="primary practice-submit" type="button">${ui('Submit answer','أرسل الإجابة','שלח תשובה')}</button>`;
 }
 const title=state.type==='choice'?ui('Choose the balanced equation','اختر المعادلة الموزونة','בחר את המשוואה המאוזנת'):ui('Type the coefficients','اكتب المعاملات','הקלד את המקדמים');
 area.innerHTML=`<article class="practice-question-card"><div class="practice-question-meta"><span>${ui('Question','السؤال','שאלה')} ${state.index+1} / ${state.items.length}</span><span>${state.difficulty.toUpperCase()} · ${escapeHtml(category)}</span></div>${state.type==='choice'?`<div class="practice-equation">${chem(raw)}</div>`:''}<h3>${title}</h3><div class="practice-controls">${controls}</div><div id="answerFeedback" class="answer-feedback hidden"></div></article>`;
 area.querySelectorAll('.practice-choice').forEach(b=>b.addEventListener('click',()=>answerQuestion(decodeURIComponent(b.dataset.answer),solution,hint,b)));
 area.querySelector('.practice-submit')?.addEventListener('click',()=>{const vals=[...area.querySelectorAll('[data-coef]')].map(x=>Number(x.value||0));const wanted=coefficients(solution);answerQuestion(vals.map(String).join(','),wanted.map(String).join(','),hint,null,vals,wanted,solution)});
 renderStats();
}
function answerQuestion(answer,solution,hint,button,typed,wanted,solutionText){
 if(!state.running)return;const ok=typed?typed.length===wanted.length&&typed.every((x,i)=>x===wanted[i]):normalize(answer)===normalize(solution);
 state.answers.push({ok});if(ok){state.correct++;state.score+=10;}
 if(state.experience==='practice'){showFeedback(ok,hint,solutionText||solution,answer,typed);document.querySelectorAll('.practice-choice').forEach(b=>b.disabled=true);const submit=document.querySelector('.practice-submit');if(submit)submit.disabled=true;setTimeout(()=>{state.index++;if(state.index<state.items.length)renderQuestion();else finishSession(false)},1800)}
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
