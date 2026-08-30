(()=>{
'use strict';
const SCRIPT='site-language-v2.js?v=20260830-3';
const KEY='chemistryLanguage';
function addStyle(){
  if(document.querySelector('link[data-chemistry-language-css]')) return;
  const l=document.createElement('link');
  l.rel='stylesheet';
  l.href='site-language.css?v=20260830-3';
  l.dataset.chemistryLanguageCss='1';
  document.head.appendChild(l);
}
function safeLoad(src,marker,onload){
  if(document.querySelector('script['+marker+']')){onload?.();return}
  const realObserver=window.MutationObserver;
  class NoopObserver{observe(){} disconnect(){} takeRecords(){return[]}}
  window.MutationObserver=NoopObserver;
  const s=document.createElement('script');
  s.src=src;
  s.async=false;
  s.setAttribute(marker,'1');
  s.onload=()=>{
    window.MutationObserver=realObserver;
    onload?.();
  };
  s.onerror=()=>{window.MutationObserver=realObserver};
  (document.body||document.head).appendChild(s);
}
function installDynamicRefresh(){
  const refresh=()=>{try{window.ChemLang?.refresh?.()}catch{}};
  const ids=['balanceResult','recognitionResult','recognitionCorrection','checkResult','quizArea','quizStats','scoreArea','challengeArea','hostSetup','leaderboard','accountModal','equationHistory'];
  ids.forEach(id=>{
    const el=document.getElementById(id);
    if(!el||el.dataset.chemLangObserver==='1')return;
    el.dataset.chemLangObserver='1';
    let timer=0;
    new MutationObserver(()=>{
      clearTimeout(timer);
      timer=setTimeout(refresh,35);
    }).observe(el,{childList:true,subtree:true});
  });
  document.addEventListener('click',()=>{
    setTimeout(refresh,60);
    setTimeout(refresh,260);
  },true);
  window.addEventListener('chemistryLanguageChanged',refresh);
  window.addEventListener('storage',e=>{if(e.key===KEY)refresh()});
  refresh();
}
function boot(){
  addStyle();
  safeLoad(SCRIPT,'data-chemistry-language-v2',()=>{
    const s=document.querySelector('script[data-chemistry-language-v2]');
    if(s) s.dataset.loaded='1';
    installDynamicRefresh();
    if(/(^|\/)challenges\.html$/i.test(location.pathname)){
      safeLoad('challenge-language-v3.js?v=20260830-2','data-chemistry-challenge-v3',installDynamicRefresh);
    }
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
