(()=>{
'use strict';

const KEY='chemistryLanguage';
const LANG={en:{dir:'ltr',label:'English'},ar:{dir:'rtl',label:'العربية'},he:{dir:'rtl',label:'עברית'}};

const EXTRA={
  'Language':['اللغة','שפה'],
  'Learn':['تعلّم','למידה'],
  'Quiz':['اختبار','חידון'],
  'Challenges':['التحديات','אתגרים'],
  'Balancer':['موازنة المعادلات','איזון משוואות'],
  'Checker':['التحقق','בדיקה'],
  'Account':['الحساب','חשבון'],
  '👤 Account':['👤 الحساب','👤 חשבון'],
  '03 · BALANCER':['03 · موازنة المعادلات','03 · איזון משוואות'],
  '04 · CHECKER':['04 · التحقق','04 · בדיקה'],
  '02 · PRACTICE & QUIZ':['02 · تدريب واختبار','02 · תרגול וחידון'],
  '03 · MULTIPLAYER':['03 · لعب جماعي','03 · משחק מרובה משתתפים'],
  '01 · LEARNING GUIDE':['01 · دليل التعلّم','01 · מדריך למידה'],
  'Balance equations.':['وازن المعادلات.','אזנו משוואות.'],
  'Understand why.':['افهم السبب.','הבינו מדוע.'],
  'Enter a chemical equation and get the balanced result immediately, with optional step-by-step and algebra explanations.':['أدخل معادلة كيميائية واحصل فورًا على النتيجة الموزونة، مع شرح اختياري خطوة بخطوة وشرح جبري.','הזינו משוואה כימית וקבלו מיד את התוצאה המאוזנת, עם הסבר אופציונלי שלב אחר שלב והסבר אלגברי.'],
  'Conservation of atoms':['حفظ الذرات','שימור האטומים'],
  'The number of each element must be the same on both sides.':['يجب أن يكون عدد ذرات كل عنصر متساويًا على الجانبين.','מספר האטומים של כל יסוד חייב להיות זהה בשני צדי המשוואה.'],
  'Learn • Quiz • Challenges • Balance • Check':['تعلّم • اختبار • تحديات • موازنة • تحقق','למידה • חידון • אתגרים • איזון • בדיקה'],
  'Dark':['داكن','כהה'],
  'Light':['فاتح','בהיר']
};

const TITLES={
  'Chemistry Equations — Balancer':['معادلات الكيمياء — الموازنة','משוואות כימיות — איזון'],
  'Practice & Quiz — Chemistry Equations':['تدريب واختبار — معادلات الكيمياء','תרגול וחידון — משוואות כימיות'],
  'Challenges — Chemistry Equations':['التحديات — معادلات الكيمياء','אתגרים — משוואות כימיות'],
  'Checker — Chemistry Equations':['التحقق — معادلات الكيمياء','בדיקה — משוואות כימיות'],
  'Profile — Chemistry Equations':['الملف الشخصي — معادلات الكيمياء','פרופיל — משוואות כימיות'],
  'Chemistry Equations — Learn':['معادلات الكيمياء — تعلّم','משוואות כימיות — למידה'],
  'Beginner Chemistry Lessons — Chemistry Equations':['دروس الكيمياء للمبتدئين — معادلات الكيمياء','שיעורי כימיה למתחילים — משוואות כימיות'],
  'Intermediate Chemistry Lessons — Chemistry Equations':['دروس الكيمياء المتوسطة — معادلات الكيمياء','שיעורי כימיה בינוניים — משוואות כימיות'],
  'Advanced Chemistry Lessons — Chemistry Equations':['دروس الكيمياء المتقدمة — معادلات الكيمياء','שיעורי כימיה מתקדמים — משוואות כימיות'],
  'Set Password — Chemistry Equations':['تعيين كلمة المرور — معادلات الكيمياء','הגדרת סיסמה — משוואות כימיות'],
  'Quiz — Chemistry Equations':['اختبار — معادلات الكيمياء','חידון — משוואות כימיות'],
  'Chemistry Equations — Admin':['معادلات الكيمياء — الإدارة','משוואות כימיות — ניהול']
};

let dict={...(window.ChemistryTranslations||{}),...EXTRA};
const reverse=new Map();
const originalText=new WeakMap();
const originalAttr=new WeakMap();
let observer=null;
let refreshQueued=false;

function norm(v){return String(v??'').replace(/\s+/g,' ').trim()}
function currentLang(){try{const v=localStorage.getItem(KEY);return LANG[v]?v:'en'}catch{return'en'}}
function langIndex(l){return l==='ar'?0:1}
function rebuildReverse(){reverse.clear();for(const [en,pair] of Object.entries(dict)){if(pair?.[0])reverse.set(norm(pair[0]),en);if(pair?.[1])reverse.set(norm(pair[1]),en)}}
function sourceKey(raw){const n=norm(raw);if(!n)return n;if(dict[n])return n;return reverse.get(n)||n}
function translated(key,l=currentLang()){if(!key||l==='en')return key;const pair=dict[key];if(pair?.[langIndex(l)])return pair[langIndex(l)];const m=key.match(/^([^\p{L}\p{N}]*)(.+)$/u);if(m){const p=dict[m[2]];if(p?.[langIndex(l)])return m[1]+p[langIndex(l)]}return key}
function isProtected(el){return !el||!!el.closest('script,style,noscript,textarea,code,pre,[data-no-translate],.brand,.equation,.chemical-equation,.formula,.math,[data-equation],[data-chemical],canvas')}

function translateTextNode(node,l){const parent=node.parentElement;if(isProtected(parent)||parent?.closest('.site-language-control'))return;const raw=node.nodeValue||'',visible=norm(raw);if(!visible)return;if(!originalText.has(node))originalText.set(node,sourceKey(visible));const source=originalText.get(node),out=translated(source,l);if(out!==visible)node.nodeValue=raw.replace(visible,out)}

function scan(root=document.body){if(!root)return;const l=currentLang();if(root.nodeType===Node.TEXT_NODE){translateTextNode(root,l);return}const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const n of nodes)translateTextNode(n,l);const scope=root.querySelectorAll?root:document;for(const el of scope.querySelectorAll('input[placeholder],textarea[placeholder],[aria-label],[title]')){if(isProtected(el)||el.closest('.site-language-control'))continue;let src=originalAttr.get(el);if(!src){src={};originalAttr.set(el,src)}for(const a of ['placeholder','aria-label','title']){if(!el.hasAttribute(a))continue;const cur=el.getAttribute(a)||'';if(!src[a])src[a]=sourceKey(cur);const out=translated(src[a],l);if(out!==cur)el.setAttribute(a,out)}}}

function ensureCss(){let link=document.querySelector('link[data-chemistry-i18n-css]');if(!link){link=document.createElement('link');link.rel='stylesheet';link.dataset.chemistryI18nCss='1';document.head.appendChild(link)}link.href='site-language.css?v=20260901-global-6'}

function ensureSelector(){const top=document.querySelector('.topbar');if(!top)return;let box=document.getElementById('site-language-control');if(!box){box=document.createElement('label');box.id='site-language-control';box.className='site-language-control';box.innerHTML='<span class="site-language-icon" aria-hidden="true">🌐</span><span class="site-language-label">Language</span><select id="site-language-select" aria-label="Language"><option value="en">English</option><option value="ar">العربية</option><option value="he">עברית</option></select>';top.appendChild(box);box.querySelector('select').addEventListener('change',e=>{const l=LANG[e.target.value]?e.target.value:'en';try{localStorage.setItem(KEY,l)}catch{}applyShell();scan(document.body);window.dispatchEvent(new CustomEvent('chemistryLanguageChanged',{detail:{language:l}}))})}const select=box.querySelector('select');if(select)select.value=currentLang()}

function applyTitle(){const l=currentLang(),now=norm(document.title);let source=now;for(const [en,pair] of Object.entries(TITLES)){if(now===norm(pair[0])||now===norm(pair[1])){source=en;break}}const pair=TITLES[source];if(pair)document.title=l==='en'?source:pair[langIndex(l)]}

function applyBrand(l){const label=l==='ar'?'معادلات الكيمياء':l==='he'?'משוואות כימיות':'Chemistry Equations';document.querySelectorAll('.brand').forEach(brand=>{if(brand.dataset.i18nBrand===l&&brand.getAttribute('aria-label')===label)return;brand.innerHTML='<span class="logo" aria-hidden="true">⚗</span><span>'+label+'</span>';brand.setAttribute('aria-label',label);brand.dataset.i18nBrand=l})}
function applyShell(){const l=currentLang(),rtl=l!=='en',dir=rtl?'rtl':'ltr';document.documentElement.lang=l;document.documentElement.dir=dir;if(document.body){document.body.dir=dir;document.body.classList.toggle('is-rtl-language',rtl);document.body.classList.toggle('lang-ar',l==='ar');document.body.classList.toggle('lang-he',l==='he')}const top=document.querySelector('.topbar'),nav=document.querySelector('.main-nav');if(top)top.setAttribute('dir','ltr');if(nav){nav.setAttribute('dir','ltr');nav.querySelectorAll('a').forEach(a=>a.setAttribute('dir',rtl?'rtl':'ltr'))}applyBrand(l);document.querySelectorAll('.equation,.chemical-equation,.formula,.practice-equation,.practice-choice,.history-equation,.history-solution,.checker-equation,.math,[data-equation],[data-chemical],#equationInput,#checkInput,#recognizedEdit').forEach(el=>el.setAttribute('dir','ltr'));ensureSelector();const label=document.querySelector('.site-language-label'),labelText=l==='ar'?'اللغة':l==='he'?'שפה':'Language';if(label&&label.textContent!==labelText)label.textContent=labelText;applyTitle()}
function applyTextDirection(root=document.body){if(!root)return;const l=currentLang(),selector='div,h1,h2,h3,h4,p,li,label,button,a,span,small,strong,b,th,td';const elements=[];if(root.nodeType===Node.ELEMENT_NODE&&root.matches?.(selector))elements.push(root);if(root.querySelectorAll)elements.push(...root.querySelectorAll(selector));for(const el of elements){if(el.closest('.site-language-control,[data-no-auto-direction]'))continue;if(l==='en'){if(el.dataset.i18nAutoDir){delete el.dataset.i18nAutoDir;el.removeAttribute('dir')}continue}const value=norm(el.textContent);const rtl=/[\u0590-\u05ff\u0600-\u06ff]/u.test(value),latin=/[A-Za-z]/.test(value);if(latin&&!rtl){el.dataset.i18nAutoDir='ltr';el.setAttribute('dir','ltr')}else if(el.dataset.i18nAutoDir){delete el.dataset.i18nAutoDir;el.removeAttribute('dir')}}}
function refresh(root=document.body){applyShell();const target=root||document.body;scan(target);applyTextDirection(target)}
function schedule(root){if(refreshQueued)return;refreshQueued=true;requestAnimationFrame(()=>{refreshQueued=false;refresh(root&&root.isConnected?root:document.body)})}

function loadBaseDictionary(){dict={...(window.ChemistryTranslations||{}),...EXTRA};rebuildReverse();refresh();window.dispatchEvent(new Event('chemistryI18nReady'))}

function apiTranslate(en,ar,he){const l=currentLang();if(l==='en')return en;if(l==='ar'&&ar!=null)return ar;if(l==='he'&&he!=null)return he;return translated(sourceKey(en),l)}
function expose(){const api={lang:currentLang,t:apiTranslate,refresh:()=>refresh(),apply:()=>refresh(),setLanguage:l=>{if(!LANG[l])return;try{localStorage.setItem(KEY,l)}catch{}refresh();window.dispatchEvent(new CustomEvent('chemistryLanguageChanged',{detail:{language:l}}))}};window.ChemistryI18n=api;window.ChemLang=api}

function start(){ensureCss();rebuildReverse();expose();refresh();if(observer)observer.disconnect();observer=new MutationObserver(records=>{let root=null;for(const m of records){for(const n of m.addedNodes){if(n.nodeType===Node.ELEMENT_NODE){root=n;break}if(n.nodeType===Node.TEXT_NODE&&n.parentElement){root=n.parentElement;break}}if(root)break}if(root)schedule(root)});observer.observe(document.body,{childList:true,subtree:true});window.addEventListener('storage',e=>{if(e.key===KEY)refresh()});window.addEventListener('chemistryLanguageChanged',()=>refresh());loadBaseDictionary()}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
