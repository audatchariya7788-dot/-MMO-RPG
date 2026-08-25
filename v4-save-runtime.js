/* MMA : RPG V4 Save/Load Runtime
 * Bridges the existing core save (mma-rpg-save-v2) to a validated V4 backup.
 * Does not replace app.js state ownership.
 */
(function(){
  'use strict';
  const CORE_KEY='mma-rpg-save-v2';
  const V4_KEY='mma-rpg-save-v4';
  const SLOTS=['Head','Armor','Weapon','Accessory','Ring','Boots'];

  function readCore(){
    try{return JSON.parse(localStorage.getItem(CORE_KEY)||'null');}catch(e){return null;}
  }
  function normalize(state){
    const s=(state&&typeof state==='object')?state:{};
    s.hero=s.hero||{};
    s.inventory=Array.isArray(s.inventory)?s.inventory:[];
    s.equipment=s.equipment||{};
    SLOTS.forEach(k=>{if(!(k in s.equipment))s.equipment[k]=null;});
    s.loot=Array.isArray(s.loot)?s.loot:[];
    s.lootHistory=Array.isArray(s.lootHistory)?s.lootHistory:[];
    s.quests=s.quests||{};
    s.version='2026-08-26-v4';
    return s;
  }
  function snapshot(){
    const s=readCore();
    if(!s)return null;
    return normalize(JSON.parse(JSON.stringify(s)));
  }
  function saveV4(){
    const state=snapshot();
    if(!state)return false;
    localStorage.setItem(V4_KEY,JSON.stringify({version:4,savedAt:new Date().toISOString(),state}));
    return true;
  }
  function restoreV4ToCore(){
    try{
      const raw=localStorage.getItem(V4_KEY);if(!raw)return false;
      const p=JSON.parse(raw);if(!p||!p.state)return false;
      localStorage.setItem(CORE_KEY,JSON.stringify(normalize(p.state)));
      return true;
    }catch(e){console.error('[MMA V4 Save]',e);return false;}
  }
  function validate(){
    const s=snapshot();
    const errors=[];
    if(!s)errors.push('No core save exists');
    if(s&&!s.hero)errors.push('Missing hero');
    if(s&&(!Array.isArray(s.inventory)))errors.push('Missing inventory');
    if(s&&SLOTS.some(k=>!(k in s.equipment)))errors.push('Equipment slot contract incomplete');
    return {valid:errors.length===0,version:4,errors};
  }
  function wire(){
    const saveBtn=document.getElementById('saveBtn');
    const loadBtn=document.getElementById('loadBtn');
    if(saveBtn&&!saveBtn.dataset.v4wired){
      saveBtn.addEventListener('click',()=>setTimeout(saveV4,50));
      saveBtn.dataset.v4wired='1';
    }
    if(loadBtn&&!loadBtn.dataset.v4wired){
      loadBtn.addEventListener('click',()=>{
        if(localStorage.getItem(V4_KEY))restoreV4ToCore();
      },{capture:true});
      loadBtn.dataset.v4wired='1';
    }
    window.MMA_SAVE_V4={key:V4_KEY,coreKey:CORE_KEY,snapshot,save:saveV4,restore:restoreV4ToCore,validate,has:()=>!!localStorage.getItem(V4_KEY)};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(wire,1000));else setTimeout(wire,1000);
})();
