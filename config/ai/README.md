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
| `~/.claude/CLAUDE.md` | Claude Code |
| `~/.codex/AGENTS.md`  | Codex |
| `~/.antigravity/AGENTS.md` | Antigravity (agy) — context file utama |
| `~/.gemini/GEMINI.md` | Antigravity (agy) — stack Gemini |
| _(pi.dev)_            | BUKAN symlink — lewat wrapper `pi()` (`--append-system-prompt`) |

**`~/AGENTS.md` sengaja TIDAK ADA.** Keempat CLI sudah punya path khususnya sendiri, dan karena CLI naik dari cwd mencari `AGENTS.md`, file di home membuat aturan yang sama dimuat dua kali di tiap sesi di bawah `~`. Pernah muncul sebagai salinan tak ter-manage lalu rusak diam-diam; `ai-doctor` sekarang memperingatkan kalau ia muncul lagi.

**Symlink dikelola oleh `ai-memory-link`** (di `~/.local/bin/`). Nambah AI baru ke depan: tambahkan path-nya ke array `TARGETS` di script itu, lalu jalankan `ai-memory-link`.

**Edit memori:** ubah file di sini → otomatis kebaca semua tool.
**Auto-write:** AGENTS.md menyuruh AI menambah fakta baru sendiri ke `memory/*.md` (best-effort).
**Sync harian:** pakai `dotsync sync` untuk review → commit → push opsional; cocok untuk Linux dan macOS.

Memori = *apa yang benar* (di sini). Skill = *cara melakukan* (`~/.agents/skills/`, kelola via `skill-*`).
Ter-backup di dotfiles (`~/dotfiles`). Lihat juga `docs/ai-memory-sync.md`.
