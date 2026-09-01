# Shopify Hydrogen UI/UX & Component Architecture (Shopify-Native)

> Production-grade frontend architecture, component patterns, and luxury commerce UX built 100% on **Shopify Native Primitives** for Shopify Hydrogen on Oxygen.
> Verified against `@shopify/hydrogen` (^2026.x), Storefront GraphQL API, Shopify Metaobjects, Metafields, Web Pixels, and Customer Account API.

---

## 1. Shopify-Native Data Mapping & Contracts

Every frontend UI element must map directly to an authoritative, zero-cost **Shopify Native Data Primitive** so the merchant can manage all content from **Shopify Admin** without editing source code:

| Frontend UI Component | Shopify Native Data Authority | Shopify Admin Location | GraphQL Query Structure |
|---|---|---|---|
| **Hero Slider / Banners** | **Shopify Metaobjects** (`hero_banner`) | Content $\rightarrow$ Metaobjects $\rightarrow$ Hero Banner | `metaobjects(type: "hero_banner") { fields { key value reference } }` |
| **3-Tier Badging & Fabric Spec** | **Shopify Metafields** (`custom.tier_kasta`, `custom.material_furing`) | Products $\rightarrow$ Custom fields | `metafield(namespace: "custom", key: "tier_kasta") { value }` |
| **Filosofi Motif & Cerita Batik** | **Shopify Metafields** (`custom.filosofi_motif`, `custom.makna_corak`) | Products $\rightarrow$ Custom fields | `metafield(namespace: "custom", key: "filosofi_motif") { value }` |
| **Shoppable Lookbook Hotspots** | **Shopify Metaobjects** (`lookbook_spotlight`) | Content $\rightarrow$ Metaobjects $\rightarrow$ Lookbook Spotlight | `metaobjects(type: "lookbook_spotlight") { fields { key value } }` |
| **Size Reference & Fit Guide** | **Shopify Metafields** (`custom.model_fit_reference`) | Products $\rightarrow$ Custom fields | `metafield(namespace: "custom", key: "model_fit_reference") { value }` |
| **Free Shipping Threshold** | **Shopify Shop / Markets Context** | Settings $\rightarrow$ Shipping and delivery | `shop { paymentSettings { currencyCode } }` |
| **Customer Orders & VIP Fitting** | **Customer Account API** | Native Customer Accounts | `customer { orders(first: 10) { nodes { id orderNumber } } }` |

---

## 2. Core Visual & Layout Philosophy: "Quiet Luxury"

Modern luxury e-commerce moves away from generic, templated e-commerce "card soup" (uniform rounded rectangles with drop-shadows) towards an **editorial, intention-based layout rhythm**:

| Attribute | Anti-Pattern (Template Slop) | Luxury Headless Standard (Hydrogen) |
|---|---|---|
| **Canvas** | Harsh `#FFFFFF` or generic dark-mesh gradients. | **Warm Mori Linen / Off-White** (`#FAF8F5` / `#F7F5F0`) or designed deep Obsidian (`#121212`). |
| **Borders & Dividers** | Thick outlines or heavy box-shadows (`shadow-lg`). | Hairline borders (`1px border-neutral-200/60` or `1px border-white/10`) and subtle filigree dividers. |
| **Media Aspect Ratio** | Unstable square 1:1 or arbitrary cropping. | **Strict Portrait 4:5 (`aspect-[4/5]`)** for fashion models, full-bleed hero banners, and lookbook previews. |
| **Typography Hierarchy** | Inter / Roboto everywhere in standard weights. | **Serif Display** (*Cormorant Garamond* / *Playfair*) for titles + **Geometric Sans** (*Plus Jakarta Sans* / *Outfit*) for prices & UI. |
| **Grid Variance** | 3 equal cards repeated down the page. | **Editorial Asymmetry (VAR: 4–6)**: Hero split layouts, 3-tier interactive selectors, and shoppable lookbook bento tiles. |

---

## 3. Master Component Architecture (Shopify-Native Primitives)

### A. The 3-Tier Dynamic Experience (Tiered Hierarchy)
When a brand offers tiered categories (e.g., *Mahakarya Heritage*, *Signature Elegance*, *Essential Daily*):
1. **Interactive Tier Switcher**: Tab controls that dynamically alter the preview imagery, fabric specifications (e.g. Sutra ATBM vs. Tenun Dobby vs. Katun Primisima), and price range in real-time.
2. **PLP Dynamic Theme Engine**: When browsing collection handles:
   - High-tier collections adopt a dramatic Obsidian/Gold canvas.
   - Mid-tier collections adopt a Deep Tarum Indigo canvas.
   - Everyday collections adopt a Clean Mori Linen canvas.

