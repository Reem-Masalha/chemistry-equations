(()=>{
'use strict';
const input=document.getElementById('equationInput'),out=document.getElementById('balanceResult');
if(!input||!out)return;
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const prettyText=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'' );
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
function buildSheet(){
 const original=clean(input.value||'');
 const balanced=(out.querySelector('.balance-correction .equation,.equation')?.innerText||'').trim();
 const status=out.querySelector('.balance-status b')?.innerText||'';
 const steps=[...out.querySelectorAll('.balancing-explanation .explanation-step,.explanation-step')].map((el,i)=>({title:el.querySelector('b')?.innerText||`Step ${i+1}`,equation:el.querySelector('.explanation-equation')?.innerText||'',reason:el.querySelector('p')?.innerText||''}));
 const counts=[...out.querySelectorAll('.atom-row,.atom-count-row,.checker-explain-row')].map(el=>clean(el.innerText));
 const verification=[...out.querySelectorAll('.steps-result')].flatMap(el=>[...el.querySelectorAll('div,p')].map(x=>clean(x.innerText))).filter(Boolean);
 return `<!doctype html><html><head><meta charset="utf-8"><title>Chemistry Equation Worksheet</title><style>
 @page{size:A4;margin:16mm 15mm 17mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#182235;margin:0;line-height:1.45;background:#fff}header{border-bottom:2px solid #dfe5ee;padding-bottom:12px;margin-bottom:18px}h1{font-size:24px;margin:0 0 3px}h2{font-size:16px;margin:20px 0 8px;color:#243b63}h3{font-size:14px;margin:16px 0 5px}.brand{font-size:13px;color:#64748b;margin-bottom:5px}.subtitle{font-size:12px;color:#64748b}.meta{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0}.field{border-bottom:1px solid #aeb8c7;min-height:24px;font-size:11px;color:#64748b}.box{border:1px solid #d9e1ec;border-radius:10px;padding:12px 14px;margin:8px 0}.equation{font-size:21px;font-weight:700;text-align:center;padding:10px;white-space:normal;overflow-wrap:anywhere}.status{font-weight:700;font-size:13px}.good{color:#176b41}.original{background:#f7f9fc}.balanced{background:#f1faf4;border-color:#bfdfca}.count-table{width:100%;border-collapse:collapse;font-size:11px;margin-top:5px}.count-table th,.count-table td{border:1px solid #dfe5ee;padding:7px 8px;text-align:left}.count-table th{background:#f4f6f9}.step{border-left:3px solid #d9e3f2;padding:8px 0 8px 12px;margin:8px 0}.step-title{font-weight:700}.step-eq{font-size:16px;font-weight:700;margin:3px 0}.reason{font-size:11px;color:#556276}.checklist{font-size:11px;color:#556276}.footer{border-top:1px solid #dfe5ee;margin-top:22px;padding-top:8px;font-size:9px;color:#7b8798;display:flex;justify-content:space-between}.note{font-size:10px;color:#64748b;margin-top:10px}
 </style></head><body><header><div class="brand">⚗ Chemistry Equations · Student Worksheet</div><h1>Equation Balancing Solution</h1><div class="subtitle">A printable record for studying, review, or classroom use.</div></header>
 <div class="meta"><div class="field">Student name:</div><div class="field">Date:</div></div>
 <h2>1. Original equation</h2><div class="box original"><div class="equation">${esc(original)}</div></div>
 <h2>2. Result</h2><div class="box balanced"><div class="status good">${esc(status||'Balanced result')}</div><div class="equation">${esc(balanced||'')}</div></div>
 <h2>3. Atom counts</h2><div class="box">${counts.length?`<div class="checklist">${counts.map(x=>`<div>${esc(x)}</div>`).join('')}</div>`:`<div class="note">Atom-count details are shown in the balancing result when available.</div>`}</div>
 <h2>4. Step-by-step solution</h2><div class="box">${steps.length?steps.map(s=>`<div class="step"><div class="step-title">${esc(s.title)}</div><div class="step-eq">${esc(s.equation)}</div><div class="reason">${esc(s.reason)}</div></div>`).join(''):`<div class="note">Show the explanation on the Balancer first, then export again to include the full worked solution.</div>`}</div>
 <h2>5. Student / teacher notes</h2><div class="box" style="min-height:70px"><div class="note">Use this space for corrections, observations, or teacher comments.</div></div>
 <div class="footer"><span>Chemistry Equations</span><span>Generated from the Balancer</span></div>
 <script>window.onload=()=>{window.focus();window.print();setTimeout(()=>window.close(),400)}</script></body></html>`;
}
function install(){
 if(out.querySelector('[data-export-pdf]'))return;
 const host=document.createElement('div');host.className='pdf-export-row';host.innerHTML='<button type="button" class="secondary" data-export-pdf>Export PDF</button><span class="pdf-export-hint">Student/teacher worksheet</span>';
 out.appendChild(host);
 host.querySelector('[data-export-pdf]').addEventListener('click',()=>{
   const w=window.open('','_blank','width=900,height=1100');
   if(!w){alert('Please allow pop-ups to export the PDF.');return;}
   w.document.open();w.document.write(buildSheet());w.document.close();
 });
}
const observer=new MutationObserver(()=>{if(!out.classList.contains('hidden'))install()});observer.observe(out,{childList:true,subtree:true});
install();
})();
