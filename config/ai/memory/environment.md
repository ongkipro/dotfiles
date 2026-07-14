# Memori: Environment — toolchain & install
> Bagian dari memori bersama. Perbarui kalau ada perubahan tool/setup.
> **MULTI-MACHINE — fakta OS-specific WAJIB menyebut mesinnya. Cek `uname -a` dulu.**
> - Linux (utama): hostname **`cuan`** — ThinkPad T480, Ubuntu 26.04, kernel 7.0.0. Julukan lama di memory = "fantastico" (mesin yang SAMA).
> - Mac (kedua): hostname **`ongkis-MacBook-Air`** — MacBook Air M1 8GB, macOS 26.5.2 arm64. ("`feriromansyah`" = julukan lama di memori, mesin yang SAMA; `hostname` asli bukan itu.)
> Instruksi `brew` = MAC SAJA. Di `cuan` pakai mise/apt.

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

## pi.dev + 9router — SATU-SATUNYA sumber kebenaran (2026-07-14)
> Section ini menggantikan 4 section lama yang saling bertentangan. Kalau ragu: **baca disk, jangan memory.**
> `~/.pi/agent/settings.json` = kebenaran untuk model. `systemctl --user is-enabled 9router.service` = kebenaran untuk service.

- **pi default = provider NATIVE `minimax` / model `MiniMax-M3`**, thinking `high`. TIDAK lewat 9router. Ini VALID — jangan "diperbaiki".
- ☠️ **Model default lama yang SUDAH MATI — jangan dihidupkan lagi**: `ocg/deepseek-v4-pro`, `cx/gpt-5.4-mini`, `opencode-go/minimax-m3`. Kalau ketemu di catatan lama, itu sampah.
- **9router MATI di `cuan` sejak 2026-07-13** (stop + disable, disengaja — lihat section "9router DINONAKTIFKAN"). Port 20128 mati **di Linux**. Ini NORMAL, bukan bug.
  - **Di Mac 9router HIDUP** (diverifikasi 2026-07-14: launchd `com.9router.gateway`, `127.0.0.1:20128`, health 200). Cek per-mesin: Linux `systemctl --user is-enabled 9router.service`, Mac `launchctl list | grep 9router`.
- ☠️ **JEBAKAN: 9router memasang autostart-nya SENDIRI** (`com.9router.autostart`, mode `--tray`). Job itu **tidak menyetel `HOSTNAME`** → gateway bind ke **`0.0.0.0`**, artinya API key SEMUA provider bisa dipakai siapa pun di WiFi yang sama. Dia juga duplikat dengan `com.9router.gateway` (dua proses rebutan port 20128, request mendarat non-deterministik). Sejak 2026-07-14 `bin/pi-9router-restore` mencabutnya otomatis (dipindah ke `~/.local/share/9router-disabled/`). **Kalau `lsof -nP -iTCP:20128` menunjukkan `*:20128` dan bukan `127.0.0.1:20128`, dia kambuh — jalankan `pi-9router-restore`.**
- **Policy (tetap berlaku): 9router HANYA untuk pi.dev.** Claude Code, Codex, dan agy TIDAK boleh lewat 9router.
- Claude Code lewat 9router = BOCOR: launcher 9router menyuntik proxy+CA per-proses. Jalankan `claude` biasa. Model `cc/claude-*` di selector = MITM 9router, tak punya rute upstream (error "may not exist").
- codex DILEPAS dari 9router (29 Jun 2026): blok `[model_providers.9router]` di `~/.codex/config.toml` di-comment; codex balik ke OpenAI native. Uncomment untuk pulihkan.

**Symlink pi (via dotfiles):** `~/.pi/agent/settings.json` → `dotfiles/config/pi/settings.json` · `~/.pi/extensions/compact-free/` → `dotfiles/config/pi/extensions/compact-free/` · `~/.pi/agent/extensions/welcome-screen.ts` → `dotfiles/config/pi/extensions/welcome-screen/index.ts` · `~/.9router/{aliases.json,runtime/package.json}` → `dotfiles/config/9router/`.
**TIDAK di dotfiles (secret):** `models.json` (API key), `auth.json` (oauth token). Backup lokal saja.
**Editing pi TUI/extension:** pakai `theme.fg(color, text)` — bukan curried.
**Claude account launcher:** `claude`/`claude-personal` → akun personal; `claude-kerja` → isolated `~/.claude-accounts/kerja`. Wrapper di `dotfiles/bin/` → `~/.local/bin/`.

