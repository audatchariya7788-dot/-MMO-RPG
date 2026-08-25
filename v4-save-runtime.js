/* MMA : RPG V4 Save/Load Runtime
 * Normalizes the live state without replacing the existing core runtime.
 */
(function(){
  const KEY='mma-rpg-save-v4';
  const SLOTS=['head','armor','weapon','accessory','ring','boots'];
  function normalize(){
    const s=window.gameState||{};
    s.equipment=s.equipment||{};
    SLOTS.forEach(k=>{ if(!(k in s.equipment)) s.equipment[k]=null; });
    s.inventory=Array.isArray(s.inventory)?s.inventory:[];
    s.lootHistory=Array.isArray(s.lootHistory)?s.lootHistory:[];
    return s;
  }
  function save(){
    const s=normalize();
    localStorage.setItem(KEY,JSON.stringify({version:4,savedAt:new Date().toISOString(),state:s}));
    return true;
  }
  function load(){
    try{
      const raw=localStorage.getItem(KEY); if(!raw)return false;
      const payload=JSON.parse(raw); if(!payload||!payload.state)return false;
      window.gameState=Object.assign(normalize(),payload.state);
      window.dispatchEvent(new CustomEvent('mma:state-loaded',{detail:window.gameState}));
      if(typeof window.renderAll==='function') window.renderAll();
      return true;
    }catch(e){ console.error('[MMA Save]',e); return false; }
  }
  window.MMA_SAVE_V4={key:KEY,normalize,save,load,has:()=>!!localStorage.getItem(KEY)};
})();
