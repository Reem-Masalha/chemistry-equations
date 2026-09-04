(()=>{
'use strict';
const SUB='₀₁₂₃₄₅₆₇₈₉';
const REV=Object.fromEntries([...SUB].map((c,i)=>[c,String(i)]));
const selectors=['.equation','.history-equation','.history-solution','.history-balanced-equation','.checker-equation','.explanation-equation','.problem-preview','.practice-equation','.practice-choice','.checker-balance-cta'];
const normal=s=>[...String(s||'')].map(c=>REV[c]??c).join('');
const lowerStates=s=>String(s??'').replace(/\(\s*(AQ|S|L|G)\s*\)/g,(_,state)=>`(${state.toLowerCase()})`);
function isMoleculeStartSub(el){
  if(!el||el.tagName!=='SUB')return false;
  const raw=(el.textContent||'').trim();
  if(!raw||![...raw].every(c=>REV[c]!==undefined))return false;
  let prev=el.previousSibling;
  while(prev&&prev.nodeType===3&&!prev.nodeValue.trim())prev=prev.previousSibling;
  if(prev){
    const t=prev.textContent||'';
    if(!/[+→]\s*$/.test(t))return false;
  }
  let next=el.nextSibling;
  while(next&&next.nodeType===3&&!next.nodeValue.trim())next=next.nextSibling;
  if(next&&next.nodeType===3)return /^[A-Z]/.test(next.nodeValue.trim());
  if(next&&next.nodeType===1)return /^[A-Z]/.test((next.textContent||'').trim());
  return true;
}
function fix(root=document){
  for(const el of root.querySelectorAll?.(selectors.join(','))||[]){
    const subs=[...el.querySelectorAll('sub')];
    for(const sub of subs){
      if(isMoleculeStartSub(sub))sub.replaceWith(document.createTextNode(normal(sub.textContent)));
    }
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes){
      if(node.parentElement?.tagName==='SUB')continue;
      const old=node.nodeValue||'';
      let fixed=lowerStates(old);
      fixed=fixed.replace(/(^|[+→]\s*)([₀₁₂₃₄₅₆₇₈₉]+)(?=\s*[A-Z])/g,(m,p,d)=>p+normal(d));
      if(fixed!==old)node.nodeValue=fixed;
    }
  }
}
function schedule(root){requestAnimationFrame(()=>fix(root))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>fix(),{once:true});else fix();
new MutationObserver(muts=>muts.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)schedule(n)}))).observe(document.documentElement,{childList:true,subtree:true});
})();
