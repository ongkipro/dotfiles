# Clean-Light CMS/Admin Baseline

This document specifies the fallback visual design system for operator surfaces, internal tools, and CMS applications when a project lacks an established theme. It avoids heavy branding, multi-theme complexity, and modern "AI slop" trends in favor of a clean, high-density, accessible layout.

For a functional standalone HTML/CSS implementation of this spec, view `../assets/clean-light-cms/index.html`.

## 1. Core Principles & Anti-Slop Rules

- **Clean and restrained:** Minimal use of color. Color indicates action, selection, or status. Everything else is neutral.
- **Data-first density:** Information density is high. Eliminate decorative padding.
- **Hierarchy through typography:** Use font weight, size, and proximity rather than boxing everything in cards.
- **Anti-slop mandates:**
  - **NO gradients:** Flat colors only.
  - **NO glassmorphism:** Solid, opaque surfaces. No backdrop-blurs.
  - **NO oversized border radii:** `4px` or `6px` max for components, `8px` for modals/dialogs.
  - **NO excessive drop shadows:** Flat 1px borders for structure; use shadow *only* for z-index elevation (popovers, dropdowns, modals).
  - **NO rainbow charts:** Chart colors must follow an accessible categorical palette (e.g., Okabe-Ito).
  - **NO generic bento/KPI card grids:** Structure by list and table, not decorative tiled layouts.
  - **NO emoji icons:** Use a consistent, monoline SVG icon set (e.g., Lucide).

## 2. Token Definitions

Use these token values as a baseline. Implement them via CSS variables (e.g., `--color-surface`).

### Surfaces & Neutrals
- **Background (App Shell):** `#fcfcfc` (near-white to reduce glare)
- **Surface (Card/Table/Header):** `#ffffff` (pure white)
- **Border (Default):** `#e5e5e5` (subtle definition)
- **Border (Hover/Focus-within):** `#d4d4d4`
- **Divider (Thin/Subtle):** `#f0f0f0`

### Typography (Neutrals)
- **Text (Primary):** `#171717` (off-black)
- **Text (Secondary):** `#525252` (mid-gray for metadata/table headers)
- **Text (Disabled/Placeholder):** `#a3a3a3`

### Accent
Choose exactly *one* restrained accent color. The default is a subdued indigo/slate.
- **Accent (Base):** `#4f46e5` (used for primary buttons, active links, focus rings)
- **Accent (Hover):** `#4338ca`
- **Accent (Subtle/Background):** `#e0e7ff` (used for selected rows, active sidebar item backgrounds)
- **Accent (Foreground):** `#ffffff` (text on accent base)

### Semantic Status
Never use the accent color for semantic states. Use these specific hues:
- **Success:** `#10b981` (emerald) — *Background:* `#d1fae5`, *Text:* `#065f46`
- **Warning:** `#f59e0b` (amber) — *Background:* `#fef3c7`, *Text:* `#92400e`
- **Destructive/Error:** `#ef4444` (red) — *Background:* `#fee2e2`, *Text:* `#991b1b`
- **Info:** `#3b82f6` (blue) — *Background:* `#dbeafe`, *Text:* `#1e40af`

## 3. Typography & Spacing

### Typography
- **Font Family:** System sans-serif (`system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`, `sans-serif`).
- **Scale:**
  - `xs` (12px): Badges, table headers, tiny metadata.
  - `sm` (14px): Base body text, table cells, form inputs, sidebar links. **(Default size)**
  - `base` (16px): Section headings, modal titles.
  - `lg` (18px) / `xl` (20px): Page titles, KPI values.
- **Weights:** Use `400` (Regular) for data and body, `500` (Medium) for column headers/buttons, and `600` (Semi-bold) for page headings.

### Spacing & Density
- Base unit: `4px`
- **Layout Padding:** `16px` or `24px` for main content areas and shell.
- **Component Padding:**
  - Buttons/Inputs: `8px` vertical, `12px` horizontal (for 32px height).
  - Table cells: `8px` vertical, `12px` horizontal.
- **Gap:** `8px` between related items, `16px` between layout sections.

## 4. Component Patterns

### Shell & Navigation
- **Top Header:** 48px to 56px height. Contains global search, user profile, multi-tenant switcher, and a subtle bottom border (`1px solid var(--border)`). Background: `#ffffff`.
- **Sidebar (Desktop):** 240px to 260px wide. Right border (`1px solid var(--border)`). Background: `#fcfcfc`.
  - **Active Item:** Uses the subtle accent background (`#e0e7ff`) with primary accent text/icon.
  - **Inactive Item:** Transparent background, secondary text. Hover state: `#f0f0f0`.

### Tables & Lists
- **Structure:** No outer card box if it spans the whole page. Top and bottom borders for the table, internal horizontal dividers (`1px solid #e5e5e5`) for rows.
- **Headers:** `12px` or `14px`, `500` weight, secondary text color. Left-aligned (except numbers/currency).
- **Row Hover:** `#f9fafb`.
- **Row Selected:** Subtle accent background.
- **Actions:** Placed at the far right. Use an ellipsis (`...`) dropdown for >2 actions.
- **Pagination:** Clean numerical links and Prev/Next buttons at the bottom.

### Editors & Forms
- **Inputs:** `32px` or `36px` height. `1px solid #e5e5e5` border. Focus state MUST show a visible outline (`2px solid var(--accent)` or an `outline-offset`).
- **Labels:** Placed above the input. `14px`, `500` weight, primary text.
- **Buttons:**
  - *Primary:* Solid accent background, white text.
  - *Secondary:* White background, `#e5e5e5` border, primary text. Hover: `#f9fafb`.
  - *Ghost:* No border/background. Hover: `#f0f0f0`.

### Status, Empty, Loading, and Error States
- **Badges/Tags:** Small (`12px`, `padding: 2px 6px`), rounded (`4px`). Semantic background/text colors (see Token Definitions).
- **Empty States:** Center-aligned in the content area. Secondary text color. Include an SVG icon (neutral color) and a single Primary call-to-action button. Avoid "cute" illustrations.
- **Loading:** Use skeleton loaders matching the expected text/table shapes. Do NOT use full-page spinners.
- **Error:** Inline error messages below inputs (`12px`, `#ef4444`). Page-level errors should clearly state the cause and offer a recovery action (e.g., "Retry" or "Clear filters").

## 5. Responsive Behavior

- **Mobile (< 768px):** Sidebar collapses into a hamburger menu (Sheet/Drawer). Tables convert to a horizontal scroll with a pinned first column, or transform into a card list view.
- **Tablet (768px - 1024px):** Sidebar collapses to an icon rail.
- **Desktop (> 1024px):** Persistent left sidebar and full table layout.

## 6. Accessibility (A11y)

- **Contrast:** Ensure all text passes WCAG AA (4.5:1). `#525252` on `#ffffff` passes (4.54:1).
- **Focus Rings:** All interactive elements must have a distinct, visible focus ring (`outline: 2px solid var(--accent)`). Never set `outline: none` without a fallback.
- **Semantic HTML:** Use `<nav>`, `<main>`, `<header>`, `<table>`, `<th>`, `<button type="button">`.
- **Keyboard Navigation:** Forms and data tables must be fully traversable via Tab/Shift+Tab and Enter/Space.
