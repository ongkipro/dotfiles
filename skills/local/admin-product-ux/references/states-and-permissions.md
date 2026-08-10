# States and Permissions

## Lifecycle contract

For each transition, specify source state, target state, actor, guard, required
input, side effects, notification, audit event, and reversibility. A status label
without transition semantics is incomplete.

Separate stored state from derived condition, business state from payment or
fulfilment sub-state, reversible from destructive actions, and synchronous
success from accepted background work.

## UI state matrix

Cover applicable states: initial loading, incremental refresh, true empty, no
filter results, partial/stale data, validation/server error, unauthorized,
read-only, pending mutation, conflict, partial bulk failure, and terminal state.
Preserve usable data during recoverable errors.

## Permission contract

Map role plus tenant/object scope. For every action specify visibility,
availability and reason, server enforcement, approval/escalation, and audit
evidence. Impersonation requires a persistent banner and immediate exit. Bulk
selection must state whether it covers the page or the full filtered result.
