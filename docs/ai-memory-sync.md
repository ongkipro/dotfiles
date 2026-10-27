# AI Memory Synchronization

`~/dotfiles` is the tracked source of truth for shared AI policy, durable memory,
and owned skills across Linux and macOS.

## Sources

- `config/ai/CORE.md` — small shared policy; each CLI loads it with its own `adapters/<runtime>.md`, rendered to `context/<runtime>.md` by `ai-memory-link`.
- `config/ai/claude-home-memory/` — source for the minimal bootstrap copied into
  a device-local, read-only Claude `$HOME` memory directory; it must never
  expose the full project-memory tree or accept auto-memory writes.
- `config/ai/memory/` — durable cross-project facts loaded on demand.
- `config/ai/project-memory/` — project-specific decisions and gotchas.
- `skills/local/` — the only source for owned skills.

Repository identity and memory selection are separate concerns. Every Git
repository has a stable identity derived from its canonical remote or directory
name, while a project-memory document is loaded only when the manifest maps one.

Live configuration is connected to these sources with symlinks. Pulling a
reviewed Git change therefore updates the consumers immediately.

## Capture is local; canonical memory is reviewed

The shared system auto-loads policy but does not silently rewrite canonical
memory. Every CLI receives an instruction to capture a durable lesson after a
verified non-trivial fix when the lesson is not already preserved by repository
tests or documentation:

```bash
ai-learn capture --title TEXT --symptom TEXT --root-cause TEXT \
  --invariant TEXT --fix TEXT --check TEXT \
  --scope shared
```

Candidates stay device-local in `~/.config/ai-local/memory-inbox/`. They must be
short English summaries, never raw sessions, logs, credentials, customer data,
changing status, or speculative diagnoses. Review and promote an accepted
candidate into an existing canonical file:

```bash
ai-learn list
ai-learn show CANDIDATE.md
ai-learn promote CANDIDATE.md --target shared:workflow --yes
# or: --target project:tokophi
```

Promotion runs the memory reference checker and archives the candidate locally.
It never stages, commits, pushes, or grants permission for those Git actions.
`ai-doctor` reports pending candidates so the review queue cannot become
invisible.

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

Opening a shell already runs `dotsync autopull` in the background (main
branch, clean tree, at most every 6 hours): it fast-forwards, re-links every
runtime's context and executable commands (`ai-memory-link`), and reconciles
owned skills into every runtime (`skill-update`). An up-to-date run also retries
reconciliation, so an interrupted migration does not need another commit. To update now instead of waiting:

```bash
cd ~/dotfiles
dotsync pull             # ff-only pull, then context/command links + skill-update
ai-doctor                # links, contexts, skills, last autopull result
cat ~/.local/state/dotsync/last-result   # outcome of the last autopull
```

A plain `git pull --ff-only` skips the relink and skill sync; if you used it,
run `ai-memory-link && skill-update` afterwards. Pull only from a clean
worktree.

Command links in `~/.local/bin` follow `config/ai/runtime-commands.txt`.
Reconciliation installs newly listed executables and prunes dangling links that
resolve into this repository's `bin/`. For example, an existing device receives
`dotads-meta` on its first pull without reinstalling dotfiles. The running older
`dotsync` already calls the newly pulled `ai-memory-link`, which performs the
migration. Existing campaign workspaces and deployment state are unchanged.

Pulling transfers the `dotads-meta` helper, skill and guides; it does not export
an ad account or transfer private reports, media or credentials. The separate
DotAds application requires its own repository update. Installers and authorized
`dotads-meta setup`/`init` prepare the local Documents report root; a pull alone
does not install Meta's CLI or create populated account reports.

The complete manifest is validated before command links change. User files,
directories, and foreign command symlinks are preserved; a name collision reports
failure and leaves a warning in the autopull result. Inspect the collision,
then rerun `ai-memory-link && skill-update`. `ai-memory-link --check` remains
read-only and does not install or prune commands. This only reconciles links;
it does not install packages, read credentials, or call advertising APIs.

Release-specific cleanup lives in `CHANGELOG.md` under "Other devices". For
v2026.10.08 (impeccable removed), on each device:

```bash
ls ~/.codex/skills/impeccable 2>/dev/null && skill-update   # must print nothing after the sync
rm -rf ~/.impeccable                                         # leftover CLI cache outside the repo
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

Background synchronization stays pull-only. Candidate
capture may happen during an AI session, but canonical promotion, commits, and
pushes remain explicit reviewed actions.

## Reconciliation failures and hook bootstrap

A directory collision at a runtime context path preserves that directory and
returns nonzero after processing other runtimes. Autopull records incomplete
reconciliation rather than an up-to-date success. Inspect the conflicting path
and rerun `ai-memory-link && skill-update` after resolving ownership.

Fresh installers wire both Claude and Codex. Existing devices can explicitly run
`ai-hooks-install --runtime claude` and `ai-hooks-install --runtime codex`, then
check each runtime with `--check`. Codex requires interactive `/hooks` trust for
the exact definitions; file wiring alone is not execution evidence.

The canonical Git guard launcher emits an explicit deny decision when its
script is missing, not executable, cannot start, or exits unsuccessfully.
Failed guard output is discarded before the deny decision is emitted.
`ai-hooks-install` migrates the known older
fail-open launcher while preserving local timeouts; `--check` reports that
launcher as unsafe without writing. Arbitrary customized launchers still require
review; a wiring PASS is not a semantic proof of every custom shell command.
After a Codex launcher migration the exact definition has changed, so interactive
`/hooks` trust must be reviewed again before claiming runtime activation.

Known legacy-command detection scans every hook group for the event. A safe
first group cannot hide another exact legacy launcher later in the list;
migration preserves those groups' matchers, timeouts, and unrelated entries.
