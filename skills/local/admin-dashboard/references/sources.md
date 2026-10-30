# Sources and verification dates

Moved out of SKILL.md so the rules stay readable; re-check before relying on
any version-specific claim.

## Standards and research

- Shneiderman, "The Eyes Have It" (IEEE VL 1996) — overview, zoom/filter, details.
- Few — *Dashboard Confusion* (2004), *Common Pitfalls* (2006), bullet graph spec (rev. 2013-10-10).
- NN/g — dashboards (2017-06-18), data tables (2022-04-03), mobile tables (2017-09-17), confirmation dialogs (2018, rev. 2026-08-07), F-pattern (text eye-tracking, 2006), skeleton screens.
- Bera, CACM 2016-03-23 — color misuse slows dashboard decisions.
- FT Visual Vocabulary (`Financial-Times/chart-doctor`, dormant since 2024) and Datawrapper Academy (zero baseline, pie, stacked area).
- UK Analysis Function charts (2022-05-19); Chartability (EuroVis 2022); W3C WAI Complex Images (2026-04-08).
- WCAG 2.2: 1.4.1, 1.4.3, 1.4.11, 2.4.11, 2.5.7, 2.5.8. WAI-ARIA APG Grid pattern (verified 2026-10-02).
- Carbon data table (2026-09-30) and status indicators (2026-08-12); Fluent v9 table rows; Material 3 window-size classes.
- GitLab Pajamas destructive actions (2026-07-13) and empty states; Atlassian inline edit.
- Pencil & Paper data-table (2026-02-23) and filter (2026-03-16) analyses.
- Vercel Web Interface Guidelines (tabular numerals, URL filter state).
- Okabe-Ito palette; ColorBrewer; Tableau 10.
- Shopify order status model, bulk fulfillment, mobile app changelog (2021-01-22); TikTok Shop seller university; Odoo 18.
- OWASP Logging Cheat Sheet; NIST 800-53 r5 AU-9.
- MDN `Intl.NumberFormat` (2026-08-21) plus a local Node 24 check (2026-10-08).

## Libraries (volatile — read the lockfile first)

- TanStack Table v9 (Aug 2026): `useTable`, opt-in `tableFeatures`, row models renamed; `@tanstack/react-table/legacy` is a bridge. The 9.2.4 tarball ships agent skills under `node_modules/@tanstack/react-table/skills/` (verified 2026-10-02).
- TanStack Query v5 with server-paginated tables: state in `queryKey`, `placeholderData: keepPreviousData`, server `rowCount`.
- Recharts: client-only SVG; no `"use client"` of its own; wrap in a client leaf in App Router (verified 2026-08-10).
- ECharts on Workers: `renderToSVGString()` is an instance method; `nodejs_compat` flag required; tree-shake via `echarts/core`.
- `echarts-for-react`: unofficial; malicious publishes 3.0.7 / 3.1.7 / 3.2.7 on 2026-05-19 (compromised maintainer account); 3.0.7 still resolves and `size-sensor@1.0.4` is compromised. Pin ≤ 3.0.6 if already present; otherwise wrap `echarts.init` in a `useEffect`.
- visx: pin `^4.0.0`; the `next` dist-tag points at an older alpha.
- Chart.js and Observable Plot need a DOM — not for plain Workers SSR.
- shadcn data tables: `sadmann7/tablecn` / Dice UI, `openstatusHQ/data-table-filters` (MIT).
- AGPL products (Dub, Midday, OpenStatus app, Plane, Twenty, coss ui): study patterns, never paste files.

## House rules without upstream basis

Virtualization thresholds (~≥ 50 rows worth it, > 100 clearly), "≤ 5 widgets per
mobile screen", delta colored by desired direction, granularity labelling, and
the operator-surface rules in SKILL.md §5 are accumulated practice.
