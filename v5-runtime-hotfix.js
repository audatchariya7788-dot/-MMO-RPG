/* MMA:RPG V5 runtime hotfix
 * Fixes shared sprite loading + exposes the V4/V5 gameState contract safely.
 */
(function(){
  'use strict';
  const SAVE='mma-rpg-save-v2';
  const DEFAULT={version:'2026-08-26-v5-hotfix',hero:{level:1,exp:0,gold:250,hp:240,maxHp:240,mp:80,maxMp:80},inventory:[],equipment:{Weapon:null,Armor:null,Ring:null},loot:[],map:{x:5,y:6},kills:0,quests:{goblin:0,forest:0}};
  const ICONS={hero:'⚔️',goblin:'👹',wolf:'🐺',golem:'🪨',knight:'🛡️',sword:'⚔️',bow:'🏹',staff:'🔮',dual_blade:'🗡️',armor:'🛡️',ring:'💍',potion:'🧪',gold:'🪙',item:'📦',quest:'📜'};

  function read(){try{const x=JSON.parse(localStorage.getItem(SAVE)||'null');return x&&typeof x==='object'?x:null}catch(e){return null}}
  function ensureSave(){let s=read();if(!s){s=JSON.parse(JSON.stringify(DEFAULT));localStorage.setItem(SAVE,JSON.stringify(s));}return s}
  function ensureState(){
    const s=ensureSave();
    s.hero={...DEFAULT.hero,...(s.hero||{})};
    s.inventory=Array.isArray(s.inventory)?s.inventory:[];
    s.equipment={...DEFAULT.equipment,...(s.equipment||{})};
    s.loot=Array.isArray(s.loot)?s.loot:[];
    window.gameState=s;
    return s;
  }
  function persist(){try{localStorage.setItem(SAVE,JSON.stringify(window.gameState));}catch(e){}}

  ensureState();
  window.MMA_RUNTIME_HOTFIX={version:'v5-hotfix',save:persist,refresh:ensureState};

  function iconFallback(id){
    const key=String(id||'').toLowerCase();
    const el=document.createElement('span');
    el.className='sprite-fallback sprite-fallback-'+key;
    el.setAttribute('aria-hidden','true');
    el.textContent=ICONS[key]||'◆';
    return el;
  }
  function repairSprites(root=document){
    root.querySelectorAll('svg use').forEach(use=>{
      const href=use.getAttribute('href')||use.getAttribute('xlink:href')||'';
      const m=href.match(/sprites\.svg#([^?#]+)/);
      if(!m)return;
      const svg=use.closest('svg'); if(!svg||svg.dataset.spriteFixed==='1')return;
      const replacement=iconFallback(m[1]);
      replacement.className += ' '+(svg.getAttribute('class')||'');
      svg.replaceWith(replacement);
    });
  }
  document.addEventListener('DOMContentLoaded',()=>{
    repairSprites();
    const mo=new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(n=>{if(n.nodeType===1)repairSprites(n)})));
    mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>{ensureState();persist();repairSprites();},50);
  });
  window.addEventListener('beforeunload',persist);
  window.addEventListener('mma:inventory-changed',persist);
  window.addEventListener('mma:equipment-changed',persist);
})();
