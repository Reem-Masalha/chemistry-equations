(()=>{
'use strict';
const SUB='₀₁₂₃₄₅₆₇₈₉';
const normal=d=>String(d).replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'[SUB.indexOf(c)]);
const selectors=['.equation','.history-equation','.history-solution','.history-balanced-equation','.checker-equation','.explanation-equation','.problem-preview'];
function fix(root=document){
  for(const el of root.querySelectorAll(selectors.join(','))){
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes){
      let s=node.nodeValue;
      // A number immediately after the beginning, +, or reaction arrow is a coefficient.
      s=s.replace(/(^|(?<=\+)|(?<=→)\s*)([₀₁₂₃₄₅₆₇₈₉]+)(?=[A-Z])/g,(m,p,n)=>p+normal(n));
      if(s!==node.nodeValue)node.nodeValue=s;
    }
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>fix());else fix();
new MutationObserver(muts=>{for(const m of muts)for(const n of m.addedNodes)if(n.nodeType===1)fix(n)}).observe(document.documentElement,{childList:true,subtree:true});
})();
