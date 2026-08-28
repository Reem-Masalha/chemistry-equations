(()=>{
'use strict';
const input=document.getElementById('equationInput'),btn=document.getElementById('balanceBtn'),out=document.getElementById('balanceResult');
if(!input||!btn||!out)return;
const symbols=new Set('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr'.split(' '));
const subs={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
const normalize=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>subs[c]);
const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pretty=s=>escape(normalize(s)).replace(/([A-Z][a-z]?)(\d+)/g,'$1<sub>$2</sub>');
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a};
function parseFormula(s){
 s=normalize(s).replace(/\s+/g,'');let i=0;
 function group(close){const a={};while(i<s.length){if(close&&s[i]===close){i++;return a}if(s[i]===')')throw Error('Unexpected “)” in formula.');if(s[i]==='('){i++;const g=group(')');const n=s.slice(i).match(/^\d+/);const k=n?+n[0]:1;if(n)i+=n[0].length;for(const e in g)a[e]=(a[e]||0)+g[e]*k;continue}const em=s.slice(i).match(/^[A-Z][a-z]?/);if(!em)throw Error('Invalid formula near “'+s.slice(i)+'”.');const e=em[0];if(!symbols.has(e))throw Error('“'+e+'” is not a valid element symbol.');i+=e.length;const n=s.slice(i).match(/^\d+/);const k=n?+n[0]:1;if(n)i+=n[0].length;a[e]=(a[e]||0)+k}if(close)throw Error('Missing “)” in formula.');return a}
 return group();
}
function parseEquation(raw){
 const s=String(raw||'').trim();
 // Protect against the old bug: normalize arrow variants first, then count only canonical arrows.
 const normalized=s.replace(/[⟶⇒➜⟹⟾]/g,'→').replace(/->|=>/g,'→');
 const arrows=[...normalized.matchAll(/→/g)];
 if(arrows.length!==1){const e=new Error(arrows.length?'Use exactly one reaction arrow (→ or ->).':'Use exactly one reaction arrow (→ or ->).');e.kind='arrow';e.index=arrows.length?arrows[0].index:Math.max(0,s.length-1);e.length=arrows.length?1:0;throw e}
 const idx=arrows[0].index,left=normalized.slice(0,idx).trim(),right=normalized.slice(idx+1).trim();
 if(!left||!right){const e=new Error(!left?'The left side is empty.':'The right side is empty.');e.kind='side';e.index=!left?0:idx+1;e.length=1;throw e}
 const parseSide=t=>t.split('+').map((part,j)=>{const x=part.trim();if(!x){const e=new Error('An empty formula was found between “+” signs.');e.kind='formula';e.problem='empty formula';throw e}const m=x.match(/^(\d+)\s*(.+)$/),f=(m?m[2]:x).trim();try{return{f,c:m?+m[1]:1,a:parseFormula(f)}}catch(e){e.kind='formula';e.problem=f;throw e}});
 return {left:parseSide(left),right:parseSide(right),normalized};
}
function solve(eq){
 const all=[...eq.left,...eq.right],els=[...new Set(all.flatMap(x=>Object.keys(x.a)))],rows=els.map(e=>all.map((x,i)=>(i<eq.left.length?1:-1)*(x.a[e]||0))),n=all.length,m=rows.length;if(n<2)return null;
 let r=0,piv=[];for(let c=0;c<n&&r<m;c++){let p=r;for(let q=r+1;q<m;q++)if(Math.abs(rows[q][c])>Math.abs(rows[p][c]))p=q;if(Math.abs(rows[p][c])<1e-10)continue;[rows[r],rows[p]]=[rows[p],rows[r]];const d=rows[r][c];for(let j=c;j<n;j++)rows[r][j]/=d;for(let q=0;q<m;q++)if(q!==r){const f=rows[q][c];if(Math.abs(f)>1e-10)for(let j=c;j<n;j++)rows[q][j]-=f*rows[r][j]}piv.push(c);r++}
 const free=[];for(let c=0;c<n;c++)if(!piv.includes(c))free.push(c);if(!free.length)return null;const v=Array(n).fill(0);v[free[0]]=1;for(let q=piv.length-1;q>=0;q--){const c=piv[q];let z=0;for(let j=c+1;j<n;j++)z+=rows[q][j]*v[j];v[c]=-z}
 let den=1;for(const x of v)if(Math.abs(x)>1e-10){for(let d=1;d<=10000;d++)if(Math.abs(x*d-Math.round(x*d))<1e-7){den=den*d/gcd(den,d);break}}
 let co=v.map(x=>Math.round(x*den)),g=co.reduce((a,b)=>gcd(a,b),0);if(g)co=co.map(x=>x/g);if(co.some(x=>x<0))co=co.map(x=>-x);return co.some(x=>x<=0||x>100000)?null:co;
}
function highlight(raw,e){
 const s=String(raw||''),idx=Math.max(0,Math.min(Number(e?.index)||0,s.length));let len=e?.length||1;
 input.focus();try{input.setSelectionRange(idx,Math.min(s.length,idx+len))}catch{}
 const before=escape(s.slice(0,idx)),bad=escape(s.slice(idx,idx+len)||e?.problem||'?'),after=escape(s.slice(idx+len));
 return `<div class="problem-preview"><code>${before}<mark>${bad}</mark>${after}</code></div>`;
}
function error(e){out.classList.remove('hidden');input.setAttribute('aria-invalid','true');out.innerHTML=`<div class="validation-error"><b>⚠ Equation needs attention</b><p>${escape(e.message)}</p>${e.problem?`<p><b>Problem found:</b> ${escape(e.problem)}</p>`:''}${highlight(input.value,e)}<p class="muted"><b>Remember:</b> element symbols are case-sensitive. <code>Co</code> is cobalt; <code>CO</code> is carbon + oxygen.</p></div>`;}
function balance(){
 out.classList.add('hidden');input.removeAttribute('aria-invalid');
 try{const eq=parseEquation(input.value),co=solve(eq);if(!co){const e=new Error('These formulas cannot be balanced with a non-zero whole-number ratio.');e.kind='balance';e.index=0;e.length=input.value.length;throw e}let k=0;const side=a=>a.map(x=>{const c=co[k++];return(c===1?'':c)+pretty(x.f)}).join(' + ');out.innerHTML=`<div class="equation">${side(eq.left)} → ${side(eq.right)}</div><div class="steps-result"><b>Coefficients:</b> ${co.join(' : ')}<br><span class="muted">All element counts are conserved.</span></div>`;out.classList.remove('hidden')}catch(e){error(e)}
}
btn.addEventListener('click',balance);input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();balance()}});
document.querySelectorAll('[data-eq]').forEach(b=>b.addEventListener('click',()=>{input.value=normalize(b.dataset.eq);balance()}));
document.getElementById('exampleBtn')?.addEventListener('click',()=>{const a=['H2 + O2 → H2O','Fe + O2 → Fe2O3','C3H8 + O2 → CO2 + H2O','Ca(OH)2 + HCl → CaCl2 + H2O'];input.value=a[Math.floor(Math.random()*a.length)];balance()});
const canvas=document.getElementById('pad');if(canvas){const ctx=canvas.getContext('2d');if(ctx){ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';let down=false,erase=false;const pos=e=>{const r=canvas.getBoundingClientRect(),p=e.touches?.[0]||e;return{x:(p.clientX-r.left)*canvas.width/r.width,y:(p.clientY-r.top)*canvas.height/r.height}};const start=e=>{down=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);e.preventDefault()};const move=e=>{if(!down)return;const p=pos(e);ctx.globalCompositeOperation=erase?'destination-out':'source-over';ctx.lineTo(p.x,p.y);ctx.stroke();e.preventDefault()};const end=()=>{down=false;ctx.globalCompositeOperation='source-over'};canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);document.getElementById('clearPad')?.addEventListener('click',()=>ctx.clearRect(0,0,canvas.width,canvas.height));document.getElementById('erasePad')?.addEventListener('click',e=>{erase=!erase;e.currentTarget.textContent=erase?'Pen':'Eraser'})}}
})();