# Primary-source ledger

Last source check: 2026-10-02.

Use this ledger to retrieve facts, not as a frozen API snapshot. PostgreSQL `/current/`
resolved to PostgreSQL 18 (18.6) on the check date; implementation must open the documentation
for the project's actual server major version. Drizzle ORM/Kit APIs, config, SQL output,
drivers, and commands are volatile: recheck the installed package versions, installed
CLI help, current official docs, and relevant release notes before implementation.
Project scripts and configuration win.

## PostgreSQL — data definition and types

- [Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html) — checks,
  null behavior, unique/primary keys, FKs, and exclusion constraints.
- [Default values](https://www.postgresql.org/docs/current/ddl-default.html) and
  [generated columns](https://www.postgresql.org/docs/current/ddl-generated-columns.html).
- [Date/time types](https://www.postgresql.org/docs/current/datatype-datetime.html),
  [numeric types](https://www.postgresql.org/docs/current/datatype-numeric.html), and
  [JSON types](https://www.postgresql.org/docs/current/datatype-json.html).
- [ALTER TABLE](https://www.postgresql.org/docs/current/ddl-alter.html) — current-version
  data-definition behavior; pair with the SQL command reference for exact syntax/locks.
- [DDL privileges](https://www.postgresql.org/docs/current/ddl-priv.html) and
  [schemas/search path](https://www.postgresql.org/docs/current/ddl-schemas.html).

## PostgreSQL — transactions, locking, and tenancy

- [Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html) —
  snapshots, anomalies, serialization failures, and retry implications.
- [Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html) —
  table/row/page/advisory locks and deadlocks.
- [`INSERT`](https://www.postgresql.org/docs/current/sql-insert.html) and
  [`UPDATE`](https://www.postgresql.org/docs/current/sql-update.html) — atomic write and
  conflict/returning semantics for the target version.
- [Row security policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
  and [`CREATE POLICY`](https://www.postgresql.org/docs/current/sql-createpolicy.html) —
  default deny, roles, `USING`, `WITH CHECK`, permissive/restrictive behavior, and bypass.
- [System administration functions](https://www.postgresql.org/docs/current/functions-admin.html)
  — retrieve current `set_config`/`current_setting` semantics before using custom context.
- [`CREATE FUNCTION`](https://www.postgresql.org/docs/current/sql-createfunction.html)
  (default `PUBLIC` execute, safe `SECURITY DEFINER`) and
  [`CREATE VIEW`](https://www.postgresql.org/docs/current/sql-createview.html)
  (`security_invoker`, 15+).
- [Client connection defaults](https://www.postgresql.org/docs/current/runtime-config-client.html)
  — `statement_timeout`, `lock_timeout`, `idle_in_transaction_session_timeout`,
  `transaction_timeout` (17+).
- Secondary: [Supabase Postgres best practices](https://github.com/supabase/agent-skills/tree/main/skills/supabase-postgres-best-practices/references)
  — vendor rules (RLS initPlan wrapping, FK-index query); verify against the above.

## PostgreSQL — indexes and plans

- [Indexes](https://www.postgresql.org/docs/current/indexes.html) — index types,
  multicolumn/expression/partial indexes, ordering, index-only scans, and maintenance.
- [Examining index usage](https://www.postgresql.org/docs/current/indexes-examine.html).
- [Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) and
  [`EXPLAIN`](https://www.postgresql.org/docs/current/sql-explain.html) — plan evidence
  and the fact that `ANALYZE` executes the statement.
- [`LIMIT`/`OFFSET`](https://www.postgresql.org/docs/current/queries-limit.html) —
  deterministic ordering and offset cost. Keyset predicates derive from the query's
  documented ordering/comparison semantics rather than a universal helper.
- [`CREATE INDEX`](https://www.postgresql.org/docs/current/sql-createindex.html) and
  [`REINDEX`](https://www.postgresql.org/docs/current/sql-reindex.html) — retrieve exact
  concurrent-build restrictions and failure states for the target version.

## PostgreSQL — backup and recovery

- [Backup and restore overview](https://www.postgresql.org/docs/current/backup.html).
- [SQL dump](https://www.postgresql.org/docs/current/backup-dump.html) — logical dump,
  restore, caveats, and parallel modes.
- [File-system backup](https://www.postgresql.org/docs/current/backup-file.html) and
  [continuous archiving/PITR](https://www.postgresql.org/docs/current/continuous-archiving.html).
- [`pg_dump`](https://www.postgresql.org/docs/current/app-pgdump.html) and
  [`pg_restore`](https://www.postgresql.org/docs/current/app-pgrestore.html) — use the
  runbook and version-compatible binaries; never infer restore proof from dump success.

## Drizzle official documentation and repository

- [Drizzle overview](https://orm.drizzle.team/docs/overview) and
  [schema declaration](https://orm.drizzle.team/docs/sql-schema-declaration).
- [Indexes and constraints](https://orm.drizzle.team/docs/indexes-constraints) and
  [RLS](https://orm.drizzle.team/docs/rls). Compare DSL support with emitted PostgreSQL
  SQL; relations/query typing do not replace database constraints.
- [Drizzle Kit overview](https://orm.drizzle.team/docs/kit-overview),
  [`generate`](https://orm.drizzle.team/docs/drizzle-kit-generate), and
  [`migrate`](https://orm.drizzle.team/docs/drizzle-kit-migrate). Check exact installed
  CLI behavior; generation does not authorize applying SQL.
- [Transactions](https://orm.drizzle.team/docs/transactions),
  [select](https://orm.drizzle.team/docs/select), and
  [SQL template](https://orm.drizzle.team/docs/sql) — retrieve APIs for the installed
  driver/version and inspect emitted SQL/error behavior.
- [Connection overview](https://orm.drizzle.team/docs/connect-overview) — select only the
  installed driver/provider page; connection and batch/transaction support varies.
- [Official GitHub repository](https://github.com/drizzle-team/drizzle-orm) and
  [releases](https://github.com/drizzle-team/drizzle-orm/releases) — changelog, current
  package compatibility, regressions, and source when documentation is ambiguous.

### Drizzle release lines (checked 2026-10-02)

- npm dist-tags ([drizzle-orm](https://registry.npmjs.org/drizzle-orm),
  [drizzle-kit](https://registry.npmjs.org/drizzle-kit)): `latest` = `drizzle-orm`
  0.45.3 / `drizzle-kit` 0.31.11 (published 2026-09-21); `rc` = 1.0.0-rc.4; `beta` =
  1.0.0-beta.22. 1.0 is not a stable release yet. Re-run `npm view drizzle-orm dist-tags`.
- [Upgrade to v1](https://orm.drizzle.team/docs/upgrade-v1) — install with `@rc`; run
  `drizzle-kit up` to convert migrations to per-migration folders (journal file removed,
  DDL snapshots, commutativity checks across branches); `drizzle-kit drop` removed.
- [Relations v2](https://orm.drizzle.team/docs/relations-v2) and
  [v1 → v2 migration](https://orm.drizzle.team/docs/relations-v1-v2) — `defineRelations`
  passed as `drizzle(url, { relations })`; object filters (`where: { id: 1 }`, `AND`/`OR`/
  `NOT`/`RAW`) and `orderBy: { id: "asc" }` replace callbacks; `.through()` for
  many-to-many. RQB v2 exists only on the 1.0 line.
- [Drizzle Kit commands](https://orm.drizzle.team/docs/kit-overview): `generate`,
  `migrate`, `push`, `pull`, `export`, `check`, `up`, `studio`. Confirm with installed
  `npx drizzle-kit --help`. House policy: `push` never substitutes for a reviewed
  production migration.

## Pool/provider sources — only when installed

These are primary for their own products, not generic PostgreSQL mandates:

- [PgBouncer feature compatibility](https://www.pgbouncer.org/features.html) and
  [configuration](https://www.pgbouncer.org/config.html) — pooling mode and session
  feature compatibility.
- [Neon connection pooling](https://neon.com/docs/connect/connection-pooling) — use only
  for a verified Neon deployment and recheck its current driver/runtime guidance.

For another managed provider, proxy, or serverless driver, add its current official
connection, migration, limits, TLS, failover, backup, and restore documentation to the
implementation evidence. Do not extrapolate Neon or PgBouncer behavior to it.
