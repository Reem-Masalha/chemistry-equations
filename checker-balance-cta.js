(()=>{
'use strict';
const box=document.getElementById('checkResult');
if(!box)return;
function addCTA(){
  const bad=box.querySelector('.checker-status-bad');
  const existing=box.querySelector('.checker-balance-cta');
  if(!bad){ existing?.remove(); return; }
  if(existing)return;
  const wrap=document.createElement('div');
  wrap.className='checker-balance-cta';
  wrap.innerHTML='<div><b>Need the balanced equation?</b><p>Open the Balancer to get the correct coefficients.</p></div><a class="primary" href="index.html">Balance this equation →</a>';
  box.appendChild(wrap);
}
new MutationObserver(addCTA).observe(box,{subtree:true,childList:true,characterData:true});
addCTA();
})();
