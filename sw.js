const CACHE='ahad-production-v7-privacy-core';
const ASSETS=[
  './','./index.html','./styles.css','./luxury.css','./cinematic.css','./mobile-production.css',
  './landing.js','./cinematic.js','./manifest.webmanifest','./privacy.html','./terms.html',
  './assets/icons/ahad-icon.svg','./assets/icons/icon-192.png','./assets/icons/icon-512.png',
  './assets/ahad/hero-720.webp','./assets/ahad/hero-1080.webp','./assets/ahad/majlis-720.webp','./assets/ahad/stroll-720.webp'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.origin!==self.location.origin) return;
  const isStatic=['document','style','script','image','font','manifest'].includes(e.request.destination);
  if(!isStatic) return;
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{
    if(r.ok){const clone=r.clone();caches.open(CACHE).then(c=>c.put(e.request,clone))}
    return r;
  }).catch(()=>caches.match(e.request).then(r=>r||(e.request.mode==='navigate'?caches.match('./index.html'):undefined))));
});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>cs[0]?cs[0].focus():clients.openWindow('./')))})
