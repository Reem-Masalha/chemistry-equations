(()=>{
const KEY='chemistryLanguage';
const RTL=new Set(['ar','he']);
function lang(){return localStorage.getItem(KEY)||'en'}
function applyDirection(){
  const l=lang();
  document.documentElement.lang=l;
  document.documentElement.dir=RTL.has(l)?'rtl':'ltr';
  document.body?.classList.toggle('rtl',RTL.has(l));
  document.body?.classList.toggle('ltr',!RTL.has(l));
}
function translate(){
  applyDirection();
  if(typeof window.translateSite==='function'){
    try{window.translateSite();}catch(e){console.warn('translation runtime:',e)}
  }
}
function start(){
  applyDirection();
  setTimeout(translate,0);
  setTimeout(translate,150);
  setTimeout(translate,600);
  window.addEventListener('languagechange',()=>{applyDirection();setTimeout(translate,20);setTimeout(translate,250)});
  window.addEventListener('pageshow',translate);
  const observer=new MutationObserver(mutations=>{
    if(mutations.some(m=>m.addedNodes&&m.addedNodes.length)){
      clearTimeout(window.__translationTimer);
      window.__translationTimer=setTimeout(translate,30);
    }
  });
  observer.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
