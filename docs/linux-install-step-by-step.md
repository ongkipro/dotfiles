# Install Linux dari Nol — Step by Step

> **Untuk siapa:** saya sendiri, saat laptop baru / install ulang Ubuntu.
> **Titik mulai:** Ubuntu baru selesai di-install, baru pertama kali buka Terminal.
> **Titik selesai:** semua tool + AI CLI jalan, dotfiles ter-link, memori & skill AI aktif.
>
> Urutannya **tidak boleh dibalik**. Tiap tahap dipakai oleh tahap berikutnya:
>
> ```
> 1. Dasar OS  →  2. Runtime  →  3. Dotfiles  →  4. AI CLI  →  5. Login & Cek
>    (apt)          (mise)        (toolchain)      (npm)         (verifikasi)
>                                      ↑
>                         satu config mise memasang Node + tool
> ```
> Runbook detail & filosofi: [`linux-dev-setup.md`](linux-dev-setup.md).
> Dokumen ini fokus ke **urutan eksekusi**, bukan penjelasan panjang.

---

## Tahap 1 — Dasar OS (butuh `sudo`)

### 1.1 Update dulu, selalu

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Paket wajib (tanpa ini, tahap berikutnya gagal)

```bash
sudo apt install -y \
  build-essential curl git unzip ca-certificates gnupg apt-transport-https
```

| Paket | Kenapa wajib |
|---|---|
| `build-essential` | compiler C — dibutuhkan native module npm (mis. `better-sqlite3`) |
| `curl` | dipakai installer mise |
| `git` | clone dotfiles |
| `ca-certificates`, `gnupg` | HTTPS & verifikasi paket |

### 1.3 Paket pendukung harian

```bash
sudo apt install -y gh tmux btop jq duf 7zip chromium-browser
```

- `gh` — GitHub CLI (dipakai buat login git, lihat Tahap 5)
- `tmux` — multiplexer (config-nya nanti dari dotfiles)
- `chromium-browser` — preview web + dipakai MCP `chrome-devtools` (audit performa)

### 1.4 Sesuai kebutuhan kerja

```bash
# Database (WAJIB kalau pegang Postgres/Coolify — pg_dump dipakai buat backup & migrasi)
sudo apt install -y postgresql-client

# Container (uji image sebelum deploy ke Coolify)
sudo apt install -y docker.io
sudo usermod -aG docker $USER      # ⚠️ WAJIB, kalau tidak docker minta sudo terus
# ↑ logout–login (atau reboot) supaya grup-nya aktif

# Sensor suhu CPU/GPU
sudo apt install -y lm-sensors && sudo sensors-detect --auto
```

> **Catatan `pg_dump`:** versi client boleh lebih BARU dari server (client 18 → server 16
> aman). Yang terlarang kebalikannya: client lama → server baru.

---

## Tahap 2 — Runtime bootstrap (tanpa `sudo`)

### 2.1 mise

mise adalah satu-satunya pemilik Node dan toolchain. Tahap ini hanya memasang
binary mise; versi Node dan daftar tool tetap dimiliki
[`config/mise-config.toml`](../config/mise-config.toml) dan dipasang setelah
dotfiles ter-link di Tahap 3.

```bash
curl -fsSL https://mise.run | sh
export PATH="$HOME/.local/bin:$PATH"
mise --version
```

Jangan memasang nvm dan jangan menambahkan `mise activate` manual ke shell rc.
`install.sh` akan memasang satu source line untuk
[`config/shell-tools.sh`](../config/shell-tools.sh), pemilik tunggal aktivasi mise.

---

## Tahap 3 — Dotfiles + toolchain (di sinilah semuanya nyambung)

```bash
git clone https://github.com/ongkipro/dotfiles ~/dotfiles
cd ~/dotfiles
bash install.sh
source ~/.bashrc
```

`install.sh` mengerjakan (idempotent — aman diulang):

1. **Symlink config** ke lokasi live — memori AI (`~/.config/ai`), skills, mise,
   starship, helix, lazygit, gh, tmux, ripgrep.
2. **Sambungkan memori ke semua AI CLI** — `AGENTS.md` di-link ke `~/.claude/CLAUDE.md`,
   `~/.codex/AGENTS.md`, `~/.gemini/GEMINI.md` (dibaca `agy`), dan OMP. Pi memuatnya
   lewat wrapper `pi()` di tracked `config/shell-tools.sh` yang di-source oleh `~/.bashrc`.
3. **Daftarkan device ini** ke [`devices/`](../devices/) — spek + status tiap symlink.
4. Setup tmux (TPM + plugin).

Pasang seluruh toolchain dari config yang baru di-link, lalu pastikan Node yang
dipakai memang milik mise:

