# Hydrogen Dynamic Storefront Pages, Online Store 2.0 Section CMS, and Commerce Architecture

Use this reference when building or refactoring dynamic pages in Hydrogen (`@shopify/hydrogen@2026.10.1` or Classic Hydrogen `<= 2026.4.x`): home, collection/PLP, product/PDP, search, cart, customer account, and **Online Store 2.0 (Theme 2.0) parity via Metaobject Dynamic Content Sections**.

---

## 1. Online Store 2.0 (Theme 2.0) Parity in Hydrogen: Metaobjects as Dynamic Section CMS

Liquid Online Store 2.0 themes use `templates/*.json` + `sections/*.liquid` + `blocks/*.liquid`. Hydrogen does **not** execute `.liquid` files or read theme `settings_data.json`. Instead, Shopify's official **Dynamic Content with Metaobjects** architecture (`https://shopify.dev/docs/storefronts/headless/hydrogen/cookbook/metaobjects`) gives merchants the same Admin-editable Section & Block authoring experience natively in Shopify Admin (`Content -> Metaobjects`) without an external headless CMS:

### Hierarchical Metaobject Schema (`Route -> Sections -> Blocks/References`)

```text
Route (Metaobject: type "route", handle e.g. "route-home", "route-about", "route-stores")
  ├── title (single_line_text_field)
  └── sections (list.metaobject_reference)
        ├── section_hero (heading, subheading, image -> MediaImage, link -> metaobject "link")
        ├── section_featured_products (heading, body, products -> list.product_reference, with_product_prices)
        ├── section_featured_collections (heading, collections -> list.collection_reference, with_collection_titles)
        ├── section_rich_text (heading, body -> rich_text_field)
        ├── section_stores_grid / section_store_profile
        └── custom app/marketing sections (comparison table, FAQ accordion, editorial lookbook)
```

### GraphQL Inline-Fragment Section Dispatcher Pattern

Query the container `route` metaobject and resolve its `sections.references` in a single Storefront API round-trip using inline fragments per section type:

```ts
// app/sections/Sections.tsx (Hydrogen 2026.10+ with gql())
import {gql, type InferResult} from '@shopify/hydrogen';
import {SectionHero, SECTION_HERO_FRAGMENT} from '~/sections/SectionHero';
import {
  SectionFeaturedProducts,
  SECTION_FEATURED_PRODUCTS_FRAGMENT,
} from '~/sections/SectionFeaturedProducts';
import {
  SectionFeaturedCollections,
  SECTION_FEATURED_COLLECTIONS_FRAGMENT,
} from '~/sections/SectionFeaturedCollections';

export const SECTIONS_FRAGMENT = gql(
  `fragment Sections on MetaobjectField {
    references(first: 10) {
      nodes {
        ... on Metaobject {
          id
          type
          ...SectionHero
          ...SectionFeaturedProducts
          ...SectionFeaturedCollections
        }
      }
    }
  }`,
  [
    SECTION_HERO_FRAGMENT,
    SECTION_FEATURED_PRODUCTS_FRAGMENT,
    SECTION_FEATURED_COLLECTIONS_FRAGMENT,
  ],
);

export const ROUTE_CONTENT_QUERY = gql(
  `query RouteContent($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    route: metaobject(handle: {type: "route", handle: $handle}) {
      id
      type
      title: field(key: "title") { value }
      sections: field(key: "sections") { ...Sections }
    }
  }`,
  [SECTIONS_FRAGMENT],
);
```

Map `section.type` 1:1 to modular React components with a safe `default: return null` fallback so newly created Admin section types never crash production routes.

### Parsing Metaobject Fields & Rich Text AST (`2026.10` vs Classic)

