# Device: `rich`

> Dibuat otomatis oleh `bin/device-register` — **jangan edit manual**, jalankan ulang scriptnya.
> Terakhir diperbarui: **2026-08-17**
> Fakta device yang TIDAK boleh di-sync (IP, key, catatan pribadi) → `~/.config/ai-local/device.md`.

## Identitas

| | |
|---|---|
| Hostname | `rich` |
| Device | **Dell Inc. OptiPlex 7050 · desktop** |
| OS | Ubuntu 24.04.4 LTS |
| Kernel | 7.0.0-28-generic · x86_64 |
| Service manager | systemd --user |
| Package manager | apt |

## Hardware

| | |
|---|---|
| CPU | Intel(R) Core(TM) i7-7700T CPU @ 2.90GHz (8 thread) |
| RAM | 31.2 GB |
| GPU | Intel Corporation HD Graphics 630 (rev 04) |
| Disk (/) | 218G total, 157G free (25% used) |

## AI CLI

| CLI | Status | Path |
|---|---|---|
| `claude` | terpasang | ~/.local/share/mise/shims/claude |
| `codex` | terpasang | ~/.local/share/mise/shims/codex |
| `pi` | terpasang | ~/.local/share/mise/shims/pi |
| `agy` | terpasang | ~/.local/bin/agy |
| `omp` | terpasang | ~/.local/bin/omp |

## Toolchain

| Tool | Versi |
|---|---|
| node | v24.18.0 |
| pnpm | 11.22.0 |
| bun | 1.3.14 |
| python3 | Python 3.12.3 |
| mise | 2026.8.6 linux-x64 (2026-08-14) |
| git | git version 2.43.0 |

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
