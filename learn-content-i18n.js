(()=>{
'use strict';
const load=()=>{
 if(window.learnFullI18n){window.learnFullI18n();return}
 const s=document.createElement('script');
 s.src='learn-full-i18n.js?v=20260830-1';
 s.async=false;
 s.onload=()=>window.learnFullI18n?.();
 document.head.appendChild(s);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();