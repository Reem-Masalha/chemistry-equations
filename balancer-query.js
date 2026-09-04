(()=>{
'use strict';
const input=document.getElementById('equationInput');
const btn=document.getElementById('balanceBtn');
if(!input||!btn)return;
const normalizeStates=s=>String(s??'').replace(/\(\s*(aq|s|l|g)\s*\)/gi,(_,state)=>`(${state.toLowerCase()})`);
try{
  const eq=new URLSearchParams(location.search).get('equation');
  if(eq){
    input.value=normalizeStates(eq);
    setTimeout(()=>btn.click(),80);
  }
}catch{}
})();
