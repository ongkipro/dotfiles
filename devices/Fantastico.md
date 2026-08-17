# Device: `Fantastico`

> Dibuat otomatis oleh `bin/device-register` — **jangan edit manual**, jalankan ulang scriptnya.
> Terakhir diperbarui: **2026-08-17**
> Fakta device yang TIDAK boleh di-sync (IP, key, catatan pribadi) → `~/.config/ai-local/device.md`.

## Identitas

| | |
|---|---|
| Hostname | `Fantastico` |
| Device | **LENOVO ThinkPad X280 (`20KES2SP07`) · laptop** |
| OS | Ubuntu 26.04 LTS |
| Kernel | 7.0.0-29-generic · x86_64 |
| Service manager | systemd --user |
| Package manager | apt |

## Hardware

| | |
|---|---|
| CPU | Intel(R) Core(TM) i7-8650U CPU @ 1.90GHz (8 thread) |
| RAM | 15.5 GB |
| GPU | Intel Corporation Kaby Lake-R GT2 [UHD Graphics 620] (rev 07) |
| Disk (/) | 233G total, 141G free (37% used) |

## AI CLI

| CLI | Status | Path |
|---|---|---|
| `claude` | terpasang | ~/.nvm/versions/node/v24.16.0/bin/claude |
| `codex` | terpasang | ~/.nvm/versions/node/v24.16.0/bin/codex |
| `pi` | terpasang | ~/.nvm/versions/node/v24.16.0/bin/pi |
| `agy` | terpasang | ~/.local/bin/agy |
| `omp` | terpasang | ~/.local/bin/omp |

## Toolchain

| Tool | Versi |
|---|---|
| node | v24.16.0 |
| pnpm | 11.22.0 |
| bun | 1.3.14 |
| python3 | Python 3.14.4 |
| mise | 2026.6.14 linux-x64 (2026-06-25) |
| git | git version 2.53.0 |

## Symlink dotfiles

| Apa | Path | Status |
|---|---|---|
| memori bersama | `~/.config/ai` | ✅ ok |
| memori → claude | `~/.claude/CLAUDE.md` | ✅ ok |
| memori → codex | `~/.codex/AGENTS.md` | ✅ ok |
| memori → agy | `~/.antigravity/AGENTS.md` | ✅ ok |
| memori → agy (gemini stack) | `~/.gemini/GEMINI.md` | ✅ ok |
| memori → omp | `~/.omp/agent/AGENTS.md` | ✅ ok |
| skills → shared runtime | `~/.agents/local-skills` | ✅ ok |
| skills → claude | `~/.claude/skills` | ✅ ok |
| skills → pi | `~/.pi/agent/skills` | ✅ ok |
| skills → agy | `~/.gemini/config/skills` | ✅ ok |
| skills → omp | `~/.omp/agent/skills` | ✅ ok |
| OMP config | `~/.omp/agent/config.yml` | ✅ ok |
| OMP models | `~/.omp/agent/models.yml` | ✅ ok |
| OMP specialist agents | `~/.omp/agent/agents` | ✅ ok |
| mise toolchain | `~/.config/mise/config.toml` | ✅ ok |
| starship | `~/.config/starship.toml` | ✅ ok |
| helix | `~/.config/helix/config.toml` | ✅ ok |
| lazygit | `~/.config/lazygit/config.yml` | ✅ ok |
| gh cli | `~/.config/gh/config.yml` | ✅ ok |
| tmux | `~/.tmux.conf` | ✅ ok |
| gitignore global | `~/.gitignore_global` | ✅ ok |
