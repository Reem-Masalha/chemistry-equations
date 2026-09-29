(()=>{
'use strict';
const input=document.getElementById('equationInput');
const editor=document.getElementById('equationEditor');
if(!input||!editor)return;
const subMap={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
const normalize=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>subMap[c]).replace(/⟶|⇒|➜|⟹|⟾|=>|->/g,'→').replace(/\s+/g,' ').trim();
const normalizeCoefficientZeros=s=>String(s||'').replace(/(^|[+→])(\s*)0+(?=\d)/g,'$1$2');
function caretOffset(){
 const sel=window.getSelection();
 if(!sel||!sel.rangeCount||!editor.contains(sel.anchorNode))return null;
 const range=sel.getRangeAt(0).cloneRange();
 range.selectNodeContents(editor);
 range.setEnd(sel.anchorNode,sel.anchorOffset);
 return range.toString().length;
}
function restoreCaret(offset){
 if(offset==null)return;
 const range=document.createRange(),sel=window.getSelection();
 let remaining=offset,node=null,offsetInNode=0;
 const walker=document.createTreeWalker(editor,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){
   const n=walker.currentNode;
   if(remaining<=n.nodeValue.length){node=n;offsetInNode=remaining;break}
   remaining-=n.nodeValue.length;
 }
 if(!node){range.selectNodeContents(editor);range.collapse(false)}else{range.setStart(node,offsetInNode);range.collapse(true)}
 sel.removeAllRanges();sel.addRange(range);
}
function normalizeEditorCoefficients(){
 const raw=editor.textContent||'',normalized=normalizeCoefficientZeros(raw);
 if(raw===normalized)return;
 const offset=caretOffset();
 editor.textContent=normalized;
 restoreCaret(Math.min(offset??normalized.length,normalized.length));
}
let history=[editor.textContent||''],historyIndex=0,restoring=false,coeffPanel=null;
function syncInput(){input.value=normalize(editor.textContent||'');input.dispatchEvent(new Event('input',{bubbles:true}))}
function recordHistory(){if(restoring)return;const value=editor.textContent||'';if(value===history[historyIndex])return;history=history.slice(0,historyIndex+1);history.push(value);if(history.length>80)history.shift();historyIndex=history.length-1}
function resetHistory(){history=[editor.textContent||''];historyIndex=0}
function setValue(value){const raw=normalizeCoefficientZeros(String(value||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>subMap[c]));editor.textContent=raw.replace(/([A-Za-z\)])(\d+)/g,(m,p,n)=>p+n.split('').map(d=>'₀₁₂₃₄₅₆₇₈₉'[+d]).join(''));resetHistory();syncInput()}
function placeCaretEnd(){editor.focus();const r=document.createRange();r.selectNodeContents(editor);r.collapse(false);const s=window.getSelection();s.removeAllRanges();s.addRange(r)}
function insertText(text){editor.focus();let inserted=false;try{inserted=document.execCommand('insertText',false,text)}catch{}if(!inserted){const sel=window.getSelection();if(!sel||!sel.rangeCount)return;const range=sel.getRangeAt(0);if(!editor.contains(range.commonAncestorContainer)){placeCaretEnd();return insertText(text)}range.deleteContents();const node=document.createTextNode(text);range.insertNode(node);range.setStartAfter(node);range.collapse(true);sel.removeAllRanges();sel.addRange(range);recordHistory()}syncInput()}
function undo(){if(historyIndex<=0){try{document.execCommand('undo')}catch{}syncInput();return}restoring=true;historyIndex--;editor.textContent=history[historyIndex];restoring=false;placeCaretEnd();syncInput()}
editor.addEventListener('input',()=>{normalizeEditorCoefficients();recordHistory();syncInput()});
editor.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();document.getElementById('balanceBtn')?.click()}if(e.key==='Escape'){editor.blur();coeffPanel?.classList.remove('is-open')}});
editor.addEventListener('paste',e=>{e.preventDefault();insertText((e.clipboardData||window.clipboardData).getData('text/plain'))});
document.querySelectorAll('[data-editor-insert]').forEach(button=>{button.addEventListener('mousedown',e=>e.preventDefault());button.addEventListener('click',()=>insertText(button.dataset.editorInsert))});
document.getElementById('editorUndo')?.addEventListener('click',undo);
document.getElementById('editorClear')?.addEventListener('click',()=>{if(editor.textContent){editor.textContent='';recordHistory()}syncInput();placeCaretEnd()});
document.getElementById('editorCoeffToggle')?.addEventListener('click',()=>{coeffPanel=document.getElementById('editorCoeffDigits');const open=coeffPanel?.classList.toggle('is-open');const button=document.getElementById('editorCoeffToggle');button?.setAttribute('aria-expanded',String(!!open));if(open)editor.focus()});
document.querySelectorAll('[data-editor-coeff]').forEach(button=>{button.addEventListener('mousedown',e=>e.preventDefault());button.addEventListener('click',()=>insertText(button.dataset.editorCoeff))});
editor.addEventListener('focus',()=>editor.classList.add('is-focused'));
editor.addEventListener('blur',()=>editor.classList.remove('is-focused'));
window.chemEquationEditor={setValue,getValue:()=>normalize(editor.textContent||''),sync:syncInput,focus:placeCaretEnd,undo};
})();