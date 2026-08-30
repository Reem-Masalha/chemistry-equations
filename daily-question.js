(()=>{
'use strict';
const LANG=()=>localStorage.getItem('chemistryLanguage')||'en';
const T=(en,ar,he)=>LANG()==='ar'?ar:LANG()==='he'?he:en;
const KEY='chemistryDailyQuestionState';
const BANK=[
 ['Fe + O₂ → Fe₂O₃','4Fe + 3O₂ → 2Fe₂O₃','Balance Fe first, then O.'],
 ['H₂ + O₂ → H₂O','2H₂ + O₂ → 2H₂O','Balance H first, then O.'],
 ['Na + Cl₂ → NaCl','2Na + Cl₂ → 2NaCl','Remember that chlorine is Cl₂ as a free element.'],
 ['C₃H₈ + O₂ → CO₂ + H₂O','C₃H₈ + 5O₂ → 3CO₂ + 4H₂O','Balance C, then H, then O.'],
 ['N₂ + H₂ → NH₃','N₂ + 3H₂ → 2NH₃','Balance N first, then H.'],
 ['KClO₃ → KCl + O₂','2KClO₃ → 2KCl + 3O₂','Balance oxygen last, then reduce to whole numbers.']
];
const day=()=>new Date().toISOString().slice(0,10);
const question=()=>{let n=0;for(const c of day())n=(n*31+c.charCodeAt(0))%BANK.length;return BANK[n]};
const normalize=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)]).replace(/\s+/g,'').replace(/→|->|=/g,'->').toUpperCase();
const state=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}};
const save=s=>localStorage.setItem(KEY,JSON.stringify(s));
function css(){if(document.getElementById('daily-question-style'))return;const s=document.createElement('style');s.id='daily-question-style';s.textContent=`
.daily-question-card{margin-top:18px;padding:20px;border:1px solid var(--line);border-radius:18px;background:var(--surface);box-shadow:var(--shadow)}
.daily-question-card .daily-eyebrow{font-size:11px;letter-spacing:.12em;font-weight:800;color:var(--accent)}
.daily-question-card h2{margin:6px 0 8px}.daily-question-card p{color:var(--muted)}
.daily-question-equation{font-size:clamp(24px,4vw,38px);font-weight:900;direction:ltr;text-align:center;padding:18px 8px;margin:14px 0;border:1px solid var(--line);border-radius:14px;background:var(--surface)}
.daily-question-input{width:100%;box-sizing:border-box;padding:13px 14px;border:1px solid var(--line);border-radius:10px;font-size:17px;direction:ltr;text-align:center}
.daily-question-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.daily-question-actions>*{margin:0}.daily-question-feedback{min-height:26px;margin-top:10px;font-weight:700}.daily-question-complete{margin-top:14px;padding:14px;border-radius:13px;border:1px solid var(--line)}
.daily-question-attempt{font-size:13px;color:var(--muted);margin-top:7px}
@media(max-width:760px){.daily-question-card{padding:15px}.daily-question-actions>*{flex:1 1 160px}}
`;document.head.appendChild(s)}
function render(){if(!location.pathname.endsWith('learn.html'))return;const main=document.querySelector('main');if(!main||document.getElementById('daily-question-card'))return;const q=question(),st=state(),done=st.date===day()&&st.done===true;const section=document.createElement('section');section.className='section';section.id='daily-question-card';section.innerHTML=`<div class="daily-question-card"><div class="daily-eyebrow">🧪 ${T('DAILY CHEMISTRY CHALLENGE','التحدي اليومي للكيمياء','אתגר הכימיה היומי')}</div><h2>${T('Can you balance this?','هل يمكنك موازنة هذه المعادلة؟','האם يمكنك לאזן את המשוואה?')}</h2><p>${T('Solve it yourself first. You get another equation tomorrow.','حاول حلها بنفسك أولًا. ستحصل على معادلة جديدة غدًا.','פתרו בעצמכם קודם. מחר תקבלו משוואה חדשה.')}</p><div class="daily-question-equation">${q[0]}</div><input id="dailyQuestionInput" class="daily-question-input" ${done?'disabled':''} placeholder="${T('Enter the balanced equation','أدخل المعادلة الموازنة','הזינו את המשוואה המאוזנת')}"><div class="daily-question-actions"><button id="dailyQuestionCheck" class="primary" type="button" ${done?'disabled':''}>${done?'✓ '+T('Completed today','اكتمل اليوم','הושלם اليوم'):T('Check answer','تحقق من الإجابة','בדוק תשובה')}</button><button id="dailyQuestionHint" class="secondary" type="button" ${done?'disabled':''}>💡 ${T('Hint','تلميح','רמז')}</button></div><div id="dailyQuestionFeedback" class="daily-question-feedback">${done?'✓ '+T('You already completed today’s challenge. Come back tomorrow!','لقد أكملت تحدي اليوم بالفعل. عد غدًا!','כבר השלמתם את אתגר היום. חזרו מחר!'):''}</div><div class="daily-question-attempt">${T('No Balancer needed — this question is meant to be solved here.','لا تحتاج إلى الموازنة — هذه المعادلة مخصصة للحل هنا.','אין צורך במאזן — את השאלה הזו פותרים כאן.')}</div></div>`;main.appendChild(section);const input=section.querySelector('#dailyQuestionInput'),feedback=section.querySelector('#dailyQuestionFeedback');section.querySelector('#dailyQuestionHint').onclick=()=>{feedback.textContent='💡 '+q[2]};section.querySelector('#dailyQuestionCheck').onclick=()=>{const ok=normalize(input.value)===normalize(q[1]);if(ok){const x=state();x.date=day();x.done=true;x.completedAt=new Date().toISOString();save(x);feedback.innerHTML='✓ '+T('Correct! You balanced it yourself. +25 XP','صحيح! لقد وازنتها بنفسك. +25 XP','נכון! איזנתם בעצמכם. +25 XP');input.disabled=true;section.querySelector('#dailyQuestionCheck').disabled=true;section.querySelector('#dailyQuestionHint').disabled=true;setTimeout(()=>location.reload(),700)}else{feedback.textContent='❌ '+T('Not quite. Check the coefficients and try again.','ليس تمامًا. راجع المعاملات وحاول مرة أخرى.','לא בדיוק. בדקו את המקדמים ונסו שוב.')}};input.addEventListener('keydown',e=>{if(e.key==='Enter')section.querySelector('#dailyQuestionCheck').click()})}
function init(){css();render()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();