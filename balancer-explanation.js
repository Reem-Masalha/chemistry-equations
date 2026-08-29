(()=>{
'use strict';
const input=document.getElementById('equationInput');
const out=document.getElementById('balanceResult');
if(!input||!out)return;
const ARROW_RE=/→|->|=>/;
const normalize=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'["₀₁₂₃₄₅₆₇₈₉".indexOf(c)]).replace(/⟶|⇒|➜|⟹|⟾/g,'→');
const pretty=s=>String(s||'').replace(/([A-Z][a-z]?)(\d+)/g,'$1<sub>$2</sub>');
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a};
const lcm=(a,b)=>Math.abs(a/gcd(a,b)*b);
function parseFormula(text){
  const s=String(text||'').replace(/\s+/g,'');let i=0;
  function group(close){
    const a={};
    while(i<s.length){
      if(close&&s[i]===close){i++;return a;}
      if(s[i]===')')throw Error('Invalid formula');
      if(s[i]==='('){i++;const g=group(')'),m=s.slice(i).match(/^\d+/),k=m?+m[0]:1;if(m)i+=m[0].length;for(const e in g)a[e]=(a[e]||0)+g[e]*k;continue;}
      const em=s.slice(i).match(/^[A-Z][a-z]?/);if(!em)throw Error('Invalid formula');
      const e=em[0];i+=e.length;const m=s.slice(i).match(/^\d+/),k=m?+m[0]:1;if(m)i+=m[0].length;a[e]=(a[e]||0)+k;
    }
    if(close)throw Error('Invalid formula');return a;
  }
  return group();
}
function parse(raw){
  const s=normalize(raw).trim();
  if(!ARROW_RE.test(s))return null;
  const parts=s.split(ARROW_RE);if(parts.length!==2)return null;
  const side=x=>x.split('+').map(z=>z.trim()).filter(Boolean).map(z=>{const m=z.match(/^(\d+)\s*(.+)$/),coef=m?+m[1]:1,formula=m?m[2]:z;return{formula,coef,atoms:parseFormula(formula)}});
  const left=side(parts[0]),right=side(parts[1]);if(!left.length||!right.length)return null;return{left,right};
}
function solve(eq){
  const all=[...eq.left,...eq.right],els=[...new Set(all.flatMap(x=>Object.keys(x.atoms)))],n=all.length,m=els.length;
  if(n<2)return null;
  const A=els.map(e=>all.map((x,i)=>(i<eq.left.length?1:-1)*(x.atoms[e]||0))),rows=A.map(r=>r.map(Number));
  let r=0,piv=[];
  for(let c=0;c<n&&r<m;c++){let q=r;for(let k=r+1;k<m;k++)if(Math.abs(rows[k][c])>Math.abs(rows[q][c]))q=k;if(Math.abs(rows[q][c])<1e-12)continue;[rows[r],rows[q]]=[rows[q],rows[r]];const d=rows[r][c];for(let j=c;j<n;j++)rows[r][j]/=d;for(let k=0;k<m;k++)if(k!==r){const f=rows[k][c];if(Math.abs(f)>1e-12)for(let j=c;j<n;j++)rows[k][j]-=f*rows[r][j]}piv.push(c);r++}
  const free=[];for(let c=0;c<n;c++)if(!piv.includes(c))free.push(c);if(!free.length)return null;
  let answer=null;
  function attempt(pos,vals){if(answer)return;if(pos===free.length){const v=Array(n).fill(0);free.forEach((c,i)=>v[c]=vals[i]);for(let q=piv.length-1;q>=0;q--){const c=piv[q];let z=0;for(let j=c+1;j<n;j++)z+=rows[q][j]*v[j];v[c]=-z;}if(v.some(x=>!Number.isFinite(x)||x<=0))return;let den=1;for(const x of v){for(let d=1;d<=1000;d++)if(Math.abs(x*d-Math.round(x*d))<1e-8){den=lcm(den,d);break;}}let co=v.map(x=>Math.round(x*den)),g=co.reduce(gcd,0);if(g)co=co.map(x=>x/g);if(co.some(x=>x<=0||x>100000))return;for(let i=0;i<m;i++){let sum=0;for(let j=0;j<n;j++)sum+=A[i][j]*co[j];if(sum!==0)return;}answer=co;return;}for(let x=1;x<=12;x++)attempt(pos+1,[...vals,x]);}
  attempt(0,[]);return answer;
}
function counts(eq,co){const all=[...eq.left,...eq.right],L={},R={};let i=0;for(const x of eq.left){const c=co[i++];for(const[e,n]of Object.entries(x.atoms))L[e]=(L[e]||0)+n*c}for(const x of eq.right){const c=co[i++];for(const[e,n]of Object.entries(x.atoms))R[e]=(R[e]||0)+n*c}return{L,R};}
function ratioText(nums){const g=nums.reduce(gcd,0)||1;return nums.map(x=>x/g).join(' : ')}
function equationWithCo(eq,co){let i=0;const side=a=>a.map(x=>{const c=co[i++];return `${c===1?'':c}${pretty(x.formula)}`}).join(' + ');return `${side(eq.left)} → ${side(eq.right)}`}
function scaleCo(co,mul){return co.map(x=>x*mul)}
function explain(eq,finalCo){
  const all=[...eq.left,...eq.right];
  const base=all.map(x=>x.coef);
  const original=base.slice();
  const steps=[];
  const working=base.slice();
  const total=(e,arr)=>{let s=0,i=0;for(const x of eq.left){s+=(x.atoms[e]||0)*arr[i++]}i=eq.left.length;for(const x of eq.right){s-=(x.atoms[e]||0)*arr[i++]}return s};
  const elements=[...new Set(all.flatMap(x=>Object.keys(x.atoms)))];
  for(const e of elements){
    if(total(e,working)===0)continue;
    let left=0,right=0,li=0,ri=eq.left.length;
    eq.left.forEach(x=>left+=(x.atoms[e]||0)*working[li++]);
    eq.right.forEach(x=>right+=(x.atoms[e]||0)*working[ri++]);
    if(!left||!right)continue;
    let changed=false;
    const leftCandidates=eq.left.map((x,i)=>({i,atoms:x.atoms[e]||0})).filter(x=>x.atoms>0).sort((a,b)=>b.atoms-a.atoms);
    const rightCandidates=eq.right.map((x,i)=>({i:i+eq.left.length,atoms:x.atoms[e]||0})).filter(x=>x.atoms>0).sort((a,b)=>b.atoms-a.atoms);
    if(rightCandidates.length){const target=right;const c=rightCandidates[0];if(target%c.atoms>0){working[c.i]=target/c.atoms;changed=true;}}
    if(leftCandidates.length&&total(e,working)!==0){const target=right;const c=leftCandidates[0];working[c.i]=target/c.atoms;changed=true;}
    if(changed)steps.push({element:e,co:working.slice(),reason:`Adjust the coefficient(s) containing ${e} so the number of ${e} atoms matches on both sides.`});
  }
  const nums=finalCo.slice();
  const denom=lcm(nums.reduce((a,b)=>lcm(a,b),1),1);
  const stageCo=working.some((x,i)=>x!==finalCo[i])?working.slice():original.slice();
  const normalized=stageCo.map(x=>Number.isInteger(x)?x: x);
  const finalScale=(()=>{let s=1;for(const x of normalized){if(Number.isInteger(x))continue;for(let d=1;d<=100;d++)if(Math.abs(x*d-Math.round(x*d))<1e-8){s=lcm(s,d);break;}}return s})();
  if(finalScale>1){const scaled=scaleCo(normalized,finalScale);steps.push({element:null,co:scaled,reason:`The temporary ratio contains fractions, so multiply every coefficient by ${finalScale}. This keeps the atom ratios unchanged and converts them to whole numbers.`});}
  if(!steps.length){
    steps.push({element:null,co:finalCo.slice(),reason:'The equation is already balanced, so no coefficient changes are required.'});
  }
  steps.push({element:null,co:finalCo.slice(),reason:`The coefficients are reduced to the smallest whole-number ratio: ${ratioText(finalCo)}.`});
  return steps;
}
function inject(){
  if(out.querySelector('#explanationToggle'))return;
  if(!out.querySelector('.equation'))return;
  const btn=document.createElement('button');btn.id='explanationToggle';btn.className='secondary explanation-toggle';btn.type='button';btn.textContent='Explanation';
  const panel=document.createElement('div');panel.id='balancingExplanation';panel.className='balancing-explanation';panel.hidden=true;
  btn.addEventListener('click',()=>{panel.hidden=!panel.hidden;btn.textContent=panel.hidden?'Explanation':'Hide explanation';});
  const eq=parse(input.value);if(!eq)return;const co=solve(eq);if(!co)return;
  const steps=explain(eq,co);
  panel.innerHTML=`<div class="explanation-title"><b>Step-by-step balancing</b><p>Each step explains why the coefficient changes and how the atom counts stay conserved.</p></div>${steps.map((s,i)=>{const label=s.element?`Step ${i+1}: Balance ${s.element}`:(i===steps.length-1?'Final:':'Step '+(i+1));return `<div class="explanation-step"><b>${label}</b><div class="explanation-equation">${equationWithCo(eq,s.co)}</div><p>${s.reason}</p></div>`}).join('')}`;
  const wrap=document.createElement('div');wrap.className='explanation-controls';wrap.append(btn,panel);out.appendChild(wrap);
}
const obs=new MutationObserver(()=>inject());obs.observe(out,{subtree:true,childList:true});inject();
})();
