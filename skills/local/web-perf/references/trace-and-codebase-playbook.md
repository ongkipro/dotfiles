# Web Performance — Trace Setup, Insights, and Codebase Playbook

Companion reference for `SKILL.md`. Open the section your audit needs.

## 1. Chrome DevTools MCP Setup & Runtime Gotchas

**Changing MCP configuration is a user-scope change: do it only when the user
asked for setup or it is clearly within the authorized scope; otherwise ask
first** and continue on the degraded path in `SKILL.md` meanwhile.

- **Shared dotfiles registration (multi-CLI machines):** Edit
  `~/dotfiles/config/ai/mcp-servers.json` and run `ai-mcp-sync` (never
  hand-edit generated runtime configs).
- **Single-runtime Claude CLI registration:**
  ```bash
  npm i -g chrome-devtools-mcp   # persistent binary; no per-launch download
  claude mcp add --scope user chrome-devtools chrome-devtools-mcp -- \
    --headless --viewport 1280x720 --no-performance-crux --no-usage-statistics \
    --executablePath /usr/bin/google-chrome
  ```

### Operational traps

- **`--headless` is mandatory over SSH.** The server defaults to
  `--headless: false`; with `DISPLAY` empty it tries to open a window and fails.
  Headless Chrome renders, runs JS, and serves CDP cleanly over SSH.
- **Pinned global binary vs `npx`.** A global install avoids per-launch
  downloads; update it periodically (`npm i -g chrome-devtools-mcp@latest`)
  because tool names and parameters change between releases. Upstream's quick
  start (`npx -y chrome-devtools-mcp@latest`) always pulls the latest release.
- **Headless defaults to a ~780 px viewport.** Without `--viewport 1280x720`
  (or per-page `emulate(viewport: ...)`), desktop measurements silently run at a
  narrow width.
- **CrUX field-data lookup (`--no-performance-crux`).** By default, performance
  tools send traced URLs to Google's CrUX API to display real-user field data
  alongside lab numbers. Pass `--no-performance-crux` for private, staging, or
  pre-release URLs. When CrUX data is returned, report it explicitly as **field
  data**, separate from lab trace numbers.
- **Telemetry opt-out.** Usage statistics are enabled by default; disable with
  `--no-usage-statistics` or `CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS=1`.
- **`pageId` on page-scoped tools.** Current releases require `pageId` (from
  `list_pages` or `new_page`) on `emulate`, `performance_start_trace`,
  `lighthouse_audit`, etc. Read the live tool schema if a parameter is rejected
  ([tool reference](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md)).
- **Attaching to a visible GUI browser.** On a desktop with a display, launch
  Chrome with `--remote-debugging-port=9222` and pass
  `--browserUrl http://127.0.0.1:9222` when visual debugging helps.

---

## 2. MCP Tool Quick Reference & Trace Insights

### Tool calls (pass `pageId` where required by the live schema)

| Task | Tool Call |
|------|-----------|
| List / open page | `list_pages()` / `new_page(url: "...")` |
| Set lab profile | `emulate(networkConditions: "Slow 4G", cpuThrottlingRate: 4, viewport: "390x844x2,mobile,touch")` |
| Load page | `navigate_page(url: "...")` |
| Cold-load trace | `performance_start_trace(autoStop: true, reload: true)` |
| Analyze insight | `performance_analyze_insight(insightSetId: "...", insightName: "...")` |
| List requests | `list_network_requests(resourceTypes: ["Script", "Stylesheet", "Document", "Font", "Image"])` |
| Request details | `get_network_request(reqid: <id>)` |
| A11y tree snapshot | `take_snapshot(verbose: true)` |
| Complementary audit (no perf) | `lighthouse_audit(mode: "navigation", device: "mobile")` |

### Common `performance_analyze_insight` names

Insight names vary across Chrome DevTools versions; inspect `insightSetId` in
the trace response to list the exact insights available in your session.