- **Hydrogen `2026.10+`**:
  - Core `@shopify/hydrogen@2026.10.1` does **not** export `<RichText>`, `parseMetafield`, `<Image>`, or `<Money>`.
  - Read scalar strings directly from `field.value`, list/JSON fields via `JSON.parse(field.value)`, prices via `formatMoney(money, { locale })`, and images via `URL.searchParams` (`width`, `height`, `crop`) on `MediaImage.image.url`.
  - Render `rich_text_field` values by parsing `JSON.parse(field.value)` (Shopify's Rich Text AST: `root`, `heading`, `paragraph`, `list`, `list-item`, `link`, `text` with `bold`/`italic`) into semantic HTML elements (`<h2>`–`<h6>`, `<p>`, `<ul>`/`<ol>`, `<a>`).
- **Classic Hydrogen (`<= 2026.4.x`)**:
  - Uses `parseMetafield<ParsedMetafields['...']>(node)` (via `parseSection` helper lifting `reference`/`references`), `<RichText data={field.value} />`, `<Image data={...} />`, and `<Money data={...} />`.
- **Dev/Preview Admin Deep-Link (`<EditRoute>`)**:
  - On `localhost` / `127.0.0.1` / `*.tryhydrogen.dev` / preview hosts, render an `Edit Route` link pointing to `https://admin.shopify.com/store/${storeSubdomain}/content/entries/route/${route.id.split('/').pop()}` so editors can jump straight from the Hydrogen page to the exact Metaobject entry in Shopify Admin.
- **Caching Strategy for Metaobject Routes**:
  - Use `Cache.none()` in development/preview so Admin edits appear immediately on refresh; use `Cache.short()` or `Cache.custom({ maxAge: 60, staleWhileRevalidate: 600 })` in production.

---

## 2. Dynamic Route Matrix & Data-Loading Contracts

### Home & Landing Pages (`_index.tsx`, `pages.$handle.tsx`)

- **Critical (awaited)**: Above-the-fold hero (`route-home` metaobject or featured collection) and primary merchandised product rail.
- **Non-critical (streamed promise)**: Below-the-fold recommendations or editorial blocks, wrapped in `<Suspense>` + `<Await>` with `.catch(() => null)` so a secondary query failure never 500s the page.
- **LCP image discipline**: The first hero or featured image must render with `loading="eager"`, `fetchPriority="high"`, explicit `width`/`height`, and responsive `srcset`/`sizes`.

### Collection / PLP (`collections.$handle.tsx`) & Search (`search.tsx`)

- **URL state owns filters, sort, and pagination**:
  - In **Hydrogen `2026.10+`**, parse the request URL with `parseCollectionParams(request.url)` (`filter.v.price.gte`, `filter.v.price.lte`, `filter.v.availability`, `filter.p.m.*`, `sort_by`, `cursor`, `direction`) and pass `filters`, `sortKey`, `reverse`, and pagination variables into `storefrontClient.graphql()`. Wrap the route in `<CollectionProvider data={collectionData} defaultPriceStep={1}>` and bind filter/sort controls with `useCollectionForm()`.
  - In **Classic Hydrogen (`<= 2026.4.x`)**, use `getPaginationVariables(request, { pageBy })` and `<Pagination connection={collection.products}>`.
- **Zero-results & filter recovery**: When active filters yield 0 products, keep the filter bar mounted and render one-click removal chips (`getFilterRemovalUrl(location.search, filter.id)` in `2026.10`) plus a `Clear all` link so shoppers are never trapped.

### Product / PDP (`products.$handle.tsx`)

- **URL-driven variant resolution**:
  - Extract selected options from URL query parameters via `getSelectedProductOptions(request)` and pass them to `product(handle: $handle)` -> `selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions)`.
  - In **Hydrogen `2026.10+`**:
    - `handleShopifyRoutes` automatically intercepts legacy Liquid `?variant=<numeric_id>` links on product routes matching `routeTemplates` and `302` redirects them to canonical option query parameters (`?Color=Blue&Size=M`).
    - Query `encodedVariantExistence` and `encodedVariantAvailability`, wrap the PDP in `<ProductProvider product={product} selectedOptions={selectedOptions} onSelect={(href) => navigate(href, { replace: true, preventScrollReset: true })}>` from `createProductComponents()`, and bind `<a {...register('optionValue', { optionName, valueName })}>` links.
    - Keep sold-out options (`exists: true, available: false`) clickable `<a href>` links with `"Sold out"` visual treatment; only disable non-existent combinations (`exists: false`) as `<button type="button" disabled>`.
- **Add-to-cart & accelerated checkout**:
  - Bind the add-to-cart form with `useCartForm({ onSubmitSuccess })` + `<input {...register('merchandiseId')} />` + `canAddToCart(product, options)` in `2026.10+` (or `<CartForm route="/cart" action={CartForm.ACTIONS.LinesAdd}>` in Classic Hydrogen).
  - Pair the primary add-to-cart button with `<ShopPayButton variantIdsAndQuantities={[{ id: selectedVariant.id, quantity }]} storeDomain={storeDomain} />` when `selectedVariant.availableForSale` is true.

### Cart Drawer & `/cart` Page

- **Single source of truth**:
  - In **Hydrogen `2026.10+`**, hydrate `<CartProvider initialData={initialCart}>` from `await cartHandlers.get({ storefrontClient, request, sessionManager, requestContext })` in the root loader and read `useCart((s) => s.data)` everywhere. Never mix a deferred root `cart` promise with `useCart`.
  - Keep a dedicated `/cart` route alongside the `<dialog closedby="any">` cart drawer so no-JS form submissions, shared cart links, and pre-hydration `<a href="/cart">` header clicks always work.
  - Render `checkoutUrl` via a plain `<a href={cart.checkoutUrl}>` (never client router `<Link>`) so the browser navigates cleanly to Shopify-hosted Checkout.

### Customer Account Pages (`account.*.tsx`)

- **Protected server loaders**:
  - In **Hydrogen `2026.10+`**, `/account/login`, `/account/authorize`, `/account/refresh`, and `/account/logout` are handled automatically by `createCustomerAccountServerHandlers` inside `handleShopifyRoutes`. App routes only own `/account` (profile/dashboard), `/account/orders`, `/account/orders/:id`, and `/account/addresses`.
  - Use `countryCode` (`CountryCode` two-letter uppercase) on `CustomerAddressInput` and `Order.shippingLine { title }` on orders (`territoryCode` and `Order.shippingTitle` are deprecated/removed in `2026-10`).
  - Optionally enable `<ShopifyScripts account />` when embedding Shopify's `<shopify-account>` web component (`https://cdn.shopify.com/storefront/web-components/account.js`) in headers.
