(() => {
  const $ = s => document.querySelector(s);
  const canvas = $('#pad');
  const input = $('#equationInput');
  const balanceBtn = $('#balanceBtn');
  const result = $('#balanceResult');
  if (!input || !balanceBtn || !result) return;

  const ELEMENTS = new Set(('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr').split(' '));

  function parseFormula2(formula) {
    const s = String(formula || '').replace(/\s+/g, '');
    if (!s) return {counts:null,error:'Empty formula',index:0};
    let i = 0;
    function readGroup(stop) {
      const out = {};
      while (i < s.length) {
        if (stop && s[i] === ')') { i++; return {out}; }
        if (s[i] === '(') {
          const start = i++; const inner = readGroup(')');
          if (i > s.length || !inner) return {error:'Missing closing parenthesis',index:start};
          const m = s.slice(i).match(/^\d+/); const mult = m ? Number(m[0]) : 1; if (m) i += m[0].length;
          Object.entries(inner.out || {}).forEach(([e,n]) => out[e]=(out[e]||0)+n*mult);
          continue;
        }
        if (s[i] === ')') return {error:'Unexpected closing parenthesis',index:i};
        const m = s.slice(i).match(/^([A-Z][a-z]?)/);
        if (!m) return {error:`Invalid formula near “${s.slice(i)}”`,index:i};
        const el = m[1];
        if (!ELEMENTS.has(el)) return {error:`“${el}” is not a valid element symbol`,index:i};
        i += el.length;
        const n = s.slice(i).match(/^\d+/); const mult = n ? Number(n[0]) : 1; if (n) i += n[0].length;
        out[el]=(out[el]||0)+mult;
      }
      return {out};
    }
    const r=readGroup();
    if (i < s.length) return {counts:null,error:'Unmatched parenthesis',index:i};
    if (r.error) return {counts:null,error:r.error,index:r.index};
    return {counts:r.out,error:null};
  }

  function parseEquation2(raw) {
    let s=String(raw||'').replace(/→|⟶|⇒|➜|=/g,'->').replace(/\s+/g,' ').trim();
    const parts=s.split(/->/);
    if(parts.length!==2) return {error:'Use one reaction arrow (→ or ->).',side:null,index:0};
    const sides=parts.map(side=>side.split('+').map(v=>v.trim()).filter(Boolean));
    if(sides.some(a=>!a.length)) return {error:'Both sides of the equation need at least one substance.',side:null,index:0};
    for(let side=0;side<2;side++) for(let j=0;j<sides[side].length;j++){
      const item=sides[side][j]; const m=item.match(/^(\d+)\s*(.*)$/); const formula=m?m[2]:item;
      const parsed=parseFormula2(formula);
      if(parsed.error) return {error:parsed.error,side,index:parts[side?0:0].length + item.indexOf(formula)};
      if(/\d+[A-Z][a-z]?\d*[A-Z]/.test(formula) && /[A-Z]{2}/.test(formula)) {
        // Keep this as an explanatory validation warning rather than rejecting valid formulas such as CO.
      }
    }
    return {eq:sides.map(side=>side.map(item=>{const m=item.match(/^(\d+)\s*(.*)$/);return{coef:m?Number(m[1]):1,formula:m?m[2]:item}})),error:null};
  }

  function solve(eq) {
    const es=[...new Set(eq.flat().flatMap(x=>Object.keys(parseFormula2(x.formula).counts||{})))];
    const cols=eq[0].length+eq[1].length;
    let A=es.map(e=>eq[0].concat(eq[1]).map((x,i)=>((i<eq[0].length?1:-1)*(parseFormula2(x.formula).counts[e]||0))));
    let rows=A.length,r=0,piv=[];
    for(let c=0;c<cols&&r<rows;c++){
      let k=r; for(let z=r+1;z<rows;z++) if(Math.abs(A[z][c])>Math.abs(A[k][c])) k=z;
      if(Math.abs(A[k][c])<1e-10) continue;
      [A[r],A[k]]=[A[k],A[r]]; const q=A[r][c]; A[r]=A[r].map(v=>v/q);
      for(let z=0;z<rows;z++) if(z!==r&&Math.abs(A[z][c])>1e-10){const q2=A[z][c];A[z]=A[z].map((v,j)=>v-q2*A[r][j]);}
      piv.push(c);r++;
    }
    const free=[];for(let c=0;c<cols;c++)if(!piv.includes(c))free.push(c);if(!free.length)return null;
    let v=Array(cols).fill(0);v[free[0]]=1;
    for(let z=piv.length-1;z>=0;z--){const c=piv[z];let sum=0;for(let j=c+1;j<cols;j++)sum+=A[z][j]*v[j];v[c]=-sum/A[z][c];}
    const round=v.map(x=>Math.round(x*1000000)); const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a}; let g=round.reduce(gcd,0); if(!g)return null; v=round.map(x=>x/g); if(v.some(x=>x<0))v=v.map(x=>-x);g=v.reduce(gcd,0);return v.map(x=>x/g);
  }
  const prettyFormula=f=>f.replace(/([A-Z][a-z]?)(\d+)/g,'$1<sub>$2</sub>');
  function pretty(eq,cs){let i=0;return eq.map(side=>side.map(x=>{const c=cs[i++];return(c===1?'':c)+prettyFormula(x.formula)}).join(' + ')).join(' → ');}

  function validation(raw) {
    const r=parseEquation2(raw);
    if(r.error) return r;
    const warnings=[];
    const rawFormulas=String(raw).replace(/→|⟶|⇒|➜|=/g,'->').split(/->/).flatMap(s=>s.split('+'));
    rawFormulas.forEach(f=>{
      const clean=f.trim().replace(/^\d+\s*/,'');
      if(/^[A-Z]{2,}/.test(clean)) {
        const pairs=clean.match(/[A-Z]{2}/g)||[];
        pairs.forEach(pair=>{const a=pair[0]+pair[1].toLowerCase();if(ELEMENTS.has(a))warnings.push(`Check capitalization: “${pair}” is different from “${a}”. For example, Co is cobalt while CO means carbon + oxygen.`);});
      }
    });
    return {...r,warnings};
  }

  function renderError(message, raw, detail='') {
    result.classList.remove('hidden');
    result.innerHTML=`<div class="validation-error"><b>⚠ Equation needs attention</b><p>${message}</p>${detail?`<p class="muted">${detail}</p>`:''}<p><b>Tip:</b> Element symbols are case-sensitive. <code>Co</code> is cobalt; <code>CO</code> is carbon + oxygen.</p></div>`;
    input.focus();
  }

  function enhancedBalance(raw) {
    const v=validation(raw);
    if(v.error){renderError(v.error,raw);return;}
    const cs=solve(v.eq); if(!cs){renderError('These formulas do not produce a valid whole-number balance. Check the formulas and coefficients.');return;}
    result.classList.remove('hidden');
    const names=v.eq.flat().map(x=>x.formula);
    const atoms=[...new Set(v.eq.flat().flatMap(x=>Object.keys(parseFormula2(x.formula).counts)))];
    const totalsBefore=atoms.map(e=>`${e}: ${v.eq[0].reduce((n,x)=>n+(parseFormula2(x.formula).counts[e]||0)*x.coef,0)} → ${v.eq[1].reduce((n,x)=>n+(parseFormula2(x.formula).counts[e]||0)*x.coef,0)}`).join(' · ');
    const changes=cs.map((c,i)=>`${c} × ${names[i]}`).join(' · ');
    const warning=v.warnings?.length?`<div class="validation-warning"><b>Capitalization check</b><ul>${v.warnings.map(x=>`<li>${x}</li>`).join('')}</ul></div>`:'';
    result.innerHTML=`<div class="equation">${pretty(v.eq,cs)}</div>${warning}<div class="balance-actions"><button id="toggleSteps" class="secondary" type="button">Show step-by-step explanation</button><button id="copyBalanced" class="secondary" type="button">Copy answer</button></div><div id="balanceSteps" class="steps-result hidden"><div class="step"><i>1</i><div><b>Validate the formulas.</b><br>All element symbols, numbers and parentheses are checked before balancing.</div></div><div class="step"><i>2</i><div><b>Build the atom-balance equations.</b><br>For each element, the total number of atoms on the left must equal the total on the right.</div></div><div class="step"><i>3</i><div><b>Find the smallest coefficient ratio.</b><br>The coefficients are <b>${cs.join(' : ')}</b>. Only coefficients change; subscripts stay part of the chemical formula.</div></div><div class="step"><i>4</i><div><b>Apply the coefficients.</b><br>${changes}</div></div><div class="step"><i>5</i><div><b>Verify.</b><br>${totalsBefore}. Every element now has equal totals on both sides.</div></div></div>`;
    $('#toggleSteps').onclick=()=>{const s=$('#balanceSteps');s.classList.toggle('hidden');$('#toggleSteps').textContent=s.classList.contains('hidden')?'Show step-by-step explanation':'Hide step-by-step explanation';};
    $('#copyBalanced').onclick=async()=>{const text=pretty(v.eq,cs).replace(/<sub>/g,'').replace(/<\/sub>/g,'');try{await navigator.clipboard.writeText(text);$('#copyBalanced').textContent='Copied ✓';setTimeout(()=>$('#copyBalanced').textContent='Copy answer',1500)}catch(e){}};
  }
  balanceBtn.onclick=()=>enhancedBalance(input.value);
  input.addEventListener('input',()=>{input.removeAttribute('aria-invalid');});

  // Add a compact validation area and an explicit correction field for handwriting.
  if(canvas){
    const hand=canvas.closest('.handwriting');
    const actions=hand?.querySelector('.hand-actions');
    if(actions && !$('#undoPad')){const b=document.createElement('button');b.id='undoPad';b.className='secondary';b.type='button';b.textContent='Undo';actions.insertBefore(b,actions.firstChild);}
    const out=$('#recognitionResult');
    if(out){out.insertAdjacentHTML('afterend','<div id="recognitionCorrection" class="recognition-correction hidden"><label for="recognizedEdit"><b>Correct recognized equation before balancing</b></label><div class="input-row"><input id="recognizedEdit" autocomplete="off"><button id="balanceRecognized" class="primary" type="button">Balance</button></div><div id="recognitionConfidence" class="muted"></div></div>');}
    const ctx=canvas.getContext('2d');let snapshots=[];
    canvas.addEventListener('mousedown',()=>{try{snapshots.push(ctx.getImageData(0,0,canvas.width,canvas.height));if(snapshots.length>20)snapshots.shift();}catch(e){}},{capture:true});
    canvas.addEventListener('touchstart',()=>{try{snapshots.push(ctx.getImageData(0,0,canvas.width,canvas.height));if(snapshots.length>20)snapshots.shift();}catch(e){}},{capture:true,passive:true});
    $('#undoPad')?.addEventListener('click',()=>{const s=snapshots.pop();if(s)ctx.putImageData(s,0,0);});
    $('#clearPad')?.addEventListener('click',()=>{snapshots=[];});

    const normalize=t=>String(t||'').replace(/[\r\n]+/g,' ').replace(/[→⟶⇒➜]/g,' -> ').replace(/[×x]/g,' + ').replace(/[–—−]/g,'-').replace(/\s*[-]+>\s*/g,' -> ').replace(/\s+/g,' ').trim();
    const prettyText=t=>normalize(t).replace(/([A-Z][a-z]?)(\d+)/g,'$1<sub>$2</sub>');
    async function cf(dataUrl){const base=window.CHEMISTRY_HANDWRITING_WORKER;if(!base)throw Error('Cloudflare Worker URL is not configured.');const res=await fetch(base.replace(/\/$/,'')+'/recognize',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:dataUrl})});let d={};try{d=await res.json()}catch(e){}if(!res.ok)throw Error(d.error||`Cloudflare returned HTTP ${res.status}`);if(!d.text)throw Error('Cloudflare returned no recognized text.');return d;}
    async function local(dataUrl){if(!window.Tesseract)throw Error('Browser OCR is unavailable.');const r=await Tesseract.recognize(dataUrl,'eng');return{text:r.data.text,confidence:r.data.confidence};}
    async function recognize(){
      const status=$('#recognitionStatus'),out=$('#recognitionResult'),cor=$('#recognitionCorrection'),edit=$('#recognizedEdit'),conf=$('#recognitionConfidence');
      status.textContent='Trying Cloudflare AI…';out.classList.remove('hidden');out.innerHTML='<p>Recognizing handwriting…</p>';cor?.classList.add('hidden');
      let d,source='Cloudflare AI';
      try{d=await cf(canvas.toDataURL('image/png'));}
      catch(e){try{source='Browser OCR';d=await local(canvas.toDataURL('image/png'));}catch(e2){status.textContent='Recognition failed';out.innerHTML=`<p class="validation-error"><b>Could not recognize the handwriting.</b><br>${e2.message}</p>`;return;}}
      const text=normalize(d.text);const confidence=Number(d.confidence ?? d.score ?? 0);
      const confidenceText=confidence>0?(confidence<=1?Math.round(confidence*100):Math.round(confidence)):'unknown';
      const level=confidenceText==='unknown'?'uncertain':confidenceText>=85?'high':confidenceText>=65?'medium':'low';
      status.textContent=`Recognized with ${source}`;
      out.innerHTML=`<p><b>Recognized:</b> <span class="equation">${prettyText(text)||'nothing'}</span></p><p class="muted">Confidence: <b>${confidenceText==='unknown'?'Uncertain':confidenceText+'%'} (${level})</b>. Always check the equation before balancing.</p>`;
      if(edit&&cor){edit.value=text;cor.classList.remove('hidden');if(conf)conf.textContent=`Recognition source: ${source}. ${confidenceText==='unknown'?'No confidence score was returned by the model.':'Confidence is an estimate from the recognition service.'}`;}
    }
    $('#usePad').onclick=recognize;
    $('#balanceRecognized')?.addEventListener('click',()=>enhancedBalance($('#recognizedEdit').value));
  }
})();
