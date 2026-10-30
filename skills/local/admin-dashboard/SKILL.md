---
name: admin-dashboard
description: >-
  Presentation of admin panels and dashboards: screen shape, IA, KPI hierarchy, charts, responsive tables, density. Not workflow (admin-product-ux), component code (shadcn-ui), data fetching, or browser proof (ui-validation).
---

# Admin Dashboard — presentation

Load `admin-product-ux` first when roles, objects, lifecycle, permissions, or
screen contracts are not already explicit; this skill arranges, it does not
invent product rules. Components come from `shadcn-ui`; data fetching,
caching, and server/client boundaries from the framework skill.

**Pick the path first:**
- Change inside an existing admin: read §1 (contract) and the sections the
  screen touches (table → §4, chart/KPI → §3, orders/tenants/permissions →
  §5), then §7. Questions the brief leaves open (which status axis, what a
  KPI counts, data volume, timezone) go back to the owner; do not guess.
- New dashboard family: §1 → §2 → the matching sections → §7.
- References at the end are for specific needs, not pre-reading.

An admin screen is quiet. Hierarchy comes from type, alignment, whitespace,
tables, queues, and split panes — not from a card around every region, icon
tiles, gradients, badges, or a KPI row nobody decides from. Build only the
screens and controls the workflow contract names; one sidebar grouped by the
operator's jobs, current location marked, no second nav; column and field
labels are the business words, with no helper sentence under every field and
no description paragraph under every page title.

## 1. Size and surface contract

Before building or changing any admin screen read
[admin-visual-contract.md](references/admin-visual-contract.md): one size and
surface contract per product (repository contract > house default > compact),
mapped to Tailwind/shadcn classes, measured by `scripts/admin-geometry.mjs`
at 390/1366/1536 against `assets/size-contracts/*.json`. Exit 1 is REVISE;
exit 3 or `NOT-CHECKED` is reported as not checked. Numbers elsewhere in this
skill are background; the contract decides.

## 2. Shell and screen shape

Pick the dashboard type first: **operational** (events needing action now:
exception tier, alerts, fast refresh), **analytical** (comparison, history,
drill-down), **strategic** (health at a glance, periodic). An order queue,
approval inbox, settings area, or list-detail flow follows its own job; do
not force KPI cards or charts onto every admin home.

Analytics shell: sidebar + header → KPI summary → trend charts → detail
table ("overview first, zoom and filter, then details on demand"). Most
important metric top-left. One shell, reused across pages.

Density ladder for rows and controls: 32 px compact (mouse/keyboard back
office), 40 default, 48 comfortable, ≥ 44 on touch. Offer a density toggle
only on views scanned for long periods.

States: loading = skeleton shaped like the final layout; empty distinguishes
**first-run** (what will appear, how to create/import), **filtered-empty**
(show active filters + clear), and **permission-denied** (say so, and who can
grant) — never one "no data"; error names the cause and recovery and keeps
entered data.

## 3. Charts and KPIs

Pick the chart from the relationship, not taste:

| Goal | Use |
|---|---|
| Trend over time | line (few periods → column) |
| Compare categories | bar; horizontal for long labels |
| Part of whole | stacked bar; pie/donut only ≤ 5 slices at ~25/50/75 shares |
| Correlation | scatter (+ size = bubble) |
| Distribution | histogram / boxplot |
| Ranking | sorted bar |
| Single number | stat card, sparkline for inline trend |
| vs target | bullet graph, not a gauge |
| Flow between states | sankey |

Bars start at zero; lines may truncate but pick an honest range. No gauges, no
3D. Stacked areas mislead when the reader compares one series — use grouped
bars or lines. Title = the question or the finding, subtitle = unit and
period.

KPI card: label, **value** (largest), delta vs previous period with arrow or
sign (not color alone), the time basis. Color the delta by the desired
direction (refunds up = red). Round (Rp 3,8 M, not Rp 3.848.305); show
variance to target as a %. Label real-time vs batched so an incomplete period
is not read as a drop.

Accessibility: never color alone between series (labels, markers, dashes);
colorblind-safe palette checked against the surface — Okabe-Ito on white
passes 3:1 only for `#0072B2 #D55E00 #009E73 #CC79A7`; the rest need outlines
or a dark surface. Seed `--chart-*` tokens, re-check the dark ramp, never
hardcode hex. Every chart gets `<figure>` + `<figcaption>` with the finding and
a data table or download. No entry animation on every refresh.

Library: Recharts (via `shadcn-ui`) by default; step up to ECharts only for
thousands of points or exotic charts, visx only for bespoke viz. Do not add a
dashboard framework (Refine) for a handful of screens. Version, SSR, and
runtime details belong to the framework skill and the lockfile. Chart craft,
sequential/diverging ramps, COD waterfalls, cohort heatmaps, and `@media
print` documents: [dataviz-and-print-specs.md](references/dataviz-and-print-specs.md).

## 4. Tables and responsive transformation

Breakpoints: `< md` drawer nav + cards/scroll; `md–lg` icon rail + priority
columns; `≥ lg` full sidebar + multi-pane. The rail never hides the current
location. If tablet portrait (600–767) matters, switch the rail at
`min-[600px]`.

