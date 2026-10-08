# States and Permissions

## Lifecycle contract

For each transition, specify source state, target state, actor, guard, required
input, side effects, notification, audit event, and reversibility. A status label
without transition semantics is incomplete.

Separate stored state from derived condition, business state from payment or
fulfilment sub-state, reversible from destructive actions, and synchronous
success from accepted background work.

Correctness transitions to specify where they apply:

- **Posted is immutable.** Financial entries move draft → posted → reversed;
  a posted entry is corrected by a reversal or credit note, never edited;
  "cancel" applies to drafts only (Odoo 18 data inalterability).
- **Period lock is a transition guard.** Soft lock with an audited override
  versus hard lock that cannot be overridden (setting it needs typed
  confirmation of the date); override is a separate permission; reopening is
  audited (Odoo 18 year-end; NetSuite period close; QuickBooks closing date
  2026-08-05). Drafts may still be prepared in a locked period *(Xero,
  secondary source)*.
- **Maker-checker.** The preparer cannot approve the same item; enforce it on
  the server and show the reason in the UI (NIST SP 800-53 r5 AC-5 separation
  of duties).
- **Legal and financial submissions** (refunds, payouts, journal posting) are
  reversible, checked, or confirmed before they take effect (WCAG 3.3.4).
- **Timer-driven transitions are lifecycle edges.** Auto-cancel and
  auto-approve after a deadline (marketplace packing windows, 24 h cancel
  requests, return reviews) are modelled with their timer and shown to the
  operator as a countdown (Shopee help 87564; TikTok Shop by Tokopedia seller
  university, 2025-08-27).
- **Long work reports progress.** Bulk or background work over about 10 s
  shows percent, step, or time remaining, and can be left and resumed (NN/g
  complex-application heuristics, 2021-08-15).

## UI state matrix

Cover applicable states: initial loading, incremental refresh, true empty, no
filter results, partial/stale data, validation/server error, unauthorized,
read-only, pending mutation, conflict, partial bulk failure, and terminal state.
Preserve usable data during recoverable errors.

## Permission contract

Map role plus tenant/object scope. For every action specify visibility,
availability and reason, server enforcement, approval/escalation, and audit
evidence. Impersonation requires a persistent banner and immediate authenticated exit,
and every action records both the real operator and the impersonated user. Bulk
selection must state whether it covers the page or the full filtered result.
