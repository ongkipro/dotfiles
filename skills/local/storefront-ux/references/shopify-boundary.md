# Shopify storefront boundary

Read only when the storefront is Shopify. This file carries what is
**Shopify-specific**: the boundary model, the hard limits, and the platform
deadlines. Journey behavior, states, and recovery are in
`journeys-and-states.md` and apply to Shopify unchanged — don't restate them
here.

> **Freshness:** limits and dates below verified 2026-08-17. Shopify moves
> these. Re-check the linked primary docs and `shopify.dev/changelog` before
> acting on a date, plan entitlement, target, or limit.

## Boundary model

- Catalog presentation and cart interaction are storefront concerns. Checkout
  completion, order creation, payment, tax, and platform-owned authentication
  are Shopify's. Never recreate the latter in storefront code.
- **Identify the architecture before anything else:** Liquid theme,
  Hydrogen/headless, embedded app extension, or mixed. Patterns do not transfer
  between them by assumption, and mixing theme-cart conventions with Storefront
  API conventions in one flow is the most common source of phantom bugs.
- Checkout customization is **per-surface**, not merely "plan-dependent" — see
  the table below. Specify the user outcome first, then verify the extension
  point exists for that surface on that plan.

## Hard limits worth designing around

| Limit | Value | Status |
|---|---|---|
| Line items per cart | **500** | verified on shopify.dev |
| Lines per `cartLinesAdd` call | **250** — larger carts must batch | verified on shopify.dev |
| Discount codes per order | 5 product/order + 1 shipping | **unverified** — community-sourced, and a conflicting 25-code figure exists. Confirm before designing around it |
| Active automatic discounts | 25 | **unverified** |
| Ajax API bundled section rendering | 5 sections per request | verified on shopify.dev |

A cart approaching these needs designed behavior, not a thrown error: say what
was not added and why.

## Checkout surfaces: who can customize what

Verified against Shopify's checkout technologies guide on 2026-08-17:

| Technology / surface | Availability |
|---|---|
| Checkout UI extensions in the checkout process | Shopify Plus |
| Thank You and Order Status UI extensions | All plans except Starter |
| Post-purchase UI extensions | All plans except Starter; currently beta, with access required for live stores |
| Checkout branding through GraphQL Admin API | Shopify Plus |
| Shopify Functions | All plans except Starter, but some Function APIs or custom-app paths have narrower availability |
| Web pixel extensions | All plans except Starter |

Checkout UI extensions use target-specific APIs and Polaris web components.
Their availability does not imply arbitrary markup, CSS, field, or DOM access.
Market overrides are available to Advanced or Plus stores; a resolved-market
change can add, remove, move, unmount, or remount extensions during checkout.

## Deadlines and dead paths

- **Plus:** `checkout.liquid` (a Plus-only layout), additional scripts, and
  script tags on Thank You / Order Status all **sunset 2025-08-28**.
- **Non-Plus:** additional scripts and script tags on Thank You / Order Status
  **sunset 2026-08-26**. If a non-Plus store still relies on one of those for
  tracking, that tracking stops on that date — a pixel/attribution outage, not
  a cosmetic one. Migrate to a Thank You / Order Status extension or Web Pixels.
- **Shopify Scripts are dead:** editing ended 2026-04-15, execution ended
  2026-06-30, published scripts deactivated. The replacement is Functions;
  custom apps using Function APIs remain Plus-only.

## Customer accounts

- The terminology changed in Dec 2024: it is **"customer accounts"** and
  **"legacy customer accounts"**. "New"/"Classic" are retired terms — using
  them in a spec makes the requirement ambiguous.
- **Legacy was deprecated 2026-02-19**: unavailable to new stores, no updates,
  no support. Final sunset not announced.
- The modern path is the **Customer Account API** — GraphQL only, OAuth2 +
  PKCE. A theme upgrade that drops the legacy files auto-migrates the store, so
  a "just update the theme" task can silently change the account flow.

## Versioning

Storefront API and Customer Account API ship quarterly (Jan/Apr/Jul/Oct 1),
each supported at least 12 months. **Always pin an explicit version.** An
unversioned or `unstable` call in a production storefront is a defect, not a
shortcut — it will break on a schedule you don't control.

## Markets and localization

- The product is **Managed Markets** (renamed from Markets Pro in June 2024),
  with Global-e as merchant of record. Naming matters when checking which
  behavior applies.
- Do not equate locale with Market or currency. Verify how country/market
  selection changes catalog, pricing, duties, availability, and cart validity —
  and explain to the buyer any cart change a market switch causes.

## Product and variant specifics

- Derive option and variant availability from the actual product model; never
  synthesize combinations that do not exist.
- Keep selected variant, URL state, price, compare-at price, media, selling
  plan, availability, quantity rules, and the add-to-cart payload aligned.
- Distinguish product unavailable, variant sold out, **market-unpublished**,
  and request failure — the third is Shopify-specific and needs its own
  recovery path.
- Verify whether inventory quantity is intentionally exposed before showing a
  number. Truthful availability beats invented stock counts.

## Cart and checkout handoff

- Hosted themes use the locale-aware Ajax Cart API. Headless storefronts use
  the Storefront Cart API; the Ajax API is not available to custom storefronts.
- Treat cart totals as estimates when checkout can recalculate shipping, tax,
  duties, discounts, currency, or inventory.
- Modern Storefront Cart IDs can contain a secret key used to protect buyer
  data. Never expose that secret in shareable URLs, public pages, analytics, or
  logs.
- Retrieve a current `checkoutUrl` when the buyer is ready to navigate. A stale
  or locally constructed checkout URL is not an acceptable fallback.
- Add to cart, accelerated checkout, and ordinary checkout remain distinct.
  Do not restyle or relabel branded accelerated checkout controls as though
  they were ordinary storefront buttons.
- Checkout UI extensions run at supported targets with target-specific APIs and
  Polaris web components. They are not arbitrary checkout DOM/CSS access.

## Shopify checkout UX probes

For checkout or extension work, test the combinations the official UX guidance
calls out where the store supports them:

- guest and returning customer;
- narrow and wide viewport;
- standard and accelerated checkout;
- physical and digital goods;
- free, paid, and discounted orders;
- shipping, local pickup, and other enabled delivery methods;
- extension loading, failure, removal, target change, and market remount;
- Thank You before order creation completes, and Order Status after the order
  is available.

Do not copy storefront navigation or promotional density into checkout. Keep
extensions optional, contextual, concise, and non-blocking unless the verified
use case is validation. Persist state needed across market remounts using the
platform-supported mechanism rather than module globals.

## Validation questions

1. Which architecture and which Shopify surfaces are actually in use?
2. Which code owns product selection, cart state, buyer identity, checkout
   navigation, payment result, and order confirmation?
3. Which prices, inventory states, promotions, and totals come back from
   Shopify versus local presentation logic?
4. What changes when market, country, currency, locale, address, customer, or
   company-location context changes?
5. Which checkout and account surfaces can this project customize *today*, on
   *this* plan and extension target?
6. Can the chosen checkout extension mount, unmount, or move during a market
   change, and which state must survive it?
7. Which analytics events are client-side, server-side, pixel-emitted, or
   Shopify-emitted, and how are duplicates prevented?
