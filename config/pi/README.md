# Pi.dev Config Backup

**Live location**: `~/.pi/agent/`

## Files

- `settings.json` — provider (9router), model default, theme, compaction, packages
- `models.template.json` — 9router provider definition + 7 curated models (no secrets)
- `extensions/compact-free/` — extension untuk compaction pakai model gratis

## Tidak di-backup (secret)

- `models.json` — berisi API key 9router (kalau pakai hosted 9router)
- `auth.json` — auth token Pi.dev + API keys untuk opencode-go, minimax, dsb
- `trust.json` — trusted sessions
- `sessions/` — history

## Restore

```bash
# Full restore (recommended)
~/dotfiles/bin/pi-9router-restore

# Manual restore
cp dotfiles/config/pi/settings.json ~/.pi/agent/settings.json
cp dotfiles/config/pi/models.template.json ~/.pi/agent/models.json  # hanya kalau belum ada
mkdir -p ~/.pi/extensions/compact-free
cp dotfiles/config/pi/extensions/compact-free/* ~/.pi/extensions/compact-free/
```

## 9router Provider Connections

Agar 9router bisa routing ke upstream provider, buka dashboard di:
  http://127.0.0.1:20128

Tambahkan **Provider Connections** (API key untuk opencode-go, minimax, dsb).
Tanpa ini, 9router hanya bisa list model tapi tidak bisa chat.

## Notes

- `models.template.json` = template aman tanpa API key. Copy jadi `models.json` untuk pakai.
- `auth.json` di-manage manual karena berisi API keys asli.
- `pi-9router-restore` akan generate launchd (macOS) atau systemd (Linux) service untuk 9router.
