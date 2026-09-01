(()=>{'use strict';
if(!location.pathname.endsWith('learn.html'))return;
const subscript=s=>String(s||'').replace(/Cl2/g,'Cl₂').replace(/H2O/g,'H₂O').replace(/O2/g,'O₂').replace(/H2/g,'H₂').replace(/N2/g,'N₂').replace(/Na2/g,'Na₂').replace(/CO2/g,'CO₂').replace(/Fe2/g,'Fe₂').replace(/Al2/g,'Al₂').replace(/Ca2/g,'Ca₂').replace(/P2/g,'P₂').replace(/S2/g,'S₂');
const fix=()=>{
 const card=document.getElementById('dailyChallengeCard');
 if(!card)return;
 card.querySelectorAll('a[href*="personal-quiz.html?daily=1"]').forEach(a=>a.setAttribute('href','learn.html#daily-stable'));
 const walker=document.createTreeWalker(card,NodeFilter.SHOW_TEXT);
 let n;while(n=walker.nextNode()){
   const v=n.nodeValue||'';
   if(/Today's focus:|تركيز اليوم:|המיקוד להיום:/.test(v)&&/[A-Za-z]2/.test(v))n.nodeValue=subscript(v);
 }
};
const startIfRequested=()=>{
 if(location.hash!=='#daily-stable')return;
 const btn=document.getElementById('dsvStart')||document.getElementById('dc7Start')||document.getElementById('dailyStart');
 if(btn&&!btn.disabled&&!btn.hidden&&!btn.dataset.autoStarted){btn.dataset.autoStarted='1';btn.click();}
};
fix();startIfRequested();
new MutationObserver(()=>{fix();startIfRequested()}).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','disabled']});
document.addEventListener('click',e=>{const a=e.target instanceof Element?e.target.closest('a[href*="personal-quiz.html?daily=1"]'):null;if(a){e.preventDefault();location.href='learn.html#daily-stable'}},{capture:true});
setTimeout(startIfRequested,250);setTimeout(startIfRequested,1000);setTimeout(startIfRequested,2500);
})();
