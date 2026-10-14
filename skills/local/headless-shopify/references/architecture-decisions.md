# Headless Architecture Decisions & Platform Selection

Use this reference to decide the architecture shape before creating routes, GraphQL clients, or a migration plan. Mark all unverified claims as assumptions.

## 1. Suitability Gate & Shopify Surface Selection

Headless requires a verified business outcome that Shopify's Online Store 2.0 theme + app model cannot meet with acceptable cost and operational risk.

| Option | When It Fits Best | What It Owns |
| --- | --- | --- |
| **Online Store 2.0 Liquid Theme** (`sections/*.liquid`, `blocks/*.liquid`, `templates/*.json`) | Default for merchant-editable storefronts, standard catalog/PDP/cart flows, and maximum third-party app compatibility (`storefront-development`). | Shopify hosts routing, rendering, CDN, Theme Editor, App Blocks, and Checkout. |
| **Storefront Web Components** (`https://shopify.dev/docs/api/storefront-web-components`, `<shopify-account>`, embedded buy surfaces) | Adding Shopify commerce or account widgets into an existing marketing/editorial site (Astro, WordPress, static docs) without rebuilding a full storefront. | Host site owns pages; Shopify web components + Storefront API handle embedded product/cart/account widgets and hand off to Shopify Checkout. |
| **Hydrogen `2026.10+` Toolkit** (`@shopify/hydrogen@2026.10.1`) | Full custom storefront inside **React Router 7 on Oxygen**, **Next.js App Router on Vercel**, **Astro**, **Nuxt**, **SvelteKit**, or **SolidStart** (`hydrogen-development`). | Framework owns routing/rendering/UI; Hydrogen owns Storefront & Customer Account clients, pre-router `handleShopifyRoutes`, post-404 `handleShopifyRedirects`, observable stores, and Standard Actions (`window.Shopify.actions`). |
| **Bring Your Own Stack (Raw Storefront API `2026-10`)** | Native mobile apps (iOS/Android), game engines, POS/kiosks, or non-JS server stacks where `@shopify/hydrogen` cannot run. | Custom client/server owns all GraphQL queries, cart token persistence, buyer IP forwarding, rate-limit backoff, and `checkoutUrl` handoff. |

## 2. Architecture Decision Matrix

Capture these decisions before implementation:

| Concern | Decision Required |
| --- | --- |
| **Rendering & Framework** | React Router 7 (Oxygen), Next.js App Router, Astro, Nuxt, or SvelteKit; SSR vs streaming vs static; progressive HTML form fallback before JS loads. |
| **Runtime & Edge** | Oxygen Worker (`@shopify/mini-oxygen@4.2.2`), Vercel/Cloudflare/Node; `caches.open('hydrogen')` vs CDN cache; `waitUntil` background work. |
| **Commerce Authority** | Shopify is the sole authority for catalog, localized money, inventory, cart (`Cart`), discounts (`discountApplications`), checkout (`checkoutUrl`), and orders. |
| **Dynamic Content & Theme 2.0 Parity** | Native **Shopify Metaobject Section CMS** (`Route -> Sections -> References`) vs external CMS; `$app:` reserved custom data in `shopify.app.toml` vs merchant-owned namespaces. |
| **Identity & Sessions** | Guest vs Customer Account API (`2026-10`, OAuth 2.0 + PKCE), `WritableCustomerSessionManager` (`HttpOnly; Secure; SameSite=Lax`), automatic `cartBuyerIdentityUpdate` sync, `requestContext.applyResponseHeaders` privacy guard. |
| **Markets & B2B** | Subfolder (`/fr-ca`), domain, or cookie market resolution; `@inContext(country, language)` propagation; B2B `purchasingCompany`, quantity rules, and volume price breaks. |
| **Checkout & Account Extensions** | Checkout UI Extensions and Customer Account UI Extensions (`@shopify/ui-extensions` `2026-04+` Preact + `<s-*>` Polaris web components) replacing legacy ScriptTag/checkout.liquid hacks. |

## 3. Authority & Custom Data Boundaries (`Shopify-AI-Toolkit` Custom Data Rules)

No client store or external CMS may become a second authority for price, inventory, discounts, or order state.

- **App-Owned vs Merchant-Owned Custom Data (`custom-data`)**:
  - When building a companion Shopify app or custom storefront integration, declare **app-reserved definitions** in `shopify.app.toml` (`[product.metafields.app-reserved.<key>]`, `[metaobjects.app-reserved.<type>]`) using the `$app:` prefix (`type = "$app:<type>"`). App-reserved schemas deploy atomically with `shopify app deploy`, cannot be mutated by other apps, survive app uninstallation, and are readable inside Checkout UI Extensions via `useAppMetafields()` with zero network latency.
  - Use `metafieldsSet` (up to 25 metafields per atomic call; no `customer_id`/`product_id` query filter needed) and `metaobjectUpsert` for values.
- **CMS / Search Mirror Discipline**:
  - If an external search or CMS indexes Shopify products, state the webhook sync trigger (`products/update`, `inventory_levels/update`), stale-data ceiling, and request-time Shopify verification before checkout.

## 4. Reversible Migration & Coexistence Shape

- Inventory existing Liquid URLs, `?variant=<id>` deep links, `filter.v.*` collection URLs, `/cart/{id}:{qty}` permalinks, `/cart.js` AJAX consumers, redirects, feeds, pixels, and theme app embeds.
- In **Hydrogen `2026.10+`**, `handleShopifyRoutes` and `handleShopifyRedirects` natively preserve `?variant=` 302 redirects, `/cart/{id}:{qty}`, `/buy/{id}:{qty}`, `/cart.js`, `/checkout`, and Storefront `urlRedirects`.
- During phased Liquid-to-Hydrogen traffic splits on the same root domain, cart cookies are shared only for products published to **both** the Online Store and Hydrogen sales channels.
- Rollback means restoring the previous route and measurement path without invalidating active carts, breaking `checkoutUrl` handoffs, or serving duplicate canonical URLs.
