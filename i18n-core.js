(()=>{
'use strict';
const KEY='chemistryLanguage';
function lang(){try{const v=localStorage.getItem(KEY);return v==='ar'||v==='he'?v:'en'}catch{return'en'}}
function wrap(){
 const c=window.ChemLang;
 if(!c)return false;
 window.ChemistryI18n={
  lang,
  t:(en,ar,he)=>c.t?c.t(en,ar,he):(lang()==='ar'?(ar??en):lang()==='he'?(he??en):en),
  apply:()=>c.refresh?.(),
  refresh:()=>c.refresh?.(),
  setLanguage:(v)=>{if(v!=='en'&&v!=='ar'&&v!=='he')return;try{localStorage.setItem(KEY,v)}catch{};location.reload()}
 };
 return true;
}
function loadPlus(){
 if(document.querySelector('script[data-site-localization-plus]'))return;
 const p=document.createElement('script');
 p.src='site-localization-plus.js?v=20260831-1';
 p.async=false;
 p.dataset.siteLocalizationPlus='1';
 p.onload=()=>{window.ChemistryI18n?.refresh?.();window.dispatchEvent(new Event('chemistryI18nReady'))};
 document.head.appendChild(p);
}
function boot(){
 if(wrap()){loadPlus();return}
 if(document.querySelector('script[data-site-language-v2]'))return;
 const s=document.createElement('script');
 s.src='site-language-v2.js?v=20260831-global-1';
 s.async=false;
 s.dataset.siteLanguageV2='1';
 s.onload=()=>{wrap();loadPlus();window.ChemistryI18n?.refresh?.()};
 document.head.appendChild(s);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
