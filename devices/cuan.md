# Device: `cuan`

> Dibuat otomatis oleh `bin/device-register` — **jangan edit manual**, jalankan ulang scriptnya.
> Terakhir diperbarui: **2026-07-13**
> Fakta device yang TIDAK boleh di-sync (IP, key, catatan pribadi) → `~/.config/ai-local/device.md`.

## Identitas

| | |
|---|---|
| Hostname | `cuan` |
| Device | **LENOVO ThinkPad T480 (`20L6S3ED00`) · laptop** |
| OS | Ubuntu 26.04 LTS |
| Kernel | 7.0.0-27-generic · x86_64 |
| Service manager | systemd --user |
| Package manager | apt |

## Hardware

| | |
|---|---|
| CPU | Intel(R) Core(TM) i7-8650U CPU @ 1.90GHz (8 thread) |
| RAM | 14.9 GB |
| GPU | Intel Corporation Kaby Lake-R GT2 [UHD Graphics 620] (rev 07) + NVIDIA Corporation GP108M [GeForce MX150] (rev a1) |
| Disk (/) | 233G total, 204G free (8% used) |

## AI CLI

| CLI | Status | Path |
|---|---|---|
| `claude` | terpasang | ~/.nvm/versions/node/v24.18.0/bin/claude |
| `codex` | terpasang | ~/.nvm/versions/node/v24.18.0/bin/codex |
| `pi` | terpasang | ~/.nvm/versions/node/v24.18.0/bin/pi |
| `agy` | terpasang | ~/.local/bin/agy |

## Toolchain

| Tool | Versi |
|---|---|
| node | v24.18.0 |
| pnpm | 11.11.0 |
| bun | 1.3.14 |
| python3 | Python 3.14.4 |
| mise | 2026.7.5 linux-x64 (2026-07-09) |
| git | git version 2.53.0 |

## Symlink dotfiles

| Apa | Path | Status |
|---|---|---|
| memori bersama | `~/.config/ai` | ✅ ok |
| skills | `~/.agents/local-skills` | ✅ ok |
| mise toolchain | `~/.config/mise/config.toml` | ✅ ok |
| starship | `~/.config/starship.toml` | ✅ ok |
| lazygit | `~/.config/lazygit/config.yml` | ✅ ok |
| gh cli | `~/.config/gh/config.yml` | ✅ ok |
| tmux | `~/.tmux.conf` | ✅ ok |
| gitignore global | `~/.gitignore_global` | ✅ ok |
