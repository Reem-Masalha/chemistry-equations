(()=>{
  'use strict';
  // Public analytics are enabled. Owner/test traffic and obvious bots are excluded.
  const PUBLIC_ANALYTICS_LIVE=true;
  if(!PUBLIC_ANALYTICS_LIVE)return;
  const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
  const KEY='chemistryVisitorId';
  const path=(location.pathname||'/').slice(0,200);
  const params=new URLSearchParams(location.search||'');
  const ua=(navigator.userAgent||'').toLowerCase();
  const bot=/bot|crawler|spider|slurp|bingpreview|facebookexternalhit|facebot|headless|lighthouse|pagespeed|prerender|uptimerobot|pingdom|semrush|ahrefs|yandex|baidu|duckduckgo|google-inspectiontool|googleother/i.test(ua)||navigator.webdriver===true;
  if(path.endsWith('/admin.html')||path==='/admin.html'||bot)return;
  function get(k){try{return localStorage.getItem(k)}catch{return null}}
  function set(k,v){try{localStorage.setItem(k,v)}catch{}}
  function remove(k){try{localStorage.removeItem(k)}catch{}}
  if(get('chemistryOwnerAnalyticsIgnore')==='1')return;
  if(params.has('adminReplay')||params.has('adminFresh')){
    const prefixes=['chemistrydailyv6:','chemistrydaily','chemistrydailyfinal:','dailychallenge','dailystreak','dailyxp','daily-home-challenge','dailyhomechallenge','dhc','dc5','spentry','dailychallengecard','ce3-daily-card','real-daily'];
    try{const keys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&prefixes.some(p=>k.toLowerCase().includes(p.toLowerCase())))keys.push(k)}keys.forEach(remove)}catch{}
    try{sessionStorage.setItem('chemistryAdminReplayRequested','1')}catch{}
    try{history.replaceState({},document.title,location.pathname)}catch{}
  }
  function cleanBalancerExtras(){
    const isBalancer=path==='/'||path==='/index.html'||path.endsWith('/index.html');
    if(!isBalancer)return;
    const ids=['spEntry','dailyChallengeCard','daily-home-challenge','dhc','dc5','daily-clean','daily-final','ce3-daily-card','real-daily'];
    ids.forEach(id=>{try{document.getElementById(id)?.remove()}catch{}});
    try{
      document.querySelectorAll('section,article,div').forEach(el=>{
        if(!el||el.closest?.('#balancerMain'))return;
        const t=(el.textContent||'').trim();
        if(t&&t.length<1200&&(/Can you balance this\?|Try it in the Balancer|Start easy practice|DAILY CHALLENGE|Daily Challenge|Can you balance these\?/i.test(t))){
          const keep=el.id&&['app','main','content'].includes(el.id);
          if(!keep&&el.closest?.('main'))el.remove();
        }
      });
    }catch{}
  }
  function startBalancerGuard(){
    cleanBalancerExtras();
    const mo=new MutationObserver(()=>cleanBalancerExtras());
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }
  if(path==='/'||path==='/index.html'||path.endsWith('/index.html')){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startBalancerGuard,{once:true});else startBalancerGuard();
  }
  let visitorId=get(KEY);if(!visitorId){visitorId=(crypto.randomUUID?crypto.randomUUID():(Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)));set(KEY,visitorId)}
  const user=(()=>{try{return JSON.parse(get('chemistryCurrentUser')||sessionStorage.getItem('chemistryCurrentUser')||'null')}catch{return null}})();
  const identity=user?.id?'account:'+String(user.id):'anonymous:'+visitorId;
  const post=(url,body)=>{try{fetch(API+url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),keepalive:true}).catch(()=>{})}catch{}};
  const sendVisit=()=>post('/api/track-visit',{visitorId:identity,path,userId:user?.id||null,ownerTest:get('chemistryOwnerAnalyticsIgnore')==='1'});
  const visitKey='chemistryTracked:'+location.pathname;
  let first=false;try{first=sessionStorage.getItem(visitKey)!=='1';if(first)sessionStorage.setItem(visitKey,'1')}catch{first=true}
  if(first)sendVisit();
  if(user?.id){const heartbeat=()=>{sendVisit();post('/api/track-event',{visitorId:identity,userId:String(user.id),eventType:'heartbeat',feature:null,metadata:{path},ownerTest:get('chemistryOwnerAnalyticsIgnore')==='1'})};heartbeat();setInterval(heartbeat,60000)}
})();
