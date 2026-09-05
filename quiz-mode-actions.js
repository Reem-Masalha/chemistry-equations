(()=>{
'use strict';
const ui=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const isText=(el,re)=>re.test(clean(el?.textContent));
function styleButtons(){document.querySelectorAll('.quiz-settings .sp-actions > *, .quiz-settings .ce3-actions > *, .quiz-settings [data-mode], .quiz-settings button, .quiz-settings a').forEach(b=>{
 const t=clean(b.textContent); if(!/Start practice|Exam mode|Challenge|ابدأ التدريب|وضع الاختبار|تحدي|התחל תרגול|מצב מבחן|אתגר/i.test(t))return;
 b.classList.remove('full','secondary');
 b.style.setProperty('box-sizing','border-box','important');
 b.style.setProperty('display','inline-flex','important');
 b.style.setProperty('align-items','center','important');
 b.style.setProperty('justify-content','center','important');
 b.style.setProperty('min-height','46px','important');
 b.style.setProperty('height','46px','important');
 b.style.setProperty('padding','10px 16px','important');
 b.style.setProperty('margin','0','important');
 b.style.setProperty('border','1px solid var(--accent)','important');
 b.style.setProperty('border-radius','10px','important');
 b.style.setProperty('background','var(--accent)','important');
 b.style.setProperty('color','#fff','important');
 b.style.setProperty('font-weight','700','important');
 b.style.setProperty('line-height','1.2','important');
 b.style.setProperty('text-align','center','important');
 b.style.setProperty('flex','1 1 180px','important');
 b.style.setProperty('width','auto','important');
 b.style.setProperty('box-shadow','none','important');
});
}
function wire(){document.addEventListener('click',e=>{
 const b=e.target.closest('.quiz-settings .sp-actions > *, .quiz-settings .ce3-actions > *, .quiz-settings [data-mode], .quiz-settings button, .quiz-settings a');
 if(!b)return;
 const t=clean(b.textContent);
 if(/Start practice|ابدأ التدريب|התחל תרגול/i.test(t) && b.id!=='newQuiz'){e.preventDefault();e.stopImmediatePropagation();document.getElementById('newQuiz')?.click();setTimeout(()=>document.querySelector('.section.alt')?.scrollIntoView({behavior:'smooth',block:'start'}),120);return}
 if(/Exam mode|وضع الاختبار|מצב מבחן|Start 15-minute exam/i.test(t)){
  e.preventDefault();e.stopImmediatePropagation();
  const u=new URL('personal-quiz.html',location.href);u.searchParams.set('exam','1');location.href=u.href;
  return;
 }
 if(/^🏆?\s*Challenge|^Challenge|^تحدي|^אתגר/i.test(t)){
  e.preventDefault();e.stopImmediatePropagation();location.href='challenges.html';
 }
},true)}
function ensureExamEntry(){
 const host=document.querySelector('.quiz-settings'); if(!host)return;
 if(document.querySelector('[data-quiz-exam-entry]'))return;
 const box=document.createElement('div');box.dataset.quizExamEntry='1';box.className='student-product';
 box.innerHTML=`<div class="sp-card"><span class="sp-eyebrow">${ui('EXAM MODE','وضع الاختبار','מצב מבחן')}</span><h2>${ui('Exam Practice','تدريب الاختبار','תרגול למבחן')}</h2><p>${ui('20 questions · 15 minutes · No hints. Finish with a score and review.','20 سؤالًا · 15 دقيقة · دون تلميحات. أنهِ الاختبار لتحصل على نتيجة ومراجعة.','20 שאלות · 15 דקות · ללא רמזים. סיימו עם ציון וסקירה.')}</p><div class="sp-actions"><button type="button" class="primary" data-quiz-exam-start>${ui('Start 15-minute exam →','ابدأ اختبار 15 دقيقة ←','התחילו מבחן של 15 דקות ←')}</button></div></div>`;
 host.insertAdjacentElement('afterend',box);
 box.querySelector('[data-quiz-exam-start]').addEventListener('click',()=>{const u=new URL('personal-quiz.html',location.href);u.searchParams.set('exam','1');location.href=u.href});
 styleButtons();
}
function init(){wire();ensureExamEntry();styleButtons();new MutationObserver(()=>{ensureExamEntry();styleButtons()}).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
