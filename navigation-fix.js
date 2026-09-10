(()=>{'use strict';
function fixNavigation(){
  const top=document.querySelector('.topbar'),nav=document.querySelector('.main-nav');
  if(!top||!nav)return;
  const wide=window.innerWidth>=1050;
  top.style.setProperty('display','flex','important');
  top.style.setProperty('align-items','center','important');
  top.style.setProperty('gap',window.innerWidth<=760?'8px':'10px','important');
  top.style.setProperty('padding',window.innerWidth<=760?'8px 12px':'9px 18px','important');
  top.style.setProperty('min-width','0','important');
  top.style.setProperty('width','100%','important');
  top.style.setProperty('box-sizing','border-box','important');
  top.style.setProperty('flex-wrap',wide?'nowrap':'wrap','important');
  const brand=top.querySelector('.brand');
  if(brand){brand.style.setProperty('order','1','important');brand.style.setProperty('flex','0 1 auto','important');brand.style.setProperty('min-width','0','important');brand.style.setProperty('margin-right','auto','important');brand.style.setProperty('overflow','hidden','important');brand.style.setProperty('text-overflow','ellipsis','important');brand.style.setProperty('white-space','nowrap','important')}
  const account=top.querySelector('#accountTopBtn');
  if(account){account.style.setProperty('order','2','important');account.style.setProperty('flex','0 1 auto','important');account.style.setProperty('min-width','0','important');account.style.setProperty('width','auto','important');account.style.setProperty('max-width','min(28vw,260px)','important');account.style.setProperty('overflow','hidden','important');account.style.setProperty('text-overflow','ellipsis','important');account.style.setProperty('white-space','nowrap','important');account.style.setProperty('margin-left','0','important')}
  const logout=top.querySelector('#logoutTopBtn');
  if(logout){logout.style.setProperty('order','3','important');logout.style.setProperty('flex','0 0 auto','important');logout.style.setProperty('margin-left','0','important');logout.style.setProperty('white-space','nowrap','important');logout.style.setProperty('min-width','0','important')}
  nav.style.setProperty('order',wide?'2':'4','important');
  nav.style.setProperty('display','flex','important');
  nav.style.setProperty('flex',wide?'0 1 auto':'1 0 100%','important');
  nav.style.setProperty('width',wide?'auto':'100%','important');
  nav.style.setProperty('min-width','0','important');
  nav.style.setProperty('max-width','100%','important');
  nav.style.setProperty('overflow-x','auto','important');
  nav.style.setProperty('overflow-y','visible','important');
  nav.style.setProperty('gap',window.innerWidth<=760?'4px':'4px','important');
  nav.style.setProperty('padding','2px 0 1px','important');
  nav.style.setProperty('scrollbar-width','none','important');
  nav.style.setProperty('-webkit-overflow-scrolling','touch','important');
  [...nav.querySelectorAll('a,.nav-group')].forEach(el=>{el.style.setProperty('flex','0 0 auto','important');el.style.setProperty('white-space','nowrap','important');el.style.setProperty('min-width','max-content','important')});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fixNavigation,{once:true});else fixNavigation();
addEventListener('resize',fixNavigation,{passive:true});addEventListener('chemistryLanguageChanged',()=>setTimeout(fixNavigation,0));
new MutationObserver(()=>setTimeout(fixNavigation,0)).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(fixNavigation,0);
})();