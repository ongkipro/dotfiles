---
name: testing-engineering
description: >-
  Design, implement, review, and stabilize automated behavioral tests for
  Node.js/TypeScript full-stack systems. Use when a feature, bug fix, API,
  database change, authorization rule, integration, retry, concurrency path, or
  CI failure needs durable regression evidence; when deciding unit versus
  integration versus contract versus E2E coverage; or when diagnosing flaky
  tests. Prefer project scripts and the installed runner. Own test strategy and
  changed-contract tests, not browser visual QA (ui-validation), performance
  testing (web-perf), or framework-specific implementation.
---

# Testing Engineering

Prove the smallest observable contract that could plausibly regress. A test earns
its maintenance cost only when it fails for a real behavior defect and survives
an implementation-preserving refactor.

## Scope and ownership

`testing-engineering` owns automated behavioral test selection, design,
implementation, isolation, reliability, and CI-safe execution across a full-stack
change. It may coordinate several layers, but it does not replace specialists:

- `ui-validation` owns real-browser visual, responsive, hydration, keyboard, and
  interaction evidence. Hand changed controls and accessibility behavior there.
- `web-perf` owns performance measurement, budgets, diagnosis, and load/runtime
  performance evidence.
- `nextjs-development`, `astro-development`, `workers-best-practices`, and
  `durable-objects` own framework or platform harness details.
- `postgres-drizzle` owns plain PostgreSQL/Drizzle schema, migration, and query
  design; this skill owns the behavioral tests selected for those contracts.
- `application-security` owns cross-stack threat analysis and security controls;
  `better-auth-security` owns Better Auth hardening. This skill turns accepted
  security and authorization contracts into regression cases.
- `openapi-spec` owns REST contracts. `testing-engineering` verifies that provider
  and consumer behavior conforms to the accepted contract.
- Apply `native-first` before adding a runner, assertion library, DOM environment,
  container harness, or mocking package. Installed stack and project scripts win.

## 1. Inspect before choosing a test

1. Read repository instructions, the task/specification, and the complete changed
   flow: public entry point, affected callers, persistence, jobs, and outbound
   effects.
2. Inspect the manifest, lockfile, package-manager marker, test scripts, runner
   config, setup files, fixtures, factories, database helpers, browser config,
   and CI workflow. Search for colocated tests and sibling behavior before
   creating a second convention.
3. Confirm the installed runner and version. Recheck volatile runner APIs against
   that version and current official documentation; see
   [source-ledger.md](references/source-ledger.md).
4. Run the nearest existing focused test through the project script before
   editing. Learn its environment, cleanup behavior, and whether it watches.
5. Trace the observable contract in one sentence:
   **given actor/input/state, when action occurs, outcome and side effects hold**.
6. Rank the plausible failures by impact, likelihood, and detectability. Cover the
   highest-risk observable failure at the lowest layer that faithfully exercises
   it.

Never let `npx`, `pnpm dlx`, or another transient fetch choose an undeclared test
runner. Never read secrets or point tests at production to make a harness pass.

## 2. Decide whether a new test is warranted

Add or change a test when the work changes an observable contract, fixes a bug,
adds a meaningful branch or invariant, changes a trust boundary, alters stored
state or a migration, changes an external protocol, or creates concurrency,
retry, or idempotency risk.

No new test is warranted when observable behavior is unchanged and existing
coverage already exercises the contract, or when the change is documentation,
comments, formatting, generated output already defended at its generator
boundary, or an implementation-only refactor with adequate behavioral coverage.
Still run the smallest existing executable check and report: **no new regression test; observable contract unchanged**, with the evidence used.

Refuse tests that assert source text, file layout, private call order, mock
plumbing, framework internals, or that a collaborator was called when the
meaningful output/state can be asserted. Compilation, snapshots, and coverage
percentages do not by themselves prove behavior.

Read [test-selection.md](references/test-selection.md) when a change spans layers
or the minimum useful cases are unclear.

## 3. Select the faithful boundary

| Layer | Use when it is the smallest faithful proof | Assert |
|---|---|---|
| Unit | Pure policy, parsing, calculation, transition, or error mapping | Inputs to outputs, invariants, meaningful errors; no framework plumbing |
| Integration | Behavior depends on real modules, runtime adapters, database semantics, queues, filesystem, or transaction boundaries | Public entry to persisted/resulting state and controlled side effects |
| Contract | A provider/consumer boundary can drift independently | Accepted request/response/event shape, status/error semantics, compatibility |
| E2E | Risk exists only across the assembled system or a critical user journey | User-observable outcome and authoritative persisted effect |

Do not force everything into E2E. Do not replace a database-semantic test with an
in-memory repository fake. A single focused integration test often proves more
than many mock-heavy units. Browser E2E implementation and visual evidence must
follow `ui-validation`; this skill supplies the risk cases and automated
contract, not visual judgment.

## 4. Build tests from risks, not code structure

For each selected contract, use only cases that defend distinct behavior:

1. representative success;
2. boundary or invariant most likely to break;
3. failure and recovery path with the highest consequence;
4. authorization or tenancy denial where a trust boundary moves;
5. side-effect count/state when duplicate or partial execution is possible.

