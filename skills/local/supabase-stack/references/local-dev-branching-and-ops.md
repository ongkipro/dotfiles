# Local Development, Declarative Schemas, Pooling, and Operations

Workflow reference for Supabase CLI schema management, TypeScript type generation, Supavisor connection pooling, Postgres performance diagnostics (`supabase-postgres-best-practices`), and self-hosted Docker operations.

---

## 1. Declarative Schemas vs Imperative Migrations

Check whether `supabase/schemas/` exists or `supabase/config.toml` defines `schema_paths` before touching database DDL.

### Workflow A: Declarative Schemas (`supabase/schemas/*.sql`)
1. Edit the target entity files in `supabase/schemas/` (ordered lexicographically or via `schema_paths` in `supabase/config.toml` so parent tables precede foreign keys and views).
2. Stop local stack / diff against shadow DB to generate the timestamped migration:
   ```bash
   supabase db diff -f <descriptive_change_name>
   ```
3. Inspect the generated file in `supabase/migrations/<timestamp>_<name>.sql` line by line: verify `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`, policies, and destructive drop/recreate inference.
4. Apply and lint locally:
   ```bash
   supabase db reset
   supabase db advisors
   supabase test db
   ```

### Workflow B: Imperative Migrations
1. Iterate on local SQL using `supabase db query` (CLI v2.79.0+) or `psql` (or MCP `execute_sql`).
   - **Never iterate with MCP `apply_migration`**: every call appends a permanent migration history entry, breaking subsequent `supabase db diff` / `supabase db pull --local`.
2. When the local schema is ready, run `supabase db advisors` (CLI v2.81.3+ or MCP `get_advisors`), then capture the clean migration:
   ```bash
   supabase db pull <descriptive_change_name> --local --yes
   supabase migration list --local
   ```

### TypeScript Type Generation
Keep database types synchronized in CI and after every migration:
```bash
supabase gen types typescript --local > src/types/database.types.ts
```

---

## 2. Supavisor Connection Pooling & Drizzle / Prisma Coexistence

Supabase runs **Supavisor** in front of PostgreSQL. Choosing the wrong port or prepared-statement setting causes `prepared statement "..." already exists` or `does not exist` errors under concurrency.

| Connection Mode | Port | Behavior | When to Use | Required Driver Config |
|---|---|---|---|---|
| **Transaction Pooler** | `6543` | Returns backend connection after every transaction; does not persist session state or named prepared statements | Serverless functions (Vercel, Cloudflare Workers, Edge Functions), Next.js/Astro SSR routes | `postgres-js`: `{ prepare: false }` · `pg`: unnamed queries · Prisma: `?pgbouncer=true` |
| **Session Pooler** | `5432` (via pooler host) | Holds connection for the full client session; supports prepared statements and session variables | Persistent Node.js servers (VPS/Docker), IPv4 environments needing session features | Bound `max` pool size (`(CPU * 2) + spindles` across all replicas) |
| **Direct Connection** | `5432` (direct DB host, IPv6) | Connects straight to PostgreSQL without Supavisor | `supabase db push`, `drizzle-kit migrate`, `pg_dump`, long-running migrations | Migration CLI / admin scripts only |

### Drizzle ORM + Supabase Auth Coexistence Rules
When a project uses **Drizzle ORM** for queries alongside **Supabase Auth / Storage**:
1. Declare **one migration authority** (either `supabase/migrations/` or Drizzle migrations — never run `drizzle-kit push` against a database managed by `supabase db push`).
2. Never define tables in Drizzle that overwrite or drop `auth.*`, `storage.*`, `realtime.*`, or `supabase_migrations.*` schemas. Keep `schemaFilter: ['public']` in `drizzle.config.ts`.
3. Remember that querying via `DATABASE_URL` with the `postgres` role **bypasses RLS completely** unless the query runs inside a transaction that sets `SET LOCAL ROLE authenticated; SET LOCAL "request.jwt.claims" = ...` (or uses the Supabase Data API / RLS-aware wrapper).

---

## 3. Postgres Performance & Diagnostics Checklist (`supabase-postgres-best-practices`)

When reviewing slow queries, high CPU, lock waits, or schema changes on Supabase, apply these 8 prioritized checks:

