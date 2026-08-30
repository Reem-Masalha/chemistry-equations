(()=>{
'use strict';
function align(){
 const root=document.getElementById('balanceResult');
 if(!root)return;
 root.querySelectorAll('.equation,.balance-correction .equation,.explanation-equation').forEach(el=>{
  el.setAttribute('dir','ltr');
  el.style.setProperty('direction','ltr','important');
  el.style.setProperty('unicode-bidi','isolate','important');
  el.style.setProperty('text-align','left','important');
  el.style.setProperty('margin-inline','0','important');
  el.style.setProperty('margin-left','0','important');
  el.style.setProperty('margin-right','0','important');
 });
}
function init(){
 align();
 document.addEventListener('click',e=>{
  if(e.target.closest('#balanceBtn,#balanceRecognized,[data-eq],#exampleBtn,#resetBtn,#clearBtn')){
   setTimeout(align,0);
   setTimeout(align,100);
 }
  if(e.target.closest('#explanationToggle'))setTimeout(align,0);
 },true);
 document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target&&e.target.id==='equationInput'){
   setTimeout(align,0);
   setTimeout(align,100);
  }
 },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
