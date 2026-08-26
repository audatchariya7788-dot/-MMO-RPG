/* MMA : RPG V5 Equipment Sync Bridge
 * Keeps Character V3 class changes and the core equipment/stat runtime on one source of truth.
 */
(function(){
  'use strict';
  const slots=['Head','Armor','Weapon','Accessory','Ring','Boots'];

  function coreSwitch(name){
    const api=window.MMACharacterSpec;
    if(api?.switchClass){ api.switchClass(name); return true; }
    return false;
  }

  function syncPaperDoll(){
    const host=document.querySelector('#equipment .paperdoll');
    if(!host) return;
    const src=document.querySelector('#characterView .hero-runtime')?.getAttribute('src')
      || (window.MMACharacterV3?.heroData ? null : null);
    if(!src) return;
    const img=host.querySelector('.hero-runtime');
    if(img && img.getAttribute('src')===src) return;
    const label=host.querySelector('b')?.outerHTML || '<b>Paper Doll</b>';
    host.innerHTML=`<img class="hero-runtime equipment-paperdoll-hero" src="${src}" alt="Equipped hero" draggable="false">${label}`;
  }

  function syncSlots(){
    const root=document.querySelector('#equipmentView');
    if(!root) return;
    root.dataset.syncVersion='v5';
  }

  document.addEventListener('click',function(ev){
    const card=ev.target.closest?.('.cv3-class[data-c]');
    if(!card) return;
    const name=card.dataset.c;
    if(!name) return;
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();
    coreSwitch(name);
    setTimeout(()=>{syncPaperDoll();syncSlots();},0);
  },true);

  const mo=new MutationObserver(()=>{
    syncPaperDoll();
    syncSlots();
  });
  document.addEventListener('DOMContentLoaded',()=>{
    const target=document.querySelector('#game')||document.body;
    mo.observe(target,{childList:true,subtree:true});
    setTimeout(()=>{syncPaperDoll();syncSlots();},150);
  });

  window.MMA_V5_EQUIPMENT_SYNC={syncPaperDoll,syncSlots,coreSwitch,slots};
})();
