# Algorithm Update Log

Purpose: Track trusted updates from Google, Bing, Yandex, Pinterest, and other discovery systems. Use this to decide when the SEO playbooks need revisions.

## Update Policy

Only record an update as actionable if it comes from:

1. official search engine/platform blog/docs/status page
2. official webmaster tools notification
3. strong multi-source industry confirmation, clearly labelled as non-official

Do not overreact to ranking volatility without evidence.

## Log Format

```md
## YYYY-MM-DD — Platform — Update Name

Source:
- URL:
- Source type: Official / Strong public evidence / Speculative monitor

Summary:
- ...

Affected surfaces:
- Web / Local / Images / Shopping / Discover / AI answers / Pinterest / etc.

Likely impact:
- ...

Action required:
- None / Monitor / Update playbook / Audit sites / Change implementation

Files updated:
- ...

Validation:
- ...
```

## 2026-10-31 — Google Search 2026 ranking, spam-policy and documentation refresh

Source type: Official (Google Search Central docs, blog and changelog, retrieved
2026-10-31) plus clearly labelled industry timing sources for rollout dates.

Sources:
- https://developers.google.com/search/updates (documentation changelog)
- https://developers.google.com/search/docs/appearance/core-updates
- https://developers.google.com/search/blog/2026/04/back-button-hijacking
- https://developers.google.com/search/blog/2026/08/update-site-reputation-policy
- https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- https://developers.google.com/search/docs/fundamentals/third-party-seo
- https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- https://developers.google.com/search/docs/appearance/favicon-in-search

Verified (official):
- Smaller, unannounced core updates exist (documented 2025-12-09); improvements can
  lift without waiting for a named core update.
- Back-button hijacking is an explicit malicious-practices violation, announced
  2026-04-13 and enforced from 2026-06-15; manual action or automated demotion; may
  originate in libraries or advertising code.
- FAQ rich results stopped appearing 2026-05-07; documentation removed 2026-06-15.
- 2026-05-15 generative-AI guide: ignore llms.txt, chunking and inauthentic mentions;
  spam policies apply to generative-AI responses. 2026-06-03: generative-AI
  performance reports (impressions, pages, countries, devices, dates).
- 2026-06-05: third-party SEO tools and advice have no access to Google's internal
  ranking data and cannot guarantee results.
- 2026-07-24: review snippets prohibit fake or undisclosed incentivized reviews;
  self-controlled `LocalBusiness`/`Organization` reviews are ineligible for stars.
- 2026-08-28: site-reputation manual actions apply differently inside and outside the
  EEA from 2026-08-30.
- 2026-10-01: AI-content guide revised (Quality Rater Guidelines 4.6.5 and 4.6.6);
  AI-written title, description, structured data and alt must be fact-checked;
  Merchant Center requires IPTC `TrainedAlgorithmicMedia` on AI images.
- Favicon formats Google Search supports: BMP, GIF, ICO, PNG, JPEG, PPM, TIFF (page
  updated 2026-10-27); SVG and WebP are not listed.

Rollouts (dates from Google's Search Status Dashboard as reported by Search Engine
Journal; durations are not Google statements): December 2025 core 18 days; February
2026 Discover core 2026-02-05 to 02-27; March spam 2026-03-24 to 03-25; March core
2026-03-27 to 04-08; May core 2026-05-21 to 06-02; June spam 2026-06-24 to 06-26;
August spam 2026-08-18 to 08-21; September spam 2026-09-24 to 10-08. Google did not
publish what the March or May core updates changed.

Not verified: any impact on a given site. Third-party studies (Ahrefs 58% lower
position-1 CTR with AI Overviews, Seer CTR recovery, SISTRIX sector changes) are
directional samples with their own scope, not Google data. SEOmonitor reported that
rank-tracker volatility late September was partly data-quality noise; prefer Search
Console impressions and clicks.

Action: `IMPLEMENTATION_SPEC.md` and `scripts/` added; `SKILL.md` gained the
noindex/robots/canonical, back-button and review-snippet rules. No Search Console
property, production site or account was inspected or changed.

## 2026-10-26 — Google reporting, eligibility, and diagnostic correction

Source type: Official; pages retrieved 2026-10-26.

Sources:
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
- https://support.google.com/webmasters/answer/16984139
- https://developers.google.com/search/docs/crawling-indexing/control-what-you-share
- https://support.google.com/webmasters/answer/16908024
- https://developers.google.com/search/docs/appearance/structured-data/book
- https://developers.google.com/search/updates
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/appearance/core-updates
- https://developers.google.com/search/docs/crawling-indexing/301-redirects

Verified changes to the local guidance:
- Dedicated generative-AI visibility reports coexist with overall reporting.
  Use documented impressions/dimensions; absent reports do not establish zero,
  AI-only clicks/conversions, or available API breakdowns.
- Google documents a property-scoped Search Console generative-AI participation
  setting with inheritance and URL-prefix overrides. Keep it separate from crawler/training/snippet controls and do not
  change an account setting without authorization.
