(()=>{
  'use strict';
  const out=document.getElementById('balanceResult');
  if(!out)return;
  const clean=()=>{
    out.querySelectorAll('.balance-status').forEach(node=>{
      const text=(node.textContent||'').replace(/\s+/g,' ').trim();
      if(text.includes('Not balanced')&&text.includes('Balanced')) node.remove();
    });
  };
  new MutationObserver(clean).observe(out,{subtree:true,childList:true,characterData:true});
  clean();
})();
