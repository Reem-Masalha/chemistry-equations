(()=>{
  'use strict';
  const out=document.getElementById('balanceResult');
  if(!out)return;
  const fix=()=>{
    const nodes=out.querySelectorAll('.balance-status');
    nodes.forEach(node=>{
      const text=(node.textContent||'').replace(/\s+/g,' ').trim();
      if(/Not balanced\s*→\s*✓\s*Balanced/i.test(text)||/✓\s*✗\s*Not balanced/i.test(text)){
        node.className='balance-status balance-status-bad';
        node.innerHTML='<b>✗ Not balanced</b>';
        const next=node.nextElementSibling;
        if(next && next.classList.contains('balance-status')){
          const nextText=(next.textContent||'').trim();
          if(/Balanced result/i.test(nextText)||/✓\s*Balanced/i.test(nextText)) return;
        }
        const ok=document.createElement('div');
        ok.className='balance-status balance-status-good';
        ok.innerHTML='<b>✓ Balanced result</b>';
        node.insertAdjacentElement('afterend',ok);
      }
    });
  };
  new MutationObserver(fix).observe(out,{subtree:true,childList:true,characterData:true});
  fix();
})();