## Mesin user (multi-machine)
- Memory `~/.config/ai/` di-sync via dotfiles ke BEBERAPA mesin — fakta OS/toolchain harus menyebut mesin yg relevan.
- Mac `ongkis-MacBook-Air` (MacBook Air M1 8GB, macOS 26.5.2 Darwin arm64): editor helix, mise/npm/pipx/brew. Detail lengkap: `devices/ongkis-MacBook-Air.md`.
- Linux `cuan` (ThinkPad T480, Ubuntu 26.04, kernel 7.0.0, x86_64) — julukan lama "fantastico": editor helix (languages.toml symlink → dotfiles), mise/npm/pipx. TIDAK ada brew.
- Mekanisme autostart 9router (kalau suatu saat dihidupkan lagi): mac → **launchd** `com.9router.autostart`; linux → **systemd --user** `~/.config/systemd/user/9router.service`. Generate via `dotfiles/bin/pi-9router-restore`. **Sekarang keduanya OFF** — lihat section "9router DINONAKTIFKAN".
- Saat kasih instruksi OS-specific (launchd vs systemd, brew vs apt, dsb), SELALU cek mesin dulu (`uname -a`).

## TokoΦ — server Vultr + Coolify (DIVERIFIKASI LANGSUNG dari API, 2026-07-14)
> Verifikasi ulang kapan pun: `vultr-cli instance list` · `vultr-cli account info` · `vultr-cli snapshot list`.
> ☠️ Catatan lama di sini SALAH TOTAL selama berhari-hari (server `45.76.146.40`, 8c/16GB, "$96/bln", "kredit habis 9 Agt"). Semua angka itu **fiktif** — servernya sudah tidak ada. Ini contoh kenapa **disk/API menang atas memori**.

- **SATU-SATUNYA instance**: label **`volumdev`** (namanya menyesatkan — isinya **TokoΦ + Coolify**).
  - ID `0d341106-34ff-4b5b-8441-9350e1b8ce35` · IP **45.77.33.112** · Singapore (sgp) · Ubuntu 24.04 · dibuat **2026-07-10** · status running.
  - Plan **`vhp-4c-8gb-amd`** = 4 vCPU / 8 GB / 180 GB → **$48,00/bulan** (BUKAN $96).
- **Server lama `45.76.146.40` (8c/16GB) SUDAH TIDAK ADA** — kemungkinan di-destroy 2026-07-10 saat `volumdev` dibuat. Kunci SSH `tokophi-dev` (`c4d746ce-…`) masih nyangkut di akun sebagai sisa; kunci aktif = `volumdev` (`6b68411e-…`).
- **Kredit: −$305,00 MASIH UTUH.** Pending charges baru **$12,24** (per 2026-07-14). Sumber: $300 "Account Credit" + $5 Visa, keduanya 2026-07-09.
  - Laju bakar $48/bln → kredit $305 ≈ **~6 bulan runway**, ASALKAN kredit tidak kedaluwarsa.
  - ⚠️ **Tanggal kedaluwarsa kredit TIDAK diekspos API Vultr** (di billing history cuma tercatat `payment / Account Credit`). Klaim lama "berlaku 1 bulan" **belum terverifikasi** — cek manual di dashboard Vultr → Billing. Kalau benar expire ~9 Agt, $305 hangus dan keputusan migrasi jadi mendesak.
- 🔴🔴 **KUNCI SSH HILANG — SERVER TIDAK BISA DI-SSH DARI `cuan` (2026-07-14).** `ssh root@45.77.33.112` → `Permission denied (publickey)`. Di `~/.ssh` cuma ada `id_ed25519` (kunci "laptop"), dan server menolaknya. Kunci `tokophi_dev` yang dicatat sesi 2026-07-09 **tidak ada** — kemungkinan besar **ikut terhapus saat install ulang Linux**. Vultr TIDAK bisa menyuntik kunci ke instance yang sudah jalan.
  - **Pintu yang masih ada**: Coolify web UI di `http://45.77.33.112:8000` (hidup, balas HTTP 302 → login; admin `ongkiardiansyah@gmail.com`). Port 22/80/443/8000 semua terbuka. App di `:80` balas 404 (belum ada domain di-point).
  - Untuk memulihkan SSH: tambah public key baru ke `authorized_keys` lewat **Coolify web terminal** ATAU reset root password lewat **console Vultr** — dua-duanya **MENGUBAH server**, butuh persetujuan user.
  - 📌 **Pelajaran**: kunci SSH server hanya ada di satu mesin = single point of failure. Simpan public key di beberapa tempat & catat cara pulih; JANGAN pernah taruh private key di dotfiles.
