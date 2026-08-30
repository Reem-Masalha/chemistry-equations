(()=>{
'use strict';
const LANG=()=>localStorage.getItem('chemistryLanguage')||'en';
const T=(en,ar,he)=>LANG()==='ar'?ar:LANG()==='he'?he:en;
const DAY=()=>new Date().toISOString().slice(0,10);
const KEY='chemistryDailyChallengeReal';
const STREAK='chemistryStudyStreak';
const BANK=[
  ['Fe + O₂ → Fe₂O₃','4Fe + 3O₂ → 2Fe₂O₃','Balance iron first, then oxygen.'],
  ['H₂ + O₂ → H₂O','2H₂ + O₂ → 2H₂O','Balance hydrogen first, then oxygen.'],
  ['Na + Cl₂ → NaCl','2Na + Cl₂ → 2NaCl','Remember that chlorine is Cl₂ as a free element.'],
  ['C₃H₈ + O₂ → CO₂ + H₂O','C₃H₈ + 5O₂ → 3CO₂ + 4H₂O','Balance carbon first, hydrogen second, oxygen last.'],
  ['N₂ + H₂ → NH₃','N₂ + 3H₂ → 2NH₃','Balance nitrogen first, then hydrogen.'],
  ['KClO₃ → KCl + O₂','2KClO₃ → 2KCl + 3O₂','Balance oxygen last, then use the smallest whole-number ratio.']
];
const choose=()=>{let n=0;for(const c of DAY())n=(n*31+c.charCodeAt(0))%BANK.length;return BANK[n]};
const norm=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)]).replace(/\s+/g,'').replace(/→|->|=/g,'->').toUpperCase();
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'')}catch{return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
function css(){if(document.getElementById('real-daily-style'))return;const s=document.createElement('style');s.id='real-daily-style';s.textContent=`
.real-daily{margin-top:24px}.real-daily-card{padding:24px;border:1px solid var(--line,#dce3ee);border-radius:20px;background:var(--surface,#fff);box-shadow:0 10px 28px rgba(25,43,76,.07)}
.real-daily-top{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.real-daily-kicker{font-size:11px;letter-spacing:.12em;font-weight:800;color:var(--accent)}
.real-daily-card h2{margin:6px 0 7px}.real-daily-sub{color:var(--muted);margin:0}.real-daily-eq{font-size:clamp(25px,4vw,40px);font-weight:900;direction:ltr;text-align:center;padding:19px 10px;margin:18px 0 13px;border:1px solid var(--line);border-radius:15px;background:var(--surface)}
.real-daily-input{width:100%;box-sizing:border-box;padding:14px 15px;border:1px solid var(--line);border-radius:11px;font-size:17px;direction:ltr;text-align:center;background:transparent;color:inherit}.real-daily-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:10px}.real-daily-actions>*{min-height:44px}.real-daily-feedback{min-height:27px;margin-top:10px;font-weight:800}.real-daily-attempts{font-size:12px;color:var(--muted);margin-top:7px}.real-daily-hint{margin-top:10px;padding:12px 14px;border-radius:12px;background:#f6f8fc;border:1px solid var(--line);color:var(--muted)}
.real-daily-complete{margin-top:15px;padding:16px;border-radius:15px;background:#f3fbf6;border:1px solid #c9e7d3}.real-daily-complete strong{display:block;font-size:20px;margin-bottom:4px}.real-daily-reward{margin-top:8px;font-weight:900}.real-daily-next{display:flex;gap:9px;flex-wrap:wrap;margin-top:12px}
body.dark .real-daily-hint{background:#1b2330}.real-daily-badge{display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border-radius:999px;background:#edf1ff;color:#3158d6;font-size:12px;font-weight:800;white-space:nowrap}
@media(max-width:760px){.real-daily-card{padding:17px}.real-daily-top{flex-direction:column}.real-daily-badge{align-self:flex-start}.real-daily-actions>*{flex:1 1 160px}}
`;document.head.appendChild(s)}
function updateStreak(){const old=read(STREAK,{count:0,last:''}),today=DAY();let count=1;if(old.last===today)count=Number(old.count||1);else if(old.last){const delta=(new Date(today)-new Date(old.last))/86400000;count=delta===1?Number(old.count||0)+1:1}write(STREAK,{count,last:today});return count}
function render(){if(!location.pathname.endsWith('learn.html'))return;css();
  document.getElementById('ce3-daily-card')?.remove();
  document.getElementById('daily-question-card')?.remove();
  if(document.getElementById('real-daily'))return;
  const main=document.querySelector('main');if(!main)return;
  const q=choose(),today=DAY(),saved=read(KEY,{}),done=saved.date===today&&saved.done===true;
  const sec=document.createElement('section');sec.className='section real-daily';sec.id='real-daily';
  sec.innerHTML=`<div class="real-daily-card"><div class="real-daily-top"><div><div class="real-daily-kicker">🧪 ${T('DAILY CHEMISTRY CHALLENGE','التحدي اليومي للكيمياء','אתגר הכימיה היומי')}</div><h2>${T('Can you balance this?','هل يمكنك موازنة هذه المعادلة؟','האם يمكنك לאזן את המשוואה?')}</h2><p class="real-daily-sub">${T('5 equations · 2 minutes · A new challenge every day','٥ معادلات · دقيقتان · تحدٍ جديد كل يوم','5 משוואות · 2 דקות · אתגר חדש בכל יום')}</p></div><span class="real-daily-badge">🔥 ${done?T('Completed today','أكملت تحدي اليوم','הושלם היום'):T('Today’s challenge','تحدي اليوم','אתגר היום')}</span></div><div class="real-daily-eq">${q[0]}</div><input id="realDailyInput" class="real-daily-input" type="text" autocomplete="off" ${done?'disabled':''} placeholder="${T('Enter your balanced equation','أدخل المعادلة الموازنة','הזינו את המשוואה המאוזנת')}"><div class="real-daily-actions"><button id="realDailyCheck" class="primary" type="button" ${done?'disabled':''}>${done?'✓ '+T('Completed','اكتمل','הושלם'):T('Check answer','تحقق من الإجابة','בדוק תשובה')}</button><button id="realDailyHint" class="secondary" type="button" ${done?'disabled':''}>💡 ${T('Hint','تلميح','רמז')}</button></div><div id="realDailyFeedback" class="real-daily-feedback">${done?'✓ '+T('You solved today’s challenge. Come back tomorrow for a new one!','لقد حللت تحدي اليوم. عد غدًا لتحدٍ جديد!','פתרתם את אתגר היום. חזרו מחר לאתגר חדש!'):''}</div><div id="realDailyAttempts" class="real-daily-attempts">${done?'':T('Solve it here — the Balancer will not give you the answer.','פתרו כאן — الموازنة لن تعطيك الإجابة.','פתרו כאן — המאזן לא ייתן לכם את התשובה.')}</div><div id="realDailyHintBox" class="real-daily-hint" hidden></div></div>`;
  const anchor=main.querySelector('#course-map'); if(anchor) anchor.insertAdjacentElement('beforebegin',sec); else main.prepend(sec);
  const input=sec.querySelector('#realDailyInput'),feedback=sec.querySelector('#realDailyFeedback'),attempts=sec.querySelector('#realDailyAttempts'),hint=sec.querySelector('#realDailyHintBox');
  let tries=Number(saved.tries||0);
  sec.querySelector('#realDailyHint').onclick=()=>{hint.hidden=false;hint.textContent='💡 '+q[2]};
  const check=()=>{if(done)return;tries++;const ok=norm(input.value)===norm(q[1]);write(KEY,{date:today,done:false,tries});if(ok){const streak=updateStreak();write(KEY,{date:today,done:true,tries,completedAt:new Date().toISOString()});feedback.textContent='✓ '+T('Correct! You balanced it yourself.','صحيح! لقد وازنتها بنفسك.','נכון! איזנתם בעצמכם.');attempts.textContent=T(`🔥 ${streak}-day balancing streak · +25 XP`,`🔥 سلسلة موازنة ${streak} أيام · +25 XP`,`🔥 רצף איזון של ${streak} ימים · +25 XP`);input.disabled=true;sec.querySelector('#realDailyCheck').disabled=true;sec.querySelector('#realDailyHint').disabled=true;hint.hidden=true;const box=document.createElement('div');box.className='real-daily-complete';box.innerHTML=`<strong>🎉 ${T('Challenge complete!','اكتمل التحدي!','האתגר הושלם!')}</strong><span>${T('Great work — you solved the equation without using the Balancer.','أحسنت — لقد حللت المعادلة دون استخدام الموازنة.','כל הכבוד — פתרתם את המשוואה בלי להשתמש במאזן.')}</span><div class="real-daily-reward">+25 XP &nbsp; 🏅 ${T('Daily Solver','محلل يومي','פותח יומי')}</div><div class="real-daily-next"><a class="primary" href="personal-quiz.html">${T('Keep practicing →','تابع التدريب ←','המשיכו לתרגל ←')}</a><a class="secondary" href="challenges.html">${T('More challenges','مزيد من التحديات','אתגרים נוספים')}</a></div>`;sec.querySelector('.real-daily-card').appendChild(box)}else{feedback.textContent='❌ '+T('Not quite. Check your coefficients and try again.','ليس تمامًا. راجع المعاملات وحاول مرة أخرى.','לא בדיוק. בדקו את המקדמים ונסו שוב.');attempts.textContent=T(`${tries} attempt${tries===1?'':'s'} — you can try again.`,`${tries} محاولة — يمكنك المحاولة مرة أخرى.`,`${tries} ניסיונות — אפשר לנסות שוב.`)}};
  sec.querySelector('#realDailyCheck').onclick=check;input.addEventListener('keydown',e=>{if(e.key==='Enter')check()})
}
function init(){render();setTimeout(render,300)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
