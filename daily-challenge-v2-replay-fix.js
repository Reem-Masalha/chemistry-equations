(()=>{
'use strict';
if(!location.pathname.endsWith('learn.html'))return;
const p=new URLSearchParams(location.search);let replay=p.has('adminReplay')||p.has('adminFresh');try{replay=replay||sessionStorage.getItem('chemistryAdminReplayRequested')==='1'}catch{}
if(!replay)return;
const day=()=>new Date().toISOString().slice(0,10);
const idx=()=>{const a=new Date(day()+'T00:00:00Z'),b=new Date('2020-01-01T00:00:00Z');return Math.floor((a-b)/86400000)};
const qs=['H₂ + O₂ → H₂O','Na + Cl₂ → NaCl','Mg + O₂ → MgO','N₂ + H₂ → NH₃','Fe + O₂ → Fe₂O₃','Zn + HCl → ZnCl₂ + H₂','KClO₃ → KCl + O₂','Na₂O + H₂O → NaOH','C₃H₈ + O₂ → CO₂ + H₂O','NH₃ + O₂ → NO + H₂O','FeS₂ + O₂ → Fe₂O₃ + SO₂'];
const start=((idx()%qs.length)+qs.length)%qs.length;
const go=()=>{const eq=document.getElementById('dc2Eq'),btn=document.getElementById('dc2Start'),pill=document.getElementById('dc2Pill');if(!eq||!btn)return false;eq.textContent=qs[start];if(pill)pill.textContent='🔥 Question 1 of 5';if(!btn.disabled&&!btn.hidden){btn.click();return true}return false};
let tries=0;const timer=setInterval(()=>{tries++;if(go()||tries>80)clearInterval(timer)},100);
})();