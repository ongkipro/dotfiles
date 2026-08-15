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

## Generated contract

After native scaffolding succeeds, missing contract files are created:

```text
AGENTS.md
PRD.md
TASKS.md
STATUS.md
RELEASE.md
OBSERVABILITY.md
BUILD-LOG.md
docs/architecture.md
.delivery/
```

Files that already exist are preserved byte-for-byte. Framework-owned source
layout remains untouched. `existing-repository` requires an explicit `--repo`
path to a Git worktree and adds only missing contract files.

## Safety and evidence

- All combinations are validated before generation.
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
```
