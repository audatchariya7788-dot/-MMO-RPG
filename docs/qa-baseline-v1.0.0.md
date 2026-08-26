# MMA : RPG — QA Baseline v1.0.0

## Baseline status

**Status:** PASS — live runtime flow verified by manual testing in GitHub Codespaces.

**Repository:** `audatchariya7788-dot/-MMO-RPG`

**Validated core flow:** Character → Equipment → Stats → Battle → Damage → Victory → Loot → Inventory → Equip → Save → Load.

## Verified checks

| Check | Result |
|---|---|
| Codespaces runtime | PASS |
| Port 8000 / forwarded runtime | PASS |
| Asset files / SVG | PASS |
| Warrior | PASS |
| Ranger | PASS |
| Mage | PASS |
| Assassin | PASS |
| Character → Equipment sync | PASS |
| Equipment → Stats sync | PASS |
| Equipment Equip action | PASS |
| Battle class sync | PASS |
| ATK sync | PASS |
| Hero DEF sync | PASS |
| CRIT sync | PASS |
| Normal Attack damage | PASS |
| Critical damage | PASS |
| Power Slash | PASS |
| Victory rewards | PASS |
| Loot generation | PASS |
| Loot → Inventory | PASS |
| Loot → Equip | PASS |
| Save | PASS |
| Load | PASS |
| GitHub Actions Runtime QA | PASS |

## Evidence from live test session

Representative values tested during the session:

- Assassin: ATK 63, Hero DEF 28, CRIT 10%
- Normal damage observed: 49
- Critical damage observed: 92
- Power Slash observed: 76
- Victory reward observed: +35 EXP, +40 Gold
- Loot was visible in Loot and then appeared in Inventory
- Loot equipment could be equipped
- Save then Load preserved the tested state

## Release boundary

This baseline is the stable foundation for continued development. Future systems should be added without breaking the verified contract above.

### Next planned work

1. Expand world and quest content.
2. Add more monsters and boss encounters.
3. Expand loot tables and rarity progression.
4. Add weapon upgrade system.
5. Add weapon gacha system.
6. Improve mobile packaging and deployment.

## Documents

- [GDD v1.0.0](./gdd-v1.0.0-baseline.md)
- [System Architecture SVG](./system-architecture-v1.svg)

## Baseline rule

Do not replace the core runtime state model while extending features. New systems must preserve Character → Equipment → Stats → Battle → Loot → Inventory → Save/Load compatibility.
