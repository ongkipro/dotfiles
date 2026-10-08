---
name: prd-taskbreaker
description: >-
  Turn an idea into a spec-driven PRD (goals, non-goals, EARS-style
  requirements, decisions) plus numbered tasks, each tracing to one
  requirement with a runnable "Done when". Output PRD.md (+PLAN.md) +
  TASKS.md. NOT code, NOT marketing copy. Ready for an AI coding agent to
  build without over-engineering; PLAN.md only when architectural. Use on a
  feature request, when starting a project, or when planning must precede
  coding. Triggers: 'buat PRD', 'tulis PRD', 'write a PRD', 'pecah jadi task',
  'break into tasks', 'planning fitur baru', 'spec this feature', 'rencanakan
  sebelum coding', 'plan before coding'. Diagrams (ERD/sequence/C4) to
  mermaid-diagram, API contracts to openapi-spec, rewriting an existing PRD to
  volumx-writer, marketing copy to content/copywriting.
---

# PRD Taskbreaker

Raw idea → spec-driven PRD → numbered tasks an AI agent can build **without over-engineering**.

The binding rule: **every task has exactly one primary accepted requirement; any other requirement or quality IDs are constraints.** A task with no primary requirement is YAGNI — cut it. Requirement acceptance criteria, task completion, test procedures, and observed evidence remain separate (see Verification vocabulary).

## Flow

```
[Idea] → [0. Inspect authority, repository, and existing flow]
       → [1. Clarify — GATE, resolve material ambiguity]
       → [2. PRD.md — context + goals + non-goals + numbered requirements]
       → [3. UX/design handoff — only when browser-visible]
       → [4. PLAN.md — ONLY if it touches architecture/DB/integration]
       → [5. Review contract and real alternatives]
       → [6. TASKS.md — each task → one primary requirement, constraints, deps, Done-when]
       → (per task) implement → run its TEST → record observed EVID → commit additively
```

## Modes

- **`prd`** — PRD only, from a description
- **`plan`** — technical PLAN from an existing PRD (architectural features)
- **`tasks`** — break an existing PRD/PLAN into tasks
- **`full`** *(default)* — clarify → PRD → (plan if needed) → tasks in one run
- **`update`** — update existing artifacts; preserve every accepted requirement and task ID (never renumber or reuse it); append new IDs and explicitly supersede changed accepted items. Continue the file's existing ID style; migrating old-format tasks (`REQ-1`, `**T1**`) to the contract shape is its own R0 task

### Suite-pack mode

If a `development-spec-suite` pack is active (`CONTEXT-RECORD.md` exists), preserve its schema: product requirements use `PR-*`, quality constraints use `NFR-*`, and task headings use `T-*`. Every product-pack task has exactly one `Primary requirement: PR-*` or `TD-*`, and that requirement must be accepted; the suite's own maintenance tasks may instead use accepted `DS-*`. Follow the pack's ownership, status, TEST, EVID, and validator rules instead of the standalone `REQ-*` examples below.

```markdown
### T-1 — Create the order endpoint
- **Primary requirement:** PR-1
- **Constraints:** PR-2, NFR-1
- **Risk Level:** R2
- **Allowed Paths:** `src/routes/api/order.ts`, `tests/order.test.ts`
- **Depends On:** None
- **Done when:** Execute TEST-1 against the local endpoint; its observed result satisfies PR-1's acceptance criteria.
```

Use bold bullet fields: the suite validator ignores unbulleted `Primary requirement:` lines, and `resume-brief` reads dependencies only from `- **Depends On:**`. Validate root tasks with `check-traceability.py docs/spec --tasks TASKS.md`.

`PR-2` and `NFR-1` affect execution but do not become additional primary requirements. During planning, define `TEST-1` if the pack activates it, but do not create or claim `EVID-*`.

### Six-doc lite (standalone lane, `lean`/`product` profiles)

The common "six documents before vibe coding" set (PRD, TRD, App Flow, UI/UX
brief, backend schema, implementation plan) maps onto the existing 3+1 files.
Do not create a TRD, APP-FLOW, SCHEMA, or IMPLEMENTATION-PLAN file beside them.

