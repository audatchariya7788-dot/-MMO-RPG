/* Phase C compatibility layer
 * The unified runtime now owns all game state and rendering.
 * This file intentionally contains no second renderer, preventing Character UI
 * and asset state from fighting with app.js.
 */
(() => {
  'use strict';
  const VERSION = '2026-08-25-v2';
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
      localStorage.setItem('mma-rpg-class', name);
      if (typeof window.render === 'function') window.render();
      return true;
    },
    refresh(){ if (typeof window.render === 'function') window.render(); }
  };
})();
