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
