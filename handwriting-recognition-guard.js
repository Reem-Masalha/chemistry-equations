/* Conservative handwriting-recognition guard: reject implausibly expanded OCR. */
(() => {
  const canvas=document.getElementById('pad'), result=document.getElementById('recognitionResult'), status=document.getElementById('recognitionStatus');
  if(!canvas||!result)return;
  const inkWidth=()=>{try{const c=canvas.getContext('2d',{willReadFrequently:true}),d=c.getImageData(0,0,canvas.width,canvas.height).data;let a=canvas.width,b=-1;for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){const i=(y*canvas.width+x)*4;if(d[i+3]>20&&(d[i]<245||d[i+1]<245||d[i+2]<245)){if(x<a)a=x;if(x>b)b=x}}return b>=a?b-a+1:0}catch(e){return 0}};
  const norm=t=>String(t||'').replace(/[\r\n]+/g,' ').replace(/[→⟶⇒➜]/g,'->').replace(/\s+/g,' ').trim();
  const expanded=t=>{t=norm(t);const w=inkWidth();if(!w)return false;const max=Math.max(4,Math.ceil(w/12)+3);return (w<canvas.width*.35&&t.length>max*1.5)||(w<canvas.width*.15&&(t.includes('->')||t.length>6))};
  const reject=t=>{result.classList.remove('hidden');result.innerHTML='<div class="validation-error"><b>⚠ Recognition was too expansive</b><p>The recognizer returned more chemistry than was actually written. The recognizer will not complete an incomplete reaction automatically.</p><p>Please write the remaining part yourself and tap Recognize again.</p></div>';if(status)status.textContent='Recognition rejected: it added text that was not written.';const e=document.getElementById('recognizedEdit'),c=document.getElementById('recognitionCorrection');if(e)e.value=norm(t).slice(0,120);if(c)c.classList.remove('hidden')};
  const check=()=>{const q=result.querySelector('.equation');if(q&&expanded(q.textContent||''))reject(q.textContent||'')};
  new MutationObserver(()=>setTimeout(check,0)).observe(result,{childList:true,subtree:true,characterData:true});
})();
