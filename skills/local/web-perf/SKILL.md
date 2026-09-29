---
name: web-perf
description: Audit, diagnose, or optimize web page load and interaction performance (Core Web Vitals, Lighthouse performance, traces, network, bundles). Not UI behavior QA (ui-validation) or visual design (design-taste). Prefers Chrome DevTools MCP; without it, still runs a codebase and static-asset audit via the project's own scripts and reports which metrics stayed unmeasured instead of stopping. Biases towards retrieval from current documentation over pre-trained knowledge.
---

# Web Performance Audit

Your knowledge of web performance metrics, thresholds, and tooling APIs may be outdated. **Prefer retrieval over pre-training** when citing specific numbers or recommendations.

## Retrieval Sources

| Source | How to retrieve | Use for |
|--------|----------------|---------|
| web.dev | `https://web.dev/articles/vitals` | Core Web Vitals thresholds, definitions |
| Chrome DevTools docs | `https://developer.chrome.com/docs/devtools/performance` | Tooling APIs, trace analysis |
| Lighthouse scoring | `https://developer.chrome.com/docs/lighthouse/performance/performance-scoring` | Score weights, metric thresholds |
| Chrome DevTools MCP | `https://github.com/ChromeDevTools/chrome-devtools-mcp` (`docs/tool-reference.md`, `docs/configuration.md`) | Current tool names, parameters, server flags |

## FIRST: Verify MCP Tools Available

**Run this before starting.** Discover which browser and performance tools
are actually exposed — try `list_pages`, `navigate_page`, or
`performance_start_trace`. Tool presence is not all-or-nothing: a server
started with `--slim` exposes only three tools (navigation, script execution,
screenshots) and no trace tools, so treat it as the degraded path below.

If the trace tools exist, run the full workflow below.

If they don't, the `chrome-devtools` MCP server isn't configured on this
machine. **Changing MCP configuration is a user-scope change: do it only when
the user asked for setup or it is clearly within the authorized scope;
otherwise ask first** and continue on the degraded path meanwhile. Register it
through the CLI rather than hand-editing JSON:

```bash
npm i -g chrome-devtools-mcp   # persistent binary; no per-launch download
claude mcp add --scope user chrome-devtools chrome-devtools-mcp -- \
  --headless --executablePath /usr/bin/google-chrome
```

**`--headless` is not optional when you work over SSH.** The server defaults to
`--headless: false`, so with no `DISPLAY` it tries to open a window that has
nowhere to go and fails. Verified on the Linux box: headless Chrome renders,
runs JS, and serves CDP fine through an SSH session with `DISPLAY` empty.

