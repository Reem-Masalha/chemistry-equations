(()=>{
'use strict';
const ROOTS=['balanceResult','recognitionResult','recognitionCorrection','checkResult','quizArea','quizStats','scoreArea','challengeArea','hostSetup','leaderboard','profileContent','achievements','stages','recentQuizzes','weakAreas','certificateArea','equationHistory'];
const optionSource=new WeakMap();
const titleKeys={
'Chemistry Equations — Balancer':'Chemistry Equations — Balancer',
'Practice & Quiz — Chemistry Equations':'Practice & Quiz — Chemistry Equations',
'Challenges — Chemistry Equations':'Challenges — Chemistry Equations',
'Checker — Chemistry Equations':'Checker — Chemistry Equations',
'Profile — Chemistry Equations':'Profile — Chemistry Equations',
'Chemistry Equations':'Chemistry Equations'
};
function ensureCss(){if(document.querySelector('link[data-chemistry-i18n-css]'))return;const l=document.createElement('link');l.rel='stylesheet';l.href='site-language.css?v=20260830-4';l.dataset.chemistryI18nCss='1';document.head.appendChild(l)}
function refresh(){const i=window.ChemistryI18n;if(!i)return;ensureCss();
 for(const id of ROOTS){const r=document.getElementById(id);if(r)i.apply(r)}
 document.querySelectorAll('select option').forEach(o=>{if(!optionSource.has(o))optionSource.set(o,o.textContent.trim());const s=optionSource.get(o);const v=i.t(s);if(v&&v!==s)o.textContent=v});
 const src=titleKeys[document.title];if(src){const v=i.t(src);if(v!==src)document.title=v}
}
function schedule(){setTimeout(refresh,80)}
function start(){ensureCss();refresh();document.addEventListener('click',schedule,true);window.addEventListener('chemistryLanguageChanged',refresh);window.addEventListener('storage',e=>{if(e.key==='chemistryLanguage')refresh()});setInterval(refresh,1500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();