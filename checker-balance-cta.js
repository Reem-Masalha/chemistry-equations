(()=>{
'use strict';
const box=document.getElementById('checkResult');
const input=document.getElementById('checkInput');
if(!box)return;
function fixInvalid(){
 const s=box.querySelector('.checker-status-error');
 if(!s)return;
 const small=s.querySelector('small');
 if(!small)return;
 const t=small.textContent||'';
 if(t.includes('Invalid chemical formula')&&!s.querySelector('.checker-invalid-part')){
  const m=t.match(/formula(?::\s*)?(.+)/i);
  const part=m&&m[1]?m[1].replace(/^[:\s]+/,'').trim():'';
  if(part){const em=document.createElement('em');em.className='checker-invalid-part';em.textContent='Problem: '+part;s.querySelector('div')?.appendChild(em);}
 }
}
function moveCTA(){
 const bad=box.querySelector('.checker-status-bad'), correction=box.querySelector('.checker-correct');
 const old=box.querySelector('.checker-balance-cta');
 if(!bad||!correction){old?.remove();return}
 const eq=correction.querySelector('.checker-equation')?.textContent.replace(/\s+/g,' ').trim();
 if(!eq){old?.remove();return}
 if(old){const a=old.querySelector('a');if(a)a.href='index.html?equation='+encodeURIComponent(eq);return}
 const wrap=document.createElement('div');wrap.className='checker-balance-cta';wrap.innerHTML='<div class="checker-balance-cta-copy"><b>Need to balance it?</b><small>Open the Balancer with this equation ready to edit.</small></div><a class="primary checker-balance-button" href="index.html?equation='+encodeURIComponent(eq)+'">Balance this equation →</a>';
 correction.appendChild(wrap);
}
new MutationObserver(()=>{fixInvalid();moveCTA()}).observe(box,{subtree:true,childList:true,characterData:true});
fixInvalid();moveCTA();
input?.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.includes('=>'))e.target.value=e.target.value.replace(/\s*=>\s*/g,' → ')},{capture:true});
})();
