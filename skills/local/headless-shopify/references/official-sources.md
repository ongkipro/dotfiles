# Official Shopify Headless Sources & API Snapshot

Last verified against `shopify.dev`, `@shopify/hydrogen@2026.10.1`, and `Shopify/Shopify-AI-Toolkit` (`v1.17.1`) on `2026-10-14`.

## 1. Current Release & API Version Matrix (2026-10-14)

| Surface | Current Version | Key Architectural Facts |
| --- | --- | --- |
| `@shopify/hydrogen` | `2026.10.1` (`latest` on npm) / `2026.4.7` (Legacy Hydrogen) | `2026.10+` is a framework-agnostic headless toolkit (`@shopify/hydrogen`, `./react`, `./vue`, `./customer-account`, `./vite`, `./ts-plugin`, `./skills/*`) that plugs into React Router 7, Next.js App Router, Astro, Nuxt, SvelteKit, or SolidStart. |
| Storefront GraphQL API | `2026-10` | Adds `Cart.discountApplications`, `CartDeliveryGroup.discountAllocations`, `CartDiscountAllocation.sourceDiscountApplication`, and `lineLevelOnly` (default `true`) on cart line `discountAllocations` (replacing deprecated `Cart.discountAllocations`). |
| Customer Account GraphQL API | `2026-10` | OAuth 2.0 + PKCE. Deprecates/omits `CustomerAddress.territoryCode` and `CustomerAddressInput.territoryCode` in favor of two-letter uppercase `countryCode: CountryCode`; removes `Order.shippingTitle` (use `Order.shippingLine.title`); removes `Customer.lastIncompleteCheckout` and `Checkout` types. |
| Checkout & Customer Account UI Extensions | `2026-04+` (`@shopify/ui-extensions`) | Uses Preact (`@shopify/ui-extensions/preact`) and `<s-*>` Polaris web components (`<s-banner>`, `<s-stack>`, `<s-button>`, `<s-text>`). React and legacy `2025-07` components are deprecated. |

## 2. Primary `shopify.dev` Documentation URLs

- **Headless Commerce Overview & Decision Guide**: `https://shopify.dev/docs/storefronts/headless/overview`
- **Hydrogen `2026-10` Toolkit Docs**: `https://shopify.dev/docs/storefronts/hydrogen`
- **Hydrogen `2026-10` Request Handlers & Multi-Framework Wiring**: `https://shopify.dev/docs/storefronts/hydrogen/request-handlers`
- **Migrate from Hydrogen `2026-04` or Earlier to `2026-10`**: `https://shopify.dev/docs/storefronts/hydrogen/migrate`
- **Hydrogen API Reference (`latest`)**: `https://shopify.dev/docs/api/hydrogen/latest`
- **Storefront Standard Events & Actions (`window.Shopify.actions`)**: `https://shopify.dev/docs/api/storefront-events-and-actions`
- **Bring Your Own Stack (Storefront API Architecture)**: `https://shopify.dev/docs/storefronts/headless/bring-your-own-stack`
- **Storefront Web Components (`<shopify-account>`, etc.)**: `https://shopify.dev/docs/api/storefront-web-components`
- **Dynamic Content with Metaobjects (Online Store 2.0 Section CMS)**: `https://shopify.dev/docs/storefronts/headless/hydrogen/cookbook/metaobjects`
- **Storefront GraphQL API Reference**: `https://shopify.dev/docs/api/storefront/latest`
- **Customer Account GraphQL API Reference**: `https://shopify.dev/docs/api/customer/latest`
- **Custom Data (Metafields & Metaobjects)**: `https://shopify.dev/docs/apps/build/custom-data`
- **Official GitHub Repositories**:
  - `https://github.com/Shopify/hydrogen` (`main` for `2026.10+`, `2026-04` for Classic; includes `templates/react-router` and `examples/{hydrogen,nextjs,astro,nuxt,sveltekit,solidstart}`)
  - `https://github.com/Shopify/hydrogen-redirect-theme` (Online Store Liquid redirect theme preserving `/checkpoint` bot protection, `gift_card.liquid`, and B2B `company_location_id` handoff)
  - `https://github.com/Shopify/mock-shop-starter` (`https://mock.shop/llms.txt` — 100+ themed demo stores)
  - `https://github.com/vercel/shop` (Next.js 16+ App Router + `@shopify/hydrogen` reference storefront)

## 3. `@shopify/dev-mcp` Retrieval Protocol

When the `shopify` MCP server is available:

1. Call `learn_shopify_api` with `api: "hydrogen"`, `"storefront-graphql"`, `"customer"`, `"custom-data"`, `"polaris-checkout-extensions"`, or `"polaris-customer-account-extensions"`.
2. Reuse the returned `conversationId` for `search_docs_chunks`, `fetch_full_docs`, and `introspect_graphql_schema`.
3. Run `validate_graphql_codeblocks` (and `npx hydrogen gql check --fail-on-warn` in Hydrogen `2026.10+` projects) on every GraphQL operation and `validate_components_codeblocks` on Checkout/Customer Account UI extensions.
