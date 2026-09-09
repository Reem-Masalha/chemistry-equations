(()=>{
  'use strict';
  const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
  const KEY='chemistryVisitorId';
  const path=(location.pathname||'/').slice(0,200);
  function get(k){try{return localStorage.getItem(k)}catch{return null}}
  function set(k,v){try{localStorage.setItem(k,v)}catch{}}
  let visitorId=get(KEY);if(!visitorId){visitorId=(crypto.randomUUID?crypto.randomUUID():(Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)));set(KEY,visitorId)}
  const user=(()=>{try{return JSON.parse(get('chemistryCurrentUser')||sessionStorage.getItem('chemistryCurrentUser')||'null')}catch{return null}})();
  const identity=user?.id?'account:'+String(user.id):'anonymous:'+visitorId;
  const post=(url,body)=>{try{fetch(API+url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),keepalive:true}).catch(()=>{})}catch{}};
  const sendVisit=()=>post('/api/track-visit',{visitorId:identity,path,userId:user?.id||null});
  const visitKey='chemistryTracked:'+location.pathname;
  let first=false;try{first=sessionStorage.getItem(visitKey)!=='1';if(first)sessionStorage.setItem(visitKey,'1')}catch{first=true}
  if(first)sendVisit();
  if(user?.id){
    const heartbeat=()=>{sendVisit();post('/api/track-event',{visitorId:identity,userId:String(user.id),eventType:'heartbeat',feature:null,metadata:{path}})};
    heartbeat();
    setInterval(heartbeat,60000);
  }
  // Keep search closed on load and keep the redesigned navigation visible in one row.
  const fixUI=()=>{
    const r=document.getElementById('siteSearchResults');
    if(r)r.classList.remove('open');
    const n=document.querySelector('.main-nav');
    if(!n)return;
    const s=document.getElementById('globalUiGuardStyle')||document.createElement('style');
    s.id='globalUiGuardStyle';
    s.textContent=`
      #siteSearchResults:not(.open){display:none!important}
      .topbar{min-width:0!important;flex-wrap:nowrap!important}
      .topbar .brand{flex:0 1 auto!important;min-width:0!important;margin-right:0!important;white-space:nowrap!important}
      .topbar .main-nav{display:flex!important;align-items:center!important;flex:0 1 auto!important;flex-wrap:nowrap!important;white-space:nowrap!important;min-width:0!important;width:auto!important;gap:1px!important;overflow:visible!important}
      .topbar .main-nav>a,.topbar .main-nav>.nav-group{flex:0 1 auto!important;min-width:0!important;white-space:nowrap!important}
      .topbar .main-nav>a{font-size:12px!important;padding:6px 6px!important}
      .topbar .main-nav>.nav-group-button{font-size:12px!important;padding:6px 6px!important;white-space:nowrap!important}
      .topbar .account-top{flex:0 0 auto!important;font-size:12px!important;padding:7px 9px!important;white-space:nowrap!important}
      @media(max-width:760px){
        .topbar{gap:6px!important}
        .topbar .brand{font-size:15px!important}
        .topbar .main-nav{flex:1 1 auto!important;min-width:0!important;overflow-x:auto!important;overflow-y:visible!important;scrollbar-width:none!important;-webkit-overflow-scrolling:touch!important}
        .topbar .main-nav::-webkit-scrollbar{display:none}
        .topbar .main-nav>a,.topbar .main-nav>.nav-group{flex:0 0 auto!important}
        .topbar .main-nav>a,.topbar .main-nav>.nav-group-button{font-size:10px!important;padding:6px 6px!important}
      }
    `;
    if(!s.parentNode)document.head.appendChild(s);
  };
  fixUI();
  setTimeout(fixUI,0);
})();
