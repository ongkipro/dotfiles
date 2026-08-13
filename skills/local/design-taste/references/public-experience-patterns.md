# Public Experience & Visual Patterns

This reference defines the visual, aesthetic, and layout standards for high-conversion public frontends. Use these rules to evaluate and execute UI designs across e-commerce storefronts, travel booking portals, and landing pages, ensuring a premium, trustworthy, and non-templated look.

## 1. E-commerce Storefronts (Next Commerce / Shopify Dawn Patterns)

### Catalog Grid & Product Filtering Matrix
- **Visual Rhythm:** Avoid monotonous, identical card grids. Introduce visual breaks—such as a full-width promotional banner, an editorial feature block, or a double-width product card—every 2-3 rows to maintain scanning interest (VAR 4-6).
- **Filter Layout:** On desktop, prefer a sticky left sidebar for filters to allow continuous context while scrolling. On mobile, use a full-screen slide-out drawer, never a cramped inline accordion.
- **Card Aesthetics:** Rely on high-quality product photography rather than heavy card styling. Remove outer drop shadows and heavy borders; use subtle background tints or 1px hairlines to define card boundaries.

### Variant Matrix Picker
- **Clarity over Cleverness:** Use clear, labeled swatches for colors and standard pill buttons for sizes. Avoid dropdowns for variants with fewer than 6 options—surface the choices immediately.
- **Unavailable States:** Visually strike through or heavily desaturate out-of-stock variants. Do not hide them entirely, as seeing the full range communicates catalog depth.

### Reactive Cart Drawer & Micro-interactions
- **Drawer Typography:** Keep cart items compact. Use a smaller typographic scale for meta-details (variant size, color) to let the total price and checkout CTA dominate the visual hierarchy.
- **Micro-animations:** Keep motion purposeful and snappy. A cart drawer should slide in with an `ease-out-quart` curve (duration ~300ms). Items added to the cart should trigger a subtle scale bounce (max 5%) on the cart icon, not a flashy fireworks animation.
- **Checkout Handoff:** The "Proceed to Checkout" button must be the most visually undeniable element on the screen. Lock it to the bottom of the drawer on mobile to ensure it's always reachable.

---

## 2. Travel & Booking Portals

### Multi-step Search Matrix (Dates, Guests, Locations)
- **Container Design:** The search matrix is the engine of the portal. It should sit in a high-contrast surface block (e.g., a white pill on a dark hero image) with distinct, well-padded internal dividers (1px vertical hairlines).
- **Focus States:** When an input (like "Where to?") is focused, dim the rest of the hero background slightly to draw absolute attention to the search task.

### Interactive Availability Calendars
- **Visual Distinction:** Past dates should be visually muted (low opacity, unclickable). Selected date ranges must have a continuous, low-opacity background connecting the start and end dates, with bold, fully opaque caps.
- **Typography:** Ensure calendar numerals are highly legible (sans-serif, medium weight). Avoid thin, elegant serifs in data-dense components like calendars.

### Pricing Breakdowns & Itinerary Cards
- **Hierarchy of Numbers:** The final total must be visually distinct (larger size, heavier weight) from the itemized list of fees. 
- **Card Density:** Itinerary cards must balance density with readability. Use icons sparingly—only for critical waypoints (flight departure, hotel check-in)—and align text strictly to a grid to avoid a cluttered look.

---

## 3. Landing Pages & Portals

### Above-the-fold Hero Hierarchy
- **Asymmetric Balance:** Move away from the AI-default centered layout. Use left-aligned typography with a strong ragged right edge, paired with a right-aligned hero asset.
- **Typographic Scale:** Headline should be massive but tight (`leading-[1.1]`, `tracking-tighter`). Subtext must be significantly smaller and legible (max 65ch width). 
- **CTA Styling:** The primary CTA must pass WCAG AA contrast against the hero background. Avoid default purple/cyan gradients. If the brand is premium, use a solid dark ink button on a light theme or a stark white button on a dark theme.

### Social Proof Bands & Feature Grids
- **Logo Walls:** Use single-color (monochrome) SVG logos for client bands. Strip out original brand colors to prevent the logo wall from looking like a chaotic sticker book.
- **Bento Grids:** If using a bento-box feature layout, vary the internal composition of the cells. Do not just use an icon + heading + paragraph in every box. Mix text-heavy cells with image-only cells or pure data visualizations.

### Interactive Pricing Calculators
- **Visual Feedback:** When a slider is moved, the resulting price change must happen instantly, ideally with a fast, rolling number animation to emphasize the value shift.
- **Tier Differentiation:** If showing multiple pricing tiers, clearly elevate the "recommended" tier via a subtle scale increase, a distinct background tint, or a 1px border in the accent color, but avoid overly loud "BEST VALUE!" badges.

### Micro-animations & Motion (MOT 4-7)
- **Motivated Motion:** Use scroll-driven reveals (fade up and in) to introduce sections as the user scrolls, but keep the distance short (translateY < 20px) and the duration fast to avoid a sluggish feel.
- **Hover States:** Interactive elements should respond immediately. Buttons should shift slightly (`scale-[0.98]`) or change fill color. Avoid elastic, bouncing hover effects that feel cheap.
