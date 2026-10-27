# Compact Skill References

Purpose: compact default reference for the `seo-website-builder` skill. This file keeps the skill lightweight so agents do not need to load large reference sets for every task.

Last updated: 2026-10-26 (workflow and Google corrections; other engine snapshots retain their own evidence dates).

## Selective loading

Start with SKILL.md and repository context. This overview is optional for a
bounded repair; load only the relevant stack/topic section when needed.
PLAYBOOK.md is for substantial audits/builds, not a second mandatory pre-read.
REFERENCE_MANIFEST.md points only to resources bundled with this skill.

## Core Operating Principle

SEO is a system, not a checklist.

Every indexable page must earn its place by supporting at least one of:

- search demand
- business conversion
- topical authority
- crawl path/discovery
- trust/entity proof
- user support/objection handling

If a page has no unique value, do not index it.

## Substantial audit output

Select applicable sections; a focused repair returns its finding/change,
executed check, and remaining unknowns instead of this full audit structure:

```txt
Critical Assessment
Evidence / Source Confidence
Missing Inputs / Assumptions
Search Intent Map
Page Type Map
URL Structure
Index + Canonical Rules
Metadata Pattern
Schema Plan
Internal Linking Plan
Content Requirements
Multi-Engine Notes
Technical Implementation
QA / Validation Checklist
Measurement Plan
Risk Notes
```

## Mode Routing

| Intent | Relevant bundled reference |
| --- | --- |
| New website or substantial audit | `PLAYBOOK.md` |
| Astro/static | `ASTRO_SEO_PLAYBOOK.md` |
| Next.js | `NEXTJS_SEO_PLAYBOOK.md` |
| Shopify/ecommerce | `SHOPIFY_SEO_PLAYBOOK.md` |
| Local business | `LOCAL_BUSINESS_SEO_PLAYBOOK.md` |
| Algorithm update | `SEARCH_ENGINE_ALGORITHM_BRIEF.md`, then current sources as needed |
| Complete page audit | `PAGE_COMPLETENESS_FORMULA.md` |
| Schema | relevant stack guide and current feature-specific official documentation |

## Hard Rules

- Prefer official sources for hard claims.
- Do not claim secret algorithm knowledge.
- Do not invent facts, reviews, credentials, prices, coordinates, hours, or product specs.
- Do not add schema for invisible content.
- Do not index thin/search/filter/location pages without unique value.
- Do not fake `lastmod` freshness.
- Do not create doorway pages.
- Do not batch-edit Shopify listings without pilot approval.
- Keep important content in crawlable HTML.
- Internal links must use real crawlable `<a href>` links.

## Multi-Engine Baseline

| Engine / Surface | Must handle |
| --- | --- |
| Google | helpful content, indexing, snippets, canonical, structured data, page experience, AI feature eligibility |
| Bing | XML sitemap, true `lastmod`, IndexNow, Bing Webmaster Tools |
| Yandex | quality, security, mobile convenience, site region, Yandex Webmaster/Metrica |
| Pinterest | claimed site, high-quality vertical visuals, Pin title/description, trends, landing-page match |
| AI Search | indexed/snippet-eligible pages, passage clarity, entity clarity, trust, freshness |

## Page Completeness Formula

For every important indexable page, verify:

- clear page purpose and search intent
- unique title, 55–70 characters including spaces and " - Brand" (owner default); fail outside the range
- meta description, 120–155 characters including spaces (owner default); fail outside the range
- absolute canonical URL
- correct robots directive (`index, follow, max-image-preview:large` for normal indexable pages)
- OG/Twitter metadata for shareable pages
- absolute OG/Twitter image URL
- one clear H1 matching intent
- logical H2/H3 structure
- meaningful ALT on important images
- LCP/hero image not lazy-loaded
- crawlable internal links
- eligible JSON-LD schema matching visible content
- page included in sitemap only if canonical-indexable
- CTA/conversion measurement when the task includes launch/outcome planning;
  missing analytics does not block a scoped markup repair

Use `PAGE_COMPLETENESS_FORMULA.md` for detailed audit rules and examples.

## Technical SEO Minimum