Assert through the public boundary and inspect authoritative outcomes: returned
value, HTTP response, emitted durable event, database row/constraint, or visible
state. Assert stable semantics, not incidental wording, ordering, timestamps, or
IDs unless those are contractual. A bug regression should fail before the fix
for the reported reason and pass after the root cause is corrected.

Keep arrange/act/assert legible. Prefer small explicit fixtures over a universal
builder; add a factory only after repeated setup has the same meaning. Make a
failure identify the scenario and violated invariant without requiring a rerun.

## 5. Control nondeterminism and state

- Inject or use the project's clock seam for time-sensitive behavior. Freeze or
  advance time with the installed runner; never wait for wall clock.
- Seed or inject randomness and ID generation when exact values matter. Report
  the seed on failure; do not globally mock secure randomness used by production
  code unless the harness already exposes an approved seam.
- Create isolated data per test and per worker. Use the project's transaction,
  schema, database, namespace, or cleanup convention; prove cleanup executes on
  failure. Never rely on test ordering or shared mutable fixtures.
- Coordinate concurrency with barriers, deferred promises, database locks, or a
  harness-provided scheduler—not sleeps. Assert the final invariant, not which
  operation happened to win unless ordering is contractual.
- Exercise duplicate delivery, simultaneous requests, timeout, retry exhaustion,
  partial failure, and crash-after-side-effect only where the flow can encounter
  them. Verify bounded attempts and exactly-once effect or explicitly accepted
  at-least-once behavior.

Use [stateful-boundaries.md](references/stateful-boundaries.md) for database,
migration, authorization, external-service, and idempotency case selection.

## 6. Respect trust boundaries and error states

For authentication/authorization changes, distinguish unauthenticated,
authenticated-but-forbidden, wrong tenant/owner, insufficient role/scope, expired
or revoked state, and permitted access as applicable. Assert both denial and
absence of protected data/side effects. Do not snapshot tokens, cookies,
credentials, or sensitive error bodies.

For external services, use a narrow fake at the owned adapter boundary to drive
success, protocol errors, timeouts, malformed responses, and retry behavior. Do
not mock the unit under test or reproduce the vendor SDK internally. A real
sandbox smoke check complements—not replaces—deterministic tests when credentials
and a maintained sandbox exist. Keep it explicit, non-production, bounded,
uniquely identified, safely cleaned up, and outside default CI if it is mutable,
rate-limited, costly, or secret-dependent. Report what the sandbox check actually
proved.

For databases and migrations, use an isolated real engine when constraints,
transactions, locking, SQL, generated IDs, or migration behavior are the risk.
Check a clean migration path and, when existing data can be affected, a
representative upgrade path plus post-migration invariants. Never apply a test
migration to a shared or production database.

## 7. Run safely and diagnose flakes

Use the repository's focused non-watch script and installed package manager.
Inspect the script before passing filters because argument forwarding differs.
Only if the project already uses the corresponding runner, the official
source-verified direct forms are `node --test <test-file>` and, through the
locally installed Vitest binary, `vitest run <test-file>`; project scripts remain
preferred. Do not invent a generic command for unknown repositories.

CI tests must terminate, use bounded timeouts, avoid interactive/watch mode,
clean their resources, tolerate arbitrary worker order, avoid fixed shared ports
and names, and fail when required services are absent rather than silently
switching to mocks. Separate secret-dependent sandbox checks from the hermetic
default lane. Never weaken assertions only in CI.

When a test flakes:

1. preserve the first failure output, seed, worker count, timing, trace/logs, and
   environment differences;
2. reproduce narrowly, then vary repetition and concurrency only to expose the
   race;
3. classify the cause: leaked state, uncontrolled time/randomness, eventual
   consistency, missing await, brittle selector, resource contention, order
   dependence, or product race;
4. fix the product or isolation root cause and prove repeated focused passes;
5. use retries or quarantine only as a visible, owned, time-bounded containment
   policy—not as evidence of correctness.

## 8. Evidence gate and report

Run the new/changed focused test, then the nearest affected suite only when it is
needed to catch integration fallout. For browser-visible claims, also hand the
actual route and states to `ui-validation`. For performance claims, hand off to
`web-perf` rather than inferring from test duration.

Report:

- contract and risk defended;
- test layer and why it is the lowest faithful boundary;
- exact project command run and observed pass/fail counts;
- relevant database/service/browser environment;
- isolation controls and any sandbox side effects/cleanup;
- unverified states and the exact blocker.

Do not claim a suite, browser flow, migration path, or external integration that
was not exercised.

## Anti-patterns

- Test-per-function or coverage-percentage targets without a risk hypothesis.
- Source-text, AST-shape, private-call-order, import, export-existence, or
  mock-wiring assertions standing in for behavior.
- Snapshotting large objects, markup, errors, or responses to avoid selecting
  contractual fields.
- Mocking every collaborator so the production composition is never exercised.
- Using SQLite or an in-memory map to claim PostgreSQL constraint/transaction
  behavior.
- Sleeping, sharing accounts/rows/ports, depending on order, or swallowing
  cleanup errors.
- Hitting production, embedding secrets, refreshing snapshots blindly, or making
  CI pass by retries, skips, larger timeouts, or weaker assertions.
- Adding a new runner or abstraction when the installed harness can express the
  test.
