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

  // Keep the requested simple Learn / Quiz / Challenges / Balancer / Checker navigation.
  // Header positioning is handled centrally by language-clean.js so every page uses one layout.
  const restorePlainNavigation=()=>{
    const n=document.querySelector('.main-nav');
    if(!n)return;
    const restored=[];
    n.querySelectorAll('.nav-group').forEach(g=>{
      g.querySelectorAll('.nav-group-menu a').forEach(a=>restored.push(a));
      g.remove();
    });
    restored.forEach(a=>n.appendChild(a));
    n.querySelectorAll('a').forEach(a=>{
      a.style.flex='0 0 auto';
      a.style.whiteSpace='nowrap';
    });
  };

  const fixUI=()=>{
    closeSearch();
    restorePlainNavigation();
  };

  protectSearch();
  fixUI();
  setTimeout(fixUI,0);
  setTimeout(fixUI,250);
  addEventListener('chemistryLanguageChanged',()=>{setTimeout(fixUI,0);setTimeout(fixUI,80);setTimeout(fixUI,250)});
})();
