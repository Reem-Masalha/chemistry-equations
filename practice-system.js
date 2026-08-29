(()=>{
'use strict';
const $=id=>document.getElementById(id);
const SUB={'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
const REV={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
const ui=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const chem=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>REV[c]).replace(/([A-Za-z\)])(\d+)/g,(m,a,n)=>a+n.split('').map(x=>SUB[x]).join(''));
const normalize=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>REV[c]).replace(/\s+/g,'').replace(/=>|->|⟶|⇒|➜|⟹|⟾/g,'→');
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
const state={difficulty:'easy',experience:'practice',type:'choice',timed:false,time:300,index:0,score:0,streak:0,bestStreak:0,answered:0,correct:0,items:[],timer:null,answers:[]};
function currentUser(){try{return JSON.parse(localStorage.getItem('chemistryCurrentUser')||'null')}catch{return null}}
function bestKey(){return 'chemistryPracticeBest:'+(currentUser()?.id||currentUser()?.username||'guest')}
function loadBest(){return Number(localStorage.getItem(bestKey())||0)}
function saveBest(v){if(v>loadBest())localStorage.setItem(bestKey(),String(v))}
function splitParts(eq){return normalize(eq).split('→').flatMap(side=>side.split('+').map(x=>x.trim()).filter(Boolean))}
function coeffs(sol){return splitParts(sol).map(x=>{const m=x.match(/^(\d+)(.*)$/);return m?Number(m[1]):1})}
function makeChoices(correct){const c=coeffs(correct);const out=[correct];for(let i=0;i<3;i++){const a=c.map((n,j)=>Math.max(1,n+(i===0?(j%2?1:-1):i===1?(j===0?1:0):-(j%3===0?1:0))));out.push(formatCoefficients(correct,a));}return [...new Set(out)].slice(0,4).sort(()=>Math.random()-.5)}
function formatCoefficients(eq,cs){let i=0;return normalize(eq).split('→').map(side=>side.split('+').map(part=>{const m=part.match(/^(\d+)(.*)$/),formula=(m?m[2]:part).trim(),c=cs[i++];return `${c===1?'':c}${formula}`}).join(' + ')).join(' → ')}
function setText(node,text){if(node)node.textContent=text}
function inject(){
 const settings=document.querySelector('.quiz-settings');
 if(!settings)return;
 const modeCard=settings.querySelector('.card:nth-child(2)');
 if(modeCard&&!$('experienceChoice')){
  const wrap=document.createElement('div');wrap.id='experienceChoice';wrap.innerHTML=`<span class="eyebrow">${ui('EXPERIENCE','التجربة','חוויה')}</span><h3>${ui('Practice or Quiz?','تدريب أم اختبار؟','תרגול או חידון?')}</h3><div class="experience-options"><label><input type="radio" name="experience" value="practice" checked> ${ui('Practice — instant feedback','تدريب — ملاحظات فورية','תרגול — משוב מיידי')}</label><label><input type="radio" name="experience" value="quiz"> ${ui('Quiz — final results','اختبار — نتيجة نهائية','חידון — תוצאה סופית')}</label></div>`;
  modeCard.insertBefore(wrap,modeCard.firstChild);
  wrap.querySelectorAll('input').forEach(r=>r.addEventListener('change',()=>{state.experience=r.value;updateModeVisibility()}));
 }
 if(modeCard&&!$('questionType')){
  const wrap=document.createElement('div');wrap.id='questionType';wrap.innerHTML=`<span class="eyebrow">${ui('QUESTION TYPE','نوع السؤال','סוג שאלה')}</span><div class="type-options"><label><input type="radio" name="qtype" value="choice" checked> ${ui('Multiple choice','اختيار من متعدد','בחירה מרובה')}</label><label><input type="radio" name="qtype" value="coefficients"> ${ui('Type the coefficients','اكتب المعاملات','הקלד את המקדמים')}</label></div>`;
  modeCard.insertBefore(wrap,modeCard.querySelector('#newQuiz'));
  wrap.querySelectorAll('input').forEach(r=>r.addEventListener('change',()=>state.type=r.value));
 }
 const title=$('quizTitle');if(title&&!$('practiceBadge')){const b=document.createElement('span');b.id='practiceBadge';b.className='eyebrow';b.style.marginLeft='8px';title.parentElement.insertBefore(b,title.nextSibling)}
 updateModeVisibility();
}
function updateModeVisibility(){
 const modeRadios=[...document.querySelectorAll('input[name="mode"]')];
 modeRadios.forEach(r=>{if(r.value==='timed')r.closest('label').style.display=state.experience==='quiz'?'':'none';if(r.value==='challenge')r.closest('label').style.display='none';if(state.experience==='practice'&&r.value==='untimed')r.checked=true});
 if(state.experience==='practice')state.mode='untimed';
 const b=$('practiceBadge');setText(b,state.experience==='practice'?ui('PRACTICE','تدريب','תרגול'):ui('QUIZ','اختبار','חידון'));
}
function renderStats(){
 const box=$('scoreArea');if(!box)return;
 box.innerHTML=`<div class="practice-live-stats"><div><b id="liveScore">${state.score}</b><span>${ui('Score','النقاط','ניקוד')}</span></div><div><b id="liveStreak">${state.streak}</b><span>${ui('Streak','التتابع','רצף')}</span></div><div><b id="liveProgress">${Math.min(state.answered,state.items.length)}/${state.items.length}</b><span>${ui('Progress','التقدم','התקדמות')}</span></div><div><b id="liveBest">${loadBest()}</b><span>${ui('Best score','أفضل نتيجة','שיא')}</span></div></div>`;
}
function updateLive(){setText($('liveScore'),state.score);setText($('liveStreak'),state.streak);setText($('liveProgress'),`${Math.min(state.answered,state.items.length)}/${state.items.length}`);setText($('liveBest'),Math.max(loadBest(),state.score));}
function start(){
 stopTimer();state.index=0;state.score=0;state.streak=0;state.bestStreak=0;state.answered=0;state.correct=0;state.answers=[];state.items=[...questions[state.difficulty]].sort(()=>Math.random()-.5).slice(0,8);
 $('quizArea').innerHTML='';$('timer')?.classList.add('hidden');$('scoreArea')&&( $('scoreArea').innerHTML='');
 renderStats();renderQuestion();
 if(state.experience==='quiz' && document.querySelector('input[name="mode"][value="timed"]')?.checked){state.timed=true;state.time=300;startTimer();}
}
function startTimer(){const t=$('timer');if(!t)return;t.classList.remove('hidden');drawTimer();state.timer=setInterval(()=>{state.time--;drawTimer();if(state.time<=0){stopTimer();finish();}},1000)}
function stopTimer(){if(state.timer){clearInterval(state.timer);state.timer=null}}
function drawTimer(){const m=Math.floor(state.time/60),s=String(state.time%60).padStart(2,'0');setText($('timer'),`⏱ ${m}:${s}`)}
function renderQuestion(){
 const item=state.items[state.index];if(!item){finish();return}
 const [raw,solution,hint]=item;
 const area=$('quizArea');if(!area)return;
 const n=state.index+1;
 let controls='';
 if(state.type==='choice')controls=makeChoices(solution).map((x,i)=>`<button class="practice-choice" type="button" data-choice="${encodeURIComponent(x)}">${String.fromCharCode(65+i)}. ${chem(x)}</button>`).join('');
 else controls=`<div class="coefficient-entry"><div class="coefficient-slots">${splitParts(solution).map((p,i)=>`<input inputmode="numeric" pattern="[0-9]*" data-coef="${i}" placeholder="?" aria-label="Coefficient ${i+1}">`).join('')}</div><p class="muted">${ui('Enter coefficients from left to right, including both sides. Use 1 for an unchanged coefficient.','أدخل المعاملات من اليسار إلى اليمين، لكلا الجانبين. استخدم 1 للمعامل غير المتغير.','הקלד את המקדמים משמאל לימין, בשני הצדדים. השתמש ב-1 למקדם שלא משתנה.')}</p><button class="primary practice-submit" type="button">${ui('Check answer','تحقق من الإجابة','בדוק תשובה')}</button></div>`;
 area.innerHTML=`<article class="practice-question-card"><div class="practice-question-meta"><span>${ui('Question','السؤال','שאלה')} ${n} / ${state.items.length}</span><span>${state.difficulty.toUpperCase()}</span></div><div class="practice-equation">${chem(raw)}</div><h3>${state.type==='choice'?ui('Choose the balanced equation','اختر المعادلة الموزونة','בחר את המשוואה המאוזנת'):ui('Type the coefficients','اكتب المعاملات','הקלד את המקדמים')}</h3><div class="practice-controls">${controls}</div><div id="answerFeedback" class="answer-feedback hidden"></div></article>`;
 area.querySelectorAll('.practice-choice').forEach(b=>b.addEventListener('click',()=>gradeChoice(decodeURIComponent(b.dataset.choice),solution,hint)));
 area.querySelector('.practice-submit')?.addEventListener('click',()=>{const vals=[...area.querySelectorAll('[data-coef]')].map(x=>Number(x.value||0));gradeTyped(vals,coeffs(solution),solution,hint)});
 updateLive();
}
function mistakeMessage(raw,solution){const a=coeffs(raw),b=coeffs(solution);const parts=splitParts(raw),sol=splitParts(solution);const diffs=[];for(let i=0;i<Math.max(a.length,b.length);i++){const aa=a[i]||1,bb=b[i]||1;if(aa!==bb){const formula=(parts[i]||sol[i]||'').replace(/^\d+/,'');diffs.push(`${formula}: ${aa} → ${bb}`)}}return diffs.length?ui(`Check these coefficients: ${diffs.join(', ')}.` ,`راجع هذه المعاملات: ${diffs.join('، ')}.` ,`בדוק את המקדמים האלה: ${diffs.join(', ')}.`):ui('One or more coefficients are incorrect.','معامل واحد أو أكثر غير صحيح.','מקדם אחד או יותר שגוי.')}
function showFeedback(ok,raw,solution,hint){
 const f=$('answerFeedback');if(!f)return;
 f.className=`answer-feedback ${ok?'feedback-correct':'feedback-wrong'}`;
 f.innerHTML=ok?`<b>✓ ${ui('Correct answer','إجابة صحيحة','תשובה נכונה')}</b><div>${ui('Great work!','أحسنت!','עבודה מצוינת!')}</div><div class="feedback-correct-answer">${chem(solution)}</div>`:`<b>❌ ${ui('Your answer: Incorrect','إجابتك: غير صحيحة','התשובה שלך: שגויה')}</b><div><strong>${ui('Correct answer:','الإجابة الصحيحة:','תשובה נכונה:')}</strong> ${chem(solution)}</div><div><strong>${ui('Your mistake:','خطؤك:','הטעות שלך:')}</strong> ${mistakeMessage(raw,solution)}</div><div class="muted">${ui(hint,hint==='Balance hydrogen and oxygen.'?'وازن الهيدروجين والأكسجين.':hint,hint)}</div>`;
 const next=document.createElement('button');next.className='primary practice-next';next.textContent=ui('Next question →','السؤال التالي ←','השאלה הבאה →');next.type='button';next.addEventListener('click',()=>{state.index++;renderQuestion()});f.appendChild(next);
}
function gradeChoice(answer,solution,hint){const item=state.items[state.index];const ok=normalize(answer)===normalize(solution);submit(ok,item[0],answer,solution,hint)}
function gradeTyped(vals,expected,solution,hint){const ok=vals.length===expected.length&&vals.every((v,i)=>v===expected[i]);const ans=vals.join(' ');submit(ok,state.items[state.index][0],ans,solution,hint)}
function submit(ok,raw,answer,solution,hint){
 state.answered++;if(ok){state.correct++;state.streak++;state.bestStreak=Math.max(state.bestStreak,state.streak);state.score+=10+Math.min(10,state.streak-1);saveBest(state.score)}else state.streak=0;
 state.answers.push({question:raw,answer,expected:solution,correct:ok,hint});showFeedback(ok,raw,solution,hint);updateLive();
 if(state.experience==='quiz' && state.timed && state.answered>=state.items.length)finish();
}
function finish(){stopTimer();const acc=state.items.length?Math.round(state.correct/state.items.length*100):0;const best=loadBest();const area=$('quizArea');if(area)area.innerHTML=`<div class="final-results"><span class="eyebrow">${ui('RESULTS','النتيجة','النتائج')}</span><h2>${ui('Quiz complete!','اكتمل الاختبار!','החידון הסתיים!')}</h2><div class="final-score"><b>${state.score}</b><span>${ui('points','نقطة','נקודות')}</span></div><div class="final-grid"><div><b>${state.correct}/${state.items.length}</b><span>${ui('Correct','صحيح','נכון')}</span></div><div><b>${acc}%</b><span>${ui('Accuracy','الدقة','דיוק')}</span></div><div><b>${state.bestStreak}</b><span>${ui('Best streak','أفضل تتابع','רצף שיא')}</span></div><div><b>${best}</b><span>${ui('Best score','أفضل نتيجة','שיא ניקוד')}</span></div></div><div class="final-actions"><button id="restartPractice" class="primary" type="button">${ui('Try again','حاول مرة أخرى','נסה שוב')}</button><button id="retryWrongFinal" class="secondary" type="button">${ui('Review mistakes','راجع الأخطاء','סקור טעויות')}</button></div></div>`; $('restartPractice')?.addEventListener('click',start);$('retryWrongFinal')?.addEventListener('click',()=>{const wrong=state.answers.filter(x=>!x.correct);if(!wrong.length){start();return}state.items=wrong.map(x=>{const q=[...questions.easy,...questions.medium,...questions.hard].find(a=>normalize(a[0])===normalize(x.question));return q||[x.question,x.expected,x.hint]});state.index=0;state.score=0;state.streak=0;state.answered=0;state.correct=0;state.answers=[];renderStats();renderQuestion()});
}
function init(){inject();const stages=[...document.querySelectorAll('[data-stage]')];stages.forEach(b=>b.addEventListener('click',()=>{state.difficulty=b.dataset.stage}));$('newQuiz')?.addEventListener('click',start);$('retryMistakes')?.addEventListener('click',()=>{const wrong=JSON.parse(localStorage.getItem('chemistryQuizHistory')||'[]').flatMap(x=>x.questions||[]).filter(q=>!q.correct).slice(-8);if(!wrong.length){alert(ui('No saved mistakes yet. Finish a quiz first.','لا توجد أخطاء محفوظة بعد. أكمل اختبارًا أولًا.','אין עדיין טעויות שמורות. סיים חידון קודם.'));return}state.items=wrong.map(x=>[x.question,x.expected,x.hint]);state.index=0;state.score=0;state.streak=0;state.answered=0;state.correct=0;state.answers=[];renderStats();renderQuestion()});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();