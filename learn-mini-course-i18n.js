(()=>{'use strict';
const run=()=>{if(window.learnFullI18n)window.learnFullI18n();};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('chemistryLanguageChanged',run);
})();