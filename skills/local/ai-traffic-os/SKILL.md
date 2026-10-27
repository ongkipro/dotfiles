---
name: ai-traffic-os
description: >-
  AEO/GEO owner: AI traffic architecture for search and answer engines — crawl
  controls, answer content, structured media, AI referral measurement. Not
  classic technical SEO (`seo-website-builder`) or the pSEO pipeline
  (`automated-traffic-pipeline`). Use when designing or auditing these; answer
  content must be genuinely helpful. Requires live vendor-documentation checks
  for crawler identities and keeps search/citation, user-triggered retrieval,
  and model-training controls distinct. Triggers: "ai traffic", "geo
  optimization", "answerbox", "google ai overviews", "chatgpt search",
  "perplexity seo", "ai search optimization", "traffic architecture", "ai
  traffic os".
---

# AI Traffic OS

Design discoverable, source-backed web content without inventing a special ranking formula for generative answers. Google states that AI Overviews and AI Mode use the same foundational SEO requirements as Google Search and have no additional technical requirements. Other vendors publish their own bot controls and may change them independently.

## Evidence policy

Before recommending crawler rules, participation settings, reporting features,
or vendor-specific markup:

1. Retrieve the vendor's current official crawler documentation.
2. Record the retrieval date and the exact user-agent token.
3. Separate documented behavior from local editorial or analytics heuristics.
4. Never promise citation, ranking, traffic lift, or attribution recovery. Vendor eligibility is not a guarantee of selection.
5. Treat `llms.txt`, custom `data-*` attributes, passage length, and answer-box styling as optional publishing conventions unless a target vendor's current official documentation says otherwise.

Primary starting points:

- [Google: generative-AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google: generative-AI performance reports](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)
- [Google: content-sharing controls](https://developers.google.com/search/docs/crawling-indexing/control-what-you-share)
- [Google common crawlers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers)
- [OpenAI crawlers](https://developers.openai.com/api/docs/bots)
- [Anthropic crawler controls](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Perplexity crawlers](https://docs.perplexity.ai/guides/bots)
- [Applebot](https://support.apple.com/en-us/119829)
- [Google user-triggered fetchers](https://developers.google.com/search/docs/crawling-indexing/google-user-triggered-fetchers)
- [OpenAI publishers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)

## Four-layer architecture

1. **Discovery**
   - Crawlability, canonical URLs, sitemaps, internal links, CDN/WAF behavior, and purpose-specific robots controls.
   - See [Crawler Purpose Matrix](references/CRAWLER_MATRIX_2026.md).
2. **Knowledge**
   - Clear information architecture, descriptive headings, self-contained explanations, and source links.
   - See [AnswerBox Editorial Pattern](references/ANSWER_BOX_GEO.md).
3. **Authority**
   - First-party evidence, named authorship where relevant, visible publication/update context, and structured data that matches visible content.
   - See [Multi-Modal and Authority Schemas](references/SCHEMA_MULTI_MODAL.md).
4. **Conversion and measurement**
   - Useful post-click paths plus conservative first-party analytics. Preserve observed referrers and campaign parameters without inferring a source that was not observed.
   - See [AI Referral Tracking](references/AI_REFERRAL_TRACKING.md).

## Operating sequence

```text
1. Audit crawlability, indexing eligibility, and preview controls
2. Retrieve current crawler identities and classify each by documented purpose
3. Apply the site's copyright, privacy, and business policy per purpose
4. Improve visible, people-first content and internal discovery
5. Add only structured data supported by the page's actual content
6. Validate structured data and crawler access with vendor-supported tools
7. Measure observed visits and conversions; label unknown attribution as unknown
```

## Google-specific boundary

Google review: **2026-10-26**. Keep Googlebot Search crawling, Google-Extended
controls for certain Gemini/Vertex uses, snippet controls, and Search Console's
property-scoped generative-AI participation setting (with parent/child inheritance
and URL-prefix overrides) distinct. Do not block Googlebot
while claiming crawl eligibility. Check the current
[participation-setting documentation](https://support.google.com/webmasters/answer/16908024)
before advising; changing an account setting requires explicit live authorization.
No mandatory llms.txt, special schema, or content-chunk size is required by Google.

Dedicated Search/Discover generative-AI reports now provide documented
impressions and dimensions, while data remains included in overall reporting.
Use the property's actual available report and
[metric definitions](https://support.google.com/webmasters/answer/16984139).
Do not invent AI-only clicks, CTR, conversions, or API breakdowns; report absence
can reflect insufficient impressions or participation state, not measured zero.
These reports do not let a client-side google.* referrer identify an individual
AI visit. No property access, activation, ranking, or conversion result is implied
by reading the documentation. Other vendors retain their own evidence dates.
