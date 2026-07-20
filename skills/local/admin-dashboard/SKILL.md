---
name: admin-dashboard
description: >-
  Concept/UX layer for designing correct admin pages & data-dense dashboards — not how to
  install components. Answers: which chart fits, layout hierarchy & information architecture,
  admin breakpoints, how the data table / sidebar / charts go responsive across
  mobile/tablet/desktop, KPI card anatomy, honest analytics, chart a11y + dark mode, and
  Astro-island vs Next-SPA + D1 pagination. For component CODE (Recharts, sidebar, data table,
  blocks, dark-mode toggle, semantic tokens) → delegate to the `shadcn-ui` skill. Triggers:
  'bikin dashboard admin', 'halaman admin responsive', 'chart apa yang cocok', 'design an admin
  dashboard', 'which chart fits', 'data-dense dashboard', 'tabel di mobile', 'table on mobile',
  'layout dashboard', 'KPI card', 'analytics UX', 'admin panel', 'dashboard responsive'. NOT for
  installing/writing components (shadcn-ui), NOT performance audits (web-perf), NOT marketing
  copy (content/copywriting).
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
| Astro specifics (islands, adapter) / CF Workers+D1 | skills **`astro-development`**, **`cloudflare`**, **`wrangler`** |

The rule: **this skill decides WHAT, `shadcn-ui` executes HOW.** Don't duplicate component code here.

## 1. Dashboard shell — the required hierarchy

Canonical shape (shadcn "dashboard-01"): **sidebar + header → KPI card grid → trend charts → detail data table** (top→bottom). Binding principle: **Shneiderman's mantra** — *"Overview first, zoom and filter, then details-on-demand"* (Shneiderman, IEEE VL 1996). Summary first, filter, then drill down.

- **KPI cards top-left** — users scan top-left first; put the most important metric there.
- **F/Z-patterns are text-reading behavior, NOT a layout template** (NN/g F-pattern is from text eye-tracking, 2006). For a dashboard you deliberately **fight** the F-pattern with strong visual hierarchy (KPI size/color/position) so the eye lands on the priority metric instead of sweeping.
- **12-column** grid. Density: offer a **comfortable vs compact** toggle for dense views (Carbon: row XS ~24px up to tall; compact when space efficiency matters, tall only when rows need two lines of text).
- **Required states**: loading = a **skeleton** that mimics the final layout (not a spinner, for content loads); empty = explain WHY it's empty + the next action; error = don't wipe already-entered data, name the cause + the recovery path.

## 2. Chart selection — cheatsheet (the often-missed part)

Reference frame: **FT "Visual Vocabulary"** (github.com/Financial-Times/chart-doctor) — pick the chart from the **relationship you want to show**, not taste.

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

| Library | When | Verified fact |
|---|---|---|
| **Recharts** (default) | Standard charts (line/bar/area/pie/scatter), **hundreds–low-thousands of points** | SVG, SSR-friendly. `ResponsiveContainer` needs an explicit size on the server. v3.9.2. |
| **ECharts** + `echarts-for-react` | **Thousands+ points / canvas perf**, exotic charts (heatmap, geo, sankey, candlestick, network), **edge-SSR charts** | `renderToSVGString()` → SVG with no DOM/canvas, runs on **Cloudflare Workers-class**. Tree-shake via `echarts/core`. |
| **visx** (`@visx/*`) | **Bespoke viz** needing d3-level control, lean bundle | SVG (same node ceiling as Recharts) — you buy control, **not** big-data perf. You assemble axis/legend yourself. |

