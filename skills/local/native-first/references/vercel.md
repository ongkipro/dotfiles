# Vercel — native-first

Live here: `volumecms` (+ tenant `tholabie` → pesantrentholabie.com), `report-petani-next`.

## Don't build it; the platform does it

| Reaching for… | Use instead |
|---|---|
| a cron server / VPS for a scheduled job | **Vercel Cron** (`vercel.json` → `crons`) hitting a Route Handler |
| a custom cache layer | ISR: `revalidate` + `revalidateTag()` / `revalidatePath()` on mutation |
| a feature-flag service (small scale) | **Edge Config** (low-latency reads, no redeploy) |
| a CDN / image resizer | `next/image` — optimized at the edge automatically |
| an analytics script | `@vercel/analytics` + `@vercel/speed-insights` |
| a staging server | **Preview Deployments** — every branch gets a URL |
| a secrets file | Project → Environment Variables, scoped per environment |
| a blob/upload service | Vercel Blob, **or** R2 if the project already talks to Cloudflare — don't run two object stores |

## Discipline

- **Serverless functions are stateless.** No in-memory cache, no writing to disk (only `/tmp`, ephemeral). No "warm" globals you can rely on.
- Long jobs will hit the function timeout. Anything slow → a queue, a cron, or a real server. Don't fight the timeout with retries.
- **Per-tenant DB**: house convention since 2026-07-06 is a dedicated **Neon** instance per client (e.g. `tholabie`). Don't multiplex tenants onto one connection string just to save setup time.
- Serverless + Postgres = connection-pool trouble. Use the pooled/serverless Neon connection string, not a direct one.
- Preview deploys must NOT point at the production DB. Check the env scoping before you ship.

## Validation

`next build` locally first (it catches what the dashboard will catch, faster) → push a branch → **check the Preview URL**, not just the build log.

Promoting to production is a **production action** — explicit approval (see `AGENTS.md` → Approval gates).
