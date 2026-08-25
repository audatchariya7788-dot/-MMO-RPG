(() => {
  const CLASSES={
    Warrior:{label:'Warrior',desc:'สมดุล เน้น STR/DEF',model:'warrior',weapon:'long_sword'},
    Ranger:{label:'Ranger',desc:'ความเร็วและคริติคอล',model:'ranger',weapon:'bow'},
    Mage:{label:'Mage',desc:'เวทมนตร์และ MP',model:'mage',weapon:'staff'},
    Assassin:{label:'Assassin',desc:'AGI สูง โจมตีเร็ว',model:'assassin',weapon:'dual_blade'}
  };
  const WEAPONS={
    long_sword:{name:'Long Sword',icon:'sword_long',atk:28,bonus:'STR +6 • CRIT +1%'},
    bow:{name:'Hunter Bow',icon:'bow',atk:25,bonus:'AGI +7 • CRIT +4%'},
    staff:{name:'Arcane Staff',icon:'staff',atk:20,bonus:'INT +10 • CRIT +2%'},
    dual_blade:{name:'Twin Blades',icon:'dual_blade',atk:27,bonus:'AGI +8 • CRIT +5%'}
  };
  const key='mma-rpg-class';
  const savedClass=()=>localStorage.getItem(key)||'Warrior';
  const currentClass=()=>CLASSES[savedClass()]||CLASSES.Warrior;
  const currentWeapon=()=>WEAPONS[currentClass().weapon];
  const model=id=>`<svg class="hero-model hero-model-large" viewBox="0 0 128 160" preserveAspectRatio="xMidYMid meet"><use href="assets/hero-class-models.svg#${id}"></use></svg>`;
  const sheet=id=>`<svg class="phasec-sprite"><use href="assets/sprite-sheet-32.svg#${id}"></use></svg>`;

  function switchClass(cls){
    localStorage.setItem(key,cls);
    localStorage.setItem('mma-rpg-class-weapon',CLASSES[cls].weapon);
    document.documentElement.dataset.heroClass=cls;
    if(typeof window.save==='function') window.save();
    if(typeof window.render==='function') window.render();
    setTimeout(renderCharacterUpgrade,50);
  }

  function classCards(current){
    return Object.entries(CLASSES).map(([id,c])=>`<button class="phasec-class ${id===current?'selected':''}" data-class="${id}">${model(c.model)}<b>${c.label}</b><small>${c.desc}</small><em>${WEAPONS[c.weapon].name}</em></button>`).join('');
  }

  function renderCharacterUpgrade(){
    const host=document.getElementById('characterView');
    if(!host)return;
    const cls=savedClass(),c=currentClass(),w=currentWeapon();
    const old=host.querySelector('.phasec-character-complete');
    const shell=document.createElement('div');
    shell.className='phasec-character-complete';
    shell.innerHTML=`
      <div class="phasec-class-panel">
        <div class="phasec-heading"><div><h3>⚔ Hero Class & Weapon</h3><p class="muted">โมเดลตัวละครและอาวุธจะเปลี่ยนตามอาชีพที่เลือก และใช้ต่อใน World / Battle / Equipment</p></div><div class="phasec-current">${model(c.model)}<b>${c.label}</b><span>${w.name}</span></div></div>
        <div class="phasec-classes">${classCards(cls)}</div>
      </div>
      <div class="character-showcase">
        <div class="character-art-card"><div class="pixel-frame"><div class="character-ribbon">${c.label}</div>${model(c.model)}</div><h2>${c.label}</h2><p>${c.desc}</p><div class="weapon-badge">⚔ ${w.name}</div></div>
        <div class="equipment-paper-card"><h3>🛡 Equipment</h3><div class="paper-grid">
          <div class="equip-visual empty">HEAD</div><div class="equip-visual armor">ARMOR</div><div class="equip-visual empty">RING</div>
          <div class="equip-visual weapon">${sheet(w.icon)}<b>${w.name}</b><small>ATK +${w.atk}</small></div><div class="paper-mini">${model(c.model)}</div>
        </div><div class="equipment-list"><div>⚔ Weapon <b>${w.name}</b></div><div>🛡 Armor <b>Leather Armor</b></div><div>💍 Ring <b>Ruby Ring</b></div></div></div>
        <div class="character-info-card"><h3>📊 Character</h3><div class="level-line"><b>Adventurer Lv.1</b><span>EXP 0/100</span></div><div class="resource"><span>HP</span><b>240 / 240</b></div><div class="resource"><span>MP</span><b>80 / 80</b></div><div class="attribute-grid"><div>STR <b>28</b></div><div>AGI <b>18</b></div><div>INT <b>12</b></div><div>VIT <b>25</b></div></div><div class="weapon-bonus"><b>${w.name}</b><br>${w.bonus}</div></div>
      </div>`;
    host.replaceChildren(shell);
    shell.addEventListener('click',e=>{const b=e.target.closest('[data-class]');if(b)switchClass(b.dataset.class)});
  }

  function syncAllHeroModels(){
    const c=currentClass();
    document.documentElement.dataset.heroClass=savedClass();
    document.querySelectorAll('.sprite-hero').forEach(el=>{
      const u=el.querySelector('use');
      if(u && el.closest('.characterView,.paperdoll,.hero-unit'))u.setAttribute('href',`assets/hero-class-models.svg#${c.model}`);
    });
  }

  function tick(){
    if(document.getElementById('character')?.classList.contains('active'))renderCharacterUpgrade();
    syncAllHeroModels();
  }
  window.addEventListener('load',()=>{setTimeout(tick,250);setInterval(tick,700)});
})();