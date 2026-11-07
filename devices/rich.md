# Device: `rich`

> Dibuat otomatis oleh `bin/device-register` — **jangan edit manual**, jalankan ulang scriptnya.
> Terakhir diperbarui: **2026-11-07**
> Fakta device yang TIDAK boleh di-sync (IP, key, catatan pribadi) → `~/.config/ai-local/device.md`.

## Identitas

| | |
|---|---|
| Hostname | `rich` |
| Device | **Dell Inc. OptiPlex 7050 · desktop** |
| OS | Ubuntu 24.04.5 LTS |
| Kernel | 7.0.0-42-generic · x86_64 |
| Service manager | systemd --user |
| Package manager | apt |

## Hardware

| | |
|---|---|
| CPU | Intel(R) Core(TM) i7-7700T CPU @ 2.90GHz (8 thread) |
| RAM | 31.2 GB |
| GPU | Intel Corporation HD Graphics 630 (rev 04) |
| Disk (/) | 218G total, 77G free (63% used) |

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
| pnpm | 12.15.0 |
| bun | 1.4.4 |
| python3 | Python 3.12.3 |
| mise | 2026.10.25 linux-x64 (2026-10-31) |
| git | git version 2.43.0 |

## Profil Claude Code

| Apa | Status |
|---|---|
| Profil aktif | `~/.claude` |
| deny baca `.env` | ✅ ada |
| hook canonical (git-guard, memory-usage) | ✅ terpasang |
| residu switcher multi-akun | ✅ bersih |

## Kapasitas AI paralel

> Dibaca dari `ai-capacity --json`. Terminal dan total subagen adalah target; yang ditegakkan hanya slot job berat, irisan memori, dan batas per-run pi-subagents. Panduan: [`docs/parallel-ai-dev-machine.md`](../docs/parallel-ai-dev-machine.md).

| Apa | Nilai |
|---|---|
| Terminal AI (nyaman / maksimum) | 4 / 5 |
| Slot job berat (`heavy-run`) | 2 (irisan memori 8.0 GB) |
| Subagen total (target) | 8 |
| Sumber biaya | diukur di mesin ini |
| Mesin terdegradasi | tidak |

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
| OMP config | `~/.omp/agent/config.yml` | ⚠️ file lokal (bukan symlink) |
| OMP models | `~/.omp/agent/models.yml` | ⚠️ file lokal (bukan symlink) |
| OMP specialist agents | `~/.omp/agent/agents` | — belum ada |
| mise toolchain | `~/.config/mise/config.toml` | ✅ ok |
| starship | `~/.config/starship.toml` | ✅ ok |
| helix | `~/.config/helix/config.toml` | ✅ ok |
| lazygit | `~/.config/lazygit/config.yml` | ✅ ok |
| gh cli | `~/.config/gh/config.yml` | ✅ ok |
| tmux | `~/.tmux.conf` | ✅ ok |
| gitignore global | `~/.gitignore_global` | ✅ ok |
