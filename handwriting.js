(() => {
  const pad = document.getElementById('pad');
  const use = document.getElementById('usePad');
  const input = document.getElementById('equationInput');
  if (!pad || !use || !input) return;

  const workerUrl = () => (window.CHEMISTRY_HANDWRITING_WORKER || '').replace(/\/$/, '') + '/recognize';

  function normalize(text) {
    return (text || '')
      .replace(/[→⟶➜⇒=]/g, ' -> ')
      .replace(/[×·]/g, '')
      .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, c => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c)))
      .replace(/\s+/g, ' ')
      .replace(/\s*\+\s*/g, ' + ')
      .replace(/\s*->\s*/g, ' -> ')
      .trim();
  }

  function canvasData() {
    // Crop to the drawing's bounding box and add a white margin.
    const ctx = pad.getContext('2d');
    const src = ctx.getImageData(0, 0, pad.width, pad.height).data;
    let minX = pad.width, minY = pad.height, maxX = -1, maxY = -1;
    for (let y = 0; y < pad.height; y++) for (let x = 0; x < pad.width; x++) {
      const a = src[(y * pad.width + x) * 4 + 3];
      if (a > 20) { minX=Math.min(minX,x); maxX=Math.max(maxX,x); minY=Math.min(minY,y); maxY=Math.max(maxY,y); }
    }
    if (maxX < 0) return null;
    const out = document.createElement('canvas');
    const scale = Math.min(1.5, 900 / Math.max(1, maxX-minX+1));
    out.width = Math.max(320, Math.ceil((maxX-minX+1)*scale)+80);
    out.height = Math.max(120, Math.ceil((maxY-minY+1)*scale)+80);
    const o = out.getContext('2d'); o.fillStyle='white'; o.fillRect(0,0,out.width,out.height);
    o.drawImage(pad, minX, minY, maxX-minX+1, maxY-minY+1, 40, 40, (maxX-minX+1)*scale, (maxY-minY+1)*scale);
    return out.toDataURL('image/png');
  }

  async function cloudflare(image) {
    const url = workerUrl();
    if (!url || url === '/recognize') throw new Error('Cloudflare worker URL is not configured');
    const r = await fetch(url, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({image})});
    if (!r.ok) throw new Error((await r.text()) || `Worker error ${r.status}`);
    const data = await r.json();
    if (!data.text) throw new Error('No equation recognized');
    return normalize(data.text);
  }

  async function tesseractFallback(image) {
    if (!window.Tesseract) {
      await new Promise((resolve, reject) => {
        const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/tesseract.min.js';
        s.onload=resolve; s.onerror=()=>reject(new Error('Could not load local OCR engine')); document.head.appendChild(s);
      });
    }
    const worker = await Tesseract.createWorker('eng', 1, {
      langPath:'https://tessdata.projectnaptha.com/4.0.0',
      logger: m => { if (m.status === 'recognizing text') use.textContent=`Local OCR ${Math.round((m.progress||0)*100)}%…`; }
    });
    await worker.setParameters({ tessedit_char_whitelist:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+->' });
    const result = await worker.recognize(image);
    await worker.terminate();
    const text = normalize(result?.data?.text || '');
    if (!text) throw new Error('Local OCR found no text');
    return text;
  }

  use.onclick = async () => {
    const image = canvasData();
    if (!image) { toast('Draw an equation first.'); return; }
    const old = use.textContent; use.disabled=true; use.textContent='Recognizing…';
    try {
      let text;
      try { text = await cloudflare(image); toast('Recognized with Cloudflare AI.'); }
      catch (cloudErr) {
        console.warn('Cloudflare recognition failed; using in-browser OCR fallback.', cloudErr);
        use.textContent='Trying local OCR…';
        text = await tesseractFallback(image);
        toast('Recognized locally in your browser.');
      }
      input.value = text;
      if (typeof window.showBalance === 'function') window.showBalance(text);
      else document.getElementById('balanceBtn').click();
    } catch (err) {
      toast('Could not recognize it. Try writing larger/clearer symbols or type it instead.');
      console.error(err);
    } finally { use.disabled=false; use.textContent=old; }
  };
})();
