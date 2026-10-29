(()=>{'use strict';
const BANK=[
{id:'e1',level:'easy',topic:'basic',q:'H₂ + O₂ → H₂O',a:'2H₂ + O₂ → 2H₂O'},
{id:'e2',level:'easy',topic:'basic',q:'Na + Cl₂ → NaCl',a:'2Na + Cl₂ → 2NaCl'},
{id:'e3',level:'easy',topic:'diatomic',q:'Mg + O₂ → MgO',a:'2Mg + O₂ → 2MgO'},
{id:'e4',level:'easy',topic:'diatomic',q:'H₂ + Cl₂ → HCl',a:'H₂ + Cl₂ → 2HCl'},
{id:'e5',level:'easy',topic:'basic',q:'N₂ + H₂ → NH₃',a:'N₂ + 3H₂ → 2NH₃'},
{id:'e6',level:'easy',topic:'diatomic',q:'P₄ + O₂ → P₂O₅',a:'P₄ + 5O₂ → 2P₂O₅'},
{id:'m1',level:'medium',topic:'basic',q:'Fe + O₂ → Fe₂O₃',a:'4Fe + 3O₂ → 2Fe₂O₃'},
{id:'m2',level:'medium',topic:'combustion',q:'CH₄ + O₂ → CO₂ + H₂O',a:'CH₄ + 2O₂ → CO₂ + 2H₂O'},
{id:'m3',level:'medium',topic:'combustion',q:'C₃H₈ + O₂ → CO₂ + H₂O',a:'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O'},
{id:'m4',level:'medium',topic:'parentheses',q:'Ca(OH)₂ + HCl → CaCl₂ + H₂O',a:'Ca(OH)₂ + 2HCl → CaCl₂ + 2H₂O'},
{id:'m5',level:'medium',topic:'redox',q:'Al + CuCl₂ → AlCl₃ + Cu',a:'2Al + 3CuCl₂ → 2AlCl₃ + 3Cu'},
{id:'m6',level:'medium',topic:'parentheses',q:'Na₃PO₄ + MgCl₂ → Mg₃(PO₄)₂ + NaCl',a:'2Na₃PO₄ + 3MgCl₂ → Mg₃(PO₄)₂ + 6NaCl'},
{id:'m7',level:'medium',topic:'diatomic',q:'KClO₃ → KCl + O₂',a:'2KClO₃ → 2KCl + 3O₂'},
{id:'m8',level:'medium',topic:'parentheses',q:'Pb(NO₃)₂ + KI → PbI₂ + KNO₃',a:'Pb(NO₃)₂ + 2KI → PbI₂ + 2KNO₃'},
{id:'h1',level:'hard',topic:'combustion',q:'C₂H₆ + O₂ → CO₂ + H₂O',a:'2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O'},
{id:'h2',level:'hard',topic:'parentheses',q:'Al₂(SO₄)₃ + Ca(OH)₂ → Al(OH)₃ + CaSO₄',a:'Al₂(SO₄)₃ + 3Ca(OH)₂ → 2Al(OH)₃ + 3CaSO₄'},
{id:'h3',level:'hard',topic:'redox',q:'KMnO₄ + HCl → KCl + MnCl₂ + H₂O + Cl₂',a:'2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 8H₂O + 5Cl₂'},
{id:'h4',level:'hard',topic:'redox',q:'Fe₂O₃ + CO → Fe + CO₂',a:'Fe₂O₃ + 3CO → 2Fe + 3CO₂'},
{id:'h5',level:'hard',topic:'parentheses',q:'(NH₄)₂SO₄ + NaOH → NH₃ + H₂O + Na₂SO₄',a:'(NH₄)₂SO₄ + 2NaOH → 2NH₃ + 2H₂O + Na₂SO₄'},
{id:'h6',level:'hard',topic:'combustion',q:'C₄H₁₀ + O₂ → CO₂ + H₂O',a:'2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O'}
];
const $=id=>document.getElementById(id), lang=()=>{try{return localStorage.getItem('chemistryLanguage')||'en'}catch{return'en'}};
const tr=(en,ar,he)=>lang()==='ar'?ar:lang()==='he'?he:en;
let current=[];
function applyStaticLanguage(){const l=lang();document.querySelectorAll('[data-en]').forEach(el=>{if(el.id==='toggleKey')return;const value=el.getAttribute('data-'+l);if(value!==null)el.innerHTML=value;});}
function shuffled(a){return [...a].sort(()=>Math.random()-.5)}
function fromUrl(){const ids=new URLSearchParams(location.search).get('q');if(!ids)return null;const selected=ids.split(',').map(id=>BANK.find(q=>q.id===id)).filter(Boolean);return selected.length?selected:null}
function updateUrl(){const u=new URL(location.href);u.searchParams.set('q',current.map(q=>q.id).join(','));history.replaceState({},'',u)}
function render(){ $('testQuestions').innerHTML=current.map((q,i)=>'<article class="test-question"><h3>'+tr('Question','السؤال','שאלה')+' '+(i+1)+'</h3><div class="question-equation">'+q.q+'</div><div class="answer-space" aria-hidden="true"></div></article>').join('');$('answers').innerHTML=current.map((q,i)=>'<article class="test-question"><h3>'+tr('Question','السؤال','שאלה')+' '+(i+1)+'</h3><div class="question-equation">'+q.a+'</div></article>').join('');$('scoreLine').textContent=tr('Score: ____ / '+current.length,'النتيجة: ____ / '+current.length,'ציון: ____ / '+current.length);updateUrl();$('answerKey').hidden=true;$('toggleKey').textContent=tr('Show answer key','إظهار مفتاح الإجابات','הצגת מפתח תשובות');}
function generate(random=true){const level=$('difficulty').value,topic=$('topic').value,count=Number($('count').value);let pool=BANK.filter(q=>(level==='all'||q.level===level)&&(topic==='all'||q.topic===topic));if(!pool.length)pool=BANK.filter(q=>level==='all'||q.level===level);const urlSet=fromUrl();if(!random&&urlSet){current=urlSet}else{current=shuffled(pool).slice(0,Math.min(count,pool.length));if(current.length<count){const used=new Set(current.map(q=>q.id));current=[...current,...shuffled(BANK.filter(q=>!used.has(q.id))).slice(0,count-current.length)]}}render();$('status').textContent=tr(current.length+' questions ready. The share link preserves this exact set.','تم تجهيز '+current.length+' أسئلة. يحافظ رابط المشاركة على مجموعة الأسئلة نفسها.','הוכנו '+current.length+' שאלות. קישור השיתוף שומר על אותה קבוצת שאלות.');}
function print(mode){
  const printWindow=window.open('','_blank','popup=yes,width=900,height=700');
  if(!printWindow){
    $('status').textContent=tr('Your browser blocked the print window. Allow pop-ups for this site, then try again.','حظر المتصفح نافذة الطباعة. اسمح بالنوافذ المنبثقة لهذا الموقع ثم حاول مجددًا.','הדפדפן חסם את חלון ההדפסה. יש לאפשר חלונות קופצים לאתר ולנסות שוב.');
    return;
  }
  const isKey=mode==='key';
  const heading=isKey?tr('Answer key','مفتاح الإجابات','מפתח תשובות'):$('sheetTitle').textContent;
  const source=isKey?$('answers'):$('testQuestions');
  const body=source.innerHTML;
  const meta=isKey?'':$('testSheet').querySelector('.test-meta').outerHTML;
  const safeTitle=tr('Chemistry equation balancing test','اختبار موازنة المعادلات الكيميائية','מבחן איזון משוואות כימיות');
  printWindow.document.open();
  printWindow.document.write('<!doctype html><html lang="'+lang()+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+safeTitle+'</title><style>body{margin:24px;color:#111;background:#fff;font:12pt/1.45 Georgia,serif}h1{font-size:20pt;margin:0 0 14px}h2{font-size:15pt}.test-meta{display:flex;gap:20px;flex-wrap:wrap;border-bottom:1px solid #aaa;padding-bottom:12px;margin-bottom:12px;color:#333}.test-question{padding:12px 0;border-bottom:1px solid #ccc;break-inside:avoid}.test-question h3{font-size:12pt;margin:0 0 7px}.question-equation{font: bold 15pt/1.5 Arial,sans-serif;direction:ltr;text-align:left;unicode-bidi:isolate}.answer-space{height:24px;max-width:100%;margin-top:6px;border-bottom:1px solid #777}@page{margin:16mm}</style></head><body><h1>'+heading.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</h1>'+meta+body+'</body></html>');
  printWindow.document.close();
  printWindow.focus();
  setTimeout(()=>{if(!printWindow.closed){try{printWindow.focus();printWindow.print()}catch(_){}}},250);
}
$('generate').addEventListener('click',()=>generate(true));$('newSet').addEventListener('click',()=>generate(true));
$('share').addEventListener('click',async()=>{const link=location.href;try{await navigator.clipboard.writeText(link);$('status').textContent=tr('Share link copied.','تم نسخ رابط المشاركة.','קישור השיתוף הועתק.')}catch{$('status').textContent=link;try{window.prompt(tr('Copy this share link:','انسخ رابط المشاركة هذا:','העתיקו את קישור השיתוף:'),link)}catch{}}});
$('printTest').addEventListener('click',()=>print('test'));$('printKey').addEventListener('click',()=>print('key'));$('toggleKey').addEventListener('click',()=>{const key=$('answerKey');key.hidden=!key.hidden;$('toggleKey').textContent=key.hidden?tr('Show answer key','إظهار مفتاح الإجابات','הצגת מפתח תשובות'):tr('Hide answer key','إخفاء مفتاح الإجابات','הסתרת מפתח תשובות')});
$('difficulty').addEventListener('change',()=>generate(true));$('count').addEventListener('change',()=>generate(true));$('topic').addEventListener('change',()=>generate(true));
window.addEventListener('chemistryLanguageChanged',()=>{const key=$('answerKey');$('toggleKey').textContent=key.hidden?tr('Show answer key','إظهار مفتاح الإجابات','הצגת מפתח תשובות'):tr('Hide answer key','إخفاء مفتاح الإجابات','הסתרת מפתח תשובות')});
const shared=fromUrl();if(shared){current=shared;render()}else generate(true);applyStaticLanguage();window.addEventListener('chemistryLanguageChanged',applyStaticLanguage);
})();
