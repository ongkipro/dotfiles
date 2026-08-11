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

This private repository is the source of truth for Ongki's terminal-first development environment across Linux and macOS. It keeps terminal configuration, shared AI policy and memory, reusable capabilities, OMP configuration, device records, and bootstrap scripts in one Git history.

> [!IMPORTANT]
> This repository must remain **PRIVATE**. It intentionally excludes credentials, but it still contains personal workflows, device inventory, project context, and operational details that are not intended for public distribution. Never change the GitHub visibility to public.

Verify the live GitHub setting when needed:

```bash
gh repo view ongkipro/dotfiles --json visibility,isPrivate
```

It solves four recurring problems:

| Problem | Repository contract |
|---|---|
| A new machine takes days to rebuild | Clone the repository, review the installer, run the OS-specific bootstrap, then verify the resulting links and runtime state. |
| Machine configuration drifts | Live configuration is symlinked back to tracked files whenever practical. |
| AI workers lose shared engineering context | OMP and the supported standalone CLIs are wired to one tracked policy source and can read the same memory. |
| Reusable AI workflows get duplicated | Owned capabilities have one canonical source: `skills/local/`. |

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
2. **Keeps machines consistent.** Linux and macOS share the same core policy, memory, skills, editor configuration, and terminal conventions where the platforms allow it.
3. **Shares AI context.** OMP is the primary control plane; supported standalone CLIs are wired to consume the same tracked policy and on-demand memory.
4. **Centralizes reusable capabilities.** A skill is maintained once under `skills/local/` instead of copied into provider-specific packages.
5. **Diagnoses drift.** `ai-doctor`, focused checks, and the device registry expose broken links, stale assumptions, and unsafe content.
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

### OMP control plane

OMP is the only primary development control plane. It owns the session, tool
runtime, task-agent execution, capability discovery, and model selection. OMP
talks to model providers directly; standalone Claude, Codex, Antigravity, and Pi
CLIs are optional handoff targets, not subprocess workers or competing control
planes.

Tracked OMP configuration is linked into its native agent directory:

```text
~/.omp/agent/config.yml -> ~/dotfiles/config/omp/config.yml
~/.omp/agent/models.yml -> ~/dotfiles/config/omp/models.yml
```

`config.yml` is the authority for model roles, thinking defaults, fallback
chains, and runtime settings. `models.yml` defines tracked, non-secret custom
provider metadata. OAuth sessions, API keys, and provider authentication remain
machine-local. The optional remote 9Router key lives at
`~/.config/ai-local/credentials/9router-remote-key`; the `omp()` wrapper injects
it only into the OMP child when `NINEROUTER_REMOTE_KEY` is not already set. OMP
does not read Pi authentication, and a missing key affects only that optional
provider.

Do not duplicate model routing inside skills. A capability defines what and how;
OMP decides which model executes it.

Semantic routing has one owner: [`config/omp/ROUTING.md`](config/omp/ROUTING.md).
Its executable selectors are kept in `config/omp/config.yml`:

| Work class | OMP role | Current selector |
|---|---|---|
| Normal development | `default` | Codex GPT-5.6 Sol, medium reasoning |
| Complex implementation | `slow` | Codex GPT-5.6 Sol, high reasoning |
| Architecture-sensitive planning | `plan` | Codex GPT-5.6 Sol, high reasoning |
| Visual frontend work | `vision` | Gemini 3.1 Pro through Antigravity |
| High-value consultation | `advisor` | Anthropic Claude Opus 4.8, high reasoning |

Task size alone does not trigger escalation. Complexity, specialist evidence,
or a demonstrated blocker does.

Normal use is one command and one outcome:

```bash
cd ~/Projects/<project>
omp
```

OMP performs policy-driven autonomous orchestration with deterministic
agent-to-model mappings. Matching specialists may run concurrently when their
work is independent; not every configured agent runs for every request.
Dependent work remains sequential, and the main session owns integration and
final verification. Exact routing behavior is owned by
`config/omp/ROUTING.md`; `/model` remains a manual main-session override.

The model displayed in the main OMP header remains the context owner's model.
Each task widget shows its resolved specialist model. For UI/UX work, a
`designer` task with the Gemini/Antigravity badge proves that visual routing
occurred; no `designer` task means the main session did not dispatch it.

OMP intentionally uses native `tools.approvalMode: yolo` so its tools and
subagents do not add a second mechanical approval prompt. OMP talks to model
providers directly; it does not need dangerous standalone-CLI flags for Codex,
Claude, Gemini, or other workers.

This setting does **not** waive the approval gates in `config/ai/AGENTS.md`.
The agent must still obtain explicit user approval before secrets access,
destructive changes, system-wide operations, production actions, or scope creep.
A session may request a stricter mechanical mode when useful.

### Shared AI context

The cross-runtime instruction source is:

```text
config/ai/AGENTS.md
```

`~/.config/ai` is a symlink to `~/dotfiles/config/ai`. The current context
adapters are:

