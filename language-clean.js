(()=>{'use strict';
const add=(tag,attrs)=>{const e=document.createElement(tag);for(const[k,v]of Object.entries(attrs||{}))e.setAttribute(k,v);return e};
function boot(){
 if(!document.querySelector('link[data-chemistry-language-css]')){const l=add('link',{rel:'stylesheet',href:'site-language.css?v=20260830-2'});l.dataset.chemistryLanguageCss='1';document.head.appendChild(l)}
 if(!document.querySelector('script[data-chemistry-language-v2]')){const s=add('script',{src:'site-language-v2.js?v=20260830-2'});s.dataset.chemistryLanguageV2='1';document.head.appendChild(s)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();