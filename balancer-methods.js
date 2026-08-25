(()=>{
  const result=document.getElementById('balanceResult');
  if(!result)return;
  const style=document.createElement('style');style.textContent='.validation-error{padding:14px 16px;border:1px solid #e6a0a0;background:#fff5f5;border-radius:12px;color:#7b1616}.validation-error mark{background:#ffd0d0;color:#a00000;font-weight:800;padding:2px 4px;border-radius:4px}.balance-methods{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.balance-methods button{padding:8px 10px;border:1px solid #bbb;border-radius:8px;background:#fff;cursor:pointer}.method-note{padding:12px;border-left:4px solid #8aa8d8;background:#f5f8ff;margin-top:10px;border-radius:8px}';document.head.appendChild(style);
  const observer=new MutationObserver(()=>{
    if(!result.querySelector('.equation'))return;
    if(result.querySelector('.balance-methods'))return;
    const actions=result.querySelector('.balance-actions')||result.firstElementChild;
    const wrap=document.createElement('div');wrap.className='balance-methods';
    wrap.innerHTML='<button id="inspectionMethod" type="button">Inspection method</button><button id="atomCheckMethod" type="button">Atom-count check</button>';
    actions?.after(wrap);
    const note=document.createElement('div');note.id='methodNote';note.className='method-note';note.hidden=true;wrap.after(note);
    document.getElementById('inspectionMethod').onclick=()=>{note.hidden=false;note.innerHTML='<b>Inspection method</b><p>Balance the most constrained element first, then adjust the remaining elements. A common practical order is: unique metals/atoms → polyatomic groups that stay together → hydrogen → oxygen. The final coefficients are checked against every element.</p>';};
    document.getElementById('atomCheckMethod').onclick=()=>{note.hidden=false;const steps=[...result.querySelectorAll('.steps-result')].find(x=>!x.id||x.id==='balanceSteps');note.innerHTML='<b>Atom-count verification</b><p>For every element, the site independently totals atoms on the left and right using the proposed coefficients. Any mismatch is flagged before the result is accepted.</p>';};
  });
  observer.observe(result,{childList:true,subtree:true});
})();