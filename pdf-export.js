(()=>{
'use strict';
const input=document.getElementById('equationInput'),out=document.getElementById('balanceResult');
if(!input||!out)return;
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const subDigits={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
const plain=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>subDigits[c]);
function parseFormula(formula){
 const s=plain(formula).replace(/\s+/g,'');let i=0;
 function group(close){
  const a={};
  while(i<s.length){
   if(close&&s[i]===close){i++;return a}
   if(s[i]==='('){i++;const g=group(')'),m=s.slice(i).match(/^\d+/),k=m?+m[0]:1;if(m)i+=m[0].length;for(const e in g)a[e]=(a[e]||0)+g[e]*k;continue}
   const m=s.slice(i).match(/^[A-Z][a-z]?/);if(!m)throw Error('Invalid formula');
   const e=m[0];i+=e.length;const n=s.slice(i).match(/^\d+/),k=n?+n[0]:1;if(n)i+=n[0].length;a[e]=(a[e]||0)+k;
  }
  if(close)throw Error('Invalid formula');return a;
 }
 return group();
}
function parseEquation(raw){
 const normalized=String(raw||'').replace(/\s+/g,' ').trim().replace(/⟶|⇒|➜|⟹|⟾|=>|->/g,'→');
 const parts=normalized.split('→');if(parts.length!==2)return null;
 const side=s=>s.split('+').map(v=>v.trim()).filter(Boolean).map(v=>{const m=v.match(/^(\d+)\s*(.+)$/);return {coef:m?+m[1]:1,formula:m?m[2].trim():v}});
 const left=side(parts[0]),right=side(parts[1]);if(!left.length||!right.length)return null;
 return {left,right};
}
function totals(eq){
 const sides=[{},{}];
 [eq.left,eq.right].forEach((side,si)=>side.forEach(item=>{const atoms=parseFormula(item.formula);for(const[e,n]of Object.entries(atoms))sides[si][e]=(sides[si][e]||0)+n*item.coef;}));
 const elements=[...new Set([...Object.keys(sides[0]),...Object.keys(sides[1])])].sort();
 return elements.map(e=>[e,sides[0][e]||0,sides[1][e]||0]);
}
function atomCountsTable(original,balanced){
 try{
  const a=parseEquation(original),b=parseEquation(balanced);if(!a||!b)return '';
  const ao=totals(a),bb=totals(b);const map=new Map(bb.map(r=>[r[0],r]));
  return `<table class="count-table"><thead><tr><th>Element</th><th>Original · Left</th><th>Original · Right</th><th>Balanced · Left</th><th>Balanced · Right</th></tr></thead><tbody>${ao.map(r=>{const q=map.get(r[0])||[r[0],0,0];return `<tr><td><b>${esc(r[0])}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${q[1]}</td><td>${q[2]}</td></tr>`}).join('')}</tbody></table>`;
 }catch{return ''}
}
function buildSheet(){
 const original=clean(input.value||'');
 const balanced=clean(out.querySelector('.balance-correction .equation,.equation')?.innerText||'');
 const status=clean(out.querySelector('.balance-status b')?.innerText||'Balanced result');
 const steps=[...out.querySelectorAll('.balancing-explanation .explanation-step,.explanation-step')].map((el,i)=>({title:clean(el.querySelector('b')?.innerText||`Step ${i+1}`),equation:clean(el.querySelector('.explanation-equation')?.innerText||''),reason:clean(el.querySelector('p')?.innerText||'')})).filter(s=>s.equation||s.reason);
 const counts=atomCountsTable(original,balanced);
 return `<!doctype html><html><head><meta charset="utf-8"><title>Chemistry Equation Worksheet</title><style>
 @page{size:A4;margin:16mm 15mm 17mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#182235;margin:0;line-height:1.45;background:#fff}header{border-bottom:2px solid #dfe5ee;padding-bottom:12px;margin-bottom:18px}h1{font-size:24px;margin:0 0 3px}h2{font-size:16px;margin:20px 0 8px;color:#243b63}.brand{font-size:13px;color:#64748b;margin-bottom:5px}.subtitle{font-size:12px;color:#64748b}.meta{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0}.field{border-bottom:1px solid #aeb8c7;min-height:24px;font-size:11px;color:#64748b}.box{border:1px solid #d9e1ec;border-radius:10px;padding:12px 14px;margin:8px 0}.equation{font-size:21px;font-weight:700;text-align:center;padding:10px;white-space:normal;overflow-wrap:anywhere}.status{font-weight:700;font-size:13px}.good{color:#176b41}.original{background:#f7f9fc}.balanced{background:#f1faf4;border-color:#bfdfca}.count-table{width:100%;border-collapse:collapse;font-size:10px;margin-top:4px}.count-table th,.count-table td{border:1px solid #dfe5ee;padding:6px 7px;text-align:center}.count-table th{background:#f4f6f9}.count-table th:first-child,.count-table td:first-child{text-align:left}.step{border-left:3px solid #d9e3f2;padding:8px 0 8px 12px;margin:8px 0}.step-title{font-weight:700}.step-eq{font-size:16px;font-weight:700;margin:3px 0}.reason{font-size:11px;color:#556276}.footer{border-top:1px solid #dfe5ee;margin-top:22px;padding-top:8px;font-size:9px;color:#7b8798;display:flex;justify-content:space-between}.note{font-size:10px;color:#64748b;margin-top:10px}.blank-notes{min-height:70px}.notes-section{break-inside:avoid;page-break-inside:avoid}
 </style></head><body><header><div class="brand">⚗ Chemistry Equations · Student / Teacher Worksheet</div><h1>Equation Balancing Solution</h1><div class="subtitle">Printable study record with the original equation, balanced result, atom verification, and worked steps.</div></header>
 <div class="meta"><div class="field">Student name:</div><div class="field">Date:</div></div>
 <h2>1. Original equation</h2><div class="box original"><div class="equation">${esc(original)}</div></div>
 <h2>2. Balanced equation</h2><div class="box balanced"><div class="status good">${esc(status)}</div><div class="equation">${esc(balanced)}</div></div>
 <h2>3. Atom counts</h2><div class="box">${counts||'<div class="note">Atom counts could not be reconstructed from the displayed result.</div>'}</div>
 <h2>4. Step-by-step solution</h2><div class="box">${steps.length?steps.map(s=>`<div class="step"><div class="step-title">${esc(s.title)}</div><div class="step-eq">${esc(s.equation)}</div><div class="reason">${esc(s.reason)}</div></div>`).join(''):'<div class="note">The Balancer explanation is not available for this result.</div>'}</div>
 <section class="notes-section"><h2>5. Notes</h2><div class="box blank-notes"><div class="note">Student work / teacher feedback:</div></div></section>
 <div class="footer"><span>Chemistry Equations</span><span>Generated from the Balancer</span></div>
 <script>window.onload=()=>{window.focus();window.print();setTimeout(()=>window.close(),500)}</script></body></html>`;
}
function install(){
 if(out.querySelector('[data-export-pdf]'))return;
 const host=document.createElement('div');host.className='pdf-export-row';host.innerHTML='<button type="button" class="secondary" data-export-pdf>Export PDF</button><span class="pdf-export-hint">Student / teacher worksheet</span>';
 out.appendChild(host);
 host.querySelector('[data-export-pdf]').addEventListener('click',()=>{const w=window.open('','_blank','width=900,height=1100');if(!w){alert('Please allow pop-ups to export the PDF.');return}w.document.open();w.document.write(buildSheet());w.document.close()});
}
const observer=new MutationObserver(()=>{if(!out.classList.contains('hidden'))install()});observer.observe(out,{childList:true,subtree:true});
install();
})();
