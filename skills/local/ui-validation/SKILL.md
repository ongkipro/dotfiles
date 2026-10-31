---
name: ui-validation
description: >-
  Prove a browser-visible change with the smallest real-browser evidence before calling UI done: Playwright or browser tool, narrow and wide viewports, keyboard, states, hydration, themes. Not visual direction (design-taste), admin IA, or perf.
---

# UI Validation

Prove the user-visible claim, not that the code compiles. A build, type check,
unit test, DOM snapshot, or source read does not prove a browser-visible
change. A screenshot proves appearance, not interaction.

For a new or redesigned screen, `dotuiux check <url>` (skill `dotuiux`) runs the
rendered checks at 360/768/1440 first; this skill proves interaction, keyboard,
states, and themes.

## 1. Find the project's harness

1. Read `package.json` and the lockfile. Look for a browser layer in three
   shapes: a Playwright config + test dir; a runner script under `scripts/`
   (`from 'playwright'`, `chromium.launch`) with no config; `package.json`
   scripts named `verify`, `smoke`, `audit:*`, `check:*`. Run what exists
   before writing anything.
2. State the smallest claim that must hold ("quantity change on mobile updates
   the cart total without overflow") and the route, viewport, interaction,
   and state it needs.
3. No harness: use an available browser tool (agent-browser, Chrome DevTools,
   Playwright MCP); else add a pinned `playwright` dev dependency with
   `channel: 'chrome'` and commit the check script; else report browser
   behavior as not verified. Never run a runner from an `npx`/`dlx` cache or
   another project — the evidence would not be reproducible. If Playwright is
   declared but browsers were never downloaded, prefer the system browser; if
   you do download them, say so.

## 2. Smallest evidence per change

| Change | Minimum |
|---|---|
| Copy, color, spacing | Open the route at the relevant viewport; look |
| Responsive layout | One narrow (~390) and one wide (~1280; admin: 390/1366/1536) viewport; clipping, overlap, horizontal overflow |
| Interaction or form | Perform the action; assert the visible result and persistence/navigation |
| Astro island / hydrated component | Interact with it — a missing `client:*` directive still renders correct HTML that does nothing; no hydration error in console |
| Theme change | Both themes; resolved theme survives reload without a flash |
| Loading / empty / error / disabled | Trigger the state or a fixture; recovery keeps input |
| Shared component or regression-prone logic | Add or update the nearest focused Playwright test |
| Changed control | Keyboard reach, focus order, visible focus, name, role, state; dialogs trap and return focus |

Recipes (overflow delta, APG keyboard contracts, WCAG 2.2 focus/target/drag
checks, axe scoping, aria and pixel snapshots, raw timings for `web-perf`):
[playwright-checks.md](references/playwright-checks.md).

## 3. Run the real page

- Use the project's own dev/preview script and know what it serves (`preview`
  serves a prior build; adapter notes in the recipes file). Never `wrangler
  deploy`, `--remote`, or a production URL for evidence.
- Reuse a running server only when you can confirm what it serves; otherwise
  start your own on a free port. **Never `pkill`, `killall`, or kill by
  port** — other sessions share this machine. Terminate only the process
  group you spawned.
- Read an audit/smoke script's default target before running it: many fall
  back to a production URL, sometimes with credentials in default env values.
  Always pass the local origin. Authenticating against production needs the
  same approval as a live mutation.
- Navigate through the user-facing route. Wait on web-first assertions
  (`await expect(locator).toBeVisible()`), never `waitForTimeout()` or
  `networkidle`.
- Watch console errors and failed requests on the flow.
- Never read secret files to obtain a session; reuse the project's fixture.
  Stop before live purchase, payment, account, or destructive mutations unless
  explicitly approved.

## 4. Visual acceptance (separate verdict)

For a new surface or material visual change, after behavior passes: open the
narrow and wide captures and judge hierarchy, composition, density,
alignment, typography, states, and responsive transformation against the
accepted direction. For reference-driven work compare each recorded contract
item (`C1…`) at the reference's viewport; a deviation without a recorded
reason is REVISE. For admin surfaces attach the `admin-dashboard`
`scripts/admin-geometry.mjs` report per changed route (exit 1 = REVISE; exit
3 / `NOT-CHECKED` = not checked). A generic template replacing a distinctive
direction is REVISE even when the flow passes.

Do not approve because a screenshot exists, and never refresh a visual
baseline to bless an unexplained diff. Unresolved direction goes back to
`design-taste` or `admin-dashboard`; this skill validates a direction, it
does not choose one.

## 5. Tools only when earned

Playwright is primary; reuse its config, projects, web server, fixtures, and
traces. Storybook, visual-regression snapshots, Lighthouse CI, and axe only
where the project already has them. Playwright's own `toMatchAriaSnapshot` /
`toHaveScreenshot` need no dependency when a durable regression check is
asked for.

## 6. Report

Route and scenario; command actually run; viewports and states; observable
result including console/network; saved test/screenshot/trace path; what was
not verified and the exact blocker. For a one-viewport cosmetic check, one
sentence is the whole report. Say "build passed" when that is all that ran;
say "browser flow passed" only after exercising it. Keep behavior and visual
verdicts separate (PASS / REVISE / UNVERIFIED); never generalize one
viewport, state, or route into whole-site confidence.

Upstream status of the tools named here: [sources.md](references/sources.md).
