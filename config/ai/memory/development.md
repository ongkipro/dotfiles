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
- Prefer **PostgreSQL + Drizzle ORM + better-auth**. Hosting: Neon (Vercel) atau self-host via Coolify. ⚠️ **Supabase TIDAK dipakai** dan CLI-nya sengaja tidak dipasang (lihat environment.md) — catatan lama yang menyarankan Supabase sudah dibatalkan.
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


---


## Lesson: Runtime query parameters in statically built Astro pages

### Symptom
A thank-you page built successfully but ignored orderNumber, vaNumber, and qrUrl query parameters in the deployed static output.

### Root cause
The Astro frontmatter read Astro.request.url during static generation, so the generated HTML captured build-time request state instead of browser navigation state.

### Durable invariant
Runtime query-dependent UI in an Astro static output must parse validated parameters in the browser or use an explicitly server-rendered route.

### Fix
Render safe empty placeholders and populate them with a small validated browser script using textContent and typed DOM properties.

### Regression check
Build the static site, serve dist with astro preview, then open /thank-you?orderNumber=ORD-UI-001 in a real browser and assert the order number is visible.

> Promoted from a reviewed local candidate on 2026-08-16.


---


## Lesson: Showing an element with style.display='flex' resizes its children

### Symptom
Homepage product cards were inconsistent: some rendered narrower and shorter than the rest, and only while their lazy images had not loaded yet.

### Root cause
The catalog filter revealed a card by writing card.style.display='flex'. That made the grid cell a flex container, so the child <article> became a flex item sized to max-content instead of filling the cell. A loaded image pins max-content to the cell width and masks this; a loading=lazy image that has not arrived contributes no width, so the article collapsed onto its title text and the aspect-square image box carried that into the height.

### Durable invariant
Toggling visibility must not change an element's display type. Use a class that only sets display:none, never write a concrete display value to show an element, because the value chosen also decides how its children are sized.

### Fix
Replace card.style.display='flex'/'none' with card.classList.toggle('hidden', !show), and drop the matching inline style from the server render, so no inline display is ever written and the cell keeps its grid sizing.

### Regression check
With the grid rendered and lazy images still unloaded, every card wrapper and its inner article must measure the same width and height: new Set(cards.map(c => c.querySelector('article').getBoundingClientRect().width)).size === 1

> Promoted from a reviewed local candidate on 2026-08-24.


---


## Lesson: An unlayered CSS rule outranks every Tailwind utility

### Symptom
A Tailwind utility placed on an element had no effect: btn-primary text-xs still rendered 14px, and btn-primary bg-emerald-700 stayed slate. The workaround in the codebase was !important on the utilities.

### Root cause
The project stylesheet defined its component classes outside any @layer, while Tailwind v4 puts utilities inside @layer utilities. An unlayered declaration wins over every layered one regardless of specificity, so the utility could never apply. Reasoning about this as a specificity contest gives the wrong answer; only the built bundle's layer order settles it.

### Durable invariant
In a Tailwind v4 codebase every project stylesheet rule must sit inside an @layer. Layer order decides across layers, not specificity, so an unlayered rule silently outranks utilities. Reaching for !important on a utility is the symptom of this, not the fix.

### Fix
Wrap the component rules in @layer components and delete the !important workarounds at the call sites.

### Regression check
Put a conflicting utility on the component class and assert the computed value comes from the utility: getComputedStyle(el).fontSize === '12px' for class="btn-primary text-xs".

> Promoted from a reviewed local candidate on 2026-08-24.


---


## Lesson: A bundler-resolved import can be unreachable from node --test

### Symptom
One lib module could not be tested at all: node --experimental-strip-types --test failed with ERR_MODULE_NOT_FOUND on './env', while the app built and ran normally.

### Root cause
Vite resolves extensionless relative specifiers; Node's type-stripping test runner does not. A module importing './env' instead of './env.ts' therefore works everywhere the bundler runs and is invisible to the test suite. Ten more modules had the same defect, hidden because nothing had tried to import them under Node.

### Durable invariant
Where tests run under node --experimental-strip-types, every relative import in testable source must carry its explicit .ts extension. A green build proves bundler resolution, never testability — a module the test runner cannot import is untested no matter how many tests exist.

### Fix
Give every relative import in the tested source tree its explicit extension, applied across the whole directory rather than only the module that surfaced the error.

### Regression check
npm test must actually import each lib module; a bare relative specifier fails immediately with ERR_MODULE_NOT_FOUND rather than being silently skipped.

> Promoted from a reviewed local candidate on 2026-08-24.
