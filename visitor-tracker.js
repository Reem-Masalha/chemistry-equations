(()=>{
  'use strict';
  const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
  const KEY='chemistryVisitorId';
  const path=(location.pathname||'/').slice(0,200);
  const params=new URLSearchParams(location.search||'');

  // Never count the private admin page or obvious crawlers/previews as site visitors.
  const ua=(navigator.userAgent||'').toLowerCase();
  const bot=/bot|crawler|spider|slurp|bingpreview|facebookexternalhit|facebot|headless|lighthouse|pagespeed|prerender|uptimerobot|pingdom|semrush|ahrefs|yandex|baidu|duckduckgo/i.test(ua)||navigator.webdriver===true;
  if(path.endsWith('/admin.html')||path==='/admin.html'||bot)return;

  function get(k){try{return localStorage.getItem(k)}catch{return null}}
  function set(k,v){try{localStorage.setItem(k,v)}catch{}}
  function remove(k){try{localStorage.removeItem(k)}catch{}}

  // Admin replay/reset must happen before the Daily Challenge script initializes.
  if(params.has('adminReplay')||params.has('adminFresh')){
    const today=new Date().toISOString().slice(0,10);
    const prefixes=['chemistrydailyv6:','chemistrydaily','dailychallenge','dailystreak','dailyxp','daily-home-challenge','dailyhomechallenge','dhc','dc5','spentry','dailychallengecard','ce3-daily-card','real-daily'];
    try{
      const keys=[];
      for(let i=0;i<localStorage.length;i++){
        const k=localStorage.key(i);
        if(k&&prefixes.some(p=>k.toLowerCase().includes(p.toLowerCase())))keys.push(k);
      }
      keys.forEach(remove);
    }catch{}
    remove('chemistryDailyV6:'+today);
    try{history.replaceState({},document.title,location.pathname)}catch{}
  }

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
  if(!document.querySelector('script[data-daily-home-challenge]')){
    const s=document.createElement('script');
    s.src='daily-home-challenge.js?v=20260830-1';
    s.defer=true;
    s.dataset.dailyHomeChallenge='1';
    document.head.appendChild(s);
  }
})();
