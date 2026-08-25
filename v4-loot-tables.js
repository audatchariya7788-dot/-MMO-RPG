/* MMA : RPG V4 Monster Loot Tables + weighted rarity */
(function(){
  const R={Common:70,Uncommon:20,Rare:8,Epic:2};
  const TABLES={
    slime:{rolls:1,items:[['LOOT-SLIME-CORE',70,'Common'],['LOOT-STEEL-HELM',20,'Uncommon'],['LOOT-HUNTER-CAPE',8,'Rare'],['LOOT-ARCANE-STAFF',2,'Epic']]},
    goblin:{rolls:2,items:[['LOOT-SLIME-CORE',35,'Common'],['LOOT-GOBLIN-BLADE',35,'Uncommon'],['LOOT-HUNTER-BOW',20,'Rare'],['LOOT-STEEL-HELM',8,'Rare'],['LOOT-ADVENTURER-BOOTS',2,'Epic']]},
    wolf:{rolls:2,items:[['LOOT-SLIME-CORE',25,'Common'],['LOOT-ADVENTURER-BOOTS',45,'Uncommon'],['LOOT-HUNTER-CAPE',20,'Rare'],['LOOT-HUNTER-BOW',8,'Rare'],['LOOT-ARCANE-STAFF',2,'Epic']]},
    boss:{rolls:3,items:[['LOOT-GOBLIN-BLADE',20,'Uncommon'],['LOOT-HUNTER-BOW',25,'Rare'],['LOOT-ARCANE-STAFF',25,'Rare'],['LOOT-HUNTER-CAPE',20,'Rare'],['LOOT-STEEL-HELM',8,'Epic'],['LOOT-ADVENTURER-BOOTS',2,'Epic']]}
  };
  function roll(table){
    const total=table.items.reduce((n,x)=>n+x[1],0),r=Math.random()*total;let c=0;
    for(const x of table.items){c+=x[1];if(r<c)return x;}
    return table.items[table.items.length-1];
  }
  function drop(monster='goblin',source='Monster'){
    const t=TABLES[monster]||TABLES.goblin;const out=[];
    for(let i=0;i<t.rolls;i++){const x=roll(t);if(window.MMA_LOOT_V4?.add){window.MMA_LOOT_V4.add(x[0],1,source);out.push({id:x[0],rarity:x[2]});}}
    return out;
  }
  window.MMA_LOOT_TABLES_V4={tables:TABLES,rarity:R,drop};
})();
