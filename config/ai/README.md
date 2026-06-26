# ~/.config/ai — Memori bersama SEMUA AI CLI

Satu sumber memori, dibaca semua AI CLI (codex, Claude Code, pi.dev, Gemini, Antigravity/agy, + AI lain).

Struktur:
```
AGENTS.md        ← INDEX ringkas, ke-load tiap sesi + aturan inti + protokol memori
memory/          ← detail dipecah per topik (dibaca on-demand)
  environment.md   toolchain & cara install
  workflow.md      konvensi kerja
  preferences.md   preferensi user
  projects.md      fakta per-project (tumbuh seiring waktu)
```

`AGENTS.md` disambungkan (symlink) ke lokasi context-file tiap tool:
| Symlink | Dibaca oleh |
|---|---|
| `~/AGENTS.md`         | pi.dev, Codex, Antigravity(agy) |
| `~/.claude/CLAUDE.md` | Claude Code |
| `~/.codex/AGENTS.md`  | Codex |
| `~/.gemini/GEMINI.md` | Gemini CLI (+ Antigravity) |

**Symlink dikelola oleh `ai-memory-link`** (di `~/.local/bin/`). Nambah AI baru ke depan: tambahkan path-nya ke array `TARGETS` di script itu, lalu jalankan `ai-memory-link`.

**Edit memori:** ubah file di sini → otomatis kebaca semua tool.
**Auto-write:** AGENTS.md menyuruh AI menambah fakta baru sendiri ke `memory/*.md` (best-effort).

Memori = *apa yang benar* (di sini). Skill = *cara melakukan* (`~/.agents/skills/`, kelola via `skill-*`).
Ter-backup di dotfiles (`~/dotfiles`).
