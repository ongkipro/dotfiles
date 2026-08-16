---
name: ai-traffic-os
description: >-
  End-to-end AI traffic architecture for search and answer engines. Use when designing or auditing
  crawl controls, helpful answer content, structured media, and AI referral measurement. Requires
  live vendor-documentation checks for crawler identities and keeps search/citation, user-triggered
  retrieval, and model-training controls distinct. Triggers: "ai traffic", "geo optimization",
  "answerbox", "google ai overviews", "chatgpt search", "perplexity seo", "ai search optimization",
  "traffic architecture", "ai traffic os".
---

# AI Traffic OS

Design discoverable, source-backed web content without inventing a special ranking formula for generative answers. Google states that AI Overviews and AI Mode use the same foundational SEO requirements as Google Search and have no additional technical requirements. Other vendors publish their own bot controls and may change them independently.

## Evidence policy

Before recommending crawler rules or vendor-specific markup:

1. Retrieve the vendor's current official crawler documentation.
2. Record the retrieval date and the exact user-agent token.
3. Separate documented behavior from local editorial or analytics heuristics.
4. Never promise citation, ranking, traffic lift, or attribution recovery. Vendor eligibility is not a guarantee of selection.
5. Treat `llms.txt`, custom `data-*` attributes, passage length, and answer-box styling as optional publishing conventions unless a target vendor's current official documentation says otherwise.

Primary starting points:

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google common crawlers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers)
- [OpenAI crawlers](https://platform.openai.com/docs/bots)
- [Anthropic crawler controls](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Perplexity crawlers](https://docs.perplexity.ai/guides/bots)
- [Applebot](https://support.apple.com/en-us/119829)

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

Google documents `Googlebot` as the control for Search, including AI features in Search. `Google-Extended` is a separate product token for controls in certain Gemini and Vertex AI systems and does not affect inclusion or ranking in Google Search. Do not block `Googlebot` while claiming Google AI Overview eligibility. Use snippet controls such as `nosnippet`, `data-nosnippet`, or `max-snippet` when the policy goal is limiting Search previews rather than blocking indexing.