- `robots.txt` exists and does not block critical assets.
- `sitemap.xml` contains only canonical-indexable URLs.
- canonical URLs are absolute and correct.
- index/noindex rules are deliberate.
- 404 returns 404.
- permanent redirects use appropriate server-side 301 or 308 responses.
- key pages return 200.
- title/meta are unique on indexable pages.
- schema validates and matches visible content.
- mobile UX and CTA are usable.
- Core Web Vitals (field data, 75th percentile, mobile and desktop separately): LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. INP replaced FID as a Core Web Vital in 2024; never audit or report FID ([web.dev/articles/vitals](https://web.dev/articles/vitals), accessed 2026-10-02). Diagnosis goes to `web-perf`.

## Metadata Rules

- Title: unique, intent-aligned, not spammy; 55–70 chars incl. " - Brand" (owner default).
- Meta description: unique, benefit/trust/intent focused; 120–155 chars (owner default).
- H1: one primary H1 matching page intent.
- OG/Twitter tags: present for shareable pages.
- OG/Twitter image URLs: absolute, crawlable, share-friendly.
- Canonical: self-referential unless duplicate/consolidation is intentional.
- Meta keywords: not used by Google ranking; optional only as internal targeting notes.

## Schema Rules

Use schema only when eligible:

- Organization / LocalBusiness
- WebSite
- BreadcrumbList
- Product / Offer
- Article / BlogPosting
- FAQPage only if FAQ visible — Google no longer shows the FAQ rich result; keep or add the markup only for other consumers, never promise a Google SERP feature from it
- AggregateRating / Review only if real visible reviews exist
- Service for service pages

Reject schema spam.

Google feature status must be checked against its current guide and official
update history, not inferred solely from a missing search-gallery row. Google
reviewed 2026-10-26:

- FAQ rich results are retired; the former FAQPage guide redirects to the
  [documentation update log](https://developers.google.com/search/updates).
- HowTo rich result; Sitelinks search box (retired 2024, so `WebSite` + `SearchAction` earns nothing in Google)
- Course Info, Claim Review, Estimated Salary, Learning Video, Special
  Announcement, Vehicle Listing, and later practice problems were retired;
  verify the current feature before planning implementation.
- **Book Actions is not blanket-retired:** its current
  [feature guide](https://developers.google.com/search/docs/appearance/structured-data/book)
  describes restricted provider participation. Do not promise universal eligibility.
- The gallery is useful discovery, not sufficient proof of every feature's
  availability. Eligibility and valid markup do not guarantee a rich result.

## Internal Linking Rules

- Homepage links to primary money/category/service pages.
- Category links to products/subcategories/guides.
- Product links to category, related products, FAQ/trust.
- Blog links to money pages and related content.
- Breadcrumbs reinforce hierarchy.
- Footer links trust/contact/legal pages.

## Stack Rules

### Astro/static

- Static-first for public SEO pages.
- Main content in initial HTML.
- Hydrate smallest possible island only.
- LCP image not lazy-loaded.
- Content collections validate frontmatter.
- Sitemap/robots generated correctly.

### Next.js

- Use App Router Metadata API or Pages Router `next/head` correctly.
- Public SEO routes should render meaningful HTML.
- Prefer SSG/ISR for stable public pages; SSR only when request-time data is needed.
- Do not hide primary content behind client-only fetch.
- Use `app/sitemap.ts` and `app/robots.ts` where applicable.
- JSON-LD must be available in rendered HTML and match visible content.
- `next/image` LCP/hero images should not be lazy-loaded.
- Internal navigation should use crawlable links / `next/link`.

### Shopify

- Pilot one product before batch.
- Product title ≤70 chars.
- SEO title 55–70 chars (owner default; see SKILL.md).
- Meta description 120–155 chars.
- Image ALT ≤125 chars.
- Keep SKUs unchanged for kept variants.
- Remove supplier/origin junk.
- Product/Offer/feed data accurate.

### Local business

- NAP consistent.
- GBP aligned.
- LocalBusiness/Service schema valid.
- Phone links use international format.
- Avoid copy-paste location pages.
- Map/route/CTA work on mobile.

## Algorithm Update Workflow

1. Confirm update from official/trusted source.
2. Record in `ALGORITHM_UPDATE_LOG.md`.
3. Identify affected surface.
4. Segment traffic/pages by type and intent.
5. Check technical/indexing before rewriting content.
6. Compare competitors/SERP changes.
7. Update playbooks only when action is justified.

For a suspected Google core update, confirm rollout completion and wait the
documented full week before comparing appropriate pre/post periods. Check
property/path/search type, seasonality, technical changes, and data gaps first;
small fluctuations do not justify broad rewriting.

## Promotion Rule

Before changing this active skill's contract, run the applicable scenarios and use the conversion/regression gate in `TEST_CASES.md`. That file is the sole gate; no separate promotion checklist exists.
