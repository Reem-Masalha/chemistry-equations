(()=>{
const KEY='chemistryLanguage';
const LANGS={en:{dir:'ltr',label:'English'},ar:{dir:'rtl',label:'العربية'},he:{dir:'rtl',label:'עברית'}};
const M={
'Solo Practice':{ar:'التدريب الفردي',he:'التدريب الفردي'},
'Multiplayer Challenge':{ar:'التحدي متعدد اللاعبين',he:'אתגר רב־משתתפים'},
'Practice solo.':{ar:'تدرّب بمفردك.',he:'תרגלו לבד.'},
'Challenge someone.':{ar:'تحدَّ لاعبًا آخر.',he:'אתגרו שחקן אחר.'},
'Solo Practice and Multiplayer Challenge are separate experiences. In a challenge, both players get the same questions and race against the clock.':{ar:'التدريب الفردي والتحدي متعدد اللاعبين تجربتان منفصلتان. في التحدي، يحصل كلا اللاعبين على الأسئلة نفسها ويتسابقان مع الوقت.',he:'תרגול אישי ואתגר רב־משתתפים הם שתי חוויות נפרדות. באתגר, שני השחקנים מקבלים את אותן שאלות ומתחרים נגד השעון.'},
'Choose how to play':{ar:'اختر طريقة اللعب',he:'בחרו איך לשחק'},
'Random opponent':{ar:'خصم عشوائي',he:'יריב אקראי'},
'Invite a specific player':{ar:'دعوة لاعب محدد',he:'הזמנת שחקן מסוים'},
'Join with challenge code':{ar:'الانضمام برمز التحدي',he:'הצטרפות באמצעות קוד אתגר'},
'Match with an available player.':{ar:'طابِقك مع لاعب متاح.',he:'התאימו אתכם לשחקן זמין.'},
'Specific player':{ar:'لاعب محدد',he:'שחקן מסוים'},
'Create a private room and send the player your challenge code or link.':{ar:'أنشئ غرفة خاصة وأرسل للاعب رمز التحدي أو الرابط.',he:'צרו חדר פרטי ושלחו לשחקן את קוד האתגר או הקישור.'},
'Same questions':{ar:'الأسئلة نفسها',he:'אותן שאלות'},
'Both players receive the identical question set.':{ar:'يحصل كلا اللاعبين على مجموعة الأسئلة نفسها.',he:'שני השחקנים מקבלים בדיוק את אותה קבוצת שאלות.'},
'Live competition':{ar:'منافسة مباشرة',he:'תחרות בזמן אמת'},
'Timer and progress update while you solve.':{ar:'يتم تحديث المؤقت والتقدم أثناء الحل.',he:'הטיימר וההתקדמות מתעדכנים בזמן הפתרון.'},
'Live score':{ar:'النتيجة المباشرة',he:'ניקוד בזמן אמת'},
'Track your progress during the match.':{ar:'تابع تقدمك أثناء المباراة.',he:'עקבו אחר ההתקדמות שלכם במהלך המשחק.'},
'Final comparison':{ar:'المقارنة النهائية',he:'השוואה סופית'},
'See both scores and who won after a real challenge.':{ar:'شاهد نتيجتي اللاعبين ومن فاز بعد انتهاء التحدي.',he:'ראו את שתי התוצאות ומי ניצח לאחר انتهاء האתגר.'},
'How inviting works':{ar:'كيفية عمل الدعوة',he:'כיצד פועלת ההזמנה'},
'Choose “Invite a specific player”, create a private challenge, then send the generated challenge code or share link to that player. They can join from this page.':{ar:'اختر «دعوة لاعب محدد»، وأنشئ تحديًا خاصًا، ثم أرسل رمز التحدي أو رابط المشاركة الذي تم إنشاؤه إلى اللاعب. ويمكنه الانضمام من هذه الصفحة.',he:'בחרו «הזמנת שחקן מסוים», צרו אתגר פרטי ושלחו לשחקן את קוד האתגר או קישור השיתוף שנוצר. הוא יכול להצטרף מדף זה.'},
'Leaderboard will appear when the multiplayer server is connected.':{ar:'ستظهر لوحة المتصدرين عند الاتصال بخادم اللعب الجماعي.',he:'טבלת המובילים תופיע כאשר שרת המשחק הרב־משתתפים יהיה מחובר.'},
'Fastest solvers':{ar:'أسرع المتسابقين',he:'הפותרים המהירים ביותר'},
'Ranked by challenge solve time.':{ar:'الترتيب حسب زمن حل التحدي.',he:'הדירוג נקבע לפי זמן פתרון האתגר.'},
'Leaderboard':{ar:'لوحة المتصدرين',he:'טבלת המובילים'},
'Refresh':{ar:'تحديث',he:'רענון'},
'Handwriting input':{ar:'الإدخال بالكتابة اليدوية',he:'קלט בכתב יד'},
'What gets checked?':{ar:'ما الذي يتم التحقق منه؟',he:'מה נבדק?'},
'Same elements on both sides':{ar:'العناصر نفسها على الجانبين',he:'אותם יסודות בשני הצדדים'},
'Same number of atoms for every element':{ar:'العدد نفسه من الذرات لكل عنصر',he:'אותו מספר אטומים מכל יסוד'},
'Valid chemical formulas':{ar:'الصيغ الكيميائية الصحيحة',he:'נוסחאות כימיות תקינות'},
'Simplest whole-number coefficients':{ar:'أبسط معاملات بأعداد صحيحة',he:'מקדמים שלמים ביחס המצומצם ביותר'},
'Need help?':{ar:'تحتاج إلى مساعدة؟',he:'זקוקים לעזרה?'},
'Balance an equation':{ar:'وازن معادلة',he:'אזנו משוואה'},
'Learn how':{ar:'تعلّم الطريقة',he:'למדו איך'},
'Learn':{ar:'تعلّم',he:'למידה'},'Quiz':{ar:'اختبار',he:'חידון'},'Challenges':{ar:'التحديات',he:'אתגרים'},'Balancer':{ar:'موازنة المعادلات',he:'מאזן משוואות'},'Checker':{ar:'التحقق',he:'בדיקה'},'Account':{ar:'الحساب',he:'חשבון'},
'Difficulty':{ar:'مستوى الصعوبة',he:'רמת קושי'},'Easy':{ar:'سهل',he:'קל'},'Medium':{ar:'متوسط',he:'בינוני'},'Hard':{ar:'صعب',he:'קשה'},
'How do you want to practice?':{ar:'كيف تريد أن تتدرّب؟',he:'איך תרצו לתרגל?'},'Untimed':{ar:'بدون مؤقت',he:'ללא הגבלת זמן'},'Timed · 5 minutes':{ar:'مؤقت · 5 دقائق',he:'מתוזמן · 5 דקות'},'Challenge · 60 seconds':{ar:'تحدٍّ · 60 ثانية',he:'אתגר · 60 שניות'},
'Choose a level':{ar:'اختر المستوى',he:'בחרו רמה'},'Start new quiz':{ar:'ابدأ اختبارًا جديدًا',he:'התחילו חידון חדש'},
'Practice at your own pace with Easy, Medium and Hard quizzes.':{ar:'تدرّب بالوتيرة التي تناسبك باستخدام اختبارات سهلة ومتوسطة وصعبة.',he:'תרגלו בקצב שלכם עם חידונים קלים, בינוניים וקשים.'},
'Compete head-to-head with another player in a live timed match.':{ar:'تنافس مباشرةً مع لاعب آخر في مباراة محددة الوقت.',he:'התחרו ראש בראש מול שחקן אחר במשחק חי עם הגבלת זמן.'},
'Check your':{ar:'تحقق من',he:'בדקו את'},'equation.':{ar:'معادلتك.',he:'המשוואה שלכם.'},
"Enter your balanced equation and we'll check every element and coefficient.":{ar:'أدخل معادلتك الموزونة وسنتحقق من كل عنصر وكل معامل.',he:'הזינו את המשוואה המאוזנת שלכם ונבדוק כל יסוד וכל מקדם.'},
'Your equation':{ar:'معادلتك',he:'המשוואה שלכם'},'Check equation':{ar:'تحقق من المعادلة',he:'בדקו משוואה'},
'Balancing checklist':{ar:'قائمة تحقق للموازنة',he:'רשימת בדיקה לאיזון'},
'Correct element symbols':{ar:'رموز العناصر الصحيحة',he:'סמלי היסודות הנכונים'},
'Correct chemical formulas and subscripts':{ar:'الصيغ الكيميائية والأرقام السفلية الصحيحة',he:'נוסחאות כימיות ומספרים תחתיים נכונים'},
'Correct diatomic formulas when applicable':{ar:'الصيغ الصحيحة للعناصر ثنائية الذرة عند الحاجة',he:'נוסחאות נכונות של יסודות דו־אטומיים כאשר נדרש'},
'Count atoms on both sides':{ar:'عُدّ الذرات على الجانبين',he:'ספרו את האטומים בשני הצדדים'},
'Add coefficients instead of changing formulas':{ar:'أضف معاملات بدلًا من تغيير الصيغ',he:'הוסיפו מקדמים במקום לשנות נוסחאות'},
'Recount every element':{ar:'أعد عدّ كل عنصر',he:'ספרו מחדש כל יסוד'},
'Use the smallest whole-number ratio':{ar:'استخدم أصغر نسبة من أعداد صحيحة',he:'השתמשו ביחס הקטן ביותר של מספרים שלמים'},
'Leaderboard will appear when the multiplayer server is connected.':{ar:'ستظهر لوحة المتصدرين عند الاتصال بخادم اللعب الجماعي.',he:'טבלת המובילים תופיע כאשר שרת המשחק הרב־משתתפים יהיה מחובר.'},
'Practice at':{ar:'تدرّب',he:'תרגלו'},'your pace.':{ar:'بالوتيرة التي تناسبك.',he:'בקצב שלכם.'}
};
const reverse={ar:{},he:{}};
for(const [en,v] of Object.entries(M)){for(const l of ['ar','he']) if(v[l]) reverse[l][v[l]]=en;}
const keys=Object.keys(M).sort((a,b)=>b.length-a.length);
function current(){const l=localStorage.getItem(KEY)||'en';return LANGS[l]?l:'en';}
function normalize(s){let out=s;for(const l of ['ar','he']){for(const [x,en] of Object.entries(reverse[l]).sort((a,b)=>b[0].length-a[0].length)){if(out.includes(x))out=out.split(x).join(en);}}return out;}
function translateText(s,l){let out=normalize(s);if(l==='en')return out;for(const en of keys){if(M[en][l])out=out.split(en).join(M[en][l]);}return out;}
function shouldSkip(n){const p=n.parentElement;if(!p)return true;return ['SCRIPT','STYLE','NOSCRIPT','TEXTAREA'].includes(p.tagName)||p.closest('[data-no-translate],.chemical-equation,.equation,.formula');}
function scan(root=document){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode())nodes.push(w.currentNode);for(const n of nodes){if(shouldSkip(n))continue;const old=n.nodeValue;const neu=translateText(old,current());if(neu!==old)n.nodeValue=neu;}}
function setDir(l){document.documentElement.lang=l;document.documentElement.dir=LANGS[l].dir;document.body.classList.toggle('rtl',l!=='en');document.body.classList.toggle('ltr',l==='en');document.body.style.direction=LANGS[l].dir;document.body.style.textAlign=l==='en'?'left':'right';}
function makeSelector(){let el=document.getElementById('siteLanguageControl');if(el)return el;el=document.createElement('select');el.id='siteLanguageControl';el.setAttribute('aria-label','Language');el.innerHTML='<option value="en">English</option><option value="ar">العربية</option><option value="he">עברית</option>';el.value=current();el.style.cssText='margin-left:12px;padding:6px 9px;border:1px solid var(--line,#ddd);border-radius:8px;background:var(--surface,#fff);color:inherit;font:inherit;';el.onchange=()=>{localStorage.setItem(KEY,el.value);location.reload();};const header=document.querySelector('.topbar');if(header)header.appendChild(el);return el;}
function layout(){setDir(current());makeSelector();document.querySelectorAll('.main-nav').forEach(n=>{n.style.direction='ltr';n.style.display='flex';n.style.alignItems='center';});document.querySelectorAll('.chemical-equation,.equation,.formula,input[id*="Input"],#checkInput').forEach(e=>{e.style.direction='ltr';e.style.textAlign='center';});}
function run(){layout();scan();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
new MutationObserver(ms=>{for(const m of ms){if(m.addedNodes.length)scan(m.target.nodeType===1?m.target:document.body);}}).observe(document.body,{childList:true,subtree:true});
})();