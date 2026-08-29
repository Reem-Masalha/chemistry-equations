(()=>{'use strict';
const $=id=>document.getElementById(id);
const ui=(en,ar,he)=>{const l=localStorage.getItem('chemistryLanguage')||'en';return l==='ar'?ar:l==='he'?he:en};
function currentUser(){try{return JSON.parse(localStorage.getItem('chemistryCurrentUser')||'null')}catch{return null}}
function readStats(){const u=currentUser();const key='chemistryQuizStats:'+(u?.id||u?.username||'guest');try{return JSON.parse(localStorage.getItem(key)||'{"sessions":0,"correct":0,"answered":0,"best":0}')}catch{return{sessions:0,correct:0,answered:0,best:0}}}
function render(){const box=$('quizStats');if(!box)return;const s=readStats();const answered=Number(s.answered||0),correct=Number(s.correct||0);const accuracy=answered?Math.round(correct/answered*100):0;box.innerHTML=`<div class="progress-stat"><b>${s.sessions||0}</b><span>${ui('Sessions','الجلسات','סבבים')}</span></div><div class="progress-stat"><b>${answered}</b><span>${ui('Questions','الأسئلة','שאלות')}</span></div><div class="progress-stat"><b>${correct}</b><span>${ui('Correct','صحيح','נכון')}</span></div><div class="progress-stat"><b>${accuracy}%</b><span>${ui('Accuracy','الدقة','דיוק')}</span></div><div class="progress-stat"><b>${s.best||0}</b><span>${ui('Best score','أفضل نتيجة','שיא')}</span></div>`}
function start(){render();setInterval(render,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();