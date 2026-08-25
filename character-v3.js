/* MMA:RPG Character V3 - sample-aligned presentation layer */
(() => {
  'use strict';
  const KEY='mma-rpg-class', SAVE='mma-rpg-save-v2', PENDING='mma-rpg-pending-class';
  const CLASSES={
    Warrior:{asset:'hero-warrior.svg',weapon:'Long Sword',icon:'sword',desc:'สมดุล • STR / DEF',bonus:'STR +2  •  DEF +1',stats:{str:28,agi:14,int:10,vit:20},hp:320,mp:120,atk:52,def:28,crit:12,dodge:5},
    Ranger:{asset:'hero-ranger.svg',weapon:'Hunter Bow',icon:'bow',desc:'ความเร็ว • Critical',bonus:'AGI +2  •  CRIT +1',stats:{str:20,agi:28,int:14,vit:20},hp:280,mp:110,atk:48,def:22,crit:15,dodge:10},
    Mage:{asset:'hero-mage.svg',weapon:'Arcane Staff',icon:'staff',desc:'เวทมนตร์ • MP',bonus:'INT +2  •  MP +20',stats:{str:12,agi:16,int:32,vit:18},hp:230,mp:220,atk:44,def:18,crit:10,dodge:6},
    Assassin:{asset:'hero-assassin.svg',weapon:'Twin Blades',icon:'dual_blade',desc:'AGI สูง • โจมตีเร็ว',bonus:'AGI +2  •  SPD +1',stats:{str:22,agi:34,int:12,vit:18},hp:270,mp:100,atk:60,def:20,crit:18,dodge:14}
  };
  const sample={level:12,exp:480,maxExp:1000,gold:1250,diamonds:120,hp:320,mp:120};
  const q=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const current=()=>localStorage.getItem(KEY)||'Warrior';
  function readSave(){try{return JSON.parse(localStorage.getItem(SAVE)||'null')}catch{return null}}
  function heroData(){const c=CLASSES[current()]||CLASSES.Warrior;const s=readSave();const h=s&&s.hero?s.hero:{};return {...sample,...h,...c.stats,hp:h.hp ?? c.hp,mp:h.mp ?? c.mp,maxHp:h.maxHp ?? c.hp,maxMp:h.maxMp ?? c.mp};}
  function img(c,cls=''){return `<img class="cv3-hero ${cls}" src="assets/${c.asset}?v=20260825cv3" alt="${q(current())}" onerror="this.onerror=null;this.src='assets/hero.svg?v=20260825cv3'">`}
  function icon(id){return `<svg class="cv3-icon" aria-hidden="true"><use href="assets/sprites.svg#${id}"></use></svg>`}
  function switchClass(id){localStorage.setItem(PENDING,id);localStorage.setItem(KEY,id);location.reload();}
  function render(){
    const host=document.getElementById('characterView'); if(!host)return;
    const id=current(),c=CLASSES[id],h=heroData(),exp=Math.max(0,Math.min(100,Math.round((h.exp??sample.exp)/(h.maxExp??sample.maxExp)*100)));
    host.innerHTML=`<div class="cv3">
      <div class="cv3-classbar"><div class="cv3-title"><span>⚔</span><div><h2>Hero Class & Weapon</h2><p>เลือกอาชีพเพื่อเปลี่ยนโมเดล อาวุธ ค่าสถานะ และข้อมูลที่ใช้ใน Battle</p></div></div><div class="cv3-classcards">${Object.entries(CLASSES).map(([k,x])=>`<button class="cv3-class ${k===id?'selected':''}" data-c="${k}">${img(x)}<strong>${k}</strong><small>${x.weapon}</small><em>${x.bonus}</em></button>`).join('')}</div></div>
      <div class="cv3-main">
        <section class="cv3-panel cv3-preview"><div class="cv3-panelhead">👤 Hero Preview <span>ASSET: CHR-${id.slice(0,3).toUpperCase()}-IDLE</span></div><div class="cv3-scene"><div class="cv3-sky"></div><div class="cv3-ground"></div>${img(c,'cv3-large')}<div class="cv3-shadow"></div><div class="cv3-nameplate">${id} — ${c.weapon}</div></div><div class="cv3-preview-foot"><b>${id} — Lv. ${h.level}</b><span>${c.desc}</span></div></section>
        <section class="cv3-panel cv3-equip"><div class="cv3-panelhead">🛡 Equipment <span>EQ-${c.icon.toUpperCase()}</span></div><div class="cv3-doll"><div class="slot s-head">${icon('armor')}<b>Head</b><small>Steel Helm</small></div><div class="slot s-armor">${icon('armor')}<b>Armor</b><small>${id} Armor</small></div><div class="doll-center">${img(c,'cv3-dollhero')}</div><div class="slot s-weapon active">${icon(c.icon)}<b>Weapon</b><small>${c.weapon}</small></div><div class="slot s-ring">${icon('ring')}<b>Ring</b><small>Ruby Ring</small></div><div class="slot s-boots">${icon('armor')}<b>Boots</b><small>Adventurer</small></div></div><div class="cv3-itemdetail">${icon(c.icon)}<div><b>${c.weapon}</b> <span>★★★</span><p>ATK +12 &nbsp; ${c.bonus}</p><small>Signature weapon • usable in Character / Equipment / Battle</small></div></div></section>
        <section class="cv3-panel cv3-stats"><div class="cv3-panelhead">📊 Character Stats <span>STAT-V3</span></div><div class="cv3-level"><b>Lv. ${h.level} ${id}</b><span>EXP ${h.exp}/${h.maxExp} (${exp}%)</span></div><div class="cv3-bar hp"><label>HP</label><i><b style="width:${Math.max(0,Math.min(100,h.hp/h.maxHp*100))}%"></b></i><strong>${h.hp}/${h.maxHp}</strong></div><div class="cv3-bar mp"><label>MP</label><i><b style="width:${Math.max(0,Math.min(100,h.mp/h.maxMp*100))}%"></b></i><strong>${h.mp}/${h.maxMp}</strong></div><div class="cv3-attrs">${Object.entries(c.stats).map(([k,v])=>`<div><span>${k.toUpperCase()}</span><b>${v}</b>${k==='str'?'(+2)':k==='agi'?'(+1)':''}</div>`).join('')}</div><div class="cv3-combat"><div>ATK <b>${c.atk}–${c.atk+8}</b></div><div>DEF <b>${c.def}</b></div><div>CRIT <b>${c.crit}%</b></div><div>DODGE <b>${c.dodge}%</b></div></div></section>
      </div>
      <div class="cv3-bottom"><section class="cv3-panel cv3-inv"><div class="cv3-panelhead">🎒 Inventory <span>8 Items</span></div><div class="cv3-invgrid"><div>${icon('potion')}<b>10</b></div><div>${icon('potion')}<b>8</b></div><div>${icon('potion')}<b>5</b></div><div>${icon('quest')}<b>3</b></div><div>${icon('gold')}<b>${h.gold}</b></div><div>${icon('item')}<b>2</b></div><div>${icon('armor')}<b>4</b></div><div>${icon('ring')}<b>12</b></div></div></section><section class="cv3-panel cv3-bonus"><div class="cv3-panelhead">⚔ Weapon Bonus <span>WPN-${c.icon.toUpperCase()}</span></div><p>${icon(c.icon)} <b>ATK +12</b></p><p>💪 <b>${c.bonus}</b></p><p>✨ <b>Critical Rate +3%</b></p><p>⚔ <b>Normal Attack +1</b></p></section></div>
      <div class="cv3-contract"><b>Character Runtime Contract</b><span>Asset ID → Sprite 32×32 → Equipment → Character UI → Battle</span><span>Fallback: assets/hero.svg</span></div>
    </div>`;
    host.querySelectorAll('[data-c]').forEach(b=>b.addEventListener('click',()=>switchClass(b.dataset.c)));
  }
  function boot(){
    const pending=localStorage.getItem(PENDING);
    if(pending){localStorage.removeItem(PENDING);setTimeout(()=>document.querySelector(`.phasec-class[data-class="${pending}"]`)?.click(),80);}
    const host=document.getElementById('characterView'); if(!host)return;
    const obs=new MutationObserver(()=>{if(host.querySelector('.phasec-character-complete'))render();});obs.observe(host,{childList:true,subtree:true});
    if(host.innerHTML.trim()) render();
  }
  document.addEventListener('DOMContentLoaded',boot);
  window.MMACharacterV3={render,switchClass,CLASSES};
})();
