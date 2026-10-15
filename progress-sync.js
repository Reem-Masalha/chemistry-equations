(()=> {
'use strict';
const KEY='chemistryCourseProgress';
const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
const current=()=>{try{return JSON.parse(localStorage.getItem('chemistryCurrentUser')||sessionStorage.getItem('chemistryCurrentUser')||'null')}catch{return null}};
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return {}}};
const writeLocal=p=>{try{localStorage.setItem(KEY,JSON.stringify(p))}catch{}};
const valid=p=>p&&typeof p==='object'&&!Array.isArray(p);
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
let ready=false, syncPromise=null, pending=null;
async function post(p){
 const u=current();if(!u?.token)return;
 try{
  const r=await fetch(API+'/api/progress',{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+u.token},body:JSON.stringify({progress:p}),keepalive:true});
  if(!r.ok)throw new Error('progress save failed');
 }catch(e){pending=p;}
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
 const u=current();if(!u?.token)return;
 if(syncPromise)return syncPromise;
 syncPromise=(async()=>{
  try{
   const r=await fetch(API+'/api/progress',{headers:{authorization:'Bearer '+u.token}});
   if(!r.ok)return;
   const data=await r.json(),local=read(),remote=data.progress;
   let merged;
   if(valid(remote))merged=mergeProgress(local,remote);
   else {merged=local;merged.updatedAt=merged.updatedAt||new Date().toISOString()}
   const latestLocal=read();
   if(Date.parse(latestLocal.updatedAt||0)>Date.parse(merged.updatedAt||0))merged=mergeProgress(latestLocal,merged);
   writeLocal(merged);ready=true;updateResume(merged);
   const path=(location.pathname||'').split('/').pop()||'';
   const pageLevel=path.startsWith('beginner-lessons')?'beginner':path.startsWith('intermediate-lessons')?'intermediate':path.startsWith('advanced-lessons')?'advanced':null;
   if(pageLevel&&merged.current?.level===pageLevel&&!new URLSearchParams(location.search).has('lesson')){
    const url=new URL(location.href);url.searchParams.set('lesson',String(Math.max(1,Number(merged.current.index)||0)+1));history.replaceState(null,'',url);
   }
   window.dispatchEvent(new CustomEvent('chemistry:progress-restored',{detail:merged}));
   await post(merged);
   if(pending){const p=pending;pending=null;await post(p)}
  }catch(e){/* Keep local progress available when offline. */}
  finally{syncPromise=null}
 })();
 return syncPromise;
}
function save(progress){
 if(!valid(progress))return;
 progress.updatedAt=new Date().toISOString();
 writeLocal(progress);
 if(ready)post(progress);
 updateResume(progress);
}
window.ChemistryProgressSync={save,sync};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{updateResume(read());sync()},{once:true});
else {updateResume(read());sync()}
window.addEventListener('storage',e=>{if(e.key==='chemistryCurrentUser'||e.key===KEY)sync()});
})();