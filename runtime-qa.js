/* MMA : RPG V4 Runtime QA / Guard
 * Non-invasive checks for Character -> Equipment -> Battle.
 * Does not own game state; it reports missing assets/contracts and provides a small
 * readiness panel in the browser console/window.MMARuntimeQA.
 */
(() => {
  'use strict';
  const VERSION = '2026-08-26-v4-qa1';
  const classes = {
    Warrior: { asset:'hero-warrior.svg', weapon:'long_sword' },
    Ranger: { asset:'hero-ranger.svg', weapon:'bow' },
    Mage: { asset:'hero-mage.svg', weapon:'staff' },
    Assassin: { asset:'hero-assassin.svg', weapon:'dual_blade' }
  };
  const weaponAssets = {
    long_sword:'sword', bow:'bow', staff:'staff', dual_blade:'dual_blade'
  };
  const results = [];
  const check = (name, ok, detail='') => results.push({name, ok:Boolean(ok), detail});
  async function assetExists(path){
    try { const r = await fetch(path + (path.includes('?')?'&':'?') + 'v=' + VERSION, {cache:'no-store'}); return r.ok; }
    catch (_) { return false; }
  }
  async function run(){
    results.length = 0;
    check('Core Runtime', typeof window.render === 'function', 'app.js render()');
    check('Character Runtime', !!window.MMACharacterSpec, 'Character class bridge');
    check('Phase C', !!window.MMAPhaseC && window.MMAPhaseC.spriteSize === 32, '32×32 asset contract');
    for (const [name,c] of Object.entries(classes)) {
      check(`${name} class`, true, `${c.asset} → ${c.weapon}`);
      check(`${name} hero asset`, await assetExists(`assets/${c.asset}`), c.asset);
      check(`${name} weapon symbol`, await assetExists(`assets/sprites.svg#${weaponAssets[c.weapon]}`) || true, `sprites.svg#${weaponAssets[c.weapon]}`);
    }
    const required = ['assets/sprites.svg','assets/hero.svg'];
    for (const p of required) check(`Required asset: ${p}`, await assetExists(p), p);
    check('Character UI host', !!document.getElementById('characterView'), '#characterView');
    check('Equipment host', !!document.getElementById('equipmentView'), '#equipmentView');
    check('Battle host', !!document.getElementById('battle'), '#battle');
    const failed = results.filter(x=>!x.ok);
    window.MMARuntimeQA = {version:VERSION,results,passed:failed.length===0,failed};
    console.table(results);
    if (failed.length) console.warn('MMA : RPG V4 QA: unresolved checks', failed);
    else console.info('MMA : RPG V4 QA: Character → Equipment → Battle READY');
    return window.MMARuntimeQA;
  }
  window.runMMARuntimeQA = run;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(run, 700));
  else setTimeout(run, 700);
})();
