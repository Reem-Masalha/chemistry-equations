(() => {
  const $ = s => document.querySelector(s);
  const input = $('#equationInput'), balanceBtn = $('#balanceBtn'), result = $('#balanceResult'), canvas = $('#pad');
  if (!input || !balanceBtn || !result) return;

  const ELEMENTS = new Set('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr'.split(' '));
  const SUB = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
  const normalDigits = s => String(s || '').replace(/[₀₁₂₃₄₅₆₇₈₉]/g, c => SUB[c]);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const prettyFormula = f => esc(f).replace(/([A-Z][a-z]?)(\d+)/g, '$1<sub>$2</sub>');

  function parseFormula(formula) {
    const s = normalDigits(formula).replace(/\s+/g, ''); let i = 0;
    if (!s) return {error:'Formula is empty', index:0};
    function group(stop) {
      const out = {};
      while (i < s.length) {
        if (stop && s[i] === ')') { i++; return {out}; }
        if (s[i] === '(') {
          const at = i++; const r = group(')');
          if (r.error) return r;
          const m = s.slice(i).match(/^\d+/); const mult = m ? +m[0] : 1; if (m) i += m[0].length;
          Object.entries(r.out).forEach(([e,n]) => out[e] = (out[e] || 0) + n * mult);
          continue;
        }
        if (s[i] === ')') return {error:'Unexpected closing parenthesis', index:i};
        const m = s.slice(i).match(/^([A-Z][a-z]?)/);
        if (!m) return {error:`Invalid symbol near “${s.slice(i)}”`, index:i};
        const el = m[1]; if (!ELEMENTS.has(el)) return {error:`“${el}” is not a valid element symbol`, index:i};
        i += el.length; const n = s.slice(i).match(/^\d+/); const mult = n ? +n[0] : 1; if (n) i += n[0].length;
        out[el] = (out[el] || 0) + mult;
      }
      if (stop) return {error:'Missing closing parenthesis', index:s.length};
      return {out};
    }
    const r = group(); return r.error ? r : {counts:r.out};
  }

  function parseEquation(raw) {
    const s = normalDigits(raw).replace(/→|⟶|⇒|➜|=/g, '->').replace(/\s+/g, ' ').trim();
    const arrows = (s.match(/->/g) || []).length;
    if (arrows !== 1) return {error:'Use exactly one reaction arrow (→ or ->).'};
    const [left,right] = s.split('->');
    const sides = [left,right].map(x => x.split('+').map(v => v.trim()).filter(Boolean));
    if (sides.some(x => !x.length)) return {error:'Both sides need at least one substance.'};
    const items = sides.map((side, sideIndex) => side.map((item, itemIndex) => {
      const m = item.match(/^(\d+)\s*(.*)$/); const formula = m ? m[2] : item;
      const p = parseFormula(formula);
      return {coef:m ? +m[1] : 1, formula, parsed:p, sideIndex, itemIndex};
    }));
    for (const side of items) for (const x of side) if (x.parsed.error) return {error:x.parsed.error, problem:x.formula};
    return {eq:items.map(side => side.map(x => ({coef:x.coef,formula:x.formula}))) };
  }

  function solve(eq) {
    const all = eq[0].concat(eq[1]), els = [...new Set(all.flatMap(x => Object.keys(parseFormula(x.formula).counts)))];
    const A = els.map(e => all.map((x,i) => (i < eq[0].length ? 1 : -1) * (parseFormula(x.formula).counts[e] || 0)));
    const rows=A.length, cols=all.length; let r=0, piv=[];
    for(let c=0;c<cols && r<rows;c++){
      let k=r; for(let z=r+1;z<rows;z++) if(Math.abs(A[z][c])>Math.abs(A[k][c])) k=z;
      if(Math.abs(A[k][c])<1e-10) continue;
      [A[r],A[k]]=[A[k],A[r]]; const q=A[r][c]; A[r]=A[r].map(v=>v/q);
      for(let z=0;z<rows;z++) if(z!==r && Math.abs(A[z][c])>1e-10){const q2=A[z][c];A[z]=A[z].map((v,j)=>v-q2*A[r][j]);}
      piv.push(c); r++;
    }
    const free=[]; for(let c=0;c<cols;c++) if(!piv.includes(c)) free.push(c); if(!free.length) return null;
    const v=Array(cols).fill(0); v[free[0]]=1;
    for(let z=piv.length-1;z>=0;z--){const c=piv[z]; let sum=0; for(let j=c+1;j<cols;j++) sum += A[z][j]*v[j]; v[c]=-sum/A[z][c];}
    let ints=v.map(x=>Math.round(x*1000000)); const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a}; let g=ints.reduce(gcd,0); if(!g)return null; ints=ints.map(x=>x/g); if(ints.some(x=>x<0))ints=ints.map(x=>-x); g=ints.reduce(gcd,0); return ints.map(x=>x/g);
  }

  function totals(eq, coefs) {
    const out = {}; let i=0;
    eq.forEach((side,si)=>side.forEach(x=>{const p=parseFormula(x.formula).counts, c=coefs[i++]; Object.entries(p).forEach(([e,n])=>{if(!out[e])out[e]=[0,0];out[e][si]+=n*c;});}));
    return out;
  }

  function balance(raw) {
    const p=parseEquation(raw); if(p.error)return p;
    const cs=solve(p.eq); if(!cs)return {error:'No valid whole-number balance could be found.',eq:p.eq};
    return {eq:p.eq,cs,totals:totals(p.eq,cs)};
  }

  function showError(message, problem) {
    result.classList.remove('hidden');
    result.innerHTML=`<div class="validation-error"><b>⚠ Equation needs attention</b><p>${esc(message)}</p>${problem?`<p><b>Problem:</b> <code>${esc(problem)}</code></p>`:''}<p class="muted"><b>Remember:</b> element symbols are case-sensitive. <code>Co</code> is cobalt; <code>CO</code> is carbon + oxygen.</p></div>`;
    input.setAttribute('aria-invalid','true'); input.focus();
  }

  function renderBalance(raw) {
    const b=balance(raw); if(b.error){showError(b.error,b.problem);return;}
    let k=0; const formulaHTML=side=>side.map(x=>{const c=b.cs[k++];return (c===1?'':c)+prettyFormula(x.formula);}).join(' + ');
    const answer=formulaHTML(b.eq[0])+' → '+formulaHTML(b.eq[1]);
    const rows=Object.entries(b.totals).map(([e,v])=>`<div><b>${e}</b>: ${v[0]} left = ${v[1]} right ${v[0]===v[1]?'✓':'✕'}</div>`).join('');
    const coefficientSteps=b.eq.flat().map((x,i)=>`${b.cs[i]} × ${esc(x.formula)}`).join(' · ');
    result.classList.remove('hidden');
    result.innerHTML=`<div class="equation">${answer}</div><div class="balance-actions"><button id="toggleSteps" class="secondary" type="button">Show step-by-step explanation</button><button id="toggleMethod" class="secondary" type="button">Show algebra method</button><button id="copyBalanced" class="secondary" type="button">Copy answer</button></div><div id="balanceSteps" class="steps-result hidden"><div class="step"><i>1</i><div><b>Validate the formulas.</b><br>Element symbols, subscripts and parentheses were checked. Subscripts are never changed while balancing.</div></div><div class="step"><i>2</i><div><b>Set up conservation equations.</b><br>For every element, atoms on the left must equal atoms on the right.</div></div><div class="step"><i>3</i><div><b>Find the smallest coefficient ratio.</b><br>The coefficient ratio is <b>${b.cs.join(' : ')}</b>.</div></div><div class="step"><i>4</i><div><b>Apply the coefficients.</b><br>${coefficientSteps}</div></div><div class="step"><i>5</i><div><b>Verify every element.</b><br>${rows}</div></div></div><div id="algebraMethod" class="steps-result hidden"><div class="step"><i>∑</i><div><b>Algebra / matrix method</b><br>Each compound receives an unknown coefficient. The atom-conservation equations form a homogeneous linear system. Solving it gives the coefficient vector <b>${b.cs.join(', ')}</b>, which is reduced to the smallest whole numbers.</div></div></div>`;
    $('#toggleSteps').onclick=()=>{const x=$('#balanceSteps');x.classList.toggle('hidden');$('#toggleSteps').textContent=x.classList.contains('hidden')?'Show step-by-step explanation':'Hide step-by-step explanation';};
    $('#toggleMethod').onclick=()=>{const x=$('#algebraMethod');x.classList.toggle('hidden');$('#toggleMethod').textContent=x.classList.contains('hidden')?'Show algebra method':'Hide algebra method';};
    $('#copyBalanced').onclick=async()=>{try{await navigator.clipboard.writeText(normalDigits(raw).replace(/→|⟶|⇒|➜|=/g,'->').replace(/\s+/g,' ').trim());$('#copyBalanced').textContent='Copied ✓';setTimeout(()=>$('#copyBalanced').textContent='Copy answer',1200);}catch(e){}};
  }
  balanceBtn.onclick=()=>renderBalance(input.value);
  input.onkeydown=e=>{if(e.key==='Enter')renderBalance(input.value);};

  // Replace the handwriting controls with a reliable, isolated UI.
  if(canvas){
    const hand=canvas.closest('.handwriting'), actions=hand?.querySelector('.hand-actions'), status=$('#recognitionStatus'), out=$('#recognitionResult');
    if(actions && !$('#undoPad')){const b=document.createElement('button');b.id='undoPad';b.className='secondary';b.type='button';b.textContent='Undo';actions.insertBefore(b,actions.firstChild);}
    if(actions && !$('#penPad')){const b=document.createElement('button');b.id='penPad';b.className='secondary';b.type='button';b.textContent='Pen';actions.insertBefore(b,actions.firstChild);}
    if(out && !$('#recognitionCorrection')) out.insertAdjacentHTML('afterend','<div id="recognitionCorrection" class="recognition-correction hidden"><label for="recognizedEdit"><b>Check and correct the recognized equation</b></label><div class="input-row"><input id="recognizedEdit" autocomplete="off" aria-label="Recognized equation"><button id="balanceRecognized" class="primary" type="button">Balance</button></div><div id="recognitionConfidence" class="muted"></div></div>');
    const ctx=canvas.getContext('2d'); let undo=[];
    const snapshot=()=>{try{undo.push(ctx.getImageData(0,0,canvas.width,canvas.height));if(undo.length>30)undo.shift();}catch(e){}};
    canvas.addEventListener('mousedown',snapshot,{capture:true}); canvas.addEventListener('touchstart',snapshot,{capture:true,passive:true});
    $('#undoPad').onclick=()=>{const s=undo.pop();if(s)ctx.putImageData(s,0,0);};
    $('#clearPad').onclick=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);undo=[];status.textContent='Draw an equation, then tap Recognize.';out.classList.add('hidden');$('#recognitionCorrection')?.classList.add('hidden');};
    let erasing=false;
    $('#erasePad').onclick=()=>{erasing=!erasing;canvas.dataset.erasing=erasing?'true':'false';$('#erasePad').textContent=erasing?'Eraser ✓':'Eraser';$('#erasePad').classList.toggle('primary',erasing);$('#erasePad').classList.toggle('secondary',!erasing);};
    $('#penPad').onclick=()=>{erasing=false;canvas.dataset.erasing='false';$('#erasePad').textContent='Eraser';$('#erasePad').classList.remove('primary');$('#erasePad').classList.add('secondary');};

    const normalize=t=>normalDigits(String(t||'')).replace(/[\r\n]+/g,' ').replace(/[→⟶⇒➜]/g,' -> ').replace(/[×]/g,' + ').replace(/\s*[-]+>\s*/g,' -> ').replace(/\s*\+\s*/g,' + ').replace(/\s+/g,' ').trim();
    const scoreOf=d=>{let x=Number(d?.confidence ?? d?.score ?? d?.data?.confidence);if(!Number.isFinite(x))return null;if(x<=1)x*=100;return Math.max(0,Math.min(100,Math.round(x)));};
    async function cloudflare(image){const base=window.CHEMISTRY_HANDWRITING_WORKER;if(!base)throw Error('Cloudflare handwriting Worker is not configured.');const r=await fetch(base.replace(/\/$/,'')+'/recognize',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image})});let d={};try{d=await r.json();}catch(e){}if(!r.ok)throw Error(d.error||`Cloudflare recognition returned HTTP ${r.status}`);if(!d.text)throw Error('Cloudflare returned no recognized equation.');return d;}
    async function local(image){if(!window.Tesseract)throw Error('Browser OCR is unavailable.');const r=await Tesseract.recognize(image,'eng');return {text:r.data.text,confidence:r.data.confidence};}
    async function recognize(){
      const correction=$('#recognitionCorrection'),edit=$('#recognizedEdit'),conf=$('#recognitionConfidence');
      status.textContent='Trying Cloudflare AI…';out.classList.remove('hidden');out.innerHTML='<p>Recognizing handwriting…</p>';correction?.classList.add('hidden');
      let d,source='Cloudflare AI'; try{d=await cloudflare(canvas.toDataURL('image/png'));}catch(e){try{source='Browser OCR';d=await local(canvas.toDataURL('image/png'));}catch(e2){status.textContent='Recognition failed';out.innerHTML=`<div class="validation-error"><b>Could not recognize the handwriting.</b><p>${esc(e2.message)}</p><p>Try writing larger and leaving space between formulas, + and →.</p></div>`;return;}}
      const text=normalize(d.text), score=scoreOf(d), uncertain=score===null||score<70;
      status.textContent=`Recognized with ${source}`;
      out.innerHTML=`<p><b>Recognized:</b> <span class="equation">${prettyFormula(text)}</span></p><p class="muted">${score===null?'Confidence: unavailable.':`Confidence: ${score}%${uncertain?' — please check carefully.':''}`}</p>`;
      if(edit&&correction){edit.value=text;correction.classList.remove('hidden');if(conf)conf.innerHTML=score===null?'No confidence score was returned. Check the equation manually before balancing.':`Recognition confidence: <b>${score}%</b>. ${uncertain?'This result is uncertain; correction is recommended.':'The result looks reasonably confident, but you should still verify chemical symbols.'}`;}
    }
    $('#usePad').onclick=recognize;
    $('#balanceRecognized').onclick=()=>renderBalance($('#recognizedEdit').value);
  }
})();
