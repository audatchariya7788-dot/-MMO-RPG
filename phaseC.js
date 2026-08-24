(() => {
  const CLASSES={
    Warrior:{label:'Warrior',desc:'สมดุล เน้น STR/DEF',sprite:'warrior_idle',model:'warrior',weapon:'long_sword',stats:{str:4,agi:1,int:0,vit:3}},
    Ranger:{label:'Ranger',desc:'ความเร็วและคริติคอล',sprite:'ranger_idle',model:'ranger',weapon:'bow',stats:{str:1,agi:5,int:1,vit:1}},
    Mage:{label:'Mage',desc:'เวทมนตร์และ MP',sprite:'mage_idle',model:'mage',weapon:'staff',stats:{str:0,agi:1,int:6,vit:1}},
    Assassin:{label:'Assassin',desc:'AGI สูง โจมตีเร็ว',sprite:'assassin_idle',model:'assassin',weapon:'dual_blade',stats:{str:2,agi:6,int:0,vit:0}}
  };
  const WEAPONS={
    long_sword:{id:'class_long_sword',name:'Long Sword',icon:'sword_long',atk:28,str:6,crit:1,rarity:'Rare'},
    bow:{id:'class_bow',name:'Hunter Bow',icon:'bow',atk:25,agi:7,crit:4,rarity:'Rare'},
    staff:{id:'class_staff',name:'Arcane Staff',icon:'staff',atk:20,int:10,crit:2,rarity:'Epic'},
    dual_blade:{id:'class_dual_blade',name:'Twin Blades',icon:'dual_blade',atk:27,agi:8,crit:5,rarity:'Epic'}
  };
  const key='mma-rpg-class',appliedKey='mma-rpg-applied-class';
  const savedClass=()=>localStorage.getItem(key)||'Warrior';
  const currentWeapon=()=>WEAPONS[localStorage.getItem('mma-rpg-class-weapon')]||WEAPONS[CLASSES[savedClass()].weapon];
  const model=id=>`<svg class="hero-model" viewBox="0 0 128 160" preserveAspectRatio="xMidYMid meet"><use href="assets/hero-class-models.svg#${id}"></use></svg>`;
  const sheet=id=>`<svg class="phasec-sprite" viewBox="0 0 32 32"><use href="assets/sprite-sheet-32.svg#${id}"></use></svg>`;

  function saveStateAndReload(cls,weaponKey){
    document.getElementById('saveBtn')?.click();const now=localStorage.getItem('mma-rpg-save');if(!now)return;
    try{const s=JSON.parse(now),oldName=localStorage.getItem(appliedKey),old=oldName?CLASSES[oldName]:null,c=CLASSES[cls],w=WEAPONS[weaponKey];
      s.hero=s.hero||{};for(const k of ['str','agi','int','vit'])s.hero[k]=(s.hero[k]||0)-(old?.stats[k]||0)+(c.stats[k]||0);
      s.inventory=s.inventory||[];s.inventory=s.inventory.filter(x=>!String(x.id).startsWith('class_'));
      s.inventory.push({id:w.id,name:w.name,type:'Weapon',rarity:w.rarity,atk:w.atk,str:w.str||0,agi:w.agi||0,int:w.int||0,crit:w.crit||0,icon:w.icon,class:cls});
      s.equipment=s.equipment||{};s.equipment.Weapon=w.id;
      localStorage.setItem('mma-rpg-save',JSON.stringify(s));localStorage.setItem(key,cls);localStorage.setItem(appliedKey,cls);localStorage.setItem('mma-rpg-class-weapon',weaponKey);location.reload();
    }catch(e){console.error('Phase C class switch failed',e)}}

  function installPanel(){
    const host=document.getElementById('characterView');if(!host||host.querySelector('.phasec-panel'))return;
    const current=savedClass(),c=CLASSES[current],w=currentWeapon(),panel=document.createElement('div');panel.className='panel inner phasec-panel';
    panel.innerHTML=`<div class="phasec-heading"><div><h3>⚔ Hero Class & Weapon</h3><p class="muted">เลือกอาชีพเพื่อเปลี่ยนโมเดลตัวละคร อาวุธ และค่าสถานะจริง</p></div><div class="phasec-current">${model(c.model)}<b>${c.label}</b><span>${w.name}</span></div></div><div class="phasec-classes">${Object.entries(CLASSES).map(([id,x])=>`<button class="phasec-class ${id===current?'selected':''}" data-class="${id}">${model(x.model)}<b>${x.label}</b><small>${x.desc}</small><em>${WEAPONS[x.weapon].name}</em></button>`).join('')}</div><div class="phasec-note">32×32 Runtime Sprite + Character Model • 4 Classes • 4 Signature Weapons • World / Battle / Character / Equipment</div>`;
    host.prepend(panel);panel.addEventListener('click',e=>{const b=e.target.closest('[data-class]');if(b)saveStateAndReload(b.dataset.class,CLASSES[b.dataset.class].weapon)})}

  function replaceHeroSprites(){
    const c=CLASSES[savedClass()]||CLASSES.Warrior,source='assets/hero-class-models.svg';
    document.querySelectorAll('.sprite-hero,.player-sprite,.character-sprite').forEach(el=>{const u=el.querySelector('use');if(u){u.setAttribute('href',`${source}#${c.model}`);u.setAttribute('href',`${source}#${c.model}`)}el.classList.add('class-model-active',`class-${savedClass().toLowerCase()}`)});
    document.documentElement.dataset.heroClass=savedClass();
    const paper=document.querySelector('.paperdoll');if(paper)paper.dataset.class=savedClass();
  }
  function replaceWeaponIcon(){const w=currentWeapon();document.querySelectorAll('.equip-slot .sprite').forEach(el=>{const text=el.closest('.equip-slot')?.textContent||'';const u=el.querySelector('use');if(u&&text.includes(w.name))u.setAttribute('href',`assets/sprite-sheet-32.svg#${w.icon}`)})}
  function updateLabels(){const c=CLASSES[savedClass()]||CLASSES.Warrior,w=currentWeapon();document.querySelectorAll('[data-hero-class-label]').forEach(el=>el.textContent=c.label);document.querySelectorAll('[data-hero-weapon-label]').forEach(el=>el.textContent=w.name)}
  function tick(){installPanel();replaceHeroSprites();replaceWeaponIcon();updateLabels()}
  window.addEventListener('load',()=>{setTimeout(tick,300);setInterval(tick,400)});
})();