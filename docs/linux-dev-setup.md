# Linux Dev Terminal — Setup Lengkap & Reproduksi
> Runbook untuk membangun ulang environment ini di device baru / masa depan.
> Device asal: Ubuntu 26.04, shell bash. Prinsip: **terminal-first, no-sudo (mise), ringan & cepat, VSCode opsional.**
> Buka cepat: ketik `devdoc`. Versi ringkas: `devnotes` (~/dev-setup.md).

---

## 0. FILOSOFI
- **No-sudo dulu**: tool CLI & bahasa lewat `mise` (user-local di `~/.local`). `sudo` hanya untuk paket sistem (apt/snap).
- **Terminal-first**: editor `helix`, git lewat `lazygit`, server jalan di terminal, preview di Chromium localhost. VSCode jadi cadangan, bukan keharusan.
- **Ringan**: nvm di-lazy-load, prompt starship plain, binari native. Target startup shell < 0.15s.

---

## 1. REPRODUKSI DI DEVICE BARU (urut)

### 1.1 Prasyarat
Pastikan ada: `git`, `curl`, dan Node (lewat nvm atau nanti via mise). Cek: `git --version; curl --version; node -v`.

### 1.2 Install mise (manajer tool, no-sudo)
```bash
curl -fsSL https://mise.run | sh
```

### 1.3 Tambahkan blok ke ~/.bashrc
Backup dulu: `cp ~/.bashrc ~/.bashrc.bak`. Lalu tempel **Blok bashrc** dari Bagian 2.1 ke akhir `~/.bashrc`.
(Kalau pakai nvm, ganti juga bagian load nvm dengan versi lazy-load di 2.1.)

### 1.4 Install semua tool CLI (mise, no-sudo)
```bash
mise use -g fzf fd bat delta lazygit zoxide eza yq direnv starship helix ruff
mise use -g "aqua:tealdeer-rs/tealdeer"     # tldr
mise up                                     # update semua (sewaktu-waktu)
```

### 1.5 Tool berbasis Node (npm -g, no-sudo) — AI CLI + Language Server
```bash
# AI / dev CLI (sesuaikan kebutuhan)
npm i -g @anthropic-ai/claude-code @earendil-works/pi-coding-agent @openai/codex \
         @shopify/cli wrangler

# Language server untuk Helix (autocomplete/error)
npm i -g typescript-language-server vscode-langservers-extracted \
         @tailwindcss/language-server yaml-language-server bash-language-server pyright
```

### 1.6 Tool Python (pipx, no-sudo)
```bash
pipx install python-lsp-server      # pylsp
```

### 1.7 Git config (no-sudo)
Jalankan semua perintah di Bagian 2.6.

### 1.8 File config (copy isi dari Bagian 2)
- `~/.config/starship.toml`  (2.2)
- `~/.ripgreprc`             (2.3)
- `~/.config/helix/languages.toml` (2.4)
- `~/.gitignore_global`      (2.5)

### 1.9 Selesai
`source ~/.bashrc` atau buka terminal baru. Cek: `mise ls`, `hx --health python`, `git config --global -l`.

---

## 2. ISI FILE KONFIGURASI (copy-paste)

