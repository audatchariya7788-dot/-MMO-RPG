# MMA : RPG

Single-player RPG test laboratory for experimenting with original characters, weapons, equipment, stats, damage and loot.

## Run in Codespaces

```bash
git pull --ff-only origin main
chmod +x run.sh
bash run.sh
```

Open **Port 8000**. After an update, hard-refresh with `Ctrl + Shift + R`.

## V2 Development Contract

```text
BOOT → MAIN MENU → WORLD → CHARACTER → EQUIPMENT → STATS → BATTLE → LOOT → SAVE
```

The current UI keeps World, Battle, Character, Inventory, Equipment, Stats, Monsters, Quests, Loot and GM Lab in one runtime. Character selection, equipment modifiers and Battle use the same state object, so a test change can be observed immediately in combat.

## 32×32 Asset Contract

Every runtime sprite has a stable logical 32×32 cell and Asset ID. The source may be SVG and visually scaled in the UI, but game logic refers to IDs rather than screen dimensions.

Main hero IDs:
- `CHR-WAR-IDLE` → `assets/hero-warrior.svg`
- `CHR-RNG-IDLE` → `assets/hero-ranger.svg`
- `CHR-MAG-IDLE` → `assets/hero-mage.svg`
- `CHR-ASS-IDLE` → `assets/hero-assassin.svg`
- `CHR-FALLBACK` → `assets/hero.svg`

Weapon symbols: `sword`, `bow`, `staff`, `dual_blade`.

## Data / Design Spec

- `docs/MMA-RPG-V2-DESIGN-SPEC.md` — canonical flow, UI contract, Asset IDs, 32×32 grid rules, runtime state, damage pipeline and Phase roadmap.
- `data/game-spec.json` — machine-readable version of the flow, classes, assets, IDs and acceptance phases.
- `assets/asset-manifest.json` — repository asset contract.
- `spec-runtime.js` — non-rendering validator that checks the V2 spec and required asset files at runtime.

## Test Order

1. NEW GAME
2. Character → switch Warrior/Ranger/Mage/Assassin
3. Equipment → equip/change items
4. Stats → verify derived values
5. Battle → attack/skill/heal/potion/run
6. Loot → verify EXP/Gold/Item
7. Inventory → verify the new item
8. Save → Load → verify state round-trip
9. GM Lab → create test equipment and repeat Battle

## Damage Pipeline

```text
Character Base + Equipment
        ↓
ATK / DEF / HIT / DODGE / CRIT
        ↓
Hit or Dodge → Critical → Damage
        ↓
Monster HP → Victory
        ↓
EXP + Gold + Loot → Inventory / Quest
```

The runtime normalizes incomplete saves and uses `assets/hero.svg` as a safe hero fallback, preventing a missing standalone class asset from becoming a broken image.

This is an original prototype inspired by classic RPG systems; it does not include copied game assets or source code from another game.
