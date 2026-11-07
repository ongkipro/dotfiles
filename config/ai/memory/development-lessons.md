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


## Lesson: 5 s vitest body limit fails integration suites under shared-machine load

### Symptom
Full suites failed only on 'Test timed out in 5000ms' in auth/security/events/isolation at load 13-16; the same files passed alone; the base commit failed the same way.

### Root cause
Integration tests on a real PostgreSQL take 1.5-4 s at load 12 (measured with the JSON reporter); concurrent suites of other projects push them past vitest's 5 s default.

### Durable invariant
Integration test bodies need a limit that catches a hang, not one that measures speed; timing assertions stay explicit in the tests that mean them.

### Fix
vitest.config testTimeout 30_000 with the measurement in a comment; keep explicit per-test limits.

### Regression check
vitest run --reporter=json, list tests over 40% of their limit; grep tests for elapsed-time assertions before raising the default.

> Promoted from a reviewed local candidate on 2026-11-07.


---


## Lesson: Parallel CREATE/DROP DATABASE in test harnesses stalls new PostgreSQL connections

### Symptom
Intermittent 5 s test timeouts in a full suite; server log silent for seconds; pg_isready 'no response'; new-connection latency spikes to 0.9-2.7 s

### Root cause
Each CREATE DATABASE fsyncs the relation map under the cluster-wide RelationMappingLock that every backend start reads; each DROP DATABASE forces an immediate checkpoint; several test files doing both at once on a slow-fsync disk queue every new connection

### Durable invariant
Test harnesses never run CREATE DATABASE beside other database CREATE/DROP on one cluster

### Fix
Advisory lock around database DDL: CREATE exclusive, DROP shared (drops still share one checkpoint); one wrapper as the only DDL path, enforced by a structural test

### Regression check
Stress: N parallel harness create/close cycles with a 250 ms new-connection probe; zero samples with a CREATE beside other database DDL; checkpoints not above the control

> Promoted from a reviewed local candidate on 2026-11-07.
