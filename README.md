<div align="center">

```
█▀▄ █▀█ ▀█▀ █▀▀ █ █   █▀▀ █▀▀
█▄▀ █▄█  █  █▀  █ █▄▄ ██▄ ▄▄█
```

**Terminal-first dev environment. AI-native. Zero bloat.**

[![macOS](https://img.shields.io/badge/macOS-26-000000?style=flat-square&logo=apple&logoColor=white)](https://apple.com)
[![Ubuntu](https://img.shields.io/badge/Ubuntu-26.04-E95420?style=flat-square&logo=ubuntu&logoColor=white)](https://ubuntu.com)
[![Shell](https://img.shields.io/badge/Shell-zsh_|_bash-4EAA25?style=flat-square&logo=gnu-bash&logoColor=white)](https://www.gnu.org/software/bash/)
[![Helix](https://img.shields.io/badge/Editor-Helix-7D5E9C?style=flat-square)](https://helix-editor.com)
[![mise](https://img.shields.io/badge/Tools-mise-FF6B6B?style=flat-square)](https://mise.jdx.dev)
[![Private](https://img.shields.io/badge/Repo-Private-555?style=flat-square&logo=github)](https://github.com/ongkipro/dotfiles)

*by [ongki.pro](https://ongki.pro)*

</div>

---

## ⚡ Stack

```
AI CLIs   →  Claude Code · Pi.dev · Codex · Gemini · Antigravity
Editor    →  Helix (hx)
Terminal  →  tmux · starship · zsh/bash
Git       →  lazygit (lg) · delta (diff) · gh (GitHub CLI)
Tools     →  rg · fd · eza · bat · fzf · zoxide · yq · direnv
Runtime   →  mise (Node/Python/Go) · nvm (lazy) · pnpm · pipx
Deploy    →  Vercel CLI · Wrangler (Cloudflare) · gh
```

---

## 📁 Struktur

```
dotfiles/
│
├── 📂 skills/local/           # Local AI skills → semua CLI
│   ├── shadcn-ui/             # shadcn/ui + charts + sidebar + blocks
│   ├── prd-taskbreaker/       # Ide → PRD → numbered tasks
│   ├── mermaid-diagram/       # Flowchart, ERD, Sequence, C4
│   ├── openapi-spec/          # OpenAPI 3.1 YAML generator
│   ├── supabase-stack/        # Auth + DB + Storage + self-hosted VPS
│   ├── astro-development/     # End-to-end Astro dev
│   ├── shopify-*/             # Shopify toolkit + listing
│   └── 9router-*/             # AI gateway skills (chat/image/tts/stt)
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
│   │   └── settings.json      # Pi.dev: provider=9router, theme=garuda-gold
│   ├── 9router/
│   │   ├── aliases.json       # Model aliases
│   │   └── runtime-package.json
│   ├── helix/
│   │   └── languages.toml     # LSP config
│   ├── shell-tools.sh         # Cross-platform dev tools (bash + zsh, Ubuntu + macOS)
│   ├── starship.toml          # Prompt (plain, no Nerd Font)
│   ├── tmux.conf              # Terminal multiplexer
│   ├── gitignore_global       # Global git ignores
│   └── ripgreprc              # rg config
│
├── 📂 bin/
│   ├── ai-memory-link         # Symlink AGENTS.md ke semua AI CLI
│   ├── dotpush                # git add + commit + push 1 perintah
│   └── akun                   # Claude account switcher
│
├── 📂 docs/
│   ├── linux-dev-setup.md     # Setup lengkap dari nol
│   ├── dev-setup.md           # Ringkasan cepat
│   └── shopify-ai-development-repos.md
│
└── install.sh                 # Idempotent setup — device baru siap dalam menit
```

---

## 🚀 Device Baru

```bash
git clone https://github.com/ongkipro/dotfiles ~/dotfiles
cd ~/dotfiles && bash install.sh
source ~/.zshrc   # atau ~/.bashrc (auto-terdeteksi)
```

Install.sh akan (auto-deteksi zsh/bash):
- Symlink semua config ke lokasi yang benar
- Setup cross-CLI memory (`~/.config/ai/`)
- Link local skills ke agents/claude/codex/gemini/pi
- Register bin scripts ke `~/.local/bin/`

---

## 🤖 AI Skills System

Skills ter-link ke **semua AI CLI** sekaligus via `skill-update`:

```
~/.agents/skills/    ← Agents
~/.claude/skills/    ← Claude Code
~/.codex/skills/     ← Codex
~/.gemini/skills/    ← Gemini
~/.pi/agent/skills/  ← Pi.dev
```

```bash
skill-update          # sync repo + re-link semua skills
skill-new <nama>      # buat skill baru
skill-list            # list semua skill aktif
```

**18 local skills** + **63 shared skills** dari [jezweb/claude-skills](https://github.com/jezweb/claude-skills).

---

## 🧠 Memory System

Dua lapis memory:

| Layer | Path | Dipakai oleh |
|---|---|---|
| Cross-CLI | `~/.config/ai/memory/*.md` | Semua AI CLI via symlink |
| Claude auto | `~/.claude-accounts/.../memory/` | Claude Code only |

Memory di-backup ke `config/ai/memory/` (cross-CLI) dan `config/claude-memory/` (Claude).

---

## 📅 Update Sehari-hari

```bash
dotpush                    # commit + push semua perubahan
dotpush "pesan custom"     # dengan pesan commit sendiri

# Di device lain
cd ~/dotfiles && git pull  # symlink langsung aktif
```

---

## 🔐 Yang Tidak Di-commit

```
Pi:      auth.json · models.json (ada API key) · trust.json · sessions/
9router: auth/ · jwt-secret · machine-id · tunnel/
Claude:  .claude-accounts/*/auth (token)
```

---

<div align="center">

**[ongki.pro](https://ongki.pro)** · [@ongkipro](https://github.com/ongkipro)

*"Tools are meant to disappear. Only the work remains."*

</div>
