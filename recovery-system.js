(()=>{
  const SESSION='chemistryCurrentUser';
  const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
  const getUser=()=>{try{return JSON.parse(localStorage.getItem(SESSION)||sessionStorage.getItem(SESSION)||'null')}catch{return null}};
  const token=()=>getUser()?.token||null;
  const headers=()=>({'content-type':'application/json',...(token()?{authorization:'Bearer '+token()}: {})});
  const request=async(path,body)=>{
    let r;
    try{r=await fetch(API+path,{method:'POST',headers:headers(),body:JSON.stringify(body||{})})}
    catch{throw new Error('Could not connect to the account server.')}
    const text=await r.text();let d={};try{d=JSON.parse(text)}catch{}
    if(!r.ok)throw new Error(d.error||'Could not complete the request.');
    return d;
  };

  const style=document.createElement('style');
  style.textContent=`
    .recovery-system{margin-top:14px;padding-top:14px;border-top:1px solid #ddd}
    .recovery-system button{border:0;background:none;color:#1261a0;text-decoration:underline;cursor:pointer;font:inherit;padding:6px 0}
    .recovery-box{margin-top:10px;padding:14px;border:1px solid #ddd;border-radius:12px;background:#fafafa}
    .recovery-box label{display:block;font-weight:600;margin:9px 0}
    .recovery-box input{display:block;width:100%;box-sizing:border-box;margin-top:5px;padding:10px;border:1px solid #aaa;border-radius:8px;font-size:16px}
    .recovery-box .recovery-submit{margin-top:8px;background:#1261a0;color:#fff;border:0;border-radius:8px;padding:10px 14px;text-decoration:none}
    .recovery-box .recovery-back{margin-left:10px}
    .recovery-display{margin-top:12px;padding:14px;border:2px dashed #777;border-radius:10px;text-align:center;background:#fff}
    .recovery-display code{font:700 19px monospace;letter-spacing:1px;word-break:break-all}
    .recovery-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
    .recovery-actions button{border:1px solid #aaa;background:#fff;text-decoration:none;padding:8px 12px;border-radius:8px}
  `;
  document.head.appendChild(style);

  const modal=()=>document.getElementById('accountModal');
  const forms=()=>document.getElementById('accountForms');
  const msg=()=>document.getElementById('accountMessage');

  function recoveryDisplay(container,code,expiresAt){
    const box=document.createElement('div');box.className='recovery-display';
    box.innerHTML='<b>Your recovery code</b><div><code></code></div><p>Save this code somewhere safe. It can reset your password without email.</p>'+(expiresAt?'<small>Expires: '+new Date(expiresAt).toLocaleString()+'</small>':'')+'<div class="recovery-actions"><button type="button" data-copy>Copy code</button><button type="button" data-print>Print</button></div>';
    box.querySelector('code').textContent=code;
    box.querySelector('[data-copy]').onclick=async()=>{try{await navigator.clipboard.writeText(code);box.querySelector('[data-copy]').textContent='Copied!'}catch{box.querySelector('[data-copy]').textContent='Copy failed'}};
    box.querySelector('[data-print]').onclick=()=>{const w=window.open('','_blank','width=700,height=500');if(!w){msg().textContent='Please allow pop-ups to print the recovery code.';return}w.document.write('<!doctype html><html><head><title>Chemistry Equations Recovery Code</title><style>body{font-family:Arial;text-align:center;padding:60px}.code{font:700 28px monospace;border:2px dashed #555;padding:20px;margin:30px;word-break:break-all}</style></head><body><h1>Chemistry Equations</h1><h2>Account Recovery Code</h2><div class="code">'+String(code).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</div><p>Keep this code private and safe.</p><script>window.onload=()=>window.print()<\\/script></body></html>');w.document.close()};
    container.appendChild(box);
  }

  async function generateCode(target){
    try{
      const d=await request('/api/create-recovery-code',{});
      if(!d.recoveryCode)throw new Error('The server did not return a recovery code.');
      target.querySelectorAll('.recovery-display').forEach(x=>x.remove());
      recoveryDisplay(target,d.recoveryCode,d.expiresAt);
    }catch(e){msg().textContent=e.message||'Could not create a recovery code.'}
  }

  function showRecoveryForm(){
    const f=forms();if(!f)return;
    f.innerHTML='<div class="account-form"><h3>Reset password with recovery code</h3><p>Enter your username and the recovery code you saved when you created your account.</p><div class="recovery-box"><label>Username<input id="recoveryUsername" autocomplete="username"></label><label>Recovery code<input id="recoveryCodeInput" autocomplete="off" spellcheck="false"></label><label>New password<input id="recoveryNewPassword" type="password" autocomplete="new-password"></label><label>Confirm new password<input id="recoveryNewPassword2" type="password" autocomplete="new-password"></label><button id="recoverySubmit" type="button" class="recovery-submit">Reset password</button><button id="recoveryBack" type="button" class="recovery-back">Back to sign in</button></div></div>';
    document.getElementById('accountTitle').textContent='Password recovery';
    document.getElementById('accountStatus').textContent='No email or domain is required. Use your saved recovery code.';
    document.getElementById('recoveryBack').onclick=()=>{window.dispatchEvent(new CustomEvent('chemistry-account-render-signin'))};
    document.getElementById('recoverySubmit').onclick=async()=>{
      const u=document.getElementById('recoveryUsername').value.trim();
      const c=document.getElementById('recoveryCodeInput').value.trim();
      const p=document.getElementById('recoveryNewPassword').value;
      const p2=document.getElementById('recoveryNewPassword2').value;
      if(!u||!c||!p||!p2){msg().textContent='Username, recovery code and both password fields are required.';return}
      if(p.length<8){msg().textContent='Password must be at least 8 characters.';return}
      if(p!==p2){msg().textContent='Passwords do not match.';return}
      msg().textContent='Resetting password…';
      try{
        const d=await request('/api/reset-password',{username:u,recoveryCode:c,newPassword:p,confirmPassword:p2});
        if(!d.user||!d.token)throw new Error('Secure session was not returned by the server.');
        const data={...d.user,token:d.token};localStorage.setItem(SESSION,JSON.stringify(data));sessionStorage.removeItem(SESSION);
        msg().textContent='Password reset successfully.';msg().className='account-message success';
        setTimeout(()=>{location.href='profile.html'},700);
      }catch(e){msg().textContent=e.message||'Could not reset the password.'}
    };
  }

  function addSigninRecoveryLink(){
    const f=forms();if(!f||document.getElementById('forgotRecoveryBtn'))return;
    const wrap=document.createElement('div');wrap.className='recovery-system';
    wrap.innerHTML='<button id="forgotRecoveryBtn" type="button">Forgot your password? Use a recovery code</button>';
    f.appendChild(wrap);
    document.getElementById('forgotRecoveryBtn').onclick=showRecoveryForm;
  }

  function addAccountRecoveryControls(){
    const f=forms();if(!f||document.getElementById('generateRecoveryBtn'))return;
    const wrap=document.createElement('div');wrap.className='recovery-system';
    wrap.innerHTML='<b>Password recovery</b><p class="muted">Generate a new one-time recovery code. No email or domain is needed.</p><button id="generateRecoveryBtn" type="button">Generate recovery code</button>';
    f.appendChild(wrap);
    document.getElementById('generateRecoveryBtn').onclick=()=>generateCode(wrap);
  }

  function inspect(){
    const f=forms(),m=modal();if(!f||!m||m.style.display==='none')return;
    const title=document.getElementById('accountTitle')?.textContent||'';
    if(/sign in/i.test(title)&&!/recovery/i.test(title))addSigninRecoveryLink();
    if(/account & security/i.test(title))addAccountRecoveryControls();
  }

  const observer=new MutationObserver(()=>setTimeout(inspect,0));
  const start=()=>{if(document.body)observer.observe(document.body,{childList:true,subtree:true});inspect()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();

  window.addEventListener('chemistry-account-render-signin',()=>{
    const b=document.getElementById('accountTopBtn');
    if(b){b.click();setTimeout(()=>{const title=document.getElementById('accountTitle');if(title)title.textContent='Sign in';inspect()},20)}
  });

  // When a new account/password is created, generate the recovery code using the returned session.
  const originalFetch=window.fetch;
  window.fetch=async function(...args){
    const response=await originalFetch.apply(this,args);
    try{
      const url=typeof args[0]==='string'?args[0]:args[0]?.url||'';
      if(/\/api\/(create-account|set-password|reset-password)$/.test(url)){
        const clone=response.clone();const data=await clone.json().catch(()=>null);
        if(data?.token){
          const dataUser=data.user||getUser();
          if(dataUser?.id){
            const sessionData={...dataUser,token:data.token};localStorage.setItem(SESSION,JSON.stringify(sessionData));
            setTimeout(async()=>{
              try{
                const code=await fetch(API+'/api/create-recovery-code',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+data.token},body:'{}'});
                const cd=await code.json().catch(()=>null);
                if(cd?.recoveryCode&&document.getElementById('accountModal')?.style.display!=='none'){
                  const f=forms();if(f){f.innerHTML='<div class="account-form"><h3>Save your recovery code</h3><p>This is your password-recovery method. Save it somewhere safe. It will not be emailed.</p></div>';recoveryDisplay(f,String(cd.recoveryCode),cd.expiresAt);}
                }
              }catch{}
            },120);
          }
        }
      }
    }catch{}
    return response;
  };
})();
