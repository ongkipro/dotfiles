---
name: web-perf
description: >-
  Audit, diagnose, or optimize page load and interaction performance: Core Web Vitals, Lighthouse, traces, network, bundles; Chrome DevTools MCP preferred, static audit otherwise. Not UI behavior QA (ui-validation) or visual design (design-taste).
---

# Web Performance Audit

**Prefer retrieval over pre-training** when citing thresholds, scoring weights,
or Chrome DevTools MCP parameters. Detailed MCP setup flags, trace insight
names, and per-stack codebase checklists live in
[trace-and-codebase-playbook.md](references/trace-and-codebase-playbook.md).

**Pick the path first:**

| Situation | Do |
|---|---|
| Trace MCP tools exposed (`emulate`, `performance_start_trace`) | Run Phases 1–4 (§2), plus Phase 5 when repo access exists |
| No trace tools (`--slim` server or MCP unconfigured) | Run the degraded path (§1.1) + Phase 5 — never hard-stop |
| Need MCP registration flags, insight table, or per-stack checklists | Open [trace-and-codebase-playbook.md](references/trace-and-codebase-playbook.md) |

## Retrieval Sources

| Source | How to retrieve | Use for |
|--------|----------------|---------|
| web.dev | `https://web.dev/articles/vitals` | Core Web Vitals thresholds, definitions |
| Chrome DevTools docs | `https://developer.chrome.com/docs/devtools/performance` | Tooling APIs, trace analysis |
| Lighthouse scoring | `https://developer.chrome.com/docs/lighthouse/performance/performance-scoring` | Score weights, metric thresholds |
| Chrome DevTools MCP | `https://github.com/ChromeDevTools/chrome-devtools-mcp` (`docs/tool-reference.md`, `docs/configuration.md`) | Current tool names, parameters, server flags |
| INP phases | `https://web.dev/articles/optimize-inp` (verified 2026-10-02) | Input delay / processing duration / presentation delay |
| Tailwind v4 sources | `https://tailwindcss.com/docs/detecting-classes-in-source-files` (verified 2026-10-02) | Automatic detection, `@source`, dynamic class names |

## 1. Verify MCP Tools First

Discover exposed tools before starting (`list_pages`, `navigate_page`,
`performance_start_trace`). A server started with `--slim` exposes navigation,
script execution, and screenshots but **no trace tools** — treat `--slim` as the
degraded path below.

**MCP configuration is a user-scope change:** register or modify it only when
the user asked for setup or it is clearly within authorized scope; otherwise ask
first and run the degraded path meanwhile. On dotfiles machines, shared
cross-CLI registration lives in `config/ai/mcp-servers.json` + `ai-mcp-sync`;
single-runtime Claude CLI setup and full flags are in
[trace-and-codebase-playbook.md](references/trace-and-codebase-playbook.md) §1.

Operational traps that silently corrupt audits:
- **SSH requires `--headless`** (server defaults to `--headless: false` and fails when `DISPLAY` is empty).
- **Headless defaults to ~780 px width** — pass `--viewport 1280x720` or call `emulate(viewport: ...)` before reading desktop numbers.
- **CrUX URL lookup is on by default** — pass `--no-performance-crux` on staging/private URLs; keep CrUX **field data** separate from lab trace numbers; opt out of telemetry with `--no-usage-statistics`.
- **`pageId` is required** on page-scoped tools (`emulate`, `performance_start_trace`, `lighthouse_audit`); fetch it from `list_pages` or `new_page`, and attach to a visible browser via `--browserUrl http://127.0.0.1:9222` only when visual debugging is needed.

### 1.1 Degraded path (no MCP) — do NOT just stop

`design-taste`, `admin-dashboard`, `storefront-ux`, and `ui-validation` all
delegate performance work here. Without trace MCP tools you cannot measure lab
trace insights — state that plainly and never invent or estimate a Core Web
Vital — while executing all four steps that still hold:

1. **Phase 5 codebase analysis runs unchanged** (bundle composition, `'use client'` / island boundaries, render-blocking tags, font loading, image pipelines, cache headers).
2. **Run the project's own scripts first** (`package.json` `build`, `analyze`, `lighthouse`): production build output already gives real chunk sizes.
3. **If a real browser is runnable** (project Playwright runner or system Chrome), hand raw browser collection to `ui-validation` (§2 / recipes "raw timings for `web-perf`"): `PerformanceObserver` entries, `navigation`/`resource` timings, console errors, and failed requests. You interpret the numbers; check that browser binaries actually exist before promising this step.
4. **Static asset audit**: hero image dimensions/format/`fetchpriority`, self-hosted vs remote fonts and `font-display`, unsized media causing CLS, and synchronous third-party `<script>` tags in `<head>`.

