(()=>{'use strict';
function init(){
 const replay=document.getElementById('adminReplayDaily'),fresh=document.getElementById('adminFreshDaily'),progress=document.getElementById('adminClearProgress'),msg=document.getElementById('adminToolMsg');
 if(!replay&&!fresh&&!progress)return;
 const reset=(prefixes)=>{let n=0;try{const keys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&prefixes.some(p=>k.toLowerCase().includes(p)))keys.push(k)}keys.forEach(k=>{localStorage.removeItem(k);n++})}catch{}return n};
 const dailyPrefixes=['chemistrydailyv6:','chemistrydailyfinal:','chemistrydaily','dailychallenge','dailystreak','dailyxp','daily-home-challenge','dailyhomechallenge','dhc','dc5','spentry','dailychallengecard','ce3-daily-card','real-daily'];
 const progressPrefixes=['chemistrystudentproduct','chemistryprogress','chemistrystats','chemistryxp','chemistrystreak'];
 const go=()=>{const n=reset(dailyPrefixes);try{sessionStorage.setItem('chemistryAdminReplayRequested','1')}catch{}if(msg)msg.textContent='Reset '+n+' challenge entries. Opening Learn…';location.href='learn.html?adminReplay='+Date.now()};
 if(replay)replay.onclick=go;if(fresh)fresh.onclick=go;if(progress)progress.onclick=()=>{const n=reset(progressPrefixes);if(msg)msg.textContent='Cleared '+n+' progress entries on this browser.'};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();