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

- **pi default = provider NATIVE `openai-codex` / model `gpt-5.4`** (di-set 2026-07-20 di mesin `cuan`, dipropagasi ke semua mesin via symlink `config/pi/settings.json`). Cek: `jq '.defaultProvider, .defaultModel' ~/.pi/agent/settings.json`. Provider `9router` TETAP tersedia di `~/.pi/agent/models.json` untuk model lokal/opsional — pi TIDAK lagi default lewat 9router. Catatan lama (default `minimax`/`MiniMax-M3`, atau default `9router`/`cx/gpt-5.4`) **SUDAH TIDAK BERLAKU**.
- ☠️ **Model default lama yang SUDAH MATI — jangan dihidupkan lagi**: `ocg/deepseek-v4-pro`, `cx/gpt-5.4-mini` (perhatikan sufiks `-mini`; yang aktif sekarang `cx/gpt-5.4` **tanpa** `-mini` — prefix `cx/` sendiri tidak bermasalah), `opencode-go/minimax-m3`. Kalau ketemu di catatan lama, itu sampah.
- **Status 9router itu PER-MESIN — cek, jangan tebak.** Mac: `launchctl list | grep 9router` → per 2026-07-20 **HIDUP** (`com.9router.gateway`, LISTEN `127.0.0.1:20128`). Linux `cuan`: `systemctl --user is-enabled 9router.service` → **MATI** sejak 2026-07-13 (stop + disable, disengaja — lihat section "9router DINONAKTIFKAN"). Mati di `cuan` itu NORMAL, bukan bug.
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
- Identitas + spek tiap mesin: header file ini (ringkas) dan `devices/<hostname>.md` di dotfiles (lengkap). Jangan tulis ulang spek di section lain.
- Beda toolchain yang perlu diingat: Mac punya brew; `cuan` **TIDAK ada brew** (mise/npm/pipx saja). Di `cuan` helix `languages.toml` symlink → dotfiles.
- Mekanisme autostart 9router (launchd di mac vs systemd --user di linux) + jebakannya: lihat section "pi.dev + 9router" — jangan digandakan ke sini.
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
- ✅ **SSH PULIH (2026-07-14).** Kunci `tokophi_dev` lama HILANG (ikut terhapus saat install ulang Linux di `cuan`) → server sempat tak bisa di-SSH sama sekali. Dipulihkan dengan menempel `~/.ssh/id_ed25519.pub` (kunci "laptop") ke `authorized_keys` server lewat **Coolify web terminal** (Vultr TIDAK bisa menyuntik kunci ke instance yang sudah jalan). Sekarang: `ssh root@<IP di atas>` → tembus.
  - Coolify web UI `http://45.77.33.112:8000` (admin `ongkiardiansyah@gmail.com`) = **pintu darurat kalau SSH mati lagi**. Port 22/80/443/8000 terbuka. App `:80` → 404 (domain belum di-point).
  - 📌 **Pelajaran**: kunci SSH server yang cuma ada di SATU mesin = single point of failure, dan install ulang OS melenyapkannya. Private key JANGAN pernah masuk dotfiles; tapi catat cara pulih (lewat Coolify/console provider).
- ✅ **BACKUP PERTAMA BERHASIL (2026-07-14, di mesin `cuan`)** — `~/Documents/work/backups/root_<ip>-<stamp>/`, total ~6 MB. ⚠️ Folder ini **ada di `cuan` saja**; di Mac `~/Documents/work/backups/` TIDAK ADA (diverifikasi 2026-07-20). Artinya backup TokoΦ cuma hidup di satu mesin. Dibuat & diverifikasi dengan **`vps-pgdump root@45.77.33.112`** (`dotfiles/bin/`).
  - `tokophi.dump` (984K, 532 objek) — DB aplikasi.
  - `coolify.dump` (5.1M, 557 objek) — **DB internal Coolify**: definisi app, env, config deploy. Tanpa ini, server hilang = susun ulang seluruh setup deploy dari nol. **Jangan lupakan yang ini.**
  - `coolify-config.tar.gz` — `docker-compose.yaml` + `.env` stack TokoΦ.
  - Semua dump **lolos `pg_restore -l`** (bukan klaim, tapi uji). Restore: `pg_restore -d <db> --clean --if-exists <file>.dump`.
  - 🔒 Backup berisi SECRET → **DI LUAR repo**. JANGAN commit.
  - ⚠️ Backup ini **sekali jalan, manual**. Belum terjadwal. Ulangi sebelum perubahan berisiko, dan pertimbangkan cron.
  - Stack TokoΦ di server (7 container, semua healthy): postgres, admin, super-admin, storefront, landing, cron, backup. Plus `migrate-*` yang `Exited (0)` = NORMAL (jalan sekali saat deploy, sukses).
