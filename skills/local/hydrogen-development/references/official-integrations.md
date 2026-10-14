# Official Shopify Hydrogen References, Packaged Skills, and Release Snapshot

Last verified against official Shopify documentation, npm dist-tags, and upstream repositories on `2026-10-14`.

## Verified Package & Release Snapshot (2026-10-14)

| Package / Surface | Current Stable (`latest`) | Classic / Legacy Line | Key Architectural Facts |
| --- | --- | --- | --- |
| `@shopify/hydrogen` | `2026.10.1` (`2026.10.0` promoted to `latest` on `2026-10-09`; `2026.10.1` released `2026-10-13`) | `2026.4.7` (labeled **Legacy Hydrogen** on `shopify.dev`) | `2026.10+` is a framework-agnostic storefront toolkit and server-handler library (`@shopify/hydrogen`, `./react`, `./vue`, `./customer-account`, `./vite`, `./ts-plugin`, `./skills/*`). Ships `hydrogen` CLI (`setup`, `skills sync`, `skills check`, `gql check`, `certs install`). Node `^22.12 \|\| ^24`. |
| `@shopify/mini-oxygen` | `4.2.2` | `4.1.x` | Vite plugin `oxygen()` from `@shopify/mini-oxygen/vite` returns a plugin array (`...oxygen()`) and powers `vite dev` / `vite preview` against the Oxygen worker runtime. |
| `@shopify/cli` & `@shopify/cli-hydrogen` | `4.8.1` (`@shopify/cli >= 4.8.0` bundles `@shopify/cli-hydrogen >= 13.0.4`) | `3.x` / `@shopify/cli-hydrogen <= 12.x` | In `2026-10`, supports 10 commands: `customer-account-push`, `deploy`, `env list`, `env pull`, `env push`, `link`, `unlink`, `list`, `login`, `logout`. Blocks 15 legacy-only commands (`init` creates a `2026-04` project, `dev`, `build`, `preview`, `codegen`, `check`, `generate route(s)`, `setup*`, `shortcut`, `upgrade`, `debug cpu`). |
| Storefront & Customer Account APIs | `2026-10` | `2026-04` | Pinned in `@shopify/hydrogen@2026.10.1`. Storefront API adds `Cart.discountApplications`, `CartDeliveryGroup.discountAllocations`, `CartDiscountAllocation.sourceDiscountApplication`, and `lineLevelOnly` (default `true`) on cart line `discountAllocations`. Customer Account API deprecates/omits `territoryCode` in favor of two-letter `countryCode: CountryCode`, removes `Order.shippingTitle` (use `Order.shippingLine.title`), and removes `Customer.lastIncompleteCheckout` / `Checkout`. |
| `Shopify/Shopify-AI-Toolkit` | `v1.17.1` (`shopify-dev-mcp`) | — | Official MCP (`npx -y @shopify/dev-mcp@latest`) and plugin suite (`shopify-plugin` covering `shopify-liquid`, `shopify-custom-data`, `shopify-admin-execution`, `shopify-apps`). Note: the upstream repo deprecated its standalone `shopify-hydrogen` skill in favor of the 20 skills shipped directly inside `@shopify/hydrogen/skills/*`. |

Always check `package.json` in the target project before choosing between **Hydrogen `2026.10+`** (`references/hydrogen-2026-10-architecture.md`) and **Classic Hydrogen `<= 2026.4.x`**.

---

## Packaged Skills Shipped Inside `@shopify/hydrogen@2026.10.1` (`@shopify/hydrogen/skills/*`)

When working in a Hydrogen `2026.10+` repository, run `npx hydrogen skills check --mode=warn` (or `npx hydrogen skills sync` after upgrading `@shopify/hydrogen`). The package bundles 20 official skills across 5 domains:

