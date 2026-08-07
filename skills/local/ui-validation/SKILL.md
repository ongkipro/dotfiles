---
name: ui-validation
description: >-
  Validate browser-visible changes with the smallest executable evidence that
  proves the affected user flow. Use after implementing or reviewing UI work in
  admin panels, dashboards, storefronts, forms, responsive layouts, and web
  interactions; when asked to open, test, verify, QA, or prove a page in a real
  browser; or before claiming that a frontend change works. Prefer the
  project's existing Playwright setup, check mobile and desktop when layout is
  affected, exercise keyboard and critical states, and report concrete
  evidence. Use axe, Storybook, visual regression, or Lighthouse CI only when
  the project already uses them or the task specifically warrants them. Not for
  choosing visual direction (design-taste), dashboard information architecture
  (admin-dashboard), or performance optimization itself (web-perf).
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
   conventions. Search for existing Playwright configuration and nearby tests.
4. State the smallest user-visible claim that must hold, for example: "A user
   can change quantity on mobile and the cart total updates without overflow."
5. Identify the affected route, viewport, interaction, and important state.

Do not install a global tool. Do not use `npx`, `pnpm dlx`, or an equivalent
command that may download a package implicitly. Before proposing a local
dependency, apply `native-first`; an already-installed runner or available
browser tool wins.

## 2. Choose the smallest evidence

Use the first level that proves the claim:

| Change | Minimum browser evidence |
|---|---|
| Static copy, color, or spacing | Open affected route at the relevant viewport; inspect the rendered result |
| Responsive layout | Open at one narrow and one wide viewport; check clipping, overlap, and horizontal overflow |
| Interaction or form | Perform the critical action; assert the resulting UI and persistence/navigation when relevant |
| Loading, empty, error, or disabled state | Trigger the actual state or a deterministic fixture; verify recovery and retained input |
| Shared component or regression-prone logic | Add or update the nearest focused Playwright test |
| Accessibility-sensitive control | Exercise keyboard order, focus visibility, accessible name, role, and state |

A screenshot records appearance but does not prove interaction. A build, type
check, unit test, DOM snapshot, or source inspection alone does not prove a
browser-visible change.

## 3. Run the real page

1. Use the project's documented dev or preview script from `package.json`.
2. Reuse an already-running server when its working tree and configuration
   match the task. Otherwise start the narrowest local server safely.
3. Use the existing Playwright command/config when present. Target the affected
   test or project before running the entire suite.
4. Navigate through the user-facing route rather than reaching directly into
   component internals.
5. Observe browser console errors and failed requests relevant to the flow.

Never read secret files or expose credentials to obtain a session. Reuse the
project's approved test fixture or authenticated state. If access requires a
secret or external mutation, stop at that boundary and report what remains
unverified.

## 4. Check only relevant risk surfaces

### Responsive layout

When layout can change, test at least one narrow phone viewport and one wide
desktop viewport. Prefer project-defined devices; otherwise use approximately
390 CSS px and 1280 CSS px. Check:

- no accidental page-level horizontal scroll;
- no clipped controls, text, menus, dialogs, or sticky regions;
- usable tap targets and readable content;
- expected responsive transformation, not merely scaled desktop UI.

Use an overflow assertion when appropriate:

```js
expect(await page.evaluate(() =>
  document.documentElement.scrollWidth <= document.documentElement.clientWidth
)).toBe(true)
```

Do not apply this assertion to an intentionally scrollable inner table or
carousel; assert the page shell and the intended scroll container separately.

### Interaction and state

Follow the critical path from the user's starting point. Assert outcomes users
can perceive. Cover loading, empty, error, disabled, and success states only
when the change touches them or failure would be costly. For admin destructive
actions and storefront checkout/payment handoffs, stop before live mutations
unless explicitly approved; use fixtures or test environments.

### Accessibility

For changed controls, verify keyboard reachability, logical focus order,
visible focus, accessible name, role, and state. Verify dialogs trap and return
focus. Prefer role/name locators because they test the accessibility surface.

Run axe only when `axe-core`, `@axe-core/playwright`, or an established project
integration already exists, or when dependency addition is explicitly in
scope. Treat automated scans as a supplement: they do not prove keyboard
behavior, meaningful labels, or correct interaction.

## 5. Escalate tools only when earned

- **Playwright:** primary browser runner; reuse its existing config, projects,
  web server, fixtures, and traces.
- **Storybook:** use when it already exists and isolated component states are
  the real validation surface. It does not replace the integrated route.
- **Visual regression:** use existing snapshot infrastructure for stable,
  deterministic surfaces. Review the image diff; never update baselines merely
  to make the test green.
- **Lighthouse CI:** use when the project already has budgets/configuration or
  the task concerns a measurable performance/accessibility regression. It is
  not the default correctness check.

Do not introduce these tools preemptively for a one-off change.

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

Say "build/type checks passed" when that is all that ran. Say "browser flow
passed" only after exercising that flow in a browser. Do not generalize one
viewport, one state, or one route into whole-site confidence.
