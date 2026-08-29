(()=>{
'use strict';
const KEY='chemistryEquationHistory';
const SUB_TO_DIGIT={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
const DIGIT_TO_SUB={'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
const getUser=()=>{try{return JSON.parse(localStorage.getItem('chemistryCurrentUser')||sessionStorage.getItem('chemistryCurrentUser')||'null')}catch{return null}};
const storageKey=()=>{const u=getUser();return KEY+':'+(u?.id||u?.username||'guest')};
const fromSubscripts=s=>String(s??'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,d=>SUB_TO_DIGIT[d]);
const normalizeArrow=s=>fromSubscripts(String(s??'')).replace(/[⟶⇒➜⟹⟾]/g,'→').replace(/\s*(?:=>|->|→)\s*/g,' → ').replace(/\s+/g,' ').trim();
const repairMolecule=s=>{
  let v=String(s??'').trim();
  v=v.replace(/^<sub>\s*([0-9]+)\s*<\/sub>/i,'$1');
  v=v.replace(/^<sub>\s*([₀₁₂₃₄₅₆₇₈₉]+)\s*<\/sub>/i,m=>fromSubscripts(m.replace(/^<sub>|<\/sub>$/gi,'')));
  return fromSubscripts(v);
};
const repairEquation=eq=>normalizeArrow(eq).split(' → ').map(side=>side.split(/\s*\+\s*/).map(repairMolecule).join(' + ')).join(' → ');
const readRaw=()=>{try{return JSON.parse(localStorage.getItem(storageKey())||'[]')}catch{return[]}};
const write=a=>{try{localStorage.setItem(storageKey(),JSON.stringify(a.slice(0,30)))}catch{}};
const read=()=>{const a=readRaw();const fixed=a.map(x=>({...x,input:repairEquation(x?.input),solution:repairEquation(x?.solution)}));if(JSON.stringify(a)!==JSON.stringify(fixed))write(fixed);return fixed};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const formulaPretty=formula=>{
  const raw=fromSubscripts(formula);
  let out='';
  for(let i=0;i<raw.length;i++){
    if(/\d/.test(raw[i])){let j=i+1;while(j<raw.length&&/\d/.test(raw[j]))j++;out+=raw.slice(i,j).replace(/\d/g,d=>DIGIT_TO_SUB[d]);i=j-1;}
    else out+=raw[i];
  }
  return out;
};
const formatMolecule=part=>{
  const normal=repairMolecule(part);
  const m=normal.match(/^(\d+)(.*)$/);
  if(m)return `${m[1]==='1'?'':m[1]}${formulaPretty(m[2])}`;
  return formulaPretty(normal);
};
const prettyEquation=equation=>repairEquation(equation).split(' → ').map(side=>side.split(/\s*\+\s*/).map(formatMolecule).join(' + ')).join(' → ');
const copy=async(text,button)=>{try{await navigator.clipboard.writeText(text)}catch{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}if(button){const old=button.textContent;button.textContent='Copied ✓';setTimeout(()=>button.textContent=old,1000)}};
const share=async(text)=>{try{if(navigator.share)await navigator.share({title:'Chemistry Equation',text});else await copy(text)}catch{}};
function add(item){if(!item?.input||!item?.solution)return;let a=read();const input=repairEquation(item.input),solution=repairEquation(item.solution);a=a.filter(x=>x.input!==input);a.unshift({...item,input,solution,id:crypto.randomUUID?.()||String(Date.now()+Math.random()),time:Date.now()});write(a);render()}
function render(){const host=document.getElementById('equationHistory');if(!host)return;const a=read();host.innerHTML=`<div class="history-head"><div><b>Equations' history</b><span>${a.length?`${a.length} recent equation${a.length===1?'':'s'}`:'No saved equations yet.'}</span></div>${a.length?'<button type="button" class="secondary" id="clearEquationHistory">Clear history</button>':''}</div>`+(a.length?a.map((x,i)=>`<article class="history-item" data-id="${esc(x.id)}"><div class="history-index">${i+1}</div><div class="history-content"><div class="history-label">Equation</div><div class="history-equation">${prettyEquation(x.input)}</div><div class="history-label history-label-solution">Balanced result</div><div class="history-solution">${prettyEquation(x.solution)}</div><div class="history-actions"><button type="button" class="secondary" data-action="reopen">Reopen</button><button type="button" class="secondary" data-action="copy-eq">Copy equation</button><button type="button" class="secondary" data-action="copy-solution">Copy solution</button><button type="button" class="secondary" data-action="share">Share</button><button type="button" class="secondary danger-history" data-action="delete">Delete</button></div></div></article>`).join(''):'<p class="muted history-empty">Balance an equation to start your history.</p>');host.querySelector('#clearEquationHistory')?.addEventListener('click',()=>{write([]);render()});host.querySelectorAll('.history-item').forEach(row=>{const x=a.find(v=>v.id===row.dataset.id);row.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{const act=b.dataset.action;if(act==='delete'){write(a.filter(v=>v.id!==x.id));render()}else if(act==='copy-eq')copy(repairEquation(x.input),b);else if(act==='copy-solution')copy(repairEquation(x.solution),b);else if(act==='share')share(`Equation: ${repairEquation(x.input)}\nBalanced: ${repairEquation(x.solution)}`);else if(act==='reopen'){const input=document.getElementById('equationInput');if(input){input.value=repairEquation(x.input);document.getElementById('balanceBtn')?.click();window.scrollTo({top:input.getBoundingClientRect().top+scrollY-120,behavior:'smooth'})}}}))})}
function installResultActions(){const out=document.getElementById('balanceResult');if(out&&!out.querySelector('.result-actions')){const box=document.createElement('div');box.className='result-actions';box.innerHTML='<button type="button" class="secondary" data-copy-input>Copy equation</button><button type="button" class="secondary" data-copy-solution>Copy solution</button><button type="button" class="secondary" data-share-result>Share</button>';out.appendChild(box);const input=document.getElementById('equationInput');box.querySelector('[data-copy-input]').onclick=()=>copy(input?.value||'',box.querySelector('[data-copy-input]'));box.querySelector('[data-copy-solution]').onclick=()=>{const eq=out.querySelector('.balance-correction .equation,.equation');copy(eq?.innerText||'',box.querySelector('[data-copy-solution]'))};box.querySelector('[data-share-result]').onclick=()=>{const eq=out.querySelector('.balance-correction .equation,.equation')?.innerText||'';share(`Equation: ${input?.value||''}\nBalanced: ${eq}`)}}}
function observe(){const out=document.getElementById('balanceResult');if(!out)return;new MutationObserver(()=>{if(!out.classList.contains('hidden')){installResultActions();const eq=out.querySelector('.balance-correction .equation,.equation');const text=eq?.innerText?.trim();const input=document.getElementById('equationInput')?.value?.trim();if(text&&input)add({input,solution:text})}}).observe(out,{childList:true,subtree:true})}
function init(){const balance=document.getElementById('balanceResult');if(balance){const card=document.querySelector('.balancer');if(card&&!document.getElementById('equationHistory')){const section=document.createElement('section');section.id='equationHistory';section.className='card equation-history';card.insertAdjacentElement('afterend',section)}render();observe()}const check=document.getElementById('checkResult');if(check){new MutationObserver(()=>{if(!check.classList.contains('hidden')&&!check.querySelector('.result-actions')){const b=document.createElement('div');b.className='result-actions';b.innerHTML='<button type="button" class="secondary">Copy equation</button><button type="button" class="secondary">Share</button>';check.appendChild(b);const txt=()=>document.getElementById('checkInput')?.value||'';b.children[0].onclick=()=>copy(txt(),b.children[0]);b.children[1].onclick=()=>share(`Equation: ${txt()}\n${check.innerText}`)}}).observe(check,{childList:true,subtree:true})}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
