# Cloudflare Workers — native-first

Workers run on **Web standards**, not Node. Half of npm is either unnecessary or won't run. This is where over-installing hurts most: every KB is startup latency on every request.

> Deep docs already exist locally: skill `cloudflare` (319 refs), `wrangler` (full CLI), `workers-best-practices`, `durable-objects`. This file is only the "do I need a package?" filter.

## Don't install it; the runtime already has it

| Reaching for… | Use instead |
|---|---|
| express, koa | `fetch(request, env, ctx)` + `URL`/`URLPattern`. Add **Hono** only when you genuinely need routing + middleware — not for 3 routes. |
| axios | `fetch` (it's the platform) |
| body-parser | `await request.json()` / `.formData()` / `.text()` |
| cors middleware | set the `Access-Control-*` headers yourself (~5 lines) |
| jsonwebtoken | `crypto.subtle` (HMAC/ECDSA verify) — the npm one often won't run here |
| uuid | `crypto.randomUUID()` |
| a cache library | `caches.default` (`cache.match` / `cache.put`), or the `cf: { cacheTtl }` fetch option |
| an in-memory rate limiter | **Durable Object** (per-key counter) or the Rate Limiting binding. Module-global state is per-isolate — it is NOT shared, NOT durable, and will silently under-count. |
| a cron library | `[triggers] crons` in `wrangler.jsonc` + the `scheduled()` handler |
| a heavy ORM | D1 prepared statements, or **Drizzle** (it has a real D1 driver). Skip anything needing Node `net`/`fs`. |
| a file store | **R2** (S3-compatible). Never write to a filesystem — there isn't one. |
| a session store | **KV** (eventually consistent, cheap reads) or **DO** (strongly consistent) |
| a "background job" after responding | `ctx.waitUntil(promise)` |
| `process.env` | the **`env` binding** (2nd arg). `process.env` is not the Workers way. |

## Traps that bite here

- **Module-global state is not shared** across isolates and vanishes. Counters, caches, and locks in globals are a bug at scale. Use DO/KV.
- **`nodejs_compat`** exists but is a fallback, not a default. Reaching for it usually means you picked the wrong package.
- **Floating promises get killed** when the response returns. Anything that must finish → `ctx.waitUntil()`.
- **Secrets** → `wrangler secret put`, never `vars` in `wrangler.jsonc` (that file is committed).
- Cold start is real: a fat dependency tree taxes *every* request, not just the first user.

## Validation

`wrangler types` (regenerate binding types after any `wrangler.jsonc` change) → `wrangler dev` and **hit the actual route** → `wrangler deploy --dry-run`.

`wrangler deploy` is a **production action** — it needs explicit user approval (see `AGENTS.md` → Approval gates).
