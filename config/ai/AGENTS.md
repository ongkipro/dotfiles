# Environment & Working Agreement — global context untuk SEMUA AI CLI
> Dibaca pi/codex/Claude Code (via symlink). RINGKAS — ke-load tiap sesi.
> User: Paduka Ongki / ongkipro (Indonesia — boleh Bahasa Indonesia). Mesin: macOS 26 (Darwin arm64), zsh, terminal-first.

## Aturan inti (selalu berlaku)
- Tool sudah lengkap via mise/npm/pipx — JANGAN install ulang; cek dulu sebelum pasang.
- Install baru: `mise use -g` (CLI), `npm i -g` (node), `pipx` (python), `brew install` (system tools). `sudo` HANYA untuk hal sistem.
- Editor terminal: helix (`hx`). Git: lazygit (`lg`). Tool native: rg/fd/eza/bat. JANGAN dorong VSCode.
- Preview web: dev server di terminal + buka Chromium ke localhost.

## Memori — BACA & TULIS sendiri
Detail & fakta tersimpan terpisah di `~/.config/ai/memory/`:
- `identity.md` — identitas & profil
- `environment.md` — toolchain & cara install
- `development.md` — konvensi development
- `workflow.md` — konvensi kerja
- `preferences.md` — preferensi user
- `projects.md` — fakta tiap project

ATURAN MEMORI (ikuti ini):
1. Sebelum kerja, BACA file memori yang relevan (mis. `projects.md` saat masuk folder project).
2. Kalau menemukan fakta baru yang DURABLE (berlaku lintas sesi, bukan sekali pakai), APPEND sebagai bullet ringkas ke file paling cocok. Buat file topik baru di `memory/` kalau perlu.
3. Jangan duplikat fakta yang sudah ada; perbarui kalau berubah; hapus kalau salah.
4. JANGAN simpan rahasia/credential/token di memori.
5. Setelah update memori penting, ingatkan user commit ke `~/dotfiles` (atau lakukan bila diminta).

## Referensi
- Dotfiles backup: github.com/ongkipro/dotfiles (private).
