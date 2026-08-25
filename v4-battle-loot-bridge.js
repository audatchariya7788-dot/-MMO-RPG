/* MMA : RPG V4 Battle -> Monster Loot bridge
 * Observes the existing Core battle state without replacing app.js combat logic.
 * On each newly recorded kill, resolves the defeated monster to its V4 loot table.
 */
(function(){
  const NAME_TO_ID={
    'Slime':'slime','Goblin':'goblin','Wolf':'wolf','Slime King':'boss','Goblin King':'boss','Dragon':'boss'
  };
  let lastKills=-1;
  function tick(){
    const s=window.gameState;
    if(!s)return;
    const kills=Number(s.kills||0);
    if(lastKills<0){lastKills=kills;return;}
    if(kills<=lastKills){lastKills=kills;return;}
    const defeated=s.lastDefeatedMonster||s.defeatedMonster;
    // Core app clears state.monster during victory, so use the last known monster snapshot.
    const name=defeated?.name || window.__mmaLastBattleMonsterName;
    const id=NAME_TO_ID[name] || 'goblin';
    const drops=window.MMA_LOOT_TABLES_V4?.drop(id,name||'Monster')||[];
    if(drops.length){
      const names=drops.map(x=>x.id).join(', ');
      s.log=Array.isArray(s.log)?s.log:[];
      s.log.unshift(`🎁 Loot Table [${id}] → ${names}`);
    }
    lastKills=kills;
  }
  function remember(){
    const m=window.gameState?.monster;
    if(m?.name)window.__mmaLastBattleMonsterName=m.name;
  }
  window.MMA_BATTLE_LOOT_V4={tick,remember};
  setInterval(()=>{remember();tick();},250);
})();
