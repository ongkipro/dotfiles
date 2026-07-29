<div align="center">

```text
█▀▄ █▀█ ▀█▀ █▀▀ █ █   █▀▀ █▀▀
█▄▀ █▄█  █  █▀  █ █▄▄ ██▄ ▄▄█
```

# Ongki's Dotfiles

**A terminal-first, cross-device development environment with shared AI memory and skills.**

[![Linux](https://img.shields.io/badge/Linux-supported-FCC624?style=flat-square&logo=linux&logoColor=black)](docs/linux-install-step-by-step.md)
[![macOS](https://img.shields.io/badge/macOS-supported-000000?style=flat-square&logo=apple&logoColor=white)](docs/macos-install-step-by-step.md)
[![Shell](https://img.shields.io/badge/Shell-bash_%2B_zsh-4EAA25?style=flat-square&logo=gnubash&logoColor=white)](https://www.gnu.org/software/bash/)
[![Editor](https://img.shields.io/badge/Editor-Helix-281733?style=flat-square)](https://helix-editor.com/)
[![Toolchain](https://img.shields.io/badge/Toolchain-mise-FF6B6B?style=flat-square)](https://mise.jdx.dev/)
[![Repository](https://img.shields.io/badge/Repository-private-555?style=flat-square&logo=github)](https://github.com/ongkipro/dotfiles)

Maintained by [Ongki Pro](https://ongki.pro).

</div>

---

## Overview

This private repository is the source of truth for Ongki's development environment across Linux and macOS. It keeps terminal configuration, AI instructions, reusable skills, device records, and bootstrap scripts in one Git history.

> [!IMPORTANT]
> This repository must remain **PRIVATE**. It intentionally excludes credentials, but it still contains personal workflows, device inventory, project context, and operational details that are not intended for public distribution. Never change the GitHub visibility to public.

Verify the live GitHub setting when needed:

```bash
gh repo view ongkipro/dotfiles --json visibility,isPrivate
```

It solves four recurring problems:

| Problem | Repository contract |
|---|---|
| A new machine takes days to rebuild | Clone the repository, review the installer, run the OS-specific bootstrap, then verify with `ai-doctor`. |
| Machine configuration drifts | Live configuration is symlinked back to tracked files whenever practical. |
| AI CLIs lose context between devices | Claude, Codex, Pi, and Antigravity read the same shared instruction and memory system. |
| Reusable AI workflows get duplicated | Owned skills have one canonical source: `skills/local/`. |

This is a personal operating system, not a generic framework. Paths, Git identity, tool choices, and AI routing reflect Ongki's machines and workflow.

## What are dotfiles?

On Unix-like systems, configuration files traditionally start with a dot, which hides them from ordinary directory listings. Examples include:

```text
~/.gitconfig
~/.profile
~/.config/helix/config.toml
~/.tmux.conf
```

These files tell command-line tools and desktop applications how to behave: which editor to open, how the shell initializes, which tools are on `PATH`, how Git formats output, and where an AI CLI finds its instructions.

A **dotfiles repository** stores those configurations in Git so they can be reviewed, versioned, restored, and reused across machines. This repository uses the familiar name broadly: it also manages bootstrap scripts, AI memory, reusable skills, and device documentation that support the same environment.

## What this repository does

The repository has six practical functions:

1. **Reproduces the environment.** The OS-specific installers connect a new machine to the tracked configuration.
2. **Keeps machines consistent.** Linux and macOS share the same core memory, skills, editor configuration, and terminal conventions where the platforms allow it.
3. **Shares AI context.** Claude, Codex, Pi, and Antigravity receive the same durable operating rules and memory.
4. **Centralizes reusable skills.** A skill is maintained once under `skills/local/` instead of copied into every CLI.
5. **Diagnoses drift.** `ai-doctor`, `security-check`, and the device registry reveal broken links, stale assumptions, and unsafe content.
6. **Provides recovery history.** Git records what changed and makes intentional rollback possible without relying on undocumented machine state.

It does **not** synchronize secrets, authentication sessions, SSH keys, private environment files, or arbitrary home-directory data.

## How it works

The repository combines three standard mechanisms:

- **Git** stores history and transfers reviewed changes between devices.
- **Symlinks** make applications read their live configuration directly from the repository.
- **Bootstrap scripts** create those links and install or connect the supporting tools.

The normal flow is:

```text
Tracked source in ~/dotfiles
            │
            │ installer creates symlink
            ▼
Live path such as ~/.tmux.conf
            │
            │ tmux reads the linked file
            ▼
Application uses the tracked configuration
            │
            │ edit + review + commit + push
            ▼
GitHub PRIVATE repository
            │
            │ git pull on another device
            ▼
Other device receives the same configuration
```

For example:

```text
~/.tmux.conf -> ~/dotfiles/config/tmux.conf
```

Editing either path changes the same tracked file. After the change is reviewed and committed, another device can receive it with `git pull --ff-only`. Because its live path is also a symlink, the application immediately sees the updated configuration.

Not every file is linked. Device-local state and secrets deliberately remain outside the repository, while machine inventory is recorded only as sanitized documentation.

## Design principles

1. **One source, linked everywhere.** Edit the tracked source instead of copying configuration between tools.
2. **Disk wins over memory.** If documentation or AI memory disagrees with the live system, verify the system and correct the stale record.
3. **Secrets remain local.** Authentication, SSH keys, environment files, tokens, and provider databases never belong in this repository.
4. **Device-specific state stays device-specific.** Hardware details, private addresses, and local credentials are not shared configuration.
5. **Native before custom.** Prefer platform features and existing tools before adding dependencies or wrappers.
6. **No automatic commits.** Review changes and commit intentionally, normally through `lazygit` (`lg`).

## Architecture

### Shared AI context

The cross-CLI instruction source is:

```text
config/ai/AGENTS.md
```

`bin/ai-memory-link` connects it to the context path used by each installed CLI:

```text
~/.claude/CLAUDE.md
~/.codex/AGENTS.md
~/.antigravity/AGENTS.md
~/.gemini/GEMINI.md
```

Pi receives the same instructions through the shell wrapper in `config/shell-tools.sh`. The `.gemini` directory belongs to Antigravity in this setup; the standalone Gemini CLI is deliberately not part of the supported stack.

Claude Code uses one native profile at `~/.claude`. There are no personal/work launchers or alternate config-directory profiles.

### Memory layers

| Layer | Location | Purpose |
|---|---|---|
| Always-loaded policy | `config/ai/AGENTS.md` | Stable behavior, approval gates, language rules, and routing. |
| Shared memory | `config/ai/memory/` | Environment, workflow, preferences, decisions, and cross-project facts. |
| Project memory | `config/ai/project-memory/` | Project-specific decisions and gotchas, indexed by `MEMORY.md`. |
| Claude memory backup | `config/claude-memory/` | Selected Claude Code memory retained in Git. |
| Device-local notes | `~/.config/ai-local/` | Private machine details that must not sync. |

Code progress does not belong in shared memory. Read each project's `STATUS.md`, `BUILD-LOG.md`, or equivalent repository artifact.

### Skills

Owned skills live in exactly one place:

```text
skills/local/<skill-name>/SKILL.md
```

On a configured machine:

```text
~/.claude/skills       ─┐
~/.pi/agent/skills     ─┼──> ~/dotfiles/skills/local/
~/.agents/local-skills ─┘
```

Claude and Pi discover the directory automatically. Codex and Antigravity use `skill-list`, then read the relevant `SKILL.md` directly. Skills are not repackaged as per-CLI plugins because that would create another source of truth.

Useful commands:

```bash
skill-list
skill-open <name>
skill-new <name>
skill-remove <name>
skill-update
```

`skill-update` establishes or repairs the directory symlinks. Once linked, normal cross-device synchronization is just Git.

## Repository map

```text
dotfiles/
├── ai-toolkits/                 # Shared development playbooks and reference toolkits
├── bin/                         # Maintenance, diagnostics, sync, and terminal helpers
│   └── ai-memory-check          # Broken Markdown link and wikilink detector
├── config/
│   ├── ai/                      # Cross-CLI policy and memory
│   ├── claude-memory/           # Selected Claude Code memory backup
│   ├── helix/                   # Editor and language-server configuration
│   ├── pi/                      # Pi settings and extensions
│   ├── systemd/user/            # Tracked user-service definitions
│   ├── gh/                      # Non-secret GitHub CLI configuration
│   ├── lazygit/                 # Lazygit configuration
│   ├── mise-config.toml         # Shared mise tool declarations
│   ├── tmux.conf                # tmux configuration
│   └── shell-tools.sh           # Cross-shell PATH, aliases, and wrappers
├── devices/                     # Generated device inventory and symlink status
├── docs/                        # Detailed setup and operational runbooks
├── home/                        # Tracked home-file sources and snapshots
├── skills/
│   ├── agents-bin/              # Skill management commands
│   └── local/                   # Canonical owned skills
├── install.sh                   # Linux-oriented bootstrap
└── install-macos.sh             # macOS bootstrap
```

The tree is intentionally summarized here. Use `rg --files`, `skill-list`, or the linked runbooks for the current inventory instead of maintaining fragile hand-written counts.

## Live symlink model

The installers link tracked sources into the home directory:

```text
~/.config/ai                 -> ~/dotfiles/config/ai
~/.config/mise/config.toml   -> ~/dotfiles/config/mise-config.toml
~/.config/helix/config.toml  -> ~/dotfiles/config/helix/config.toml
~/.config/lazygit/config.yml -> ~/dotfiles/config/lazygit/config.yml
~/.tmux.conf                 -> ~/dotfiles/config/tmux.conf
~/.gitignore_global          -> ~/dotfiles/config/gitignore_global
```

Editing a linked live path therefore edits the repository. Git remains the synchronization and recovery mechanism.

Before replacing an existing regular file or directory, the installer atomically moves it to a timestamped `.bak.*` path. Only after that succeeds does it create the symlink. Review those backups before deleting them.

## Installation

### Read this first

The installers are intentionally opinionated. Depending on the machine, they may:

- move existing configuration targets to timestamped backups, then create symlinks;
- patch shell startup files;
- download or install user tools;
- install tmux clipboard dependencies;
- configure Pi's 9router integration;
- create device records and work directories.

Review the relevant script before running it:

```bash
less install.sh
less install-macos.sh
```

Do not run either installer from an unrelated clone path. The expected location is `~/dotfiles`.

### Linux

For a complete fresh-machine sequence, use [docs/linux-install-step-by-step.md](docs/linux-install-step-by-step.md).

After Git, the language runtimes, and supported AI CLIs are available:

```bash
git clone https://github.com/ongkipro/dotfiles.git ~/dotfiles
cd ~/dotfiles
bash install.sh
```

Open a new shell, install the declared mise tools, then verify:

```bash
mise install
ai-doctor
```

Node is deliberately managed per device rather than declared in the shared mise configuration. This avoids moving npm-installed AI CLIs between incompatible Node installations.

### macOS

For the complete sequence, use [docs/macos-install-step-by-step.md](docs/macos-install-step-by-step.md).

```bash
git clone https://github.com/ongkipro/dotfiles.git ~/dotfiles
cd ~/dotfiles
bash install-macos.sh
```

Open a new shell, then verify:

```bash
ai-doctor
```

The macOS installer uses the same shared memory and skill sources but applies macOS-specific shell and service setup.

### Existing machine

On a machine that already has development configuration:

1. Inspect the installer and current targets.
2. Commit or back up unrelated work.
3. Run the OS-specific installer.
4. Compare any generated `.bak.*` files with their new linked targets.
5. Run `ai-doctor`.
6. Run `device-register --dry-run`, inspect the output, then run `device-register` if it is correct.

## Verification

`ai-doctor` is the primary integrity check:

```bash
ai-doctor
```

It checks the repository, shared context targets, memory paths, memory links, skill links, dangling symlinks, security guards, installed AI CLIs, and selected memory-versus-disk invariants.

Additional focused checks:

```bash
ai-memory-check
ai-memory-check --self-test
ai-memory-check .              # all repository Markdown
security-check
security-check-test
bin/installer-link-test
bin/skill-remove-test
bin/skill-update-test
bin/turnstile-secret-test
device-register --dry-run
dotsync doctor
```

A passing static check does not prove every interactive CLI is authenticated. Test the relevant CLI directly when authentication or runtime behavior matters.

## Daily workflow

Preferred manual workflow:

```bash
cd ~/dotfiles
git pull --ff-only
git status --short
lg
```

Stage only the intended files, review the staged diff, commit, and push from Lazygit.

Read-only helpers:

```bash
dotsync status
dotsync doctor
security-check
```

`dotsync commit` and `dotsync sync` are broad convenience commands: they refresh machine snapshots and run `git add -A` before confirmation. Use them only when the entire working tree is intentionally in scope. `dotpush` is an even broader commit-and-push fast path. Neither is appropriate for a mixed or dirty worktree.

On another device, pull only from a clean worktree:

```bash
git pull --ff-only
ai-doctor
```

## Device registry

[`devices/`](devices/) contains one generated report per registered machine plus an index. Reports include hardware, OS, installed AI CLIs, and tracked symlink health.

```bash
device-register --dry-run
device-register
```

Run it after meaningful hardware, OS, CLI, or symlink changes. Pull the latest repository state first so regenerating the index does not discard another device's newer entry.

Private machine facts such as internal addresses and local secrets belong in `~/.config/ai-local/`, not `devices/`.

## Security boundaries

This repository is private, but private does not mean safe for secrets.

Never commit:

- SSH private keys, `authorized_keys`, or `known_hosts`;
- `.env`, `.dev.vars`, or credential files;
- Claude, Codex, Pi, GitHub, Gemini/Antigravity, or 9router authentication state;
- API keys, access tokens, passwords, customer data, or payment data;
- device-local secret files.

The `.gitignore` blocks common secret paths and `bin/security-check` scans tracked and staged content for obvious credential patterns. These are guardrails, not a substitute for reviewing the staged diff.

Run before every security-sensitive commit:

```bash
git diff --cached
security-check
```

If a real secret is ever committed, removing the file in a later commit is insufficient. Revoke or rotate the credential immediately, then handle Git history deliberately.

## Supported AI CLI stack

| CLI | Default role | Skill access |
|---|---|---|
| Claude Code | Long-context architecture and implementation | Automatic |
| Pi | Daily terminal inspection, editing, and execution | Automatic |
| Codex | Focused implementation, debugging, and review | `skill-list` plus direct `SKILL.md` read |
| Antigravity (`agy`) | UI-oriented work, previews, and smaller development tasks | `skill-list` plus direct `SKILL.md` read |

These are routing defaults, not hard boundaries. Continue in the CLI that already owns the relevant context.

## Toolchain

The shared mise configuration currently declares terminal tools such as Helix, ripgrep-adjacent search utilities, Lazygit, Delta, Starship, Direnv, Ruff, GitHub CLI, and data-processing helpers. Inspect the authoritative list instead of relying on this summary:

```bash
sed -n '1,200p' config/mise-config.toml
mise current
```

Core workflow:

```text
Editor     Helix
Terminal   tmux + bash/zsh + Starship
Git        Git + Lazygit + Delta + GitHub CLI
Tools      mise-managed user tools
AI         Claude Code + Pi + Codex + Antigravity
```

## Documentation

| Document | Use it for |
|---|---|
| [Linux installation](docs/linux-install-step-by-step.md) | Fresh Linux machine setup and verification |
| [macOS installation](docs/macos-install-step-by-step.md) | Fresh macOS machine setup and verification |
| [Linux development runbook](docs/linux-dev-setup.md) | Full Linux toolchain and recovery details |
| [AI memory sync](docs/ai-memory-sync.md) | Cross-device memory architecture |
| [Shopify repository map](docs/shopify-ai-development-repos.md) | Shopify development source routing |
| [Device registry](devices/README.md) | Registered machines and generated reports |

When a runbook and the current scripts disagree, the scripts and live system are authoritative. Update the runbook in the same change.

## Maintenance rules

- Keep `config/ai/AGENTS.md` small because every supported AI CLI loads it.
- Put durable facts in memory and reusable procedures in skills.
- Do not turn project status into a skill.
- Do not duplicate changing facts across multiple memory files.
- Preserve unrelated dirty-tree changes and stage explicit paths.
- Run the smallest validation that would fail if the change were broken.
- Do not commit or push unless the user explicitly requests it.

---

<div align="center">

**[ongki.pro](https://ongki.pro)** · **[@ongkipro](https://github.com/ongkipro)**

*Tools are meant to disappear. Only the work remains.*

</div>
