(()=>{
  const SESSION='chemistryCurrentUser';
  const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';

  function session(){
    for(const store of [localStorage,sessionStorage]){
      try{
        const raw=store.getItem(SESSION);
        const value=raw?JSON.parse(raw):null;
        if(value&&value.token)return value;
      }catch{}
    }
    return null;
  }

  function start(){
    const root=document.getElementById('profileContent');
    if(!root||root.dataset.privacyTabsInstalled)return;
    root.dataset.privacyTabsInstalled='1';

    const style=document.createElement('style');
    style.textContent=`
      .profile-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:4px 0 20px}
      .profile-tab{border:1px solid #dce3ee;background:#fff;color:#334155;border-radius:999px;padding:10px 16px;font-weight:800;cursor:pointer}
      .profile-tab.active{background:#3158d6;color:#fff;border-color:#3158d6}
      .privacy-view{display:none}
      .privacy-view.active{display:block}
      .privacy-card{background:#fff;border:1px solid #dce3ee;border-radius:18px;padding:22px;margin-bottom:18px}
      .privacy-card h2{margin-top:0}
      .privacy-card p{color:#64748b;line-height:1.6}
      .privacy-list{margin:12px 0 0;padding-left:20px;line-height:1.8}
      .recovery-code-box{font:700 19px monospace;letter-spacing:1px;word-break:break-all;margin:12px 0;padding:12px;background:#f7f7f7;border:2px dashed #777;border-radius:10px}
      .recovery-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
      .recovery-actions button{padding:9px 13px;border:1px solid #aaa;border-radius:8px;background:#fff;cursor:pointer;font-weight:700}
      @media(max-width:700px){.profile-tabs{margin-bottom:16px}.profile-tab{flex:1;text-align:center}}
    `;
    document.head.appendChild(style);

    const tabs=document.createElement('div');
    tabs.className='profile-tabs';
    tabs.innerHTML='<button class="profile-tab active" type="button" data-view="profile">Profile</button><button class="profile-tab" type="button" data-view="privacy">Privacy & security</button>';

    const dashboard=root.querySelector('.profile-dashboard');
    if(!dashboard)return;
    dashboard.parentNode.insertBefore(tabs,dashboard);

    const privacy=document.createElement('div');
    privacy.className='privacy-view';
    privacy.innerHTML=`
      <div class="privacy-card">
        <h2>Password recovery</h2>
        <p>Create a one-time recovery code while you are signed in. Save it somewhere private. If you forget your password, you can use the code with your username to create a new password. No email address, domain, or email service is required.</p>
        <button id="privacyRecoveryBtn" class="primary" type="button">Generate recovery code</button>
        <div id="privacyRecoveryResult" class="muted" style="margin-top:10px"></div>
      </div>
      <div class="privacy-card">
        <h2>Privacy & account security</h2>
        <ul class="privacy-list">
          <li>Your password is stored as a cryptographic hash, not as plain text.</li>
          <li>Your recovery code is stored only as a hash and expires after 24 hours.</li>
          <li>A recovery code can be used once; resetting your password signs out existing sessions.</li>
          <li>Signing out from all devices invalidates your active sessions.</li>
        </ul>
      </div>
      <div class="privacy-card">
        <h2>Account security</h2>
        <p>Use the Account button at the top of the page to change your password, sign out, or delete your account.</p>
      </div>`;
    root.appendChild(privacy);

    const profileTab=tabs.querySelector('[data-view="profile"]');
    const privacyTab=tabs.querySelector('[data-view="privacy"]');
    function show(which){
      const isPrivacy=which==='privacy';
      dashboard.style.display=isPrivacy?'none':'';
      privacy.classList.toggle('active',isPrivacy);
      profileTab.classList.toggle('active',!isPrivacy);
      privacyTab.classList.toggle('active',isPrivacy);
    }
    profileTab.onclick=()=>show('profile');
    privacyTab.onclick=()=>show('privacy');

    const button=privacy.querySelector('#privacyRecoveryBtn');
    const output=privacy.querySelector('#privacyRecoveryResult');
    button.onclick=async()=>{
      const user=session();
      if(!user){output.textContent='Your sign-in session is missing. Please sign in again.';return;}
      button.disabled=true;
      output.textContent='Generating recovery code…';
      try{
        const r=await fetch(API+'/api/create-recovery-code',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+user.token},body:'{}'});
        const d=await r.json().catch(()=>({}));
        if(!r.ok)throw new Error(d.error||'Could not create a recovery code.');
        if(!d.recoveryCode)throw new Error('The server did not return a recovery code.');
        output.innerHTML='<strong>Your recovery code:</strong><div class="recovery-code-box"></div><span>Save it somewhere safe. It expires in 24 hours.</span><div class="recovery-actions"><button type="button" id="copyRecovery">Copy code</button><button type="button" id="printRecovery">Print</button></div>';
        output.querySelector('.recovery-code-box').textContent=d.recoveryCode;
        output.querySelector('#copyRecovery').onclick=async()=>{try{await navigator.clipboard.writeText(d.recoveryCode);output.querySelector('#copyRecovery').textContent='Copied!'}catch{output.querySelector('#copyRecovery').textContent='Copy failed'}};
        output.querySelector('#printRecovery').onclick=()=>{
          const w=window.open('','_blank','width=700,height=500');
          if(!w){output.insertAdjacentHTML('beforeend','<p>Please allow pop-ups to print the recovery code.</p>');return;}
          const code=String(d.recoveryCode).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
          w.document.write('<!doctype html><html><head><title>Chemistry Equations Recovery Code</title><style>body{font-family:Arial,sans-serif;text-align:center;padding:60px}.code{font:700 28px monospace;border:2px dashed #555;padding:20px;margin:30px;word-break:break-all}</style></head><body><h1>Chemistry Equations</h1><h2>Account Recovery Code</h2><div class="code">'+code+'</div><p>Keep this code private and safe.</p><script>window.onload=function(){window.print()}<\\/script></body></html>');
          w.document.close();
        };
      }catch(e){output.textContent=e.message||'Could not create a recovery code.'}
      finally{button.disabled=false}
    };
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
