/* Educational translation data is registered by language.js.
 * This file intentionally contains no DOM observers or automatic page mutations.
 * Keeping it side-effect free prevents the educational pages from getting stuck
 * while still allowing the shared language system to provide translations.
 */
(()=>{
  const language = window.ChemistryLanguage;
  if (!language || !language.translate) return;
})();
