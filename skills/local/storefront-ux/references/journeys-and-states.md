# Commerce Journeys and States

Use only the sections relevant to the accepted journey. This is a contract
checklist, not a mandate to add every feature.

## Discovery: search, PLP, and collections

- Make the query, result count, applied filters, sort, correction/expansion,
  and active market context clear.
- Preserve filters and list/scroll position across product-detail visits when
  feasible.
- Put active filters in removable controls; provide clear-all; distinguish zero
  results from load failure.
- A merchandising tile must be distinguishable from a product and must not
  corrupt result counts, keyboard order, filtering, or responsive flow.
- Choose pagination, load-more, or continuous loading from the browsing task.
  Preserve URL/history and provide an accessible route to the footer.
- Define no-query, no-result, partial-result, stale-price, changed-market,
  unavailable-product, and slow/error behavior.
- Product cards remain comparable: identity, representative price basis,
  availability signal, rating basis when present, and option context mean the
  same thing across cards.

## Evaluation: PDP and variants

- Keep identity, current price and basis, selected options, availability,
  fulfilment promise, returns/commitment information, and primary action
  mutually consistent.
- Treat compare-at/reference price, savings, rating aggregate, delivery
  estimate, guarantee, and stock pressure as claims. Show each only when backed
  by the accepted data contract and place it with the decision it supports.
- Model option combinations explicitly. Selecting one option may invalidate
  another; explain and recover rather than silently resetting a valid choice.
- Distinguish selected, available, unavailable, sold out, nonexistent,
  backordered/preorder, pending, and unknown.
- Variant deep links resolve to a valid explicit state or explain the fallback.
  Never silently mutate the URL to conceal an invalid selection.
- Media selection follows the chosen variant where data supports it. Gallery,
  zoom, video, or model controls retain explicit keyboard-accessible controls;
  swipe and hover are enhancements.
- Quantity respects minimum, maximum, increment, inventory, and purchasing-rule
  constraints owned by the backend.
- A sticky purchase action is optional and may appear only when it preserves
  selected product/variant and price context, errors, zoom/reflow, and access
  to material purchase information.
- Add to cart, accelerated Buy now, preorder, and notify-me are distinct actions
  with distinct consequences.
- **Objection Snapping**: Place critical reassurance microcopy directly beside the decision:
  - Beside Price: Material integrity, lining quality, or origin proof (*e.g. Furing Hero Halus, Batik Asli*).
  - Beside Size Selector: Authoritative model fit reference (*e.g. Model TB 178cm/BB 75kg wearing L - Regular Fit*) and size exchange guarantee.
  - Beside Action CTA: Delivery timeframe and consultative assistance.
- **Multi-Variant Coordinated Sets ("Build Your Own Bundle" / BYOB / Sarimbit)**:
  - When a product represents a coordinated family or bundle set (e.g. Father + Mother + Children), avoid fragmenting into separate product pages.
  - Present an integrated multi-selector permitting concurrent variant selection across items with real-time subtotal calculation.
  - Support atomic, single-mutation cart insertion for all selected bundle components.
  - Provide fallback individual line deletion inside the cart drawer.

## Cart

- Make the cart authoritative but revisable. Reconcile server changes rather
  than optimistically presenting stale totals as confirmed.
- Address cart lines by their backend line identity, not by product identity,
  because option, property, plan, or bundle context may distinguish otherwise
  similar lines.
- Separate item subtotal from shipping, taxes, duties, discounts, store credit,
  and final total when those values are not yet known.
- Define empty, loading, stale, merge-after-login, multi-tab conflict,
  partial-failure, and checkout-return states.
- Keep successful line mutations when another line fails; identify the failed
  line, retained state, and retry path.
- Define where discount codes are entered; preserve rejected-code context and
  explain incompatibility without losing valid cart state.
- Treat the cart drawer as a bounded fast-edit preview and the cart page as a
  longer review surface. Either may be omitted if the accepted journey remains
  complete; never mandate a drawer by aesthetic default.
- Recommendations cannot precede unresolved cart errors or displace quantity,
  removal, line price, discounts, subtotal, and checkout.

### Cart acceptance examples

- Given a quantity update races with a price refresh, when responses arrive out
  of order, stale data cannot overwrite the latest authoritative state.
- Given a partial line failure, successful lines remain committed and the failed
  line carries a recoverable error.
- Given market or currency context changes, stale prices are never presented as
  checkout-authoritative totals.
- Given the cart renders during a pending mutation, geometry remains stable and
  checkout cannot submit an unconfirmed total.

## Direct order form: COD and single-page funnels

- Treat the direct order form as its own purchase boundary; do not force a
  catalogue cart pattern onto it.
