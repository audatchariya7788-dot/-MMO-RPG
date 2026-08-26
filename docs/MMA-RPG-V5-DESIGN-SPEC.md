# MMA : RPG V5 — Master Design Spec

**Status:** Runtime V5 QA PASS baseline
**Purpose:** Canonical implementation guide for Character → Equipment → Battle → Loot → Save/Load and Phase 1–7.

## 1. Runtime Baseline

The V5 runtime is a single-player RPG laboratory. The canonical player flow is:

```text
BOOT
  ↓
MAIN MENU
  ↓
WORLD / GREENVALE
  ↓
CHARACTER
  ↓
EQUIPMENT
  ↓
STATS
  ↓
BATTLE
  ↓
LOOT
  ↓
INVENTORY
  ↓
SAVE / LOAD
```

Runtime tabs currently exposed: **World, Battle, Character, Inventory, Equipment, Stats, Monsters, Quests, Loot, GM Lab**.

V5 QA acceptance baseline checks `gameState`, loot contracts, inventory, equipment and `mma-rpg-save-v2` before reporting PASS.

## 2. Asset Contract

All game logic references stable Asset IDs. Source SVG can be displayed at any CSS size, but every runtime sprite has a **32×32 logical cell contract**.

| Asset ID | Source | Symbol | Grid | Runtime use |
|---|---|---|---|---|
| CHR-WAR-IDLE | assets/hero-warrior.svg | — | 32×32 | Character / World / Battle / Equipment |
| CHR-RNG-IDLE | assets/hero-ranger.svg | — | 32×32 | Character / World / Battle / Equipment |
| CHR-MAG-IDLE | assets/hero-mage.svg | — | 32×32 | Character / World / Battle / Equipment |
| CHR-ASS-IDLE | assets/hero-assassin.svg | — | 32×32 | Character / World / Battle / Equipment |
| CHR-FALLBACK | assets/hero.svg | — | 32×32 | Safe hero fallback |
| WPN-LS | assets/sprites.svg | sword | 32×32 | Warrior weapon |
| WPN-BOW | assets/sprites.svg | bow | 32×32 | Ranger weapon |
| WPN-STAFF | assets/sprites.svg | staff | 32×32 | Mage weapon |
| WPN-DUAL | assets/sprites.svg | dual_blade | 32×32 | Assassin weapon |
| EQ-ARM-LEATHER | data/runtime | armor | 32×32 | Armor |
| EQ-ARM-KNIGHT | data/runtime | armor | 32×32 | Armor |
| EQ-RING-RUBY | assets/sprites.svg | ring | 32×32 | Ring |
| ITM-HP-POTION | assets/sprites.svg | potion | 32×32 | HP consumable |
| ITM-MP-POTION | assets/sprites.svg | potion | 32×32 | MP consumable |
| MON-GOB | assets/goblin.svg | goblin | 32×32 | Battle / Monsters |
| MON-WOLF | assets/sprites.svg | wolf | 32×32 | Battle / Monsters |
| MON-GOL | assets/golem.svg | golem | 32×32 | Battle / Monsters |
| MON-DKN | assets/knight.svg | knight | 32×32 | Battle / Monsters |

### Sprite rule

- Logical origin: top-left.
- Logical frame size: 32×32.
- Required states: `IDLE`, `WALK`, `RUN`, `ATTACK`, `SKILL`, `HURT`, `DEAD`.
- If a state is unavailable, use the existing static asset as frame 0.
- Never reference a local-machine-only path.
- Never allow a missing sprite to break the page; use `CHR-FALLBACK` or runtime fallback.

## 3. Character Contract

| Class | Class ID | Character Asset | Weapon ID | Weapon Symbol |
|---|---|---|---|---|
| Warrior | CLASS-WARRIOR | CHR-WAR-IDLE | EQ-WPN-LONG-SWORD | WPN-LS |
| Ranger | CLASS-RANGER | CHR-RNG-IDLE | EQ-WPN-HUNTER-BOW | WPN-BOW |
| Mage | CLASS-MAGE | CHR-MAG-IDLE | EQ-WPN-ARCANE-STAFF | WPN-STAFF |
| Assassin | CLASS-ASSASSIN | CHR-ASS-IDLE | EQ-WPN-TWIN-BLADES | WPN-DUAL |

Class switching must update the shared runtime state and therefore Character, World, Battle and Equipment simultaneously.

## 4. Equipment Contract

Slots:

```text
Head
Armor
Weapon
Accessory
Ring
Boots
```

Core equipment IDs:

