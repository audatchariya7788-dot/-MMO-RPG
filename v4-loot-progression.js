/* MMA : RPG V4 Loot Progression
 * Scales drop quantity and rarity with monster/player level while preserving base loot tables.
 */
(function(){
  const RANK={Common:0,Uncommon:1,Rare:2,Epic:3};
  function tier(monsterLevel,playerLevel){
    const d=Math.max(0,(monsterLevel||1)-(playerLevel||1));
    return d>=5?2:d>=2?1:0;
  }
  function rollExtra(monsterLevel,playerLevel){
    const t=tier(monsterLevel,playerLevel);
    const chance=[0.08,0.18,0.30][t];
    return Math.random()<chance?1:0;
  }
  function eligible(drop,monsterLevel,playerLevel){
    const t=tier(monsterLevel,playerLevel);
    const maxRank=Math.min(3,1+t+((monsterLevel||1)>=10?1:0));
    return (RANK[drop[2]]??0)<=maxRank;
  }
  function drop(monsterId,monsterLevel,playerLevel,source){
    const api=window.MMA_LOOT_TABLES_V4, inv=window.MMA_LOOT_V4;
    if(!api||!inv)return [];
    const table=api.tables[monsterId]||api.tables.goblin;
    const pool=table.items.filter(x=>eligible(x,monsterLevel,playerLevel));
    if(!pool.length)return [];
    const total=pool.reduce((n,x)=>n+x[1],0);const out=[];
    const rolls=table.rolls+rollExtra(monsterLevel,playerLevel);
    for(let i=0;i<rolls;i++){
      let r=Math.random()*total,pick=pool[pool.length-1];
      for(const x of pool){r-=x[1];if(r<0){pick=x;break;}}
      inv.add(pick[0],1,source||monsterId);out.push({id:pick[0],rarity:pick[2]});
    }
    return out;
  }
  window.MMA_LOOT_PROGRESSION_V4={tier,drop};
})();
