(()=>{'use strict';
const SESSION='chemistryCurrentUser';
const API=window.CHEMISTRY_API_WORKER||'https://chemistry-equations-api.reemkhmasalha.workers.dev';
const getUser=()=>{try{return JSON.parse(localStorage.getItem(SESSION)||sessionStorage.getItem(SESSION)||'null')}catch{return null}};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const update=rows=>{
 const hard=rows.filter(x=>String(x?.stage||'').toLowerCase()==='hard'&&Number(x?.total)>0);
 const perfect=hard.some(x=>Number(x.score)===Number(x.total));
 const cards=[...document.querySelectorAll('#achievements .achievement')];
 const card=cards.find(x=>/Perfect Score/i.test(x.querySelector('h3')?.textContent||''));
 if(!card)return false;
 card.classList.toggle('earned',perfect);card.classList.toggle('locked',!perfect);
 const h=card.querySelector('h3'),small=card.querySelector('small');
 if(h)h.innerHTML='💯 Perfect Score '+(perfect?'✓':'🔒');
 if(small)small.textContent=perfect?'Unlocked':'Get 100% on a hard quiz';
 const next=document.getElementById('nextAchievement');
 if(next){
  const locked=cards.find(x=>x.classList.contains('locked'));
  if(locked){const title=(locked.querySelector('h3')?.textContent||'').replace(/[🔒✓]/g,'').trim();const progress=locked.querySelector('small')?.textContent||'';next.innerHTML='<div class="progress-row"><b>Next achievement: '+esc(title)+'</b><small class="empty-progress">'+esc(progress)+'</small></div>'}
  else next.innerHTML='<div class="progress-row"><b>🎉 All current achievements unlocked!</b></div>';
 }
 return true;
};
const run=()=>{const u=getUser();if(!u?.token||!u?.id)return;fetch(API+'/api/scores?userId='+encodeURIComponent(u.id),{headers:{authorization:'Bearer '+u.token}}).then(r=>r.ok?r.json():null).then(d=>update(Array.isArray(d?.scores)?d.scores:[])).catch(()=>{})};
let tries=0;const wait=()=>{if(update([])||tries++>30){run();return}setTimeout(wait,100)};setTimeout(wait,120);
})();