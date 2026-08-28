(()=>{
'use strict';
const input=document.getElementById('equationInput'),btn=document.getElementById('balanceBtn'),out=document.getElementById('balanceResult');
if(!input||!btn||!out)return;
const symbols=new Set('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr'.split(' '));
const normalize=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)]);
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pretty=s=>esc(normalize(s)).replace(/([A-Z][a-z]?)(\d+)/g,'$1<sub>$2</sub>');
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a};
const ARROW_RE=/→|->|=>|⟶|⇒|➜|⟹|⟾/g;

function formula(s){
 s=normalize(s).replace(/\s+/g,'');
 let i=0;
 function group(close){
  const a={};
  while(i<s.length){
   if(close&&s[i]===close){i++;return a}
   if(s[i]===')')throw Error('Unexpected “)” in formula.');
   if(s[i]==='('){
    i++;const g=group(')'),m=s.slice(i).match(/^\d+/),k=m?+m[0]:1;
    if(m)i+=m[0].length;
    for(const e in g)a[e]=(a[e]||0)+g[e]*k;
    continue;
   }
   const m=s.slice(i).match(/^[A-Z][a-z]?/);
   if(!m)throw Error('Invalid formula near “'+s.slice(i)+'”.');
   const e=m[0];
   if(!symbols.has(e))throw Error('“'+e+'” is not a valid element symbol.');
   i+=e.length;
   const n=s.slice(i).match(/^\d+/),k=n?+n[0]:1;
   if(n)i+=n[0].length;
   a[e]=(a[e]||0)+k;
  }
  if(close)throw Error('Missing “)” in formula.');
  return a;
 }
 return group();
}

function parseStage(raw,offset=0){
 const s=String(raw||'').trim();
 const arrows=[...s.matchAll(ARROW_RE)];
 if(arrows.length!==1){
  const e=new Error('Each reaction stage must contain exactly one reaction arrow (→ or ->).');
  e.kind='arrow';e.arrowCount=arrows.length;e.index=offset+(arrows[0]?.index??0);e.length=arrows[0]?.[0]?.length||0;throw e;
 }
 const a=arrows[0],idx=a.index,L=s.slice(0,idx).trim(),R=s.slice(idx+a[0].length).trim();
 if(!L||!R){const e=new Error(!L?'The left side is empty.':'The right side is empty.');e.kind='side';e.index=offset+(!L?0:idx+a[0].length);e.length=1;throw e}
 const side=(t,base)=>t.split('+').map(x=>{
  const z=x.trim();
  if(!z){const e=new Error('An empty formula was found between “+” signs.');e.kind='formula';e.index=offset+base; e.length=1;throw e}
  const m=z.match(/^(\d+)\s*(.+)$/),f=(m?m[2]:z).trim();
  try{return{f,a:formula(f)}}catch(e){e.kind='formula';e.problem=f;e.index=offset+base+x.indexOf(f);e.length=Math.max(1,f.length);throw e}
 });
 return{left:side(L,0),right:side(R,idx+a[0].length)};
}

function splitStages(raw){
 const s=String(raw||'').trim();
 const arrows=[...s.matchAll(ARROW_RE)];
 if(arrows.length<=1)return[{text:s,offset:0}];
 const stages=[];let start=0;
 for(const a of arrows){
  const end=a.index+a[0].length;
  if(stages.length===0){
   stages.push({text:s.slice(0,end),offset:start});
  }else{
   const prevEnd=stages[stages.length-1]._end;
   stages.push({text:s.slice(prevEnd,end),offset:prevEnd});
  }
  stages[stages.length-1]._end=end;
 }
 // Convert arrow-separated chain into adjacent reaction stages:
 // A -> B -> C becomes A -> B and B -> C.
 const parts=[];let p=0;
 for(const a of arrows){parts.push({leftStart:p,arrowStart:a.index,arrowEnd:a.index+a[0].length});p=a.index+a[0].length}
 const result=[];
 for(let i=0;i<parts.length;i++){
  const left=i===0?s.slice(0,parts[i].arrowStart).trim():s.slice(parts[i-1].arrowEnd,parts[i].arrowStart).trim();
  const right=i===parts.length-1?s.slice(parts[i].arrowEnd).trim():s.slice(parts[i].arrowEnd,parts[i+1].arrowStart).trim();
  const leftPos=i===0?0:parts[i-1].arrowEnd;
  result.push({text:left+' -> '+right,offset:leftPos});
 }
 return result;
}

