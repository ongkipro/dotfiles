---
name: full-stack-development
description: >-
  Orchestrate production full-stack feature delivery across product contracts,
  frontend, backend, data, IAM, API, security, testing, observability, CI, and
  runtime evidence. Use when implementation spans multiple application layers
  or an accepted feature must be carried end to end. Routes only the smallest
  relevant specialist set, preserves planning and release approval gates, and
  keeps UI, API, authorization, and persistence contracts aligned. Not for a
  single settled specialist task, product discovery alone, or generic architecture.
---

# Full-stack Development

Own the delivery thread, not specialist implementation. Start from repository
truth and accepted behavior, route each concern to its canonical owner, keep
cross-layer contracts synchronized, and stop only when the requested outcome has
executable evidence or an explicit external blocker.

Read [End-to-end workflow](references/end-to-end-workflow.md) for the runnable
phase checklist, contract record, stack combinations, and evidence packet. Read
[source-ledger.md](references/source-ledger.md) only when a current platform or
standard claim is needed.

## Trigger and scope

Use this skill when work crosses two or more of UI, server/runtime, data, IAM,
API, telemetry, or delivery; when an accepted feature needs end-to-end execution;
or when a cross-layer bug must be traced to its source.

Route directly to one specialist when the task is already bounded to one domain.
This skill does not author a generic architecture, repeat framework recipes,
create project templates, or replace specialist review. It owns selection,
sequencing, contract alignment, approval boundaries, and evidence gates.

## Inspect before selecting skills

1. Read repository instructions, accepted product/spec artifacts, and relevant
   status records. Then inspect the package manager and scripts, installed
   versions, routes, entry points, schemas and migrations, API contracts, IAM,
   tests, telemetry, deployment configuration, and existing design tokens.
2. Trace the affected flow through every real caller: user or system entry,
   validation, authorization, application logic, persistence, response, UI state,
   emitted signal, and release path. Existing code and runtime evidence beat prose.
3. Record a compact execution frame: accepted requirement or acceptance criteria,
   non-goals, affected surfaces, canonical contracts, trust boundaries, reversible
   versus costly changes, approval state, and the smallest proof that can fail.
4. Load only the owners activated by that trace. Project scripts and installed
   stack conventions win; use `native-first` before adding a dependency or layer.

Do not ask for facts the repository provides. Label unresolved product policy,
permissions, migration intent, or external behavior as unknown; never invent it.

## Choose the delivery lane

- **Settled implementation:** acceptance criteria and policy are accepted. Do not
  manufacture a PRD or architecture document; execute the bounded change.
- **Bounded new feature:** use `prd-taskbreaker` for accepted requirements and
  executable tasks. Planning approval is not implementation approval; stop at
  the implementation gate until approval is explicit.
- **Multi-domain specification:** use `development-spec-suite` only when product,
  architecture, data, IAM, API, security, privacy, or operations artifacts must
  remain traceable together. It selects the pack; this skill resumes after the
  accepted implementation handoff.
- **Unresolved product direction:** use `product-intelligence` before either spec
  route. Research or specification approval never authorizes implementation.

Never silently move from planning to code, from local proof to deployment, or
from a schema proposal to applying a production migration.

## Owner matrix

| Work discovered | Exact owner skill |
|---|---|
| Automated behavioral test strategy, test levels, fixtures, and regression coverage | `testing-engineering` |
| Plain PostgreSQL/Drizzle schema, constraints, queries, migrations, and data lifecycle | `postgres-drizzle` |
| Cross-stack threat modeling, authorization boundaries, input/output safety, secrets, and AppSec review | `application-security` |
| Next.js App Router architecture and implementation | `nextjs-development` |
| Cross-stack logs, metrics, traces, SLI/SLOs, alerts, and telemetry safety | `observability-engineering` |
| GitHub Actions workflow design, permissions, caching, matrices, artifacts, and CI evidence | `github-actions` |
| Astro rendering, routes, islands, Actions, sessions, adapters, and endpoints | `astro-development` |
| Cloudflare Worker code and bindings | `workers-best-practices` |
| Supabase database, Auth, RLS, Storage, Realtime, and Edge Functions | `supabase-stack` |
| Better Auth configuration and session/auth hardening | `better-auth-security` plus `application-security` for the cross-stack boundary |
| Machine-readable REST contract | `openapi-spec` |
| Admin/CMS roles, objects, lifecycle, permissions, tasks, and screen contracts | `admin-product-ux` |
| Admin/CMS information hierarchy, tables, charts, density, and responsive presentation | `admin-dashboard` |
| React/Next.js shadcn component APIs and installed registry integration | `shadcn-ui` |
| Storefront journey, commerce states, and backend-neutral acceptance behavior | `storefront-ux` |
| Storefront implementation architecture and commerce UI composition | `storefront-development` |
| Non-admin visual direction | `design-taste` |
| Browser-visible executable evidence | `ui-validation` |
| Performance measurement and diagnosis | `web-perf` |
| Built-in capability and dependency decision | `native-first` |
| Small PRD/PLAN/TASKS route | `prd-taskbreaker` |
| Traceable multi-document specification pack | `development-spec-suite` |

