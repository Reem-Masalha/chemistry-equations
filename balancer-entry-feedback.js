(()=>{
'use strict';
const input=document.getElementById('equationInput');
const out=document.getElementById('balanceResult');
if(!input||!out)return;
const note=document.createElement('div');
note.className='balancer-entry-hint muted';
note.setAttribute('aria-live','polite');
note.style.cssText='margin-top:8px;font-size:13px;line-height:1.45;';
input.closest('.input-row')?.after(note);
const update=()=>{
  const v=input.value.trim();
  if(!v){note.textContent='Tip: enter one reaction arrow and at least one formula on each side.';return}
  if((v.match(/(?:→|->|=>|⟶|⇒|➜|⟹|⟾)/g)||[]).length>1){note.textContent='Check: use only one reaction arrow between reactants and products.';return}
  if(!/(?:→|->|=>|⟶|⇒|➜|⟹|⟾)/.test(v)){note.textContent='Tip: separate the reactants and products with →, ->, or =>.';return}
  if(/\+\s*(?:→|->|=>)|(?:→|->|=>)\s*\+|\+\s*$|^\+/.test(v)){note.textContent='Check: there appears to be an empty formula next to +.';return}
  if(/\b(?:[a-z]{1,2})(?=\s|\+|→|->|=>|$)/.test(v)&&/[a-z]/.test(v)){
    note.textContent='Tip: element symbols are case-sensitive (for example Co, not co).';return;
  }
  if(/\(\s*[^)]*$/.test(v)){note.textContent='Check: an opening parenthesis needs a matching ).';return}
  note.textContent='Ready to balance. You can use subscripts such as H₂O and parentheses such as Ca(OH)₂.';
};
input.addEventListener('input',update);
input.addEventListener('focus',update);
update();
})();
