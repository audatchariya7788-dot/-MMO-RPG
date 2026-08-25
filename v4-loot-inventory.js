/* MMA : RPG V4 Loot + Inventory bridge */
(function(){
  const KEY='mma-rpg-loot-v4';
  const ITEMS={
    'LOOT-SLIME-CORE':{id:'LOOT-SLIME-CORE',name:'Slime Core',type:'Material',rarity:'Common',value:12},
    'LOOT-GOBLIN-BLADE':{id:'LOOT-GOBLIN-BLADE',name:'Goblin Blade',type:'Weapon',slot:'weapon',rarity:'Uncommon',atk:8,value:60},
    'LOOT-HUNTER-BOW':{id:'LOOT-HUNTER-BOW',name:'Hunter Bow',type:'Weapon',slot:'weapon',rarity:'Rare',atk:14,agi:4,value:140},
    'LOOT-ARCANE-STAFF':{id:'LOOT-ARCANE-STAFF',name:'Arcane Staff',type:'Weapon',slot:'weapon',rarity:'Rare',atk:16,int:5,value:160},
    'LOOT-STEEL-HELM':{id:'LOOT-STEEL-HELM',name:'Steel Helm',type:'Armor',slot:'head',rarity:'Uncommon',def:8,value:90},
    'LOOT-HUNTER-CAPE':{id:'LOOT-HUNTER-CAPE',name:'Hunter Cape',type:'Armor',slot:'armor',rarity:'Rare',def:10,agi:3,value:130},
    'LOOT-ADVENTURER-BOOTS':{id:'LOOT-ADVENTURER-BOOTS',name:'Adventurer Boots',type:'Armor',slot:'boots',rarity:'Uncommon',def:5,agi:2,value:75}
  };
  function state(){return window.gameState||{};}
  function ensure(){const s=state();s.inventory=Array.isArray(s.inventory)?s.inventory:[];s.lootHistory=Array.isArray(s.lootHistory)?s.lootHistory:[];s.equipment=s.equipment||{};return s;}
  function add(id,qty=1,source='Monster'){const s=ensure(),item=ITEMS[id];if(!item)return false;let row=s.inventory.find(x=>x.id===id);if(row)row.qty=(row.qty||0)+qty;else s.inventory.push({...item,qty});s.lootHistory.unshift({id,name:item.name,qty,source,rarity:item.rarity,time:new Date().toISOString()});window.dispatchEvent(new CustomEvent('mma:inventory-changed',{detail:{item,qty}}));return true;}
  function grantRandom(source='Monster'){const ids=Object.keys(ITEMS);return add(ids[Math.floor(Math.random()*ids.length)],1,source);}
  function equip(id){const s=ensure(),item=ITEMS[id];if(!item||!item.slot)return false;s.equipment[item.slot]={...item};window.dispatchEvent(new CustomEvent('mma:equipment-changed',{detail:item}));return true;}
  function unequip(slot){const s=ensure();s.equipment[slot]=null;window.dispatchEvent(new CustomEvent('mma:equipment-changed',{detail:{slot}}));return true;}
  function catalog(){return {...ITEMS};}
  function save(){localStorage.setItem(KEY,JSON.stringify({version:4,savedAt:new Date().toISOString(),inventory:ensure().inventory,lootHistory:ensure().lootHistory}));}
  window.MMA_LOOT_V4={catalog,add,grantRandom,equip,unequip,save,key:KEY};
})();
