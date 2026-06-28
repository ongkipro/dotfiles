# Pi.dev Config Backup

**Live location**: `~/.pi/agent/`

## Files

- `settings.json` — provider, model default, theme, compaction, packages

## Tidak di-backup (secret)

- `auth.json` — auth token Pi.dev
- `models.json` — ada local API key 9router (sk-...)
- `trust.json` — trusted sessions
- `sessions/` — history

## Restore

```bash
cp dotfiles/config/pi/settings.json ~/.pi/agent/settings.json
```
