const BASE={level:10,exp:0,gold:250,hp:240,maxHp:240,mp:80,maxMp:80,str:24,agi:18,int:12,vit:22};
const DEFAULT_ITEMS=[
{id:'iron_sword',name:'Iron Sword',type:'Weapon',rarity:'Common',atk:18,str:4},
{id:'steel_sword',name:'Steel Sword',type:'Weapon',rarity:'Rare',atk:31,str:8,crit:2},
{id:'leather_armor',name:'Leather Armor',type:'Armor',rarity:'Common',def:12,vit:3},
{id:'knight_armor',name:'Knight Armor',type:'Armor',rarity:'Rare',def:28,vit:9},
{id:'ruby_ring',name:'Ruby Ring',type:'Ring',rarity:'Epic',atk:10,int:8,crit:4},
{id:'health_potion',name:'Health Potion',type:'Consumable',rarity:'Common',heal:80}
];
let state={hero:{...BASE},monster:{name:'Training Goblin',level:8,hp:180,maxHp:180,str:17,def:9,agi:10},inventory:structuredClone(DEFAULT_ITEMS),equipment:{Weapon:'iron_sword',Armor:'leather_armor',Ring:null},log:['Welcome to MMA : RPG — single-player combat lab.'],lastDamage:null};
const $=id=>document.getElementById(id); const item=id=>state.inventory.find(x=>x.id===id);
function calcStats(){let s={...state.hero,atk:0,def:0,crit:5};Object.values(state.equipment).forEach(id=>{const x=item(id);if(!x)return;['atk','def','str','agi','int','vit','crit'].forEach(k=>s[k]=(s[k]||0)+(x[k]||0))});s.attack=Math.floor(s.str*1.8+s.agi*.35+s.atk);s.defense=Math.floor(s.vit*.8+s.def);return s}
function damagePreview(){const s=calcStats(),raw=s.attack-state.monster.def;return {base:s.attack,monsterDef:state.monster.def,raw,minimum:Math.max(1,raw-5),maximum:Math.max(1,raw+6),critChance:s.crit}}
function log(t){state.log.unshift(t);state.log=state.log.slice(0,40)}
function desc(x){return Object.entries(x).filter(([k])=>['atk','def','str','agi','int','vit','crit','heal'].includes(k)).map(([k,v])=>`${k.toUpperCase()} +${v}`).join(' · ')||'No bonus'}
function render(){const s=calcStats(),p=damagePreview();
$('heroCard').innerHTML=`<div class="card"><b>Lv.${state.hero.level} Adventurer</b><br><span class="muted">ATK ${s.attack} · DEF ${s.defense} · CRIT ${s.crit}%</span></div>`;
$('monsterCard').innerHTML=`<div class="card"><b>${state.monster.name}</b><br><span class="muted">Lv.${state.monster.level} · STR ${state.monster.str} · DEF ${state.monster.def} · AGI ${state.monster.agi}</span></div>`;
$('heroHpBar').style.width=`${state.hero.hp/state.hero.maxHp*100}%`;$('monsterHpBar').style.width=`${Math.max(0,state.monster.hp)/state.monster.maxHp*100}%`;
$('combatLog').innerHTML=state.log.map(x=>`<div>${x}</div>`).join('');
$('damageBreakdown').innerHTML=`<div class="stat"><span>Attack Power</span><b>${p.base}</b></div><div class="stat"><span>Monster DEF</span><b>${p.monsterDef}</b></div><div class="stat"><span>Raw Damage</span><b>${p.raw}</b></div><div class="stat"><span>Normal Range</span><b>${p.minimum}–${p.maximum}</b></div><div class="stat"><span>Critical Chance</span><b>${p.critChance}%</b></div>`;
$('characterView').innerHTML=`<div class="items"><div class="item"><h3>Adventurer</h3>Level ${state.hero.level}<br>EXP ${state.hero.exp}/100<br>Gold ${state.hero.gold}</div><div class="item"><h3>Resources</h3>HP ${state.hero.hp}/${state.hero.maxHp}<br>MP ${state.hero.mp}/${state.hero.maxMp}</div></div>`;
$('inventoryView').innerHTML=state.inventory.map(x=>`<div class="item"><h3>${x.name}</h3><div class="rarity">${x.rarity} · ${x.type}</div><p>${desc(x)}</p>${x.type==='Consumable'?`<button onclick="useItem('${x.id}')">Use</button>`:`<button onclick="equip('${x.id}')">Equip</button>`}</div>`).join('');
$('equipmentView').innerHTML=Object.entries(state.equipment).map(([slot,id])=>`<div class="equip-slot"><b>${slot}</b><p>${id?item(id).name:'Empty'}</p>${id?`<button onclick="unequip('${slot}')">Unequip</button>`:''}</div>`).join('');
$('statsView').innerHTML=Object.entries(s).filter(([k])=>['str','agi','int','vit','atk','def','crit','attack','defense'].includes(k)).map(([k,v])=>`<div class="stat"><span>${k.toUpperCase()}</span><b>${v}</b></div>`).join('');
$('lootView').innerHTML=state.inventory.slice(-8).map(x=>`<div class="item"><h3>${x.name}</h3><span class="rarity">${x.rarity}</span><p>${desc(x)}</p></div>`).join('');
}
function equip(id){const x=item(id);if(!x||x.type==='Consumable')return;const slot=x.type==='Weapon'?'Weapon':x.type==='Armor'?'Armor':'Ring';state.equipment[slot]=id;log(`Equipped ${x.name}.`);render()}
function unequip(slot){state.equipment[slot]=null;log(`Unequipped ${slot}.`);render()}
function useItem(id){const x=item(id);if(!x?.heal)return;const n=Math.min(x.heal,state.hero.maxHp-state.hero.hp);state.hero.hp+=n;state.inventory=state.inventory.filter(i=>i.id!==id);log(`Used ${x.name}: recovered ${n} HP.`);render()}
function attack(){const s=calcStats(),roll=Math.floor(Math.random()*12)-5;let d=Math.max(1,s.attack-state.monster.def+roll),critical=Math.random()<s.crit/100;if(critical)d=Math.floor(d*1.75);state.monster.hp-=d;state.lastDamage={damage:d,critical,formula:`(${s.attack} ATK − ${state.monster.def} DEF) + random(${roll})${critical?' × 1.75 CRIT':''}`};log(`You hit ${state.monster.name} for ${d}${critical?' CRITICAL':''} damage.`);if(state.monster.hp<=0){const gold=25+Math.floor(Math.random()*50);state.hero.gold+=gold;state.hero.exp+=35;log(`Victory! +${gold} gold, +35 EXP.`);drop();newMonster()}else monsterAttack();render()}
function monsterAttack(){const s=calcStats(),d=Math.max(1,state.monster.str-s.defense+Math.floor(Math.random()*8));state.hero.hp=Math.max(0,state.hero.hp-d);log(`${state.monster.name} hits you for ${d}.`);if(state.hero.hp===0){log('Defeated. HP restored for testing.');state.hero.hp=state.hero.maxHp}}
function heal(){if(state.hero.mp<10){log('Not enough MP.');return}const n=Math.min(50,state.hero.maxHp-state.hero.hp);state.hero.hp+=n;state.hero.mp-=10;log(`Skill Heal recovered ${n} HP.`);render()}
function newMonster(){const names=['Training Goblin','Forest Wolf','Stone Golem','Dark Knight','Orc Captain'];const n=names[Math.floor(Math.random()*names.length)],lv=Math.max(1,state.hero.level-1+Math.floor(Math.random()*4));state.monster={name:n,level:lv,hp:120+lv*18,maxHp:120+lv*18,str:12+lv*2,def:6+Math.floor(lv*1.1),agi:8+lv}}
function drop(){const r=Math.random();const drops=r>.9?{id:'ruby_ring_plus',name:'Ruby Ring+',type:'Ring',rarity:'Epic',atk:16,int:10,crit:5}:r>.65?{id:'tempered_sword',name:'Tempered Steel Sword',type:'Weapon',rarity:'Rare',atk:38,str:10,crit:3}:r>.25?{id:'chain_armor',name:'Chain Armor',type:'Armor',rarity:'Rare',def:21,vit:6}:item('health_potion');if(!state.inventory.some(x=>x.id===drops.id))state.inventory.push(drops);else if(drops.type==='Consumable')state.inventory.push({...drops,id:`potion_${Date.now()}`});log(`Loot acquired: ${drops.name}.`)}
function gmAdd(){const name=$('gmName').value.trim()||'Test Sword';const atk=Number($('gmAtk').value)||0;const def=Number($('gmDef').value)||0;const str=Number($('gmStr').value)||0;const id='gm_'+Date.now();state.inventory.push({id,name,type:'Weapon',rarity:'Test',atk,def,str});log(`GM created ${name}: ATK +${atk}, DEF +${def}, STR +${str}.`);render()}
function save(){localStorage.setItem('mma_rpg_save',JSON.stringify(state));log('Game saved locally.');render()}
function load(){const x=localStorage.getItem('mma_rpg_save');if(!x){log('No local save found.');render();return}state=JSON.parse(x);log('Game loaded.');render()}
function resetGame(){localStorage.removeItem('mma_rpg_save');location.reload()}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(b.dataset.tab).classList.add('active')});
$('attackBtn').onclick=attack;$('healBtn').onclick=heal;$('saveBtn').onclick=save;$('loadBtn').onclick=load;$('resetBtn').onclick=resetGame;$('gmAddBtn').onclick=gmAdd;render();