1. **Query Performance (`CRITICAL`)**:
   - Index all foreign key columns, RLS predicate columns, and common `WHERE` / `ORDER BY` combinations.
   - Match index type to operator: **B-tree** (`=`, `<`, `>`, `IN`), **GIN** (`jsonb @>`, arrays, `tsvector`), **BRIN** (append-only time-series `created_at`), **HNSW** (`pgvector`).
   - Use **partial indexes** (`WHERE deleted_at IS NULL` or `WHERE status = 'pending'`) and **covering indexes** (`INCLUDE (customer_id, total_cents)`) for hot paths.
2. **Connection Management (`CRITICAL`)**:
   - Never open a fresh unpooled Postgres connection per serverless request; route through port `6543` with `prepare: false` and set an `idle_in_transaction_session_timeout` (e.g., `15s`).
3. **Security & RLS (`CRITICAL`)**:
   - Wrap `(select auth.uid())`, use private `SECURITY DEFINER` helpers with `SET search_path = ''`, and set `security_invoker = true` on views.
4. **Schema Design (`HIGH`)**:
   - Use `bigint generated always as identity` or time-ordered UUIDv7 for high-write primary keys (random UUIDv4 fragments large B-tree indexes).
   - Use unquoted ` lowercase_snake_case` identifiers everywhere; never create quoted `"camelCase"` tables or columns.
   - Use `timestamptz` (never `timestamp`), integer minor units (`bigint`) or bounded `numeric` for money (never `float`/`real`), and `text` (never `varchar(n)` unless a strict length check is required).
5. **Concurrency & Locking (`MEDIUM-HIGH`)**:
   - Keep transactions short; never call external HTTP APIs inside `BEGIN ... COMMIT`.
   - Acquire row locks in deterministic primary-key order to prevent deadlocks, and use `FOR UPDATE SKIP LOCKED` for worker claims.
6. **Data Access Patterns (`MEDIUM`)**:
   - Eliminate N+1 loops with `WHERE id = ANY($1::uuid[])` or single-round-trip joins.
   - Use `INSERT ... ON CONFLICT DO UPDATE` for atomic upserts and keyset cursor pagination (`WHERE (created_at, id) < ($1, $2)`) instead of large `OFFSET`.
7. **Monitoring, Logs Explorer (ClickHouse), & Schema Cache Diagnostics (`LOW-MEDIUM`)**:
   - Query `pg_stat_statements` (`ORDER BY total_exec_time DESC LIMIT 10`) to find top CPU consumers, inspect plans with `EXPLAIN (ANALYZE, BUFFERS)`, and check `pg_stat_user_tables` for dead-tuple bloat (`n_dead_tup`).
   - **PostgREST / `pg_graphql` Schema Cache Stale Errors (`PGRST204` / `PGRST205` / missing column or RPC)**: after DDL changes outside automatic event triggers, reload the API schema cache with:
     ```sql
     notify pgrst, 'reload schema';
     select graphql.rebuild_schema(); -- when pg_graphql is enabled
     ```
   - **`pg_restore` & Dump Hygiene**: when restoring dumps into Supabase, exclude platform-managed schemas (`--exclude-schema=auth --exclude-schema=storage --exclude-schema=realtime --exclude-schema=supabase_migrations --no-owner --no-privileges`) so internal triggers and role ownership are not corrupted, then run `ANALYZE` immediately after import.
   - **Logs Explorer (ClickHouse)**: when troubleshooting HTTP 4xx/5xx, Auth failures, Edge Function crashes, or Realtime drops, query the project logs (`edge_logs`, `postgres_logs`, `auth_logs`, `function_edge_logs`, `storage_logs`) by timestamp and status code before guessing.
8. **Documentation & Debugging Retrieval**:
   - Any Supabase docs page can be fetched as clean Markdown by appending `.md` to its URL (e.g., `https://supabase.com/docs/guides/monitoring-and-debugging.md`, `https://supabase.com/docs/guides/ai-tools/ai-skills.md`, or `https://supabase.com/changelog.md`). Always retrieve current docs before diagnosing unfamiliar PostgREST, Auth, Realtime, or Storage error codes.
