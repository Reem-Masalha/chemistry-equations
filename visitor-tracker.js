(()=>{
  'use strict';
  const PUBLIC_ANALYTICS_LIVE=true;
  if(!PUBLIC_ANALYTICS_LIVE)return;
  const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
  const KEY='chemistryVisitorId';
  const path=(location.pathname||'/').slice(0,200);
  const params=new URLSearchParams(location.search||'');
  const ua=(navigator.userAgent||'').toLowerCase();
  const bot=/bot|crawler|spider|slurp|bingpreview|facebookexternalhit|facebot|headless|lighthouse|pagespeed|prerender|uptimerobot|pingdom|semrush|ahrefs|yandex|baidu|duckduckgo|google-inspectiontool|googleother/i.test(ua)||navigator.webdriver===true;
  if(path.endsWith('/admin.html')||path==='/admin.html'||bot)return;
  const get=k=>{try{return localStorage.getItem(k)}catch{return null}};
  const set=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
  if(get('chemistryOwnerAnalyticsIgnore')==='1')return;
  if(params.has('adminReplay')||params.has('adminFresh')){
    const prefixes=['chemistrydailyv6:','chemistrydaily','chemistrydailyfinal:','dailychallenge','dailystreak','dailyxp','daily-home-challenge','dailyhomechallenge','dhc','dc5','spentry','dailychallengecard','ce3-daily-card','real-daily'];
    try{const keys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&prefixes.some(p=>k.toLowerCase().includes(p.toLowerCase())))keys.push(k)}keys.forEach(k=>localStorage.removeItem(k))}catch{}
    try{sessionStorage.setItem('chemistryAdminReplayRequested','1')}catch{}
    try{history.replaceState({},document.title,location.pathname)}catch{}
  }
  const browserVerified=()=>document.visibilityState==='visible'&&navigator.webdriver!==true&&Boolean(navigator.userAgent&&navigator.userAgent.length>=20)&&Boolean(navigator.language||navigator.languages?.length)&&navigator.cookieEnabled&&Boolean(window.screen&&screen.width>=200&&screen.height>=200)&&Boolean(window.innerWidth&&window.innerHeight);
  let visitorId=get(KEY);
  if(!visitorId){visitorId=crypto.randomUUID?crypto.randomUUID():(Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));set(KEY,visitorId)}
  const user=(()=>{try{return JSON.parse(get('chemistryCurrentUser')||sessionStorage.getItem('chemistryCurrentUser')||'null')}catch{return null}})();
  const identity=user?.id?'account:'+String(user.id):'anonymous:'+visitorId;
  const post=(url,body)=>{try{fetch(API+url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),keepalive:true}).catch(()=>{})}catch{}};
  const browserSignal={visible:document.visibilityState==='visible',webdriver:navigator.webdriver===true,language:Boolean(navigator.language||navigator.languages?.length),cookies:Boolean(navigator.cookieEnabled),screen:Boolean(window.screen&&screen.width>=200&&screen.height>=200),viewport:Boolean(window.innerWidth&&window.innerHeight)};
  const sendVisit=()=>{if(!browserVerified())return;post('/api/track-visit',{visitorId:identity,path,userId:user?.id||null,ownerTest:get('chemistryOwnerAnalyticsIgnore')==='1',browserSignal})};
  const visitKey='chemistryTracked:'+location.pathname;
  let first=false;try{first=sessionStorage.getItem(visitKey)!=='1';if(first)sessionStorage.setItem(visitKey,'1')}catch{first=true}
  if(first)sendVisit();
  if(user?.id){let heartbeats=0;const heartbeat=()=>{if(!browserVerified()||heartbeats>=10)return;heartbeats++;sendVisit();post('/api/track-event',{visitorId:identity,userId:String(user.id),eventType:'heartbeat',feature:null,metadata:{path},ownerTest:get('chemistryOwnerAnalyticsIgnore')==='1',browserVerified:true})};heartbeat();const timer=setInterval(()=>{if(heartbeats>=10){clearInterval(timer);return}heartbeat()},60000)}
})();
