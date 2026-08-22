# Headless architecture decisions

Use this reference to decide the shape before creating routes, GraphQL clients,
or a migration plan. Mark all unverified claims as assumptions.

## Suitability gate

Headless needs a verified business outcome that Shopify’s theme/app model cannot
meet with acceptable cost and risk. Acceptable drivers include multi-surface
commerce, a truly custom transactional experience, a hard integration boundary,
or delivery on a non-web client. It also needs an owner for runtime, releases,
security, monitoring, SEO, performance, and API upgrades.

Reject or defer headless when the need is mostly an editable store, standard
catalog/PDP/cart behavior, a landing page, or cosmetic redesign. Prefer a
theme, app, Checkout Extension, or Storefront Web Components for an existing
site when that closes the gap.

## Architecture record

Capture these decisions before implementation:

| Concern | Decision required |
|---|---|
| Rendering | SSG, SSR, streaming, client enhancement, and fallback HTML path |
| Runtime | Hosting, edge/server capabilities, region, secrets, background work |
| Commerce authority | Shopify owner for catalog, price, market, cart, checkout, order |
| Content/search | Shopify-native versus external source, synchronization and outage behavior |
| Identity | Guest/account journeys, Customer Account API, session ownership, return URL |
| Markets | Country, locale, currency, duties, B2B/company context, cart invalidation |
| Integrations | Trigger, auth boundary, idempotency, retries, observability, failure UX |
| Operations | Version update cadence, credential rotation, webhook reconciliation, rollback |

## Authority matrix

No client state may become a second authority. State the owner and freshness
rule for each: product publication, variant availability, money, cart, buyer
identity, delivery eligibility, discount, checkout target, payment result,
order confirmation, consent, attribution, and content.

When a CMS or search provider shadows Shopify data, name the canonical source,
sync trigger, deletion behavior, stale-data ceiling, and degraded experience.
If that cannot be stated, query Shopify at request time or remove the mirror.

## Migration shape

Inventory existing URLs, templates, scripts/pixels, apps, redirects, feeds,
merchant editing workflows, theme dependencies, fulfillment/tax/shipping
assumptions, analytics, account behavior, and checkout extensions. Use a
reversible rollout: isolate the new surface, preserve URL/canonical rules, run
representative purchase and attribution probes, monitor, then cut over.

Rollback means restoring the previous buyer route and measurement path without
invalidating carts, losing order visibility, or serving duplicate content. It
is not merely reverting frontend code after traffic has moved.
