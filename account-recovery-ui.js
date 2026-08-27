(()=>{
  const SESSION='chemistryCurrentUser';
  const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
  const btn=document.getElementById('accountTopBtn');
  if(!btn)return;
  const current=()=>{try{return JSON.parse(localStorage.getItem(SESSION)||sessionStorage.getItem(SESSION)||'null')}catch{return null}};
  const token=()=>current()?.token||null;
  const headers=()=>token()?{'content-type':'application/json','authorization':'Bearer '+token()}:{'content-type':'application/json'};
  const request=async(path,body)=>{let r;try{r=await fetch(API+path,{method:'POST',headers:headers(),body:JSON.stringify(body)})}catch{throw new Error('Could not connect to the account server.')}const text=await r.text();let d={};try{d=JSON.parse(text)}catch{}if(!r.ok)throw new Error(d.error||'Could not complete the request.');return d};
  const style=document.createElement('style');
  style.textContent=`#recoveryCodeModal{position:fixed;inset:0;z-index:100000;display:none}#recoveryCodeModal .rc-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.6)}#recoveryCodeModal .rc-dialog{position:relative;width:min(92vw,500px);max-height:90vh;overflow:auto;margin:6vh auto;padding:28px;border-radius:20px;background:#fff;color:#111;box-shadow:0 20px 60px #0005}#recoveryCodeModal .rc-close{position:absolute;right:12px;top:8px;border:0;background:none;font-size:30px;cursor:pointer}#recoveryCodeModal .rc-code{font:700 20px/1.5 monospace;letter-spacing:1px;word-break:break-all;padding:16px;border:2px dashed #777;border-radius:12px;margin:16px 0;text-align:center;background:#f7f7f7}#recoveryCodeModal .rc-actions{display:flex;gap:8px;flex-wrap:wrap}#recoveryCodeModal button{padding:10px 14px;border-radius:9px;border:1px solid #aaa;background:#fff;cursor:pointer;font:inherit}#recoveryCodeModal .rc-primary{background:#1261a0;color:#fff;border-color:#1261a0}.password-wrap{position:relative;display:flex;align-items:center}.password-wrap input{padding-right:76px!important}.password-toggle{position:absolute;right:6px;top:50%;transform:translateY(-50%);border:0;background:none!important;padding:6px 8px!important;color:#1261a0;cursor:pointer;font:inherit}`;
  document.head.appendChild(style);
  function togglePassword(input){if(!input)return;input.type=input.type==='password'?'text':'password'}
  function addPasswordToggles(root){root.querySelectorAll('input[type="password"]').forEach(input=>{if(input.closest('.password-wrap'))return;const wrap=document.createElement('div');wrap.className='password-wrap';input.parentNode.insertBefore(wrap,input);wrap.appendChild(input);const t=document.createElement('button');t.type='button';t.className='password-toggle';t.textContent='Show';t.setAttribute('aria-label','Show password');t.onclick=()=>{togglePassword(input);const shown=input.type==='text';t.textContent=shown?'Hide':'Show';t.setAttribute('aria-label',shown?'Hide password':'Show password')};wrap.appendChild(t)})}
  function makeModal(title,html){const old=document.getElementById('recoveryCodeModal');if(old)old.remove();const m=document.createElement('div');m.id='recoveryCodeModal';m.innerHTML='<div class="rc-backdrop"></div><div class="rc-dialog"><button class="rc-close" type="button">×</button><h2>'+title+'</h2>'+html+'</div>';document.body.appendChild(m);m.style.display='block';m.querySelector('.rc-close').onclick=()=>m.remove();m.querySelector('.rc-backdrop').onclick=()=>m.remove();return m}
  function showRecoveryCode(code){const m=makeModal('Save your recovery code',`<p>This code is used to reset your password if you forget it. Save it somewhere safe. It will not be shown again unless you generate a new one.</p><div class="rc-code"></div><div class="rc-actions"><button id="copyRecovery">Copy code</button><button id="printRecovery">Print</button><button class="rc-primary" id="doneRecovery">I've saved it</button></div>`);m.querySelector('.rc-code').textContent=code;m.querySelector('#copyRecovery').onclick=async()=>{try{await navigator.clipboard.writeText(code);m.querySelector('#copyRecovery').textContent='Copied!'}catch{m.querySelector('#copyRecovery').textContent='Copy failed'}};m.querySelector('#printRecovery').onclick=()=>{const w=window.open('','_blank','width=700,height=500');if(!w)return;w.document.write('<!doctype html><html><head><title>Chemistry Equations Recovery Code</title><style>body{font-family:Arial;text-align:center;padding:60px}.code{font:700 28px monospace;border:2px dashed #555;padding:20px;margin:30px}</style></head><body><h1>Chemistry Equations</h1><h2>Account Recovery Code</h2><div class="code">'+code+'</div><p>Keep this code private and safe.</p><script>window.print()<\\/script></body></html>');w.document.close()};m.querySelector('#doneRecovery').onclick=()=>m.remove()}
  function installShowPassword(){addPasswordToggles(document);const observer=new MutationObserver(()=>addPasswordToggles(document));observer.observe(document.body,{childList:true,subtree:true})}
  installShowPassword();
  btn.addEventListener('click',()=>setTimeout(()=>addPasswordToggles(document),0),true);
  // account.js uses /api/reset-password-with-code; the deployed Worker uses /api/reset-password.
  const previousFetch=window.fetch;
  window.fetch=async function(...args){
    try{
      const url=typeof args[0]==='string'?args[0]:(args[0]?.url||'');
      if(url.endsWith('/api/reset-password-with-code')){
        if(typeof args[0]==='string') args[0]=API+'/api/reset-password';
        else args[0]=new Request(API+'/api/reset-password',args[0]);
      }
    }catch{}
    const response=await previousFetch.apply(this,args);
    try{
      const url=typeof args[0]==='string'?args[0]:(args[0]?.url||'');
      if(url.includes('/api/create-account')){const clone=response.clone();const data=await clone.json().catch(()=>null);if(data?.recoveryCode)setTimeout(()=>showRecoveryCode(String(data.recoveryCode)),80)}
    }catch{}
    return response;
  };
})();
