# Install macOS dari Nol — Step by Step

> **Untuk siapa:** saya sendiri, saat pakai Mac baru / install ulang.
> **Titik mulai:** macOS baru, baru pertama buka Terminal.
> **Titik selesai:** tool + AI CLI jalan, dotfiles ter-link, memori & skill AI aktif,
> dan Mac ini terdaftar di [`devices/`](../devices/).
>
> Alurnya **sama persis** dengan Linux, cuma ganti `apt` → `brew` dan `systemd` → `launchd`:
>
> ```
> 1. Dasar OS  →  2. Runtime  →  3. AI CLI  →  4. Dotfiles        →  5. Login & Cek
>    (brew)        (nvm+mise)     (npm)         (install-macos.sh)    (verifikasi)
>                                                    ↑
>                              di sinilah AI "dikasih otak": memori + skill
> ```
>
> Versi Linux: [`linux-install-step-by-step.md`](linux-install-step-by-step.md).

> ## ⚠️ Di Mac pakai `install-macos.sh`, JANGAN `install.sh`
>
> `install.sh` tidak akan crash di Mac (ia sudah deteksi zsh/bash, dan tak memanggil
> `apt`/`systemd`) — tapi ia **melewatkan** 4 hal: install mise + toolchain, 9router
> sebagai service **launchd**, pembuatan `~/.gitconfig`, dan patch `~/.zshrc`.

---

## Tahap 1 — Dasar OS

### 1.1 Xcode Command Line Tools (compiler — wajib duluan)

```bash
xcode-select --install
```

Ini menyediakan `git`, `make`, dan compiler C — dibutuhkan Homebrew **dan** native
module npm (mis. `better-sqlite3`). Padanan `build-essential` di Ubuntu.

### 1.2 Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Setelah selesai, Homebrew akan **memberitahu 2 baris** yang harus ditambahkan ke
`~/.zprofile` (untuk memasukkan `brew` ke PATH). Jalankan yang ia tunjukkan — path-nya
beda antara Apple Silicon (`/opt/homebrew`) dan Intel (`/usr/local`), jadi **ikuti
outputnya**, jangan hafalan.

```bash
brew --version    # cek berhasil
```

### 1.3 Paket harian

```bash
brew install gh tmux btop jq duf
brew install --cask chromium
```

### 1.4 Sesuai kebutuhan kerja

```bash
# Postgres client (pg_dump buat backup & migrasi Coolify)
brew install libpq
brew link --force libpq        # supaya psql/pg_dump masuk PATH
# alternatif lengkap: brew install postgresql@16

# Container (opsional)
brew install --cask docker-desktop   # GUI, paling gampang
# atau tanpa GUI:  brew install colima docker && colima start
```

> **Catatan:** `lm-sensors` **tidak perlu** di Mac — suhu dibaca lewat
> `sudo powermetrics` atau app pihak ketiga. Itu tool khusus Linux.

---

## Tahap 2 — Runtime

### 2.1 nvm + Node

```bash
brew install nvm
mkdir -p ~/.nvm
# ikuti instruksi yang dicetak `brew info nvm` untuk menambahkan blok NVM_DIR ke ~/.zshrc
source ~/.zshrc
nvm install --lts
node -v && npm -v
```

> ### ⚠️ JANGAN pasang `node` lewat mise (sama seperti di Linux)
> Shim mise berada **lebih awal** di `PATH` daripada nvm. Kalau mise ikut memasang node,
> ia menggeser node nvm — padahal `claude`, `codex`, dan `pi` adalah npm global di bawah
> nvm, dan native module (`better-sqlite3`) bisa pecah karena beda ABI. Karena itu `node`
> **sengaja tidak ada** di `config/mise-config.toml` (yang di-share ke semua device).
>
> Kalau di Mac kamu memang mau node dari mise, **deklarasikan di config mise LOKAL Mac**,
> jangan di file bersama — nanti Linux ikut kena.

### 2.2 mise

```bash
curl -fsSL https://mise.run | sh
echo 'eval "$($HOME/.local/bin/mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc
mise --version
```

