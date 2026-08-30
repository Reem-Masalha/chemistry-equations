(()=>{
'use strict';
const LANG_KEY='chemistryLanguage';
const T={
'en':{
'Balance checklist':'Balance checklist','Correct element symbols':'Correct element symbols','Correct chemical formulas and subscripts':'Correct chemical formulas and subscripts','Correct diatomic formulas when applicable':'Correct diatomic formulas when applicable','Count atoms on both sides':'Count atoms on both sides','Add coefficients instead of changing formulas':'Add coefficients instead of changing formulas','Recount every element':'Recount every element','Use the smallest whole-number ratio':'Use the smallest whole-number ratio','Step-by-step balancing':'Step-by-step balancing','Each step explains why the coefficient changes and how the atom counts stay conserved.':'Each step explains why the coefficient changes and how the atom counts stay conserved.','Explanation':'Explanation','Hide explanation':'Hide explanation','Final:':'Final:','Step':'Step','Balance':'Balance','Equations\' history':"Equations' history",'recent equation':'recent equation','recent equations':'recent equations','No saved equations yet.':'No saved equations yet.','Clear history':'Clear history','Equation':'Equation','Balanced result':'Balanced result','Reopen':'Reopen','Copy equation':'Copy equation','Copy solution':'Copy solution','Share':'Share','Delete':'Delete','Balance an equation to start your history.':'Balance an equation to start your history.','Copied ✓':'Copied ✓'},
'ar':{
'Balance checklist':'قائمة تحقق للموازنة','Correct element symbols':'رموز العناصر الصحيحة','Correct chemical formulas and subscripts':'الصيغ الكيميائية والأرقام السفلية الصحيحة','Correct diatomic formulas when applicable':'الصيغ ثنائية الذرة الصحيحة عند انطباقها','Count atoms on both sides':'عدّ الذرات على الجانبين','Add coefficients instead of changing formulas':'أضف المعاملات بدلًا من تغيير الصيغ','Recount every element':'أعد عدّ كل عنصر','Use the smallest whole-number ratio':'استخدم أصغر نسبة صحيحة بأعداد كلية','Step-by-step balancing':'الموازنة خطوة بخطوة','Each step explains why the coefficient changes and how the atom counts stay conserved.':'تشرح كل خطوة سبب تغيير المعامل وكيف يبقى عدد الذرات محفوظًا.','Explanation':'الشرح','Hide explanation':'إخفاء الشرح','Final:':'النتيجة النهائية:','Step':'الخطوة','Balance':'وازن','Equations\' history':'سجل المعادلات','recent equation':'معادلة حديثة','recent equations':'معادلات حديثة','No saved equations yet.':'لا توجد معادلات محفوظة بعد.','Clear history':'مسح السجل','Equation':'المعادلة','Balanced result':'النتيجة الموزونة','Reopen':'إعادة فتح','Copy equation':'نسخ المعادلة','Copy solution':'نسخ الحل','Share':'مشاركة','Delete':'حذف','Balance an equation to start your history.':'وازن معادلة لبدء السجل.','Copied ✓':'تم النسخ ✓'},
'he':{
'Balance checklist':'רשימת בדיקה לאיזון','Correct element symbols':'סמלי היסודות הנכונים','Correct chemical formulas and subscripts':'נוסחאות כימיות ומספרים תחתיים נכונים','Correct diatomic formulas when applicable':'נוסחאות דו-אטומיות נכונות כאשר הן נדרשות','Count atoms on both sides':'ספרו את האטומים בשני הצדדים','Add coefficients instead of changing formulas':'הוסיפו מקדמים במקום לשנות נוסחאות','Recount every element':'ספרו מחדש כל יסוד','Use the smallest whole-number ratio':'השתמשו ביחס השלם הקטן ביותר','Step-by-step balancing':'איזון שלב אחר שלב','Each step explains why the coefficient changes and how the atom counts stay conserved.':'כל שלב מסביר מדוע המקדם משתנה וכיצד מספר האטומים נשמר.','Explanation':'הסבר','Hide explanation':'הסתרת ההסבר','Final:':'סופי:','Step':'שלב','Balance':'אזן','Equations\' history':'היסטוריית משוואות','recent equation':'משוואה אחרונה','recent equations':'משוואות אחרונות','No saved equations yet.':'אין עדיין משוואות שמורות.','Clear history':'ניקוי ההיסטוריה','Equation':'משוואה','Balanced result':'תוצאה מאוזנת','Reopen':'פתיחה מחדש','Copy equation':'העתקת המשוואה','Copy solution':'העתקת הפתרון','Share':'שיתוף','Delete':'מחיקה','Balance an equation to start your history.':'אזנו משוואה כדי להתחיל את ההיסטוריה.','Copied ✓':'הועתק ✓'}
};
function lang(){const v=localStorage.getItem(LANG_KEY)||'en';return T[v]?v:'en'}
function replaceText(root){const map=T[lang()];const walker=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const n of nodes){const raw=n.nodeValue;if(!raw||!raw.trim())continue;const key=raw.trim();if(map[key])n.nodeValue=raw.replace(key,map[key])}}
function patch(){
  replaceText(document.body);
  const out=document.getElementById('balanceResult');if(out)replaceText(out);
  const history=document.getElementById('equationHistory');if(history)replaceText(history);
}
function init(){
  patch();
  document.addEventListener('click',e=>{
    if(e.target.closest('#balanceBtn,#balanceRecognized,[data-eq],#clearEquationHistory'))setTimeout(patch,80);
    if(e.target.closest('#explanationToggle'))setTimeout(patch,20);
  },true);
  document.addEventListener('change',e=>{if(e.target.closest('.site-language-control'))setTimeout(patch,50)},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
