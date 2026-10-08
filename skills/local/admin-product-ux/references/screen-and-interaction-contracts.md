# Screen and Interaction Contracts

## Screen contract

Define one primary job per screen. Record actor, entry points, object/scope,
decision-critical information, primary/secondary/dangerous actions, query-state
persistence, permission differences, success/failure navigation, and measurable
completion evidence.

Split a screen when unrelated primary jobs compete. Combine screens when an
operator repeatedly loses context between a list and details required for the
same decision.

## Pattern selection

- Queue: time-sensitive triage and assignment.
- List-detail: scan many objects, inspect one, retain context.
- Detail + timeline: history, collaboration, and audit dominate.
- Wizard: ordered steps with real dependency, not merely a long form.
- Settings: infrequent configuration with explicit scope and defaults.
- Dashboard: monitoring and prioritization, not a replacement for operations.
- List report vs worklist: a list report helps *find* records; a worklist is
  for *processing* work items in priority order (SAP Fiori, unverified wording).
- Editorial: a record has a published version and a working draft; publish is
  a separate transition from save; states such as draft / in review /
  scheduled / published / changed-since-publish; a document lock with a
  read-only view and an explicit take-over that notifies the first editor;
  scheduling needs an explicit Schedule action and a timezone (WordPress post
  status and Revisions 2026-09-28; Payload drafts and locked documents; Sanity
  Releases). An API that bypasses the lock means the UI lock is not data
  protection.
- SLA inbox: sort by the next breach, show signed remaining time (amber under
  15 min, red at breach, then negative), show who else is viewing or editing
  (Zendesk SLA badges and collision detection). Routing choice: round robin
  ignores workload; balanced assignment respects capacity (Intercom).
- Board (pipeline): board and list are two views of one saved view; each
  column shows its total; entering a stage enforces that stage's required
  fields *(HubSpot/Salesforce, partly unverified)*; drag always has a
  "Move to…" alternative.
- Inventory ledger: balance is derived from reasoned movements; each reason has
  a fixed direction; history is append-only (Shopify inventory; Odoo 18).
- Reconciliation: three panes — source lines, candidate matches, resulting
  entry with remaining balance — plus a suspense/"to check" state (Odoo 18).
- Approval inbox: master-detail, a decision note on each decision, mass action
  only within one task type *(SAP My Inbox, unverified)*.

## Edit pattern choice

- Inline edit: frequent single-field changes; Enter saves, Esc cancels; never
  inside a form; save-on-blur is not obvious (Atlassian inline edit).
- Grid edit: edited cells stay drafts until one table-level Save *(Salesforce
  datatable, unverified)*.
- Object page with draft: multi-field or multi-user changes; draft saved
  periodically, object locked while edited, lock expiry, explicit
  Save / Keep draft / Discard on leave, and a conflict message when a newer
  version exists (SAP Fiori draft handling v1.148).
- Non-modal side panel: when the operator must keep the list in view (NN/g
  Data Tables 2022-04-03). A modal form for every edit is a default to avoid.

## Destructive actions

Three tiers (GitLab Pajamas destructive actions, 2026-07-13): high —
irreversible or wide impact → type the object's name, state any restore
window; medium — recoverable but painful → two-click friction (e.g. inside a
dropdown); low → no confirmation, offer Undo. Buttons name the action; no
default answer (NN/g confirmation dialogs, 2018, reviewed 2026-08-07).

## Settings and setup

- Low-impact settings may autosave; high-impact ones use an explicit Save;
  **never mix both models in one form**. Inherited or locked settings show why
  and where they are set (GitLab Pajamas settings management, 2026-07-15).
  A contextual save bar appears only while there are unsaved changes
  (Shopify settings template).
- Setup checklist for a new workspace: "N of M steps completed", each step
  links to where the task is done, dismissible and collapsible (Shopify setup
  guide). Model it as the screen contract's first-use state; no forced product
  tour.

## Forms and mutations

Specify defaults, conditional and cross-field validation, duplicate prevention,
draft/autosave, unsaved changes, server error mapping, retry, idempotency, and
confirmation boundaries. Use outcome labels such as `Qualify lead` or `Cancel
at period end`, not `Submit` or `Manage`.

Two submit-time rules belong in the contract, not left to implementation:

- The submit control stays enabled until the request starts, then shows a
  pending state and blocks duplicates; on failure, focus moves to the first
  invalid field and each error sits beside its control. A control disabled
  before validation hides why the form will not submit. (Vercel Web Interface
  Guidelines, https://github.com/vercel-labs/web-interface-guidelines)
- In a multi-step wizard, approval, or onboarding flow, information already
  entered or shown earlier in the same process is auto-populated or offered
  for selection, never re-typed, unless re-entry is essential, a security
  requirement, or the earlier value is no longer valid. (WCAG 2.2 SC 3.3.7
  Redundant Entry, Level A, https://www.w3.org/TR/WCAG22/#redundant-entry)

## Keyboard and focus contract

For each composite control, record its WAI-ARIA APG pattern
(https://www.w3.org/WAI/ARIA/apg/patterns/, verified 2026-10-02) instead of
leaving keyboard behavior to the component kit. Two decisions belong in the
screen contract because they change the product, not the styling:

- Where focus goes after a dialog closes when its invoker no longer exists
  (after deleting a row: the next row, the list heading, or the empty state),
  and which control a destructive confirmation focuses first (the least
  destructive one).
- Whether a dense list is a table (every control in the Tab order; the default)
  or an editable grid (one Tab stop, arrow-key cell navigation). Choose grid
  only for cell-level editing or actions; `admin-dashboard` presents it and
  `ui-validation` exercises the keyboard contract. In a grid, Enter or F2 enters
  a cell and Esc returns to grid navigation; Shift+Space selects a row. Use
  treegrid for hierarchical rows such as order → line items (APG grid and
  treegrid patterns).
- Single-key shortcuts must be possible to turn off or remap, or act only on
  focus (WCAG 2.1.4); accelerators stay optional, cover frequent actions only,
  are shown beside the action, and never override OS shortcuts (NN/g UI
  accelerators, 2024-10-18; Pajamas keyboard shortcuts).
