(()=>{
'use strict';
const KEY='chemistryLanguage';
const I18N={
 ar:{
  '02 · PRACTICE & QUIZ':'02 · التدريب والاختبار','Practice to':'تدرّب حتى','master balancing.':'تتقن موازنة المعادلات.','Choose a difficulty, practice with instant feedback, or take a quiz and see your results at the end.':'اختر مستوى الصعوبة، وتدرّب مع ملاحظات فورية، أو خض اختبارًا وشاهد نتائجك في النهاية.','DIFFICULTY':'مستوى الصعوبة','Choose a level':'اختر المستوى','Beginner':'مبتدئ','Simple equations and core ideas':'معادلات بسيطة ومفاهيم أساسية','Intermediate':'متوسط','Parentheses and more steps':'الأقواس وخطوات أكثر','Advanced':'متقدم','Complex and combustion reactions':'تفاعلات معقدة وتفاعلات احتراق','EXPERIENCE':'نمط الاستخدام','Practice or Quiz?':'تدريب أم اختبار؟','Practice — instant feedback':'تدريب — ملاحظات فورية','Quiz — final results':'اختبار — النتائج النهائية','QUESTION TYPE':'نوع السؤال','How will you answer?':'كيف ستجيب؟','Multiple choice':'اختيار من متعدد','Type the coefficients':'اكتب المعاملات','Start practice':'ابدأ التدريب','BEGINNER':'مبتدئ','MEDIUM':'متوسط','HARD':'صعب','YOUR PROGRESS':'تقدمك','Quiz history':'سجل الاختبارات','Best results and accuracy are stored locally.':'تُحفظ أفضل النتائج والدقة على هذا الجهاز.','Practice':'التدريب','Get feedback after every answer and learn from mistakes.':'احصل على ملاحظات بعد كل إجابة وتعلّم من أخطائك.','Retry mistakes only':'أعد حل الأخطاء فقط','No history yet':'لا يوجد سجل بعد','Score':'النتيجة','Accuracy':'الدقة','Questions':'الأسئلة','Correct':'صحيح','Incorrect':'خطأ','Next':'التالي','Check':'تحقق','Submit':'إرسال','Finish':'إنهاء','Restart':'إعادة البدء','Time':'الوقت','Results':'النتائج','Your score':'نتيجتك','Try again':'حاول مرة أخرى','Back to practice':'العودة إلى التدريب','Learn • Quiz • Challenges • Balance • Check':'تعلّم • اختبار • تحديات • موازنة • تحقق','Account':'الحساب','Language':'اللغة','Dark':'داكن','Light':'فاتح','Practice page':'صفحة التدريب','Quiz page':'صفحة الاختبار'},
 he:{
  '02 · PRACTICE & QUIZ':'02 · תרגול וחידון','Practice to':'תרגלו כדי','master balancing.':'לשלוט באיזון משוואות.','Choose a difficulty, practice with instant feedback, or take a quiz and see your results at the end.':'בחרו רמת קושי, תרגלו עם משוב מיידי, או בצעו חידון וראו את התוצאות בסיום.','DIFFICULTY':'רמת קושי','Choose a level':'בחרו רמה','Beginner':'מתחילים','Simple equations and core ideas':'משוואות פשוטות ועקרונות בסיסיים','Intermediate':'ביניים','Parentheses and more steps':'סוגריים ושלבים נוספים','Advanced':'מתקדם','Complex and combustion reactions':'תגובות מורכבות ותגובות בעירה','EXPERIENCE':'אופן התרגול','Practice or Quiz?':'תרגול או חידון?','Practice — instant feedback':'תרגול — משוב מיידי','Quiz — final results':'חידון — תוצאות סופיות','QUESTION TYPE':'סוג השאלה','How will you answer?':'כיצד תענו?','Multiple choice':'בחירה מרובה','Type the coefficients':'הקלידו את המקדמים','Start practice':'התחילו לתרגל','BEGINNER':'מתחילים','MEDIUM':'בינוני','HARD':'קשה','YOUR PROGRESS':'ההתקדמות שלכם','Quiz history':'היסטוריית החידונים','Best results and accuracy are stored locally.':'התוצאות הטובות ביותר והדיוק נשמרים במכשיר זה.','Practice':'תרגול','Get feedback after every answer and learn from mistakes.':'קבלו משוב לאחר כל תשובה ולמדו מהטעויות.','Retry mistakes only':'תרגלו שוב רק את הטעויות','No history yet':'עדיין אין היסטוריה','Score':'ניקוד','Accuracy':'דיוק','Questions':'שאלות','Correct':'נכון','Incorrect':'לא נכון','Next':'הבא','Check':'בדיקה','Submit':'שליחה','Finish':'סיום','Restart':'התחלה מחדש','Time':'זמן','Results':'תוצאות','Your score':'הניקוד שלכם','Try again':'נסו שוב','Back to practice':'חזרה לתרגול','Learn • Quiz • Challenges • Balance • Check':'למידה • חידון • אתגרים • איזון • בדיקה','Account':'חשבון','Language':'שפה','Dark':'כהה','Light':'בהיר','Practice page':'דף התרגול','Quiz page':'דף החידון'}
};
const reverse={ar:Object.fromEntries(Object.entries(I18N.ar).map(([en,tr])=>[tr,en])),he:Object.fromEntries(Object.entries(I18N.he).map(([en,tr])=>[tr,en]))};
const sourceByNode=new WeakMap();
function lang(){const l=(localStorage.getItem(KEY)||'en').toLowerCase();return l==='ar'||l==='he'?l:'en'}
function baseText(value){const t=String(value??'').trim();return reverse.ar[t]||reverse.he[t]||t}
function isProtected(el){return !el||['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','SELECT','OPTION','INPUT'].includes(el.tagName)||!!el.closest('script,style,noscript,textarea,select,option,input,code,pre,.equation,.chemical-equation,.formula,.math,[data-no-translate]')}
function apply(root=document.body){
 const l=lang();
 document.documentElement.lang=l;
 document.documentElement.dir=l==='en'?'ltr':'rtl';
 if(!root)return;
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode())nodes.push(w.currentNode);
 for(const n of nodes){
  const p=n.parentElement;
  if(!p||isProtected(p))continue;
  const current=n.nodeValue||'';const trimmed=current.trim();if(!trimmed)continue;
  let source=sourceByNode.get(n);
  if(source===undefined){source=baseText(trimmed);sourceByNode.set(n,source)}
  if(l==='en'){if(source!==trimmed)n.nodeValue=current.replace(trimmed,source);continue}
  const tr=I18N[l][source];
  if(tr&&tr!==trimmed)n.nodeValue=current.replace(trimmed,tr);
 }
 const els=root.querySelectorAll?.('input[placeholder],textarea[placeholder],input[aria-label],textarea[aria-label],button[aria-label],a[title],button[title],input[title]')||[];
 for(const el of els){if(isProtected(el))continue;for(const attr of ['placeholder','aria-label','title']){const v=el.getAttribute(attr);if(!v)continue;const source=baseText(v);const tr=l==='en'?source:(I18N[l][source]||v);el.setAttribute(attr,tr)}}
 document.title=l==='ar'?'التدريب والاختبار — معادلات كيميائية':'תרגול וחידון — משוואות כימיות';
}
function accountFix(){
 const b=document.getElementById('accountTopBtn');
 if(!b||b.dataset.pqiAccount)return;
 b.dataset.pqiAccount='1';
 b.addEventListener('click',function(e){
  e.preventDefault();
  e.stopImmediatePropagation();
  if(typeof window.render==='function'){try{window.render('signin');return}catch{}}
  const modal=document.getElementById('accountModal');
  if(modal)modal.style.display='block';
 },true);
}
function observeDynamic(){
 for(const id of ['quizArea','scoreArea','quizStats','mistakeList','historyList','timer','questionType','experienceChoice']){
  const el=document.getElementById(id);if(!el||el.dataset.pqiObserved)return;
  el.dataset.pqiObserved='1';let timer;
  new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>apply(el),25)}).observe(el,{childList:true,subtree:true,characterData:true});
 }
}
function boot(){
 const run=()=>{accountFix();apply();observeDynamic()};
 run();
 setTimeout(run,0);setTimeout(run,100);setTimeout(run,400);
 window.addEventListener('chemistryLanguageChanged',run);
 window.addEventListener('storage',e=>{if(e.key===KEY)run()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();