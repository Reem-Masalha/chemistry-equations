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

    // Remove any empty legacy Daily container, but never touch the restored quiz.
    document.querySelectorAll('section,article,div').forEach(el=>{
      if(el.id==='daily-v5' || el.closest('#daily-v5')) return;
      const id=String(el.id||'').toLowerCase();
      const cls=String(el.className||'').toLowerCase();
      if((id.includes('daily') || cls.includes('daily')) && !(el.textContent||'').trim()) el.remove();
    });
  };

  const init=()=>{
    removeRetiredDaily();
    new MutationObserver(removeRetiredDaily).observe(document.body,{subtree:true,childList:true});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
