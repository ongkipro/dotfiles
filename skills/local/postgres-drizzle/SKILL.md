---
name: postgres-drizzle
description: >-
  Engineer plain PostgreSQL databases with Drizzle: schemas, constraints, migrations,
  expand-contract rollouts, transactions, isolation, locking, tenant boundaries and
  RLS, indexes, query plans, pagination, data types, pooling, and generated SQL review.
  Use for PostgreSQL/Drizzle schema changes, migration safety, query performance,
  concurrency bugs, or database invariants. Retrieval-first for version-sensitive
  Drizzle APIs and commands. This skill does not own Supabase services, generic API
  design, or application authentication.
---

# PostgreSQL + Drizzle Engineering

Make each database invariant explicit and enforce it at the lowest correct layer.
A TypeScript type is not a database guarantee; every writer must meet the same
constraints. Treat generated SQL, migrations, connection configuration, and RLS
policies as privileged code.

## Trigger and scope

Use this skill for plain PostgreSQL and Drizzle schema/query engineering, including:

- tables, keys, constraints, relationships, data types, defaults, and generated values;
- migration generation/review, expand-contract rollout, backfills, and drift diagnosis;
- transaction boundaries, isolation anomalies, locks, retries, and concurrent writes;
- tenant keys, plain PostgreSQL RLS, indexes, query plans, and pagination;
- driver/pool/serverless connection behavior and database-level verification.

Do not use it as the owner of Supabase Auth, Storage, Realtime, Edge Functions, its
platform CLI lifecycle, or `auth.uid()` conventions; use `supabase-stack`. Do not
redesign HTTP/GraphQL contracts or implement authentication here.

## Inspect first

Before proposing or running a command:

1. Read repository instructions, package scripts, lockfile, installed Drizzle packages,
   `drizzle.config.*`, schema exports, migration journal/snapshots, and all generated SQL.
2. Trace every affected query and writer, including jobs, admin tools, imports, auth
   adapters, seeds, tests, and direct SQL. Identify who owns the transaction.
3. Identify the PostgreSQL server version, extensions, roles, schema/search path,
   deployment topology, driver, connection mode, pool/proxy, and transaction-pooling
   restrictions. Project configuration and installed versions win.
4. Determine the migration authority, target environment, deploy order, compatibility
   window, data volume/skew, acceptable lock time, and recovery owner.
5. Write the invariant and failure behavior in plain language. State null semantics,
   tenant scope, lifecycle, conflict policy, and referential actions.
6. Retrieve current Drizzle documentation and installed CLI help before using a
   version-sensitive API or command. Never transpose a remembered example across
   drivers or Drizzle versions.

If the target database or environment cannot be proven, stop before execution. Never
infer production safety from a familiar hostname, an environment variable name, or a
successful connection.

## Invariant worksheet

For every changed relation, answer only the applicable rows:

| Concern | Required decision | Prefer database enforcement |
|---|---|---|
| Identity | stable key, generation owner, mutability | `PRIMARY KEY`, identity/default |
| Uniqueness | columns, tenant scope, case/null semantics | unique constraint/index |
| Domain | valid range/set/shape | type, `NOT NULL`, `CHECK`, FK |
| Reference | required/optional, delete/update behavior | FK with explicit actions |
| Lifecycle | legal states and timestamps | checks; transaction for transitions |
| Tenant | tenant key propagation and access role | composite key/FK; RLS where required |
| Concurrency | competing writers and winner policy | atomic DML, lock, or isolation level |
| Derived data | source of truth and refresh rule | generated value/view only when suitable |

Do not duplicate an invariant in application code as if the application check prevents
races. Application validation may improve error messages; the constraint remains the
authority. Read [Data design](references/data-design.md) for concrete choices.

## Implementation workflow

### 1. Model the contract

Define the invariant, current data assumptions, new read/write contract, error behavior,
and compatibility window. Inspect live-like cardinality and null/duplicate/orphan cases
without exposing sensitive row data. Decide constraint names deliberately when callers
or operations need stable diagnostics.

