(()=>{'use strict';
function fixNavigation(){
  const top=document.querySelector('.topbar'),nav=document.querySelector('.main-nav');
  if(!top||!nav)return;
  top.style.setProperty('display','grid','important');
  top.style.setProperty('grid-template-columns','minmax(0,1fr) auto auto','important');
  top.style.setProperty('grid-template-rows','auto auto','important');
  top.style.setProperty('align-items','center','important');
  top.style.setProperty('column-gap','10px','important');
  top.style.setProperty('row-gap','6px','important');
  top.style.setProperty('padding','9px 18px','important');
  top.style.setProperty('min-width','0','important');
  top.style.setProperty('width','100%','important');
  top.style.setProperty('box-sizing','border-box','important');
  top.style.setProperty('flex-wrap','nowrap','important');
  const brand=top.querySelector('.brand');
  if(brand){brand.style.setProperty('grid-column','1','important');brand.style.setProperty('grid-row','1','important');brand.style.setProperty('min-width','0','important');brand.style.setProperty('margin-right','0','important');brand.style.setProperty('overflow','hidden','important');brand.style.setProperty('text-overflow','ellipsis','important');brand.style.setProperty('white-space','nowrap','important')}
  const account=top.querySelector('#accountTopBtn');
  if(account){account.style.setProperty('grid-column','2','important');account.style.setProperty('grid-row','1','important');account.style.setProperty('justify-self','end','important');account.style.setProperty('min-width','0','important');account.style.setProperty('width','auto','important');account.style.setProperty('max-width','min(42vw,300px)','important');account.style.setProperty('overflow','hidden','important');account.style.setProperty('text-overflow','ellipsis','important');account.style.setProperty('white-space','nowrap','important');account.style.setProperty('margin-left','0','important')}
  const logout=top.querySelector('#logoutTopBtn');
  if(logout){logout.style.setProperty('grid-column','3','important');logout.style.setProperty('grid-row','1','important');logout.style.setProperty('justify-self','end','important');logout.style.setProperty('margin-left','0','important');logout.style.setProperty('white-space','nowrap','important')}
  nav.style.setProperty('grid-column','1 / -1','important');nav.style.setProperty('grid-row','2','important');nav.style.setProperty('display','flex','important');nav.style.setProperty('width','100%','important');nav.style.setProperty('min-width','0','important');nav.style.setProperty('max-width','100%','important');nav.style.setProperty('flex','none','important');nav.style.setProperty('overflow-x','auto','important');nav.style.setProperty('overflow-y','visible','important');nav.style.setProperty('gap','4px','important');nav.style.setProperty('padding','2px 0 1px','important');nav.style.setProperty('scrollbar-width','none','important');nav.style.setProperty('-webkit-overflow-scrolling','touch','important');
  [...nav.querySelectorAll('a,.nav-group')].forEach(el=>{el.style.setProperty('flex','0 0 auto','important');el.style.setProperty('white-space','nowrap','important');el.style.setProperty('min-width','max-content','important')});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fixNavigation,{once:true});else fixNavigation();
addEventListener('resize',fixNavigation,{passive:true});addEventListener('chemistryLanguageChanged',()=>setTimeout(fixNavigation,0));
new MutationObserver(()=>setTimeout(fixNavigation,0)).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(fixNavigation,0);
})();