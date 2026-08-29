(()=>{
'use strict';
const box=document.getElementById('checkResult');
if(!box)return;
function update(){
  const c=box.querySelector('.checker-correct');
  if(!c)return;
  const old=c.querySelector('.checker-balance-cta');
  const eq=c.querySelector('.checker-equation');
  if(!eq){old?.remove();return;}
  const plain=eq.textContent.replace(/\s+/g,' ').trim();
  if(old){
    old.innerHTML='<div class="checker-balance-cta-copy"><b>Need the balanced equation?</b><small>Open the Balancer to calculate the correct coefficients and see the solution.</small></div><a class="primary checker-balance-button" href="index.html?equation='+encodeURIComponent(plain)+'">Open Balancer →</a>';
    return;
  }
  const wrap=document.createElement('div');
  wrap.className='checker-balance-cta';
  wrap.innerHTML='<div class="checker-balance-cta-copy"><b>Need the balanced equation?</b><small>Open the Balancer to calculate the correct coefficients and see the solution.</small></div><a class="primary checker-balance-button" href="index.html?equation='+encodeURIComponent(plain)+'">Open Balancer →</a>';
  c.appendChild(wrap);
}
new MutationObserver(update).observe(box,{subtree:true,childList:true,characterData:true});
update();
})();
