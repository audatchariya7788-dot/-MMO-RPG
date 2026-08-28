# Cloudflare Production Deployment

## Status
The game data and runtime are prepared for deployment, but production deployment is **gated** until a Cloudflare project/account and deployment credentials are connected.

## Required production values
- Cloudflare Account ID
- Cloudflare API Token with deployment permissions
- Production project/site name
- If using D1: database ID and binding name
- If using R2: bucket name and binding name

## Recommended deployment model
Static game client → Cloudflare Pages (or Workers Static Assets)
API/persistence → Cloudflare Workers
Player data → Cloudflare D1
Large assets → Cloudflare R2

## Safety gate
1. QA workflow must pass.
2. Verify `data/game-catalog.v6.json` and `data/game-catalog.js` are synchronized.
3. Smoke-test Character → Inventory → Equipment → Battle → Loot → Save.
4. Deploy only from `main`.
5. Verify production URL and rollback path.

The existing `v1.0.0-qa-baseline` tag remains the rollback reference.

## Why deployment is not executed yet
This repository currently contains no Cloudflare deployment configuration and no verified Cloudflare credentials/bindings. Deploying blindly would risk publishing to the wrong account/project or failing at runtime. Once the Cloudflare project is connected, the deployment can be made automatic through GitHub Actions.
