(()=>{
'use strict';
const load=()=>{
 if(window.ChemistryI18n){window.ChemistryI18n.refresh?.();return}
 const s=document.createElement('script');
 s.src='i18n-safe.js?v=20260830-107';
 s.async=false;
 s.onload=()=>window.ChemistryI18n?.refresh?.();
 document.head.appendChild(s);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();