The global install pins whatever version was installed; upstream's
[quick start](https://github.com/ChromeDevTools/chrome-devtools-mcp#getting-started)
instead runs `npx -y chrome-devtools-mcp@latest` so the client always gets the
latest server. Either is fine — with the global binary, update it periodically
(`npm i -g chrome-devtools-mcp@latest`), because tool names and parameters
change between releases.

Other things that bite:

- **Headless defaults to a ~780px viewport.** That silently makes every
  measurement a narrow-screen measurement. Pass `--viewport 1280x720` (or
  another size) to the server, or `emulate(viewport: ...)` per page, before
  reading anything as a desktop number.
- **Trace URLs may be sent to Google's CrUX API.** The performance tools fetch
  real-user field data for the traced URL and present it beside the lab data.
  Pass `--no-performance-crux` when auditing private, staging, or
  pre-release URLs. When CrUX data does come back, report it as **field
  data** and keep it separate from the lab trace numbers.
- **Usage statistics are on by default.** Opt out with `--no-usage-statistics`
  (or the `CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS` env var) if the user
  wants no telemetry.
- **Current releases require a `pageId` on page-scoped tools** (`emulate`,
  `performance_start_trace`, `lighthouse_audit`, …). Get it from
  `list_pages` or `new_page`; the calls in this file omit it for brevity.
  If a parameter is rejected, read the live tool schema rather than guessing
  ([tool reference](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md)).
- To drive a browser you can actually *see* on a machine that has a GUI, start
  Chrome there with `--remote-debugging-port=9222` and attach with
  `--browserUrl http://127.0.0.1:9222` instead of launching a private headless
  one. Useful for visual debugging; unnecessary for pure measurement.

### Degraded path (no MCP) — do NOT just stop

`design-taste`, `admin-dashboard`, `storefront-ux`, and `ui-validation` all
delegate performance work here, so a hard stop leaves four skills with a dead
end. Without the MCP you cannot measure field or lab metrics — say that
plainly, never estimate a number — but you can still do real work:

1. **Phase 5 (codebase analysis) runs unchanged** and is the highest-value part
   when you have repo access. Bundle composition, render-blocking patterns,
   font loading, image formats, and cache headers are all readable from source
   and config.
2. **Use the project's own scripts first** (`package.json`): an existing
   `build`, `analyze`, `lighthouse`, or bundle-visualiser script beats any tool
   you would add. Build output already reports bundle sizes.
3. **If a browser can actually be driven** — the project has a working
   Playwright runner, or a system browser Playwright can point at — hand that
   work to `ui-validation` ("Performance evidence requested by web-perf" in its
   §5). It returns raw page-reported numbers: `PerformanceObserver` entries,
   `performance.getEntriesByType('navigation'|'resource')`, console errors,
   failed requests. Coarse single-run lab numbers, but real and measured — you
   interpret them, it does not. Declaring Playwright in `package.json` is not
   the same as having its browsers installed; check before promising this step.
4. **Static asset audit** needs no browser: hero image dimensions and format,
   self-hosted vs remote fonts, `font-display`, missing width/height causing
   CLS, third-party script tags in `<head>`.

Report exactly which metrics remain **unmeasured** and that closing the gap
needs the MCP or a Lighthouse run. Never present a codebase inference as a
measured Core Web Vital.

## Key Guidelines

- **Be assertive**: Verify claims by checking network requests, DOM, or codebase—then state findings definitively.
- **Verify before recommending**: Confirm something is unused before suggesting removal.
- **Quantify impact**: Use estimated savings from insights. Don't prioritize changes with 0ms impact.
- **Skip non-issues**: If render-blocking resources have 0ms estimated impact, note but don't recommend action.
- **Be specific**: Say "compress hero.png (450KB) to WebP" not "optimize images".
- **Prioritize ruthlessly**: A site with 200ms LCP and 0 CLS is already excellent—say so.

## Quick Reference

| Task | Tool Call |
|------|-----------|
| Load page | `navigate_page(url: "...")` |
| Set lab profile | `emulate(networkConditions: "Slow 4G", cpuThrottlingRate: 4, viewport: "390x844x2,mobile,touch")` |
| Start trace | `performance_start_trace(autoStop: true, reload: true)` |
| Analyze insight | `performance_analyze_insight(insightSetId: "...", insightName: "...")` |
| List requests | `list_network_requests(resourceTypes: ["Script", "Stylesheet", ...])` |
| Request details | `get_network_request(reqid: <id>)` |
| A11y tree snapshot | `take_snapshot(verbose: true)` |
| Complementary accessibility/SEO/best-practices audit | `lighthouse_audit(mode: "navigation", device: "mobile")` |

## Workflow

Copy this checklist to track progress:

```
Audit Progress:
- [ ] Phase 1: Explicit lab profile + performance trace (emulate + navigate + record)
- [ ] Phase 2: Core Web Vitals analysis (includes CLS culprits)
- [ ] Phase 3: Network analysis
- [ ] Phase 4: Accessibility snapshot + complementary Lighthouse audit
- [ ] Phase 5: Codebase analysis (skip if third-party site)
```

### Phase 1: Performance Trace

1. Select the page (`list_pages` / `new_page` → `pageId`), then set and record an explicit lab profile before navigating. A representative constrained-mobile profile is:
   ```
   emulate(
     networkConditions: "Slow 4G",
     cpuThrottlingRate: 4,
     viewport: "390x844x2,mobile,touch"
   )
   ```
   This is a reproducible house scenario, not a claim of exact Lighthouse or field equivalence. Use a different profile when the audience evidence requires it, but report the chosen CPU, network, viewport, mobile, and touch settings. If throttling is intentionally omitted, label every result **unthrottled best-case lab data**.

2. Navigate to the target URL after emulation is active:
   ```
   navigate_page(url: "<target-url>")
   ```

3. Start a performance trace with reload to capture cold-load metrics:
   ```
   performance_start_trace(autoStop: true, reload: true)
   ```

4. Wait for trace completion, then retrieve results. Keep the same profile for comparison runs.

**Troubleshooting:**
- If trace returns empty or fails, verify the page loaded correctly with `navigate_page` first
- If insight names don't match, inspect the trace response to list available insights

### Phase 2: Core Web Vitals Analysis

Use `performance_analyze_insight` to extract key metrics.

**Note:** Insight names may vary across Chrome DevTools versions. If an insight name doesn't work, check the `insightSetId` from the trace response to discover available insights.

Common insight names:

| Metric | Insight Name | What to Look For |
|--------|--------------|------------------|
| LCP | `LCPBreakdown` | Time to largest contentful paint; breakdown of TTFB, resource load, render delay |
| CLS | `CLSCulprits` | Elements causing layout shifts (images without dimensions, injected content, font swaps) |
| Render Blocking | `RenderBlocking` | CSS/JS blocking first paint |
| Document Latency | `DocumentLatency` | Server response time issues |
| Network Dependencies | `NetworkRequestsDepGraph` | Request chains delaying critical resources |

Example:
```
performance_analyze_insight(insightSetId: "<id-from-trace>", insightName: "LCPBreakdown")
```

**Key thresholds (good/needs-improvement/poor):**
- TTFB: < 800ms / < 1.8s / > 1.8s
- FCP: < 1.8s / < 3s / > 3s
- LCP: < 2.5s / < 4s / > 4s
- INP: < 200ms / < 500ms / > 500ms
- TBT: < 200ms / < 600ms / > 600ms
- CLS: < 0.1 / < 0.25 / > 0.25
- Speed Index: < 3.4s / < 5.8s / > 5.8s

### Phase 3: Network Analysis

List all network requests to identify optimization opportunities:
```
list_network_requests(resourceTypes: ["Script", "Stylesheet", "Document", "Font", "Image"])
```

**Look for:**

1. **Render-blocking resources**: JS/CSS in `<head>` without `async`/`defer`/`media` attributes
2. **Network chains**: Resources discovered late because they depend on other resources loading first (e.g., CSS imports, JS-loaded fonts)
3. **Missing preloads**: Critical resources (fonts, hero images, key scripts) not preloaded
4. **Caching issues**: Missing or weak `Cache-Control`, `ETag`, or `Last-Modified` headers
5. **Large payloads**: Uncompressed or oversized JS/CSS bundles
6. **Unused preconnects**: If flagged, verify by checking if ANY requests went to that origin. If zero requests, it's definitively unused—recommend removal. If requests exist but loaded late, the preconnect may still be valuable.

For detailed request info:
```
get_network_request(reqid: <id>)
```

### Phase 4: Accessibility Snapshot

Take an accessibility tree snapshot:
```
take_snapshot(verbose: true)
```

Run the complementary Lighthouse audit for accessibility, SEO, and best practices:
```
lighthouse_audit(mode: "navigation", device: "mobile")
```

This tool explicitly excludes performance; the trace remains the performance authority. Treat Lighthouse as a broad automated screen, not proof of keyboard behavior or cross-viewport accessibility. Route those interaction claims to `ui-validation`.

**Flag high-level gaps:**
- Missing or duplicate ARIA IDs
- Elements with poor contrast ratios (check against WCAG AA: 4.5:1 for normal text, 3:1 for large text)
- Focus traps or missing focus indicators
- Interactive elements without accessible names

## Phase 5: Codebase Analysis

**Skip if auditing a third-party site without codebase access.**

Analyze the codebase to understand where improvements can be made.

### Detect Framework & Bundler

Search for configuration files to identify the stack:

| Tool | Config Files |
|------|--------------|
| Webpack | `webpack.config.js`, `webpack.*.js` |
| Vite | `vite.config.js`, `vite.config.ts` |
| Rollup | `rollup.config.js`, `rollup.config.mjs` |
| esbuild | `esbuild.config.js`, build scripts with `esbuild` |
| Parcel | `.parcelrc`, `package.json` (parcel field) |
| Next.js | `next.config.js`, `next.config.mjs` |
| Nuxt | `nuxt.config.js`, `nuxt.config.ts` |
| SvelteKit | `svelte.config.js` |
| Astro | `astro.config.mjs` |

Also check `package.json` for framework dependencies and build scripts.

### Tree-Shaking & Dead Code

- **Webpack**: Check for `mode: 'production'`, `sideEffects` in package.json, `usedExports` optimization
- **Vite/Rollup**: Tree-shaking enabled by default; check for `treeshake` options
- **Look for**: Barrel files (`index.js` re-exports), large utility libraries imported wholesale (lodash, moment)

### Unused JS/CSS

- Check for CSS-in-JS vs. static CSS extraction
- Look for PurgeCSS/UnCSS configuration (Tailwind's `content` config)
- Identify dynamic imports vs. eager loading

### Polyfills

- Check for `@babel/preset-env` targets and `useBuiltIns` setting
- Look for `core-js` imports (often oversized)
- Check `browserslist` config for overly broad targeting

### Compression & Minification

- Check for `terser`, `esbuild`, or `swc` minification
- Look for gzip/brotli compression in build output or server config
- Check for source maps in production builds (should be external or disabled)

## Output Format

Present findings as:

1. **Core Web Vitals Summary** - Table with metric, value, and rating (good/needs-improvement/poor)
2. **Top Issues** - Prioritized list of problems with estimated impact (high/medium/low)
3. **Recommendations** - Specific, actionable fixes with code snippets or config changes
4. **Codebase Findings** - Framework/bundler detected, optimization opportunities (omit if no codebase access)
