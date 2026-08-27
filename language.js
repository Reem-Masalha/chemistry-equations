(()=>{
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
function selector(){
 const top=document.querySelector('.topbar');if(!top||document.getElementById('site-language'))return;
 const wrap=document.createElement('label');wrap.id='site-language';wrap.style.cssText='display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;white-space:nowrap';
 const sel=document.createElement('select');sel.id='languageSelect';sel.setAttribute('aria-label','Language');sel.style.cssText='border:1px solid var(--line);background:var(--surface);color:var(--text);border-radius:9px;padding:7px 9px;font-weight:700;cursor:pointer';
 [['en','English'],['ar','العربية'],['he','עברית']].forEach(([v,n])=>{const o=document.createElement('option');o.value=v;o.textContent=n;sel.appendChild(o)});
 sel.value=localStorage.getItem('chemistryLanguage')||'en';
 sel.addEventListener('change',()=>{localStorage.setItem('chemistryLanguage',sel.value);window.dispatchEvent(new Event('languagechange'));setTimeout(()=>window.translateSite&&window.translateSite(),30)});
 wrap.appendChild(sel);top.appendChild(wrap);
}
load('language-v2.js?v=20260827-2').then(()=>{load('rtl-layout-fix.js?v=20260827-1').catch(()=>{});selector();setTimeout(selector,100)}).catch(()=>{});
window.addEventListener('DOMContentLoaded',selector);
})();
