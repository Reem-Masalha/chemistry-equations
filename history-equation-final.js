(()=>{
'use strict';
const KEY='chemistryEquationHistory',SUB='₀₁₂₃₄₅₆₇₈₉';
const REV=Object.fromEntries([...SUB].map((c,i)=>[c,String(i)]));
const clean=s=>String(s??'').replace(/&nbsp;/gi,' ').replace(/<[^>]*>/g,'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>REV[c]).replace(/[⟶⇒➜⟹⟾]/g,'→').replace(/\s*(?:=>|->|→)\s*/g,' → ').replace(/\s+/g,' ').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const formula=s=>{const x=clean(s);let out='';for(let i=0;i<x.length;i++){const c=x[i];if(/\d/.test(c))out+=SUB[Number(c)];else out+=esc(c)}return out};
const pretty=eq=>{const sides=clean(eq).split(' → ');if(sides.length!==2)return formula(eq);return sides.map(side=>side.split('+').map(part=>{const p=clean(part),m=p.match(/^(\d+)\s*(.*)$/);return m&&m[2]?(m[1]==='1'?'':m[1])+formula(m[2]):formula(p)}).join(' + ')).join(' → ')};
const userKey=()=>{try{const u=JSON.parse(localStorage.getItem('chemistryCurrentUser')||sessionStorage.getItem('chemistryCurrentUser')||'null');return KEY+':'+(u?.id||u?.username||'guest')}catch{return KEY+':guest'}};
const read=()=>{try{return JSON.parse(localStorage.getItem(userKey())||'[]')}catch{return[]}};
function render(){const host=document.getElementById('equationHistory');if(!host)return;const rows=read();host.querySelectorAll('.history-item').forEach(row=>{const item=rows.find(x=>String(x.id)===String(row.dataset.id));if(!item)return;for(const [cls,value] of [['history-equation',item.input],['history-solution',item.solution]]){const el=row.querySelector('.'+cls);if(!el)continue;const desired=pretty(value);if(el.dataset.renderedEquation!==desired){el.innerHTML=desired;el.dataset.renderedEquation=desired}el.dir='ltr';el.style.direction='ltr';el.style.unicodeBidi='isolate';el.style.textAlign='center'}})}
function init(){render();const host=document.getElementById('equationHistory');if(host&&!host.dataset.historyFinal){host.dataset.historyFinal='1';new MutationObserver(muts=>{if(muts.some(m=>m.addedNodes.length))render()}).observe(host,{childList:true,subtree:true})}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
