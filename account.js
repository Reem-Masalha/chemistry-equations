(()=>{
  const SESSION='chemistryCurrentUser';
  const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
  const b=document.getElementById('accountTopBtn');
  if(!b) return;

  function current(){try{return JSON.parse(localStorage.getItem(SESSION)||'null')}catch{return null}}
  function saveCurrent(u){localStorage.setItem(SESSION,JSON.stringify(u))}
  function refresh(){const a=current(); b.textContent=a?'👤 '+(a.name||a.username):'👤 Create account';}

  const modal=document.createElement('div');
  modal.id='accountModal';
  modal.innerHTML=`
    <div class="account-backdrop" data-close></div>
    <div class="account-dialog" role="dialog" aria-modal="true" aria-labelledby="accountTitle">
      <button class="account-close" type="button" aria-label="Close" data-close>×</button>
      <h2 id="accountTitle">Your account</h2>
      <p id="accountStatus">Create an account to save your quiz scores and progress.</p>
      <div id="accountForms">
        <div class="account-form" id="createForm">
          <h3>Create account</h3>
          <label>Name<input id="accountName" autocomplete="name" placeholder="Your name"></label>
          <label>Username<input id="accountUsername" autocomplete="username" placeholder="Choose a username"></label>
          <button id="createAccountSubmit" class="primary" type="button">Create account</button>
        </div>
        <div class="account-form" id="signInForm">
          <h3>Sign in</h3>
          <label>Username<input id="signInUsername" autocomplete="username" placeholder="Your username"></label>
          <button id="signInSubmit" class="secondary" type="button">Sign in</button>
        </div>
      </div>
      <div id="accountMessage" class="account-message" aria-live="polite"></div>
    </div>`;
  document.body.appendChild(modal);

  const style=document.createElement('style');
  style.textContent=`
    #accountModal{position:fixed;inset:0;z-index:9999;display:none}
    #accountModal.open{display:block}
    .account-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(3px)}
    .account-dialog{position:relative;width:min(92vw,480px);max-height:90vh;overflow:auto;margin:8vh auto;padding:28px;border-radius:20px;background:var(--card,#fff);box-shadow:0 20px 60px rgba(0,0,0,.25);color:var(--text,#111)}
    .account-close{position:absolute;right:14px;top:10px;border:0;background:transparent;font-size:30px;cursor:pointer}
    .account-dialog h2{margin:0 35px 8px 0}.account-dialog h3{margin:0 0 12px}
    .account-form{padding:18px 0;border-top:1px solid rgba(127,127,127,.2)}
    .account-form label{display:block;font-weight:600;margin:10px 0}.account-form input{display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:11px;border:1px solid #bbb;border-radius:10px;font-size:16px}
    .account-form button{margin-top:8px}.account-message{min-height:22px;margin-top:10px}
  `;
  document.head.appendChild(style);

  const modalEl=document.getElementById('accountModal');
  const msg=document.getElementById('accountMessage');
  function open(){
    const a=current();
    if(a){
      document.getElementById('accountTitle').textContent='Signed in';
      document.getElementById('accountStatus').textContent='You are signed in as '+(a.name||a.username)+'.';
      document.getElementById('accountForms').innerHTML='<button id="signOutBtn" class="secondary" type="button">Sign out</button>';
      document.getElementById('signOutBtn').onclick=()=>{localStorage.removeItem(SESSION);refresh();close();};
    }else{
      document.getElementById('accountTitle').textContent='Your account';
      document.getElementById('accountStatus').textContent='Create an account or sign in to save your quiz scores and progress.';
    }
    msg.textContent=''; modalEl.classList.add('open');
    setTimeout(()=>document.querySelector('#accountModal input')?.focus(),50);
  }
  function close(){modalEl.classList.remove('open')}
  modalEl.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  b.addEventListener('click',open);

  async function request(path,body){
    const r=await fetch(API+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
    const text=await r.text(); let data={}; try{data=JSON.parse(text)}catch{}
    if(!r.ok) throw new Error(data.error||('Server returned '+r.status));
    return data;
  }

  document.getElementById('createAccountSubmit').onclick=async()=>{
    const name=document.getElementById('accountName').value.trim();
    const username=document.getElementById('accountUsername').value.trim();
    if(!name||!username){msg.textContent='Please enter both your name and a username.';return;}
    msg.textContent='Creating account…';
    try{const data=await request('/api/create-account',{name,username}); if(!data.user)throw new Error('The server did not return an account.'); saveCurrent(data.user);refresh(); msg.textContent='Account created successfully!'; setTimeout(close,500);}
    catch(e){msg.textContent=e.message||'Could not create the account.';}
  };
  document.getElementById('signInSubmit').onclick=async()=>{
    const username=document.getElementById('signInUsername').value.trim();
    if(!username){msg.textContent='Please enter your username.';return;}
    msg.textContent='Signing in…';
    try{const data=await request('/api/sign-in',{username}); if(!data.user)throw new Error('The server did not return an account.'); saveCurrent(data.user);refresh(); msg.textContent='Signed in successfully!'; setTimeout(close,500);}
    catch(e){msg.textContent=e.message||'Could not sign in.';}
  };
  refresh();
})();