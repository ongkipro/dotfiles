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


---


## Lesson: Admin UI: the component primitive owns control geometry, not the call site

### Symptom
Admin screens drifted apart: inputs, selects and buttons in one row had five heights (28-44px) and radii from 4 to 17px, filter rows with fixed-width columns overlapped, searches were icons absolutely positioned over inputs, and pages set their own centred max-width so content edges jumped between menus. Each fix was requested screen by screen.

### Root cause
Every call site passed height, radius, background, border colour, shadow and text size to shared shadcn-style primitives, and every page chose its own container width; nothing made a deviation fail.

### Durable invariant
Primitives (Input, SelectTrigger, InputGroup, Button default) own one control height and radius; callers pass layout only (width, flex, font, textarea min-height). Filter toolbars, search and choice menus each have one shared component (FilterBar/FilterField, SearchInput as InputGroup with icon addon, FilterSelect styled like the date filter with icon, value, chevron). Page width belongs to the app shell alone. Lists of a few settings are rows in one card, not a card per item inside a card.

### Fix
Set the height once in the primitives, strip per-call overrides, introduce the shared toolbar components, remove page-level max-width wrappers, and add a guard test that scans JSX for banned classes on the primitives, hand-built searches, oversized buttons and centred page widths. The JSX scanner must track {} depth and quotes: a regex stops at the > of an arrow function in onChange and silently skips every attribute after it.

### Regression check
Guard test fails on a planted violation; a browser pass measures every control height in toolbars, zero overlapping control boxes, and one content edge across all admin pages at 1280/1440/1920px.

> Promoted from a reviewed local candidate on 2026-09-25.


---


## Lesson: Headless UI portals and form values: tokens, modal dialogs, SSR labels

### Symptom
Select and combobox popups were rounder than their triggers; inside a modal dialog a combobox option ignored mouse and touch (keyboard worked); a select trigger showed the raw value 'all' before hydration; a combobox's hidden input carried the whole option object as JSON.

### Root cause
Popups portal to <body>, outside the element that scopes design tokens and outside a modal dialog that sets pointer-events:none on everything else; a Select without an items map can only render its raw value server-side; an object-valued combobox serialises the object for its hidden form input.

### Durable invariant
Declare design tokens (radius, colours) on :root as well as any scoped shell. Inside a modal, portal popups into the dialog element. Always give Select an items/value->label map. Give object-valued comboboxes an itemToStringValue that returns the id.

### Fix
Moved the radius token to both :root and the shell; added a portal container prop to the combobox content and passed the closest [role=dialog]; built the filter select on an items map; set itemToStringValue to the option id.

### Regression check
Measure computed border-radius of trigger, popup and item; click (not keyboard) an option inside a modal and assert the value changed; read the server-rendered trigger text; read the hidden input value.

> Promoted from a reviewed local candidate on 2026-09-25.


---


## Lesson: Tailwind v4: a bare border is currentColor unless a base rule sets the border colour

### Symptom
Black lines under card headers, panels and tables across an admin UI after splitting one stylesheet into several entries.

### Root cause
Tailwind v4 no longer defaults border colour to gray; shadcn's '* { border-color: var(--border) }' base rule lived in the old shared entry and was lost in the split, so every bare border/border-b fell back to currentColor.

### Durable invariant
Every entry stylesheet that renders shadcn components keeps a base-layer rule setting border-color to the --border token for *, ::before, ::after, ::backdrop.

### Fix
Restored the base rule once in the admin entry stylesheet instead of adding border-slate-* to each element.

### Regression check
In a browser, read getComputedStyle(el).borderColor of an element with a bare border class: it must equal the --border token, not the text colour.

> Promoted from a reviewed local candidate on 2026-09-25.