| Six-doc concern | Canonical standalone owner | Present when |
|---|---|---|
| Product requirements | `PRD.md` (problem, users + workaround, goals, success measure, non-goals, core features, `REQ-*` with Given/When/Then) | Always |
| App flow / user journeys | `PRD.md` first-use journey line; `DESIGN.md` screen and action specs when the flow spans screens | Always / browser-visible |
| Technical requirements (TRD) | `PLAN.md` conditional blocks (see PLAN format) | Architecture, data, auth, or integration is touched |
| Backend schema | `PLAN.md` Data Schema table | Persistent state exists |
| UI/UX brief | `DESIGN.md` (direction, screen/action specs, assets needed) — the already-allowed standalone design artifact | Browser-visible work with cross-screen decisions |
| Implementation plan | `TASKS.md` in the default milestone order | Always |

Fill `PRD.md` first, then run the [consistency review](#contract-review-gate)
across every present file before writing tasks; check structure with
`check-traceability.py --standalone <repo>` (the `development-spec-suite`
validator; it reads root `PRD.md`, `PLAN.md`, and `TASKS.md`).
A `platform` profile or a genuinely multi-domain system leaves this lane for
`development-spec-suite`.

## 0. Inspect before clarifying

Read repository instructions, existing PRD/spec/design artifacts, `TASKS.md`,
status evidence, routes, schemas, APIs, tests, and the affected flow before
asking questions. Trace the current behavior and reuse established terminology.
This repository-first phase is mandatory for existing code; do not design a
feature from the request text alone.

**Tenant boundary.** If step 0 finds tenant evidence (`tenant_id`/`org_id`/`workspace_id`/`store_id` keys, RLS policies, tenant-scoped middleware, `06-TENANT-ISOLATION.md`), every requirement touching tenant-owned data carries a tenant-scope constraint:
- tenant context resolves server-side from authenticated membership; a client-supplied ID, header, or subdomain is only a selector validated against it;
- cache, queue, storage, search, rate-limit, and export keys include the tenant; RLS context is set per transaction, never through a bypass role;
- operator/support/impersonation access and background jobs carry an explicit tenant context and are audited; there is no implicit global scope;
- `Done when` includes a negative test: tenant A cannot read, list, or mutate tenant B's record and gets not-found, while same-tenant access still succeeds.

A task that changes the isolation mechanism itself (tenant-context resolution, authorization, RLS, scoped query/cache helpers, or a new tenant-owned surface with no established guard) is at least R3 with isolation review by `application-security`; a task that only uses the established guard stays at its normal risk but keeps the negative test. A new or changed tenancy model is costly to reverse → `adr-record`, or suite `06` when a pack is active.

## 1. Clarify — this is a gate, not small talk

Ask the user **in Indonesian** (conversation is Indonesian; the artifacts you write stay English). Don't guess an unclear requirement — ask first, skipping whatever is already obvious from context:
- Stack? (frontend / backend / DB / deploy target) — if the repo already has `AGENTS.md`/`STATUS.md`, read those first, don't re-ask.
- Who is the user, and what changes for them?
- Is the experience global, localized-global, or country-specific, and which
  audience/market behavior is observed versus assumed?
- Any existing system/DB/integration to connect to?
- Phase priority / deadline?
- What is explicitly **out of scope** (non-goals)?

If an answer would change direction, **stop and ask** — don't write a PRD on top of an assumption.

This skill still owns bounded PRD/PLAN/TASKS when the intended user, outcome, and scope are known. Route to `product-intelligence` **only** when product or business direction itself is genuinely unresolved and needs evidence-led decision work—not for ordinary requirement clarification.

## 2. PRD format

Draft into `~/Documents/work/prd/<slug>/PRD.md` first; the final PRD → project root (see Output Files).

```markdown
# PRD: [Feature/Project Name]

## Overview
One paragraph: what is being built, for whom, why now.

## Users and current workaround
| Role | Job to be done | Current workaround | Evidence status |
|---|---|---|---|
| Buyer | Order without creating an account | Orders by chat; details get lost | Observed |

First-use journey: landing -> product -> checkout form -> order confirmation.

## Product, Audience, and Market Context
- Global, localized-global, or country-specific scope
- Locale/language, device/input, trust/content behavior, and unresolved assumptions

## Goals
- Measurable goal 1
- Measurable goal 2

## Success measure
Metric, baseline, target, and when it is read (e.g. chat-order share drops from 60% to 20% within 30 days of launch).

## Non-Goals
- What is NOT covered (scope boundary — as important as the goals)

## Core features
| Feature | Priority | User benefit | Requirements |
|---|---|---|---|
| Guest checkout | Must | Buyer orders in one form, no account | REQ-001, REQ-002 |

## Requirements
Testable, numbered, EARS-style (see cheatsheet below), with a MoSCoW priority. The ID is what tasks trace to. Every `Must` carries one Given/When/Then acceptance line.
- **REQ-001** (Must, event) When the user submits the checkout form, the system shall create an order with status `pending`.
  - Acceptance: Given a valid cart, When the buyer submits the form, Then an order with status `pending` exists and the confirmation shows its number.
- **REQ-002** (Must, unwanted) If the phone number is invalid, then the system shall reject the submit and show an error.
  - Acceptance: Given an invalid phone, When the buyer submits, Then no order is created and the phone field shows the error.
- **REQ-003** (Should, state) While the province is COD-disabled, the system shall hide the COD option.
- **REQ-004** (Should, ubiquitous) The system shall log every order-status change.

## Open questions
Only questions whose answers change behavior or architecture, including contradictions found by the consistency review. Owner and due gate per item.

## Stack & Constraints
- Frontend / Backend / DB / Deploy / Constraint. (Don't repeat the global `AGENTS.md` rules. For frontend features, select the actual surface owner: `design-taste` for marketing/storefront visual direction or `admin-dashboard` for data-dense product UI; use `ui-validation` for executable browser evidence and `web-perf` for performance diagnosis.)

## Technical Decisions  *(optional — only for the costly-to-reverse ones)*
ADR-lite, one block per decision. For a costly-to-reverse decision that needs a full standalone record, delegate to `adr-record`; it owns sequential allocation and the canonical `docs/adr/ADR-NNNN-<slug>.md` filename.
- **Decision:** use Cloudflare D1, not Postgres.
  **Why:** storefront is read-heavy, edge-local, free on the Workers tier.
  **Consequence:** no `pg`-only features; migrations are manual via wrangler.

## Diagrams  *(optional — only when a trigger is met, see "When to diagram")*
Embed a ```mermaid``` block (delegate the how-to to the mermaid-diagram skill).

## Milestones
- [ ] v0.1 MVP: ...
- [ ] v0.2: ...
```

A section that genuinely does not apply stays as a heading with
`Not applicable — <reason>`; never delete a required section silently. The
standalone validator requires Problem/Overview, Users, Goals, Non-Goals,
Requirements, and Open questions.

### Default milestone order

Unless the repository already dictates another order, sequence milestones and
their tasks as: **setup -> data/auth -> core journey -> secondary journeys ->
quality (accessibility, performance, security, error paths) -> release**. Close
each phase with a checkpoint: run the phase's checks, then record the outcome
and any blockers in `STATUS.md` (the only workflow-state authority) before the
next phase starts. Skip a phase the PRD does not need; do not add tasks to fill
it.

### Browser-visible handoff

The PRD owns user outcomes, not visual taste. For a new UI or material redesign,
activate `development-kit`'s experience route before tasks are accepted:

- behavior and market context -> the relevant UX owner;
- professional local/global reference research -> UX/visual owner;
- suite mode -> `17-UX-FLOWS-SCREEN-CONTRACTS.md` plus
  `10-DESIGN-SYSTEM-WHITELABEL.md`;
- standalone mode -> extend the accepted design artifact, or create `DESIGN.md`
  only when durable cross-screen decisions need an owner and none exists; it
  then carries the UI brief, screen specs, an action table (action, trigger,
  validation, pending, success, error/recovery, next screen, `REQ-*`),
  navigation rules, and assets needed — the same fields as suite `17`/`10`;
- diagrams -> `mermaid-diagram` only for real branching, lifecycle, sequence,
  data relationship, or component-boundary value.

Do not generate frontend implementation tasks while the required experience or
visual direction is unresolved.

### EARS cheatsheet (Easy Approach to Requirements Syntax)
Write testable requirements with one of these patterns, not prose like "the system should be good". Use it for things that can actually fail (auth, payments, geo-based forms, webhooks) — **don't** force it on simple copy/UI.

| Pattern | Template |
|---|---|
| Ubiquitous | `The system shall <response>` |
| State-driven | `While <precondition>, the system shall <response>` |
| Event-driven | `When <trigger>, the system shall <response>` |
| Unwanted | `If <trigger>, then the system shall <response>` |
| Optional | `Where <feature included>, the system shall <response>` |

Combined: `While <precondition>, When <trigger>, the system shall <response>`.

## 3. PLAN format — architectural features only

Create `PLAN.md` ONLY when the feature touches **new architecture, a DB schema, or an external integration**. Small/linear CRUD: skip it, go PRD→TASKS directly (forcing three files on a small feature is the over-engineering this skill exists to prevent).

```markdown
# PLAN: [Feature Name]

## Architecture
Components + how they talk. Embed a diagram when a trigger is met.

## Platforms & Hosting
Runtime(s), hosting target, region, and the platform limits that bind the design.

## Auth, Roles & Authorization
| Role | May | May not | Enforced at |
|---|---|---|---|
| Buyer | create own order, read own order | read other orders | server route + DB predicate |
Authorization rules are server-side; a hidden control is not authorization.

## Security & Privacy
Trust boundaries, sensitive fields and their handling, secrets location (names only), abuse controls.

## Performance & Reliability Targets
| Target | Value | Linked requirement | How measured |
|---|---|---|---|
| Checkout submit p95 | < 800 ms | REQ-001 | k6 / server timing on staging |

## Environments & Delivery
Local/staging/production, how config differs, deploy path, rollback.

## Data Schema
Mermaid ERD when ≥2 related tables.
| Table.field | Type | Required | Default | Index | Notes |
|---|---|---|---|---|---|
| orders.status | text | yes | `pending` | yes (status, created_at) | enum: pending, paid, cancelled |

## Data Ownership, Retention & Deletion
| Entity | Owner (role/tenant) | Retention | Deletion/anonymization |
|---|---|---|---|

## Migration & Seed
Migration order and reversibility; seed/fixture data for dev/test/demo only — idempotent, never production data.

## Integrations & Contracts
Endpoints/webhooks/third parties. Internal API → delegate to the openapi-spec skill.

## Risks & Mitigations
What can fail, and the handling (rate limit, retry, fallback).
```

Every block between Architecture and Integrations is **conditional**: include it
only when the feature touches that concern, and write
`Not applicable — <reason>` instead of an empty heading when a reader would
otherwise expect it (e.g. no auth in a public read-only site). Performance and
reliability targets must link to a requirement; an unlinked target is a goal
without an owner. Deep security, tenancy, or IAM design still routes to
`application-security`, `adr-record`, or `development-spec-suite`.

Before accepting a costly-to-reverse technical decision, compare the real
alternatives found in the repository or current primary documentation. Record
why the selected option fits and why rejected options do not. Do not manufacture
alternatives for a decision already fixed by accepted repository evidence.

## Contract review gate

Before generating tasks, review the draft as a decision loop:

1. Every goal has at least one accepted requirement; every requirement supports
   a goal and has an observable acceptance criterion.
2. Product/market assumptions are labelled and owned; unresolved direction is
   routed back to discovery rather than hidden in implementation tasks.
3. Browser-visible work has its required UX/design handoff; architecture/data/
   integration work has only the necessary PLAN/contracts.
4. Conflicts with repository truth, duplicate canonical files, unowned failure
   paths, or unjustified decisions send the draft back for revision.
5. Run the consistency checklist below across every present file
   (`PRD.md`, `PLAN.md`, `DESIGN.md`, draft `TASKS.md`). Feed them together and
   look for contradictions, not just gaps.
6. Only a reviewed contract proceeds to `TASKS.md`.

**Consistency checklist** (semantic; the validator covers only the structural
subset marked *checked*):

- [ ] Roles named in the PRD = roles in PLAN authorization rules = roles in the
      DESIGN permission/state matrix (*checked: PRD/PLAN role-name mismatch warns*).
- [ ] Every entity a screen or action reads or writes exists in the PLAN schema
      with its fields.
- [ ] Every action has validation, pending, success, and error/recovery
      behavior, and a defined next screen.
- [ ] NFR/performance targets are plausible for the chosen hosting and its
      limits (cold starts, quotas, region).
- [ ] No task implements a non-goal; every task traces to an accepted `REQ-*`
      (*checked: unresolved requirement and orphan accepted requirement*).
- [ ] Every `Must` requirement has a Given/When/Then acceptance line
      (*checked*).
- [ ] Retention/deletion rules agree with the privacy commitments and with
      what the schema actually stores.
- [ ] No vague adjective (fast, scalable, secure, intuitive, robust) stands
      without a measurable criterion; no unresolved placeholder (`TODO`,
      `TKTK`, `???`, `<placeholder>`); one name per concept across all files
      (no terminology drift). Ambiguity checks adapted from github/spec-kit
      `analyze` (MIT).
- [ ] Each contradiction or unresolved item is recorded in the PRD's
      `Open questions` with an owner — never in a new review file — and blocks
      the affected tasks until resolved.

## Verification vocabulary

- **Acceptance criterion** — requirement-level observable behavior that decides whether the requirement is satisfied; it is not a command or a result.
- **Task `Done when`** — the task completion gate: what procedure must be executed and what acceptance criterion its result must satisfy.
- **TEST procedure** — reproducible setup, action, and assertions. A planning artifact may define it, but cannot claim its outcome.
- **Runtime EVID** — a fresh observed result recorded only after execution, including target/environment and enough output to support a pass or fail verdict. Never add placeholder or assumed passing EVID during planning.

```markdown
Acceptance criterion (REQ-001): Given a valid order payload, the API returns 201 and persists status `pending`.
Done when: Execute TEST-1 against the local endpoint; its observed result satisfies REQ-001's acceptance criterion.
TEST-1 procedure: Start the app, POST a valid payload, then assert status 201 and query the stored order.
```

Runtime EVID is intentionally absent from this planning example. Only after execution may an `EVID-*` entry record the actual target, command/request, observed status and stored row, and verdict.

## 4. Tasks format

`TASKS.md` at project root, in the repository contract shape (`config/templates/TASKS.md`, installed by `project-init`) so `resume-brief`, `ai-policy-lint`, and `delivery-ledger` can read it. Generate tasks only after their primary requirements are accepted. Each task is **atomic, context-complete, and traces to exactly one primary requirement**; other applicable IDs go in the same field as `constraints`. `Depends On` names tasks, never extra primaries.

```markdown
# Tasks: [Project Name]

## Rules for the AI
- One task per request. Task state lives in `STATUS.md` and `.delivery/`, not checkboxes.
- Change only `Allowed Paths`. Need something outside them → stop and ask.
- Respect `AGENTS.md`: YAGNI, native-first, no unrequested abstractions.
- 1 task ≈ 1 commit that passes its own check.

## Pending

### TASK-001: Add the orders table and migration
- **Requirement:** REQ-001
- **Risk Level:** R3 — schema migration.
- **Allowed Paths:** `migrations/0001_orders.sql`, `src/db/schema.ts`
- **Protected Paths:** `migrations/**`
- **Canonical Contract Owners:** `data.orders`
- **Accepted Invariants:** existing tables and rows are unchanged; the migration is additive.
- **Depends On:** None
- **Verification:** Done when the migration applies to a fresh local DB and `orders(id, status, phone, province)` exists.
- **Reopen Conditions:** the migration fails on a copy of production schema.
- **Rollback/Migration State:** additive; rollback drops `orders` before any writer ships.
- **Non-Scope:** API routes, UI.
- **Escalation Conditions:** the change needs a destructive or data-rewriting migration.

### TASK-002: Persist a valid order via `POST /api/order`
- **Requirement:** REQ-001 (constraints: REQ-004)
- **Risk Level:** R3
- **Allowed Paths:** `src/routes/api/order.ts`, `tests/order.test.ts`
- **Protected Paths:** `migrations/**`
- **Depends On:** TASK-001
- **Verification:** Done when TEST-1 is executed and the response and stored row satisfy REQ-001's acceptance criterion.

### TASK-003: Hide COD for COD-disabled provinces
- **Requirement:** REQ-003
- **Risk Level:** R1
- **Allowed Paths:** `src/components/Checkout.tsx`
- **Visual Contract:** Checkout payment step; COD option absent (not disabled) for a COD-disabled province, other options unchanged on mobile and desktop.
- **Depends On:** TASK-002
- **Verification:** Done when selecting a COD-disabled province removes COD in the rendered page and other payment options remain.

### TASK-004: Reject an invalid phone number on submit
- **Requirement:** REQ-002
- **Risk Level:** R1
- **Allowed Paths:** `src/routes/api/order.ts`, `src/components/Checkout.tsx`, `tests/order.test.ts`
- **Depends On:** TASK-002
- **Verification:** Done when a test submits an invalid phone number, the API answers 422 with a field error, no order row is written, and the form shows the error next to the phone field.
```

Risk sets the weight. R0 (docs/mechanical) may infer one obvious file. R1+ declares `Allowed Paths` — `delivery-ledger start` refuses R1-R4 runs without `--allow`, and these paths are what it takes. R3/R4 (money, auth, tenant data, migrations, architecture) add `Protected Paths` and independent review. Before an R1+ task is accepted, fill the template's remaining required fields (Canonical Contract Owners, Accepted Invariants, Reopen Conditions, Non-Scope, Escalation Conditions; Visual Contract when paths touch rendered files); TASK-001 shows a complete contract; the others show only the planning core. Use canonical names only, never the template's compatibility aliases.

## Good-task rules

1. **Traceable** — `Requirement` names exactly one accepted primary `REQ-NNN`. **No primary means YAGNI; multiple primaries mean split the task or choose the single outcome and list cross-cutting IDs as `constraints`.**
2. **Runnable DoD** — `Verification` states "Done when": a procedure to run and the acceptance condition its observed result must meet, not "finished" and not a claim that it already passed.
3. **Explicit deps** — `- **Depends On:** TASK-001, TASK-003` on its own line; any other spelling is invisible to `resume-brief`.
4. **Context-complete** — exact files/tables/endpoints in `Allowed Paths` and the title, not "build something".
5. **Sized right** — 1 task ≈ one coding session (30–90 min), small enough to review in one sitting. Feels big → split first.
6. **Ordered** — setup before feature, dependency before dependent; follow the default milestone order and end each phase with its `STATUS.md` checkpoint.

## When to diagram (delegate to the `mermaid-diagram` skill)

Diagrams aren't mandatory — embed one ONLY when it hits these, otherwise it's gold-plating:
- **ERD** — as soon as there are ≥2 related tables (D1/Postgres/Drizzle). Highest ROI.
- **Sequence** — multi-actor/async flows: COD checkout, Shopify/Scalev webhooks, auth, ingest pipeline.
- **Flowchart** — only non-trivial branching logic (e.g. geo-based hybrid form).
- **C4 Context** — only when many external systems are integrated.
- **Skip** for a single linear CRUD screen.

## Reuse, don't reinvent

- **Any diagram** → `mermaid-diagram` (native render on GitHub & Claude, no install).
- **Internal API contract** → `openapi-spec` (OpenAPI 3.1, ready for Hono/tRPC code-gen).
- **Rewriting / cleaning up / translating an existing PRD** → `volumx-writer` (meaning-preserving). This skill authors from scratch, it does not rewrite.
- **Full standalone architecture decision** → `adr-record`. Keep ADR-lite here only for a small local decision; do not invent a second filename convention.

## Output Files (portable — Mac & Linux `cuan`)

Follow the pre-development staging and repository authority contract in `~/.config/ai/policies/planning-artifacts.md` (summarized here); use `~` only (never hardcode `/Users/...` or `/home/...`):
- **No `~/Projects/<slug>/` yet** → draft and keep the accepted artifacts in `~/Documents/work/prd/<slug>/` (`PRD.md`, optional `PLAN.md`, `TASKS.md` once accepted). This staging is mandatory, not a final destination — never write directly into a project directory that does not exist yet. Once development is explicitly authorized, `project-init --from-docs ~/Documents/work/prd/<slug>/` (with `--stack <profile>` for a new project or `--repo <path> --stack existing-repository` for one that already exists) copies the staged files into `~/Projects/<slug>/`; the source stays in place as a non-authoritative snapshot, and a divergent existing destination file is never silently overwritten.
- **Feature inside an already-existing repo** → write `PRD.md` + `TASKS.md` (+ `PLAN.md` if any) directly at the **project root**, so they commit with the code. The repository copy is canonical the moment it exists.
- **Existing development-spec-suite pack** → update its canonical `docs/spec/02-PRD.md`; write `TASKS.md` (+ optional `PLAN.md`) at the **project root** as the canonical execution queue, never beside `02-PRD.md`. Detect the pack by `CONTEXT-RECORD.md`; never create a competing root `PRD.md` — a `project-init`-generated one stays only an entrypoint/link to `docs/spec/02-PRD.md`.
- Separate ADRs (if used) → allocate through `adr-record` and save as `docs/adr/ADR-NNNN-<slug>.md` in the repo, or in the pre-repository `~/Documents/work/prd/<slug>/` staging directory before promotion.

## Tips

- A bounded PRD is usually short; completeness is measured by resolved
  decisions and observable requirements, not page count. Multi-domain depth
  belongs in `development-spec-suite`, not an oversized standalone PRD.
- Non-goals prevent scope creep as strongly as goals drive it.
