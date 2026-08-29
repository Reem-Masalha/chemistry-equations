(()=>{
'use strict';
const input=document.getElementById('checkInput');
const oldBtn=document.getElementById('checkBtn');
const out=document.getElementById('checkResult');
if(!input||!oldBtn||!out)return;

const btn=oldBtn.cloneNode(true);
oldBtn.replaceWith(btn);

const symbols=new Set('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr'.split(' '));
const sub='₀₁₂₃₄₅₆₇₈₉';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>String(sub.indexOf(c))).replace(/⟶|⇒|➜|⟹|⟾|=>|=/g,'→').replace(/\s+/g,' ').trim();
const pretty=s=>esc(norm(s)).replace(/([A-Z][a-z]?)(\d+)/g,'$1<sub>$2</sub>');
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a}
function gcdArr(a){return a.reduce(gcd,0)||1}
function parseFormula(text){
 const s=String(text).replace(/\s+/g,'');let i=0;
 function fail(msg,pos=i){const e=new Error(msg);e.pos=pos;throw e}
 function group(close){
  const a={};
  while(i<s.length){
   if(close&&s[i]===close){i++;return a}
   if(s[i]===')')fail('Invalid chemical formula: unexpected “)” .');
   if(s[i]==='('){i++;const g=group(')'),m=s.slice(i).match(/^\d+/),mult=m?+m[0]:1;if(m)i+=m[0].length;if(mult<=0)fail('Invalid chemical formula: subscript must be a positive whole number.');for(const e in g)a[e]=(a[e]||0)+g[e]*mult;continue;}
   const em=s.slice(i).match(/^[A-Z][a-z]?/);
   if(!em){const bad=s[i]||'';fail(bad?/Invalid chemical formula near “'+bad+'”./:'Invalid chemical formula.')}
   const e=em[0];if(!symbols.has(e))fail('Invalid element symbol: “'+e+'”.');i+=e.length;
   const m=s.slice(i).match(/^\d+/),mult=m?+m[0]:1;if(m)i+=m[0].length;
   if(mult<=0)fail('Invalid chemical formula: subscript must be a positive whole number.');
   a[e]=(a[e]||0)+mult;
  }
  if(close)fail('Invalid chemical formula: missing “)” .');return a;
 }
 return group();
}
function parseEquation(raw){
 const s=norm(raw);
 const arrows=[...s.matchAll(/→|->|=>/g)];
 if(arrows.length===0)return{error:'Please enter both sides of the equation.'};
 if(arrows.length!==1)return{error:'Please use exactly one reaction arrow (→, ->, or =>).'};
 const a=arrows[0],L=s.slice(0,a.index).trim(),R=s.slice(a.index+a[0].length).trim();
 if(!L||!R)return{error:'Please enter both sides of the equation.'};
 const parseSide=t=>t.split('+').map(rawItem=>{
  const item=rawItem.trim();if(!item)throw new Error('Please enter a formula on both sides of the equation.');
  const m=item.match(/^(\d+)\s*(.+)$/),coef=m?+m[1]:1,formula=(m?m[2]:item).trim();
  if(!formula)throw new Error('Please enter a formula on both sides of the equation.');
  let atoms;try{atoms=parseFormula(formula)}catch(e){e.message=e.message.startsWith('Invalid chemical formula')?e.message:'Invalid chemical formula: '+formula; e.problem=formula;throw e}
  return{coef,formula,atoms};
 });
 try{return{left:parseSide(L),right:parseSide(R)}}catch(e){return{error:e.message,problem:e.problem||null}}
}
function counts(side){const o={};for(const x of side)for(const[e,n]of Object.entries(x.atoms))o[e]=(o[e]||0)+n*x.coef;return o}
function elements(eq){return[...new Set([...Object.keys(counts(eq.left)),...Object.keys(counts(eq.right))])].sort()}
function balanced(eq){const L=counts(eq.left),R=counts(eq.right);return elements(eq).every(e=>(L[e]||0)===(R[e]||0))}
function solve(eq){
 const all=[...eq.left,...eq.right],els=elements(eq),n=all.length,m=els.length;if(n<2)return null;
 const A=els.map(e=>all.map((x,i)=>(i<eq.left.length?1:-1)*(x.atoms[e]||0)));let M=A.map(r=>r.map(Number)),r=0,piv=[];
 for(let c=0;c<n&&r<m;c++){let q=r;for(let k=r+1;k<m;k++)if(Math.abs(M[k][c])>Math.abs(M[q][c]))q=k;if(Math.abs(M[q][c])<1e-12)continue;[M[r],M[q]]=[M[q],M[r]];const d=M[r][c];for(let j=c;j<n;j++)M[r][j]/=d;for(let k=0;k<m;k++)if(k!==r){const f=M[k][c];if(Math.abs(f)>1e-12)for(let j=c;j<n;j++)M[k][j]-=f*M[r][j]}piv.push(c);r++}
 for(let k=r;k<m;k++)if(M[k].some(x=>Math.abs(x)>1e-10))return null;
 const free=[];for(let c=0;c<n;c++)if(!piv.includes(c))free.push(c);if(!free.length)return null;
 let answer=null;const vals=Array(free.length).fill(1);
 function attempt(pos){if(answer)return;if(pos===free.length){const v=Array(n).fill(0);free.forEach((c,i)=>v[c]=vals[i]);for(let q=piv.length-1;q>=0;q--){const c=piv[q];let z=0;for(let j=c+1;j<n;j++)z+=M[q][j]*v[j];v[c]=-z}if(v.some(x=>!Number.isFinite(x)||x<=1e-10))return;let den=1;for(const x of v){let found=false;for(let d=1;d<=1200;d++)if(Math.abs(x*d-Math.round(x*d))<1e-8){den=den*d/gcd(den,d);found=true;break}if(!found)return}let co=v.map(x=>Math.round(x*den)),g=gcdArr(co);co=co.map(x=>x/g);if(co.some(x=>x<=0||x>100000))return;for(let i=0;i<m;i++){let sum=0;for(let j=0;j<n;j++)sum+=A[i][j]*co[j];if(sum!==0)return}answer=co;return}for(let x=1;x<=12&&!answer;x++){vals[pos]=x;attempt(pos+1)}}
 attempt(0);return answer;
}
function format(eq,co){let i=0;const side=items=>items.map(x=>{const c=co[i++];return`${c===1?'':c}${pretty(x.formula)}`}).join(' + ');return`${side(eq.left)} <span class="checker-arrow">→</span> ${side(eq.right)}`}
function formatPlain(eq,co){let i=0;const side=items=>items.map(x=>{const c=co[i++];return`${c===1?'':c}${x.formula}`}).join(' + ');return`${side(eq.left)} → ${side(eq.right)}`}
function render(){
 const p=parseEquation(input.value);out.classList.remove('hidden');
 if(p.error){out.innerHTML=`<div class="checker-status checker-status-error"><span>!</span><div><b>Invalid equation</b><small>${esc(p.error)}</small>${p.problem?`<em class="checker-invalid-part">Problem: ${pretty(p.problem)}</em>`:''}</div></div>`;return}
 const L=counts(p.left),R=counts(p.right),els=elements(p),bad=els.filter(e=>(L[e]||0)!==(R[e]||0));
 const isBal=!bad.length;
 let corrected=null,correctedPlain='';if(!isBal){corrected=solve(p);if(corrected)correctedPlain=formatPlain(p,corrected)}
 const rows=els.map(e=>`<div class="atom-row ${bad.includes(e)?'atom-row-bad':''}"><b>${esc(e)}</b><span>${L[e]||0}</span><span>${R[e]||0}</span><strong>${bad.includes(e)?'✗':'✓'}</strong></div>`).join('');
 const nextAction=!isBal&&corrected?`<div class="checker-balance-cta"><div><b>Want to balance it?</b><small>Open the Balancer to get the corrected coefficients.</small></div><a class="primary checker-balance-button" href="index.html?equation=${encodeURIComponent(norm(input.value))}">Balance this equation →</a></div>`:'';
 const problems=!isBal?`<div class="checker-section checker-problems"><div class="checker-section-title"><b>Elements needing attention</b></div><div class="problem-chips">${bad.map(e=>`<span>${esc(e)}: ${L[e]||0} → ${R[e]||0}</span>`).join('')}</div></div>`:'';
 const correctedBox=corrected?`<div class="checker-section checker-correct"><div class="checker-section-title"><b>Balanced equation</b></div><div class="checker-equation">${format(p,corrected)}</div></div>`:'';
 const explanation=isBal?'Every element has the same atom count on both sides, so the equation is balanced.':`${bad.map(e=>`<div class="checker-explain-row"><b>${esc(e)}</b><span>${L[e]||0} atom${(L[e]||0)===1?'':'s'} on the left vs ${R[e]||0} on the right.</span></div>`).join('')}<p>Balance the equation by changing coefficients, not subscripts. The corrected form uses the smallest positive whole-number ratio.</p>`;
 out.innerHTML=`<div class="checker-status ${isBal?'checker-status-good':'checker-status-bad'}"><span>${isBal?'✓':'✗'}</span><div><b>${isBal?'Balanced':'Unbalanced equation'}</b><small>${isBal?'Every element matches on both sides.':'One or more element counts do not match.'}</small></div></div><div class="checker-section"><div class="checker-section-title"><b>Atom count</b><span>Left · Right</span></div><div class="atom-grid"><div></div><b>Left</b><b>Right</b><div></div></div>${rows}</div>${problems}${correctedBox}${nextAction}<div class="checker-section checker-explanation"><div class="checker-section-title"><b>Explanation</b></div>${explanation}</div>`;
}
btn.addEventListener('click',render);input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();render()}});
})();
