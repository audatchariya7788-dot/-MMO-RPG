# MMA : RPG — Game Design Document v1.0.0 Baseline

## 1. Project Overview

| Item | Current baseline |
|---|---|
| Genre | Single-player RPG / Fighting |
| Platform target | Mobile-first web prototype; Android/iOS-ready architecture |
| Visual direction | Cute pixel/chibi RPG, 2D/2.5D presentation |
| Core loop | Character → Inventory → Equipment → Stats → Battle → Loot → Save/Load |
| Runtime source | Unified Runtime v2 + V4/V5 compatibility layers |
| QA baseline | Verified through live Codespaces runtime testing |

## 2. Current Verified Game Flow

1. Character selection with four classes: Warrior, Ranger, Mage, Assassin.
2. Inventory contains weapons, armor, rings, consumables, and loot.
3. Equipment supports Weapon, Armor, Ring, plus V4 contract slots Head, Accessory, Boots.
4. Derived stats update from Character + Equipment.
5. Battle uses the current Character class/asset.
6. Normal attack, Critical, and Power Slash damage were tested live.
7. Victory grants EXP and Gold.
8. Loot appears and can enter Inventory.
9. Loot equipment can be equipped and updates stats.
10. Save and Load were tested and preserved the current equipment state.

## 3. Character Classes

| Class | Identity | Signature weapon |
|---|---|---|
| Warrior | Balanced STR/DEF | Long Sword |
| Ranger | Speed / Critical | Hunter Bow |
| Mage | Magic / MP | Arcane Staff |
| Assassin | High AGI / fast attacks | Twin Blades |

## 4. Systems

### Character

The current runtime uses a single class source of truth and class-specific hero SVG assets.

### Equipment

Equipment changes are reflected in derived stats. Tested examples include weapon, armor, and Ruby Ring.

### Stats

Derived combat statistics include ATK, DEF, CRIT, HIT, and DODGE.

### Battle

Current tested damage flow:

- Normal damage = `max(1, ATK − Monster DEF + Random(-5..+6))`
- Critical damage = normal result × `1.75`
- Power Slash ≈ `ATK × 1.35 − Monster DEF`

### Loot / Inventory

Victory creates loot; loot can be collected into Inventory and equipped.

### Save / Load

Core save key: `mma-rpg-save-v2`. Save/Load was tested after equipment and loot progression.

## 5. Asset Baseline

Required class assets:

- `assets/hero-warrior.svg`
- `assets/hero-ranger.svg`
- `assets/hero-mage.svg`
- `assets/hero-assassin.svg`
- `assets/sprites.svg`
- `assets/hero.svg` fallback

## 6. Mockup / UI Roadmap

The long-term seven-screen presentation is:

1. Character Selection
2. Inventory
3. Equipment
4. Stat
5. Battle
6. Victory + Loot
7. Weapon Upgrade / Gacha

Screens 1–6 are represented by the current prototype flow. Weapon Upgrade / Gacha is kept as a planned expansion layer and is not marked as part of the current QA baseline unless separately tested.

## 7. Architecture

See [`system-architecture-v1.svg`](./system-architecture-v1.svg) for the implementation architecture used by the current prototype.

## 8. QA Baseline

The QA result covers live checks of Runtime, Character, Equipment, Stats, Battle, Damage, Critical, Skill, Victory, Loot, Inventory, Equip, Save, and Load. Automated GitHub QA is also configured.

Baseline commit at documentation time: `fb4dbd8c84e6e82e8070c43fe42508255e2b8a17`.

## 9. Next Development Phases

The next work should extend the verified baseline rather than replacing the core runtime:

- World expansion / quests
- More monsters and boss encounters
- Loot tables and rarity progression
- Weapon upgrade system
- Gacha layer
- Mobile packaging / PWA / native shell
- Cloud deployment and telemetry

---

**Baseline rule:** preserve the verified Character → Equipment → Stats → Battle → Loot → Save/Load contract when extending the game.
