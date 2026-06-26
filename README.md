# dotfiles — Linux Dev Terminal (monorepo)

Backup & sync **config + memori AI + local-skills** (terminal-first, no-sudo via mise).
Model: **symlink** — file asli ada di repo ini, lokasi live (`~/.config/...`) cuma symlink ke sini. Jadi **edit = langsung di repo** → tinggal `dotpush`.

## Isi
```
config/
  bashrc.tools.sh      # blok mise + dev-tools untuk ~/.bashrc (di-append, bukan symlink)
  starship.toml        # prompt           -> ~/.config/starship.toml
  ripgreprc            # ripgrep          -> ~/.ripgreprc
  gitignore_global     # global gitignore -> ~/.gitignore_global
  helix/languages.toml # LSP helix        -> ~/.config/helix/languages.toml
  ai/                  # MEMORI bersama   -> ~/.config/ai
    AGENTS.md            index + aturan + protokol auto-write
    memory/*.md          environment, workflow, preferences, projects
skills/
  local/               # local-skills     -> ~/.agents/local-skills (astro, shopify-listing)
bin/
  ai-memory-link       # symlink AGENTS.md ke semua AI CLI -> ~/.local/bin/
  dotpush              # commit & push 1 perintah          -> ~/.local/bin/
docs/                  # runbook lengkap + panduan ringkas
install.sh             # symlink semua + patch ~/.bashrc (idempotent)
```

## Device baru
```bash
git clone https://github.com/ongki5758/dotfiles ~/dotfiles
cd ~/dotfiles && bash install.sh
# lalu install tool (mise/npm/pipx) + git config — lihat "Langkah berikutnya" / docs/linux-dev-setup.md
source ~/.bashrc
```

## Update sehari-hari
Edit apa pun (config / `~/.config/ai/memory/*.md` / skill) → karena symlink, langsung kena repo → cukup:
```bash
dotpush                 # commit + push otomatis
dotpush "pesan custom"  # dengan pesan sendiri
```
Tarik di device lain: `cd ~/dotfiles && git pull` (symlink bikin langsung aktif).

## Catatan
- Memori (apa yang benar) di `config/ai/`. Skill (cara melakukan) di `skills/local/` + shared-skills upstream (`~/.agents/repos`, ditarik via `skill-sync`, bukan bagian repo ini).
- `ai-memory-link` menyambungkan memori ke: pi, codex, Claude Code, Gemini, Antigravity. Nambah AI baru = tambah path di script itu.
