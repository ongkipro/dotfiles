---
name: reference_telegram_bot_pool
description: Fitur stok token bot Telegram (pool) — claim instan + batasan Telegram
metadata: 
  node_type: memory
  type: reference
  originSessionId: 870b6145-c08c-4c8e-977c-8b5e01adcffd
---

Stok bot Telegram (live ~2026-06-27): tabel `telegram_bot_pool` (token terenkripsi AES-256-GCM via lib/crypto, status free/assigned). Superadmin isi token via `/app/superadmin` tab **Telegram** (routes `/api/superadmin/telegram-pool` GET/POST/DELETE di superadmin.ts). Agen klaim via `POST /api/workspaces/:ws/telegram/claim-pool` (telegram.ts) → ambil 1 free → `tgSetMyName(nama agen)` + setMyDescription + setWebhook → tulis row telegram_bot (copy ciphertext pool). Disconnect agen → pool balik free.

Batasan Telegram penting: **@username bot TIDAK bisa diubah** (permanen) — hanya **nama tampilan** yang bisa via Bot API `setMyName` (6.7+). Bot HANYA bisa dibuat manusia via @BotFather (tak ada API auto-create). ~20 bot per akun Telegram. Helper di lib/telegram.ts: tgGetMe/tgSetWebhook/tgSetMyName/tgSetMyDescription. UI tombol "Pakai bot instan" di TelegramSection (settings-sections.tsx).
