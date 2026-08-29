(()=>{
'use strict';
const box=document.getElementById('checkResult');
if(!box)return;
function moveCTA(){
 const bad=box.querySelector('.checker-status-bad'), correction=box.querySelector('.checker-correct');
 const old=box.querySelector('.checker-balance-cta');
 if(!bad||!correction){old?.remove();return}
 const eq=correction.querySelector('.checker-equation')?.textContent.replace(/\s+/g,' ').trim();
 if(!eq){old?.remove();return}
 if(old){const a=old.querySelector('a');if(a)a.href='index.html?equation='+encodeURIComponent(eq);return}
 const wrap=document.createElement('div');wrap.className='checker-balance-cta';wrap.innerHTML='<div class="checker-balance-cta-copy"><b>Need to balance it?</b><p>Open the Balancer with this equation ready to edit.</p></div><a class="primary checker-balance-button" href="index.html?equation='+encodeURIComponent(eq)+'">Balance this equation →</a>';
 correction.appendChild(wrap);
}
new MutationObserver(moveCTA).observe(box,{subtree:true,childList:true,characterData:true});
moveCTA();
})();
