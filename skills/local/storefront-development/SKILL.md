---
name: storefront-development
description: >-
  Build, refactor, or review ecommerce storefronts with a restrained product-first baseline
  following Shopify Dawn's HTML-first progressive enhancement. Use for home, collection/PLP,
  search, product/PDP, variants, add-to-cart, cart drawer/page, checkout handoff, account,
  localization, merchandising, responsive behavior, semantic HTML, performance across Shopify
  Liquid, Astro, Next.js, Vite/React, Hydrogen, or another web stack. Owns implementation
  architecture, UI composition, commerce state, validation; storefront-ux owns journey and state,
  design-taste owns visual direction. Verify platform APIs first — hosted Shopify, headless, and
  non-Shopify differ at the cart and checkout boundary.
---

# Storefront Development

Implement a storefront that remains understandable before decoration and usable
before enhancement. Treat Dawn as a durable design/engineering reference, not a
visual template to clone blindly.

## First inspect

Read repository instructions, package/lock files, routes, data contracts,
existing design tokens, page composition, cart ownership, checkout provider,
analytics, and tests. For Shopify, determine hosted Liquid theme versus
headless Storefront API before writing cart code. Never mix their APIs. For a
headless architecture, migration, API/token/cache/account/analytics boundary,
load `headless-shopify` first; this skill then owns the page and UI
implementation within that accepted contract.

Load `storefront-ux` when journey, edge states, or commercial rules are not
already accepted. For any visual implementation, load `design-taste`
Storefront/Commerce mode after the contract and before the first visual edit.

## Build ladder

### 1. Establish the product-first baseline

Start from the accepted product decision path: find and compare; identify and
evaluate; choose a purchasable configuration; review the cart; enter checkout.
Use restrained typography, efficient whitespace, quiet neutral surfaces,
stable media geometry, consistent borders/radii, and one brand accent. Avoid
card soup, decorative gradients, duplicated CTAs, auto-rotating content,
generic trust-badge rows, and motion without task value.

Read [Dawn-inspired baseline](references/dawn-inspired-baseline.md) for durable
HTML/progressive-enhancement patterns and [Next.js Commerce Patterns](references/next-commerce-patterns.md) only for that stack.

### 2. Render the useful document first

Use semantic links, forms, buttons, headings, lists, labels, and native controls.
Ensure discovery, product selection, add-to-cart, and navigation have a usable
server/HTML path where the platform permits it. Add JavaScript only for faster
updates, drawers, galleries, predictive search, and richer feedback.

### 3. Implement the commerce contract

Keep a single cart owner. Model variant identity, quantity rules, selling plan,
line attributes, buyer/market context, estimated totals, discounts, inventory
changes, and mutation errors. Reconcile UI from the authoritative mutation
response instead of pretending a purchase state succeeded.

Read [Product, cart, and checkout](references/product-cart-checkout.md).

### 4. Adapt to the installed stack

Preserve the same behavior contract while changing rendering, mutation, cache,
and hydration boundaries. Read only the relevant stack section in
[Framework adaptation](references/framework-adaptation.md).

For advanced Next.js App Router implementations covering Server Actions, optimistic state, and headless URL logic, read [Next.js Commerce Patterns](references/next-commerce-patterns.md).

For Shopify, also read [Shopify boundaries](references/shopify-boundaries.md).

Use `shadcn-ui` only when the selected React stack already supports it and its
primitives fit the accepted component map. Do not introduce React hydration so
static Shopify Liquid or Astro merchandising can look like shadcn. Shopify
checkout UI extensions use Polaris web components, not storefront shadcn
components.

### 5. Enhance deliberately

Add quick add, cart drawer, recommendations, sticky purchase controls, filters,
predictive search, media zoom, personalization, or animation only when the base
journey already works and the enhancement has explicit prerequisites,
empty/error/loading behavior, accessible controls, narrow-screen
transformation, and fallback. Do not let an enhancement duplicate commerce
state or hide required product decisions.

### 6. Validate the journey

Run the project's checks, then exercise the running storefront across mobile
and desktop, keyboard and pointer, valid and unavailable variants, slow/failing
cart mutations, empty/populated cart, and checkout handoff. Read
[Delivery and evidence](references/delivery-and-evidence.md).

## Non-negotiable behavior

- Never enable Add to cart without a valid purchasable merchandise/variant ID.
- Distinguish sold out from unavailable combination and from unknown inventory.
- Disable or make the purchase mutation idempotent while pending; prevent
  accidental duplicate submission without blocking intentional quantity adds.
- Announce async cart count, subtotal, availability, and errors to assistive
  technology without stealing focus.
- Preserve selection and input after a recoverable error.
- Show price changes, legitimate compare-at/reference pricing, discounts,
  quantity limits, and estimated-versus-final totals honestly.
- Keep cart lines editable and recover from stale inventory at cart/checkout.
- Place delivery, returns, ratings, and guarantee evidence with the decision it
  supports; never synthesize stock pressure or generic security-badge rows.
- Treat accelerated Buy now as a different path that may bypass cart review;
  never label it as equivalent to Add to cart.
- Navigate to checkout only with a current backend-provided checkout target.
- Never collect, store, log, or send payment details through storefront code.
- Do not require account creation unless the verified commerce model requires it.

## Visual baseline versus brand layer

Implement the accepted `design-taste` Storefront/Commerce direction; do not
derive a brand from Dawn or this skill. The fallback baseline is light, calm,
and product-led. Dark is optional: ship it only when brand tokens and product
media are designed for both themes. Define complete semantic token pairs and
validate photography, logos, price, badges, focus, disabled, error, cart, and
payment marks in each theme. Preserve project tokens; never paste another
store's palette or composition.

## Output

For architecture or audit work, return the smallest useful artifact. For a full
implementation plan, complete `assets/storefront-contract.yaml` with the
primary journey, product/price/availability authorities, page surfaces,
responsive transformations, cart and checkout boundary, enhancement
prerequisites, budgets, analytics, and executable browser evidence. Follow the
repository planning-document convention; source code belongs in the project.

## Ownership boundaries

- `storefront-ux`: buyer journey, state requirements, and conversion correctness
- `storefront-development`: implementation, composition, and commerce-state wiring
- `headless-shopify`: Shopify headless architecture, runtime/data boundary, and delivery contract
- `design-taste`: Storefront/Commerce hierarchy, art direction, and visual judgment
- `native-first`: platform capability before dependencies
- `seo-website-builder`: indexation, metadata, schema, and internal linking
- `ui-validation`: running-browser proof
- `web-perf`: measured diagnosis when performance evidence fails

Do not turn this skill into copied API documentation. Current platform APIs and
checkout capability must be retrieved from official sources at implementation
time. Read [Sources and freshness](references/sources.md) when refreshing a
platform claim or expanding the skill.
