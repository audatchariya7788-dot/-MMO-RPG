/* MMA : RPG V5 Runtime QA / integrity checks */
(function(){
  const required=['gameState','MMA_LOOT_V4','MMA_LOOT_TABLES_V4','MMA_LOOT_PROGRESSION_V4','MMA_BATTLE_LOOT_V4'];
  function run(){
    const checks=required.map(k=>({name:k,ok:!!window[k]}));
    const s=window.gameState||{};
    checks.push({name:'inventory-array',ok:Array.isArray(s.inventory)});
    checks.push({name:'equipment-object',ok:!!s.equipment&&typeof s.equipment==='object'});
    checks.push({name:'save-key',ok:!!localStorage.getItem('mma-rpg-save-v2')});
    const ok=checks.every(x=>x.ok);
    window.MMA_V5_QA={ok,checks,time:new Date().toISOString()};
    document.documentElement.dataset.mmaQa=ok?'pass':'fail';
    console.info('[MMA V5 QA]',ok?'PASS':'FAIL',checks);
    return window.MMA_V5_QA;
  }
  window.MMA_V5_QA_RUN=run;
  window.addEventListener('load',()=>setTimeout(run,800));
})();
