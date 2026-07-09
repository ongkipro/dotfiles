# Memori: Environment — toolchain & install
> Bagian dari memori bersama. Perbarui kalau ada perubahan tool/setup.
> Mesin: macOS 26 (Darwin arm64), MacBook Air M1 8GB.

## Tool terpasang (JANGAN install ulang)
- mise (no-sudo): fzf, fd, bat, delta, lazygit, zoxide, eza, yq(v4), ripgrep, ruff, starship, helix, tealdeer, direnv, qsv.
- Editor: helix (`hx`). `EDITOR=hx`.
- npm -g: pi, 9router, pnpm, typescript-language-server, vscode-langservers-extracted, @tailwindcss/language-server, yaml-language-server, bash-language-server, pyright.
- pipx: python-lsp-server (pylsp).
- Homebrew (system): gh, tmux, pnpm, chromium, pipx.
- Browser: Chromium (`brew install chromium`), Google Chrome.
- Git + delta diff pager + `~/.gitignore_global`.

## tmux (bagian wajib bootstrap dotfiles)
- Setup tmux full di-handle `bin/tmux-setup` (idempotent, cross-platform): install binary (apt/dnf/pacman/zypper di Linux, brew di macOS) + clipboard tool (wl-clipboard/xclip di Linux; pbcopy bawaan macOS) + link `~/.tmux.conf`, `~/.local/bin/tmux-clip`, dan `~/.local/bin/tmux-battery` + clone TPM + install/clean plugin.
- Dipanggil otomatis dari `install.sh` dan `install-macos.sh`. Bisa juga dijalankan manual: `tmux-setup`.
- Prefix `Ctrl+a`. Theme: plain-font friendly Catppuccin-inspired palette (tanpa ketergantungan Nerd Font). Plugin: tmux-sensible, tmux-yank, resurrect, continuum, prefix-highlight, tmux-open. Clipboard via `bin/tmux-clip`, battery/status helper via `bin/tmux-battery`. Reload: prefix+r. Update plugin: prefix+U / install plugin baru: prefix+I. Save session: prefix+S. Restore: prefix+R.

## Cara install (kapan sudo)
- CLI / runtime → `mise use -g <nama>` (no sudo); update `mise up`; hapus `mise rm <nama>`.
- Tool Node → `npm i -g <paket>`. App Python → `pipx install <paket>`.
- System tools → `brew install <nama>`. GUI apps → `brew install --cask <nama>`.
- `sudo` HANYA untuk file sistem (jarang dibutuhkan di macOS).

