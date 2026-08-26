# MMA : RPG V5 Runtime Runbook

## Purpose
Use this as the final handoff checklist for running the V5 baseline after asset/spec changes.

## Canonical files
- `index.html` — runtime shell and script order
- `data/mma-rpg-v5-spec.json` — machine-readable contract
- `docs/MMA-RPG-V5-DESIGN-SPEC.md` — master design specification
- `docs/MMA-RPG-V5-PHASE-GUIDE-FINAL.svg` — Phase 1–7 visual guide
- `v5-runtime-qa.js` — runtime integrity checks

## Run
From the repository root:

```bash
chmod +x run.sh 2>/dev/null || true
bash run.sh
```

If `run.sh` is unavailable, use any static HTTP server from the repository root, for example:

```bash
python3 -m http.server 8000
```

Open the forwarded port in the browser.

## Hard-refresh after a runtime update
Use a cache-busting URL for the current V5 build or perform a hard refresh. The HTML already versions the V5 runtime scripts.

## Acceptance order
1. Boot reaches Main Menu.
2. NEW GAME initializes `gameState`.
3. Character tab renders one of the four class assets.
4. Class switch updates sprite + signature weapon + shared state.
5. Equipment slots render and modify derived stats.
6. Battle uses the same derived stats.
7. Victory creates EXP, Gold and loot.
8. Loot appears in Inventory.
9. Save → Load restores character, equipment, inventory, map, quests and loot.
10. Console reports `[MMA V5 QA] PASS`.

## Asset safety
- Runtime sprite cells are logically 32×32.
- Use stable Asset IDs from `data/mma-rpg-v5-spec.json`.
- Never use local-machine paths.
- Missing character assets must fall back to `CHR-FALLBACK`.

## Phase gate
Do not begin a later phase until the previous phase's acceptance gate passes. Phase 1–7 details are in `docs/MMA-RPG-V5-PHASE-GUIDE-FINAL.svg`.
