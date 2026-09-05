/* Site-wide compatibility/bootstrap shim. Shared visual design is owned by theme.js. */
(()=>{
  'use strict';
  if(document.querySelector('script[src^="theme.js"]'))return;
  const s=document.createElement('script');
  s.src='theme.js?v=20260905-design-system-3';
  s.defer=true;
  (document.head||document.documentElement).appendChild(s);
})();
