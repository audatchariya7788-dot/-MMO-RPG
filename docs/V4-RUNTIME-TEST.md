# MMA : RPG V4 — Runtime Test Specification

## Goal
Stabilize the real runtime before the V4 visual reference is generated.

## Priority order
1. Boot / Main Menu
2. Character Class + Hero Asset
3. Equipment + Paper Doll
4. Stats synchronization
5. Battle Hero Asset + Damage
6. Loot / Inventory
7. Save / Load

## Character contract
| Class | Asset | Weapon |
|---|---|---|
| Warrior | `assets/hero-warrior.svg` | `long_sword` / `sprites.svg#sword` |
| Ranger | `assets/hero-ranger.svg` | `bow` / `sprites.svg#bow` |
| Mage | `assets/hero-mage.svg` | `staff` / `sprites.svg#staff` |
| Assassin | `assets/hero-assassin.svg` | `dual_blade` / `sprites.svg#dual_blade` |

Logical sprite target: **32×32**. Source hero art may use a larger SVG viewBox and is rendered responsively in the UI.

## Acceptance tests
- [ ] Page reaches Main Menu without infinite Loading.
- [ ] NEW GAME enters World.
- [ ] Character opens without broken images.
- [ ] Selecting Warrior/Ranger/Mage/Assassin changes the hero model.
- [ ] Class selection changes the signature weapon and base stats.
- [ ] Equipment shows the same current hero/class data.
- [ ] Battle shows the same current hero class.
- [ ] Attack/Skill use the current equipped weapon stats.
- [ ] Victory creates loot and inventory changes.
- [ ] Save then Load restores class, equipment, inventory, stats and progress.

## Runtime QA
`runtime-qa.js` is a non-invasive guard. After the page loads, open DevTools Console and run:

```js
runMMARuntimeQA()
```

Expected final message:

```text
MMA : RPG V4 QA: Character → Equipment → Battle READY
```

## Development rule
`app.js` remains the single source of truth for game state and calculations. `phaseC.js`, `character-v3.js`, and `runtime-qa.js` must not create a second game state.
