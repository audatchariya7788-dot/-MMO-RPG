/* MMA : RPG — Canonical Game Catalog v6 */
(function () {
  'use strict';
  const DATA = {
  "schemaVersion": "6.0.0",
  "game": "MMA : RPG",
  "mode": "single-player",
  "canonical": true,
  "updated": "2026-08-31",
  "baseline": {
    "class": "Warrior",
    "level": 1,
    "hp": {"current": 240, "max": 240},
    "mp": {"current": 80, "max": 80},
    "weapon": "steel_sword",
    "armor": "leather_armor",
    "ring": null,
    "derivedStats": {"atk": 94, "def": 32, "crit": 7, "hit": 95.4, "dodge": 3.2}
  },
  "items": [
    {"id":"iron_sword","name":"Iron Sword","type":"Weapon","rarity":"Common","mods":{"atk":18,"str":4}},
    {"id":"steel_sword","name":"Steel Sword","type":"Weapon","rarity":"Rare","mods":{"atk":31,"str":8,"crit":2}},
    {"id":"leather_armor","name":"Leather Armor","type":"Armor","rarity":"Common","mods":{"def":12,"vit":3}},
    {"id":"knight_armor","name":"Knight Armor","type":"Armor","rarity":"Rare","mods":{"def":28,"vit":9}},
    {"id":"ruby_ring","name":"Ruby Ring","type":"Ring","rarity":"Epic","mods":{"atk":10,"int":8,"crit":4}},
    {"id":"health_potion","name":"Health Potion","type":"Consumable","rarity":"Common","mods":{"heal":80}},
    {"id":"mana_potion","name":"Mana Potion","type":"Consumable","rarity":"Common","mods":{"mana":50}},
    {"id":"adventurer_boots","name":"Adventurer Boots","type":"Armor","rarity":"Common","mods":{"def":5,"agi":3}}
  ],
  "monsters": [
    {"id":"training_goblin","name":"Training Goblin","level":1,"hp":180,"def":9,"str":17,"agi":10,"exp":35,"gold":40},
    {"id":"forest_wolf","name":"Forest Wolf","level":2,"hp":230,"def":12,"str":22,"agi":20,"exp":45,"gold":55},
    {"id":"stone_golem","name":"Stone Golem","level":4,"hp":360,"def":24,"str":30,"agi":5,"exp":70,"gold":90},
    {"id":"dark_knight","name":"Dark Knight","level":7,"hp":480,"def":30,"str":38,"agi":18,"exp":110,"gold":140}
  ],
  "combat": {
    "normalDamage": "max(1, ATK - DEF + random(-5..6))",
    "criticalMultiplier": 1.75,
    "powerSlash": "max(5, floor(ATK * 1.35) - Monster DEF)",
    "powerSlashMpCost": 15,
    "hitFormula": "min(99, 90 + AGI * 0.3)",
    "dodgeFormula": "min(60, AGI * 0.18)"
  },
  "pipeline": ["Inventory","Equipment","Stats","Damage","Battle","Loot","Save"],
  "save": {"clientKey":"mma-rpg-save-v2","backupKey":"mma-rpg-save-v4"},
  "deployment": {"provider":"Cloudflare Workers Static Assets","target":"mmo-rpg.audatchariya7788.workers.dev","sourceBranch":"main"}
};
  window.MMA_GAME_DATA = DATA;
  window.MMA_GAME_DATA_VERSION = DATA.schemaVersion;
  window.MMA_GAME_DATA_API = {
    getItem(id) { return DATA.items.find(x => x.id === id) || null; },
    getMonster(id) { return DATA.monsters.find(x => x.id === id) || null; },
    baseline() { return JSON.parse(JSON.stringify(DATA.baseline)); },
    validate() {
      const errors = [];
      if (DATA.schemaVersion !== '6.0.0') errors.push('Unexpected catalog schema');
      if (!Array.isArray(DATA.items) || DATA.items.length < 8) errors.push('Item catalog incomplete');
      if (!Array.isArray(DATA.monsters) || DATA.monsters.length < 4) errors.push('Monster catalog incomplete');
      if (DATA.baseline.derivedStats.atk !== 94) errors.push('QA baseline ATK mismatch');
      if (DATA.baseline.derivedStats.def !== 32) errors.push('QA baseline DEF mismatch');
      if (!DATA.combat.normalDamage || !DATA.combat.powerSlash) errors.push('Combat formulas missing');
      return { ok: errors.length === 0, errors };
    }
  };
  const result = window.MMA_GAME_DATA_API.validate();
  document.documentElement.dataset.mmaCatalog = result.ok ? 'pass' : 'fail';
  if (!result.ok) console.warn('[MMA catalog]', result.errors);
})();