- ☠️ **SNAPSHOT VULTR GAGAL — jangan buang waktu mengulanginya.** Dicoba 2× (2026-07-14): `f9526f57-…` dan `759dc88f-…`. Pola identik: status `pending` 15–30 menit → **lenyap**, `snapshot get` balas `404 Invalid snapshot ID`, `snapshot list` kosong. **API Vultr TIDAK memberi alasan apa pun.** Instance sendiri sehat (`active`/`running`) selama dan sesudahnya.
  - Dugaan (BELUM terverifikasi, jangan ditulis sebagai fakta): batasan akun baru / akun yang jalan di atas kredit promo. Cek notifikasi & tiket di dashboard Vultr.
  - **Rute backup yang benar = tarik data KELUAR dari server** (`pg_dump -Fc` + config Coolify/compose → lokal atau R2). Tidak bergantung pada fitur snapshot Vultr sama sekali.
- **Tak ada resource menagih lain**: block storage 0, load balancer 0, reserved IP 0, DNS 0. Jadi $48/bln itu total.
- **vultr-cli**: v3.10.0 via mise. Auth `~/.vultr-cli.yaml` (chmod 600, di `$HOME` — **JANGAN** di dotfiles, dan **JANGAN** `export VULTR_API_KEY` di `~/.bashrc`: `dotsync refresh_snapshots` menyalin bashrc ke repo). Sudah terpasang & jalan per 2026-07-14. Skill: `dotfiles/skills/local/vultr/`.
- **Rencana 2-fase**: dev=Vultr SG (kredit) → prod=Hetzner SG. Migrasi murah (Coolify + git + `pg_dump` + ganti IP origin di Cloudflare). Domain `tokophi.com` di Cloudflare, DNS belum di-point.

## AI CLI — status terverifikasi (2026-07-13, `cuan`)
- **Terpasang**: `claude` (login OK), `codex` (**BELUM login** di `cuan` — tak ada `~/.codex/auth.json`), `pi`, `agy` (Antigravity). **Versi sengaja TIDAK dicatat** — berubah tiap update, angka di memori pasti basi. Cek: `claude --version; codex --version; pi --version; agy --version`.
- **Gemini CLI: SENGAJA DIHAPUS (2026-07-13)** — keputusan user: stack Gemini dipakai lewat **Antigravity (`agy`)**, bukan `gemini` CLI. Paket `@google/gemini-cli` sudah `npm uninstall -g`. **JANGAN install ulang.**
- ⚠️ **`~/.gemini/` TETAP DIPERTAHANKAN** meski `gemini` CLI dihapus — isinya `GEMINI.md` (symlink → `~/.config/ai/AGENTS.md`, dibuat `ai-memory-link`) yang dibaca **Antigravity**. **Menghapus `~/.gemini` = merusak agy.** Isi per 2026-07-14: `GEMINI.md`, `projects.json`, `config/`, dan **`antigravity-cli/` (MASIH ADA** — catatan lama yang bilang folder ini sudah hilang itu SALAH).
- **agy**: binary flat native, namanya **beda per mesin** — di Mac `~/.local/bin/agy` (143M, diverifikasi 2026-07-20; TIDAK ada file `antigravity` di sini), di `cuan` binary ELF hasil installer resmi. Cek: `ls -l ~/.local/bin/ | grep -iE 'agy|antigravity'`. Config Antigravity di `~/.antigravity/{AGENTS.md,ANTIGRAVITY.md}`.
- **Status 9router**: lihat section "pi.dev + 9router" (per-mesin, satu tempat). Jangan tulis status 9router di sini lagi.
- ⚠️ **`~/.pi/agent/models.json` provider `9router-fantastico` masih placeholder** `https://YOUR_TUNNEL.abc-tunnel.us/v1` — belum diisi URL tunnel asli, perlu URL dari user. Tunnel `rbq97ts.abc-tunnel.us` MATI: balas **HTTP 530** (Cloudflare: tunnel not connected).
- **Claude Code**: MCP lokal `chrome-devtools` (pakai `/usr/bin/chromium-browser`) untuk skill `web-perf`. Allowlist permission read-only + deny-rule secret ada di `~/.claude/settings.json`.
- **Supabase CLI sengaja TIDAK dipasang** (diverifikasi 2026-07-14: `supabase` tidak ada di PATH) — stack DB = PostgreSQL + Drizzle ORM + better-auth, self-host via Coolify. Jangan install kecuali ada project yang benar-benar butuh. Folder `~/.supabase/` **TIDAK ADA di Mac** (diverifikasi 2026-07-20 — catatan lama yang bilang "ADA tapi sisa/kosong" salah untuk mesin ini). Skill `supabase-stack` tetap disimpan untuk referensi, bukan tanda adopsi.

