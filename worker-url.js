// Cloudflare Worker URLs
window.CHEMISTRY_HANDWRITING_WORKER = 'https://chemistry-handwriting.reemkhmasalha.workers.dev';
window.CHEMISTRY_API_WORKER = 'https://chemistry-equations-api.reemkhmasalha.workers.dev';
// Load the language switching repair after the main page scripts initialize.
(()=>{const load=()=>{const s=document.createElement('script');s.src='language-switch-fix.js?v=20260827-13';s.async=false;document.head.appendChild(s)};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load()})();
