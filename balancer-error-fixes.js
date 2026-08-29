(()=>{
'use strict';
const out=document.getElementById('balanceResult');
if(!out)return;
function fix(){
  const text=out.textContent||'';
  if(text.includes('This reaction stage cannot be balanced with a positive whole-number ratio.')||text.includes('This reaction stage cannot be balanced with a non-zero whole-number ratio.')){
    out.querySelectorAll('p,div').forEach(el=>{
      const t=el.textContent||'';
      if(t.includes('This reaction stage cannot be balanced')) el.textContent='This equation could not be solved.';
    });
  }
}
new MutationObserver(fix).observe(out,{subtree:true,childList:true,characterData:true});
fix();
})();