Toolchain-nya (fzf, ripgrep, helix, delta, lazygit, dll) **belum** dipasang di sini —
daftarnya ikut dotfiles dan terpasang di Tahap 4.

---

## Tahap 3 — AI CLI

```bash
npm i -g @anthropic-ai/claude-code @openai/codex @earendil-works/pi-coding-agent
```

**Antigravity (`agy`)** — bukan paket npm, punya installer sendiri. Perintahnya **sama
persis dengan Linux** ([dokumen resmi](https://antigravity.google/docs/cli-getting-started)):

```bash
curl -fsSL https://antigravity.google/cli/install.sh | bash
agy install      # konfigurasi PATH + shell
agy --version
```

Installer menaruh binary di **`~/.local/bin/agy`**, tanpa butuh runtime lain (bukan Node).
Login: jalankan `agy`, ia menuntun lewat browser.
Perintah berguna: `agy update`, `agy models`, `agy changelog`.

> ### ⚠️ Installer `agy` MENGOTORI `~/.profile` (dan shell rc)
> Ia menambahkan `export PATH="/home/<user>/.local/bin:$PATH"` — **hardcode home path**.
> Karena `~/.profile` adalah **symlink ke repo dotfiles**, baris itu ikut ter-commit dan
> **patah lintas-OS** (`/home/...` vs `/Users/...`). Dotfiles ini sudah menangani
> `~/.local/bin` secara portabel, jadi baris itu redundan.
>
> **Setelah install `agy`, bersihkan:**
> ```bash
> cd ~/dotfiles && git checkout home/profile
> sed -i '' '/^# Added by Antigravity CLI installer$/,+1d' ~/.zshrc   # macOS sed butuh ''
> ```

Language server (opsional, buat helix):

```bash
npm i -g typescript-language-server vscode-langservers-extracted \
         bash-language-server yaml-language-server @tailwindcss/language-server pyright
```

---

## Tahap 4 — Dotfiles

```bash
git clone https://github.com/ongkipro/dotfiles ~/dotfiles
cd ~/dotfiles
bash install-macos.sh          # ← BUKAN install.sh
source ~/.zshrc
mise install                   # pasang toolchain dari config/mise-config.toml
```

`install-macos.sh` mengerjakan (idempotent — aman diulang):

1. **Symlink config** — memori AI (`~/.config/ai`), skills, mise, starship, helix,
   lazygit, gh, ripgrep.
2. **Sambungkan memori ke semua AI CLI** — `AGENTS.md` di-link ke `~/.claude/CLAUDE.md`,
   `~/.codex/AGENTS.md`, `~/.antigravity/AGENTS.md`, `~/.gemini/GEMINI.md`. pi memuatnya
   lewat wrapper `pi()` di shell rc.
3. **Daftarkan Mac ini** ke [`devices/`](../devices/) lewat `device-register`.
4. Setup tmux (TPM + plugin), mise, 9router (**launchd**, bukan systemd), folder kerja.

> **Catatan 9router:** `install-macos.sh` otomatis memasang & menyalakan 9router
> (service launchd). Di Linux `cuan` 9router **sudah dinonaktifkan** (stop + disable,
> tapi TIDAK dihapus — masih dipakai `pi-image-gen`, extension `compact-free`, dan satu
> project). Kalau di Mac juga tak mau jalan otomatis:
> ```bash
> launchctl unload ~/Library/LaunchAgents/com.9router.autostart.plist
> ```

> ### ⚠️ Mac ini sudah punya config sendiri?
> `install-macos.sh` mengganti config lama dengan symlink. File aslinya **di-backup** ke
> `<file>.bak.<timestamp>` (tidak hilang), tapi tidak aktif lagi. Yang paling perlu dicek
> — tool mise yang cuma ada di Mac:
> ```bash
> diff ~/.config/mise/config.toml ~/.config/mise/config.toml.bak.*
> mise use -g <tool-yang-hilang>     # otomatis tercatat balik ke dotfiles
> ```
> Karena `~/.config/mise/config.toml` adalah symlink ke repo, `mise use -g` langsung
> menulis ke dotfiles. **Terhubung, bukan saling menimpa.**

---

## Tahap 5 — Login & Verifikasi

### 5.1 Login

```bash
gh auth login
gh auth setup-git      # ⚠️ WAJIB. Tanpa ini `git push` gagal "could not read Username"
claude                 # login lewat browser saat pertama jalan
codex login
```

> **Kenapa `gh auth setup-git` wajib:** credential helper harus di-set. Dan pastikan
> nilainya **tanpa path absolut** (`!gh auth git-credential`) — kalau ia menunjuk
> `/usr/bin/gh` (path Linux), di Mac akan patah karena `gh` ada di `/opt/homebrew/bin`.

Identitas git sudah ikut dotfiles (sama di semua device). Cek:

```bash
git config --get user.email     # <id>+ongkipro@users.noreply.github.com
```

> ⚠️ **Awas config LOKAL repo** — `git config --local` **selalu** menang atas global:
> ```bash
> git config --local --get user.email      # kosongkan: git config --local --unset user.email
> ```

### 5.2 SSH — bikin key BARU, jangan copy dari Linux

🔒 Key SSH **tidak pernah ada di dotfiles** (diblokir `.gitignore`). Di Mac, buat key baru:

```bash
ssh-keygen -t ed25519 -C "mac"
gh ssh-key add ~/.ssh/id_ed25519.pub --title "$(hostname)"
```

Satu key = satu device. Kalau Mac hilang, cukup cabut key **Mac** di GitHub/server,
device lain tidak terganggu.

### 5.3 Verifikasi

```bash
device-register        # spek Mac + status SEMUA symlink (❌ = ada yang putus)
dotsync doctor         # memori bersama tersambung ke tiap AI CLI?
security-check         # tidak ada rahasia bocor ke repo?
hx --health            # config helix valid?

claude --version && codex --version && pi --version && agy --version
which node             # HARUS dari nvm, BUKAN dari mise shims
```

Terakhir, **daftarkan Mac ini ke registry** dan push:

```bash
cd ~/dotfiles
git pull --rebase      # ⚠️ WAJIB dulu — kalau tidak, indeks devices/ akan menghapus
                       #    baris device lain yang belum ter-pull
device-register
dotsync sync "device: daftarkan Mac"
```

---

## Ringkasan satu layar

```bash
# 1 — Dasar
xcode-select --install
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# ikuti 2 baris PATH yang dicetak Homebrew, lalu:
brew install gh tmux btop jq duf libpq && brew link --force libpq
brew install --cask chromium

# 2 — Runtime
brew install nvm && mkdir -p ~/.nvm   # ikuti `brew info nvm` utk blok ~/.zshrc
source ~/.zshrc && nvm install --lts
curl -fsSL https://mise.run | sh
echo 'eval "$($HOME/.local/bin/mise activate zsh)"' >> ~/.zshrc && source ~/.zshrc

# 3 — AI CLI
npm i -g @anthropic-ai/claude-code @openai/codex @earendil-works/pi-coding-agent

# 4 — Dotfiles
git clone https://github.com/ongkipro/dotfiles ~/dotfiles
cd ~/dotfiles && bash install-macos.sh && source ~/.zshrc
mise install

# 5 — Login & daftar
gh auth login && gh auth setup-git
codex login
git pull --rebase && device-register && dotsync sync "device: daftarkan Mac"
```

---

## Kalau ada yang aneh

| Gejala | Penyebab tersering |
|---|---|
| `brew: command not found` | 2 baris PATH dari installer Homebrew belum masuk `~/.zprofile` |
| `git push` → *could not read Username* | `gh auth setup-git` belum dijalankan, atau helper menunjuk path gh Linux |
| `agy: command not found` | symlink `agy` → binary `antigravity` belum dibuat |
| Config (lazygit/helix) seperti tak berlaku | **symlink putus** — cek `device-register`, cari ❌. Symlink putus TIDAK bersuara |
| `psql`/`pg_dump` not found | `brew link --force libpq` belum dijalankan |
| npm global hilang | node pindah manajer — `which node` harus menunjuk ke nvm |
| Baris device lain hilang dari `devices/README.md` | `device-register` dijalankan sebelum `git pull` |
