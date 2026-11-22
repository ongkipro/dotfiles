# Device: `feris-MacBook-Air`

> Dibuat otomatis oleh `bin/device-register` — **jangan edit manual**, jalankan ulang scriptnya.
> Terakhir diperbarui: **2026-11-13**
> Fakta device yang TIDAK boleh di-sync (IP, key, catatan pribadi) → `~/.config/ai-local/device.md`.

## Identitas

| | |
|---|---|
| Hostname | `feris-MacBook-Air` |
| Device | **Apple MacBookAir10,1 · laptop** |
| OS | macOS 27.2 |
| Kernel | 27.2.0 · arm64 |
| Service manager | launchd |
| Package manager | brew |

## Hardware

| | |
|---|---|
| CPU | Apple M1 (8 thread) |
| RAM | 8.0 GB |
| GPU | Apple M1 |
| Disk (/) | 228Gi total, 59Gi free (18% used) |

## AI CLI

| CLI | Status | Path |
|---|---|---|
| `claude` | — | — |
| `codex` | — | — |
| `pi` | terpasang | ~/.pi/agent/bin/pi |
| `agy` | terpasang | ~/.local/bin/agy |
| `omp` | — | — |

## Toolchain

| Tool | Versi |
|---|---|
| node | v24.22.1 |
| pnpm | 11.0.9 |
| bun | 1.4.4 |
| python3 | Python 3.14.7 |
| mise | 2026.10.9 macos-arm64 (2026-10-13) |
| git | git version 2.55.0 |

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
| Terminal AI (nyaman / maksimum) | 1 / 1 |
| Slot job berat (`heavy-run`) | 1 (irisan memori 3.0 GB) |
| Subagen total (target) | 0 |
| Sumber biaya | bawaan, belum diukur |
| Mesin terdegradasi | ya |

## Symlink dotfiles

| Apa | Path | Status |
|---|---|---|
| memori bersama | `~/.config/ai` | ✅ ok |
| memori → claude | `~/.claude/CLAUDE.md` | ✅ ok |
| memori → codex | `~/.codex/AGENTS.md` | ✅ ok |
| memori → agy | `~/.gemini/GEMINI.md` | ✅ ok |
| memori → omp | `~/.omp/agent/AGENTS.md` | ✅ ok |
| skills → shared runtime | `~/.agents/local-skills` | ✅ ok |
| skills → claude | `~/.claude/skills` | ✅ ok (76 per-skill links) |
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