### 2.1 Blok ~/.bashrc
```bash
# --- nvm lazy-load (ganti baris load nvm bawaan dgn ini) ---
export NVM_DIR="$HOME/.nvm"
for _nbin in "$NVM_DIR"/versions/node/*/bin; do [ -d "$_nbin" ] && PATH="$_nbin:$PATH"; done; unset _nbin
nvm() { unset -f nvm; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"; [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"; nvm "$@"; }

# --- mise: tool manager user-local (no sudo) ---
if command -v mise >/dev/null; then
  export PATH="$HOME/.local/share/mise/shims:$PATH"   # tool kebaca di script/non-interaktif
  eval "$(mise activate bash)"                         # interaktif: versi per-direktori
fi

# >>> dev-tools setup >>>
# fallback nama apt (kalau tool dari apt): fdfind/batcat
command -v fdfind >/dev/null && alias fd='fdfind'
command -v batcat >/dev/null && alias bat='batcat'
# eza pengganti ls (tanpa --icons; pakai --icons hanya kalau ada Nerd Font)
if command -v eza >/dev/null; then
  alias ls='eza --group-directories-first'
  alias ll='eza -la --git --group-directories-first --time-style=relative'
  alias la='eza -a --group-directories-first'
  alias lt='eza --tree --level=2'
fi
command -v zoxide >/dev/null && eval "$(zoxide init bash)"     # smart cd: z <nama>
command -v fzf >/dev/null && eval "$(fzf --bash)" 2>/dev/null  # Ctrl-R/Ctrl-T/Alt-C
command -v direnv >/dev/null && eval "$(direnv hook bash)"     # .envrc per project
# man berwarna via bat
if command -v bat >/dev/null; then export MANPAGER="sh -c 'col -bx | bat -l man -p'"
elif command -v batcat >/dev/null; then export MANPAGER="sh -c 'col -bx | batcat -l man -p'"; fi
# ripgrep config
[ -f ~/.ripgreprc ] && export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"
# fzf: sumber fd + preview bat/eza
if command -v fzf >/dev/null; then
  if command -v fd >/dev/null; then
    export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'
    export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
    export FZF_ALT_C_COMMAND='fd --type d --hidden --follow --exclude .git'
  fi
  export FZF_DEFAULT_OPTS="--height 45% --layout=reverse --border=rounded --info=inline"
  command -v bat >/dev/null && export FZF_CTRL_T_OPTS="--preview 'bat -n --color=always --line-range :300 {}' --preview-window=right,60%"
  command -v eza >/dev/null && export FZF_ALT_C_OPTS="--preview 'eza --tree --level=2 --color=always {}'"
fi
# tampilan & editor
command -v bat >/dev/null && export BAT_THEME="ansi"
if command -v hx >/dev/null; then export EDITOR="hx"; elif command -v vim >/dev/null; then export EDITOR="vim"; else export EDITOR="nano"; fi
export VISUAL="$EDITOR"; export PAGER="less"; export LESS="-FRX"
alias grep='grep --color=auto'
# akses cepat
alias g='git'
command -v lazygit >/dev/null && alias lg='lazygit'
alias ..='cd ..'; alias ...='cd ../..'; alias ....='cd ../../..'
mkcd(){ mkdir -p -- "$1" && cd -- "$1"; }
ff(){ local f; f=$(fzf --preview 'bat -n --color=always {} 2>/dev/null || cat {}') && [ -n "$f" ] && ${EDITOR%% *} "$f"; }
fkill(){ local pid; pid=$(ps -eo pid,comm,%cpu,%mem --sort=-%cpu | sed 1d | fzf -m --header='pilih proses (TAB=multi)' | awk '{print $1}'); [ -n "$pid" ] && echo "$pid" | xargs -r kill "${1:--15}"; }
command -v starship >/dev/null && eval "$(starship init bash)"
# <<< dev-tools setup <<<
```

### 2.2 ~/.config/starship.toml
```toml
add_newline = true
command_timeout = 1000
format = """
$directory$git_branch$git_status$cmd_duration
$character"""
[character]
success_symbol = "[>](bold green)"
error_symbol = "[>](bold red)"
[directory]
truncation_length = 3
truncate_to_repo = true
style = "bold cyan"
[git_branch]
symbol = ""
format = "[on ](dimmed)[$branch]($style) "
style = "bold purple"
[git_status]
style = "bold yellow"
ahead = "^${count}"
behind = "v${count}"
diverged = "^${ahead_count}v${behind_count}"
conflicted = "x${count}"
untracked = "?${count}"
modified = "*${count}"
staged = "+${count}"
stashed = "s${count}"
renamed = "r${count}"
deleted = "-${count}"
[cmd_duration]
min_time = 2000
format = "[took $duration]($style) "
style = "bold yellow"
[nodejs]
disabled = true
[python]
disabled = true
```

