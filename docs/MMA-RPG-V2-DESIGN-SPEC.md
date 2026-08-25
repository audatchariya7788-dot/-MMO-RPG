# MMA : RPG V2 — Design Spec

Version: 2.1

## Canonical Flow

```text
BOOT → MAIN MENU → WORLD / GREENVALE → CHARACTER → EQUIPMENT → STATS → BATTLE → LOOT → SAVE
                         ↑                    │          │          │
                         └────── QUEST/NPC ───┘          └── INVENTORY
```

Current runtime navigation: World, Battle, Character, Inventory, Equipment, Stats, Monsters, Quests, Loot, GM Lab. Character and Equipment are runtime views driven by the same state used by Battle.

## Character Contract

Four classes:
- CLASS-WARRIOR → CHR-WAR-IDLE → `assets/hero-warrior.svg` → Long Sword
- CLASS-RANGER → CHR-RNG-IDLE → `assets/hero-ranger.svg` → Hunter Bow
- CLASS-MAGE → CHR-MAG-IDLE → `assets/hero-mage.svg` → Arcane Staff
- CLASS-ASSASSIN → CHR-ASS-IDLE → `assets/hero-assassin.svg` → Twin Blades
- CHR-FALLBACK → `assets/hero.svg`

Class selection must update model, signature weapon, STR/AGI/INT/VIT, HP and MP everywhere: Character, World, Battle and Equipment.

## 32×32 Asset/Grid Contract

All runtime character and item sprites use a **32×32 logical cell**. Source SVGs may be larger and CSS may scale them, but the logical grid ID never changes.

| Asset ID | Grid | Runtime | Usage |
|---|---:|---|---|
| CHR-WAR-IDLE | 32×32 | hero-warrior.svg | Character/World/Battle/Equipment |
| CHR-RNG-IDLE | 32×32 | hero-ranger.svg | Character/World/Battle/Equipment |
| CHR-MAG-IDLE | 32×32 | hero-mage.svg | Character/World/Battle/Equipment |
| CHR-ASS-IDLE | 32×32 | hero-assassin.svg | Character/World/Battle/Equipment |
| CHR-FALLBACK | 32×32 | hero.svg | Hero fallback |
| WPN-LS | 32×32 | sprites.svg#sword | Warrior |
| WPN-BOW | 32×32 | sprites.svg#bow | Ranger |
| WPN-STAFF | 32×32 | sprites.svg#staff | Mage |
| WPN-DUAL | 32×32 | sprites.svg#dual_blade | Assassin |
| MON-GOB | 32×32 | goblin sprite | Battle/Monsters |
| MON-WOLF | 32×32 | wolf sprite | Battle/Monsters |
| MON-GOL | 32×32 | golem sprite | Battle/Monsters |
| MON-DKN | 32×32 | knight sprite | Battle/Monsters |

Recommended animation states: `IDLE`, `WALK`, `RUN`, `ATTACK`, `SKILL`, `HURT`, `DEAD`. If an animation frame is not available, use the existing static SVG as frame 0; never reference a non-existent asset path.

## Equipment/Data IDs

Weapons: `EQ-WPN-LONG-SWORD`, `EQ-WPN-HUNTER-BOW`, `EQ-WPN-ARCANE-STAFF`, `EQ-WPN-TWIN-BLADES`.

Armor/Ring: `EQ-ARM-LEATHER`, `EQ-ARM-KNIGHT`, `EQ-RING-RUBY`.

Consumables: `ITM-HP-POTION`, `ITM-MP-POTION`.

## Runtime State

```js
state = {
  version,
  hero: { level, exp, gold, hp, maxHp, mp, maxMp, str, agi, int, vit },
  inventory: Item[],
  equipment: { Weapon, Armor, Ring },
  monster: Monster | null,
  log: string[], loot: Item[],
  map: { x, y }, kills: number,
  quests: { goblin, forest }
}
```

`normalize()` must run after loading so missing/old fields cannot break rendering.

## Damage Pipeline

```text
Base Character Stats + Equipment Modifiers
                 ↓
ATK = STR × 1.8 + AGI × 0.35 + equipment ATK
DEF = VIT × 0.8 + equipment DEF
HIT = min(99, 90 + AGI × 0.3)
DODGE = min(60, AGI × 0.18)
                 ↓
Hit/Dodge → Crit → Damage → Monster HP
                 ↓
Victory → EXP + Gold + Loot → Inventory/Quest
```

## Phase Roadmap / Acceptance

### Phase 1 — Runtime foundation
Boot must not permanently show Loading. NEW/CONTINUE/LOAD work. One runtime owns rendering.

### Phase 2 — Character + Equipment
Class changes update sprite, weapon and stats. Equipment immediately affects derived stats.

### Phase 3 — Asset integration
Every runtime asset has a stable ID, 32×32 logical contract and fallback.

### Phase 4 — World + Quest
Movement, NPC interaction, random encounters and quest counters work.

### Phase 5 — Battle
Attack, Power Slash, Heal, Potion and Run work; damage breakdown matches runtime formula.

### Phase 6 — Loot + Inventory
Victory creates EXP/Gold/Item records; inventory filters and equipment actions work.

### Phase 7 — Save / Load + GM Lab
Save/load round-trip preserves class, equipment, inventory, map, quests and loot. GM Lab remains a test-only tool.

## Regression Checklist

- [ ] Hard refresh does not stick on Loading.
- [ ] No broken hero image.
- [ ] All four class buttons change the runtime model.
- [ ] Equipment changes stats and Battle damage.
- [ ] Victory creates loot and quest progress.
- [ ] Inventory reflects loot.
- [ ] Save → Load restores the same state.
- [ ] Invalid save falls back safely.
- [ ] No local-machine-only asset paths.
