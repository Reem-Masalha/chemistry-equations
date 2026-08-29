(()=>{
'use strict';
const input=document.getElementById('checkInput');
const btn=document.getElementById('checkBtn');
const out=document.getElementById('checkResult');
if(!input||!btn||!out)return;
const symbols=new Set('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr'.split(' '));
const toAscii=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'["₀₁₂₃₄₅₆₇₈₉".indexOf(c)]).replace(/[⟶⇒➜⟹⟾]/g,'→').replace(/=/g,'→').trim();
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pretty=s=>esc(toAscii(s)).replace(/([A-Z][a-z]?)(\d+)/g,'$1<sub>$2</sub>');
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a};
function parseFormula(text){
  const s=String(text||'').replace(/\s+/g,'');let i=0;
  const fail=(message,pos=i)=>{const e=new Error(message);e.pos=pos;throw e};
  function group(close){
    const a={};
    while(i<s.length){
      if(close&&s[i]===close){i++;return a;}
      if(s[i]===')')fail('Unexpected closing parenthesis.');
      if(s[i]==='('){i++;const g=group(')'),m=s.slice(i).match(/^\d+/),mult=m?+m[0]:1;if(m)i+=m[0].length;if(mult<=0)fail('Subscripts must be positive whole numbers.');for(const e in g)a[e]=(a[e]||0)+g[e]*mult;continue;}
      const m=s.slice(i).match(/^[A-Z][a-z]?/);
      if(!m){const ch=s[i]||'';if(/[a-z]/.test(ch))fail(`Invalid element symbol “${ch}”.`);if(/\d/.test(ch))fail('A number cannot appear at the start of a formula.');fail('Invalid chemical formula.');}
      const e=m[0];if(!symbols.has(e))fail(`Invalid element symbol “${e}”.`);i+=e.length;const n=s.slice(i).match(/^\d+/),mult=n?+n[0]:1;if(n)i+=n[0].length;if(mult<=0)fail('Subscripts must be positive whole numbers.');a[e]=(a[e]||0)+mult;
    }
    if(close)fail('Missing closing parenthesis.');return a;
  }
  return group();
}
function parseEquation(raw){
  const s=toAscii(raw).replace(/\s+/g,' ');
  const arrows=[...s.matchAll(/→|->|=>/g)];
  if(arrows.length!==1)return {error: arrows.length===0?'Please enter both sides of the equation.':'Please use exactly one reaction arrow (→).'};
  const a=arrows[0],L=s.slice(0,a.index).trim(),R=s.slice(a.index+a[0].length).trim();
  if(!L||!R)return {error:'Please enter both sides of the equation.'};
  const side=t=>t.split('+').map(x=>x.trim());
  const parseSide=t=>side(t).map(item=>{if(!item)return null;const m=item.match(/^(\d+)\s*(.+)$/),coef=m?+m[1]:1,formula=(m?m[2]:item).trim();if(!formula)throw new Error('Please enter a formula on both sides of the equation.');return{coef,formula,atoms:parseFormula(formula)}});
  try{return{left:parseSide(L),right:parseSide(R),raw:s}}catch(e){return{error:e.message,problem:e.pos}};
}
function atomCounts(side){const c={};for(const item of side){for(const[e,n]of Object.entries(item.atoms))c[e]=(c[e]||0)+n*item.coef}return c;}
function allElements(eq){return [...new Set([...Object.keys(atomCounts(eq.left)),...Object.keys(atomCounts(eq.right))])].sort();}
function isBalanced(eq){const L=atomCounts(eq.left),R=atomCounts(eq.right);return allElements(eq).every(e=>(L[e]||0)===(R[e]||0));}
function matrixSolve(eq){
  const all=[...eq.left,...eq.right],els=allElements(eq),n=all.length,m=els.length;if(n<2)return null;
  const A=els.map(e=>all.map((x,i)=>(i<eq.left.length?1:-1)*(x.atoms[e]||0))).map(r=>r.map(Number));
  let r=0,piv=[];
  for(let c=0;c<n&&r<m;c++){let q=r;for(let k=r+1;k<m;k++)if(Math.abs(A[k][c])>Math.abs(A[q][c]))q=k;if(Math.abs(A[q][c])<1e-12)continue;[A[r],A[q]]=[A[q],A[r]];const d=A[r][c];for(let j=c;j<n;j++)A[r][j]/=d;for(let k=0;k<m;k++)if(k!==r){const f=A[k][c];if(Math.abs(f)>1e-12)for(let j=c;j<n;j++)A[k][j]-=f*A[r][j]}piv.push(c);r++;}
  for(let k=r;k<m;k++)if(A[k].some(x=>Math.abs(x)>1e-10))return null;
  const free=[];for(let c=0;c<n;c++)if(!piv.includes(c))free.push(c);if(!free.length)return null;
  let answer=null;const vals=Array(free.length).fill(1);
  const gcdArr=a=>a.reduce(gcd,0)||1;
  function attempt(pos){
    if(answer)return;
    if(pos===free.length){const v=Array(n).fill(0);free.forEach((c,i)=>v[c]=vals[i]);for(let q=piv.length-1;q>=0;q--){const c=piv[q];let z=0;for(let j=c+1;j<n;j++)z+=A[q][j]*v[j];v[c]=-z;}if(v.some(x=>!Number.isFinite(x)||x<=1e-10))return;let den=1;for(const x of v){for(let d=1;d<=1200;d++){if(Math.abs(x*d-Math.round(x*d))<1e-8){den=den*d/gcd(den,d);break;}}}let co=v.map(x=>Math.round(x*den)),g=gcdArr(co);co=co.map(x=>x/g);if(co.some(x=>x<=0||x>100000))return;for(let i=0;i<m;i++){let sum=0;for(let j=0;j<n;j++)sum+=els[i]===undefined?0:A[i][j]*co[j];if(sum!==0)return;}answer=co;return;}
    for(let x=1;x<=12&&!answer;x++){vals[pos]=x;attempt(pos+1)}
  }
  attempt(0);return answer;
}
function formatBalanced(eq,co){let i=0;const side=items=>items.map(x=>{const c=co[i++];return `${c===1?'':c}${pretty(x.formula)}`}).join(' + ');return `${side(eq.left)} <span class="checker-arrow">→</span> ${side(eq.right)}`}
function explanation(eq,bad,balancedText){
  if(!bad.length)return 'Every element has the same atom count on both sides, so no coefficient changes are needed.';
  const L=atomCounts(eq.left),R=atomCounts(eq.right);
  const lines=bad.map(e=>`<div class="checker-explain-row"><b>${esc(e)}</b><span>${L[e]||0} atom${(L[e]||0)===1?'':'s'} on the left vs ${R[e]||0} on the right.</span></div>`).join('');
  return `<p>These elements are not conserved. Balancing means changing <b>coefficients</b>, not subscripts, until every element has the same total on both sides.</p>${lines}${balancedText?`<p>Using the smallest positive whole-number coefficient ratio gives <b>${balancedText}</b>.</p>`:'<p>A whole-number balanced form could not be calculated for this reaction.</p>'}`;
}
function render(){
  const p=parseEquation(input.value);
  out.classList.remove('hidden');
  if(p.error){out.innerHTML=`<div class="checker-status checker-status-error"><span>!</span><div><b>Invalid equation</b><small>${esc(p.error)}</small></div></div>`;return;}
  const L=atomCounts(p.left),R=atomCounts(p.right),els=allElements(p),bad=els.filter(e=>(L[e]||0)!==(R[e]||0));
  let solved=null, solvedText='';if(bad.length){solved=matrixSolve(p);if(solved)solvedText=formatBalanced(p,solved)}
  const balanced=!bad.length;
  const rows=els.map(e=>`<div class="atom-row ${bad.includes(e)?'atom-row-bad':''}"><b>${esc(e)}</b><span>${L[e]||0}</span><span>${R[e]||0}</span><strong>${bad.includes(e)?'✗':'✓'}</strong></div>`).join('');
  out.innerHTML=`<div class="checker-status ${balanced?'checker-status-good':'checker-status-bad'}"><span>${balanced?'✓':'✗'}</span><div><b>${balanced?'Balanced':'Unbalanced equation'}</b><small>${balanced?'Every element has the same number of atoms on both sides.':'The atom counts do not match for one or more elements.'}</small></div></div>
  <div class="checker-section"><div class="checker-section-title"><b>Atom count</b><span>Left · Right</span></div><div class="atom-grid"><div></div><b>Left</b><b>Right</b><div class="atom-grid-mark"></div></div>${rows}</div>
  ${bad.length?`<div class="checker-section checker-problems"><div class="checker-section-title"><b>Elements needing attention</b></div><div class="problem-chips">${bad.map(e=>`<span>${esc(e)}: ${L[e]||0} → ${R[e]||0}</span>`).join('')}</div></div>`:''}
  ${solvedText?`<div class="checker-section checker-correct"><div class="checker-section-title"><b>Correct balanced equation</b></div><div class="checker-equation">${solvedText}</div></div>`:''}
  <div class="checker-section checker-explanation"><div class="checker-section-title"><b>Explanation</b></div>${explanation(p,bad,solved?formatPlain(p,solved):'')}</div>`;
}
function formatPlain(eq,co){let i=0;const side=items=>items.map(x=>{const c=co[i++];return `${c===1?'':c}${x.formula}`}).join(' + ');return `${side(eq.left)} → ${side(eq.right)}`}
btn.addEventListener('click',render);input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();render()}});
})();