1. **Setup, Server & Routing**:
   - `hydrogen-setup`: New project setup, `npx @shopify/hydrogen@latest setup`, `hydrogen skills sync`, `hydrogen skills check`.
   - `hydrogen-request-handlers`: `createShopifyRequestContext`, `handleShopifyRoutes` (pre-router gate), `handleShopifyRedirects` (post-404 gate), `requestContext.applyResponseHeaders`.
   - `hydrogen-storefront-client`: `createStorefrontClient` (`private`, `private_no_buyer_context`, `public`), `buyerIp` forwarding, `gql()` + `@shopify/hydrogen/ts-plugin` + `hydrogen gql check --fail-on-warn`, `Cache` strategies.
   - `hydrogen-routing`: `createShopifyRouteTemplates`, custom route patterns, Liquid `?variant=<id>` 302 redirects, `handleShopifyRedirects`.
   - `hydrogen-oxygen`: Oxygen worker entry (`server.ts`), `caches.open('hydrogen')`, `executionContext.waitUntil`, `react-router.config.ts` (`buildDirectory: 'dist'`, `future.v8_middleware: true`), `shopify hydrogen deploy`.
2. **Cart & Checkout**:
   - `hydrogen-cart-ui`: `createCartServerHandlers`, `createCartComponents`, `CartProvider`, `useCart`, `useCartForm`, `/api/cart` single-concern POST contract, optimistic line handling (`optimistic:` prefix), variant swapping via `merchandiseId`.
   - `hydrogen-cart-drawer`: Native `<dialog closedby="any">` + `.showModal()`, CSS `:has(dialog[open])` scroll lock, pre-hydration `<a href="/cart">` trigger, auto-open on `pending.lines.size > 0`, `window.Shopify.actions.openCart.configure()`.
   - `hydrogen-cart-metafields`: Reading cart metafields via `createCartServerHandlers({ fragment })`, writing via an app-owned POST endpoint (`metafieldsSet` / `cartMetafieldDelete`) + `useCartActions().refresh()`.
   - `hydrogen-shop-pay`: `<ShopPayButton>` / `<hydrogen-shop-pay-button>` declarative shadow root custom element.
3. **Catalog, Variants, Collections & Search**:
   - `hydrogen-variant-form`: `createProductComponents`, `useProductForm`, `encodedVariantExistence` / `encodedVariantAvailability`, symmetric option state (`exists: false` disabled button vs `available: false` clickable sold-out link), Combined Listings cross-product links, `canAddToCart`.
   - `hydrogen-collection-browser`: `CollectionProvider`, `useCollection`, `useCollectionForm`, Liquid-compatible `filter.v.*` and `sort_by` URL params, 350ms debounced price inputs with narrow currency symbol prefix, cursor pagination.
   - `hydrogen-predictive-search`: `createPredictiveSearchServerHandlers` (`/api/predictive-search`), `PredictiveSearchProvider`, `usePredictiveSearch`, `usePredictiveSearchForm`.
4. **Customer Accounts, Markets, Analytics & Formatting**:
   - `hydrogen-customer-account`: `@shopify/hydrogen/customer-account`, `createCustomerAccountClient`, `createCustomerSession`, `createCustomerAccountServerHandlers` with `cartServerHandlers` buyer-identity sync, server-only `<a>`/`<form>` auth links, `2026-10` `countryCode` address schema.
   - `hydrogen-local-https`: `npx hydrogen certs install`, `localHttps({ enabled })` Vite plugin, `https://local.tryhydrogen.dev`.
   - `hydrogen-markets`: Subfolder (`/fr-ca`), domain/subdomain, or cookie/session market resolution, `@inContext(country, language)` automatic injection from `requestContext.i18n`, `localization` query, market-aware links, and currency switching.
   - `hydrogen-analytics`: `<ShopifyScripts />`, `window.Shopify.analytics.publish()`, `analytics.addDestination({ name, setup({ subscribe }) })` (replacing removed `analytics.subscribe()`/`destroy()`), `useCartAnalytics()`, Customer Privacy consent modes (`auto` vs `custom-banner`).
   - `hydrogen-image`: Shopify CDN image URL sizing (`width`, `height`, `crop` search params), responsive `srcset`/`sizes`, LCP `loading="eager"` + `fetchPriority="high"`.
   - `hydrogen-money`: `formatMoney(money, { locale })`, `MoneyV2`, compare-at strikethrough and `priceRange` formatting.
