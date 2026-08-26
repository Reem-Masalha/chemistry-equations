(()=>{
const SESSION='chemistryCurrentUser';
const HISTORY='chemistryQuizHistory';

function currentUser(){
  try{
    return JSON.parse(
      localStorage.getItem(SESSION)||
      sessionStorage.getItem(SESSION)||
      'null'
    );
  }catch{return null;}
}

function history(){
  try{
    const value=JSON.parse(localStorage.getItem(HISTORY)||'[]');
    return Array.isArray(value)?value:[];
  }catch{return [];}
}

function stageName(value){
  const s=String(value??'').trim().toLowerCase();
  if(s==='1'||s==='stage1'||s==='stage-1'||s==='easy')return 'Easy';
  if(s==='2'||s==='stage2'||s==='stage-2'||s==='medium')return 'Medium';
  if(s==='3'||s==='stage3'||s==='stage-3'||s==='hard')return 'Hard';
  return s ? String(value).trim() : '';
}

function fix(){
  if(!currentUser()?.token)return;

  const records=history();
  const quizzes=records.length;
  const questions=records.reduce((n,x)=>n+(Number(x.total)||0),0);
  const correct=records.reduce((n,x)=>n+(Number(x.score)||0),0);
  const accuracy=questions?((correct/questions)*100).toFixed(1):'0.0';

  let best='—';
  let bestRatio=-1;
  for(const x of records){
    const total=Number(x.total)||0;
    const score=Number(x.score)||0;
    if(total>0){
      const ratio=score/total;
      if(ratio>bestRatio){
        bestRatio=ratio;
        best=score+'/'+total;
      }
    }
  }

  const hard=records.filter(x=>stageName(x.stage)==='Hard').length;

  const values={
    statQuizzes:quizzes,
    statQuestions:questions,
    statCorrect:correct,
    statAccuracy:accuracy+'%',
    statBest:best,
    statHard:hard
  };

  for(const [id,value] of Object.entries(values)){
    const node=document.getElementById(id);
    if(node)node.textContent=value;
  }

  const order=['Easy','Medium','Hard'];
  const stages=[...new Set(
    records.map(x=>stageName(x.stage)).filter(Boolean)
  )].sort((a,b)=>{
    const ai=order.indexOf(a),bi=order.indexOf(b);
    if(ai===-1&&bi===-1)return a.localeCompare(b);
    if(ai===-1)return 1;
    if(bi===-1)return -1;
    return ai-bi;
  });

  const stagesNode=document.getElementById('stages');
  if(stagesNode){
    stagesNode.innerHTML=stages.length
      ? stages.map(x=>'<span class="stage-pill">✓'+x+'</span>').join(' ')
      : '<span class="muted">No completed stages yet.</span>';
  }

  const recentNode=document.getElementById('recentQuizzes');
  if(recentNode){
    recentNode.innerHTML=records.slice().reverse().slice(0,5).map(x=>
      '<div class="recent-quiz"><span>'+stageName(x.stage||'Quiz')+'</span><b>'+String(x.score??0)+'/'+String(x.total??0)+'</b></div>'
    ).join('') || '<p class="muted">No quizzes yet.</p>';
  }
}

let tries=0;
const run=()=>{
  tries++;
  fix();
  if(tries<40)setTimeout(run,500);
};

run();
})();
