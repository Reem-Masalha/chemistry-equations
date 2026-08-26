const CACHE = 'chemistry-equations-v4';
const SCOPE = '/chemistry-equations/';
const SHELL = ['learn.html','style.css','manifest.webmanifest','account.js','visitor-tracker.js','site-enhancements.js'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL.map(x => SCOPE + x))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => { const keys=await caches.keys(); await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))); await self.clients.claim(); })());
});
self.addEventListener('fetch', event => {
  const req=event.request; if(req.method!=='GET') return;
  const url=new URL(req.url); if(url.origin!==self.location.origin) return;
  event.respondWith((async()=>{
    try { const fresh=await fetch(req,{cache:'no-store'}); if(fresh.ok)caches.open(CACHE).then(c=>c.put(req,fresh.clone())); return fresh; }
    catch(_) { return (await caches.match(req)) || (await caches.match(SCOPE+'learn.html')) || Response.error(); }
  })());
});
