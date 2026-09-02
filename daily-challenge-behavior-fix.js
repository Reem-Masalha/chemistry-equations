(()=>{
  'use strict';
  if(!location.pathname.endsWith('learn.html')) return;

  // Keep only the restored original #daily-v5 challenge on Learn.
  const removeRetiredDaily=()=>{
    const selectors=[
      '#daily-stable',
      '#dailyChallengeCard',
      '#daily-question-card',
      '#daily-home-challenge',
      '#dhc',
      '#dc5',
      '#spEntry',
      '#ce3-daily-card',
      '#daily-clean',
      '#daily-final',
      '.ce3-daily'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(el=>el.remove());
  };

  removeRetiredDaily();
  new MutationObserver(removeRetiredDaily).observe(document.documentElement,{subtree:true,childList:true});
})();