### 2.3 ~/.ripgreprc
```
--smart-case
--hidden
--glob=!.git/*
--max-columns=200
--max-columns-preview
--colors=line:fg:yellow
--colors=match:fg:black
--colors=match:bg:yellow
--colors=path:fg:green
--colors=path:style:bold
```

### 2.4 ~/.config/helix/languages.toml
```toml
[language-server.pyright]
command = "pyright-langserver"
args = ["--stdio"]
[language-server.ruff]
command = "ruff"
args = ["server"]
[[language]]
name = "python"
language-servers = ["pyright", "ruff"]
```

### 2.5 ~/.gitignore_global
```
.DS_Store
Thumbs.db
desktop.ini
*.swp
*.swo
*~
.idea/
*.sublime-workspace
.direnv/
.env
.env.local
.env.*.local
*.log
```

### 2.6 Git config (perintah)
```bash
git config --global core.editor "hx"
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global push.autoSetupRemote true
git config --global push.default simple
git config --global fetch.prune true
git config --global fetch.writeCommitGraph true
git config --global diff.colorMoved default
git config --global diff.algorithm histogram
git config --global merge.conflictStyle zdiff3
git config --global rerere.enabled true
git config --global rerere.autoupdate true
git config --global column.ui auto
git config --global branch.sort -committerdate
git config --global tag.sort -version:refname
git config --global commit.verbose true
git config --global help.autocorrect prompt
git config --global rebase.autosquash true
git config --global rebase.autostash true
git config --global core.excludesfile ~/.gitignore_global
# delta (diff cantik)
git config --global core.pager delta
git config --global interactive.diffFilter "delta --color-only"
git config --global delta.navigate true
git config --global delta.line-numbers true
# alias
git config --global alias.st "status -sb"
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.lg "log --graph --oneline --decorate --all -20"
git config --global alias.last "log -1 HEAD --stat"
git config --global alias.undo "reset --soft HEAD~1"
git config --global alias.amend "commit --amend --no-edit"
```

---

## 3. CARA INSTALL DI TERMINAL (kapan pakai apa)
| Mau pasang | Pakai | sudo? | Perintah |
|---|---|---|---|
| Tool CLI / bahasa | **mise** ⭐ | ❌ | `mise use -g <nama>` ; update: `mise up` ; hapus: `mise rm <nama>` |
| Tool Node | **npm** | ❌ | `npm i -g <paket>` |
| App Python | **pipx** | ❌ | `pipx install <paket>` |
| Lib/paket sistem | **apt** | ✅ | `sudo apt update && sudo apt install <paket>` |
| App GUI besar | **snap** | ✅ | `sudo snap install <paket>` |

`sudo` = jalan sebagai admin (minta password, password tidak tampil saat diketik). Pakai hanya untuk barang sistem.
Aturan emas: butuh tool CLI baru → **coba `mise use -g` dulu**.

---

## 4. OPTIMASI SISTEM (device-specific, BUTUH sudo)
> Khusus device ini; di device lain sesuaikan. Semua reversibel.
```bash
# Boot lebih cepat
sudo systemctl disable NetworkManager-wait-online.service
# Snap: hapus revisi lama + batasi simpan 2
sudo snap set system refresh.retain=2
snap list --all | awk '/disabled/{print $1, $3}' | while read n r; do sudo snap remove "$n" --revision="$r"; done
# Service nganggur (verifikasi dulu: printer? modem? remote?)
sudo systemctl disable --now ModemManager.service cups.service cups-browsed.service cups.socket
# Hapus app tak terpakai
sudo apt remove --purge -y anydesk firefox
sudo snap remove firefox cups
# Browser yang DIPERTAHANKAN: chromium (develop), brave (harian), google-chrome (login google)
# Bluetooth DIBIARKAN nyala (buat speaker JBL)
```
Pemakai RAM terbesar = VSCode (~3.5GB) → kerja terminal-first hemat banyak RAM.

---

