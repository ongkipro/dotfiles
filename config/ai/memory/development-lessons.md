# Memory: Web development lessons

> Split from [development.md](development.md) so each file fits the router budget. Astro rendering and Node test-harness lessons; CSS, Tailwind, Headless UI and component-geometry lessons moved to [ui-lessons.md](ui-lessons.md) (2026-10-29). Each lesson states symptom, root cause, durable invariant, fix, and regression check; the repository stays authoritative.

## Lesson: Runtime query parameters in statically built Astro pages

### Symptom
A thank-you page built successfully but ignored orderNumber, vaNumber, and qrUrl query parameters in the deployed static output.

### Root cause
The Astro frontmatter read Astro.request.url during static generation, so the generated HTML captured build-time request state instead of browser navigation state.

### Durable invariant
Runtime query-dependent UI in an Astro static output must parse validated parameters in the browser or use an explicitly server-rendered route.

### Fix
Render safe empty placeholders and populate them with a small validated browser script using textContent and typed DOM properties.

### Regression check
Build the static site, serve dist with astro preview, then open /thank-you?orderNumber=ORD-UI-001 in a real browser and assert the order number is visible.

> Promoted from a reviewed local candidate on 2026-08-16.


---


## Lesson: A bundler-resolved import can be unreachable from node --test

### Symptom
One lib module could not be tested at all: node --experimental-strip-types --test failed with ERR_MODULE_NOT_FOUND on './env', while the app built and ran normally.

### Root cause
Vite resolves extensionless relative specifiers; Node's type-stripping test runner does not. A module importing './env' instead of './env.ts' therefore works everywhere the bundler runs and is invisible to the test suite. Ten more modules had the same defect, hidden because nothing had tried to import them under Node.

### Durable invariant
Where tests run under node --experimental-strip-types, every relative import in testable source must carry its explicit .ts extension. A green build proves bundler resolution, never testability — a module the test runner cannot import is untested no matter how many tests exist.

### Fix
Give every relative import in the tested source tree its explicit extension, applied across the whole directory rather than only the module that surfaced the error.

### Regression check
npm test must actually import each lib module; a bare relative specifier fails immediately with ERR_MODULE_NOT_FOUND rather than being silently skipped.

> Promoted from a reviewed local candidate on 2026-08-24.


---
