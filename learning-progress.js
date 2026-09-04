(()=>{
'use strict';
const KEY='chemistryLearningProgressV1';
const CONFIG={
  'beginner-lessons.html':{n:1,label:['Beginner','المبتدئ','מתחילים'],next:'intermediate-lessons.html',nextLabel:['Continue to Intermediate','تابع إلى المستوى المتوسط','המשיכו לביניים']},
  'intermediate-lessons.html':{n:2,label:['Intermediate','المتوسط','ביניים'],next:'advanced-lessons.html',nextLabel:['Continue to Advanced','تابع إلى المستوى المتقدم','המשיכו למתקדם']},
  'advanced-lessons.html':{n:3,label:['Advanced','المتقدم','מתקדם'],next:'personal-quiz.html?stage=hard',nextLabel:['Take the Advanced Quiz','اختبر نفسك في الاختبار المتقدم','בחנו את עצמכם בחידון המתקדם']}
};
const tr=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}};
const save=s=>{try{localStorage.setItem(KEY,JSON.stringify(s))}catch{}};
const page=(location.pathname.split('/').pop()||'learn.html').toLowerCase();
const current=CONFIG[page];
if(current){
  const nav=document.getElementById('lesson-navigation');
  const next=nav?.querySelector('.lesson-nav-next');
  if(next&&!next.dataset.progressBound){
    next.dataset.progressBound='1';
    next.addEventListener('click',()=>{const p=read();p.completed=Math.max(Number(p.completed)||0,current.n);save(p)});
  }
  const s=read();
  if((Number(s.completed)||0)>=current.n){
    const progress=document.querySelector('.lesson-progress');
    if(progress&&!progress.querySelector('.lesson-complete')){
      const done=document.createElement('span');
      done.className='lesson-complete';
      done.textContent=tr('✓ Completed','✓ مكتمل','✓ הושלם');
      done.style.cssText='display:inline-block;margin-top:7px;font-size:12px;font-weight:800;color:var(--accent)';
      progress.appendChild(done);
    }
  }
}
if(page==='learn.html'||page==='index.html'||page===''){
  if(document.getElementById('learning-continue'))return;
  const main=document.querySelector('main');
  if(!main)return;
  const s=read();
  const completed=Math.max(0,Math.min(3,Number(s.completed)||0));
  const nextIndex=completed+1;
  const paths=[
    ['Beginner','المبتدئ','מתחילים','beginner-lessons.html'],
    ['Intermediate','المتوسط','ביניים','intermediate-lessons.html'],
    ['Advanced','المتقدم','מתקדם','advanced-lessons.html']
  ];
  const p=paths[Math.min(2,nextIndex-1)];
  const section=document.createElement('section');
  section.id='learning-continue';
  section.className='section';
  section.innerHTML=`<div class="card" style="border:1px solid var(--line);border-radius:18px;padding:20px;background:var(--surface);box-shadow:var(--shadow)"><span class="eyebrow">${tr('YOUR LEARNING PROGRESS','تقدّمك في التعلّم','התקדמות הלמידה שלכם')}</span><h2 style="margin:6px 0">${completed===3?tr('Learning path complete','أكملت مسار التعلّم','מסלול הלמידה הושלם'):tr('Continue learning','تابع التعلّم','המשיכו ללמוד')}</h2><p style="margin:0 0 14px;color:var(--muted)">${completed===3?tr('You completed all three lesson paths. Test yourself with the Advanced Quiz.','أكملت مسارات الدروس الثلاثة. اختبر نفسك في الاختبار المتقدم.','השלמתם את שלושת מסלולי השיעורים. בחנו את עצמכם בחידון המתקדם.'):tr(`Next: ${p[0]} lessons · ${completed} of 3 paths completed`,`التالي: دروس ${p[1]} · أكملت ${completed} من 3 مسارات`,`הבא: שיעורי ${p[2]} · השלמתם ${completed} מתוך 3 מסלולים`)}</p><a class="primary" href="${completed===3?'personal-quiz.html?stage=hard':p[3]}">${completed===3?tr('Take the Advanced Quiz','اختبر نفسك في الاختبار المتقدم','בחנו את עצמכם בחידון המתקדם'):tr('Continue →','متابعة ←','המשיכו ←')}</a></div>`;
  const title=main.querySelector('.hero')||main.querySelector('.page-title');
  if(title)title.insertAdjacentElement('afterend',section);else main.prepend(section);
}
})();