```bash
mise install     # baca ~/.config/mise/config.toml (symlink ke repo)
mise which node
node -v && npm -v
```

> **Kenapa dotfiles dipasang SEBELUM AI CLI?** Node dan semua tool mengikuti satu
> config mise yang dilacak. Setelah itu paket npm global dibangun terhadap runtime
> yang sama di setiap device, tanpa nvm atau shim kedua.

> ### ⚠️ Kalau ini device LAMA (sudah punya config sendiri)
> `install.sh` mengganti config asli dengan symlink. File lamanya **di-backup** ke
> `<file>.bak.<timestamp>` (tidak hilang), tapi tidak aktif lagi. Yang paling perlu
> dicek — tool mise yang cuma ada di device itu:
> ```bash
> diff ~/.config/mise/config.toml ~/.config/mise/config.toml.bak.*
> mise use -g <tool-yang-hilang>     # otomatis tercatat balik ke dotfiles
> ```

---

## Tahap 4 — AI CLI

> ### ⚠️ Jalankan ini SEBELUM `npm i -g` di bawah — npm 12+ bisa menolak native binary Claude Code secara senyap
> Kalau `claude` error `"Error: claude native binary not installed."` — bukan gagal jaringan.
> npm 12+ memblokir SEMUA install-script (termasuk postinstall `@anthropic-ai/claude-code`
> yang menaruh native binary-nya) kecuali di-allowlist eksplisit, dan ini kena setiap kali
> paket ter-upgrade (manual maupun ter-trigger otomatis oleh CLI-nya sendiri) — bukan cuma
> sekali di instalasi awal. `install.sh` (Tahap 3) sudah mengurus allowlist ini otomatis
> KALAU `npm` sudah ada saat itu; di bootstrap pertama `npm` baru muncul setelah `mise
> install`, jadi jalankan baris pertama di bawah secara manual dulu:
> ```bash
> npm config set allow-scripts=@anthropic-ai/claude-code --location=user
> npm i -g @anthropic-ai/claude-code @openai/codex @earendil-works/pi-coding-agent
> node "$(npm root -g)/@anthropic-ai/claude-code/install.cjs"   # perbaiki kalau sudah kadung rusak
> ```

```bash
npm i -g @anthropic-ai/claude-code @openai/codex @earendil-works/pi-coding-agent
```

| CLI | Paket npm | Perintah |
|---|---|---|
| Claude Code | `@anthropic-ai/claude-code` | `claude` |
| Codex | `@openai/codex` | `codex` |
| pi.dev | `@earendil-works/pi-coding-agent` | `pi` |

