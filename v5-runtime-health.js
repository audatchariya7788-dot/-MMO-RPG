/* MMA : RPG V5 runtime health check — asset + state integrity */
(() => {
  'use strict';
  const assets = [
    'assets/sprites.svg',
    'assets/sprite-sheet-32.svg',
    'assets/hero-class-models.svg',
    'assets/hero-warrior.svg',
    'assets/hero-ranger.svg',
    'assets/hero-mage.svg',
    'assets/hero-assassin.svg',
    'assets/animation-sprites.svg',
    'assets/greenvale-map.svg'
  ];
  async function checkAsset(path) {
    try {
      const r = await fetch(`${path}?health=${Date.now()}`, { cache: 'no-store' });
      return { path, ok: r.ok, status: r.status };
    } catch (e) {
      return { path, ok: false, status: 0, error: String(e?.message || e) };
    }
  }
  async function run() {
    const results = await Promise.all(assets.map(checkAsset));
    const state = window.gameState || {};
    const checks = [
      ...results,
      { path: 'gameState.inventory', ok: Array.isArray(state.inventory) },
      { path: 'gameState.equipment', ok: !!state.equipment && typeof state.equipment === 'object' },
      { path: 'saveKey', ok: !!localStorage.getItem('mma-rpg-save-v2') }
    ];
    const ok = checks.every(x => x.ok);
    window.MMA_V5_HEALTH = { ok, checks, time: new Date().toISOString() };
    document.documentElement.dataset.mmaHealth = ok ? 'pass' : 'fail';
    console.info('[MMA V5 HEALTH]', ok ? 'PASS' : 'FAIL', checks);
    return window.MMA_V5_HEALTH;
  }
  window.MMA_V5_HEALTH_RUN = run;
  window.addEventListener('load', () => setTimeout(run, 1100));
})();
