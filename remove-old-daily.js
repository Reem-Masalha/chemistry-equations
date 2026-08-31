(()=>{'use strict';
const OLD_IDS=['ce3-daily-card','daily-question-card','daily-home-challenge','dhc','dc5','spEntry'];
const OLD_CLASSES=['ce3-daily'];
const oldText=/Can you balance this\?|Try it in the Balancer|Start easy practice|Start today.?s challenge/i;
function removeOldDaily(root=document){
  OLD_IDS.forEach(id=>root.getElementById?.(id)?.remove());
  if(root.querySelectorAll){
    root.querySelectorAll(OLD_CLASSES.map(c=>'.'+c).join(',')).forEach(el=>el.remove());
    root.querySelectorAll('section,article,div').forEach(el=>{
      if(el.id==='daily-final'||el.closest?.('#daily-final'))return;
      if(el.id==='dc4'||el.closest?.('#dc4'))return;
      const text=(el.textContent||'').trim();
      if(text&&oldText.test(text)&&text.length<1000){
        const card=el.closest?.('section,article')||el;
        if(card.id!=='daily-final'&&card.id!=='dc4'&&!card.closest?.('#daily-final')&&!card.closest?.('#dc4'))card.remove();
      }
    });
  }
}
function init(){
  removeOldDaily(document);
  const observer=new MutationObserver(()=>removeOldDaily(document));
  observer.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
