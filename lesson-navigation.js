(()=>{
'use strict';
const ui=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const config={
  'beginner-lessons.html':{n:1,prev:null,next:'intermediate-lessons.html',nextLabel:['Intermediate lessons','دروس المستوى المتوسط','שיעורי ביניים']},
  'intermediate-lessons.html':{n:2,prev:'beginner-lessons.html',prevLabel:['Beginner lessons','دروس المبتدئين','שיעורי מתחילים'],next:'advanced-lessons.html',nextLabel:['Advanced lessons','دروس المستوى المتقدم','שיעורי מתقدم']},
  'advanced-lessons.html':{n:3,prev:'intermediate-lessons.html',prevLabel:['Intermediate lessons','دروس المستوى المتوسط','שיעורי ביניים'],next:'personal-quiz.html?stage=hard',nextLabel:['Test yourself with the Advanced Quiz','اختبر نفسك في الاختبار المتقدم','اختبروا أنفسكم في الحידון المتقدم']}
};
const page=(location.pathname.split('/').pop()||'beginner-lessons.html').toLowerCase();
const c=config[page];
if(!c||document.getElementById('lesson-navigation'))return;
const style=document.createElement('style');
style.id='lesson-navigation-style';
style.textContent=`#lesson-navigation{margin:0 0 28px}#lesson-navigation .lesson-nav-card{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:18px 20px;border:1px solid var(--line);border-radius:16px;background:var(--surface,#fff)}#lesson-navigation .lesson-progress{min-width:120px}.lesson-progress strong{display:block;font-size:13px}.lesson-progress span{display:block;margin-top:3px;color:var(--muted);font-size:12px}#lesson-navigation .lesson-nav-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}#lesson-navigation a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:10px 15px;border-radius:10px;text-decoration:none;font-weight:700;border:1px solid var(--line);box-sizing:border-box}.lesson-nav-next{background:var(--accent);border-color:var(--accent)!important;color:#fff}.lesson-nav-prev{background:var(--surface,#fff);color:var(--text)}@media(max-width:620px){#lesson-navigation .lesson-nav-card{align-items:stretch;flex-direction:column}#lesson-navigation .lesson-nav-actions{justify-content:stretch}#lesson-navigation a{width:100%}}`;
document.head.appendChild(style);
const l=document.documentElement.lang==='ar'?'ar':document.documentElement.lang==='he'?'he':'en';
const progress=ui(`Lesson ${c.n} of 3`,`الدرس ${c.n} من 3`,`שיעור ${c.n} מתוך 3`);
const back=c.prev?ui('← '+c.prevLabel[0],'← '+c.prevLabel[1],'← '+c.prevLabel[2]):null;
const next=ui('Next: '+c.nextLabel[0], 'التالي: '+c.nextLabel[1], 'הבא: '+c.nextLabel[2]);
const wrap=document.createElement('section');
wrap.id='lesson-navigation';
wrap.className='section';
wrap.innerHTML=`<div class="lesson-nav-card"><div class="lesson-progress"><strong>${ui('Learning path','مسار التعلّم','מסלול הלמידה')}</strong><span>${progress}</span></div><div class="lesson-nav-actions">${c.prev?`<a class="lesson-nav-prev" href="${c.prev}">${back}</a>`:''}<a class="lesson-nav-next" href="${c.next}">${next} →</a></div></div>`;
const main=document.querySelector('main');
if(main){const last=main.querySelector('.section:last-of-type');if(last)last.insertAdjacentElement('afterend',wrap);else main.appendChild(wrap)}
})();
