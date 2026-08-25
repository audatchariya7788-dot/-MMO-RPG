(() => {
  const CLASSES={
    Warrior:{label:'Warrior',desc:'สมดุล เน้น STR/DEF',model:'warrior',weapon:'long_sword',stats:{str:28,agi:18,int:12,vit:25},hp:320,mp:120},
    Ranger:{label:'Ranger',desc:'ความเร็วและคริติคอล',model:'ranger',weapon:'bow',stats:{str:20,agi:28,int:14,vit:20},hp:280,mp:110},
    Mage:{label:'Mage',desc:'เวทมนตร์และ MP',model:'mage',weapon:'staff',stats:{str:12,agi:16,int:32,vit:18},hp:230,mp:220},
    Assassin:{label:'Assassin',desc:'AGI สูง โจมตีเร็ว',model:'assassin',weapon:'dual_blade',stats:{str:22,agi:34,int:12,vit:18},hp:270,mp:100}
  };
  const WEAPONS={
    long_sword:{name:'Long Sword',icon:'sword_long',atk:12,bonus:'STR +2 • DEF +1',crit:'+3%'},
    bow:{name:'Hunter Bow',icon:'bow',atk:10,bonus:'AGI +2 • CRIT +4%',crit:'+4%'},
    staff:{name:'Arcane Staff',icon:'staff',atk:9,bonus:'INT +2 • MP +20',crit:'+2%'},
    dual_blade:{name:'Twin Blades',icon:'dual_blade',atk:11,bonus:'AGI +2 • SPD +1',crit:'+5%'}
  };
  const key='mma-rpg-class';
  const savedClass=()=>localStorage.getItem(key)||'Warrior';
  const currentClass=()=>CLASSES[savedClass()]||CLASSES.Warrior;
  const currentWeapon=()=>WEAPONS[currentClass().weapon];
  // Use standalone SVG files instead of external <use> references. This fixes
  // browsers/Codespaces previews that do not render cross-file SVG symbols.
  const model=id=>`<img class="hero-model hero-model-large" src="./assets/hero-${id}.svg?v=20260825d" alt="${id} hero" draggable="false">`;
  const sheet=id=>`<svg class="phasec-sprite" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet"><use href="./assets/sprite-sheet-32.svg#${id}"></use></svg>`;
  const statTotal=(c)=>c.stats;

  function switchClass(cls){
    if(!CLASSES[cls])return;
    localStorage.setItem(key,cls);
    localStorage.setItem('mma-rpg-class-weapon',CLASSES[cls].weapon);
    document.documentElement.dataset.heroClass=cls;
    if(typeof window.save==='function')window.save();
    if(typeof window.render==='function')window.render();
    setTimeout(renderCharacterUpgrade,80);
  }

  function classCards(current){
    return Object.entries(CLASSES).map(([id,c])=>{
      const w=WEAPONS[c.weapon];
      return `<button class="phasec-class ${id===current?'selected':''}" data-class="${id}" aria-label="เลือก ${c.label}">${model(c.model)}<b>${c.label}</b><small>${c.desc}</small><em>${w.name}</em><span class="class-bonus">${w.bonus}</span></button>`;
    }).join('');
  }

  function renderCharacterUpgrade(){
    const host=document.getElementById('characterView');
    if(!host)return;
    const cls=savedClass(),c=currentClass(),w=currentWeapon(),s=statTotal(c);
    const shell=document.createElement('div');
    shell.className='phasec-character-complete';
    shell.innerHTML=`
      <div class="phasec-class-panel">
        <div class="phasec-heading"><div><h3>⚔ Hero Class & Weapon</h3><p class="muted">เลือกอาชีพเพื่อเปลี่ยนโมเดล 32×32, อาวุธ, ค่าสถานะ และโมเดลใน World / Battle / Equipment</p></div><div class="phasec-current">${model(c.model)}<b>${c.label}</b><span>${w.name}</span></div></div>
        <div class="phasec-classes">${classCards(cls)}</div>
      </div>
      <div class="character-showcase">
        <section class="character-art-card">
          <div class="section-label">👤 Hero Preview</div>
          <div class="pixel-frame"><div class="character-ribbon">${c.label}</div>${model(c.model)}<div class="pixel-floor"></div></div>
          <h2>${c.label} — Lv. 12</h2><p>${c.desc}</p><div class="weapon-badge">⚔ ${w.name}</div>
        </section>
        <section class="equipment-paper-card">
          <div class="section-label">🛡 Equipment</div>
          <div class="paper-grid">
            <div class="equip-visual head"><span>HEAD</span>${sheet('knight')}<b>Steel Helm</b></div>
            <div class="equip-visual armor"><span>ARMOR</span>${sheet(cls==='Mage'?'mage_robe':cls==='Assassin'?'shadow_armor':'knight')}<b>${cls==='Mage'?'Mage Robe':cls==='Assassin'?'Shadow Armor':'Leather Armor'}</b></div>
            <div class="equip-visual accessory"><span>ACCESSORY</span>${sheet('ring')}<b>Ruby Ring</b></div>
            <div class="equip-visual weapon"><span>WEAPON</span>${sheet(w.icon)}<b>${w.name}</b><small>ATK +${w.atk}</small></div>
            <div class="paper-mini">${model(c.model)}</div>
          </div>
          <div class="weapon-detail"><div>${sheet(w.icon)}</div><div><strong>${w.name}</strong> <span class="rarity">★★★</span><br><span>ATK +${w.atk} &nbsp; ${w.bonus}</span></div></div>
        </section>
        <section class="character-info-card">
          <div class="section-label">📊 Character Stats</div>
          <div class="level-line"><b>Lv. 12 ${c.label}</b><span>EXP 48% (480/1000)</span></div>
          <div class="resource-row"><span>HP</span><i><b style="width:100%"></b></i><strong>${c.hp}/${c.hp}</strong></div>
          <div class="resource-row"><span>MP</span><i><b style="width:100%"></b></i><strong>${c.mp}/${c.mp}</strong></div>
          <div class="attribute-grid"><div>💎 STR <b>${s.str}</b></div><div>⚡ AGI <b>${s.agi}</b></div><div>🔮 INT <b>${s.int}</b></div><div>🛡 VIT <b>${s.vit}</b></div></div>
          <div class="combat-stat-grid"><div>ATK <b>${w.atk+s.str}</b></div><div>DEF <b>${s.vit+3}</b></div><div>CRIT <b>${w.crit}</b></div><div>DODGE <b>${Math.round(s.agi/5)}%</b></div></div>
          <div class="weapon-bonus"><b>Weapon Bonus</b><br>${w.bonus}</div>
        </section>
      </div>
      <div class="phasec-sprite-spec"><b>Sprite Sheet 32×32</b><span>Grid-ready SVG • ${Object.keys(CLASSES).length} Classes • ${Object.keys(WEAPONS).length} Signature Weapons • Runtime connected</span></div>`;
    host.replaceChildren(shell);
    shell.addEventListener('click',e=>{const b=e.target.closest('[data-class]');if(b)switchClass(b.dataset.class);});
  }

  function syncAllHeroModels(){
    const c=currentClass();
    document.documentElement.dataset.heroClass=savedClass();
    document.querySelectorAll('.sprite-hero,.character-sprite').forEach(el=>{
      const u=el.querySelector('use');
      if(u && el.closest('.characterView,.paperdoll,.hero-unit'))u.setAttribute('href',`assets/hero-class-models.svg#${c.model}`);
    });
  }

  function tick(){
    if(document.getElementById('character')?.classList.contains('active'))renderCharacterUpgrade();
    syncAllHeroModels();
  }
  window.addEventListener('load',()=>{setTimeout(tick,250);setInterval(tick,900)});
})();
