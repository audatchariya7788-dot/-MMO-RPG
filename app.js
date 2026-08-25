/* MMA : RPG — Unified Runtime v2
 * Single source of truth for Character / Inventory / Equipment / Stats / Battle.
 * Phase C assets are consumed as normal SVG images with safe fallbacks.
 */
(() => {
  'use strict';

  const VERSION = '2026-08-25-v2';
  const SAVE_KEY = 'mma-rpg-save-v2';
  const CLASS_KEY = 'mma-rpg-class';

  const CLASSES = {
    Warrior: { label:'Warrior', desc:'สมดุล เน้น STR/DEF', asset:'hero-warrior.svg', weapon:'long_sword', stats:{str:28,agi:18,int:12,vit:25}, hp:320, mp:120 },
    Ranger: { label:'Ranger', desc:'ความเร็วและคริติคอล', asset:'hero-ranger.svg', weapon:'bow', stats:{str:20,agi:28,int:14,vit:20}, hp:280, mp:110 },
    Mage: { label:'Mage', desc:'เวทมนตร์และ MP', asset:'hero-mage.svg', weapon:'staff', stats:{str:12,agi:16,int:32,vit:18}, hp:230, mp:220 },
    Assassin: { label:'Assassin', desc:'AGI สูง โจมตีเร็ว', asset:'hero-assassin.svg', weapon:'dual_blade', stats:{str:22,agi:34,int:12,vit:18}, hp:270, mp:100 }
  };

  const WEAPONS = {
    long_sword:{id:'long_sword',name:'Long Sword',type:'Weapon',icon:'sword',atk:12,str:2,def:1,crit:3},
    bow:{id:'bow',name:'Hunter Bow',type:'Weapon',icon:'bow',atk:10,agi:2,crit:4},
    staff:{id:'staff',name:'Arcane Staff',type:'Weapon',icon:'staff',atk:9,int:2,mp:20,crit:2},
    dual_blade:{id:'dual_blade',name:'Twin Blades',type:'Weapon',icon:'dual_blade',atk:11,agi:2,crit:5}
  };

  const BASE_ITEMS = [
    {id:'iron_sword',name:'Iron Sword',type:'Weapon',rarity:'Common',atk:18,str:4,icon:'sword'},
    {id:'steel_sword',name:'Steel Sword',type:'Weapon',rarity:'Rare',atk:31,str:8,crit:2,icon:'sword'},
    {id:'leather_armor',name:'Leather Armor',type:'Armor',rarity:'Common',def:12,vit:3,icon:'armor'},
    {id:'knight_armor',name:'Knight Armor',type:'Armor',rarity:'Rare',def:28,vit:9,icon:'armor'},
    {id:'ruby_ring',name:'Ruby Ring',type:'Ring',rarity:'Epic',atk:10,int:8,crit:4,icon:'ring'},
    {id:'health_potion',name:'Health Potion',type:'Consumable',rarity:'Common',heal:80,icon:'potion'},
    {id:'mana_potion',name:'Mana Potion',type:'Consumable',rarity:'Common',mana:50,icon:'potion'},
    {id:'adventurer_boots',name:'Adventurer Boots',type:'Armor',rarity:'Common',def:5,agi:3,icon:'armor'}
  ];

  const MONSTERS = [
    {name:'Training Goblin',level:1,hp:180,str:17,def:9,agi:10,sprite:'goblin',exp:35,gold:40},
    {name:'Forest Wolf',level:2,hp:230,str:22,def:12,agi:20,sprite:'wolf',exp:45,gold:55},
    {name:'Stone Golem',level:4,hp:360,str:30,def:24,agi:5,sprite:'golem',exp:70,gold:90},
    {name:'Dark Knight',level:7,hp:480,str:38,def:30,agi:18,sprite:'knight',exp:110,gold:140}
  ];
  const NPCS = [
    {id:'shop',name:'Mira',role:'Shopkeeper',x:2,y:2,icon:'🛒'},
    {id:'quest',name:'Eli',role:'Quest Giver',x:6,y:3,icon:'📜'},
    {id:'heal',name:'Luna',role:'Healer',x:10,y:7,icon:'💚'},
    {id:'forge',name:'Borin',role:'Blacksmith',x:3,y:8,icon:'⚒️'}
  ];
  const QUESTS = [
    {id:'goblin',title:'Goblin Hunt',desc:'กำจัด Monster 3 ตัว',need:3,reward:200,exp:80},
    {id:'forest',title:'Into the Forest',desc:'ชนะการต่อสู้ 5 ครั้ง',need:5,reward:400,exp:150}
  ];

  const clone = x => JSON.parse(JSON.stringify(x));
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const asset = name => `assets/${name}?v=${VERSION}`;
  const className = () => localStorage.getItem(CLASS_KEY) || 'Warrior';
  const heroClass = () => CLASSES[className()] || CLASSES.Warrior;
  const weaponForClass = c => WEAPONS[c.weapon] || WEAPONS.long_sword;
  const heroImg = (c, extra='') => `<img class="hero-runtime ${extra}" src="${asset(c.asset)}" alt="${esc(c.label)} hero" draggable="false" onerror="this.onerror=null;this.src='${asset('hero.svg')}'">`;
  const icon = (id, extra='sprite sprite-icon') => `<svg class="${extra}" aria-hidden="true"><use href="assets/sprites.svg#${id}"></use></svg>`;

  const DEFAULT = {
    version:VERSION,
    hero:{level:1,exp:0,gold:250,hp:240,maxHp:240,mp:80,maxMp:80,str:24,agi:18,int:12,vit:22},
    inventory:clone(BASE_ITEMS),
    equipment:{Weapon:'iron_sword',Armor:'leather_armor',Ring:null},
    monster:null, log:['ยินดีต้อนรับสู่ Greenvale — เริ่มการผจญภัยได้เลย'], loot:[],
    map:{x:5,y:6}, kills:0, quests:{goblin:0,forest:0}
  };
  let state = clone(DEFAULT), gameStarted=false, currentFilter='All';

  function normalize(){
    if(!state || typeof state!=='object') state=clone(DEFAULT);
    state.hero={...DEFAULT.hero,...(state.hero||{})};
    state.inventory=Array.isArray(state.inventory)?state.inventory:clone(BASE_ITEMS);
    state.equipment={...DEFAULT.equipment,...(state.equipment||{})};
    state.log=Array.isArray(state.log)?state.log:[];
    state.loot=Array.isArray(state.loot)?state.loot:[];
    state.map={...DEFAULT.map,...(state.map||{})};
    state.quests={...DEFAULT.quests,...(state.quests||{})};
    if(state.monster && typeof state.monster==='object') state.monster={...MONSTERS[0],...state.monster};
    state.version=VERSION;
  }

  function findItem(id){ return state.inventory.find(x=>x.id===id) || Object.values(WEAPONS).find(x=>x.id===id); }
  function log(text){ state.log.unshift(text); state.log=state.log.slice(0,60); }
  function stats(){
    const s={...state.hero,atk:0,def:0,crit:5};
    Object.values(state.equipment).forEach(id=>{const x=findItem(id);if(!x)return;['atk','def','str','agi','int','vit','crit'].forEach(k=>s[k]=(s[k]||0)+(x[k]||0));});
    s.attack=Math.max(1,Math.floor(s.str*1.8+s.agi*.35+s.atk));
    s.defense=Math.max(0,Math.floor(s.vit*.8+s.def));
    s.hit=Math.min(99,90+s.agi*.3); s.dodge=Math.min(60,s.agi*.18);
    return s;
  }
  function save(){ try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));log('💾 Game saved.');render();}catch(e){log('Save failed');} }
  function load(){
    try{const raw=localStorage.getItem(SAVE_KEY);if(!raw){log('ยังไม่มี Save Game');render();return false;}state=JSON.parse(raw);normalize();gameStarted=true;hideMenu();render();log('↻ Game loaded.');return true;}catch(e){state=clone(DEFAULT);log('Save file เสีย — โหลดค่าเริ่มต้นแทน');render();return false;}
  }
  function newGame(){state=clone(DEFAULT);localStorage.removeItem(SAVE_KEY);gameStarted=true;hideMenu();log('🎮 เริ่มเกมใหม่!');render();}
  function openGame(){gameStarted=true;hideMenu();render();}
  function menu(){gameStarted=false;$('game')?.classList.add('hidden');$('menu')?.classList.remove('hidden');$('loading')?.classList.add('hidden');}
  function hideMenu(){$('menu')?.classList.add('hidden');$('game')?.classList.remove('hidden');$('loading')?.classList.add('hidden');}
  function openTab(id){if(!gameStarted)return;document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.id===id));render();}

  function switchClass(id){
    if(!CLASSES[id])return;localStorage.setItem(CLASS_KEY,id);
    const c=CLASSES[id], old=state.hero, hpRatio=old.maxHp?old.hp/old.maxHp:1, mpRatio=old.maxMp?old.mp/old.maxMp:1;
    state.hero.maxHp=c.hp;state.hero.maxMp=c.mp;state.hero.hp=Math.round(c.hp*hpRatio);state.hero.mp=Math.round(c.mp*mpRatio);
    state.hero.str=c.stats.str;state.hero.agi=c.stats.agi;state.hero.int=c.stats.int;state.hero.vit=c.stats.vit;
    const w=weaponForClass(c); if(!state.inventory.some(x=>x.id===w.id)){state.inventory.push({...w,rarity:'Signature'});} state.equipment.Weapon=w.id;
    log(`⚔ เปลี่ยนอาชีพเป็น ${c.label} • ${w.name}`);render();
  }

  function classCard(id,c){const w=weaponForClass(c);return `<button class="phasec-class ${className()===id?'selected':''}" data-class="${id}">${heroImg(c)}<b>${c.label}</b><small>${c.desc}</small><em>${w.name}</em><span class="class-bonus">${itemDesc(w)}</span></button>`;}
  function renderCharacter(){
    const host=$('characterView');if(!host)return;const c=heroClass(),w=weaponForClass(c),s=stats();
    host.innerHTML=`<div class="phasec-character-complete">
      <div class="phasec-class-panel"><div class="phasec-heading"><div><h3>⚔ Hero Class & Weapon</h3><p class="muted">เลือกอาชีพเพื่อเปลี่ยนโมเดล อาวุธ ค่าสถานะ และ Runtime ใน World / Battle / Equipment</p></div><div class="phasec-current">${heroImg(c)}<b>${c.label}</b><span>${w.name}</span></div></div><div class="phasec-classes">${Object.entries(CLASSES).map(([id,x])=>classCard(id,x)).join('')}</div></div>
      <div class="character-showcase">
        <section class="character-art-card"><div class="section-label">👤 Hero Preview</div><div class="pixel-frame"><div class="character-ribbon">${c.label}</div>${heroImg(c,'hero-model-large')}<div class="pixel-floor"></div></div><h2>${c.label} — Lv. ${state.hero.level}</h2><p>${c.desc}</p><div class="weapon-badge">⚔ ${w.name}</div></section>
        <section class="equipment-paper-card"><div class="section-label">🛡 Equipment</div><div class="paper-grid"><div class="equip-visual head"><span>HEAD</span>${icon('armor')}<b>Steel Helm</b></div><div class="equip-visual armor"><span>ARMOR</span>${icon('armor')}<b>${c.label} Armor</b></div><div class="equip-visual accessory"><span>ACCESSORY</span>${icon('ring')}<b>Ruby Ring</b></div><div class="equip-visual weapon"><span>WEAPON</span>${icon(w.icon)}<b>${w.name}</b><small>ATK +${w.atk}</small></div><div class="paper-mini">${heroImg(c)}</div></div><div class="weapon-detail"><div>${icon(w.icon)}</div><div><strong>${w.name}</strong> <span class="rarity">★★★</span><br><span>${itemDesc(w)}</span></div></div></section>
        <section class="character-info-card"><div class="section-label">📊 Character Stats</div><div class="level-line"><b>Lv. ${state.hero.level} ${c.label}</b><span>EXP ${state.hero.exp}/100</span></div><div class="resource-row"><span>HP</span><i><b style="width:${Math.max(0,state.hero.hp/state.hero.maxHp*100)}%"></b></i><strong>${state.hero.hp}/${state.hero.maxHp}</strong></div><div class="resource-row"><span>MP</span><i><b style="width:${Math.max(0,state.hero.mp/state.hero.maxMp*100)}%"></b></i><strong>${state.hero.mp}/${state.hero.maxMp}</strong></div><div class="attribute-grid"><div>💎 STR <b>${s.str}</b></div><div>⚡ AGI <b>${s.agi}</b></div><div>🔮 INT <b>${s.int}</b></div><div>🛡 VIT <b>${s.vit}</b></div></div><div class="combat-stat-grid"><div>ATK <b>${s.attack}</b></div><div>DEF <b>${s.defense}</b></div><div>CRIT <b>${s.crit}%</b></div><div>DODGE <b>${s.dodge.toFixed(1)}%</b></div></div></section>
      </div><div class="phasec-sprite-spec"><b>Sprite / Asset Runtime</b><span>32×32 design target • SVG source • Class → Equipment → Character → Battle</span></div></div>`;
    host.querySelectorAll('[data-class]').forEach(b=>b.addEventListener('click',()=>switchClass(b.dataset.class)));
  }

  function renderWorld(){
    const w=$('worldMap');if(!w)return;let html='';
    for(let y=0;y<12;y++)for(let x=0;x<16;x++){const terrain=(x>=7&&y>=3&&x<=14&&y<=10)?'forest':(x<=5&&y>=5)?'water':((x+y)%7===0?'road':'grass');const npc=NPCS.find(n=>n.x===x&&n.y===y);const player=state.map.x===x&&state.map.y===y;html+=`<div class="tile ${terrain}">${npc?`<button class="map-npc" onclick="talk('${npc.id}')">${npc.icon}</button>`:''}${player?heroImg(heroClass(),'player-world'):''}</div>`;}
    w.innerHTML=html;$('worldStatus').textContent=`Position ${state.map.x},${state.map.y} • Kills ${state.kills}`;$('npcList').innerHTML=NPCS.map(n=>`<div class="npc-row"><span>${n.icon}</span><div><b>${n.name}</b><small>${n.role}</small></div><button onclick="talk('${n.id}')">Talk</button></div>`).join('');
  }

  function renderBattle(){
    const c=heroClass(),m=state.monster||MONSTERS[0];
    const old=$('.hero-unit .sprite-hero');if(old){const img=document.createElement('div');img.className='hero-runtime-battle';img.innerHTML=heroImg(c);old.replaceWith(img);}
    const portrait=document.querySelector('#battle .hero-runtime-battle .hero-runtime');if(portrait){portrait.classList.add('battle-hero');}
    $('heroLevel').textContent=`Lv.${state.hero.level}`;$('heroHpBar').style.width=`${Math.max(0,state.hero.hp/state.hero.maxHp*100)}%`;$('heroHpText').textContent=`HP ${state.hero.hp}/${state.hero.maxHp} • MP ${state.hero.mp}/${state.hero.maxMp}`;$('monsterName').textContent=`${m.name} • Lv.${m.level}`;
    const u=$('monsterImage')?.querySelector('use');if(u)u.setAttribute('href',`assets/sprites.svg#${m.sprite}`);$('monsterHpBar').style.width=`${Math.max(0,m.hp/m.maxHp*100)}%`;$('monsterHpText').textContent=`HP ${Math.max(0,m.hp)}/${m.maxHp} • DEF ${m.def}`;
    $('combatLog').innerHTML=state.log.map(x=>`<div>${esc(x)}</div>`).join('');
    const s=stats();$('damageBreakdown').innerHTML=[['ATK',s.attack],['Monster DEF',m.def],['Raw',Math.max(1,s.attack-m.def)],['Range',`${Math.max(1,s.attack-m.def-5)} – ${Math.max(1,s.attack-m.def+6)}`],['Critical',s.crit+'%'],['Hit',s.hit.toFixed(1)+'%'],['Dodge',s.dodge.toFixed(1)+'%']].map(x=>`<div class="stat"><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');
  }

  function renderInventory(){const inv=state.inventory.filter(x=>currentFilter==='All'||x.type===currentFilter);$('slotCount').textContent=`${state.inventory.length} items`;$('inventoryView').innerHTML=inv.map(x=>`<div class="item"><div>${icon(x.icon)}</div><h3>${esc(x.name)}</h3><div class="rarity ${esc(x.rarity)}">${esc(x.rarity)} • ${esc(x.type)}</div><p>${itemDesc(x)}</p>${x.type==='Consumable'?`<button onclick="useItem('${x.id}')">Use</button>`:`<button onclick="equip('${x.id}')" class="primary">Equip</button>`}</div>`).join('')||'<p class="muted">No items.</p>';}
  function renderEquipment(){const s=stats();$('equipmentView').innerHTML=Object.entries(state.equipment).map(([slot,id])=>{const x=findItem(id);return `<div class="equip-slot"><b>${slot}</b><h3>${x?esc(x.name):'Empty'}</h3>${x?icon(x.icon):''}<p class="muted">${x?itemDesc(x):'Choose an item from Inventory.'}</p>${x?`<button onclick="unequip('${slot}')">Unequip</button>`:''}</div>`}).join('');$('equipStats').innerHTML=[['ATK',s.attack],['DEF',s.defense],['CRIT',s.crit+'%'],['HIT',s.hit.toFixed(1)+'%'],['DODGE',s.dodge.toFixed(1)+'%']].map(x=>`<div class="stat"><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');const p=document.querySelector('#equipment .paperdoll');if(p&&!p.querySelector('.hero-runtime'))p.innerHTML=`${heroImg(heroClass())}<b>Paper Doll</b>`;}
  function renderStats(){const s=stats();$('statsView').innerHTML=Object.entries(s).filter(([k])=>['str','agi','int','vit','atk','def','crit','attack','defense','hit','dodge'].includes(k)).map(([k,v])=>`<div class="stat"><span>${k.toUpperCase()}</span><b>${typeof v==='number'?Math.round(v*100)/100:v}</b></div>`).join('');$('formulaText').textContent=`Damage = max(1, ATK − DEF + Random(-5..+6)); Critical (${s.crit}%) × 1.75`;}
  function renderLists(){
    $('monsterView').innerHTML=MONSTERS.map(x=>`<div class="item monster-card">${icon(x.sprite,'sprite monster-mini')}<div><h3>${x.name}</h3><p>Lv.${x.level} • HP ${x.hp} • STR ${x.str} • DEF ${x.def} • AGI ${x.agi}</p><button onclick="spawn('${x.name}')">Fight</button></div></div>`).join('');
    $('questView').innerHTML=QUESTS.map(q=>{const p=state.quests[q.id]||0,done=p>=q.need;return `<div class="item"><h3>${q.title} ${done?'✅':''}</h3><p>${q.desc}</p><div class="quest-bar"><i style="width:${Math.min(100,p/q.need*100)}%"></i></div><small>${p}/${q.need} • Reward ${q.reward} Gold + ${q.exp} EXP</small></div>`}).join('');
    $('lootView').innerHTML=state.loot.length?state.loot.map(x=>`<div class="item">${icon(x.icon)}<h3>${esc(x.name)}</h3><span class="rarity ${esc(x.rarity)}">${esc(x.rarity)}</span><p>${itemDesc(x)}</p></div>`).join(''):'<p class="muted">No loot yet. Defeat a monster.</p>';
  }
  function itemDesc(x){return Object.entries(x).filter(([k])=>['atk','def','str','agi','int','vit','crit','heal','mana'].includes(k)).map(([k,v])=>`${k.toUpperCase()} +${v}`).join(' · ')||'No bonus';}

  function spawn(name){const base=name?MONSTERS.find(x=>x.name===name):MONSTERS[Math.floor(Math.random()*MONSTERS.length)];const scale=Math.max(0,state.hero.level-1);state.monster={...base,level:base.level+Math.floor(scale*.45),hp:base.hp+scale*18,maxHp:base.hp+scale*18,str:base.str+scale*2,def:base.def+Math.floor(scale*.8)};log(`👹 พบ ${state.monster.name} Lv.${state.monster.level}!`);openTab('battle');}
  function startEncounter(){if(!state.monster||state.monster.hp<=0)spawn();}
  function monsterAttack(){if(!state.monster||state.monster.hp<=0)return;const s=stats();if(Math.random()*100<s.dodge){log('🛡 Dodge!');return;}const d=Math.max(1,state.monster.str-s.defense+Math.floor(Math.random()*5));state.hero.hp=Math.max(0,state.hero.hp-d);log(`👹 ${state.monster.name} hits ${d} damage`);if(state.hero.hp<=0){state.hero.hp=Math.ceil(state.hero.maxHp*.35);state.hero.mp=Math.ceil(state.hero.maxMp*.35);log('💀 ล้มในการต่อสู้ แต่ได้รับการช่วยเหลือกลับมา');}}
  function victory(){const m=state.monster;state.kills++;state.hero.exp+=m.exp;state.hero.gold+=m.gold;state.quests.goblin=Math.min(3,state.quests.goblin+1);state.quests.forest=Math.min(5,state.quests.forest+1);const drop=BASE_ITEMS[(state.kills%4)+1]||BASE_ITEMS[1];state.loot.unshift({...drop});if(Math.random()<.5)state.inventory.push({...drop,id:`drop_${Date.now()}`});log(`🏆 Victory! +${m.exp} EXP +${m.gold} Gold`);if(state.hero.exp>=100){state.hero.exp-=100;state.hero.level++;state.hero.maxHp+=25;state.hero.maxMp+=10;state.hero.hp=state.hero.maxHp;state.hero.mp=state.hero.maxMp;log(`⭐ Level Up! Lv.${state.hero.level}`);}state.monster=null;}
  function attack(){startEncounter();const s=stats(),m=state.monster;if(Math.random()*100>s.hit){log('⚔ Miss!');monsterAttack();render();return;}let d=Math.max(1,s.attack-m.def+Math.floor(Math.random()*12)-5);const crit=Math.random()*100<s.crit;if(crit)d=Math.floor(d*1.75);m.hp-=d;window.mmaAnim?.mode('attack',450);log(`⚔ ${crit?'CRITICAL ':''}${d} damage`);if(m.hp<=0)victory();else monsterAttack();render();}
  function skill(){startEncounter();if(state.hero.mp<15){log('MP ไม่พอ');render();return;}state.hero.mp-=15;const m=state.monster,d=Math.max(5,Math.floor(stats().attack*1.35)-m.def);m.hp-=d;window.mmaAnim?.mode('attack',500);log(`✨ Power Slash ${d} damage`);if(m.hp<=0)victory();else monsterAttack();render();}
  function heal(){if(state.hero.mp<10){log('MP ไม่พอ');render();return;}state.hero.mp-=10;const n=Math.min(60,state.hero.maxHp-state.hero.hp);state.hero.hp+=n;log(`💚 Heal +${n} HP`);render();}
  function potion(){const x=state.inventory.find(i=>i.type==='Consumable'&&i.heal);if(!x){log('ไม่มี Potion');render();return;}useItem(x.id);}
  function run(){state.monster=null;log('🏃 หนีออกจากการต่อสู้');openTab('world');}
  function move(dx,dy){const nx=Math.max(0,Math.min(15,state.map.x+dx)),ny=Math.max(0,Math.min(11,state.map.y+dy));state.map.x=nx;state.map.y=ny;if(NPCS.some(n=>n.x===nx&&n.y===ny))log('พบ NPC — กด Talk เพื่อโต้ตอบ');if(nx>=7&&ny>=3&&nx<=14&&ny<=10&&Math.random()<.18)spawn();render();}
  function talk(id){const n=NPCS.find(x=>x.id===id);if(!n)return;if(Math.abs(state.map.x-n.x)+Math.abs(state.map.y-n.y)>2){log(`เดินเข้าใกล้ ${n.name} ก่อน`);render();return;}if(id==='heal'){fullHeal();openDialog(`<h2>💚 Luna — Healer</h2><p>ฟื้น HP และ MP ให้เต็มแล้ว</p>`)}else if(id==='shop'){openDialog(`<h2>🛒 Mira — Shopkeeper</h2><p>Gold: ${state.hero.gold}</p><button onclick="buyPotion()">Potion — 30 Gold</button><button onclick="buySteel()">Steel Sword — 180 Gold</button>`)}else if(id==='quest'){openDialog(`<h2>📜 Eli — Quest Giver</h2><p>กำจัด Monster 3 ตัวเพื่อฝึกฝน</p><button onclick="openTab('quests');closeDialog()">รับภารกิจ</button>`)}else openTab('equipment');}
  function equip(id){const x=findItem(id);if(!x||x.type==='Consumable')return;const slot=x.type==='Weapon'?'Weapon':x.type==='Armor'?'Armor':'Ring';state.equipment[slot]=id;log(`🛡 Equipped ${x.name}`);render();}
  function unequip(slot){state.equipment[slot]=null;render();}
  function useItem(id){const x=findItem(id);if(!x)return;if(x.heal){const n=Math.min(x.heal,state.hero.maxHp-state.hero.hp);state.hero.hp+=n;state.inventory=state.inventory.filter(i=>i.id!==id);log(`🧪 +${n} HP`);}else if(x.mana){const n=Math.min(x.mana,state.hero.maxMp-state.hero.mp);state.hero.mp+=n;state.inventory=state.inventory.filter(i=>i.id!==id);log(`🔷 +${n} MP`);}render();}
  function buyPotion(){if(state.hero.gold<30){log('Gold ไม่พอ');render();return;}state.hero.gold-=30;state.inventory.push({...BASE_ITEMS[5],id:'p_'+Date.now()});render();}
  function buySteel(){if(state.hero.gold<180){log('Gold ไม่พอ');render();return;}state.hero.gold-=180;state.inventory.push({...BASE_ITEMS[1],id:'s_'+Date.now()});render();}
  function fullHeal(){state.hero.hp=state.hero.maxHp;state.hero.mp=state.hero.maxMp;log('💚 HP/MP เต็มแล้ว');render();}
  function levelUp(){state.hero.level++;state.hero.maxHp+=25;state.hero.maxMp+=10;state.hero.hp=state.hero.maxHp;state.hero.mp=state.hero.maxMp;log(`⭐ GM: Level ${state.hero.level}`);render();}
  function addGold(){state.hero.gold+=1000;log('🪙 GM: +1,000 Gold');render();}
  function clearLoot(){state.loot=[];render();}
  function createGMItem(){const name=$('gmName')?.value||'Test Item',type=$('gmType')?.value||'Weapon',atk=Number($('gmAtk')?.value||0),def=Number($('gmDef')?.value||0),str=Number($('gmStr')?.value||0),agi=Number($('gmAgi')?.value||0),crit=Number($('gmCrit')?.value||0);state.inventory.push({id:`gm_${Date.now()}`,name,type,rarity:'GM',atk,def,str,agi,crit,icon:type==='Weapon'?'sword':type==='Armor'?'armor':'ring'});log(`🧪 Created ${name}`);render();}
  function openDialog(html){$('dialogContent').innerHTML=html;$('dialog').classList.remove('hidden');} function closeDialog(){$('dialog').classList.add('hidden');}

  function render(){
    normalize(); if(!state.monster){} const s=stats();
    if($('topGold'))$('topGold').textContent=`🪙 ${state.hero.gold}`;
    renderWorld();renderBattle();renderCharacter();renderInventory();renderEquipment();renderStats();renderLists();
    document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b.dataset.filter===currentFilter));
    if($('loading'))$('loading').classList.add('hidden');
    if(gameStarted){$('menu')?.classList.add('hidden');$('game')?.classList.remove('hidden');}
  }

  document.addEventListener('DOMContentLoaded',()=>{
    try{const raw=localStorage.getItem(SAVE_KEY);if(raw){state=JSON.parse(raw);normalize();}else{const old=localStorage.getItem('mma-rpg-save');if(old){state=JSON.parse(old);normalize();}}}catch(e){state=clone(DEFAULT);}
    document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>openTab(b.dataset.tab)));
    document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{currentFilter=b.dataset.filter;render();}));
    document.addEventListener('keydown',e=>{if(!gameStarted)return;const k=e.key.toLowerCase();if(['arrowup','w'].includes(k))move(0,-1);if(['arrowdown','s'].includes(k))move(0,1);if(['arrowleft','a'].includes(k))move(-1,0);if(['arrowright','d'].includes(k))move(1,0);});
    $('newGameBtn')?.addEventListener('click',newGame);$('continueBtn')?.addEventListener('click',openGame);$('loadGameBtn')?.addEventListener('click',load);$('menuBtn')?.addEventListener('click',menu);$('saveBtn')?.addEventListener('click',save);$('loadBtn')?.addEventListener('click',load);
    $('attackBtn')?.addEventListener('click',attack);$('skillBtn')?.addEventListener('click',skill);$('healBtn')?.addEventListener('click',heal);$('potionBtn')?.addEventListener('click',potion);$('runBtn')?.addEventListener('click',run);
    $('gmAddBtn')?.addEventListener('click',createGMItem);$('fullHealBtn')?.addEventListener('click',fullHeal);$('spawnBtn')?.addEventListener('click',()=>spawn());$('levelBtn')?.addEventListener('click',levelUp);$('goldBtn')?.addEventListener('click',addGold);$('clearLootBtn')?.addEventListener('click',clearLoot);
    render();
    setTimeout(()=>{if(!gameStarted){$('loading')?.classList.add('hidden');$('menu')?.classList.remove('hidden');}},350);
  });

  Object.assign(window,{save,load,newGame,openGame,menu,openTab,spawn,attack,skill,heal,potion,run,move,talk,equip,unequip,useItem,buyPotion,buySteel,fullHeal,levelUp,addGold,clearLoot,createGMItem,openDialog,closeDialog,render});
  window.MMACharacterSpec={CLASSES,WEAPONS,switchClass,renderCharacter};
})();
