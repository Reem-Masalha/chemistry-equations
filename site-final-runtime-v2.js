(()=>{
'use strict';
const KEY='chemistryLanguage';
const LANG={en:'ltr',ar:'rtl',he:'rtl'};
const TEXT={
 ar:{
  'LIVE CHALLENGE':'⚡ التحدي المباشر','What gets checked?':'ما الذي يتم التحقق منه؟','Need help?':'تحتاج إلى مساعدة؟',
  'Open the Balancer to calculate the correct coefficients, or use the learning guide to see the method.':'افتح الموازنة لحساب المعاملات الصحيحة، أو استخدم دليل التعلّم لرؤية الطريقة.',
  'Open Balancer →':'افتح الموازنة ←','Learn how →':'تعلّم الطريقة ←','Practice page':'صفحة التدريب','Account':'الحساب','Language':'اللغة',
  'Same elements on both sides':'العناصر نفسها على الجانبين','Same number of atoms for every element':'العدد نفسه من الذرات لكل عنصر','Valid chemical formulas':'الصيغ الكيميائية الصحيحة','Simplest whole-number coefficients':'أبسط معاملات بأعداد صحيحة',
  'Learn':'تعلّم','Quiz':'اختبار','Challenges':'التحديات','Balancer':'موازنة المعادلات','Checker':'التحقق','Practice':'التدريب',
  'Solo Practice':'التدريب الفردي','Multiplayer Challenge':'تحدي اللعب الجماعي',
  'Solo Practice and Multiplayer Challenge are separate experiences. In a challenge, both players get the same questions and race against the clock.':'التدريب الفردي وتحدي اللعب الجماعي تجربتان منفصلتان. في التحدي، يحصل كلا اللاعبين على الأسئلة نفسها ويتسابقان مع عقارب الساعة.',
  'No challenge results yet. Be the first!':'لا توجد نتائج تحديات بعد. كن الأول!',
  'Your balanced answer':'المعادلة الموازنة','Your balanced equation':'المعادلة الموازنة',
  'Sign in':'تسجيل الدخول','Sign up':'إنشاء حساب','Back to sign in':'العودة إلى تسجيل الدخول','View profile':'عرض الملف الشخصي','Account & security':'الحساب والأمان','Sign out':'تسجيل الخروج','Change password':'تغيير كلمة المرور','Reset password':'إعادة تعيين كلمة المرور','Delete account':'حذف الحساب','Name':'الاسم','Username':'اسم المستخدم','Password':'كلمة المرور','Confirm password':'تأكيد كلمة المرور','Recovery code':'رمز الاسترداد','Copy code':'نسخ الرمز','Print':'طباعة','Close':'إغلاق','Open account':'فتح الحساب','Show':'إظهار','Hide':'إخفاء'
 },
 he:{
  'LIVE CHALLENGE':'⚡ אתגר בזמן אמת','What gets checked?':'מה נבדק?','Need help?':'זקוקים לעזרה?',
  'Open the Balancer to calculate the correct coefficients, or use the learning guide to see the method.':'פתחו את המאזן כדי לחשב את המקדמים הנכונים, או השתמשו במדריך הלמידה כדי לראות את השיטה.',
  'Open Balancer →':'פתחו את המאזן ←','Learn how →':'למדו כיצד ←','Practice page':'דף התרגול','Account':'חשבון','Language':'שפה',
  'Same elements on both sides':'אותם יסודות בשני הצדדים','Same number of atoms for every element':'אותו מספר אטומים מכל יסוד','Valid chemical formulas':'נוסחאות כימיות תקינות','Simplest whole-number coefficients':'המקדמים השלמים הקטנים ביותר',
  'Learn':'למידה','Quiz':'חידון','Challenges':'אתגרים','Balancer':'איזון משוואות','Checker':'בדיקה','Practice':'תרגול',
  'Solo Practice':'תרגול אישי','Multiplayer Challenge':'אתגר מרובה משתתפים',
  'Solo Practice and Multiplayer Challenge are separate experiences. In a challenge, both players get the same questions and race against the clock.':'תרגול אישי ואתגר מרובה משתתפים הם חוויות נפרדות. באתגר, שני השחקנים מקבלים את אותן השאלות ומתחרים מול השעון.',
  'No challenge results yet. Be the first!':'עדיין אין תוצאות אתגר. היו הראשונים!',
  'Your balanced answer':'המשוואה המאוזנת שלכם','Your balanced equation':'המשוואה המאוזנת שלכם',
  'Sign in':'כניסה','Sign up':'הרשמה','Back to sign in':'חזרה לכניסה','View profile':'הצגת הפרופיל','Account & security':'חשבון ואבטחה','Sign out':'יציאה','Change password':'שינוי סיסמה','Reset password':'איפוס סיסמה','Delete account':'מחיקת החשבון','Name':'שם','Username':'שם משתמש','Password':'סיסמה','Confirm password':'אישור סיסמה','Recovery code':'קוד שחזור','Copy code':'העתקת קוד','Print':'הדפסה','Close':'סגירה','Open account':'פתיחת החשבון','Show':'הצגה','Hide':'הסתרה'
 }
};
const reverse={ar:Object.fromEntries(Object.entries(TEXT.ar).map(([en,tr])=>[tr,en])),he:Object.fromEntries(Object.entries(TEXT.he).map(([en,tr])=>[tr,en]))};
function lang(){const v=(localStorage.getItem(KEY)||'en').toLowerCase();return LANG[v]?v:'en'}
function baseText(t){return reverse.ar[t]||reverse.he[t]||t}
function translateValue(value,l){const t=String(value??'');if(!TEXT[l])return t;const base=baseText(t.trim());return t.trim()===base?(TEXT[l][base]||t): (TEXT[l][base]||t)}
function protectedNode(el){return !el||!!el.closest('script,style,noscript,textarea,select,option,input,code,pre,.equation,.chemical-equation,.formula,.math,[data-no-translate],#site-language-control')}
function translateRoot(root=document.body){const l=lang();if(l==='en'){document.documentElement.lang='en';document.documentElement.dir='ltr';return}document.documentElement.lang=l;document.documentElement.dir='rtl';if(document.body)document.body.dir='rtl';const m=TEXT[l];const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];while(w.nextNode())nodes.push(w.currentNode);for(const n of nodes){if(protectedNode(n.parentElement))continue;const raw=n.nodeValue||'';const t=raw.trim();if(!t)continue;const base=baseText(t);const out=m[base];if(out&&out!==t)n.nodeValue=raw.replace(t,out)}
 const els=root.querySelectorAll?.('input[placeholder],textarea[placeholder],input[aria-label],textarea[aria-label],button[aria-label],a[title],button[title],input[title]')||[];for(const el of els){if(protectedNode(el))continue;for(const attr of ['placeholder','aria-label','title']){const v=el.getAttribute(attr);if(v){const base=baseText(v.trim());const out=m[base];if(out)el.setAttribute(attr,out)}}}}
function refresh(){try{window.ChemLang?.refresh?.()}catch{}translateRoot(document.body)}
function start(){refresh();setTimeout(refresh,100);setTimeout(refresh,400);window.addEventListener('chemistryLanguageChanged',refresh);window.addEventListener('storage',e=>{if(e.key===KEY)refresh()});for(const id of ['challengeArea','hostSetup','leaderboard','accountModal']){const e=document.getElementById(id);if(e){let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>translateRoot(e),20)}).observe(e,{childList:true,subtree:true})}}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
