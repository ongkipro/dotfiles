# Memory: Devices and Git identity

> Detailed shared reference for device-specific facts, the generated device registry, and cross-device Git identity. Verify the current machine before acting. See [environment.md](environment.md) for the compact environment index.

## User machines (multi-machine)
- Memory `~/.config/ai/` is synced via dotfiles to MULTIPLE machines — OS/toolchain facts must name the relevant machine.
- Each machine's identity + specs: the header of this file (brief) and `devices/<hostname>.md` in dotfiles (full). Don't rewrite specs in another section.
- Toolchain differences to remember: Mac has brew; `cuan` **has NO brew** (mise/npm/pipx only). On `cuan` helix `languages.toml` is a symlink → dotfiles.
- The 9router autostart mechanism (launchd on mac vs systemd --user on linux) + its trap: see the "pi.dev + 9router" section — don't duplicate it here.
- When giving OS-specific instructions (launchd vs systemd, brew vs apt, etc.), ALWAYS check the machine first (`uname -a`).

## Device registry + git credential (2026-07-13)
- **`devices/` in dotfiles = the cross-device registry.** One file per machine (`devices/<hostname>.md`): brand/model, CPU, RAM, GPU, disk, AI CLI, toolchain, and **the status of each dotfiles symlink**. Index: `devices/README.md`. Generate/refresh: `device-register` (idempotent, `--dry-run` available; called automatically by install.sh/install-macos.sh, non-fatal).
- **Specs for `cuan` (the only place in this file):** **Lenovo ThinkPad T480** (`20L6S3ED00`), i7-8650U 4c/8t, RAM **14.9 GB** (~12GB free), 4GB swap, NVMe 233GB (8% used), DUAL GPU Intel UHD 620 (`i915`) + NVIDIA MX150 2GB (driver 580.159.03, `nvidia_drm` active).
- **`~/.config/mise/config.toml` is now a SYMLINK to `dotfiles/config/mise-config.toml`** → `mise use -g <tool>` is automatically recorded in dotfiles (already tested: mise writes THROUGH the symlink without breaking it). `node` is pinned in the shared config; read that file for the current version and verify globally installed AI CLIs after changing it.
- **Another device (Mac) ACTIVELY pushes to this repo.** Use `git pull --ff-only` before authorized Git work. If branches diverge, inspect and resolve explicitly; do not rebase automatically. A real conflict happened once in `install-macos.sh` (Mac added `pi-9router-restore`, linux added `device-register`) — the resolution is to MERGE, don't pick one.

## Git identity — ONE for all devices (2026-07-13)
- **Standard: `ongkipro <82156528+ongkipro@users.noreply.github.com>`** (GitHub noreply — the real email never enters commit history, but commits still count toward the profile). The ID `82156528` comes from `gh api user`, not a guess.
- Previously there were multiple identities in circulation: a machine-global private email, `install-macos.sh` hardcoding `get@ongki.pro`, the GitHub account `ongkipro`, and — the most deceptive — a repository-local override. Local config always wins over global, so that override attributed commits to the wrong identity.
- The local override in `~/dotfiles` has been REMOVED (`git config --local --unset user.name/user.email`) → it follows global. `install-macos.sh` has also been standardized.
- ⚠️ **Old commits (before 2026-07-13) still carry the old email** — not rewritten (already pushed; a rewrite = destructive).
- ⚠️ **Check other repos**: `git config --local --get user.email` in each repo. If there's a similar override, remove it too.
- **`credential.helper` = `!gh auth git-credential`** (WITHOUT an absolute path — so it works on both Linux `/usr/bin/gh` and Mac `/opt/homebrew/bin/gh`). It was once set to the absolute path `/home/ongki/.local/bin/gh` which DOES NOT EXIST → every `git push` failed with `could not read Username`. If a push fails with that message: run `gh auth setup-git`.
