# Install Linux dari Nol — Step by Step

> **Untuk siapa:** saya sendiri, saat laptop baru / install ulang Ubuntu.
> **Titik mulai:** Ubuntu baru selesai di-install, baru pertama kali buka Terminal.
> **Titik selesai:** semua tool + AI CLI jalan, dotfiles ter-link, memori & skill AI aktif.
>
> Urutannya **tidak boleh dibalik**. Tiap tahap dipakai oleh tahap berikutnya:
>
> ```
> 1. Dasar OS  →  2. Runtime  →  3. AI CLI  →  4. Dotfiles  →  5. Login & Cek
>    (apt)         (nvm+mise)     (npm)         (install.sh)     (verifikasi)
>                                                    ↑
>                              di sinilah AI "dikasih otak": memori + skill
> ```
>
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
| `curl` | dipakai installer mise & nvm |
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

## Tahap 2 — Runtime (tanpa `sudo`)

### 2.1 nvm + Node

Node **dikelola nvm**, bukan mise. Ini disengaja — baca kotak peringatan di bawah.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source ~/.bashrc
nvm install --lts
node -v && npm -v
```

> ### ⚠️ JANGAN pasang `node` lewat mise
> Shim mise berada **lebih awal** di `PATH` daripada nvm. Kalau mise ikut memasang
> node, ia menggeser node nvm — padahal semua AI CLI (`claude`, `codex`, `pi`) adalah
> npm global di bawah nvm, dan native module seperti `better-sqlite3` bisa pecah karena
> beda ABI. Karena itu `node` **sengaja tidak ada** di `config/mise-config.toml`.
> Jangan juga set `prefix=` di `~/.npmrc` — biarkan npm ikut prefix nvm.

### 2.2 mise (manajer tool, no-sudo)

```bash
curl -fsSL https://mise.run | sh
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
source ~/.bashrc
mise --version
```

Tool-nya (fzf, ripgrep, helix, delta, lazygit, dll) **belum** dipasang di sini —
daftarnya ikut dotfiles dan otomatis terpasang di Tahap 4.

---

## Tahap 3 — AI CLI

```bash
npm i -g @anthropic-ai/claude-code @openai/codex @earendil-works/pi-coding-agent
```

| CLI | Paket npm | Perintah |
|---|---|---|
| Claude Code | `@anthropic-ai/claude-code` | `claude` |
| Codex | `@openai/codex` | `codex` |
| pi.dev | `@earendil-works/pi-coding-agent` | `pi` |

**Antigravity (`agy`)** — bukan paket npm. Binary-nya berdiri sendiri dan ditaruh di
`~/.local/bin/antigravity`, lalu dibuatkan symlink:

```bash
ln -sfn ~/.local/bin/antigravity ~/.local/bin/agy
agy --version
```

> Ambil binary-nya dari sumber resmi Antigravity — **jangan** ditebak URL-nya.
> Symlink `agy` inilah yang dulu pernah hilang diam-diam sementara binary-nya utuh,
> sehingga perintah `agy` seolah lenyap.

Language server (opsional, buat helix):

```bash
npm i -g typescript-language-server vscode-langservers-extracted \
         bash-language-server yaml-language-server @tailwindcss/language-server pyright
```

---

## Tahap 4 — Dotfiles (di sinilah semuanya nyambung)

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
   `~/.codex/AGENTS.md`, `~/.gemini/GEMINI.md` (dibaca `agy`). pi memuatnya lewat
   wrapper `pi()` di `~/.bashrc`.
3. **Daftarkan device ini** ke [`devices/`](../devices/) — spek + status tiap symlink.
4. Setup tmux (TPM + plugin).

Lalu pasang toolchain-nya (daftarnya sudah ikut dotfiles):

```bash
mise install     # baca ~/.config/mise/config.toml (symlink ke repo)
```

> **Kenapa AI dipasang SEBELUM dotfiles?** Karena dotfiles-lah yang "mengisi otak"
> AI: memori bersama + skill. AI yang dipasang duluan langsung punya konteks begitu
> `install.sh` selesai — tak perlu setup ulang.

> ### ⚠️ Kalau ini device LAMA (sudah punya config sendiri)
> `install.sh` mengganti config asli dengan symlink. File lamanya **di-backup** ke
> `<file>.bak.<timestamp>` (tidak hilang), tapi tidak aktif lagi. Yang paling perlu
> dicek — tool mise yang cuma ada di device itu:
> ```bash
> diff ~/.config/mise/config.toml ~/.config/mise/config.toml.bak.*
> mise use -g <tool-yang-hilang>     # otomatis tercatat balik ke dotfiles
> ```

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

Set identitas git (samakan dengan akun GitHub-mu):

```bash
git config --global user.name  "<nama>"
git config --global user.email "<email-yang-sama-dengan-GitHub>"
```

### 5.2 Verifikasi

```bash
device-register        # spek device + status SEMUA symlink (❌ = ada yang putus)
dotsync doctor         # memori bersama tersambung ke tiap CLI?
security-check         # tidak ada rahasia yang bocor ke repo?
hx --health            # config helix valid? ("malformed" = ada yang salah)
```

Cek cepat manual:

```bash
claude --version && codex --version && pi --version && agy --version
node -v && which node          # HARUS dari ~/.nvm/..., BUKAN dari mise shims
mise ls                        # toolchain terpasang
```

---

## Ringkasan satu layar

```bash
# 1 — Dasar
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential curl git unzip ca-certificates gnupg apt-transport-https
sudo apt install -y gh tmux btop jq duf 7zip chromium-browser postgresql-client

# 2 — Runtime
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source ~/.bashrc && nvm install --lts
curl -fsSL https://mise.run | sh
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc && source ~/.bashrc

# 3 — AI CLI
npm i -g @anthropic-ai/claude-code @openai/codex @earendil-works/pi-coding-agent

# 4 — Dotfiles
git clone https://github.com/ongkipro/dotfiles ~/dotfiles
cd ~/dotfiles && bash install.sh && source ~/.bashrc
mise install

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
| npm global hilang setelah pasang node baru | node pindah versi/manajer — pastikan `which node` menunjuk ke `~/.nvm/...` |
| helix mengabaikan config | `hx --health` → cari *"Configuration file malformed"* |
