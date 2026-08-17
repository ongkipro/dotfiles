# Storefront / Commerce Visual Lens

Apply this after the canonical rules in [design-taste](../SKILL.md). This file
owns visual hierarchy and responsive composition for customer-facing commerce.
It does not own product rules, state semantics, copy, APIs, or implementation.

## Ownership boundary

- `storefront-ux` owns discovery, filtering, variants, availability, cart,
  checkout, account, recovery, and analytics behavior.
- `storefront-development` owns implementation and commerce-state wiring.
- `copywriting` and `content` own wording; `seo-website-builder` owns
  indexation and structured search concerns.
- This reference decides whether accepted behavior is expressed with deliberate
  hierarchy, imagery, typography, spacing, color, and motion.

## Commerce composition

The product decision path is the layout spine:

1. find and compare;
2. identify and evaluate;
3. select a purchasable configuration;
4. review the cart;
5. enter the checkout boundary.

Campaign sections may support that spine but must not displace identity, price,
availability, fulfilment, or the current action. Product imagery leads when it
helps evaluation; it does not become a decorative backdrop behind essential
controls.

## Store shell and discovery

- Keep navigation, search, account, locale/market, and cart entry predictable.
  Spend visual variance on merchandising, not on moving utility controls
  between routes.
- Product cards are comparison units, not generic marketing cards. Align the
  information order and price baseline across a row even when titles wrap.
  Use stable media ratios or reserved geometry; preserve focal points and never
  crop away material product information.
- Prefer spacing, hairlines, image treatment, and typography over a grid of
  elevated rounded cards. A merchandising tile may break the grid only when it
  is real content, clearly distinct from a product, and does not corrupt
  filtering, result counts, keyboard order, or responsive flow.
- Filters and sort remain visually subordinate to results but stay easy to
  discover. On narrow screens, transform a sidebar/toolbar into a labelled
  control and bounded sheet without hiding active-filter count or clear-all.
- Quick add is optional. It must not compress a complex variant decision into
  an ambiguous icon or bypass required options.

## Product detail and selection

- Compose a media region and a purchase-decision region; choose their desktop
  proportion from product-media needs rather than forcing a universal 50/50
  split. On narrow screens, preserve a clear sequence: identity and price,
  representative media, options and availability, purchase action, material
  fulfilment/returns, then supporting detail.
- Keep title, current price, price basis, selected options, availability,
  fulfilment, and the primary purchase action visually connected. Reviews,
  badges, and guarantees cannot split this decision region into unrelated card
  fragments.
- Choose variant controls by option semantics and count. Buttons/pills work for
  short text sets; swatches require a visible text equivalent; a native or
  accessible select is valid for long sets. Never ban a control merely because
  another looks more fashionable.
- Distinguish selected, available, sold-out, nonexistent, pending, and error
  states by more than color. Keep labels readable and touch targets at least
  44px. Do not strike through an unavailable option if that treatment can be
  confused with a discounted price.
- Product media never auto-rotates. Make thumbnails, pagination, zoom, video
  controls, and close actions understandable without hover. Mobile swipe may
  enhance explicit controls, not replace them.
- A sticky purchase region is conditional, not a conversion default. Use it
  only after the primary action scrolls away, when it can show enough selected
  product/variant and price context, does not obscure content or consent UI,
  and preserves keyboard and zoom/reflow behavior.

## Price, promotion, and trust

- Current price is primary. Compare-at/reference price is secondary and shown
  only when the commerce contract says it is legitimate. Price, savings, and
  badges update as one visual unit on variant or market change.
- A discount badge must name an understandable basis (`Save 20%` or
  `Save $10`) and must not compete with availability or the purchase action.
  Never manufacture urgency, countdowns, stock pressure, or a reference price
  for visual drama.
- Place evidence next to the claim it supports: shipping estimate near
  fulfilment, returns near commitment, verified review aggregate near product
  identity. Avoid generic security-badge rows and icon soup.

## Cart and checkout handoff

- A cart drawer is a fast editable preview; a cart page supports longer review.
  Either is valid. Do not mandate a drawer, and do not hide correction,
  quantity, line price, discounts, subtotal, or checkout behind
  recommendations.
- Pending recalculation preserves geometry. Line errors stay with the affected
  item. The confirmed subtotal and checkout action regain emphasis only after
  the authoritative result arrives.
- Add to cart, accelerated Buy now, and checkout are different actions. Express
  them with distinct hierarchy without recoloring branded payment controls or
  implying that checkout has already succeeded.
- At a hosted checkout handoff, preserve brand continuity but make the context
  or domain transition legible. Checkout extensions inherit their platform's
  component and placement constraints; storefront styling does not grant
  arbitrary checkout DOM access.

## Responsive transformations

Responsive work changes composition, not merely column count:

- utility navigation becomes a labelled menu/search/cart pattern;
- filter sidebar becomes a bounded sheet or disclosure;
- product grid reduces density while preserving comparison order;
- PDP media and purchase regions become one decision sequence;
- cart table becomes labelled line-item groups, not clipped columns;
- sticky bars reserve safe-area space and never cover validation, chat,
  consent, or checkout controls.

Test with long titles, multiple prices, translation expansion, missing media,
sale and sold-out badges, many variants, empty results, and cart errors. A
perfect demo-product screenshot is not responsive evidence.
