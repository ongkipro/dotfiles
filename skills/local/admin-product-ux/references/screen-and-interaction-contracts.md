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
  `ui-validation` exercises the keyboard contract.
