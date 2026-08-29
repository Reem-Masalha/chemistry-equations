(()=>{
'use strict';
const input=document.getElementById('equationInput');
const btn=document.getElementById('balanceBtn');
if(!input||!btn)return;
try{
  const eq=new URLSearchParams(location.search).get('equation');
  if(eq){
    input.value=eq;
    setTimeout(()=>btn.click(),80);
  }
}catch{}
})();
