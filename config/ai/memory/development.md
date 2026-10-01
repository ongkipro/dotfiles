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

Symptom / root cause / invariant lessons are in [development-lessons.md](development-lessons.md). Load it when debugging web UI, CSS layering, Tailwind, Headless UI, or Astro prerender behavior.
