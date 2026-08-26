/* MMA : RPG V5 Equipment Click Fix
 * Normalizes Inventory -> Equip button behavior and forces an immediate UI refresh.
 */
(function(){
  'use strict';
  function equipFromButton(button){
    const raw=button.getAttribute('onclick')||'';
    const m=raw.match(/equip\((['"])([^'"]+)\1\)/);
    if(!m)return false;
    const id=m[2];
    try{
      if(window.MMARuntimeLayer?.equip) window.MMARuntimeLayer.equip(id);
      else if(window.equip) window.equip(id);
      else return false;
      setTimeout(()=>{window.render?.();},50);
      return true;
    }catch(err){
      console.error('[MMA V5 Equipment]',err);
      return false;
    }
  }
  document.addEventListener('click',function(ev){
    const btn=ev.target.closest?.('#inventoryView button');
    if(!btn || btn.textContent.trim()!=='Equip')return;
    if(equipFromButton(btn)){
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();
    }
  },true);
  window.MMA_V5_EQUIPMENT_CLICK_FIX={equipFromButton};
})();
