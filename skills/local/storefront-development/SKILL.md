---
name: storefront-development
description: Build, refactor, or review customer-facing ecommerce storefronts with a clean, restrained, product-first baseline inspired by Shopify Dawn's HTML-first and progressive-enhancement approach. Use for home, collection/PLP, search, product/PDP, variant selection, add-to-cart, cart drawer/page, checkout handoff, account, localization, merchandising sections, responsive behavior, semantic HTML, performance, and implementation across Shopify Liquid themes, Astro, Next.js, Vite/React, Hydrogen, or another web stack. Use storefront-ux for journey/state decisions and this skill for implementation architecture, UI composition, commerce state, and validation. Verify current platform APIs before coding; hosted Shopify themes, headless Shopify, and non-Shopify commerce have different cart and checkout boundaries.
---

# Storefront Development

Implement a storefront that remains understandable before decoration and usable
before enhancement. Treat Dawn as a durable design/engineering reference, not a
visual template to clone blindly.

## First inspect

Read the repository instructions, package/lock files, routes, data contracts,
existing design tokens, cart ownership, checkout provider, analytics, and tests.
For Shopify, determine hosted Liquid theme versus headless Storefront API before
writing any cart code. Never mix their APIs.

Load `storefront-ux` when journey, edge states, or commercial rules are not
already specified. Load `design-taste` only after product hierarchy is correct.

## Build ladder

### 1. Establish the clean baseline

Start with product identity, imagery, price, variant/availability, fulfilment
context, and one clear purchase action. Use restrained typography, generous but
efficient whitespace, quiet neutral surfaces, consistent borders/radii, and one
brand accent. Avoid excessive cards, gradients, floating decoration, duplicated
CTAs, auto-rotating content, and motion without task value.

Read [Dawn-inspired baseline](references/dawn-inspired-baseline.md).

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

For Shopify, also read [Shopify boundaries](references/shopify-boundaries.md).

### 5. Enhance deliberately

Add quick add, cart drawer, recommendations, sticky purchase controls, filters,
predictive search, media zoom, personalization, or animation only when the base
journey already works and the enhancement has explicit empty/error/loading and
keyboard behavior. Do not let enhancement duplicate commerce state.

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
- Show price changes, discounts, quantity limits, and estimated-versus-final
  totals honestly.
- Keep cart lines editable and recover from stale inventory at cart/checkout.
- Treat accelerated Buy now as a different path that may bypass cart review;
  never label it as equivalent to Add to cart.
- Navigate to checkout only with a current backend-provided checkout target.
- Never collect, store, log, or send payment details through storefront code.
- Do not require account creation unless the verified commerce model requires it.

## Visual baseline versus brand layer

Make the baseline light, calm, and product-led. A dark storefront is optional,
not a default requirement: add it only when the brand and product media are
designed for both themes. If used, define complete semantic token pairs and
validate product photography, logos, badges, focus, disabled, error, and payment
marks in both. Preserve existing project tokens; do not paste Dawn or another
store's exact palette.

## Output

For architecture or audit work, return the smallest useful artifact. For a full
implementation plan, complete `assets/storefront-contract.yaml` with page
surfaces, commerce owner, cart/checkout boundary, enhancement plan, budgets,
and executable evidence. Save drafts under `~/Documents/work/prd/`; source code
belongs in the project.

## Ownership boundaries

- `storefront-ux`: buyer journey, state requirements, conversion correctness
- `storefront-development`: implementation, composition, commerce state wiring
- `design-taste`: brand expression and aesthetic judgment
- `native-first`: platform capability before dependencies
- `seo-website-builder`: indexation, metadata, schema, internal linking
- `ui-validation`: running-browser proof
- `web-perf`: diagnosis when performance evidence fails

Do not turn this skill into copied API documentation. Current platform APIs and
checkout capability must be retrieved from official sources at implementation
time. Read [Sources and freshness](references/sources.md) when refreshing a
platform claim or expanding the skill.
