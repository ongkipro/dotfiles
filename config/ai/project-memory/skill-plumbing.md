---
name: skill-plumbing
description: "Skill bersumber tunggal di ~/dotfiles/skills/local; claude & pi pakai symlink SATU-DIREKTORI, jadi `git pull` sudah cukup"
metadata: 
  node_type: memory
  type: project
  originSessionId: 678a7f8d-f6e5-48ea-a900-2ddb3e7431ff
  modified: 2026-07-20T14:34:00.642Z
---

Sumber tunggal skill = **`~/dotfiles/skills/local/`** (35 skill per 2026-07-20; verifikasi: `ls -1 ~/dotfiles/skills/local | grep -v '^_' | wc -l` — angka ini gampang basi, disk menang). `~/.claude/skills` dan `~/.pi/agent/skills` adalah **symlink ke direktori itu** — bukan kumpulan symlink per-skill.

**Why:** sejak commit dotfiles `42cd188` (2026-07-14) modelnya berubah jadi symlink satu-direktori. Konsekuensinya **`git pull` saja sudah sinkron** — skill baru muncul sendiri, skill yang dihapus hilang sendiri. `skill-update` hanya perlu dijalankan sekali saat memasang CLI baru.

**How to apply:** setelah `git pull` di dotfiles, jangan jalankan apa-apa — cek saja dengan `ai-doctor`. Jangan bikin skill jadi plugin `codex`/`agy`: keduanya tak punya direktori skill by design, mereka cukup `skill-list` lalu membaca `~/dotfiles/skills/local/<nama>/SKILL.md` langsung.

⚠️ **Kalau `skill-update` mencetak `Backed up existing path: ... -> *.backup.<ts>`, JANGAN anggap itu duplikat dan jangan hapus.** Versi lama script itu punya bug destruktif: bunyi tersebut bisa berarti SELURUH skill asli di dalam dotfiles baru saja dipindahkan. Periksa `~/dotfiles/skills/local/` masih utuh dulu. (Catatan lama yang menyuruh "hapus saja" itu SALAH dan sudah dicabut.)

**Pengecualian plugin (diputuskan 2026-07-20):** kontrak "no plugins" di `_refresh-vendored.sh` TIDAK mutlak. Plugin boleh dipakai **asal resmi dari vendor** (situs resmi / GitHub official), bukan bikinan sendiri. Terpasang & disetujui: `vercel@claude-plugins-official` (30 skill) + `stripe@claude-plugins-official` (5 skill), keduanya dari marketplace `claude-plugins-official`. Cek: `cat ~/.claude/plugins/installed_plugins.json`. Konsekuensi: plugin hanya melayani **claude**, sementara skill di dotfiles melayani keempat CLI — jadi jangan pindahkan skill lokal ke plugin.

Sisa model lama **sudah bersih per 2026-07-20**: `~/.agents/skills`, `~/.gemini/skills`, dan clone jezweb `~/.agents/repos/shared-skills` semuanya tidak ada lagi. ⚠️ `~/.codex/skills` MASIH ADA tapi **bukan sisa lama** — isinya cuma `.system` (skill bawaan codex, aktif ter-update). **Jangan dihapus.**

Kontrak lengkapnya di `~/.config/ai/AGENTS.md` + `~/.config/ai/memory/skills.md`. Terkait [[antigravity-cli-agy]].