- Keep offer identity, selected variant, quantity, destination, shipping,
  COD/prepaid choice, total, consent, submission, and confirmation consistent.
- Never rename field `name`, `id`, or slug values used by integrations without
  migrating every consumer.
- Derive area and shipping coverage from an authoritative source. Do not assume
  one country's address or fulfilment model fits another.
- Show area lookup, shipping quote, order creation, duplicate submission,
  unknown outcome, and confirmation states separately.
- On a failed submit, retain safe field values, focus the first invalid field,
  associate each error with its control, and never emit purchase success.
- Do not invent urgency or allow client-calculated totals to override the
  authoritative order result.

## Checkout handoff

- State who owns checkout: hosted platform, embedded SDK, redirect, or local
  application.
- Preserve cart identity, market/currency context, attribution where consent
  allows, and a safe return path.
- Distinguish checkout initiated, checkout loaded, payment pending, payment
  failed, order confirmed, order creation delayed, and unknown outcome.
- Never emit purchase success from add-to-cart, redirect attempt, payment intent
  creation, or an unverified client callback.
- If checkout is platform-hosted, do not promise DOM, CSS, field,
  authentication, payment-method, or extension placement control that the
  platform does not expose.
- Test guest and returning users, narrow and wide viewports, physical and
  digital goods, discounted orders, pickup and shipping when supported, and
  failure/retry paths.

## Customer account, reorder, and localization

- Preserve guest purchase lookup and recovery when the platform allows it.
- Reorder starts a new availability and price evaluation; it does not clone an
  old total as current truth.
- Separate order placed, paid, fulfilled, delivered, cancelled, refunded,
  returned, and disputed states.
- Keep market, locale, currency, tax presentation, units, address format,
  payment availability, and shipping destination as separate dimensions.
- Persist locale/market intentionally; never use IP or browser language as an
  irreversible decision.

## Responsive behavior

Specify transformations per region:

- navigation utility → labelled menu/search/account/cart controls;
- filter sidebar → bounded sheet or disclosure with active count and clear-all;
- product grid → fewer columns without changing comparison semantics;
- PDP media and purchase regions → one coherent decision sequence;
- cart table → labelled line-item groups rather than clipped columns;
- sticky purchase or checkout bars → safe-area-aware controls that do not cover
  validation, chat, consent, or platform UI.

At minimum test 320 CSS px narrow phone, 1280 CSS px desktop, 200% zoom,
translation expansion, long product titles, missing media, sale and sold-out
states, many options, and cart errors.

## Accessibility

- Use semantic landmarks, headings, lists, buttons, links, labels, and native
  controls before custom widgets.
- Keep DOM reading order aligned with visual order; never use CSS order to make
  a materially different keyboard path.
- Provide visible focus, at least 44px touch targets, and text equivalents for
  swatches, icon controls, and media navigation.
- Announce result count, availability, cart count, total, and mutation errors
  when they change asynchronously. Do not announce every keystroke.
- On dialog, drawer, or sheet close, return focus to the invoking control.
- Support text resize, zoom/reflow, reduced motion, and contrast without
  clipping essential product or checkout information.

## Performance

- Prioritize the likely LCP product or merchandising image with correct
  intrinsic geometry; lazy-load secondary media.
- Reserve geometry for prices, badges, selectors, cart lines, errors, and
  recommendations to limit layout shift.
- Avoid shipping a framework runtime for static merchandising alone.
- Defer reviews, recommendations, tracking, chat, and rich media behind the
  product identity, current price, availability, and primary decision path.
- Measure the affected route with browser/network evidence. A build or source
  audit cannot establish Core Web Vitals.

## Analytics contract

For each event define:

- business meaning and user outcome;
- authoritative trigger and owner;
- stable identifiers and market/currency context;
- consent behavior and prohibited personal/payment data;
- deduplication identity;
- expected failure/unknown behavior;
- browser and backend validation route.

Keep `view_item`, option selection, add-to-cart, cart update, checkout
initiation, and purchase confirmation semantically distinct. Purchase should be
server-authoritative or reconciled against a trusted commerce result.

## Delivery gate

Before accepting a storefront UX contract:

- the primary journey and success condition are explicit;
- price, availability, fulfilment, cart, checkout, and analytics each have one
  authority;
- loading, empty, error, pending, conflict, recovery, and success states exist;
- desktop and narrow-screen transformations are named;
- keyboard, focus, announcement, zoom/reflow, and contrast behavior is testable;
- every commercial claim has an evidence source;
- acceptance criteria fail on plausible stale, racing, partial, or unknown
  outcomes.