5. **Verification & Migration**:
   - `hydrogen-smoke-test`: End-to-end Playwright browser verification across homepage, collection filtering/sorting/pagination, PDP variant switching, cart drawer/page, predictive search, customer login, and console/pageerror cleanliness.
   - `migrate-to-hydrogen-2026-10`: Phased migration playbook from Classic Hydrogen (`<= 2026.4.x` on Remix or React Router) to Hydrogen `2026.10`.
6. **Upstream Repository Maintainer Skills (`Shopify/hydrogen/skills/*`)**:
   - `create-oxygen-template`: Converting a standard React Router starter into an Oxygen template (`entry.server.tsx` Web streams, `vite.config.ts` `ssr.optimizeDeps.include` for CJS React, `server.ts` `caches.open('hydrogen-v1')`, `resolveShopIdentity`, three-place `routeTemplates` wiring).
   - `error-reporting`: `configureLogging({ logger, level })`, `HydrogenLogger`, and the 5-tier operational vs buyer `userErrors` taxonomy.
   - `playwright-tests`: Portable multi-framework E2E tests (`packages/storefront-e2e`), UI-driven state without cookie seeding, role locators, asymmetric absence/presence assertions, and `oxygen-auth-bypass-token`.

---

## Official `github.com/Shopify` Repository Map for Hydrogen & Headless

| Repository | Branch / Status | Purpose & Key Paths |
| --- | --- | --- |
| `https://github.com/Shopify/hydrogen` | `main` (`2026.10.x` `latest`), `dist-preview`, `2026-04` (Classic) | Primary monorepo: `packages/hydrogen` (core, `./react`, `./vue`, `./customer-account`, `./vite`, `./ts-plugin`, `./skills/*`), `templates/react-router` (canonical Oxygen React Router 7 template), `examples/{hydrogen,nextjs,astro,nuxt,sveltekit,solidstart}`, `packages/storefront-e2e`, and `skills/{create-oxygen-template,error-reporting,playwright-tests}`. |
| `https://github.com/Shopify/hydrogen-redirect-theme` | Active | Official Liquid redirect theme for the Online Store channel when Hydrogen runs on a separate domain: redirects traffic to `settings.storefront_hostname` while preserving `/checkpoint` flash-sale bot protection, `templates/gift_card.liquid`, and B2B `company_location_id` handoff. |
| `https://github.com/Shopify/mock-shop-starter` | Active (`https://mock.shop/llms.txt`) | Official starter and catalog documentation for `mock.shop` (100+ themed demo stores across subdomains like `pets.mock.shop`, `snowboards.mock.shop`). |
| `https://github.com/Shopify/oxygenctl-action` | Deprecated / Archived | Replaced by `npx shopify hydrogen deploy --assets-dir dist/client --worker-dir dist/server` with `SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN`. |
| `https://github.com/Shopify/Shopify-AI-Toolkit` | Active (`v1.17.1`) | Official `@shopify/dev-mcp` server and `shopify-plugin` skills (`shopify-liquid`, `shopify-custom-data`, `shopify-admin-execution`, `shopify-apps`). |
| `https://github.com/Shopify/shop-chat-agent` & `https://github.com/Shopify/claude-for-commerce-examples` | Reference | Storefront MCP (`/api/mcp`, `/api/ucp/mcp`, `/.well-known/ucp`) and Universal Commerce Protocol (UCP) agentic commerce patterns (proxied automatically by `handleShopifyRoutes` in `2026.10+`). |
| `https://github.com/vercel/shop` | Active (`https://vercel.shop`) | Official Next.js 16+ App Router + `@shopify/hydrogen` reference storefront (`proxy.ts` + `app/not-found.tsx` + RSC `ReadonlyCustomerSessionManager`). |

---

## Official Shopify Documentation Map

