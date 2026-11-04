# Device: `dot`

> Dibuat otomatis oleh `bin/device-register` — **jangan edit manual**, jalankan ulang scriptnya.
> Terakhir diperbarui: **2026-11-04**
> Fakta device yang TIDAK boleh di-sync (IP, key, catatan pribadi) → `~/.config/ai-local/device.md`.

## Identitas

| | |
|---|---|
| Hostname | `dot` |
| Device | **LENOVO Yoga Book 9 13IRU8 (`82YQ`) · laptop** |
| OS | Ubuntu 26.04.1 LTS |
| Kernel | 7.0.0-42-generic · x86_64 |
| Service manager | systemd --user |
| Package manager | apt |

## Hardware

| | |
|---|---|
| CPU | 13th Gen Intel(R) Core(TM) i7-1355U (12 thread) |
| RAM | 15.3 GB |
| GPU | Intel Corporation Raptor Lake-P [Iris Xe Graphics] (rev 04) |
| Disk (/) | 937G total, 850G free (5% used) |

## AI CLI

| CLI | Status | Path |
|---|---|---|
| `claude` | terpasang | ~/.local/share/mise/installs/node/24.22.1/bin/claude |
| `codex` | terpasang | ~/.local/share/mise/installs/node/24.22.1/bin/codex |
| `pi` | terpasang | ~/.local/share/mise/installs/node/24.22.1/bin/pi |
| `agy` | terpasang | ~/.local/bin/agy |
| `omp` | terpasang | ~/.local/bin/omp |

## Toolchain

| Tool | Versi |
|---|---|
| node | v24.22.1 |
| pnpm | 12.16.1 |
| bun | 1.4.4 |
| python3 | Python 3.14.4 |
| mise | 2026.10.25 linux-x64 (2026-10-31) |
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