```jsx
// Dynamic tier styling helper in Hydrogen collection routes
const isMahakarya = handle.includes('mahakarya') || handle.includes('sutra');
const isSignature = handle.includes('signature') || handle.includes('dobby');

const themeClasses = isMahakarya
  ? 'bg-[#0D0D0D] text-white'
  : isSignature
  ? 'bg-[#1B2A4A] text-white'
  : 'bg-[#FAF8F5] text-neutral-900';
```

---

### B. "Build Your Own Bundle" (BYOB) & Multi-Variant Family PDP
For complex considered purchases like **Sarimbit Family Sets** (Father, Mother, Children), avoid forcing the user to navigate between 3 separate product pages:
1. Render a unified **Family Set Selector** inside the PDP.
2. Allow selecting sizes for multiple members simultaneously:
   - `[✓] Kemeja Suami: [Size: L]`
   - `[✓] Gamis Istri: [Size: M]`
   - `[✓] Kemeja Anak: [Size: 6 Th]`
3. Calculate subtotal dynamically on the client.
4. On submit, dispatch a **single optimistic batch mutation** using Hydrogen's `<CartForm action={CartForm.ACTIONS.LinesAdd}>` with multiple line items.

```jsx
// Multi-line bundle add mutation payload using Shopify CartForm
const bundleLines = selectedFamilyItems.map((item) => ({
  merchandiseId: item.selectedVariantId,
  quantity: 1,
  attributes: [{ key: 'Bundle', value: 'Sarimbit Keluarga' }],
}));
```

---

### C. Shoppable Lookbook with Interactive Hotspots
1. High-resolution lifestyle imagery showcasing coordinated outfits.
2. **Interactive Hotspot Pins (Pulsing Badges)** placed over specific garments.
3. Hovering/tapping a pin reveals an inline micro-card:
   - Garment Title
   - Live Price (formatted via `<Money />`)
   - Quick "Pilih Ukuran" / "Lihat Detail" trigger.
4. Driven natively via **Shopify Metaobjects** (`content.lookbook`) for merchant autonomy.

---

### D. "3-Second Confidence" & Objection Snapping
Place contextual trust cues exactly where cognitive hesitation occurs:
- **Adjacent to Price**: Trust indicators (*Batik Asli Jawa Tengah • Lapis Furing Hero Halus*).
- **Adjacent to Size Picker**: Real model reference (*"Model Pria TB 178cm, BB 75kg mengenakan Size L - Fit Reguler"*).
- **Adjacent to Buy Button**: Service guarantee (*Garansi Tukar Ukuran 100% • Pengiriman Cepat 1x24 Jam*).
- **Below Checkout Action**: Secondary low-friction action (*"Tanya Konsultan via WhatsApp"* with pre-filled product details).

---

### E. Sticky Smart Action Bar (Mobile PDP)
On mobile devices, when the user scrolls past the primary Add-to-Cart button:
1. Slide in a fixed bottom floating action bar:
   - Left: Thumbnail (4:5 crop) + Title + Active Price.
   - Right: Quick Size Selector Pill + Compact `<AddToCartButton>`.
2. Hides automatically when scrolling back to the top fold or when the cart drawer is open.

---

### F. Optimistic Cart Drawer with Tiered Free Shipping Bar
1. **Zero-Latency Quantity Mutations**: Powered by `useOptimisticCart(cart)` from `@shopify/hydrogen`. Quantity counters (`+` / `-`) update instantly without waiting for network roundtrip.
2. **Tiered Free Shipping Progress Bar**:
   - Computes remaining balance: `threshold - subtotalAmount`.
   - Visual progress bar fills dynamically.
   - Prompts celebratory unlock message when threshold is met (*"Selamat! Pesanan Anda berhak Gratis Ongkir"*).
3. **Order Notes**: Native input bound to cart attributes for tailoring instructions, size requests, or gift messages.

---

## 4. Image & Performance Budget on Oxygen

1. **Shopify Image Component**:
   Always use `@shopify/hydrogen` `<Image />` with explicit `aspectRatio="4/5"` and responsive `sizes` to leverage Shopify's worldwide CDN image optimization (WebP/AVIF transformation):
   ```jsx
   <Image
     data={image}
     aspectRatio="4/5"
     sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
     alt={image.altText || title}
   />
   ```
2. **Oxygen Cache Strategies**:
   - **Catalog & Collections**: `context.storefront.query(QUERY, { cache: context.storefront.CacheLong() })` (Cached at Cloudflare edge for 1 hour, SWR for 24 hours).
   - **Product PDP**: `context.storefront.CacheShort()` (Cached for 1 minute to reflect rapid inventory changes).
   - **Cart & Account**: `context.storefront.CacheNone()` (Always fresh per buyer session).

3. **Prefetch Intent**:
   - Use `<NavLink prefetch="intent" to="...">` for high-probability navigation (header categories, product cards).
   - Use `<NavLink prefetch="viewport" to="...">` for below-the-fold links entering the viewport.
