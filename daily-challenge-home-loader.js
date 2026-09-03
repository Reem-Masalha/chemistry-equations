(()=>{'use strict';
const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
if(page!=='index.html')return;
const load=(src)=>new Promise(resolve=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=resolve;s.async=false;document.head.appendChild(s)});
const run=async()=>{const original=location.pathname+location.search+location.hash;try{history.replaceState(history.state,'',location.pathname.replace(/index\.html$/i,'learn.html')+'?homeDaily=1');await load('daily-challenge-clean.js?v=20260903-home-1');await load('daily-challenge-runtime-guard.js?v=20260903-home-1');await load('daily-challenge-habit.js?v=20260903-home-1')}finally{history.replaceState(history.state,'',original)}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