## pi.dev / 9router
- pi route lewat 9router lokal (`http://localhost:20128/v1`), jalan sebagai **launchd agent** `com.9router.autostart` (auto-start on login), bind local-only `127.0.0.1`, port 20128.
- pi pakai provider `9router` (internal ID: rbq97ts); default model `ocg/deepseek-v4-pro`. Cek `~/.pi/agent/settings.json` (symlink → dotfiles).
- AGENTS.md di-load via symlink ke semua CLI. Memori bersama di `~/.config/ai/` (AGENTS.md + memory/*.md). Memori AI system di `~/dotfiles/memori-ai/`.
- 9router terinstall via npm global; launchd plist di `~/Library/LaunchAgents/com.9router.autostart.plist`.
- Claude account launcher: `claude` dan `claude-personal` default ke personal account via `akun personal`; `claude-kerja` pakai isolated `~/.claude-accounts/kerja`. Wrappers di `~/dotfiles/bin/` symlinked ke `~/.local/bin/`.

## Isolasi 9router (policy: 9router HANYA untuk pi.dev)
- 9router (localhost:20128, MITM + cloudflare tunnel) khusus dipakai pi.dev via `~/.pi/agent/models.json`.
- codex DILEPAS dari 9router (29 Jun 2026): `model_provider`/blok `[model_providers.9router]` di `~/.codex/config.toml` di-comment; codex balik ke OpenAI native (punya OPENAI_API_KEY + login ChatGPT di ~/.codex/auth.json). Uncomment utk pulihkan.
- Claude Code TIDAK boleh lewat 9router: jalankan `claude` biasa (jangan via launcher/menu 9router yg menyuntik proxy+CA per-proses). Tak ada env/proxy global — kebocoran hanya jika diluncurkan lewat 9router. Model `cc/claude-*` yg muncul di selector = MITM 9router & tak punya rute upstream (error "may not exist").
- gemini sudah bersih (tak pernah nunjuk 9router).
- Pi global extension `~/.pi/agent/extensions/welcome-screen.ts` customises the TUI header with a Garuda welcome screen; use `theme.fg(color, text)` (not curried) when editing pi TUI themes/extensions.

## Mesin user (multi-machine, clarifikasi 2026-07-07)
- Memory `~/.config/ai/` di-sync via dotfiles ke BEBERAPA mesin — fakta OS/toolchain harus menyebut mesin yg relevan.
- Mac `feriromansyah` (MacBook Air M1 8GB, macOS 26 Darwin arm64): editor helix, mise/npm/pipx; 9router autostart via **launchd** `com.9router.autostart` (headless custom-server.js, 127.0.0.1:20128).
- Linux `fantastico` (Ubuntu 7.0.0-27-generic, x86_64, hostname "Fantastico"): editor helix (languages.toml symlink → dotfiles), mise/npm/pipx; 9router autostart via **systemd --user** `~/.config/systemd/user/9router.service` (headless custom-server.js, 127.0.0.1:20128, Restart=always, enabled default.target). Linger belum di-enable (perlu `sudo loginctl enable-linger $USER` agar jalan tanpa login aktif).
- Saat kasih instruksi OS-specific (launchd vs systemd, brew vs apt, dsb), SELALU cek mesin dulu (`uname -a`).

## Setup pi/9router per mesin (disinkronkan via dotfiles)
- pi pakai provider `9router` (internal ID `rbq97ts`), default model **`cx/gpt-5.4-mini`** (awas: `ocg/deepseek-v4-pro` yg lama sudah TIDAK ada di 9router — prefix `ocg/` itu provider NATIVE pi, bukan 9router). Kalau butuh model 9router lain: `curl localhost:20128/v1/models`.
- `~/.pi/agent/settings.json` symlink → `~/dotfiles/config/pi/settings.json`. NOTE: file ini machine-coupled (skills array pernah salah isi path `/Users/feriromansyah/...`); dotfiles versi sudah dibersihkan (skills array di-drop, defaultModel diperbaiki).
- `~/.pi/extensions/compact-free/` symlink → `~/dotfiles/config/pi/extensions/compact-free/`. Compaction pakai provider NATIVE pi (opencode-go/minimax/openai-codex, auth di `~/.pi/agent/auth.json`) — BUKAN 9router. Policy: 9router HANYA untuk chat utama pi.
- `~/.pi/agent/extensions/welcome-screen.ts` symlink → `~/dotfiles/config/pi/extensions/welcome-screen/index.ts` (single-file auto-load, isi welcome header Garuda Gold).
- `~/.9router/aliases.json` + `~/.9router/runtime/package.json` symlink → `~/dotfiles/config/9router/`.
- `models.json` TIDAK di-dotfiles (berisi API key 9router). `auth.json` TIDAK di-dotfiles (oauth token). Backup = lokal saja.

## Setup pi/9router di linux `fantastico` (2026-07-07)
- `~/.pi/agent/settings.json` symlink → `~/dotfiles/config/pi/settings.json` (sama dengan mac; default `opencode-go/minimax-m3`, theme `dark`).
- `~/.pi/extensions/compact-free/` symlink → `~/dotfiles/config/pi/extensions/compact-free/` (ladder 5 model gratis, mayoritas via 9router).
- `~/.pi/agent/extensions/welcome-screen.ts` symlink → `~/dotfiles/config/pi/extensions/welcome-screen/index.ts`.
- 9router autostart: **systemd --user** `~/.config/systemd/user/9router.service` (headless `custom-server.js`, bind `127.0.0.1:20128`, `Restart=always`, `WantedBy=default.target`). Generate via `~/dotfiles/bin/pi-9router-restore` (linux). mac → launchd `com.9router.autostart`.
- `~/.9router/{aliases.json,runtime/package.json}` symlink → `~/dotfiles/config/9router/`. `models.json` + `auth.json` TIDAK di-dotfiles (secret).

## TokoΦ — server dev (Vultr) + Coolify (2026-07-09, mesin linux `fantastico`)
- **VPS dev**: Vultr, IP **45.76.146.40**, region **Singapore (sgp)**, plan `vhp-8c-16gb-amd` (8 vCPU/16GB/350GB NVMe, ~$96/mo — **ditutup kredit $305 berlaku 1 BULAN**). Ubuntu 24.04. ⚠️ **Destroy/migrasi sebelum kredit expiry** biar tak kena charge.
- **SSH**: key-only, `ssh -i ~/.ssh/tokophi_dev root@45.76.146.40` (private key lokal di fantastico; Vultr ssh-key id `c4d746ce-…`). UFW aktif: 22/80/443/8000/6001/6002.
- **Coolify** v4.1.2 di server (dashboard `http://45.76.146.40:8000`, admin `ongkiardiansyah@gmail.com`, registrasi publik OFF). Docker diinstall otomatis oleh installer Coolify. Server type = Localhost/"This Machine".
- **vultr-cli** terpasang di `~/.local/bin/vultr-cli` (fantastico); auth di `~/.vultr-cli.yaml` (api-key, chmod 600, NOT di dotfiles). Skill baru: `~/dotfiles/skills/local/vultr/`.
- **Rencana 2-fase**: dev=Vultr SG (kredit) → prod=Hetzner SG. Migrasi murah (Coolify+git+pg_dump+Cloudflare ganti IP origin). Domain `tokophi.com` sudah di Cloudflare (DNS belum di-point).
