/* MMA : RPG V4 Runtime Layer
 * Adds the missing equipment-slot contract and hardens Save/Load without owning core state.
 * Core gameplay remains in app.js; this layer synchronizes persisted state through the public API.
 */
(() => {
  'use strict';
  const SAVE_KEY = 'mma-rpg-save-v2';
  const VERSION = '2026-08-26-v4-runtime3';
  const SLOT_BY_ITEM = {
    'Steel Helm':'Head','Leather Hood':'Head','Knight Armor':'Armor','Leather Armor':'Armor',
    'Ruby Ring':'Ring','Adventurer Boots':'Boots','Hunter Cape':'Accessory',
    'Long Sword':'Weapon','Hunter Bow':'Weapon','Arcane Staff':'Weapon','Twin Blades':'Weapon'
  };
  const REQUIRED_ITEMS = [
    {id:'steel_helm',name:'Steel Helm',type:'Armor',slot:'Head',rarity:'Common',def:6,vit:2,icon:'armor'},
    {id:'hunter_cape',name:'Hunter Cape',type:'Armor',slot:'Accessory',rarity:'Rare',def:4,agi:3,crit:1,icon:'armor'},
    {id:'adventurer_boots_v4',name:'Adventurer Boots',type:'Armor',slot:'Boots',rarity:'Common',def:5,agi:3,icon:'armor'}
  ];
  const getSave=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch(_){return null}};
  const putSave=s=>localStorage.setItem(SAVE_KEY,JSON.stringify(s));
  function ensureContract(){
    const s=getSave(); if(!s||!s.equipment||!Array.isArray(s.inventory))return false;
    ['Head','Armor','Weapon','Accessory','Ring','Boots'].forEach(slot=>{if(!(slot in s.equipment))s.equipment[slot]=null});
    REQUIRED_ITEMS.forEach(item=>{if(!s.inventory.some(x=>x.id===item.id))s.inventory.push({...item})});
    putSave(s); return true;
  }
  function equipV4(id){
    const s=getSave();
    if(!s)return typeof window.equipCore==='function'?window.equipCore(id):false;
    const item=s.inventory?.find(x=>x.id===id); if(!item||item.type==='Consumable')return false;
    const slot=item.slot||SLOT_BY_ITEM[item.name]||(item.type==='Weapon'?'Weapon':item.type==='Ring'?'Ring':'Armor');
    s.equipment=s.equipment||{};
    ['Head','Armor','Weapon','Accessory','Ring','Boots'].forEach(x=>{if(!(x in s.equipment))s.equipment[x]=null});
    s.equipment[slot]=id; putSave(s);
    if(typeof window.equipCore==='function') window.equipCore(id);
    if(typeof window.render==='function') window.render();
    window.dispatchEvent(new CustomEvent('mma:equipment-changed',{detail:{id,slot,item}}));
    return true;
  }
  function unequipV4(slot){
    const s=getSave(); if(!s)return false;
    s.equipment=s.equipment||{}; s.equipment[slot]=null; putSave(s);
    if(typeof window.unequipCore==='function')window.unequipCore(slot);
    if(typeof window.render==='function')window.render();
    window.dispatchEvent(new CustomEvent('mma:equipment-changed',{detail:{slot,id:null}}));
    return true;
  }
  function validateSave(){
    const s=getSave(),r={version:VERSION,valid:true,errors:[]};
    if(!s){r.valid=false;r.errors.push('No save exists');return r;}
    if(!s.hero||!s.inventory||!s.equipment){r.valid=false;r.errors.push('Missing hero/inventory/equipment');}
    if(s.equipment&&['Head','Armor','Weapon','Accessory','Ring','Boots'].some(x=>!(x in s.equipment))){r.valid=false;r.errors.push('Equipment slot contract incomplete');}
    return r;
  }
  function harden(){
    ensureContract();
    const originalEquip=window.equip;
    if(originalEquip&&!window.equipCore)window.equipCore=originalEquip;
    if(originalEquip&&!originalEquip.__v4wrapped){const wrapped=equipV4;wrapped.__v4wrapped=true;window.equip=wrapped;}
    const originalUnequip=window.unequip;
    if(originalUnequip&&!window.unequipCore)window.unequipCore=originalUnequip;
    if(originalUnequip&&!originalUnequip.__v4wrapped){const wrapped=unequipV4;wrapped.__v4wrapped=true;window.unequip=wrapped;}
    window.MMARuntimeLayer={version:VERSION,ensureContract,validateSave,equip:equipV4,unequip:unequipV4};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(harden,900));else setTimeout(harden,900);
})();
