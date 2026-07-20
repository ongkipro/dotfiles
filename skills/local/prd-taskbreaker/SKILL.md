---
name: prd-taskbreaker
description: >-
  Turn an idea or feature request into a spec-driven PRD (goals, non-goals, EARS-style
  numbered requirements, technical decisions) then break it into numbered tasks where each
  one traces back to a single requirement and carries a runnable "Done when" — ready for an
  AI coding agent to build without over-engineering. Output: PRD.md (+PLAN.md for architectural
  features) + TASKS.md. Use when starting a new feature/project or when structured planning is
  needed before coding. Triggers: 'buat PRD', 'tulis PRD', 'write a PRD', 'pecah jadi task',
  'break into tasks', 'planning fitur baru', 'spec this feature', 'rencanakan sebelum coding',
  'plan before coding'. For DIAGRAMS (ERD/sequence/C4) delegate to mermaid-diagram; for API
  contracts to openapi-spec; to REWRITE/clean up an existing PRD to volumx-writer. NOT for
  writing the code itself, and NOT for marketing/landing copy (content, copywriting).
---

# PRD Taskbreaker

Raw idea → spec-driven PRD → numbered tasks an AI agent can build **without over-engineering**.

The binding rule: **every task traces back to one requirement, and every requirement is testable with a runnable "Done when".** A task with no requirement is YAGNI — cut it. That is the structural brake that stops an agent from adding unrequested features, in line with the lazy-senior-dev discipline in `AGENTS.md`.

## Flow

```
[Idea] → [1. Clarify — GATE, resolve ambiguity first]
       → [2. PRD.md — goals + non-goals + numbered requirements (EARS)]
       → [3. PLAN.md — ONLY if it touches architecture/DB/integration]
       → [4. TASKS.md — each task → REQ-x, deps, Done-when]
       → (per task) implement → run its check → commit additively
```

## Modes

- **`prd`** — PRD only, from a description
- **`plan`** — technical PLAN from an existing PRD (architectural features)
- **`tasks`** — break an existing PRD/PLAN into tasks
- **`full`** *(default)* — clarify → PRD → (plan if needed) → tasks in one run
- **`update`** — update existing artifacts; keep REQ/task numbering stable

## 1. Clarify — this is a gate, not small talk

Don't guess an unclear requirement. Ask first (skip whatever is already obvious from context):
- Stack? (frontend / backend / DB / deploy target) — if the repo already has `AGENTS.md`/`STATUS.md`, read those first, don't re-ask.
- Who is the user, and what changes for them?
- Any existing system/DB/integration to connect to?
- Phase priority / deadline?
- What is explicitly **out of scope** (non-goals)?

If an answer would change direction, **stop and ask** — don't write a PRD on top of an assumption.

## 2. PRD format

Draft into `~/Documents/work/prd/<slug>/PRD.md` first; the final PRD → project root (see Output Files).

```markdown
# PRD: [Feature/Project Name]

## Overview
One paragraph: what is being built, for whom, why now.

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
- Frontend / Backend / DB / Deploy / Constraint. (Don't repeat the global `AGENTS.md` rules.)

## Technical Decisions  *(optional — only for the costly-to-reverse ones)*
ADR-lite, one block per decision. A separate ADR file (`docs/adr/NNNN-*.md`) ONLY for large projects.
- **Decision:** use Cloudflare D1, not Postgres.
  **Why:** storefront is read-heavy, edge-local, free on the Workers tier.
  **Consequence:** no `pg`-only features; migrations are manual via wrangler.

## Diagrams  *(optional — only when a trigger is met, see "When to diagram")*
Embed a ```mermaid``` block (delegate the how-to to the mermaid-diagram skill).

## Milestones
- [ ] v0.1 MVP: ...
- [ ] v0.2: ...
```

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

## 4. Tasks format

`TASKS.md` at project root. Each task is **atomic, context-complete, and traces back to a requirement**.

```markdown
# Tasks: [Project Name]

## Rules for the AI
- One task per request. Mark `[x]` before moving on.
- Do ONLY the task's scope. Need something outside it → ask, don't assume.
- Respect `AGENTS.md`: YAGNI, native-first, no unrequested abstractions.
- 1 task ≈ 1 commit that passes its own check.

## Phase 1: Setup
- [ ] **T1** — Init [stack]. Output: dev-ready folder structure.
      → REQ: — · deps: [] · Done when: `pnpm dev` runs without error.
- [ ] **T2** — DB schema: table `orders(id, status, phone, province)` + migration.
      → REQ: REQ-1 · deps: [T1] · Done when: `wrangler d1 migrations apply` succeeds; table exists.

## Phase 2: Core
- [ ] **T3** — POST /api/order endpoint: validate + insert status `pending`.
      → REQ: REQ-1, REQ-2 · deps: [T2] · Done when: valid payload→201, invalid phone→400.

## Phase 3: Polish & Deploy
- [ ] **T4** — Deploy to [target] via [method].
      → REQ: — · deps: [T3] · Done when: live URL responds 200.
```

## Good-task rules

1. **Traceable** — each task names `→ REQ-x`. **A task with no requirement is YAGNI → cut it, or ask why it exists.**
2. **Runnable DoD** — "Done when" must be something actually run (a command, a test, a UI check), not "finished". Matches the "ONE runnable check" rule in `AGENTS.md`.
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

## Output Files (portable — Mac & Linux `cuan`)

Follow the `AGENTS.md` Output discipline; use `~` only (never hardcode `/Users/...` or `/home/...`):
- **Draft/iteration** → `~/Documents/work/prd/<slug>/` (PRD.md, PLAN.md).
- **Final** `PRD.md` + `TASKS.md` (+ `PLAN.md` if any) → **project root**, so they commit to GitHub alongside the code.
- Separate ADRs (if used) → `docs/adr/NNNN-<slug>.md` in the repo.

## Tips

- A good PRD fits 1–2 pages. Over-speccing up front is guessing; let detail surface during implementation.
- Non-goals prevent scope creep as strongly as goals drive it.
- Each task must be doable without reading the whole PRD — its context is complete in the task itself.
- Requirements first, then tasks. A task appearing with no requirement is a signal that scope quietly widened.
