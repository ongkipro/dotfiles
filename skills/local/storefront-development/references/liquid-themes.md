# Shopify Online Store 2.0 (Theme 2.0) Liquid Engineering Reference

Last verified against `shopify.dev/docs/storefronts/themes`, `shopify.dev/docs/storefronts/themes/best-practices/performance`, and `Shopify/Shopify-AI-Toolkit` (`v1.17.1` `shopify-liquid`) on `2026-10-14`.

Use this reference when building, refactoring, or auditing **Shopify Online Store 2.0 Liquid themes** (`layout/`, `templates/*.json`, `sections/*.liquid`, `blocks/*.liquid`, `snippets/*.liquid`, `config/`, `locales/`) or **Theme App Extensions** (`extensions/<handle>/blocks/*.liquid`).

---

## 1. Online Store 2.0 Architecture: Sections, Theme Blocks & JSON Templates

### Directory & Ownership Contract

| Directory | Purpose & Rules |
| --- | --- |
| `layout/theme.liquid` | Global HTML shell. Place `<meta>`, `<title>`, critical CSS, font preloads, and `<script type="importmap">` **before** `{{ content_for_header }}` so Shopify flushes the early `<head>` stream immediately. |
| `templates/*.json` & `sections/*.json` | Declarative JSON trees assembling sections and blocks (`header-group.json`, `footer-group.json`, `product.json`, `collection.json`, `index.json`). Never put business logic in JSON templates. |
| `sections/*.liquid` | Self-contained page sections with `{% schema %}`. Support `"blocks": [{ "type": "@theme" }, { "type": "@app" }]` so merchants can compose both theme blocks and app blocks anywhere. |
| `blocks/*.liquid` | Reusable, nestable **Theme Blocks** (`_internal.liquid` prefix for section-private blocks). Rendered dynamically via `{% content_for 'blocks' %}` or statically via `{% content_for 'block', type: 'button', id: 'hero-cta' %}`. Always include `{{ block.shopify_attributes }}` on the root HTML element for the Theme Editor. |
| `snippets/*.liquid` | Pure presentation helpers invoked with `{% render 'name', param: value %}` (never deprecated `{% include %}`). Isolated variable scope—cannot read parent section variables unless explicitly passed. |

### `{% doc %}` LiquidDoc Header Contract (Required on Snippets & Static Blocks)

Document every snippet (`snippets/*.liquid`) and static theme block (`blocks/*.liquid`) with a `{% doc %}` header at the top of the file so Theme Check and `Shopify-AI-Toolkit` validate callers:

```liquid
{% doc %}
  Renders a product media card with responsive srcset and LCP priority control.

  @param {product} product_resource - The Shopify product object to display.
  @param {boolean} [is_lcp] - Set true on the first visible card to enable eager loading and high fetchpriority.
  @param {string} [sizes] - Responsive sizes attribute (defaults to '(min-width: 990px) 25vw, 50vw').

  @example
  {% render 'product-card', product_resource: product, is_lcp: true %}
{% enddoc %}
```

### `{% stylesheet %}` & `{% javascript %}` Subsetting Rules

- Shopify automatically bundles, deduplicates, and **subsets** `{% stylesheet %}` and `{% javascript %}` tags inside sections and blocks **per render tree**—only CSS/JS for sections and blocks actually rendered on the current page is shipped to the browser.
- **No Liquid inside `{% stylesheet %}` or `{% javascript %}`**: Liquid tags inside these blocks are not evaluated. Pass merchant settings via inline CSS custom properties on the section/block wrapper and read them in CSS:
  ```liquid
  <div
    class="hero-block"
    style="--hero-gap: {{ block.settings.gap }}px; --hero-bg: {{ block.settings.bg_color }};"
    {{ block.shopify_attributes }}
  >
    {% content_for 'blocks' %}
  </div>

  {% stylesheet %}
    .hero-block {
      display: grid;
      gap: var(--hero-gap, 16px);
      background-color: var(--hero-bg);
    }
  {% endstylesheet %}
  ```

---

## 2. Critical Liquid Syntax & Runtime Gotchas (`Shopify-AI-Toolkit`)

1. **No parentheses `()` in `if` / `unless` conditions & right-to-left evaluation**:
   - Liquid does **not** support parentheses in boolean expressions, and `and` / `or` evaluate **right-to-left**!
   - Always extract compound conditions into named `{% assign %}` booleans first:
     ```liquid
     {% liquid
       assign is_on_sale = false
       if product.compare_at_price > product.price and product.available
         assign is_on_sale = true
       endif
     %}
     ```
