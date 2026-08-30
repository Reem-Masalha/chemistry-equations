(()=>{
'use strict';
const load=(src,done)=>{const s=document.createElement('script');s.src=src;s.async=false;s.defer=false;s.onload=done;(document.head||document.body).appendChild(s)};
const boot=()=>{if(window.ChemistryI18n){load('i18n-enhancements.js?v=20260830-1');return}load('i18n-core.js?v=20260830-2',()=>load('i18n-enhancements.js?v=20260830-1'));};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();