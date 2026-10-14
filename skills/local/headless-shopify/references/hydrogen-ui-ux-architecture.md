# Hydrogen Headless UI/UX & Online Store 2.0 Section Architecture

Use this reference when designing or auditing the frontend UI/UX architecture of a Hydrogen (`2026.10+` or Classic) or custom Storefront API storefront.

## 1. Progressive HTML-First Commerce Primitives (`2026.10+`)

Hydrogen `2026.10+` is designed so every commerce action works before JavaScript hydrates or if JS fails:

- **Variant Picker (`createProductComponents` / `useProductForm`)**:
  - Same-product option values (`exists: true`) render as native `<a href="?Color=Blue&Size=M">` GET links.
  - Sold-out options (`exists: true, available: false`) **remain clickable `<a href>` links** with `"Sold out"` styling so shoppers can inspect the variant or reach available sibling combinations.
  - Non-existent option combinations (`exists: false`) render as `<button type="button" disabled>`.
  - Hide the entire option picker when `product.options.every((o) => o.values.length <= 1)` (`Default Title`).
  - Combined Listings (`value.handle !== product.handle`) render as cross-product links preserving focus and non-option query parameters via `buildProductSelectionSearchParams()`.
- **Collection Filtering & Sorting (`CollectionProvider` / `useCollectionForm`)**:
  - Render `<form {...register('form')} method="get" action={pathname}>` using Liquid-compatible URL params (`filter.v.price.gte`, `filter.v.price.lte`, `filter.v.availability`, `sort_by`).
  - Keep filter controls mounted and enabled while loading (`isPending`), and debounce price range inputs by `350ms` (`priceDebounceMs: 350`) with an `aria-hidden="true"` narrow currency symbol prefix (`formatMoney(..., { locale }).currencyNarrowSymbol`).
- **Cart Drawer (`<dialog>`) & `/cart` Route**:
  - Always maintain a dedicated `/cart` route alongside the `<dialog closedby="any">` cart drawer.
  - Render the header cart trigger as `<a href="/cart">` until client hydration completes, then upgrade to `<button type="button">` opening `.showModal()`.
  - Lock background scroll via pure CSS (`html:has(dialog[open]) { overflow: hidden; }`), auto-open on `useCart((s) => s.pending.lines.size > 0)`, and wire `window.Shopify.actions.openCart.configure()` so apps and agents can open the drawer.
  - Only disable cart line controls when `line.id.startsWith('optimistic:')`.

## 2. Online Store 2.0 (Theme 2.0) Parity via Metaobject Section CMS

When merchants need Theme-Editor-like modular page building in Hydrogen without paying for an external CMS:

1. **Model `Route` and `Section*` Metaobjects**:
   - Define a container `route` metaobject (`title`, `sections: list.metaobject_reference`) and modular section definitions (`section_hero`, `section_featured_products`, `section_featured_collections`, `section_rich_text`, `section_faq`).
   - For app-distributed storefronts, declare these as `$app:` reserved definitions (`[metaobjects.app-reserved.<type>]`) in `shopify.app.toml`.
2. **Query via Single-Round-Trip Inline Fragments**:
   - Resolve `route: metaobject(handle: { type: "route", handle: $handle })` and expand `sections.references(first: 10)` using inline fragments (`... on Metaobject { id type ...SectionHero ... }`).
3. **Render with a `<Sections>` Switch Dispatcher & Admin Deep-Link**:
   - Map each `section.type` 1:1 to a semantic React/Vue/Astro section component with a safe `default: return null` guard.
   - In dev/preview environments, render an `<EditRoute>` button linking directly to `https://admin.shopify.com/store/${storeSubdomain}/content/entries/route/${legacyId}`.

## 3. Core Web Vitals & Media Discipline

- **Images (`hydrogen-image`)**: Size `cdn.shopify.com` and `*.mock.shop` images using `URL.searchParams` (`width`, `height`, `crop`), provide responsive `srcset` and `sizes`, set explicit `width`/`height` to prevent CLS, and mark only the single above-the-fold hero/PDP image with `loading="eager"` + `fetchPriority="high"` (never apply JS fade-in opacity transitions to the LCP image).
- **Money (`hydrogen-money`)**: Format all Storefront API and Customer Account API prices on the server and client with `formatMoney({ amount, currencyCode }, { locale })`.
- **Shop Pay (`hydrogen-shop-pay`)**: Render `<ShopPayButton>` (`<hydrogen-shop-pay-button>` declarative shadow root custom element) next to the primary add-to-cart CTA for one-tap accelerated checkout.
