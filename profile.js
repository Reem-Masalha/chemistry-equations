(()=>{
  const SESSION='chemistryCurrentUser';
  const HISTORY='chemistryQuizHistory';
  const BALANCER='chemistryBalancerSolved';
  const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
  const el=document.getElementById('profileContent'); if(!el)return;
  const current=()=>{try{return JSON.parse(localStorage.getItem(SESSION)||sessionStorage.getItem(SESSION)||'null')}catch{return null}};
  const history=()=>{try{return JSON.parse(localStorage.getItem(HISTORY)||'[]')}catch{return[]}};
  const a=current();
  if(!a){el.innerHTML='<h2>Please sign in</h2><p>Sign in to view your profile, achievements and saved quiz progress.</p><button id="profileSignIn" class="primary">Sign in</button>';document.getElementById('profileSignIn').onclick=()=>document.getElementById('accountTopBtn').click();return;}
  el.innerHTML=`<div class="profile-head"><div class="profile-avatar">${escapeHtml((a.name||a.username).charAt(0).toUpperCase())}</div><div><h2>${escapeHtml(a.name||a.username)}</h2><p>@${escapeHtml(a.username)}</p></div></div><div class="profile-stats"><div><b id="scoreCount">—</b><span>Quizzes</span></div><div><b id="bestScore">—</b><span>Best score</span></div><div><b id="avgScore">—</b><span>Average</span></div><div><b id="equationsSolved">${Number(localStorage.getItem(BALANCER)||0)}</b><span>Equations solved</span></div></div><h2>Achievements</h2><div id="achievements" class="achievements"></div><div id="certificateArea"></div><h3>Saved quiz scores</h3><div id="scoreList">Loading…</div><button id="profileSignOut" class="secondary">Sign out</button>`;
  document.getElementById('profileSignOut').onclick=()=>{localStorage.removeItem(SESSION);sessionStorage.removeItem(SESSION);location.href='learn.html';};
  fetch(API+'/api/scores?userId='+encodeURIComponent(a.id)).then(r=>r.json()).then(d=>{const scores=d.scores||[];const h=history();document.getElementById('scoreCount').textContent=scores.length;const vals=scores.map(x=>x.total?Number(x.score)/Number(x.total):0);document.getElementById('bestScore').textContent=vals.length?Math.round(Math.max(...vals)*100)+'%':'—';document.getElementById('avgScore').textContent=vals.length?Math.round(vals.reduce((x,y)=>x+y,0)/vals.length*100)+'%':'—';document.getElementById('scoreList').innerHTML=scores.length?scores.map(x=>'<div class="score-row"><span>'+escapeHtml(String(x.stage||'Quiz'))+'</span><b>'+escapeHtml(String(x.score))+'/'+escapeHtml(String(x.total))+'</b></div>').join(''):'<p>No saved quiz scores yet.</p>';renderAchievements(scores,h);}).catch(()=>{document.getElementById('scoreList').textContent='Could not load saved scores.';renderAchievements([],history())});
  function renderAchievements(scores,h){
    const attempts=h.length;
    const stages=new Set(scores.map(x=>String(x.stage||'').toLowerCase()));
    const hardPerfect=scores.some(x=>String(x.stage||'').toLowerCase()==='hard'&&Number(x.total)>0&&Number(x.score)===Number(x.total));
    let streak=0,bestStreak=0;const answers=h.flatMap(x=>(x.questions||[]).map(q=>!!q.correct));answers.forEach(ok=>{streak=ok?streak+1:0;bestStreak=Math.max(bestStreak,streak)});
    const balancerSolved=Math.max(0,Number(localStorage.getItem(BALANCER)||0));
    const earned=[attempts>0,bestStreak>=10,balancerSolved>=50,stages.has('easy')&&stages.has('medium')&&stages.has('hard'),hardPerfect];
    const items=[
      ['🏅','First Quiz','Complete your first quiz.'],
      ['🔥','10 in a Row','Get 10 correct answers consecutively.'],
      ['⚗️','Balancer','Balance 50 equations.'],
      ['📚','Scholar','Complete all Easy, Medium and Hard quiz stages.'],
      ['💯','Perfect Score','Get 100% on a Hard quiz.']
    ];
    document.getElementById('achievements').innerHTML=items.map((x,i)=>`<div class="achievement ${earned[i]?'earned':'locked'}"><div class="achievement-icon">${x[0]}</div><h3>${x[1]} ${earned[i]?'✓':'🔒'}</h3><p>${x[2]}</p></div>`).join('');
    const scholar=earned[3];
    if(scholar){
      const totalQ=scores.reduce((n,x)=>n+Number(x.total||0),0),points=scores.reduce((n,x)=>n+Number(x.score||0),0),overall=totalQ?Math.round(points/totalQ*100):0;
      const certNo=certificateNumber(a.id);
      const date=new Date().toLocaleDateString(undefined,{month:'long',year:'numeric'});
      document.getElementById('certificateArea').innerHTML=`<div class="certificate" id="certificate"><div class="eyebrow">CHEMISTRY EQUATIONS</div><div class="cert-title">Certificate of Achievement</div><p>This certifies that</p><div class="cert-name">${escapeHtml(a.username||a.name)}</div><p>has successfully completed the<br><b>Easy • Medium • Hard</b><br>chemistry equation challenges.</p><p><b>Overall score:</b> ${overall}%<br><b>Equations solved:</b> ${balancerSolved}<br><b>Date:</b> ${date}</p><p class="cert-number">Certificate No. ${certNo}</p><div class="certificate-actions"><button id="downloadCertificate" class="primary" type="button">Download PDF</button><button id="printCertificate" class="secondary" type="button">Print Certificate</button></div></div>`;
      document.getElementById('downloadCertificate').onclick=()=>window.print();
      document.getElementById('printCertificate').onclick=()=>window.print();
    }else document.getElementById('certificateArea').innerHTML='<div class="certificate locked"><h2>Major achievement: Certificate</h2><p>Complete at least one quiz in Easy, Medium and Hard to unlock your certificate.</p></div>';
  }
  function certificateNumber(id){let s=String(id||'certificate'),n=2166136261;for(let i=0;i<s.length;i++){n^=s.charCodeAt(i);n=Math.imul(n,16777619)}return 'CE-'+(n>>>0).toString(16).toUpperCase().padStart(8,'0');}
  function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
})();