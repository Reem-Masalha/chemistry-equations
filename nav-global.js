(()=>{
'use strict';
const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
if(page==='challenges.html')return;
if(window.__CHEM_NAV_FINAL__)return;
window.__CHEM_NAV_FINAL__=true;
const style=document.createElement('style');
style.textContent=`
/* Flat navigation: keep the account controls separate and give the nav the remaining width. */
.topbar.topbar{display:flex!important;align-items:center!important;min-width:0!important;overflow:visible!important;gap:18px!important}
.topbar.topbar>.brand{order:1!important;margin-right:0!important;min-width:0!important;flex:0 1 auto!important;white-space:nowrap!important}
.topbar.topbar>.main-nav.main-nav{order:2!important;display:flex!important;align-items:center!important;justify-content:center!important;flex:1 1 auto!important;min-width:0!important;max-width:none!important;overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none!important;-webkit-overflow-scrolling:touch!important;flex-wrap:nowrap!important;gap:7px!important;white-space:nowrap!important;position:relative!important;z-index:1!important}
.topbar.topbar>.main-nav.main-nav::-webkit-scrollbar{display:none!important}
.topbar.topbar>.main-nav.main-nav>a{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;min-width:max-content!important;white-space:nowrap!important;padding:9px 12px!important;font-size:14px!important;line-height:1.2!important;box-sizing:border-box!important}
.topbar.topbar>.main-nav.main-nav>.nav-group{display:contents!important}
.topbar.topbar>.main-nav.main-nav>.nav-group-button{display:none!important}
.topbar.topbar>.main-nav.main-nav>.nav-group-menu{display:contents!important;position:static!important;transform:none!important;padding:0!important;border:0!important;box-shadow:none!important;background:transparent!important}
.topbar.topbar>.topbar-controls{order:3!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:4px!important;margin:0!important;min-width:max-content!important;flex:0 0 auto!important;white-space:nowrap!important;position:relative!important;z-index:3!important}
.topbar.topbar>.topbar-controls>*{flex:0 0 auto!important;margin:0!important;min-width:0!important}
.topbar.topbar>.topbar-controls #accountTopBtn{max-width:none!important;overflow:visible!important;text-overflow:clip!important;white-space:nowrap!important}
#themeToggle{display:inline-flex!important;align-items:center!important;justify-content:center!important;white-space:nowrap!important;min-height:36px!important;padding:7px 8px!important;border:1px solid var(--line)!important;background:var(--surface)!important;color:var(--text)!important;border-radius:10px!important;cursor:pointer!important;font:inherit!important;font-weight:800!important}
#themeToggle:hover{border-color:var(--accent)!important;color:var(--accent)!important}
#site-language-control{display:flex!important;align-items:center!important;gap:4px!important;white-space:nowrap!important;font-size:13px!important}
#site-language-control select{width:68px!important;max-width:68px!important;box-sizing:border-box!important}
@media(max-width:1100px){
  .topbar.topbar{gap:8px!important}
  .topbar.topbar>.main-nav.main-nav{justify-content:flex-start!important;gap:2px!important}
  .topbar.topbar>.main-nav.main-nav>a{font-size:12px!important;padding:7px 7px!important}
  .topbar.topbar>.topbar-controls{gap:3px!important}
  #themeToggle{font-size:11px!important;padding-left:6px!important;padding-right:6px!important}
  #site-language-control{font-size:11px!important}
  #site-language-control select{width:64px!important;max-width:64px!important}
}
@media(max-width:760px){
  .topbar.topbar{padding:7px 8px!important;gap:4px!important;flex-wrap:wrap!important}
  .topbar.topbar>.brand{font-size:14px!important;flex:0 1 auto!important}
  .topbar.topbar>.main-nav.main-nav{order:3!important;flex:1 0 100%!important;width:100%!important;max-width:none!important;gap:2px!important;padding:3px 0 1px!important;justify-content:flex-start!important}
  .topbar.topbar>.main-nav.main-nav>a{font-size:10px!important;padding:6px 5px!important}
  .topbar.topbar>.topbar-controls{order:2!important;gap:2px!important;margin-left:auto!important}
  #themeToggle{font-size:10px!important;padding:6px 5px!important;min-height:32px!important}
  #site-language-control{font-size:10px!important}
  #site-language-control select{width:58px!important;max-width:58px!important}
}
`;
document.head.appendChild(style);
function flatten(){const nav=document.querySelector('.main-nav');if(!nav)return;nav.querySelectorAll('.nav-group').forEach(g=>{const menu=g.querySelector('.nav-group-menu');if(menu)[...menu.children].forEach(a=>nav.appendChild(a));g.remove()});}
function controls(){const top=document.querySelector('.topbar');if(!top)return;let box=document.getElementById('topbarControls');if(!box){box=document.createElement('div');box.id='topbarControls';box.className='topbar-controls';top.appendChild(box)}['accountTopBtn','logoutTopBtn'].forEach(id=>{const el=document.getElementById(id);if(el&&el.parentElement!==box)box.appendChild(el)});const lang=document.getElementById('site-language-control');if(lang&&lang.parentElement!==box)box.appendChild(lang);let theme=document.getElementById('themeToggle');if(!theme){theme=document.createElement('button');theme.id='themeToggle';theme.type='button';box.appendChild(theme);theme.addEventListener('click',()=>{const dark=document.body.classList.toggle('dark');try{localStorage.setItem('chemistryTheme',dark?'dark':'light')}catch{}theme.textContent=dark?'☀️ Light':'🌙 Dark'});}const dark=document.body.classList.contains('dark');theme.textContent=dark?'☀️ Light':'🌙 Dark';}
function normalize(){const nav=document.querySelector('.main-nav');if(!nav)return;nav.querySelectorAll(':scope > a').forEach(a=>{a.style.fontSize='';a.style.paddingLeft='';a.style.paddingRight=''});nav.style.overflowX='auto';nav.style.overflowY='hidden';nav.style.justifyContent=window.innerWidth<=1100?'flex-start':'center';}
function run(){flatten();controls();normalize();}
run();
window.addEventListener('resize',normalize,{passive:true});
})();
