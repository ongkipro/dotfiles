---
name: title-separator-convention
description: "Web page <title> separator preference — use a dash, never a pipe"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3a300b71-8f5a-4ad5-9840-d456c46f6f11
---

Untuk `<title>` halaman web (dan title sejenis), pakai pemisah **tanda hubung `-`**, JANGAN pakai pipe `|`. Contoh: `Profil - Ribath Al-Hadi`, bukan `Profil | Ribath Al-Hadi`.

**Why:** preferensi gaya user (Paduka Ongki), disampaikan saat membangun compro [[rtqalhadi-project]].
**How to apply:** saat membuat/menyetel meta title di Astro/Next/HTML mana pun, default ke `Halaman - Brand` dengan ` - `. Terapkan juga ke default title di Layout.
