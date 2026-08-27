(()=>{
  const SESSION='chemistryCurrentUser';
  function hasSession(){try{const raw=localStorage.getItem(SESSION)||sessionStorage.getItem(SESSION);const u=raw?JSON.parse(raw):null;return !!(u&&u.token)}catch{return false}}
  function guard(){if(location.pathname.endsWith('/profile.html')&&!hasSession()) location.replace('learn.html')}
  guard();
  window.addEventListener('pageshow',guard);
  window.addEventListener('storage',e=>{if(e.key===SESSION)guard()});
})();
