// Cloudflare Worker URLs
window.CHEMISTRY_HANDWRITING_WORKER = 'https://chemistry-handwriting.reemkhmasalha.workers.dev';
window.CHEMISTRY_API_WORKER = 'https://chemistry-equations-api.reemkhmasalha.workers.dev';
// Load language switching repair and conservative handwriting guard.
(()=>{const load=src=>{const s=document.createElement('script');s.src=src;s.async=false;document.head.appendChild(s)};const start=()=>{load('language-switch-fix.js?v=20260828-13');load('handwriting-recognition-guard.js?v=20260828-18')};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start()})();