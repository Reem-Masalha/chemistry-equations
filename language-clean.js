(()=>{
'use strict';
const refresh=()=>{window.ChemistryI18n?.refresh?.()};
function load(){
  if(window.ChemistryI18n){refresh();return}
  const existing=document.querySelector('script[data-global-i18n],script[data-worker-i18n-bootstrap],script[data-language-clean-i18n]');
  if(existing){window.addEventListener('chemistryI18nReady',refresh,{once:true});[80,250,700].forEach(ms=>setTimeout(refresh,ms));return}
  const s=document.createElement('script');
  s.src='i18n-core.js?v=20260831-global-3';
  s.async=false;
  s.dataset.languageCleanI18n='1';
  s.onload=()=>{
    if(!document.querySelector('script[data-language-clean-enhancements],script[data-worker-i18n-enhancements]')){
      const e=document.createElement('script');
      e.src='i18n-enhancements.js?v=20260831-global-3';
      e.async=false;
      e.dataset.languageCleanEnhancements='1';
      document.head.appendChild(e);
    }
    refresh();
  };
  document.head.appendChild(s);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
window.addEventListener('chemistryI18nReady',refresh);
})();