- The earlier blanket Book Actions retirement claim is incorrect: its current
  guide describes restricted provider participation. Gallery absence alone is
  not evidence of retirement. FAQ retirement remains documented in the update
  log; the old FAQ guide now redirects there.
- Initial noindex may prevent rendering; client-side removal is not a reliable
  public-page repair. Keep canonical, readable noindex, robots, and access
  control separate. Permanent 301 and 308 redirects are both supported.
- Core-update assessment uses the actual rollout end and a full-week wait,
  appropriate comparison scope, and alternative-cause diagnosis.

Supersedes: the Book Actions portion of the 2026-10-02 summary below and the
old assertion that generative-AI visibility has no separate reporting view.
Other vendor facts were not re-certified by this Google-only review.

Action: update the entrypoint, affected references/examples, and the AI owner's
reporting/control descriptions. No Search Console property, production site,
account setting, ranking result, or conversion effect was inspected or changed.
Validation details and upstream comparison belong to VALIDATION_REPORT.md.

## 2026-10-02 — Google structured-data and IndexNow fact refresh

Source:
- Google search gallery: https://developers.google.com/search/docs/appearance/structured-data/search-gallery
- FAQPage doc: https://developers.google.com/search/docs/appearance/structured-data/faqpage
- Simplifying search results (June 2025): https://developers.google.com/search/blog/2025/06/simplifying-search-results
- Core Web Vitals: https://web.dev/articles/vitals
- IndexNow participants: https://www.indexnow.org/searchengines.json
- Google crawl budget scope: https://developers.google.com/crawling/docs/crawl-budget

Source type: Official

Summary:
- Google no longer shows FAQ rich results; FAQ, HowTo, and Sitelinks search box are absent from the search gallery. Book Actions, Course Info, Claim Review, Estimated Salary, Learning Video, Special Announcement, and Vehicle Listing were phased out from June 2025; Google says ranking is unaffected.
- Core Web Vitals: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75; INP replaced FID in 2024.
- IndexNow participants now include Internet Archive and Amazon; DuckDuckGo is not listed.
- Google crawl-budget guidance targets 1M+ page sites (weekly change) or 10k+ page sites (daily change).

Affected surfaces:
- Web rich results; Bing/Yandex/other IndexNow discovery

Action required:
- Update playbook (done in this pass); stop promising FAQ/HowTo rich results in audits.

Files updated:
- `SKILL.md`, `COMPACT_SKILL_REFERENCES.md`, FAQ mentions across playbooks, `INDEXNOW_PLAYBOOK.md`, `SITEMAP_SUBMISSION.md`, `CHANGELOG.md`

Validation:
- `skill-check` run after edits.

## 2026-06-30 — Multi-engine baseline refresh

Source:
- Google AI Features and Your Website: https://developers.google.com/search/docs/appearance/ai-features
- Google Search ranking systems guide: https://developers.google.com/search/docs/appearance/ranking-systems-guide
- Bing sitemap guidance for AI-powered search: https://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search
- Yandex ranking improvement guidance: https://yandex.com/support/webmaster/en/yandex-indexing/rank
- Pinterest Business / Help sources listed in `SEARCH_ENGINE_SOURCE_INDEX.md`

Source type: Official / platform-owned documentation and blogs

Summary:
- Google AI features use the same Search fundamentals; indexed and snippet-eligible pages can appear.
- Google ranking systems remain multi-signal and include language understanding, freshness, link analysis, original content, reliable information, reviews, deduplication, and spam detection.
- Bing emphasises accurate XML sitemaps, true `lastmod`, and IndexNow for AI-powered search discoverability.
- Yandex emphasises quality, security, convenience, region, usefulness, and monitoring via Webmaster/Metrica.
- Pinterest requires visual discovery thinking: domain claim, creative quality, relevance, engagement, consistency, and trend alignment.

Affected surfaces:
- Web search
- AI search features
- Bing Copilot/search discovery
- Yandex web/local regional search
- Pinterest visual search/discovery

Likely impact:
- SEO playbooks should include multi-engine sitemap, AI-feature eligibility, IndexNow, Yandex diagnostics, and Pinterest visual discovery.

Action required:
- Update documentation pack.

Files updated/created:
- `SEARCH_ENGINE_ALGORITHM_BRIEF.md`
- `SEARCH_ENGINE_SOURCE_INDEX.md`
- `ALGORITHM_UPDATE_LOG.md`
- `PLAYBOOK.md`
- `SKILL_DRAFT.md`
- `REFERENCE_MANIFEST.md`

Validation:
- Local markdown link validation should be run after edits.

## Monitoring Queue

Track these going forward:

- Google Search Status Dashboard updates
- Google Search Central Blog core/spam/content updates
- Google AI features documentation changes
- Bing Webmaster Blog updates about Copilot/AI search/IndexNow/sitemaps
- Yandex Webmaster guidance changes
- Pinterest Business and Help updates about organic reach/search/catalogs
- Merchant Center product data changes
- structured data policy changes
- Core Web Vitals metric changes

## Review Cadence

Recommended:

- quick source check: monthly
- full playbook review: quarterly
- immediate review: after major Google/Bing/Yandex/Pinterest official update
- project-specific review: before major site launch or migration
