---
name: headless-shopify
description: >-
  Architect, build, migrate, or audit Shopify headless storefronts using the
  Storefront API, Hydrogen, or a custom framework. Use for deciding whether
  headless is justified, API/version/token boundaries, cart and checkout
  handoff, Customer Account API, Markets, caching, privacy, analytics,
  operations, and migration. Not for Liquid themes, generic storefront UX, or
  arbitrary checkout DOM customization.
---

# Headless Shopify

Own the Shopify-specific architecture and delivery contract for a decoupled
storefront. Keep Shopify as the commerce authority: product publication,
pricing, inventory, discounts, tax, shipping, payment, checkout, order, and
the supported account/extension surfaces remain platform contracts.

## Enter with a decision, not a framework

First establish the required experience, channels, content model, integrations,
merchant operating model, team capacity, and measurable reason a theme/app
cannot meet the need. Headless is justified by a concrete constraint, such as
a bespoke interaction model, multi-surface delivery, or a real integration
boundary. Faster pages or visual novelty alone are not sufficient evidence.

If Shopify's hosted theme, app, Checkout Extension, Storefront Web Components,
or a native Shopify capability meets the accepted need, recommend that smaller
solution and do not create headless plumbing.

Read [Architecture decisions](references/architecture-decisions.md) before
selecting a stack or planning a migration.

## Inspect the actual contract

Determine and record:

- Shopify plan, enabled sales channels, published products, Markets, customer
  account model, delivery methods, subscriptions/B2B, discounts, and required
  checkout or post-purchase surfaces.
- Runtime and rendering model, ownership of routes, redirects, domains,
  cookies, cache, content, search, cart, customer identity, consent,
  analytics, error reporting, and webhooks.
- Every Shopify API, explicit API version, token type and scope, plus every
  external integration and its failure behavior. Do not reveal secret values.
- The project’s existing cart, checkout, SEO, localization, privacy, and test
  contracts. Repository evidence wins over a proposed pattern.

For any capability, plan entitlement, exact API field, limit, or migration
date, retrieve current official Shopify documentation. Read
[Official sources](references/official-sources.md) for the source map.

## Build the boundary correctly

1. Use the Headless sales channel and least access needed. Pin every versioned
   API. Treat private Storefront tokens, Customer Account credentials, Admin
   tokens, cart secret keys, and personal data as server-only.
2. Send the genuine buyer IP on server-side Storefront requests when Shopify
   requires it. Preserve privacy, consent, and proxy trust boundaries; never
   invent a client IP header.
3. Give catalog, content, navigation, and other public data an explicit cache
   policy. Cart, account, personalized pricing/context, customer data, and
   mutation responses are private/no-store unless an official contract proves
   otherwise. A cache key must vary by every market, locale, currency, buyer,
   and other context that changes the response.
4. Keep one server-backed cart owner. Store only the opaque cart reference in
   an appropriate private session/cookie; reconcile every mutation from the
   returned cart and `userErrors`; get a fresh returned `checkoutUrl` only at
   handoff. Never construct checkout URLs or rebuild payment/order logic.
5. Use the Customer Account API for modern cross-platform account experience
   when accounts are required. Its OAuth/PKCE/session lifecycle belongs in a
   server boundary, never a presentation component or shared cache.
6. Use Shopify-native data, Search & Discovery, metafields/metaobjects,
   Functions, Web Pixels, and extensions before adding a duplicate service.
   Any mirror needs an explicit source, webhook/reconciliation path, staleness
   tolerance, and failure mode.

Read [Delivery contract](references/delivery-contract.md) before implementing
or reviewing data flow, cache, cart, account, privacy, analytics, migration,
and release evidence. For frontend component architecture, editorial lookbooks,
multi-variant family bundle builders (BYOB), and luxury commerce UI/UX patterns on Hydrogen,
read [Hydrogen UI/UX Architecture](references/hydrogen-ui-ux-architecture.md).

## Stack choices

- Prefer Hydrogen when React plus Shopify’s opinionated server/cart/analytics
  primitives fit the product and hosting. It lowers commerce integration work;
  it is not mandatory.
- Use a custom framework only when its existing ecosystem or a verified runtime
  constraint outweighs rebuilding the same Shopify boundary. Preserve SSR/HTML
  product routes, route redirects, cache discipline, and server mutations.
- Use Storefront Web Components when adding commerce to an existing site is the
  actual need; do not build a new headless application around an embed use case.
- Do not call Admin API from buyer-facing browser code. Keep operational Admin
  work in a private service with least scopes and auditable mutation ownership.

## Coordinate without overlap

- `storefront-ux` owns buyer journey, states, and acceptance criteria.
- `storefront-development` owns page composition and implementation after this
  skill establishes the headless boundary.
- `application-security` owns a dedicated security review when auth, tokens,
  webhooks, customer data, or an external integration is added or changed.
- `seo-website-builder` owns SEO/indexation; preserve Shopify product redirects
  and canonical behavior during a migration.
- `ui-validation` owns browser-visible proof and `web-perf` owns measured
  performance diagnosis.

## Deliverable and stop conditions

For architecture, migration, or audit work, produce the smallest useful
headless contract: decision and alternatives, authority/ownership matrix,
data/cache classification, API/version/token inventory without secrets, cart
and checkout path, account/privacy/analytics design, migration cutover and
rollback, observability, risks, and executable acceptance evidence.

Do not deploy, rotate/revoke credentials, alter Headless channel permissions,
write to Admin API, or publish a sales channel without explicit approval.