Name every metric that remains **unmeasured** and state that closing the gap
requires Chrome DevTools MCP or Lighthouse.

## 2. Workflow

1. **Phase 1 — Explicit lab profile + trace:** Get `pageId` (`list_pages` / `new_page`), set a reproducible profile before navigating — default constrained mobile: `emulate(networkConditions: "Slow 4G", cpuThrottlingRate: 4, viewport: "390x844x2,mobile,touch")` — then `navigate_page(url)` and `performance_start_trace(autoStop: true, reload: true)` (if empty, verify `navigate_page` loaded first). Keep the exact same profile on before/after comparison runs, and always report CPU, network, viewport, mobile, and touch settings; if unthrottled, label every number **unthrottled best-case lab data**.
2. **Phase 2 — Core Web Vitals & LCP subpart triage:** Run `performance_analyze_insight` (`LCPBreakdown`, `LCPDiscovery`, `CLSCulprits`, `RenderBlocking`, `DocumentLatency`, `NetworkRequestsDepGraph` — table in [playbook §2](references/trace-and-codebase-playbook.md)). Split LCP into its four subparts (**TTFB**, **resource load delay**, **resource load duration**, **element render delay**) before recommending fixes: shrinking an image will not fix an LCP dominated by render delay or late discovery, and an empty LCP resource URL indicates a text LCP gated on web fonts.
   - **Thresholds (good / needs-improvement / poor):** TTFB `< 800ms / < 1.8s / > 1.8s` · FCP `< 1.8s / < 3s / > 3s` · LCP `< 2.5s / < 4s / > 4s` · INP `< 200ms / < 500ms / > 500ms` · TBT `< 200ms / < 600ms / > 600ms` · CLS `< 0.1 / < 0.25 / > 0.25` · Speed Index `< 3.4s / < 5.8s / > 5.8s`.
3. **Phase 3 — Network analysis:** Call `list_network_requests` (`Script`, `Stylesheet`, `Document`, `Font`, `Image`) and `get_network_request(reqid)`. Check render-blocking `<head>` tags, late request chains, missing preloads, weak `Cache-Control`/missing compression, oversized bundles, and unused preconnects (recommend removing a preconnect only when zero requests hit that origin).
4. **Phase 4 — Accessibility snapshot & complementary Lighthouse:** Run `take_snapshot(verbose: true)` and `lighthouse_audit(mode: "navigation", device: "mobile")`. `lighthouse_audit` excludes performance (the trace stays authoritative); treat it as an automated screen for ARIA/contrast/name gaps and route keyboard, focus-trap, and cross-viewport interaction proof to `ui-validation`.
5. **Phase 5 — Codebase & INP analysis** *(skip when no repo access)*: Follow [playbook §3](references/trace-and-codebase-playbook.md) across:
   - **Stack & tree-shaking:** Vite/Rollup/Astro, Next.js (Turbopack/webpack, `optimizePackageImports`, leaf `'use client'` boundaries), barrel imports, wholesale utility imports.
   - **Unused JS/CSS:** Tailwind v4 automatic scanning + `@source` / dynamic class traps (vs v3 `content`), Astro `client:*` islands, `next/dynamic` & `next/script`.
   - **Images:** `astro:assets`, `next/image` (`sizes`, LCP preload), Shopify `image_url` + `image_tag`, Cloudflare Images `format=auto`, intrinsic dimensions, `fetchpriority="high"` on the LCP image only, no CSS-background heroes.
   - **INP:** Reload traces never measure INP; record a non-reload interaction trace (or report INP unmeasured) and attribute latency to **input delay**, **processing duration**, or **presentation delay** before mapping to handlers and re-renders.
   - **Targets & delivery:** Modern `browserslist`/`build.target`, default minification intact, `br`/`gzip`/`zstd` + immutable `Cache-Control`, no inline prod source maps.

## Key Guidelines

- **Verify before recommending:** Confirm code/preconnects/assets are actually unused or impactful in network/DOM/source; skip 0 ms insights.
- **Be specific and proportionate:** Name exact files, byte sizes, and ms savings ("compress `hero.png` 450 KB → WebP"); if LCP is 200 ms and CLS is 0, say it is already fast.

## Output Format

1. **Core Web Vitals Summary** — Metric, value, rating (good / needs-improvement / poor), lab profile vs field data, and any unmeasured metrics.
2. **Top Issues** — Prioritized findings with quantified impact (high / medium / low).
3. **Recommendations** — Actionable code or config changes targeting the dominant bottleneck.
4. **Codebase Findings** — Stack/bundler detected and structural opportunities (omit if third-party site).
