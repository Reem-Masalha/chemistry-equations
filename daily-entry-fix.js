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
fix();
new MutationObserver(fix).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
document.addEventListener('click',e=>{const a=e.target instanceof Element?e.target.closest('a[href*="personal-quiz.html?daily=1"]'):null;if(a){e.preventDefault();location.href='learn.html#daily-stable'}},{capture:true});
})();
