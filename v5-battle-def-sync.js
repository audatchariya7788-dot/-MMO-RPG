/* MMA : RPG V5 Battle DEF Sync
 * Aligns Battle Damage Breakdown DEF with the exact derived character defense.
 */
(function(){
  'use strict';
  function getCoreDefense(){
    try{
      const raw=localStorage.getItem('mma-rpg-save-v2');
      const s=raw?JSON.parse(raw):null;
      if(!s)return null;
      const eq=s.equipment||{};
      const items=Array.isArray(s.inventory)?s.inventory:[];
      const find=id=>items.find(x=>x.id===id);
      let def=Number(s.hero?.def||0);
      let vit=Number(s.hero?.vit||0);
      ['Head','Armor','Weapon','Accessory','Ring','Boots'].forEach(slot=>{
        const x=find(eq[slot]);
        if(x){def+=Number(x.def||0);vit+=Number(x.vit||0);}
      });
      return Math.max(0,Math.floor(vit*.8+def));
    }catch(e){return null;}
  }
  function sync(){
    const host=document.querySelector('#damageBreakdown');
    if(!host)return;
    const exact=getCoreDefense();
    if(exact===null)return;
    const entries=[...host.querySelectorAll('.stat')];
    const row=entries.find(x=>x.querySelector('span')?.textContent?.trim()==='DEF');
    if(row)row.querySelector('b').textContent=String(exact);
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(sync,900));
  setInterval(sync,300);
  window.MMA_V5_DEF_SYNC={sync};
})();
