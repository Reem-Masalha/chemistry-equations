(()=>{
'use strict';
function ensureShell(){
 const top=document.querySelector('.topbar');
 if(!top)return;
 const existing=document.getElementById('site-language-select')||document.getElementById('siteLanguageSelect');
 if(!existing){
  const box=document.createElement('label');box.id='site-language-control';box.className='site-language-control';
  box.innerHTML='<span class="site-language-icon" aria-hidden="true">🌐</span><span class="site-language-label">Language</span><select id="site-language-select" aria-label="Language"><option value="en">English</option><option value="ar">العربية</option><option value="he">עברית</option></select>';
  top.appendChild(box);
  const select=box.querySelector('select');let current='en';try{current=localStorage.getItem('chemistryLanguage')||'en'}catch{};select.value=/^(ar|he)$/.test(current)?current:'en';
  select.addEventListener('change',()=>{try{localStorage.setItem('chemistryLanguage',select.value)}catch{};if(window.ChemistryI18n?.setLanguage)window.ChemistryI18n.setLanguage(select.value);else location.reload()});
 }
 const account=document.getElementById('accountTopBtn');
 if(account&&!account.dataset.shellFallback){
  account.dataset.shellFallback='1';
  account.addEventListener('click',()=>setTimeout(()=>{
   const modal=document.getElementById('accountModal');
   if(modal&&getComputedStyle(modal).display==='none'){
    let signed=false;try{signed=!!JSON.parse(localStorage.getItem('chemistryCurrentUser')||sessionStorage.getItem('chemistryCurrentUser')||'null')?.token}catch{}
    if(signed)location.href='profile.html';else modal.style.display='block';
   }
  },120),false);
 }
}
const load=()=>{
 if(window.ChemistryI18n){ensureShell();window.ChemistryI18n.refresh?.();return}
 const s=document.createElement('script');s.src='i18n-core.js?v=20260830-safe-2';s.async=false;s.defer=false;s.onload=()=>{window.ChemistryI18n?.refresh?.();ensureShell()};s.onerror=ensureShell;document.head.appendChild(s);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();