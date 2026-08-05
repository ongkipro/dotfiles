# AI Memory Synchronization

`~/dotfiles` is the tracked source of truth for shared AI policy, durable memory,
and owned skills across Linux and macOS.

## Sources

- `config/ai/AGENTS.md` — small policy loaded by every supported AI CLI.
- `config/ai/memory/` — durable cross-project facts loaded on demand.
- `config/ai/project-memory/` — project-specific decisions and gotchas.
- `skills/local/` — the only source for owned skills.

Live configuration is connected to these sources with symlinks. Pulling a
reviewed Git change therefore updates the consumers immediately.

## Normal workflow

Use Git and Lazygit directly for daily work:

```bash
cd ~/dotfiles
git status --short --branch
lg
```

Stage only the intended files, review the staged diff, commit, and push
explicitly. A mixed worktree must not use broad staging helpers.

Read-only checks:

```bash
dotsync                 # defaults to `dotsync status`
dotsync status
dotsync doctor
security-check
ai-doctor
```

Broad convenience commands are available only when the entire working tree is
intentionally in scope:

```bash
dotsync commit "memory: update workflow"
dotsync sync "memory: update workflow"
dotpush "memory: update workflow"
```

Both `dotsync commit` and `dotsync sync` stage the whole repository, show a
preview, and run `security-check` before committing. `dotpush` additionally
fetches, merges remote changes, and pushes. Do not use these commands on a mixed
or unexpectedly dirty worktree.

## Another device

Pull only from a clean worktree:

```bash
cd ~/dotfiles
git pull --ff-only
ai-doctor
```

If the branches diverged, inspect both sides before integrating:

```bash
git fetch origin
git rev-list --left-right --count HEAD...origin/main
git log --oneline --graph --decorate HEAD origin/main
```

Do not resolve divergence with force push or history rewriting unless explicitly
requested.

## New device

```bash
git clone https://github.com/ongkipro/dotfiles.git ~/dotfiles
cd ~/dotfiles
bash install.sh          # Linux
# or: bash install-macos.sh
ai-doctor
```

The installers preserve existing regular files as timestamped backups before
creating symlinks. Review the relevant installer before running it.

## Security boundary

Never track secrets, tokens, credentials, authentication state, customer data,
or private environment files. `security-check` is a guardrail, not a substitute
for reviewing the staged diff. If a credential is ever committed, revoke or
rotate it immediately; deleting it in a later commit is insufficient.

Background synchronization, if added later, should be pull-only. Commits and
pushes remain explicit user actions.
