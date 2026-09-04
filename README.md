# dotfiles

One tracked source for the shell, editor, toolchain, and the AI engineering
contract shared by every CLI on every device. Real files live here; the live
locations are symlinks into this repository, so editing a config is editing the
repo.

## What this owns

- **Shared AI context** — `config/ai/AGENTS.md`, linked to Claude, Codex,
  Antigravity, and OMP. One policy, four runtimes.
- **Curated memory** — `config/ai/memory/` (durable, cross-device) and
  `config/ai/project-memory/` (personal reference). Routed per prompt by
  `ai-memory-route`; never scanned wholesale.
- **Owned skills** — `skills/local/`, mapped in
  [`skills/local/README.md`](skills/local/README.md). Every runtime reads that
  one directory through a symlink.
- **Delivery contract** — `TASKS.md` is the executable queue; `.delivery/`
  holds hash-chained run evidence; `bin/delivery-ledger` enforces the task
  change boundary.
- **Commands** — `bin/`, declared in `config/ai/runtime-commands.txt` and
  linked into `~/.local/bin` by the installers.

## What it deliberately does not own

- **OMP runtime configuration.** OMP uses its upstream-native settings, model
  catalog, agents, and provider routing. `config/omp/config.yml` is a
  secret-free reference loaded only by an explicit `omp --config`; it is never
  installed. See [`config/omp/README.md`](config/omp/README.md).
- **Secrets.** Development credentials live in `~/.config/ai-local/secrets.env`
  (0600, outside every repository) and are read through `secrets-env`.
- **Device-local facts.** Anything true of one machine belongs in
  `~/.config/ai-local/`, not here.
- **Repository truth.** Project status, requirements, and architecture belong to
  each project repository. Personal project memory is reference only.

## Install

```bash
git clone https://github.com/ongkipro/dotfiles ~/dotfiles
cd ~/dotfiles && bash install.sh          # Linux
cd ~/dotfiles && bash install-macos.sh    # macOS
```

Then `device-register` to record the machine, and commit the result.

## Daily

| Command | What it answers |
|---|---|
| `ai-doctor` | is the AI ↔ device ↔ memory chain intact? |
| `resume-brief` | where am I, according to the repository? |
| `dotsync status` / `dotpush` | what changed, and save it |

`ai-doctor --self-test` runs the authoritative suite; CI runs the same command
on Ubuntu and macOS. `device-verify` runs every gate on one machine and writes a
committed report under `docs/device-reports/`.

## Authority

Disk and executable checks decide. When a document and the runtime disagree, the
runtime is right and the document is the bug. `TASKS.md` owns current work;
`docs/DOTFILES_*.md` are dated snapshots carrying supersession banners, never
current state. AI is never the source of truth.

## Safety

Approval gates are behavioural, not mechanical: broad shell permissions are not
user approval. Secrets, destructive commands, system-wide changes, production
deploys, and scope creep stop and ask. `config/ai/hooks/git-guard.sh` blocks
force-push, history rewriting, and remote-branch deletion regardless of the
permission allowlist; wire it with `ai-hooks-install` on a new device.
