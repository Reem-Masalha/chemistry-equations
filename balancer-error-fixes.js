(()=>{
'use strict';
const out=document.getElementById('balanceResult');
const input=document.getElementById('equationInput');
const balanceBtn=document.getElementById('balanceBtn');
if(!out)return;
const normalizeArrow=()=>{if(input&&input.value.includes('=>'))input.value=input.value.replace(/\s*=>\s*/g,' → ')};
// Capture-phase handler runs before balancer-live's normal click handler.
balanceBtn?.addEventListener('click',normalizeArrow,{capture:true});
input?.addEventListener('keydown',e=>{if(e.key==='Enter')normalizeArrow()},{capture:true});
function fix(){
  const text=out.textContent||'';
  if(text.includes('This reaction stage cannot be balanced with a positive whole-number ratio.')||text.includes('This reaction stage cannot be balanced with a non-zero whole-number ratio.')){
    out.querySelectorAll('p,div').forEach(el=>{
      const t=el.textContent||'';
      if(t.includes('This reaction stage cannot be balanced'))el.textContent='This equation could not be solved.';
    });
  }
}
new MutationObserver(fix).observe(out,{subtree:true,childList:true,characterData:true});
fix();
})();
