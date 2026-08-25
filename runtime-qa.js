/* MMA : RPG V4 Runtime QA / Guard */
(() => {
  'use strict';
  const VERSION = '2026-08-26-v4-qa2';
  const classes = {
    Warrior: { asset:'hero-warrior.svg', weapon:'long_sword', symbol:'sword' },
    Ranger: { asset:'hero-ranger.svg', weapon:'bow', symbol:'bow' },
    Mage: { asset:'hero-mage.svg', weapon:'staff', symbol:'staff' },
    Assassin: { asset:'hero-assassin.svg', weapon:'dual_blade', symbol:'dual_blade' }
  };
  const results=[];
  const check=(name,ok,detail='')=>results.push({name,ok:Boolean(ok),detail});
  async function assetExists(path){try{const r=await fetch(path+(path.includes('?')?'&':'?')+'v='+VERSION,{cache:'no-store'});return r.ok;}catch(_){return false;}}
  async function svgSymbolExists(symbol){
    try{const r=await fetch('assets/sprites.svg?v='+VERSION,{cache:'no-store'});if(!r.ok)return false;const t=await r.text();return new RegExp('id=["\']'+symbol+'["\']').test(t);}
    catch(_){return false;}
  }
  async function run(){
    results.length=0;
    check('Core Runtime',typeof window.render==='function','app.js render()');
    check('Character Runtime',!!window.MMACharacterSpec,'Character class bridge');
    check('Phase C',!!window.MMAPhaseC&&window.MMAPhaseC.spriteSize===32,'32×32 asset contract');
    check('V4 Runtime Layer',!!window.MMARuntimeLayer,'Equipment/Save contract');
    for(const [name,c] of Object.entries(classes)){
      check(`${name} hero asset`,await assetExists(`assets/${c.asset}`),c.asset);
      check(`${name} weapon symbol`,await svgSymbolExists(c.symbol),`sprites.svg#${c.symbol}`);
    }
    for(const p of ['assets/sprites.svg','assets/hero.svg'])check(`Required asset: ${p}`,await assetExists(p),p);
    check('Character UI host',!!document.getElementById('characterView'),'#characterView');
    check('Equipment host',!!document.getElementById('equipmentView'),'#equipmentView');
    check('Battle host',!!document.getElementById('battle'),'#battle');
    const save=window.MMARuntimeLayer?.validateSave?.();
    check('Save contract',!!save&&!save.errors.includes('Equipment slot contract incomplete'),save?.errors?.join(', ')||'no save yet');
    window.MMARuntimeQA={version:VERSION,results,passed:results.every(x=>x.ok),failed:results.filter(x=>!x.ok)};
    console.table(results);
    if(window.MMARuntimeQA.passed)console.info('MMA : RPG V4 QA: Character → Equipment → Battle → Save READY');
    else console.warn('MMA : RPG V4 QA: unresolved checks',window.MMARuntimeQA.failed);
    return window.MMARuntimeQA;
  }
  window.runMMARuntimeQA=run;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,1100));else setTimeout(run,1100);
})();
