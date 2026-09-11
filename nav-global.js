(()=>{
  'use strict';
  if(window.__CHEM_GLOBAL_NAV__) return;
  window.__CHEM_GLOBAL_NAV__=true;

  const style=document.createElement('style');
  style.id='chem-global-nav-style';
  style.textContent=`
    .topbar{
      display:grid!important;
      grid-template-columns:235px minmax(0,1fr) auto!important;
      align-items:center!important;
      column-gap:18px!important;
      width:100%!important;
      max-width:none!important;
      box-sizing:border-box!important;
      padding-left:max(18px,calc((100% - 1530px)/2))!important;
      padding-right:max(18px,calc((100% - 1530px)/2))!important;
      flex-wrap:unset!important;
    }
    .topbar>.brand{
      grid-column:1!important;
      min-width:0!important;
      width:auto!important;
      max-width:235px!important;
      margin:0!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      white-space:nowrap!important;
    }
    .topbar>.main-nav{
      grid-column:2!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      min-width:0!important;
      width:100%!important;
      max-width:none!important;
      overflow:visible!important;
      gap:5px!important;
      padding:0!important;
      flex:none!important;
    }
    .topbar>.main-nav a{
      flex:0 0 auto!important;
      min-width:0!important;
      white-space:nowrap!important;
      padding:9px 11px!important;
      font-size:14px!important;
    }
    .topbar>.account-top,
    .topbar>#accountTopBtn,
    .topbar>#logoutTopBtn,
    .topbar>.language-wrap,
    .topbar>.language-switcher,
    .topbar>#languageSelect{
      flex:0 0 auto!important;
      min-width:0!important;
      white-space:nowrap!important;
    }
    .topbar>#accountTopBtn{margin:0!important;max-width:180px!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .topbar>#logoutTopBtn{margin:0!important}

    @media(max-width:1240px){
      .topbar{
        grid-template-columns:minmax(0,1fr) auto!important;
        row-gap:7px!important;
      }
      .topbar>.brand{grid-column:1!important;grid-row:1!important;max-width:100%!important}
      .topbar>.main-nav{grid-column:1/-1!important;grid-row:2!important;justify-content:flex-start!important;overflow-x:auto!important;scrollbar-width:none!important}
      .topbar>.main-nav::-webkit-scrollbar{display:none}
      .topbar>.account-top,.topbar>#accountTopBtn,.topbar>#logoutTopBtn{grid-row:1!important}
      .topbar>.main-nav a{padding:8px 10px!important}
    }
    @media(max-width:760px){
      .topbar{
        grid-template-columns:minmax(0,1fr) auto!important;
        padding:8px 12px!important;
        column-gap:8px!important;
      }
      .topbar>.brand{font-size:16px!important;max-width:100%!important}
      .topbar>.main-nav{gap:4px!important}
      .topbar>.main-nav a{font-size:12px!important;padding:8px 9px!important}
      .topbar>#accountTopBtn{font-size:12px!important;max-width:42vw!important;padding:8px 9px!important}
      .topbar>#logoutTopBtn{font-size:12px!important;padding:8px 9px!important}
    }
    @media(max-width:390px){
      .topbar>.brand{font-size:15px!important}
      .topbar>.main-nav a{font-size:11px!important;padding:7px 8px!important}
      .topbar>#accountTopBtn,.topbar>#logoutTopBtn{font-size:11px!important;padding:7px 8px!important}
    }
  `;
  (document.head||document.documentElement).appendChild(style);
})();