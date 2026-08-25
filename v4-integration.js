/* MMA : RPG V4 integration adapter
 * Bridges Loot/Inventory V4 into the existing app.js save contract.
 * Does not create a second game state.
 */
(function(){
  'use strict';
  const SAVE='mma-rpg-save-v2';
  const CATALOG=(window.MMA_LOOT_V4&&window.MMA_LOOT_V4.catalog)||(()=>({}));
  function read(){try{return JSON.parse(localStorage.getItem(SAVE)||'null')}catch(e){return null}}
  function write(s){localStorage.setItem(SAVE,JSON.stringify(s));return s}
  function grant(id,qty=1){
    const item=CATALOG()[id]; if(!item)return false;
    const s=read(); if(!s)return false;
    s.inventory=Array.isArray(s.inventory)?s.inventory:[];
    const row=s.inventory.find(x=>x.id===id);
    if(row){row.qty=(row.qty||1)+qty;} else {s.inventory.push({...item,qty});}
    s.loot=Array.isArray(s.loot)?s.loot:[];
    for(let i=0;i<qty;i++)s.loot.unshift({...item});
    write(s); return true;
  }
  function equip(id){
    const item=CATALOG()[id]; const s=read(); if(!item||!s||!item.slot)return false;
    s.equipment=s.equipment||{};
    const key={head:'Armor',armor:'Armor',weapon:'Weapon',accessory:'Ring',ring:'Ring',boots:'Armor'}[item.slot]||'Weapon';
    s.equipment[key]=id;
    write(s); return true;
  }
  function reload(){if(typeof window.load==='function')return window.load(); if(typeof window.openGame==='function')return window.openGame(); return false}
  function grantTest(){const ids=Object.keys(CATALOG());const id=ids[Math.floor(Math.random()*ids.length)];return grant(id)?(reload(),id):null}
  window.MMA_V4_INTEGRATION={grant,equip,grantTest,reload,read};
  document.addEventListener('DOMContentLoaded',()=>{
    const b=document.getElementById('grantLootBtn');
    if(b)b.addEventListener('click',()=>{const id=grantTest();if(id&&typeof window.openTab==='function')window.openTab('inventory');});
  });
})();
