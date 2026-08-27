(()=>{
const KEY='chemistryLanguage';
const LANGS={en:{label:'English',dir:'ltr'},ar:{label:'العربية',dir:'rtl'},he:{label:'עברית',dir:'rtl'}};
const groups={
'03 · BALANCER':{ar:'03 · الموازنة',he:'03 · מوازنة المعادلات'},
'Balance equations.':{ar:'وازن المعادلات.',he:'وازن المعادلات.'},
'Understand why.':{ar:'افهم السبب.',he:'افهم السبب.'},
'Enter a chemical equation and get the balanced result immediately, with optional step-by-step and algebra explanations.':{ar:'أدخل معادلة كيميائية واحصل على النتيجة الموزونة فورًا، مع إمكانية عرض شرح خطوة بخطوة وشرح جبري.',he:'הזן משוואה כימית וקבל מיד את התוצאה המאוזנת, עם אפשרות להצגת הסבר שלב אחר שלב והסבר אלגברי.'},
'Conservation of atoms':{ar:'حفظ الذرات',he:'שימור האטומים'},
'The number of each element must be the same on both sides.':{ar:'يجب أن يكون عدد ذرات كل عنصر متساويًا في طرفي المعادلة.',he:'מספר האטומים של כל יסוד חייב להיות זהה בשני צדי המשוואה.'},
'BALANCE':{ar:'موازنة',he:'איזון'},'Balance an equation':{ar:'وازن معادلة',he:'אזן משוואה'},'Try an example':{ar:'جرّب مثالًا',he:'נסה דוגמה'},'Balance':{ar:'وازن',he:'אזן'},
'Handwriting input':{ar:'إدخال بخط اليد',he:'קלט בכתב יד'},
'Recognizes subscripts, coefficients and reaction arrows. You can correct the recognized equation before balancing.':{ar:'يتعرّف على الأرقام السفلية والمعاملات وأسهم التفاعل. يمكنك تصحيح المعادلة التي تم التعرّف عليها قبل موازنتها.',he:'מזהה מספרים תחתיים, מקדמים וחיצי תגובה. ניתן לתקן את המשוואה שזוהתה לפני האיזון.'},
'Clear':{ar:'مسح',he:'נקה'},'Undo':{ar:'تراجع',he:'בטל'},'Redo':{ar:'إعادة',he:'בצע שוב'},'Eraser':{ar:'ممحاة',he:'מחק'},'Recognize':{ar:'تعرّف',he:'זהה'},
'Draw an equation, then tap Recognize.':{ar:'ارسم معادلة، ثم اضغط «تعرّف».',he:'צייר משוואה ולאחר מכן לחץ על «זהה».'},
'Correct the recognized equation before balancing:':{ar:'صحّح المعادلة التي تم التعرّف عليها قبل الموازنة:',he:'תקן את המשוואה שזוהתה לפני האיזון:'},'Balance corrected equation':{ar:'وازن المعادلة المصححة',he:'אזן את המשוואה המתוקנת'},
'Show step-by-step explanation':{ar:'عرض الشرح خطوة بخطوة',he:'הצג הסבר שלב אחר שלב'},'Hide step-by-step explanation':{ar:'إخفاء الشرح خطوة بخطوة',he:'הסתר הסבר שלב אחר שלב'},
'Show algebra method':{ar:'عرض الطريقة الجبرية',he:'הצג את השיטה האלגبرية'},'Hide algebra method':{ar:'إخفاء الطريقة الجبرية',he:'הסתר את השיטה האלגברית'},'Copy answer':{ar:'نسخ الإجابة',he:'העתק תשובה'},'Copied ✓':{ar:'تم النسخ ✓',he:'הועתק ✓'},
'Validate the formulas.':{ar:'تحقق من الصيغ الكيميائية.',he:'אמת את הנוסחאות הכימיות.'},
'Element symbols, subscripts and parentheses were checked. Subscripts are never changed while balancing.':{ar:'تم التحقق من رموز العناصر والأرقام السفلية والأقواس. لا يتم تغيير الأرقام السفلية أثناء الموازنة.',he:'נבדקו סמלי היסודות, המספרים התחתיים והסוגריים. המספרים התחתיים לעולם אינם משתנים במהלך האיזון.'},
'Set up conservation equations.':{ar:'أنشئ معادلات حفظ الذرات.',he:'בנה משוואות שימור אטומים.'},'For every element, atoms on the left must equal atoms on the right.':{ar:'لكل عنصر، يجب أن يساوي عدد الذرات في الطرف الأيسر عدد الذرات في الطرف الأيمن.',he:'עבור כל יסוד, מספר האטומים בצד שמאל חייב להיות שווה למספר האטומים בצד ימין.'},
'Find the smallest coefficient ratio.':{ar:'أوجد أصغر نسبة صحيحة للمعاملات.',he:'מצא את יחס המקדמים השלם הקטן ביותר.'},'Apply the coefficients.':{ar:'طبّق المعاملات.',he:'החל את המקדמים.'},'Verify every element.':{ar:'تحقق من كل عنصر.',he:'אמת כל יסוד.'},
'Algebra / matrix method':{ar:'الطريقة الجبرية / طريقة المصفوفات',he:'שיטה אלגברית / שיטת המטריצות'},
'Equation needs attention':{ar:'المعادلة تحتاج إلى تصحيح',he:'המשוואה דורשת תשומת לב'},'Problem:':{ar:'المشكلة:',he:'הבעיה:'},'Remember:':{ar:'تذكّر:',he:'זכור:'},'element symbols are case-sensitive.':{ar:'رموز العناصر حساسة لحالة الأحرف.',he:'סמלי היסודות תלויי-רישיות.'},
'What gets checked?':{ar:'ما الذي يتم التحقق منه؟',he:'מה נבדק?'},'Same elements on both sides':{ar:'نفس العناصر في الطرفين',he:'אותם יסודות בשני הצדדים'},'Same number of atoms for every element':{ar:'نفس عدد الذرات لكل عنصر',he:'אותו מספר אטומים לכל יסוד'},'Valid chemical formulas':{ar:'صيغ كيميائية صحيحة',he:'נוסחאות כימיות תקינות'},'Simplest whole-number coefficients':{ar:'أبسط معاملات بأعداد صحيحة',he:'המקדמים השלמים הקטנים ביותר'},
'Solo Practice and Multiplayer Challenge are separate experiences. In a challenge, both players get the same questions and race against the clock.':{ar:'التدريب الفردي وتحدي اللعب الجماعي تجربتان منفصلتان. في التحدي، يحصل كلا اللاعبين على الأسئلة نفسها ويتنافسان مع الوقت.',he:'תרגול יחיד ואתגר מרובה משתתפים הם חוויות נפרדות. באתגר, שני השחקנים מקבלים את אותן שאלות ומתחרים נגד השעון.'},
'Random opponent':{ar:'خصم عشوائي',he:'יריב אקראי'},'Invite a specific player':{ar:'دعوة لاعب محدد',he:'הזמן שחקן מסוים'},'Join with challenge code':{ar:'الانضمام برمز التحدي',he:'הצטרף באמצעות קוד אתגר'},
'🌐 Random opponent':{ar:'🌐 خصم عشوائي',he:'🌐 יריב אקראי'},'طابقك مع لاعب متاح.':{en:'Matches you with an available player.',he:'משדך אותך עם שחקן זמין.'},
'🎯 Specific player':{ar:'🎯 لاعب محدد',he:'🎯 שחקן מסוים'},'أنشئ غرفة خاصة وأرسل للاعب رمز التحدي أو الرابط.':{en:'Create a private room and send the player the challenge code or link.',he:'צור חדר פרטי ושלח לשחקן את קוד האתגר או הקישור.'},
'⚡ Same questions':{ar:'⚡ الأسئلة نفسها',he:'⚡ אותן שאלות'},'يحصل كلا اللاعبين على مجموعة الأسئلة نفسها.':{en:'Both players receive the same set of questions.',he:'שני השחקנים מקבלים את אותה קבוצת שאלות.'},
'⏱ Live competition':{ar:'⏱ منافسة مباشرة',he:'⏱ תחרות בזמן אמת'},'يتم تحديث المؤقت والتقدم أثناء الحل.':{en:'The timer and progress update while solving.',he:'הזמן וההתקדמות מתעדכנים במהלך הפתרון.'},
'📊 Live score':{ar:'📊 النتيجة المباشرة',he:'📊 ניקוד בזמן אמת'},'تابع تقدمك أثناء المباراة.':{en:'Track your progress during the match.',he:'עקוב אחר ההתקדמות שלך במהלך המשחק.'},
'🏆 Final comparison':{ar:'🏆 المقارنة النهائية',he:'🏆 השוואה סופית'},'شاهد نتيجتي اللاعبين ومن فاز بعد انتهاء التحدي.':{en:'See both players’ results and who won after the challenge ends.',he:'ראה את תוצאות שני השחקנים ומי ניצח לאחר סיום האתגר.'},
'كيفية عمل الدعوة':{en:'How the invitation works',he:'כיצד פועלת ההזמנה'},'Choose “Invite a specific player”, create a private challenge, then send the generated challenge code or share link to that player. They can join from this page.':{ar:'اختر «دعوة لاعب محدد»، وأنشئ تحديًا خاصًا، ثم أرسل للاعب رمز التحدي الذي تم إنشاؤه أو رابط المشاركة. يمكنه الانضمام من هذه الصفحة.',he:'בחר «הזמן שחקן מסוים», צור אתגר פרטי, ולאחר מכן שלח לשחקן את קוד האתגר שנוצר או קישור השיתוף. הוא יוכל להצטרף מדף זה.'},
'Leaderboard will appear when the multiplayer server is connected.':{ar:'ستظهر لوحة المتصدرين عند الاتصال بخادم اللعب الجماعي.',he:'טבלת המובילים תופיע כאשר שרת המשחק מרובה המשתתפים יהיה מחובר.'},
'Fastest solvers':{ar:'أسرع المتسابقين',he:'הפותרים המהירים ביותר'},'Fastest solver':{ar:'أسرع متسابق',he:'הפותר המהיר ביותר'}
};
function allVariants(en,v){return [en,v.ar,v.he].filter(Boolean)}
function replaceEverywhere(lang){
 const nodes=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(w.nextNode())nodes.push(w.currentNode);
 for(const n of nodes){const p=n.parentElement;if(!p||p.closest('script,style,canvas,.equation'))continue;let text=n.nodeValue;
   for(const [en,v] of Object.entries(groups)){
     const target=v[lang]||en;
     for(const old of allVariants(en,v)) if(old&&old!==target) text=text.split(old).join(target);
   }
   n.nodeValue=text;
 }
}
function setDirection(lang){const rtl=LANGS[lang].dir==='rtl';document.documentElement.lang=lang;document.documentElement.dir=LANGS[lang].dir;document.body.classList.toggle('rtl',rtl);document.body.classList.toggle('ltr',!rtl);
 document.querySelectorAll('.equation,.chips').forEach(e=>{e.dir='ltr';e.style.direction='ltr';e.style.textAlign='center'});
 document.querySelectorAll('input,textarea,select').forEach(e=>{e.dir=LANGS[lang].dir});
}
function ensureButton(){let b=document.getElementById('languageBtn');if(!b){b=document.createElement('button');b.id='languageBtn';b.type='button';b.className='language-btn';b.setAttribute('aria-label','Language');(document.querySelector('.topbar')||document.body).appendChild(b)}return b}
function apply(lang){if(!LANGS[lang])lang='en';replaceEverywhere(lang);setDirection(lang);const b=ensureButton();b.textContent='🌐 '+LANGS[lang].label;b.dataset.current=lang;}
function bind(){const b=ensureButton();if(!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>{const cur=b.dataset.current||localStorage.getItem(KEY)||'en';const next=cur==='en'?'ar':cur==='ar'?'he':'en';localStorage.setItem(KEY,next);apply(next);});}}
function start(){bind();apply(localStorage.getItem(KEY)||'en');new MutationObserver(()=>{bind();apply(localStorage.getItem(KEY)||'en')}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
