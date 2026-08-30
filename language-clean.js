(()=>{'use strict';
const add=(tag,attrs)=>{const e=document.createElement(tag);for(const[k,v]of Object.entries(attrs||{}))e.setAttribute(k,v);return e};
function load(src,marker){if(!document.querySelector('script['+marker+']')){const s=add('script',{src});s.setAttribute(marker,'1');document.body.appendChild(s)}}
function boot(){
 if(!document.querySelector('link[data-chemistry-language-css]')){const l=add('link',{rel:'stylesheet',href:'site-language.css?v=20260830-2'});l.dataset.chemistryLanguageCss='1';document.head.appendChild(l)}
 load('site-language-v2.js?v=20260830-2','data-chemistry-language-v2');
 if(/(^|\/)challenges\.html$/i.test(location.pathname))load('challenge-language-v3.js?v=20260830-1','data-chemistry-challenge-v3');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();