<div align="center">

```
█▀▄ █▀█ ▀█▀ █▀▀ █ █   █▀▀ █▀▀
█▄▀ █▄█  █  █▀  █ █▄▄ ██▄ ▄▄█
```

**Terminal-first dev environment. AI-native. Zero bloat.**

**Linux-first bootstrap. macOS-ready shared memory sync.**

[![macOS](https://img.shields.io/badge/macOS-26-000000?style=flat-square&logo=apple&logoColor=white)](https://apple.com)
[![Ubuntu](https://img.shields.io/badge/Ubuntu-26.04-E95420?style=flat-square&logo=ubuntu&logoColor=white)](https://ubuntu.com)
[![Shell](https://img.shields.io/badge/Shell-zsh_|_bash-4EAA25?style=flat-square&logo=gnu-bash&logoColor=white)](https://www.gnu.org/software/bash/)
[![Helix](https://img.shields.io/badge/Editor-Helix-7D5E9C?style=flat-square)](https://helix-editor.com)
[![mise](https://img.shields.io/badge/Tools-mise-FF6B6B?style=flat-square)](https://mise.jdx.dev)
[![Private](https://img.shields.io/badge/Repo-Private-555?style=flat-square&logo=github)](https://github.com/ongkipro/dotfiles)
[![AI Skills](https://img.shields.io/badge/AI%20Skills-SEO_|_Shopify_|_Astro_|_Cloudflare-0ea5e9?style=flat-square)](#-ai-skills-system)

*Designed, maintained, and curated by [Ongki Pro](https://ongki.pro).*

</div>

---

## 📖 Repo ini apa, sih? (baca ini dulu)

**Singkatnya: ini "otak cadangan" dari semua komputer saya.**

Saya punya beberapa device (laptop Linux, Mac, dan seterusnya). Tanpa repo ini, tiap
device jadi pulau sendiri: tool beda-beda, setelan beda-beda, dan AI di device A tidak
tahu apa yang sudah saya kerjakan di device B. Repo ini menyatukannya.

### Apa gunanya?

| Masalah | Yang repo ini lakukan |
|---|---|
| Laptop rusak / beli baru → setup ulang dari nol berhari-hari | `git clone` + `./install.sh` → tool, setelan, dan memori AI kembali |
| Tiap device setelannya beda-beda dan lama-lama menyimpang | Semua device menunjuk ke **satu sumber kebenaran** (repo ini) |
| AI CLI (Claude/Codex/pi/agy) tak saling tahu konteks | Semua membaca **satu file memori bersama** |
| Lupa device mana saja yang dipakai, spek-nya apa | [`devices/`](devices/) — registry otomatis |

### Cara kerjanya: symlink, bukan copy-paste

Ini kunci yang paling penting untuk dipahami. Repo ini **tidak menyalin** file ke
tempatnya. Ia membuat **symlink** — semacam "jalan pintas" yang menunjuk balik ke repo.

```
~/.config/ai  ───(symlink)──→  ~/dotfiles/config/ai
   ^ yang dibaca AI              ^ yang tersimpan di Git
```

Akibatnya — dan ini yang bikin enak:

- Saya edit memori AI lewat `~/.config/ai/...` → yang **berubah adalah file di repo**.
- Jadi tidak ada langkah "jangan lupa copy ke dotfiles". Tidak ada drift diam-diam.
- Cukup `git commit` + `git push`, device lain tinggal `git pull`.

> ⚠️ Kelemahan symlink: kalau target di repo dihapus/dipindah, symlink-nya jadi
> **putus** dan diam saja — program jalan pakai setelan default tanpa memberi tahu.
> Ini pernah terjadi ke lazygit. Makanya `device-register` sekarang ikut mengecek
> status tiap symlink (lihat tabel di file device).

### Tree: bagian laptop mana yang terhubung ke dotfiles?

Kotak kiri = laptopmu. Kotak kanan = repo ini. Panah = symlink.

```
LAPTOP (~/)                              DOTFILES (~/dotfiles/)
│
├── .config/
│   ├── ai/ ─────────────────────────→  config/ai/            ← MEMORI AI (inti)
│   ├── mise/config.toml ────────────→  config/mise-config.toml  ← daftar tool
│   ├── starship.toml ───────────────→  config/starship.toml
│   ├── helix/config.toml ───────────→  config/helix/config.toml
│   ├── helix/languages.toml ────────→  config/helix/languages.toml
│   ├── lazygit/config.yml ──────────→  config/lazygit/config.yml
│   ├── gh/config.yml ───────────────→  config/gh/config.yml
│   │
│   ├── gh/hosts.yml ................  ✗ LOKAL — berisi token GitHub
│   └── ai-local/device.md .........   ✗ LOKAL — IP server, catatan mesin
│
├── .claude/skills/ ─────────┐
├── .pi/agent/skills/ ───────┼────────→  skills/local/         ← SKILL AI (33)
├── .agents/local-skills/ ───┘             (symlink SATU-DIREKTORI)
│
├── .claude/CLAUDE.md ───────┐
├── .codex/AGENTS.md ────────┤
├── .antigravity/AGENTS.md ──┼────────→  config/ai/AGENTS.md   ← 4 AI, 1 aturan
└── .gemini/GEMINI.md ───────┘             (dibuat `ai-memory-link`)
    (.gemini = milik agy, BUKAN gemini-cli)

├── .tmux.conf ─────────────────────→  config/tmux.conf
├── .gitignore_global ──────────────→  config/gitignore_global
├── .ripgreprc ─────────────────────→  config/ripgreprc
├── .profile ───────────────────────→  home/profile
├── .local/bin/{dotsync,device-register,…} ─→  bin/
│
├── .ssh/ .........................  ✗ LOKAL — 🔒 KEY SSH TIDAK PERNAH KE REPO
├── .bashrc .......................  ✗ LOKAL — di-patch, cuma di-snapshot ke repo
└── .9router/ .....................  ✗ LOKAL — DB berisi API key provider

pi.dev: tidak pakai symlink — memori dimuat lewat wrapper pi() di ~/.bashrc
```

> 🔒 **SSH tidak akan pernah masuk dotfiles.** Key bersifat per-device dan rahasia.
> `.gitignore` memblokir `.ssh/`, `id_ed25519*`, `id_rsa*`, `known_hosts*`,
> `authorized_keys*` — sudah diuji: `git check-ignore` menolaknya. Butuh key di device
> baru? **Bikin key baru** di sana lalu daftarkan ke GitHub/server. Jangan copy key lama.

Mau lihat status tree ini di device tertentu (mana yang ✅ / mana yang ❌ putus)?
Buka [`devices/<hostname>.md`](devices/) — tabel **Symlink dotfiles**.

### Isinya apa saja?

| Folder | Isi | Di-symlink ke |
|---|---|---|
| `config/ai/` | **Memori bersama** semua AI CLI (fakta environment, project, preferensi) | `~/.config/ai` |
| `skills/local/` | **Skill AI** (SEO, Shopify, Astro, Cloudflare, native-first, dll) | `~/.claude/skills`, `~/.pi/agent/skills` |
| `config/mise-config.toml` | Daftar tool terminal (fzf, ripgrep, helix, delta…) | `~/.config/mise/config.toml` |
| `config/` lainnya | starship, tmux, lazygit, gh, helix, btop, ripgrep | masing-masing |
| `bin/` | Script bantu (`dotsync`, `device-register`, dll) | `~/.local/bin/` |
| `devices/` | **Registry device** — spek tiap mesin + status symlink-nya | (tidak di-link; catatan saja) |
| `docs/` | Catatan setup panjang | — |

### "Log"-nya di mana?

Repo ini **tidak** menyimpan log aplikasi. Yang ada tiga jenis rekaman:

1. **Riwayat Git** — `git log` = catatan setiap perubahan setelan, lengkap dengan
   alasannya di pesan commit. Ini log yang sebenarnya.
2. **`devices/<hostname>.md`** — snapshot kondisi tiap mesin (spek + status symlink),
   di-refresh dengan `device-register`.
3. **`config/ai/memory/*.md`** — memori AI: fakta yang harus diingat lintas sesi &
   lintas device (bukan log, tapi pengetahuan).

### Alur harian

```bash
dotsync status     # ada yang berubah?
dotsync sync       # commit + push sekaligus
dotsync pull       # tarik perubahan dari device lain
device-register    # perbarui catatan device ini (setelah ganti hardware / pasang CLI baru)
```

### Yang TIDAK pernah masuk repo

Repo ini privat, tapi **tetap** tidak boleh menyimpan rahasia — kalau bocor sekali,
selamanya bocor:

- API key, token, `*auth*.json`, `.env`, private key SSH → diblokir `.gitignore`
- `~/.config/gh/hosts.yml` (token GitHub) — hanya `config.yml` yang ikut
- Fakta pribadi per-mesin (IP server, key) → simpan di `~/.config/ai-local/device.md`
  yang **sengaja tidak di-sync**

Cek kapan saja dengan `security-check`.

### ⚠️ Sekali saja: saat pertama menjalankan installer di device LAMA

`install.sh` / `install-macos.sh` mengganti file config asli dengan symlink ke repo.
File aslinya **di-backup** dulu ke `<file>.bak.<timestamp>` (tidak hilang, dan
`*.bak*` sudah di-gitignore) — tapi setelan lamanya **tidak aktif lagi**.

Yang paling perlu dicek: **`~/.config/mise/config.toml`**. Kalau device itu punya tool
yang belum ada di daftar bersama, tool itu jadi tak terdeklarasi. Cara aman:

```bash
diff ~/.config/mise/config.toml ~/.config/mise/config.toml.bak.*   # apa yang hilang?
mise use -g <tool-yang-hilang>                                     # deklarasikan ulang
```

Karena `~/.config/mise/config.toml` adalah symlink ke repo, `mise use -g` langsung
menuliskannya ke dotfiles — otomatis ikut ter-sync ke device lain. **Terhubung, bukan
saling menimpa.**

> Catatan: `node` **sengaja tidak** dideklarasikan di mise bersama. Di Linux `cuan`,
> node dikelola **nvm**, dan shim mise berada lebih awal di `PATH` — kalau mise ikut
> memasang node, ia menggeser node nvm, sehingga npm global (`claude`, `codex`, `pi`)
> jalan di atas node yang salah dan native module (`better-sqlite3`) bisa pecah.
> Node biar diurus per-device.

---

## 🖥️ Platform support

**Pakai script yang sesuai OS-mu:**

| Device | Jalankan | Kenapa |
|---|---|---|
| 🐧 Linux | `bash install.sh` | bootstrap utama |
| 🍎 macOS | `bash install-macos.sh` | **jangan** pakai `install.sh` — lihat bawah |

`install.sh` **tidak akan crash** di macOS (ia sudah deteksi zsh/bash, dan tidak memanggil
`apt` maupun `systemd`). Masalahnya ia **tidak lengkap** — empat hal ini dilewatkan:

| Yang dilewatkan `install.sh` di Mac | Ada di `install-macos.sh` |
|---|---|
| Install mise + toolchain-nya | ✅ |
| 9router sebagai service **launchd** (bukan systemd) | ✅ |
| Bikin `~/.gitconfig` kalau belum ada | ✅ |
| Patch `~/.zshrc` (mise activate, PATH, shell tools) | ✅ |

| Area | Linux | macOS |
|---|---|---|
| Memori AI bersama (`config/ai`) | ✅ | ✅ |
| Skills | ✅ | ✅ |
| Sync (`dotsync`) | ✅ | ✅ |
| Device registry (`device-register`) | ✅ | ✅ |

> Repo ini **Linux-first** untuk setup mesin utama, tapi memori, skill, dan sync sudah
> jalan penuh di kedua OS.

## 🗂️ Device Registry — dotfiles ini dipakai di mana saja?

Lihat **[`devices/`](devices/)** — satu file per mesin (spek CPU/RAM/GPU/disk, OS, AI CLI
terpasang, dan status tiap symlink dotfiles), plus tabel indeks di
[`devices/README.md`](devices/README.md).

```bash
device-register              # rekam/refresh device ini (idempotent)
device-register --dry-run    # intip hasilnya tanpa menulis
```

Dijalankan otomatis oleh `install.sh` / `install-macos.sh`. Jalankan ulang setiap
ganti hardware, upgrade OS, atau pasang AI CLI baru.

**Apa yang di-sync vs tidak:**

| | Di-sync (repo) | Device-local (TIDAK di-sync) |
|---|---|---|
| Isi | memori bersama, skills, toolchain mise, config (starship/lazygit/gh/tmux) | IP privat, API key, catatan mesin |
| Lokasi | `config/ai/`, `skills/local/`, `config/*` | `~/.config/ai-local/device.md` |

Tabel **Symlink dotfiles** di tiap file device adalah alat diagnosa: symlink putus
muncul sebagai ❌ (persis begini `~/.config/lazygit/config.yml` ketahuan menunjuk ke
direktori yang tak pernah ada — lazygit diam-diam jalan pakai config default).

## 🐧 Linux baru di-install? Mulai dari sini

Urutannya **tidak boleh dibalik** — tiap tahap dipakai tahap berikutnya:

```
1. Dasar OS  →  2. Runtime  →  3. AI CLI  →  4. Dotfiles  →  5. Login & Cek
   (apt)         (nvm+mise)     (npm)         (install.sh)     (verifikasi)
                                                   ↑
                             di sinilah AI "dikasih otak": memori + skill
```

```bash
# 1 — Dasar OS (butuh sudo)
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential curl git unzip ca-certificates gnupg apt-transport-https
sudo apt install -y gh tmux btop jq duf 7zip chromium-browser postgresql-client

# 2 — Runtime (node lewat nvm; mise buat sisanya)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source ~/.bashrc && nvm install --lts
curl -fsSL https://mise.run | sh
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc && source ~/.bashrc

# 3 — AI CLI (dipasang SEBELUM dotfiles, biar langsung dapat memori di tahap 4)
npm i -g @anthropic-ai/claude-code @openai/codex @earendil-works/pi-coding-agent

# 4 — Dotfiles: symlink config + sambungkan memori & skill ke semua AI CLI
git clone https://github.com/ongkipro/dotfiles ~/dotfiles
cd ~/dotfiles && bash install.sh && source ~/.bashrc
mise install

# 5 — Login & verifikasi
gh auth login && gh auth setup-git   # tanpa setup-git, `git push` GAGAL
codex login
device-register && dotsync doctor
```

> ⚠️ **`node` jangan dipasang lewat mise.** Shim mise lebih awal di `PATH` daripada
> nvm, jadi node mise akan menggeser node nvm — padahal `claude`/`codex`/`pi` adalah
> npm global di bawah nvm, dan native module (`better-sqlite3`) bisa pecah karena beda
> ABI. Makanya `node` sengaja tidak ada di `config/mise-config.toml`.

📖 **Versi lengkap + troubleshooting:** [`docs/linux-install-step-by-step.md`](docs/linux-install-step-by-step.md)
(termasuk Antigravity/`agy`, docker, `lm-sensors`, dan daftar gejala-vs-penyebab).

## 🍎 Device lain (Mac / laptop tambahan)?

Alurnya **sama persis**, cuma ganti `apt` → `brew` dan `systemd` → `launchd`:

📖 [`docs/macos-install-step-by-step.md`](docs/macos-install-step-by-step.md)

**Checklist device baru bergabung** (berlaku untuk OS apa pun):

| # | Langkah | Kenapa penting |
|---|---|---|
| 1 | Pasang runtime + AI CLI dulu | biar dapat memori begitu dotfiles ter-link |
| 2 | `git clone` dotfiles → jalankan installer **sesuai OS** | Linux: `install.sh` · Mac: `install-macos.sh` |
| 3 | `gh auth login` + **`gh auth setup-git`** | tanpa ini `git push` gagal |
| 4 | **Bikin SSH key BARU** di device itu | 🔒 key tak pernah ikut repo. 1 key = 1 device |
| 5 | `git pull --rebase` **sebelum** `device-register` | kalau tidak, indeks `devices/` menghapus baris device lain |
| 6 | `device-register` → `dotsync sync` | device masuk registry, terlihat di semua mesin |

> Yang **menyesuaikan per-device** (jangan diseragamkan): `node` (nvm vs mise),
> service manager (systemd vs launchd), package manager (apt vs brew), dan isi
> `~/.config/ai-local/device.md`. Sisanya ikut repo.

## 🧭 Siapa mengerjakan apa (CLI routing)

Empat AI CLI, satu aturan (`AGENTS.md`), satu memori. Bedanya cuma **perannya**:

| CLI | Peran | Skill |
|---|---|---|
| **claude** | Development global: arsitektur, konteks panjang, refactor besar, rencana, riset | otomatis |
| **pi** | All-in-one: kerja harian di terminal — inspeksi, edit, jalankan | otomatis |
| **codex** | Logic: patch terfokus, code review, debugging, pendapat kedua | `skill-list` → baca file |
| **agy** | UI/UX + development kecil: visual, preview, artefak, cek cepat | `skill-list` → baca file |

Ini **default**, bukan pagar — kalau satu CLI sudah pegang konteksnya, lanjutkan di situ.

## ⚡ Stack

```
AI CLIs   →  Claude Code · Pi.dev · Codex · Antigravity (`agy`)
Editor    →  Helix (hx)
Terminal  →  tmux (Ctrl+a, resurrect/continuum/yank/open) · starship · zsh/bash
Git       →  lazygit (lg) · delta (diff) · gh (GitHub CLI)
Tools     →  rg · fd · eza · bat · fzf · zoxide · yq · direnv
Runtime   →  mise (Node/Python/Go) · nvm (lazy) · pnpm · pipx
Deploy    →  Vercel CLI · Wrangler (Cloudflare) · gh
```

## 🎯 Tujuan repo ini

- **Source of truth** untuk shared AI memory, skill references, dan config terminal utama.
- **Sinkron lintas device** via Git, terutama antara workstation Linux dan device macOS.
- **Konsisten lintas AI CLI**: Claude Code, Pi.dev, Codex, Antigravity (`agy`). Gemini CLI sudah dihapus — stack Gemini dipakai lewat Antigravity.
- **Semi-auto sync**, bukan auto-commit liar.
- **Bootstrap ringan macOS** untuk memory + skills + sync.

---

## 📁 Struktur

```
dotfiles/
│
├── 📂 skills/local/           # Local AI skills → semua CLI
│   ├── seo-website-builder/   # Multi-engine SEO OS: Google/Bing/Yandex/Pinterest/AI search
│   ├── shadcn-ui/             # shadcn/ui + charts + sidebar + blocks
│   ├── prd-taskbreaker/       # Ide → PRD → numbered tasks
│   ├── mermaid-diagram/       # Flowchart, ERD, Sequence, C4
│   ├── openapi-spec/          # OpenAPI 3.1 YAML generator
│   ├── native-first/          # ⭐ "platform sudah punya ini belum?" (8 stack)
│   ├── astro-development/     # End-to-end Astro dev
│   ├── shopify-*/             # Shopify listing + memory
│   └── 9router/               # AI gateway (7 endpoint di references/)
│
├── 📂 config/
│   ├── ai/
│   │   ├── AGENTS.md          # Cross-CLI context + protocol
│   │   └── memory/            # Shared AI memory (env/workflow/projects)
│   │       ├── environment.md
│   │       ├── workflow.md
│   │       ├── preferences.md
│   │       ├── projects.md
│   │       └── shopify.md
│   ├── claude-memory/         # Claude Code auto-memory backup
│   │   ├── MEMORY.md          # Index
│   │   ├── toko-online-builder.md
│   │   ├── local-skills-registry.md
│   │   └── ...project memories
│   ├── pi/
│   │   ├── settings.json      # Pi.dev: provider=minimax, model=MiniMax-M3 (NATIVE, bukan 9router)
│   │   ├── README.md           # Restore instructions
│   │   └── extensions/
│   │       ├── compact-free/    # Compaction pakai model gratis (hemat limit)
│   │       └── welcome-screen/  # Header arcade "PRESS START" (cursor statis, anti-flicker)
│   ├── 9router/
│   │   ├── aliases.json       # Model aliases
│   │   └── runtime-package.json
│   ├── systemd/
│   │   └── user/
│   │       └── 9router.service # 9router daemon — SEKARANG DISABLED (sengaja, 2026-07-13)
│   ├── helix/
│   │   ├── config.toml        # Editor (relative number, soft-wrap, C-s = save)
│   │   └── languages.toml     # LSP config
│   ├── btop/
│   │   └── btop.conf          # System monitor tuned for this Linux workflow
│   ├── lazygit/config.yml     # lazygit + delta (side-by-side OFF: panel diff sempit)
│   ├── gh/config.yml          # GitHub CLI (alias `co`). hosts.yml TIDAK ikut — ada token
│   ├── mise-config.toml       # Toolchain bersama. DI-SYMLINK: `mise use -g` nulis ke sini
│   ├── shell-tools.sh         # Cross-platform dev tools (bash + zsh, Ubuntu + macOS)
│   ├── starship.toml          # Prompt (plain, no Nerd Font)
│   ├── tmux.conf              # Terminal multiplexer
│   ├── gitignore_global       # Global git ignores
│   └── ripgreprc              # rg config
│
├── 📂 devices/                # Registry device (auto-generate, jangan edit manual)
│   ├── README.md              # Tabel indeks semua mesin
│   └── cuan.md                # ThinkPad T480 — spek + status symlink
│
├── 📂 bin/
│   ├── ai-doctor              # ⭐ Cek rantai AI ↔ device ↔ memori (jalankan di mesin baru)
│   ├── security-check         # Scan secret sebelum commit/push (dipanggil dotpush)
│   ├── security-check-test    # Bait test: buktikan guard-nya masih menangkap secret asli
│   ├── inspect-project        # Scan cepat struktur project (git, lockfile, framework)
│   ├── ai-memory-link         # Symlink AGENTS.md ke semua AI CLI
│   ├── device-register        # Rekam device ini ke devices/ (spek + status symlink)
│   ├── dotsync                # Semi-auto sync lintas Linux/macOS
│   ├── dotpush                # Fast-path manual commit + push
│   ├── pi-9router-restore     # Restore pi + compact-free + 9router.service
│   ├── akun                   # Claude account switcher
│   ├── tmux-setup             # Install + link + TPM/plugin bootstrap (Linux/macOS)
│   ├── tmux-clip              # Cross-platform clipboard bridge for tmux
│   └── tmux-battery           # Cross-platform battery helper for tmux status bar
│
├── 📂 docs/
│   ├── ai-memory-sync.md      # Shared memory + sync flow Linux/macOS
│   ├── linux-install-step-by-step.md  # ⭐ Ubuntu baru → tool → AI → dotfiles (urut)
│   ├── macos-install-step-by-step.md  # ⭐ Mac baru → brew → AI → dotfiles (urut)
│   ├── linux-dev-setup.md     # Runbook lengkap + filosofi (+ §9 fix kedip pi.dev)
│   ├── dev-setup.md           # Ringkasan cepat
│   └── shopify-ai-development-repos.md
│
├── install.sh                 # Bootstrap utama Linux
└── install-macos.sh           # Bootstrap ringan macOS (memory + skills + sync)
```

---

## 🚀 Device Baru

### Linux / Ubuntu

```bash
git clone https://github.com/ongkipro/dotfiles ~/dotfiles
cd ~/dotfiles && bash install.sh
source ~/.zshrc   # atau ~/.bashrc (auto-terdeteksi)
```

Install.sh akan (auto-deteksi zsh/bash):
- Symlink semua config ke lokasi yang benar
- Setup cross-CLI memory (`~/.config/ai/`)
- Link skill (symlink satu-direktori) ke `~/.claude/skills` + `~/.pi/agent/skills`
- Register bin scripts ke `~/.local/bin/`

### macOS

Bootstrap ringan untuk macOS sekarang sudah ada:

```bash
git clone https://github.com/ongkipro/dotfiles ~/dotfiles
cd ~/dotfiles
bash install-macos.sh
source ~/.zshrc
```

Yang di-setup:
- shared memory (`~/.config/ai/`)
- `dotsync`, `dotpush`, `ai-memory-link`
- local skills + `skill-*` commands
- symlink AGENTS.md ke CLI yang ada
- shell hook `zsh` untuk workflow terminal

Catatan:
- ini fokus ke memory + skills + sync
- bootstrap mesin penuh masih lebih matang di Linux

---

## 🤖 AI Skills System

**Satu sumber: `skills/local/`.** Model = **symlink satu-direktori**:

Jumlahnya berubah seiring waktu — jangan ditulis di sini. Hitung dari disk:
`find ~/dotfiles/skills/local -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l`, atau `skill-list`.

```
~/.claude/skills       ─┐
~/.pi/agent/skills     ─┼─→  skills/local/
~/.agents/local-skills ─┘
```

> 🔑 **Sinkron antar-device = `git pull` saja.** Skill baru muncul sendiri, skill yang
> dihapus hilang sendiri, di semua CLI. Tidak ada langkah "jangan lupa sync".
> `skill-update` cuma perlu **sekali per mesin baru** (dan sudah dipanggil installer).

```bash
skill-list            # nama + kegunaan tiap skill
skill-open <nama>     # buka SKILL.md
skill-new <nama>      # bikin skill baru (langsung aktif di semua CLI)
skill-remove <nama>   # hapus (langsung hilang di semua CLI)
skill-update          # pasang/perbaiki symlink — sekali per mesin
```

### Codex & agy tidak punya direktori skill — dan itu tidak apa-apa

Sistem mereka plugin (`plugin.json`), format berbeda; `agy plugin validate` menolak
`SKILL.md` kita. Membungkus seluruh skill jadi plugin = **sumber kedua** + beban sync.
Ditolak.

Tapi skill itu **cuma markdown**, dan mereka bisa membaca file. Yang mereka tak punya
cuma auto-discovery — dan itu diganti satu baris di `AGENTS.md` yang **sudah** mereka baca:

> Butuh skill di codex/agy? Jalankan **`skill-list`**, lalu baca
> `~/dotfiles/skills/local/<nama>/SKILL.md` langsung.

### Skill andalan: `native-first`

Menjawab satu pertanyaan sebelum kamu `npm i` atau bikin abstraksi: **"platform-nya
sudah punya ini belum?"** Delapan reference — Next/React, Astro, Node/TS, Cloudflare
Workers, Vercel, Postgres+Drizzle+better-auth, Shopify, self-host (Docker/Coolify/Vultr) —
plus perintah validasi terkecil per stack.

### Featured local skill: `seo-website-builder`

`seo-website-builder` adalah SEO operating system lintas mesin pencari untuk build, audit, dan maintenance website modern.

Public standalone repo: [ongkipro/seo-website-builder-skill](https://github.com/ongkipro/seo-website-builder-skill)

Cakupan utama:

- Technical SEO, metadata, canonical/noindex, sitemap, robots.txt
- Schema/JSON-LD untuk LocalBusiness, Product, Article, FAQ, Breadcrumb
- Astro/static SEO, Shopify/ecommerce SEO, local business SEO
- Internal linking, information architecture, programmatic SEO quality control
- Multi-engine intelligence: Google, Bing, Yandex, Pinterest, dan AI-search surfaces
- Algorithm update workflow berbasis sumber resmi/tepercaya

Struktur skill:

```txt
skills/local/seo-website-builder/
├── SKILL.md
└── references/
    ├── COMPACT_SKILL_REFERENCES.md
    ├── PLAYBOOK.md
    ├── ASTRO_SEO_PLAYBOOK.md
    ├── SHOPIFY_SEO_PLAYBOOK.md
    ├── LOCAL_BUSINESS_SEO_PLAYBOOK.md
    ├── SEARCH_ENGINE_ALGORITHM_BRIEF.md
    ├── SEARCH_ENGINE_SOURCE_INDEX.md
    └── ALGORITHM_UPDATE_LOG.md
```

> ⚠️ Catatan lama menyebut archive riset di `~/Documents/SEO`. **Folder itu tidak ada di mesin manapun sekarang** — skill ini berdiri sendiri lewat `references/`-nya.

---

## 🧠 Kontrak: 3 lapis, dipisah menurut *seberapa sering dibayar*

Ini inti repo. Kalau cuma baca satu bagian, baca ini.

| Lapis | Lokasi | Kapan dibaca | Aturannya |
|---|---|---|---|
| **1. Aturan** | `config/ai/AGENTS.md` | **SELALU**, tiap request, di 4 CLI | **Jaga kecil** (≤120 baris). Ini satu-satunya biaya yang **dikali empat**. |
| **2. Memori** | `config/ai/memory/*.md` | saat perlu | Fakta yang bisa dicek dari sumbernya → tulis **sekali** + sertakan cara verifikasinya. |
| **3. Skill** | `skills/local/` | on-demand | Pengetahuan dalam. **Router murni dilarang.** |

Tiga hukum yang lahir dari kesalahan nyata di repo ini:

1. **Kebijakan yang harus selalu berlaku TIDAK BOLEH jadi skill.** Skill cuma menyala
   kalau model *memilih* memanggilnya — safety gate yang menunggu dipanggil adalah gate
   yang mati. Karena itu approval gates & disiplin kode ada di `AGENTS.md`.
2. **Disk/API menang atas memori.** Kalau bertentangan, percayai sumbernya, lalu
   **perbaiki memorinya**. (Memori pernah menyimpan alarm biaya server yang seluruh
   angkanya fiktif — servernya bahkan sudah tidak ada.)
3. **Fakta yang berubah-ubah jangan digandakan.** Status service 9router pernah tersalin
   ke 6 tempat, lalu keenamnya salah sekaligus begitu service-nya dimatikan. Agent yang
   membaca kontradiksi akan **menebak**.

**Device-local (TIDAK di-sync):** `~/.config/ai-local/device.md` — IP server, catatan mesin.
Secret **tidak pernah** masuk repo.

## 🩺 `ai-doctor` — satu perintah, membuktikan rantainya utuh

```bash
ai-doctor
```

Memeriksa 8 hal di device manapun: repo & status sync · `AGENTS.md` sampai ke tiap CLI
yang terpasang · memori · symlink skill · symlink menggantung · security guard (termasuk
bait test) · CLI mana yang terpasang & sudah login · **memori vs disk** (menandai kalau
memori kembali menunjuk path yang tidak ada).

`✗ FAIL` = rusak, perbaiki. `! WARN` = jalan, tapi belum lengkap. CLI yang belum
terpasang dilewati, bukan dianggap error — jadi aman dijalankan di laptop yang masih kosong.

> Jalankan ini **pertama kali** di mesin baru, dan setiap kali ada AI yang berperilaku aneh.
> Aturan tanpa penegak akan luntur dalam sebulan.

---

## 📅 Update Sehari-hari

```bash
dotsync status                   # lihat perubahan
dotsync sync                     # review -> commit -> push opsional
dotsync commit "memory: sync"   # commit lokal saja
dotsync push                     # push commit yang sudah siap

# Di device lain
dotsync pull                     # ff-only pull, config langsung aktif
dotsync doctor                   # cek setup sync cepat
```

Fast path lama masih ada:

```bash
dotpush                          # commit + push langsung (manual, tanpa review semi-auto)
```

Flow harian yang disarankan:
1. Edit memory/config penting.
2. Jalankan `dotsync status`.
3. Jalankan `dotsync sync`.
4. Di device lain, jalankan `dotsync pull`.

---

## 🔄 Multi-device memory sync

- Repo `~/dotfiles` = source of truth untuk shared memory + AI config.
- Mode default = **semi-auto**, aman untuk terminal Linux **dan** macOS.
- Gunakan `bin/dotsync` untuk flow review singkat sebelum commit/push.
- Bootstrap penuh masih Linux-first; sync layer-nya sudah cross-platform.
- macOS sudah punya `install-macos.sh` untuk memory + skills + sync dasar.
- Default aman: **commit lokal dulu, push setelah yakin**.
- Detail arsitektur: [docs/ai-memory-sync.md](docs/ai-memory-sync.md)

## 🪪 Credits & public credentials

**Curator / Developer:** [Ongki Pro](https://ongki.pro)  
**GitHub:** [@ongkipro](https://github.com/ongkipro)  
**Email:** [get@ongki.pro](mailto:get@ongki.pro)  
**Workflow:** terminal-first, AI-native, Helix/tmux/mise/dotfiles-driven.

Local skills in this repo are curated for practical client/project work across Astro, Shopify, Cloudflare, Supabase, SEO, and AI gateway workflows.

> Public note: credentials here mean authorship/contact credentials only. Secrets, tokens, auth sessions, API keys, and private credentials must never be committed.

## 🔐 Yang Tidak Di-commit

Jangan commit secrets, tokens, private credentials, session, cache, atau artefak sementara.


```
Pi:       auth.json · models.json · trust.json · sessions/
9router:  auth/ · jwt-secret · machine-id · db/ · tunnel/
Claude:   ~/.claude/.credentials.json
Device:   ~/.config/ai-local/secrets.env (perm 600, di-source ~/.bashrc)
```

API key **tidak** hard-coded lagi: `models.json`/`settings.json` mereferensikan
env var (mis. `${NINEROUTER_KEY}`); nilainya hanya ada di `ai-local/secrets.env`.

---

<div align="center">

**[ongki.pro](https://ongki.pro)** · [@ongkipro](https://github.com/ongkipro)

*"Tools are meant to disappear. Only the work remains."*

</div>
