(()=>{
'use strict';
const input=document.getElementById('equationInput');
if(!input)return;
const normalize=()=>{const v=String(input.value||'');if(v.includes('=>'))input.value=v.replace(/\s*=>\s*/g,' → ')};
const form=input.closest('form');
input.addEventListener('keydown',e=>{if(e.key==='Enter')normalize();});
document.getElementById('balanceBtn')?.addEventListener('pointerdown',normalize,{capture:true});
document.getElementById('balanceBtn')?.addEventListener('click',normalize,{capture:true});
form?.addEventListener('submit',normalize,{capture:true});
})();
