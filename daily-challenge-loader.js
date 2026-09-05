(()=>{'use strict';
const load=(src)=>new Promise(resolve=>{const s=document.createElement('script');s.src=src;s.async=true;s.onload=resolve;s.onerror=resolve;document.head.appendChild(s)});
const run=async()=>{await load('daily-challenge-clean.js?v=20260905-lazy-1');await load('daily-challenge-habit.js?v=20260905-lazy-1');await load('daily-challenge-polish.js?v=20260905-lazy-1')};
const schedule=()=>{if(window.requestIdleCallback)requestIdleCallback(run,{timeout:2500});else setTimeout(run,1500)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
