(()=>{
'use strict';
// Compatibility loader for older cached Learn pages.
// Do not add a second quiz controller; the stable controller owns all Daily Challenge behavior.
if(!location.pathname.endsWith('learn.html'))return;
if(window.__dailyStableLoader)return;
window.__dailyStableLoader=true;
const load=()=>{
  if(window.__dailyStableLoaded)return;
  const s=document.createElement('script');
  s.src='daily-challenge-stable.js?v=compat-20260902';
  s.defer=true;
  document.head.appendChild(s);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