| Live path or mechanism | Consumer | Current state |
|---|---|---|
| `~/.claude/CLAUDE.md` | Claude Code | Linked |
| `~/.codex/AGENTS.md` | Codex | Linked |
| `~/.antigravity/AGENTS.md` | Antigravity compatibility path | Linked |
| `~/.gemini/GEMINI.md` | Antigravity/Gemini compatibility path | Linked; standalone Gemini CLI is not installed |
| `pi()` shell wrapper | Optional Pi CLI | Appends `~/.config/ai/AGENTS.md` when Pi is installed |
| `~/.omp/agent/AGENTS.md` | OMP native user context | Linked |

`~/.omp/AGENTS.md` is an obsolete compatibility path. `ai-memory-link` removes
it only when it is still the managed link to the canonical source.

Claude Code uses one native profile at `~/.claude`. There are no tracked
personal/work launchers or alternate config-directory profiles.

### Memory layers

| Layer | Location | Purpose |
|---|---|---|
| Always-loaded policy | `config/ai/AGENTS.md` | Universal behavior, approval gates, evidence discipline, and short pointers |
| Shared memory | `config/ai/memory/` | Environment, workflow, preferences, decisions, and cross-project facts read on demand |
| Project reference memory | `config/ai/project-memory/` | Personal cross-session pointers and context that do not belong in a repository; never current project truth |
| Device-local notes | `~/.config/ai-local/` | Private machine details that must not sync |

The project-memory directory is linked to Claude's memory path for sessions
whose project key is the home directory:

```text
~/.claude/projects/-home-ongki/memory
  -> ~/dotfiles/config/ai/project-memory
```

That is not universal automatic discovery for every project or runtime. Other
sessions read the tracked memory files when relevant. Current status, decisions,
requirements, architecture, tasks, and build evidence belong in the project
repository (`AGENTS.md`, `PRD.md`, `TASKS.md`, `STATUS.md`, `BUILD-LOG.md`, or
`docs/`), never in project-memory.

OMP's autonomous memory backend is not enabled in the tracked configuration, so
it does not currently create a competing long-term memory source.

### Skills and reusable capabilities

Owned skills live in exactly one place:

```text
skills/local/<skill-name>/SKILL.md
```

Current runtime adapters:

| Runtime | Live path | Shape | Access |
|---|---|---|---|
| OMP | `~/.omp/agent/skills` | Directory symlink | Automatic |
| Claude | `~/.claude/skills` | Directory symlink | Automatic |
| Pi (optional) | `~/.pi/agent/skills` | Directory symlink when installed | Automatic |
| Antigravity | `~/.gemini/config/skills` | Directory symlink | Automatic native discovery |
| Codex | `~/.codex/skills` | Real directory preserving `.system`, plus managed per-skill links | Automatic native discovery |
| Shared helper | `~/.agents/local-skills` | Directory symlink | Canonical-source convenience path |

Codex is the deliberate exception to the whole-directory model: replacing
`~/.codex/skills` would hide runtime-owned `.system` skills. `skill-update`
therefore reconciles one link per owned capability and removes only stale links
that it owns. Obsolete `~/.gemini/skills` and `~/.antigravity/skills` links are
removed when they point exactly at the canonical source.

Useful commands:

```bash
skill-list
skill-open <name>
skill-new <name>
skill-remove <name>
skill-update
```

The active updater is:

```text
~/.agents/bin/skill-update
  -> ~/dotfiles/skills/agents-bin/skill-update
```

It establishes or repairs runtime adapters and does not fetch an external skill
repository. Directory-link runtimes follow Git immediately; run `skill-update`
after adding or removing a skill to reconcile Codex, or after installing a runtime.

### Model and worker boundary

OMP task agents inherit the parent session's discovered skills. Provider/model
availability depends on machine-local authentication, while role selection lives
in `config/omp/config.yml`. Inspect that file rather than copying a model table
into documentation that will drift.

Standalone Claude, Codex, and Antigravity remain useful for direct
provider-specific work. Pi is an optional supporting fallback with custom
compaction. Switching to any standalone CLI is an explicit context handoff, not
an OMP subagent dispatch.

### Repository-local project contract

Projects own their current engineering state. `project-init` creates the minimal
contract inside a repository without overwriting existing files:

```text
PROJECT/
├── AGENTS.md
├── PRD.md
├── TASKS.md
├── STATUS.md
├── BUILD-LOG.md
└── docs/
    └── architecture.md
```

Use `docs/specs/` and `docs/decisions/` only when a real specification or
costly-to-reverse decision exists. Draft research may remain under
`~/Documents/work/`; accepted requirements, active tasks, implementation state,
and architecture travel with the repository.

```bash
project-init --repo /path/to/existing-project
project-init <github-repo-name> <category> ["description"]
```

The sandbox regression check is `bin/project-init-test`.

## Repository map

