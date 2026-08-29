(()=>{
'use strict';
const input=document.getElementById('equationInput'),btn=document.getElementById('balanceBtn'),out=document.getElementById('balanceResult');
if(!input||!btn||!out)return;
const symbols=new Set('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Hf Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr'.split(' '));
const digits='₀₁₂₃₄₅₆₇₈₉';
const normalize=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'[digits.indexOf(c)]).replace(/⟶|⇒|➜|⟹|⟾/g,'→').replace(/=/g,'→');
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pretty=s=>esc(normalize(s)).replace(/([A-Z][a-z]?)(\d+)/g,'$1<sub>$2</sub>');
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a};
const lcm=(a,b)=>Math.abs(a/gcd(a,b)*b);
const ARROW_RE=/→|->|=>/g;
function parseFormula(text){
  const s=String(text||'').replace(/\s+/g,''); let i=0;
  const fail=(message,pos=i)=>{const e=new Error(message);e.formulaIndex=pos;throw e};
  function group(close){
    const a={};
    while(i<s.length){
      if(close&&s[i]===close){i++;return a;}
      if(s[i]===')')fail('Unexpected “)” in formula.');
      if(s[i]==='('){
        i++; const g=group(')'); const n=s.slice(i).match(/^\d+/); const mult=n?+n[0]:1; if(n)i+=n[0].length;
        for(const e in g)a[e]=(a[e]||0)+g[e]*mult; continue;
      }
      const em=s.slice(i).match(/^[A-Z][a-z]?/);
      if(!em){const ch=s[i]||''; if(/[a-z]/.test(ch))fail('Element symbols must begin with a capital letter: “'+ch+'”.'); if(/\d/.test(ch))fail('A number cannot appear here.'); fail('Invalid formula near “'+s.slice(i)+'”.');}
      const e=em[0]; if(!symbols.has(e))fail('“'+e+'” is not a valid element symbol.'); i+=e.length;
      const n=s.slice(i).match(/^\d+/); const mult=n?+n[0]:1; if(n)i+=n[0].length;
      if(mult<=0)fail('Subscripts must be positive integers.'); a[e]=(a[e]||0)+mult;
    }
    if(close)fail('Missing “)” in formula.',s.length); return a;
  }
  return group();
}
function parseStage(raw,offset=0){
  const rawText=normalize(raw), leading=(rawText.match(/^\s*/)||[''])[0].length, s=rawText.trim(); offset+=leading;
  const arrows=[...s.matchAll(ARROW_RE)];
  if(arrows.length!==1){const e=new Error('Each reaction stage must contain exactly one reaction arrow (→ or ->).');e.kind='arrow';e.arrowCount=arrows.length;e.index=offset+(arrows[0]?.index??0);e.length=arrows[0]?.[0]?.length||0;throw e;}
  const a=arrows[0],idx=a.index,L=s.slice(0,idx).trim(),R=s.slice(idx+a[0].length).trim();
  if(!L||!R){const e=new Error(!L?'The left side is empty.':'The right side is empty.');e.kind='side';e.index=offset+(!L?0:idx+a[0].length);e.length=1;throw e;}
  const side=(t,base)=>t.split('+').map(x=>{const z=x.trim();if(!z){const e=new Error('An empty formula was found between “+” signs.');e.kind='formula';e.index=offset+base;e.length=1;throw e;}
    const m=z.match(/^(\d+)\s*(.+)$/),f=(m?m[2]:z).trim(),coef=m?+m[1]:1;if(coef<=0){const e=new Error('Coefficients must be positive whole numbers.');e.kind='formula';e.problem=f;e.index=offset+base+x.indexOf(f);e.length=1;throw e;}
    const formulaStart=base+x.indexOf(f);try{return{f,a:parseFormula(f),originalCoef:coef}}catch(e){e.kind='formula';e.problem=f;e.index=offset+formulaStart+(e.formulaIndex??0);e.length=1;throw e;}});
  return{left:side(L,0),right:side(R,idx+a[0].length)};
}
function splitStages(raw){
  const s=normalize(raw).trim(),arrows=[...s.matchAll(ARROW_RE)]; if(arrows.length<=1)return[{text:s,offset:0}];
  const result=[]; let start=0;
  for(let i=0;i<arrows.length;i++){const a=arrows[i], leftStart=start, left=s.slice(leftStart,a.index).trim();const rightStart=a.index+a[0].length;const rightEnd=i===arrows.length-1?s.length:arrows[i+1].index;const right=s.slice(rightStart,rightEnd).trim(); if(!left||!right){const e=new Error('Each reaction stage needs a reactant side and a product side.');e.kind='side';e.index=left?rightStart:a.index;e.length=1;throw e;} result.push({text:left+' -> '+right,offset:leftStart});start=rightStart;}
  return result;
}
function solve(eq){
  const all=[...eq.left,...eq.right],els=[...new Set(all.flatMap(x=>Object.keys(x.a)))],n=all.length,m=els.length;if(n<2)return null;
  const A=els.map(e=>all.map((x,i)=>(i<eq.left.length?1:-1)*(x.a[e]||0))),rows=A.map(r=>r.map(Number));let r=0,piv=[];
  for(let c=0;c<n&&r<m;c++){let q=r;for(let k=r+1;k<m;k++)if(Math.abs(rows[k][c])>Math.abs(rows[q][c]))q=k;if(Math.abs(rows[q][c])<1e-12)continue;[rows[r],rows[q]]=[rows[q],rows[r]];const d=rows[r][c];for(let j=c;j<n;j++)rows[r][j]/=d;for(let k=0;k<m;k++)if(k!==r){const f=rows[k][c];if(Math.abs(f)>1e-12)for(let j=c;j<n;j++)rows[k][j]-=f*rows[r][j]}piv.push(c);r++;}
  for(let k=r;k<m;k++)if(rows[k].some(x=>Math.abs(x)>1e-10))return null;
  const free=[];for(let c=0;c<n;c++)if(!piv.includes(c))free.push(c);if(!free.length)return null;
  const LIMIT=12,values=Array(free.length).fill(1);let answer=null;
  function attempt(pos){if(answer)return;if(pos===free.length){const v=Array(n).fill(0);for(let i=0;i<free.length;i++)v[free[i]]=values[i];for(let q=piv.length-1;q>=0;q--){const c=piv[q];let z=0;for(let j=c+1;j<n;j++)z+=rows[q][j]*v[j];v[c]=-z;}
      if(v.some(x=>!Number.isFinite(x)||x<=1e-10))return;let den=1;for(const x of v){let found=false;for(let d=1;d<=1000;d++)if(Math.abs(x*d-Math.round(x*d))<1e-8){den=lcm(den,d);found=true;break;}if(!found)return;}
      let co=v.map(x=>Math.round(x*den)),g=co.reduce((a,b)=>gcd(a,b),0);if(g)co=co.map(x=>x/g);if(co.some(x=>x<=0||x>100000))return;for(let i=0;i<m;i++){let sum=0;for(let j=0;j<n;j++)sum+=A[i][j]*co[j];if(sum!==0)return;}answer=co;return;}
    for(let x=1;x<=LIMIT&&!answer;x++){values[pos]=x;attempt(pos+1);}
  }
  attempt(0); return answer;
}
function atomCounts(eq,co){const all=[...eq.left,...eq.right],L={},R={};let i=0;for(const x of eq.left){const c=co[i++];for(const [e,n] of Object.entries(x.a))L[e]=(L[e]||0)+n*c;}for(const x of eq.right){const c=co[i++];for(const [e,n] of Object.entries(x.a))R[e]=(R[e]||0)+n*c;}return{L,R};}
function isBalanced(eq){const all=[...eq.left,...eq.right];const co=all.map(x=>x.originalCoef),{L,R}=atomCounts(eq,co),els=[...new Set([...Object.keys(L),...Object.keys(R)])];return els.every(e=>(L[e]||0)===(R[e]||0));}
function changedMarkup(item,newCoef){const changed=item.originalCoef!==newCoef;const coef=newCoef===1?'':String(newCoef);return `<span class="coefficient ${changed?'coefficient-changed':''}" title="${changed?'Coefficient changed from '+item.originalCoef+' to '+newCoef:''}">${coef}</span>${pretty(item.f)}`;}
function renderBalanced(eq,co){let i=0;const side=a=>a.map(item=>changedMarkup(item,co[i++])).join(' + ');return `${side(eq.left)} <span class="reaction-arrow">→</span> ${side(eq.right)}`;}
function preview(s,e){let i=Math.max(0,Math.min(e.index||0,s.length)),l=Math.max(0,e.length||0);const problem=String(e.problem||'');if(problem){const exact=s.indexOf(problem);if(exact>=0){i=exact;l=Math.max(1,problem.length);}}return `<div class="problem-preview"><code>${pretty(s.slice(0,i))}${l?`<mark>${pretty(s.slice(i,i+l))}</mark>`:''}${pretty(s.slice(i+l))}</code></div>`;}
function setStatus(kind,text){out.setAttribute('data-status',kind);const icon=kind==='good'?'✓':kind==='bad'?'✗':'⚠';return `<div class="balance-status balance-status-${kind}"><b>${icon} ${text}</b></div>`;}
function showError(e){out.classList.remove('hidden');input.setAttribute('aria-invalid','true');out.innerHTML=`${setStatus('bad','Invalid equation')}<div class="validation-error"><p>${esc(e.message)}</p>${e.arrowCount>1?`<p class="muted">I found ${e.arrowCount} arrows. Each stage must contain exactly one arrow.</p>`:''}${e.problem?`<p><b>Problem found:</b> ${pretty(e.problem)}</p>`:''}${preview(input.value,e)}<p class="muted"><b>Remember:</b> element symbols are case-sensitive. <code>Co</code> is cobalt; <code>CO</code> is carbon + oxygen.</p></div>`;if(e.length){input.focus();try{input.setSelectionRange(e.index,e.index+e.length)}catch{}}}
function balance(){
  out.classList.add('hidden');input.removeAttribute('aria-invalid');
  try{const raw=String(input.value||'').trim();if(!raw)throw Object.assign(new Error('Enter a chemical reaction first.'),{index:0,length:0});
    const stages=splitStages(raw),results=stages.map(balanceStage),already=results.map(r=>isBalanced(r.eq));
    if(stages.length===1){const r=results[0];out.innerHTML=`${setStatus('good',already[0]?'Balanced':'Balanced after coefficient changes')}<div class="equation">${renderBalanced(r.eq,r.coefficients)}</div><div class="steps-result"><b>${already[0]?'✓ This equation was already balanced.':'✓ Balanced.'}</b><br><span class="muted">Every element count is conserved. <span class="coefficient-changed-legend">Highlighted coefficients were changed.</span></span></div>`;}
    else{out.innerHTML=`${setStatus('good','Balanced')}<div class="steps-result"><b>Sequential reactions:</b> each reaction stage was checked and balanced independently.</div><div class="multi-stage-equations">${results.map((r,i)=>`<div class="reaction-stage"><div class="stage-label">Stage ${i+1}</div><div class="equation">${renderBalanced(r.eq,r.coefficients)}</div><div class="stage-atoms">Coefficients: ${r.coefficients.join(' : ')} · ${already[i]?'Already balanced':'Balanced'}</div></div>`).join('')}</div><div class="steps-result"><span class="muted">Every element count is conserved in every stage.</span></div>`;}
    out.classList.remove('hidden');
  }catch(e){showError(e);}
}
function balanceStage(stage){const eq=parseStage(stage.text,stage.offset),co=solve(eq);if(!co){const e=new Error('This reaction stage cannot be balanced with a positive whole-number ratio.');e.kind='balance';throw e;}return{html:'',coefficients:co,eq};}
btn.addEventListener('click',balance);input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();balance()}});
document.querySelectorAll('[data-eq]').forEach(b=>b.addEventListener('click',()=>{input.value=normalize(b.dataset.eq);balance()}));
document.getElementById('exampleBtn')?.addEventListener('click',()=>{const a=['H2 + O2 → H2O','Fe + O2 → Fe2O3','C3H8 + O2 → CO2 + H2O','Ca(OH)2 + HCl → CaCl2 + H2O'];input.value=a[Math.floor(Math.random()*a.length)];balance()});
document.getElementById('resetBtn')?.addEventListener('click',()=>{input.value='H2 + O2 → H2O';out.classList.add('hidden');out.removeAttribute('data-status');input.removeAttribute('aria-invalid');input.focus();});
document.getElementById('clearBtn')?.addEventListener('click',()=>{input.value='';out.classList.add('hidden');out.removeAttribute('data-status');input.removeAttribute('aria-invalid');input.focus();});
})();