| Metric | Insight Name | What to Look For |
|--------|--------------|------------------|
| LCP | `LCPBreakdown` | Time to largest contentful paint; breakdown of TTFB, resource load delay, resource load duration, element render delay |
| LCP Discovery | `LCPDiscovery` | Whether the LCP resource was discoverable in initial HTML (lazy-loaded, JS/CSS-injected, missing `fetchpriority="high"`) |
| CLS | `CLSCulprits` | Elements causing layout shifts (unsized images/embeds, injected banners, late font swaps) |
| Render Blocking | `RenderBlocking` | CSS/JS in `<head>` blocking first paint (check estimated ms savings; skip 0 ms items) |
| Document Latency | `DocumentLatency` | Redirect chains, slow TTFB, missing document compression |
| Network Dependencies | `NetworkRequestsDepGraph` | Critical-path request chains (CSS `@import`, JS-fetched fonts/config) |

### Network request checklist (`list_network_requests` + `get_network_request`)

1. **Render-blocking resources**: `<head>` JS/CSS lacking `async`, `defer`, or `media`.
2. **Network chains**: Late-discovered fonts, CSS `@import` cascades, client waterfalls.
3. **Missing preloads**: Critical hero media or primary self-hosted `.woff2` fonts discovered late.
4. **Caching**: Missing or weak `Cache-Control`, `ETag`, or `Last-Modified` on static/hashed assets.
5. **Payloads**: Uncompressed responses (missing `br`/`gzip`/`zstd`) or oversized JS/CSS chunks.
6. **Unused preconnects**: Verify whether *any* request hit that origin; zero requests = remove, late critical requests = keep.

### Accessibility & complementary Lighthouse notes

- `lighthouse_audit` in `chrome-devtools-mcp` covers accessibility, SEO, and best practices (it excludes performance; the trace is the performance authority).
- Flag missing/duplicate ARIA IDs, WCAG AA contrast failures (< 4.5:1 normal text, < 3:1 large text), missing accessible names, and focus-indicator gaps.
- Route interactive keyboard, dialog focus-trap, and cross-viewport behavioral proof to `ui-validation`.

---

## 3. Phase 5: Codebase Analysis Playbook

Skip when auditing an external third-party site without repository access.

### Detect Framework & Bundler

Check `package.json` scripts/dependencies and config files:

| Tool | Config Files |
|------|--------------|
| Vite | `vite.config.js`, `vite.config.ts` |
| Astro | `astro.config.mjs`, `astro.config.ts` (builds on Vite) |
| Next.js | `next.config.js`, `next.config.mjs`, `next.config.ts` |
| SvelteKit / Nuxt | `svelte.config.js` / `nuxt.config.js`, `nuxt.config.ts` |
| Rollup / esbuild | `rollup.config.*`, `esbuild.config.js`, build scripts |
| Webpack / Parcel | `webpack.config.js`, `webpack.*.js` / `.parcelrc` |

### Tree-Shaking & Dead Code

