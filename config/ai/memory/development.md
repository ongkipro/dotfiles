# Development Philosophy
> Durable rules for AI-assisted development. Use this before proposing stack, architecture, file structure, or implementation plan.

## Core principles
- Terminal-first, reproducible, low-bloat development.
- Prefer clear architecture over clever code.
- Prefer small, testable increments over giant rewrites.
- Prefer official APIs/SDKs before brittle scraping, unless scraping is the explicit task.
- Prefer boring, maintainable infrastructure before complex self-hosting.
- Do not install duplicate tools. Check existing environment first.

## Default stack preferences

### Public frontend / SEO sites
- Preferred: Astro + Tailwind.
- Good for: SEO blog, affiliate site, comparison portal, landing page, content-heavy storefront, static/headless frontend.
- Deployment direction: Cloudflare Pages/Workers when suitable.

### Admin/client dashboards
- Default component system: shadcn/ui for React-capable admin and client
  dashboards, with TypeScript, Tailwind, semantic HTML, and project tokens.
- Runtime choice between Next.js App Router, Vite + React, and Astro + React is
  owned by [Decision Memory](decisions.md) → "Admin/client dashboard direction",
  with the reason and the tradeoff. Read it there; do not restate it here.
- Do not hydrate static Astro markup merely to reproduce shadcn presentation.
- For multi-report dashboards: use a central data registry (index.ts mapping slugs → data modules) and props-based reusable report components.
- Keep public SEO frontend separate when needed.

### Shopify
- Use Shopify CLI and theme workflow for Liquid/theme work.
- Use Storefront API/headless architecture when public frontend needs stronger control over SEO/UI/performance.
- Respect Shopify checkout and platform constraints.
- For custom platform ideas, separate MVP validation from full Shopify-like build.

### Database/backend
- Prefer **PostgreSQL + Drizzle ORM + better-auth**. Hosting: Neon (Vercel) or self-host via Coolify. ⚠️ **Supabase is not used**, and its CLI is intentionally not installed (see environment.md); older notes recommending Supabase are cancelled.
- For self-hosted VPS, design backup, migration, monitoring, and security before scaling.
- Avoid overbuilding microservices before demand is proven.

### Cloudflare
- Good fit for Astro/static/headless/edge API, Workers, Pages, DNS, caching, and lightweight APIs.
- Validate runtime differences between dev and production, especially environment variables and Workers runtime.

## Project execution rules
- Start by reading project memory, README, package files, config files, and existing folder structure.
- Before editing code, identify the smallest safe change.
- Prefer patching existing architecture over replacing it unless there is clear technical debt.
- For every implementation plan include: files changed, commands, test/preview steps, rollback risk.
- If a command may install, delete, migrate, deploy, or overwrite, state the risk clearly.

## Code style
- Use TypeScript where the project already uses TS.
- Prefer typed APIs, explicit interfaces, and small modules.
- Avoid magic global state unless required by framework/runtime.
- Favor semantic HTML, accessibility, responsive layout, and SEO-friendly structure.
- Keep UI components composable and design tokens consistent.

## Commerce catalog identity
- For a CMS, commerce portal, storefront, or product platform, define one immutable external catalog ID for every sellable product or variant. Prefer a digit-only value with at least five digits unless an existing platform contract requires another format.
- Treat the catalog ID as a string at API, feed, browser-event, and persistence boundaries even when it contains only digits. Never coerce it through JavaScript `number`, strip leading characters, derive it from a mutable slug/SKU, recycle it, or change it after publication.
- Keep the external catalog ID separate from the database primary key. Internal keys may remain opaque; the catalog ID must have a unique constraint and a collision-safe server-side generator. In a multi-tenant platform, prefer platform-global uniqueness so shared/default advertising accounts cannot collide.
- Reuse the exact serialized value across storefront/headless responses, order-item snapshots, Meta catalog `id`/retailer identity, Meta Pixel and Conversions API `content_ids` or `contents[].id`, Google Merchant `id` and XML `<g:id>`, and Merchant API `offerId`.
- For variants, every sellable variant receives its own catalog ID. The parent product catalog ID is the group identity (`item_group_id` or equivalent), while events and order items use the purchased variant ID. A product without variants uses its product catalog ID as the sellable item ID.
- `<g:id>` is the Google XML namespace element name, not a separate GID identifier type. GTIN, MPN, SKU, database primary key, and catalog ID are distinct concepts and must not be substituted for one another without a verified provider rule.

## AI terminal rules
- Do not suggest VSCode as default; Helix/terminal-first is the default preference.
- Use `rg`, `fd`, `bat`, `eza`, `tmux`, `lazygit`, `mise`, and existing CLI stack when applicable.
- For AI agents, provide prompts that include role, repo context, constraints, files to inspect, deliverables, validation, and stop conditions.

## Parallel AI terminals (shared machine)

