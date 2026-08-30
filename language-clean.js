(()=>{
'use strict';
const load=()=>{if(window.ChemistryI18n)return;const s=document.createElement('script');s.src='i18n-core.js?v=20260830-1';s.async=false;s.defer=false;s.onload=()=>window.ChemistryI18n?.refresh?.();(document.head||document.body).appendChild(s)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();