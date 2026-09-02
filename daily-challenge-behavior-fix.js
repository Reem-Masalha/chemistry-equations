(()=>{
  'use strict';
  if(!location.pathname.endsWith('learn.html')) return;

  // Keep only the restored original #daily-v5 challenge on Learn.
  const removeRetiredDaily=()=>{
    const selectors=[
      '#daily-stable','#dailyChallengeCard','#daily-question-card','#daily-home-challenge',
      '#dhc','#dc5','#spEntry','#ce3-daily-card','#daily-clean','#daily-final',
      '#dc-final','#dc4','#dc3','#dc2','#dc6','#real-daily','.ce3-daily'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(el=>el.remove());

    // Some older cached Daily versions used generic wrappers with no Daily id/class.
    // Remove only containers that are genuinely visually empty. Never inspect/remove
    // anything inside the restored #daily-v5 challenge.
    const isVisible=el=>{
      if(!el) return false;
      const cs=getComputedStyle(el);
      if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0) return false;
      return !!(el.getClientRects&&el.getClientRects().length);
    };
    const hasVisibleContent=el=>{
      for(const node of el.children){
        if(node.matches('script,style,template,noscript')) continue;
        if(!isVisible(node)) continue;
        if((node.textContent||'').replace(/\s+/g,'').trim()) return true;
        if(node.matches('input,button,a,select,textarea,canvas,img,svg,iframe,video')) return true;
        if(hasVisibleContent(node)) return true;
      }
      return false;
    };
    const removeEmptyContainers=()=>{
      document.querySelectorAll('main section,main article,main div').forEach(el=>{
        if(el.id==='daily-v5' || el.closest('#daily-v5')) return;
        if((el.textContent||'').replace(/\s+/g,'').trim()) return;
        if(hasVisibleContent(el)) return;
        // Only remove elements that have no visible content at all. This catches
        // legacy blank rectangles even when their old wrapper had no recognizable id.
        el.remove();
      });
    };
    removeEmptyContainers();
  };

  const init=()=>{
    removeRetiredDaily();
    new MutationObserver(removeRetiredDaily).observe(document.body,{subtree:true,childList:true});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
