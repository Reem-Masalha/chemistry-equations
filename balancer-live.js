(()=>{
'use strict';
const input=document.getElementById('equationInput'), balanceBtn=document.getElementById('balanceBtn'), result=document.getElementById('balanceResult');
if(!input||!balanceBtn||!result)return;
const E=new Set('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr'.split(' '));
const sub={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
const norm=s=>String(s??'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>sub[c]);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pretty=s=>esc(norm(s)).replace(/([A-Z][a-z]?)(\d+)/g,'$1<sub>$2</sub>');
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t}return a};

function formula(s){
 s=norm(s).replace(/\s/g,'');let i=0;
 function group(end){
  const out={};
  while(i<s.length){
   if(end&&s[i]===end){i++;return out}
   if(s[i]===')')throw Error('Unexpected closing parenthesis “)” in the formula.');
   if(s[i]==='('){i++;const n=group(')');const m=s.slice(i).match(/^\d+/);const k=m?+m[0]:1;if(m)i+=m[0].length;for(const x in n)out[x]=(out[x]||0)+n[x]*k;continue}
   const m=s.slice(i).match(/^[A-Z][a-z]?/);
   if(!m)throw Error('Invalid formula near “'+(s.slice(i).match(/^\w+/)?.[0]||s[i])+'”.');
   const x=m[0];if(!E.has(x))throw Error('“'+x+'” is not a valid element symbol.');i+=x.length;
   const n=s.slice(i).match(/^\d+/);const k=n?+n[0]:1;if(n)i+=n[0].length;out[x]=(out[x]||0)+k
  }
  if(end)throw Error('Missing closing parenthesis “)”.');return out
 }
 return group()
}

function parse(raw){
 const original=String(raw??'').trim();
 // Accept all common single reaction-arrow spellings. Do NOT treat a normal hyphen as an arrow.
 const arrowRe=/(?:→|⟶|⇒|➜|⟹|⟾|->|=>)/g;
 const matches=[...original.matchAll(arrowRe)];
 if(matches.length!==1){
  const detail=matches.length===0?'No reaction arrow was found. Use → or ->.':`Found ${matches.length} reaction arrows. Use exactly one → or ->.`;
  const pos=matches.length?matches[0].index:Math.max(0,original.length-1);
  const err=new Error(detail);err.kind='arrow';err.index=pos;err.problem=matches.length?'reaction arrow(s)':'the reaction arrow';throw err
 }
 const m=matches[0], arrow=m[0];
 const left=original.slice(0,m.index).trim(), right=original.slice(m.index+arrow.length).trim();
 if(!left||!right){const err=new Error(!left?'The left side of the equation is empty.':'The right side of the equation is empty.');err.kind='side';err.index=!left?0:m.index+arrow.length;err.problem=!left?'left side':'right side';throw err}
 const canonical=left+' → '+right;
 const sides=canonical.split('→').map(x=>x.trim());
 const side=t=>t.split('+').map(x=>x.trim()).map(x=>{
  if(!x){const e=new Error('An empty formula was found between “+” signs.');e.kind='formula';e.problem='empty formula';throw e}
  const cm=x.match(/^(\d+)\s*(.*)$/), f=cm?cm[2]:x;
  if(!f){const e=new Error('A coefficient is missing its formula.');e.kind='formula';e.problem:x;throw e}
  try{return{f,c:cm?+cm[1]:1,a:formula(f)}}catch(e){e.kind='formula';e.problem=f;throw e}
 });
 return [side(sides[0]),side(sides[1])]
}

function solve(sides){
 const all=[...sides[0],...sides[1]],els=[...new Set(all.flatMap(x=>Object.keys(x.a)))],rows=els.map(e=>all.map((x,i)=>(i<sides[0].length?1:-1)*(x.a[e]||0))),n=all.length,m=rows.length;if(n<2)return null;
 let rank=0,piv=[];
 for(let c=0;c<n&&rank<m;c++){let p=rank;for(let r=rank+1;r<m;r++)if(Math.abs(rows[r][c])>Math.abs(rows[p][c]))p=r;if(Math.abs(rows[p][c])<1e-10)continue;[rows[rank],rows[p]]=[rows[p],rows[rank]];const q=rows[rank][c];for(let j=c;j<n;j++)rows[rank][j]/=q;for(let r=0;r<m;r++)if(r!==rank){const f=rows[r][c];if(Math.abs(f)>1e-10)for(let j=c;j<n;j++)rows[r][j]-=f*rows[rank][j]}piv.push(c);rank++}
 const free=[];for(let c=0;c<n;c++)if(!piv.includes(c))free.push(c);if(!free.length)return null;
 const v=Array(n).fill(0);v[free[0]]=1;for(let r=piv.length-1;r>=0;r--){const c=piv[r];let z=0;for(let j=c+1;j<n;j++)z+=rows[r][j]*v[j];v[c]=-z}
 let den=1;for(const x of v){const a=Math.abs(x);if(a>1e-10){let d=1;for(let k=1;k<=100000;k++){if(Math.abs(a*k-Math.round(a*k))<1e-7){d=k;break}}den=den*d/gcd(den,d)}}
 let out=v.map(x=>Math.round(x*den)),g=out.reduce((a,b)=>gcd(a,b),0);if(g)out=out.map(x=>x/g);if(out.some(x=>x<0))out=out.map(x=>-x);if(out.some(x=>x<=0)||out.some(x=>x>100000))return null;return out
}

function markProblem(raw,e){
 const s=String(raw??'');let idx=Number.isFinite(e?.index)?e.index:0;let len=1;
 if(e?.kind==='arrow'){const re=/(?:→|⟶|⇒|➜|⟹|⟾|->|=>)/g;const ms=[...s.matchAll(re)];const hit=ms.find(x=>x.index===idx)||ms[0];if(hit){idx=hit.index;len=hit[0].length}}
 idx=Math.max(0,Math.min(idx,s.length));input.focus();try{input.setSelectionRange(idx,Math.min(s.length,idx+len))}catch{}
 const before=esc(s.slice(0,idx)),bad=esc(s.slice(idx,idx+len)||e?.problem||'?'),after=esc(s.slice(idx+len));
 return `<div class="problem-preview"><code>${before}<mark>${bad}</mark>${after}</code></div>`
}

function showError(message,e){
 result.classList.remove('hidden');result.innerHTML=`<div class="validation-error"><b>⚠ Equation needs attention</b><p>${esc(message)}</p>${e?.problem?`<p><b>Problem found:</b> ${esc(e.problem)}</p>`:''}${e?markProblem(input.value,e):''}<p class="muted"><b>Remember:</b> element symbols are case-sensitive. <code>Co</code> is cobalt; <code>CO</code> is carbon + oxygen.</p></div>`;
 input.setAttribute('aria-invalid','true')
}

function show(){
 input.removeAttribute('aria-invalid');result.classList.add('hidden');
 try{
  const sides=parse(input.value),co=solve(sides);if(!co)throw Object.assign(new Error('These formulas cannot be balanced with a non-zero whole-number ratio.'),{kind:'balance',problem:'the complete equation'});
  let k=0;const answer=sides.map(side=>side.map(x=>{const c=co[k++];return(c===1?'':c)+pretty(x.f)}).join(' + ')).join(' → ');
  result.classList.remove('hidden');result.innerHTML='<div class="equation">'+answer+'</div><div class="steps-result"><b>Coefficients:</b> '+co.join(' : ')+'<br><span class="muted">All element counts are conserved.</span></div>'
 }catch(e){showError(e.message,e)}
}

balanceBtn.addEventListener('click',show);input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();show()}});
document.querySelectorAll('[data-eq]').forEach(b=>b.addEventListener('click',()=>{input.value=norm(b.dataset.eq);show()}));
document.getElementById('exampleBtn')?.addEventListener('click',()=>{const a=['H2 + O2 → H2O','Fe + O2 → Fe2O3','C3H8 + O2 → CO2 + H2O','Ca(OH)2 + HCl → CaCl2 + H2O'];input.value=a[Math.floor(Math.random()*a.length)];show()});

const canvas=document.getElementById('pad');if(canvas){const ctx=canvas.getContext('2d');ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';let down=false,erase=false;const pos=e=>{const r=canvas.getBoundingClientRect(),p=e.touches?.[0]||e;return{x:(p.clientX-r.left)*canvas.width/r.width,y:(p.clientY-r.top)*canvas.height/r.height}};const start=e=>{down=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);e.preventDefault()};const move=e=>{if(!down)return;const p=pos(e);ctx.globalCompositeOperation=erase?'destination-out':'source-over';ctx.lineTo(p.x,p.y);ctx.stroke();e.preventDefault()};const end=()=>{down=false;ctx.globalCompositeOperation='source-over'};canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);document.getElementById('clearPad')?.addEventListener('click',()=>ctx.clearRect(0,0,canvas.width,canvas.height));document.getElementById('erasePad')?.addEventListener('click',e=>{erase=!erase;e.currentTarget.textContent=erase?'Pen':'Eraser'})}
})();