(()=>{
'use strict';
const out=document.getElementById('balanceResult');
if(!out)return;
function normalizeErrors(){
  const text=out.textContent||'';
  if(!text)return;
  out.querySelectorAll('p,div').forEach(el=>{
    const t=(el.textContent||'').trim();
    if(/This reaction stage cannot be balanced with a (?:positive|non-zero) whole-number ratio\.?/i.test(t)){
      el.textContent='This equation could not be solved.';
    }
    if(/Could not balance this equation\.?/i.test(t) && !t.includes('This equation could not be solved.')){
      el.innerHTML='<b>This equation could not be solved.</b>';
    }
  });
}
new MutationObserver(normalizeErrors).observe(out,{subtree:true,childList:true,characterData:true});
normalizeErrors();
})();
