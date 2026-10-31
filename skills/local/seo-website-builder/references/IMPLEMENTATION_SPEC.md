# Implementation Spec: page structure, crawl control, code

Load this when building or auditing the **markup and files** of a site. It is the
developer-facing companion to `PLAYBOOK.md`. Facts are Google's unless labelled;
every limit is checked against the page named in brackets, retrieved 2026-10-31.
Owner conventions are marked **[owner]** and are house rules, not Google rules.

Run the bundled checks before reading prose: `node scripts/seo.test.mjs` proves the
tooling, `node scripts/check-page.mjs <built.html> <expected-canonical>` audits one
built page, and `scripts/{jsonld,sitemap,robots}.mjs` generate and validate the files.

## 1. Head and page elements

| Element | Rule |
| --- | --- |
| `<title>` | Exactly one; unique; descriptive; no keyword stuffing; the first visible `<h1>` should say the same thing; same language and script as the page; brand once at the end after a delimiter. Google sets no length limit and rewrites many titles. **[owner]** 55–70 characters including brand suffix, home may omit the suffix, separator ` - ` or `:` never `\|` or an em dash. [title-link] |
| `meta description` | Unique per page; a summary, not a keyword list; generating it from page data is encouraged; Google uses it only when it describes the page better than the text. **[owner]** 120–155 characters, ends with a full stop, no CTA. [snippet] |
| `<h1>`–`<h6>` | Describe real sections. Google says heading order and count do not affect Search, but one distinct first `<h1>` helps the title link; screen readers need the order. [starter guide, title-link] |
| `rel="canonical"` | Absolute `https` URL, in `<head>`, self-referential, no fragment. One method only (element **or** header). Never set it in a shared layout (see 5). [canonical] |
| `meta robots` | Defaults are `index, follow`; do not write them. `max-image-preview:large` allows large previews. `noindex` must stay crawlable. [robots-meta-tag] |
| Ignored by Google | `meta keywords`, `<html lang>` for language detection, `rel=next/prev`, `nositelinkssearchbox`. Keep `lang` for accessibility. [special-tags] |
| Favicon | `<link rel="icon">` on the **home page**; one per hostname; square, 8 px minimum, above 48 px recommended; stable URL; crawlable by Googlebot-Image. **Formats Google Search supports: BMP, GIF, ICO, PNG, JPEG, PPM, TIFF. SVG and WebP are not listed**, so ship an ICO or PNG; an SVG may be added for browsers. [favicon-in-search, updated 2026-10-27] |
| Images | `<img src alt>`; CSS backgrounds are not indexed; descriptive filename and alt, no stuffing; `<picture>` needs an `<img src>` fallback; `srcset` needs a fallback `src`. Supported: BMP, GIF, JPEG, PNG, WebP, SVG, AVIF. **[owner]** WebP, alt 10–125 characters (page images only). [google-images] |
| Links | `<a href>` only: no `javascript:` href, no `#/route`, no `<span href>`; descriptive anchor text; `rel="sponsored"` for paid, `rel="ugc"` for user content. [links-crawlable] |
| Dates | Visible label ("Published", "Updated") equal to `datePublished`/`dateModified`, with timezone; never a future date. [publication-dates] |

## 2. Open Graph and Twitter

Open Graph [ogp.me]: required `og:title`, `og:type`, `og:image`, `og:url` (the
canonical URL); recommended `og:description`, `og:site_name`, `og:locale`
(`language_TERRITORY`, e.g. `id_ID`), `og:image:alt` (ogp.me: "should" be set whenever
`og:image` is), article tags `article:published_time`, `article:modified_time`,
`article:author`. Image absolute `https` and raster; about 1200×630 is common practice, not part of the OG spec. Google lists
`og:title` as one title-link source and `og:image` as a thumbnail source;
Open Graph is not a ranking factor. `twitter:card=summary_large_image` plus OG is
enough, X falls back to OG for the rest.

## 3. Site name, organisation, breadcrumb, structured data

- **Site name:** `WebSite` JSON-LD on the home page only; required `name`, `url`;
  one name per domain or subdomain, never per subdirectory; `alternateName` lists
  alternatives in order of preference; keep it consistent with the home `<title>`
  and `og:site_name`. The Rich Results Test does not check site names; use the
  Schema Markup Validator. [site-names]
- **Organization:** no required properties; add true ones. `logo` at least 112×112 px,
  crawlable, readable on white. Reuse the site-name `name`. [organization]
