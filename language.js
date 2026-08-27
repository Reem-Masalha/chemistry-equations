(()=>{
  const KEY='chemistryLanguage';
  const langs={en:{label:'English',dir:'ltr'},ar:{label:'العربية',dir:'rtl'},he:{label:'עברית',dir:'rtl'}};
  const t={en:{Learn:'Learn',Quiz:'Quiz',Challenges:'Challenges',Balancer:'Balancer',Checker:'Checker',Account:'Account'},ar:{Learn:'تعلّم',Quiz:'اختبار',Challenges:'التحديات',Balancer:'موازنة المعادلات',Checker:'التحقق',Account:'الحساب'},he:{Learn:'למידה',Quiz:'חידון',Challenges:'אתגרים',Balancer:'מאזן משוואות',Checker:'בדיקה',Account:'חשבון'}};
  const get=()=>localStorage.getItem(KEY)||'en';
  function apply(){const l=get(),m=langs[l]||langs.en;document.documentElement.lang=l;document.documentElement.dir=m.dir;if(document.body)document.body.classList.toggle('rtl',m.dir==='rtl');document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(t[l]?.[k])e.textContent=t[l][k]});const s=document.getElementById('languageSwitcher');if(s)s.value=l}
  function set(l){if(!langs[l])return;localStorage.setItem(KEY,l);apply()}
  function addSwitcher(){const top=document.querySelector('.topbar');if(!top||document.getElementById('languageSwitcher'))return;const s=document.createElement('select');s.id='languageSwitcher';s.className='secondary';s.setAttribute('aria-label','Language');Object.entries(langs).forEach(([k,v])=>{const o=document.createElement('option');o.value=k;o.textContent=v.label;s.appendChild(o)});s.value=get();s.onchange=()=>set(s.value);top.appendChild(s)}
  async function cleanup(){try{if('serviceWorker' in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}if('caches' in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch(_){} }
  function init(){addSwitcher();apply();cleanup()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.ChemistryLanguage={set,get,translate:t};
})();
