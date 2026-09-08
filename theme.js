(()=>{
'use strict';
const KEY='chemistryTheme',LANGUAGE_KEY='chemistryLanguage';
const NAV_LABELS={en:{'learn.html':'Learn','personal-quiz.html':'Quiz','challenges.html':'Challenges','index.html':'Balancer','checker.html':'Checker'},ar:{'learn.html':'تعلّم','personal-quiz.html':'اختبار','challenges.html':'التحديات','index.html':'موازنة المعادلات','checker.html':'التحقق'},he:{'learn.html':'למידה','personal-quiz.html':'חידון','challenges.html':'אתגרים','index.html':'איזון משוואות','checker.html':'בדיקה'}};
const THEME_LABELS={en:{dark:'🌙 Dark',light:'☀️ Light'},ar:{dark:'🌙 داكن',light:'☀️ فاتح'},he:{dark:'🌙 כהה',light:'☀️ בהיר'}};
function read(){try{return localStorage.getItem(KEY)==='dark'?'dark':'light'}catch{return'light'}}function readLanguage(){try{const l=localStorage.getItem(LANGUAGE_KEY);return l==='ar'||l==='he'?l:'en'}catch{return'en'}}
function apply(mode){const dark=mode==='dark';document.body.classList.toggle('dark',dark);const b=document.getElementById('themeToggle');if(b){const l=THEME_LABELS[readLanguage()]||THEME_LABELS.en;b.textContent=dark?l.light:l.dark}}
function stabilizeNavigation(){const top=document.querySelector('.topbar'),nav=document.querySelector('.main-nav');if(top)top.style.direction='ltr';if(nav){nav.style.direction='ltr';nav.style.flexWrap='wrap';nav.style.whiteSpace='normal';nav.style.overflowX='visible';nav.style.overflowY='visible';nav.style.minWidth='0';nav.style.width='100%';nav.querySelectorAll('a').forEach(a=>{a.style.flex='0 0 auto';a.style.whiteSpace='nowrap';a.style.fontSize='';a.style.padding=''})}}
function addChemistryIdentity(){if(document.getElementById('chemistryIdentity'))return;const s=document.createElement('style');s.id='chemistryIdentity';s.textContent=`
/* Stronger chemistry identity: visible in the content, restrained and academic */
body{background-image:radial-gradient(circle at 1px 1px,rgba(49,88,214,.075) 1px,transparent 1.2px);background-size:22px 22px}
main{position:relative}
.hero,.page-title{position:relative;isolation:isolate}
.hero:after,.page-title:after{content:'';position:absolute;z-index:-1;pointer-events:none;width:230px;height:230px;right:-70px;top:24px;border:1px solid rgba(49,88,214,.13);border-radius:50%;box-shadow:0 0 0 28px rgba(49,88,214,.035),0 0 0 58px rgba(108,77,232,.025)}
.hero:before,.page-title:before{content:'●';position:absolute;z-index:-1;pointer-events:none;right:42px;top:93px;font-size:16px;color:rgba(49,88,214,.22);text-shadow:-88px 43px 0 rgba(108,77,232,.18),-39px 93px 0 rgba(49,88,214,.16)}
.hero-card,.checker-card,.balancer{position:relative;overflow:hidden}
.hero-card:after,.checker-card:after,.balancer:after{content:'';position:absolute;right:-22px;bottom:-35px;width:125px;height:125px;border:1px solid rgba(49,88,214,.15);border-radius:50%;box-shadow:0 0 0 20px rgba(49,88,214,.035),-70px -18px 0 -55px rgba(108,77,232,.8);pointer-events:none}
.hero-card:before,.checker-card:before,.balancer:before{content:'⌬';position:absolute;right:25px;top:18px;font-size:28px;font-weight:400;color:rgba(49,88,214,.12);pointer-events:none}
.lesson,.quiz-q,.stage-list .stage,.steps article,.path-card,.progress-grid>div{position:relative;overflow:hidden}
.lesson:before,.quiz-q:before,.stage-list .stage:before,.steps article:before,.path-card:before,.progress-grid>div:before{content:'⌬';position:absolute;right:14px;top:10px;font-size:21px;font-weight:400;color:rgba(49,88,214,.10);pointer-events:none}
.lesson:after,.quiz-q:after,.stage-list .stage:after,.steps article:after,.path-card:after{content:'';position:absolute;right:0;bottom:0;width:72px;height:1px;background:linear-gradient(90deg,transparent,rgba(49,88,214,.20));pointer-events:none}
.section-head{position:relative}
.section-head:after{content:'→   →   →';position:absolute;right:0;bottom:-15px;letter-spacing:8px;font-size:11px;color:rgba(49,88,214,.16);pointer-events:none}
.equation{position:relative}
.equation:after{content:'→';display:inline-block;margin-left:14px;color:rgba(49,88,214,.25);font-weight:500}
body.dark{background-image:radial-gradient(circle at 1px 1px,rgba(120,145,220,.10) 1px,transparent 1.2px)}
body.dark .hero:after,body.dark .page-title:after{border-color:rgba(120,145,220,.16);box-shadow:0 0 0 28px rgba(120,145,220,.04),0 0 0 58px rgba(150,125,230,.025)}
body.dark .hero:before,body.dark .page-title:before{color:rgba(120,145,220,.22);text-shadow:-88px 43px 0 rgba(150,125,230,.20),-39px 93px 0 rgba(120,145,220,.18)}
body.dark .hero-card:after,body.dark .checker-card:after,body.dark .balancer:after{border-color:rgba(120,145,220,.16);box-shadow:0 0 0 20px rgba(120,145,220,.04),-70px -18px 0 -55px rgba(150,125,230,.8)}
body.dark .hero-card:before,body.dark .checker-card:before,body.dark .balancer:before,body.dark .lesson:before,body.dark .quiz-q:before,body.dark .stage-list .stage:before,body.dark .steps article:before,body.dark .path-card:before,body.dark .progress-grid>div:before{color:rgba(140,160,225,.14)}
body.dark .section-head:after{color:rgba(140,160,225,.17)}
@media(max-width:760px){body{background-size:18px 18px}.hero:after,.page-title:after{width:150px;height:150px;right:-75px;top:20px}.hero:before,.page-title:before{right:22px;top:68px}.section-head:after{right:4px;bottom:-12px;letter-spacing:4px}.hero-card:before,.checker-card:before,.balancer:before{right:18px;top:14px;font-size:23px}.lesson:before,.quiz-q:before,.stage-list .stage:before,.steps article:before,.path-card:before,.progress-grid>div:before{font-size:18px;right:10px;top:8px}}
`;
document.head.appendChild(s)}
function restoreLanguageShell(){const lang=readLanguage(),dir=lang==='ar'||lang==='he'?'rtl':'ltr';document.documentElement.lang=lang;document.documentElement.dir=dir;document.body.dir=dir;const labels=NAV_LABELS[lang];document.querySelectorAll('.main-nav a').forEach(a=>{const href=(a.getAttribute('href')||'').split('?')[0].split('#')[0].split('/').pop();if(labels[href])a.textContent=labels[href]});stabilizeNavigation();apply(read())}
function loadGlobalI18n(){if(document.querySelector('script[data-global-i18n]'))return;const s=document.createElement('script');s.src='i18n-core.js?v=20260830-complete';s.async=false;s.defer=false;s.onload=()=>{const e=document.createElement('script');e.src='i18n-enhancements.js?v=20260830-complete';e.async=false;e.defer=false;e.onload=()=>window.ChemistryI18n?.refresh?.();document.head.appendChild(e)};document.head.appendChild(s)}
function init(){const top=document.querySelector('.topbar');if(!top)return;addChemistryIdentity();restoreLanguageShell();let b=document.getElementById('themeToggle');if(!b){b=document.createElement('button');b.id='themeToggle';b.className='secondary';b.type='button';top.appendChild(b)}b.onclick=null;if(!b.dataset.themeBound){b.dataset.themeBound='1';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const mode=document.body.classList.contains('dark')?'light':'dark';try{localStorage.setItem(KEY,mode)}catch{}apply(mode)},true)}apply(read());loadGlobalI18n()}
if(document.querySelector('.topbar'))init();else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('chemistryLanguageChanged',restoreLanguageShell);
})();