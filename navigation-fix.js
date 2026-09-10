(()=>{'use strict';
function fixNavigation(){
  const top=document.querySelector('.topbar');
  const nav=document.querySelector('.main-nav');
  if(!top||!nav)return;
  const narrow=window.innerWidth<=1400;
  if(narrow){
    top.style.setProperty('flex-wrap','wrap','important');
    top.style.setProperty('align-items','center','important');
    top.style.setProperty('gap','8px 12px','important');
    top.style.setProperty('padding','9px 18px','important');
    nav.style.setProperty('order','3','important');
    nav.style.setProperty('width','100%','important');
    nav.style.setProperty('flex','1 1 100%','important');
    nav.style.setProperty('min-width','0','important');
    nav.style.setProperty('overflow-x','auto','important');
    nav.style.setProperty('overflow-y','visible','important');
    nav.style.setProperty('gap','4px','important');
    nav.style.setProperty('padding','2px 0 1px','important');
    nav.style.setProperty('scrollbar-width','none','important');
    [...nav.querySelectorAll('a,.nav-group')].forEach(el=>{
      el.style.setProperty('flex','0 0 auto','important');
      el.style.setProperty('white-space','nowrap','important');
    });
    [...top.querySelectorAll('.account-top,.account-logout-top')].forEach(el=>{
      el.style.setProperty('flex','0 0 auto','important');
      el.style.setProperty('max-width','min(38vw,260px)','important');
      el.style.setProperty('overflow','hidden','important');
      el.style.setProperty('text-overflow','ellipsis','important');
      el.style.setProperty('white-space','nowrap','important');
    });
  }else{
    top.style.removeProperty('flex-wrap');
    nav.style.removeProperty('order');
    nav.style.removeProperty('width');
    nav.style.removeProperty('flex');
    nav.style.removeProperty('overflow-x');
    nav.style.removeProperty('padding');
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fixNavigation,{once:true});else fixNavigation();
addEventListener('resize',fixNavigation,{passive:true});
addEventListener('chemistryLanguageChanged',()=>setTimeout(fixNavigation,0));
setTimeout(fixNavigation,0);
})();