(()=>{
  const SESSION='chemistryCurrentUser';
  const el=document.getElementById('profileContent');
  if(!el) return;
  try{
    const raw=localStorage.getItem(SESSION)||sessionStorage.getItem(SESSION);
    const user=raw?JSON.parse(raw):null;
    if(user&&user.token){
      const loading=el.querySelector('h1');
      if(loading&&loading.textContent.trim()==='Loading profile…'){
        loading.textContent=user.name||user.username||'Your profile';
        const p=loading.parentElement?.querySelector('p');
        if(p) p.textContent=user.username?'@'+user.username:'';
      }
    }
  }catch{}
})();
