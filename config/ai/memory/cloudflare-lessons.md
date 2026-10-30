# Memory: Cloudflare platform lessons

> Split from [development-lessons.md](development-lessons.md) for the router budget. Workers, D1, KV and caching lessons; each states symptom, root cause, durable invariant, fix, and regression check. Re-check limits and prices against developers.cloudflare.com before relying on them; the repository stays authoritative.

## Lesson: Workers Free: D1 hard-fails account-wide over the daily row allowance

### Symptom
Every D1 query on every Worker in a Free account errors ('exceeded D1's free tier daily row read limit') until 00:00 UTC.

### Root cause
Since 2026-09-01 D1 enforces Free daily allowances (5M rows read, 100k rows written) per account; per-request writes such as rate-limit upserts or session rows across several Workers share the same pool.

### Durable invariant
On a multi-Worker Free account, no request path adds an uncounted D1 or KV write; full scans are found before they ship.

### Fix
Count writes per request type and multiply by traffic; move hot-path writes off the request or behind a WAF rule; add indexes; or move the account to Workers Paid.

### Regression check
D1 dashboard daily rows read/written over 30 days against the allowance; wrangler d1 insights sorted by rows read; EXPLAIN QUERY PLAN shows no SCAN on hot queries. Source: https://developers.cloudflare.com/changelog/product/d1/

> Promoted from a reviewed local candidate on 2026-10-29.


---


## Lesson: Workers Cache hits skip the Worker, so server-side per-request work stops

### Symptom
After enabling Workers Cache, cookies the Worker or middleware sets on page views (ad click-id capture, sessions), request logs and counters stop for cached pages.

### Root cause
A Workers Cache hit returns the stored response without executing the Worker; only misses and bypasses run code. The hand-rolled Cache API pattern still runs the Worker on a hit.

### Durable invariant
Before enabling Workers Cache, every per-request side effect on cacheable routes is moved client-side or its route is excluded.

### Fix
Inventory middleware side effects on cacheable routes; move attribution capture to the client or exclude the routes; accept that hits and static assets become billable requests.

### Regression check
With caching on, load a cached page with ?gclid=test in a fresh browser and confirm the attribution cookie is still set. Source: https://developers.cloudflare.com/workers/cache/

> Promoted from a reviewed local candidate on 2026-10-29.


---


## Lesson: Derive a grouping key with a VIRTUAL generated column instead of editing write paths

### Symptom
A report needs to group or filter by a value derived from an existing column (e.g. last URL path segment), and the obvious fix edits every insert path, including a protected checkout flow.

### Root cause
Storing the derived value means touching every writer and backfilling; SQLite cannot cheaply compute it inside an ad hoc GROUP BY.

### Durable invariant
A derived, read-only grouping key is computed by the database, so writers stay untouched and old rows are covered.

### Fix
ALTER TABLE ... ADD COLUMN x TEXT GENERATED ALWAYS AS (expr) VIRTUAL; CREATE INDEX on (x, created_at); PRAGMA optimize. D1 allows only VIRTUAL via ALTER TABLE.

### Regression check
SQLite run 2026-10-29: '/Promo-A/'->'promo-a', '/produk/kopi'->'kopi', '/'->'beranda', NULL->NULL, EXPLAIN QUERY PLAN uses the index. D1 still to be proven on local D1. Docs: https://developers.cloudflare.com/d1/reference/generated-columns/

> Promoted from a reviewed local candidate on 2026-10-29.
