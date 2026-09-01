(()=>{
'use strict';
if(!location.pathname.endsWith('learn.html')||window.__dailyAnswerOrderFixLoaded)return;
window.__dailyAnswerOrderFixLoaded=true;
const expected={
'H₂+O₂→H₂O':'2H₂+O₂→2H₂O',
'Na+Cl₂→NaCl':'2Na+Cl₂→2NaCl',
'Mg+O₂→MgO':'2Mg+O₂→2MgO',
'N₂+H₂→NH₃':'N₂+3H₂→2NH₃',
'Fe+O₂→Fe₂O₃':'4Fe+3O₂→2Fe₂O₃',
'Zn+HCl→ZnCl₂+H₂':'Zn+2HCl→ZnCl₂+H₂',
'KClO₃→KCl+O₂':'2KClO₃→2KCl+3O₂',
'Na₂O+H₂O→NaOH':'Na₂O+H₂O→2NaOH',
'C₃H₈+O₂→CO₂+H₂O':'C₃H₈+5O₂→3CO₂+4H₂O',
'NH₃+O₂→NO+H₂O':'4NH₃+5O₂→4NO+6H₂O',
'FeS₂+O₂→Fe₂O₃+SO₂':'4FeS₂+11O₂→2Fe₂O₃+8SO₂',
'Ca(OH)₂+HCl→CaCl₂+H₂O':'Ca(OH)₂+2HCl→CaCl₂+2H₂O',
'Al+O₂→Al₂O₃':'4Al+3O₂→2Al₂O₃',
'CO+O₂→CO₂':'2CO+O₂→2CO₂',
'P+O₂→P₂O₅':'4P+5O₂→2P₂O₅',
'H₂+Cl₂→HCl':'H₂+Cl₂→2HCl',
'Ag+S→Ag₂S':'2Ag+S→Ag₂S',
'CH₄+O₂→CO₂+H₂O':'CH₄+2O₂→CO₂+2H₂O',
'C₂H₆+O₂→CO₂+H₂O':'2C₂H₆+7O₂→4CO₂+6H₂O',
'CaCO₃→CaO+CO₂':'CaCO₃→CaO+CO₂',
'Cu+O₂→CuO':'2Cu+O₂→2CuO',
'Cl₂+NaBr→NaCl+Br₂':'2NaBr+Cl₂→2NaCl+Br₂',
'H₂O₂→H₂O+O₂':'2H₂O₂→2H₂O+O₂',
'SO₂+O₂→SO₃':'2SO₂+O₂→2SO₃',
'NO+O₂→NO₂':'2NO+O₂→2NO₂'
};
const subs='₀₁₂₃₄₅₆₇₈₉';
const canon=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'[subs.indexOf(c)]).replace(/\s+/g,'').replace(/⟶|⇒|➜|⟹|⟾|->|=/g,'→').toUpperCase().split('→').map(side=>side.split('+').filter(Boolean).sort().join('+')).join('→');
const base=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>String.fromCharCode(0x2080+('₀₁₂₃₄₅₆₇₈₉'.indexOf(c)))).replace(/\s+/g,'');
function wire(){
 const root=document.getElementById('dc7');
 if(!root)return false;
 const input=root.querySelector('#dc7Input'),eq=root.querySelector('#dc7Eq');
 const buttons=[root.querySelector('#dc7Check'),root.querySelector('#dc7Submit')].filter(Boolean);
 if(!input||!eq||!buttons.length)return false;
 if(root.dataset.answerOrderFix==='1')return true;
 root.dataset.answerOrderFix='1';
 const patch=e=>{
   const displayed=base(eq.textContent||'');
   const target=expected[displayed];
   if(!target)return;
   if(canon(input.value)!==canon(target))return;
   const original=input.value;
   input.value=target;
   setTimeout(()=>{if(input.value===target)input.value=original},0);
 };
 buttons.forEach(b=>b.addEventListener('click',patch,{capture:true}));
 return true;
}
let tries=0;const timer=setInterval(()=>{if(wire()||++tries>120)clearInterval(timer)},250);
wire();
})();
