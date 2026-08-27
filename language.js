(()=>{
  const KEY='chemistryLanguage';
  const langs={en:{label:'English',dir:'ltr'},ar:{label:'العربية',dir:'rtl'},he:{label:'עברית',dir:'rtl'}};
  const t={en:{Learn:'Learn',Quiz:'Quiz',Challenges:'Challenges',Balancer:'Balancer',Checker:'Checker',Account:'Account',Easy:'Easy',Medium:'Medium',Hard:'Hard','Balancing checklist':'Balancing checklist','Correct element symbols':'Correct element symbols','Correct chemical formulas and subscripts':'Correct chemical formulas and subscripts','Correct diatomic formulas when applicable':'Correct diatomic formulas when applicable','Count atoms on both sides':'Count atoms on both sides','Add coefficients instead of changing formulas':'Add coefficients instead of changing formulas','Recount every element':'Recount every element','Use the smallest whole-number ratio':'Use the smallest whole-number ratio'},ar:{Learn:'تعلّم',Quiz:'اختبار',Challenges:'التحديات',Balancer:'موازنة المعادلات',Checker:'التحقق',Account:'الحساب',Easy:'سهل',Medium:'متوسط',Hard:'صعب','Balancing checklist':'قائمة تحقق للموازنة','Correct element symbols':'رموز العناصر الصحيحة','Correct chemical formulas and subscripts':'الصيغ الكيميائية الصحيحة والأرقام السفلية الصحيحة','Correct diatomic formulas when applicable':'الصيغ الصحيحة للعناصر ثنائية الذرة عند الحاجة','Count atoms on both sides':'عُدّ الذرات على كلا الجانبين','Add coefficients instead of changing formulas':'أضف المعاملات بدلًا من تغيير الصيغ','Recount every element':'أعد عَدّ جميع العناصر','Use the smallest whole-number ratio':'استخدم أصغر نسبة ممكنة من الأعداد الصحيحة'},he:{Learn:'למידה',Quiz:'חידון',Challenges:'אתגרים',Balancer:'מאזן משוואות',Checker:'בדיקה',Account:'חשבון',Easy:'קל',Medium:'בינוני',Hard:'קשה','Balancing checklist':'רשימת בדיקה לאיזון','Correct element symbols':'סמלי היסודות הנכונים','Correct chemical formulas and subscripts':'נוסחאות כימיות ומספרים תחתונים נכונים','Correct diatomic formulas when applicable':'נוסחאות נכונות של יסודות דו-אטומיים כאשר הדבר רלוונטי','Count atoms on both sides':'ספור את האטומים בשני הצדדים','Add coefficients instead of changing formulas':'הוסף מקדמים במקום לשנות נוסחאות','Recount every element':'ספור מחדש את כל היסודות','Use the smallest whole-number ratio':'השתמש ביחס הקטן ביותר של מספרים שלמים'}};
  const get=()=>langs[localStorage.getItem(KEY)]?localStorage.getItem(KEY):'en';
  function apply(){
    const l=get(),m=langs[l];
    document.documentElement.lang=l;document.documentElement.dir=m.dir;
    if(!document.body)return;
    document.body.classList.toggle('rtl',m.dir==='rtl');
    document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(t[l][k]!=null)e.textContent=t[l][k]});
    document.querySelectorAll('[data-i18n-original]').forEach(e=>{const k=e.dataset.i18nOriginal;if(t[l][k]!=null)e.textContent=t[l][k]});
    document.querySelectorAll('body *').forEach(e=>{
      if(e.matches('script,style,textarea,input,select,option')||e.children.length)return;
      if(!e.dataset.i18nOriginal){const s=e.textContent.trim();if(t.en[s])e.dataset.i18nOriginal=s}
      const k=e.dataset.i18nOriginal;if(k&&t[l][k]!=null)e.textContent=t[l][k];
    });
    document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(e=>{if(!e.dataset.i18nPlaceholder)e.dataset.i18nPlaceholder=e.placeholder;const k=e.dataset.i18nPlaceholder;if(t[l][k]!=null)e.placeholder=t[l][k]});
    const sw=document.getElementById('languageSwitcher');if(sw)sw.value=l;
  }
  function set(l){if(langs[l]){localStorage.setItem(KEY,l);apply()}}
  function addSwitcher(){
    const top=document.querySelector('.topbar');if(!top||document.getElementById('languageSwitcher'))return;
    const s=document.createElement('select');s.id='languageSwitcher';s.className='secondary';s.setAttribute('aria-label','Language');
    Object.entries(langs).forEach(([k,v])=>{const o=document.createElement('option');o.value=k;o.textContent=v.label;s.appendChild(o)});
    s.value=get();s.onchange=()=>set(s.value);top.appendChild(s);
  }
  function init(){addSwitcher();apply()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.ChemistryLanguage={set,get,translate:t,apply};
})();