A specialist owns its domain even when another skill owns the host framework.
For example, `postgres-drizzle` owns a Drizzle migration inside Next.js, while
`nextjs-development` owns the route or Server Action consuming it. Do not load an
owner whose concern is absent.

## Keep one contract thread

Before editing, name the canonical owner for each changed fact:

- product behavior and failure/recovery states;
- domain entities, invariants, and lifecycle;
- component, runtime, deployment, and integration boundaries;
- database shape and migration path;
- identity, authorization, tenant/object scope, and audit event;
- request/response or event schema and compatibility policy;
- UI state, loading/error/empty/success behavior, and accessibility outcome;
- telemetry fields, redaction, service objectives, and release checks.

Change the canonical contract first or in the same bounded slice, then migrate
every affected producer and consumer. Reuse shared generated or repository-native
types only when that is already the project convention. Never create a second
schema language or a speculative cross-framework abstraction merely to connect
layers.

## Execute in dependency order

1. Freeze the accepted contract delta and identify every caller and consumer.
2. Make accepted architecture/data/IAM/API decisions before code that depends on
   them, while preserving an expand/migrate/contract or rollback path when
   compatibility requires it.
3. Implement the smallest vertical slice through its activated framework and
   domain owners. Preserve existing structure; remove obsolete paths at cutover.
4. Exercise trust boundaries and explicit error states, not only the happy path:
   unauthenticated, unauthorized, malformed, conflict, dependency failure,
   timeout, partial persistence, retry, and user recovery where applicable.
5. Apply the evidence gates below, then reconcile accepted specs and runtime
   truth, remove scaffolding, and report remaining risk. Do not deploy unless the
   user separately authorizes it.

## Clean-light admin/CMS route

For new admin or CMS work, the mandatory route is:

`admin-product-ux` -> `admin-dashboard` -> installed framework owner and, when
applicable, `shadcn-ui` -> `ui-validation`.

Existing project tokens always win. If none exist, route the accepted screen
contract through the [admin-dashboard clean-light CMS baseline](../admin-dashboard/references/clean-light-cms-baseline.md).
This skill owns only the route and cross-layer contract.

## Evidence gates

All applicable gates must pass with fresh observed evidence:

1. **Scope/approval:** the requirement, non-goals, canonical owners, and required
   approvals are explicit.
2. **Contract:** changed schema/API/IAM/UI consumers agree; compatibility and
   migration behavior are deliberate.
3. **Implementation:** the smallest project-native static/build check covering
   touched code passes.
4. **Behavior:** `testing-engineering` selects focused automated checks for the
   changed contract; new tests exist only for uncovered observable behavior.
5. **Runtime:** run the real changed path. Use `ui-validation` for browser-visible
   work; otherwise use the smallest endpoint, worker, job, CLI, or integration
   smoke that observes the result and relevant state.
6. **Trust and operations:** security-sensitive negative paths pass; activated
   telemetry is observable and redacted; performance is measured by `web-perf`
   when the acceptance criteria or risk requires it.
7. **Release:** `github-actions` owns changed CI workflows. Record target,
   command/scenario, observed result, limitations, rollback/migration state, and
   remaining risk. A local check does not prove hosted CI or production.

Planning procedures are not runtime evidence. A green build is not UI proof, a
mock is not integration proof, and a workflow file is not a successful hosted
run.

## Anti-patterns

- Loading every full-stack skill before the trace activates it.
- Rewriting specialist framework, database, security, testing, or CI guidance here.
- Generating a generic architecture framework, repository template, or wrapper
  layer instead of following the installed stack.
- Letting UI, API, database, or authorization contracts drift independently.
- Treating hidden UI controls as authorization or logs as observability.
- Testing implementation plumbing while leaving failure/recovery behavior unproved.
- Claiming release readiness from compilation alone or crossing an approval gate.
- Keeping compatibility aliases, dead branches, placeholder evidence, or cleanup
  tasks after a clean cutover is possible.
