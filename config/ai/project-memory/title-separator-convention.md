---
name: title-separator-convention
description: "Web page <title> separator and length preference — dash separator, title 55–70 chars, meta description 120–155 chars"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3a300b71-8f5a-4ad5-9840-d456c46f6f11
---

Untuk `<title>` halaman web (dan title sejenis), pakai pemisah **tanda hubung `-`**, JANGAN pakai pipe `|`. Contoh: `Profil - Ribath Al-Hadi`, bukan `Profil | Ribath Al-Hadi`.

**Why:** preferensi gaya user (Paduka Ongki), disampaikan saat membangun compro [[rtqalhadi-project]].
**How to apply:** saat membuat/menyetel meta title di Astro/Next/HTML mana pun, default ke `Halaman - Brand` dengan ` - `. Terapkan juga ke default title di Layout.

**Update 2026-09-30 (agritani DEC-022):** final `<title>` 55–70 karakter termasuk spasi dan sufiks brand; meta description 120–155 karakter; `—` juga tidak dipakai sebagai pemisah. Detail di `preferences.md` (SEO Invariant — Title & Meta Description Length).
