(()=>{
  'use strict';
  if(!location.pathname.endsWith('learn.html')) return;

  const legacySelectors=[
    '#daily-stable','#dailyChallengeCard','#daily-question-card','#daily-home-challenge',
    '#dhc','#dc5','#spEntry','#ce3-daily-card','#daily-clean','#daily-final',
    '#dc-final','#dc4','#dc3','#dc2','#dc6','#real-daily','.ce3-daily'
  ];

  const isVisible=el=>{
    if(!el) return false;
    const cs=getComputedStyle(el);
    if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0) return false;
    return !!(el.getClientRects&&el.getClientRects().length);
  };

  // Look only at content that is actually visible. Hidden legacy text/controls must
  // not prevent their empty wrapper from being removed.
  const hasVisibleContent=el=>{
    for(const node of el.children){
      if(node.matches('script,style,template,noscript')) continue;
      if(!isVisible(node)) continue;
      if(node.matches('input,button,a,select,textarea,canvas,img,svg,iframe,video')) return true;
      const text=(node.childElementCount===0 ? node.textContent : '').replace(/\s+/g,'').trim();
      if(text) return true;
      if(hasVisibleContent(node)) return true;
    }
    return false;
  };

  const removeRetiredDaily=()=>{
    // Remove the specifically identified retired Daily implementations first.
    document.querySelectorAll(legacySelectors.join(',')).forEach(el=>{
      if(el.id==='daily-v5'||el.closest('#daily-v5')) return;
      el.remove();
    });

    // Remove generic wrappers only when they are genuinely visually empty.
    // Never inspect or remove anything inside the restored #daily-v5 challenge.
    document.querySelectorAll('main section,main article,main div').forEach(el=>{
      if(el.id==='daily-v5'||el.closest('#daily-v5')) return;
      if(!isVisible(el)) return;
      if(hasVisibleContent(el)) return;

      const rect=el.getBoundingClientRect();
      // A visible container with no visible content is the legacy blank rectangle.
      if(rect.width>0 && rect.height>0) el.remove();
    });
  };

  const init=()=>{
    removeRetiredDaily();
    new MutationObserver(removeRetiredDaily).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
