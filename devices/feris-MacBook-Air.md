# Device: `feris-MacBook-Air`

> Dibuat otomatis oleh `bin/device-register` — **jangan edit manual**, jalankan ulang scriptnya.
> Terakhir diperbarui: **2026-08-17**
> Fakta device yang TIDAK boleh di-sync (IP, key, catatan pribadi) → `~/.config/ai-local/device.md`.

## Identitas

| | |
|---|---|
| Hostname | `feris-MacBook-Air` |
| Device | **Apple MacBookAir10,1 · laptop** |
| OS | macOS 26.5.1 |
| Kernel | 25.5.0 · arm64 |
| Service manager | launchd |
| Package manager | brew |

## Hardware

| | |
|---|---|
| CPU | Apple M1 (8 thread) |
| RAM | 8.0 GB |
| GPU | Apple M1 |
| Disk (/) | 228Gi total, 60Gi free (17% used) |

## AI CLI

| CLI | Status | Path |
|---|---|---|
| `claude` | — | — |
| `codex` | — | — |
| `pi` | terpasang | /opt/homebrew/bin/pi |
| `agy` | terpasang | ~/.local/bin/agy |
| `omp` | terpasang | ~/.local/bin/omp |

## Toolchain

| Tool | Versi |
|---|---|
| node | v24.18.0 |
| pnpm | 11.0.9 |
| bun | 1.3.14 |
| python3 | Python 3.14.6 |
| mise | 2026.6.14 macos-arm64 (2026-06-25) |
| git | git version 2.55.0 |

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
