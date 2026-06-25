# dotfiles — Linux Dev Terminal

Backup & sync konfigurasi terminal dev (terminal-first, no-sudo via mise). Lihat panduan lengkap di [`docs/linux-dev-setup.md`](docs/linux-dev-setup.md).

## Isi
```
config/
  bashrc.tools.sh      # blok mise + dev-tools untuk ~/.bashrc
  starship.toml        # prompt
  ripgreprc            # config ripgrep
  helix/languages.toml # LSP python (pyright+ruff) untuk Helix
  gitignore_global     # global gitignore
docs/
  linux-dev-setup.md   # runbook lengkap (reproduksi, install, revert, cheat sheet)
  dev-setup.md         # panduan ringkas
install.sh             # tempatkan config + tambah blok bashrc (idempotent)
```

## Pakai di device baru
```bash
git clone <url-repo> ~/dotfiles
cd ~/dotfiles
bash install.sh          # tempatkan config + patch ~/.bashrc
# lalu ikuti "Langkah berikutnya" yang dicetak install.sh (install tool via mise/npm/pipx + git config)
source ~/.bashrc
```

Update dari device manapun: edit config aktif → `cp` ke repo (atau edit di repo lalu `install.sh`) → `git commit` → `git push`. Tarik di device lain: `git pull && bash install.sh`.

## Prinsip
- Tool CLI/bahasa → `mise` (no sudo). Update: `mise up`.
- `sudo` hanya untuk paket sistem (apt/snap). Detail di docs.
