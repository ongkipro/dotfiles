---
name: prd-taskbreaker
description: >-
  Turn an idea into a spec-driven PRD (goals, non-goals, EARS-style numbered requirements,
  technical decisions), then numbered tasks each tracing to one requirement with a runnable "Done
  when" — ready for an AI coding agent to build without over-engineering. Output PRD.md (+PLAN.md
  when architectural) + TASKS.md. Use on a feature request, when starting a project, or when
  planning must precede coding. Triggers: 'buat PRD', 'tulis PRD', 'write a PRD', 'pecah jadi
  task', 'break into tasks', 'planning fitur baru', 'spec this feature', 'rencanakan sebelum
  coding', 'plan before coding'. Diagrams (ERD/sequence/C4) to mermaid-diagram, API contracts to
  openapi-spec, rewriting an existing PRD to volumx-writer. NOT code, NOT marketing copy (content,
  copywriting).
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
- **`update`** — update existing artifacts; preserve every accepted requirement and task ID (never renumber or reuse it); append new IDs and explicitly supersede changed accepted items

### Suite-pack mode

If a `development-spec-suite` pack is active (`CONTEXT-RECORD.md` exists), preserve its schema: product requirements use `PR-*`, quality constraints use `NFR-*`, and task headings use `T-*`. Every product-pack task has exactly one `Primary requirement: PR-*` or `TD-*`, and that requirement must be accepted; the suite's own maintenance tasks may instead use accepted `DS-*`. Follow the pack's ownership, status, TEST, EVID, and validator rules instead of the standalone `REQ-*` examples below.

```markdown
### T-1 — Create the order endpoint
Primary requirement: PR-1
Constraints: PR-2, NFR-1
Dependencies: None
Done when: Execute TEST-1 against the local endpoint; its observed result satisfies PR-1's acceptance criteria.
```

`PR-2` and `NFR-1` affect execution but do not become additional primary requirements. During planning, define `TEST-1` if the pack activates it, but do not create or claim `EVID-*`.

## 0. Inspect before clarifying

Read repository instructions, existing PRD/spec/design artifacts, `TASKS.md`,
status evidence, routes, schemas, APIs, tests, and the affected flow before
asking questions. Trace the current behavior and reuse established terminology.
This repository-first phase is mandatory for existing code; do not design a
feature from the request text alone.

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

## Product, Audience, and Market Context
- Primary user/job and evidence status
- Global, localized-global, or country-specific scope
- Locale/language, device/input, trust/content behavior, and unresolved assumptions

## Goals
- Measurable goal 1
- Measurable goal 2

## Non-Goals
- What is NOT covered (scope boundary — as important as the goals)

## Requirements
Testable, numbered, EARS-style (see cheatsheet below). The ID is what tasks trace to.
- **REQ-1** (event) When the user submits the checkout form, the system shall create an order with status `pending`.
- **REQ-2** (unwanted) If the phone number is invalid, then the system shall reject the submit and show an error.
- **REQ-3** (state) While the province is COD-disabled, the system shall hide the COD option.
- **REQ-4** (ubiquitous) The system shall log every order-status change.

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

### Browser-visible handoff

The PRD owns user outcomes, not visual taste. For a new UI or material redesign,
activate `development-kit`'s experience route before tasks are accepted:

- behavior and market context -> the relevant UX owner;
- professional local/global reference research -> UX/visual owner;
- suite mode -> `17-UX-FLOWS-SCREEN-CONTRACTS.md` plus
  `10-DESIGN-SYSTEM-WHITELABEL.md`;
- standalone mode -> extend the accepted design artifact, or create `DESIGN.md`
  only when durable cross-screen decisions need an owner and none exists;
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

## Data Schema
Tables/columns/relations. Mermaid ERD when ≥2 related tables.

## Integrations & Contracts
Endpoints/webhooks/third parties. Internal API → delegate to the openapi-spec skill.

## Risks & Mitigations
What can fail, and the handling (rate limit, retry, fallback).
```

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
5. Only a reviewed contract proceeds to `TASKS.md`.

## Verification vocabulary

- **Acceptance criterion** — requirement-level observable behavior that decides whether the requirement is satisfied; it is not a command or a result.
- **Task `Done when`** — the task completion gate: what procedure must be executed and what acceptance criterion its result must satisfy.
- **TEST procedure** — reproducible setup, action, and assertions. A planning artifact may define it, but cannot claim its outcome.
- **Runtime EVID** — a fresh observed result recorded only after execution, including target/environment and enough output to support a pass or fail verdict. Never add placeholder or assumed passing EVID during planning.

```markdown
Acceptance criterion (REQ-1): Given a valid order payload, the API returns 201 and persists status `pending`.
Done when: Execute TEST-1 against the local endpoint; its observed result satisfies REQ-1's acceptance criterion.
TEST-1 procedure: Start the app, POST a valid payload, then assert status 201 and query the stored order.
```

Runtime EVID is intentionally absent from this planning example. Only after execution may an `EVID-*` entry record the actual target, command/request, observed status and stored row, and verdict.

## 4. Tasks format

`TASKS.md` at project root. Generate tasks only after their primary requirements are accepted. Each task is **atomic, context-complete, and traces to exactly one primary requirement**. Other applicable IDs belong under `Constraints`; dependencies name tasks, not additional primaries.

```markdown
# Tasks: [Project Name]