Several AI terminals and projects run on one machine (8 cores, 31 GB). Without coordination their builds, test suites and browsers stack, a shared test database gets mixed state, and everything slows (99ribu, 2026-11-05: a full suite took hours, parallel runs timed out each other, a rebuild under a running suite broke it). Rule: heavy work goes through `heavy-run`; light work (editing, git, one-file checks, reading) never waits.

- `heavy-run [--lock NAME] [--label WHY] [--wait-max S] [--timeout S] -- <cmd>`: takes a machine-wide pool slot (default `max(2, cores/4)` = 2 on this host; `AI_HEAVY_SLOTS` overrides) and, with `--lock`, a named exclusive lock across all terminals. Locks are kernel `flock`s, released when the job dies, so there are no stale locks; the job runs at nice 10 so interactive work stays responsive. `heavy-run --status` shows who holds what and who waits. Nested calls inside a job run directly.
- Lock names: one per shared resource, `<repo>-env` for a repo's built server + local/test databases (builds, migrations, integration and browser suites all take it; a build must never replace `.next` under a running suite). Repos expose it as an npm script that degrades to a plain run when `heavy-run` or the machine is absent (CI, Docker build): 99ribu `scripts/heavy.sh` behind `npm run build`, `test:integration`, `test:browser`, `test:file`.
- Never start a second suite on the same database, and never run integration and browser suites together. A direct `node --test <file>` also counts: use the repo's wrapper (`npm run test:file -- <file>`) or `heavy-run --lock <repo>-env -- node --test <file>`.
- Do not wait by polling or sleeping in a loop: start the job in the background (`run_in_background`) and use `ScheduleWakeup`/the completion notice; waiting for a lock costs no tokens.
- Prefer targeted selectors over the full suite while developing (`--case=...`, `test:file`); run the full suite once per change set, alone. When a run fails on timeouts, check `heavy-run --status` and `uptime` first, then rerun the failing files alone before calling anything a regression or pre-existing. Compare against old code only with a database that has not been migrated forward, otherwise the comparison shares the new code's behaviour.
- Another project's heavy jobs (Playwright, builds) count too: wrap them the same way (`heavy-run --label geraiexpress-e2e -- pnpm exec playwright test`). A test database that grows past ~500 MB slows backup/restore drills; recreate it from migrations when convenient.
- Test databases: `ai-testdb` runs one shared Postgres per major version on tmpfs with durability off (`127.0.0.1:554<major>`, trust auth, data lost on restart by design). Migrate once into a template (`ai-testdb create <repo>_tpl`), then each suite run gets its own clone: `ai-testdb run <repo> --from <repo>_tpl -- <suite>` sets `DATABASE_URL` (or `--env VAR`) and drops the clone afterwards. A clone isolates only the database: keep `--lock <repo>-env` while runs still share a build directory (`.next`), a server, ports or temp files; drop it only when every one of those is per-run too. Trust auth on loopback is not a security boundary: never point dev, production or customer data at it; dev databases stay in each project's own container.
- Heavy jobs run in `ai-heavy.slice` (`CPUWeight=20`, `MemoryHigh=40%` per job): full speed when the machine is idle, but agents, editors and shells win under contention. `AI_HEAVY_NO_SCOPE=1` disables it. When a job ends or times out, everything left in its process group (servers or watchers started with `&`) is stopped too; never daemonize (setsid) under it. Nested `heavy-run` inside a job only reuses locks the outer job holds; asking for another lock fails, so put every lock on the outer call.
- Before machine maintenance, a force close or a long pause: `dev-freeze` (exit 1 and INCOMPLETE rows if any artifact failed; it copies untracked files such as `.env` as they are, so keep snapshots private and delete old ones): bundle of all refs, uncommitted patches, untracked files, dirty worktrees, per-repo `RESUME.md`, `INDEX.md`; default `/data/backups/dev-freeze-<time>/`; and ask each running terminal to checkpoint its repo notes (STATUS, log, ledger) without starting new work.
- Still open: suite sharding, full suite in CI. See 99ribu `STATUS.md` "Test infrastructure".

## Risk checks
Before recommending a technical path, evaluate:
1. Build complexity.
2. Maintenance burden.
3. Hosting/deployment cost.
4. Security risk.
5. Data ownership.
6. SEO impact.
7. Conversion impact.
8. Team/intern operability.
9. AI-agent operability.

---

## Lessons

Symptom / root cause / invariant lessons are in [development-lessons.md](development-lessons.md). Load it for Astro prerender and Node test-harness behavior; CSS layering, Tailwind, Headless UI and component geometry: [ui-lessons.md](ui-lessons.md). Workers, D1, KV and caching lessons: [cloudflare-lessons.md](cloudflare-lessons.md). Coolify, Postgres dumps/migrations, PostgREST, Better Auth and mise lessons: [ops-lessons.md](ops-lessons.md).
