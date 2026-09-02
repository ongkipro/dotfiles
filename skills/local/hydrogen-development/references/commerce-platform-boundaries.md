# Commerce platform boundaries

Read this reference when the work crosses Hydrogen and Shopify-managed
commerce surfaces. Verify the installed project and current official API
schema before writing a query or mutation.

## Cart

Hydrogen carts are server-side first: preserve form/HTTP behavior before
adding optimistic client interaction. Reconcile all cart state from the
authoritative mutation response and its errors. Keep the cart identity in the
accepted session/cookie boundary; never create a parallel browser cart.

## Customer Accounts

Customer Account API authenticates a buyer, not an app. Discover OIDC and
Customer Account API endpoints from the storefront domain instead of hardcoding
account domains or API URLs. Keep OAuth/PKCE, token exchange, refresh/logout,
and checkout handoff in a server-controlled design; load
`application-security` for an account-flow change.

## Search

The Storefront `search` query can return products, pages, and articles, so UI
must handle its result union and pagination rather than assuming products only.
Use Shopify-provided available filters and honor the API's 250-item maximum for
filter and type inputs. Use `prefix` only when partial matching is the desired
buyer behavior, and make unavailable-product treatment explicit.

## Metaobjects and metafields

Use a metafield for a single field on an existing Shopify resource. Use a
metaobject for reusable, multi-field structured content such as size charts or
authors. Merchant-owned content belongs to the merchant's data model; app-owned
definitions use the reserved app namespace. A metaobject is not automatically
storefront-readable: verify explicit Storefront API access before querying it
from Hydrogen. Creating or changing a definition is an Admin-side mutation and
requires explicit approval.

## Liquid-to-Hydrogen migration

Liquid and Storefront API carts can share the Shopify cart cookie only when the
relevant products are published to both the Online Store and Hydrogen sales
channels. Preserve redirects, canonical URLs, product-feed domains, and
notification links as migration contracts. Checkout remains Shopify-hosted;
domain, password-protection, feed, or notification changes are live Shopify
configuration and require explicit approval.

## Shopify-hosted Web Pixels

Web Pixels do not run in the Hydrogen runtime. App Pixels use a strict sandbox
and register against the Standard API; Custom Pixels run in a lax sandbox and
do not have app-pixel settings. Coordinate standard customer events, consent,
and data minimization with Hydrogen analytics, but implement each surface
where Shopify supports it. For tracking delivery, load
`hydrogen-headless-tracking` and its Web Pixel reference.
