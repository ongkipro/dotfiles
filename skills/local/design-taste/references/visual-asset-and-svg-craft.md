# Visual Asset Craft, Explanatory SVGs & Art Direction

`invented-info-tells.md` bans fake PIL/SVG "project photos", decorative `Sparkles`
filler, and unlabeled AI portraits. This reference defines **what to build instead**
when a page needs visual explanation, technical clarity, or art-directed media.

---

## 1. Explanatory & Technical SVG Craft

When explaining how a product works, material layering, sizing dimensions, or a
service workflow without client photography, author **purpose-built schematic SVGs**
rather than generic icon grids or text walls.

### Rules for High-Craft Inline SVGs

1. **Token-Driven Palette (`currentColor` + CSS Variables)**:
   - Never hardcode random hex values inside inline SVGs. Bind strokes and fills
     to semantic tokens so diagrams adapt to brand skins and dark mode:
     - Primary structure / outlines: `stroke="currentColor"` (`text-foreground`)
     - Secondary grid / dimension lines: `stroke="var(--border)"` (`stroke-dasharray="4 4"`)
     - Highlighted node / active flow: `stroke="var(--primary)"`, `fill="var(--primary)"` at `fill-opacity="0.12"`
     - Surface fill: `fill="var(--card)"` or `fill="var(--muted)"`
2. **Consistent Stroke Geometry**:
   - Use `vector-effect="non-scaling-stroke"` and a consistent stroke width (`1.5`
     for fine schematics, `2` for UI icons) with `stroke-linecap="round"` and
     `stroke-linejoin="round"`.
   - Maintain a generous `viewBox` (e.g. `viewBox="0 0 640 320"`) with at least
     `16px` internal padding so strokes and text labels never clip at the edge.
3. **Typography Inside SVGs**:
   - Set `font-family="var(--font-mono)"` for dimensions, tolerances, weights,
     and step numbers (`01`, `02`, `240mm`, `pH 5.5`), and `var(--font-sans)` for
     component labels.
   - Keep minimum SVG text size >= `11px` at `390px` viewport width; if a diagram
     becomes unreadable on narrow screens, stack the schematic vertically or place
     numbered callout pins (`1`, `2`, `3`) on the SVG with an HTML `<dl>` legend below.
4. **Accessibility Contract**:
   - Informative schematics require `role="img"` and `<title>` + `<desc>` (or
     `aria-labelledby`). Purely atmospheric background geometry requires
     `aria-hidden="true"` and `focusable="false"`.

### 4 High-Value Schematic Archetypes

- **Material / Ingredient Cross-Section**: Layered cutaway showing outer grain/coating,
  core substrate, and stitching/protective barrier with pointer lines (`<line>` +
  `<circle r="3">`).
- **Dimension & Size Guide Silhouette**: Garment, bag, or packaging outline with
  explicit measurement arrows (`LD`, `PB`, `P × L × T`) paired with a `tabular-nums`
  HTML specification table.
- **Process / Fulfilment Pipeline**: 3–5 connected stage nodes with SLA/time
  annotations (e.g., `Order Masuk` → `QC & Packing < 4 Jam` → `Pickup Ekspedisi` →
  `Estimasi Tiba 1–3 Hari`).
- **Empty-State Blueprint**: Minimal line-art representation of the specific object
  about to be created (an invoice sheet, a waybill barcode, a product swatch) —
  never a generic cartoon character or magnifying glass.

---

## 2. Photographic Art Direction & Cropping Discipline

1. **Aspect-Ratio Locking (Zero Layout Shift)**:
   - Every `<img>` and media container must reserve its geometry via `width`/`height`
     attributes or explicit `aspect-*` (`aspect-[4/5]`, `aspect-[3/4]`, `aspect-square`,
     `aspect-[16/10]`).
2. **Focal-Point Preservation (`object-position`)**:
   - Default `object-cover` centers (`50% 50%`), which frequently decapitates
     models or cuts off product caps on mobile banners.
   - Set explicit focal points: `object-[50%_20%]` for portraits/apparel lookbooks,
     `object-bottom` for grounded tabletop packshots.
3. **Edge Definition on Light-on-Light Media**:
   - White bottles, paper sacks, or light UI screenshots vanish against light
     canvases. Always apply a subtle inset hairline:
     `ring-1 ring-inset ring-black/[0.06] dark:ring-white/[0.08]`.
4. **Text Over Media Legibility Protection**:
   - Never place text directly over an unverified image region. Either:
     - Separate text into an adjacent architectural frame/card, or
     - Apply a directional scrim (`bg-gradient-to-t from-black/75 via-black/35 to-transparent`)
       and verify the lightest image patch under the text passes `contrast.py`.

---

## 3. Honest AI Asset Generation Protocol (`9router` / `image-generator`)

When real product/brand photos are absent and a task calls for generated imagery:

### Permitted vs Forbidden Subjects

- **Permitted (Atmospheric & Contextual Staging)**:
  - Studio tabletop podiums, natural stone/wood/linen textures, botanical/raw-ingredient
    macro photography, architectural lighting backdrops, and stylized category mood
    frames that do not impersonate a specific SKU's legal label or a real customer.
- **Strictly Forbidden (`invented-info-tells.md` Hard Gate)**:
  - Fake customer before/after photos, fake founder/doctor/team headshots, fake
    factory/warehouse exteriors claimed as the company's own facility, and fake
    halal/BPOM/ISO certificate stamps.

### Prompt Structure for Non-Slop Editorial Media

Avoid generic prompts (`"modern ecommerce hero banner"`). Specify 5 physical
parameters:
1. **Subject & Materiality**: exact raw material (`unbleached cotton canvas`,
   `vegetable-tanned pull-up cowhide`, `wet volcanic soil with arabica leaves`).
2. **Camera & Lens**: `85mm f/2.8 macro` or `50mm tilt-shift editorial tabletop`,
   overhead `90-degree flatlay` or `eye-level 15-degree studio angle`.
3. **Lighting**: `diffused north-window daylight with soft contact shadow`, or
   `warm directional key light 4500K on travertine surface`.
4. **Color Restraint**: limit to 2–3 dominant tones matching the site's OKLCH canvas
   and primary hue, leaving negative space for layout breathing room.
5. **Anti-Slop Exclusions**: no neon cyan/magenta rim lights, no floating 3D
   spheres, no garbled AI text/gibberish labels, no plastic skin/oversharpening.

---

## 4. OpenGraph (`1200×630`) & Social Share Card Contract

Every public marketing/storefront site needs a designed `1200×630` (`1.91:1`) social
preview card so links shared in WhatsApp, Telegram, Slack, or X look intentional:

- **Safe Zone**: keep all text and logos inside the central `1040×510` box (`80px`
  horizontal, `60px` vertical margin) so platform crops (square mobile thumbnails
  in WhatsApp chat bubbles) do not clip the headline.
- **Hierarchy Cap**: maximum 3 elements — (1) Brand mark/domain pill, (2) 6–10 word
  headline in `--font-display` at >= `56px` (readable when shrunk to `300px` wide
  in a mobile chat preview), and (3) 1 category/price/trust sub-line or product cutout.
- **Contrast**: >= `7:1` AAA contrast for the headline so compression artifacts in
  WhatsApp/Meta link previews do not blur the text.
