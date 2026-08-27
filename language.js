(()=>{
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
load('language-v2.js?v=20260827-2').then(()=>load('rtl-layout-fix.js?v=20260827-1')).catch(()=>{});
})();