## Rules for the AI
- One task per request. Mark `[x]` before moving on.
- Do ONLY the task's scope. Need something outside it → ask, don't assume.
- Respect `AGENTS.md`: YAGNI, native-first, no unrequested abstractions.
- 1 task ≈ 1 commit that passes its own check.

## Phase 1: Data
- [ ] **T1** — Add the `orders(id, status, phone, province)` table and migration.
      Primary requirement: REQ-1
      Constraints: None
      Dependencies: None
      Done when: Apply the migration locally and verify the `orders` table has the specified columns.

## Phase 2: Core
- [ ] **T2** — Add `POST /api/order` to persist a valid order with status `pending`.
      Primary requirement: REQ-1
      Constraints: REQ-4
      Dependencies: T1
      Done when: Execute TEST-1; the response and stored row satisfy REQ-1's acceptance criterion.
- [ ] **T3** — Reject an invalid phone number with a user-visible error.
      Primary requirement: REQ-2
      Constraints: None
      Dependencies: T2
      Done when: Submit an invalid phone number and verify no order is stored and the specified error is shown.
- [ ] **T4** — Hide COD while the selected province is COD-disabled.
      Primary requirement: REQ-3
      Constraints: None
      Dependencies: T2
      Done when: Select a COD-disabled province and verify COD is unavailable while other payment options remain unchanged.
```

## Good-task rules

1. **Traceable** — each task names exactly one `Primary requirement: REQ-x` that is accepted. **No primary means YAGNI; multiple primaries mean split the task or choose the single outcome and move cross-cutting IDs to `Constraints`.**
2. **Runnable DoD** — `Done when` names a procedure to run and the acceptance condition its observed result must meet, not "finished" and not a claim that it already passed.
3. **Explicit deps** — `deps: [T1, T3]` so ordering and parallelism are clear to the agent.
4. **Context-complete** — name the concrete file/table/endpoint, not "build something".
5. **Sized right** — 1 task ≈ one coding session (30–90 min), small enough to review in one sitting. Feels big → split first.
6. **Ordered** — setup before feature, dependency before dependent.

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

Follow the `AGENTS.md` pre-development staging and repository authority contract; use `~` only (never hardcode `/Users/...` or `/home/...`):
- **No `~/Projects/<slug>/` yet** → draft and keep the accepted artifacts in `~/Documents/work/prd/<slug>/` (`PRD.md`, optional `PLAN.md`, `TASKS.md` once accepted). This staging is mandatory, not a final destination — never write directly into a project directory that does not exist yet. Once development is explicitly authorized, `project-init --from-docs ~/Documents/work/prd/<slug>/` (with `--stack <profile>` for a new project or `--repo <path> --stack existing-repository` for one that already exists) copies the staged files into `~/Projects/<slug>/`; the source stays in place as a non-authoritative snapshot, and a divergent existing destination file is never silently overwritten.
- **Feature inside an already-existing repo** → write `PRD.md` + `TASKS.md` (+ `PLAN.md` if any) directly at the **project root**, so they commit with the code. The repository copy is canonical the moment it exists.
- **Existing development-spec-suite pack** → update its canonical `docs/spec/02-PRD.md`; write `TASKS.md` (+ optional `PLAN.md`) at the **project root** as the canonical execution queue, never beside `02-PRD.md`. Detect the pack by `CONTEXT-RECORD.md`; never create a competing root `PRD.md` — a `project-init`-generated one stays only an entrypoint/link to `docs/spec/02-PRD.md`.
- Separate ADRs (if used) → allocate through `adr-record` and save as `docs/adr/ADR-NNNN-<slug>.md` in the repo, or in the pre-repository `~/Documents/work/prd/<slug>/` staging directory before promotion.

## Tips

- A bounded PRD is usually short; completeness is measured by resolved
  decisions and observable requirements, not page count. Multi-domain depth
  belongs in `development-spec-suite`, not an oversized standalone PRD.
- Non-goals prevent scope creep as strongly as goals drive it.
- Each task must be doable without reading the whole PRD — its context is complete in the task itself.
- Requirements first, then tasks. A task appearing with no requirement is a signal that scope quietly widened.
