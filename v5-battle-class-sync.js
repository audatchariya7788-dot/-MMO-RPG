/* MMA : RPG V5 Battle Class Sync
 * Keeps the Battle hero visual aligned with the current Character class.
 */
(function(){
  'use strict';
  const VERSION='2026-08-26-v5-battlesync2';
  const CLASS_KEY='mma-rpg-class';

  function currentClass(){
    const api=window.MMACharacterSpec;
    const name=localStorage.getItem(CLASS_KEY)||'Warrior';
    return {name, data:api?.CLASSES?.[name] || api?.CLASSES?.Warrior || null};
  }

  function sync(){
    const {name,c}=(()=>{const x=currentClass();return {name:x.name,c:x.data};})();
    if(!c)return;

    // Force the core renderer to rebuild the Battle hero after a class change.
    const heroHost=document.querySelector('#battle .hero-unit');
    if(heroHost){
      const old=heroHost.querySelector('.hero-runtime-battle, .sprite-hero');
      if(old){
        const current=old.querySelector?.('img.hero-runtime')||old;
        const wanted=`assets/${c.asset}?v=${VERSION}`;
        if(current.tagName==='IMG'){
          if(current.getAttribute('src')!==wanted){
            current.setAttribute('src',wanted);
            current.setAttribute('alt',`${c.label} hero`);
          }
        }else if(window.render){
          try{ window.render(); }catch(e){}
        }
      }
      const img=heroHost.querySelector('img.hero-runtime');
      if(img){
        img.src=`assets/${c.asset}?v=${VERSION}`;
        img.alt=`${c.label} hero`;
      }
      const unitName=heroHost.querySelector('.unit-name');
      if(unitName){
        const levelEl=unitName.querySelector('#heroLevel');
        unitName.childNodes[0].textContent=`${c.label} `;
        if(levelEl && !levelEl.textContent) levelEl.textContent='Lv.1';
      }
    }

    // Make the currently equipped/class signature weapon visible in Battle metadata when available.
    const battleRoot=document.querySelector('#battle');
    if(battleRoot){
      battleRoot.dataset.mmaClass=name;
      battleRoot.dataset.mmaWeapon=c.weapon||'';
    }
  }

  let last=localStorage.getItem(CLASS_KEY)||'Warrior';
  const check=()=>{
    const now=localStorage.getItem(CLASS_KEY)||'Warrior';
    if(now!==last){
      last=now;
      setTimeout(()=>{
        try{window.render?.();}catch(e){}
        setTimeout(sync,40);
      },0);
    } else sync();
  };

  setInterval(check,200);
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{try{window.render?.();}catch(e){};sync();},500));
  window.MMA_V5_BATTLE_SYNC={sync};
})();
