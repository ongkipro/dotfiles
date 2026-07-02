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
- Preferred: Next.js + React + TypeScript + Tailwind + shadcn/ui.
- Good for: super admin, client portal, SaaS dashboard, forms, auth, data-heavy UI.
- For multi-report dashboards: use a central data registry (index.ts mapping slugs → data modules) and props-based reusable report components.
- Keep public SEO frontend separate when needed.

### Shopify
- Use Shopify CLI and theme workflow for Liquid/theme work.
- Use Storefront API/headless architecture when public frontend needs stronger control over SEO/UI/performance.
- Respect Shopify checkout and platform constraints.
- For custom platform ideas, separate MVP validation from full Shopify-like build.

### Database/backend
- Prefer PostgreSQL/Supabase for fast MVP and relational business data.
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
