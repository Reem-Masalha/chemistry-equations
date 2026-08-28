(()=>{'use strict';
const NAV=[['Learn','learn.html'],['Quiz','personal-quiz.html'],['Challenges','challenges.html'],['Balancer','index.html'],['Checker','checker.html']];
function init(){
 const header=document.querySelector('.topbar'); if(!header)return;
 let nav=header.querySelector('.main-nav');
 if(!nav){nav=document.createElement('nav');nav.className='main-nav';header.appendChild(nav)}
 nav.replaceChildren(...NAV.map(([label,href])=>{const a=document.createElement('a');a.href=href;a.textContent=label;return a}));
 const current=(location.pathname.split('/').pop()||'learn.html').toLowerCase();
 nav.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===current));
 header.querySelectorAll('.main-nav').forEach((n,i)=>{if(i)n.remove()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