## 5. REVERT / UNINSTALL
```bash
cp ~/.bashrc ~/.bashrc.bak     # backup dulu

# Semua tool CLI (mise) ke nol:
rm -rf ~/.local/share/mise ~/.config/mise ~/.local/bin/mise
# lalu hapus blok "dev-tools" + "mise" di ~/.bashrc

# Prompt starship: hapus baris 'starship init' di ~/.bashrc (atau rm ~/.config/starship.toml)
# Editor balik ke VSCode:
git config --global core.editor "code --wait"   # + ubah EDITOR di ~/.bashrc
# Hapus config tambahan:
rm ~/.ripgreprc ~/.gitignore_global
rm -rf ~/.config/helix
# Hapus language server:
npm uninstall -g typescript-language-server vscode-langservers-extracted @tailwindcss/language-server yaml-language-server bash-language-server pyright
pipx uninstall python-lsp-server
mise rm ruff
# Balikin service/app sistem (sudo):
sudo systemctl enable --now cups.service ModemManager.service NetworkManager-wait-online.service
sudo apt install firefox anydesk
sudo snap install firefox cups chromium
```

---

## 6. CHEAT SHEET HARIAN (shell)
```
g            git                 lg     lazygit (commit cepat TUI)
ll / la / lt list / all / tree   z X    loncat folder (zoxide)
Ctrl-T       cari file (preview)  Ctrl-R cari history    Alt-C  pindah folder
mkcd X       bikin+masuk folder   ff     cari file->buka editor   fkill  pilih proses->kill
rg "teks"    cari isi file        fd nama   cari file
bat file     lihat file berwarna  devnotes / devdoc  buka panduan
git st | git lg | git undo | git amend
```

---

## 7. CHEAT SHEET HELIX (`hx`) — editor modal
Helix itu **modal**: ada mode Normal (default) & Insert. Tekan `Esc` untuk balik ke Normal.
```
# Mode
i / a        masuk Insert (sebelum / sesudah kursor)
Esc          balik ke Normal
v            mode Select (visual)

# Gerak (mode Normal)
h j k l      kiri bawah atas kanan      w / b   loncat kata maju/mundur
gg / ge      awal / akhir file          gh / gl awal / akhir baris
Ctrl-d/u     turun/naik setengah layar  %       seluruh file

# Edit
x            pilih baris                d   hapus (yang dipilih)
y / p        copy / paste               c   ganti (hapus+insert)
u / U        undo / redo                >  / <   indent / unindent

# Multi-kursor
C            tambah kursor di bawah     ,   buang semua kursor extra
s            pilih (regex) dlm seleksi  Alt-s  pisah per baris jadi kursor

# File & cari
Space f      buka file (picker)         Space b   daftar buffer
Space /      cari teks global (grep)    /         cari di file ini (n/N lompat)
Space '      buka picker terakhir

# LSP (autocomplete & navigasi kode)
gd           go to definition          gr   referensi
gy           type definition           K    hover info (dokumen)
Space a      code action (quick fix)   Space r  rename simbol
Space d      diagnostics file ini      ]d / [d  error berikut/sebelum
(autocomplete muncul otomatis saat ngetik; Tab/Enter pilih)

# Simpan & keluar
:w           simpan        :q    keluar      :wq  simpan+keluar     :q!  keluar paksa
:o file      buka file     :vs / :hs  split  Ctrl-w h/j/k/l  pindah panel

# Bantuan
Space ?      command palette (semua perintah + keybind)
:config-open edit config helix
```
Tips adaptasi dari VSCode: yang sering = `Space f` (Ctrl-P), `Space /` (cari global), `gd` (go to def), `Space r` (rename), `Space a` (quick fix). Save `:w`.

---

## 8. WORKFLOW HARIAN (tanpa VSCode)
```bash
tmux                       # split: editor | server | git (Ctrl-b " atau %)
hx src/App.tsx             # edit (autocomplete + error inline aktif)
lg                         # stage/commit/push cepat
npm run dev                # jalanin dev server (vite/next/shopify/wrangler)
# buka Chromium -> http://localhost:<port>  (preview, auto live-reload)
claude / pi / codex        # AI bantu coding
```
Preview = Chromium + localhost. Commit = lazygit/git (editor di terminal). VSCode hanya kalau benar-benar perlu.

