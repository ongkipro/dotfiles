# Device: `lenovo`

> Dibuat otomatis oleh `bin/device-register` — **jangan edit manual**, jalankan ulang scriptnya.
> Terakhir diperbarui: **2026-10-24**
> Fakta device yang TIDAK boleh di-sync (IP, key, catatan pribadi) → `~/.config/ai-local/device.md`.

## Identitas

| | |
|---|---|
| Hostname | `lenovo` |
| Device | **- -** |
| OS | Ubuntu 26.04.1 LTS |
| Kernel | 6.18.54.1-microsoft-standard-WSL2 · x86_64 |
| Service manager | systemd --user |
| Package manager | apt |

## Hardware

| | |
|---|---|
| CPU | 13th Gen Intel(R) Core(TM) i7-1355U (12 thread) |
| RAM | 7.6 GB |
| GPU | - |
| Disk (/) | 1007G total, 945G free (2% used) |

## AI CLI

| CLI | Status | Path |
|---|---|---|
| `claude` | terpasang | ~/.local/share/mise/shims/claude |
| `codex` | terpasang | ~/.local/share/mise/shims/codex |
| `pi` | terpasang | ~/.local/share/mise/shims/pi |
| `agy` | terpasang | ~/.local/bin/agy |
| `omp` | — | — |

## Toolchain

| Tool | Versi |
|---|---|
| node | v24.22.1 |
| pnpm | 12.15.0 |
| bun | 1.4.3 |
| python3 | Python 3.14.4 |
| mise | 2026.10.17 linux-x64 (2026-10-21) |
| git | git version 2.53.0 |

## Profil Claude Code

| Apa | Status |
|---|---|
| Profil aktif | `~/.claude` |
| deny baca `.env` | ✅ ada |
| hook canonical (git-guard, memory-usage) | ✅ terpasang |
| residu switcher multi-akun | ✅ bersih |

## Symlink dotfiles

| Apa | Path | Status |
|---|---|---|
| memori bersama | `~/.config/ai` | ✅ ok |
| memori → claude | `~/.claude/CLAUDE.md` | ✅ ok |
| memori → codex | `~/.codex/AGENTS.md` | ✅ ok |
| memori → agy | `~/.gemini/GEMINI.md` | ✅ ok |
| memori → omp | `~/.omp/agent/AGENTS.md` | ✅ ok |
| skills → shared runtime | `~/.agents/local-skills` | ✅ ok |
| skills → claude | `~/.claude/skills` | ✅ ok |
| skills → pi | `~/.pi/agent/skills` | ✅ ok |
| skills → agy | `~/.gemini/config/skills` | ✅ ok |
| skills → omp | `~/.omp/agent/skills` | ✅ ok |
| OMP config | `~/.omp/agent/config.yml` | — belum ada |
| OMP models | `~/.omp/agent/models.yml` | — belum ada |
| OMP specialist agents | `~/.omp/agent/agents` | — belum ada |
| mise toolchain | `~/.config/mise/config.toml` | ✅ ok |
| starship | `~/.config/starship.toml` | ✅ ok |
| helix | `~/.config/helix/config.toml` | ✅ ok |
| lazygit | `~/.config/lazygit/config.yml` | ✅ ok |
| gh cli | `~/.config/gh/config.yml` | ✅ ok |
| tmux | `~/.tmux.conf` | ✅ ok |
| gitignore global | `~/.gitignore_global` | ✅ ok |