2. **No ternary operator**: Use `{% if %}` / `{% else %}` or `{{ value | default: fallback }}`.
3. **`contains` only matches strings or arrays of strings**:
   - `{% if product.variants contains variant %}` fails silently. Map to a scalar array first (`{% assign skus = product.variants | map: 'sku' %}{% if skus contains target_sku %}`) or filter objects with `| where: 'available', true`.
4. **50-item `for` loop hard cap & DB hydration cost**:
   - Iterating `collection.products` without `{% paginate %}` silently stops at 50 items.
   - Always pass `limit:` when rendering a small subset (`{% for product in collection.products limit: 4 %}`) so Shopify does not load all 50 products from the database.
5. **Never use deprecated `img_url` or `include`**:
   - Always use `image_url` + `image_tag` and `{% render %}`:
     ```liquid
     {{
       product.featured_media
       | image_url: width: 1500
       | image_tag:
         widths: '375, 550, 750, 1100, 1500',
         sizes: '(min-width: 990px) 50vw, 100vw',
         loading: loading_strategy,
         fetchpriority: fetch_priority,
         alt: product.featured_media.alt | escape
     }}
     ```
6. **Modern Color Filters**: Prefer `color_to_oklch` and `color_contrast` over legacy hex math when generating accessible theme tokens.

---

## 3. The 7 Essential Shopify Theme Performance Practices

Enforce all 7 official `shopify.dev` performance rules on every Liquid template and section:

1. **Never lazy-load above-the-fold images**:
   - In `sections/*.liquid`, use `section.index`: if `section.index == 1` (or `section.index <= 2` and `forloop.index <= 2` in product grids), set `loading: 'eager'`. Lazy-loading the LCP image directly degrades Largest Contentful Paint.
2. **Set `fetchpriority="high"` on the single LCP image**:
   - Apply `fetchpriority: 'high'` + `loading: 'eager'` to the hero banner on `index`, the primary selected variant media on `product`, and the first card on `collection`.
3. **Never apply fade-in or `opacity: 0` animations to the LCP image**:
   - CSS/JS fade-in transitions delay the browser's LCP timestamp until `opacity` reaches `1`. Keep the LCP image immediately visible at `opacity: 1`.
4. **Render essential content in HTML/Liquid, never client-side JS**:
   - Product titles, prices, variant links (`?variant=`), availability states, and primary media must be present in the initial server-rendered Liquid HTML before JavaScript loads.
5. **Avoid $O(n^2)$ nested Liquid loops and metafield N+1 reads in grids**:
   - Never nest `{% for variant in product.variants %}` inside a 24-product collection loop with inner option/metafield lookups. Use `product.selected_or_first_available_variant`, `product.options_with_values`, and `| where:` / `| map:` filters.
6. **Streamed `<head>` ordering before `{{ content_for_header }}`**:
   - In `layout/theme.liquid`, place `<meta charset>`, `<meta name="viewport">`, `<title>`, critical CSS (`stylesheet_tag: preload: true`), critical font preloads, and `<script type="importmap">` **above** `{{ content_for_header }}`. Shopify flushes everything before `{{ content_for_header }}` immediately while computing dynamic header scripts.
7. **Use `preload` sparingly**:
   - Only preload the base stylesheet and 1–2 primary above-the-fold font files (`{{ settings.type_body_font | font_url | preload_tag: as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }}`). Excessive preloads compete with the LCP image bandwidth.

---

## 4. Section Rendering API & Dawn-Style Progressive Enhancement

- **Section Rendering API (`?sections=cart-drawer,cart-icon-bubble` or `?section_id=...`)**:
  - When a buyer switches variants on a PDP or mutates `/cart/add.js` / `/cart/change.js`, request only the affected section HTML from Shopify's Section Rendering API and morph/replace the target DOM subtree (`<cart-drawer>`, `<product-info>`) rather than duplicating price/discount templates in client JS.
- **Theme App Extensions (`extensions/<handle>/blocks/*.liquid`)**:
  - App blocks and app embeds cannot use `{% content_for 'blocks' %}` or theme-only `blocks/` files. Validate them in app context (`--context app`) with complete `locales/en.default.json` and `locales/en.default.schema.json` keys.
