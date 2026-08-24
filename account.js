(()=>{
  const SESSION='chemistryCurrentUser';
  const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
  const b=document.getElementById('accountTopBtn');
  if(!b) return;
  function current(){try{return JSON.parse(localStorage.getItem(SESSION)||'null')}catch{return null}}
  function saveCurrent(u){localStorage.setItem(SESSION,JSON.stringify(u))}
  function clearCurrent(){localStorage.removeItem(SESSION); refresh();}
  function refresh(){const a=current(); b.textContent=a?'👤 '+(a.name||a.username):'👤 Create account';}

  const modal=document.createElement('div'); modal.id='accountModal';
  modal.innerHTML=`<div class="account-backdrop" data-close></div><div class="account-dialog" role="dialog" aria-modal="true" aria-labelledby="accountTitle"><button class="account-close" type="button" aria-label="Close" data-close>×</button><h2 id="accountTitle">Your account</h2><p id="accountStatus">Create an account or sign in to save your quiz scores and progress.</p><div id="accountForms"></div><div id="accountMessage" class="account-message" aria-live="polite"></div></div>`;
  document.body.appendChild(modal);
  const style=document.createElement('style'); style.textContent=`#accountModal{position:fixed;inset:0;z-index:9999;display:none}.account-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(3px)}.account-dialog{position:relative;width:min(92vw,480px);max-height:90vh;overflow:auto;margin:8vh auto;padding:28px;border-radius:20px;background:var(--card,#fff);box-shadow:0 20px 60px rgba(0,0,0,.25);color:var(--text,#111)}#accountModal.open{display:block}.account-close{position:absolute;right:14px;top:10px;border:0;background:transparent;font-size:30px;cursor:pointer}.account-form{padding:18px 0;border-top:1px solid rgba(127,127,127,.2)}.account-form label{display:block;font-weight:600;margin:10px 0}.account-form input{display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:11px;border:1px solid #bbb;border-radius:10px;font-size:16px}.account-form button{margin-top:8px}.account-message{min-height:22px;margin-top:10px}`; document.head.appendChild(style);
  const modalEl=modal, msg=document.getElementById('accountMessage'), forms=document.getElementById('accountForms');
  function close(){modalEl.classList.remove('open')}
  function render(){
    const a=current();
    if(a){
      document.getElementById('accountTitle').textContent='Signed in';
      document.getElementById('accountStatus').textContent='Signed in as '+(a.name||a.username)+'.';
      forms.innerHTML='<button id="signOutBtn" class="secondary" type="button">Sign out</button>';
      document.getElementById('signOutBtn').onclick=()=>{clearCurrent(); document.getElementById('accountTitle').textContent='Signed out'; document.getElementById('accountStatus').textContent='You have been signed out.'; forms.innerHTML='<button id="createAfterSignOut" class="primary" type="button">Create account</button> <button id="signInAfterSignOut" class="secondary" type="button">Sign in</button>'; document.getElementById('createAfterSignOut').onclick=()=>renderForms('create'); document.getElementById('signInAfterSignOut').onclick=()=>renderForms('signin'); msg.textContent='';};
    } else renderForms('both');
  }
  function renderForms(mode){
    document.getElementById('accountTitle').textContent=mode==='signin'?'Sign in':'Your account';
    document.getElementById('accountStatus').textContent=mode==='signin'?'Sign in to access your saved scores and progress.':'Create an account or sign in to save your quiz scores and progress.';
    forms.innerHTML=`${mode!=='signin'?`<div class="account-form"><h3>Create account</h3><label>Name<input id="accountName" autocomplete="name" placeholder="Your name"></label><label>Username<input id="accountUsername" autocomplete="username" placeholder="Choose a username"></label><label>Password<input id="accountPassword" type="password" autocomplete="new-password" placeholder="At least 8 characters"></label><label>Confirm password<input id="accountPassword2" type="password" autocomplete="new-password" placeholder="Repeat password"></label><button id="createAccountSubmit" class="primary" type="button">Create account</button></div>`:''}${mode!=='create'?`<div class="account-form"><h3>Sign in</h3><label>Username<input id="signInUsername" autocomplete="username" placeholder="Your username"></label><label>Password<input id="signInPassword" type="password" autocomplete="current-password" placeholder="Your password"></label><button id="signInSubmit" class="secondary" type="button">Sign in</button></div>`:''}`;
    if(document.getElementById('createAccountSubmit')) document.getElementById('createAccountSubmit').onclick=createAccount;
    if(document.getElementById('signInSubmit')) document.getElementById('signInSubmit').onclick=signIn;
    msg.textContent='';
  }
  async function request(path,body){const r=await fetch(API+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const text=await r.text();let data={};try{data=JSON.parse(text)}catch{}if(!r.ok)throw new Error(data.error||('Server returned '+r.status));return data;}
  async function createAccount(){const name=document.getElementById('accountName').value.trim(),username=document.getElementById('accountUsername').value.trim(),password=document.getElementById('accountPassword').value,password2=document.getElementById('accountPassword2').value;if(!name||!username||!password){msg.textContent='Please fill in all fields.';return}if(password.length<8){msg.textContent='Password must be at least 8 characters.';return}if(password!==password2){msg.textContent='Passwords do not match.';return}msg.textContent='Creating account…';try{const data=await request('/api/create-account',{name,username,password});if(!data.user)throw new Error('The server did not return an account.');saveCurrent(data.user);refresh();document.getElementById('accountTitle').textContent='Account created';document.getElementById('accountStatus').textContent='You are signed in as '+(data.user.name||data.user.username)+'.';forms.innerHTML='<button id="signOutBtn" class="secondary" type="button">Sign out</button>';document.getElementById('signOutBtn').onclick=()=>{clearCurrent();render();};msg.textContent='Your account was created successfully.';}catch(e){msg.textContent=e.message||'Could not create the account.';}}
  async function signIn(){const username=document.getElementById('signInUsername').value.trim(),password=document.getElementById('signInPassword').value;if(!username||!password){msg.textContent='Please enter your username and password.';return}msg.textContent='Signing in…';try{const data=await request('/api/sign-in',{username,password});if(!data.user)throw new Error('The server did not return an account.');saveCurrent(data.user);refresh();render();msg.textContent='Signed in successfully.';}catch(e){msg.textContent=e.message||'Could not sign in.';}}
  function open(){render();msg.textContent='';modalEl.classList.add('open');setTimeout(()=>document.querySelector('#accountModal input')?.focus(),50)}
  modalEl.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',close)); document.addEventListener('keydown',e=>{if(e.key==='Escape')close()}); b.addEventListener('click',open); refresh();
})();