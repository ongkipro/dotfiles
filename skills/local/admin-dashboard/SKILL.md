---
name: admin-dashboard
description: >-
  Design the concept, information architecture, responsive behavior, tables,
  charts, KPI hierarchy, accessibility, and data-loading strategy for admin
  pages and data-dense dashboards. Use for admin panels, dashboard layouts,
  analytics UX, chart selection, responsive tables, KPI cards, sidebars, and
  Astro-vs-React admin decisions. Also covers operator surfaces: order
  lifecycle IA, bulk actions, multi-tenant scope and impersonation, permissions
  and audit logs, and timezone/currency correctness. Delegate component code to shadcn-ui,
  browser evidence to ui-validation, and performance diagnosis to web-perf.
  Not for marketing pages, copywriting, or installing components.
---

# Admin Dashboard — concept & IA

You're already strong at front-end/landing UI/UX. The blind spot is **admin dashboards** (data-dense, responsive, charts, IA). This skill is the **decision** layer — which chart, which layout, which breakpoint. **Components come from other skills.**

## Delegation — this skill does NOT write component code

| Need | Go to |
|---|---|
| Install/code for Recharts, sidebar, data table, blocks, dark-mode toggle, semantic tokens | skill **`shadcn-ui`** |
| Before adding a new dep/lib/wrapper | skill **`native-first`** |
| IA / flow / ERD diagram from the dashboard structure | skill **`mermaid-diagram`** |
| Dashboard slow / heavy chart bundle / render audit | skill **`web-perf`** |
| Chart craft: mark specs, legends, tooltips, sequential/diverging ramps | skill **`dataviz`** when the runtime exposes it — but §6's accessibility floor (colourblind-safe series + a non-colour cue) is not overridable by another palette's defaults |
| Viewport, keyboard, accessibility, state, and visual-regression evidence | skill **`ui-validation`** |
| Astro specifics (islands, adapter) / CF Workers+D1 | skills **`astro-development`**, **`cloudflare`**, **`wrangler`** |

The rule: **this skill decides WHAT, `shadcn-ui` executes HOW.** Don't duplicate component code here.

## 1. Dashboard shell — the required hierarchy

Canonical shape (shadcn "dashboard-01"): **sidebar + header → KPI card grid → trend charts → detail data table** (top→bottom). Binding principle: **Shneiderman's mantra** — *"Overview first, zoom and filter, then details-on-demand"* (Shneiderman, IEEE VL 1996). Summary first, filter, then drill down.

- **KPI cards top-left** — users scan top-left first; put the most important metric there.
- **F/Z-patterns are text-reading behavior, NOT a layout template** (NN/g F-pattern is from text eye-tracking, 2006). For a dashboard you deliberately **fight** the F-pattern with strong visual hierarchy (KPI size/color/position) so the eye lands on the priority metric instead of sweeping.
- **12-column** grid. Density: offer a **comfortable vs compact** toggle for dense views (Carbon: row XS ~24px up to tall; compact when space efficiency matters, tall only when rows need two lines of text).
- **Required states**: loading = a **skeleton** that mimics the final layout (not a spinner, for content loads); empty = explain WHY it's empty + the next action; error = don't wipe already-entered data, name the cause + the recovery path.

## 2. Chart selection — cheatsheet (the often-missed part)

Reference frame: **FT "Visual Vocabulary"** (`Financial-Times/chart-doctor/visual-vocabulary/`, dormant since 2024 — a good frame, not living guidance) — pick the chart from the **relationship you want to show**, not taste.

| Goal | Use | Note |
|---|---|---|
| Time trend (many points) | **Line** | few discrete periods → Column |
| Compare categories | **Bar** | long labels / many categories → horizontal bar |
| Part-of-whole | **Stacked bar** | Pie/Donut only under the strict rule below |
| Correlation of 2 vars | **Scatter** | + size = Bubble (3 vars) |
| Distribution | **Histogram / Boxplot** | |
| Ranking | **Sorted bar / Lollipop** | rank position > absolute value |
| Single number / KPI | **Stat card** | inline trend → **Sparkline** |
| +/− vs target or zero | **Diverging bar** | |
| Geospatial | **Choropleth** (rates) / prop-symbol (counts) | only when location > the value |
| Flow between states | **Sankey** | |

