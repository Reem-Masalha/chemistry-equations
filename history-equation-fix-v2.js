(()=>{
'use strict';
const KEY='chemistryEquationHistory',SUB='₀₁₂₃₄₅₆₇₈₉';
const REV=Object.fromEntries([...SUB].map((x,i)=>[x,String(i)]));
const clean=s=>String(s??'').replace(/&nbsp;/gi,' ').replace(/<[^>]*>/g,'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>REV[c]).replace(/[⟶⇒➜⟹⟾]/g,'→').replace(/\s*(?:=>|->|→)\s*/g,' → ').replace(/\s+/g,' ').trim();
const formula=s=>{const x=clean(s);let out='',i=0;while(i<x.length){if(/\d/.test(x[i])){let j=i+1;while(j<x.length&&/\d/.test(x[j]))j++;out+=x.slice(i,j).split('').map(d=>SUB[Number(d)]).join('');i=j}else{out+=x[i++]}}return out};
const pretty=eq=>{const sides=clean(eq).split(' → ');if(sides.length!==2)return formula(eq);return sides.map(side=>side.split(/\s*\+\s*/).map(p=>{const m=clean(p).match(/^(\d+)\s*(.*)$/);return m?`${m[1]==='1'?'':m[1]}${formula(m[2])}`:formula(p)}).join(' + ')).join(' → ')};
function userKey(){try{const u=JSON.parse(localStorage.getItem('chemistryCurrentUser')||sessionStorage.getItem('chemistryCurrentUser')||'null');return `${KEY}:${u?.id||u?.username||'guest'}`}catch{return `${KEY}:guest`}}
function read(){try{return JSON.parse(localStorage.getItem(userKey())||'[]')}catch{return[]}}
function render(){const host=document.getElementById('equationHistory');if(!host)return;const items=read();host.querySelectorAll('.history-item').forEach(row=>{const item=items.find(v=>String(v.id)===String(row.dataset.id));if(!item)return;const e=row.querySelector('.history-equation'),s=row.querySelector('.history-solution');if(e)e.textContent=pretty(item.input);if(s)s.textContent=pretty(item.solution);[e,s].forEach(x=>{if(x){x.dir='ltr';x.style.direction='ltr';x.style.unicodeBidi='isolate';x.style.textAlign='center'}})})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
window.addEventListener('chemistryLanguageChanged',render);
})();