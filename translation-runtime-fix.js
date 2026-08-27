(()=>{
const KEY='chemistryLanguage';
const RTL=new Set(['ar','he']);
function lang(){return localStorage.getItem(KEY)||'en'}
function applyDirection(){
  const l=lang();const rtl=RTL.has(l);
  document.documentElement.lang=l;document.documentElement.dir=rtl?'rtl':'ltr';
  document.body?.classList.toggle('rtl',rtl);document.body?.classList.toggle('ltr',!rtl);
  if(!document.getElementById('translation-runtime-style')){
    const s=document.createElement('style');s.id='translation-runtime-style';s.textContent=`
      html[dir="rtl"] body{direction:rtl;text-align:right}
      html[dir="rtl"] .topbar{direction:rtl}
      html[dir="rtl"] .brand{margin-left:auto;margin-right:0}
      html[dir="rtl"] .main-nav{direction:rtl}
      html[dir="rtl"] main,html[dir="rtl"] section{direction:rtl}
      html[dir="rtl"] .hero,html[dir="rtl"] .hero>div,html[dir="rtl"] .hero-card{direction:rtl;text-align:right}
      html[dir="rtl"] .section-head{direction:rtl}
      html[dir="rtl"] .section-head>div{text-align:right}
      html[dir="rtl"] .card,html[dir="rtl"] .dashboard-card,html[dir="rtl"] .experience-card,html[dir="rtl"] .challenge-feature{direction:rtl;text-align:right}
      html[dir="rtl"] .input-row,html[dir="rtl"] .hand-head,html[dir="rtl"] .quiz-actions{direction:rtl}
      html[dir="rtl"] input:not([type="radio"]):not([type="checkbox"]),html[dir="rtl"] textarea,html[dir="rtl"] select{direction:rtl;text-align:right}
      html[dir="rtl"] .mode-list label,html[dir="rtl"] .stage{text-align:right}
      html[dir="rtl"] footer{direction:rtl;text-align:right}
      html[dir="rtl"] .equation,html[dir="rtl"] .equation *,html[dir="rtl"] .chemical-equation,html[dir="rtl"] .chemical-equation *,html[dir="rtl"] .formula,html[dir="rtl"] canvas{direction:ltr!important;text-align:center!important;unicode-bidi:isolate}
      html[dir="rtl"] .chips{direction:rtl}
      html[dir="rtl"] table{direction:rtl}
      html[dir="rtl"] td,html[dir="rtl"] th{text-align:right}
      html[dir="rtl"] .progress-grid>div,html[dir="rtl"] .certificate{text-align:center}
      html[dir="rtl"] .certificate,html[dir="rtl"] .certificate *{direction:ltr}
      @media(max-width:700px){html[dir="rtl"] .topbar{flex-direction:column;align-items:stretch}html[dir="rtl"] .main-nav{justify-content:flex-start;flex-wrap:wrap}html[dir="rtl"] .input-row{direction:rtl}}
    `;document.head.appendChild(s)
  }
}
function translate(){
  applyDirection();
  if(typeof window.translateSite==='function'){try{window.translateSite()}catch(e){console.warn('translation runtime:',e)}}
}
function start(){
  applyDirection();setTimeout(translate,0);setTimeout(translate,150);setTimeout(translate,600);
  window.addEventListener('languagechange',()=>{applyDirection();setTimeout(translate,20);setTimeout(translate,250)});
  window.addEventListener('pageshow',translate);
  const observer=new MutationObserver(m=>{if(m.some(x=>x.addedNodes&&x.addedNodes.length)){clearTimeout(window.__translationTimer);window.__translationTimer=setTimeout(translate,30)}});
  observer.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
