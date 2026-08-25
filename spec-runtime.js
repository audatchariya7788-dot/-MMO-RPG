/* MMA : RPG V2 Design Spec Runtime
 * Machine-readable spec is data/game-spec.json. This validator never owns rendering;
 * it only validates asset paths and exposes the result for debugging/GM Lab.
 */
(() => {
  'use strict';
  const SPEC_URL = './data/game-spec.json?v=20260825-spec1';
  const state = { loaded:false, ok:false, missing:[], spec:null };
  window.MMA_RPG_SPEC = state;

  async function validate() {
    try {
      const res = await fetch(SPEC_URL, { cache:'no-store' });
      if (!res.ok) throw new Error(`spec ${res.status}`);
      const spec = await res.json();
      state.spec = spec;
      const paths = new Set();
      (spec.classes || []).forEach(x => paths.add(x.asset));
      if (spec.fallback?.asset) paths.add(spec.fallback.asset);
      (spec.assets || []).forEach(x => { if (x.file) paths.add(x.file); });
      const checks = await Promise.all([...paths].map(async path => {
        try { const r = await fetch(`./${path}`, { method:'HEAD', cache:'no-store' }); return [path, r.ok]; }
        catch { return [path, false]; }
      }));
      state.missing = checks.filter(x => !x[1]).map(x => x[0]);
      state.loaded = true;
      state.ok = state.missing.length === 0;
      document.documentElement.dataset.assetSpec = state.ok ? 'ok' : 'missing';
      console.info('[MMA:RPG] V2 spec', {version:spec.version, grid:spec.spriteGrid, missing:state.missing});
    } catch (err) {
      state.loaded = true;
      state.ok = false;
      state.missing = ['data/game-spec.json'];
      document.documentElement.dataset.assetSpec = 'error';
      console.warn('[MMA:RPG] Design spec validation unavailable:', err);
    }
  }
  validate();
})();
