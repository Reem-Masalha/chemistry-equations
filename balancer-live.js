(() => {
  if (window.__CHEMISTRY_BALANCER_V2__) return;
  window.__CHEMISTRY_BALANCER_V2__ = true;

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const input = $('#equationInput');
  const balanceBtn = $('#balanceBtn');
  const result = $('#balanceResult');
  const canvas = $('#pad');
  if (!input || !balanceBtn || !result || !canvas) return;

  const ELEMENTS = new Set('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr'.split(' '));
  const subToAscii = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
  const normalizeDigits = s => String(s ?? '').replace(/[₀₁₂₃₄₅₆₇₈₉]/g, c => subToAscii[c]);
  const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const prettyFormula = s => escape(normalizeDigits(s)).replace(/([A-Z][a-z]?)(\d+)/g, '$1<sub>$2</sub>');
  const gcd = (a,b) => { a=Math.abs(a); b=Math.abs(b); while(b) [a,b]=[b,a%b]; return a; };
  const gcdAll = arr => arr.reduce(gcd, 0);

  function parseFormula(rawFormula) {
    const s = normalizeDigits(rawFormula).replace(/\s+/g,'');
    if (!s) return { error:'Formula is empty.', index:0, token:'' };
    let i=0;
    function group(stop) {
      const out={};
      while(i<s.length){
        if(stop && s[i]===stop){ i++; return {ok:true,counts:out}; }
        if(s[i]==='('){
          const open=i++;
          const nested=group(')');
          if(!nested.ok) return nested;
          const m=s.slice(i).match(/^\d+/); const mult=m?Number(m[0]):1; if(m)i+=m[0].length;
          for(const [el,n] of Object.entries(nested.counts)) out[el]=(out[el]||0)+n*mult;
          continue;
        }
        if(s[i]===')') return {ok:false,error:'Unexpected closing parenthesis.',index:i,token:')'};
        const m=s.slice(i).match(/^[A-Z][a-z]?/);
        if(!m){ const token=s.slice(i).match(/^[A-Za-z]+|^\d+|^./)?.[0]||''; return {ok:false,error:`Invalid formula near “${token}”.`,index:i,token}; }
        const el=m[0];
        if(!ELEMENTS.has(el)) return {ok:false,error:`“${el}” is not a valid element symbol.`,index:i,token:el};
        i+=el.length;
        const n=s.slice(i).match(/^\d+/); const mult=n?Number(n[0]):1; if(n)i+=n[0].length;
        out[el]=(out[el]||0)+mult;
      }
      if(stop) return {ok:false,error:'Missing closing parenthesis “)”.',index:s.length,token:')'};
      return {ok:true,counts:out};
    }
    const r=group(); return r.ok ? {counts:r.counts} : r;
  }

  function parseEquation(raw){
    const source=normalizeDigits(raw).replace(/⟶|⇒|➜|⟹|⟾|=/g,'→').replace(/\s+/g,' ').trim();
    if((source.match(/→/g)||[]).length!==1) return {error:'Use exactly one reaction arrow (→ or ->).',problem:'reaction arrow'};
    const [left,right]=source.split('→').map(x=>x.trim());
    if(!left||!right) return {error:'Both sides of the equation need at least one formula.',problem:!left?'left side':'right side'};
    const parseSide=(text,name)=>{
      const rawItems=text.split('+').map(x=>x.trim());
      if(rawItems.some(x=>!x)) return {error:`Empty formula on the ${name} side.`,problem:'empty formula'};
      return rawItems.map((item,index)=>{const m=item.match(/^(\d+)\s*(.*)$/);const coefficient=m?Number(m[1]):1;const formula=m?m[2]:item;return{formula,coefficient,parsed:parseFormula(formula),index};});
    };
    const leftItems=parseSide(left,'left'); if(leftItems.error)return leftItems;
    const rightItems=parseSide(right,'right'); if(rightItems.error)return rightItems;
    for(const item of [...leftItems,...rightItems]){
      if(item.parsed.error)return {error:item.parsed.error,problem:item.formula,index:item.parsed.index};
      if(item.coefficient<=0)return {error:'Coefficients must be positive whole numbers.',problem:item.formula};
    }
    return {sides:[leftItems,rightItems],normalized:source};
  }

  function solve(parsed){
    const all=parsed.sides[0].concat(parsed.sides[1]);
    const elements=[...new Set(all.flatMap(x=>Object.keys(x.parsed.counts)))];
    const A=elements.map(el=>all.map((item,col)=>(col<parsed.sides[0].length?1:-1)*(item.parsed.counts[el]||0)));
    let row=0; const pivots=[];
    for(let col=0;col<all.length && row<A.length;col++){
      let best=row; for(let r=row+1;r<A.length;r++) if(Math.abs(A[r][col])>Math.abs(A[best][col])) best=r;
      if(Math.abs(A[best][col])<1e-12) continue;
      [A[row],A[best]]=[A[best],A[row]];
      const p=A[row][col]; A[row]=A[row].map(v=>v/p);
      for(let r=0;r<A.length;r++) if(r!==row){const f=A[r][col]; if(Math.abs(f)>1e-12) A[r]=A[r].map((v,c)=>v-f*A[row][c]);}
      pivots.push(col); row++;
    }
    const free=[]; for(let c=0;c<all.length;c++) if(!pivots.includes(c)) free.push(c); if(!free.length)return null;
    const v=Array(all.length).fill(0); v[free[0]]=1;
    for(let r=pivots.length-1;r>=0;r--){const c=pivots[r];let sum=0;for(let j=c+1;j<all.length;j++)sum+=A[r][j]*v[j];v[c]=-sum/A[r][c];}
    let ints=v.map(x=>Math.round(x*1000000)); let g=gcdAll(ints.map(Math.abs)); if(!g)return null; ints=ints.map(x=>x/g); if(ints.some(x=>x<0))ints=ints.map(x=>-x); g=gcdAll(ints.map(Math.abs)); ints=ints.map(x=>x/g); if(ints.some(x=>x<=0))return null; return ints;
  }

  function totals(parsed, coefficients){
    const out={}; let i=0;
    parsed.sides.forEach((side,si)=>side.forEach(item=>{const c=coefficients[i++];for(const [el,n] of Object.entries(item.parsed.counts)){out[el] ||= [0,0];out[el][si]+=n*c;}}));
    return out;
  }

  function validationError(info){
    result.classList.remove('hidden');
    result.innerHTML=`<div class="validation-error"><b>⚠ Equation needs attention</b><p>${escape(info.error)}</p>${info.problem?`<p><b>Problematic part:</b> <mark>${prettyFormula(info.problem)}</mark></p>`:''}<p><b>Capitalization matters:</b> <b>Co</b> is cobalt; <b>CO</b> is carbon + oxygen. Element symbols start with an uppercase letter and may have one lowercase letter.</p></div>`;
    input.setAttribute('aria-invalid','true');
  }

  function renderBalance(raw){
    const parsed=parseEquation(raw); input.removeAttribute('aria-invalid');
    if(parsed.error){validationError(parsed);return;}
    const coefficients=solve(parsed);
    if(!coefficients){validationError({error:'These formulas are valid, but no non-zero whole-number balance could be found.',problem:parsed.normalized});return;}
    const check=totals(parsed,coefficients);
    const checks=Object.entries(check).map(([el,v])=>`<div><b>${el}</b>: ${v[0]} left = ${v[1]} right ${v[0]===v[1]?'✓':'✕'}</div>`).join('');
    const assigned=parsed.sides.flat().map((x,i)=>`${coefficients[i]} × ${prettyFormula(x.formula)}`).join(' · ');
    let index=0; const answer=parsed.sides.map(side=>side.map(item=>{const c=coefficients[index++];return `${c===1?'':c}${prettyFormula(item.formula)}`;}).join(' + ')).join(' → ');
    result.classList.remove('hidden');
    result.innerHTML=`<div class="equation">${answer}</div><div class="balance-actions"><button id="liveSteps" class="secondary" type="button">Show step-by-step explanation</button><button id="liveMethod" class="secondary" type="button">Show algebra method</button><button id="liveInspection" class="secondary" type="button">Show inspection method</button></div><div id="liveExplain" class="steps-result hidden"><div class="step"><i>1</i><div><b>Validate the formulas.</b><br>Element symbols, subscripts and parentheses were checked before balancing.</div></div><div class="step"><i>2</i><div><b>Conserve atoms.</b><br>Each element must have the same total on both sides.</div></div><div class="step"><i>3</i><div><b>Choose coefficients.</b><br>The smallest whole-number ratio is <b>${coefficients.join(' : ')}</b>.</div></div><div class="step"><i>4</i><div><b>Apply the coefficients.</b><br>${assigned}</div></div><div class="step"><i>5</i><div><b>Verify.</b><br>${checks}</div></div></div><div id="liveAlgebra" class="steps-result hidden"><b>Algebra / matrix method</b><p>Assign an unknown coefficient to each formula and solve the homogeneous conservation system. The resulting vector is <b>${coefficients.join(', ')}</b>, reduced to the smallest whole numbers.</p></div><div id="liveInspectionPanel" class="steps-result hidden"><b>Inspection method</b><p>Match atom totals by choosing coefficients for the most constrained elements first, then verify every remaining element. The final coefficient ratio is <b>${coefficients.join(' : ')}</b>.</p></div>`;
    const toggle=(button,panel,open,close)=>{const b=$(`#${button}`),p=$(`#${panel}`);b.onclick=()=>{p.classList.toggle('hidden');b.textContent=p.classList.contains('hidden')?open:close;};};
    toggle('liveSteps','liveExplain','Show step-by-step explanation','Hide step-by-step explanation');
    toggle('liveMethod','liveAlgebra','Show algebra method','Hide algebra method');
    toggle('liveInspection','liveInspectionPanel','Show inspection method','Hide inspection method');
  }

  balanceBtn.onclick=()=>renderBalance(input.value);
  input.onkeydown=e=>{if(e.key==='Enter')renderBalance(input.value)};
  $$('[data-eq]').forEach(b=>b.onclick=()=>{input.value=normalizeDigits(b.dataset.eq);renderBalance(input.value);});
  $('#exampleBtn')?.addEventListener('click',()=>{const examples=['H2 + O2 → H2O','Fe + O2 → Fe2O3','C3H8 + O2 → CO2 + H2O','Ca(OH)2 + HCl → CaCl2 + H2O','Al + HCl → AlCl3 + H2'];const v=examples[Math.floor(Math.random()*examples.length)];input.value=v;renderBalance(v);});

  // Handwriting tools
  const ctx=canvas.getContext('2d'); ctx.lineWidth=4; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.strokeStyle='#142033';
  let drawing=false, erasing=false, history=[], historyIndex=-1;
  const updateHistory=()=>{const u=$('#undoPad'),r=$('#redoPad');if(u)u.disabled=historyIndex<=0;if(r)r.disabled=historyIndex>=history.length-1;};
  const snapshot=()=>{history=history.slice(0,historyIndex+1);history.push(ctx.getImageData(0,0,canvas.width,canvas.height));historyIndex=history.length-1;updateHistory();};
  const restore=i=>{if(i<0||i>=history.length)return;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.putImageData(history[i],0,0);historyIndex=i;updateHistory();};
  const point=e=>{const r=canvas.getBoundingClientRect(),p=e.touches?.[0]||e;return{x:(p.clientX-r.left)*canvas.width/r.width,y:(p.clientY-r.top)*canvas.height/r.height};};
  const start=e=>{drawing=true;snapshot();const p=point(e);ctx.beginPath();ctx.moveTo(p.x,p.y);e.preventDefault();};
  const move=e=>{if(!drawing)return;const p=point(e);ctx.globalCompositeOperation=erasing?'destination-out':'source-over';ctx.lineTo(p.x,p.y);ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y);e.preventDefault();};
  const end=()=>{drawing=false;ctx.globalCompositeOperation='source-over';updateHistory();};
  ctx.clearRect(0,0,canvas.width,canvas.height); snapshot();
  canvas.addEventListener('mousedown',start);canvas.addEventListener('mousemove',move);window.addEventListener('mouseup',end);canvas.addEventListener('touchstart',start,{passive:false});canvas.addEventListener('touchmove',move,{passive:false});canvas.addEventListener('touchend',end);
  $('#clearPad')?.addEventListener('click',()=>{ctx.clearRect(0,0,canvas.width,canvas.height);snapshot();$('#recognitionResult')?.classList.add('hidden');$('#recognitionCorrection')?.classList.add('hidden');$('#recognitionStatus').textContent='Draw an equation, then tap Recognize.';});
  $('#undoPad')?.addEventListener('click',()=>restore(historyIndex-1));
  $('#redoPad')?.addEventListener('click',()=>restore(historyIndex+1));
  $('#erasePad')?.addEventListener('click',()=>{erasing=!erasing;$('#erasePad').textContent=erasing?'Pen':'Eraser';});

  const normalizeOCR=s=>normalizeDigits(String(s||'')).replace(/[\r\n]+/g,' ').replace(/[⟶⇒➜⟹⟾=]/g,' → ').replace(/\s*[-‐‑‒–—]+>\s*/g,' → ').replace(/[×x]/g,' + ').replace(/\s*\+\s*/g,' + ').replace(/\s+/g,' ').trim();
  const confidenceOf=d=>{const v=Number(d?.confidence??d?.score??d?.data?.confidence);if(!Number.isFinite(v))return null;return Math.max(0,Math.min(100,Math.round(v<=1?v*100:v)));};
  async function cfRecognize(image){const base=window.CHEMISTRY_HANDWRITING_WORKER;if(!base)throw Error('Cloudflare handwriting recognition is not configured.');const r=await fetch(base.replace(/\/$/,'')+'/recognize',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image})});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||`Cloudflare recognition returned HTTP ${r.status}.`);if(!d.text)throw Error('Cloudflare returned no recognized equation.');return d;}
  async function localRecognize(image){if(!window.Tesseract)throw Error('Browser OCR is unavailable.');const r=await Tesseract.recognize(image,'eng');return {text:r.data.text,confidence:r.data.confidence};}
  async function recognize(){
    const status=$('#recognitionStatus'),out=$('#recognitionResult'),correction=$('#recognitionCorrection'),edit=$('#recognizedEdit'),confidence=$('#recognitionConfidence');
    out.classList.remove('hidden');correction?.classList.add('hidden');status.textContent='Trying Cloudflare AI…';out.innerHTML='<p>Recognizing handwriting…</p>';
    let d,source='Cloudflare AI';
    try{d=await cfRecognize(canvas.toDataURL('image/png'));}catch(e){source='Browser OCR';try{d=await localRecognize(canvas.toDataURL('image/png'));}catch(e2){status.textContent='Recognition failed';out.innerHTML=`<div class="validation-error"><b>Could not recognize the handwriting.</b><p>${escape(e2.message)}</p><p>Try larger writing and leave clear space between formulas, + and the arrow.</p></div>`;return;}}
    const text=normalizeOCR(d.text), score=confidenceOf(d), uncertain=score===null||score<70;
    status.textContent=`Recognized with ${source}`;
    out.innerHTML=`<p><b>Recognized:</b> <span class="equation">${prettyFormula(text)}</span></p><p class="muted">${score===null?'Confidence unavailable — please check the recognition.':`Confidence: ${score}%${uncertain?' — uncertain; please check carefully.':''}`}</p>`;
    if(edit&&correction){edit.value=text;correction.classList.remove('hidden');if(confidence)confidence.textContent=score===null?'Confidence unavailable.':`Recognition confidence: ${score}%`;$('#balanceRecognized').onclick=()=>renderBalance(edit.value);}
  }
  $('#usePad')?.addEventListener('click',recognize);
  window.showBalance=renderBalance;
})();
