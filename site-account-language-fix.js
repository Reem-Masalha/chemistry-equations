(()=>{
'use strict';
const KEY='chemistryLanguage';
const DIR={en:'ltr',ar:'rtl',he:'rtl'};
const TEXT={
 ar:{
  'LIVE CHALLENGE':'⚡ التحدي المباشر','What gets checked?':'ما الذي يتم التحقق منه؟','Need help?':'تحتاج إلى مساعدة؟',
  'Open the Balancer to calculate the correct coefficients, or use the learning guide to see the method.':'افتح الموازنة لحساب المعاملات الصحيحة، أو استخدم دليل التعلّم لرؤية الطريقة.',
  'Open Balancer →':'افتح الموازنة ←','Learn how →':'تعلّم الطريقة ←','Practice page':'صفحة التدريب','Account':'الحساب','Language':'اللغة',
  'Same elements on both sides':'العناصر نفسها على الجانبين','Same number of atoms for every element':'العدد نفسه من الذرات لكل عنصر','Valid chemical formulas':'الصيغ الكيميائية الصحيحة','Simplest whole-number coefficients':'أبسط معاملات بأعداد صحيحة',
  'Solo Practice':'التدريب الفردي','Multiplayer Challenge':'تحدي اللعب الجماعي','Practice':'التدريب','Learn':'تعلّم','Quiz':'اختبار','Challenges':'التحديات','Balancer':'موازنة المعادلات','Checker':'التحقق',
  'Solo Practice and Multiplayer Challenge are separate experiences. In a challenge, both players get the same questions and race against the clock.':'التدريب الفردي وتحدي اللعب الجماعي تجربتان منفصلتان. في التحدي، يحصل كلا اللاعبين على الأسئلة نفسها ويتسابقان مع عقارب الساعة.',
  'No challenge results yet. Be the first!':'لا توجد نتائج تحديات بعد. كن الأول!',
  'Your balanced answer':'المعادلة الموازنة','Your balanced equation':'المعادلة الموازنة'
 },
 he:{
  'LIVE CHALLENGE':'⚡ אתגר בזמן אמת','What gets checked?':'מה נבדק?','Need help?':'זקוקים לעזרה?',
  'Open the Balancer to calculate the correct coefficients, or use the learning guide to see the method.':'פתחו את המאזן כדי לחשב את המקדמים הנכונים, או השתמשו במדריך הלמידה כדי לראות את השיטה.',
  'Open Balancer →':'פתחו את המאזן ←','Learn how →':'למדו כיצד ←','Practice page':'דף התרגול','Account':'חשבון','Language':'שפה',
  'Same elements on both sides':'אותם יסודות בשני הצדדים','Same number of atoms for every element':'אותו מספר אטומים מכל יסוד','Valid chemical formulas':'נוסחאות כימיות תקינות','Simplest whole-number coefficients':'המקדמים השלמים הקטנים ביותר',
  'Solo Practice':'תרגול אישי','Multiplayer Challenge':'אתגר מרובה משתתפים','Practice':'תרגול','Learn':'למידה','Quiz':'חידון','Challenges':'אתגרים','Balancer':'איזון משוואות','Checker':'בדיקה',
  'Solo Practice and Multiplayer Challenge are separate experiences. In a challenge, both players get the same questions and race against the clock.':'תרגול אישי ואתגר מרובה משתתפים הם חוויות נפרדות. באתגר, שני השחקנים מקבלים את אותן השאלות ומתחרים מול השעון.',
  'No challenge results yet. Be the first!':'עדיין אין תוצאות אתגר. היו הראשונים!',
  'Your balanced answer':'המשוואה המאוזנת שלכם','Your balanced equation':'המשוואה המאוזנת שלכם'
 }
};
const reverse={ar:Object.fromEntries(Object.entries(TEXT.ar).map(([en,tr])=>[tr,en])),he:Object.fromEntries(Object.entries(TEXT.he).map(([en,tr])=>[tr,en]))};
function lang(){const v=(localStorage.getItem(KEY)||'en').toLowerCase();return DIR[v]?v:'en'}
function allMaps(){const l=lang();return l==='en'?null:{target:TEXT[l],rev:Object.assign({},reverse.ar,reverse.he)}}
function translateRoot(root=document.body){const l=lang();if(!TEXT[l])return;const target=TEXT[l],maps=allMaps();const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];while(w.nextNode())nodes.push(w.currentNode);for(const n of nodes){const p=n.parentElement;if(!p||['SCRIPT','STYLE','NOSCRIPT'].includes(p.tagName))continue;const raw=n.nodeValue||'',t=raw.trim();if(!t)continue;let v=target[t];if(!v&&maps.rev[t])v=target[maps.rev[t]];if(v&&v!==t)n.nodeValue=raw.replace(t,v)} }
function setDirection(){const l=lang();document.documentElement.dir=DIR[l]||'ltr';document.documentElement.lang=l}
function refresh(){setDirection();translateRoot()}
function ensureAccount(){const b=document.getElementById('accountTopBtn');if(!b||b.dataset.accountFixInstalled)return;b.dataset.accountFixInstalled='1';b.type='button';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const modal=document.getElementById('accountModal');if(modal){modal.style.display='block';modal.setAttribute('aria-hidden','false');const title=document.getElementById('accountTitle');if(title&&!title.textContent.trim())title.textContent=lang()==='ar'?'تسجيل الدخول':lang()==='he'?'כניסה':'Sign in';return}const sessionKey='chemistryCurrentUser';let signed=false;try{signed=!!JSON.parse(localStorage.getItem(sessionKey)||sessionStorage.getItem(sessionKey)||'null')?.token}catch{}if(signed){location.href='profile.html';return}const next=document.createElement('div');next.id='accountModal';next.innerHTML='<div style="position:absolute;inset:0;background:rgba(0,0,0,.6)" data-account-close></div><div style="position:relative;width:min(92vw,480px);margin:8vh auto;padding:28px;border-radius:20px;background:#fff;color:#111;box-shadow:0 20px 60px #0005"><button type="button" data-account-close style="position:absolute;right:12px;top:8px;border:0;background:none;font-size:30px;cursor:pointer">×</button><h2 id="accountTitle">'+(lang()==='ar'?'تسجيل الدخول':lang()==='he'?'כניסה':'Sign in')+'</h2><p>'+(lang()==='ar'?'سجّل الدخول للوصول إلى درجاتك وتقدمك المحفوظ.':lang()==='he'?'התחברו כדי לגשת לניקוד ולהתקדמות השמורים שלכם.':'Sign in to access your saved scores and progress.')+'</p><p><a href="profile.html">'+(lang()==='ar'?'فتح الحساب':lang()==='he'?'פתיחת החשבון':'Open account')+'</a></p></div>';document.body.appendChild(next);next.querySelectorAll('[data-account-close]').forEach(x=>x.addEventListener('click',()=>{next.remove()}));});}
function start(){refresh();ensureAccount();window.addEventListener('chemistryLanguageChanged',refresh);window.addEventListener('storage',e=>{if(e.key===KEY)refresh()});['challengeArea','hostSetup','leaderboard','accountModal'].forEach(id=>{const e=document.getElementById(id);if(e)new MutationObserver(()=>{translateRoot(e);ensureAccount()}).observe(e,{childList:true,subtree:true})})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
