---
name: ui-validation
description: >-
  Validate browser-visible changes with the smallest executable evidence proving the affected user
  flow. Use after UI work in admin panels, dashboards, storefronts, forms, responsive layouts, web
  interactions; when asked to open, test, verify, QA, or prove a page in a real browser; before
  claiming a frontend change works. Prefer the project's Playwright setup; check mobile and
  desktop, keyboard, critical states, Astro island hydration, both themes. Use axe, Storybook,
  visual regression, or Lighthouse CI only where the project already does. Collects raw page
  timings for web-perf when chrome-devtools MCP is absent. Not for visual direction (design-taste),
  dashboard information architecture (admin-dashboard), or performance diagnosis (web-perf).
---

# UI Validation

Prove the user-visible claim, not merely that the code compiles. Keep the check
as narrow as the change and leave one runnable regression check only when the
logic is non-trivial or likely to regress.

## 1. Establish the contract

Before running or writing anything:

1. Read repository instructions and the task or diff.
2. Inspect `package.json` and the lockfile before choosing commands or tools.
3. Reuse the project's scripts, browser-test setup, fixtures, auth helpers, and
   conventions. Look for a browser layer in **three** shapes, not one — a
   config-less runner script is the easiest to miss and the easiest to
   duplicate:
   - a Playwright config plus a test directory;
   - a runner script under `scripts/` (grep for `from 'playwright'`,
     `chromium.launch`) with no config and no test dir;
   - `package.json` scripts named `verify`, `smoke`, `audit:*`, `check:*`.

   Run the existing harness before writing anything new.
4. State the smallest user-visible claim that must hold, for example: "A user
   can change quantity on mobile and the cart total updates without overflow."
5. Identify the affected route, viewport, interaction, and important state.

Do not install a global tool, and never let a throwaway download supply your
test runner or your assertions — `npx`/`pnpm dlx` fetching a runner mid-QA means
you cannot say what you actually ran. Before proposing a local dependency, apply
`native-first`; an already-installed runner or available browser tool wins.

**Missing browser binaries are a separate case.** Playwright can be declared in
`package.json` while its browsers were never downloaded, and the run then fails
with "Executable doesn't exist". Do not silently fetch them. Prefer the system
browser already on the machine — `channel: 'chrome'`, or an explicit
`executablePath` — which is also what an existing project config may already do.
If you do download browsers for an already-declared dependency, that is a
one-line-noted exception, not a new dependency: say you did it.

## 2. Choose the smallest evidence

Use the first level that proves the claim:

| Change | Minimum browser evidence |
|---|---|
| Static copy, color, or spacing | Open affected route at the relevant viewport; inspect the rendered result |
| Responsive layout | Open at one narrow and one wide viewport; check clipping, overlap, and horizontal overflow |
| Interaction or form | Perform the critical action; assert the resulting UI and persistence/navigation when relevant |
| Astro island / hydrated component | Actually interact with it, don't just render it. A missing or wrong `client:*` directive still produces correct-looking HTML that does nothing, and it passes both `astro check` and `astro build`. Confirm no hydration error in the console |
| Theme-affecting change (tokens, colors, dark mode) | Check both themes, and check that the resolved theme survives a reload without a flash of the wrong one |
| Loading, empty, error, or disabled state | Trigger the actual state or a deterministic fixture; verify recovery and retained input |
| Shared component or regression-prone logic | Add or update the nearest focused Playwright test |
| Accessibility-sensitive control | Exercise keyboard order, focus visibility, accessible name, role, and state |

A screenshot records appearance but does not prove interaction. A build, type
check, unit test, DOM snapshot, or source inspection alone does not prove a
browser-visible change.

### Visual critique and revision

For a new surface or material visual change, behavioral checks are necessary
but not sufficient. Capture the affected narrow and wide views, inspect them
against the accepted UX and visual-system contract, and critique hierarchy,
composition, density, alignment, typography, asset quality, state clarity,
responsive transformation, and obvious AI-template repetition. Record concrete
discrepancies, revise the implementation, and re-open the affected views. Stop
when the accepted direction is met or report the remaining limitation.

Do not approve a design because a screenshot exists, and do not update a visual
baseline merely to bless an unexplained difference. This loop validates an
accepted direction; it does not choose one. Route unresolved direction back to
`admin-dashboard` or `design-taste`.

For public frontend, make this comparison concrete: name the intended user
task and accepted reference principle, the observed discrepancy at a specific
viewport/state, the revision, and the recheck result. Compare hierarchy and
behavior, not pixel similarity to another brand. A URL list, screenshot file
existence, model approval, or absence of banned visual keywords is not visual
acceptance. Keep functional/accessibility and visual verdicts separate; either
can fail while the other passes. If the reference was inaccessible or no render
was inspected, mark the affected claim unverified. `design-taste` owns the
reference-evidence and anti-slop review rubric.

## 3. Run the real page

1. Prefer the project's own script, and know what each one actually gives you.
   `preview` is not a synonym for `dev`:
   - **Astro + `@astrojs/cloudflare`** — `astro dev` for markup, layout, and
     interaction. Use the project's `wrangler dev` script when the flow touches
     D1, KV, sessions, or headers, since that is the only runtime with real
     worker semantics. `astro preview` serves a prior `astro build` — it is not
     a dev server, and under the Cloudflare adapter it exits rather than
     building for you.
   - **Astro + `@astrojs/node`** — `astro dev`, or `astro build && astro
     preview` when the output is prerendered.
   - **Next** — `next dev`; `next build && next start` only when the bug is
     build-only.

   Never use `wrangler deploy`, a `--remote` flag, or a production URL to
   obtain evidence.
