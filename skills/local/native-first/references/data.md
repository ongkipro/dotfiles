# Postgres + Drizzle + better-auth — native-first

House stack: PostgreSQL 16 + Drizzle + better-auth (Neon on Vercel; self-hosted PG via Coolify on VPS).

## Push the rule down to the database

The DB enforces invariants for **every** writer — app code, a migration, a psql session at 2am, a future service. App-level checks only cover the path you remembered.

| Reaching for… | Use instead |
|---|---|
| an app-level "is this unique?" check | `UNIQUE` constraint (+ `ON CONFLICT` to handle it) |
| an app-level "is this a valid status?" | `CHECK` / an enum type |
| a cleanup job for orphaned rows | `FOREIGN KEY … ON DELETE CASCADE` |
| a default in every insert call | `DEFAULT` on the column |
| a computed column recalculated in code | `GENERATED ALWAYS AS … STORED` |
| a cache in front of a slow query | **an index first.** `EXPLAIN ANALYZE` before you cache — you're usually one index away. |
| SELECT-then-INSERT (race!) | `INSERT … ON CONFLICT DO UPDATE` (atomic upsert) |
| a "soft delete" boolean everywhere | a partial index (`WHERE deleted_at IS NULL`) so it stays fast |
| row-level permission checks in app code | **RLS** when tenants share a table (TokoΦ pattern) |
| `SELECT *` then filter in JS | filter/aggregate in SQL. Don't ship 10k rows to count them. |

## Drizzle

- Types come from the schema: `typeof users.$inferSelect` / `$inferInsert`. Don't hand-write DTOs.
- `drizzle-kit generate` → **read the generated SQL** → `drizzle-kit migrate`. Never blind-apply.
- A migration that drops/renames a column or changes a type is **destructive** → explicit approval + a `pg_dump -Fc` first (see `AGENTS.md` → Approval gates).
- Relational queries (`db.query.x.findMany({ with: … })`) before hand-rolled joins; drop to SQL when it's genuinely faster.
- N+1 is the classic Drizzle bug: a `map()` with an `await db.select()` inside it. Use `with`, or one `inArray()`.
- Seeds must be **idempotent** — they re-run on redeploy (learned on TokoΦ/Coolify).

## better-auth

- **Never hand-roll sessions, password hashing, CSRF, or OAuth callbacks.** It ships all of it. A custom auth layer is the single highest-risk "abstraction nobody asked for".
- Use its schema/adapter and its Drizzle integration — don't shadow its tables with your own `users`.
- Extend via its plugins/hooks, not by forking the flow.
- Secrets in env, never committed. `.env.local` is gitignored — keep it that way.

## Validation

`drizzle-kit generate` and read the SQL → apply to a **local/dev** DB → query it. Never test a migration first on production.

Backup before anything destructive: `pg_dump -Fc` (TokoΦ already runs a daily one, keep-7).
