# Commerce journeys and states

Use only the sections relevant to the task. Treat this as an audit checklist, not a mandate to add every feature.

## Discovery: search, PLP, and collections

- Make the query, result count, applied filters, sort, and correction/expansion behavior clear.
- Preserve filters and scroll/list position across product-detail visits when feasible.
- Put active filters in removable controls; provide clear-all; distinguish zero results from load failure.
- Choose pagination, load-more, or continuous loading from the browsing task. Preserve URL/history and provide an accessible route to the footer.
- Define no-query, no-result, partial-result, stale-price, and unavailable-product behavior.
- Keep product cards comparable: identity, representative price, availability signal, and option context must mean the same thing across cards.

## Evaluation: PDP and variants

- Keep product identity, price basis, availability, option selection, quantity, fulfillment promise, and primary action mutually consistent.
- Model selection states explicitly: no selection, partial selection, valid available combination, valid sold-out combination, invalid/nonexistent combination, and data failure.
- Preserve selections during gallery use, disclosure expansion, and validation. Link or restore the selected variant when supported.
- Update price, media, identifier, inventory, fulfillment, and action label atomically enough to avoid mixed states.
- Avoid false urgency and unsupported scarcity. State preorder, backorder, made-to-order, subscription, and final-sale consequences before commitment.
- Make media keyboard-operable, zoom-safe, captioned where needed, and non-blocking for the decision controls.

## Cart

- Support quantity change, removal with recovery when practical, option review, and navigation back to the product.
- Show pending recalculation and the confirmed result. Explain rejected quantities, sold-out lines, promotion changes, and price changes at line level.
- Separate subtotal from shipping, taxes, duties, discounts, store credit, and final total when those values are not yet known.
- Define empty, loading, stale, merge-after-login, multi-tab conflict, and checkout-return states.
- Keep cart count semantics consistent: line count versus total quantity must not switch silently.

## Checkout boundary

- Identify the last storefront-owned action and the first checkout-owned state.
- Prevent duplicate submission; retain a recoverable cart if redirect or checkout creation fails.
- Communicate domain/context changes and supported return paths without claiming an order exists early.
- Pass only verified price, line, market, customer, and attribution state. Never put sensitive data in URLs or analytics payloads.
- Cover authentication challenges, address/payment errors, inventory revalidation, abandonment, cancellation, and confirmed completion even when the platform owns their UI.

## Account and post-purchase

- Separate identity/authentication state from cart state; preserve both through sign-in and sign-out according to verified policy.
- Provide recovery for expired links, failed verification, locked accounts, and sessions that expire mid-task.
- For orders, expose status, items, totals, fulfillment/tracking, address, and available actions without promising unsupported cancellation or return behavior.
- Avoid exposing personal order data through cache, logs, analytics, shared URLs, or public error messages.

## Localization and markets

- Treat language, currency, market, shipping destination, and tax/duty context as related but distinct state.
- Explain consequences before a market change clears a cart, changes catalog eligibility, or reprices lines.
- Use locale-aware formatting and correct reading direction. Allow user override when automatic detection is uncertain.
- Test long translations, pluralization, address/name variation, currencies with different minor units, and unavailable cross-market products.

## Cross-cutting acceptance probes

- Keyboard-only and screen-reader users can complete the same critical journey.
- Back, forward, refresh, deep links, and a second tab do not corrupt or silently discard meaningful state.
- Slow, failed, duplicated, and out-of-order requests resolve predictably.
- Core decisions remain possible at narrow width, 200% zoom, reduced motion, and without hover.
- Essential identity, price, availability, and primary controls arrive before optional media and recommendations.
- Consent denial or tracker failure does not block buying; events never contain payment credentials or unnecessary personal data.
