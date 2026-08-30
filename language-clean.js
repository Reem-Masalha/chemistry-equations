(()=>{
'use strict';
const load=(src,done)=>{const s=document.createElement('script');s.src=src;s.async=false;s.defer=false;s.onload=()=>done?.();s.onerror=()=>{};(document.head||document.body).appendChild(s)};
function ensureShell(){
 const top=document.querySelector('.topbar');
 if(!top)return;
 if(!document.getElementById('siteLanguageSelect')){
  const box=document.createElement('div');
  box.className='site-language-control';
  box.innerHTML='<span class="site-language-icon" aria-hidden="true">🌐</span><select id="siteLanguageSelect" aria-label="Language"><option value="en">English</option><option value="ar">العربية</option><option value="he">עברית</option></select>';
  top.appendChild(box);
  const select=box.querySelector('select');
  let current='en';try{current=localStorage.getItem('chemistryLanguage')||'en'}catch{}
  select.value=/^(ar|he)$/.test(current)?current:'en';
  select.addEventListener('change',()=>{
   try{localStorage.setItem('chemistryLanguage',select.value)}catch{}
   window.ChemistryI18n?.setLanguage?.(select.value);
   window.dispatchEvent(new Event('chemistryLanguageChanged'));
  });
 }
 const account=document.getElementById('accountTopBtn');
 if(account&&!account.dataset.shellFallback){
  account.dataset.shellFallback='1';
  account.addEventListener('click',()=>setTimeout(()=>{
   const modal=document.getElementById('accountModal');
   if(modal&&getComputedStyle(modal).display==='none'){
    let signed=false;try{signed=!!JSON.parse(localStorage.getItem('chemistryCurrentUser')||'null')?.token}catch{}
    if(signed)location.href='profile.html';else modal.style.display='block';
   }
  },120),false);
 }
}
const boot=()=>{
 if(window.ChemistryI18n){ensureShell();window.ChemistryI18n.refresh?.();return}
 load('i18n-core.js?v=20260830-3',()=>load('i18n-enhancements.js?v=20260830-2',ensureShell));
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();