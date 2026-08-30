(()=>{
'use strict';
const load=(src,done)=>{const s=document.createElement('script');s.src=src;s.async=false;s.defer=false;s.onload=done;s.onerror=()=>{};document.head.appendChild(s)};
const boot=()=>{
 if(window.learnFullI18n){window.learnFullI18n();load('learn-extra-i18n.js?v=20260830-1');return}
 load('learn-full-i18n.js?v=20260830-1',()=>load('learn-extra-i18n.js?v=20260830-1'));
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();