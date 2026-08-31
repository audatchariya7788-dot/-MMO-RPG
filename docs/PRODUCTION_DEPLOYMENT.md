# MMA : RPG — Production Deployment

## Current target
Cloudflare Workers Static Assets.

Production smoke-test URL:
https://mmo-rpg.audatchariya7788.workers.dev

## Release gate
The production workflow validates JavaScript syntax, canonical catalog v6, Wrangler configuration, and required runtime files before deploying with Wrangler.

## Runtime pipeline
Inventory → Equipment → Stats → Damage → Battle → Loot → Save

Verified QA baseline:
- Steel Sword → ATK 94 / CRIT 7%
- Leather Armor → DEF 32
- Stone Golem Lv.4 → 360 HP / 24 DEF
- Power Slash → 75 damage in the verified test

## Rollback
v1.0.0-qa-baseline remains the rollback reference.

## D1
D1 is intentionally not bound in this release because a production database ID has not been verified. Current Save/Load remains client-side; server persistence is the next controlled phase.
