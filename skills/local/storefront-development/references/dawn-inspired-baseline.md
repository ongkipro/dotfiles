# Dawn-Informed Storefront Baseline

Use Dawn as an engineering reference for HTML-first structure, progressive
enhancement, accessible disclosure/dialog behavior, and resilient commerce
forms. Do not copy its palette, spacing, layout proportions, CSS classes,
section schema, or JavaScript architecture into another stack.

If submitting a new Shopify Theme Store theme, check current Theme Store
requirements before choosing a starter. Shopify currently requires new themes
to use Skeleton rather than deriving from Dawn or Horizon. That publishing rule
does not prohibit learning from Dawn's interaction patterns.

## System baseline

- Use project semantic tokens for canvas, surface, text, muted text, border,
  accent, focus, success, warning, and destructive states.
- Keep one radius system and reserve shadow for genuinely floating layers.
- Typography, spacing, media ratios, and density come from brand/product
  context, not from this reference.
- Build a usable document before enhancement. Links navigate, forms submit,
  labels identify controls, and content remains understandable without
  JavaScript where the platform permits.

## Store shell

- Keep header, search, account, locale/market, and cart entry semantically and
  spatially predictable between routes.
- Navigation disclosure uses a button with state, a bounded panel, Escape,
  outside-dismiss where appropriate, focus return, and no hover-only path.
- Mobile is a designed transformation, not desktop navigation hidden behind an
  unlabeled hamburger.

## Collection and search

- Render a useful result list in server HTML where possible.
- Keep result count, sort, active filters, clear-all, and load/error/zero-result
  states in the same ownership boundary as the list.
- Product-card markup remains comparable at realistic title, price, badge,
  rating, and availability lengths. Reserve image and price geometry.
- A promotional tile remains identifiable as merchandising content and cannot
  alter product counts, filtering, keyboard order, or pagination semantics.
- Filter sidebar may become a sheet or disclosure on narrow screens; preserve
  active-filter count and clear-all.

## Product detail

- Compose media and purchase-decision regions from the accepted visual contract
  rather than a universal split ratio.
- Keep title, current price and basis, selected options, availability,
  fulfilment, and purchase action in one coherent data boundary so a variant
  response cannot update only part of the decision.
- Variant controls use real input/button/select semantics and retain readable
  labels. Swatches need text equivalents; long option sets may use a select.
- Gallery thumbnails, pagination, zoom, video, and model controls are explicit
  and keyboard-operable. Swipe/drag and hover are enhancements.
- Sticky purchase controls are conditional and must retain sufficient selected
  product/variant and price context without covering errors or material terms.

## Product form and cart

- Keep the product form functional for the base valid variant. JavaScript may
  improve dependent options and inline mutation feedback.
- Prevent duplicate pending submission while allowing intentional subsequent
  quantity adds.
- A cart drawer is optional. If used, it behaves as a dialog with accessible
  name, focus containment/return, Escape, and a full cart route fallback.
- Preserve line identity, properties, plans/bundles, quantity rules, discounts,
  partial failures, and server-reconciled totals. Do not address lines only by
  product or variant.
- Keep recommendations below unresolved cart state and the checkout action.

## Resilient enhancement

Enhance only after base behavior works:

- predictive search keeps an ordinary search route;
- quick add defers to PDP when material options are unresolved;
- filters preserve URL/query semantics;
- gallery controls retain buttons and labels;
- cart mutations reconcile from backend results;
- animations use transform/opacity, respect reduced motion, and never delay a
  purchase decision.

Each enhancement owns loading, empty, unavailable, error, pending, conflict,
success, keyboard, focus, announcement, and cleanup behavior.

## Baseline acceptance

- JavaScript failure leaves an understandable product and a safe route forward.
- Current price, availability, selected configuration, and action cannot drift.
- Narrow layouts preserve the decision sequence without clipping or covered
  controls.
- Async availability, cart count, totals, and errors are announced without
  stealing focus.
- Secondary reviews, recommendations, tracking, chat, and rich media do not
  block product identity, price, availability, and primary action.
