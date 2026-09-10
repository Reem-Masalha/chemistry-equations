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
    .main-nav{display:flex!important;align-items:center!important;gap:7px!important;white-space:nowrap!important;flex-wrap:nowrap!important;direction:ltr!important}
    .main-nav .nav-group{display:contents!important}
    .main-nav .nav-group-button{display:none!important}
    .main-nav .nav-group-menu{display:contents!important;position:static!important;transform:none!important;min-width:0!important;padding:0!important;border:0!important;box-shadow:none!important;background:transparent!important}
    .main-nav .nav-group-menu a{display:inline-flex!important;width:auto!important;flex:0 0 auto!important;padding:9px 12px!important;white-space:nowrap!important;border-radius:10px!important}
    @media(min-width:761px){
      .topbar{display:grid!important;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)!important;align-items:center!important;gap:18px!important}
      .topbar .brand{margin-right:0!important;justify-self:start!important}
      .topbar .main-nav{justify-self:center!important;min-width:max-content!important}
      .topbar .account-top{justify-self:end!important;white-space:nowrap!important}
    }
    @media(max-width:760px){
      .topbar{display:flex!important;flex-wrap:wrap!important}
      .main-nav{order:3!important;width:100%!important;overflow-x:auto!important;justify-content:flex-start!important}
      .main-nav .nav-group-menu a{font-size:12px!important;padding:8px 9px!important}
    }
  `;
  document.head.appendChild(st);
 }
 const flatten=()=>{
  document.querySelectorAll('.main-nav .nav-group').forEach(group=>{
   const menu=group.querySelector('.nav-group-menu');
   if(menu){[...menu.children].forEach(a=>document.querySelector('.main-nav')?.appendChild(a));}
   group.remove();
  });
  document.querySelector('.main-nav')?.querySelectorAll('a').forEach(a=>{a.style.whiteSpace='nowrap';a.style.flex='0 0 auto'});
 };
 flatten();
 const nav=document.querySelector('.main-nav');
 if(nav&&!nav.dataset.stableNavObserver){
  nav.dataset.stableNavObserver='1';
  new MutationObserver(()=>{if(nav.querySelector('.nav-group'))flatten()}).observe(nav,{childList:true,subtree:true});
 }
};
const init=()=>{load();stabilizeNavigation()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();