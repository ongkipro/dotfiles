---
name: beautyinu
description: Beautyinu Skincare (beautyinu.co) — Gen-Z & Millennial bodycare brand. Shopify Hydrogen storefront (React Router/Oxygen/Tailwind v4) backed by Shopify store p1d3wg-6i. Full catalog map, design system tokens, Drive asset inventory, and architectural conventions.
metadata: 
  node_type: memory
  type: project
---

# Beautyinu Skincare — Project Memory & System Truth

**Snapshot dated 2026-09-16.** Beautyinu is an Indonesian beauty & bodycare brand targeting Gen-Z and Millennials (18–35) seeking brightening, moisture barrier protection, and fine fragrances. Modern Hydrogen storefront built with React Router, Oxygen runtime, and Tailwind CSS v4.

---

## 1. Store Profile & Credentials
- **Status**: **Done / Production Ready** (Storefront launched live on `https://beautyinu.co`)
- **Primary Domain**: `https://beautyinu.co`
- **Shopify Storefront Domain**: `p1d3wg-6i.myshopify.com`
- **Storefront API Version**: `2025-01`
- **Active Markets**: `ID` (Primary, default currency: `IDR` / `Rp`), `MY`, `SG`.
- **Locale & i18n Setting**: `{country: 'ID', language: 'ID'}` configured in `app/lib/context.ts` (CRITICAL: without this, Storefront API defaults to USD or US country code and fails to compute local IDR pricing & discounts correctly).
- **Credentials Location**: Kept in `.env` (`PUBLIC_STOREFRONT_API_TOKEN`, `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_ID`) and accessible via `secrets-env`. Never expose raw API tokens in memory or public markdown.

---

## 2. Design System & UI/UX Standards (Gen-Z Clean Flat Minimalist)
- **Design Philosophy**: Rhode / Glossier / Somethinc inspired — pure, breathable, borderless, zero visual noise, aesthetic and flat.
- **Canvas / Background**: Pure crisp white (`#FFFFFF`, `bg-white`).
- **Surface Tints**: Subtle soft tints for card backgrounds and elevated blocks (`#FAF7FD` / `#FAF8FC`, `bg-[#FAF7FD]`).
- **Zero Border / Zero Shadow / Zero AI-Slop Rule**:
  - NO decorative badge icons or sparkles: Icons inside rounded pill badges (e.g. `Sparkles`, stars, magic wands) are **strictly forbidden AI slop**. Section kickers and category tags must be pure flat typography (`font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-400`) with NO icons and NO background pills.
  - NO bubbly rounded containers: Avoid `rounded-3xl`, `rounded-2xl`, and `rounded-full` badge pills (`rounded-none` or clean micro-radius `rounded-sm` only).
  - NO pastel gradient boxes (`bg-gradient-to-br from-...`) or drop shadows (`shadow-none`).
  - NO boxed borders around main content cards (`border-none` or `border-zinc-100` subtle dividers only).
  - NO skeuomorphic gimmicks (3D pushpins, tilted/rotated memo cards, tape, paperclips) and NO fake progress bars/invented percentage meters (e.g. "35% Recovery Barrier"). Timelines must be flat, architectural linear progressions (`01 / 02 / 03`) with honest observable milestones.
  - NO emojis in interface labels or badges. Essential functional navigation icons only (`ArrowRight`, `ArrowLeft`, `MessageCircle`, `Copy`, `Check`).
- **Color Tokens**:
  - Primary Brand Pink: `#F97F9E` (CTA buttons, save percentage badges, highlight accents).
  - Primary Hover: `#F06B8D`.
  - Secondary Accent Lavender: `#AF8FD1` (soft highlights, editorial headers).
  - Surface Tint: `#FAF7FD` / `#FAF8FC` (clean modern card surface).
  - Dark Neutral / Headings: `#1A1A1A` (`text-[#1A1A1A]`).
  - Muted Neutral / Body: `#6B7280` (`text-[#6B7280]`).
  - Clean Hairline Border: `#F3EEFA` / `#F4F4F5`.
- **Typography**:
  - Serif Display (Headings, titles, hero branding): `DM Serif Display` (`font-serif`).
  - Sans Modern (Body, UI controls, prices, buttons): `Inter` (`font-sans`).
