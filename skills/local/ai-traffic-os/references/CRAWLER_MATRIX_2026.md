# Crawler Purpose Matrix

Last re-verified against the linked primary sources: **2026-08-16**. Crawler identities and product uses change independently. Retrieve each source again immediately before changing `robots.txt`; record the new retrieval date and verify traffic by published IP ranges or reverse-DNS guidance where the vendor provides it.

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
| `OAI-SearchBot` | OpenAI search discovery | `GPTBot`, `ChatGPT-User` | [OpenAI crawlers](https://platform.openai.com/docs/bots) |
| `GPTBot` | OpenAI model-development control | `OAI-SearchBot` | [OpenAI crawlers](https://platform.openai.com/docs/bots) |
| `ChatGPT-User` | User-initiated page visits; check the vendor's current robots behavior | automated search indexing | [OpenAI crawlers](https://platform.openai.com/docs/bots) |
| `Claude-SearchBot` | Anthropic search discovery | `ClaudeBot`, `Claude-User` | [Anthropic crawler controls](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |
| `ClaudeBot` | Anthropic model-development control | `Claude-SearchBot` | [Anthropic crawler controls](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |
| `Claude-User` | User-triggered retrieval; check the vendor's current robots behavior | automated search indexing | [Anthropic crawler controls](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |
| `PerplexityBot` | Perplexity search indexing | `Perplexity-User` | [Perplexity crawlers](https://docs.perplexity.ai/guides/bots) |
| `Perplexity-User` | User-triggered retrieval | `PerplexityBot` | [Perplexity crawlers](https://docs.perplexity.ai/guides/bots) |
| `Applebot` | Apple search crawling | `Applebot-Extended` | [About Applebot](https://support.apple.com/en-us/119829) |
| `Applebot-Extended` | Apple control for use of crawled website content in foundation-model development | `Applebot` search access | [About Applebot-Extended](https://support.apple.com/en-us/120320) |

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
