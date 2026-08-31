// Cloudflare Worker URLs
window.CHEMISTRY_HANDWRITING_WORKER = 'https://chemistry-handwriting.reemkhmasalha.workers.dev';
window.CHEMISTRY_API_WORKER = 'https://chemistry-equations-api.reemkhmasalha.workers.dev';
// Keep this file limited to shared infrastructure. Handwriting recognition is
// handled by handwriting.js; no client-side expansion/rejection guard is loaded.

// Standalone user-facing pages (for example set-password.html) do not load the
// regular header/theme bootstrap, so give them the same localization runtime.
(()=>{
  if(window.ChemistryI18n || document.querySelector('script[data-global-i18n],script[data-worker-i18n-bootstrap],script[data-language-clean-i18n]')) return;
  const core=document.createElement('script');
  core.src='i18n-core.js?v=20260831-global-3';
  core.async=false;
  core.dataset.workerI18nBootstrap='1';
  core.onload=()=>{
    if(document.querySelector('script[data-worker-i18n-enhancements]')) return;
    const extra=document.createElement('script');
    extra.src='i18n-enhancements.js?v=20260831-global-3';
    extra.async=false;
    extra.dataset.workerI18nEnhancements='1';
    document.head.appendChild(extra);
  };
  document.head.appendChild(core);
})();
