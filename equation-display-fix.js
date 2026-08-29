(()=>{
'use strict';
const SUB='₀₁₂₃₄₅₆₇₈₉';
const REV=Object.fromEntries([...SUB].map((c,i)=>[c,String(i)]));
const TARGETS='.history-equation,.history-solution,.history-balanced-equation,.equation,.balance-correction,.practice-equation,.practice-choice,.checker-equation,.checker-balance-cta';
function repairTextNode(node){
  const text=node.nodeValue||'';
  const fixed=text
    .replace(/(^|[→+])([₀₁₂₃₄₅₆₇₈₉]+)(?=\s*[A-Z])/g,(m,p,d)=>p+[...d].map(c=>REV[c]).join(''))
    .replace(/(^|\s)([₀₁₂₃₄₅₆₇₈₉]+)(?=[A-Z][a-z]?(?:\(|$))/g,(m,p,d)=>p+[...d].map(c=>REV[c]).join(''));
  if(fixed!==text)node.nodeValue=fixed;
}
function scan(root=document){root.querySelectorAll?.(TARGETS).forEach(el=>{const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode())repairTextNode(n)});}
scan();
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)}))).observe(document.documentElement,{childList:true,subtree:true});
})();