- 🔴 **BACKUP: MASIH NOL.** Tak ada snapshot, tak ada scheduled backup, tak ada block storage. (`pg_dump` harian yang dicatat di projects.md ada di **DISK YANG SAMA** → itu bukan backup.) Dan sekarang **tak bisa ditarik keluar lewat SSH** karena kuncinya hilang (lihat di atas).
- ☠️ **SNAPSHOT VULTR GAGAL — jangan buang waktu mengulanginya.** Dicoba 2× (2026-07-14): `f9526f57-…` dan `759dc88f-…`. Pola identik: status `pending` 15–30 menit → **lenyap**, `snapshot get` balas `404 Invalid snapshot ID`, `snapshot list` kosong. **API Vultr TIDAK memberi alasan apa pun.** Instance sendiri sehat (`active`/`running`) selama dan sesudahnya.
  - Dugaan (BELUM terverifikasi, jangan ditulis sebagai fakta): batasan akun baru / akun yang jalan di atas kredit promo. Cek notifikasi & tiket di dashboard Vultr.
  - **Rute backup yang benar = tarik data KELUAR dari server** (`pg_dump -Fc` + config Coolify/compose → lokal atau R2). Tidak bergantung pada fitur snapshot Vultr sama sekali.
- **Tak ada resource menagih lain**: block storage 0, load balancer 0, reserved IP 0, DNS 0. Jadi $48/bln itu total.
- **vultr-cli**: v3.10.0 via mise. Auth `~/.vultr-cli.yaml` (chmod 600, di `$HOME` — **JANGAN** di dotfiles, dan **JANGAN** `export VULTR_API_KEY` di `~/.bashrc`: `dotsync refresh_snapshots` menyalin bashrc ke repo). Sudah terpasang & jalan per 2026-07-14. Skill: `dotfiles/skills/local/vultr/`.
- **Rencana 2-fase**: dev=Vultr SG (kredit) → prod=Hetzner SG. Migrasi murah (Coolify + git + `pg_dump` + ganti IP origin di Cloudflare). Domain `tokophi.com` di Cloudflare, DNS belum di-point.

## AI CLI — status terverifikasi (2026-07-13, `fantastico`)
- **Terpasang & jalan**: `claude` (2.1.207, login OK), `codex` (0.144.1, **BELUM login** — tak ada `~/.codex/auth.json`), `pi` (0.80.6), `agy` (Antigravity 1.1.1).
- **Gemini CLI: SENGAJA DIHAPUS (2026-07-13)** — keputusan user: stack Gemini dipakai lewat **Antigravity (`agy`)**, bukan `gemini` CLI. Paket `@google/gemini-cli` sudah `npm uninstall -g`. **JANGAN install ulang.**
- ⚠️ **`~/.gemini/` TETAP DIPERTAHANKAN** meski `gemini` CLI dihapus — isinya `GEMINI.md` (symlink → `~/.config/ai/AGENTS.md`, dibuat `ai-memory-link`) yang dibaca **Antigravity**. **Menghapus `~/.gemini` = merusak agy.** Isi per 2026-07-14: `GEMINI.md`, `projects.json`, `config/`, dan **`antigravity-cli/` (MASIH ADA** — catatan lama yang bilang folder ini sudah hilang itu SALAH).
- **agy**: binary asli bernama `~/.local/bin/antigravity` (ELF 173MB). Symlink `agy` sempat hilang, sudah dibuat ulang (`agy -> antigravity`). Config Antigravity di `~/.antigravity/{AGENTS.md,ANTIGRAVITY.md}`.
- **9router: MATI** (`disabled` + `inactive` sejak 2026-07-13, disengaja). Port 20128 tutup. Jangan tulis "9router aktif" lagi di memory tanpa cek `systemctl --user is-enabled 9router.service`.
- ⚠️ **`~/.pi/agent/models.json` provider `9router-fantastico` masih placeholder** `https://YOUR_TUNNEL.abc-tunnel.us/v1` — belum diisi URL tunnel asli. Tunnel `rbq97ts.abc-tunnel.us` juga MATI (HTTP 530). Moot selama 9router OFF.
- **Claude Code**: MCP lokal `chrome-devtools` (pakai `/usr/bin/chromium-browser`) untuk skill `web-perf`. Allowlist permission read-only + deny-rule secret ada di `~/.claude/settings.json`.
- **Supabase CLI sengaja TIDAK dipasang** (diverifikasi 2026-07-14: `supabase` tidak ada di PATH) — stack DB = PostgreSQL + Drizzle ORM + better-auth, self-host via Coolify. Jangan install kecuali ada project yang benar-benar butuh. Folder `~/.supabase/` ADA tapi cuma sisa/kosong — abaikan, bukan tanda Supabase terpasang. Skill `supabase-stack` tetap disimpan untuk referensi, bukan tanda adopsi.

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

