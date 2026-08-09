# Pinterest Visual Search & SEO Playbook

Pinterest is not a social network; it is a **visual search & discovery engine**. Users search with high buyer intent (*inspiration → discovery → purchase*).

---

## 1. Core Ranking & Discovery Factors

1. **Domain Quality & Claimed Website**: Claiming your domain (`https://example.com`) verifies site ownership and grants Rich Pin eligibility.
2. **Pin Quality & Engagement**: Save rate, click-through rate (Outbound Clicks), and zoom/expansion rate.
3. **Pin Relevance**: Semantic match between Pin Title, Pin Description, Image Alt Text, Board Title/Description, and Image OCR text.
4. **Landing Page Consistency**: Pinterest checks if the destination URL contextually matches the Pin's promise (low bounce rate).

---

## 2. Creative Specifications (Visual SEO)

- **Aspect Ratio**: Always **2:3 vertical** (Recommended resolution: **1000 × 1500 px**). Square (1:1) or horizontal (16:9) images suffer severe distribution penalties.
- **Overlay Text**: Include bold, high-contrast, keyword-rich text overlays on the upper/middle 60% of the image (read by Pinterest OCR).
- **Brand Identity**: Place a subtle logo or domain URL (`example.com`) at the top or bottom margin (never cover the center).
- **High-Quality Product Shots**: Use lifestyle or product-in-use photography rather than flat white-background catalog shots.

---

## 3. Metadata & Rich Pins Setup

Rich Pins automatically pull metadata from your site's OpenGraph & Schema.org markup.

### A. Product Rich Pins (Ecommerce)
Requires Schema.org `Product` markup on the landing page:
```html
<meta property="og:type" content="og:product" />
<meta property="og:title" content="Product Name" />
<meta property="og:description" content="Product description..." />
<meta property="og:price:amount" content="299000" />
<meta property="og:price:currency" content="IDR" />
```

### B. Article Rich Pins (Blogs / Guides)
Requires Schema.org `Article` markup:
```html
<meta property="og:type" content="article" />
<meta property="og:title" content="Guide Title" />
<meta property="og:description" content="Article summary..." />
<meta property="article:author" content="Author Name" />
```

---

## 4. On-Page & Board SEO Taxonomy

- **Board Titles**: Use exact target search terms (e.g., *"Oil Palm Management"* or *"Office Productivity Tools"*), NOT artistic/vague names (e.g., *"My Favorite Stuff"*).
- **Board Descriptions**: 2–3 sentences containing long-tail LSI keywords.
- **Pin Title**: 100 characters max (front-load primary keyword).
- **Pin Description**: 500 characters max. Include 2–3 natural sentences with primary & secondary keywords, ending with a clear CTA (*"Read the full guide on..."*).
- **Hashtags**: Use 2–5 highly specific hashtags at the end of the description.

---

## 5. Technical Validation Checklist

- [ ] Domain is claimed in Pinterest Business Settings (`<meta name="p:domain_verify" content="..." />`).
- [ ] Rich Pins Validator passes (validated via `https://developers.pinterest.com/tools/url-newsletter/`).
- [ ] OpenGraph tags (`og:title`, `og:image`, `og:description`) exist on all indexable landing pages.
- [ ] Destination landing page loads in < 2.5 seconds (LCP) and is 100% mobile-responsive.
- [ ] Pinterest Tag (`pintrk`) or Conversions API is installed for tracking conversions & outbound clicks.
