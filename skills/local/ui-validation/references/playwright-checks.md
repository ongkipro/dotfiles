# Playwright check recipes

Detail behind SKILL.md §3–§5. Verified against playwright.dev on 2026-10-02
(`@playwright/test` 1.63); re-check APIs against the installed version.

## Overflow assertion

Assert the delta, not a boolean, so a failure says how far and where:

```js
const overflow = await page.evaluate(() =>
  document.documentElement.scrollWidth - document.documentElement.clientWidth)
// viewportSize() returns null without a fixed viewport (channel:'chrome'); guard it.
expect(overflow, `horizontal overflow at ${page.viewportSize()?.width ?? 'unknown'}px`).toBeLessThanOrEqual(1)
```

Tolerate 1 px for subpixel rounding. Compare against `clientWidth`, never
`window.innerWidth` (it includes the scrollbar gutter and reports phantom
overflow on any page with a vertical scrollbar). On failure walk the DOM for
the widest offender and name it; exclude `position: fixed` subtrees and
intentional horizontal scroll containers, and assert those separately.

## Composite-widget keyboard contracts (WAI-ARIA APG)

- **Modal dialog** — focus moves inside on open (least destructive control for
  a destructive confirm); Tab/Shift+Tab wrap; Escape closes; focus returns to
  the invoker or a logical place when the invoker was removed; labelled via
  `aria-labelledby`/`aria-label`.
- **Combobox** — DOM focus stays on the input (`role="combobox"`,
  `aria-expanded`, `aria-controls`); Down Arrow opens; active option via
  `aria-activedescendant`; Enter accepts; Escape dismisses.
- **Grid** — one Tab stop; arrows, Home/End, Ctrl+Home/End move between cells.
  A plain data table keeps every control in the Tab order.

Assert with `page.keyboard.press()` + `toBeFocused()`,
`toHaveAttribute('aria-expanded', 'true')`, `toHaveAccessibleName()`,
`toHaveRole()`.

## WCAG 2.2 checks a one-viewport pass misses

Run each only when the change creates the risk:

- **2.4.11 Focus Not Obscured** — with a sticky header/footer, banner, or
  action bar present, Tab through the region and compare the focused control's
  `boundingBox()` with the sticky element's. Fix: `scroll-padding-top/bottom`.
- **2.5.8 Target Size** — pointer targets under 24×24 CSS px pass only via the
  spacing, equivalent-control, inline, user-agent, or essential exceptions;
  measure with `boundingBox()`.
- **2.5.7 Dragging Movements** — anything dragged must also work by
  single-pointer clicks; exercise that alternative.
- **1.4.10 Reflow** — material public layout changes: check 320 CSS px and
  zoom; tables may stay two-dimensional while surrounding content reflows.

## axe

Only when `axe-core`/`@axe-core/playwright` or a project integration already
exists, or dependency addition is in scope. Scope to the changed region and
the project's tags:

```js
new AxeBuilder({ page }).include('#orders')
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
```

Reuse a project axe fixture; justify every `exclude()`/`disableRules()` in the
report. A scan does not prove keyboard behavior or meaningful labels.

## Snapshots (built-in, no extra dependency)

- `toMatchAriaSnapshot()` compares the accessibility tree against a YAML
  template; partial by default; regexes for dynamic text. Cheaper and more
  stable than pixels for "the dialog has a heading, a labelled input, and two
  buttons"; it is not visual evidence.
- `toHaveScreenshot()` waits for two identical captures, disables CSS
  animations, hides the caret. Baselines are per browser **and platform**
  (`-chromium-linux.png`); `mask` volatile regions; `maxDiffPixels` only with a
  stated reason.
- Updating: without the flag only `missing` baselines are written;
  `--update-snapshots` means `changed` (modes `all|changed|missing|none`).
  Update only after inspecting the diff and naming the intended change.

## Raw timings for `web-perf`

When `web-perf` delegates because chrome-devtools MCP is absent, collect and
return without interpreting:

- `performance.getEntriesByType('navigation')` and `('resource')`
- `PerformanceObserver` for `largest-contentful-paint` and `layout-shift`
- for an interaction complaint: observer type `event` with
  `durationThreshold: 16`, keeping entries with an `interactionId`; report
  per-interaction durations, never an "INP"
- console errors and failed requests

Label them single-run lab numbers from a warm local server, not Core Web
Vitals.

## Dev server semantics

- **Astro + `@astrojs/cloudflare`** 13+ (Astro 6+): `dev` and `preview` both
  run in `workerd` with bindings. Older adapters: `astro dev` is Node; use the
  project's `wrangler dev` script when the flow touches D1/KV/sessions/headers.
  `astro preview` serves a prior build.
- **Astro + `@astrojs/node`**: `astro dev`, or `build && preview` for
  prerendered output.
- **Next**: `next dev`; `next build && next start` only for build-only bugs.
