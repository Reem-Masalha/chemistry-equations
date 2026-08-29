(()=>{
'use strict';
const KEY='chemistryLanguage';
function install(){
 if(!document.body||document.getElementById('site-language-selector'))return;
 const select=document.createElement('select');
 select.id='site-language-selector';
 select.setAttribute('aria-label','Language');
 select.innerHTML='<option value="en">English</option><option value="ar">العربية</option><option value="he">עברית</option>';
 Object.assign(select.style,{position:'fixed',top:'12px',right:'12px',zIndex:'2147483647',minWidth:'112px',padding:'7px 9px',border:'1px solid #bbb',borderRadius:'8px',background:'#fff',color:'#111',font:'14px system-ui,sans-serif',cursor:'pointer',boxSizing:'border-box'});
 let current='en';try{current=localStorage.getItem(KEY)||'en'}catch{}
 if(!['en','ar','he'].includes(current))current='en';
 select.value=current;
 select.addEventListener('change',()=>{
   try{localStorage.setItem(KEY,select.value)}catch{}
   document.documentElement.lang=select.value;
   document.documentElement.dir=select.value==='en'?'ltr':'rtl';
   document.body.classList.toggle('rtl-language',select.value!=='en');
   location.reload();
 });
 document.body.appendChild(select);
 document.documentElement.lang=current;
 document.documentElement.dir=current==='en'?'ltr':'rtl';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
