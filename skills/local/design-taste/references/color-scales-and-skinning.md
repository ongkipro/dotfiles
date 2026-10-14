# Perceptual Color Scales, Fluid Type & Multi-Brand Skinning

Use this reference when deriving a new palette from a single brand color, building
a fluid typography/spacing system without layout shift (CLS), or skinning a
shared storefront/CMS template across multiple distinct brands without producing
accidental clones. Explicit owner direction, established brand assets, and
inspected target references always outrank these starting defaults (`SKILL.md`
§1.5 and §2.1).

---

## 1. OKLCH Perceptual Color Engineering

Unlike HSL (where `hsl(60 100% 50%)` yellow has ~0.93 relative luminance while
`hsl(240 100% 50%)` blue has ~0.07), **OKLCH (`oklch(L C H)`)** separates
perceptual lightness (`L: 0..1`), chroma (`C: 0..0.37`), and hue (`H: 0..360deg`).

### Deriving a Semantic Scale from One Brand Hue (`H_brand`)

1. **Tinted Neutrals (Starting Default for Unspecified Palettes)**:
   - Pure `C = 0` neutrals are valid when a reference or brand calls for stark
     monochrome, but on lifestyle, commerce, and editorial sites a subtle hue
     tint (`C = 0.004` to `0.014`) usually feels more cohesive:
     - **Warm paper / organic / craft / food**: `H = 55deg–85deg`, `C = 0.008–0.015`
     - **Clinical / fintech / logistics / SaaS**: `H = 220deg–255deg`, `C = 0.005–0.012`
     - **Botanical / agritech**: `H = 135deg–155deg`, `C = 0.006–0.012`

2. **Contrast-Checked Lightness Ladder (`L` Starting Ranges)**:
   Always verify final pairs with `python3 scripts/contrast.py "<fg> on <bg>"`.

   | Semantic Role | Light Mode `oklch(L C H)` | Dark Mode `oklch(L C H)` | Guidance |
   | :--- | :--- | :--- | :--- |
   | `--background` (Canvas) | `L = 0.985–0.995`, `C = 0.004–0.012` | `L = 0.130–0.155`, `C = 0.006–0.014` | Prefer dark charcoal over `#000000` unless the brand/reference uses true OLED black |
   | `--card` / Elevated Surface | `L = 1.000`, `C = 0–0.004` | `L = 0.175–0.205`, `C = 0.008–0.016` | Dark elevation uses lighter surface steps (`L`) plus subtle border hairlines |
   | `--muted` / Subtle Well | `L = 0.950–0.968`, `C = 0.006–0.015` | `L = 0.215–0.245`, `C = 0.010–0.018` | Distinguishable from canvas without heavy borders |
   | `--border` / Hairline | `L = 0.885–0.915`, `C = 0.006–0.014` | `L = 0.265–0.305`, `C = 0.010–0.018` | Interactive control boundaries need >= 3:1 (`L <= 0.64` light / `L >= 0.56` dark) |
   | `--foreground` (Primary Ink) | `L = 0.145–0.205`, `C = 0.008–0.020` | `L = 0.945–0.975`, `C = 0.004–0.010` | Target >= 12:1 against canvas for effortless reading |
   | `--muted-foreground` | `L = 0.460–0.535`, `C = 0.010–0.022` | `L = 0.695–0.760`, `C = 0.008–0.016` | Must pass >= 4.5:1 AA against both `--background` and `--muted` |
   | `--primary` (Filled Action) | `L = 0.420–0.560` (white text) or `L = 0.780–0.880` (dark ink) | `L = 0.650–0.780` (dark ink) or `L = 0.520–0.600` (white text) | Do not assume white text passes on yellow/teal/lime (`H = 70deg–195deg`); check `contrast.py` |

3. **Chroma Discipline Across Light/Dark**:
   - High-chroma accents (`C > 0.20`) can vibrate on dark surfaces (`L < 0.20`).
     Reducing chroma by `15%–25%` (`C_dark = C_light * 0.8`) and raising `L` by
     `+0.08–0.14` keeps dark-mode accents comfortable to read.

---

## 2. Fluid Typography, Pairing Archetypes & Zero-CLS Fallbacks

### Fluid Type Scale (`390px` → `1440px`)

Use bounded `clamp(min, preferred, max)` tokens that retain a `rem` term (so
browser zoom works) and tighten `line-height` as font size increases:

```css
:root {
  --text-xs:   clamp(0.75rem, 0.72rem + 0.15vw, 0.8125rem); /* 12px -> 13px, lh 1.5 */
  --text-sm:   clamp(0.875rem, 0.84rem + 0.18vw, 0.9375rem); /* 14px -> 15px, lh 1.5 */
  --text-base: clamp(1rem, 0.96rem + 0.22vw, 1.0625rem);     /* 16px -> 17px, lh 1.6 */
  --text-lg:   clamp(1.125rem, 1.05rem + 0.38vw, 1.25rem);   /* 18px -> 20px, lh 1.45 */
  --text-xl:   clamp(1.3125rem, 1.18rem + 0.65vw, 1.625rem); /* 21px -> 26px, lh 1.3 */
  --text-2xl:  clamp(1.625rem, 1.38rem + 1.2vw, 2.25rem);    /* 26px -> 36px, lh 1.18 */
  --text-3xl:  clamp(2rem, 1.6rem + 2.0vw, 3.25rem);         /* 32px -> 52px, lh 1.08, tracking -0.025em */
}
```

