(()=>{
  const init=()=>{
    const root=document.getElementById('profileContent');
    if(!root || root.dataset.previewStable==='1') return;
    root.dataset.previewStable='1';
    const open=()=>{
      if(document.getElementById('stableAchievementPreview')) return;
      const modal=document.createElement('div');
      modal.id='stableAchievementPreview';
      modal.innerHTML='<div class="stable-preview-backdrop"><div class="stable-preview-card" role="dialog" aria-modal="true" aria-labelledby="stablePreviewTitle"><button type="button" class="stable-preview-close" aria-label="Close">×</button><h2 id="stablePreviewTitle">🏆 Achievement & Certificate Preview</h2><p>This is a preview only. Your real progress is unchanged.</p><div class="stable-achievements"><div>🏅<b> First Quiz ✓</b><small>Complete your first quiz.</small></div><div>🔥<b> 10 in a Row ✓</b><small>Get 10 correct answers consecutively.</small></div><div>⚗️<b> Balancer ✓</b><small>Balance 50 equations.</small></div><div>📚<b> Scholar ✓</b><small>Complete all learning stages.</small></div><div>💯<b> Perfect Score ✓</b><small>Get 100% on a hard quiz.</small></div></div><div class="stable-certificate"><div>CHEMISTRY EQUATIONS</div><h1>Certificate of Achievement</h1><p>This certifies that</p><h2>'+(document.querySelector('.profile-summary h1')?.textContent||'Student')+'</h2><p>has successfully completed the<br><b>Easy • Medium • Hard</b><br>chemistry equation challenges.</p><div class="stable-cert-stats"><span><b>92%</b>Overall score</span><span><b>184</b>Equations solved</span><span><b>August 2026</b>Date</span></div></div></div></div>';
      const style=document.createElement('style');
      style.id='stableAchievementPreviewStyle';
      style.textContent='#stableAchievementPreview .stable-preview-backdrop{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.65);overflow:auto;padding:20px;box-sizing:border-box}#stableAchievementPreview .stable-preview-card{position:relative;max-width:900px;margin:20px auto;padding:28px;background:#fff;color:#111;border-radius:18px;box-shadow:0 20px 70px rgba(0,0,0,.35)}#stableAchievementPreview .stable-preview-close{position:absolute;right:12px;top:8px;border:0;background:none;font-size:34px;cursor:pointer;color:#111;padding:4px 10px}#stableAchievementPreview .stable-achievements{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:20px 0}.stable-achievements div{border:1px solid #dce3ee;border-radius:14px;padding:16px;font-size:25px}.stable-achievements b{font-size:16px}.stable-achievements small{display:block;font-size:13px;margin-top:8px}.stable-certificate{margin-top:20px;padding:38px 25px;text-align:center;border:6px double #b28a36}.stable-certificate>div{letter-spacing:3px;font-weight:700}.stable-certificate h1{font:700 34px Georgia,serif;margin:18px 0}.stable-certificate h2{font:700 30px Georgia,serif}.stable-cert-stats{display:flex;justify-content:center;gap:35px;flex-wrap:wrap;margin-top:25px}.stable-cert-stats span{display:flex;flex-direction:column;gap:4px;font-size:12px}.stable-cert-stats b{font-size:19px}@media(max-width:600px){#stableAchievementPreview .stable-preview-backdrop{padding:6px}#stableAchievementPreview .stable-preview-card{margin:3px auto;padding:22px 14px}.stable-certificate{padding:25px 12px}.stable-certificate h1{font-size:28px}}';
      document.head.appendChild(style);document.body.appendChild(modal);
      const close=()=>{modal.remove();style.remove()};modal.querySelector('.stable-preview-close').onclick=close;modal.querySelector('.stable-preview-backdrop').onclick=e=>{if(e.target===e.currentTarget)close()};
    };
    document.addEventListener('click',e=>{const btn=e.target.closest?.('#previewAchievements');if(btn){e.preventDefault();e.stopImmediatePropagation();open();}},true);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
