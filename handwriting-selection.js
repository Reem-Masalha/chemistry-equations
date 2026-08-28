(()=>{
'use strict';
const pad=document.getElementById('pad');
const erase=document.getElementById('erasePad');
if(!pad||!erase)return;
const ctx=pad.getContext('2d');
let mode='draw', selecting=false, start=null, selection=null, clipboardCanvas=null;
const host=erase.parentElement;
if(!host)return;
const old=document.getElementById('handwritingSelectTools'); if(old)old.remove();
const panel=document.createElement('div');
panel.id='handwritingSelectTools';
panel.className='pad-tools';
panel.style.cssText='display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px';
panel.innerHTML='<button type="button" id="selectPad" class="secondary">Select</button><button type="button" id="copySelectionPad" class="secondary" disabled>Copy selection</button><button type="button" id="pasteSelectionPad" class="secondary">Paste selection</button><span id="selectionStatus" class="muted">Select part of the handwriting to copy.</span>';
host.parentElement.appendChild(panel);
const selectBtn=panel.querySelector('#selectPad'),copyBtn=panel.querySelector('#copySelectionPad'),pasteBtn=panel.querySelector('#pasteSelectionPad'),statusEl=panel.querySelector('#selectionStatus');
const status=s=>statusEl.textContent=s;
function pos(e){const r=pad.getBoundingClientRect();return{x:(e.clientX-r.left)*pad.width/r.width,y:(e.clientY-r.top)*pad.height/r.height}}
function normalizeBox(a,b){const x=Math.max(0,Math.min(a.x,b.x)),y=Math.max(0,Math.min(a.y,b.y)),x2=Math.min(pad.width,Math.max(a.x,b.x)),y2=Math.min(pad.height,Math.max(a.y,b.y));return{x,y,w:Math.max(1,x2-x),h:Math.max(1,y2-y)}}
const overlay=document.createElement('canvas');overlay.width=pad.width;overlay.height=pad.height;overlay.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:none';pad.parentElement.style.position='relative';pad.parentElement.appendChild(overlay);const oc=overlay.getContext('2d');
function showBox(){oc.clearRect(0,0,overlay.width,overlay.height);if(!selection)return;oc.save();oc.setLineDash([8,5]);oc.lineWidth=3;oc.strokeStyle='#1565c0';oc.strokeRect(selection.x,selection.y,selection.w,selection.h);oc.restore()}
function setMode(m){mode=m;selectBtn.textContent=m==='select'?'Done selecting':m==='paste'?'Cancel paste':'Select';overlay.style.display=m==='select'?'block':'none';pad.style.cursor=m==='select'?'crosshair':m==='paste'?'copy':'default';status(m==='select'?'Drag a box around the handwriting you want to copy.':m==='paste'?'Click the canvas where you want to paste it.':'Select part of the handwriting to copy.')}
selectBtn.onclick=()=>setMode(mode==='select'?'draw':'select');
copyBtn.onclick=async()=>{if(!selection)return;clipboardCanvas=document.createElement('canvas');clipboardCanvas.width=Math.ceil(selection.w);clipboardCanvas.height=Math.ceil(selection.h);clipboardCanvas.getContext('2d').drawImage(pad,selection.x,selection.y,selection.w,selection.h,0,0,clipboardCanvas.width,clipboardCanvas.height);pasteBtn.disabled=false;try{const blob=await new Promise(r=>clipboardCanvas.toBlob(r,'image/png'));if(blob&&navigator.clipboard?.write&&typeof ClipboardItem!=='undefined')await navigator.clipboard.write([new ClipboardItem({'image/png':blob})])}catch{}status('Copied. Click Paste selection, then click the destination on the canvas.');};
pasteBtn.onclick=async()=>{if(!clipboardCanvas){try{for(const item of await navigator.clipboard.read())for(const type of item.types)if(type.startsWith('image/')){const blob=await item.getType(type),img=new Image();img.onload=()=>{clipboardCanvas=document.createElement('canvas');clipboardCanvas.width=img.width;clipboardCanvas.height=img.height;clipboardCanvas.getContext('2d').drawImage(img,0,0);setMode('paste')};img.src=URL.createObjectURL(blob);return}}catch{}status('Copy a selection first, or copy an image to your clipboard.');return}setMode('paste')};
pad.addEventListener('pointerdown',e=>{if(mode==='select'){start=pos(e);selection=null;copyBtn.disabled=true;e.preventDefault();pad.setPointerCapture?.(e.pointerId)}else if(mode==='paste'&&clipboardCanvas){const p=pos(e),x=Math.max(0,Math.min(p.x-clipboardCanvas.width/2,pad.width-clipboardCanvas.width)),y=Math.max(0,Math.min(p.y-clipboardCanvas.height/2,pad.height-clipboardCanvas.height));ctx.drawImage(clipboardCanvas,x,y);setMode('draw');status('Pasted.');e.preventDefault()}},true);
pad.addEventListener('pointermove',e=>{if(mode!=='select'||!start)return;selection=normalizeBox(start,pos(e));showBox();e.preventDefault()},true);
pad.addEventListener('pointerup',e=>{if(mode!=='select'||!start)return;selection=normalizeBox(start,pos(e));start=null;showBox();copyBtn.disabled=selection.w<4||selection.h<4;status(copyBtn.disabled?'Selection too small.':'Selection ready. Click Copy selection, then Paste selection and click where you want it.');e.preventDefault()},true);
window.__handwritingSelection={get selection(){return selection},setMode};
})();