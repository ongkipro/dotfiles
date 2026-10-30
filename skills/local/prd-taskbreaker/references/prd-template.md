# PRD.md template and rules

Read when writing or updating `PRD.md`. Fill every required section; a section that does not apply keeps its heading with `Not applicable — <reason>`.

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
