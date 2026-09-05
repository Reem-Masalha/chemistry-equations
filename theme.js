(()=>{
'use strict';
const KEY='chemistryTheme';
const DESIGN=['modern-refresh.css?v=20260905-unified-site-9','site-shell.css?v=20260905-shell-parity-10'];
const installDesign=()=>DESIGN.forEach((href,i)=>{const key='unified-design-'+i;if(document.querySelector('link[data-'+key+']'))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;l.dataset[key]='1';(document.head||document.documentElement).appendChild(l)});
const loadScript=src=>{if(document.querySelector(`script[src^="${src}"]`))return Promise.resolve();return new Promise(resolve=>{const s=document.createElement('script');s.src=src;s.defer=true;s.onload=resolve;s.onerror=resolve;(document.head||document.documentElement).appendChild(s)})};
const installShellParity=()=>{if(document.getElementById('siteShellParity'))return;const s=document.createElement('style');s.id='siteShellParity';s.textContent=`
/* One visual template for every public page. Content and functionality remain page-specific. */
:root{--site-content-width:1160px}
html,body{margin:0!important;min-width:0!important;width:100%!important}
body{background:var(--modern-bg,#f5f7fb)!important;color:var(--modern-ink,#142033)!important}
.topbar{width:100%!important;min-height:72px!important;box-sizing:border-box!important}
.brand{margin-right:auto!important;white-space:nowrap!important}
.main-nav{display:flex!important;align-items:center!important;gap:7px!important;flex:0 0 auto!important}
.main-nav a{padding:9px 12px!important;border-radius:10px!important;white-space:nowrap!important}
main{box-sizing:border-box!important;width:100%!important;max-width:var(--site-content-width)!important;margin:0 auto!important;min-width:0!important}
/* Exact same hero geometry on Learn, Quiz, Challenges, Balancer, Checker and lessons. */
.hero,.home-page .hero,.quiz-page .hero{box-sizing:border-box!important;width:100%!important;display:grid!important;grid-template-columns:minmax(0,1.2fr) minmax(300px,.8fr)!important;gap:56px!important;align-items:center!important;min-height:390px!important;margin:0!important;padding:68px 0 36px!important;background:transparent!important}
.hero>div:first-child{min-width:0!important}
.hero .eyebrow{display:inline-flex!important;align-items:center!important}
.hero h1{margin:18px 0 20px!important;font-size:clamp(42px,6vw,70px)!important;line-height:1.02!important;letter-spacing:-.055em!important}
.hero p{max-width:650px!important;margin-top:0!important;font-size:18px!important;line-height:1.55!important}
.hero-card,.home-page .hero-card,.quiz-page .hero-card{box-sizing:border-box!important;width:100%!important;min-width:0!important;min-height:140px!important;margin:0!important;padding:28px!important;border:1px solid #d8e0f2!important;border-radius:20px!important;background:linear-gradient(145deg,var(--surface),#f4f7ff)!important;box-shadow:0 18px 45px rgba(31,48,82,.1)!important;display:flex!important;align-items:center!important;gap:18px!important}
.hero-card .atom{width:90px!important;height:90px!important;flex:0 0 90px!important}
.hero-card b{font-size:17px!important}
.hero-card p{margin:6px 0 0!important;line-height:1.5!important;font-size:16px!important}
/* Every main section uses the same vertical rhythm and no page-specific stripe backgrounds. */
.section,.home-page .section,.quiz-page .section{box-sizing:border-box!important;width:100%!important;margin:0!important;padding:84px 0!important;background:transparent!important}
.section.alt,.home-page .alt,.quiz-page .alt{background:transparent!important}
.section-head{box-sizing:border-box!important;width:100%!important;margin-bottom:22px!important}
.section-head h2{margin-bottom:7px!important}
.section-head p{max-width:760px!important}
/* Same surface language everywhere. */
.card,.experience-card,.challenge-feature,.quiz-q,.steps article,.hero-card,.lesson,.course-map article,.mistake,.course-note,.stats-card,.home-value-card,.next-card{box-sizing:border-box!important;border:1px solid var(--modern-border,#d8e1ed)!important;border-radius:20px!important;background:var(--modern-surface,#fff)!important;box-shadow:var(--modern-shadow,0 12px 32px rgba(25,43,76,.09))!important}
.card:hover,.experience-card:hover,.lesson:hover,.course-map article:hover,.home-value-card:hover{box-shadow:var(--modern-shadow-lg,0 22px 55px rgba(25,43,76,.14))!important}
.primary,.secondary,.chips button{min-height:45px!important;border-radius:12px!important;font-weight:800!important}
footer{box-sizing:border-box!important;width:100%!important;min-height:64px!important}
/* Learning-specific cards no longer use a different radius, shadow, tint or section stripe. */
.home-value{gap:18px!important;margin-top:26px!important}
.home-value-card{min-height:120px!important;padding:20px!important;background:var(--modern-surface,#fff)!important}
.course-map article{padding:20px!important}
.course-note,.mistakes-card{border-radius:20px!important}
.home-page .lesson{border-radius:20px!important}
.home-page .alt .card{box-shadow:var(--modern-shadow,0 12px 32px rgba(25,43,76,.09))!important}
/* Keep functional page-specific layouts, but give them the same card proportions. */
.experience-switch,.challenge-features,.lesson-grid,.course-map,.mistakes-grid{box-sizing:border-box!important}
.quiz-page .quiz-settings .card,.quiz-page .stats-card,.quiz-page .stage,.quiz-page .experience-options label,.quiz-page .type-options label{border-radius:20px!important}
.checker-card,.balancer,.handwriting,.equation-history,.challenge-area,.leaderboard-card{border-radius:20px!important}
body.dark{background:#0b111b!important;color:#edf2fa!important}
body.dark .hero-card{background:linear-gradient(145deg,var(--surface),#192438)!important;border-color:#2b394d!important;color:#edf2fa!important;box-shadow:0 18px 45px rgba(0,0,0,.21)!important}
body.dark .card,body.dark .experience-card,body.dark .challenge-feature,body.dark .quiz-q,body.dark .steps article,body.dark .lesson,body.dark .course-map article,body.dark .mistake,body.dark .course-note,body.dark .stats-card,body.dark .home-value-card,body.dark .next-card{background:var(--surface)!important}
@media(max-width:1100px){.hero,.home-page .hero,.quiz-page .hero{gap:32px!important}.main-nav{gap:4px!important}.main-nav a{padding:9px 10px!important;font-size:13px!important}}
@media(max-width:760px){
html,body{width:100%!important;max-width:100%!important;overflow-x:clip!important}
.topbar{display:grid!important;grid-template-columns:minmax(0,1fr) auto auto auto!important;align-items:center!important;gap:7px!important;padding:8px 12px!important}
.brand{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
.main-nav{display:none!important}
#themeToggle,#accountTopBtn,#logoutTopBtn{width:auto!important;min-width:42px!important;min-height:42px!important;padding:9px 10px!important;justify-content:center!important}
#themeToggle{font-size:0!important}
#themeToggle::first-letter,#accountTopBtn::first-letter,#logoutTopBtn::first-letter{font-size:18px!important}
.site-language-control{min-width:42px!important}
.site-language-control .site-language-label{display:none!important}
.site-language-control select{width:42px!important;height:42px!important;padding:0 4px!important}
main{padding:0 12px!important}
.hero,.home-page .hero,.quiz-page .hero{display:block!important;grid-template-columns:1fr!important;gap:0!important;min-height:0!important;padding:48px 0 42px!important}
.hero h1{font-size:clamp(38px,12vw,54px)!important}
.hero p{font-size:16px!important}
.hero-card,.home-page .hero-card,.quiz-page .hero-card{margin-top:22px!important;min-height:0!important;padding:19px!important}
.hero-card .atom{width:58px!important;height:58px!important;flex-basis:58px!important}
.section,.home-page .section,.quiz-page .section{width:100%!important;padding:34px 0!important}
.section-head{margin-bottom:16px!important}
.home-value{grid-template-columns:1fr!important;gap:12px!important;margin-top:20px!important}
.home-value-card{min-height:0!important;padding:18px!important}
}
`;(document.head||document.documentElement).appendChild(s)};
const read=()=>{try{return localStorage.getItem(KEY)==='dark'?'dark':'light'}catch{return'light'}};
const apply=mode=>{const dark=mode==='dark';document.documentElement.classList.toggle('dark',dark);if(document.body)document.body.classList.toggle('dark',dark);const b=document.getElementById('themeToggle');if(b)b.textContent=dark?'☀️ Light':'🌙 Dark'};
const nav=()=>{const n=document.querySelector('.main-nav');if(!n)return;const routes=[['Learn','index.html'],['Quiz','personal-quiz.html'],['Challenges','challenges.html'],['Balancer','balancer.html'],['Checker','checker.html']];const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();const active=page==='learn.html'||page==='index.html'||page.includes('lesson')?'index.html':routes.some(([,h])=>h===page)?page:'index.html';const links=[...n.querySelectorAll('a')];routes.forEach(([label,href],i)=>{const a=links[i];if(!a)return;a.href=href;a.textContent=label;a.classList.toggle('active',href===active)});n.style.direction='ltr';const brand=document.querySelector('.brand');if(brand)brand.href='index.html'};
const normalizeLegacyHeroes=()=>{document.querySelectorAll('.page-title').forEach(old=>{if(old.dataset.heroNormalized)return;const eyebrow=old.querySelector(':scope > .eyebrow');const title=old.querySelector(':scope > h1');const copy=old.querySelector(':scope > p');if(!eyebrow||!title||!copy)return;const hero=document.createElement('section');hero.className='hero';hero.dataset.heroNormalized='1';const content=document.createElement('div');content.append(eyebrow,title,copy);const card=document.createElement('div');card.className='hero-card';const path=(location.pathname.split('/').pop()||'').toLowerCase();let icon='⚗',heading='Chemistry tools',text='Learn the method → practise → check your work';if(path==='challenges.html'){icon='🏆';heading='Live challenge';text='Choose an opponent → race the clock → compare results'}else if(path==='checker.html'){icon='✓';heading='Equation checker';text='Check every element → count atoms → fix what is wrong'}else if(path.includes('lesson')){icon='📚';heading='Learning path';text='Learn the concept → study the example → practise the skill'}card.innerHTML=`<div class="atom">${icon}</div><div><b>${heading}</b><p>${text}</p></div>`;hero.append(content,card);old.replaceWith(hero)})};
const installThemeButton=()=>{const top=document.querySelector('.topbar');if(!top)return;let b=document.getElementById('themeToggle');if(!b){b=document.createElement('button');b.id='themeToggle';b.className='secondary';b.type='button';b.onclick=()=>{const next=read()==='dark'?'light':'dark';try{localStorage.setItem(KEY,next)}catch{}apply(next)};top.appendChild(b)}b.textContent=read()==='dark'?'☀️ Light':'🌙 Dark'};
const reorderControls=()=>{const top=document.querySelector('.topbar');if(!top)return;const ids=['accountTopBtn','logoutTopBtn','site-language-control','themeToggle'];ids.forEach(id=>{const el=document.getElementById(id);if(el)top.appendChild(el)});};
const ensureLanguageSystem=async()=>{await loadScript('i18n-core.js');setTimeout(reorderControls,80)};
const init=()=>{installDesign();installShellParity();normalizeLegacyHeroes();nav();apply(read());installThemeButton();reorderControls();ensureLanguageSystem();setTimeout(reorderControls,300);setTimeout(reorderControls,1000)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
