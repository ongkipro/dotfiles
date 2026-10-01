# Sources and Retrieval Policy

Verified 2026-08-17. These are primary Shopify references used to calibrate the
Shopify boundary and to extract durable commerce principles. Re-read them
before quoting a date, plan entitlement, limit, extension target, API field, or
Theme Store publishing requirement.

## Product and design

- Shopify design principles:
  https://shopify.dev/docs/storefronts/themes/best-practices/design
- Theme best practices:
  https://shopify.dev/docs/storefronts/themes/best-practices
- Theme Store requirements:
  https://shopify.dev/docs/storefronts/themes/store/requirements
- Theme accessibility:
  https://shopify.dev/docs/storefronts/themes/best-practices/accessibility
- Theme performance:
  https://shopify.dev/docs/storefronts/themes/best-practices/performance

Use these for principles and Shopify publishing constraints, not as permission
to copy Dawn/Horizon visuals or to universalize Shopify-specific mechanics.

## Cart, checkout, and account

- Ajax Cart API:
  https://shopify.dev/docs/api/ajax/reference/cart
- Storefront Cart guide:
  https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage
- Checkout technologies and plan availability:
  https://shopify.dev/docs/apps/build/checkout/technologies
- Checkout UI extension UX:
  https://shopify.dev/docs/api/checkout-ui-extensions/latest/ux
- Thank You and Order Status lifecycle:
  https://shopify.dev/docs/apps/build/checkout/thank-you-order-status
- Customer Account API:
  https://shopify.dev/docs/api/customer

## Accessibility and form standards

Verified 2026-09-29.

- WCAG 2.2 (SC 2.4.11, 2.5.7, 3.2.6, 3.3.7, 3.3.8):
  https://www.w3.org/TR/WCAG22/
- WHATWG autofill tokens:
  https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
- Vercel Web Interface Guidelines (forms: autocomplete, no paste blocking):
  https://github.com/vercel-labs/web-interface-guidelines

- Discount combination limits (5 product/order codes + 1 shipping code; 25
  active automatic discounts; combining only on Online Store, Storefront API,
  POS), accessed 2026-10-02:
  https://help.shopify.com/en/manual/discounts/discount-combinations

## Commerce UX evidence (public sources only)

Accessed 2026-10-02. Use these figures to rank findings, not as targets.

- Baymard cart abandonment list (updated 2025-09-22): documented average
  abandonment 70.22% across 50 studies. Reasons US shoppers gave for leaving
  checkout, with "just browsing" (42%) excluded: extra costs too high 40%,
  delivery too slow 20%, distrust with card details 19%, forced account
  creation 18%, long or complicated checkout 17%, errors or crashes 17%, returns
  policy 13%, total cost not visible upfront 12%, card declined 10%, too few
  payment methods 9%:
  https://baymard.com/lists/cart-abandonment-rate
- Baymard's public checkout research summary:
  https://baymard.com/research/checkout-usability

In this skill, that evidence means: show the full cost basis (shipping,
fees, COD surcharge) before the order commitment, keep guest purchase, and
treat error and decline recovery as part of the critical path. Baymard's
paywalled guideline database is not a source here; do not cite figures from
it second-hand.

## Indonesian commerce context

- BPS (Statistics Indonesia) publishes the annual *Statistik E-Commerce*,
  which covers the payment methods (including COD), delivery methods, and
  sales media that e-commerce businesses report. The 2024 edition was released
  2025-11-28:
  https://www.bps.go.id/en/publication/2025/11/28/647323224ecc656c2933571b/statistik-e-commerce-2024.html
  The page returned HTTP 403 on 2026-10-02, so no COD share is quoted here.
  Unverified as of 2026-10-02: cite a percentage only after reading the PDF
  itself. Secondary summaries disagree.
- Treat COD availability, COD fees, and courier coverage as per-route facts
  from the logistics provider (`mengantar-api`, `autolaris-h2h`). They are not
  storefront assumptions.

## Freshness rule

Storefront journeys, honest price/availability presentation, progressive
decisions, responsive transformations, accessibility, and recovery behavior
may be durable. Product names, API fields, limits, plan access, migration dates,
targets, and implementation details are volatile. Verify volatile facts against
the current official page and changelog during implementation.
