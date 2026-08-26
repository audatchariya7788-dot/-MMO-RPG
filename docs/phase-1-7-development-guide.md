# MMA : RPG — Phase 1–7 Development Guide

This guide maps the current SVG architecture and QA baseline to the development sequence. Treat the diagrams as a shared implementation reference, not as a replacement for runtime QA.

## Phase 1 — Runtime Foundation

**Goal:** stable web runtime and deployment path.

- `index.html`, CSS, JavaScript runtime
- Codespaces + forwarded Port 8000
- GitHub Actions Runtime QA
- Auto-start configuration

**Exit gate:** page loads and Runtime QA passes.

## Phase 2 — Character

**Goal:** four playable classes with class-specific SVG assets.

- Warrior
- Ranger
- Mage
- Assassin
- class state stored in `mma-rpg-class`

**Exit gate:** class changes update Character, Equipment context, and Battle visual.

## Phase 3 — Inventory / Equipment

**Goal:** one source of truth for item ownership and equipped slots.

- Weapon
- Armor
- Ring
- Head / Accessory / Boots contract
- Loot → Inventory → Equip

**Exit gate:** Equip changes the relevant slot and derived stats.

## Phase 4 — Stats / Damage Calculation

**Goal:** deterministic derived stats from Character + Equipment.

- ATK
- DEF
- CRIT
- HIT
- DODGE
- normal damage
- Critical ×1.75
- Power Slash ≈ ATK ×1.35 − Monster DEF

**Exit gate:** Battle values match Equipment values.

## Phase 5 — Battle

**Goal:** live combat loop.

- Monster spawn
- Attack
- Power Slash
- Heal
- Potion
- Run
- Battle log

**Exit gate:** one normal attack and one skill attack resolve correctly.

## Phase 6 — Victory / Loot

**Goal:** reward and progression loop.

- Victory state
- EXP
- Gold
- Loot generation
- Loot history
- Loot → Inventory

**Exit gate:** defeated monsters produce observable rewards.

## Phase 7 — Save / Load

**Goal:** persistence of the verified game state.

- Core save key `mma-rpg-save-v2`
- V4 backup contract
- Equipment slots persisted
- Loot and inventory persisted

**Exit gate:** Save → Load restores the tested state without losing equipment or inventory.

## Future phases after the baseline

- Phase 8: World + Quest expansion
- Phase 9: Loot tables / rarity progression
- Phase 10: Weapon Upgrade
- Phase 11: Weapon Gacha
- Phase 12: Mobile packaging / PWA / native shell
- Phase 13: Production deployment / telemetry

## Architecture reference

Use [`system-architecture-v1.svg`](./system-architecture-v1.svg) as the shared implementation map and [`qa-baseline-v1.0.0.md`](./qa-baseline-v1.0.0.md) as the acceptance checklist.
