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
function boot(){
 if(wrap())return;
 const real=window.MutationObserver;
 class NoopObserver{observe(){}disconnect(){}takeRecords(){return[]}}
 window.MutationObserver=NoopObserver;
 const s=document.createElement('script');
 s.src='site-language-v2.js?v=20260830-safe-1';
 s.async=false;s.defer=false;
 s.onload=()=>{window.MutationObserver=real;wrap();window.ChemistryI18n?.refresh?.()};
 s.onerror=()=>{window.MutationObserver=real};
 document.head.appendChild(s);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();