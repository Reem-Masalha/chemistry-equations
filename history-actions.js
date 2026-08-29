(()=>{
'use strict';
const KEY='chemistryEquationHistory';
const getUser=()=>{try{return JSON.parse(localStorage.getItem('chemistryCurrentUser')||sessionStorage.getItem('chemistryCurrentUser')||'null')}catch{return null}};
const storageKey=()=>{const u=getUser();return KEY+':'+(u?.id||u?.username||'guest')};
const read=()=>{try{return JSON.parse(localStorage.getItem(storageKey())||'[]')}catch{return[]}};
const write=a=>{try{localStorage.setItem(storageKey(),JSON.stringify(a.slice(0,30)));}catch{}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const subDigits={'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
const formulaPretty=src=>{
  const s=String(src??'');
  let out='',i=0;
  while(i<s.length){
    const ch=s[i];
    if(ch==='<'&&s.slice(i,i+5)==='<sub>'){
      const end=s.indexOf('</sub>',i+5);
      if(end!==-1){out+=s.slice(i,end+6);i=end+6;continue;}
    }
    if(/\d/.test(ch)){
      let j=i;while(j<s.length&&/\d/.test(s[j]))j++;
      out+=s.slice(i,j).replace(/\d/g,d=>subDigits[d]);i=j;continue;
    }
    out+=ch;i++;
  }
  return out;
};
const prettyFormula=s=>formulaPretty(esc(String(s||'')).replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>({'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'}[c])));
const prettyEquation=s=>String(s||'').replace(/[⟶⇒➜⟹⟾]/g,'→').replace(/\s*(?:=>|->)\s*/g,' → ').replace(/\s+/g,' ').trim().split(' → ').map(side=>side.split(/\s*\+\s*/).map(part=>{
  const m=part.match(/^(\d+)\s*(.*)$/);if(!m)return prettyFormula(part);return formulaPretty(esc(m[1]))+prettyFormula(m[2]);
}).join(' + ')).join(' → ');
const copy=async(text,button)=>{try{await navigator.clipboard.writeText(text)}catch{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}if(button){const old=button.textContent;button.textContent='Copied ✓';setTimeout(()=>button.textContent=old,1000)}};
const share=async(text)=>{try{if(navigator.share)await navigator.share({title:'Chemistry Equation',text});else await copy(text)}catch{}};
function add(item){if(!item?.input||!item?.solution)return;let a=read();a=a.filter(x=>x.input!==item.input);a.unshift({...item,id:crypto.randomUUID?.()||String(Date.now()+Math.random()),time:Date.now()});write(a);render();}
function render(){
  const host=document.getElementById('equationHistory');if(!host)return;const a=read();
  host.innerHTML=`<div class="history-head"><div><b>Equations' history</b><span>${a.length?`${a.length} recent equation${a.length===1?'':'s'}`:'No saved equations yet.'}</span></div>${a.length?'<button type="button" class="secondary" id="clearEquationHistory">Clear history</button>':''}</div>`+
  (a.length?a.map((x,i)=>`<article class="history-item" data-id="${esc(x.id)}"><div class="history-index">${i+1}</div><div class="history-content"><div class="history-label">Equation</div><div class="history-equation">${prettyEquation(x.input)}</div><div class="history-label history-label-solution">Balanced result</div><div class="history-solution">${prettyEquation(x.solution)}</div><div class="history-actions"><button type="button" class="secondary" data-action="reopen">Reopen</button><button type="button" class="secondary" data-action="copy-eq">Copy equation</button><button type="button" class="secondary" data-action="copy-solution">Copy solution</button><button type="button" class="secondary" data-action="share">Share</button><button type="button" class="secondary danger-history" data-action="delete">Delete</button></div></div></article>`).join(''):'<p class="muted history-empty">Balance an equation to start your history.</p>');
  host.querySelector('#clearEquationHistory')?.addEventListener('click',()=>{write([]);render()});
  host.querySelectorAll('.history-item').forEach(row=>{const x=a.find(v=>v.id===row.dataset.id);row.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{const act=b.dataset.action;if(act==='delete'){write(a.filter(v=>v.id!==x.id));render()}else if(act==='copy-eq')copy(x.input,b);else if(act==='copy-solution')copy(x.solution,b);else if(act==='share')share(`Equation: ${x.input}\nBalanced: ${x.solution}`);else if(act==='reopen'){const input=document.getElementById('equationInput');if(input){input.value=x.input;document.getElementById('balanceBtn')?.click();window.scrollTo({top:input.getBoundingClientRect().top+scrollY-120,behavior:'smooth'})}}}))})}
function installResultActions(){const out=document.getElementById('balanceResult');if(out&&!out.querySelector('.result-actions')){const box=document.createElement('div');box.className='result-actions';box.innerHTML='<button type="button" class="secondary" data-copy-input>Copy equation</button><button type="button" class="secondary" data-copy-solution>Copy solution</button><button type="button" class="secondary" data-share-result>Share</button>';out.appendChild(box);const input=document.getElementById('equationInput');box.querySelector('[data-copy-input]').onclick=()=>copy(input?.value||'',box.querySelector('[data-copy-input]'));box.querySelector('[data-copy-solution]').onclick=()=>{const eq=out.querySelector('.balance-correction .equation,.equation');copy(eq?.innerText||'',box.querySelector('[data-copy-solution]'))};box.querySelector('[data-share-result]').onclick=()=>{const eq=out.querySelector('.balance-correction .equation,.equation')?.innerText||'';share(`Equation: ${input?.value||''}\nBalanced: ${eq}`)};}}
function observe(){const out=document.getElementById('balanceResult');if(!out)return;new MutationObserver(()=>{if(!out.classList.contains('hidden')){installResultActions();const eq=out.querySelector('.balance-correction .equation,.equation');const text=eq?.innerText?.trim();const input=document.getElementById('equationInput')?.value?.trim();if(text&&input)add({input,solution:text})}}).observe(out,{childList:true,subtree:true});}
function init(){const balance=document.getElementById('balanceResult');if(balance){const card=document.querySelector('.balancer');if(card&&!document.getElementById('equationHistory')){const section=document.createElement('section');section.id='equationHistory';section.className='card equation-history';card.insertAdjacentElement('afterend',section)}render();observe();}const check=document.getElementById('checkResult');if(check){new MutationObserver(()=>{if(!check.classList.contains('hidden')&&!check.querySelector('.result-actions')){const b=document.createElement('div');b.className='result-actions';b.innerHTML='<button type="button" class="secondary">Copy equation</button><button type="button" class="secondary">Share</button>';check.appendChild(b);const txt=()=>document.getElementById('checkInput')?.value||'';b.children[0].onclick=()=>copy(txt(),b.children[0]);b.children[1].onclick=()=>share(`Equation: ${txt()}\n${check.innerText}`)}}).observe(check,{childList:true,subtree:true});}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
