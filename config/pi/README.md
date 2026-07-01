# Pi.dev Config Backup

**Live location**: `~/.pi/agent/`

## Files

- `settings.json` — provider (9router), model default, theme, compaction, packages
- `extensions/compact-free/` — extension untuk compaction pakai model gratis

## Tidak di-backup (secret)

- `models.json` — ada local API key 9router (sk-...)
- `auth.json` — auth token Pi.dev
- `trust.json` — trusted sessions
- `sessions/` — history

## Restore

```bash
# Full restore (recommended)
~/dotfiles/bin/pi-9router-restore

# Manual restore
cp dotfiles/config/pi/settings.json ~/.pi/agent/settings.json
mkdir -p ~/.pi/extensions/compact-free
cp dotfiles/config/pi/extensions/compact-free/* ~/.pi/extensions/compact-free/
```

## Notes

- `models.json` tetap manual karena berisi API key 9router.
- `pi-9router-restore` akan generate `~/.config/systemd/user/9router.service` pakai path `node` + runtime 9router aktif di mesin saat itu, lalu menjalankan `custom-server.js` langsung (tanpa tray mode), enable + restart servicenya.
