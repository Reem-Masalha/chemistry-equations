(()=>{
'use strict';
/* Single localization engine: i18n-safe owns translation, direction and dynamic UI updates. */
function boot(){
 if(window.ChemistryI18n?.refresh||window.ChemLang?.refresh)return;
 if(document.querySelector('script[src*="i18n-safe.js"]'))return;
 const s=document.createElement('script');
 s.src='i18n-safe.js?v=20261028-priority2';
 s.async=false;
 document.head.appendChild(s);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
