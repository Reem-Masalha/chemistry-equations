(()=>{
  const SESSION='chemistryCurrentUser';
  const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';

  function getSession(){
    for(const store of [localStorage,sessionStorage]){
      try{
        const raw=store.getItem(SESSION);
        if(!raw) continue;
        const value=JSON.parse(raw);
        if(value && typeof value.token==='string' && value.token.trim()) return value;
      }catch{}
    }
    return null;
  }

  function escapeHtml(value){
    return String(value).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  }

  async function generate(){
    const button=document.getElementById('profileRecoveryBtn');
    const output=document.getElementById('profileRecoveryResult');
    if(!button||!output) return;

    const user=getSession();
    if(!user){
      output.textContent='Your sign-in session is missing. Please sign in again.';
      return;
    }

    button.disabled=true;
    output.textContent='Generating recovery code…';

    try{
      const response=await fetch(API+'/api/create-recovery-code',{
        method:'POST',
        headers:{
          'content-type':'application/json',
          'authorization':'Bearer '+user.token
        },
        body:'{}'
      });

      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(data.error||'Could not create a recovery code.');
      if(!data.recoveryCode) throw new Error('The server did not return a recovery code.');

      output.innerHTML='<strong>Your recovery code:</strong><div class="profile-recovery-code">'+escapeHtml(data.recoveryCode)+'</div><span>Save it somewhere safe. It expires in 24 hours.</span><div class="profile-recovery-actions"><button type="button" id="copyProfileRecovery">Copy code</button><button type="button" id="printProfileRecovery">Print</button></div>';

      document.getElementById('copyProfileRecovery').onclick=async()=>{
        try{
          await navigator.clipboard.writeText(String(data.recoveryCode));
          document.getElementById('copyProfileRecovery').textContent='Copied!';
        }catch{
          document.getElementById('copyProfileRecovery').textContent='Copy failed';
        }
      };

      document.getElementById('printProfileRecovery').onclick=()=>{
        const w=window.open('','_blank','width=700,height=500');
        if(!w){output.insertAdjacentHTML('beforeend','<p>Please allow pop-ups to print the recovery code.</p>');return;}
        const code=escapeHtml(data.recoveryCode);
        w.document.write('<!doctype html><html><head><title>Chemistry Equations Recovery Code</title><style>body{font-family:Arial,sans-serif;text-align:center;padding:60px}.code{font:700 28px monospace;border:2px dashed #555;padding:20px;margin:30px;word-break:break-all}</style></head><body><h1>Chemistry Equations</h1><h2>Account Recovery Code</h2><div class="code">'+code+'</div><p>Keep this code private and safe.</p><script>window.onload=function(){window.print()}<\\/script></body></html>');
        w.document.close();
      };
    }catch(error){
      output.textContent=error?.message||'Could not create a recovery code.';
    }finally{
      button.disabled=false;
    }
  }

  function start(){
    const button=document.getElementById('profileRecoveryBtn');
    if(!button||button.dataset.recoveryFixInstalled) return;
    button.dataset.recoveryFixInstalled='1';
    button.onclick=generate;

    const style=document.createElement('style');
    style.textContent='.profile-recovery-code{font:700 19px monospace;letter-spacing:1px;word-break:break-all;margin:8px 0;padding:10px;background:#f7f7f7;border:2px dashed #777;border-radius:10px}.profile-recovery-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.profile-recovery-actions button{padding:8px 12px;border:1px solid #aaa;border-radius:8px;background:#fff;cursor:pointer}';
    document.head.appendChild(style);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
