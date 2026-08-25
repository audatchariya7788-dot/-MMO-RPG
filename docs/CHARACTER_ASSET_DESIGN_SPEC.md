# MMA : RPG — Character Asset → Sprite → Equipment → UI → Battle

**Design Spec:** Phase C Character Pipeline  
**Version:** 1.2  
**Date:** 2026-08-25  
**Target:** Browser/Codespaces prototype, single-player RPG

## 1. Purpose

This document is the implementation guide for the character pipeline. The same source of truth must drive the Character, Equipment, World and Battle screens.

```text
[01 Character Asset]
        |
        v
[02 Sprite Sheet 32x32 + Grid]
        |
        v
[03 Equipment / Weapon Data]
        |
        v
[04 Character UI]
        |
        v
[05 Battle Runtime]
```

## 2. Repository-aligned asset structure

```text
-MMO-RPG/
├── index.html                 # [04] UI entry + runtime script loading
├── app.js                     # [05] core game state/render/combat
├── animation.js               # [05] animation/effects runtime
├── phaseC.js                  # [01-05] character/equipment integration
├── phaseC.css                 # [04] Character + Equipment UI
└── assets/
    ├── hero-warrior.svg       # [01] Warrior model
    ├── hero-ranger.svg        # [01] Ranger model
    ├── hero-mage.svg          # [01] Mage model
    ├── hero-assassin.svg      # [01] Assassin model
    ├── hero-class-models.svg  # [01] legacy/model reference sheet
    ├── sprite-sheet-32.svg    # [02] 32x32 symbol sheet + grid
    ├── asset-manifest.json    # [01-05] asset contract
    ├── animation-sprites.svg  # [05] animation source
    ├── effects.svg            # [05] combat effects
    ├── hero.svg               # fallback hero
    ├── knight.svg             # [03] armor reference
    └── ...                    # world/monster assets
```

> The repository currently uses a flat `assets/` folder. Do not move these files into a new nested folder unless all runtime paths are updated together.

## 3. Asset IDs / code connections

| ID | Asset / code | Purpose | Runtime consumer |
|---|---|---|---|
| 01 | `assets/hero-warrior.svg` | Warrior model | `phaseC.js` → Character UI |
| 01 | `assets/hero-ranger.svg` | Ranger model | `phaseC.js` → Character UI |
| 01 | `assets/hero-mage.svg` | Mage model | `phaseC.js` → Character UI |
| 01 | `assets/hero-assassin.svg` | Assassin model | `phaseC.js` → Character UI |
| 02 | `assets/sprite-sheet-32.svg` | 32×32 symbols | `phaseC.js` → equipment icons |
| 03 | `WEAPONS` in `phaseC.js` | weapon stats/bonuses | Character + Equipment + damage |
| 03 | `CLASSES` in `phaseC.js` | class stats/model/weapon mapping | Character + battle |
| 04 | `#characterView` | Character screen mount | `index.html` + `phaseC.js` |
| 04 | `#equipmentView` | Equipment screen mount | `index.html` + `app.js` |
| 05 | `#battle` / `.sprite-hero` | battle hero runtime | `index.html` + `app.js` + `animation.js` |

## 4. Character class contract

```text
Warrior  → hero-warrior.svg → sword_long → STR/VIT
Ranger   → hero-ranger.svg  → bow       → AGI/CRIT
Mage     → hero-mage.svg    → staff     → INT/MP
Assassin → hero-assassin.svg→ dual_blade→ AGI/SPD
```

The class selection must update localStorage key `mma-rpg-class`, then re-render Character and synchronize the active class across runtime screens.

## 5. 32×32 Sprite Sheet contract

`assets/sprite-sheet-32.svg` is the runtime symbol sheet. Each logical cell is 32×32 and is referenced by ID, for example:

```html
<svg viewBox="0 0 32 32"><use href="./assets/sprite-sheet-32.svg#sword_long"/></svg>
```

Required IDs used by Phase C include:

```text
warrior_idle   ranger_idle   mage_idle   assassin_idle
sword_long     bow            staff       dual_blade
leather        knight         mage_robe   shadow_armor
ring           potion
```

## 6. Character UI layout

```text
┌─────────────────────────────────────────────────────────────┐
│ Hero Class & Weapon                                         │
│ [Warrior] [Ranger] [Mage] [Assassin]                       │
├────────────────┬──────────────────────┬─────────────────────┤
│ Character      │ Equipment / Paper    │ Stats               │
│ Preview        │ Doll                 │ HP / MP             │
│ 128×160 model  │ Head / Armor / Ring  │ STR AGI INT VIT     │
│ Weapon badge   │ Weapon + ATK         │ ATK DEF CRIT DODGE  │
└────────────────┴──────────────────────┴─────────────────────┘
```

## 7. Battle integration

The battle runtime must consume the same active class and weapon state as Character/Equipment. A class switch is not complete until:

1. Character model changes.
2. Weapon changes.
3. Stats change.
4. Equipment preview changes.
5. Battle hero uses the active model/weapon.
6. Damage formula uses the active weapon/class values.

## 8. Asset failure policy

If a standalone hero SVG cannot be loaded, the UI must fall back to `assets/hero.svg` rather than showing a broken-image icon. Equipment symbols must fall back to a text label so the screen remains usable.

## 9. A4 implementation checklist

- [ ] Character asset exists in `assets/`.
- [ ] Sprite Sheet exists and contains required IDs.
- [ ] `asset-manifest.json` points to real files.
- [ ] `phaseC.js` uses repository-relative paths.
- [ ] Character UI renders all 4 classes.
- [ ] Equipment icons render from 32×32 sheet.
- [ ] Battle consumes active class/weapon.
- [ ] Hard refresh after asset changes.
- [ ] Test at desktop and mobile widths.

## 10. Run / test

```bash
git pull --ff-only origin main
chmod +x run.sh
bash run.sh
```

Open **Port 8000** in Codespaces and hard-refresh the browser.

### Smoke test

1. Open Character.
2. Click Warrior, Ranger, Mage, Assassin.
3. Confirm each model appears.
4. Confirm weapon and stats change.
5. Open Equipment and confirm icons.
6. Open Battle and confirm the active hero remains synchronized.

---

**Source of truth:** `phaseC.js`, `phaseC.css`, `assets/asset-manifest.json`, and the files listed in this document.  
**Design goal:** one character state, one asset contract, multiple connected screens.