- `EQ-WPN-LONG-SWORD`
- `EQ-WPN-HUNTER-BOW`
- `EQ-WPN-ARCANE-STAFF`
- `EQ-WPN-TWIN-BLADES`
- `EQ-ARM-LEATHER`
- `EQ-ARM-KNIGHT`
- `EQ-RING-RUBY`

Equipment changes must immediately recalculate derived stats used by Battle.

## 5. Runtime Data Contract

```js
state = {
  version,
  hero: {
    classId,
    assetId,
    level,
    exp,
    gold,
    hp,
    maxHp,
    mp,
    maxMp,
    str,
    agi,
    int,
    vit
  },
  inventory: Item[],
  equipment: {
    Head,
    Armor,
    Weapon,
    Accessory,
    Ring,
    Boots
  },
  monster: Monster | null,
  log: string[],
  loot: Item[],
  map: { x, y },
  kills: number,
  quests: { goblin, forest }
}
```

`normalize()` / equivalent safety initialization must run after load. Invalid or incomplete saves must recover to a safe default state.

Save key: `mma-rpg-save-v2`.

## 6. Data Flow

```text
Character Asset ID
      ↓
Character Model
      ↓
Equipment Slots
      ↓
Equipment Modifiers
      ↓
Derived Stats
      ↓
Battle Calculation
      ↓
Monster HP
      ↓
Victory
      ↓
EXP + Gold + Loot
      ↓
Inventory / Quest
      ↓
Save / Load
```

## 7. Battle Formula

```text
ATK = STR × 1.8 + AGI × 0.35 + equipment ATK
DEF = VIT × 0.8 + equipment DEF
HIT = min(99, 90 + AGI × 0.3)
DODGE = min(60, AGI × 0.18)
```

Pipeline:

```text
Hit / Dodge → Critical → Damage → Monster HP → Victory
```

## 8. Phase 1–7 Implementation Guide

### Phase 1 — Runtime Foundation
**Asset IDs:** SYS-RUNTIME, SYS-SAVE

Acceptance:
- Boot does not stick on Loading.
- One renderer owns the runtime.
- NEW / CONTINUE / LOAD are safe.
- `gameState` is initialized.

### Phase 2 — Character + Equipment
**Asset IDs:** CHR-*, WPN-*, EQ-*

Acceptance:
- Four classes switch correctly.
- Character sprite and signature weapon change together.
- Equipment slots render.
- Equipment modifies derived stats.

### Phase 3 — Asset Integration
**Asset IDs:** ASSET-32X32, CHR-FALLBACK, WPN-*

Acceptance:
- Every runtime asset has an ID.
- 32×32 logical grid is preserved.
- SVG assets load without broken-image UI.
- Fallback exists.

### Phase 4 — World + Quest
**Asset IDs:** MAP-*, NPC-*, QUEST-*

Acceptance:
- Movement works.
- NPC interaction works.
- Encounter triggers work.
- Quest counters persist.

### Phase 5 — Battle
**Asset IDs:** MON-*, FX-*, SKL-*

Acceptance:
- Attack, skill, heal, potion and run work.
- Damage uses the shared stat contract.
- Monster HP and victory state update correctly.

### Phase 6 — Loot + Inventory
**Asset IDs:** LOOT-*, ITM-*

Acceptance:
- Victory creates EXP, Gold and item records.
- Inventory receives loot.
- Filters work.
- Equipment actions update state.

### Phase 7 — Save / Load + GM Lab
**Asset IDs:** SYS-SAVE, GM-*

Acceptance:
- Save → Load is a full state round trip.
- Class, equipment, inventory, map, quests and loot survive reload.
- Invalid save is normalized safely.
- GM Lab remains test-only.

## 9. Regression Checklist

- [ ] V5 QA reports PASS.
- [ ] No broken hero image.
- [ ] Four class buttons update shared state.
- [ ] Equipment updates stats and battle output.
- [ ] Battle victory creates loot.
- [ ] Loot reaches inventory.
- [ ] Save → Load restores state.
- [ ] No absolute/local-machine asset paths.
- [ ] Hard refresh remains stable.

## 10. Source of Truth

- Runtime source: repository `main` branch.
- SVG asset source: `assets/sprites.svg` and standalone hero/monster SVG files.
- Machine-readable contract: `data/mma-rpg-v5-spec.json`.
- Phase guide: `docs/MMA-RPG-V5-PHASE-GUIDE.svg`.

This document is the implementation contract for the V5 baseline and the handoff point for future Equipment and Battle development.