**Antigravity (`agy`)** — bukan paket npm, punya installer sendiri
([dokumen resmi](https://antigravity.google/docs/cli-getting-started)):

```bash
curl -fsSL https://antigravity.google/cli/install.sh | bash
agy install      # konfigurasi PATH + shell
agy --version
```

Installer resmi menaruh binary langsung di **`~/.local/bin/agy`** (tanpa runtime lain —
tidak butuh Node). Login: cukup jalankan `agy`, ia akan menuntun lewat browser.

Perintah berguna: `agy update` (update CLI), `agy models` (daftar model),
`agy changelog`.

> ### ⚠️ Installer `agy` MENGOTORI `~/.profile` dan `~/.bashrc`
> Ia menambahkan baris ini ke **dua** file:
> ```
> # Added by Antigravity CLI installer
> export PATH="/home/<user>/.local/bin:$PATH"
> ```
> Dua masalah:
> 1. **Redundan** — `~/.profile` dan `~/.bashrc` bawaan dotfiles ini **sudah** menangani
>    `~/.local/bin` (bahkan dengan guard idempotent). Baris baru itu duplikat murni.
> 2. **Hardcode home path** (`/home/ongki`) — dan `~/.profile` adalah **symlink ke repo
>    dotfiles**. Jadi baris itu ikut ter-commit dan akan **patah di Mac** (home-nya
>    `/Users/...`).
>
> **Setelah install `agy`, selalu bersihkan:**
> ```bash
> cd ~/dotfiles && git checkout home/profile      # buang baris yang nyasar ke repo
> sed -i '/^# Added by Antigravity CLI installer$/,+1d' ~/.bashrc
> bash -n ~/.bashrc                               # pastikan tak rusak
> ```
> (Kalau `~/.local/bin` belum ada di PATH-mu sama sekali, biarkan baris itu — tapi di
> dotfiles ini sudah ada, jadi aman dibuang.)

> **Catatan sejarah di mesin `cuan`:** binary lama bernama `~/.local/bin/antigravity`
> dengan symlink `agy` → binary. Symlink itu pernah **hilang diam-diam** sementara
> binary-nya utuh, sehingga perintah `agy` seolah lenyap. Kalau menemui itu lagi:
> ```bash
> ln -sfn ~/.local/bin/antigravity ~/.local/bin/agy
> ```
> Instalasi baru lewat installer resmi tidak punya masalah ini (binary langsung
> bernama `agy`).

Language server (opsional, buat helix):

```bash
npm i -g typescript-language-server vscode-langservers-extracted \
         bash-language-server yaml-language-server @tailwindcss/language-server pyright
```

---

## Tahap 5 — Login & Verifikasi

### 5.1 Login

```bash
gh auth login          # GitHub
gh auth setup-git      # ⚠️ WAJIB — set credential helper. Tanpa ini `git push` gagal
                       #    dengan "could not read Username"
claude                 # login lewat browser saat pertama jalan
codex login
```

Identitas git sudah ikut dotfiles (`ongkipro` + email GitHub-noreply, sama di semua
device). Cek saja:

```bash
git config --get user.email     # harus: <id>+ongkipro@users.noreply.github.com
```

> ⚠️ **Awas config LOKAL repo.** `git config --local` **selalu menang** atas global.
> Kalau commit di suatu repo keluar dengan identitas aneh, cek:
> ```bash
> git config --local --get user.email      # kosongkan: git config --local --unset user.email
> ```

### 5.2 SSH — bikin key BARU, jangan copy key lama

🔒 **Key SSH tidak pernah ada di dotfiles** (diblokir `.gitignore`). Di device baru,
**buat key baru**, jangan menyalin key dari device lain:

```bash
ssh-keygen -t ed25519 -C "device-baru"
gh ssh-key add ~/.ssh/id_ed25519.pub --title "$(hostname)"
```

Alasannya: satu key = satu device. Kalau laptop hilang, cukup cabut key **device itu**
di GitHub/server, tanpa mengganggu device lain. Kalau key dipakai bersama, satu laptop
hilang = semua device harus ganti key.

### 5.3 Verifikasi

```bash
device-register        # spek device + status SEMUA symlink (❌ = ada yang putus)
dotsync doctor         # memori bersama tersambung ke tiap CLI?
security-check         # tidak ada rahasia yang bocor ke repo?
hx --health            # config helix valid? ("malformed" = ada yang salah)
```

Cek cepat manual:

```bash
claude --version && codex --version && pi --version && agy --version
node -v && mise which node      # HARUS dikelola config mise yang dilacak
mise ls                         # seluruh toolchain terpasang
```

---

## Ringkasan satu layar

```bash
# 1 — Dasar
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential curl git unzip ca-certificates gnupg apt-transport-https
sudo apt install -y gh tmux btop jq duf 7zip chromium-browser postgresql-client

# 2 — Runtime bootstrap
curl -fsSL https://mise.run | sh
export PATH="$HOME/.local/bin:$PATH"

# 3 — Dotfiles + toolchain
git clone https://github.com/ongkipro/dotfiles ~/dotfiles
cd ~/dotfiles && bash install.sh && source ~/.bashrc
mise install
mise which node

# 4 — AI CLI
npm i -g @anthropic-ai/claude-code @openai/codex @earendil-works/pi-coding-agent

# 5 — Login & cek
gh auth login && gh auth setup-git
codex login
device-register && dotsync doctor
```

---

## Kalau ada yang aneh

| Gejala | Penyebab tersering |
|---|---|
| `git push` → *could not read Username* | credential helper belum di-set / menunjuk path gh yang salah → `gh auth setup-git` |
| Perintah `agy` tidak ditemukan | symlink `agy` hilang, binary `antigravity` masih ada → `ln -sfn ~/.local/bin/antigravity ~/.local/bin/agy` |
| Config (lazygit/helix/dll) seperti tidak berlaku | **symlink putus** — cek `device-register`, cari ❌. Symlink putus TIDAK bersuara |
| `docker` selalu minta sudo | belum masuk grup → `sudo usermod -aG docker $USER`, lalu logout–login |
| `claude` → *"native binary not installed"* | npm 12+ blokir postinstall-nya (`allowScripts`), bukan gagal jaringan — kena tiap kali paket ter-upgrade, bukan cuma sekali. `install.sh` sudah mengurus (allowlist + perbaikan reaktif); manual: `npm config set allow-scripts=@anthropic-ai/claude-code --location=user && node "$(npm root -g)/@anthropic-ai/claude-code/install.cjs"` |
| npm global hilang setelah ganti runtime | runtime tidak sesuai config — cek `mise which node`, lalu jalankan `mise install` |
| helix mengabaikan config | `hx --health` → cari *"Configuration file malformed"* |
