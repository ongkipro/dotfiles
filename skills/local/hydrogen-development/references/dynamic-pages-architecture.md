# Dynamic Pages Architecture in Headless Shopify Hydrogen

> Reference guide for implementing, structuring, and optimizing dynamic route surfaces
> in Shopify Hydrogen with React Router v7 on Oxygen.

---

## 1. Dynamic Product Listing Pages (PLP — `/collections/$handle` & `/collections/all`)

Dynamic collections form the primary catalog browsing surface in headless commerce.

### A. Route Structure & Fallback Hierarchy
- **Specific Collection Route**: `app/routes/collections.$handle.jsx` resolves specific collection handles.
- **Catalog Route**: `app/routes/collections.all.jsx` serves the unified catalog.
- **Directory Route**: `app/routes/collections._index.jsx` renders all available collections.

### B. Best Practices
1. **Grid-Proportional Pagination**:
   Always calculate `pageBy` to match desktop grid columns. For a 4-column desktop layout, paginate at **12 items** (4 columns x 3 rows). This prevents awkward single orphaned product cards on the final row.
2. **Sort Key Normalization**:
   Parse URL search params (`sort`, `direction`) and map them strictly to Storefront API `ProductCollectionSortKeys` (`BEST_SELLING`, `PRICE`, `CREATED`, `TITLE`).
3. **Tier-Differentiated Rendering**:
   Use collection handles or product metafields (e.g. `custom.tier_kasta`) to conditionally load specialized luxury presentation components (e.g. expansive editorial layouts for haute couture vs high-speed conversion grids for essentials).
4. **Single-Line Breadcrumbs**:
   Render clean, uppercase-tracked breadcrumbs (`BERANDA / KOLEKSI / [TITLE]`) to reinforce category hierarchy without visual clutter.

---

## 2. Dynamic Product Detail Pages (PDP — `/products/$handle`)

The PDP is the core conversion surface, requiring robust variant selection, inventory synchronization, and responsive media handling.

### A. Variant Resolution & State
- **URL Parameter Binding**: Selected variant must reflect in the URL search params so buyers can bookmark or share specific variants.
- **Synthetic Variant Suppression**: When a product has only 1 variant or generic default options, automatically suppress the non-informative `"Title: Default Title"` variant label from the UI.
- **Real-Time Availability**: Check `availableForSale` and disable purchase actions when out of stock.

### B. Media & Gallery Architecture
- **Strict Aspect Ratios**: Use 4:5 vertical portrait aspect ratio (`aspect-[4/5]`) for full-body garment drape and luxury aesthetic.
- **Mobile Touch-Swipe**: Implement native horizontal swipe containers (`overflow-x-auto snap-x scrollbar-none`) with snap-aligned cards on mobile, synchronized with desktop thumbnail selectors.
- **Currency Purity**: Format prices in local standard format (e.g. Indonesian Rupiah `Rp 1.680.000` without noisy `,00` decimals).

---

## 3. Dynamic Storefront CMS Pages (`/pages/$handle`)

Storefronts need both high-touch tailored brand pages and generic merchant CMS pages.

### A. Route Precedence Pattern
1. **High-Touch Specific Routes**: Create explicit files for critical brand pages (e.g. `pages.tentang-kami.jsx`, `pages.layanan-seragam.jsx`, `pages.fasilitas-store.jsx`, `pages.lokasi-toko.jsx`).
2. **Generic Dynamic Fallback**: `app/routes/pages.$handle.jsx` dynamically queries `page(handle: $handle)` from the Storefront API. Any page created by the merchant in Shopify Admin (**Online Store $\rightarrow$ Pages**) will automatically render with consistent luxury prose styling without deploying code.

---

## 4. Dynamic Cultural Journal & Blogs (`/blogs/$blogHandle/$articleHandle`)

- **Route Structure**:
  - `blogs._index.jsx`: List of all blogs.
  - `blogs.$blogHandle._index.jsx`: Article grid within a specific blog.
  - `blogs.$blogHandle.$articleHandle.jsx`: Single article reader.
- **Content Flow**: Render sanitized article HTML with responsive typography prose, author v2 metadata, publication dates, and contextual related products.

---

## 5. Dynamic Policies (`/policies/$handle`)

- **Route**: `app/routes/policies.$handle.jsx` dynamically resolves Shopify legal policies:
  - `privacy-policy` $\rightarrow$ `shop.privacyPolicy`
  - `refund-policy` $\rightarrow$ `shop.refundPolicy`
  - `terms-of-service` $\rightarrow$ `shop.termsOfService`
  - `shipping-policy` $\rightarrow$ `shop.shippingPolicy`
- Guarantees merchant policy edits in Shopify Admin update instantly on the headless storefront.

---

## 6. Dynamic In-Modal Predictive Search (`/search` & Modals)

- **Pure In-Modal Experience**: Prevent full-page redirects. Execute queries live via `useFetcher` and render results inside the active modal dialog.
- **Hard Limit Constraint**: Storefront API GraphQL strictly requires `limit: Int` to be **1..10**. Defensively clamp: `Math.min(10, Math.max(1, limit))`.
- **Multi-Entity Normalization**: Fetch `PRODUCT`, `COLLECTION`, `ARTICLE`, `PAGE`, `QUERY`. Display related collections, clickable tag chips, 4:5 portrait products, and editorial articles with tabbed in-modal filtering.
- **Single Fetch Data Flow**: In React Router v7 framework mode, return resolved data objects directly from the loader (`return await searchPromise`) rather than wrapping in `Response.json()`.

---

## 7. Dynamic 404 Catch-All & SEO Defense (`app/routes/$.jsx`)

- **Catch-All Route**: `app/routes/$.jsx` intercepts all unmatched URLs.
- **Zero-Box Experience**: Present a spacious, card-free, unboxed layout with delicate background watermark numeral ("404"), subtle animated heritage emblem, focused dual CTAs (`KEMBALI KE BERANDA →`, `JELAJAHI KOLEKSI`), and an in-modal search trigger.
- **Dual-Layer SEO Defense**:
  1. **HTML Meta**: `{ name: 'robots', content: 'noindex, nofollow' }` in route `meta()`.
  2. **Edge HTTP Header**: `X-Robots-Tag: noindex, nofollow` injected in `entry.server.jsx` whenever `responseStatusCode === 404`.
