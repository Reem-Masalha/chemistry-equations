(()=>{
'use strict';
const KEY='chemistryTheme';
function read(){try{return localStorage.getItem(KEY)==='dark'?'dark':'light'}catch{return'light'}}
function apply(mode){const dark=mode==='dark';document.body.classList.toggle('dark',dark);const b=document.getElementById('themeToggle');if(b)b.textContent=dark?'☀️ Light':'🌙 Dark'}
function init(){const top=document.querySelector('.topbar');if(!top)return;let b=document.getElementById('themeToggle');if(!b){b=document.createElement('button');b.id='themeToggle';b.className='secondary';b.type='button';top.appendChild(b)}b.onclick=null;if(!b.dataset.themeBound){b.dataset.themeBound='1';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const mode=document.body.classList.contains('dark')?'light':'dark';try{localStorage.setItem(KEY,mode)}catch{}apply(mode)},true)}apply(read())}
if(document.querySelector('.topbar'))init();else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
