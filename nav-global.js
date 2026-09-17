(()=>{
'use strict';
const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
if(page==='challenges.html')return;
if(window.__CHEM_NAV_FINAL__)return;
window.__CHEM_NAV_FINAL__=true;
const style=document.createElement('style');
style.textContent=`
/* Stable flat navigation: the nav owns only its grid cell and can never sit under Account. */
.topbar.topbar{display:grid!important;grid-template-columns:auto minmax(0,1fr) auto!important;grid-template-rows:auto!important;align-items:center!important;column-gap:8px!important;width:100%!important;min-width:0!important;box-sizing:border-box!important;overflow:visible!important}
.topbar.topbar>.brand{grid-column:1!important;grid-row:1!important;order:1!important;margin:0!important;min-width:0!important;white-space:nowrap!important}
.topbar.topbar>.main-nav.main-nav{grid-column:2!important;grid-row:1!important;order:2!important;display:flex!important;align-items:center!important;justify-content:center!important;flex-wrap:nowrap!important;gap:2px!important;width:100%!important;min-width:0!important;max-width:100%!important;overflow-x:hidden!important;overflow-y:hidden!important;white-space:nowrap!important;position:relative!important;z-index:1!important;box-sizing:border-box!important}
.topbar.topbar>.main-nav.main-nav>a{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;min-width:max-content!important;white-space:nowrap!important;padding:6px 6px!important;font-size:13px!important;line-height:1.2!important;box-sizing:border-box!important}
.topbar.topbar>.main-nav.main-nav>.nav-group{display:contents!important}
.topbar.topbar>.main-nav.main-nav>.nav-group-button{display:none!important}
.topbar.topbar>.main-nav.main-nav>.nav-group-menu{display:contents!important;position:static!important;transform:none!important;padding:0!important;border:0!important;box-shadow:none!important;background:transparent!important}
.topbar.topbar>.topbar-controls{grid-column:3!important;grid-row:1!important;order:3!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:4px!important;margin:0!important;min-width:max-content!important;white-space:nowrap!important;position:relative!important;z-index:3!important}
.topbar.topbar>.topbar-controls>*{flex:0 0 auto!important;margin:0!important;min-width:0!important}
.topbar.topbar>.topbar-controls #accountTopBtn{max-width:112px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
#themeToggle{display:inline-flex!important;align-items:center!important;justify-content:center!important;white-space:nowrap!important;min-height:36px!important;padding:7px 8px!important;border:1px solid var(--line)!important;background:var(--surface)!important;color:var(--text)!important;border-radius:10px!important;cursor:pointer!important;font:inherit!important;font-weight:800!important}
#themeToggle:hover{border-color:var(--accent)!important;color:var(--accent)!important}
#site-language-control{display:flex!important;align-items:center!important;gap:4px!important;white-space:nowrap!important;font-size:13px!important}
#site-language-control select{width:68px!important;max-width:68px!important;box-sizing:border-box!important}
@media(max-width:1100px){
  .topbar.topbar{column-gap:5px!important}
  .topbar.topbar>.main-nav.main-nav{justify-content:flex-start!important;overflow-x:auto!important;scrollbar-width:none!important;-webkit-overflow-scrolling:touch!important}
  .topbar.topbar>.main-nav.main-nav::-webkit-scrollbar{display:none!important}
  .topbar.topbar>.main-nav.main-nav>a{font-size:12px!important;padding-left:5px!important;padding-right:5px!important}
  .topbar.topbar>.topbar-controls{gap:3px!important}
  .topbar.topbar>.topbar-controls #accountTopBtn{max-width:100px!important}
  #themeToggle{font-size:11px!important;padding-left:6px!important;padding-right:6px!important}
  #site-language-control{font-size:11px!important}
  #site-language-control select{width:64px!important;max-width:64px!important}
}
@media(max-width:760px){
  .topbar.topbar{padding:7px 8px!important;column-gap:4px!important}
  .topbar.topbar>.brand{font-size:14px!important}
  .topbar.topbar>.main-nav.main-nav{justify-content:flex-start!important;gap:2px!important}
  .topbar.topbar>.main-nav.main-nav>a{font-size:10px!important;padding:6px 5px!important}
  .topbar.topbar>.topbar-controls{gap:2px!important}
  .topbar.topbar>.topbar-controls #accountTopBtn{max-width:75px!important}
  #themeToggle{font-size:10px!important;padding:6px 5px!important;min-height:32px!important}
  #site-language-control{font-size:10px!important}
  #site-language-control select{width:58px!important;max-width:58px!important}
}
`;
document.head.appendChild(style);
function flatten(){const nav=document.querySelector('.main-nav');if(!nav)return;nav.querySelectorAll('.nav-group').forEach(g=>{const menu=g.querySelector('.nav-group-menu');if(menu)[...menu.children].forEach(a=>nav.appendChild(a));g.remove()});}
function controls(){const top=document.querySelector('.topbar');if(!top)return;let box=document.getElementById('topbarControls');if(!box){box=document.createElement('div');box.id='topbarControls';box.className='topbar-controls';top.appendChild(box)}['accountTopBtn','logoutTopBtn'].forEach(id=>{const el=document.getElementById(id);if(el&&el.parentElement!==box)box.appendChild(el)});const lang=document.getElementById('site-language-control');if(lang&&lang.parentElement!==box)box.appendChild(lang);let theme=document.getElementById('themeToggle');if(!theme){theme=document.createElement('button');theme.id='themeToggle';theme.type='button';box.appendChild(theme);theme.addEventListener('click',()=>{const dark=document.body.classList.toggle('dark');try{localStorage.setItem('chemistryTheme',dark?'dark':'light')}catch{}theme.textContent=dark?'☀️ Light':'🌙 Dark'});}const dark=document.body.classList.contains('dark');theme.textContent=dark?'☀️ Light':'🌙 Dark';}
function fitNav(){
  const nav=document.querySelector('.main-nav');
  if(!nav)return;
  if(window.innerWidth<=1100)return;
  const links=[...nav.querySelectorAll(':scope > a')];
  if(!links.length)return;
  nav.style.overflowX='hidden';
  const sizes=[13,12,11,10,9.5,9];
  for(const size of sizes){
    nav.style.fontSize=size+'px';
    links.forEach(a=>{a.style.fontSize=size+'px';a.style.paddingLeft=(size<=10?3:6)+'px';a.style.paddingRight=(size<=10?3:6)+'px'});
    if(nav.scrollWidth<=nav.clientWidth+2){nav.style.justifyContent='center';return;}
  }
  nav.style.justifyContent='flex-start';
  nav.style.overflowX='auto';
  nav.style.scrollbarWidth='none';
}
function run(){flatten();controls();requestAnimationFrame(fitNav);}
run();
window.addEventListener('resize',fitNav,{passive:true});
})();
