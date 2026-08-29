(()=>{
'use strict';
const box=document.getElementById('checkResult');
if(!box)return;
function getPlainCorrectEquation(){
  const eq=box.querySelector('.checker-equation');
  if(!eq)return '';
  return eq.textContent.replace(/\s+/g,' ').trim();
}
function moveCTA(){
  const bad=box.querySelector('.checker-status-bad');
  const correction=box.querySelector('.checker-correct');
  const old=box.querySelector('.checker-balance-cta');
  if(!bad||!correction){old?.remove();return}
  const eq=getPlainCorrectEquation();
  if(!eq){old?.remove();return}
  if(old){
    const link=old.querySelector('a');
    if(link)link.href='index.html?equation='+encodeURIComponent(eq);
    if(old.parentElement!==correction)correction.appendChild(old);
    return;
  }
  const wrap=document.createElement('div');
  wrap.className='checker-balance-cta';
  wrap.innerHTML='<div class="checker-balance-cta-copy"><b>Ready to balance it?</b><p>Open the Balancer with this equation already filled in.</p></div><a class="primary" href="index.html?equation='+encodeURIComponent(eq)+'">Balance this equation →</a>';
  correction.appendChild(wrap);
}
new MutationObserver(moveCTA).observe(box,{subtree:true,childList:true,characterData:true});
moveCTA();
})();
