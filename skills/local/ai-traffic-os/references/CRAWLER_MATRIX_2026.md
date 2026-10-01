# Crawler Purpose Matrix

Last re-verified against the linked primary sources: **2026-10-02**. Crawler identities and product uses change independently. Retrieve each source again immediately before changing `robots.txt`; record the new retrieval date and verify traffic by published IP ranges or reverse-DNS guidance where the vendor provides it.

Do not collapse all AI-related user agents into two universal buckets. Keep these purposes separate:

1. **Search/indexing and citation candidates** — automated crawlers that build or refresh a search index.
2. **User-triggered retrieval** — agents that fetch a page because a user requested it; vendor documentation may state that normal `robots.txt` behavior differs.
3. **Model development or generative-system use** — controls that vendors document for training, grounding, or model improvement outside ordinary search.

## Current vendor matrix

This table is a navigation aid, not a permanent fact registry. The linked primary source is authoritative.

| Vendor token | Documented purpose to verify | Keep distinct from | Primary source |
| --- | --- | --- | --- |
| `Googlebot` | Google Search crawling; Google says Search AI features use this control | `Google-Extended` | [Google common crawlers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers), [AI features](https://developers.google.com/search/docs/appearance/ai-features) |
| `Google-Extended` | Standalone product token for certain Gemini/Vertex AI controls; Google says it does not affect Search inclusion or ranking | `Googlebot` | [Google-Extended](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers#google-extended) |
| `Google-CloudVertexBot`, `GoogleOther` | Listed Google common crawlers with non-Search purposes — read each entry's documented purpose before blocking | `Googlebot` | [Google common crawlers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers) |
| `Google-Agent`, `Gemini Notebook`, others | Google user-triggered fetchers; Google: "these fetchers generally ignore robots.txt rules" | `Googlebot` | [Google user-triggered fetchers](https://developers.google.com/search/docs/crawling-indexing/google-user-triggered-fetchers) |
| `OAI-SearchBot` | Surfacing sites in ChatGPT search results; honors robots.txt | `GPTBot`, `ChatGPT-User` | [OpenAI crawlers](https://developers.openai.com/api/docs/bots) |
| `GPTBot` | Crawling for generative AI foundation-model training; honors robots.txt | `OAI-SearchBot` | [OpenAI crawlers](https://developers.openai.com/api/docs/bots) |
| `OAI-AdsBot` | Checking safety of ad landing pages; OpenAI says not used for training | `GPTBot` | [OpenAI crawlers](https://developers.openai.com/api/docs/bots) |
| `ChatGPT-User` | User-initiated actions in ChatGPT and Custom GPTs; OpenAI: "robots.txt rules may not apply" | automated search indexing | [OpenAI crawlers](https://developers.openai.com/api/docs/bots) |
| `Claude-SearchBot` | Anthropic search discovery | `ClaudeBot`, `Claude-User` | [Anthropic crawler controls](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |
| `ClaudeBot` | Anthropic model-development control | `Claude-SearchBot` | [Anthropic crawler controls](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |
| `Claude-User` | User-triggered retrieval; Anthropic says it honors robots.txt directives | automated search indexing | [Anthropic crawler controls](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |
| `PerplexityBot` | Surfacing and linking sites in Perplexity search; Perplexity says not used for model training; honors robots.txt | `Perplexity-User` | [Perplexity crawlers](https://docs.perplexity.ai/guides/bots) |
| `Perplexity-User` | User-triggered fetches; Perplexity: it "generally ignores robots.txt rules" | `PerplexityBot` | [Perplexity crawlers](https://docs.perplexity.ai/guides/bots) |
| `Applebot` | Apple search crawling | `Applebot-Extended` | [About Applebot](https://support.apple.com/en-us/119829) |
| `Applebot-Extended` | Usage control only — Apple: "Applebot-Extended does not crawl webpages"; it governs whether Applebot-crawled data trains Apple foundation models | `Applebot` search access | [About Applebot](https://support.apple.com/en-us/119829) |

### Verification notes (2026-10-02)

- OpenAI moved its bot page to `developers.openai.com/api/docs/bots` (old `platform.openai.com/docs/bots` 301-redirects). It says robots.txt changes can take ~24 hours to apply and publishes IP lists: `openai.com/searchbot.json`, `openai.com/gptbot.json`, `openai.com/chatgpt-user.json`, `openai.com/adsbot.json`.
- Anthropic publishes `claude.com/crawling/bots.json` and documents `Crawl-delay` support.
- Perplexity publishes `www.perplexity.com/perplexitybot.json` and `www.perplexity.com/perplexity-user.json`.
- Robots rules do not bind user-triggered fetchers that the vendor says ignore them (ChatGPT-User, Perplexity-User, Google user-triggered fetchers). If policy requires blocking those, it needs WAF/auth controls verified against the published IP lists, not `robots.txt`.

## Policy workflow

1. Write the site's policy first: search visibility, user-triggered access, model development, copyright, privacy, and contractual restrictions.
2. Retrieve every relevant vendor page and confirm the exact token and semantics.
3. Translate policy to directives. Do not copy the sample below without this step.
4. Confirm that CDN, WAF, authentication, and meta directives do not contradict `robots.txt`.
5. Monitor verified crawler traffic and revisit the decision when vendor documentation changes.

Example for a site whose policy allows documented search/indexing crawlers while declining the listed model-development uses:

```text
User-agent: Googlebot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Applebot-Extended
Disallow: /
```

Omitting a token or adding `Allow` does not force a vendor to crawl or cite the site. A `Disallow` directive is an access request, not an authentication or data-loss-prevention control.

## `llms.txt` boundary

An `llms.txt` file may be a voluntary discovery aid for tools that choose to read it. It does not replace `robots.txt`, authentication, vendor crawler controls, sitemaps, internal links, or normal indexing requirements. Never claim that publishing it creates eligibility or that vendors must honor it.
