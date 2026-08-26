/* MMA : RPG V5 Runtime QA / integrity checks */
(function(){
  const HOTFIX='./v5-runtime-hotfix.js?v=20260826hotfix1';
  function loadHotfix(){
    if(document.querySelector('script[data-mma-hotfix]')) return Promise.resolve();
    return new Promise(resolve=>{
      const s=document.createElement('script');
      s.src=HOTFIX; s.async=false; s.dataset.mmaHotfix='1';
      s.onload=resolve; s.onerror=resolve;
      document.head.appendChild(s);
    });
  }
  const required=['gameState','MMA_LOOT_V4','MMA_LOOT_TABLES_V4','MMA_LOOT_PROGRESSION_V4','MMA_BATTLE_LOOT_V4'];
  async function run(){
    await loadHotfix();
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
  loadHotfix();
  window.addEventListener('load',()=>setTimeout(run,800));
})();