---

## 9. TROUBLESHOOTING: pi.dev / TUI kedip2 (flicker) di Linux

**Gejala:** pi.dev (atau claude/nvim) kedip2 pas reasoning/streaming — **hanya di Linux**, di Mac aman.

**Akar masalah:** TUI streaming bungkus tiap frame pakai marker *synchronized output* (DECSET 2026)
biar terminal ganti layar sekaligus (atomic). tmux cuma nerusin marker itu kalau terminal
luar dideklarasi sync-capable. Kalau tidak → frame separuh bocor ke layar → kedip. Fix dasarnya
sudah ada di `config/tmux.conf`: `set -as terminal-features ",*:sync"` (guard `%if version >= 3.4`).

**Terapkan / refresh:**
```bash
cd ~/dotfiles && git pull
tmux kill-server        # WAJIB restart penuh — 'source-file' tak refresh cache term-features
```

**Cek apakah sync sudah aktif** (di dalam tmux, pane terpasang):
```bash
tmux display-message -p '#{version} | #{client_termfeatures}'
# fitur 'sync' harus muncul di daftar. Kalau tidak → naik tangga di bawah.
```

### Tangga eskalasi kalau MASIH kedip

| # | Cek | Perbaikan |
|---|-----|-----------|
| 1 | `tmux -V` < 3.4 ? | Upgrade tmux. Ubuntu 22.04 = 3.2a (fitur `sync` di-skip). 24.04 = 3.4 OK. Atau build statis/nightly. |
| 2 | Terminal support 2026 ? | Pakai kitty / ghostty / wezterm / foot / alacritty ≥0.13. `xterm`/gnome-terminal jadul tak support. |
| 3 | Terminal advertise 2026 tapi buggy (artefak makin parah) ? | Sempitkan sync ke TERM yg bagus saja, mis. `set -as terminal-features ",xterm-ghostty:sync"` (ganti wildcard `*`). |
| 4 | Kedip periodik tiap ~5 dtk (bukan pas streaming) ? | Status bar redraw. Naikkan `status-interval` — **TAPI baca jebakan di bawah**, set-nya harus SETELAH TPM. |
| 5 | Semua di atas mentok | Jalanin `pi` **di luar tmux** (terminal langsung) — sync ditangani terminal native, tanpa lapisan tmux. |

### ⚠️ JEBAKAN: `status-interval` selalu balik ke 5 (tmux-sensible)

**Gejala:** sudah tulis `set -g status-interval 15` di `tmux.conf`, tapi
`tmux show -gv status-interval` tetap **5**.

**Sebabnya:** plugin **tmux-sensible** memaksa `status-interval 5`, tapi hanya kalau
nilainya masih sama dengan **default tmux — dan default tmux itu justru 15**. Jadi menulis
`15` malah bikin sensible mengira kita tak mengubah apa pun, lalu menimpanya.

**Perbaikannya:** set **SETELAH** baris `run '~/.tmux/plugins/tpm/tpm'` (plugin dimuat di
situ, jadi apa pun setelahnya menang). Sudah diterapkan di `config/tmux.conf`.

```bash
tmux source-file ~/.tmux.conf
tmux show -gv status-interval    # harus 15
```

**Kenapa ini bikin kedip:** `status-right` mem-fork `tmux-battery` (~28ms) tiap interval.
Di 5 detik = 12 fork/menit → redraw periodik. Di 15 detik = 4 fork/menit.
Ini **terpisah** dari flicker saat streaming (yang ditangani `*:sync`).

**Verifikasi cepat "tmux vs bukan":** keluar dari tmux, jalanin `pi` langsung di terminal.
- Kalau **tidak kedip** → masalah di lapisan tmux (fokus baris 1–3).
- Kalau **tetap kedip** → terminal luar tak support 2026 (baris 2) atau isu di pi.dev sendiri
  (cek `pi --help` untuk opsi render, dan versi pi terbaru).
