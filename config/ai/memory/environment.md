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
- Linux `fantastico` (Ubuntu 7.0.0-27-generic, x86_64, hostname "Fantastico"): editor helix (languages.toml symlink → dotfiles), mise/npm/pipx; 9router autostart via **systemd --user** `~/.config/systemd/user/9router.service` (headless custom-server.js, 127.0.0.1:20128, Restart=always, enabled default.target). Linger **SUDAH aktif** (2026-07-13, `Linger=yes`) — 9router jalan tanpa login aktif.
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
- **vultr-cli** (2026-07-13 diperbarui): sekarang via **mise** (`vultr-cli@3.10.0`, shim di `~/.local/share/mise/shims/vultr-cli`) — binary lama di `~/.local/bin/` sudah hilang. Auth `~/.vultr-cli.yaml` **JUGA hilang → perlu re-input API key** (chmod 600, NOT di dotfiles). Skill: `~/dotfiles/skills/local/vultr/`.
- **Rencana 2-fase**: dev=Vultr SG (kredit) → prod=Hetzner SG. Migrasi murah (Coolify+git+pg_dump+Cloudflare ganti IP origin). Domain `tokophi.com` sudah di Cloudflare (DNS belum di-point).

## AI CLI — status terverifikasi (2026-07-13, `fantastico`)
- **Terpasang & jalan**: `claude` (2.1.207, login OK), `codex` (0.144.1, **BELUM login** — tak ada `~/.codex/auth.json`), `pi` (0.80.6), `agy` (Antigravity 1.1.1).
- **Gemini CLI: SENGAJA DIHAPUS (2026-07-13)** — keputusan user: stack Gemini dipakai lewat **Antigravity (`agy`)**, bukan `gemini` CLI. Paket `@google/gemini-cli` sudah `npm uninstall -g`. **JANGAN install ulang.**
- ⚠️ **`~/.gemini/` TETAP DIPERTAHANKAN** meski `gemini` CLI dihapus — isinya `GEMINI.md` (symlink → `~/.config/ai/AGENTS.md`, target `ai-memory-link`) yang dibaca **Antigravity**. Menghapus `~/.gemini` = merusak agy. Isi sekarang hanya `GEMINI.md` + `projects.json` (folder `antigravity-cli/` & `oauth_creds.json` sudah tidak ada).
- **agy**: binary asli bernama `~/.local/bin/antigravity` (ELF 173MB). Symlink `agy` sempat hilang, sudah dibuat ulang (`agy -> antigravity`). Config Antigravity di `~/.antigravity/{AGENTS.md,ANTIGRAVITY.md}`.
- **9router**: systemd user service `9router.service` aktif di **127.0.0.1:20128** (bukan 9000). Policy tetap: 9router HANYA untuk pi.dev via `~/.pi/agent/models.json`.
- ⚠️ **`~/.pi/agent/models.json` provider `9router-fantastico` masih placeholder** `https://YOUR_TUNNEL.abc-tunnel.us/v1` — belum diisi URL tunnel asli; provider `9router` lokal (127.0.0.1:20128) sudah benar.
- **Claude Code**: MCP lokal `chrome-devtools` (pakai `/usr/bin/chromium-browser`) untuk skill `web-perf`. Allowlist permission read-only + deny-rule secret ada di `~/.claude/settings.json`.
- **Supabase CLI sengaja TIDAK dipasang** — stack DB = PostgreSQL + Drizzle ORM + better-auth, self-host via Coolify di Vultr. Supabase tidak dipakai; jangan install kecuali ada project yang benar-benar butuh.

## Fix & tool baru di `fantastico` (2026-07-13)
- **`pi-9router-sync.service` DULU GAGAL tiap boot** (`9router is not installed or initialized`). Sebab: script mensyaratkan `~/.9router/auth/cli-secret`, padahal **9router 0.5.30 tidak lagi membuat dir `auth/`** (sekarang `~/.9router/jwt-secret`). Endpoint lokal `127.0.0.1:20128` **tidak memeriksa Authorization** (445 model terambil tanpa header). FIX: `~/dotfiles/bin/pi-9router-sync.js` — syarat `secretPath` dilepas, fallback `apiKey='noauth'`. Service sekarang `success`.
- Script hanya sync provider yang **AKTIF** di DB 9router → saat ini pi dapat 4 model (`oc/*` free). Mau lebih banyak: aktifkan provider di dashboard 9router (`localhost:20128`).
- **pi default = provider NATIVE `minimax` / model `MiniMax-M3`** (auth di `~/.pi/agent/auth.json`), BUKAN via 9router. Ini valid — jangan "diperbaiki".
- ⚠️ Tunnel `9router-fantastico` **MATI**: `https://rbq97ts.abc-tunnel.us/v1` balas **HTTP 530** (Cloudflare: tunnel not connected). `baseUrl` di `~/.pi/agent/models.json` masih placeholder `YOUR_TUNNEL` — perlu URL tunnel asli dari user.
- **Tool baru (terverifikasi)**: `psql`/`pg_dump`/`pg_restore` **18.4** via apt (client 18 boleh dump server PG16 — aman; sebaliknya TIDAK), `lm-sensors` (coretemp loaded; CPU ~53°C, GPU ~45°C idle), `wrangler` 4.110.0, `@shopify/cli` 4.4.0, `uv` (mise), `vultr-cli` 3.10.0 (mise).
- **Hardware `cuan`/fantastico**: Intel i7-8650U (4c/8t), RAM 14GB (~12GB free), swap 4GB (0 terpakai, no OOM), NVMe 233GB (8% used). GPU DUAL: Intel UHD 620 (`i915`) + **NVIDIA MX150 2GB (driver 580.159.03, `nvidia_drm` aktif)**. MX150 terlalu kecil utk LLM lokal — beban AI tetap ke cloud.

## 9router DINONAKTIFKAN (2026-07-13, `fantastico`) — bukan dihapus
- Keputusan user: 9router "tidak perlu" untuk sekarang. **Service di-stop + disable** (`9router.service` & `pi-9router-sync.service` → `enabled=disabled`, port 20128 mati). RAM 119MB bebas.
- **TIDAK dihapus** karena masih punya 3 dependent: (1) `pi-image-gen` (baseUrl `127.0.0.1:20128`), (2) extension pi `compact-free` (6 referensi), (3) project di `projects.md:31` yang route AI teks+image lewat 9router (`src/lib/ai/nine*`).
- **`~/.9router/` UTUH (68MB)** — `db/data.sqlite` berisi **API key provider upstream** dan folder `backups/` KOSONG. Jangan `rm -rf` tanpa export dulu; key-nya tidak bisa dipulihkan.
- Paket npm `9router@0.5.30` masih terpasang (tidak di-uninstall).
- **Hidupkan lagi**: `systemctl --user enable --now 9router.service` (+ `pi-9router-sync.service` kalau mau auto-sync model pi).
- Konsekuensi saat OFF: pi image-gen & compaction via 9router GAGAL. Chat utama pi tetap jalan (default = provider NATIVE `minimax`/`MiniMax-M3`, tak lewat 9router).