## Fix & tool baru di `cuan` (2026-07-13)
- **`pi-9router-sync.service` DULU GAGAL tiap boot** (`9router is not installed or initialized`). Sebab: script mensyaratkan `~/.9router/auth/cli-secret`, padahal **9router 0.5.30 tidak lagi membuat dir `auth/`** (sekarang `~/.9router/jwt-secret`). Endpoint lokal `127.0.0.1:20128` **tidak memeriksa Authorization** (445 model terambil tanpa header). FIX: `~/dotfiles/bin/pi-9router-sync.js` — syarat `secretPath` dilepas, fallback `apiKey='noauth'`. Service sekarang `success`.
- Script hanya sync provider yang **AKTIF** di DB 9router → saat ini pi dapat 4 model (`oc/*` free). Mau lebih banyak: aktifkan provider di dashboard 9router (`localhost:20128`).
- **Tool baru (terverifikasi)**: `psql`/`pg_dump`/`pg_restore` **18.4** via apt (client 18 boleh dump server PG16 — aman; sebaliknya TIDAK), `lm-sensors` (coretemp loaded; CPU ~53°C, GPU ~45°C idle), `wrangler` 4.110.0, `@shopify/cli` 4.4.0, `uv` (mise), `vultr-cli` 3.10.0 (mise).
- **Hardware `cuan`**: spek lengkap di section "Device registry" — jangan digandakan. Yang penting untuk keputusan AI: swap 4GB tak terpakai (no OOM), dan **GPU MX150 2GB terlalu kecil untuk LLM lokal** → beban AI tetap ke cloud.

## 9router DINONAKTIFKAN di `cuan` (2026-07-13) — bukan dihapus, dan HANYA di mesin itu
- Keputusan user: 9router "tidak perlu" untuk sekarang. **Service di-stop + disable** (`9router.service` & `pi-9router-sync.service` → `enabled=disabled`, port 20128 mati). RAM 119MB bebas.
- **TIDAK dihapus** karena masih punya 3 dependent: (1) `pi-image-gen` (baseUrl `127.0.0.1:20128`), (2) extension pi `compact-free` (6 referensi), (3) project di `projects.md:31` yang route AI teks+image lewat 9router (`src/lib/ai/nine*`).
- **`~/.9router/` UTUH (68MB)** — `db/data.sqlite` berisi **API key provider upstream** dan folder `backups/` KOSONG. Jangan `rm -rf` tanpa export dulu; key-nya tidak bisa dipulihkan.
- Paket npm `9router@0.5.30` masih terpasang (tidak di-uninstall).
- **Hidupkan lagi**: `systemctl --user enable --now 9router.service` (+ `pi-9router-sync.service` kalau mau auto-sync model pi).
- Konsekuensi saat OFF: pi image-gen & compaction via 9router GAGAL. ⚠️ **Sejak 2026-07-20 chat utama pi JUGA ikut mati kalau 9router OFF** — default pi sekarang `9router`/`cx/gpt-5.4`, bukan lagi provider native. Catatan lama "chat utama pi tetap jalan" sudah tidak berlaku.

