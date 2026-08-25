# MMA : RPG — Character UI V3 Final Master

## Visual source
The supplied Character UI reference is the visual master direction: blue/navy pixel-RPG panels, gold selection borders, large hero preview, class cards, equipment paper-doll, stats, inventory and weapon bonus. The reference is implemented as live UI components rather than a screenshot background.

## Runtime pipeline

```text
Asset ID
  ↓
Character Sprite 32×32
  ↓
Class / Weapon Data
  ↓
Equipment Slots
  ↓
Character UI V3
  ↓
Stats / Damage
  ↓
Battle
  ↓
Loot / Save
```

## Character Asset IDs

| Class | Asset ID | File | Weapon ID |
|---|---|---|---|
| Warrior | CHR-WAR-IDLE | assets/hero-warrior.svg | WPN-LS |
| Ranger | CHR-RNG-IDLE | assets/hero-ranger.svg | WPN-BOW |
| Mage | CHR-MAG-IDLE | assets/hero-mage.svg | WPN-STAFF |
| Assassin | CHR-ASS-IDLE | assets/hero-assassin.svg | WPN-DUAL |

## Equipment slots

| Slot | ID | Example |
|---|---|---|
| Head | EQ-HEAD | Steel Helm |
| Armor | EQ-ARMOR | Class Armor |
| Weapon | class weapon ID | Signature Weapon |
| Accessory | EQ-ACC | Power Amulet |
| Ring | EQ-RING | Gold Ring |
| Boots | EQ-BOOTS | War Boots |

## UI mapping

1. Hero Class & Weapon → class data and signature weapon.
2. Hero Preview → active character asset.
3. Equipment → paper-doll and slot IDs.
4. Character Stats → runtime hero values plus class bonuses.
5. Inventory → live item quantities.
6. Weapon Bonus → active weapon contribution.
7. Data Flow → documentation aid; not gameplay state.

## Acceptance checks

- Character screen loads without broken hero images.
- Warrior/Ranger/Mage/Assassin buttons change the active model and weapon.
- Asset IDs are visible for development/debugging.
- Equipment slots expose stable IDs.
- Character data remains compatible with Battle and Save/Load.
- Mobile layout collapses into one column below 760px.
- Cache-busting version is `20260826v4` for Character V3 assets.
