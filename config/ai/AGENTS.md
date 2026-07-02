# Environment & Working Agreement — global context untuk SEMUA AI CLI
> Dibaca pi/codex/Claude Code (via symlink). RINGKAS — ke-load tiap sesi.
> User: Paduka Ongki / ongkipro (Indonesia — boleh Bahasa Indonesia). Mesin: macOS 26 (Darwin arm64), zsh, terminal-first.

## Aturan inti (selalu berlaku)
- Tool sudah lengkap via mise/npm/pipx — JANGAN install ulang; cek dulu sebelum pasang.
- Install baru: `mise use -g` (CLI), `npm i -g` (node), `pipx` (python), `brew install` (system tools). `sudo` HANYA untuk hal sistem.
- Editor terminal: helix (`hx`). Git: lazygit (`lg`). Tool native: rg/fd/eza/bat. JANGAN dorong VSCode.
- Preview web: dev server di terminal + buka Chromium ke localhost.

## AI CLI Connection Map
```
┌──────────┐    Native API    ┌──────────┐
│  Claude  │ ───────────────→ │ Anthropic │
└──────────┘                  └──────────┘
┌──────────┐    Native API    ┌──────────┐
│  Codex   │ ───────────────→ │ OpenAI    │
└──────────┘                  └──────────┘
┌──────────┐    Native API    ┌──────────┐
│  AGY     │ ───────────────→ │ Gemini    │
└──────────┘                  └──────────┘
┌──────────┐  9router (local) ┌──────────┐   upstream  ┌──────────────┐
│  pi.dev  │ ───────────────→ │ 9router  │ ──────────→ │ multi-provider│
│          │ 127.0.0.1:20128  │ gateway  │  fallback   │ (OCG/Codex/   │
└──────────┘                  └──────────┘             │  MiniMax/...) │
                                                       └──────────────┘
```
- **pi.dev** = satu-satunya CLI yang route lewat 9router (OpenAI-compatible gateway lokal).
- **Claude Code** = native Anthropic API (akun personal/kerja via wrapper `claude`/`claude-kerja`).
- **Codex** = native OpenAI API.
- **AGY (Antigravity)** = native Gemini API.
- **9router TIDAK BOLEH** dipakai sebagai provider oleh Claude Code, Codex, atau AGY.
- Semua CLI baca AGENTS.md yang sama via symlink. Semua skill di-share via `skill-update`.

## Memori — BACA & TULIS sendiri
Detail & fakta tersimpan terpisah di `~/.config/ai/memory/`:
- `identity.md` — identitas & profil
- `environment.md` — toolchain & cara install
- `development.md` — konvensi development
- `workflow.md` — konvensi kerja
- `preferences.md` — preferensi user
- `projects.md` — fakta tiap project
- `business.md` — arah bisnis & strategic filters
- `skills.md` — capability map & calibration rules
- `shopify.md` — Shopify development reference
- `decisions.md` — keputusan teknis yang sudah dibuat
- `goals.md` — target jangka pendek/panjang

ATURAN MEMORI (ikuti ini):
1. Sebelum kerja, BACA file memori yang relevan (mis. `projects.md` saat masuk folder project).
2. Kalau menemukan fakta baru yang DURABLE (berlaku lintas sesi, bukan sekali pakai), APPEND sebagai bullet ringkas ke file paling cocok. Buat file topik baru di `memory/` kalau perlu.
3. Jangan duplikat fakta yang sudah ada; perbarui kalau berubah; hapus kalau salah.
4. JANGAN simpan rahasia/credential/token di memori.
5. Setelah update memori penting, ingatkan user commit ke `~/dotfiles` (atau lakukan bila diminta).

## Referensi
- Dotfiles backup: github.com/ongkipro/dotfiles (private).
