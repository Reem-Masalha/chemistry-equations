(()=>{
const KEY='chemistryLanguage';
const LANGS={en:{label:'English',dir:'ltr'},ar:{label:'العربية',dir:'rtl'},he:{label:'עברית',dir:'rtl'}};
const groups={
'03 · BALANCER':{ar:'03 · الموازنة',he:'03 · موازنة المعادلات'},
'Balance equations.':{ar:'وازن المعادلات.',he:'وازن المعادلات.'},
'Understand why.':{ar:'افهم السبب.',he:'افهم السبب.'},
'Enter a chemical equation and get the balanced result immediately, with optional step-by-step and algebra explanations.':{ar:'أدخل معادلة كيميائية واحصل على النتيجة الموزونة فورًا، مع إمكانية عرض شرح خطوة بخطوة وشرح جبري.',he:'הזן משוואה כימית וקבל מיד את התוצאה המאוזנת, עם אפשרות להצגת הסבר שלב אחר שלב והסבר אלגברי.'},
'Conservation of atoms':{ar:'حفظ الذرات',he:'שימור האטומים'},
'The number of each element must be the same on both sides.':{ar:'يجب أن يكون عدد ذرات كل عنصر متساويًا في طرفي المعادلة.',he:'מספר האטומים של כל יסוד חייב להיות זהה בשני צדי המשוואה.'},
'BALANCE':{ar:'موازنة',he:'איזון'},
'Balance an equation':{ar:'وازن معادلة',he:'אזן משוואה'},
'Try an example':{ar:'جرّب مثالًا',he:'נסה דוגמה'},
'Balance':{ar:'وازن',he:'אזן'},
'Handwriting input':{ar:'إدخال بخط اليد',he:'קלט בכתב יד'},
'Recognizes subscripts, coefficients and reaction arrows. You can correct the recognized equation before balancing.':{ar:'يتعرّف على الأرقام السفلية والمعاملات وأسهم التفاعل. يمكنك تصحيح المعادلة التي تم التعرّف عليها قبل موازنتها.',he:'מזהה מספרים תחתיים, מקדמים וחיצי תגובה. ניתן לתקן את המשוואה שזוהתה לפני האיזון.'},
'Clear':{ar:'مسح',he:'נקה'},'Undo':{ar:'تراجع',he:'בטל'},'Redo':{ar:'إعادة',he:'בצע שוב'},'Eraser':{ar:'ممحاة',he:'מחק'},'Recognize':{ar:'تعرّف',he:'זהה'},
'Draw an equation, then tap Recognize.':{ar:'ارسم معادلة، ثم اضغط «تعرّف».',he:'צייר משוואה ולאחר מכן לחץ על «זהה».'},
'Correct the recognized equation before balancing:':{ar:'صحّح المعادلة التي تم التعرّف عليها قبل الموازنة:',he:'תקן את המשוואה שזוהתה לפני האיזון:'},
'Balance corrected equation':{ar:'وازن المعادلة المصححة',he:'אזן את המשוואה המתוקנת'},
'Show step-by-step explanation':{ar:'عرض الشرح خطوة بخطوة',he:'הצג הסבר שלב אחר שלב'},
'Hide step-by-step explanation':{ar:'إخفاء الشرح خطوة بخطوة',he:'הסתר הסבר שלב אחר שלב'},
'Show algebra method':{ar:'عرض الطريقة الجبرية',he:'הצג את השיטה האלגברית'},
'Hide algebra method':{ar:'إخفاء الطريقة الجبرية',he:'הסתר את השיטה האלגברית'},
'Copy answer':{ar:'نسخ الإجابة',he:'העתק תשובה'},'Copied ✓':{ar:'تم النسخ ✓',he:'הועתק ✓'},
'Validate the formulas.':{ar:'تحقق من الصيغ الكيميائية.',he:'אמת את הנוסחאות הכימיות.'},
'Element symbols, subscripts and parentheses were checked. Subscripts are never changed while balancing.':{ar:'تم التحقق من رموز العناصر والأرقام السفلية والأقواس. لا يتم تغيير الأرقام السفلية أثناء الموازنة.',he:'נבדקו סמלי היסודות, המספרים התחתיים והסוגריים. המספרים התחתיים לעולם אינם משתנים במהלך האיזון.'},
'Set up conservation equations.':{ar:'أنشئ معادلات حفظ الذرات.',he:'בנה משוואות שימור אטומים.'},
'For every element, atoms on the left must equal atoms on the right.':{ar:'لكل عنصر، يجب أن يساوي عدد الذرات في الطرف الأيسر عدد الذرات في الطرف الأيمن.',he:'עבור כל יסוד, מספר האטומים בצד שמאל חייב להיות שווה למספר האטומים בצד ימין.'},
'Find the smallest coefficient ratio.':{ar:'أوجد أصغر نسبة صحيحة للمعاملات.',he:'מצא את יחס המקדמים השלם הקטן ביותר.'},
'Apply the coefficients.':{ar:'طبّق المعاملات.',he:'החל את המקדמים.'},
'Verify every element.':{ar:'تحقق من كل عنصر.',he:'אמת כל יסוד.'},
'Algebra / matrix method':{ar:'الطريقة الجبرية / طريقة المصفوفات',he:'שיטה אלגברית / שיטת המטריצות'},
'Each compound receives an unknown coefficient. The atom-conservation equations form a homogeneous linear system. Solving it gives the coefficient vector':{ar:'يُعطى كل مركّب معامل مجهول. تكوّن معادلات حفظ الذرات نظامًا خطيًا متجانسًا. ويعطي حلّه متجه المعاملات',he:'לכל תרכובת ניתן מקדם לא ידוע. משוואות שימור האטומים יוצרות מערכת ליניארית הומוגנית. פתרונה נותן את וקטור המקדמים'},
'which is reduced to the smallest whole numbers.':{ar:'الذي يُختزل إلى أصغر أعداد صحيحة.',he:'אשר מצומצם למספרים שלמים הקטנים ביותר.'},
'Equation needs attention':{ar:'المعادلة تحتاج إلى تصحيح',he:'המשוואה דורשת תשומת לב'},
'Problem:':{ar:'المشكلة:',he:'הבעיה:'},
'Remember:':{ar:'تذكّر:',he:'זכור:'},
'element symbols are case-sensitive.':{ar:'رموز العناصر حساسة لحالة الأحرف.',he:'סמלי היסודות תלויי-רישיות.'},
'Draw an equation, then tap Recognize.':{ar:'ارسم معادلة، ثم اضغط «تعرّف».',he:'צייר משוואה ולאחר מכן לחץ על «זהה».'},
'What gets checked?':{ar:'ما الذي يتم التحقق منه؟',he:'מה נבדק?'},
'Same elements on both sides':{ar:'نفس العناصر في الطرفين',he:'אותם יסודות בשני הצדדים'},
'Same number of atoms for every element':{ar:'نفس عدد الذرات لكل عنصر',he:'אותו מספר אטומים לכל יסוד'},
'Valid chemical formulas':{ar:'صيغ كيميائية صحيحة',he:'נוסחאות כימיות תקינות'},
'Simplest whole-number coefficients':{ar:'أبسط معاملات بأعداد صحيحة',he:'המקדמים השלמים הקטנים ביותר'}
};
const reverse={}; for(const [en,v] of Object.entries(groups)){reverse[en]={en}; for(const l of ['ar','he']) if(v[l]) reverse[en][l]=v[l];}
function norm(s){return String(s||'').replace(/\s+/g,' ').trim()}
function translateText(s,lang){const n=norm(s); if(!n)return s; for(const [en,v] of Object.entries(groups)){if(n===en)return v[lang]||en; if(n===v.ar||n===v.he)return lang==='en'?en:(v[lang]||en);} return s;}
function protectEquation(el){return el.closest('.equation,.chips,canvas')||el.matches('.equation,.chips')}
function walk(root,lang){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode())nodes.push(w.currentNode);for(const n of nodes){if(!n.parentElement||protectEquation(n.parentElement))continue;const t=norm(n.nodeValue);if(!t)continue;const x=translateText(t,lang);if(x!==t)n.nodeValue=n.nodeValue.replace(t,x);}}
function setDir(lang){const rtl=LANGS[lang].dir==='rtl';document.documentElement.lang=lang;document.documentElement.dir=LANGS[lang].dir;document.body.classList.toggle('rtl',rtl);document.body.classList.toggle('ltr',!rtl);document.querySelectorAll('.equation,.chips').forEach(e=>{e.dir='ltr';e.style.direction='ltr';e.style.textAlign='center';});document.querySelectorAll('input,textarea,select').forEach(e=>{if(e.closest('.equation')){e.dir='ltr';return;}e.dir=LANGS[lang].dir;});}
function ensureButton(){let b=document.getElementById('languageBtn');if(b)return b;b=document.createElement('button');b.id='languageBtn';b.type='button';b.className='language-btn';b.setAttribute('aria-label','Language');b.textContent='🌐 English';(document.querySelector('.topbar')||document.body).appendChild(b);return b;}
function menu(){let b=ensureButton();if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',()=>{const cur=localStorage.getItem(KEY)||'en';const next=cur==='en'?'ar':cur==='ar'?'he':'en';localStorage.setItem(KEY,next);apply(next);});}
function apply(lang){if(!LANGS[lang])lang='en';walk(document.body,lang);setDir(lang);const b=ensureButton();b.textContent='🌐 '+LANGS[lang].label;b.title=lang==='en'?'العربية / עברית':lang==='ar'?'English / עברית':'English / العربية';menu();}
function start(){const lang=localStorage.getItem(KEY)||'en';apply(lang);new MutationObserver(()=>apply(localStorage.getItem(KEY)||'en')).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
