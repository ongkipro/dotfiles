---
name: admin-product-ux
description: Model product workflows and interaction requirements for SaaS, CRM, ERP, internal tools, seller consoles, and admin systems before visual design or component implementation. Use when defining roles, jobs, business objects, entity lifecycles, permissions, list-detail behavior, forms, bulk operations, approvals, audit history, screen contracts, state matrices, UX acceptance criteria, or adaptive implementation boundaries for Astro, Vite/React, and Next.js; also use when an admin UI feels generic, incomplete, or operationally incorrect. Hand visual hierarchy to admin-dashboard and component code to shadcn-ui only after the workflow contract is sufficient.
---

# Admin Product UX

Model the operator's work before drawing the interface. Produce the smallest
contract that prevents visual polish from hiding an incomplete workflow.

## Operating rule

Do not begin with navigation, cards, or components. Establish:

1. actor and job
2. business objects and lifecycle
3. task flow and exception paths
4. permissions and scope
5. screen contracts and states
6. UX acceptance criteria

Label assumptions. Ask only questions that materially change the workflow; do
not invent business rules to complete a template.

## Workflow

### 1. Inspect before interviewing

For an existing product, inspect routes, schema, types, API contracts, status
enums, authorization code, current screens, and product documents. Disk beats
memory and mockups. Trace at least one real workflow end to end.

### 2. Define the operational frame

Record the primary actor, job, trigger, frequency, volume, risk, time pressure,
success condition, and failure cost. Separate daily operations, monitoring,
configuration, governance, and reporting; do not flatten them into one menu.

Read [Discovery and domain](references/discovery-and-domain.md).

### 3. Model objects and lifecycle

Define canonical nouns, relationships, ownership, states, valid transitions,
guards, side effects, reversibility, and terminal states. Preserve domain
language. A CRM pipeline, subscription, order, ticket, and approval request
have different semantics even when all render as tables.

### 4. Model tasks, exceptions, and permissions

Describe happy path, retry, cancellation, conflict, partial failure, escalation,
approval, and recovery. Map every sensitive action to role, tenant/object scope,
preconditions, confirmation, and audit evidence. UI visibility is never access
control.

Read [States and permissions](references/states-and-permissions.md).

### 5. Specify screens

Derive navigation and screens from tasks and objects. For each screen, define
entry points, required information, primary and secondary actions, dangerous
actions, states, persistence, and completion criteria. Select list-detail,
queue, timeline, wizard, settings, or dashboard based on the job—not habit.

Read [Screen and interaction contracts](references/screen-and-interaction-contracts.md).

### 6. Adapt without changing the product contract

Keep roles, lifecycle, permissions, and screen states framework-neutral. Then
map rendering, hydration, data ownership, mutations, and navigation to the
installed stack. Read [Framework and visual system](references/framework-and-visual-system.md)
for Astro, Vite/React, Next.js, and the two-theme blue/indigo admin baseline.

### 7. Review completeness

Run [Review rubric](references/review-rubric.md). Do not declare the UX ready
while a primary job, destructive path, permission boundary, or failure recovery
remains undefined.

## Proportional output

For a small feature, return a compact contract inline. For a multi-screen
system, copy and complete only the needed templates:

- `assets/screen-contract.yaml`
- `assets/state-permission-matrix.csv`
- `assets/workflow-contract.yaml`

Save drafts under `~/Documents/work/prd/`. Do not create a new final root-level
spec filename unless the user accepts that repository convention.

## Handoff

After product correctness is established:

- use `admin-dashboard` for hierarchy, tables, KPI/chart decisions, responsive
  behavior, and operator presentation
- use `design-taste` for visual direction
- use `astro-development` or the installed framework for runtime boundaries
- use `shadcn-ui` for component APIs and installation
- use `ui-validation` for browser evidence

Do not duplicate those skills here. This skill owns the product workflow and
interaction contract they consume.
