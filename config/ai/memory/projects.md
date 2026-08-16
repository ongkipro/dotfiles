# Memory: Projects — per-project facts
> Part of shared memory. Add/update when working on a project.
> Format: `## <project name>` then bullets of important facts (path, stack, notes).

## ⚠️ READ FIRST — about PATHS (paths are PER-DEVICE, check disk first)

- `/home/fantastico/...` → that user **DOES NOT EXIST** on any machine now. That's an OLD Linux machine. Ignore it.
- **On `cuan` (Linux, user `ongki`), as of 2026-07-14: ONLY `~/Projects/kamus` is checked out** (repo `ongkipro/kamus`, branch `main`) — verified with `ls ~/Projects`. Other projects not yet cloned; the `~/Projects/<other>` paths in this file **don't apply there**. (The note from Mac saying `~/Projects/` on cuan is EMPTY is **wrong** — Mac guessed about a machine that isn't its own. Don't write another machine's disk facts without checking them.)
- **On Mac (`ongkis-MacBook-Air`), never rely on a memorized checkout list.** Verify with `find ~/Projects -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | sort`. A project absent from that output is not checked out on this device.
  - `~/Projects/kamus` was cloned and verified on 2026-08-04. Re-check disk before future work.
  - The gitignored credentials (9 `.env` + dev sqlite) were secured to `~/Documents/work/secrets/projects-env-2026-07-14/` (mode 700). **After cloning, copy the `.env` back from there** — GitHub does not store them.
  - The `.md` docs of all projects were archived to `~/Documents/work/notes/projects-md-archive-2026-07-14/`.

**The source of truth for a project = its GitHub repo** (`github.com/ongkipro/<name>`). When memory and disk conflict → **disk wins**, then fix the memory.
Want to work on a project? `git clone` it first into **`~/Projects/<name>/`** (the official convention), then start. Check facts, don't guess: `ls ~/Projects`.

## Folder convention

- **Source code → `~/Projects/<project-name>/`** (everything inside: config, node_modules, .git).
- AI output (PRD, research, content, notes) → `~/Documents/work/{prd,research,content,notes}/`.
- AI memory → **`~/.config/ai/memory/`** (symlink → dotfiles). Old notes mentioning `~/Documents/memori ai/` or `~/dotfiles/memori-ai/` are **WRONG** — neither exists.
- Main machine: Linux. macOS = secondary device for mobile/sync.

## macOS — Active Projects

### dotfiles
- `~/dotfiles` → backup of all config, private repo `github.com/ongkipro/dotfiles`.
- `install.sh` for new-device setup (idempotent).
- `bin/dotsync` = a semi-auto helper to sync across Linux/macOS for review → commit → optional push of shared memory/config.
- `install-macos.sh` = lightweight macOS bootstrap for shared memory, skill linking, and basic workflow sync.
- The tmux stack in dotfiles uses prefix `Ctrl+a`, a plain-font-friendly Catppuccin-inspired theme, and plugins: tmux-sensible, tmux-yank, resurrect, continuum, prefix-highlight, tmux-open. Setup is handled by `bin/tmux-setup`; the battery helper cross-macOS/Linux is in `bin/tmux-battery`.
- Local skills use the single source `~/dotfiles/skills/local/<name>/SKILL.md`; run `skill-list` for the current registry. Do not preserve stale per-tool copies or assume an older vendored skill set is still active.

> Note: the old repo/project `social-dashboard` has been DELETED (GitHub + fully replaced
> by `social-autopilot` on 3 July 2026). New GitHub repo: `github.com/ongkipro/social-autopilot` (private).

## Project reference indexes

This file owns only checkout/path conventions and the dotfiles project summary. Load a narrower portfolio reference for project-specific facts:

- [Product platforms and admin applications](projects-platforms.md)
- [Sites, commerce projects, reports, and repository history](projects-sites.md)
- Individual project memories under [`../project-memory/`](../project-memory/) for projects registered by the router.

Project repositories, their `AGENTS.md`, `STATUS.md`, `TASKS.md`, and executable behavior outrank these advisory summaries. Verify the checkout on the current device before acting.
