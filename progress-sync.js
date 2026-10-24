(()=> {
'use strict';
const KEY='chemistryCourseProgress';
const OWNER='chemistryCourseProgressOwner';
const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
const current=()=>{try{return JSON.parse(localStorage.getItem('chemistryCurrentUser')||sessionStorage.getItem('chemistryCurrentUser')||'null')}catch{return null}};
const valid=p=>p&&typeof p==='object'&&!Array.isArray(p);
const identity=u=>u?.token?String(u.id||u.username||'signed-in').toLowerCase():'guest';
const readKey=k=>{try{const p=JSON.parse(localStorage.getItem(k)||'null');return valid(p)?p:null}catch{return null}};
const read=()=>readKey(KEY)||{};
const writeLocal=p=>{try{localStorage.setItem(KEY,JSON.stringify(p))}catch{}};
const readScoped=id=>readKey(KEY+':'+id);
function mergeProgress(local,remote){
 const a=valid(local)?local:{},b=valid(remote)?remote:{},out={...b,...a};
 for(const level of ['beginner','intermediate','advanced']){
  const values=[...(Array.isArray(b[level])?b[level]:[]),...(Array.isArray(a[level])?a[level]:[])];
  out[level]=[...new Set(values.filter(Number.isInteger))].sort((x,y)=>x-y);
 }
 const la=Date.parse(a.updatedAt||0)||0,ra=Date.parse(b.updatedAt||0)||0;
 out.current=(la>=ra?a.current:b.current)||a.current||b.current||null;
 out.updatedAt=new Date(Math.max(la,ra)||Date.now()).toISOString();
 return out;
}
function switchScope(id){
 let owner=null;try{owner=localStorage.getItem(OWNER)}catch{}
 if(owner===id)return read();
 const previous=read();
 try{
  if(owner) localStorage.setItem(KEY+':'+owner,JSON.stringify(previous));
  let next;
  if(!owner){
   // Adopt pre-existing progress once, for compatibility with older site builds.
   next=previous;
  }else{
   next=readScoped(id);
   // Guest work may be adopted by the account being signed into on this device.
   if(!next&&owner==='guest'&&id!=='guest')next=previous;
   if(!next)next={};
  }
  writeLocal(next);
  localStorage.setItem(OWNER,id);
  return next;
 }catch{return previous}
}
const readyIds=new Set(),syncPromises=new Map(),pendingByIdentity=new Map();
let saveQueue=Promise.resolve();
function post(p){
 const u=current(),id=identity(u);
 if(!u?.token)return Promise.resolve();
 const queuedProgress=p;
 saveQueue=saveQueue.catch(()=>{}).then(async()=>{
  const latest=current();
  // Never send one account's queued progress using another account's token.
  if(!latest?.token||identity(latest)!==id)return;
  const r=await fetch(API+'/api/progress',{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+latest.token},body:JSON.stringify({progress:queuedProgress}),keepalive:true});
  if(!r.ok)throw new Error('progress save failed');
  if(pendingByIdentity.get(id)===queuedProgress)pendingByIdentity.delete(id);
 }).catch(()=>{pendingByIdentity.set(id,queuedProgress)});
 return saveQueue;
}
function updateResume(p){
 const title=document.getElementById('resumeLearningTitle'),desc=document.getElementById('resumeLearningText'),btn=document.getElementById('resumeLearningButton');
 if(!title||!desc||!btn)return;
 const cfg={beginner:['Beginner','beginner-lessons.html'],intermediate:['Intermediate','intermediate-lessons.html'],advanced:['Advanced','advanced-lessons.html']};
 const cur=p?.current,validCurrent=cur&&cfg[cur.level]&&Number.isInteger(cur.index)&&cur.index>=0;
 if(validCurrent){const [label,page]=cfg[cur.level],lesson=cur.index+1;title.textContent='Continue where you left off';desc.textContent=label+' · Lesson '+lesson;btn.href=page+'?lesson='+lesson;const span=btn.querySelector('span');if(span)span.textContent='Continue Learning'}
 else {title.textContent='Start your learning path';desc.textContent='Your current lesson will be saved so you can continue where you left off.'}
}
async function sync(){
 const u=current(),id=identity(u);
 const local=switchScope(id);
 updateResume(local);
 if(!u?.token)return;
 const syncKey=id+'|'+u.token;
 if(syncPromises.has(syncKey))return syncPromises.get(syncKey);
 const promise=(async()=>{
  try{
   const r=await fetch(API+'/api/progress',{headers:{authorization:'Bearer '+u.token},signal:AbortSignal.timeout?.(15000)});
   if(r.status===401){
    const latest=current();
    if(latest?.token===u.token){
     try{localStorage.removeItem('chemistryCurrentUser');sessionStorage.removeItem('chemistryCurrentUser');localStorage.removeItem('chemistryRememberMe')}catch{}
     window.dispatchEvent(new CustomEvent('chemistry:account-changed'));
     location.reload();
    }
    return;
   }
   if(!r.ok)return;
   const data=await r.json();
   // A response for an old session must not overwrite the newly signed-in account.
   const latest=current();
   if(!latest?.token||identity(latest)!==id||latest.token!==u.token)return;
   const remote=data.progress,latestLocal=read();
   let merged=valid(remote)?mergeProgress(latestLocal,remote):latestLocal;
   const newestLocal=read();
   if(Date.parse(newestLocal.updatedAt||0)>Date.parse(merged.updatedAt||0))merged=mergeProgress(newestLocal,merged);
   writeLocal(merged);readyIds.add(id);updateResume(merged);
   const path=(location.pathname||'').split('/').pop()||'';
   const pageLevel=path.startsWith('beginner-lessons')?'beginner':path.startsWith('intermediate-lessons')?'intermediate':path.startsWith('advanced-lessons')?'advanced':null;
   if(pageLevel&&merged.current?.level===pageLevel&&!new URLSearchParams(location.search).has('lesson')){
    const url=new URL(location.href);url.searchParams.set('lesson',String(Math.max(1,Number(merged.current.index)||0)+1));history.replaceState(null,'',url);
   }
   window.dispatchEvent(new CustomEvent('chemistry:progress-restored',{detail:merged}));
   await post(merged);
   const pending=pendingByIdentity.get(id);
   if(pending&&identity(current())===id)await post(pending);
  }catch(e){/* Keep local progress available when offline. */}
  finally{if(syncPromises.get(syncKey)===promise)syncPromises.delete(syncKey)}
 })();
 syncPromises.set(syncKey,promise);
 return promise;
}
function save(progress){
 if(!valid(progress))return;
 const u=current(),id=identity(u);
 switchScope(id);
 const saved={...progress,updatedAt:new Date().toISOString()};
 writeLocal(saved);
 updateResume(saved);
 if(u?.token&&readyIds.has(id))post(saved);
}
window.ChemistryProgressSync={save,sync};
window.addEventListener('chemistry:account-changed',()=>{readyIds.clear();sync()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{updateResume(read());sync()},{once:true});
else {updateResume(read());sync()}
window.addEventListener('storage',e=>{if(e.key==='chemistryCurrentUser'||e.key===KEY)sync()});
})();