# ~/.config/ai — Memori bersama AI CLI

`AGENTS.md` = **satu sumber memori** (konteks environment) yang dibaca semua AI CLI.
Disambungkan lewat **symlink** ke lokasi standar tiap tool:

| Symlink | Dibaca oleh |
|---|---|
| `~/AGENTS.md`        | pi, codex (discovery dari folder kerja naik ke home) |
| `~/.claude/CLAUDE.md`| Claude Code (memori global) |
| `~/.codex/AGENTS.md` | Codex (memori global) |

**Edit memori:** cukup ubah `~/.config/ai/AGENTS.md` → otomatis kena semua (karena symlink).

**Memori vs Skill:**
- Memori (file ini) = *apa yang benar* (konteks/fakta). → di sini.
- Skill = *cara melakukan* (kemampuan/prosedur). → di `~/.agents/skills/`.

Ikut ter-backup di dotfiles repo (`~/dotfiles/config/ai/`).