- **Avoid for React + edge-SSR**: **Chart.js** (canvas, won't SSR on plain Workers) & **Observable Plot** (needs `document`/DOM).
- **Tremor**: acquired by **Vercel (Jan 2025)**, now a **copy-paste "Tremor Raw"/Blocks (MIT) model on top of Recharts** — harvest its KPI/tracker blocks, don't add the npm `@tremor/react` (frozen at 3.18.7). Not a separate engine, just Recharts.
- The "thousands of points" limit is **architectural (SVG node count), not an official number** — SVG = 1 DOM node per datum, so it janks as node count balloons.

## 4. Responsive data-dense — concrete patterns (NOT "use a media query")

**Admin breakpoints** (Tailwind defaults: sm640 / md768 / lg1024 / xl1280 / 2xl1536; aligned with M3 window-size-class):

| Width | Mode | Nav | Table |
|---|---|---|---|
| `< md` (768) | Mobile | **Sheet drawer** | cards / scroll |
| `md–lg` (768–1023) | Tablet | **icon rail** | priority columns |
| `≥ lg` (1024) | Desktop | full sidebar | full multi-pane |

**Data table on mobile — pick the pattern:**
- Few columns → **horizontal scroll**, **pin the header + first column** (the label), and show a scroll affordance (peeking column/arrow).
- Many columns, comparison task → **priority columns** (hide secondary ones) + **expandable row / accordion**. TanStack Table has the official API: `columnVisibility` state, `column.toggleVisibility()`, `enableHiding:false` to pin, render via `getVisibleLeafColumns()`.
- Transactional list (scan/tap: orders, users, tickets) → **card/stack transform** (each row becomes a label:value card).
- Need a specific slice, not the whole grid → **filter-first** (narrow before you render).

**Sidebar (shadcn `Sidebar`):** `collapsible="offcanvas|icon|none"`. Desktop full → tablet **icon rail** (`collapsible="icon"`) → mobile auto-becomes a **`Sheet`** (via `isMobile`/`openMobile`, `useSidebar()` hook). Toggle `Cmd/Ctrl+B`.

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
- Categorical palette **colorblind-safe**: **Okabe-Ito** (8 colors, e.g. `#E69F00 #56B4E9 #009E73 #F0E442 #0072B2 #D55E00 #CC79A7`). Alternatives: ColorBrewer, Tableau 10.
- Axis/text contrast follows WCAG 1.4.3 (4.5:1 for normal text).
- **Dark mode**: map each series to a **`--chart-*`** token (light in `:root`, override in `.dark`) — **don't hardcode hex**. Token syntax: see the `shadcn-ui` skill.

## 7. Stack fit — Astro vs Next, D1 data

- **Heavy stateful admin (SPA-like: shared state across components, client routing, live tables, filters talking to each other)** → **React SPA / Next.js**. Astro islands are **isolated by design** — shared state across islands is awkward. Keep **Astro** for **marketing + light admin** (status pages, simple settings). Common split: public Astro + a separate React/Next app for the dense admin.

### If the admin is Next.js App Router (patterns — code details → shadcn-ui)

- **Server/Client boundary.** Pages/layouts are Server Components: fetch D1/API *on the server*, pass results as props. Add `"use client"` ONLY to interactive leaves — sortable/filterable table, hover/zoom chart, forms (need state, handlers, or `window`/`localStorage`). Keep `"use client"` on the smallest leaf (everything a client file imports ships to the browser).
- **Stream slow sections.** `app/…/loading.tsx` = instant route-level skeleton (auto-wraps the page in `<Suspense>`). Per-section: `<Suspense fallback={<Skeleton/>}><SlowChart/></Suspense>` — KPI row, chart, table stream independently, none blocking the others.
- **Mutations = Server Actions.** `'use server'` fn → invoke from a client component (`<form action>`, `formAction`, or handler). After the write, `revalidatePath`/`revalidateTag` from `next/cache` to refresh the table. Re-check auth *inside* the action (reachable via direct POST).
- **Heavy chart lib → lazy.** `dynamic(() => import('./chart'), { ssr: false })` for a client-only chart touching `window`/DOM. `ssr:false` is NOT allowed in a Server Component — the `dynamic()` call must live in a `"use client"` file.
- **Deploy to Cloudflare (2026).** Use `@opennextjs/cloudflare` (OpenNext adapter) on **Workers** — Cloudflare's current recommendation, runs the **Node.js runtime** with full App Router. `@cloudflare/next-on-pages` is **deprecated** (edge-only) — don't start new admins on it. Read a D1 binding with `getCloudflareContext().env.<BINDING>` from `@opennextjs/cloudflare`. Caveat: Next Image optimization + incremental cache need adapter config on Workers (not the default Vercel loader) — budget for it.
- **App Router vs Vite SPA.** Internal admin behind login (no SEO, initial-load not critical): a **Vite + React + React Router SPA** is the honest default — all-client, simplest deploy, existing TanStack Query/Table covers D1. Reach for **Next App Router** when you want server-side fetching (cuts client waterfalls), streamed sections, and co-located Server Actions — at the cost of a heavier Cloudflare deploy. Rule: SPA unless server-render/streaming earns its deploy complexity.
- **D1/Workers data → tables:**
  - Small (hundreds of rows, fits at once) → **client-side** pagination/sort/filter (TanStack Table default).
  - **Thousands+ in D1 → server-side**: push `LIMIT/OFFSET` (or keyset) + `ORDER BY` + `WHERE` into SQL, `manualPagination:true` (+`manualSorting`/`manualFiltering`), send `rowCount`/`pageCount`. Fetch per-page via **TanStack Query** keyed `[resource,page,sort,filter]`. **Don't ship thousands of rows to the browser.**
- **Virtualization (TanStack Virtual):** only for **long un-paginated scrolls** (~≥50 meaningful rows, clearly worth it >100; <~30 rows it's overhead). **Not** a replacement for server pagination — never "fetch-all 50k + virtualize".

## 8. Solo-dev guardrail — don't over-engineer

- **Don't install Refine** for a handful of custom screens — it's a headless CRUD framework (data-provider + resource) worth it only with **many uniform CRUD resources**. For a bespoke admin, hand-roll TanStack Query hooks over the D1 API. Harvest the **concept** (a thin data-provider interface), skip the framework.
- **Don't add a chart lib** beyond Recharts until you truly hit its ceiling (§3).
- **Don't build custom viz (visx)** when a bar chart already answers the question.
- **One dashboard shell, reused.** Don't invent a new layout per page.
- Tailwind Plus/Catalyst = **harvest the concept** (paid); shadcn blocks (free, open) cover the same ground.

## Sources (verified)

FT Visual Vocabulary (github.com/Financial-Times/chart-doctor) · Datawrapper Academy (pie / zero-baseline / area / stacked) · Shneiderman 1996 "The Eyes Have It" · NN/g (mobile tables, F-pattern, skeleton screens) · TanStack Table/Query/Virtual docs · shadcn/ui (sidebar, data-table, chart, blocks) · Tailwind responsive docs · Material Design 3 window-size-classes · Carbon Design (density) · WCAG 1.4.1/1.4.3 · Okabe-Ito palette · Vercel blog (Tremor acquisition) · Recharts/ECharts/visx/Nivo GitHub + bundlephobia · Astro islands docs.

**Unverified / inference:** chart point-count thresholds (architectural, no official number); "≤5 widgets/mobile screen" & the virtualization threshold (community practice, not a standard); "color the delta by desired direction" & granularity labeling (design judgment).
