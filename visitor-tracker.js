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

  const closeSearch=()=>{const r=document.getElementById('siteSearchResults');if(r)r.classList.remove('open')};

  // Keep search results closed until the user interacts with the search field.
  const protectSearch=()=>{
    let userSearchIntent=false;
    const markIntent=()=>{userSearchIntent=true;setTimeout(()=>{userSearchIntent=false},1200)};
    document.addEventListener('focusin',e=>{if(e.target.closest?.('#siteSearchBar'))markIntent()},true);
    document.addEventListener('pointerdown',e=>{if(e.target.closest?.('#siteSearchBar'))markIntent();else closeSearch()},true);
    const watch=()=>{
      const r=document.getElementById('siteSearchResults');
      if(!r)return false;
      if(!r.dataset.searchGuardBound){
        r.dataset.searchGuardBound='1';
        new MutationObserver(()=>{if(r.classList.contains('open')&&!userSearchIntent)r.classList.remove('open')}).observe(r,{attributes:true,attributeFilter:['class']});
      }
      if(!userSearchIntent)r.classList.remove('open');
      return true;
    };
    watch();
    const mo=new MutationObserver(watch);
    mo.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>mo.disconnect(),5000);
  };

  // Restore the original simple navigation: Learn | Quiz | Challenges | Balancer | Checker.
  // The current theme script may build dropdown groups, so unwrap those groups back into
  // the original direct links. This also runs after language changes.
  const restorePlainNavigation=()=>{
    const n=document.querySelector('.main-nav');
    if(!n)return;
    const restored=[];
    n.querySelectorAll('.nav-group').forEach(g=>{
      g.querySelectorAll('.nav-group-menu a').forEach(a=>restored.push(a));
      g.remove();
    });
    restored.forEach(a=>n.appendChild(a));
    n.style.flexWrap='nowrap';
    n.style.overflowX='auto';
    n.style.overflowY='hidden';
    n.querySelectorAll('a').forEach(a=>{
      a.style.flex='0 0 auto';
      a.style.whiteSpace='nowrap';
    });
  };

  const fixUI=()=>{
    closeSearch();
    restorePlainNavigation();
    const n=document.querySelector('.main-nav');
    const s=document.getElementById('globalUiGuardStyle')||document.createElement('style');
    s.id='globalUiGuardStyle';
    s.textContent=`
      #siteSearchResults:not(.open){display:none!important}
      .topbar{min-width:0!important;flex-wrap:nowrap!important;gap:12px!important}
      .topbar .brand{flex:0 0 auto!important;min-width:0!important;margin-right:auto!important;white-space:nowrap!important}
      .topbar .main-nav{display:flex!important;align-items:center!important;flex:0 1 auto!important;flex-wrap:nowrap!important;white-space:nowrap!important;min-width:0!important;width:auto!important;gap:2px!important;overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none!important;-webkit-overflow-scrolling:touch!important}
      .topbar .main-nav::-webkit-scrollbar{display:none}
      .topbar .main-nav>a{flex:0 0 auto!important;min-width:0!important;white-space:nowrap!important;font-size:13px!important;padding:7px 8px!important}
      .topbar .account-top{flex:0 0 auto!important;font-size:13px!important;padding:7px 10px!important;white-space:nowrap!important}
      .topbar .main-nav>.nav-group{display:none!important}
      @media(max-width:760px){
        .topbar{gap:6px!important}
        .topbar .brand{font-size:15px!important;margin-right:0!important}
        .topbar .main-nav{flex:1 1 auto!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important}
        .topbar .main-nav>a{font-size:10px!important;padding:6px 6px!important}
        .topbar .account-top{font-size:10px!important;padding:6px 7px!important}
      }
    `;
    if(!s.parentNode)document.head.appendChild(s);
    if(n)n.style.flexWrap='nowrap';
  };

  protectSearch();
  fixUI();
  setTimeout(fixUI,0);
  addEventListener('chemistryLanguageChanged',()=>{setTimeout(fixUI,0);setTimeout(fixUI,80)});
})();
