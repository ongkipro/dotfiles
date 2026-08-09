---
name: copywriting
description: >-
  Conversion-focused, SEO-friendly copywriting rules + reusable templates for
  product listings, blog articles, meta/SEO fields, social posts, and landing
  pages. Source of truth for char limits, no-CTA discipline, brand-voice
  defaults, headline patterns, ALT text, and per-platform social templates.
  Triggers: copy rules, headline, meta description, alt text, brand voice,
  product title, listing copy, social caption, blog intro, copywriting rules,
  cara nulis, bikin judul, tulis caption. Pairs with content (workflow),
  volumx-writer (preservation + humanization), and seo-website-builder (SEO QA). NOT a content workflow orchestrator — use
  content for the production pipeline.
---

# Copywriting — Rules + Templates

Single source of truth for copy rules. Always confirm market, language, and
brand policy in the pilot step; defaults below assume **generic-brand / US / EN**
unless the user states otherwise.

## Hard rules (apply to ALL copy)

1. **Brand policy** — generic by default. NEVER put third-party brand names
   (Robotime, Rokr, Apple, etc.) in titles/meta/tags/ALT unless the user opts in.
   Body may use generic praise, no third-party brands.
2. **No CTA** in body or meta unless explicitly a landing page or product
   buy-box. Forbidden words: `buy`, `shop`, `add to cart`, `order now`, `get yours`,
   `limited time`. CTA band belongs only on landing pages or product pages and
   must be user-approved.
3. **No country of origin**, "Brand Name: NONE", or logistics/shipping lines in
   body or meta.
4. **Fix ALL typos** from the source title or draft.
5. **Only verifiable facts** — pull from source data or research; never invent
   piece counts, sizes, materials, prices, dates.
6. **No fluff** — every sentence must carry information or a benefit.

For rewrites, humanization, localization, regulated copy, or any fact-dense
source, also run `volumx-writer` so qualifiers, claims, citations, and conditions
survive the edit. This skill owns house rules and templates; `volumx-writer`
owns preservation and claim integrity.

## Char limits (cross-channel)

| Field | Limit | Notes |
|---|---|---|
| Product title | ≤70 | primary keyword first, Title Case |
| Meta title (SEO) | ≤60 | keyword-focused, **do NOT** append `\| StoreName` |
| Meta description | ≤155 | benefit + primary keyword, no CTA |
| Handle (URL slug) | ≤6 keyword words | lowercase-hyphenated, **must be unique** |
| Image ALT | ≤125 (≤120 recommended) | descriptive, no "image of"/"picture of" filler |
| OG title | ≤95 | for share previews |
| OG description | ≤200 | for share previews |
| Twitter title | ≤70 | for X card |
| Twitter description | ≤200 | for X card |

## Title patterns

### Product (e-commerce)
- `[Primary Keyword] – [Theme/Feature] [Audience]`
- Example: `3D Wooden Landmark Puzzle – Tower Bridge, Big Ben & Eiffel Tower`
- Example: `Adjustable Laptop Stand – Aluminum, Foldable for Travel`

### Blog article (SEO)
- `[Primary Keyword]: [Specific Promise or Hook]`
- Example: `Astro SEO in 2026: A Practical Checklist for Static Sites`
- Example: `Shopify Listing Audit: 7 Things Most Stores Get Wrong`

### Landing hero
- `[Specific Outcome] for [Audience]. [One-line Mechanism].`
- Example: `High-converting Shopify listings for indie brands. Built from your real catalog.`

### Social (channel-dependent — see templates below)

## Meta patterns

### Meta title
`<Primary Keyword> – <Short Value Prop>` (no store suffix)

### Meta description
`<1-line benefit hook>. <Supporting detail>. <Soft CTA-free close>` (≤155 chars)

Example:
> `Build iconic landmarks from real wood — a relaxing no-glue 3D puzzle and a great gift for adults.`

## Body patterns

### Product (e-commerce)
```html
<p><strong>[hook].</strong> [1-2 sentences: what it is + core benefit].</p>
<h3>Why you'll love it</h3>
<ul><li><strong>[benefit]</strong> — [detail].</li> … 3-5 …</ul>
<h3>Specifications</h3>
<table><tr><td>Material</td><td>…</td></tr> … known specs only …</table>
```
End after the specs table.

