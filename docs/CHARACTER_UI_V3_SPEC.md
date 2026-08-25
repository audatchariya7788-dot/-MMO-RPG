# MMA : RPG — Character UI V3 Implementation Spec

## Goal
Rebuild the Character screen around the supplied reference: blue/gold RPG HUD, four class cards, hero preview, equipment paper-doll, character stats, inventory summary, and weapon bonus.

## Runtime contract

`Asset ID → Sprite 32×32 → Equipment → Character UI → Battle`

The presentation layer is `character-v3.js` + `character-v3.css`. It does not replace the core game runtime; it observes the existing Character renderer and replaces only the Character presentation when the Character tab is active.

## Asset IDs

| Class | Asset ID | SVG | Weapon ID |
|---|---|---|---|
| Warrior | CHR-WAR-IDLE | `assets/hero-warrior.svg` | WPN-LS |
| Ranger | CHR-RNG-IDLE | `assets/hero-ranger.svg` | WPN-BOW |
| Mage | CHR-MAG-IDLE | `assets/hero-mage.svg` | WPN-STAFF |
| Assassin | CHR-ASS-IDLE | `assets/hero-assassin.svg` | WPN-DUAL |

Weapon symbols must exist in `assets/sprites.svg`: `sword`, `bow`, `staff`, `dual_blade`.

## UI blocks

1. Hero Class & Weapon — four selectable classes.
2. Hero Preview — large class model with scene, nameplate and level.
3. Equipment — Head / Armor / Weapon / Accessory / Ring / Boots.
4. Character Stats — Level, EXP, HP, MP, STR, AGI, INT, VIT, ATK, DEF, CRIT, Dodge.
5. Inventory — compact item/count grid.
6. Weapon Bonus — active weapon contribution.
7. Runtime Contract — visible Asset ID → Sprite → Equipment → UI → Battle trace.

## Reference sample values

The visual sample uses Level 12, EXP 480/1000 (48%), Gold 1,250 and Diamonds 120. These are presentation/test values only; live Save data is preferred when available.

Warrior sample: HP 320/320, MP 120/120, STR 28, AGI 14, INT 10, VIT 20, ATK 52–60, DEF 28, CRIT 12%, Dodge 5%.

## Error handling

- Every hero image has a fallback to `assets/hero.svg`.
- Missing saved data falls back to the validated sample profile.
- Class switching stores the pending class and reloads so the existing core runtime can apply its own class state.
- Character V3 is a presentation layer; battle/equipment calculations remain owned by the unified runtime.

## Acceptance checklist

- [ ] Character tab renders without broken images.
- [ ] Four class cards show four different hero assets.
- [ ] Class switch updates the selected class after reload.
- [ ] Equipment shows the matching signature weapon.
- [ ] Stats show class-specific values.
- [ ] 32×32 asset contract remains documented.
- [ ] Character V3 does not modify Battle calculations.
- [ ] Mobile layout collapses to one column.

## Run

```bash
git pull --ff-only origin main
chmod +x run.sh
bash run.sh
```

Open Port 8000 and hard-refresh with `Ctrl + Shift + R`.
