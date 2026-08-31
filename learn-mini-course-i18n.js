/* Legacy compatibility file. The unified runtime owns all localization. */
(()=>{'use strict';const refresh=()=>window.ChemistryI18n?.refresh?.();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();window.addEventListener('chemistryI18nReady',refresh);window.addEventListener('chemistryLanguageChanged',refresh)})();
