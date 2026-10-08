# Operator Surfaces: Presentation Detail

Presentation rules for the operator screens in SKILL.md §8. Lifecycle,
permissions, and transition semantics stay in `admin-product-ux`
(`screen-and-interaction-contracts.md`, `states-and-permissions.md`). Platform
rules change; re-check the cited page before relying on a number. Items marked
*(unverified)* came from search snippets, not a fetched page.

## Order fulfilment queue and seller center (Indonesia)

- **Deadlines drive the queue, so show them.** Sort the work queue by the
  nearest deadline, and show a WIB countdown per row (ship-by, reply-by,
  respond-by), not only the order date.
  - TikTok Shop by Tokopedia (effective 2025-08-27, seller university): orders
    before 12:00 WIB ship by 23:59 the same day, later ones by 23:59 the next
    day; the platform assigns the courier; an order counts as shipped only on
    the courier's scan.
  - Shopee (help article 87564): an order auto-cancels when the packing window
    is missed or the waybill is not verified in time; a buyer cancel request
    not answered within 24 h is auto-approved after a further 24 h. Packing
    window length *(unverified)*.
- **"Label printed" is not "shipped".** Keep a distinct state between waybill
  (resi) created and courier scan; never show the order as shipped on print.
- **No courier picker where the platform assigns the courier.**
- **Store health shows threshold and window.** TikTok Shop by Tokopedia
  (2026-08-26): late dispatch rate over 7 days, target under 4%, daily order
  caps at 90% / 70% / 50% as it reaches 10–30%; fast dispatch rate above 95%
  over 30 days. A health metric without its threshold and window is unreadable.
- **COD returns are a flow, not a status.** After failed delivery attempts the
  order returns to sender (RTS); show attempts, RTS state, and any claim with its
  timeline. A COD order is never shown as paid before settlement.
- **Seller-center home groups tasks with counts** (to pack, to ship, to reply,
  returns to review) that deep-link into filtered lists (Shopify Home), not a
  revenue grid.
- **Bulk actions skip and flag ineligible rows** individually, show progress,
  and say how many were done (Shopify bulk fulfillment); "select all results"
  is explicit and may be capped on mobile.

## Inventory and warehouse

- **Stock is a derived balance of reasoned movements, never an editable
  number** (Shopify inventory states and adjustment history; Odoo 18). Show
  on hand = committed + unavailable + available, each adjustment with a reason
  (correction, count, received, return restock, damaged, theft/loss), actor,
  and "delta → new total". History is never deletable.
- **Cycle count:** a Counted column beside On Hand with the difference computed
  (Odoo 18). Picking on a phone is scan-first; validating an incomplete pick
  creates a backorder (Odoo 18 barcode).

## Finance and ledger presentation

- **Posted rows have no Edit or Delete.** Show Reverse / Credit note instead;
  states draft → posted → reversed (Odoo 18 data inalterability).
- **Numbers:** one precision per ledger column; negatives with a minus sign or
  explicit parentheses, never color alone (see SKILL.md §8 Currency for the
  id-ID `Intl` behavior); prose amounts follow GOV.UK style (no ".00" unless
  there are cents, "500 to 900", "2 June").
- **Reconciliation:** three panes — bank lines, candidates, resulting entry plus
  remaining balance — with a suspense account and a "To check" state (Odoo 18).
- **Period lock is visible:** show the lock date and type on affected screens
  and an "exceptions after close" report (QuickBooks closing date, 2026-08-05).
- **Approval inbox:** master-detail; mass action only across the same task
  type; a decision note on every approve/reject *(SAP My Inbox, unverified)*.

## Audit log UI

- **Fields** (OWASP Logging Cheat Sheet): when (event time and log time),
  where (app, URL), who (identity, IP), what (action, **result, reason**).
  Impersonated actions record both identities.
- **Never shown or stored:** passwords, tokens, session IDs, unmasked personal
  data — including inside before/after diffs.
- **Read-only, restricted, and itself audited:** protect logs from change or
  deletion and limit read access to a defined role (NIST SP 800-53 r5 AU-9);
  record who views the log.
- **Filters and export:** actor and date-range filters, CSV export with the
  timezone stated (GitLab audit events: UI range max 30 days, export in UTC).

## Notifications and search

- **Global vs local search** (Carbon search pattern): global search goes to a
  results page; local search filters in place. One scope selector with "All"
  as the default, recent searches on focus, Enter submits.
- Toast and notification rules live in `shadcn-ui`
  `references/admin-component-system.md` (Foundation and feedback).