- **Layout Standards & Verified Architectural Patterns (2026-09)**:
  - Hero: Full-width edge-to-edge desktop banner (`1440x600`, 2.4:1 ratio) with clean responsive mobile companion (`1:1` or `4:5`).
  - Product Grids: 4 columns desktop (`grid-cols-4`), 2 columns mobile (`grid-cols-2`), gap 4 to 6, flat borderless cards with quick hover zoom.
  - Sticky Cart Bar on PDP mobile for frictionless conversion.
  - **Routine 3-Step Card Architecture**:
    - Step stage badge integrated into card header (`[1] Step 01 · Persiapan / Bersihkan Sel Kulit Mati`).
    - Ghost watermark numerals (`01`, `02`, `03`) unblocked in card top-right corner.
    - Bottom bar displays live product price + strikethrough compare-at price with rounded arrow button.
  - **Luminous Frosted Glass Bundle Banner**:
    - Replaces heavy solid black blocks with frosted glass: `bg-gradient-to-r from-white/90 via-white/80 to-[#FFF3F6]/85 backdrop-blur-xl border border-white/90 shadow-[0_10px_35px_rgba(249,127,158,0.07)]`.
    - Top hairline glass reflection sheen and ambient blush/lavender glow orbs.
    - Warm signature coral CTA (`bg-primary hover:bg-primary-hover text-white`) matching the brand identity.
  - **Inter-Section Spacing & Rhythm**:
    - Avoid bloated stacked padding (previously 168px). Standardize transition gaps between major sections to ~56px: top section `pb-6 md:pb-8`, bottom section `pt-6 md:pt-8`, divider `mb-6 sm:mb-8`.
  - **Minimalist Architectural Footer**:
    - Giant glass wordmark `BEAUTYINU` flush with the top border (`top-0`, `leading-[0.78]`, `text-[17vw]`, glass gradient fill, top hairline sheen).
    - Mathematically balanced 4 columns (`[260px_155px_170px_350px]`) with uniform 94px gaps via responsive `justify-between`.
    - Standalone floating WhatsApp consultation card starting directly at the top line with live chat status pulse dot (no redundant external headline).
  - **Product Card Snug Title Alignment**: Zero fixed `min-height` on card `<h3>` titles. Single-line titles sit snug flush against prices (`mt-1`) with zero empty line gap. Multi-line titles wrap naturally up to 2 lines (`line-clamp-2`).
  - **Collection Directory & Moodboard (`/collections`)**: Flat architectural micro-kicker (`● BEAUTYINU · OFFICIAL DIRECTORY / 4 KOLEKSI PILIHAN`) with pulsing dot, borderless transparent frosted glass badges (`bg-white/70 backdrop-blur-md`) with Lucide SVG icons (zero emoji/emoticon slop), and 4-pillar `OfficialAssurance` strip.
  - **Collection Hero Scrim Directionality (`/collections.$handle`, `/collections.all`)**: Zero global model opacity reduction (`opacity-100`); directional left horizontal scrim (`w-[58%] lg:w-[50%]`) and bottom vertical scrim (`h-20 sm:h-28`) for 100% text readability without washing out model photography. Right-anchored mobile WebP assets with feathered edges.

---

## 3. Product Catalog Truth (15 Active SKUs)
Cached in `/Users/ongki/Documents/work/prd/beautyinu-skincare/data/products.json` and synchronized with live Shopify store:

### Hero Single SKUs:
1. **Bright Glow Body Wash (250ml)** (`bright-glow-body-wash-250ml`)
   - Price: Rp 69.750 (Compare at: Rp 155.000, **55% OFF**)
   - Key Actives: Niacinamide, Glutathione, Vitamin C, Collagen.
   - BPOM: NA18230700812
2. **Bright Glow Body Lotion UV Filter (750ml)** (`bright-glow-body-lotion-uv-filter-750ml`)
   - Price: Rp 100.737 (Compare at: Rp 159.900, **37% OFF**)
   - Key Actives: Niacinamide 5.22%, Alpha Arbutin 2.30%, Titanium Dioxide (UV Filter), Tranexamic Acid.
   - BPOM: NA18230104197
3. **Brightening Booster Gold Powder (25gr)** (`brightening-booster-gold-powder-25gr`)
   - Price: Rp 39.724 (Compare at: Rp 55.950, **29% OFF**)
   - Key Actives: 24K Gold particles, Niacinamide, Pure Vitamin C booster.
   - BPOM: NA18231901844
4. **Brightening Body Cream Grape (200g)** (`brightening-body-cream-grape-200g`)
   - Price: Rp 80.300 (Compare at: Rp 110.000, **27% OFF**)
   - Key Actives: Grape Seed Extract, Niacinamide, Shea Butter, Alpha Arbutin.
   - BPOM: NA18230104882
5. **Brightening Body Cream Grape (100g)** (`brightening-body-cream-grape-100g`)
   - Price: Rp 50.600 (Compare at: Rp 65.000, **22% OFF**)
   - Key Actives: Grape Seed Extract, Niacinamide, Shea Butter.
6. **English Pear Body Toner (100ml)** (`english-pear-body-toner-100ml`)
   - Price: Rp 100.000 (Compare at: Rp 125.000, **20% OFF**)
   - Key Actives: AHA, BHA, English Pear extract, Niacinamide.
   - BPOM: NA18230105120
7. **Kefir Collagen Soap (60gr)** (`kefir-collagen-soap-60gr`)
   - Price: Rp 37.125 (Compare at: Rp 45.000, **18% OFF**)
   - Key Actives: Fermented Goat Milk Kefir, Hydrolyzed Marine Collagen, Coconut Oil.
   - BPOM: NA18230500411

