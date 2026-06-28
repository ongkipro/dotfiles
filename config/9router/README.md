# 9router Config Backup

**Live location**: `~/.9router/`

## Files

- `aliases.json` — model aliases (kosong = default)
- `runtime-package.json` — native deps (better-sqlite3/sql.js)

## Tidak di-backup (secret)

- `auth/cli-secret` — CLI auth token
- `jwt-secret` — JWT signing key
- `machine-id` — device ID
- `tunnel/state.json` — ephemeral tunnel URL (Cloudflare)

## Setup 9router baru

9router di-install dan di-setup via Pi.dev extension system.
Setelah install, auth + jwt-secret di-generate otomatis.
