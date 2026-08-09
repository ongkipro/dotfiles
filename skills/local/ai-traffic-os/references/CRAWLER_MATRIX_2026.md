# 2026 Dual-Crawler Matrix & Robots Directives

In 2026, web crawlers are strictly divided into two functional categories:
1. **Live Search & Citation Crawlers**: Actively query your site during live user searches to cite your content in AI answers (e.g., ChatGPT Search, Perplexity, Claude Web, Google AI Overviews). **MUST BE ALLOWED** to capture AI traffic.
2. **LLM Model Training Crawlers**: Scrape site content for offline LLM model training without giving direct search attribution. **OPTIONALLY BLOCKED** based on copyright/privacy policy.

---

## Recommended `robots.txt` Standard

```txt
# ==============================================================================
# 1. Live Search & Citation Bots (WAJIB ALLOW untuk Traffic & Sitasi AI)
# ==============================================================================

User-agent: Googlebot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-Web
User-agent: ClaudeBot
Allow: /

User-agent: Applebot-Extended
Allow: /

# ==============================================================================
# 2. Training-Only Crawlers (OPSIONAL BLOCK untuk proteksi model training)
# ==============================================================================

User-agent: GPTBot
Disallow: /private/

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Anthropic-ai
Disallow: /private/

# ==============================================================================
# Fallback & Sitemap
# ==============================================================================

User-agent: *
Allow: /

Sitemap: https://example.com/sitemap-index.xml
```

---

## `llms.txt` Standard Specification

Provide a clean `/public/llms.txt` file at the root to summarize the knowledge base for LLMs:

```markdown
# Site Title & Knowledge Hub

> Concise summary of the site's primary topic, target audience, and research focus.

## Core Topics & Entities

- [Topic 1 Hub](https://example.com/topic-1/): Primary guide and diagnostic resources.
- [Topic 2 Hub](https://example.com/topic-2/): Overview of solutions and research datasets.

## Key Guides & Research

- [Guide A](https://example.com/guides/guide-a/): In-depth diagnostic methodology.
- [Dataset B](https://example.com/research/dataset-b/): Original 2026 research data.

## Full Index
For full text context, visit [llms-full.txt](https://example.com/llms-full.txt).
```