## Device registry + git credential (2026-07-13)
- **`devices/` di dotfiles = registry lintas-device.** Satu file per mesin (`devices/<hostname>.md`): merek/model, CPU, RAM, GPU, disk, AI CLI, toolchain, dan **status tiap symlink dotfiles**. Indeks: `devices/README.md`. Generate/refresh: `device-register` (idempotent, `--dry-run` tersedia; dipanggil otomatis oleh install.sh/install-macos.sh, non-fatal).
- **Spek `cuan` (satu-satunya tempat di file ini):** **Lenovo ThinkPad T480** (`20L6S3ED00`), i7-8650U 4c/8t, RAM **14.9 GB** (~12GB free), swap 4GB, NVMe 233GB (8% used), GPU DUAL Intel UHD 620 (`i915`) + NVIDIA MX150 2GB (driver 580.159.03, `nvidia_drm` aktif).
- **`~/.config/mise/config.toml` kini SYMLINK ke `dotfiles/config/mise-config.toml`** → `mise use -g <tool>` otomatis tercatat di dotfiles (sudah diuji: mise menulis TEMBUS symlink, tidak merusaknya). `node` sengaja TIDAK di config bersama (bentrok nvm vs shim mise).
- **Device lain (Mac) AKTIF push ke repo ini.** Selalu `git pull --rebase` sebelum push. Konflik nyata pernah terjadi di `install-macos.sh` (Mac tambah `pi-9router-restore`, linux tambah `device-register`) — resolusinya GABUNG, jangan pilih salah satu.

## Identitas git — SATU untuk semua device (2026-07-13)
- **Patokan: `ongkipro <82156528+ongkipro@users.noreply.github.com>`** (GitHub noreply — email asli tak pernah masuk riwayat commit, tapi commit tetap terhitung ke profil). ID `82156528` diambil dari `gh api user`, bukan tebakan.
- Sebelumnya ada **4 identitas** beredar: global `ongkiardiansyah@gmail.com`, `install-macos.sh` hardcode `get@ongki.pro`, akun GitHub `ongkipro`, dan — yang paling menipu — **config LOKAL repo dotfiles** `Ongki Pro <[email protected]>`. Config lokal SELALU menang atas global, jadi commit dari mesin ini ter-atribusi ke identitas yang tak disengaja.
- Override lokal di `~/dotfiles` sudah DICABUT (`git config --local --unset user.name/user.email`) → ikut global. `install-macos.sh` juga sudah diseragamkan.
- ⚠️ **Commit lama (sebelum 2026-07-13) tetap membawa email lama** — tidak di-rewrite (sudah ter-push; rewrite = destruktif).
- ⚠️ **Cek repo lain**: `git config --local --get user.email` di tiap repo. Kalau ada override serupa, cabut juga.
- **`credential.helper` = `!gh auth git-credential`** (TANPA path absolut — supaya jalan di Linux `/usr/bin/gh` maupun Mac `/opt/homebrew/bin/gh`). Pernah ter-set ke path absolut `/home/ongki/.local/bin/gh` yang TIDAK ADA → semua `git push` gagal `could not read Username`. Kalau push gagal dengan pesan itu: jalankan `gh auth setup-git`.

## Antigravity (`agy`) — cara install RESMI (2026-07-13, diverifikasi)
- **Installer resmi**: `curl -fsSL https://antigravity.google/cli/install.sh | bash` → lalu `agy install` (konfigurasi PATH + shell). Docs: https://antigravity.google/docs/cli-getting-started
- Diverifikasi langsung: URL balas **HTTP 200**, isinya script bash asli ("Antigravity CLI - Unix Bootstrapper Script"), `TARGET_DIR="$HOME/.local/bin"`, `BINARY_PATH="$TARGET_DIR/agy"`.
- **Bukan paket npm**, tidak butuh Node. Binary flat native, langsung bernama `agy`.
- Subcommand: `agy install` · `agy update` · `agy models` · `agy agents` · `agy plugin` · `agy changelog`. **Tidak ada `agy login`** — auth jalan saat `agy` pertama dijalankan (lewat browser).
- ✅ **Mesin `cuan` sudah di-INSTALL ULANG pakai installer resmi (2026-07-13)**: sekarang `~/.local/bin/agy` = binary ELF asli (173MB), BUKAN symlink lagi. Binary lama `~/.local/bin/antigravity` (166MB) sudah DIHAPUS. Masalah "symlink agy hilang diam-diam" tak bisa terulang.
- ⚠️ **Installer `agy` MENGOTORI `~/.profile` + `~/.bashrc`**: menambah `export PATH="/home/ongki/.local/bin:$PATH"` (hardcode home path). `~/.profile` itu SYMLINK ke `dotfiles/home/profile` → baris itu ikut ter-commit & PATAH di Mac (`/Users/...`). Dotfiles sudah handle `~/.local/bin` secara portabel (guard idempotent di .bashrc:166). **Setelah tiap install/update agy: `git checkout home/profile` + hapus baris `# Added by Antigravity CLI installer` dari shell rc.**
- Antigravity **menggantikan Gemini CLI** (yang sudah dihapus dari mesin ini).
