(()=>{
 const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
 let id=localStorage.getItem('chemistryVisitorId');
 if(!id){id=crypto.randomUUID();localStorage.setItem('chemistryVisitorId',id)}
 fetch(API+'/api/track-visit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({visitorId:id,path:location.pathname})}).catch(()=>{});
})();
