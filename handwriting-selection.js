(()=>{
'use strict';
const pad=document.getElementById('pad');
const erase=document.getElementById('erasePad');
if(!pad||!erase)return;
const ctx=pad.getContext('2d');
let mode='draw', selecting=false, moving=false, start=null, selection=null, clipboardCanvas=null;
const host=erase.parentElement;
if(!host)return;
const makeButton=(id,text)=>{let b=document.getElementById(id);if(!b){b=document.createElement('button');b.id=id;b.type='button';b.className='secondary';b.textContent=text;host.insertBefore(b,document.getElementById('usePad'));}return b};
const selectBtn=makeButton('selectPad','Select');
const copySel=makeButton('copySelectionPad','Copy selection');
const pasteSel=makeButton('pasteSelectionPad','Paste selection');
copySel.disabled=true;
pasteSel.disabled=true;
const status=msg=>{const s=document.getElementById('recognitionStatus');if(s)s.textContent=msg};
function pos(e){const r=pad.getBoundingClientRect(),p=e.touches?.[0]||e;return{x:(p.clientX-r.left)*pad.width/r.width,y:(p.clientY-r.top)*pad.height/r.height}}
function norm(a,b){const x=Math.max(0,Math.min(a.x,b.x)),y=Math.max(0,Math.min(a.y,b.y)),x2=Math.min(pad.width,Math.max(a.x,b.x)),y2=Math.min(pad.height,Math.max(a.y,b.y));return{x,y,w:Math.max(1,x2-x),h:Math.max(1,y2-y)}}
function drawSelection(){if(!selection)return;ctx.save();ctx.setLineDash([8,5]);ctx.lineWidth=2;ctx.strokeStyle='#1565c0';ctx.strokeRect(selection.x,selection.y,selection.w,selection.h);ctx.restore()}
function snapshot(){return pad.toDataURL()}
function restore(data){if(!data)return;const im=new Image();im.onload=()=>{ctx.clearRect(0,0,pad.width,pad.height);ctx.drawImage(im,0,0)};im.src=data}
function saveHistory(){const h=window.__handwritingHistory;if(h&&Array.isArray(h.history)&&Array.isArray(h.future)){h.history.push(snapshot());h.future.length=0}}
function setMode(m){mode=m;selectBtn.textContent=m==='select'?'Drawing':'Select';pad.classList.toggle('selection-mode',m==='select');status(m==='select'?'Select handwriting to copy, then click where you want to paste it.':'Drawing mode selected.')}
selectBtn.addEventListener('click',e=>{e.preventDefault();setMode(mode==='select'?'draw':'select')});
copySel.addEventListener('click',async e=>{e.preventDefault();if(!selection)return;const c=document.createElement('canvas');c.width=Math.ceil(selection.w);c.height=Math.ceil(selection.h);c.getContext('2d').drawImage(pad,selection.x,selection.y,selection.w,selection.h,0,0,c.width,c.height);clipboardCanvas=c;pasteSel.disabled=false;try{const blob=await new Promise(r=>c.toBlob(r,'image/png'));if(blob&&navigator.clipboard?.write&&typeof ClipboardItem!=='undefined')await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);status('Selection copied. Click Paste selection, then click the canvas where you want it pasted.')}catch{status('Selection copied. Click Paste selection, then click the canvas where you want it pasted.')}});
pasteSel.addEventListener('click',e=>{e.preventDefault();if(!clipboardCanvas){status('Copy a selection first.');return}moving=true;mode='paste';selectBtn.textContent='Cancel paste';status('Click the canvas where you want the copied handwriting pasted.')});
pad.addEventListener('pointerdown',e=>{if(mode==='draw')return;if(mode==='select'){selecting=true;start=pos(e);selection=null;copySel.disabled=true;pad.setPointerCapture?.(e.pointerId);e.preventDefault()}else if(mode==='paste'&&clipboardCanvas){const p=pos(e);const x=Math.max(0,Math.min(p.x-clipboardCanvas.width/2,pad.width-clipboardCanvas.width));const y=Math.max(0,Math.min(p.y-clipboardCanvas.height/2,pad.height-clipboardCanvas.height));ctx.drawImage(clipboardCanvas,x,y);saveHistory();futureClear();moving=false;mode='select';selectBtn.textContent='Drawing';status('Selection pasted. Select another area or choose Drawing.');e.preventDefault()}} ,true);
pad.addEventListener('pointermove',e=>{if(mode!=='select'||!selecting)return;selection=norm(start,pos(e));copySel.disabled=false;ctx.clearRect(0,0,pad.width,pad.height);restoreSelectionBase();drawSelection();e.preventDefault()},true);
pad.addEventListener('pointerup',e=>{if(!selecting)return;selecting=false;drawSelection();if(selection){copySel.disabled=false;status('Selection ready. Tap Copy selection, then Paste selection and click its destination.')}},true);
let baseBeforeSelection=null;
function restoreSelectionBase(){if(!baseBeforeSelection)baseBeforeSelection=snapshot();const im=new Image();im.onload=()=>{ctx.clearRect(0,0,pad.width,pad.height);ctx.drawImage(im,0,0);drawSelection()};im.src=baseBeforeSelection}
pad.addEventListener('pointerdown',e=>{if(mode==='select')baseBeforeSelection=snapshot()},true);
pad.addEventListener('pointerup',()=>{if(mode==='select')baseBeforeSelection=null},true);
function futureClear(){if(window.__handwritingHistory?.future)window.__handwritingHistory.future.length=0}
// Expose a small history bridge for this add-on without changing the existing handwriting API.
window.__handwritingSelection={get selection(){return selection},clear:()=>{selection=null;copySel.disabled=true},setMode};
})();