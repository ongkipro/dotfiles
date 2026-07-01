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
# Settings
cp dotfiles/config/pi/settings.json ~/.pi/agent/settings.json

# Compact-free extension
mkdir -p ~/.pi/extensions/compact-free
cp dotfiles/config/pi/extensions/compact-free/* ~/.pi/extensions/compact-free/
```
