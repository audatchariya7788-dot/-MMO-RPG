/* MMA : RPG V5 Battle DEF Sync
 * Keeps Battle Hero DEF aligned with the live Equipment-derived DEF.
 */
(function(){
  'use strict';

  function getLiveDefense(){
    const equipHost=document.querySelector('#equipStats');
    if(equipHost){
      const row=[...equipHost.querySelectorAll('.stat')].find(x=>x.querySelector('span')?.textContent?.trim()==='DEF');
      const value=row?.querySelector('b')?.textContent?.trim();
      if(value && /^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
    }

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
    const exact=getLiveDefense();
    if(exact===null)return;

    const rows=[...host.querySelectorAll('.stat')];
    const monster=rows.find(x=>x.querySelector('span')?.textContent?.trim()==='Monster DEF');
    if(!monster)return;

    let hero=rows.find(x=>x.dataset.mmaHeroDef==='1');
    if(!hero){
      hero=document.createElement('div');
      hero.className='stat';
      hero.dataset.mmaHeroDef='1';
      hero.innerHTML='<span>Hero DEF</span><b></b>';
      monster.insertAdjacentElement('afterend',hero);
    }
    const b=hero.querySelector('b');
    if(b)b.textContent=String(exact);
  }

  document.addEventListener('DOMContentLoaded',()=>setTimeout(sync,900));
  setInterval(sync,300);
  window.MMA_V5_DEF_SYNC={sync};
})();