## Device registry + git credential (2026-07-13)
- **`devices/` di dotfiles = registry lintas-device.** Satu file per mesin (`devices/<hostname>.md`): merek/model, CPU, RAM, GPU, disk, AI CLI, toolchain, dan **status tiap symlink dotfiles**. Indeks: `devices/README.md`. Generate/refresh: `device-register` (idempotent, `--dry-run` tersedia; dipanggil otomatis oleh install.sh/install-macos.sh, non-fatal).
- Mesin linux utama: hostname **`cuan`** (BUKAN "fantastico" — itu julukan lama di memory). **Lenovo ThinkPad T480** (`20L6S3ED00`), i7-8650U 4c/8t, RAM **14.9 GB**, NVMe 233GB, GPU Intel UHD 620 + NVIDIA MX150 2GB.
- **`~/.config/mise/config.toml` kini SYMLINK ke `dotfiles/config/mise-config.toml`** → `mise use -g <tool>` otomatis tercatat di dotfiles (sudah diuji: mise menulis TEMBUS symlink, tidak merusaknya). `node` sengaja TIDAK di config bersama (bentrok nvm vs shim mise).
- ⚠️ **`git config credential.helper` sempat menunjuk `/home/ongki/.local/bin/gh` yang TIDAK ADA** → semua `git push` gagal (`could not read Username`). gh yang benar ada di `/usr/bin/gh`. Diperbaiki dengan `gh auth setup-git`. Kalau push gagal lagi dengan pesan serupa, jalankan itu.
- **Device lain (Mac) AKTIF push ke repo ini.** Selalu `git pull --rebase` sebelum push. Konflik nyata pernah terjadi di `install-macos.sh` (Mac tambah `pi-9router-restore`, linux tambah `device-register`) — resolusinya GABUNG, jangan pilih salah satu.

## Identitas git — SATU untuk semua device (2026-07-13)
- **Patokan: `ongkipro <82156528+ongkipro@users.noreply.github.com>`** (GitHub noreply — email asli tak pernah masuk riwayat commit, tapi commit tetap terhitung ke profil). ID `82156528` diambil dari `gh api user`, bukan tebakan.
- Sebelumnya ada **4 identitas** beredar: global `ongkiardiansyah@gmail.com`, `install-macos.sh` hardcode `get@ongki.pro`, akun GitHub `ongkipro`, dan — yang paling menipu — **config LOKAL repo dotfiles** `Ongki Pro <[email protected]>`. Config lokal SELALU menang atas global, jadi commit dari mesin ini ter-atribusi ke identitas yang tak disengaja.
- Override lokal di `~/dotfiles` sudah DICABUT (`git config --local --unset user.name/user.email`) → ikut global. `install-macos.sh` juga sudah diseragamkan.
- ⚠️ **Commit lama (sebelum 2026-07-13) tetap membawa email lama** — tidak di-rewrite (sudah ter-push; rewrite = destruktif).
- ⚠️ **Cek repo lain**: `git config --local --get user.email` di tiap repo. Kalau ada override serupa, cabut juga.
- **`credential.helper` = `!gh auth git-credential`** (TANPA path absolut — supaya jalan di Linux `/usr/bin/gh` maupun Mac `/opt/homebrew/bin/gh`). Kalau `git push` gagal "could not read Username": jalankan `gh auth setup-git`.

## Antigravity (`agy`) — cara install RESMI (2026-07-13, diverifikasi)
- **Installer resmi**: `curl -fsSL https://antigravity.google/cli/install.sh | bash` → lalu `agy install` (konfigurasi PATH + shell). Docs: https://antigravity.google/docs/cli-getting-started
- Diverifikasi langsung: URL balas **HTTP 200**, isinya script bash asli ("Antigravity CLI - Unix Bootstrapper Script"), `TARGET_DIR="$HOME/.local/bin"`, `BINARY_PATH="$TARGET_DIR/agy"`.
- **Bukan paket npm**, tidak butuh Node. Binary flat native, langsung bernama `agy`.
- Subcommand: `agy install` · `agy update` · `agy models` · `agy agents` · `agy plugin` · `agy changelog`. **Tidak ada `agy login`** — auth jalan saat `agy` pertama dijalankan (lewat browser).
- ✅ **Mesin `cuan` sudah di-INSTALL ULANG pakai installer resmi (2026-07-13)**: sekarang `~/.local/bin/agy` = binary ELF asli (173MB), BUKAN symlink lagi. Binary lama `~/.local/bin/antigravity` (166MB) sudah DIHAPUS. Masalah "symlink agy hilang diam-diam" tak bisa terulang.
- ⚠️ **Installer `agy` MENGOTORI `~/.profile` + `~/.bashrc`**: menambah `export PATH="/home/ongki/.local/bin:$PATH"` (hardcode home path). `~/.profile` itu SYMLINK ke `dotfiles/home/profile` → baris itu ikut ter-commit & PATAH di Mac (`/Users/...`). Dotfiles sudah handle `~/.local/bin` secara portabel (guard idempotent di .bashrc:166). **Setelah tiap install/update agy: `git checkout home/profile` + hapus baris `# Added by Antigravity CLI installer` dari shell rc.**
- Antigravity **menggantikan Gemini CLI** (yang sudah dihapus dari mesin ini).
