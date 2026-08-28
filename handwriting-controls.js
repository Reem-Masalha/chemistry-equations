(() => {
  const canvas = document.getElementById('pad');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const clear = document.getElementById('clearPad');
  const undo = document.getElementById('undoPad');
  const redo = document.getElementById('redoPad');
  const eraser = document.getElementById('erasePad');
  const use = document.getElementById('usePad');
  const status = document.getElementById('recognitionStatus');
  const out = document.getElementById('recognitionResult');
  if (!ctx) return;

  let history = [];
  let historyIndex = -1;
  let drawing = false;
  let erasing = false;
  let last = null;
  let penSize = 4;
  let eraserSize = 28;

  // Add the controls from JavaScript so no HTML-file changes are required.
  const host = eraser?.parentElement || canvas.parentElement;
  if (host && !document.getElementById('handwritingSizeControls')) {
    const box = document.createElement('div');
    box.id = 'handwritingSizeControls';
    box.className = 'handwriting-size-controls';
    box.innerHTML = `
      <label>Pen size: <input id="penSizePad" type="range" min="1" max="20" value="4" step="1"><output id="penSizeValue">4 px</output></label>
      <label>Eraser size: <input id="eraserSizePad" type="range" min="5" max="60" value="28" step="1"><output id="eraserSizeValue">28 px</output></label>
      <button type="button" id="copyPad" class="secondary">Copy</button>
      <button type="button" id="pastePad" class="secondary">Paste</button>`;
    host.appendChild(box);
    const style = document.createElement('style');
    style.textContent = `
      #handwritingSizeControls{display:flex;flex-wrap:wrap;align-items:center;gap:.55rem;margin:.6rem 0}
      #handwritingSizeControls label{display:flex;align-items:center;gap:.35rem;font-size:.9rem}
      #handwritingSizeControls input[type=range]{width:110px}
      #handwritingSizeControls output{min-width:42px}
      #handwritingSizeControls button{cursor:pointer}
    `;
    document.head.appendChild(style);
  }
  const penSizeEl = document.getElementById('penSizePad');
  const eraserSizeEl = document.getElementById('eraserSizePad');
  const penSizeValue = document.getElementById('penSizeValue');
  const eraserSizeValue = document.getElementById('eraserSizeValue');
  const copyPad = document.getElementById('copyPad');
  const pastePad = document.getElementById('pastePad');
  penSizeEl?.addEventListener('input', () => { penSize = Number(penSizeEl.value) || 4; if(penSizeValue) penSizeValue.textContent = `${penSize} px`; });
  eraserSizeEl?.addEventListener('input', () => { eraserSize = Number(eraserSizeEl.value) || 28; if(eraserSizeValue) eraserSizeValue.textContent = `${eraserSize} px`; });

  const SUB = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
  const normalizeDigits = s => String(s || '').replace(/[₀₁₂₃₄₅₆₇₈₉]/g, c => SUB[c]);
  const snapshot = () => ctx.getImageData(0, 0, canvas.width, canvas.height);
  const restore = img => { ctx.clearRect(0, 0, canvas.width, canvas.height); if (img) ctx.putImageData(img, 0, 0); };
  const updateButtons = () => { if (undo) undo.disabled = historyIndex <= 0; if (redo) redo.disabled = historyIndex < 0 || historyIndex >= history.length - 1; };
  const commitState = () => { history = history.slice(0, historyIndex + 1); history.push(snapshot()); historyIndex = history.length - 1; updateButtons(); };
  restore(null); commitState();

  function pos(e) { const r = canvas.getBoundingClientRect(); const p = e.touches ? e.touches[0] : e; return { x:(p.clientX-r.left)*canvas.width/r.width, y:(p.clientY-r.top)*canvas.height/r.height }; }
  function begin(e) { e.preventDefault(); e.stopImmediatePropagation(); drawing=true; last=pos(e); }
  function move(e) { if(!drawing)return; e.preventDefault(); e.stopImmediatePropagation(); const p=pos(e); ctx.save(); ctx.globalCompositeOperation=erasing?'destination-out':'source-over'; ctx.strokeStyle='#142033'; ctx.lineWidth=erasing?eraserSize:penSize; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.restore();last=p; }
  function end(e) { if(!drawing)return; e?.preventDefault?.();e?.stopImmediatePropagation?.();drawing=false;last=null;commitState(); }
  canvas.addEventListener('mousedown',begin,true);canvas.addEventListener('mousemove',move,true);window.addEventListener('mouseup',end,true);canvas.addEventListener('touchstart',begin,{capture:true,passive:false});canvas.addEventListener('touchmove',move,{capture:true,passive:false});canvas.addEventListener('touchend',end,{capture:true,passive:false});
  undo?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();if(historyIndex<=0)return;historyIndex--;restore(history[historyIndex]);updateButtons();});
  redo?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();if(historyIndex>=history.length-1)return;historyIndex++;restore(history[historyIndex]);updateButtons();});
  clear?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();restore(null);history=[snapshot()];historyIndex=0;updateButtons();if(status)status.textContent='Draw an equation, then tap Recognize.';out?.classList.add('hidden');document.getElementById('recognitionCorrection')?.classList.add('hidden');});
  eraser?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();erasing=!erasing;eraser.textContent=erasing?'Eraser ✓':'Eraser';eraser.classList.toggle('primary',erasing);eraser.classList.toggle('secondary',!erasing);if(status)status.textContent=erasing?'Eraser mode: draw over the strokes you want to remove.':'Pen mode.';});

  // Copy the canvas as a PNG. Paste accepts image data from the clipboard and
  // inserts it onto the canvas without replacing the existing handwriting.
  copyPad?.addEventListener('click', async e => {
    e.preventDefault(); e.stopImmediatePropagation();
    try {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Could not create image.');
      if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);
        if(status) status.textContent='Handwriting copied to clipboard.';
      } else {
        throw new Error('Image clipboard is not supported by this browser.');
      }
    } catch (err) {
      if(status) status.textContent=err.message||'Copy failed. Clipboard permission may be required.';
    }
  });

  async function pasteImageBlob(blob) {
    if (!blob || !blob.type.startsWith('image/')) return false;
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
      const scale=Math.min(canvas.width/img.naturalWidth, canvas.height/img.naturalHeight,1);
      const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
      const x=(canvas.width-w)/2,y=(canvas.height-h)/2;
      ctx.save();ctx.globalCompositeOperation='source-over';ctx.drawImage(img,x,y,w,h);ctx.restore();
      commitState();
      if(status) status.textContent='Image pasted into handwriting canvas.';
      return true;
    } finally { URL.revokeObjectURL(url); }
  }
  pastePad?.addEventListener('click', async e => {
    e.preventDefault(); e.stopImmediatePropagation();
    try {
      if (!navigator.clipboard?.read) throw new Error('Clipboard image paste is not supported here. Try Ctrl+V instead.');
      const items=await navigator.clipboard.read();
      for(const item of items){
        const type=item.types.find(t=>t.startsWith('image/'));
        if(type && await pasteImageBlob(await item.getType(type))) return;
      }
      throw new Error('No image was found in the clipboard.');
    } catch(err) {
      if(status) status.textContent=err.message||'Paste failed. Browser clipboard permission may be required.';
    }
  });
  window.addEventListener('paste', async e => {
    if (document.activeElement===input || document.activeElement?.tagName==='TEXTAREA') return;
    const files=[...(e.clipboardData?.items||[])].filter(x=>x.type.startsWith('image/'));
    if(!files.length)return;
    e.preventDefault();
    await pasteImageBlob(files[0].getAsFile());
  });

  const normalize=s=>normalizeDigits(String(s||'')).replace(/[\r\n]+/g,' ').replace(/[→⟶⇒➜⟹⟾]/g,' -> ').replace(/[×]/g,' + ').replace(/\s*[-]+>\s*/g,' -> ').replace(/\s*\+\s*/g,' + ').replace(/\s+/g,' ').trim();
  const pretty=s=>normalizeDigits(String(s||'')).replace(/([A-Z][a-z]?)(\d+)/g,'$1<sub>$2</sub>').replace(/\s*->\s*/g,' → ');
  const confidence=d=>{let n=Number(d?.confidence??d?.score??d?.data?.confidence);if(!Number.isFinite(n))return null;if(n<=1)n*=100;return Math.max(0,Math.min(100,Math.round(n)));};
  async function recognizeCloudflare(image){const base=window.CHEMISTRY_HANDWRITING_WORKER;if(!base)throw Error('Cloudflare handwriting Worker is not configured.');const r=await fetch(base.replace(/\/$/,'')+'/recognize',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image})});let d={};try{d=await r.json();}catch(_){}if(!r.ok)throw Error(d.error||`Cloudflare recognition returned HTTP ${r.status}`);if(!d.text)throw Error('Cloudflare returned no recognized equation.');return d;}
  async function recognizeLocal(image){if(!window.Tesseract)throw Error('Browser OCR is unavailable.');const r=await Tesseract.recognize(image,'eng');return {text:r.data?.text||'',confidence:r.data?.confidence};}
  async function recognize(){const correction=document.getElementById('recognitionCorrection'),edit=document.getElementById('recognizedEdit'),conf=document.getElementById('recognitionConfidence');if(status)status.textContent='Trying Cloudflare AI…';if(out){out.classList.remove('hidden');out.innerHTML='<p>Recognizing handwriting…</p>';}correction?.classList.add('hidden');let d,source='Cloudflare AI';try{d=await recognizeCloudflare(canvas.toDataURL('image/png'));}catch(_){source='Browser OCR';try{d=await recognizeLocal(canvas.toDataURL('image/png'));}catch(e2){if(status)status.textContent='Recognition failed';if(out)out.innerHTML=`<div class="validation-error"><b>Could not recognize the handwriting.</b><p>${e2.message}</p><p>Try larger, clearer symbols with spaces around + and →.</p></div>`;return;}}
    const text=normalize(d.text),score=confidence(d),uncertain=score!==null&&score<70;if(status)status.textContent=`Recognized with ${source}`;if(out)out.innerHTML=`<p><b>Recognized:</b> <span class="equation">${pretty(text)}</span></p><p class="muted">${score===null?'Confidence unavailable. Check the equation before balancing.':`Confidence: ${score}%${uncertain?' — uncertain; please check it.':''}`}</p>`;if(edit&&correction){edit.value=text;correction.classList.remove('hidden');if(conf)conf.innerHTML=score===null?'No confidence score was returned. Please verify every symbol.':`Recognition confidence: <b>${score}%</b>. ${uncertain?'Please correct the equation before balancing.':'Please verify capitalization and subscripts.'}`;}}
  use?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();recognize();});
  document.getElementById('balanceRecognized')?.addEventListener('click',e=>{e.preventDefault();const v=normalizeDigits(document.getElementById('recognizedEdit')?.value||'');const input=document.getElementById('equationInput');if(input)input.value=v;if(typeof window.showBalance==='function')window.showBalance(v);else document.getElementById('balanceBtn')?.click();});
})();