(()=>{
'use strict';
if(window.__CHEM_NAV_FINAL__)return;
window.__CHEM_NAV_FINAL__=true;
const style=document.createElement('style');
style.textContent=`
/* One stable navigation layout for every page. Keep account controls outside the nav. */
.topbar.topbar{display:flex!important;align-items:center!important;flex-wrap:nowrap!important;gap:12px!important;min-width:0!important;width:100%!important;box-sizing:border-box!important}
.topbar.topbar>.brand{order:1!important;flex:0 0 auto!important;margin-right:0!important;min-width:0!important;white-space:nowrap!important}
.topbar.topbar>.main-nav.main-nav{order:2!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;flex:1 1 auto!important;width:auto!important;min-width:0!important;max-width:none!important;gap:4px!important;overflow-x:auto!important;overflow-y:hidden!important;white-space:nowrap!important;scrollbar-width:none!important;-webkit-overflow-scrolling:touch!important}
.topbar.topbar>.main-nav.main-nav::-webkit-scrollbar{display:none!important}
.topbar.topbar>.main-nav.main-nav>a{flex:0 0 auto!important;white-space:nowrap!important;padding:8px 9px!important;font-size:13px!important;min-width:max-content!important}
.topbar.topbar>.main-nav.main-nav>.nav-group{display:contents!important}
.topbar.topbar>.main-nav.main-nav>.nav-group-button{display:none!important}
.topbar.topbar>.main-nav.main-nav>.nav-group-menu{display:contents!important;position:static!important;transform:none!important;padding:0!important;border:0!important;box-shadow:none!important;background:transparent!important}
.topbar.topbar>.topbar-controls{order:3!important;display:flex!important;align-items:center!important;gap:7px!important;margin-left:auto!important;flex:0 0 auto!important;min-width:max-content!important;white-space:nowrap!important}
.topbar.topbar>.topbar-controls>*{flex:0 0 auto!important;margin:0!important}
.topbar.topbar>.topbar-controls #accountTopBtn{max-width:240px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
#themeToggle{display:inline-flex!important;align-items:center!important;justify-content:center!important;white-space:nowrap!important;min-height:38px!important;padding:8px 11px!important;border:1px solid var(--line)!important;background:var(--surface)!important;color:var(--text)!important;border-radius:10px!important;cursor:pointer!important;font:inherit!important;font-weight:800!important}
#themeToggle:hover{border-color:var(--accent)!important;color:var(--accent)!important}
/* If the full navigation cannot fit, put the complete navigation on its own row. */
@media(max-width:1400px){
  .topbar.topbar{flex-wrap:wrap!important;gap:8px 12px!important}
  .topbar.topbar>.main-nav.main-nav{order:5!important;flex:1 1 100%!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important}
  .topbar.topbar>.topbar-controls{margin-left:auto!important}
}
@media(max-width:760px){
  .topbar.topbar{padding:8px 12px!important;gap:6px 8px!important}
  .topbar.topbar>.brand{font-size:16px!important}
  .topbar.topbar>.main-nav.main-nav>a{font-size:12px!important;padding:8px 8px!important}
  .topbar.topbar>.topbar-controls{gap:4px!important}
  .topbar.topbar>.topbar-controls #accountTopBtn{max-width:48vw!important}
  #themeToggle{font-size:12px!important;padding:7px 8px!important;min-height:34px!important}
}
`;
document.head.appendChild(style);
function flatten(){const nav=document.querySelector('.main-nav');if(!nav)return;nav.querySelectorAll('.nav-group').forEach(g=>{const menu=g.querySelector('.nav-group-menu');if(menu)[...menu.children].forEach(a=>nav.appendChild(a));g.remove()});}
function controls(){const top=document.querySelector('.topbar');if(!top)return;let box=document.getElementById('topbarControls');if(!box){box=document.createElement('div');box.id='topbarControls';box.className='topbar-controls';top.appendChild(box)}['accountTopBtn','logoutTopBtn'].forEach(id=>{const el=document.getElementById(id);if(el&&el.parentElement!==box)box.appendChild(el)});const lang=document.getElementById('site-language-control');if(lang&&lang.parentElement!==box)box.appendChild(lang);let theme=document.getElementById('themeToggle');if(!theme){theme=document.createElement('button');theme.id='themeToggle';theme.type='button';box.appendChild(theme);theme.addEventListener('click',()=>{const dark=document.body.classList.toggle('dark');try{localStorage.setItem('chemistryTheme',dark?'dark':'light')}catch{}theme.textContent=dark?'☀️ Light':'🌙 Dark'});}const dark=document.body.classList.contains('dark');theme.textContent=dark?'☀️ Light':'🌙 Dark';}
function run(){flatten();controls();}
run();
})();
