(()=>{
  const KEY='chemistryLanguage';
  const langs={en:{label:'English',dir:'ltr'},ar:{label:'العربية',dir:'rtl'},he:{label:'עברית',dir:'rtl'}};
  const t={
    en:{Learn:'Learn',Quiz:'Quiz',Challenges:'Challenges',Balancer:'Balancer',Checker:'Checker',Account:'Account'},
    ar:{Learn:'تعلّم',Quiz:'اختبار',Challenges:'التحديات',Balancer:'موازنة المعادلات',Checker:'التحقق',Account:'الحساب'},
    he:{Learn:'למידה',Quiz:'חידון',Challenges:'אתגרים',Balancer:'מאזן משוואות',Checker:'בדיקה',Account:'חשבון'}
  };
  function lang(){return localStorage.getItem(KEY)||'en'}
  let observer=null;
  let applying=false;
  function translateNode(node,l){
    if(node.nodeType!==3)return;
    const raw=node.nodeValue,key=raw.trim();
    if(!key||!t[l][key])return;
    node.nodeValue=raw.replace(key,t[l][key]);
  }
  function apply(){
    if(applying)return;
    applying=true;
    if(observer)observer.disconnect();
    try{
      const l=lang(),meta=langs[l];
      document.documentElement.lang=l;
      document.documentElement.dir=meta.dir;
      if(document.body)document.body.setAttribute('dir',meta.dir);
      document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(t[l][k])e.textContent=t[l][k]});
      if(document.body){
        const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
        const nodes=[];
        while(walker.nextNode())nodes.push(walker.currentNode);
        nodes.forEach(n=>{if(n.parentElement?.closest('script,style,textarea'))return;translateNode(n,l)});
      }
      document.querySelectorAll('input[placeholder]').forEach(e=>{const k=e.placeholder.trim();if(t[l][k])e.placeholder=t[l][k]});
      const b=document.getElementById('languageSwitcher');if(b)b.value=l;
      document.body?.classList.toggle('rtl',meta.dir==='rtl');
    }finally{
      applying=false;
      if(observer&&document.body)observer.observe(document.body,{childList:true,subtree:true});
    }
  }
  function setLang(l){if(!langs[l])return;localStorage.setItem(KEY,l);apply()}
  function addSwitcher(){
    const top=document.querySelector('.topbar');
    if(!top||document.getElementById('languageSwitcher'))return;
    const select=document.createElement('select');
    select.id='languageSwitcher';select.className='secondary';select.setAttribute('aria-label','Language');
    Object.entries(langs).forEach(([k,v])=>{const o=document.createElement('option');o.value=k;o.textContent=v.label;select.appendChild(o)});
    select.value=lang();select.onchange=()=>setLang(select.value);top.appendChild(select);
  }
  function init(){
    addSwitcher();
    observer=new MutationObserver(()=>{if(!applying)apply()});
    apply();
    if(document.body)observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.ChemistryLanguage={set:setLang,get:lang,translate:t};
})();
