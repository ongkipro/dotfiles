# Linux Development Environment

This runbook describes the current Linux terminal environment managed by this private repository. For a fresh-machine command sequence, use [`linux-install-step-by-step.md`](linux-install-step-by-step.md).

## Authority

When sources disagree, use this order:

1. Live disk and executable behavior
2. Installer and tracked scripts
3. `README.md` and this runbook
4. AI memory and device records

`~/dotfiles` is expected to be the repository location. The installers and tracked shell source lines rely on that path.

## Canonical sources

| Concern | Tracked source | Live path or mechanism |
|---|---|---|
| Cross-shell tools | `config/shell-tools.sh` | Sourced by `~/.bashrc` |
| WSL-only tools | `config/wsl-tools.sh` | Sourced by `~/.bashrc` on WSL |
| Shared AI policy and memory | `config/ai/` | `~/.config/ai` symlink |
| Owned AI capabilities | `skills/local/` | Runtime links reconciled by `skill-update` |
| OMP shared context | `config/ai/AGENTS.md` | `~/.omp/agent/AGENTS.md` symlink |
| OMP owned skills | `skills/local/` | `~/.omp/agent/skills` symlink |
| Tool versions | `config/mise-config.toml` | `~/.config/mise/config.toml` symlink |
| Terminal prompt | `config/starship.toml` | `~/.config/starship.toml` symlink |
| Helix | `config/helix/` | Links under `~/.config/helix/` |
| Git ignores | `config/gitignore_global` | `~/.gitignore_global` symlink |

Do not copy these files into home-directory configuration. Edit the tracked source, then verify the live link or source statement.

## Fresh Linux setup

Prerequisites: Git, Bash, `curl`, mise, and a working Node installation for Node-based AI CLIs. Install mise first by following its official installer if `mise --version` is unavailable.

```bash
git clone https://github.com/ongkipro/dotfiles.git ~/dotfiles
cd ~/dotfiles
bash install.sh
source ~/.bashrc
mise install
ai-doctor --self-test
```

Read `install.sh` before executing it. It installs or updates user tools, creates runtime links, migrates a legacy copied shell block, and writes a device record. Existing link targets are backed up before replacement.

## Shell lifecycle

`install.sh` maintains exactly one Linux source line in `~/.bashrc`:

```bash
source "$HOME/dotfiles/config/shell-tools.sh"
```

On WSL it also maintains:

```bash
source "$HOME/dotfiles/config/wsl-tools.sh"
```

The installer migrates the old `dev-tools setup (ongkipro/dotfiles)` copied block to this live-source model and preserves a timestamped `~/.bashrc.bak.*` copy first. Re-running the installer is idempotent: it must not duplicate source lines or rewrite an already-correct file.

`config/shell-tools.sh` owns PATH setup, aliases, mise activation, Pi context loading, and the interactive Starship prompt. It does not wrap OMP or inject OMP configuration or credentials. Shell UI initialization is TTY-gated so `bash -lc` remains quiet and suitable for automation.

OMP owns its native command, configuration, agents, providers, routing, updates,
workspace behavior, authentication, and session state. The installer only links
shared context and owned skills into OMP. A 9Router credential must not be
exported from `~/.bashrc` or inherited by unrelated child processes.

## Tool lifecycle

The shared mise declaration is tracked in `config/mise-config.toml`:

```bash
mise install
mise ls
mise up
```

Node remains device-managed because globally installed AI CLIs can be tied to a specific Node installation. Verify each CLI after changing Node:

```bash
for command_name in claude codex pi agy omp; do
  command -v "$command_name"
done
```

Owned AI capabilities are changed only in `skills/local/`. Run `skill-update` after adding or removing a capability, after installing a runtime, or when `ai-doctor` reports drift. Directory-link runtimes see edits immediately; Codex uses managed per-skill links beside its native `.system` directory.

## Verification

Run the focused checks before relying on a changed environment:

```bash
for file in install.sh install-macos.sh config/shell-tools.sh config/bashrc.tools.sh bin/ai-doctor; do
  bash -n "$file" || exit 1
done
if command -v zsh >/dev/null 2>&1; then
  for file in config/shell-tools.sh config/zshrc.tools.sh; do
    zsh -n "$file" || exit 1
  done
fi
installer-link-test
shell-wrapper-test
skill-update-test
skill-check-test
project-init-test
security-check-test
ai-doctor --self-test
```

Then open a fresh login shell and verify command resolution:

```bash
bash -lic 'for c in claude codex pi agy omp skill-update ai-doctor; do command -v "$c" || exit 1; done'
```

`ai-doctor` is read-only unless `--self-test` is explicitly supplied. It reports drift; it does not silently repair runtime state.

## Recovery

Do not delete runtime configuration or installer backups without inspecting them. For a bad tracked change, use Git history to identify the exact file and restore only that file. For a bad runtime link, inspect its target, preserve any regular-file content, then rerun the relevant installer or link command.

Approval is still required before destructive cleanup, system-wide package changes, production operations, or exposing credential files.
