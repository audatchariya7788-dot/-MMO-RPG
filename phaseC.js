(() => {
  const CLASSES = {
    Warrior:{label:'Warrior',desc:'สมดุล เน้น STR/DEF',sprite:'warrior_idle',attack:'warrior_attack',weapon:'long_sword',stats:{str:4,agi:1,int:0,vit:3}},
    Ranger:{label:'Ranger',desc:'ความเร็วและคริติคอล',sprite:'ranger_idle',attack:'ranger_attack',weapon:'bow',stats:{str:1,agi:5,int:1,vit:1}},
    Mage:{label:'Mage',desc:'เวทมนตร์และ MP',sprite:'mage_idle',attack:'mage_cast',weapon:'staff',stats:{str:0,agi:1,int:6,vit:1}},
    Assassin:{label:'Assassin',desc:'AGI สูง โจมตีเร็ว',sprite:'assassin_idle',attack:'assassin_attack',weapon:'dual_blade',stats:{str:2,agi:6,int:0,vit:0}}
  };
  const WEAPONS = {
    long_sword:{id:'class_long_sword',name:'Long Sword',icon:'sword_long',atk:28,str:6,crit:1,rarity:'Rare'},
    bow:{id:'class_bow',name:'Hunter Bow',icon:'bow',atk:25,agi:7,crit:4,rarity:'Rare'},
    staff:{id:'class_staff',name:'Arcane Staff',icon:'staff',atk:20,int:10,crit:2,rarity:'Epic'},
    dual_blade:{id:'class_dual_blade',name:'Twin Blades',icon:'dual_blade',atk:27,agi:8,crit:5,rarity:'Epic'}
  };
  const key='mma-rpg-class';
  const savedClass=()=>localStorage.getItem(key)||'Warrior';
  const sheet=(id,cls='sprite sprite-icon')=>`<svg class="${cls} phasec-sprite"><use href="assets/sprite-sheet-32.svg#${id}"></use></svg>`;
  function saveStateAndReload(cls, weaponKey){
    const raw=localStorage.getItem('mma-rpg-save');
    if(!raw){ document.getElementById('saveBtn')?.click(); }
    const now=localStorage.getItem('mma-rpg-save');
    if(!now) return;
    try{
      const s=JSON.parse(now), c=CLASSES[cls], w=WEAPONS[weaponKey];
      s.hero=s.hero||{}; s.hero.str=(s.hero.str||24)+c.stats.str; s.hero.agi=(s.hero.agi||18)+c.stats.agi; s.hero.int=(s.hero.int||12)+c.stats.int; s.hero.vit=(s.hero.vit||22)+c.stats.vit;
      s.inventory=s.inventory||[]; if(!s.inventory.some(x=>x.id===w.id)) s.inventory.push({id:w.id,name:w.name,type:'Weapon',rarity:w.rarity,atk:w.atk,str:w.str||0,agi:w.agi||0,int:w.int||0,crit:w.crit||0,icon:w.icon,class:cls});
      s.equipment=s.equipment||{}; s.equipment.Weapon=w.id; localStorage.setItem('mma-rpg-save',JSON.stringify(s)); localStorage.setItem(key,cls); localStorage.setItem('mma-rpg-class-weapon',weaponKey); location.reload();
    }catch(e){ console.error(e); }
  }
  function installPanel(){
    const host=document.getElementById('characterView'); if(!host || host.querySelector('.phasec-panel')) return;
    const current=savedClass();
    const panel=document.createElement('div'); panel.className='panel inner phasec-panel';
    panel.innerHTML=`<h3>⚔ Hero Class & Weapon</h3><p class="muted">เลือกโมเดลอาชีพและอาวุธหลัก — ระบบจะบันทึกแล้วโหลดเกมใหม่อัตโนมัติ</p><div class="phasec-classes">${Object.entries(CLASSES).map(([id,c])=>`<button class="phasec-class ${id===current?'selected':''}" data-class="${id}">${sheet(c.sprite,'phasec-portrait')}<b>${c.label}</b><small>${c.desc}</small></button>`).join('')}</div><div class="phasec-note">32×32 Sprite Sheet • Warrior / Ranger / Mage / Assassin • Weapon-linked assets</div>`;
    host.prepend(panel);
    panel.addEventListener('click',e=>{const b=e.target.closest('[data-class]'); if(!b)return; const cls=b.dataset.class; saveStateAndReload(cls,CLASSES[cls].weapon);});
  }
  function replaceHeroSprites(){
    const cls=CLASSES[savedClass()]||CLASSES.Warrior;
    document.querySelectorAll('.sprite-hero,.player-sprite,.character-sprite').forEach(el=>{const u=el.querySelector('use'); if(u)u.setAttribute('href',`assets/sprite-sheet-32.svg#${cls.sprite}`);});
  }
  function replaceEquippedWeaponIcons(){
    const weapon=localStorage.getItem('mma-rpg-class-weapon'); if(!weapon)return;
    const icon=WEAPONS[weapon]?.icon; if(!icon)return;
    document.querySelectorAll('.equip-slot .sprite').forEach(el=>{const h=el.closest('.equip-slot')?.textContent||''; if(h.includes(WEAPONS[weapon].name)){const u=el.querySelector('use');if(u)u.setAttribute('href',`assets/sprite-sheet-32.svg#${icon}`);}});
  }
  function tick(){installPanel();replaceHeroSprites();replaceEquippedWeaponIcons();}
  window.addEventListener('load',()=>{setTimeout(tick,250);setInterval(tick,500);});
})();