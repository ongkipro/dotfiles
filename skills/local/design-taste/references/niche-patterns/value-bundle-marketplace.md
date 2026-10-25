# Multi-Category Consumer Marketplace & Value-Bundle Storefront

Covers: multi-department consumer goods marketplaces, fixed-price or single-price
value stores (e.g. flat-price bundle retail), multipack/BOGO household and
lifestyle catalogs, and multi-warehouse direct-to-consumer retail. Read
[README.md](README.md) first.

## 1. Job and decision path

The visitor arrives to browse across disparate product departments (beauty,
household cleaning, tools, apparel, kitchen, automotive, kids) or to evaluate a
specific value bundle from an ad/share link. Because the catalog spans many
unrelated categories, the interface must prevent marketplace visual chaos while
making **package contents (`isi paket`)** and **shipping consolidation (`asal
gudang / 1x ongkir`)** unmistakable before checkout:

1. **Orient and search/filter:** quickly understand the store's pricing/bundle
   premise, search via an accessible omnibox, or jump into a visual department.
2. **Compare like for like:** scan product cards where the bundle
   quantity (`2 pcs`, `3 pcs`, `10 pcs`, `1 + bonus`), contents, rating/sold
   proof, and price basis align across every row.
3. **Verify exact package contents and shipping origin on the PDP:** confirm how
   many units are included, variant/size selection, weight, origin warehouse,
   and net shipping fee (`Tarif` vs `Subsidi` vs `Ongkir`).
4. **Consolidate cart and complete checkout:** optionally add same-warehouse
   items to maximize single-parcel shipping value, then finish checkout via
   QRIS, Virtual Account, or Cash on Delivery (COD).

## 2. Market conventions — VERIFY per project

Confirm with the owner:

- **Price and bundle basis:** whether products have variable unit prices or one
  fixed storewide price where value is adjusted by package quantity (single hero
  + bonus, 2-pack BOGO, 3-pack, 4-pack, or 5–10 piece wholesale pack).
- **Origin warehouse & shipping consolidation:** whether inventory ships from a
  single fulfillment center or multiple regional hubs, and how same-warehouse
  cart consolidation (`1x ongkir`) is explained.
- **Guest-first checkout vs optional account:** whether buyers can check out
  and look up orders without registering (for example OTP or order-number
  lookup), and whether any account is offered only after purchase.
- **COD & Return-to-Sender (RTS) prevention:** whether COD is enabled, which
  couriers handle COD collection, and how post-purchase confirmation screens
  prepare the household to pay exact cash on arrival.
- **Package copy:** concise labels for package contents and return rules in
  the store's language; currency format follows the README.

## 3. Must-have content inventory

- **Consistently cropped product photography** for every active SKU and
  variant.
- **Explicit package-contents declaration** per offer (exact item count, unit
  volume/weight, and included bonus items).
- **Structured 2-level taxonomy** (10–15 top-level storefront departments +
  clean leaf subcategories) with zero catch-all `"Other / Lainnya"` dumping.
- **Per-SKU origin warehouse, parcel weight (grams), and stock availability.**
- **Authoritative shipping tariff, subsidy, and return-eligibility rules.**

Ask the owner for any missing item; never invent package quantities, free gifts,
discount percentages, or warehouse locations.

## 4. Reference set (to research)

Search queries for 3–6 live references (record chosen URLs and observations in
the project design artifact, never here):

- `consumer marketplace web app clean category bento pill search`
- `multi-department e-commerce category directory dual product preview cards`
- `value bundle storefront multipack filter bar 1:1 product card grid`
- `mobile-first shopping app bottom dock category avatar pills PDP`

## 5. Recurring patterns

| Problem | Pattern that solves it | When it does not apply |
| --- | --- | --- |
| Multi-category homepages look like noisy bazaar flyers when filled with promo banners | Combine a prominent search field, a horizontal rail of category chips that each carry a small product photo, and category cards built from a few real product photos on a calm neutral canvas | Single-category or single-product brands where one hero product owns the story |
| Category index pages with plain text links or generic icons fail to show what is inside each department | Color-blocked category cards (title at WCAG AA contrast) containing two real product previews from that department | Small catalogs with fewer than 3 categories |
| Standard "Min–Max Price" filters are useless when all packages share one fixed price or tight price band | Replace price-range sliders with filters for **package tier / contents** (2-pack, 3–4 pack, wholesale pack, hero + bonus) and **origin warehouse** | Traditional marketplaces with wide price variance |
| Buyers abandon multi-item carts when unexpected split-shipment fees appear at checkout | Surface the origin warehouse pill on cards/PDPs and show a **"Same Warehouse — Save 1x Shipping"** cross-sell rail on the PDP and cart | Single-warehouse stores |
| Dense navigation bars crowd narrow phone screens and compete with product imagery | Keep desktop navigation compact and use a bottom navigation bar with 4–5 destinations on mobile, hidden on focused task flows (PDP purchase bar, checkout) | Content/editorial sites without repeat shopping utilities |

## 6. Category default to escape

Cluttered marketplace clones with flashing countdown timers, spinning prize
wheels, fake sold-out progress bars, neon orange/red badge soup over every
corner of a product thumbnail, and mandatory sign-in walls before a shopper can
inspect their cart.

## 7. Optional style directions

| Direction | Fit | Risk | Accessibility cost |
| --- | --- | --- | --- |
| **App-like consumer discovery shell:** neutral canvas, uniform rounded media tiles, chip-style search and filters, restrained brand-accent CTAs, and app-style navigation | Multi-category retail, curated bundle marketplaces, and everyday value stores | Over-rounding or excessive floating elements can obscure content if bottom safe areas are not reserved | Low when focus order and bottom-dock clearance are enforced |
| **Editorial department store:** structured hairlines, framed collection modules (top rated, new bundles), and calm typographic hierarchy | Household essentials, lifestyle goods, and curated family catalogs | Can feel too quiet if the package quantity is not prominent on the card | Low |
| **High-density wholesale / grosir catalog:** compact comparison rows, immediate multi-pack tier badges, and fast warehouse filtering | Household hardware, adhesives, automotive care, and repeat-purchase consumables | Can feel utilitarian if photography crops are inconsistent | Low — maintain `44×44px` minimum touch targets on filter pills and steppers |

## 8. Mobile notes

- Put search and a swipeable category rail above any promotional banner on
  the mobile home screen.
- A 2-column product grid usually fits; keep one package-tier badge per card,
  a clamped title, and price and package quantity aligned across the row.
- Ensure any fixed bottom navigation dock or sticky checkout bar reserves space
  (`padding-bottom`) and never overlaps focused inputs or validation errors.

## 9. Claim traps

- **Package quantity vs component pieces:** never label a 1-item product with 3
  small accessories as a "4-Pack" unless the contents list explicitly names each
  component.
- **Reference-price strikethroughs:** only show a crossed-out comparison price
  when backed by a verified retail reference source; never invent inflated anchor
  prices.
- **Shipping-subsidy math:** keep gross carrier fee (`Tarif`), shipping discount
  (`Subsidi`), and net buyer shipping cost (`Ongkir`) distinct in cart and
  checkout summaries.

## 10. Open questions

1. Does the catalog use variable pricing or a fixed price with multi-tier
   package quantities (`1 + bonus`, `2 pcs`, `3–4 pcs`, `5–10 pcs`)?
2. How many fulfillment warehouses exist, and how are split-warehouse shipping
   fees calculated at checkout?
3. What is the exact wordmark/logo lockup and primary brand accent color?
4. Is checkout 100% guest-accessible with optional post-purchase OTP account
   continuity?