2. Reuse a running server only when you can confirm what it serves: match the
   port against the project's configured port and hit a route that proves the
   build. Otherwise start your own on a free port. **Never `pkill`, `killall`,
   or kill by port** — other agents and other sessions share this machine.
   Terminate only the process group you spawned, including on failure. If the
   port you need is taken, stop and report the port rather than reclaiming it.
3. Use the existing Playwright command/config when present. Target the affected
   test or project before running the entire suite.
4. Navigate through the user-facing route rather than reaching directly into
   component internals.
5. Observe browser console errors and failed requests relevant to the flow.

Never read secret files or expose credentials to obtain a session. Reuse the
project's approved test fixture or authenticated state. If access requires a
secret or external mutation, stop at that boundary and report what remains
unverified.

**Read a project script's default target before running it.** Audit and smoke
scripts commonly take the origin as `argv[2]` and fall back to a production URL,
sometimes with real credentials as default env values — so the very act of
"reusing the project's script" can log you into a live system. Always pass the
local origin explicitly. Authenticating against production to gather evidence
needs the same approval as a live mutation.

## 4. Check only relevant risk surfaces

### Responsive layout

When layout can change, test at least one narrow phone viewport and one wide
desktop viewport. Prefer project-defined devices; otherwise use approximately
390 CSS px and 1280 CSS px. Check:

- no accidental page-level horizontal scroll;
- no clipped controls, text, menus, dialogs, or sticky regions;
- usable tap targets and readable content;
- expected responsive transformation, not merely scaled desktop UI.

Use an overflow assertion when appropriate. Assert the **delta**, not a bare
boolean — a boolean failure reads "expected true, received false" and tells you
nothing about how far off you are or where:

```js
const overflow = await page.evaluate(() =>
  document.documentElement.scrollWidth - document.documentElement.clientWidth)
// viewportSize() is sync but returns null when the browser runs without a fixed
// viewport — which happens with channel:'chrome'. Guard it or the message throws.
expect(overflow, `horizontal overflow at ${page.viewportSize()?.width ?? 'unknown'}px`).toBeLessThanOrEqual(1)
```

Tolerate 1px for subpixel rounding. Compare against `clientWidth`, never
`window.innerWidth` — `innerWidth` includes the scrollbar gutter, so that form
reports phantom overflow on any desktop page with a vertical scrollbar.

When it fails, walk the DOM for the widest offender and name it. Exclude
`position: fixed` subtrees (off-screen drawers legitimately sit outside the
viewport) and elements inside an intentional horizontal scroll container; assert
the page shell and the intended scroll container separately.

### Interaction and state

Follow the critical path from the user's starting point. Assert outcomes users
can perceive. Cover loading, empty, error, disabled, and success states only
when the change touches them or failure would be costly. For admin destructive
actions and storefront checkout/payment handoffs, stop before live mutations
unless explicitly approved; use fixtures or test environments.

### Accessibility

For material public-layout changes, include the applicable narrow reflow check
(typically 320 CSS px for WCAG 1.4.10) and text/zoom behavior, not only a 390px
phone screenshot. Preserve intentional two-dimensional regions such as tables
while checking that surrounding content reflows. Do not label one viewport as
whole-site WCAG conformance.

For changed controls, verify keyboard reachability, logical focus order,
visible focus, accessible name, role, and state. Verify dialogs trap and return
focus. Prefer role/name locators because they test the accessibility surface.

Run axe only when `axe-core`, `@axe-core/playwright`, or an established project
integration already exists, or when dependency addition is explicitly in
scope. Treat automated scans as a supplement: they do not prove keyboard
behavior, meaningful labels, or correct interaction.

## 5. Escalate tools only when earned

**Playwright** is the primary browser runner: reuse its existing config,
projects, web server, fixtures, and traces.

**Storybook, visual-regression snapshots, and Lighthouse CI** are in scope only
where a project already has them configured — then use them as they stand
(review image diffs; never refresh a baseline just to go green). Do not
introduce any of them for a one-off change, and do not promise visual-regression
evidence for a project that has no snapshot infrastructure.

### Performance evidence requested by `web-perf`

When `web-perf` delegates browser work because the chrome-devtools MCP is not
configured, this skill collects what the page reports about itself and returns
**raw numbers without interpreting them**:

- `performance.getEntriesByType('navigation')` and `('resource')`
- `PerformanceObserver` for `largest-contentful-paint` and `layout-shift`
- console errors and failed requests

These are single-run lab numbers from a warm local server. Label them that way.
They are not Core Web Vitals, and diagnosis stays with `web-perf`.

Read [sources.md](references/sources.md) only when refreshing upstream status or
changing the tool-selection guidance; it is not required during normal UI QA.

## 6. Report evidence honestly

Report:

- route and scenario exercised;
- browser/test command actually run;
- viewports and meaningful states covered;
- observable result, including console/network findings;
- saved test, screenshot, trace, or report path when one exists;
- anything not verified and the exact blocker.

Scale the report to the check. For a single-viewport cosmetic verification, one
sentence naming the route, the viewport, and what you saw IS the whole report —
the list above applies when you ran a suite or left an artifact behind.

Say "build/type checks passed" when that is all that ran. Say "browser flow
passed" only after exercising that flow in a browser. Do not generalize one
viewport, one state, or one route into whole-site confidence.
