(()=>{
'use strict';
const input=document.getElementById('checkInput'),btn=document.getElementById('checkBtn'),out=document.getElementById('checkResult');
if(!input||!btn||!out)return;
const cleanBtn=btn.cloneNode(true);btn.replaceWith(cleanBtn);
const symbols=new Set('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr'.split(' '));
const norm=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)]).replace(/⟶|⇒|➜|⟹|⟾|=>|->/g,'→').replace(/=(?!>)/g,'→').replace(/\s+/g,' ').trim();
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t}return a}
function parseFormula(s){s=String(s||'').replace(/\s+/g,'');let i=0;function fail(m,p){const e=new Error(m);e.problem=p||s.slice(i);throw e}function group(close){const a={};while(i<s.length){if(close&&s[i]===close){i++;return a}if(s[i]===')')fail('Unexpected closing parenthesis.',')');if(s[i]==='('){i++;const g=group(')'),m=s.slice(i).match(/^\d+/),k=m?+m[0]:1;if(m)i+=m[0].length;if(k<=0)fail('Subscripts must be positive whole numbers.',m?.[0]);for(const e in g)a[e]=(a[e]||0)+g[e]*k;continue}const m=s.slice(i).match(/^[A-Z][a-z]?/);if(!m){const t=s.slice(i);if(/^[a-z]/.test(t))fail(`Invalid element symbol “${s[i]}”.`,s[i]);fail(`Invalid chemical formula near “${t}”.`,t)}const e=m[0];if(!symbols.has(e))fail(`Invalid element symbol “${e}”.`,e);i+=e.length;const n=s.slice(i).match(/^\d+/),k=n?+n[0]:1;if(n)i+=n[0].length;if(k<=0)fail('Subscripts must be positive whole numbers.',n?.[0]);a[e]=(a[e]||0)+k}if(close)fail('Missing closing parenthesis.',close);return a}return group()}
function parse(raw){const s=norm(raw),a=[...s.matchAll(/→/g)];if(a.length!==1)return{error:a.length===0?'Please enter both sides of the equation.':'Please use exactly one reaction arrow.'};const x=a[0],L=s.slice(0,x.index).trim(),R=s.slice(x.index+1).trim();if(!L||!R)return{error:'Please enter both sides of the equation.'};const side=t=>t.split('+').map(v=>{const z=v.trim();if(!z)throw new Error('Please enter a formula on both sides of the equation.');const m=z.match(/^(\d+)\s*(.+)$/),coef=m?+m[1]:1,f=(m?m[2]:z).trim();if(coef<=0)throw new Error('Coefficients must be positive whole numbers.');try{return{coef,f,a:parseFormula(f)}}catch(e){throw new Error(`${e.message} Problem found: “${e.problem||f}”.`)}});try{return{left:side(L),right:side(R)}}catch(e){return{error:e.message}}}
function counts(side){const o={};for(const x of side)for(const[e,n]of Object.entries(x.a))o[e]=(o[e]||0)+n*x.coef;return o}
function elements(eq){return[...new Set([...Object.keys(counts(eq.left)),...Object.keys(counts(eq.right))])].sort()}
function solve(eq){
 const all=[...eq.left,...eq.right],es=elements(eq),n=all.length,m=es.length;
 if(n<2||n>10)return null;
 const A=es.map(e=>all.map((x,i)=>(i<eq.left.length?1:-1)*(x.a[e]||0)));
 let r=0,piv=[];
 for(let c=0;c<n&&r<m;c++){
  let q=r;for(let k=r+1;k<m;k++)if(Math.abs(A[k][c])>Math.abs(A[q][c]))q=k;
  if(Math.abs(A[q][c])<1e-12)continue;
  [A[r],A[q]]=[A[q],A[r]];const d=A[r][c];for(let j=c;j<n;j++)A[r][j]/=d;
  for(let k=0;k<m;k++)if(k!==r){const f=A[k][c];if(Math.abs(f)>1e-12)for(let j=c;j<n;j++)A[k][j]-=f*A[r][j]}
  piv.push(c);r++;
 }
 for(let k=r;k<m;k++)if(A[k].some(v=>Math.abs(v)>1e-10))return null;
 const free=[];for(let c=0;c<n;c++)if(!piv.includes(c))free.push(c);if(free.length!==1)return null;
 const v=Array(n).fill(0);v[free[0]]=1;
 for(let q=piv.length-1;q>=0;q--){const c=piv[q];let z=0;for(let j=c+1;j<n;j++)z+=A[q][j]*v[j];v[c]=-z}
 let den=1;for(const x of v){for(let d=1;d<=120;d++)if(Math.abs(x*d-Math.round(x*d))<1e-9){den=Math.abs(den*d/gcd(den,d));break}}
 let co=v.map(x=>Math.round(x*den)),g=co.reduce(gcd,0)||1;co=co.map(x=>x/g);if(co[0]<0)co=co.map(x=>-x);return co.every(x=>x>0&&x<=100000)?co:null;
}
function htmlEq(eq,co){let i=0;const side=a=>a.map(x=>{const c=co[i++];return(c===1?'':c)+esc(x.f).replace(/([A-Z][a-z]?)(\d+)/g,'$1<sub>$2</sub>')}).join(' + ');return side(eq.left)+' → '+side(eq.right)}
function run(){
 btn.disabled=true;btn.setAttribute('aria-busy','true');out.classList.remove('hidden');out.innerHTML='<div class="checker-status checker-status-good"><span>…</span><div><b>Checking equation</b><small>Comparing atom counts…</small></div></div>';
 setTimeout(()=>{
  try{
   const p=parse(input.value);if(p.error){out.innerHTML=`<div class="checker-status checker-status-error"><span>!</span><div><b>Invalid equation</b><small>${esc(p.error)}</small></div></div>`;return}
   const L=counts(p.left),R=counts(p.right),es=elements(p),bad=es.filter(e=>(L[e]||0)!==(R[e]||0));
   if(!bad.length){out.innerHTML='<div class="checker-status checker-status-good"><span>✓</span><div><b>Balanced</b><small>All atom counts match.</small></div></div>';return}
   const co=solve(p),rows=es.map(e=>`<div class="atom-row ${bad.includes(e)?'atom-row-bad':''}"><b>${esc(e)}</b><span>${L[e]||0}</span><span>${R[e]||0}</span><strong>${bad.includes(e)?'✗':'✓'}</strong></div>`).join('');
   const correction=co?`<div class="checker-section checker-correct"><div class="checker-section-title"><b>Balanced equation</b></div><div class="checker-equation">${htmlEq(p,co)}</div><div class="checker-balance-cta"><div><b>Need the balanced equation?</b><small>Open the Balancer to calculate the correct coefficients and see the solution.</small></div><a class="primary checker-balance-button" href="index.html?equation=${encodeURIComponent([...p.left,...p.right].map((x,i)=>(co[i]===1?'':co[i])+x.f).join(' → '))}">Open Balancer →</a></div></div>`:'<div class="checker-section"><b>This equation could not be solved automatically.</b><p>Check the formulas and coefficients.</p></div>';
   out.innerHTML=`<div class="checker-status checker-status-bad"><span>✗</span><div><b>Unbalanced equation</b><small>One or more element totals do not match.</small></div></div><div class="checker-section"><div class="checker-section-title"><b>Atom count</b><span>Left · Right</span></div><div class="atom-grid"><div></div><b>Left</b><b>Right</b><div></div></div>${rows}</div><div class="checker-section checker-problems"><div class="checker-section-title"><b>Elements needing attention</b></div><div class="problem-chips">${bad.map(e=>`<span>${esc(e)}: ${L[e]||0} → ${R[e]||0}</span>`).join('')}</div></div>${correction}<div class="checker-section checker-explanation"><div class="checker-section-title"><b>Explanation</b></div><p>The highlighted elements have different totals. Change coefficients—not subscripts—so each element has the same total on both sides.</p></div>`;
  }catch(e){out.innerHTML='<div class="checker-status checker-status-error"><span>!</span><div><b>Could not check the equation</b><small>Please check the equation and try again.</small></div></div>'}
  finally{btn.disabled=false;btn.removeAttribute('aria-busy')}
 },0);
}
cleanBtn.addEventListener('click',e=>{e.preventDefault();run()});
input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run()}});
})();
