<div align="center">

```
█▀▄ █▀█ ▀█▀ █▀▀ █ █   █▀▀ █▀▀
█▄▀ █▄█  █  █▀  █ █▄▄ ██▄ ▄▄█
```

**Terminal-first dev environment. AI-native. Zero bloat.**

**Linux-first bootstrap. macOS-ready shared memory sync.**

[![Ubuntu](https://img.shields.io/badge/Ubuntu-26.04-E95420?style=flat-square&logo=ubuntu&logoColor=white)](https://ubuntu.com)
[![Shell](https://img.shields.io/badge/Shell-bash-4EAA25?style=flat-square&logo=gnu-bash&logoColor=white)](https://www.gnu.org/software/bash/)
[![Helix](https://img.shields.io/badge/Editor-Helix-7D5E9C?style=flat-square)](https://helix-editor.com)
[![mise](https://img.shields.io/badge/Tools-mise-FF6B6B?style=flat-square)](https://mise.jdx.dev)
[![Private](https://img.shields.io/badge/Repo-Private-555?style=flat-square&logo=github)](https://github.com/ongkipro/dotfiles)

*by [ongki.pro](https://ongki.pro)*

</div>

---

## 🖥️ Platform support

| Area | Linux | macOS |
|---|---|---|
| Main bootstrap (`install.sh`) | ✅ Primary target | ⚠️ Partial / adapt as needed |
| macOS bootstrap (`install-macos.sh`) | — | ✅ Available |
| Shared AI memory (`config/ai`) | ✅ | ✅ |
| Semi-auto sync (`dotsync`) | ✅ | ✅ |
| Skills/docs/config as repo source of truth | ✅ | ✅ |

> Repo ini **Linux-first** untuk setup mesin utama, tapi **memory + sync flow** sudah dirapikan supaya enak dipakai lintas Linux/macOS.

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

## 🎯 Tujuan repo ini

- **Source of truth** untuk shared AI memory, skill references, dan config terminal utama.
- **Sinkron lintas device** via Git, terutama antara workstation Linux dan device macOS.
- **Konsisten lintas AI CLI**: Claude Code, Pi.dev, Codex, Gemini, Antigravity.
- **Semi-auto sync**, bukan auto-commit liar.
- **Bootstrap ringan macOS** untuk memory + skills + sync.

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
│   ├── bashrc.tools.sh        # mise + dev aliases
│   ├── starship.toml          # Prompt (plain, no Nerd Font)
│   ├── tmux.conf              # Terminal multiplexer
│   ├── gitignore_global       # Global git ignores
│   └── ripgreprc              # rg config
│
├── 📂 bin/
│   ├── ai-memory-link         # Symlink AGENTS.md ke semua AI CLI
│   ├── dotsync                # Semi-auto sync lintas Linux/macOS
│   ├── dotpush                # Fast-path manual commit + push
│   └── akun                   # Claude account switcher
│
├── 📂 docs/
│   ├── ai-memory-sync.md      # Shared memory + sync flow Linux/macOS
│   ├── linux-dev-setup.md     # Setup lengkap dari nol
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
source ~/.bashrc
```

Install.sh akan:
- Symlink semua config ke lokasi yang benar
- Setup cross-CLI memory (`~/.config/ai/`)
- Link local skills ke agents/claude/codex/gemini/pi
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

File paling penting:
- `config/ai/AGENTS.md` → aturan ringkas yang ke-load tiap sesi
- `config/ai/memory/environment.md` → toolchain & install rules
- `config/ai/memory/workflow.md` → workflow dan guardrails
- `config/ai/memory/preferences.md` → preferensi user
- `config/ai/memory/projects.md` → fakta durable per project

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

## 🔐 Yang Tidak Di-commit

Jangan commit secrets, tokens, credential, session, cache, atau artefak sementara.


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
