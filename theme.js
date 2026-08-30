(()=>{
'use strict';
const KEY='chemistryTheme';
const LANGUAGE_KEY='chemistryLanguage';
const NAV_LABELS={
  en:{'learn.html':'Learn','personal-quiz.html':'Quiz','challenges.html':'Challenges','index.html':'Balancer','checker.html':'Checker'},
  ar:{'learn.html':'تعلّم','personal-quiz.html':'اختبار','challenges.html':'التحديات','index.html':'موازنة المعادلات','checker.html':'التحقق'},
  he:{'learn.html':'למידה','personal-quiz.html':'חידון','challenges.html':'אתגרים','index.html':'איזון משוואות','checker.html':'בדיקה'}
};
const THEME_LABELS={en:{dark:'🌙 Dark',light:'☀️ Light'},ar:{dark:'🌙 داكن',light:'☀️ فاتح'},he:{dark:'🌙 כהה',light:'☀️ בהיר'}};
function read(){try{return localStorage.getItem(KEY)==='dark'?'dark':'light'}catch{return'light'}}
function readLanguage(){try{const l=localStorage.getItem(LANGUAGE_KEY);return l==='ar'||l==='he'?l:'en'}catch{return'en'}}
function apply(mode){const dark=mode==='dark';document.body.classList.toggle('dark',dark);const b=document.getElementById('themeToggle');if(b){const l=THEME_LABELS[readLanguage()]||THEME_LABELS.en;b.textContent=dark?l.light:l.dark}}
function stabilizeNavigation(){const top=document.querySelector('.topbar');const nav=document.querySelector('.main-nav');if(top)top.style.direction='ltr';if(nav)nav.style.direction='ltr'}
function restoreLanguageShell(){const lang=readLanguage();const dir=lang==='ar'||lang==='he'?'rtl':'ltr';document.documentElement.lang=lang;document.documentElement.dir=dir;document.body.dir=dir;const labels=NAV_LABELS[lang];document.querySelectorAll('.main-nav a').forEach(a=>{const href=(a.getAttribute('href')||'').split('?')[0].split('#')[0].split('/').pop();if(labels[href])a.textContent=labels[href]});stabilizeNavigation();apply(read())}
function loadGlobalI18n(){
 if(document.querySelector('script[data-global-i18n]'))return;
 const s=document.createElement('script');
 s.src='i18n-core.js?v=20260830-full';
 s.async=false;s.defer=false;s.dataset.globalI18n='1';
 document.head.appendChild(s);
}
function init(){const top=document.querySelector('.topbar');if(!top)return;restoreLanguageShell();let b=document.getElementById('themeToggle');if(!b){b=document.createElement('button');b.id='themeToggle';b.className='secondary';b.type='button';top.appendChild(b)}b.onclick=null;if(!b.dataset.themeBound){b.dataset.themeBound='1';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const mode=document.body.classList.contains('dark')?'light':'dark';try{localStorage.setItem(KEY,mode)}catch{}apply(mode)},true)}apply(read());loadGlobalI18n()}
if(document.querySelector('.topbar'))init();else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('chemistryLanguageChanged',restoreLanguageShell);
})();