```text
dotfiles/
├── bin/                         # Maintenance, diagnostics, project, and terminal helpers
│   ├── ai-doctor                # Read-only AI runtime health report
│   ├── ai-memory-check          # Markdown link and wikilink validation
│   └── project-init             # Repository-local development contract
├── config/
│   ├── ai/                      # Canonical cross-runtime policy and memory
│   ├── omp/                     # Routing policy, model roles, runtime settings, providers
│   ├── templates/               # Repository-local project contract templates
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
│   ├── agents-bin/              # Capability management and validation commands
│   └── local/                   # Canonical owned capabilities
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

Shell startup files are the deliberate exception: they remain device-owned and
source tracked helpers instead of becoming whole-file symlinks.

```text
Linux ~/.bashrc       -> source ~/dotfiles/config/shell-tools.sh
macOS ~/.zshrc        -> source ~/dotfiles/config/zshrc.tools.sh
macOS ~/.bashrc       -> source ~/dotfiles/config/bashrc.tools.sh
```

On Linux, `install.sh` backs up and removes the legacy copied dev-tools block
before adding the single tracked source line. This keeps shell behavior live and
prevents copied wrappers or credentials from drifting outside Git.

Editing a linked live path therefore edits the repository. Git remains the synchronization and recovery mechanism.

Before replacing an existing regular file or directory, the installer atomically moves it to a timestamped `.bak.*` path. Only after that succeeds does it create the symlink. Review those backups before deleting them.

## Installation

### Read this first

The installers are intentionally opinionated. Depending on the machine, they may:

- move existing configuration targets to timestamped backups, then create symlinks;
- patch shell startup files;
- download or install user tools;
- install tmux clipboard dependencies;
- configure the runtime-neutral 9Router service or optional Pi adapter only when explicitly enabled.
- create device records and work directories.

Both installers skip 9Router and Pi restoration by default. Set
`DOTFILES_SETUP_9ROUTER=1` for the generic gateway or `DOTFILES_SETUP_PI=1`
for the optional Pi adapter. Credential migration remains a separate,
user-invoked `9router-credential-migrate` command.

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

`ai-doctor` is the broad integrity check:

```bash
ai-doctor
```

It inspects the repository, native context targets, memory paths, runtime skill
visibility, canonical updater resolution, OMP configuration, dangling symlinks,
security controls, installed AI CLIs, and selected memory-versus-disk invariants.
Default mode is read-only and never repairs or installs anything.

Use `ai-doctor --self-test` to additionally run regression checks that create
isolated temporary sandbox files.

Focused checks:

```bash
ai-memory-check
ai-memory-check --self-test
ai-memory-check .              # all repository Markdown
security-check
security-check-test
bin/installer-link-test
bin/skill-remove-test
bin/skill-update-test
bin/project-init-test
bin/turnstile-secret-test
device-register --dry-run
dotsync doctor
```

The `*-test` commands may create disposable files or repositories under a
temporary directory. A passing static check does not prove interactive
authentication, provider reachability, or model availability. Exercise only the
relevant runtime when those claims matter, and never print credential values.

## Daily workflow

Preferred manual workflow:

```bash
cd ~/dotfiles
git pull --ff-only
git status --short
lg
```

Use Lazygit for interactive inspection and authorized Git actions. Stage only the intended files, review the staged diff, and commit or push only when the user has approved that specific action. Prefer plain Git for deterministic automation.

Inspection helpers:

```bash
dotsync status
dotsync doctor
security-check
```

These inspection commands do not intentionally change tracked repository
content, but some use temporary files internally; they are not substitutes for
a strict zero-write audit.

After adding or removing an owned capability, intentionally reconcile Codex and
any newly installed runtime:

```bash
skill-update
ai-doctor
```

`skill-update` changes managed live symlinks but never copies capability content
or writes tracked files.

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

## Supported AI runtime stack

| Runtime | Current role | Owned skill access |
|---|---|---|
| OMP | Primary development control plane and model router | Automatic |
| Codex / OpenAI inside OMP | Default development model provider | Inherits OMP skills |
| Antigravity / Gemini inside OMP | Visual, UI, and supporting model provider | Inherits OMP skills |
| Claude models inside OMP | High-value architecture, debugging, migration, and security consultation through `advisor` | Inherits OMP skills |
| Claude Code CLI | Standalone provider-specific consultation and long-context work | Automatic |
| Codex CLI | Standalone focused implementation, debugging, and review | Automatic through managed links beside `.system` |
| Antigravity (`agy`) CLI | Standalone visual/UI work | Automatic through `~/.gemini/config/skills` |
| Pi (optional) | Supporting CLI fallback and custom compaction | Automatic when installed |
| 9Router (optional) | Runtime-neutral gateway API, including image generation | Through the `9router` skill |

MiniMax, OpenCode-compatible providers, and future model providers are execution
options rather than capability owners. The runtime-neutral `9router` skill owns
the image-generation procedure and calls the gateway API; no Pi extension owns
that capability. Exact availability and authentication are machine-local.
`config/omp/ROUTING.md` owns semantic routing; `config/omp/config.yml` owns
executable selectors and fallbacks.

Continue in OMP when it already owns the session. Moving to a standalone CLI is
an explicit handoff and does not automatically transfer conversation state.

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
AI         OMP primary + optional standalone Claude Code, Codex, Antigravity, and Pi
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
