# Stack-Aware Project Bootstrap

`project-init` creates a minimal framework-native project, adds the shared
repository engineering contract, initializes `.delivery`, and runs the
repository's native checks through `project-check`. It also retains its legacy
clone and contract-only invocations.

## Supported profiles

| Stack | Native generator | Database | Authentication | Deploy target | `--no-install` |
|---|---|---|---|---|---|
| `nextjs` | `create-next-app@latest` | `none`, `postgres` | `none`, `better-auth` when PostgreSQL is selected | `none`, `coolify` | Yes |
| `astro` | `create-astro@latest` minimal template | `none` | `none` | `none`, `coolify` | Yes |
| `cloudflare-worker` | `create-cloudflare@latest` TypeScript hello-world | `none` | `none` | `none`, `cloudflare` | No |
| `existing-repository` | None | `none` | `none` | `none` | Yes |

`npm` and `pnpm` are supported through project-local package execution. The
selected database, authentication, and deployment values are architecture
decisions. The bootstrap does not create schema, credentials, remote services,
or deployment configuration. Generated documents explicitly retain those items
as unresolved, requirement-linked implementation work.

## Examples

```bash
project-init my-app \
  --stack nextjs \
  --database postgres \
  --auth better-auth \
  --deploy coolify

project-init docs-site --stack astro --package-manager pnpm

project-init edge-api \
  --stack cloudflare-worker \
  --deploy cloudflare

project-init --repo "$HOME/Projects/existing app" \
  --stack existing-repository
```

Promote accepted planning artifacts while creating a new repository, or into an
explicit existing Git worktree:

```bash
project-init my-app \
  --stack astro \
  --from-docs "$HOME/Documents/work/prd/my-app"

project-init --repo "$HOME/Projects/existing app" \
  --stack existing-repository \
  --from-docs "$HOME/Documents/work/prd/existing app"
```

`--from-docs` copies the accepted artifacts and never deletes the staging
directory. After promotion, the repository copies are canonical. The
`~/Documents/work/prd/<slug>/` copy remains a non-authoritative planning
snapshot.

Inspect a fully resolved plan without creating directories, installing packages,
or changing an existing repository:

```bash
project-init my-app \
  --stack nextjs \
  --database postgres \
  --auth better-auth \
  --deploy coolify \
  --plan
```

When `--from-docs` is present, the plan also prints every resolved source and
destination path. Suite plans additionally report the generated root `PRD.md`
index to `docs/spec/02-PRD.md`. Planning validates the stage and conflicts but
does not create the project directory, copy files, initialize `.delivery`, or
modify the source. Paths containing spaces are preserved as single paths.

## Generated contract

After native scaffolding succeeds, missing contract files are created at the
repository root:

```text
README.md
AGENTS.md
PRD.md        # suite packs use an index to docs/spec/02-PRD.md
TASKS.md      # canonical repository execution queue
STATUS.md
DECISIONS.md
RELEASE.md
OBSERVABILITY.md
BUILD-LOG.md
ARCHITECTURE.md
.delivery/
```

Files that already exist are preserved byte-for-byte. Framework-owned source
layout remains untouched. `existing-repository` requires an explicit `--repo`
path to a Git worktree. Without `--from-docs`, it adds only missing contract
files.

## Planning artifact promotion

A standalone planning stage accepts at least one of these artifacts:

```text
PRD.md
PLAN.md
TASKS.md
docs/adr/ADR-NNNN-<slug>.md
```

Root documents retain those paths in the repository, and ADRs retain their
`docs/adr/` paths. `PLAN.md` is optional. A stage with a root
`CONTEXT-RECORD.md` is instead treated as a development-spec-suite pack and
must also contain a regular root `02-PRD.md`. Specification artifacts retain
their relative layout beneath `docs/spec/`, including
`docs/spec/CONTEXT-RECORD.md` and the canonical
`docs/spec/02-PRD.md`. Staged root `TASKS.md` and `PLAN.md` are promoted only to
the repository root; no duplicate execution documents are created under
`docs/spec/`.

For a suite pack, `project-init` creates root `PRD.md` as a small index to
`docs/spec/02-PRD.md`; it never generates a competing requirements template.
An existing byte-equivalent index is idempotent. Any other existing root
`PRD.md` is a divergent conflict and rejects promotion before the pack or
repository contract is written. Root `TASKS.md` remains the sole canonical
execution queue. When the suite pack contains root `TASKS.md` or `PLAN.md`, each
is promoted to the repository root; otherwise the normal repository queue is
generated there.

The stage must be a real directory, not a symlink. Promotion does not follow
symlinked files or directories. Standalone stages reject files outside the
accepted layout, and every stage must contain at least one accepted regular
file. Before copying, all destination paths are checked together: identical
files are preserved, while any divergent file, symlink, or non-file destination
rejects promotion without overwriting it. Imported standalone documents,
accepted or generated root `TASKS.md`, and the generated suite PRD index are
therefore preserved when the remaining repository contract is rendered.

## Safety and evidence

- All combinations are validated before generation.
- A `--from-docs` stage and its supported layout are validated before a native
  generator can mutate the project tree.
- A new stack refuses an existing destination, including an empty directory.
- Generators run with Git initialization, deployment, browser opening, and AI
  file generation disabled where the native CLI exposes those controls.
- New projects receive a local Git repository after generation, but no commit,
  remote, branch push, or release is created.
- No `.env`, secret, database, account, production resource, or remote deployment
  is created.
- A failed new-project generator has its isolated partial destination removed.
  A verification failure retains the project and its evidence for diagnosis.
- `project-check --full` runs project-declared scripts such as typecheck, lint,
  test, and build. Passing file generation alone never yields verified status.
- `--no-install` records `UNVERIFIED` and a `BLOCKED` run, then exits `2`.
  A normal verification failure records `FAIL` and exits `1`.
- `.delivery/runs/` records native generation and initial verification results;
  `STATUS.md` remains the workflow-state authority.
- Bootstrap delivery runs capture the generated worktree as an accepted baseline
  and check that verification did not silently add files outside it. Subsequent
  R1-R4 tasks must declare their own narrower change surfaces as documented in
  [Task Change Boundary](task-change-boundary.md).

## Adding a profile

Keep profile logic in `bin/project-init`; do not introduce a registry framework
until simple cases become unmaintainable. Before adding a profile:

1. Prove its official generator flags and non-deploy behavior from executable
   help output or primary vendor documentation.
2. Define the smallest native source baseline and exact `project-check` path.
3. Reject unsupported capability combinations before filesystem mutation.
4. Add a fake-generator regression case covering planning, failure cleanup,
   generated contracts, and verification evidence.
5. Run `project-init-test` and `ai-doctor --self-test`.

Legacy commands remain supported:

```bash
project-init repository-name category "Description"
project-init --repo /path/to/repository category "Description"
project-init --gen repository-name
project-init --list
project-init --sync
project-init --bootstrap-existing
project-init --bootstrap-existing --apply
```

`--list` discovers Git worktrees at any depth below both project roots and
deduplicates physical paths. `--sync` preserves dirty, detached, untracked, and
locally-ahead/diverged repositories; it fetches and fast-forwards only a clean
behind branch with an upstream. `--bootstrap-existing` is a read-only inventory
by default. `--apply` adds missing contracts only to clean repositories and
runs each repository's native verification; dirty repositories are reported
and skipped without stash/reset/clean behavior.
