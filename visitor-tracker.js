(()=>{
'use strict';
// Lightweight visitor counting only. Analytics must never interfere with the site UI.
const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
const KEY='chemistryVisitorId';
const path=(location.pathname||'/').slice(0,200);
function storageGet(k){try{return localStorage.getItem(k)}catch{return null}}
function storageSet(k,v){try{localStorage.setItem(k,v)}catch{}}
function cookieGet(){try{const x=document.cookie.split('; ').find(v=>v.indexOf(KEY+'=')===0);return x?decodeURIComponent(x.slice(KEY.length+1)):null}catch{return null}}
function cookieSet(v){try{document.cookie=KEY+'='+encodeURIComponent(v)+'; Max-Age=31536000; Path=/; SameSite=Lax'}catch{}}
let id=cookieGet()||storageGet(KEY);
if(!id){id=(Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12));storageSet(KEY,id)}
cookieSet(id);
let sent=false;
try{sent=sessionStorage.getItem('chemistryTracked:'+path)==='1';if(!sent)sessionStorage.setItem('chemistryTracked:'+path,'1')}catch{}
if(!sent){
  const user=(()=>{try{return JSON.parse(localStorage.getItem('chemistryCurrentUser')||sessionStorage.getItem('chemistryCurrentUser')||'null')}catch{return null}})();
  const body=JSON.stringify({visitorId:user&&user.id?'account:'+String(user.id):'anonymous:'+id,userId:user&&user.id?user.id:null,path});
  // Fire-and-forget: no response processing, no click handlers, no observers, no timers.
  try{fetch(API+'/api/track-visit',{method:'POST',headers:{'content-type':'application/json'},body,keepalive:true}).catch(()=>{})}catch{}
}
})();
