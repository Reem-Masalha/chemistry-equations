(()=>{
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
function selector(){
 const top=document.querySelector('.topbar');if(!top||document.getElementById('site-language'))return;
 const wrap=document.createElement('label');wrap.id='site-language';wrap.style.cssText='display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;white-space:nowrap';
 const sel=document.createElement('select');sel.id='languageSelect';sel.setAttribute('aria-label','Language');sel.style.cssText='border:1px solid var(--line);background:var(--surface);color:var(--text);border-radius:9px;padding:7px 9px;font-weight:700;cursor:pointer';
 [['en','English'],['ar','العربية'],['he','עברית']].forEach(([v,n])=>{const o=document.createElement('option');o.value=v;o.textContent=n;sel.appendChild(o)});
 sel.value=localStorage.getItem('chemistryLanguage')||'en';
 sel.addEventListener('change',()=>{localStorage.setItem('chemistryLanguage',sel.value);document.documentElement.lang=sel.value;document.documentElement.dir=(sel.value==='ar'||sel.value==='he')?'rtl':'ltr';window.dispatchEvent(new Event('languagechange'));setTimeout(()=>window.translateSite&&window.translateSite(),30)});
 wrap.appendChild(sel);top.appendChild(wrap);
}
load('language-v2.js?v=20260827-3').then(()=>load('rtl-layout-fix.js?v=20260827-2').catch(()=>{})).then(()=>load('translation-runtime-fix.js?v=20260827-1').catch(()=>{})).then(()=>{selector();setTimeout(selector,100);document.documentElement.lang=localStorage.getItem('chemistryLanguage')||'en';const l=localStorage.getItem('chemistryLanguage')||'en';document.documentElement.dir=(l==='ar'||l==='he')?'rtl':'ltr';}).catch(()=>{selector()});
window.addEventListener('DOMContentLoaded',selector);
})();
