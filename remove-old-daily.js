(()=>{'use strict';
const OLD_IDS=['ce3-daily-card','daily-question-card','daily-home-challenge','dhc','dc5','spEntry'];
const OLD_CLASSES=['ce3-daily'];
const oldText=/Can you balance this\?|Try it in the Balancer|Start easy practice|Start today.?s challenge/i;
function removeOldDaily(){
  OLD_IDS.forEach(id=>document.getElementById(id)?.remove());
  document.querySelectorAll(OLD_CLASSES.map(c=>'.'+c).join(',')).forEach(el=>el.remove());
  document.querySelectorAll('section,article,div').forEach(el=>{
    if(el.id==='real-daily'||el.closest('#real-daily'))return;
    const text=(el.textContent||'').trim();
    if(text&&oldText.test(text)&&text.length<900){
      const card=el.closest('section,article')||el;
      if(card.id!=='real-daily'&&!card.closest('#real-daily'))card.remove();
    }
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{removeOldDaily();setTimeout(removeOldDaily,250);}, {once:true});else{removeOldDaily();setTimeout(removeOldDaily,250)}
})();
