# MMA : RPG — Design Specification

> This document is the implementation reference for the playable single-player RPG prototype. The visual design board is the visual reference; this document defines the logical structure so the game can be implemented consistently.

## 1. Core Game Flow

```text
MAIN MENU
  -> NEW GAME / CONTINUE / LOAD / SETTINGS
  -> WORLD MAP
  -> CHARACTER MOVEMENT
  -> NPC / INTERACTION
  -> RANDOM ENCOUNTER
  -> BATTLE
      -> ATTACK / SKILL / ITEM / RUN
      -> DAMAGE CALCULATION
      -> MONSTER DEFEATED
      -> EXP + GOLD + LOOT
  -> INVENTORY
  -> EQUIPMENT
  -> CHARACTER STATS
  -> RETURN TO WORLD
  -> SAVE
```

## 2. Asset Folder Contract

```text
assets/
├── backgrounds/
│   ├── main-menu.svg
│   ├── loading.svg
│   ├── town.svg
│   └── forest.svg
├── characters/
│   ├── hero_idle.svg
│   ├── hero_walk.svg
│   ├── hero_attack.svg
│   ├── hero_hurt.svg
│   └── hero_dead.svg
├── monsters/
│   ├── goblin.svg
│   ├── wolf.svg
│   ├── golem.svg
│   └── knight.svg
├── items/
│   ├── sword.svg
│   ├── armor.svg
│   ├── ring.svg
│   └── potion.svg
├── effects/
│   ├── slash.svg
│   ├── critical.svg
│   └── heal.svg
├── ui/
│   ├── panel.svg
│   ├── button.svg
│   └── inventory.svg
└── sprites.svg
```

If an asset is not available yet, the game must use a generated placeholder rather than break the page.

## 3. Screens

### Main Menu
- Logo
- New Game
- Continue
- Load Game
- Settings
- Animated/background artwork

### World
- Tile-based map
- Player position
- NPC positions
- Walkable/non-walkable tiles
- Encounter zones

### Battle
- Player sprite
- Monster sprite
- HP/MP bars
- Action buttons
- Battle log
- Damage feedback
- Victory/defeat state

### Character
- Level / EXP
- HP / MP
- STR / AGI / INT / VIT
- Derived ATK / DEF / Critical / Dodge / Hit

### Inventory
- Grid/list of items
- Item category filter
- Equip/use actions
- Item description
- Rarity

### Equipment
- Weapon
- Armor
- Ring/Accessory
- Equipment comparison
- Stat delta

## 4. Data Model

### Character
```js
{
  level, exp, gold,
  hp, maxHp, mp, maxMp,
  str, agi, int, vit,
  equipment, inventory, skills
}
```

### Item
```js
{
  id, name, type, rarity,
  atk, def, str, agi, int, vit,
  crit, dodge, hit,
  sellPrice
}
```

### Monster
```js
{
  id, name, level,
  hp, maxHp, str, def,
  exp, gold,
  lootTable
}
```

## 5. Combat Formula Contract

Derived stats must be calculated from base character stats plus equipped item bonuses.

```text
Attack Power = STR × 1.8 + AGI × 0.35 + Weapon ATK
Defense      = VIT × 0.8 + Armor DEF

Base Damage  = max(1, Attack Power - Monster DEF)
Critical     = Base Damage × Critical Multiplier
Final Damage = max(1, Base Damage + random variance)
```

The exact coefficients remain configurable so the GM/Test Lab can be used to experiment with balance.

## 6. Required Systems

- Character progression
- Inventory
- Equipment
- Stats
- Damage calculation
- Monster AI
- Loot tables
- Quest system
- Shop
- Healer
- Blacksmith
- Skills
- Save/load
- GM/Test Lab

## 7. Development Phases

### Phase A — Playable Core
- [x] Main menu
- [x] World movement
- [x] NPC interaction
- [x] Battle
- [x] Inventory
- [x] Equipment
- [x] Stats
- [x] Loot
- [x] Save/load

### Phase B — Visual Upgrade
- [ ] Full pixel-art tile map
- [ ] Hero idle/walk/attack/hurt/dead animations
- [ ] Monster animations
- [ ] Skill VFX
- [ ] UI skin
- [ ] Loading screen artwork

### Phase C — RPG Depth
- [ ] Full item database
- [ ] Random item stats
- [ ] Refinement/upgrade
- [ ] Skill tree
- [ ] Quest chains
- [ ] Shops and economy
- [ ] Dungeons
- [ ] Boss encounters

### Phase D — Testing
- [ ] Automated combat test cases
- [ ] Item stat regression tests
- [ ] Save/load validation
- [ ] Responsive UI test
- [ ] Asset fallback test

## 8. Implementation Rules

1. Keep gameplay logic separate from rendering where practical.
2. Never hard-code item stats in UI code; use the item database.
3. Equipment changes must immediately recalculate derived stats.
4. Loot must use explicit drop tables and rarity weights.
5. Save data must be versioned so future schema changes can migrate safely.
6. Missing visual assets must fall back gracefully.
7. Do not copy copyrighted game assets or source code from other games; create original MMA : RPG assets.
8. All new systems should be testable from GM/Test Lab.

## 9. Current Runtime Entry

The browser entry point is `index.html`. The active gameplay runtime should be loaded from `app.js`. Legacy files may remain temporarily for reference but must not become a second source of truth.

## 10. Acceptance Criteria

A build is considered playable when a new player can:

1. Start a new game.
2. Move around the world.
3. Talk to at least one NPC.
4. Enter combat.
5. Attack and receive damage.
6. Defeat a monster.
7. Receive EXP/gold/loot.
8. Equip the loot.
9. Observe changed derived stats.
10. Save and reload the game.

This specification is the implementation baseline for future MMA : RPG changes.