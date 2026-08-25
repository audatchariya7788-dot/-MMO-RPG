# MMA : RPG — Rebuild V2

## เป้าหมาย
จัดระบบ Prototype ใหม่โดยให้มี **Runtime หลักเพียงตัวเดียว** ลดปัญหาข้อมูลชนกันระหว่าง `app.js`, `phaseC.js`, animation และ Save เดิม

## ลำดับความสำคัญ

1. **Boot / Runtime** — `index.html` → `app.js` ต้องเริ่มได้โดยไม่ค้าง Loading
2. **State / Save** — ใช้ state schema เดียวและ migrate save เดิมได้
3. **Character** — 4 classes: Warrior / Ranger / Mage / Assassin
4. **Equipment** — Weapon / Armor / Ring และคำนวณ Stat จากของที่ใส่จริง
5. **Inventory** — filter, equip, consumable, loot
6. **Battle** — Attack / Skill / Heal / Potion / Run + Damage Breakdown
7. **World** — Greenvale, movement, NPC, random encounter
8. **Quest / Loot** — progress, reward, loot history
9. **GM Lab** — สร้าง item และปรับค่าทดสอบ
10. **Animation / Sprite** — ใช้เป็น enhancement ไม่ใช่ dependency ของ boot

## สิ่งที่ถูกแก้ใน V2

- `app.js` กลายเป็น **Single Source of Truth** สำหรับ state และ UI
- `phaseC.js` ไม่ render ซ้ำอีกต่อไป เป็น compatibility layer เท่านั้น
- Character ใช้ไฟล์ `assets/hero-*.svg` โดยตรง และมี `hero.svg` เป็น fallback
- Class → Weapon → Stats → Character UI → Equipment → Battle ใช้ state ชุดเดียวกัน
- Save ใหม่ใช้ `mma-rpg-save-v2` และอ่าน save เก่า `mma-rpg-save` ได้
- เพิ่ม schema normalization กันข้อมูลเก่าหรือข้อมูลไม่ครบทำให้เกมพัง
- เพิ่ม cache-busting `2026-08-25-unified-v2`
- Boot guard ยังทำหน้าที่กันหน้า Loading ค้าง แต่ไม่เป็นเจ้าของ game state

## Asset Contract

```text
assets/
  hero-warrior.svg
  hero-ranger.svg
  hero-mage.svg
  hero-assassin.svg
  hero.svg                  # fallback
  sprite-sheet-32.svg       # 32×32 design/runtime symbols
  sprites.svg               # UI / monster symbols
  animation-sprites.svg     # optional animation layer
  hero-class-models.svg     # legacy/reference layer
```

## Runtime Flow

```text
Boot
  ↓
Main Menu
  ↓
Game State
  ↓
World
  ├── NPC
  └── Monster Encounter
        ↓
      Battle
        ↓
Character ←→ Inventory ←→ Equipment
        ↓
      Stats / Damage
        ↓
      Loot / Quest
        ↓
      Save
```

## วิธีทดสอบ Acceptance

- เปิดหน้าเกมแล้วไม่ค้าง `Loading world...`
- กด `NEW GAME` แล้วเข้า World
- เปิด Character แล้วเห็นโมเดลจริง
- เปลี่ยน Warrior/Ranger/Mage/Assassin แล้วโมเดล/อาวุธ/Stat เปลี่ยน
- Equip item แล้ว ATK/DEF/CRIT เปลี่ยน
- Battle สามารถ Attack และรับ Damage ได้
- Victory เพิ่ม EXP/Gold และ Loot
- Save → Reload → Load แล้วข้อมูลยังอยู่
- GM Lab สร้าง item ได้
- Refresh หน้าเว็บแล้วไม่ทำให้ state/runtime พัง

## Run

```bash
git pull --ff-only origin main
chmod +x run.sh
bash run.sh
```

จากนั้นเปิด **Ports → 8000 → Open in Browser** และทำ Hard Refresh (`Ctrl + Shift + R`).
