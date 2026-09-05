(()=>{
'use strict';
let timer=0;
function ensureCss(){if(document.querySelector('link[data-chemistry-i18n-css]'))return;const l=document.createElement('link');l.rel='stylesheet';l.href='site-language.css?v=20260830-complete';l.dataset.chemistryI18nCss='1';document.head.appendChild(l)}
function refresh(){const i=window.ChemistryI18n;if(!i)return;ensureCss();i.refresh()}
function schedule(){clearTimeout(timer);timer=setTimeout(refresh,80)}
function start(){refresh();document.addEventListener('click',schedule,true);window.addEventListener('chemistryLanguageChanged',refresh);window.addEventListener('storage',e=>{if(e.key==='chemistryLanguage')schedule()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