Keep the Drizzle schema as the intended model and checked-in migration SQL as history.
Do not edit already-applied migration history unless the repository's explicit recovery
procedure requires it. Do not use schema push as a substitute for a reviewed production
migration.

### 2. Choose safe PostgreSQL semantics

Use PostgreSQL constraints before triggers or application-only enforcement. Make FK
actions explicit. Use a lookup table when values carry mutable business data; use a
closed type/check only when deployment coupling is acceptable. Choose types by meaning,
not transport shape: `timestamptz` for instants, `date` for calendar dates, integer minor
units or an intentionally bounded `numeric` for money, and `jsonb` only for genuinely
variable structure.

Tenant isolation is a trust boundary, not a query-filter convention. Propagate tenant
identity through keys and FKs. If plain PostgreSQL RLS is required, model roles, policy
coverage, owner/bypass behavior, session context, pooling behavior, and background jobs
explicitly. Read [Trust boundaries and RLS](references/trust-boundaries.md).

### 3. Plan the migration before generating it

Classify each operation as additive, validating, backfill, cutover, cleanup, or
potentially destructive. For a compatibility window, use expand-contract:

1. add a nullable/new structure that old and new code can tolerate;
2. deploy compatible writes (dual-write only when its reconciliation rule is explicit);
3. backfill in bounded, restartable batches with observable progress;
4. validate data and constraints;
5. switch reads and stop old writes;
6. enforce the final constraint;
7. remove the old path only after all callers and queued work have cut over.

A rename, drop, narrowing cast, `NOT NULL`, uniqueness change, large-table default,
index build, or FK validation may destroy data, rewrite rows, scan a table, or block
traffic. Estimate its lock/scan behavior from the actual PostgreSQL version and table
shape. Never blind-apply a migration or destructive command. Read
[Migration and operations](references/migrations-and-operations.md).

### 4. Generate, then inspect all SQL

Use the repository's installed package manager and scripts. When no project command
exists, retrieve the exact command from the installed Drizzle version and current
official docs. Generation is not approval.

Review the complete SQL in execution order. Account for every statement and inspect:

- unexpected drops, renames inferred as drop/add, casts, truncation, or default changes;
- null/duplicate/orphan failures and FK/check/unique semantics;
- transaction boundaries and statements that cannot use the intended transaction;
- table/index lock mode, scan/rewrite cost, index build strategy, and timeout policy;
- extension, schema, role, ownership, search-path, and privilege assumptions;
- deterministic backfills, retry/resume behavior, and old/new application compatibility.

If SQL differs from the plan, fix the schema or migration source and regenerate; do not
wave through surprising SQL because it was generated.

### 5. Engineer queries and concurrency

Keep a transaction as short as the invariant permits and never include remote I/O or
unbounded user think time. PostgreSQL defaults to Read Committed; choose stronger
isolation only for a stated anomaly. A uniqueness conflict, serialization failure, and
deadlock are different errors. Retry only the entire safe transaction, with bounded
attempts, and only when its external effects are idempotent or outside the retry loop.

Prefer one atomic statement (`INSERT ... ON CONFLICT`, guarded `UPDATE`, or equivalent)
over select-then-write. Use row/advisory locks only with documented lock scope, stable
acquisition order, and failure/timeout behavior. Read
[Queries and concurrency](references/queries-and-concurrency.md).

Design indexes from real predicates, joins, ordering, tenant prefix, cardinality, and
write cost. Verify representative plans rather than assuming an index will be chosen.
Use keyset pagination for large or frequently changing ordered sets; include a unique,
stable tie-breaker and define forward/backward cursor semantics. Offset pagination is
acceptable only when its drift and scan cost fit the contract.

### 6. Match connection behavior to the runtime

Reuse the project's established driver and connection owner. Bound concurrency across
all replicas/functions, not per process in isolation. A serverless function must not
create an unbounded fresh database connection per request. Confirm whether the provider
uses direct, session-pooled, or transaction-pooled connections and whether prepared
statements, session settings, temp objects, advisory locks, LISTEN/NOTIFY, and RLS
context survive that mode. Never leak tenant/session state across pooled requests; use
transaction-local context where the chosen design supports it and verify reset behavior.

## Smallest safe verification evidence

