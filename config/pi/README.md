# Pi.dev Config Backup

**Live location**: `~/.pi/agent/`

## Files

- `settings.json` — source of truth config pi: default provider/model/theme/thinking, packages, **pi-image-gen** (gambar via 9router lokal+remote; key & tunnel URL tersanitasi jadi placeholder env)
- `models.template.json` — 9router provider definition + curated models (no secrets)
- `extensions/compact-free/` — extension untuk compaction pakai model gratis
- `extensions/welcome-screen/` — Ongki v2 PRESS START header (di-restore sebagai flat file `~/.pi/agent/extensions/welcome-screen.ts`, auto-load)

### Auto-sync models (Linux)

`bin/pi-9router-sync.js` + systemd unit `pi-9router-sync.service` (di-generate oleh
`pi-9router-restore`) menyinkronkan model dari provider **aktif** di 9router ke
`~/.pi/agent/models.json` tiap login. Jalankan manual:

```bash
systemctl --user start pi-9router-sync.service
```

### Env var (pi-image-gen provider remote)

Blok `pi-image-gen` di `settings.json` pakai placeholder — set sebelum pakai remote:

- `NINEROUTER_KEY` — API key 9router lokal (fallback `noauth`).
- `NINEROUTER_REMOTE_KEY` — API key 9router-fantastico (tunnel). JANGAN commit.
- `YOUR_TUNNEL.abc-tunnel.us` — ganti dengan hostname tunnel aktif saat restore.

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
mkdir -p ~/.pi/extensions/compact-free ~/.pi/agent/extensions
cp dotfiles/config/pi/extensions/compact-free/* ~/.pi/extensions/compact-free/
cp dotfiles/config/pi/extensions/welcome-screen/index.ts ~/.pi/agent/extensions/welcome-screen.ts
cp dotfiles/config/9router/aliases.json ~/.9router/aliases.json
cp dotfiles/config/9router/runtime-package.json ~/.9router/runtime/package.json
```

## 9router Provider Connections

Agar 9router bisa routing ke upstream provider, buka dashboard di:
  http://127.0.0.1:20128

Tambahkan **Provider Connections** (API key untuk opencode-go, minimax, dsb).
Tanpa ini, 9router hanya bisa list model tapi tidak bisa chat.

## Notes

- `models.template.json` = template aman tanpa API key. Script restore hanya copy ke `models.json` kalau file itu belum ada.
- `auth.json` di-manage manual karena berisi API keys / oauth token asli.
- `settings.json` adalah source of truth. Nilai default saat ini ikuti isi file tersebut (jangan hardcode di docs/script).
- `pi-9router-restore` akan restore pi config + shared 9router config, lalu generate launchd (macOS) atau systemd (Linux) service untuk 9router.