Table on narrow screens — pick one: horizontal scroll with sticky header and
first column plus a scroll cue (few columns); priority columns + expandable
row (many columns, comparison); card/stack per row (scan-and-tap lists);
filter-first (specific slice). Phone is a task subset: actionable counts that
deep-link into filtered lists, not a KPI grid; no swipe-to-delete on money
records; no hover-only tooltips.

Table craft: text left, numbers right in `tabular-nums` with one precision
per column; light row lines (zebra only on wide read-only numeric tables);
sticky header and identifier column on horizontal scroll; detail path by
amount of detail (expand row, side panel, modal, page). `<table>` with
`aria-sort` for read-mostly lists; `role="grid"` only for cell-by-cell
editing with the APG keyboard model.

Filters mirror visible fields; live for cheap choices, Apply for heavy
backends; applied filters shown as removable chips above results; state in
the URL; saved views only when the workflow contract names them. Toolbar collapses to one Filters button opening a sheet
on narrow screens. Batch mode: selected rows swap the toolbar for a batch bar
(≤ 5 actions), header checkbox indeterminate, select-on-page vs across-pages
explicit, partial failure reported as `23 of 40 updated` with the 17.

Edit: inline for frequent single fields (Enter saves, Esc cancels); side panel
when the list must stay visible; object page with draft for multi-field.

Server pagination for thousands of rows (`LIMIT/OFFSET` or keyset, `rowCount`
from the server, reset page on filter change); client pagination for
hundreds. Virtualization reduces render cost only — never "fetch all +
virtualize". `COUNT(*)` on a filtered large table is the hidden cost; past a
few hundred thousand rows offer an approximate count or `hasNextPage`.
TanStack Table dialects differ by major; read the lockfile and the installed
package's `skills/` before writing either. Start from an existing shadcn data
table item rather than hand-rolling.

## 5. Operator surfaces

- **Timezone.** A "Today" KPI computed in UTC against a WIB operation is wrong
  seven hours a day, silently. State the zone next to every period label and
  compute boundaries in the operation's zone.
- **Currency.** `Intl.NumberFormat('id-ID', { style: 'currency', currency:
  'IDR', maximumFractionDigits: 0 })` for display only — it rounds; store and
  sum integer rupiah or exact decimals. Negative ledger values need a sign or
  parentheses, not color. Right-align money, one currency per column.
- **Order status is several axes** (order, payment, fulfillment, return), not
  one merged column; tabs follow the axis the operator works. A COD order is
  not a payment: never imply money received because a row says "confirmed".
- **Bulk actions.** Sticky action bar that never covers the focused row
  (`scroll-padding`); destructive confirmation names the count.
- **Multi-tenant.** Persistent "which store am I in"; per-store vs aggregate
  KPIs labelled. Impersonation shows a persistent banner with one-click exit
  and records both operator and impersonated user on every action.
- **Permissions.** Hide what the role can never do; disable with a visible
  reason (helper text or focusable popover, not a tooltip on a disabled
  control) when object state forbids it; 403 is the server backstop. Audit
  logs are append-only with actor and before/after.
- **Destructive tiers.** High (irreversible/wide) → type the name, state the
  restore window; medium → two-click friction; low → no confirm, offer Undo.
  Buttons name the action; dirty forms get a navigation guard.
- **Drag is never the only way** (move up/down, "Move to…").
- **Refresh.** Poll only where a missed item costs money (order queue, chat),
  30–60 s; elsewhere manual refresh plus a "new since you loaded" badge; never
  reorder rows under the cursor.
- **Export** the filtered set, not the page; say whether it was sync or queued.

Queue, inventory, ledger, audit-log, and search presentation detail:
[operator-surfaces.md](references/operator-surfaces.md).

## 6. Stack fit

Route-oriented admin with bounded interactive regions fits Astro with one
hydrated React root per coordinated region (islands do not share context).
Pervasive client routing or one cross-page interaction graph fits a React or
Next app. App Router is the house default for a new integrated admin because
existing admins share its auth and deployment path; Vite/React fits an
API-backed client app. None of this is a rewrite mandate for a working admin.
Implementation (server/client boundary, streaming, Server Actions,
revalidation, lazy charts, adapters) belongs to `nextjs-development` /
`astro-development`; check the project's Dockerfile and adapter before
assuming a deploy target.

## 7. Delivery

Build or change → critique against the sections you used and fix →
`admin-geometry.mjs` exits 0 on every changed route → `ui-validation`
browser proof → done.

| When | Reference |
| --- | --- |
| Queue, inventory, ledger, audit-log, or search screen detail | operator-surfaces.md |
| Chart craft, ramps, waterfalls, cohorts, printable documents | dataviz-and-print-specs.md |
| Project has no theme yet and needs a quiet starting point | clean-light-cms-baseline.md |
| Building a URL-as-state table or feature-first Next admin from scratch | next-shadcn-starter-patterns.md |
| Nav registry, RBAC, impersonation patterns from production admins | github-admin-patterns.md |
| Checking where a number or rule came from | sources.md |
