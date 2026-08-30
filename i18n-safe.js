(()=>{
'use strict';
const KEY='chemistryLanguage';
const LANG={en:{dir:'ltr',label:'English'},ar:{dir:'rtl',label:'العربية'},he:{dir:'rtl',label:'עברית'}};
let M={};
const originals=new WeakMap();
const reverse=new Map();
function getLang(){try{const v=localStorage.getItem(KEY);return LANG[v]?v:'en'}catch{return'en'}}
function isProtected(el){return !el||!!el.closest('script,style,noscript,textarea,select,option,code,pre,[data-no-translate],.equation,.chemical-equation,.formula,.math,[data-equation],[data-chemical],.site-language-control,.brand')}
function normalize(s){return String(s??'').replace(/\s+/g,' ').trim()}
function buildReverse(){reverse.clear();for(const [en,v] of Object.entries(M)){if(v&&v[0])reverse.set(normalize(v[0]),en);if(v&&v[1])reverse.set(normalize(v[1]),en)}}
function baseText(raw){const b=normalize(raw);if(!b)return b;if(M[b])return b;return reverse.get(b)||b}
function scan(root,l){
 const walker=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT);const nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 for(const n of nodes){const p=n.parentElement;if(isProtected(p))continue;const raw=n.nodeValue||'';const nrm=normalize(raw);if(!nrm)continue;
  if(!originals.has(n))originals.set(n,baseText(nrm));
  const base=originals.get(n);const v=M[base];const out=l==='en'?base:(v&&v[l==='ar'?0:1]||base);
  if(out!==nrm)n.nodeValue=raw.replace(nrm,out);
 }
 const els=(root||document).querySelectorAll?.('input[placeholder],textarea[placeholder],input[aria-label],textarea[aria-label],button[aria-label],input[title],button[title],a[title]')||[];
 for(const el of els){if(isProtected(el))continue;for(const a of ['placeholder','aria-label','title']){if(!el.hasAttribute(a))continue;const raw=el.getAttribute(a)||'';const b=originals.get(el)||baseText(raw);originals.set(el,b);const v=M[b];const out=l==='en'?b:(v&&v[l==='ar'?0:1]||b);if(out!==raw)el.setAttribute(a,out)}}
}
function shell(){
 const top=document.querySelector('.topbar');if(!top)return;
 let box=document.getElementById('site-language-control');
 if(!box){box=document.createElement('label');box.id='site-language-control';box.className='site-language-control';box.innerHTML='<span class="site-language-icon" aria-hidden="true">🌐</span><span class="site-language-label">Language</span><select id="site-language-select" aria-label="Language"><option value="en">English</option><option value="ar">العربية</option><option value="he">עברית</option></select>';top.appendChild(box);box.querySelector('select').addEventListener('change',e=>{try{localStorage.setItem(KEY,e.target.value)}catch{};location.reload()})}
 box.querySelector('select').value=getLang();
}
function rtlCss(){if(document.getElementById('i18n-safe-style'))return;const s=document.createElement('style');s.id='i18n-safe-style';s.textContent=`html[dir="rtl"] body{text-align:right}html[dir="rtl"] .topbar,html[dir="rtl"] .main-nav,html[dir="rtl"] .section-head,html[dir="rtl"] .input-row,html[dir="rtl"] .hand-head,html[dir="rtl"] .hand-actions,html[dir="rtl"] .balancer-actions,html[dir="rtl"] .pad-tools{direction:rtl}html[dir="rtl"] .main-nav{flex-direction:row-reverse}html[dir="rtl"] .brand{direction:ltr}html[dir="rtl"] input:not([data-equation]),html[dir="rtl"] textarea{direction:rtl;text-align:right}html[dir="rtl"] .equation,html[dir="rtl"] .chemical-equation,html[dir="rtl"] .formula,html[dir="rtl"] [data-equation],html[dir="rtl"] [data-chemical],html[dir="rtl"] .math{direction:ltr!important;text-align:left!important;unicode-bidi:isolate}html[dir="rtl"] .account-dialog{text-align:right}html[dir="rtl"] .account-close{right:auto;left:12px}.site-language-control{display:inline-flex!important;align-items:center;gap:7px;margin-left:10px;white-space:nowrap}.site-language-control select{font:inherit;min-height:36px}html[dir="rtl"] .site-language-control{margin-left:0;margin-right:10px}`;document.head.appendChild(s)}
function apply(l=getLang){l=LANG[l]?l:getLang();document.documentElement.lang=l;document.documentElement.dir=LANG[l].dir;document.body.dir=LANG[l].dir;document.body.classList.toggle('is-rtl-language',l!=='en');shell();rtlCss();if(Object.keys(M).length)scan(document.body,l)}
async function loadDictionary(){try{const r=await fetch('site-language-v2.js?dict=20260830',{cache:'no-store'});const src=await r.text();const start=src.indexOf('const M=');const end=src.indexOf(';\nconst original',start);if(start<0||end<0)throw Error('dictionary not found');M=Function('return '+src.slice(start+8,end))();buildReverse()}catch(e){M={}}}
async function init(){apply();await loadDictionary();apply();[150,500,1200,2500].forEach(ms=>setTimeout(()=>apply(),ms));window.ChemistryI18n={lang:getLang,refresh:()=>apply(),setLanguage:l=>{try{localStorage.setItem(KEY,l)}catch{};location.reload()},t:(en,ar,he)=>getLang()==='ar'?(ar??en):getLang()==='he'?(he??en):en};window.ChemLang=window.ChemistryI18n}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();