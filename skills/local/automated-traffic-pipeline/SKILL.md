---
name: automated-traffic-pipeline
description: >-
  Owns the automated traffic generation, indexing, and syndication pipeline:
  pSEO generation, auto-indexing, RSS/visual flywheels. Not pSEO template,
  indexation, or canonical strategy (`seo-website-builder`) or AEO/GEO
  (`ai-traffic-os`). Includes content freshness crons and closed-loop revenue
  attribution. Use when architecting, building, or auditing websites designed
  to generate recurring organic, AI search, and referral traffic automatically
  at scale. Triggers: "automated traffic", "traffic engine", "programmatic
  seo", "pseo", "auto indexing pipeline", "traffic flywheel", "content
  automation", "automated traffic pipeline".
---

# Automated Traffic Pipeline Engine

An architecture for building self-sustaining, scalable, and automated traffic systems that continuously generate organic search, AI search recommendation, visual discovery, and referral traffic.

---

## 5 Pillars of Automated Traffic Systems

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    5 PILLARS OF AUTOMATED TRAFFIC SYSTEMS                       │
├──────────────────────────┬──────────────────────────────────────────────────────┤
│ 1. Programmatic SEO      │ Data-driven page generation (500–10,000+ pages)     │
│    (pSEO Engine)         │ with high Information Gain & unique data points.      │
├──────────────────────────┼──────────────────────────────────────────────────────┤
│ 2. Automated Indexing    │ IndexNow push + accurate sitemaps (Search Console    │
│    (Push Pipeline)       │ sitemap submit for Google) on publish/update events. │
├──────────────────────────┼──────────────────────────────────────────────────────┤
│ 3. Freshness Engine      │ Cron-based scheduled updates for <lastmod>, data     │
│    (Content Maintenance) │ points, and pricing on an evidence-based cadence.     │
├──────────────────────────┼──────────────────────────────────────────────────────┤
│ 4. Multi-Channel         │ Automated RSS syndication & Pinterest 2:3 Pin asset  │
│    Distribution Flywheel │ generation for cross-channel visual discovery.       │
├──────────────────────────┼──────────────────────────────────────────────────────┤
│ 5. Closed-Loop Revenue   │ Real-time Meta CAPI + Google Ads Consent Mode      │
│    Attribution           │ v2 + Dual-Path AI Referral tracking integration.     │
└──────────────────────────┴──────────────────────────────────────────────────────┘
```

---

## Reference Manifest

| Task | Read |
| --- | --- |
| Programmatic SEO (pSEO) data modeling, Astro/Next.js dynamic routes, and anti-thin-content rules | [Programmatic SEO Engine](references/PSEO_ENGINE.md) |
| Automated Indexing Pipeline (IndexNow API + Google Search Console Webhook) | [Auto Indexing Pipeline](references/AUTO_INDEXING_PIPELINE.md) |
| Cron-based content freshness maintenance & scheduled sitemap/llms.txt regeneration | [Freshness & Maintenance Engine](references/FRESHNESS_ENGINE.md) |
| Automated Pin asset generation & RSS syndication flywheel | [Multi-Channel Distribution](references/MULTI_CHANNEL_DISTRIBUTION.md) |

---

## Core Operational Rules

1. **Information Gain Rule**: Every programmatically generated page MUST contain unique data points, custom comparisons, calculations, or localized facts. NEVER generate copy-paste templated pages with only city/keyword replacement. Google's spam policies name both **scaled content abuse** ("many pages are generated for the primary purpose of manipulating search rankings and not helping users", explicitly including generative AI) and **doorway abuse**.
2. **Instant Push on Publish**: Whenever a new page is generated, materially updated, or removed, trigger the IndexNow call (`api.indexnow.org`) and regenerate the sitemap. Google is not an IndexNow participant and its Indexing API is limited to `JobPosting`/`BroadcastEvent`. Regenerating `llms.txt` is optional; Google says no AI text files are needed for its AI features.
3. **Configurable Freshness Review**: Review material facts on a cadence chosen for their volatility. A 90-day interval is a local starting heuristic, not a search-engine rule; make it configurable, and update `<lastmod>` or push indexing notifications only after meaningful content changes.
4. **Visual & Social Auto-Syndication**: Auto-generate a 2:3 vertical Pin graphic (1000 × 1500 px) for every new high-value page and publish to Pinterest boards.
5. **Durable Attribution Context**: Store `gclid`, `gbraid`, `wbraid`, `_fbp`, `_fbc`, and `utm_source` across the entire funnel so automated traffic converts into verifiable revenue.

## Sources (accessed 2026-10-02)

- Google spam policies (scaled content abuse, doorway abuse): https://developers.google.com/search/docs/essentials/spam-policies
- IndexNow participants: https://www.indexnow.org/searchengines.json; protocol limits and response codes: https://www.indexnow.org/documentation
- Google AI features (no AI text files or special schema needed): https://developers.google.com/search/docs/appearance/ai-features
- Google crawl budget guide scope (1M+ pages weekly change, or 10k+ pages daily change): https://developers.google.com/crawling/docs/crawl-budget
- Syndication vs `rel=canonical`: https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting
