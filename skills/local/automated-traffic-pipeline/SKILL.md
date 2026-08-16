---
name: automated-traffic-pipeline
description: >-
  End-to-end Automated Traffic Generation Engine Architecture (Programmatic SEO / pSEO, Auto Indexing Pipelines,
  Content Freshness Crons, Visual Asset & RSS Syndication Flywheels, and Closed-Loop Revenue Attribution).
  Use when architecting, building, or auditing websites designed to generate recurring organic, AI search,
  and referral traffic automatically at scale.
  This skill owns the generation, indexing, and syndication pipeline; use seo-website-builder for the
  template, indexation, and canonical strategy of the pSEO page set itself, and ai-traffic-os for AEO/GEO.
  Triggers: "automated traffic", "traffic engine", "programmatic seo", "pseo", "auto indexing pipeline",
  "traffic flywheel", "content automation", "automated traffic pipeline".
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
│ 2. Automated Indexing    │ Instant URL push via IndexNow API + Sitemaps +       │
│    (Push Pipeline)       │ Google Search Console API on publish/update events.  │
├──────────────────────────┼──────────────────────────────────────────────────────┤
│ 3. Freshness Engine      │ Cron-based scheduled updates for <lastmod>, data     │
│    (Content Maintenance) │ points, and pricing to satisfy 90-day freshness rules│
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

1. **Information Gain Rule**: Every programmatically generated page MUST contain unique data points, custom comparisons, calculations, or localized facts. NEVER generate copy-paste templated pages with only city/keyword replacement (doorway page penalty).
2. **Instant Push on Publish**: Whenever a new page is generated or updated, automatically trigger the IndexNow API call (`api.indexnow.org`) and update `sitemap-index.xml` and `llms.txt`.
3. **90-Day Freshness Rule**: Search engines and AI recommendation engines prioritize content updated within the last 90 days. Implement automated scheduled updates for statistics and timestamps.
4. **Visual & Social Auto-Syndication**: Auto-generate a 2:3 vertical Pin graphic (1000 × 1500 px) for every new high-value page and publish to Pinterest boards.
5. **Durable Attribution Context**: Store `gclid`, `gbraid`, `wbraid`, `_fbp`, `_fbc`, and `utm_source` across the entire funnel so automated traffic converts into verifiable revenue.
