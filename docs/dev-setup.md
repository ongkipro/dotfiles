# Dev Terminal Setup — panduan install & cara balikin
> Setup terminal-first AI CLI, prinsip: no-sudo (pakai mise). Dibuat bareng Claude.
> Lihat cepat: `devnotes`  (alias = `bat ~/dev-setup.md`)

==================================================================
## A. CARA INSTALL DI TERMINAL — kapan pakai apa
==================================================================

### 1. mise  → TOOL CLI & bahasa pemrograman  (TANPA sudo) ⭐ UTAMA
Contoh: ripgrep, fzf, node, python, helix, dll. Semua masuk ~/.local (user-only).
    mise use -g <nama>      # pasang  (cth: mise use -g ripgrep)
    mise up                 # update SEMUA tool
    mise ls                 # lihat yang terpasang
    mise rm <nama>          # hapus tool
    mise registry | grep <kata>   # cari nama tool

### 2. npm -g  → tool berbasis Node  (TANPA sudo, karena pakai nvm)
Contoh: claude, pi, codex, wrangler.
    npm install -g <paket>      # pasang
    npm uninstall -g <paket>    # hapus
    npm ls -g --depth=0         # lihat

### 3. pipx  → aplikasi Python  (TANPA sudo)
    pipx install <paket>        # pasang
    pipx uninstall <paket>      # hapus

### 4. apt  → paket SISTEM  (BUTUH sudo)
Buat lib/driver/docker/build tools yang nggak ada di mise.
    sudo apt update             # refresh daftar paket
    sudo apt install <paket>    # pasang
    sudo apt remove --purge <paket>   # hapus
    sudo apt autoremove         # bersihin sisa
  ⚠️ "sudo" = jalan sebagai admin, MINTA PASSWORD kamu. Pakai HANYA utk paket sistem.

### 5. snap  → aplikasi GUI besar  (BUTUH sudo)
Buat browser, vscode, dll.
    sudo snap install <paket>
    sudo snap remove <paket>
    snap list

### ATURAN PRAKTIS (urutan pilihan):
  Tool CLI / bahasa     → mise   (no sudo)  ← default, coba ini dulu
  Tool Node             → npm -g (no sudo)
  App Python            → pipx   (no sudo)
  Lib/paket sistem      → apt    (sudo)
  App GUI besar         → snap   (sudo)

==================================================================
## B. APA YANG TERPASANG SAAT SETUP
==================================================================
- mise tools : fzf fd bat delta lazygit zoxide eza yq direnv tealdeer starship helix
- prompt     : starship  → ~/.config/starship.toml  (mode plain, tanpa ikon)
- editor     : helix (hx) → EDITOR & git core.editor
- git        : ~/.gitconfig (alias + delta pager) , ~/.gitignore_global
- ripgrep    : ~/.ripgreprc
- bash       : ~/.bashrc → blok "dev-tools setup (claude)" + nvm lazy-load + mise activate
- editor LSP : SUDAH terpasang (autocomplete/hover/go-to-def/error inline aktif di helix):
                 npm -g : typescript-language-server, vscode-langservers-extracted (html/css/json/eslint),
                          @tailwindcss/language-server, yaml-language-server, bash-language-server, pyright
                 pipx   : python-lsp-server (pylsp)
                 mise   : ruff (lint+format python)
                 config : ~/.config/helix/languages.toml (python -> pyright + ruff)
               Tambah bahasa lain: cari "helix <bahasa> language server", install binari-nya
               (npm/pipx/mise), helix auto-pakai kalau binari ada di PATH. Cek: hx --health <bahasa>

==================================================================
## C. CARA BALIKIN (REVERT)
==================================================================
TIP: backup dulu →  cp ~/.bashrc ~/.bashrc.bak

# Balikin SEMUA tool CLI (mise) ke nol:
    rm -rf ~/.local/share/mise ~/.config/mise ~/.local/bin/mise
    # lalu di ~/.bashrc, hapus dari baris "# mise:" sampai "# <<< dev-tools setup (claude) <<<"

# Matikan prompt starship saja:
    # hapus baris 'starship init' di ~/.bashrc   (atau: rm ~/.config/starship.toml)

# Balikin editor ke VSCode:
    git config --global core.editor "code --wait"
    # dan ubah baris EDITOR di ~/.bashrc jadi: export EDITOR="code --wait"

# Balikin git config / hapus alias:
    nano ~/.gitconfig        # hapus baris yang nggak mau
    # atau per-item: git config --global --unset <key>

# Hapus file config tambahan:
    rm ~/.ripgreprc ~/.gitignore_global

# Hapus language server (LSP) helix:
    npm uninstall -g typescript-language-server vscode-langservers-extracted @tailwindcss/language-server yaml-language-server bash-language-server pyright
    pipx uninstall python-lsp-server
    mise rm ruff
    rm -rf ~/.config/helix

# Balikin SERVICE & APP sistem yang dimatikan/dihapus (BUTUH sudo):
    sudo systemctl enable --now cups.service ModemManager.service NetworkManager-wait-online.service
    sudo apt install firefox anydesk
    sudo snap install firefox cups chromium

==================================================================
## D. CHEAT SHEET HARIAN
==================================================================
  g            git                       lg     lazygit (TUI commit cepat)
  ll / la      list detail / semua       lt     tree 2 level
  z <nama>     loncat folder             ..     naik folder
  Ctrl-T       cari file (preview)       Ctrl-R cari history
  Alt-C        pindah folder             mkcd   bikin+masuk folder
  ff           cari file -> buka editor  fkill  pilih proses -> kill
  hx <file>    edit di terminal (helix)  devnotes  buka panduan ini