### Hydrogen `2026-10` (Current Docs)
- Overview & Architecture: `https://shopify.dev/docs/storefronts/hydrogen`
- Getting Started (Templates & Existing Projects): `https://shopify.dev/docs/storefronts/hydrogen/getting-started`
- Deploy a Starter Template (React Router on Oxygen & Vercel Shop): `https://shopify.dev/docs/storefronts/hydrogen/getting-started/deploy-a-template`
- Add Hydrogen to a New or Existing Project: `https://shopify.dev/docs/storefronts/hydrogen/getting-started/add-to-existing-project`
- Request Handlers & Framework Wiring: `https://shopify.dev/docs/storefronts/hydrogen/request-handlers`
- Storefront API Client & Typed `gql()` Queries: `https://shopify.dev/docs/storefronts/hydrogen/data-fetching`
- Routing & Route Templates: `https://shopify.dev/docs/storefronts/hydrogen/routing`
- Cart, Cart Drawer & Cart Metafields: `https://shopify.dev/docs/storefronts/hydrogen/cart`
- Product Pages & Variant Selection: `https://shopify.dev/docs/storefronts/hydrogen/products`
- Collections, Filtering & Predictive Search: `https://shopify.dev/docs/storefronts/hydrogen/collections-search`
- Customer Accounts & Session Manager: `https://shopify.dev/docs/storefronts/hydrogen/customer-accounts`
- Markets & Localization: `https://shopify.dev/docs/storefronts/hydrogen/markets`
- Analytics & Consent: `https://shopify.dev/docs/storefronts/hydrogen/analytics`
- Shop Pay: `https://shopify.dev/docs/storefronts/hydrogen/shop-pay`
- Deploying (Oxygen & Node/Edge Runtimes): `https://shopify.dev/docs/storefronts/hydrogen/deploy`
- Pre-Launch Production Checklist: `https://shopify.dev/docs/storefronts/hydrogen/production-checklist`
- Migrate from `2026-04` or Earlier to `2026-10`: `https://shopify.dev/docs/storefronts/hydrogen/migrate`
- Shopify CLI Hydrogen Commands (`2026-10` vs `2026-04` matrix): `https://shopify.dev/docs/api/shopify-cli/hydrogen`
- Hydrogen API Reference (`latest`): `https://shopify.dev/docs/api/hydrogen/latest`
- Storefront Standard Events & Actions: `https://shopify.dev/docs/api/storefront-events-and-actions`

### Legacy Hydrogen (`<= 2026-04`) & Headless Cookbook Recipes
- Legacy Hydrogen Entry: `https://shopify.dev/docs/storefronts/headless/legacy`
- Hydrogen Cookbook Index (20 official recipes): `https://shopify.dev/docs/storefronts/headless/hydrogen/cookbook`
- Dynamic Content with Metaobjects (Online Store 2.0 Section CMS for Hydrogen): `https://shopify.dev/docs/storefronts/headless/hydrogen/cookbook/metaobjects`
- Product Bundles: `https://shopify.dev/docs/storefronts/headless/hydrogen/cookbook/bundles`
- Combined Listings: `https://shopify.dev/docs/storefronts/headless/hydrogen/cookbook/combined-listings`
- Subscriptions: `https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/subscriptions`
- B2B Headless Storefronts: `https://shopify.dev/docs/storefronts/headless/bring-your-own-stack/b2b`

---

## Official Shopify Dev MCP (`@shopify/dev-mcp`) Workflow

When the `shopify` MCP server is available in the runtime:

1. Call `learn_shopify_api` first:
   - Use `api: "hydrogen"` for Hydrogen `2026-10` primitives, stores, request handlers, and Oxygen deployment.
   - Use `api: "storefront-graphql"` for Storefront API (`2026-10`) schema queries, mutations, and directives.
   - Use `api: "customer"` for Customer Account API (`2026-10`) queries, mutations, and OAuth/session contracts.
   - Use `api: "custom-data"` when modeling Metaobjects or Metafields (`$app:` vs custom namespaces).
2. Keep the returned `conversationId` across all subsequent `search_docs_chunks`, `fetch_full_docs`, `introspect_graphql_schema`, and `validate_graphql_codeblocks` calls.
3. Validate every non-trivial Storefront or Customer Account GraphQL document with `validate_graphql_codeblocks` (and `npx hydrogen gql check --fail-on-warn` in `2026.10+` projects) before calling the task done.
