(()=>{
'use strict';
const input=document.getElementById('equationInput');
const editor=document.getElementById('equationEditor');
if(!input||!editor)return;
const subMap={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
const normalize=s=>String(s||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>subMap[c]).replace(/⟶|⇒|➜|⟹|⟾|=>|->/g,'→').replace(/\s+/g,' ').trim();
function syncInput(){input.value=normalize(editor.textContent||'');input.dispatchEvent(new Event('input',{bubbles:true}));}
function setValue(value){const raw=String(value||'').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>subMap[c]);editor.textContent=raw.replace(/([A-Za-z\)])(\d+)/g,(m,p,n)=>p+n.split('').map(d=>'₀₁₂₃₄₅₆₇₈₉'[+d]).join(''));syncInput();}
function insertText(text){editor.focus();const sel=window.getSelection();if(!sel||!sel.rangeCount){editor.append(document.createTextNode(text));syncInput();return}const range=sel.getRangeAt(0);if(!editor.contains(range.commonAncestorContainer)){editor.focus();return insertText(text)}range.deleteContents();const node=document.createTextNode(text);range.insertNode(node);range.setStartAfter(node);range.collapse(true);sel.removeAllRanges();sel.addRange(range);syncInput()}
function placeCaretEnd(){editor.focus();const r=document.createRange();r.selectNodeContents(editor);r.collapse(false);const s=window.getSelection();s.removeAllRanges();s.addRange(r)}
editor.addEventListener('input',syncInput);
editor.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();document.getElementById('balanceBtn')?.click()}if(e.key==='Escape'){editor.blur()}});
editor.addEventListener('paste',e=>{e.preventDefault();insertText((e.clipboardData||window.clipboardData).getData('text/plain'))});
document.querySelectorAll('[data-editor-insert]').forEach(button=>button.addEventListener('mousedown',e=>e.preventDefault()));
document.querySelectorAll('[data-editor-insert]').forEach(button=>button.addEventListener('click',()=>insertText(button.dataset.editorInsert)));
document.getElementById('editorUndo')?.addEventListener('click',()=>{editor.focus();document.execCommand('undo');syncInput()});
document.getElementById('editorClear')?.addEventListener('click',()=>{editor.textContent='';syncInput();placeCaretEnd()});
editor.addEventListener('focus',()=>editor.classList.add('is-focused'));
editor.addEventListener('blur',()=>editor.classList.remove('is-focused'));
window.chemEquationEditor={setValue,getValue:()=>normalize(editor.textContent||''),sync:syncInput,focus:placeCaretEnd};
})();
