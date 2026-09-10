(()=>{'use strict';
function fixNavigation(){
  const top=document.querySelector('.topbar'),nav=document.querySelector('.main-nav');
  if(!top||!nav)return;
  if(window.innerWidth<=1600){
    top.style.setProperty('display','grid','important');top.style.setProperty('grid-template-columns','minmax(0,1fr) auto','important');top.style.setProperty('grid-template-rows','auto auto','important');top.style.setProperty('align-items','center','important');top.style.setProperty('column-gap','12px','important');top.style.setProperty('row-gap','6px','important');top.style.setProperty('padding','9px 18px','important');
    const brand=top.querySelector('.brand');if(brand){brand.style.setProperty('grid-column','1','important');brand.style.setProperty('grid-row','1','important');brand.style.setProperty('min-width','0','important');brand.style.setProperty('margin-right','0','important');brand.style.setProperty('overflow','hidden','important');brand.style.setProperty('text-overflow','ellipsis','important')}
    [...top.querySelectorAll('.account-top,.account-logout-top')].forEach(el=>{el.style.setProperty('grid-column','2','important');el.style.setProperty('grid-row','1','important');el.style.setProperty('justify-self','end','important');el.style.setProperty('min-width','0','important');el.style.setProperty('max-width','min(42vw,320px)','important');el.style.setProperty('overflow','hidden','important');el.style.setProperty('text-overflow','ellipsis','important');el.style.setProperty('white-space','nowrap','important');el.style.setProperty('margin-left','0','important')});
    nav.style.setProperty('grid-column','1 / -1','important');nav.style.setProperty('grid-row','2','important');nav.style.setProperty('display','flex','important');nav.style.setProperty('width','100%','important');nav.style.setProperty('min-width','0','important');nav.style.setProperty('flex','none','important');nav.style.setProperty('overflow-x','auto','important');nav.style.setProperty('overflow-y','visible','important');nav.style.setProperty('gap','4px','important');nav.style.setProperty('padding','2px 0 1px','important');nav.style.setProperty('scrollbar-width','none','important');
    [...nav.querySelectorAll('a,.nav-group')].forEach(el=>{el.style.setProperty('flex','0 0 auto','important');el.style.setProperty('white-space','nowrap','important')});
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fixNavigation,{once:true});else fixNavigation();
addEventListener('resize',fixNavigation,{passive:true});addEventListener('chemistryLanguageChanged',()=>setTimeout(fixNavigation,0));setTimeout(fixNavigation,0);
})();