### Blog article
```
[Hook — 1 sentence with primary keyword]
[Context — why this matters now]
## [H2 — first subtopic]
[Body — 2-4 short paragraphs]
## [H2 — second subtopic]
…
## FAQ (optional)
[3-5 Q&As using real queries]
[End — no CTA band; optional 1-line source/note]
```

### Landing page sections (use sparingly, user-approved)
```
Hero:      [headline] + [sub] + [trust row]
Sections:  [problem → solution → proof → offer]
FAQ:       [3-6 real questions, short answers]
CTA band:  [single primary action — user-approved text only]
```

## ALT text patterns

### Product image
`[Product Title] - [view/angle/feature]` (≤120 chars)

Rotate these view labels for variety:
- `front view`, `alternate angle view`, `lifestyle in-use shot`
- `size reference view`, `feature close-up view`, `packaging view`
- `detail view`, `material close-up view`, `top-down view`
- `side angle view`, `group shot`

Avoid generic suffixes: `main product image`, `product image N`, `image`.

### Blog cover
`[Article topic] - [key visual element]`

### Hero / OG image
`[Brand or page] - [hero concept in 1 line]`

## Social templates (per platform)

### Facebook (long-form, ~80-500 chars optimal)
```
[Hook — 1 sentence that earns the scroll-stop]
[2-3 sentences of context or value]
[Optional: 1 short question to invite comment]
```
No external links in the body (kills reach) — put link in first comment if needed.

### Instagram (caption + hashtags, ~150-300 chars)
```
[Hook line]
[2-3 short lines]
.
.
.
[hashtags: 5-10, niche mix, no banned tags]
```

### Threads (short, conversational, ≤500 chars)
```
[One-line take or question]
[Optional follow-up line]
```

### Pinterest (description, ≤500 chars, keyword-rich)
```
[What it is] for [audience]. [1-2 specific benefits]. [Use-case line].
```

### X / Twitter (≤280 chars)
```
[Take] — [supporting detail in one breath].
```

### TikTok / Reels caption (≤150 chars)
```
[Hook] + [curiosity line]
[2-3 niche hashtags]
```

## Tags / categories (e-commerce)

- **Tags**: 6-9 lowercase; mix category + 1-2 features + audience + gift modifier.
  No brand. Example: `["3d wooden puzzle","model building kit","diy puzzle","architecture model","gift for adults","stem toy"]`
- **Category**: Google product taxonomy ID (resolve via Storefront API or
  Shopify's taxonomy search). One category per product.

## Voice registers (pick one per piece)

| Register | When | Example |
|---|---|---|
| **Warm + benefit-led** | toys, gifts, lifestyle | "A relaxing no-glue build for quiet evenings." |
| **Premium + minimalist** | luxury, design-led | "Aluminum body, machined edges, lifetime guarantee." |
| **Technical + precise** | B2B, dev tools, infra | "Sub-50ms p99 latency across 12 Cloudflare PoPs." |
| **Playful + punchy** | Gen-Z, creator tools | "Make scroll-stopping clips in three taps." |
| **Caring + clear** | health, kids, family | "Soft, BPA-free, and tested for daily use." |

Default for unbranded e-commerce: **warm + benefit-led**. Confirm with the
user if the brand has a documented voice.

## Subagent dispatch pattern (large batches)

For 50+ items:
1. Split into batches of 15-20.
2. Each subagent: read this file verbatim + the batch JSON
   (`{id, title, specs, category, price}`).
3. Each subagent writes a JSON array to a file (`out_N.json`).
4. Each subagent replies only with count + "valid JSON".
5. Main agent merges, validates (limits, brand leak, CTA, unique handles,
   allowed collection), and applies.

## QA gates (run before publish)

- [ ] Char limits respected (every field)
- [ ] No CTA in body/meta (unless landing)
- [ ] No third-party brand in title/meta/tags/ALT (unless user opted in)
- [ ] No invented specs/prices/dates
- [ ] Typos fixed
- [ ] Handle unique (within store)
- [ ] ALT descriptive on every image
- [ ] One H1, logical heading hierarchy
- [ ] Language consistent end-to-end
- [ ] Source citations present where claims are factual

## Pair with

- `content` — production workflow + batching + calendar
- `volumx-writer` — preservation, anti-hallucination, humanization, and scoring
- `seo-website-builder` — SEO QA, schema, sitemap
- `prd-taskbreaker` — break a copy sprint into numbered tasks