### Value Bundles & Routine Sets:
8. **Complete Brightening Set** (`complete-brightening-set`)
   - Price: Rp 259.117 (Compare at: Rp 488.900, **47% OFF**)
   - Contains: Body Wash + Body Lotion + Body Cream + Gold Powder + Kefir Soap.
9. **Glowing Set 3-in-1** (`glowing-set-3-in-1`)
   - Price: Rp 155.092 (Compare at: Rp 254.250, **39% OFF**)
   - Contains: Body Wash 250ml + Body Lotion 750ml + Gold Powder.
10. **Body Lotion Booster Set** (`body-lotion-booster-set`)
    - Price: Rp 140.302 (Compare at: Rp 215.850, **35% OFF**)
    - Contains: Body Lotion 750ml + Booster Gold Powder 25gr.
11. **Body Cream Booster Set** (`body-cream-booster-set`)
    - Price: Rp 121.143 (Compare at: Rp 165.950, **27% OFF**)
    - Contains: Body Cream 200g + Booster Gold Powder 25gr.
12. **Booster Gold Powder 7-Pack** (`booster-gold-powder-7-pack`)
    - Price: Rp 277.095 (Compare at: Rp 391.650, **29% OFF**)
    - Contains: 7x 25gr Booster Gold Powder (Weekly Glow Protocol).

---

## 4. Collections & Content Taxonomy
- `frontpage` / **All Products**: Complete 15 active SKUs.
- `body-care` / **Body Care Essentials**: 10 single SKUs and routine items.
- `bundles` / **Bundles & Sets**: 5 money-saving value sets.
- `best-sellers` / **Best Sellers**: 8 top-velocity products (Lotion, Cream, Body Wash, Booster sets).
- **Blog Articles** (`/blogs/news`): 6 live editorial articles (Skinification trend, 1 Juta Penjualan, Holistik outdoor, CSR Glow & Grow dokumentasi empatik, 7 Urutan perawatan harian, Tumbuh Bersama).

---

## 5. Google Drive Asset Inventory & Aspect Ratio Standards
- **Google Drive Origin**: `https://drive.google.com/drive/folders/1BS8zLe-Fl5CnFafvSFMicYIPvGDbi2sg`
- **Local Source Folder**: `~/Projects/beautyinu-hydrogen/drive-assets/`
- **Optimized Web Assets**: `~/Projects/beautyinu-hydrogen/app/assets/`

### Asset Categories & Dimension Standards:
| Category | File Location | Dimensions | Aspect Ratio | Primary Frontend Use Case |
|---|---|---|---|---|
| **Desktop Master Banners** | `drive-assets/1. PC/BANNER HOMEPAGE/` | 1440x600 px | **2.4:1** | Full-width desktop hero banner (`hero-banner-desktop.webp`), seasonal promotional strips |
| **Mobile Hero Banners** | `drive-assets/2. MOBILE/` | 1080x1080 px | **1:1** / **4:5** | Mobile hero display (`hero-banner-mobile.jpg`), responsive swap |
| **Product Infographics** | `drive-assets/1. PC/ETALASE PRODUCT/` | 1080x1080 px | **1:1** | 6-slide infographic etalase per product (Benefits, Ingredients, How to Use, BPOM Cert) |
| **Editorial & Midpage** | `drive-assets/1. PC/HOMEPAGE TENGAH/` | 1080x1350 px & 1440x600 px | **4:5** & **2.4:1** | Lifestyle lookbook, talent photography (`editorial-1..6`), mid-page promo banners |
| **Talent & Model Shoots** | `drive-assets/PHOTOSHOOT PIPA/` | 6000x4000 px | **3:2** (1.5:1) | High-res lifestyle editorial shots, social proof, campaign landing pages |
| **CSR & Social Proof** | `drive-assets/1. PC/CSR/` | 6000x4000 px | **3:2** (1.5:1) | Brand milestone photos, CSR community activities, team documentation |
| **Video Assets** | `drive-assets/1. PC/CSR/VIDEO/`, `MOONBABIES/` | 1080p MP4 | 16:9 & 9:16 | Video hero backgrounds, customer testimonial UGC carousels |

---

## 6. Development Directives & Workflow Rules
1. **Never Invent Data**: All pricing, descriptions, BPOM numbers, and active ingredients must be retrieved directly from the verified catalog files (`products.json`, `collections.json`, `shop.json`).
2. **Strict Approval Gates**:
   - Never stage, commit, or push Git commits unless explicitly asked by Paduka Ongki.
   - Never print raw credentials or secret tokens.
   - Never run destructive actions (`rm -rf`, `git reset --hard`) without explicit approval.
3. **Verification Before Claiming Done**:
   - Always run `npm run typecheck` to guarantee 0 TypeScript compilation errors.
   - Verify dev server on `http://localhost:3000`.
4. **Tone & Addressing**:
   - Address the user as **Paduka Ongki**.
   - Explanations in **casual Bahasa Indonesia**.
   - Technical outputs, code, schema, and PRD stay in **English**.