Run the narrowest flow that can fail for the changed contract, never first on production:

1. Generate through the project script; inspect and account for the complete SQL diff.
2. Confirm the connection target is an approved disposable/local or isolated dev database.
3. Apply the migration using the project's established runner to both (a) a fresh schema
   and, for upgrades, (b) a representative pre-change schema/data fixture.
4. Query catalog/schema state and exercise observable invariants: one valid write plus
   failing null/check/unique/FK/tenant cases that matter. Verify referential actions.
5. Exercise the affected application query or repository call. For concurrency changes,
   run two real transactions in the intended interleaving and observe the winner/error.
6. For query changes, capture a representative `EXPLAIN`; use `ANALYZE` only where
   executing the statement is safe. Check returned rows as well as plan shape.
7. For pool/RLS changes, use two sequential borrowers/transactions with different tenant
   contexts and prove no state or rows cross the boundary.

Report the exact command/script, explicit non-production target, generated SQL reviewed,
assertions/interleaving exercised, and observed result. A typecheck, generated file, or
successful migration command alone is not proof of the database contract.

Backup/restore is an operations handoff: identify the owner and recovery objective, and
require evidence that the relevant backup can be restored into an isolated target and
queried. The existence of a dump file, snapshot, or provider badge is not restore proof.
Never run a restore, failover, drop, truncate, or destructive rollback without the
repository's approval and runbook.

## Ownership and handoffs

- `postgres-drizzle`: plain PostgreSQL/Drizzle invariants, SQL, migrations, data access,
  transactions, RLS mechanics, query plans, and connection semantics.
- `full-stack-development`: end-to-end routing and evidence gates; this skill remains the
  database specialist and does not duplicate framework, API, auth, or CI implementation.
- `supabase-stack`: Supabase platform lifecycle, Auth/Storage/Realtime, service roles,
  Supabase CLI migrations, and platform-specific policy helpers. This skill may advise
  underlying SQL invariants but must not create a second migration authority.
- `better-auth-security`: Better Auth schema/adapter lifecycle and auth controls. Do not
  shadow or casually alter auth-owned tables; coordinate required DB changes there.
- `application-security`: cross-stack threat model, credential/role hardening, injection,
  data exposure, and security review. PostgreSQL RLS mechanics remain here.
- `testing-engineering`: automated behavioral/regression test strategy. This skill owns
  the smallest database evidence needed for the specific change.
- `observability-engineering`: production database telemetry, alerting, SLOs, and rollout
  signals. Provide query/migration events and failure semantics for instrumentation.
- `github-actions`: CI workflow implementation; provide safe DB checks, never credentials.
- `development-spec-suite`: durable data/IAM/operations specifications when multiple
  domains need traceability. `prd-taskbreaker` owns feature requirements and tasking.
- `openapi-spec`: API contracts. `native-first`: dependency/platform capability check.
- Framework and platform owners (`nextjs-development`, `astro-development`,
  `cloudflare`, `workers-best-practices`) own request/runtime integration,
  including current Cloudflare Hyperdrive binding and connection guidance.

## Anti-patterns

- Generate and immediately migrate; use push or introspection as production approval.
- Encode uniqueness, tenant scope, or referential integrity only in TypeScript.
- Select-then-insert/update without an atomic conflict or locking strategy.
- Add `NOT NULL`, uniqueness, FK, type casts, or indexes to large tables without proving
  existing data and lock/scan behavior.
- Catch every database error as “not found” or retry every transaction error.
- Hold transactions across network calls, queues, file work, or user interaction.
- Add indexes by column folklore, use `SELECT *`, or paginate mutable data by offset by
  default; ignore write amplification and plan evidence.
- Store money in floating point, instants in timezone-less timestamps, or query-critical
  relational fields in unvalidated JSON.
- Treat an application tenant filter as RLS, assume table owners are restricted, or put
  request tenant state in a pooled session without proving reset behavior.
- Mix Drizzle migrations, provider push, and manual SQL without one declared authority.
- Treat backup creation as recovery proof or production as the first migration test.

Use [Primary-source ledger](references/source-ledger.md) to refresh volatile claims.
