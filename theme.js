(()=>{
'use strict';
const KEY='chemistryTheme';
function read(){try{return localStorage.getItem(KEY)==='dark'?'dark':'light'}catch{return'light'}}
function apply(mode){const dark=mode==='dark';document.body.classList.toggle('dark',dark);const b=document.getElementById('themeToggle');if(b)b.textContent=dark?'☀️ Light':'🌙 Dark'}
function init(){let b=document.getElementById('themeToggle');const top=document.querySelector('.topbar');if(!b&&top){b=document.createElement('button');b.id='themeToggle';b.className='secondary';b.type='button';top.appendChild(b)}apply(read());if(b&&!b.dataset.themeBound){b.dataset.themeBound='1';b.addEventListener('click',()=>{const mode=document.body.classList.contains('dark')?'light':'dark';try{localStorage.setItem(KEY,mode)}catch{}apply(mode)})}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
