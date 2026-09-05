(()=>{
'use strict';
const KEY='chemistryTheme';
const DESIGN='modern-refresh.css?v=20260905-unified-site';
const installDesign=()=>{if(document.querySelector('link[data-unified-design]'))return;const l=document.createElement('link');l.rel='stylesheet';l.href=DESIGN;l.dataset.unifiedDesign='1';(document.head||document.documentElement).appendChild(l)};
const read=()=>{try{return localStorage.getItem(KEY)==='dark'?'dark':'light'}catch{return'light'}};
const apply=mode=>{const dark=mode==='dark';document.documentElement.classList.toggle('dark',dark);if(document.body)document.body.classList.toggle('dark',dark);const b=document.getElementById('themeToggle');if(b)b.textContent=dark?'☀️ Light':'🌙 Dark'};
const nav=()=>{const n=document.querySelector('.main-nav');if(!n)return;const routes=[['Learn','index.html'],['Quiz','personal-quiz.html'],['Challenges','challenges.html'],['Balancer','balancer.html'],['Checker','checker.html'],['Contact','contact.html']];const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();const active=page==='learn.html'||page==='index.html'||page.includes('lesson')?'index.html':routes.some(([,h])=>h===page)?page:'index.html';const links=[...n.querySelectorAll('a')];routes.forEach(([label,href],i)=>{const a=links[i];if(!a)return;a.href=href;a.classList.toggle('active',href===active)});n.style.direction='ltr'};
const init=()=>{installDesign();nav();apply(read());const b=document.getElementById('themeToggle');if(b&&!b.dataset.themeReady){b.dataset.themeReady='1';b.onclick=()=>{const next=read()==='dark'?'light':'dark';try{localStorage.setItem(KEY,next)}catch{}apply(next)}}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
