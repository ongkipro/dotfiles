# Device: `Fantastico`

> Dibuat otomatis oleh `bin/device-register` — **jangan edit manual**, jalankan ulang scriptnya.
> Terakhir diperbarui: **2026-11-10**
> Fakta device yang TIDAK boleh di-sync (IP, key, catatan pribadi) → `~/.config/ai-local/device.md`.

## Identitas

| | |
|---|---|
| Hostname | `Fantastico` |
| Device | **LENOVO ThinkPad X280 (`20KES2SP07`) · laptop** |
| OS | Ubuntu 26.04.1 LTS |
| Kernel | 7.0.0-42-generic · x86_64 |
| Service manager | systemd --user |
| Package manager | apt |

## Hardware

| | |
|---|---|
| CPU | Intel(R) Core(TM) i7-8650U CPU @ 1.90GHz (8 thread) |
| RAM | 15.5 GB |
| GPU | Intel Corporation Kaby Lake-R GT2 [UHD Graphics 620] (rev 07) |
| Disk (/) | 233G total, 161G free (28% used) |

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
| python3 | Python 3.14.4 |
| mise | 2026.10.15 linux-x64 (2026-10-19) |
| git | git version 2.53.0 |

## Profil Claude Code

| Apa | Status |
|---|---|
| Profil aktif | `~/.claude` |
| deny baca `.env` | ✅ ada |
| hook canonical (git-guard, memory-usage) | ✅ terpasang |
| residu switcher multi-akun | ✅ bersih |

## Kapasitas AI paralel

> Rencana dari `ai-capacity --json`: angka yang direkomendasikan untuk mesin ini, bukan bukti bahwa batasnya sudah terpasang. Terminal dan total subagen hanya target; slot job berat, irisan memori, dan batas per-run pi-subagents baru ditegakkan setelah `ai-capacity apply`. Irisan memori hanya ada di Linux dengan systemd; penegakan slot dan pembersihan proses `heavy-run` belum teruji di macOS (lihat panduan). Panduan: [`docs/parallel-ai-dev-machine.md`](../docs/parallel-ai-dev-machine.md).

| Apa | Nilai |
|---|---|
| Terminal AI (nyaman / maksimum) | 2 / 2 |
| Slot job berat (`heavy-run`) | 1 (irisan memori 4.0 GB) |
| Subagen total (target) | 7 |
| Sumber biaya | bawaan, belum diukur |
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