- **BreadcrumbList:** at least two `ListItem`, each with `position` from 1, `name`,
  `item` (the last may omit `item`). It must describe a **visible** breadcrumb and a
  typical user path rather than the URL. Desktop feature. [breadcrumb]
- **Article:** no required properties; give `author` as one Person/Organization object
  per author with `url`, `datePublished`/`dateModified` with timezone, `headline`,
  and `image` (16:9, 4:3, 1:1, each at least 50 000 px²). Never merge authors into
  one string. [article]
- **Product snippet:** `name` plus at least one of `review`, `aggregateRating`,
  `offers`; price and availability must equal the visible page. [product-snippet]
- **Review snippet:** a `LocalBusiness`/`Organization` that controls reviews about
  itself is ineligible for stars; fake or undisclosed incentivized reviews are
  prohibited (added 2026-07-24). [review-snippet]
- **General rules:** JSON-LD preferred; do not block structured-data pages; do not
  mark up invisible, irrelevant or misleading content; keep it current; use the most
  specific type; put the same data on duplicates; image URLs crawlable. [sd-policies]
  FAQ rich results are not shown since 2026-05-07; HowTo and the sitelinks search box
  are gone.
- Escape inline JSON-LD (`<` to `\u003c`); `JSON.stringify` alone permits a
  `</script>` breakout. `scripts/jsonld.mjs` does this.

## 4. Crawl and index control

| Goal | Use | Not |
| --- | --- | --- |
| Out of search | `noindex` (meta or `X-Robots-Tag`), page stays **crawlable** | robots.txt: a blocked URL can be indexed without a snippet and its `noindex` is never read |
| Save crawl on parameter URLs | robots.txt `Disallow` | canonical alone |
| Private data | authentication | robots.txt or `noindex` |
| Choose among duplicates | redirect or `rel=canonical` (strong), sitemap (weak) | `noindex`, robots.txt |
| Non-HTML files | `X-Robots-Tag`, `Link: <url>; rel="canonical"` header | meta tags |
| Limit snippets and AI use | `nosnippet`, `max-snippet`, `data-nosnippet`, the Search generative AI control | `Google-Extended` (does not affect Search) |

HTTP: 200 is indexable; 301 and 308 are strong, 302/303/307 weak; 4xx (except 429) are
dropped from the index; 429 and 5xx slow crawling and persistent 5xx drops URLs;
Googlebot follows up to 10 redirects. A 200 page saying "not found" is a soft 404;
in a client-rendered app redirect to a URL that returns a real 404 or add `noindex`
by script. [http-status-codes, javascript-seo-basics]

### robots.txt [robots-txt-spec]

Root of the host, UTF-8, at most 500 KiB. Google reads only `user-agent`, `allow`,
`disallow`, `sitemap`; `crawl-delay`, `noindex` and `host` are ignored. One group per
crawler, the most specific user agent wins, same-agent groups merge, a specific
group is **not** combined with `*`. Per URL the longest matching path wins; a tie goes
to the least restrictive rule; `*` and `$` work; paths are case-sensitive. A
`sitemap:` line may sit anywhere and is absolute. 3xx followed up to five hops then
treated as 404; other 4xx mean no restriction; 5xx pauses crawling 12 hours, then the
last good copy is used for up to 30 days; cache up to 24 hours. Test rules with
`isAllowed()` in `scripts/robots.mjs` before deploying.

```text
User-agent: *
Allow: /
Disallow: /*?*sort=
Disallow: /*?*utm_

Sitemap: https://example.com/sitemap-index.xml
```

Pages meant to stay out of the index take `noindex` and are **not** disallowed here.

### XML sitemap [build-sitemap, large-sitemaps, image-sitemaps]

At most 50 000 URLs or 50 MB uncompressed per file; UTF-8; entity-escaped; absolute
canonical 200 URLs only, no fragments, no `noindex` URLs. Google ignores `priority`
and `changefreq`; `lastmod` counts only if consistently accurate, so use the real
content date and never the build time. An index file holds up to 50 000 sitemaps in
the same directory or deeper. Image extension: up to 1 000 images per URL, CDN hosts
allowed once verified. `hreflang` goes in `xhtml:link` entries that include the page
itself. Discovery: `Sitemap:` in robots.txt, the Search Console Sitemaps report, or its
API. The ping endpoint is retired. IndexNow is for Bing and other participants, not
Google; see `INDEXNOW_PLAYBOOK.md`. `scripts/sitemap.mjs` builds and validates.

### Canonical, pagination, facets, hreflang, JavaScript

- Redirects and `rel=canonical` are strong signals, a sitemap is weak; never name
  different canonicals by different methods; prefer HTTPS; use the same URL in
  canonical, `og:url` and sitemap. [canonical]
