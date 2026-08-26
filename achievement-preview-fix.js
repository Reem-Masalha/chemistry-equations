(()=>{
  function init(){
    const btn=document.getElementById('previewAchievements');
    if(!btn)return;

    btn.style.pointerEvents='auto';
    btn.disabled=false;

    const showPreview=()=>{
      const real=document.getElementById('realProfile');
      const note=document.getElementById('previewNote');
      const level=document.getElementById('level');
      const q=document.getElementById('statQuizzes');
      const questions=document.getElementById('statQuestions');
      const correct=document.getElementById('statCorrect');
      const accuracy=document.getElementById('statAccuracy');
      const best=document.getElementById('statBest');
      const hard=document.getElementById('statHard');
      const stages=document.getElementById('stages');
      const achievements=document.getElementById('achievements');
      const recent=document.getElementById('recentQuizzes');
      const weak=document.getElementById('weakAreas');
      const cert=document.getElementById('certificateArea');
      if(!real||!note||!level)return;

      btn.style.display='none';
      real.style.display='inline-block';
      note.textContent='Preview mode is ON. Your real progress is unchanged.';
      document.body.classList.add('preview-mode');

      if(q)q.textContent='37';
      if(questions)questions.textContent='370';
      if(correct)correct.textContent='326';
      if(accuracy)accuracy.textContent='88.1%';
      if(best)best.textContent='10/10';
      if(hard)hard.textContent='42';
      level.textContent='⭐ Level 8';

      if(stages)stages.innerHTML=['Easy','Medium','Hard'].map(x=>`<span class="stage-pill">✓${x}</span>`).join(' ');

      if(achievements){
        const items=[
          ['🏅','First Quiz','Complete your first quiz.'],
          ['🔥','10 in a Row','Get 10 correct answers consecutively.'],
          ['⚗️','Balancer','Balance 50 equations.'],
          ['📚','Scholar','Complete all learning stages.'],
          ['💯','Perfect Score','Get 100% on a hard quiz.']
        ];
        achievements.innerHTML=items.map(x=>`<div class="achievement earned"><div class="achievement-icon">${x[0]}</div><h3>${x[1]} ✓</h3><p>${x[2]}</p></div>`).join('');
      }

      if(recent)recent.innerHTML=[['Hard','10/10'],['Medium','9/10'],['Easy','10/10'],['Hard','8/10']].map(x=>`<div class="recent-quiz"><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');
      if(weak)weak.innerHTML='<div class="weak"><span>Stoichiometry</span><b>6 misses</b></div><div class="weak"><span>Redox equations</span><b>3 misses</b></div>';

      if(cert){
        cert.innerHTML=`<div class="certificate" id="achievementPreviewCertificate"><div class="cert-brand">CHEMISTRY EQUATIONS</div><div class="cert-title">Certificate of Achievement</div><div class="cert-subtitle">This certifies that</div><div class="cert-name">Preview User</div><p>has successfully completed the<br><b>Easy • Medium • Hard</b><br>chemistry equation challenges.</p><div class="cert-stats"><div class="cert-stat"><b>92%</b><span>Overall score</span></div><div class="cert-stat"><b>184</b><span>Equations solved</span></div><div class="cert-stat"><b>August 2026</b><span>Date</span></div></div><div class="cert-number">Preview certificate</div><div class="certificate-actions"><button id="previewPrintCertificate" class="primary" type="button">Print Certificate</button></div></div>`;
        const print=document.getElementById('previewPrintCertificate');
        if(print)print.onclick=()=>window.print();
      }
    };

    btn.addEventListener('click',showPreview,true);

    const real=document.getElementById('realProfile');
    if(real){
      real.addEventListener('click',()=>{
        location.reload();
      },true);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
