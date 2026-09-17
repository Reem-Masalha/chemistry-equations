(()=>{
'use strict';
if(window.__CHEM_NAV_FINAL__)return;
window.__CHEM_NAV_FINAL__=true;
const style=document.createElement('style');
style.textContent=`
/* Keep the complete navigation on one row without allowing the account controls to cover it. */
.topbar.topbar{display:grid!important;grid-template-columns:auto minmax(0,1fr) auto!important;grid-template-rows:auto!important;align-items:center!important;column-gap:8px!important;width:100%!important;min-width:0!important;box-sizing:border-box!important;overflow:visible!important}
.topbar.topbar>.brand{grid-column:1!important;grid-row:1!important;order:1!important;margin:0!important;min-width:0!important;white-space:nowrap!important}
.topbar.topbar>.main-nav.main-nav{grid-column:2!important;grid-row:1!important;order:2!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;flex-wrap:nowrap!important;gap:2px!important;width:100%!important;min-width:0!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;white-space:nowrap!important;scrollbar-width:none!important;-webkit-overflow-scrolling:touch!important;position:relative!important;z-index:1!important}
.topbar.topbar>.main-nav.main-nav::-webkit-scrollbar{display:none!important}
.topbar.topbar>.main-nav.main-nav>a{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;min-width:max-content!important;white-space:nowrap!important;padding:6px 6px!important;font-size:12px!important;line-height:1.2!important;box-sizing:border-box!important}
.topbar.topbar>.main-nav.main-nav>.nav-group{display:contents!important}
.topbar.topbar>.main-nav.main-nav>.nav-group-button{display:none!important}
.topbar.topbar>.main-nav.main-nav>.nav-group-menu{display:contents!important;position:static!important;transform:none!important;padding:0!important;border:0!important;box-shadow:none!important;background:transparent!important}
.topbar.topbar>.topbar-controls{grid-column:3!important;grid-row:1!important;order:3!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:4px!important;margin:0!important;min-width:max-content!important;white-space:nowrap!important;position:static!important;z-index:3!important}
.topbar.topbar>.topbar-controls>*{flex:0 0 auto!important;margin:0!important;min-width:0!important}
.topbar.topbar>.topbar-controls #accountTopBtn{max-width:150px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
#themeToggle{display:inline-flex!important;align-items:center!important;justify-content:center!important;white-space:nowrap!important;min-height:36px!important;padding:7px 8px!important;border:1px solid var(--line)!important;background:var(--surface)!important;color:var(--text)!important;border-radius:10px!important;cursor:pointer!important;font:inherit!important;font-weight:800!important}
#themeToggle:hover{border-color:var(--accent)!important;color:var(--accent)!important}
#site-language-control{display:flex!important;align-items:center!important;gap:4px!important;white-space:nowrap!important;font-size:13px!important}
#site-language-control select{max-width:82px!important;width:82px!important;box-sizing:border-box!important}
@media(max-width:1200px){
  .topbar.topbar{column-gap:5px!important}
  .topbar.topbar>.main-nav.main-nav{gap:1px!important}
  .topbar.topbar>.main-nav.main-nav>a{font-size:11px!important;padding-left:4px!important;padding-right:4px!important}
  .topbar.topbar>.topbar-controls{gap:3px!important}
  .topbar.topbar>.topbar-controls #accountTopBtn{max-width:110px!important}
  #themeToggle{font-size:11px!important;padding-left:6px!important;padding-right:6px!important}
  #site-language-control{font-size:11px!important}
  #site-language-control select{width:72px!important;max-width:72px!important}
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
  #site-language-control select{width:68px!important;max-width:68px!important}
}
`;
document.head.appendChild(style);
function flatten(){const nav=document.querySelector('.main-nav');if(!nav)return;nav.querySelectorAll('.nav-group').forEach(g=>{const menu=g.querySelector('.nav-group-menu');if(menu)[...menu.children].forEach(a=>nav.appendChild(a));g.remove()});}
function controls(){const top=document.querySelector('.topbar');if(!top)return;let box=document.getElementById('topbarControls');if(!box){box=document.createElement('div');box.id='topbarControls';box.className='topbar-controls';top.appendChild(box)}['accountTopBtn','logoutTopBtn'].forEach(id=>{const el=document.getElementById(id);if(el&&el.parentElement!==box)box.appendChild(el)});const lang=document.getElementById('site-language-control');if(lang&&lang.parentElement!==box)box.appendChild(lang);let theme=document.getElementById('themeToggle');if(!theme){theme=document.createElement('button');theme.id='themeToggle';theme.type='button';box.appendChild(theme);theme.addEventListener('click',()=>{const dark=document.body.classList.toggle('dark');try{localStorage.setItem('chemistryTheme',dark?'dark':'light')}catch{}theme.textContent=dark?'☀️ Light':'🌙 Dark'});}const dark=document.body.classList.contains('dark');theme.textContent=dark?'☀️ Light':'🌙 Dark';}
function run(){flatten();controls();}
run();
})();
