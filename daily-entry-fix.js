(()=>{'use strict';
if(!location.pathname.endsWith('learn.html'))return;
const subscript=s=>String(s||'').replace(/Cl2/g,'Cl₂').replace(/H2O/g,'H₂O').replace(/O2/g,'O₂').replace(/H2/g,'H₂').replace(/N2/g,'N₂').replace(/Na2/g,'Na₂').replace(/CO2/g,'CO₂').replace(/Fe2/g,'Fe₂').replace(/Al2/g,'Al₂').replace(/Ca2/g,'Ca₂').replace(/P2/g,'P₂').replace(/S2/g,'S₂');
const fix=()=>{
 const card=document.getElementById('dailyChallengeCard');
 if(card){card.remove();return;}
 const stable=document.getElementById('daily-stable');
 const hero=document.querySelector('main .hero');
 if(stable&&hero&&stable.previousElementSibling!==hero)hero.insertAdjacentElement('afterend',stable);
};
const format=()=>{const stable=document.getElementById('daily-stable');if(!stable)return;stable.querySelectorAll('.daily-stable-equation').forEach(el=>{el.textContent=subscript(el.textContent)})};
const startIfRequested=()=>{if(location.hash!=='#daily-stable')return;const btn=document.getElementById('dsvStart');if(btn&&!btn.disabled&&!btn.hidden&&!btn.dataset.autoStarted){btn.dataset.autoStarted='1';btn.click();}};
const run=()=>{fix();format();startIfRequested()};
run();
new MutationObserver(run).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','disabled']});
})();
