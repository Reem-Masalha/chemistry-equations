(()=>{
const KEY='chemistryLanguage';
const langs={en:{label:'English',dir:'ltr'},ar:{label:'العربية',dir:'rtl'},he:{label:'עברית',dir:'rtl'}};
const t={
 en:{Learn:'Learn',Quiz:'Quiz',Challenges:'Challenges',Balancer:'Balancer',Checker:'Checker',Account:'Account',Learning:'Learning',Practice:'Practice',Beginner:'Beginner',Intermediate:'Intermediate',Advanced:'Advanced'},
 ar:{Learn:'تعلّم',Quiz:'اختبار',Challenges:'التحديات',Balancer:'موازنة المعادلات',Checker:'التحقق',Account:'الحساب',Learning:'التعلّم',Practice:'تدريب',Beginner:'مبتدئ',Intermediate:'متوسط',Advanced:'متقدم'},
 he:{Learn:'למידה',Quiz:'חידון',Challenges:'אתגרים',Balancer:'מאזן משוואות',Checker:'בדיקה',Account:'חשבון',Learning:'למידה',Practice:'תרגול',Beginner:'מתחילים',Intermediate:'בינוני',Advanced:'מתקדם'}
};
const exact={
 'Learn chemistry step by step.':{ar:'تعلّم الكيمياء خطوة بخطوة.',he:'למדו כימיה שלב אחר שלב.'},
 'Start with the basics, build confidence, then move to harder reactions. Every lesson ends with practice.':{ar:'ابدأ بالأساسيات، وابنِ ثقتك، ثم انتقل إلى تفاعلات أصعب. ينتهي كل درس بتدريب.',he:'התחילו מהיסודות, בנו ביטחון, ואז עברו לתגובות קשות יותר. כל שיעור מסתיים בתרגול.'},
 'Build the basics':{ar:'بناء الأساسيات',he:'בניית היסודות'},
 'Follow the detailed beginner path in the recommended order.':{ar:'اتبع مسار المبتدئين المفصل بالترتيب الموصى به.',he:'עקבו אחר מסלול המתחילים המפורט לפי הסדר המומלץ.'},
 'What is a chemical equation?':{ar:'ما المعادلة الكيميائية؟',he:'מהי משוואה כימית?'},
 'Learn reactants, products and reaction arrows.':{ar:'تعلّم المتفاعلات والنواتج وأسهم التفاعل.',he:'למדו על מגיבים, תוצרים וחיצי תגובה.'},
 'Reading chemical formulas':{ar:'قراءة الصيغ الكيميائية',he:'קריאת נוסחאות כימיות'},
 'Understand subscripts, coefficients and parentheses.':{ar:'افهم الأرقام السفلية والمعاملات والأقواس.',he:'הבינו מספרים תחתיים, מקדמים וסוגריים.'},
 'Conservation of mass':{ar:'قانون حفظ الكتلة',he:'שימור המסה'},
 'Learn why every element must have the same atom count on both sides.':{ar:'تعلّم لماذا يجب أن يكون عدد ذرات كل عنصر متساويًا على الجانبين.',he:'למדו מדוע מספר האטומים של כל יסוד חייב להיות זהה בשני הצדדים.'},
 'Coefficients and simple balancing':{ar:'المعاملات والموازنة البسيطة',he:'מקדמים ואיזון פשוט'},
 'Balance equations without changing chemical formulas.':{ar:'وازن المعادلات دون تغيير الصيغ الكيميائية.',he:'אזנו משוואות בלי לשנות את הנוסחאות הכימיות.'},
 'Diatomic elements':{ar:'العناصر ثنائية الذرة',he:'יסודות דו-אטומיים'},
 'Recognize H₂, N₂, O₂, F₂, Cl₂, Br₂ and I₂.':{ar:'تعرّف على H₂ وN₂ وO₂ وF₂ وCl₂ وBr₂ وI₂.',he:'זהו את H₂, N₂, O₂, F₂, Cl₂, Br₂ ו-I₂.'},
 'Putting it all together':{ar:'جمع كل ما تعلمته',he:'שילוב כל מה שלמדנו'},
 'Use a complete checklist before moving to harder problems.':{ar:'استخدم قائمة تحقق كاملة قبل الانتقال إلى مسائل أصعب.',he:'השתמשו ברשימת בדיקה מלאה לפני המעבר לבעיות קשות יותר.'},
 'Handle more structure':{ar:'التعامل مع تراكيب أكثر تعقيدًا',he:'התמודדות עם מבנים מורכבים יותר'},
 'Work with groups, parentheses, fractions and multi-step reactions.':{ar:'تدرّب على المجموعات والأقواس والكسور والتفاعلات متعددة الخطوات.',he:'עבדו עם קבוצות, סוגריים, שברים ותגובות מרובות שלבים.'},
 'Polyatomic ions':{ar:'الأيونات متعددة الذرات',he:'יונים רב-אטומיים'},
 'Parentheses':{ar:'الأقواس',he:'סוגריים'},
 'Fractions':{ar:'الكسور',he:'שברים'},
 'Complicated reactions':{ar:'التفاعلات المعقدة',he:'תגובות מורכבות'},
 'Challenge yourself':{ar:'تحدَّ نفسك',he:'אתגרו את עצמכם'},
 'Apply balancing skills to demanding reaction types and several-step problems.':{ar:'طبّق مهارات الموازنة على أنواع تفاعلات صعبة ومسائل متعددة الخطوات.',he:'יישמו מיומנויות איזון בסוגי תגובות מאתגרים ובבעיות מרובות שלבים.'},
 'Combustion':{ar:'الاحتراق',he:'בעירה'},
 'Redox':{ar:'الأكسدة والاختزال',he:'חמצון-חיזור'},
 'Complex ionic equations':{ar:'المعادلات الأيونية المعقدة',he:'משוואות יוניות מורכבות'},
 'Several-step balancing':{ar:'الموازنة متعددة الخطوات',he:'איזון במספר שלבים'},
 'A chemical equation is a short way of showing a chemical reaction. The substances you start with are called reactants, and the substances formed are called products. An arrow shows the direction from reactants to products.':{ar:'المعادلة الكيميائية هي طريقة مختصرة لتمثيل تفاعل كيميائي. المواد التي تبدأ بها تُسمى المتفاعلات، والمواد المتكوّنة تُسمى النواتج. يُظهر السهم الاتجاه من المتفاعلات إلى النواتج.',he:'משוואה כימית היא דרך קצרה להציג תגובה כימית. החומרים שמתחילים איתם נקראים מגיבים, והחומרים שנוצרים נקראים תוצרים. חץ מציג את הכיוון מהמגיבים לתוצרים.'},
 'The equation tells us which substances participate in the reaction, but it is not balanced yet. A balanced equation must contain the same number of atoms of every element on both sides.':{ar:'توضح المعادلة المواد المشاركة في التفاعل، لكنها غير موزونة بعد. يجب أن تحتوي المعادلة الموزونة على العدد نفسه من ذرات كل عنصر على الجانبين.',he:'המשוואה מציגה אילו חומרים משתתפים בתגובה, אך היא עדיין אינה מאוזנת. במשוואה מאוזנת חייב להיות אותו מספר אטומים מכל יסוד בשני הצדדים.'},
 'Read from left to right: reactants → products. The plus sign separates substances on the same side, while the arrow separates reactants from products.':{ar:'اقرأ من اليسار إلى اليمين: المتفاعلات → النواتج. تفصل علامة الجمع بين المواد الموجودة في الجانب نفسه، بينما يفصل السهم بين المتفاعلات والنواتج.',he:'קראו משמאל לימין: מגיבים → תוצרים. סימן הפלוס מפריד בין חומרים באותו צד, והחץ מפריד בין המגיבים לתוצרים.'},
 'How to balance a chemical equation':{ar:'كيفية موازنة معادلة كيميائية',he:'כיצד מאזנים משוואה כימית'},
 'Use a reliable step-by-step method':{ar:'استخدم طريقة موثوقة خطوة بخطوة',he:'השתמשו בשיטה אמינה שלב אחר שלב'},
 'Balance the equation without changing the substances.':{ar:'وازن المعادلة دون تغيير المواد.',he:'אזנו את המשוואה בלי לשנות את החומרים.'},
 'Balancing checklist':{ar:'قائمة تحقق للموازنة',he:'רשימת בדיקה לאיזון'},
 'Before balancing, check the formulas and element symbols. Then count atoms, use coefficients, and check the final equation.':{ar:'قبل الموازنة، تحقّق من الصيغ ورموز العناصر. ثم عُدّ الذرات، واستخدم المعاملات، وتحقّق من المعادلة النهائية.',he:'לפני האיזון, בדקו את הנוסחאות ואת סמלי היסודות. לאחר מכן ספרו אטומים, השתמשו במקדמים ובדקו את המשוואה הסופית.'},
 'Once you can follow this routine confidently, move to Intermediate lessons on polyatomic ions, parentheses, fractions and more complicated reactions.':{ar:'عندما تتمكن من اتباع هذه الطريقة بثقة، انتقل إلى دروس المستوى المتوسط حول الأيونات متعددة الذرات والأقواس والكسور والتفاعلات الأكثر تعقيدًا.',he:'לאחר שתוכלו לבצע את השגרה הזו בביטחון, עברו לשיעורי הביניים על יונים רב-אטומיים, סוגריים, שברים ותגובות מורכבות יותר.'}
};
const get=()=>localStorage.getItem(KEY)||'en';
function translateText(root,l){const map=exact;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(n=>{const v=n.nodeValue.trim();if(!v||!map[v]||!map[v][l])return;if(!n.parentElement.closest('script,style,code,.equation')){n.nodeValue=n.nodeValue.replace(v,map[v][l])}})}
function apply(){const l=get(),m=langs[l]||langs.en;document.documentElement.lang=l;document.documentElement.dir=m.dir;if(document.body)document.body.classList.toggle('rtl',m.dir==='rtl');document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(t[l]?.[k])e.textContent=t[l][k]});translateText(document.body,l);document.querySelectorAll('.i18n-checklist').forEach(el=>{const v={en:'✓ Correct element symbols<br>✓ Correct chemical formulas and subscripts<br>✓ Correct diatomic formulas when applicable<br>✓ Count atoms on both sides<br>✓ Add coefficients instead of changing formulas<br>✓ Recount every element<br>✓ Use the smallest whole-number ratio',ar:'✓ رموز العناصر الصحيحة<br>✓ الصيغ الكيميائية الصحيحة والأرقام السفلية<br>✓ الصيغ الصحيحة للعناصر ثنائية الذرة عند الحاجة<br>✓ عُدّ الذرات على كلا الجانبين<br>✓ أضف المعاملات بدلًا من تغيير الصيغ<br>✓ أعد عَدّ جميع العناصر<br>✓ استخدم أصغر نسبة ممكنة من الأعداد الصحيحة',he:'✓ סמלי יסודות נכונים<br>✓ נוסחאות כימיות ומספרים תחתיים נכונים<br>✓ נוסחאות נכונות ליסודות דו-אטומיים כאשר נדרש<br>✓ ספרו את האטומים בשני הצדדים<br>✓ הוסיפו מקדמים במקום לשנות נוסחאות<br>✓ ספרו מחדש כל יסוד<br>✓ השתמשו ביחס הקטן ביותר של מספרים שלמים'};el.innerHTML=v[l]||v.en});const s=document.getElementById('languageSwitcher');if(s)s.value=l}
function set(l){if(!langs[l])return;localStorage.setItem(KEY,l);apply()}
function addSwitcher(){const top=document.querySelector('.topbar');if(!top||document.getElementById('languageSwitcher'))return;const s=document.createElement('select');s.id='languageSwitcher';s.className='secondary';s.setAttribute('aria-label','Language');Object.entries(langs).forEach(([k,v])=>{const o=document.createElement('option');o.value=k;o.textContent=v.label;s.appendChild(o)});s.value=get();s.onchange=()=>set(s.value);top.appendChild(s)}
function init(){addSwitcher();apply()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.ChemistryLanguage={set,get,translate:t};
})();
