---
name: prd-taskbreaker
description: >-
  Turn an idea or feature into PRD.md (goals, non-goals, EARS requirements) + TASKS.md (one task → one requirement, runnable Done-when), PLAN.md only if architectural. Not code, copy, diagrams, or rewriting a PRD. Triggers: buat PRD, pecah jadi task.
---

# PRD Taskbreaker

Raw idea → spec-driven PRD → numbered tasks an AI agent can build without
over-engineering. Binding rule: **every task has exactly one primary accepted
requirement**; other requirement or quality IDs are constraints. A task with
no primary requirement is YAGNI — cut it.

Paths are relative to this skill's directory. Read only this file up front;
open a reference when the step names it.

**Pick the path first:**
- `update` — the feature already has accepted `REQ-*`/`TASK-*` entries in the
  repo's PRD/TASKS (an existing `TASKS.md` for other features is not enough;
  a new feature in an existing repo is `full`): keep every accepted ID (never renumber or
  reuse), append new IDs, supersede changed items explicitly, keep the file's
  ID style. Then §3 for the touched part only.
- `tasks` from an existing PRD/PLAN: §3 → `references/review-and-tasks.md`.
- `prd` / `full` (default): §0 → §1 → §2 → §3.

**Suite-pack mode.** If `CONTEXT-RECORD.md` exists, a `development-spec-suite`
pack is active: requirements are `PR-*`/`NFR-*`, task headings `T-*`, each
task has one bold `- **Primary requirement:** PR-*` (or accepted `TD-*`/`DS-*`),
and `check-traceability.py docs/spec --tasks TASKS.md` validates. Update
`docs/spec/02-PRD.md`, never a competing root `PRD.md`.

## 0. Inspect before clarifying

Read repository instructions, existing PRD/spec/design artifacts, `TASKS.md`,
status evidence, routes, schemas, APIs, tests, and the affected flow. Reuse the
repository's terminology. Do not design from the request text alone.

**Tenant boundary.** If the repo shows tenancy (`tenant_id`/`org_id`/
`store_id`, RLS, tenant middleware, suite `06`), every requirement touching
tenant-owned data carries a tenant-scope constraint: server-side tenant
resolution from membership (client IDs are selectors only); tenant in every
cache/queue/storage/search/rate-limit/export key; explicit audited tenant
context for operators and jobs; a negative test in `Done when` (tenant A gets
not-found on tenant B's record). Changing the isolation mechanism itself is
R3+ with `application-security` review; a new tenancy model goes to
`adr-record` or suite `06`.

## 1. Clarify — a gate, not small talk

Ask in Indonesian (artifacts stay English). Skip what the repo already
answers. Needed: who the user is and what changes for them; stack and
existing systems to connect; global vs localized vs country-specific
behavior; priority/deadline; explicit non-goals. If an answer would change
direction, stop and ask. Genuinely unresolved product direction →
`product-intelligence`; ordinary requirement clarification stays here.

## 2. Write PRD.md (and PLAN.md only when architectural)

Open `references/prd-template.md` and fill it: users + workaround, first-use
journey, market context, goals, success measure, non-goals, core features,
numbered EARS requirements with MoSCoW priority and a Given/When/Then
acceptance line on every `Must`, open questions, stack/constraints,
ADR-lite decisions, milestones. A section that does not apply keeps its
heading with `Not applicable — <reason>`.

`PLAN.md` only when the feature touches new architecture, a DB schema, or an
external integration: `references/plan-template.md`. Small/linear CRUD goes
PRD → TASKS directly. Before accepting a costly-to-reverse decision, compare
the real alternatives in the repo or current docs; a full standalone decision
is `adr-record`.

**Browser-visible work.** The PRD owns outcomes, not visual taste. Route the
experience through `development-kit` (UX owner → `design-taste` or
`admin-dashboard`); suite mode uses `17` + `10`, standalone extends the
accepted design artifact or creates `DESIGN.md` only when durable cross-screen
decisions need an owner. Do not write frontend tasks while direction is
unresolved.

**Milestone order** unless the repo dictates otherwise: setup → data/auth →
core journey → secondary journeys → quality → release; each phase ends with a
`STATUS.md` checkpoint. Skip phases the PRD does not need.

## 3. Review, then TASKS.md

Open `references/review-and-tasks.md`: run the contract review gate and the
consistency checklist across every present file, then write tasks with the
template there. Good-task rules:

1. **Traceable** — one accepted primary `REQ-NNN`; cross-cutting IDs as constraints.
2. **Runnable DoD** — `Done when` names a procedure and the acceptance condition; never a claim it passed.
3. **Explicit deps** — `- **Depends On:** TASK-001` on its own line (`resume-brief` reads only that form).
4. **Context-complete** — exact files/tables/endpoints in `Allowed Paths` and the title.
5. **Sized right** — one coding session (30–90 min); feels big → split.
6. **Ordered** — setup before feature, dependency before dependent.

Risk sets the weight: R0 may infer one obvious file; R1+ declares `Allowed
Paths` (`delivery-ledger start` refuses R1–R4 without `--allow`); R3/R4
(money, auth, tenant data, migrations, architecture) add `Protected Paths`
and independent review.

**Diagrams** (`mermaid-diagram`) only when earned: ERD at ≥2 related tables,
sequence for multi-actor/async flows, flowchart for non-trivial branching,
C4 for many external systems. Skip for a linear CRUD screen.

## Output location

Follow `~/.config/ai/policies/planning-artifacts.md`; `~` only, never
hardcoded home paths.

- No `~/Projects/<slug>/` yet → stage in `~/Documents/work/prd/<slug>/`;
  promote with `project-init --from-docs …` only after explicit development
  authorization. Never write into a project directory that does not exist.
- Feature in an existing repo → `PRD.md` + `TASKS.md` (+ `PLAN.md`) at the
  project root; canonical the moment it exists.
- Suite pack → `docs/spec/02-PRD.md` + root `TASKS.md`.
- ADRs → `adr-record` → `docs/adr/ADR-NNNN-<slug>.md`.

Hand off: diagrams → `mermaid-diagram`; internal API contract →
`openapi-spec`; rewriting an existing PRD → `writer`; multi-domain depth →
`development-spec-suite`, not an oversized standalone PRD.
