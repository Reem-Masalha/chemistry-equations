(()=>{
 const b=document.getElementById('accountTopBtn');
 if(!b)return;
 const SESSION='chemistryCurrentUser';
 const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
 function current(){try{return JSON.parse(localStorage.getItem(SESSION)||'null')}catch{return null}}
 function saveCurrent(u){localStorage.setItem(SESSION,JSON.stringify(u))}
 function refresh(){const a=current();b.textContent=a?'👤 '+a.name:'👤 Create account / Sign in';}
 async function create(){
   const name=prompt('Create account — enter a name:');
   if(!name||!name.trim())return;
   const username=prompt('Choose a username:');
   if(!username||!username.trim())return;
   b.disabled=true;
   try{
     const r=await fetch(API+'/api/create-account',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:name.trim(),username:username.trim()})});
     const data=await r.json().catch(()=>({}));
     if(!r.ok){alert(data.error||'Could not create the account.');return;}
     saveCurrent(data.user);refresh();alert('Account created! You are now signed in as '+data.user.name+'.');
   }catch(e){alert('Could not connect to the account server. Please check your internet connection and try again.');}
   finally{b.disabled=false;}
 }
 async function signIn(){
   const username=prompt('Sign in — enter your username:');
   if(!username||!username.trim())return;
   b.disabled=true;
   try{
     const r=await fetch(API+'/api/sign-in',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username:username.trim()})});
     const data=await r.json().catch(()=>({}));
     if(!r.ok){alert(data.error||'No account was found with that username.');return;}
     saveCurrent(data.user);refresh();alert('Signed in as '+data.user.name+'.');
   }catch(e){alert('Could not connect to the account server. Please check your internet connection and try again.');}
   finally{b.disabled=false;}
 }
 b.onclick=async()=>{
   const a=current();
   if(a){
     const action=prompt('Signed in as '+a.name+'. Type SIGN OUT to sign out, or CANCEL to stay signed in.');
     if(action&&action.trim().toUpperCase()==='SIGN OUT'){localStorage.removeItem(SESSION);refresh();}
     return;
   }
   const action=prompt('Account: type CREATE to make a new account, or SIGN IN to use an existing account.');
   if(!action)return;
   if(action.trim().toUpperCase()==='CREATE')await create();
   else if(action.trim().toUpperCase()==='SIGN IN')await signIn();
   else alert('Please type CREATE or SIGN IN.');
 };
 refresh();
})();