**Anti-patterns (don't):**
- **Bars/columns MUST start at zero** — bars encode via length; a non-zero baseline exaggerates small differences (Datawrapper). **Lines may be truncated** (they encode via slope) — but pick an honest range, don't zoom for drama.
- **Pie/Donut**: **max ~4 slices**, and only when shares are ~25/50/75%. **DON'T** use for: comparing small differences, >4 slices, 2 values (redundant), comparing many "wholes", or multi-answer surveys (Datawrapper). In doubt → bar.
- **Stacked area/bar misleads** when the user compares one series over time — only the bottom band has a flat baseline. To compare one segment across bars → use a **grouped bar** or line.

## 3. Chart library — when to step up from Recharts

Recharts already ships via `shadcn-ui`. **Default is Recharts. Step up only when you hit the wall.**

| Library | When | Runtime note |
|---|---|---|
| **Recharts** (default) | Standard charts (line/bar/area/pie/scatter), **hundreds–low-thousands of points** | SVG, **client-only**. SSR has never worked reliably and is still an open upstream design discussion; the package ships no `"use client"` of its own (verified), so charts are simply absent from server-rendered HTML. In App Router **you** must wrap every chart in a `"use client"` leaf. |
| **ECharts** (raw) | **Thousands+ points / canvas perf**, exotic charts (heatmap, geo, sankey, candlestick, network), **edge-SSR charts** | `renderToSVGString()` is an **instance** method: `echarts.init(null, null, { renderer:'svg', ssr:true, width, height })`. On Workers `compatibility_flags = ["nodejs_compat"]` is **mandatory** — without it `init()` throws `global is not defined`. Tree-shake via `echarts/core` and register only the charts you use — the *full* bundle is ~1.1 MB minified, a tree-shaken one is a fraction of that. |
| **visx** (`@visx/*`) | **Bespoke viz** needing d3-level control, lean bundle | SVG (same node ceiling as Recharts) — you buy control, **not** big-data perf. You assemble axis/legend yourself. Pin `^4.0.0`; the `next` dist-tag points at an *older* alpha. |

- 🔴 **`echarts-for-react` — do not add.** Unofficial, single-maintainer, and hit by an npm supply-chain compromise on 2026-05-19: versions 3.0.7 / 3.1.7 / 3.2.7 were malicious publishes from a **compromised maintainer account** (the "Mini Shai-Hulud" campaign, which hit hundreds of packages). 3.1.7 and 3.2.7 were deleted, but **3.0.7 still resolves**, and its dependency `size-sensor@1.0.4` is compromised and installable. If a project already depends on it, pin **≤ 3.0.6** and check the lockfile. There is no official React wrapper — the imperative API wraps in ~30 lines of `useEffect` + `echarts.init`, which is the correct move.
- **Avoid for React + edge-SSR**: **Chart.js** (canvas, won't SSR on plain Workers) & **Observable Plot** (needs `document`/DOM).
- **Tremor or another dashboard kit**: treat it as presentation, not a chart-engine decision. Reuse a block only when it fits the installed stack; verify current maintenance and license before adding a package.
- The "thousands of points" limit is **architectural (SVG node count), not an official number** — SVG = 1 DOM node per datum, so it janks as node count balloons.

## 4. Responsive data-dense — concrete patterns (NOT "use a media query")

**Admin breakpoints** (Tailwind defaults: sm640 / md768 / lg1024 / xl1280 / 2xl1536). These do **not** align with M3 window-size classes (600/840/1200/1600) at any boundary. Consequence for the table below: switching at `md` dumps the whole **600–767px tablet-portrait band** into a mobile drawer, where M3 would give it the icon rail. If tablet portrait matters for this admin, switch the rail at a custom `min-[600px]` instead:

| Width | Mode | Nav | Table |
|---|---|---|---|
| `< md` (768) | Mobile | **Sheet drawer** | cards / scroll |
| `md–lg` (768–1023) | Tablet | **icon rail** | priority columns |
| `≥ lg` (1024) | Desktop | full sidebar | full multi-pane |

**Data table on mobile — pick the pattern:**
- Few columns → **horizontal scroll**, **pin the header + first column** (the label), and show a scroll affordance (peeking column/arrow).
- Many columns, comparison task → **priority columns** (hide secondary ones) + **expandable row / accordion**. TanStack Table has the official API: `columnVisibility` state, `column.toggleVisibility()`, `enableHiding:false` to pin, render via `getVisibleLeafColumns()` (`getHeaderGroups()` is already visibility-aware and needs no variant). **v9 (Aug 2026) changed the shape:** `useReactTable` → `useTable`, and every feature is opt-in via `tableFeatures({...})` — register `columnVisibilityFeature` or those APIs do not exist on the table at all. Row models moved too (`getSortedRowModel()` → `sortedRowModel: createSortedRowModel()`). Check the lockfile before writing either dialect; `@tanstack/react-table/legacy` is a migration bridge, not a target.
- Transactional list (scan/tap: orders, users, tickets) → **card/stack transform** (each row becomes a label:value card).
- Need a specific slice, not the whole grid → **filter-first** (narrow before you render).

**Sidebar:** desktop full → tablet icon rail → mobile drawer. The rail must never hide the current-location indicator — a collapsed sidebar that loses "where am I" is a navigation regression, not a space saving. Prop names and hooks belong to `shadcn-ui`; don't restate them here (§ delegation rule above).

**Charts on narrow screens:** move direct labels → a legend/key on top; reduce data points / the time range; numbered annotations drop below the chart; for in-table trends use a **sparkline**. ~≤5 widgets per mobile screen (practice, not a standard).

**Dense toolbar/filters:** desktop = search + faceted-filter + column-visibility dropdown → on mobile **collapse into a single "Filters" button that opens a `Sheet`/drawer**.

## 5. KPI cards & honest analytics

**KPI card anatomy:** metric label + **value (largest)** + **delta vs previous period** + trend direction (**arrow/±**) + optional sparkline + the time basis/comparison. Font hierarchy: value > label > context.

- **Color the delta by the DESIRED direction, not the sign** — up ≠ always good (churn/refund/latency going up = red).
- **Don't rely on color alone** (WCAG 1.4.1) — keep the **arrow/± sign** as a non-color cue.
- Give context: period-over-period (MoM/QoQ/YoY) or vs target — a bare number can't be read as good/bad.
- **Label real-time vs batched** so an incomplete current period isn't misread as a drop. Granularity (daily/weekly/monthly) follows the decision cadence.

## 6. A11y & dark-mode charts (brief)

- **Not color alone** to distinguish series (WCAG 1.4.1): add **direct labels / patterns / markers / dashes**.
- Categorical palette **colorblind-safe**: **Okabe-Ito** (`#E69F00 #56B4E9 #009E73 #F0E442 #0072B2 #D55E00 #CC79A7`). Seed the `--chart-*` tokens with these rather than hardcoding hex at the call site — that is how "don't hardcode hex" and "use an accessible ramp" coexist. Two gotchas: shadcn ships only **5** `--chart-*` slots, so >5 series means adding `--chart-6..8` and re-checking the dark ramp; and Okabe-Ito includes **black** among its eight, which is unusable as a series colour in dark mode — substitute it under `.dark`. shadcn's stock `--chart-*` values are brand colours, not an accessible ramp, so check the project CSS before overwriting. Alternatives: ColorBrewer, Tableau 10.
- Axis/text contrast follows WCAG 1.4.3 (4.5:1 for normal text).
- **Dark mode**: map each series to a **`--chart-*`** token (light in `:root`, override in `.dark`) — **don't hardcode hex**. Token syntax: see the `shadcn-ui` skill.

**Palette ownership:** this section is the local source of truth for categorical chart colour. If the runtime also exposes a general `dataviz` skill, use it for craft detail (mark specs, legends, tooltips) but keep the accessibility floor here — colourblind-safe series and a non-colour cue are not negotiable by another palette's defaults.

## 7. Stack fit — Astro vs Next, server data

- **Route-oriented admin with bounded interactive regions** → Astro can hold it:
  server-render the protected route, keep static markup static, and place each
  coordinated React/shadcn region in one hydrated root. **Pervasive client
  routing, realtime coordination, or one cross-page interaction graph** → an
  existing React/Next app or dedicated React app is usually the clearer fit.
  Astro islands are separate roots; React context does not cross between them,
  although deliberately chosen external stores can coordinate them. Do not add
  such a store merely to rescue a boundary that should be one React island.
- **This is a greenfield decision, not a rewrite mandate.** If a project already ships a working Astro admin, apply the IA, table, chart, and state decisions in this skill *in place*. Propose the split only when cross-island shared state is the demonstrated, current blocker — never because the architecture table above prefers something else. Migrating a shipped admin is its own project with its own approval.
- For implementation details, load `astro-development` and read its
  `references/admin-dashboard-runtime.md`; `shadcn-ui` owns component APIs.

### If the admin is Next.js App Router (patterns — code details → shadcn-ui)

- **Server/Client boundary.** Pages/layouts are Server Components: fetch D1/API *on the server*, pass results as props. Add `"use client"` ONLY to interactive leaves — sortable/filterable table, hover/zoom chart, forms (need state, handlers, or `window`/`localStorage`). Keep `"use client"` on the smallest leaf (everything a client file imports ships to the browser).
- **Stream slow sections.** `app/…/loading.tsx` = instant route-level skeleton (auto-wraps the page in `<Suspense>`). Per-section: `<Suspense fallback={<Skeleton/>}><SlowChart/></Suspense>` — KPI row, chart, table stream independently, none blocking the others.
- **Mutations = Server Actions.** `'use server'` fn → invoke from a client component (`<form action>`, `formAction`, or handler). Re-check auth *inside* the action (it is reachable via direct POST). To refresh after the write on **Next 16**: prefer `updateTag(tag)` (Server Actions only, read-your-own-writes — the next request waits for fresh data) or `revalidatePath`. Watch the profile argument: **`revalidateTag(tag, 'max')` is stale-while-revalidate and will show the operator the pre-write table**, while a bare `revalidateTag(tag)` keeps the older immediate behavior. Use `refresh()` for dynamic data cached client-side that `updateTag` won't reach.
- **Heavy chart lib → lazy.** `dynamic(() => import('./chart'), { ssr: false })` for a client-only chart touching `window`/DOM. `ssr:false` is NOT allowed in a Server Component — the `dynamic()` call must live in a `"use client"` file.
- **Deploy: check the repo before assuming.** Admin apps here are containerised (Dockerfile / Coolify) or run a separate API app; Cloudflare is the Astro-site path, not automatically the admin path. Don't reach for an `@opennextjs/cloudflare`-shaped answer without reading the project's Dockerfile and adapter config first.
- **App Router is the house default**, because that is what the existing admins run — a new admin inherits their auth middleware, Server Action conventions, and deploy. A **Vite + React + React Router SPA** is the exception: justified for a throwaway internal tool with no server-fetch or streaming need, where all-client is genuinely simpler. Do not propose an SPA rewrite of a working App Router admin.
- **Server-paginated tables** (Postgres via Drizzle/`pg`, or D1 behind the Astro sites):
  - **Default is Server Component fetch + Server Action mutation + `updateTag`.** Reach for TanStack Query only when a table needs client-owned polling or optimistic state that Server Actions cannot express — and note nothing in the current repos does yet, so "we already have it" is not an argument.
  - Small (hundreds of rows, fits at once) → client-side pagination/sort/filter.
  - **Thousands+ → server-side**: push `LIMIT/OFFSET` (or keyset) + `ORDER BY` + `WHERE` into SQL, `manualPagination:true` (+`manualSorting`/`manualFiltering`). Send **either `rowCount` or `pageCount`, not both** — prefer `rowCount` and let the table derive pages; cursor APIs use `pageCount: -1`. `autoResetPageIndex` is disabled automatically under `manualPagination`, so reset `pageIndex` yourself when filters change. **Don't ship thousands of rows to the browser.**
  - **`COUNT(*)` on a filtered large table is the hidden cost** of showing a total. Past a few hundred thousand rows, offer an approximate count or just `hasNextPage` instead.
- **Virtualization (TanStack Virtual):** for long un-paginated scrolls. Our house rule is ~≥50 meaningful rows, clearly worth it >100, overhead below ~30 — **no upstream basis, it is a local heuristic**; TanStack explicitly declines to give a row-count threshold. The durable point: **virtualization cuts render cost, not fetch/filter/sort cost**, so it is never a substitute for server pagination. Never "fetch-all 50k + virtualize".

## 8. Operator surfaces — the screens these businesses actually run

Orders, tenants, audit, impersonation. These are the bulk of a real admin and
the most-skipped part of dashboard guidance.

- **Timezone is the likeliest correctness bug.** A "Today" KPI computed in UTC
  against a WIB (UTC+7) operation is wrong for seven hours of every day, and it
  is wrong silently. State the timezone next to every period label, compute
  period boundaries in the operation's timezone, and never let a date filter and
  a KPI disagree about when "today" started.
- **Currency:** `Intl.NumberFormat` already drops decimals for IDR and keeps
  them for MYR (verified) — use it rather than hand-formatting. Right-align
  money, never mix currencies in one column: put it in the header or split the
  column.
- **Order lifecycle is the primary axis**, not a secondary filter. Define the
  status taxonomy, which statuses are terminal, and where status lives (tab bar
  vs filter). **A COD order is not a payment** — the operator view must never
  imply money received because a row says "confirmed" (`storefront-ux` owns the
  buyer side of this; this is the operator side).
- **Row selection and bulk actions:** sticky action bar; be explicit about
  select-on-page vs select-across-pages (a real trap once server pagination is
  on); destructive bulk confirmation names the count; report partial failure
  honestly (`23 of 40 updated`, and which 17 failed).
- **Multi-tenant scope:** persistent "which store am I in" indicator, not just a
  switcher. Per-store vs aggregate KPIs must be labelled as such.
  **Impersonation needs a visible, persistent banner with one-click exit** —
  an operator who forgets they are impersonating will act as the customer.
- **Permissions:** **hide** an action the role can never hold; **disable** with
  a reason tooltip when the role could hold it but this object's state forbids
  it; **403** only as the server-side backstop. Never render an action as
  enabled that will fail server-side. Audit logs are their own table archetype:
  append-only, no edit, actor + before/after.
- **Destructive and unsaved state:** confirmation names the object; no
  confirmation for reversible actions; dirty forms get a navigation guard. §1's
  no-data-loss rule applies to every operator form.
- **URL-addressable filters and saved views.** Admin tables need shareable state
  more than storefronts do: "unpaid orders today" should be a link.
- **New-order arrival:** poll only where a missed item costs money (order queue,
  chat inbox) and keep it cheap — 30-60s is the default. Everything else gets a
  manual refresh plus a "new since you loaded" badge. A background refresh never
  reorders rows under the operator's cursor.
- **Export:** export the *filtered* set, not the current page. Decide sync vs
  queued job by size, and say which one happened.

## 9. Solo-dev guardrail — don't over-engineer

- **Don't install Refine** for a handful of custom screens — it's a headless CRUD framework (data-provider + resource) worth it only with **many uniform CRUD resources**. For a bespoke admin, Server Components plus Server Actions already cover it. Harvest the **concept** (a thin data-provider interface), skip the framework.
- **Don't add a chart lib** beyond Recharts until you truly hit its ceiling (§3).
- **Don't build custom viz (visx)** when a bar chart already answers the question.
- **One dashboard shell, reused.** Don't invent a new layout per page.
- Tailwind Plus/Catalyst = **harvest the concept** (paid); shadcn blocks (free, open) cover the same ground.

## Sources and freshness boundary

FT Visual Vocabulary (github.com/Financial-Times/chart-doctor) · Datawrapper Academy (pie / zero-baseline / area / stacked) · Shneiderman 1996 "The Eyes Have It" · NN/g (mobile tables, F-pattern, skeleton screens) · TanStack Table/Query/Virtual docs · shadcn/ui (sidebar, data-table, chart, blocks) · Tailwind responsive docs · Material Design 3 window-size-classes · Carbon Design (density) · WCAG 1.4.1/1.4.3 · Okabe-Ito palette · Recharts/ECharts/visx GitHub · Astro islands docs · Saleor Dashboard (github.com/saleor/saleor-dashboard) for production admin behavior.

Library APIs, versions, maintenance state, and deployment adapters are volatile.
Verify them against the project's lockfile and current official upstream before
implementing. Keep this skill focused on durable UX decisions.

Library APIs verified 2026-08-10 (Recharts SSR status, TanStack Table v9, Next 16 `updateTag`, ECharts-on-Workers, the `echarts-for-react` compromise). These move fast — re-check before implementing.

**Unverified / inference:** chart point-count thresholds (architectural, no official number); "≤5 widgets/mobile screen" and the virtualization row counts (**house rule, no upstream basis** — TanStack declines to give a threshold); "color the delta by desired direction" and granularity labeling (design judgment); §8's operator-surface rules (accumulated practice, not cited standards).
