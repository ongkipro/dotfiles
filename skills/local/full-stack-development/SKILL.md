---
name: full-stack-development
description: >-
  Orchestrate end-to-end feature delivery or cross-layer bug repair: contracts, UI, backend, data, IAM, API, security, tests, telemetry, CI, runtime evidence. Not a single settled specialist task, discovery alone, or generic architecture.
---

# Full-stack Development

Own the delivery thread, not specialist implementation. Start from repository
truth and accepted behavior, route each concern to its canonical owner, keep
cross-layer contracts synchronized, and stop only when the requested outcome has
executable evidence or an explicit external blocker.

Read only this file up front. [end-to-end-workflow.md](references/end-to-end-workflow.md)
holds the phase checklist, contract record, and evidence packet; open it when
starting a multi-phase feature. [source-ledger.md](references/source-ledger.md)
only for a current platform/standard claim; [adaptive execution](../development-kit/references/adaptive-execution.md)
only when the runtime lacks a capability or the session resumes elsewhere.

**Pick the path first:**
- Cross-layer bug → "Inspect" → the repair paragraph in "Choose the delivery
  lane" → "Evidence gates" 3–5.
- Accepted feature, criteria settled → "Inspect" → "Execute in dependency
  order" → "Evidence gates".
- Unsettled behavior → "Choose the delivery lane" first; no code until the
  handoff carries implementation authorization.

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
  executable tasks when these are not already settled. An actionable request to
  implement the bounded outcome supplies implementation authorization; carry it
  through the handoff. Planning approval alone does not supply it.
- **Multi-domain specification:** use `development-spec-suite` only when product,
  architecture, data, IAM, API, security, privacy, or operations artifacts must
  remain traceable together. It selects the pack; this skill resumes after the
  accepted implementation handoff.
- **Unresolved product direction:** use `product-intelligence` before either spec
  route. Research or specification approval never authorizes implementation.

Never silently move from planning to code, from local proof to deployment, or
from a schema proposal to applying a production migration.

For a repair, reproduce the symptom on controlled data and identify the first
boundary whose observed result violates the accepted contract. Compare a working
path, test one supported cause with the smallest failing check, then fix that
cause and rerun the real path. If the hypothesis fails, gather new evidence
before adding another patch; do not replace diagnosis with a retry quota. Use
redacted observations rather than raw payloads or credentials. A repair that
crosses a trust or data boundary checks both sides even when the symptom names
one: who is authorized or verified (session, tenant membership, provider
signature) and what is durably written (transaction, idempotency, duplicate or
partial state), each proven on the real path.

When the installed framework has no dedicated skill, use its version-matched
official docs and the activated domain owners. Keep the project's stack and test
conventions; missing catalog coverage is not permission to migrate it.

## Owners

The skill map (`skills/local/README.md`) and each skill's description name
the owner for single-domain concerns; load only owners the trace activates.
Composite concerns with no single owner, from
[owner-matrix.md](references/owner-matrix.md):

| Work discovered | Owners |
|---|---|
| Transactional email outside Workers | provider docs + `native-first` before an SDK; secrets/abuse `application-security`; send from a job |
| File uploads | `application-security` for the boundary; storage by platform: `cloudflare` (R2), `supabase-stack`, `vps-deploy` |
| Background jobs, queues, cron, outbox | `postgres-drizzle` (outbox, `SKIP LOCKED`, idempotency); runtime: `vps-deploy`, `cloudflare`, `vercel` |
| Better Auth | `better-auth-security` + `application-security` for the cross-stack boundary |

A specialist owns its domain even inside another skill's host framework:
`postgres-drizzle` owns the Drizzle migration, `nextjs-development` the
Server Action consuming it.

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

**Forms contract (any stack):** one server-side schema validates every
submission and is the source of field errors; the server returns a typed
result (field errors keyed by input name, a form-level error, or success)
rather than throwing; the UI maps those errors to the matching input with
`aria-invalid`/`aria-describedby` and preserves entered values. The form must
submit as a plain HTML form before JavaScript (Server Action, Astro Action, or
POST endpoint); client-side validation is an enhancement, never the authority.

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
5. For browser-visible work, do not make the first visual edit until the
   proportional research, screen/UX contract, and selected presentation
   direction are accepted. After implementation, use `ui-validation` for
   browser behavioral proof.
6. Apply the evidence gates below, then reconcile accepted specs and runtime
   truth, remove scaffolding, and report remaining risk. Do not deploy unless the
   user separately authorizes it.

## Admin/CMS route

New admin or CMS work: `admin-product-ux` → `admin-dashboard` → the framework
owner (+ `shadcn-ui` when React) → `ui-validation`. Bounded maintenance of an
accepted screen reuses its contract and tokens; re-activate the UX/visual owner
only when the contract or direction changes. Existing project tokens win; with
none, `admin-dashboard` supplies the baseline.

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
5. **Runtime:** run the real changed path. For browser-visible work, run
   `ui-validation`; otherwise use
   the smallest endpoint, worker, job, CLI, or integration smoke that observes the result and relevant state.
6. **Trust and operations:** security-sensitive negative paths pass; activated
   telemetry is observable and redacted; performance is measured by `web-perf`
   when the acceptance criteria or risk requires it.
7. **Release:** `github-actions` owns changed CI workflows. Record target,
   command/scenario, observed result, limitations, rollback/migration state, and
   remaining risk. A local check does not prove hosted CI or production.
8. **Learning:** after non-trivial verified work, route reusable lessons and
   candidate captures to `continuous-learning`.

Planning procedures are not runtime evidence. A green build is not UI proof, a
mock is not integration proof, and a workflow file is not a successful hosted
run.

## Anti-patterns

Loading every skill before the trace activates it · restating specialist
guidance here · a generic architecture or wrapper layer instead of the
installed stack · UI, API, DB, and authz contracts drifting apart · hidden
controls as authorization, logs as observability · plumbing tested while
failure/recovery stays unproved · readiness claimed from compilation ·
aliases, dead branches, or placeholder evidence left after a clean cutover.
