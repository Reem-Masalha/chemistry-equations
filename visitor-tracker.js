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

  // The shared theme script used to call render('') during initialization, which
  // opened Quick Access on every page load. Keep it closed unless the user actually
  // interacts with the search field.
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

  const buildNavigation=()=>{
    const n=document.querySelector('.main-nav');
    if(!n)return;
    const links=[...n.querySelectorAll('a')];
    const by=(name)=>links.find(a=>(a.getAttribute('href')||'').split(/[?#]/)[0].split('/').pop()===name);
    const learn=by('learn.html'),quiz=by('personal-quiz.html'),challenges=by('challenges.html'),balancer=by('index.html'),checker=by('checker.html');
    // theme.js normally creates these groups. If an older cached theme is running,
    // create the same hierarchy here so every page gets the requested navigation.
    if(!n.querySelector('.nav-group')&&(quiz||challenges||balancer||checker)){
      const lang=(document.documentElement.lang||'en').toLowerCase();
      const title=(en,ar,he)=>lang==='ar'?ar:lang==='he'?he:en;
      const group=(label,items)=>{
        const g=document.createElement('div');g.className='nav-group';
        const b=document.createElement('button');b.type='button';b.className='nav-group-button';b.innerHTML='<span>'+label+'</span><span class="nav-chevron" aria-hidden="true">⌄</span>';b.setAttribute('aria-haspopup','true');b.setAttribute('aria-expanded','false');
        const m=document.createElement('div');m.className='nav-group-menu';items.filter(Boolean).forEach(a=>m.appendChild(a));
        g.append(b,m);b.addEventListener('click',e=>{e.stopPropagation();const open=g.classList.toggle('open');b.setAttribute('aria-expanded',String(open))});
        return g;
      };
      n.innerHTML='';
      if(learn)n.appendChild(learn);
      if(quiz||challenges)n.appendChild(group(title('Practice','تدريب','תרגול'),[quiz,challenges]));
      if(balancer||checker)n.appendChild(group(title('Tools','أدوات','כלים'),[balancer,checker]));
    }
    if(!n.dataset.globalNavCloseBound){
      n.dataset.globalNavCloseBound='1';
      document.addEventListener('click',e=>{
        n.querySelectorAll('.nav-group.open').forEach(g=>{if(!g.contains(e.target)){g.classList.remove('open');g.querySelector('.nav-group-button')?.setAttribute('aria-expanded','false')}});
      });
    }
  };

  const fixUI=()=>{
    closeSearch();
    buildNavigation();
    const n=document.querySelector('.main-nav');
    const s=document.getElementById('globalUiGuardStyle')||document.createElement('style');
    s.id='globalUiGuardStyle';
    s.textContent=`
      #siteSearchResults:not(.open){display:none!important}
      .topbar{min-width:0!important;flex-wrap:nowrap!important;gap:12px!important}
      .topbar .brand{flex:0 0 auto!important;min-width:0!important;margin-right:auto!important;white-space:nowrap!important}
      .topbar .main-nav{display:flex!important;align-items:center!important;flex:0 1 auto!important;flex-wrap:nowrap!important;white-space:nowrap!important;min-width:0!important;width:auto!important;gap:2px!important;overflow:visible!important}
      .topbar .main-nav>a,.topbar .main-nav>.nav-group{flex:0 0 auto!important;min-width:0!important;white-space:nowrap!important}
      .topbar .main-nav>a{font-size:13px!important;padding:7px 8px!important}
      .topbar .main-nav>.nav-group-button{font-size:13px!important;padding:7px 8px!important;white-space:nowrap!important}
      .topbar .account-top{flex:0 0 auto!important;font-size:13px!important;padding:7px 10px!important;white-space:nowrap!important}
      .topbar .main-nav>.nav-group{position:relative!important;overflow:visible!important}
      .topbar .main-nav>.nav-group-menu{z-index:100000!important}
      @media(max-width:760px){
        .topbar{gap:6px!important}
        .topbar .brand{font-size:15px!important;margin-right:0!important}
        .topbar .main-nav{flex:1 1 auto!important;min-width:0!important;overflow-x:auto!important;overflow-y:visible!important;scrollbar-width:none!important;-webkit-overflow-scrolling:touch!important}
        .topbar .main-nav::-webkit-scrollbar{display:none}
        .topbar .main-nav>a,.topbar .main-nav>.nav-group{flex:0 0 auto!important}
        .topbar .main-nav>a,.topbar .main-nav>.nav-group-button{font-size:10px!important;padding:6px 6px!important}
        .topbar .account-top{font-size:10px!important;padding:6px 7px!important}
      }
    `;
    if(!s.parentNode)document.head.appendChild(s);
    if(n)n.style.flexWrap='nowrap';
  };
  protectSearch();
  fixUI();
  setTimeout(fixUI,0);
})();
