(()=>{
'use strict';
if(!location.pathname.endsWith('learn.html')||window.__dailyV8Loaded)return;
window.__dailyV8Loaded=true;
const lang=()=>localStorage.getItem('chemistryLanguage')||'en';
const T=(e,a,h)=>lang()==='ar'?a:lang()==='he'?h:e;
function polish(){
  const root=document.getElementById('dc7');
  if(!root||root.dataset.v8Polished==='1')return;
  const result=root.querySelector('#dc7Result');
  if(!result||result.hidden)return;
  root.dataset.v8Polished='1';
  const scoreText=root.querySelector('#dc7Score')?.textContent||'0';
  const score=Number(scoreText)||0;
  const message=score===5
    ?T('Perfect score! You balanced all five equations correctly.','نتيجة كاملة! وازنت المعادلات الخمس بشكل صحيح.','תוצאה מושלמת! איזנתם את כל חמש המשוואות נכון.')
    :score>=4
      ?T('Great work! You are getting very close to mastering the method.','عمل رائع! أنت تقترب جدًا من إتقان الطريقة.','עבודה נהדרת! אתם מתקרבים מאוד לשליטה בשיטה.')
      :score>=3
        ?T('Good effort! Review the method, then practise a few more equations.','محاولة جيدة! راجع الطريقة ثم تدرّب على المزيد من المعادلات.','מאמץ טוב! חזרו על השיטה ואז תרגלו עוד כמה משוואות.')
        :T('Keep practising. A quick review of the method will help.','واصل التدريب. مراجعة سريعة للطريقة ستساعدك.','המשיכו לתרגל. חזרה קצרה על השיטה תעזור.');
  result.hidden=false;
  result.innerHTML='<div class="dc7-complete-wrap">'
    +'<div class="dc7-complete-kicker">✓ '+T('Daily challenge completed','اكتمل التحدي اليومي','האתגר היומי הושלם')+'</div>'
    +'<div class="dc7-big">'+score+'/5</div>'
    +'<h3>'+message+'</h3>'
    +'<p>'+T('You have completed today’s challenge. Come back tomorrow for a new set of five equations.','لقد أكملت تحدي اليوم. عد غدًا لمجموعة جديدة من خمس معادلات.','השלמתם את האתגר של היום. חזרו מחר לסט חדש של חמש משוואות.')+'</p>'
    +'<p class="dc7-xp">+'+(score*25)+' XP</p>'
    +'<div class="dc7-actions">'
    +'<a class="primary" href="beginner-lessons.html#balancing-method">'+T('Learn the method →','تعلّم الطريقة ←','למדו את השיטה ←')+'</a>'
    +'<a class="secondary" href="personal-quiz.html?stage=easy">'+T('Practise more →','تدرّب أكثر ←','תרגלו עוד ←')+'</a>'
    +'</div></div>';
  root.querySelector('#dc7Eq')?.setAttribute('aria-hidden','true');
  const oldHint=root.querySelector('[data-dc7-hint]'); if(oldHint)oldHint.remove();
}
const style=document.createElement('style');
style.textContent='.dc7-complete-wrap{text-align:center}.dc7-complete-kicker{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:6px}.dc7-complete-wrap h3{margin:6px 0 8px}.dc7-complete-wrap p{color:var(--muted);margin:7px 0}.dc7-xp{font-weight:900!important;color:var(--accent)!important}.dc7-complete-wrap .dc7-actions{justify-content:center;margin-top:16px}.dc7-complete-wrap .dc7-actions a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;border-radius:10px}';
document.head.appendChild(style);
const observer=new MutationObserver(polish);
observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
let tries=0;const poll=setInterval(()=>{polish();if(++tries>120)clearInterval(poll)},250);
})();
