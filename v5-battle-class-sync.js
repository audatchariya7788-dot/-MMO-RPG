/* MMA : RPG V5 Battle Class Sync
 * Keeps the Battle hero visual aligned with the current Character class.
 */
(function(){
  'use strict';
  const VERSION='2026-08-26-v5-battlesync';
  function currentClass(){
    const api=window.MMACharacterSpec;
    const name=localStorage.getItem('mma-rpg-class')||'Warrior';
    return api?.CLASSES?.[name] || api?.CLASSES?.Warrior || null;
  }
  function sync(){
    const c=currentClass();
    const host=document.querySelector('#battle .hero-unit .hero-runtime-battle');
    if(!c||!host)return;
    const img=host.querySelector('img.hero-runtime');
    if(!img)return;
    const wanted=`assets/${c.asset}?v=${VERSION}`;
    if(img.getAttribute('src')!==wanted){
      img.setAttribute('src',wanted);
      img.setAttribute('alt',`${c.label} hero`);
    }
    const unitName=document.querySelector('#battle .hero-unit .unit-name');
    if(unitName){
      const level=unitName.querySelector('#heroLevel')?.textContent || '';
      unitName.childNodes[0].textContent=`${c.label} `;
      if(level && unitName.querySelector('#heroLevel')) unitName.querySelector('#heroLevel').textContent=level;
    }
  }
  let last=localStorage.getItem('mma-rpg-class')||'Warrior';
  setInterval(()=>{
    const now=localStorage.getItem('mma-rpg-class')||'Warrior';
    if(now!==last){last=now;setTimeout(sync,30);} else sync();
  },200);
  document.addEventListener('DOMContentLoaded',()=>setTimeout(sync,400));
  window.MMA_V5_BATTLE_SYNC={sync};
})();
