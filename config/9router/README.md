# 9router Config Backup

**Live location**: `~/.9router/`

## Files

- `aliases.json` — model aliases (kosong = default)
- `runtime-package.json` — template untuk `~/.9router/runtime/package.json` (runtime deps seperti sql.js)

## Tidak di-backup (secret)

- `auth/cli-secret` — CLI auth token
- `jwt-secret` — JWT signing key
- `machine-id` — device ID
- `tunnel/state.json` — ephemeral tunnel URL (Cloudflare)

## Setup 9router baru

9router di-install via npm global, lalu shared config non-secret ini bisa di-restore dari dotfiles:
- `~/.9router/aliases.json`
- `~/.9router/runtime/package.json` ← dari `runtime-package.json`

Secret / state device-local tetap digenerate sendiri saat 9router pertama kali jalan:
- `auth/cli-secret`
- `jwt-secret`
- `machine-id`
- `tunnel/state.json`

Untuk restore penuh pi + 9router gunakan:

```bash
~/dotfiles/bin/pi-9router-restore
```
