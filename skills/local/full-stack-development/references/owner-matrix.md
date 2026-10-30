# Owner matrix

Open when the trace surfaces a concern and its owner is not obvious from the skill map (`skills/local/README.md`).

| Work discovered | Exact owner skill |
|---|---|
| Automated behavioral test strategy, test levels, fixtures, and regression coverage | `testing-engineering` |
| Plain PostgreSQL/Drizzle schema, constraints, queries, migrations, and data lifecycle | `postgres-drizzle` |
| Cross-stack threat modeling, authorization boundaries, input/output safety, secrets, and AppSec review | `application-security` |
| Next.js App Router architecture and implementation | `nextjs-development` |
| Cross-stack logs, metrics, traces, SLI/SLOs, alerts, and telemetry safety | `observability-engineering` |
| GitHub Actions workflow design, permissions, caching, matrices, artifacts, and CI evidence | `github-actions` |
| Astro rendering, routes, islands, Actions, sessions, adapters, and endpoints | `astro-development` |
| Cloudflare Worker code and bindings | `workers-best-practices` |
| Cloudflare product choice; Wrangler CLI, config, and deploy | `cloudflare`; `wrangler` |
| VPS deploy/operate (Coolify or Docker Compose), backups, rollback, workers, cron | `vps-deploy` (provider console/provisioning: `vultr`) |
| Vercel projects, env, domains, preview/production deploys | `vercel` |
| Client-edited content layer and CMS selection | `cms-content` |
| Shopify headless architecture; Hydrogen implementation; Hydrogen tracking surfaces | `headless-shopify`; `hydrogen-development`; `hydrogen-headless-tracking` |
| Technical SEO, metadata, schema, sitemap/canonical, hreflang | `seo-website-builder` |
| Transactional email from a Worker (Cloudflare Email Sending/Routing) | `cloudflare-email-service` |
| Transactional email outside Workers (SMTP or provider API from Node) | no dedicated owner: provider's official docs + `native-first` before an SDK; secrets/abuse via `application-security`; send from a job (row below), not the request path |
| File uploads (validation, size/type limits, storage, signed URLs) | `application-security` for the trust boundary; storage owner by platform: `cloudflare` (R2), `supabase-stack` (Storage), `vps-deploy` (volumes/object store) |
| Background jobs, queues, cron, outbox | `postgres-drizzle` (outbox, `SKIP LOCKED`, idempotency); runtime by platform: `vps-deploy` (worker container, scheduled tasks), `cloudflare` (Queues/Cron Triggers), `vercel` (crons) |
| Bot protection on forms and endpoints (Turnstile) | `turnstile-spin` |
| Supabase database, Auth, RLS, Storage, Realtime, and Edge Functions | `supabase-stack` |
| Better Auth configuration and session/auth hardening | `better-auth-security` plus `application-security` for the cross-stack boundary |
| Machine-readable REST contract | `openapi-spec` |
| Stripe payments, Connect, and webhooks | `stripe-best-practices` |
| AutoLaris H2H payment channels, Create Resi, Cek Ongkir, and Advice reconciliation | `autolaris-h2h` |
| Multi-courier Indonesian shipping rates, tracking, and COD settlement through an aggregator | `mengantar-api` |
| Admin/CMS roles, objects, lifecycle, permissions, tasks, and screen contracts | `admin-product-ux` |
| Admin/CMS information hierarchy, tables, charts, density, and responsive presentation | `admin-dashboard` |
| React/Next.js shadcn component APIs and installed registry integration | `shadcn-ui` |
| Storefront journey, commerce states, and backend-neutral acceptance behavior | `storefront-ux` |
| Storefront implementation architecture and commerce UI composition | `storefront-development` |
| Non-admin visual direction | `design-taste` |
| Browser-visible executable evidence | `ui-validation` |
| Performance measurement and diagnosis | `web-perf` |
| Built-in capability and dependency decision | `native-first` |
| Cross-file call tracing or change-impact navigation | `codebase-navigation` (search first; optional Graphify) |
| Shipped-artifact, HAR/network, bundle, APK, SQLite, or binary reverse engineering and reconstruction coverage | `black-magic` |
| Small PRD/PLAN/TASKS route | `prd-taskbreaker` |
| Traceable multi-document specification pack | `development-spec-suite` |

A specialist owns its domain even when another skill owns the host framework.
For example, `postgres-drizzle` owns a Drizzle migration inside Next.js, while
`nextjs-development` owns the route or Server Action consuming it. Do not load an
owner whose concern is absent.