function solve(eq){
 const all=[...eq.left,...eq.right],els=[...new Set(all.flatMap(x=>Object.keys(x.a)))],rows=els.map(e=>all.map((x,i)=>(i<eq.left.length?1:-1)*(x.a[e]||0))),n=all.length,m=rows.length;
 if(n<2)return null;
 let r=0,p=[];
 for(let c=0;c<n&&r<m;c++){
  let q=r;for(let k=r+1;k<m;k++)if(Math.abs(rows[k][c])>Math.abs(rows[q][c]))q=k;
  if(Math.abs(rows[q][c])<1e-10)continue;
  [rows[r],rows[q]]=[rows[q],rows[r]];const d=rows[r][c];
  for(let j=c;j<n;j++)rows[r][j]/=d;
  for(let k=0;k<m;k++)if(k!==r){const f=rows[k][c];if(Math.abs(f)>1e-10)for(let j=c;j<n;j++)rows[k][j]-=f*rows[r][j]}
  p.push(c);r++;
 }
 const free=[];for(let c=0;c<n;c++)if(!p.includes(c))free.push(c);
 if(!free.length)return null;
 const v=Array(n).fill(0);v[free[0]]=1;
 for(let q=p.length-1;q>=0;q--){const c=p[q];let z=0;for(let j=c+1;j<n;j++)z+=rows[q][j]*v[j];v[c]=-z}
 let den=1;
 for(const x of v)if(Math.abs(x)>1e-10)for(let d=1;d<=10000;d++)if(Math.abs(x*d-Math.round(x*d))<1e-7){den=den*d/gcd(den,d);break}
 let co=v.map(x=>Math.round(x*den)),g=co.reduce((a,b)=>gcd(a,b),0);if(g)co=co.map(x=>x/g);if(co.some(x=>x<0))co=co.map(x=>-x);
 return co.some(x=>x<=0||x>100000)?null:co;
}

function balanceStage(stage){
 const eq=parseStage(stage.text,stage.offset),co=solve(eq);
 if(!co){const e=new Error('This reaction stage cannot be balanced with a non-zero whole-number ratio.');e.kind='balance';throw e}
 let k=0;
 const side=a=>a.map(x=>{const c=co[k++];return(c===1?'':c)+pretty(x.f)}).join(' + ');
 return{html:`${side(eq.left)} → ${side(eq.right)}`,coefficients:co};
}

function preview(s,e){const i=Math.max(0,Math.min(e.index||0,s.length)),l=Math.max(0,e.length||0);return `<div class="problem-preview"><code>${esc(s.slice(0,i))}${l?`<mark>${esc(s.slice(i,i+l))}</mark>`:''}${esc(s.slice(i+l))}</code></div>`}

function showError(e){
 out.classList.remove('hidden');input.setAttribute('aria-invalid','true');
 const extra=e.arrowCount>1?`<p class="muted">I found ${e.arrowCount} arrows. The balancer treats them as sequential reaction stages and balances each stage separately.</p>`:'';
 out.innerHTML=`<div class="validation-error"><b>⚠ Equation needs attention</b><p>${esc(e.message)}</p>${extra}${e.problem?`<p><b>Problem found:</b> ${esc(e.problem)}</p>`:''}${preview(input.value,e)}<p class="muted"><b>Remember:</b> element symbols are case-sensitive. <code>Co</code> is cobalt; <code>CO</code> is carbon + oxygen.</p></div>`;
 if(e.length){input.focus();try{input.setSelectionRange(e.index,e.index+e.length)}catch{}}
}

function balance(){
 out.classList.add('hidden');input.removeAttribute('aria-invalid');
 try{
  const raw=String(input.value||'').trim();if(!raw)throw Object.assign(new Error('Enter a chemical reaction first.'),{index:0,length:0});
  const stages=splitStages(raw);
  const results=stages.map(balanceStage);
  out.innerHTML=`${stages.length>1?`<div class="steps-result"><b>Sequential reaction:</b> each arrow was balanced as its own reaction stage.</div>`:''}<div class="equation">${results.map(x=>x.html).join(' → ')}</div><div class="steps-result"><b>All stages balanced.</b>${results.length>1?`<br><span class="muted">Stage coefficients: ${results.map((x,i)=>`Stage ${i+1}: ${x.coefficients.join(' : ')}`).join(' · ')}</span>`:''}<br><span class="muted">Every element count is conserved in every stage.</span></div>`;
  out.classList.remove('hidden');
 }catch(e){showError(e)}
}

btn.addEventListener('click',balance);
input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();balance()}});
document.querySelectorAll('[data-eq]').forEach(b=>b.addEventListener('click',()=>{input.value=normalize(b.dataset.eq);balance()}));
document.getElementById('exampleBtn')?.addEventListener('click',()=>{const a=['H2 + O2 → H2O','Fe + O2 → Fe2O3','C3H8 + O2 → CO2 + H2O','Ca(OH)2 + HCl → CaCl2 + H2O'];input.value=a[Math.floor(Math.random()*a.length)];balance()});
})();