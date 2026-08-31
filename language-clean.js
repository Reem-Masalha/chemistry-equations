/* Legacy compatibility file. theme.js loads the unified localization runtime. */
(()=>{'use strict';const refresh=()=>window.ChemistryI18n?.refresh?.();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();window.addEventListener('chemistryI18nReady',refresh);window.addEventListener('chemistryLanguageChanged',refresh)})();
