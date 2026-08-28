(()=>{
'use strict';
function init(){
 const pad=document.getElementById('pad'); if(!pad)return;
 const existing=document.getElementById('handwritingSelectTools'); if(existing)existing.remove();
 let mode='draw',dragging=false,start=null,selection=null,clipboardCanvas=null;
 const panel=document.createElement('div');
 panel.id='handwritingSelectTools';
 panel.className='pad-tools';
 panel.style.cssText='display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:8px';
 panel.innerHTML='<button type="button" id="selectPad" class="secondary">Select</button><button type="button" id="copySelectionPad" class="secondary" disabled>Copy selection</button><button type="button" id="pasteSelectionPad" class="secondary">Paste selection</button><span id="selectionStatus" class="muted">Tap Select, then drag over handwriting.</span>';
 pad.insertAdjacentElement('afterend',panel);
 const selectBtn=panel.querySelector('#selectPad'),copyBtn=panel.querySelector('#copySelectionPad'),pasteBtn=panel.querySelector('#pasteSelectionPad'),status=panel.querySelector('#selectionStatus');
 const overlay=document.createElement('div');
 overlay.id='handwritingSelectionOverlay';
 overlay.style.cssText='position:fixed;z-index:2147483646;display:none;pointer-events:auto;cursor:crosshair;background:transparent;touch-action:none;box-sizing:border-box';
 document.body.appendChild(overlay);
 const box=document.createElement('div');
 box.style.cssText='position:absolute;display:none;box-sizing:border-box;border:2px dashed #3158d6;background:rgba(49,88,214,.08);pointer-events:none';
 overlay.appendChild(box);
 function syncOverlay(){const r=pad.getBoundingClientRect();overlay.style.left=r.left+'px';overlay.style.top=r.top+'px';overlay.style.width=r.width+'px';overlay.style.height=r.height+'px'}
 function point(e){const r=overlay.getBoundingClientRect();return{x:Math.max(0,Math.min(pad.width,(e.clientX-r.left)*pad.width/r.width)),y:Math.max(0,Math.min(pad.height,(e.clientY-r.top)*pad.height/r.height))}}
 function render(){if(!selection){box.style.display='none';return}const r=overlay.getBoundingClientRect();box.style.display='block';box.style.left=selection.x*r.width/pad.width+'px';box.style.top=selection.y*r.height/pad.height+'px';box.style.width=selection.w*r.width/pad.width+'px';box.style.height=selection.h*r.height/pad.height+'px'}
 function setMode(next){mode=next;dragging=false;start=null;syncOverlay();overlay.style.display=(next==='select'||next==='paste')?'block':'none';box.style.display=next==='select'&&selection?'block':'none';selectBtn.textContent=next==='select'?'Cancel selection':'Select';selectBtn.setAttribute('aria-pressed',next==='select'?'true':'false');overlay.style.cursor=next==='paste'?'copy':'crosshair';status.textContent=next==='select'?'Drag from one corner to the other around the handwriting.':next==='paste'?'Click exactly where you want the copied handwriting placed.':'Tap Select, then drag over handwriting.';}
 selectBtn.onclick=e=>{e.preventDefault();e.stopPropagation();setMode(mode==='select'?'draw':'select')};
 overlay.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(mode==='paste'&&clipboardCanvas){const p=point(e),x=Math.max(0,Math.min(p.x-clipboardCanvas.width/2,pad.width-clipboardCanvas.width)),y=Math.max(0,Math.min(p.y-clipboardCanvas.height/2,pad.height-clipboardCanvas.height));pad.getContext('2d').drawImage(clipboardCanvas,x,y);setMode('draw');status.textContent='Pasted.';return}if(mode!=='select')return;dragging=true;start=point(e);selection={x:start.x,y:start.y,w:0,h:0};copyBtn.disabled=true;overlay.setPointerCapture?.(e.pointerId);render()});
 overlay.addEventListener('pointermove',e=>{if(mode!=='select'||!dragging)return;e.preventDefault();e.stopPropagation();const p=point(e);selection={x:Math.min(start.x,p.x),y:Math.min(start.y,p.y),w:Math.abs(p.x-start.x),h:Math.abs(p.y-start.y)};render()});
 overlay.addEventListener('pointerup',e=>{if(mode!=='select'||!dragging)return;e.preventDefault();e.stopPropagation();const p=point(e);selection={x:Math.min(start.x,p.x),y:Math.min(start.y,p.y),w:Math.abs(p.x-start.x),h:Math.abs(p.y-start.y)};dragging=false;start=null;render();copyBtn.disabled=selection.w<8||selection.h<8;status.textContent=copyBtn.disabled?'Drag a larger rectangle around the handwriting.':'Selection ready. Tap Copy selection.'});
 overlay.addEventListener('pointercancel',()=>{dragging=false;start=null});
 copyBtn.onclick=async e=>{e.preventDefault();e.stopPropagation();if(!selection||selection.w<8||selection.h<8)return;clipboardCanvas=document.createElement('canvas');clipboardCanvas.width=Math.ceil(selection.w);clipboardCanvas.height=Math.ceil(selection.h);clipboardCanvas.getContext('2d').drawImage(pad,selection.x,selection.y,selection.w,selection.h,0,0,selection.w,selection.h);try{const blob=await new Promise(r=>clipboardCanvas.toBlob(r,'image/png'));if(blob&&navigator.clipboard?.write&&typeof ClipboardItem!=='undefined')await navigator.clipboard.write([new ClipboardItem({'image/png':blob})])}catch{}status.textContent='Copied. Tap Paste selection, then click the destination.'};
 pasteBtn.onclick=async e=>{e.preventDefault();e.stopPropagation();if(clipboardCanvas){setMode('paste');return}try{const items=await navigator.clipboard.read();for(const item of items){const type=item.types.find(t=>t.startsWith('image/'));if(!type)continue;const blob=await item.getType(type),img=new Image();img.onload=()=>{clipboardCanvas=document.createElement('canvas');clipboardCanvas.width=img.naturalWidth;clipboardCanvas.height=img.naturalHeight;clipboardCanvas.getContext('2d').drawImage(img,0,0);setMode('paste')};img.src=URL.createObjectURL(blob);return}}catch{}status.textContent='Nothing copied yet. Select and copy handwriting first.'};
 window.addEventListener('resize',()=>{if(mode==='select'||mode==='paste')syncOverlay();if(selection)render()});
 window.addEventListener('scroll',()=>{if(mode==='select'||mode==='paste')syncOverlay();if(selection)render()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();