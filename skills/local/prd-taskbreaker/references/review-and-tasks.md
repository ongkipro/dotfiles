# Contract review gate, verification vocabulary, TASKS.md template

Read after the PRD (and PLAN, if any) draft exists and before writing tasks.

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
      limits (cold starts, quotas, region). In a standalone repository they live
      in the `PRD.md` "Quality attributes" table, keeping only applicable rows,
      each with an enforcing command.
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
