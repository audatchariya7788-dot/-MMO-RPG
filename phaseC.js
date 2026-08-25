/* Phase C compatibility layer
 * Single source of truth: app.js owns game state.
 * Character V3 is the visual layer; class changes must delegate to the unified runtime.
 */
(() => {
  'use strict';
  const VERSION = '2026-08-26-v3';
  const classes = {
    Warrior:{asset:'assets/hero-warrior.svg',weapon:'long_sword'},
    Ranger:{asset:'assets/hero-ranger.svg',weapon:'bow'},
    Mage:{asset:'assets/hero-mage.svg',weapon:'staff'},
    Assassin:{asset:'assets/hero-assassin.svg',weapon:'dual_blade'}
  };
  window.MMAPhaseC = {
    version: VERSION,
    classes,
    spriteSize: 32,
    assetRoot: 'assets/',
    setClass(name){
      if (!classes[name]) return false;
      /* app.js is the authoritative state/runtime. */
      if (window.MMACharacterSpec?.switchClass) {
        window.MMACharacterSpec.switchClass(name);
      } else {
        localStorage.setItem('mma-rpg-class', name);
        if (typeof window.render === 'function') window.render();
      }
      window.dispatchEvent(new CustomEvent('mma:character-changed', {detail:{className:name}}));
      return true;
    },
    refresh(){
      if (typeof window.render === 'function') window.render();
      if (window.MMACharacterV3?.render) window.MMACharacterV3.render();
    }
  };
})();
