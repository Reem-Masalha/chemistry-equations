(()=>{
'use strict';
if(window.__CHEM_NAV_FINAL__)return;
window.__CHEM_NAV_FINAL__=true;
const style=document.createElement('style');
style.textContent=`
.topbar.topbar{display:grid!important;grid-template-columns:auto minmax(0,1fr) auto!important;grid-template-rows:auto!important;align-items:center!important;column-gap:8px!important;width:100%!important;min-width:0!important;box-sizing:border-box!important;overflow:visible!important}
.topbar.topbar>.brand{grid-column:1!important;grid-row:1!important;order:1!important;margin:0!important;min-width:0!important;white-space:nowrap!important}
.topbar.topbar>.main-nav.main-nav{grid-column:2!important;grid-row:1!important;order:2!important;display:flex!important;align-items:center!important;justify-content:center!important;flex-wrap:nowrap!important;gap:3px!important;width:100%!important;min-width:0!important;max-width:none!important;overflow:visible!important;white-space:nowrap!important}
.topbar.topbar>.main-nav.main-nav>a{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 1 auto!important;min-width:max-content!important;white-space:nowrap!important;padding:7px clamp(5px,.5vw,9px)!important;font-size:clamp(8px,.9vw,13px)!important;box-sizing:border-box!important}
.topbar.topbar>.main-nav.main-nav>.nav-group{position:relative!important;display:inline-flex!important;align-items:center!important;flex:0 0 auto!important}
.topbar.topbar>.main-nav.main-nav>.nav-group-button{appearance:none!important;border:0!important;background:transparent!important;color:inherit!important;font:inherit!important;font-weight:700!important;white-space:nowrap!important;cursor:pointer!important;padding:7px clamp(5px,.5vw,9px)!important;border-radius:9px!important;display:inline-flex!important;align-items:center!important;gap:5px!important}
.topbar.topbar>.main-nav.main-nav>.nav-group-button:hover,.topbar.topbar>.main-nav.main-nav>.nav-group.open>.nav-group-button,.topbar.topbar>.main-nav.main-nav>.nav-group.has-active>.nav-group-button{background:rgba(49,88,214,.10)!important;color:var(--accent)!important}
.topbar.topbar>.main-nav.main-nav>.nav-group-menu{display:none!important;position:absolute!important;top:calc(100% + 6px)!important;left:50%!important;transform:translateX(-50%)!important;min-width:160px!important;padding:6px!important;background:var(--surface)!important;border:1px solid var(--line)!important;border-radius:12px!important;box-shadow:0 14px 35px rgba(15,23,42,.16)!important;z-index:10000!important}
.topbar.topbar>.main-nav.main-nav>.nav-group.open>.nav-group-menu{display:flex!important;flex-direction:column!important}
.topbar.topbar>.main-nav.main-nav>.nav-group-menu a{display:block!important;width:100%!important;box-sizing:border-box!important;padding:9px 11px!important;border-radius:8px!important;text-decoration:none!important;flex:none!important}
.topbar.topbar>.main-nav.main-nav>.nav-group-menu a:hover{background:rgba(49,88,214,.08)!important}
.topbar.topbar>.main-nav.main-nav>.nav-group-menu a.active{background:var(--accent)!important;color:#fff!important;font-weight:800!important}
.topbar.topbar>.main-nav.main-nav>a.active{background:var(--accent)!important;color:#fff!important;border-radius:9px!important;box-shadow:0 3px 10px rgba(49,88,214,.18)!important}
.topbar.topbar>.topbar-controls{grid-column:3!important;grid-row:1!important;order:3!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:4px!important;margin:0!important;min-width:0!important;white-space:nowrap!important}
.topbar.topbar>.topbar-controls>*{flex:0 1 auto!important;margin:0!important;min-width:0!important}
.topbar.topbar>.topbar-controls #accountTopBtn{max-width:130px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
.topbar.topbar>.topbar-controls #themeToggle{display:inline-flex!important;align-items:center!important;justify-content:center!important;white-space:nowrap!important;min-height:36px!important;padding:7px 8px!important;box-sizing:border-box!important}
#themeToggle:hover{border-color:var(--accent)!important;color:var(--accent)!important}
@media(max-width:1200px){
 .topbar.topbar{column-gap:4px!important}
 .topbar.topbar>.main-nav.main-nav>a,.topbar.topbar>.main-nav.main-nav>.nav-group-button{font-size:clamp(8px,.8vw,11px)!important;padding-left:3px!important;padding-right:3px!important}
 .topbar.topbar>.topbar-controls{gap:3px!important}
 .topbar.topbar>.topbar-controls #accountTopBtn{max-width:100px!important}
 .topbar.topbar>.topbar-controls #themeToggle{font-size:11px!important;padding-left:6px!important;padding-right:6px!important}
}
@media(max-width:760px){
 .topbar.topbar{padding:7px 8px!important;column-gap:3px!important}
 .topbar.topbar>.brand{font-size:14px!important}
 .topbar.topbar>.main-nav.main-nav{justify-content:flex-start!important;overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none!important;-webkit-overflow-scrolling:touch!important;gap:3px!important}
 .topbar.topbar>.main-nav.main-nav::-webkit-scrollbar{display:none}
 .topbar.topbar>.main-nav.main-nav>a,.topbar.topbar>.main-nav.main-nav>.nav-group-button{font-size:clamp(8px,1.7vw,10px)!important;padding:6px 5px!important}
 .topbar.topbar>.main-nav.main-nav>.nav-group-menu{position:fixed!important;top:auto!important;left:auto!important;right:10px!important;transform:none!important;min-width:155px!important}
 .topbar.topbar>.topbar-controls{gap:2px!important}
 .topbar.topbar>.topbar-controls #accountTopBtn{max-width:70px!important}
 .topbar.topbar>.topbar-controls #themeToggle{font-size:10px!important;padding:6px 5px!important;min-height:32px!important}
 .topbar.topbar>.main-nav.main-nav>a.active,.topbar.topbar>.main-nav.main-nav>.nav-group.has-active>.nav-group-button{box-shadow:0 2px 8px rgba(49,88,214,.28)!important}
}
`;
document.head.appendChild(style);
const currentPage=()=>location.pathname.split('/').pop()||'index.html';
const labels={en:{practice:'Practice',tools:'Tools',quiz:'Quiz',challenges:'Challenges',balancer:'Balancer',checker:'Checker'},ar:{practice:'تدريب',tools:'أدوات',quiz:'اختبار',challenges:'التحديات',balancer:'موازنة المعادلات',checker:'التحقق'},he:{practice:'תרגול',tools:'כלים',quiz:'חידון',challenges:'אתגרים',balancer:'איזון משוואות',checker:'בדיקה'}};
const getLang=()=>{try{const x=localStorage.getItem('chemistryLanguage');return labels[x]?x:'en'}catch{return'en'}};
function groupLinks(){
 const nav=document.querySelector('.main-nav');
 if(!nav||nav.dataset.practiceToolsGrouped)return;
 const all=[...nav.querySelectorAll(':scope > a')];
 const find=(file)=>all.find(a=>((a.getAttribute('href')||'').split(/[?#]/)[0].split('/').pop()===file));
 const quiz=find('personal-quiz.html'), challenges=find('challenges.html'), balancer=find('index.html'), checker=find('checker.html');
 const make=(title,items)=>{
  if(!items.length)return null;
  const g=document.createElement('div');g.className='nav-group';
  const b=document.createElement('button');b.type='button';b.className='nav-group-button';b.innerHTML='<span>'+title+'</span><span class="nav-chevron" aria-hidden="true">⌄</span>';b.setAttribute('aria-haspopup','true');b.setAttribute('aria-expanded','false');
  const menu=document.createElement('div');menu.className='nav-group-menu';items.forEach(a=>menu.appendChild(a));
  const active=items.some(a=>a.classList.contains('active'));g.classList.toggle('has-active',active);
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();nav.querySelectorAll('.nav-group.open').forEach(x=>{if(x!==g){x.classList.remove('open');x.querySelector('.nav-group-button')?.setAttribute('aria-expanded','false')}});const open=g.classList.toggle('open');b.setAttribute('aria-expanded',String(open));});
  g.append(b,menu);return g;
 };
 if(quiz||challenges){const g=make(labels[getLang()].practice,[quiz,challenges].filter(Boolean));if(g)nav.appendChild(g)}
 if(balancer||checker){const g=make(labels[getLang()].tools,[balancer,checker].filter(Boolean));if(g)nav.appendChild(g)}
 nav.dataset.practiceToolsGrouped='1';
 document.addEventListener('click',e=>{if(!e.target.closest('.nav-group'))nav.querySelectorAll('.nav-group.open').forEach(g=>{g.classList.remove('open');g.querySelector('.nav-group-button')?.setAttribute('aria-expanded','false')})},{once:false});
}
function controls(){const top=document.querySelector('.topbar');if(!top)return;let box=document.getElementById('topbarControls');if(!box){box=document.createElement('div');box.id='topbarControls';box.className='topbar-controls';top.appendChild(box)}['accountTopBtn','logoutTopBtn'].forEach(id=>{const el=document.getElementById(id);if(el&&el.parentElement!==box)box.appendChild(el)});const lang=document.getElementById('site-language-control');if(lang&&lang.parentElement!==box)box.appendChild(lang);let theme=document.getElementById('themeToggle');if(!theme){theme=document.createElement('button');theme.id='themeToggle';theme.type='button';box.appendChild(theme);theme.addEventListener('click',()=>{const dark=document.body.classList.toggle('dark');try{localStorage.setItem('chemistryTheme',dark?'dark':'light')}catch{}theme.textContent=dark?'☀️ Light':'🌙 Dark'});}else if(theme.parentElement!==box){box.appendChild(theme)}const dark=document.body.classList.contains('dark');theme.textContent=dark?'☀️ Light':'🌙 Dark';}
function run(){groupLinks();controls();}
run();
})();
