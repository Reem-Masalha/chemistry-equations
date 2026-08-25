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

  const snapshot = () => ctx.getImageData(0, 0, canvas.width, canvas.height);
  const restore = img => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (img) ctx.putImageData(img, 0, 0);
  };
  const updateButtons = () => {
    if (undo) undo.disabled = historyIndex <= 0;
    if (redo) redo.disabled = historyIndex < 0 || historyIndex >= history.length - 1;
  };
  const commitState = () => {
    history = history.slice(0, historyIndex + 1);
    history.push(snapshot());
    historyIndex = history.length - 1;
    updateButtons();
  };
  restore(null);
  commitState();

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return {
      x: (p.clientX - r.left) * canvas.width / r.width,
      y: (p.clientY - r.top) * canvas.height / r.height
    };
  }
  function begin(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    drawing = true;
    last = pos(e);
  }
  function move(e) {
    if (!drawing) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const p = pos(e);
    ctx.save();
    ctx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
    ctx.strokeStyle = '#142033';
    ctx.lineWidth = erasing ? 28 : 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.restore();
    last = p;
  }
  function end(e) {
    if (!drawing) return;
    e?.preventDefault?.();
    e?.stopImmediatePropagation?.();
    drawing = false;
    last = null;
    commitState();
  }

  canvas.addEventListener('mousedown', begin, true);
  canvas.addEventListener('mousemove', move, true);
  window.addEventListener('mouseup', end, true);
  canvas.addEventListener('touchstart', begin, { capture: true, passive: false });
  canvas.addEventListener('touchmove', move, { capture: true, passive: false });
  canvas.addEventListener('touchend', end, { capture: true, passive: false });

  undo?.addEventListener('click', e => {
    e.preventDefault(); e.stopImmediatePropagation();
    if (historyIndex <= 0) return;
    historyIndex--;
    restore(history[historyIndex]);
    updateButtons();
  });
  redo?.addEventListener('click', e => {
    e.preventDefault(); e.stopImmediatePropagation();
    if (historyIndex >= history.length - 1) return;
    historyIndex++;
    restore(history[historyIndex]);
    updateButtons();
  });
  clear?.addEventListener('click', e => {
    e.preventDefault(); e.stopImmediatePropagation();
    restore(null);
    history = [snapshot()];
    historyIndex = 0;
    updateButtons();
    if (status) status.textContent = 'Draw an equation, then tap Recognize.';
    out?.classList.add('hidden');
    document.getElementById('recognitionCorrection')?.classList.add('hidden');
  });
  eraser?.addEventListener('click', e => {
    e.preventDefault(); e.stopImmediatePropagation();
    erasing = !erasing;
    eraser.textContent = erasing ? 'Eraser ✓' : 'Eraser';
    eraser.classList.toggle('primary', erasing);
    eraser.classList.toggle('secondary', !erasing);
    if (status) status.textContent = erasing ? 'Eraser mode: draw over the strokes you want to remove.' : 'Pen mode.';
  });

  const normalize = s => String(s || '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/[→⟶⇒➜=]/g, ' -> ')
    .replace(/\s*[-]+>\s*/g, ' -> ')
    .replace(/\s*\+\s*/g, ' + ')
    .replace(/\s+/g, ' ')
    .trim();
  const pretty = s => String(s || '')
    .replace(/([A-Z][a-z]?)(\d+)/g, '$1<sub>$2</sub>')
    .replace(/\s*->\s*/g, ' → ');
  const confidence = d => {
    let n = Number(d?.confidence ?? d?.score ?? d?.data?.confidence);
    if (!Number.isFinite(n)) return null;
    if (n <= 1) n *= 100;
    return Math.max(0, Math.min(100, Math.round(n)));
  };
  async function recognizeCloudflare(image) {
    const base = window.CHEMISTRY_HANDWRITING_WORKER;
    if (!base) throw Error('Cloudflare handwriting Worker is not configured.');
    const r = await fetch(base.replace(/\/$/, '') + '/recognize', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image })
    });
    let d = {}; try { d = await r.json(); } catch (_) {}
    if (!r.ok) throw Error(d.error || `Cloudflare recognition returned HTTP ${r.status}`);
    if (!d.text) throw Error('Cloudflare returned no recognized equation.');
    return d;
  }
  async function recognizeLocal(image) {
    if (!window.Tesseract) throw Error('Browser OCR is unavailable.');
    const r = await Tesseract.recognize(image, 'eng');
    return { text: r.data?.text || '', confidence: r.data?.confidence };
  }
  async function recognize() {
    const correction = document.getElementById('recognitionCorrection');
    const edit = document.getElementById('recognizedEdit');
    const conf = document.getElementById('recognitionConfidence');
    if (status) status.textContent = 'Trying Cloudflare AI…';
    if (out) { out.classList.remove('hidden'); out.innerHTML = '<p>Recognizing handwriting…</p>'; }
    correction?.classList.add('hidden');
    let d, source = 'Cloudflare AI';
    try { d = await recognizeCloudflare(canvas.toDataURL('image/png')); }
    catch (_) {
      source = 'Browser OCR';
      try { d = await recognizeLocal(canvas.toDataURL('image/png')); }
      catch (e2) {
        if (status) status.textContent = 'Recognition failed';
        if (out) out.innerHTML = `<div class="validation-error"><b>Could not recognize the handwriting.</b><p>${e2.message}</p><p>Try larger, clearer symbols with spaces around + and →.</p></div>`;
        return;
      }
    }
    const text = normalize(d.text);
    const score = confidence(d);
    const uncertain = score !== null && score < 70;
    if (status) status.textContent = `Recognized with ${source}`;
    if (out) out.innerHTML = `<p><b>Recognized:</b> <span class="equation">${pretty(text)}</span></p><p class="muted">${score === null ? 'Confidence unavailable. Check the equation before balancing.' : `Confidence: ${score}%${uncertain ? ' — uncertain; please check it.' : ''}`}</p>`;
    if (edit && correction) {
      edit.value = text;
      correction.classList.remove('hidden');
      if (conf) conf.innerHTML = score === null ? 'No confidence score was returned. Please verify every symbol.' : `Recognition confidence: <b>${score}%</b>. ${uncertain ? 'Please correct the equation before balancing.' : 'Please verify capitalization and subscripts.'}`;
    }
  }
  use?.addEventListener('click', e => { e.preventDefault(); e.stopImmediatePropagation(); recognize(); });
  document.getElementById('balanceRecognized')?.addEventListener('click', e => {
    e.preventDefault();
    const v = document.getElementById('recognizedEdit')?.value || '';
    const input = document.getElementById('equationInput');
    if (input) input.value = v;
    if (typeof window.showBalance === 'function') window.showBalance(v);
    else document.getElementById('balanceBtn')?.click();
  });
})();
