# Node + TypeScript — native-first

Modern Node absorbed most of the classic dependency list. If a tutorial tells you to install it, check the year.

## Don't install it; Node already has it

| Reaching for… | Use instead (Node 18+ / 20+) |
|---|---|
| axios, node-fetch, got | global `fetch`, `Request`, `Response`, `Headers`, `FormData` |
| request-timeout wrappers | `AbortSignal.timeout(ms)` — pass as `{ signal }` |
| jest, mocha, chai | `node:test` + `node:assert` (`node --test`) |
| nodemon | `node --watch` |
| dotenv | `node --env-file=.env` |
| uuid | `crypto.randomUUID()` |
| bcrypt *for hashing tokens* | `node:crypto` `scrypt`/`timingSafeEqual`. (For **user passwords**, a real KDF lib is fine — but if you're on better-auth, it already handles this. See `data.md`.) |
| lodash.clonedeep | `structuredClone()` |
| lodash groupBy / chunk | `Object.groupBy`, `Array.prototype.at/flat/toSorted/toReversed` |
| moment, date-fns | `Intl.DateTimeFormat` (timezone-aware, e.g. `Asia/Jakarta`) |
| glob | `fs.promises.glob` (Node 22+) or `fd` in a script |
| rimraf | `fs.promises.rm(p, { recursive: true, force: true })` |
| p-limit for simple cases | `Promise.all` / `Promise.allSettled`; batch by slicing |
| an event emitter class | `node:events` `EventEmitter`, or `AbortController` for cancellation |
| a queue for one background job | `setTimeout` / a durable job in the DB. A queue is infra — don't add it for one task. |

## Still worth installing (don't be dogmatic)

`zod` (runtime validation at trust boundaries — this is rung 1 "explicitly needed", not bloat), a real DB driver, `hono` **if** you need a router with middleware, `sharp` for image processing.

## TypeScript discipline

- `strict: true`. No `any` — use `unknown` and narrow.
- Don't hand-write types the source already exports: `z.infer<typeof schema>`, Drizzle's `$inferSelect`/`$inferInsert`, `typeof x[number]`.
- No barrel `index.ts` re-exporting everything — it wrecks tree-shaking and creates cycles.
- Types are free at runtime; **validation is not**. A TS type does not validate an API response. Parse it.

## Validation

`tsc --noEmit` → `node --test`. One runnable check per non-trivial function (a branch, a parser, a money/auth path) — an `assert`-based test file, no framework, no fixtures.