- **Vite / Rollup / Astro**: Tree-shaking is enabled by default; inspect `build.rollupOptions`, `manualChunks`, and `sideEffects` in dependency `package.json` files.
- **Next.js (Turbopack or webpack)**: Check which bundler the build script uses, `experimental.optimizePackageImports` (verify the installed Next version's default-optimized package list in docs), and whether `'use client'` sits at small interactive leaves rather than pulling large server subtrees into the client bundle.
- **Webpack (legacy)**: Verify `mode: 'production'`, `sideEffects`, and `usedExports`.
- **Universal culprits**: Barrel re-export files (`index.ts`), wholesale utility imports (`lodash`, `moment`), and dynamic template-literal `import()` paths that defeat static analysis.
- Reuse the project's existing bundle analyzer or the framework's documented flag (`ANALYZE=true`, `npx next experimental-analyze`, Rollup visualizer already in devDeps); never add speculative dependencies.

### Unused JS / CSS

- **Tailwind v4**: No `content` array — sources are detected automatically (ignoring `.gitignore`d paths, `node_modules`, binaries, CSS). Inspect `@source`, `@source not`, and `source(none)` in the CSS entry, and grep for dynamically interpolated class strings (`bg-${color}-600`) that v4 cannot scan. Oversized CSS usually points to an over-broad `@source` or `@source inline()` safelist. **Tailwind v3** still uses `content` in `tailwind.config.*` — check the installed major version first.
- **Astro**: Audit islands and `client:*` directives (`client:load` hydrates immediately on load; prefer `client:idle`, `client:visible`, or zero-JS `.astro` components where interactivity is unnecessary).
- **Next.js**: Check client component boundaries, `next/dynamic` for heavy below-the-fold or modal widgets, and `next/script` loading strategies (`afterInteractive` / `lazyOnload`) for third-party tags.
- **CSS delivery**: Prefer static CSS extraction over runtime CSS-in-JS injection on the critical path.

### Images (LCP & CLS pipeline)

- **Astro**: Use `<Image>` / `<Picture>` from `astro:assets` for local and configured remote images (emits dimensions, modern formats, and `loading`); a raw unoptimized `<img>` on the hero is a finding.
- **Next.js**: Use `next/image` with accurate `sizes` on responsive layouts, `priority` / preload (check installed version's prop name) **only** on the LCP image, and tight `images.remotePatterns`.
- **Shopify Liquid**: Always render via `image_url` with explicit `width` + `image_tag` (with `widths`/`sizes`), never raw master uploads; never `loading="lazy"` on the LCP image.
- **Cloudflare Images / transformations**: Confirm edge resizing (`/cdn-cgi/image/...` or binding) sets `format=auto` and bounded widths.
- **Every stack**: Explicit `width`/`height` or CSS `aspect-ratio` to prevent CLS, `fetchpriority="high"` on the single LCP image only, `loading="lazy"` below the fold, and no CSS `background-image` heroes hidden from the HTML preload scanner.

### Interaction to Next Paint (INP) Diagnosis

A cold-reload trace does **not** capture INP — an interaction must occur during recording.

1. **Capture**:
   - *With MCP*: Start `performance_start_trace(autoStop: false, reload: false)`, trigger the slow interaction (`click`, `fill`, `press_key`), stop the trace, and inspect interaction insights / long-task timings.
   - *Without MCP*: Request a scripted interaction timing from `ui-validation` (`PerformanceObserver` `event` entries with `durationThreshold: 16`) or inspect CrUX/RUM field data; otherwise report INP as **unmeasured**.
2. **Attribute to one of the three phases** (`https://web.dev/articles/optimize-inp`):
   - **Input delay**: Main thread blocked before event handlers start (hydration bursts, boot scripts, third-party timers).
   - **Processing duration**: Event callbacks doing heavy synchronous work; yield to main thread, defer non-visual work, or wrap non-urgent React state updates in `startTransition` / `useDeferredValue`.
   - **Presentation delay**: Expensive style/layout/paint after handlers finish (huge DOM trees, layout thrashing, unvirtualized tables/lists; apply smaller state scopes, virtualization, or `content-visibility: auto`).
3. **Map to source**: Name the exact event listener, re-rendering component tree, and any non-passive `touchstart`/`wheel` handler.

### Polyfills, Build Targets, Compression & Minification

- **Targets & polyfills**: Compare `browserslist`, Vite `build.target`, or SWC/Next target against the real user base; legacy targets bloat bundles. Flag `core-js` / `@babel/preset-env` `useBuiltIns` only when legacy Babel is actually present.
- **Minification & compression**: Vite, Astro, and Next minify production builds by default (flag only config overrides disabling minification). Verify `br`/`gzip`/`zstd` compression, immutable `Cache-Control` on content-hashed assets, and that production source maps are disabled or externalized.