### Candidate Font Pairing Matrix (10 Starting Archetypes)

Run `python3 scripts/portfolio-scan.py` when choosing typography for an open
direction. There is no forbidden-font list (`SKILL.md` §2.1): reuse is valid when
it fits the brand and reference, while the matrix below offers Starting
candidates when a project needs a distinct voice from recent sibling sites:

| Archetype / Vertical | Display / Headline (`--font-display`) | Body / UI (`--font-sans`) | Mono / Spec (`--font-mono`) | Character & Fit |
| :--- | :--- | :--- | :--- | :--- |
| **1. Warm Editorial / Craft / Leather** | `Newsreader` or `Instrument Serif` | `Plus Jakarta Sans` | `JetBrains Mono` | Tactile, literary, high-trust commerce |
| **2. Botanical / Skincare / Wellness** | `Cormorant Garamond` or `Fraunces` | `DM Sans` | `Space Mono` | Soft contrast, apothecary label precision |
| **3. Industrial / B2B / Logistics** | `Space Grotesk` or `Bricolage Grotesque` | `IBM Plex Sans` | `IBM Plex Mono` | Utilitarian, tabular clarity, shipping/tariff tables |
| **4. Agribusiness / Field & Commodity** | `Syne` or `Archivo` (700/800) | `Source Sans 3` | `Fira Code` | High outdoor sunlight legibility, sturdy numerals |
| **5. Culinary / F&B / Heritage** | `Playfair Display` or `Young Serif` | `Work Sans` | `Courier Prime` | Menu warmth, receipt/batch authenticity |
| **6. Legal / Advisory / Corporate** | `Libre Baskerville` or `Spectral` | `Public Sans` | `IBM Plex Mono` | Institutional authority, dense long-form reading |
| **7. Modern SaaS / Developer Tool** | `Geist` or `Sora` | `Geist` or `Figtree` | `Geist Mono` | Crisp geometry, compact operator density |
| **8. Modest Fashion / Apparel** | `Bodoni Moda` or `Prata` | `Outfit` | `DM Mono` | High-fashion vertical stress, clean size matrices |
| **9. Local Services / Home & Clinic** | `Cabinet Grotesk` or `Lexend` | `Atkinson Hyperlegible` or `Nunito Sans` | `JetBrains Mono` | Maximum approachability for all age groups |
| **10. Precision Electronics / Hardware** | `Chakra Petch` or `Rajdhani` | `Inter` or `Albert Sans` | `Share Tech Mono` | Spec-sheet authority, SKU/part-number scanning |

### Zero-CLS Fallback Font Metric Overrides

When loading a custom display serif or sans without automated metric matching,
declare a calibrated local fallback so webfont swap does not shift hero height:

```css
@font-face {
  font-family: "Display Fallback";
  src: local("Georgia"), local("Times New Roman");
  size-adjust: 106%;
  ascent-override: 92%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

---

## 3. Shared-Template Multi-Brand Skinning Architecture

Swapping `--primary` and `--font-display` on a shared starter while leaving
`--radius`, sticky navbar chrome, card proportions, and badge shapes untouched
often makes separate brands look like clones (`portfolio-scan.py` surfaces this
for critique).

When expressing a new brand on a shared template, evaluate these **5 structural
axes** against the brand's researched references and product job (preserving the
underlying engine and components):

1. **Header & Navigation Topology**:
   - *Editorial Masthead*: top announcement strip + centered brand wordmark +
     bottom bordered category rail.
   - *Compact Utility Split*: left logo + inline prominent search input + right
     WhatsApp/Cart pill.
   - *Minimalist Architectural*: full-width hairline grid (`1px solid
     var(--border)`) with visible cell dividers between logo, nav links, and CTA.
2. **Corner & Border Physics (`--radius` + `--border-style`)**:
   - *Sharp Editorial*: `--radius: 0px` with exposed `1px solid` hairline grid
     borders (`divide-x divide-y`).
   - *Technical Chamfer*: `--radius: 0.25rem` (`4px`) with crisp `1px` borders
     and zero drop shadow.
   - *Tactile Soft*: `--radius: 0.75rem–1rem` (`12px–16px`) with tonal surface
     separation (`bg-muted/60` on `bg-background`).
3. **Hero Composition Slot**:
   - *Asymmetric Split (7:5)*: copy + trust specs left, single framed hero
     product + specification callout right.
   - *Editorial Frame*: typographic statement above a panoramic `21:9` or `16:9`
     art-directed showcase.
   - *Catalog-First Merchandising*: compact category header that exposes the
     filterable product grid above the fold.
4. **Product Card Silhouette & Aspect Ratio**:
   - Match aspect ratio to the physical product: `3:4` portrait for apparel,
     `1:1` square with subtle inner ring for packaged goods/hardware, `4:5` for
     skincare/botanicals.
   - Vary metadata layout: stacked left vs split baseline (`title` left,
     `tabular-nums price` right) vs B2B unit-price + pack-size pill.
5. **Surface Chromaticity & Section Rhythm**:
   - Use brand-tinted OKLCH neutrals and tonal bands where appropriate instead of
     defaulting every section to identical shadowed white cards.
