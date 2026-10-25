(()=>{
'use strict';
const KEY='chemistryLanguage';
const LANG={en:{dir:'ltr',label:'English'},ar:{dir:'rtl',label:'العربية'},he:{dir:'rtl',label:'עברית'}};
let M={};
const originals=new WeakMap();
const reverse=new Map();
function getLang(){try{const v=localStorage.getItem(KEY);return LANG[v]?v:'en'}catch{return'en'}}
function isProtected(el){return !el||!!el.closest('script,style,noscript,textarea,select,option,code,pre,[data-no-translate],.equation,.chemical-equation,.formula,.math,[data-equation],[data-chemical],.site-language-control')}
function normalize(s){return String(s??'').replace(/\s+/g,' ').trim()}
function buildReverse(){reverse.clear();for(const [en,v] of Object.entries(M)){if(v&&v[0])reverse.set(normalize(v[0]),en);if(v&&v[1])reverse.set(normalize(v[1]),en)}}
function baseText(raw){const b=normalize(raw);if(!b)return b;if(M[b])return b;return reverse.get(b)||b}
function translateDynamic(base,l){
 if(l==='en')return base;
 if(base==='Balance an equation')return l==='ar'?'وازن معادلة':'אזן משוואה';
 const balance=base.match(/^Balance (.+)$/);
 if(balance)return l==='ar'?'وازن '+balance[1]:'אזנו '+balance[1];
 const challenge=base.match(/^Today's challenge · (.+)$/);
 if(challenge)return l==='ar'?'تحدي اليوم · '+challenge[1]:'האתגר של היום · '+challenge[1];
 const questions=base.match(/^(\d+) questions · (\d+) concepts: (.+)$/);
 if(questions){
  const count=questions[1],conceptCount=questions[2];
  return l==='ar'?count+' سؤالًا · '+conceptCount+' مفاهيم: الموازنة الأساسية · المعاملات · العناصر ثنائية الذرة · المعادلات المتوازنة مسبقًا · الصيغ الصعبة · الأقواس · الأيونات متعددة الذرات · الاحتراق · الأكسدة والاختزال · المعادلات الأيونية':count+' שאלות · '+conceptCount+' מושגים: איזון בסיסי · מקדמים · יסודות דו-אטומיים · משוואות שכבר מאוזנות · נוסחאות מורכבות · סוגריים · יונים רב-אטומיים · בעירה · חמצון-חיזור · משוואות יוניות';
 }
 const streak=base.match(/^Daily practice streak: (\d+) (day|days) · Best: (\d+)$/);
 if(streak){
  const current=Number(streak[1]),best=Number(streak[3]);
  return l==='ar'?'سلسلة التدريب اليومي: '+current+' يوم · الأفضل: '+best:'רצף תרגול יומי: '+current+' ימים · שיא: '+best;
 }
 const shortStreak=base.match(/^Daily practice streak: (\\d+) days?$/);if(shortStreak){const n=shortStreak[1];return l==='ar'?'سلسلة التدريب اليومي: '+n+' يوم':'רצף תרגול יומי: '+n+' ימים';}
 return base;
}
function scan(root,l){
 const walker=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT);const nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 for(const n of nodes){const p=n.parentElement;const raw=n.nodeValue||'';const nrm=normalize(raw);if(!nrm)continue;if(nrm.startsWith('Balance ')||nrm.startsWith("Today's challenge · ")){const dynamic=translateDynamic(nrm,l);if(dynamic!==nrm)n.nodeValue=raw.replace(nrm,dynamic)}if(isProtected(p))continue;
  if(!originals.has(n))originals.set(n,baseText(nrm));
  const base=originals.get(n);const v=M[base];const translated=v&&v[l==='ar'?0:1];const out=l==='en'?base:(translated||translateDynamic(base,l));
  if(out!==nrm)n.nodeValue=raw.replace(nrm,out);
 }
 const els=(root||document).querySelectorAll?.('input[placeholder],textarea[placeholder],[aria-label],[title]')||[];
 for(const el of els){if(isProtected(el))continue;for(const a of ['placeholder','aria-label','title']){if(!el.hasAttribute(a))continue;const raw=el.getAttribute(a)||'';const b=originals.get(el)||baseText(raw);originals.set(el,b);const v=M[b];const translated=v&&v[l==='ar'?0:1];const out=l==='en'?b:(translated||translateDynamic(b,l));if(out!==raw)el.setAttribute(a,out)}}
}
function shell(){
 const top=document.querySelector('.topbar');if(!top)return;
 let box=document.getElementById('site-language-control');
 if(!box){
  box=document.createElement('label');
  box.id='site-language-control';
  box.className='site-language-control';
  box.innerHTML='<span class="site-language-icon" aria-hidden="true">🌐</span><span class="site-language-label">Language</span><select id="site-language-select" aria-label="Language"><option value="en">English</option><option value="ar">العربية</option><option value="he">עברית</option></select>';
  const controls=document.getElementById('topbarControls');
  (controls||top).appendChild(box);
  box.querySelector('select').addEventListener('change',e=>{try{localStorage.setItem(KEY,e.target.value)}catch{};location.reload()});
 }else{
  const controls=document.getElementById('topbarControls');
  if(controls&&box.parentElement!==controls)controls.appendChild(box);
 }
 const languageLabel=box.querySelector('.site-language-label');if(languageLabel)languageLabel.textContent=getLang()==='ar'?'اللغة':getLang()==='he'?'שפה':'Language';
 const languageSelect=box.querySelector('select');if(languageSelect)languageSelect.setAttribute('aria-label',languageLabel?.textContent||'Language');
 box.querySelector('select').value=getLang();
 const b=document.getElementById('accountTopBtn');if(b&&!b.dataset.i18nSafe){b.dataset.i18nSafe='1';b.addEventListener('click',()=>{setTimeout(()=>{const modal=document.getElementById('accountModal');if(modal)modal.style.display='block'},0)})}
}
function rtlCss(){if(document.getElementById('i18n-safe-style'))return;const s=document.createElement('style');s.id='i18n-safe-style';s.textContent=`html[dir="rtl"] body{text-align:right}html[dir="rtl"] .topbar,html[dir="rtl"] .main-nav,html[dir="rtl"] .section-head,html[dir="rtl"] .input-row,html[dir="rtl"] .hand-head,html[dir="rtl"] .hand-actions,html[dir="rtl"] .balancer-actions,html[dir="rtl"] .pad-tools{direction:rtl}html[dir="rtl"] .main-nav{flex-direction:row-reverse}html[dir="rtl"] .brand{direction:ltr}html[dir="rtl"] input:not([data-equation]),html[dir="rtl"] textarea{direction:rtl;text-align:right}html[dir="rtl"] .equation,html[dir="rtl"] .chemical-equation,html[dir="rtl"] .formula,html[dir="rtl"] [data-equation],html[dir="rtl"] [data-chemical],html[dir="rtl"] .math{direction:ltr!important;text-align:left!important;unicode-bidi:isolate}.site-language-control{display:inline-flex!important;align-items:center;gap:7px;margin-left:10px;white-space:nowrap}.site-language-control select{font:inherit;min-height:36px}html[dir="rtl"] .site-language-control{margin-left:0;margin-right:10px}`;document.head.appendChild(s)}
function apply(l=getLang){l=LANG[l]?l:getLang();document.documentElement.lang=l;document.documentElement.dir=LANG[l].dir;document.body.dir=LANG[l].dir;document.body.classList.toggle('is-rtl-language',l!=='en');shell();rtlCss();if(Object.keys(M).length)scan(document.body,l)}
async function loadDictionary(){try{const r=await fetch('site-language-v2.js?dict=20261025-translation-audit-5',{cache:'no-store'});const src=await r.text();const start=src.indexOf('const M=');const end=src.indexOf(';\nconst original',start);if(start<0||end<0)throw Error('dictionary not found');M=Function('return '+src.slice(start+8,end))();Object.assign(M,{"OWNER CONTROL CENTER":["مركز تحكم المالك","מרכז הבקרה של הבעלים"],"Admin Tools":["أدوات الإدارة","כלי ניהול"],"Everything you need to test, inspect and manage the Chemistry Equations site — without replacing the normal user experience.":["كل ما تحتاج إليه لاختبار موقع المعادلات الكيميائية وفحصه وإدارته — دون التأثير في تجربة المستخدم العادية.","כל מה שצריך כדי לבדוק, לבחון ולנהל את אתר Chemistry Equations — בלי לשנות את חוויית המשתמש הרגילה."],"Analytics dashboard":["لوحة الإحصاءات","לוח נתוני שימוש"],"Refresh data":["تحديث البيانات","רענון נתונים"],"SECURE ACCESS":["وصول آمن","גישה מאובטחת"],"Admin access":["صلاحيات الإدارة","גישה לניהול"],"Enter the owner key to load protected analytics and account tools.":["أدخل مفتاح المالك لتحميل الإحصاءات المحمية وأدوات الحساب.","הזינו את מפתח הבעלים כדי לטעון נתוני שימוש מוגנים וכלי חשבונות."],"Load admin data":["تحميل بيانات الإدارة","טעינת נתוני ניהול"],"SITE TESTING":["اختبار الموقع","בדיקת האתר"],"Quick tools":["أدوات سريعة","כלים מהירים"],"Open the real site features in their normal pages.":["افتح ميزات الموقع الفعلية في صفحاتها المعتادة.","פתחו את תכונות האתר בעמודים הרגילים שלהן."],"⚡ Daily Challenge":["⚡ التحدي اليومي","⚡ אתגר יומי"],"Open today's challenge.":["افتح تحدي اليوم.","פתחו את אתגר היום."],"↻ Replay Daily Challenge":["↻ إعادة التحدي اليومي","↻ הפעלה חוזרת של האתגר היומי"],"Launch today's challenge as a practice replay.":["ابدأ تحدي اليوم كتدريب تجريبي.","הפעילו את אתגר היום מחדש כתרגול."],"🧪 Quiz":["🧪 اختبار","🧪 חידון"],"Test Practice and Quiz modes.":["اختبر وضعي التدريب والاختبار.","בדקו את מצבי התרגול והחידון."],"🏆 Challenges":["🏆 التحديات","🏆 אתגרים"],"Test multiplayer and challenge flows.":["اختبر اللعب الجماعي ومسارات التحدي.","בדקו את מצבי המשחק הרב־משתתפים והאתגרים."],"⚖ Balancer":["⚖ الموازنة","⚖ איזון"],"Test equation balancing.":["اختبر موازنة المعادلات.","בדקו איזון משוואות."],"✓ Checker":["✓ التحقق","✓ בדיקה"],"Test equation checking.":["اختبر التحقق من المعادلات.","בדקו בדיקת משוואות."],"📚 Learning":["📚 التعلم","📚 למידה"],"Open lessons and course search.":["افتح الدروس وابحث في الدورة.","פתחו שיעורים וחיפוש בקורס."],"👤 Profile":["👤 الملف الشخصي","👤 פרופיל"],"Inspect account progress and achievements.":["اطلع على تقدم الحساب والإنجازات.","בדקו את התקדמות החשבון וההישגים."],"Owner tools • Testing • Analytics • Accounts • Security":["أدوات المالك • الاختبار • الإحصاءات • الحسابات • الأمان","כלי בעלים • בדיקות • נתוני שימוש • חשבונות • אבטחה"],"Owner dashboard":["لوحة المالك","לוח הבקרה של בעל האתר"],"Private, aggregated analytics for Chemistry Equations.":["إحصاءات مجمّعة وخاصة لموقع المعادلات الكيميائية.","נתונים מצרפיים ופרטיים עבור Chemistry Equations."],"Visitor analytics":["إحصاءات الزوار","נתוני מבקרים"],"Clear stored visitor/page-view analytics to start a clean baseline. Accounts and quiz scores are kept.":["امسح إحصاءات الزوار ومشاهدات الصفحات المخزنة لبدء خط أساس جديد. ستبقى الحسابات ونتائج الاختبارات محفوظة.","נקו את נתוני המבקרים וצפיות הדפים השמורים כדי להתחיל קו בסיס חדש. חשבונות ותוצאות חידונים יישמרו."],"Reset visitor analytics":["إعادة ضبط إحصاءات الزوار","איפוס נתוני מבקרים"],"Admin key":["مفتاح الإدارة","מפתח מנהל"],"Open dashboard":["فتح لوحة التحكم","פתיחת לוח הבקרה"],"Enter your admin key.":["أدخل مفتاح الإدارة.","הזינו את מפתח המנהל."],"Loading analytics…":["جارٍ تحميل الإحصاءات…","נתוני האנליטיקה נטענים…"],"Unable to load analytics.":["تعذّر تحميل الإحصاءات.","לא ניתן לטעון את הנתונים."],"No data yet.":["لا توجد بيانات بعد.","אין נתונים עדיין."],"No visitor data yet.":["لا توجد بيانات زوار بعد.","אין עדיין נתוני מבקרים."],"Loading admin data…":["جارٍ تحميل بيانات الإدارة…","נתוני הניהול נטענים…"],"Could not load admin data.":["تعذّر تحميل بيانات الإدارة.","לא ניתן לטעון את נתוני הניהול."],"Admin data loaded.":["تم تحميل بيانات الإدارة.","נתוני הניהול נטענו."],"Enter the admin key first.":["أدخل مفتاح الإدارة أولًا.","הזינו תחילה את מפתח המנהל."],"Resetting password…":["جارٍ إعادة تعيين كلمة المرور…","הסיסמה מתאפסת…"],"Password reset successfully.":["تمت إعادة تعيين كلمة المرور بنجاح.","הסיסמה אופסה בהצלחה."],"Complete quizzes to unlock achievements.":["أكمل الاختبارات لفتح الإنجازات.","השלימו חידונים כדי לפתוח הישגים."],"Progress":["التقدم","התקדמות"],"Quizzes":["الاختبارات","חידונים"],"Best":["الأفضل","הטוב ביותר"],"Average":["المتوسط","ממוצע"],"Stages":["المراحل","שלבים"],"Achievements":["الإنجازات","הישגים"],"Certificate":["الشهادة","תעודה"],"Complete all three stages with at least 80% average to unlock a printable certificate.":["أكمل المراحل الثلاث بمتوسط لا يقل عن 80% لفتح شهادة قابلة للطباعة.","השלימו את כל שלושת השלבים בממוצע של 80% לפחות כדי לפתוח תעודה להדפסה."],"Download / Print certificate":["تنزيل الشهادة / طباعتها","הורדת התעודה / הדפסה"],"Enter the admin key, username, and a password of at least 8 characters.":["أدخل مفتاح الإدارة واسم المستخدم وكلمة مرور من 8 أحرف على الأقل.","הזינו מפתח מנהל, שם משתמש וסיסמה באורך 8 תווים לפחות."],"Could not reset the password.":["تعذّر إعادة تعيين كلمة المرور.","לא ניתן לאפס את הסיסמה."],"Resetting password…":["جارٍ إعادة تعيين كلمة المرور…","הסיסמה מתאפסת…"],"Account":["الحساب","חשבון"],"Refresh":["تحديث","רענון"],"Reset password":["إعادة تعيين كلمة المرور","איפוס סיסמה"],"🌙 Dark":["🌙 داكن","🌙 כהה"],"☀️ Light":["☀️ فاتح","☀️ בהיר"],"Start Daily Challenge":["ابدأ التحدي اليومي","התחילו את האתגר היומי"],"PRACTICE & TOOLS":["التدريب والأدوات","תרגול וכלים"],"Put your knowledge to work":["طبّق ما تعلمته","יישמו את הידע שלכם"],"Use these tools after a lesson—or whenever you want to test what you know.":["استخدم هذه الأدوات بعد الدرس أو كلما أردت اختبار معرفتك.","השתמשו בכלים האלה אחרי שיעור — או בכל פעם שתרצו לבדוק את הידע שלכם."],"CHECK YOUR UNDERSTANDING":["تحقق من فهمك","בדקו את הבנתכם"],"Answer questions and see how well you understand the material.":["أجب عن الأسئلة واكتشف مدى فهمك للمادة.","ענו על שאלות וראו עד כמה אתם מבינים את החומר."],"Take a quiz →":["ابدأ اختبارًا →","עברו לחידון ←"],"BUILD FLUENCY":["طوّر مهارتك","שפרו את השטף"],"Work through balancing problems and practise at your own pace.":["تدرّب على مسائل الموازنة بالسرعة التي تناسبك.","תרגלו בעיות איזון בקצב שלכם."],"Explore challenges →":["استكشف التحديات →","גלו את האתגרים ←"],"SOLVE AN EQUATION":["وازن معادلة","פתרו משוואה"],"Equation Balancer":["أداة موازنة المعادلات","מאזן משוואות"],"Enter a chemical equation and check its balanced coefficients.":["أدخل معادلة كيميائية وتحقق من معاملات الموازنة.","הזינו משוואה כימית ובדקו את המקדמים המאזנים."],"Open balancer →":["افتح أداة الموازنة →","פתחו את המאזן ←"],"VERIFY YOUR WORK":["تحقق من عملك","בדקו את התוצאה"],"Equation Checker":["مدقق المعادلات","בודק משוואות"],"Check whether both sides contain the same number of atoms.":["تحقق من تساوي عدد الذرات على الجانبين.","בדקו אם בשני הצדדים יש אותו מספר אטומים."],"Check an equation →":["تحقق من معادلة →","בדקו משוואה ←"],"👤 Account":["👤 الحساب","👤 חשבון"],"Language":["اللغة","שפה"],"Search lessons, topics, or features…":["ابحث في الدروس والموضوعات والميزات…","חיפוש שיעורים, נושאים ותכונות…"],"Search lessons, topics, or features":["ابحث في الدروس والموضوعات والميزات","חיפוש שיעורים, נושאים ותכונות"],"Search the whole site…":["ابحث في الموقع كله…","חיפוש בכל האתר…"],"Search the whole site":["ابحث في الموقع كله","חיפוש בכל האתר"],"Keyboard shortcut Ctrl K":["اختصار لوحة المفاتيح Ctrl K","קיצור מקלדת Ctrl K"],"ELEMENT":["العنصر","יסוד"],"Element":["العنصر","יסוד"],"EXAMPLE":["مثال","דוגמה"],"Example":["مثال","דוגמה"],"Check":["تحقق","בדקו"],"Copy":["نسخ","העתקה"],"Paste":["لصق","הדבקה"],"Pen size:":["حجم القلم:","גודל העט:"],"Eraser size:":["حجم الممحاة:","גודל המחק:"],"Chemical equation editor":["محرر المعادلات الكيميائية","עורך משוואות כימיות"],"Chemistry equation controls":["أدوات المعادلات الكيميائية","פקדי משוואות כימיות"],"Subscript digits":["الأرقام السفلية","ספרות תחתיות"],"Handwriting canvas":["مساحة الكتابة اليدوية","משטח כתב יד"],"Get started":["ابدأ","מתחילים"],"Learning progress":["تقدم التعلم","התקדמות בלמידה"],"Learn • Quiz • Challenges • Balance • Check":["تعلّم • اختبار • التحديات • الموازنة • التحقق","למידה • חידון • אתגרים • איזון • בדיקה"],"👤 Account":["👤 الحساب","👤 חשבון"],"Language":["اللغة","שפה"],"Search lessons, topics, or features…":["ابحث في الدروس والموضوعات والميزات…","חיפוש שיעורים, נושאים ותכונות…"],"Search lessons, topics, or features":["ابحث في الدروس والموضوعات والميزات","חיפוש שיעורים, נושאים ותכונות"],"Search the whole site…":["ابحث في الموقع كله…","חיפוש בכל האתר…"],"Search the whole site":["ابحث في الموقع كله","חיפוש בכל האתר"],"ELEMENT":["العنصر","יסוד"],"EXAMPLE":["مثال","דוגמה"],"Example":["مثال","דוגמה"],"Check":["تحقق","בדקו"],"Learn • Quiz • Challenges • Balance • Check":["تعلّم • اختبار • التحديات • الموازنة • التحقق","למידה • חידון • אתגרים • איזון • בדיקה"],"👤 Account":["👤 الحساب","👤 חשבון"],"Dark":["داكن","כהה"],"Light":["فاتح","בהיר"],"Dark mode":["الوضع الداكن","מצב כהה"],"Light mode":["الوضع الفاتح","מצב בהיר"],"Specific player":["لاعب محدد","שחקן מסוים"],"Balance equations.":["وازن المعادلات.","אזנו משוואות."],"Understand why.":["افهم السبب.","הבינו מדוע."],"Enter a chemical equation and get the balanced result immediately, with optional step-by-step and algebra explanations.":["أدخل معادلة كيميائية واحصل على النتيجة الموزونة فورًا، مع شرح اختياري خطوة بخطوة وبالجبر.","הזינו משוואה כימית וקבלו מיד את התוצאה המאוזנת, עם הסבר אופציונלי שלב אחר שלב והסבר אלגברי."] ,"Conservation of atoms":["حفظ الذرات","שימור האטומים"],"The number of each element must be the same on both sides.":["يجب أن يكون عدد ذرات كل عنصر متساويًا على الجانبين.","מספר האטומים של כל יסוד חייב להיות זהה בשני הצדדים."],
"Start with the basics":["ابدأ بالأساسيات","התחילו מהיסודות"],
"Already know the basics? Take a quiz":["هل تعرف الأساسيات بالفعل؟ جرّب اختبارًا","כבר מכירים את היסודות? עברו לחידון"],
"Go straight to the balancer":["انتقل مباشرة إلى أداة الموازنة","עברו ישירות למאזן המשוואות"],
"Continue learning":["واصل التعلّم","המשיכו ללמוד"],
"Your current lesson will be saved so you can continue where you left off.":["سيُحفظ درسك الحالي لتتمكن من المتابعة من حيث توقفت.","השיעור הנוכחי יישמר כדי שתוכלו להמשיך מהמקום שבו עצרתם."],
"Start your learning path":["ابدأ مسار التعلّم","התחילו את מסלול הלמידה"],
"Mini-course structure":["بنية الدورة المصغّرة","מבנה הקורס הקצר"],
"Concept → Worked example → Practice → Next lesson":["مفهوم ← مثال محلول ← تدريب ← الدرس التالي","מושג ← דוגמה פתורה ← תרגול ← השיעור הבא"],
"DAILY CHALLENGE":["التحدي اليومي","אתגר יומי"],
"A new chemistry challenge every day":["تحدٍ كيميائي جديد كل يوم","אתגר כימיה חדש בכל יום"],
"Today's challenge":["تحدي اليوم","האתגר של היום"],
"YOUR PROGRESS":["تقدّمك","ההתקדמות שלך"],
"Share result":["مشاركة النتيجة","שיתוף התוצאה"],
"Result copied":["تم نسخ النتيجة","התוצאה הועתקה"],
"Sharing unavailable":["المشاركة غير متاحة","השיתוף אינו זמין"],
"Select and copy the result":["حدّد النتيجة وانسخها","סמנו והעתיקו את התוצאה"],
"Review Daily Quiz Answers":["مراجعة إجابات الاختبار اليومي","סקירת תשובות החידון היומי"],
"Daily practice streak is unavailable right now.":["سلسلة التدريب اليومي غير متاحة حاليًا.","רצף התרגול היומי אינו זמין כרגע."]});buildReverse()}catch(e){M={}}}
async function init(){
 apply();await loadDictionary();apply();[150,500,1200,2500].forEach(ms=>setTimeout(()=>apply(),ms));
 if(document.body&&!window.__chemistryI18nObserver){
  window.__chemistryI18nObserver=true;let timer=0;
  const observer=new MutationObserver(records=>{
   if(!records.some(r=>r.addedNodes&&r.addedNodes.length))return;
   clearTimeout(timer);timer=setTimeout(()=>apply(),100);
  });
  observer.observe(document.body,{childList:true,subtree:true});
 }
 window.ChemistryI18n={lang:getLang,refresh:()=>apply(),apply:(root=document.body)=>scan(root,getLang()),setLanguage:l=>{try{localStorage.setItem(KEY,l)}catch{};location.reload()},t:(en,ar,he)=>getLang()==='ar'?(ar??en):getLang()==='he'?(he??en):en};window.ChemLang=window.ChemistryI18n}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
