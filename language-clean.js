(()=>{
'use strict';
const load=()=>{
 if(window.ChemistryI18n){window.ChemistryI18n.refresh?.();return}
 const s=document.createElement('script');
 s.src='i18n-safe.js?v=20260830-107';
 s.async=false;
 s.onload=()=>window.ChemistryI18n?.refresh?.();
 document.head.appendChild(s);
};
function stabilizeNavigation(){
 const styleId='stableNavigationLayout';
 if(!document.getElementById(styleId)){
  const st=document.createElement('style');
  st.id=styleId;
  st.textContent=`
    .topbar{min-width:0!important;gap:18px!important;flex-wrap:nowrap!important}
    .main-nav{display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;white-space:nowrap!important;flex-wrap:nowrap!important;direction:ltr!important;min-width:0!important;flex:1 1 auto!important;width:auto!important;max-width:none!important;overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none!important}
    .main-nav::-webkit-scrollbar{display:none}
    .main-nav a{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;width:auto!important;min-width:max-content!important;padding:9px 12px!important;white-space:nowrap!important;border-radius:10px!important}
    .main-nav .nav-group{display:contents!important}
    .main-nav .nav-group-button{display:none!important}
    .main-nav .nav-group-menu{display:contents!important;position:static!important;transform:none!important;min-width:0!important;padding:0!important;border:0!important;box-shadow:none!important;background:transparent!important}
    .main-nav .nav-group-menu a{display:inline-flex!important;width:auto!important;flex:0 0 auto!important;padding:9px 12px!important;white-space:nowrap!important;border-radius:10px!important}
    .topbar-controls{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;flex:0 0 auto!important;min-width:max-content!important;white-space:nowrap!important}
    .topbar-controls .account-top{flex:0 0 auto!important;margin:0!important;white-space:nowrap!important}
    .topbar-controls .site-language-control{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;margin:0!important;flex:0 0 auto!important;white-space:nowrap!important}
    .topbar-controls .site-language-control select{font:inherit;min-height:36px;max-width:110px}
    @media(min-width:761px){
      .topbar{display:flex!important;align-items:center!important}
      .topbar .brand{margin-right:0!important;flex:0 0 auto!important;min-width:0!important}
      .topbar .main-nav{order:2!important;flex:1 1 auto!important;min-width:0!important;max-width:none!important}
      .topbar .topbar-controls{order:3!important;flex:0 0 auto!important}
    }
    @media(max-width:760px){
      .topbar{display:flex!important;flex-wrap:nowrap!important;gap:6px!important;padding-left:10px!important;padding-right:10px!important}
      .topbar .brand{font-size:15px!important;flex:0 0 auto!important;min-width:max-content!important}
      .topbar .main-nav{position:static!important;order:0!important;flex:1 1 auto!important;min-width:0!important;max-width:none!important;width:auto!important;justify-content:flex-start!important;overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none!important;-webkit-overflow-scrolling:touch!important}
      .topbar .main-nav::-webkit-scrollbar{display:none}
      .topbar .main-nav a,.topbar .main-nav .nav-group-menu a{font-size:10px!important;padding:6px 5px!important;line-height:1.1!important}
      .topbar-controls{gap:4px!important;min-width:max-content!important}
      .topbar-controls .account-top{font-size:10px!important;padding:6px 6px!important;line-height:1.1!important}
      .topbar-controls .site-language-control{gap:0!important}
      .topbar-controls .site-language-control .site-language-icon,.topbar-controls .site-language-control .site-language-label{display:none!important}
      .topbar-controls .site-language-control select{font-size:10px!important;min-width:62px!important;width:62px!important;max-width:62px!important;min-height:30px!important;padding:3px!important}
    }
  `;
  document.head.appendChild(st);
 }
 const flatten=()=>{
  if(window.__CHEM_NAV_FINAL__)return;
  const nav=document.querySelector('.main-nav');
  if(!nav)return;
  nav.querySelectorAll('.nav-group').forEach(group=>{
   const menu=group.querySelector('.nav-group-menu');
   if(menu)[...menu.children].forEach(a=>nav.appendChild(a));
   group.remove();
  });
  nav.querySelectorAll('a').forEach(a=>{a.style.whiteSpace='nowrap';a.style.flex='0 0 auto'});
 };
 const organizeControls=()=>{
  const top=document.querySelector('.topbar');
  if(!top)return;
  let controls=document.getElementById('topbarControls');
  if(!controls){
   controls=document.createElement('div');
   controls.id='topbarControls';
   controls.className='topbar-controls';
   top.appendChild(controls);
  }
  const account=document.getElementById('accountTopBtn');
  const logout=document.getElementById('logoutTopBtn');
  const box=document.getElementById('site-language-control');
  if(account&&account.parentElement!==controls)controls.appendChild(account);
  if(logout&&logout.parentElement!==controls)controls.appendChild(logout);
  if(box&&box.parentElement!==controls)controls.appendChild(box);
 };
 flatten();
 organizeControls();
 const nav=document.querySelector('.main-nav');
 if(nav&&!nav.dataset.stableNavObserver){
  nav.dataset.stableNavObserver='1';
  new MutationObserver(()=>{if(!window.__CHEM_NAV_FINAL__&&nav.querySelector('.nav-group'))flatten()}).observe(nav,{childList:true,subtree:true});
 }
};
const init=()=>{load();stabilizeNavigation()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* Final shared header layout repair.
   Keep the three header regions independent so the nav can never clip its
   first/last link into the brand or account controls. */
(()=>{
 'use strict';
 const STYLE_ID='chemistry-final-header-layout';
 function install(){
   if(!document.getElementById(STYLE_ID)){
     const s=document.createElement('style');
     s.id=STYLE_ID;
     s.textContent=`
@media(min-width:761px){
  .topbar.topbar{
    display:grid!important;
    grid-template-columns:max-content minmax(0,1fr) max-content!important;
    align-items:center!important;
    gap:12px!important;
    width:100%!important;
    min-width:0!important;
    box-sizing:border-box!important;
    padding:10px max(18px,calc((100% - 1280px)/2))!important;
    overflow:visible!important;
  }
  .topbar.topbar>.brand{
    grid-column:1!important;
    order:unset!important;
    margin:0!important;
    min-width:0!important;
    flex:none!important;
    white-space:nowrap!important;
  }
  .topbar.topbar>.main-nav.main-nav{
    grid-column:2!important;
    order:unset!important;
    display:flex!important;
    align-items:center!important;
    justify-content:flex-start!important;
    width:100%!important;
    min-width:0!important;
    max-width:none!important;
    flex:none!important;
    flex-wrap:nowrap!important;
    gap:3px!important;
    overflow-x:auto!important;
    overflow-y:hidden!important;
    scrollbar-width:none!important;
    -webkit-overflow-scrolling:touch!important;
    white-space:nowrap!important;
  }
  .topbar.topbar>.main-nav.main-nav::-webkit-scrollbar{display:none!important}
  .topbar.topbar>.main-nav.main-nav>a{
    display:inline-flex!important;
    align-items:center!important;
    justify-content:center!important;
    flex:0 0 auto!important;
    min-width:max-content!important;
    width:auto!important;
    font-size:13px!important;
    line-height:1.2!important;
    padding:7px 8px!important;
    white-space:nowrap!important;
    box-sizing:border-box!important;
  }
  .topbar.topbar>.topbar-controls{
    grid-column:3!important;
    order:unset!important;
    display:flex!important;
    align-items:center!important;
    justify-content:flex-end!important;
    gap:6px!important;
    min-width:max-content!important;
    width:auto!important;
    flex:none!important;
    white-space:nowrap!important;
  }
  .topbar.topbar>.topbar-controls>*{
    flex:0 0 auto!important;
    min-width:0!important;
    margin:0!important;
  }
  .topbar.topbar>.topbar-controls #themeToggle{
    display:inline-flex!important;
    align-items:center!important;
    justify-content:center!important;
    min-height:36px!important;
    padding:7px 9px!important;
    white-space:nowrap!important;
  }
}
@media(max-width:1100px) and (min-width:761px){
  .topbar.topbar{gap:8px!important;padding-left:12px!important;padding-right:12px!important}
  .topbar.topbar>.main-nav.main-nav{gap:2px!important}
  .topbar.topbar>.main-nav.main-nav>a{font-size:12px!important;padding:6px 6px!important}
  .topbar.topbar>.topbar-controls{gap:3px!important}
  .topbar.topbar>.topbar-controls #themeToggle{font-size:11px!important;padding:6px!important}
}
@media(max-width:760px){
  .topbar.topbar{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:visible!important}
  .topbar.topbar>.topbar-controls{display:flex!important;align-items:center!important;min-width:max-content!important;flex:0 0 auto!important}
  .topbar.topbar>.topbar-controls>*{flex:0 0 auto!important}
  .topbar.topbar>.main-nav.main-nav>a{flex:0 0 auto!important;min-width:max-content!important}
}
`;
     document.head.appendChild(s);
   }
 }
 function organize(){
   const top=document.querySelector('.topbar');
   const controls=document.getElementById('topbarControls');
   if(!top||!controls)return;
   const theme=document.getElementById('themeToggle');
   if(theme&&theme.parentElement!==controls)controls.appendChild(theme);
 }
 function start(){
   install();
   organize();
   const top=document.querySelector('.topbar');
   if(top&&!top.dataset.finalHeaderObserver){
     top.dataset.finalHeaderObserver='1';
     new MutationObserver(organize).observe(top,{childList:true});
   }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();
