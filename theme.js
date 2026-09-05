(()=>{
'use strict';
const KEY='chemistryTheme';
const DESIGN=['modern-refresh.css?v=20260905-unified-site-2','site-shell.css?v=20260905-shell-parity-3'];
const installDesign=()=>DESIGN.forEach((href,i)=>{const key='unified-design-'+i;if(document.querySelector('link[data-'+key+']'))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;l.dataset[key]='1';(document.head||document.documentElement).appendChild(l)});
const installShellParity=()=>{if(document.getElementById('siteShellParity'))return;const s=document.createElement('style');s.id='siteShellParity';s.textContent=`
/* Final shared shell: keep every page on the same visual geometry. */
main{width:100%!important;max-width:1160px!important;margin:0 auto!important}
.hero{display:grid!important;grid-template-columns:minmax(0,1.2fr) minmax(300px,.8fr)!important;gap:56px!important;align-items:center!important;min-height:390px!important;margin:0!important}
.hero>div:first-child{min-width:0!important}
.hero-card{min-width:0!important;min-height:140px!important;padding:28px!important;border-radius:20px!important}
.hero-card .atom{width:90px!important;height:90px!important;flex:0 0 90px!important}
.hero h1{margin-top:18px!important;margin-bottom:20px!important}
.hero p{max-width:650px!important;font-size:18px!important;line-height:1.55!important}
.section{width:100%!important}
.section>.card,.section>.grid-2,.section>.experience-switch,.section>.quiz-settings,.section>.challenge-hero,.section>.challenge-area,.section>.leaderboard-card{max-width:100%!important}
.card,.experience-card,.challenge-feature,.quiz-q,.steps article,.hero-card{border-radius:20px!important}
footer{width:100%!important}
@media(max-width:760px){
 main{padding:0 12px!important}
 .hero{display:block!important;min-height:0!important;padding-top:48px!important;padding-bottom:42px!important}
 .hero-card{margin-top:22px!important;min-height:0!important;padding:19px!important}
 .hero-card .atom{width:58px!important;height:58px!important;flex-basis:58px!important}
 .hero p{font-size:16px!important}
 .section{width:100%!important}
}
`;(document.head||document.documentElement).appendChild(s)};
const read=()=>{try{return localStorage.getItem(KEY)==='dark'?'dark':'light'}catch{return'light'}};
const apply=mode=>{const dark=mode==='dark';document.documentElement.classList.toggle('dark',dark);if(document.body)document.body.classList.toggle('dark',dark);const b=document.getElementById('themeToggle');if(b)b.textContent=dark?'☀️ Light':'🌙 Dark'};
const nav=()=>{const n=document.querySelector('.main-nav');if(!n)return;const routes=[['Learn','index.html'],['Quiz','personal-quiz.html'],['Challenges','challenges.html'],['Balancer','balancer.html'],['Checker','checker.html']];const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();const active=page==='learn.html'||page==='index.html'||page.includes('lesson')?'index.html':routes.some(([,h])=>h===page)?page:'index.html';const links=[...n.querySelectorAll('a')];routes.forEach(([label,href],i)=>{const a=links[i];if(!a)return;a.href=href;a.textContent=label;a.classList.toggle('active',href===active)});n.style.direction='ltr';const brand=document.querySelector('.brand');if(brand)brand.href='index.html'};
const normalizeLegacyHeroes=()=>{document.querySelectorAll('.page-title').forEach(old=>{if(old.dataset.heroNormalized)return;const eyebrow=old.querySelector(':scope > .eyebrow');const title=old.querySelector(':scope > h1');const copy=old.querySelector(':scope > p');if(!eyebrow||!title||!copy)return;const hero=document.createElement('section');hero.className='hero';hero.dataset.heroNormalized='1';const content=document.createElement('div');content.append(eyebrow,title,copy);const card=document.createElement('div');card.className='hero-card';const path=(location.pathname.split('/').pop()||'').toLowerCase();let icon='⚗',heading='Chemistry tools',text='Learn the method → practise → check your work';if(path==='challenges.html'){icon='🏆';heading='Live challenge';text='Choose an opponent → race the clock → compare results'}else if(path==='checker.html'){icon='✓';heading='Equation checker';text='Check every element → count atoms → fix what is wrong'}else if(path.includes('lesson')){icon='📚';heading='Learning path';text='Learn the concept → study the example → practise the skill'}card.innerHTML=`<div class="atom">${icon}</div><div><b>${heading}</b><p>${text}</p></div>`;hero.append(content,card);old.replaceWith(hero)})};
const installThemeButton=()=>{const top=document.querySelector('.topbar');if(!top||document.getElementById('themeToggle'))return;const b=document.createElement('button');b.id='themeToggle';b.className='secondary';b.type='button';b.textContent=read()==='dark'?'☀️ Light':'🌙 Dark';b.onclick=()=>{const next=read()==='dark'?'light':'dark';try{localStorage.setItem(KEY,next)}catch{}apply(next)};const account=document.getElementById('accountTopBtn');if(account)top.insertBefore(b,account);else top.appendChild(b)};
const init=()=>{installDesign();installShellParity();normalizeLegacyHeroes();nav();apply(read());installThemeButton();apply(read());};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
