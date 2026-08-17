# Shopify Implementation Boundaries

> Verified 2026-08-17. Re-check the linked official sources before using a
> plan entitlement, target, API field, limit, version, or migration date.

## Identify the architecture first

- **Hosted theme:** Liquid, Online Store routes, section rendering, locale-aware
  Ajax Cart API, theme editor, and Shopify-hosted checkout.
- **Headless:** Storefront API, framework/server runtime, application-owned
  cache and cart UI, and Shopify-provided checkout URL.
- **Checkout/customer-account extension:** target-specific API and Polaris web
  components inside a platform-owned surface.

Do not import Ajax Cart conventions into a headless storefront or assume a
theme can call Storefront API cart mutations without an explicit architecture.

## Hosted theme

- Render essential identity, price, availability, variant form, cart route, and
  navigation in server HTML where the platform permits.
- Use locale-aware Ajax API URLs. Respect the response type and section
  rendering contract; do not parse returned HTML with regex.
- Treat sections as merchant-configurable composition. Validate missing,
  reordered, duplicated, and partially configured blocks.
- Theme JavaScript must tolerate Shopify Theme Editor section load/unload and
  avoid duplicate listeners or module-global commerce state.
- Prefer Shopify's current theme tooling and check Theme Store requirements
  separately. New Theme Store themes currently use Skeleton as the starting
  point rather than deriving from Dawn or Horizon.

## Headless

- Pin an explicit Storefront API version supported by the project.
- Create and mutate carts through Storefront API and reconcile from returned
  cart data and `userErrors`.
- Cart IDs can contain a secret key protecting buyer data. Never expose that
  secret in public/shareable URLs, analytics, logs, or client-visible errors.
- Retrieve a current backend-provided checkout URL at handoff; do not construct
  or cache one indefinitely.
- Keep server authorization and pricing authority outside client state.

## Product and cart

- Resolve actual Shopify variants; do not synthesize option combinations.
- Keep selected variant, URL, price, compare-at price, media, selling plan,
  quantity rules, availability, and mutation payload aligned.
- Hosted-theme cart lines may require Shopify line keys because properties or
  selling plans can distinguish lines sharing a variant. Storefront API carts
  use their returned cart-line IDs.
- Treat shipping, tax, duties, currency conversion, discounts, inventory, and
  some totals as subject to checkout reconciliation.
- Report cart limits and partial failures at the affected line. Confirm current
  line-count and mutation-input limits before designing a bulk workflow.

## Checkout technologies and availability

Verified against Shopify's checkout technologies guide:

| Technology | Availability |
|---|---|
| Checkout UI extensions in the checkout process | Shopify Plus |
| Thank You and Order Status UI extensions | All plans except Starter |
| Post-purchase UI extensions | All plans except Starter; currently beta, with live-store access required |
| Checkout branding through GraphQL Admin API | Shopify Plus |
| Shopify Functions | All plans except Starter; some APIs or custom-app paths are narrower |
| Web pixel extensions | All plans except Starter |

Checkout UI extensions use targets, target APIs, and Polaris web components.
They do not grant arbitrary DOM, CSS, checkout field, authentication, or
payment-method control. Advanced or Plus stores can use market overrides;
extensions can be added, removed, moved, unmounted, and remounted when resolved
market context changes. Persist required state across activations with the
platform-supported mechanism.

On Thank You (`purchase.thank-you`), order creation may not yet be complete,
although an order ID is available. On Order Status
(`customer-account.order-status`), the order is available. Do not assume the
same data lifecycle for both targets.

## Accelerated checkout

- Dynamic checkout / accelerated Buy now is a separate path that may bypass
  cart review.
- Use the platform integration and branding. Do not clone, recolor, relabel, or
  intercept branded payment controls as ordinary theme buttons.
- Do not promise accelerated checkout availability; it varies by store,
  market, device, browser, product, payment method, and buyer context.

## Tracking and migration boundaries

- Web Pixels and app/customer-event integrations are the supported tracking
  direction; never paste arbitrary scripts into checkout assumptions.
- Plus legacy `checkout.liquid`, additional scripts, and Thank You/Order Status
  script tags sunset 2025-08-28.
- Non-Plus additional scripts and Thank You/Order Status script tags are
  scheduled to sunset 2026-08-26. As of this file's verification date, that is
  upcoming; treat migration as attribution-critical.
- Shopify Scripts execution ended 2026-06-30. Use Shopify Functions where the
  required API and plan support the use case.

## Customer accounts

- Use current terminology: `customer accounts` and `legacy customer accounts`.
- Legacy customer accounts were deprecated 2026-02-19 and are unavailable to
  new stores. Verify migration consequences before removing legacy theme files.
- Customer Account API is GraphQL with OAuth 2.0 and PKCE; pin an explicit API
  version and keep token handling outside presentation components.

## Never

- Reimplement Shopify checkout, payment collection, or order authority in
  storefront code.
- Expose checkout/cart secrets, access tokens, personal data, or payment data in
  URLs, logs, analytics, browser storage, or errors.
- Claim checkout customization from a store plan without verifying the exact
  target and technology.
- Treat a checkout redirect, client callback, or Thank You render as sufficient
  evidence of finalized order state.
