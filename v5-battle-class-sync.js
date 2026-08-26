/* MMA : RPG V5 Battle Class Sync
 * Forces the Battle hero visual to use exactly the current Character class asset.
 */
(function(){
  'use strict';
  const VERSION='2026-08-26-v5-battlesync3';
  const CLASS_KEY='mma-rpg-class';

  function current(){
    const name=localStorage.getItem(CLASS_KEY)||'Warrior';
    const api=window.MMACharacterSpec;
    const data=api?.CLASSES?.[name]||api?.CLASSES?.Warrior;
    return {name,data};
  }

  function buildHero(host,data){
    if(!host||!data)return;
    host.querySelectorAll('.sprite-hero,.hero-runtime-battle,.battle-hero,img.hero-runtime').forEach(el=>el.remove());
    const wrap=document.createElement('div');
    wrap.className='hero-runtime-battle battle-class-sync';
    const img=document.createElement('img');
    img.className='hero-runtime battle-hero';
    img.src=`assets/${data.asset}?v=${VERSION}`;
    img.alt=`${data.label} hero`;
    img.draggable=false;
    img.onerror=function(){this.onerror=null;this.src=`assets/hero.svg?v=${VERSION}`;};
    wrap.appendChild(img);
    host.appendChild(wrap);
    const unitName=host.querySelector('.unit-name');
    if(unitName){
      const level=unitName.querySelector('#heroLevel');
      Array.from(unitName.childNodes).forEach(n=>{if(n.nodeType===3)n.remove();});
      unitName.insertBefore(document.createTextNode(`${data.label} `),unitName.firstChild||null);
      if(level) level.textContent=level.textContent||'Lv.1';
    }
  }

  function sync(){
    const {name,data}=current();
    if(!data)return;
    const host=document.querySelector('#battle .hero-unit');
    if(host){
      buildHero(host,data);
      const battle=document.querySelector('#battle');
      if(battle){
        battle.dataset.mmaClass=name;
        battle.dataset.mmaWeapon=data.weapon||'';
      }
    }
  }

  function patchRender(){
    if(typeof window.render!=='function' || window.render.__mmaV5BattlePatched)return;
    const original=window.render;
    function wrapped(){
      const out=original.apply(this,arguments);
      setTimeout(sync,0);
      return out;
    }
    wrapped.__mmaV5BattlePatched=true;
    window.render=wrapped;
  }

  document.addEventListener('DOMContentLoaded',()=>{
    patchRender();
    setTimeout(sync,250);
    setTimeout(sync,1000);
  });

  let last=localStorage.getItem(CLASS_KEY)||'Warrior';
  setInterval(()=>{
    patchRender();
    const now=localStorage.getItem(CLASS_KEY)||'Warrior';
    if(now!==last){last=now;setTimeout(sync,20);setTimeout(sync,120);}
  },200);

  window.MMA_V5_BATTLE_SYNC={sync,patchRender};
})();
