# Migration and operations safety

A migration is a privileged production program. Generation creates a candidate; review,
rehearsal, approval, rollout evidence, and recovery readiness make it deployable.

## Declare one authority

Identify one migration history and runner. Drizzle-generated migrations, provider schema
push, ORM push, and hand-run SQL must not compete. Manual emergency changes require the
repository's reconciliation procedure so declared schema, migration history, and actual
catalog do not silently diverge.

Inspect the installed Drizzle/Kit versions, config, migration journal/snapshots, project
scripts, and current official documentation. Commands and configuration keys are
volatile. Do not copy a command from this reference or another repository.

## Change classification

| Class | Examples | Required proof |
|---|---|---|
| Additive | nullable column, new table | old/new app compatibility, lock scope |
| Data | backfill, dedupe, transform | bounded/resumable, counts, invalid rows |
| Validating | check/FK/unique/not-null | preflight data, validation/lock behavior |
| Cutover | reads/writes move | all callers and queued work accounted for |
| Cleanup | old column/index/table removed | no readers/writers, approval, recovery |
| Operational | index/extension/role/policy | privileges, transaction/lock constraints |

“Additive” does not mean free: large catalogs, volatile defaults, FK validation, or index
builds can still scan, rewrite, or block. Determine behavior from the target PostgreSQL
version and actual relation size/activity.

## Expand-contract details

### Columns and types

For a new required value, add a compatible nullable structure, deploy writes, backfill,
validate, then enforce. For type changes, prefer a new column when casts are lossy,
rewrite-heavy, or old/new code must coexist. Compare values before switching reads.

For rename semantics, a direct rename is safe only when every deployed caller changes
atomically and no queued/long-running work uses the old name. Otherwise use a new name
and a bounded compatibility period. Avoid indefinite dual writes: define authority,
conflict resolution, reconciliation query, and removal gate.

### Constraints

Preflight nulls, duplicates, orphans, range violations, and tenant mismatches. PostgreSQL
can add some check/FK constraints without validating historical rows and validate later;
exact syntax and lock behavior must be retrieved for the target version. A partially
validated invariant must be visible in the rollout plan.

Building a supporting index separately/concurrently and attaching a constraint can
reduce blocking for some unique/primary-key changes. It has transaction and eligibility
constraints; do not generalize it without current official documentation and rehearsal.

### Indexes

Estimate table size, write rate, build duration, disk headroom, replica impact, and lock
behavior. PostgreSQL concurrent index operations have special transaction rules and can
leave invalid indexes after failure. Plan detection and cleanup; never automatically
repeat or drop one on a target that has not been confirmed.

### Backfills

Use deterministic ordering and bounded batches. Make progress durable and reruns safe.
Separate semantic transformation from final constraint enforcement. Observe rows
visited/changed, invalid/skipped counts, latency, lock waits, replica lag, and error
classes without logging sensitive values. Avoid one transaction spanning the whole data
set unless proven safe.

## Generated SQL review gate

Read the entire generated file and any custom SQL. For every statement record:

- intended catalog/data effect and whether it is reversible;
- expected lock, scan/rewrite, WAL, disk, and replication impact;
- transaction eligibility and failure point;
- privileges, extension/schema/search-path assumptions;
- compatibility with every deployed reader/writer;
- preflight query, postcondition query, and abort/continue decision.

Reject unexplained SQL. A generator guessing drop/add for a rename is not an acceptable
migration. Do not edit an already-applied historical migration to conceal drift.

## Rehearsal and rollout

Minimum rehearsal uses an isolated target and proves:

1. fresh schema creation;
2. upgrade from the actual previous migration state with representative boundary data;
3. invalid existing data fails where expected;
4. application reads/writes work during each compatibility phase;
5. postconditions and catalog state match the intended schema;
6. retry/resume behavior after an induced backfill or deployment interruption, when
   relevant;
7. rollback/roll-forward choice and restore path are documented by the owning runbook.

Production execution requires the repository's approval gate, explicit target identity,
current backup/restore evidence, monitoring owner, abort thresholds, and deploy order.
This skill does not authorize the run.

## Backup and restore handoff

Coordinate with the project's operations owner. Match the mechanism to recovery-point
and recovery-time objectives: logical dump, physical/base backup, WAL/PITR, or managed
snapshot are not interchangeable. Include globals/roles, extensions, large objects,
ownership/grants, encryption/key access, retention, and version compatibility as
applicable.

A backup is verified only by restoring it to an isolated target, checking restore logs,
querying critical catalog/data invariants, and recording the restore duration and
recovery point. Never overwrite an existing environment to “test restore.” Never expose
production rows in an insecure lower environment.

## Pools and serverless deployment

Compute a connection budget across application replicas/functions, workers/jobs,
migrations, observability, maintenance, and reserved operator access. Configure bounded
pool size, acquisition timeout, statement/transaction timeouts, and shutdown behavior
using the installed driver/provider guidance.

Confirm whether the endpoint is direct, session-pooled, or transaction-pooled. Test any
feature needing session affinity. Run migrations through the provider-supported path;
do not assume the application pool/proxy supports migration locks, DDL, or long-running
operations. Credential rotation and TLS verification are security/operations decisions,
not reasons to embed secrets in Drizzle configuration.

## Never automate blindly

Never place an unreviewed migration, schema push, destructive rollback, drop/truncate,
restore, or “fix drift” command behind a generic CI/deploy step. Give `github-actions` a
read-only generation/inspection contract or an isolated ephemeral database check; CI
must not infer production authorization from a passing build.
