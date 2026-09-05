(()=>{
'use strict';
let timer=0;
function refresh(){window.ChemistryI18n?.refresh?.()}
function schedule(){clearTimeout(timer);timer=setTimeout(refresh,80)}
function start(){refresh();document.addEventListener('click',schedule,true);window.addEventListener('chemistryLanguageChanged',refresh);window.addEventListener('storage',e=>{if(e.key==='chemistryLanguage')schedule()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