- Each paginated page has its own canonical and a unique URL (`?page=n`, not `#`);
  link them with `<a href>`; do not point page 2 at page 1. [pagination]
- Facets: block crawling in robots.txt, or canonical to the unfiltered list; return 404
  for empty filter combinations; use `&` to separate parameters. [faceted-navigation]
- `hreflang`: HTML, header or sitemap (pick one); each version lists itself and all
  others with absolute URLs; ISO 639-1 plus optional ISO 3166-1 alpha-2 (`es-419`,
  `UK` are invalid); `x-default` for fallback. Google does not use it, or `lang`, to
  detect the page language. [localized-versions]
- JavaScript: Google renders 200 pages but rendering is not guaranteed; put title,
  description, canonical, robots, JSON-LD and links in the initial HTML; set the
  canonical in HTML and never change it by script (or leave it out of HTML and set it
  only by script); use the History API, not fragments; lazy-load without needing a
  scroll or click; infinite scroll needs paginated URLs. [javascript-seo-basics,
  lazy-loading]

## 5. Framework traps found by building (Astro 7.4.4, Next.js 16.4.3)

| Stack | Trap | Rule |
| --- | --- | --- |
| Next.js | `alternates.canonical` in a **layout** is inherited by every child page | Never set a canonical in a layout; set it per page |
| Next.js | Metadata merges **shallowly**: a page that sets `openGraph` replaces the layout's whole `openGraph` | Build the full object through one factory (`pageMetadata()`) |
| Next.js | `title.template` in a layout does not apply to a title in the **same** segment's `page.tsx` | Build the final title yourself with `title: { absolute }` |
| Next.js | `metadata` and `generateMetadata` cannot both be exported from one segment | Pick one per segment |
| Next.js | `sitemap.ts`/`robots.ts` under `output: 'export'` need `export const dynamic = 'force-static'` | Static export only |
| Astro | With `build.format: 'file'`, `Astro.url.pathname` ends in `.html` or `/index.html`, so a naive canonical is wrong | Normalise the path; keep the root URL identical to the sitemap `<loc>` |
| Astro | The sitemap integration includes every static page, including `noindex` ones; SSR routes are never included | Use `filter` fed from the same list that marks pages `noindex`; add SSR URLs with `customPages` |
| Astro | `site` is required for the sitemap and for `Astro.site` | Set it in `astro.config` |
| Both | A `noindex` URL that is also `Disallow`ed hides its own `noindex` | `noindex` pages are crawlable, outside the sitemap, outside robots `Disallow` |
| Shopify | `robots.txt.liquid` replaces the generated file | Start from `robots.default_groups`; diff before publishing; `{{ product \| structured_data }}` emits `Product` or `ProductGroup` |

## 6. Per-page checklist (what `check-page.mjs` automates)

HTTP 200; one absolute canonical equal to `og:url` and the sitemap `<loc>`; one title and
one description; one clear `<h1>`; OG required set plus `og:image:alt`; `twitter:card`;
JSON-LD parses and matches visible content; visible breadcrumb equals the markup; every
content image has `alt`; every link is `<a href>`; `noindex` pages are crawlable, outside
the sitemap, outside robots `Disallow`. Length and format checks encode **[owner]** rules,
report as WARN, and are skipped for `noindex` pages. The checker is regex-level: finish
with Google's Rich Results Test and URL Inspection.

## 7. Sources (all fetched 2026-10-31)

developers.google.com/search/docs: appearance/{title-link, snippet, site-names,
favicon-in-search, publication-dates, google-images, structured-data/{organization,
article, product-snippet, breadcrumb, review-snippet, sd-policies}},
crawling-indexing/{sitemaps/{build-sitemap, large-sitemaps, image-sitemaps},
consolidate-duplicate-urls, special-tags, robots-meta-tag, links-crawlable,
javascript/{javascript-seo-basics, lazy-loading}}, specialty/international/localized-versions,
specialty/ecommerce/pagination-and-incremental-page-loading, fundamentals/seo-starter-guide;
developers.google.com/crawling/docs: robots-txt/robots-txt-spec,
troubleshooting/http-status-codes, faceted-navigation; ogp.me; nextjs.org/docs/app
(generateMetadata, sitemap, robots, json-ld); docs.astro.build @astrojs/sitemap;
shopify.dev robots-txt and structured_data. Full audit with the build evidence:
`~/Documents/work/research/seo-audit-2026-10/SEO-AUDIT-REPORT.md`.
