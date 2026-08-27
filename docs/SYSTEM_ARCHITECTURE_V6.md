# MMA RPG System Architecture v6.0

## Purpose
Production-oriented single-player RPG architecture derived from the v1.0.0 QA baseline.

## Runtime flow
Character → Inventory → Equipment → Stats → Combat → Damage → Monster → Loot → Progression

## Layers
1. **Game Client / UI** — responsive mobile/web interface, character, inventory, equipment, battle, upgrade and gacha screens.
2. **Game Core** — character, inventory, equipment, skills, combat, damage calculation, monster AI/data, loot and progression.
3. **Game Data** — canonical runtime catalog in `data/game-catalog.js`; future data should remain data-driven.
4. **Persistence** — local save first; Cloudflare persistence can be added through an API boundary when credentials/bindings are configured.
5. **CI / QA** — JavaScript syntax, required files, assets/data, catalog integration and secret checks.
6. **Deployment** — QA branch → Pull Request → main → Cloudflare production.

## Canonical data contract
- Classes: Warrior, Ranger, Mage, Assassin
- Equipment slots: Head, Armor, Weapon, Accessory, Ring, Boots
- Sprite states: IDLE, WALK, RUN, ATTACK, SKILL, HURT, DEAD
- Core entities: weapons, armor, rings, consumables, monsters, loot/drop tables

## Release safety
- `v1.0.0-qa-baseline` remains immutable as the rollback reference.
- Do not deploy to production from an unvalidated branch.
- Cloudflare deployment is intentionally gated until the production Worker/site and required secrets/bindings are verified.

## Performance priorities
Asset lazy loading → sprite/texture reuse → object pooling for transient effects → mobile rendering budget → error logging.

## Current phase
**QA Hardening → Data Validation → Combat/Damage Engine → Save/Load → Cloudflare Production**
