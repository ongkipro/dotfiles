# Product, Cart, and Checkout

## Product selection

Represent selected options separately from resolved merchandise. Resolve to a
variant/merchandise ID only when the combination exists. Derive action state:

- purchasable: valid ID and currently available
- sold out: valid combination, no purchasable inventory
- unavailable: option combination does not exist
- pending/unknown: inventory or price cannot yet be confirmed

Do not silently switch the buyer to another variant. Preserve the attempted
selection and explain what must change.

## Add to cart transaction

1. Validate merchandise, quantity rules, selling plan, and required properties.
2. Mark the initiating control pending and prevent accidental repeat submission.
3. Submit through the stack's authoritative cart mutation.
4. Handle transport errors and structured business/user errors separately.
5. Reconcile cart lines, count, discounts, and estimated cost from the response.
6. Announce success or error; retain focus unless opening a deliberate dialog.
7. If opening a cart drawer, focus its meaningful heading/close or first action
   and restore focus to the initiator on close.

Optimistic feedback may show pending intent, but never fabricate confirmed
inventory, discount, or totals. Keep a non-JavaScript product form path on
hosted themes and wherever the architecture supports progressive enhancement.

## Quantity and line identity

Use the platform's line key/ID when properties, selling plans, bundles, or price
differences can split the same variant into multiple lines. Enforce displayed
minimum, maximum, and increment rules, but still handle server rejection because
inventory and rules can change concurrently.

## Cart persistence

Keep one cart ID/session owner and define creation, restoration, expiry, buyer
identity changes, locale/market changes, completion, logout, and invalid-cart
recovery. Never expose cart secrets in shareable URLs, analytics, logs, or public
markup.

## Checkout handoff

Checkout is a backend boundary, not a client-side success state. Before
navigating, resolve the current checkout target, surface blocking cart errors,
and preserve buyer/market context as the platform requires. Treat displayed cart
costs as estimated when checkout can recalculate tax, shipping, discounts,
currency, or inventory.

Accelerated checkout/Buy now may bypass cart review and apply platform-specific
wallet or buyer context. Place it as a distinct optional path and preserve the
ordinary Add to cart path. Do not recolor branded payment buttons or reproduce
them with fake controls.
