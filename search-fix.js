(()=>{
  'use strict';
  if(window.__CHEM_SEARCH_GUARD__)return;
  window.__CHEM_SEARCH_GUARD__=true;
  const close=()=>{const r=document.getElementById('siteSearchResults');if(r)r.classList.remove('open')};
  const init=()=>{
    close();
    const bar=document.getElementById('siteSearchBar'),results=document.getElementById('siteSearchResults');
    if(!bar||!results)return;
    let intentional=false;
    const intent=()=>{intentional=true;setTimeout(()=>{intentional=false},1200)};
    bar.addEventListener('focusin',intent,true);
    bar.addEventListener('pointerdown',intent,true);
    document.addEventListener('pointerdown',e=>{if(!bar.contains(e.target))close()},true);
    new MutationObserver(()=>{if(results.classList.contains('open')&&!intentional)results.classList.remove('open')}).observe(results,{attributes:true,attributeFilter:['class']});
    close();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
