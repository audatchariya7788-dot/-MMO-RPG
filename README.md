# MMA : RPG

Single-player RPG test laboratory for experimenting with weapons, equipment, stats, damage and loot.

## Run in Codespaces

```bash
git pull --ff-only origin main
chmod +x run.sh
bash run.sh
```

Open **Port 8000**. After an asset/code update, hard-refresh the browser with `Ctrl + Shift + R`.

## Run locally

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Current playable systems

- Battle against multiple original monsters
- Attack / miss / critical / dodge
- HP / MP and Heal / Potion
- Character level and EXP
- Gold and loot drops
- Inventory filters
- Weapon / Armor / Ring equipment
- Derived ATK / DEF / HIT / DODGE / CRIT
- Visible damage formula and breakdown
- Monster encyclopedia
- Local Save / Load with browser `localStorage`
- GM/Test Lab for creating custom test weapons
- Quick GM tools for HP/MP, level, gold and random monster
- Four Phase C classes: Warrior, Ranger, Mage, Assassin
- Standalone hero SVG models with runtime fallback
- 32×32 SVG symbol sheet for character/equipment runtime
- Character → Equipment → Battle class synchronization

## Phase C Design Spec

- `docs/CHARACTER_ASSET_DESIGN_SPEC.md` — implementation guide and repository-aligned asset map
- `docs/CHARACTER_ASSET_DESIGN_SPEC_A4.html` — printable A4 version
- `docs/character-pipeline.svg` — one-page visual pipeline diagram
- `assets/asset-manifest.json` — runtime asset contract and documentation links

## Character pipeline

```text
Character Asset
      ↓
Sprite Sheet 32×32 + Grid
      ↓
Equipment / Weapon Data
      ↓
Character UI
      ↓
Battle Runtime
```

The runtime uses the same active class/weapon state across Character, Equipment and Battle. Missing standalone hero art falls back to `assets/hero.svg` so the UI does not display a broken-image icon.

This is an original prototype inspired by classic MMORPG-style systems; it does not include copied game assets or source code from other games.
