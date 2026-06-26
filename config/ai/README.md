# ~/.config/ai — Memori bersama AI CLI

Struktur:
```
AGENTS.md        ← INDEX ringkas, selalu ke-load tiap sesi + aturan inti + protokol memori
memory/          ← detail dipecah per topik (dibaca on-demand)
  environment.md   toolchain & cara install
  workflow.md      konvensi kerja
  preferences.md   preferensi user
  projects.md      fakta per-project (tumbuh seiring waktu)
```

`AGENTS.md` disambungkan (symlink) ke lokasi standar tiap tool:
| Symlink | Dibaca oleh |
|---|---|
| `~/AGENTS.md`         | pi, codex |
| `~/.claude/CLAUDE.md` | Claude Code |
| `~/.codex/AGENTS.md`  | Codex |

**Edit memori:** ubah file di sini → otomatis kebaca semua tool (AGENTS.md via symlink; memory/ dibaca on-demand).

**Auto-write:** AGENTS.md memuat instruksi agar AI (pi/codex/claude) **menambah fakta baru sendiri** ke `memory/*.md` saat menemukannya (best-effort, mengikuti instruksi — bukan fitur bawaan).

**Memori vs Skill:**
- Memori = *apa yang benar* (konteks/fakta) → folder ini.
- Skill = *cara melakukan* (kemampuan) → `~/.agents/skills/`.

Ter-backup di dotfiles (`~/dotfiles/config/ai/`).
