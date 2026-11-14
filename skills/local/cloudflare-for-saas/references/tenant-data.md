# Where each tenant's data lives

Verified 2026-11-13 (Cloudflare docs, workerd discussion #3564, local workerd probe with wrangler
4.155.0). Re-check limits: [D1 limits](https://developers.cloudflare.com/d1/platform/limits/),
[DO limits](https://developers.cloudflare.com/durable-objects/platform/limits/),
[API limits](https://developers.cloudflare.com/fundamentals/api/reference/limits/).

| Option | New tenant without redeploy? | Fit |
|---|---|---|
| **One D1 per tenant via native bindings** | **No.** D1 is reached through a static binding; a new binding means re-uploading the Worker (workerd discussion #3564, no ETA). About 5,000 bindings per script. The D1 REST API is "best suited for administrative use" (1,200 requests / 5 min per token). | Small, slowly changing tenant set with a deploy per tenant; or Workers for Platforms. |
| **Shared D1 + `tenant_id`** | Yes | Simplest. One 10 GB single-threaded database for everyone; every query needs the tenant predicate, enforced in one data layer plus tests. |
| **Sharded D1** | Yes, within the bound shards | Shard map in a control table; shared-D1 rules per shard. |
| **SQLite Durable Object per tenant** (`getByName(tenantId)`) | **Yes** — created on first use | Physical isolation, 10 GB per tenant, 30-day PITR, `locationHint` (e.g. `apac-se`). Code runs in the object (RPC). Billed per request, duration and storage. |

Keep the host → tenant map in an authoritative store (a control-plane D1) — never KV, which is
eventually consistent (60 s and more).

## A `D1Database`-shaped adapter over a SQLite Durable Object

To keep existing D1 call sites, these semantics hold (D1 emulator source + local probe; re-check in
production):

- `meta.changes` = delta of `SELECT total_changes()` around the statement (**includes trigger
  writes**); not cursor `rowsWritten` (adds index writes), not `changes()` (excludes triggers).
- `meta.last_row_id` = `last_insert_rowid()`.
- `batch()` = one `ctx.storage.transactionSync` (rolls back on throw). SQL `BEGIN`/`SAVEPOINT` are
  refused.
- `PRAGMA user_version` → `SQLITE_AUTH`; `PRAGMA foreign_keys` toggles are no-ops inside a
  transaction. Trigger bodies, `RETURNING`, `?1` reuse and `AUTOINCREMENT` work.
- Constraint errors read `UNIQUE constraint failed: <t>.<c>: SQLITE_CONSTRAINT (extended: SQLITE_CONSTRAINT_UNIQUE)`.

## Migrations per tenant

Cloudflare's docs show constructor `blockConcurrencyWhile` for initialisation. For a multi-tenant
design with PITR recovery, prefer an explicit migration RPC instead (policy): `blockConcurrencyWhile`
has a 30 s limit, an escaping throw resets the object, and a restore would re-run constructor work. The Worker stores the PITR bookmark in the control
plane, then calls an explicit migrate RPC; a failing tenant goes to a `recovery` state on its own.
Schema changes are expand-then-contract, with the RPC carrying a protocol version across one
release.

## Other shared resources

R2: one bucket, keys `t/<tenantId>/…`. KV: keys `t:<tenantId>:…` through one wrapper. Edge cache:
key carries tenant id, a per-tenant cache version and the host; never read a cache before the tenant
is resolved.
