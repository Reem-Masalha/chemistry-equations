(()=>{
'use strict';
if(!location.pathname.endsWith('learn.html'))return;
const removeLegacy=()=>{
  ['dailyChallengeCard','spEntry','daily-home-challenge','dhc','dc5','daily-clean','daily-final','ce3-daily-card','real-daily'].forEach(id=>document.getElementById(id)?.remove());
  document.querySelectorAll('.ce3-daily,[data-daily-challenge-v5]').forEach(el=>el.remove());
};
const placeStable=()=>{
  removeLegacy();
  const challenge=document.getElementById('daily-stable');
  const hero=document.querySelector('main .hero');
  if(challenge&&hero&&hero.nextElementSibling!==challenge)hero.insertAdjacentElement('afterend',challenge);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',placeStable,{once:true});else placeStable();
new MutationObserver(placeStable).observe(document.body,{childList:true,subtree:true});
setTimeout(placeStable,250);setTimeout(placeStable,1000);setTimeout(placeStable,2500);
})();
