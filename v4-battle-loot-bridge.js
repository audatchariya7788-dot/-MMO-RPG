/* MMA : RPG V4 Battle -> Monster Loot bridge */
(function(){
  const NAME_TO_ID={'Slime':'slime','Goblin':'goblin','Wolf':'wolf','Slime King':'boss','Goblin King':'boss','Dragon':'boss'};
  let lastKills=-1,lastMonster=null;
  function tick(){
    const s=window.gameState;if(!s)return;
    const kills=Number(s.kills||0);
    if(lastKills<0){lastKills=kills;return;}
    if(kills<=lastKills){lastKills=kills;return;}
    const defeated=s.lastDefeatedMonster||s.defeatedMonster||lastMonster;
    const name=defeated?.name||window.__mmaLastBattleMonsterName||'Goblin';
    const id=NAME_TO_ID[name]||'goblin';
    const ml=Number(defeated?.level||lastMonster?.level||s.hero?.level||1);
    const pl=Number(s.hero?.level||1);
    const drops=window.MMA_LOOT_PROGRESSION_V4?.drop(id,ml,pl,name)||window.MMA_LOOT_TABLES_V4?.drop(id,name)||[];
    if(drops.length){s.log=Array.isArray(s.log)?s.log:[];s.log.unshift(`🎁 Loot [${id}] Lv.${ml} → ${drops.map(x=>x.id).join(', ')}`);}
    lastKills=kills;
  }
  function remember(){const m=window.gameState?.monster;if(m?.name){lastMonster={...m};window.__mmaLastBattleMonsterName=m.name;}}
  window.MMA_BATTLE_LOOT_V4={tick,remember};setInterval(()=>{remember();tick();},250);
})();
