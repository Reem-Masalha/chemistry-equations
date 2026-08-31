(()=>{
'use strict';
const isLearn=()=>((location.pathname.split('/').pop()||'')==='learn.html');
function removeLegacy(){
  if(!isLearn())return;
  document.getElementById('ce3-daily-card')?.remove();
  document.getElementById('daily-question-card')?.remove();
  document.getElementById('daily-home-challenge')?.remove();
  document.querySelectorAll('.ce3-daily').forEach(el=>el.remove());
  document.querySelectorAll('section,article,div').forEach(el=>{
    const t=(el.textContent||'').trim();
    if(t.length<900 && /^🔥?\s*DAILY CHALLENGE/i.test(t) && !el.closest('#daily-final') && !el.closest('#dc4')){
      (el.closest('section,article')||el).remove();
    }
  });
}
function init(){
  removeLegacy();
  const mo=new MutationObserver(removeLegacy);
  mo.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
