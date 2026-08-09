---
name: ai-traffic-os
description: >-
  End-to-end AI Traffic Architecture (AEO, GEO, AI Search & Google AI Overviews Optimization).
  Use when designing, building, or auditing websites for AI search engines (Google AI Overviews,
  ChatGPT Search, Perplexity, Claude Web Search), structuring 4-layer traffic systems
  (Discovery, Knowledge, Authority, Conversion), implementing self-contained AnswerBox passage
  chunking (134–167 words), configuring 2026 Dual-Crawler robots.txt matrix, multi-modal
  JSON-LD schemas (ImageObject/VideoObject), and dual-path AI referral tracking with PostgreSQL ingestion.
  Triggers: "ai traffic", "geo optimization", "answerbox", "google ai overviews", "chatgpt search",
  "perplexity seo", "ai search optimization", "traffic architecture", "ai traffic os".
---

# AI Traffic OS

An end-to-end Operating System and Architecture for optimizing web properties across traditional Search Engines (Google, Bing) and AI Recommendation Engines (Google AI Overviews / Gemini, ChatGPT Search, Perplexity, Claude Web Search).

## Core Philosophy

Shift from the legacy model (*Keyword → Article → Ranking → Click*) to the **AI Discovery Model**:

$$\text{User Intent} \longrightarrow \text{AI / Search Discovery} \longrightarrow \text{Primary Source Citation} \longrightarrow \text{Knowledge Page} \longrightarrow \text{Conversion}$$

Make your website a **verifiable, citation-worthy primary source** rather than generic rewritten content.

---

## The Four-Layer Traffic Architecture

1. **Layer 1 — Discovery Engine**:
   - Technical crawlability, sitemaps (`sitemap-index.xml`), `llms.txt`, and 2026 Dual-Crawler `robots.txt` configuration.
   - See [Crawler Matrix 2026](references/CRAWLER_MATRIX_2026.md).

2. **Layer 2 — Knowledge Engine**:
   - Structured entity taxonomy, Topic Hubs, semantic HTML (`<article>`, `<section>`, `<aside>`), and 134–167 word `AnswerBox` components.
   - See [AnswerBox & GEO Passage Extraction](references/ANSWER_BOX_GEO.md).

3. **Layer 3 — Authority Engine**:
   - *Information Gain* strategy: original research, verified data sets, `Source.astro` component, expert author entities, and multi-modal schemas (`ImageObject`, `VideoObject`).
   - See [Multi-Modal & Authority Schemas](references/SCHEMA_MULTI_MODAL.md).

4. **Layer 4 — Conversion Engine**:
   - Commercial query mapping, comparison page architecture, lead capture (WhatsApp/Email/Checkout), and Dual-Path AI Referral Attribution Tracking with PostgreSQL ingestion.
   - See [AI Referral Tracking & Attribution](references/AI_REFERRAL_TRACKING.md).

---

## When to Load References

| Task | Read |
| --- | --- |
| Robots.txt, AI Bot configuration (Search vs Training) | [Crawler Matrix 2026](references/CRAWLER_MATRIX_2026.md) |
| AnswerBox component design & LLM Passage Chunking (134–167 words) | [AnswerBox & GEO Passage Extraction](references/ANSWER_BOX_GEO.md) |
| Multi-modal JSON-LD schemas (Images, VideoObject with transcripts) | [Multi-Modal & Authority Schemas](references/SCHEMA_MULTI_MODAL.md) |
| Client tracking script, UTM fallback, Postgres event logging | [AI Referral Tracking & Attribution](references/AI_REFERRAL_TRACKING.md) |

---

## 2026 Generative Engine Optimization (GEO) Key Factors

- **Semantic Completeness (#1 Factor)**: 40%–47% of Google AI Overview citations come from pages ranking outside the top 5 organic positions. Passages that stand alone with complete context (134–167 words) win citations over domain authority alone.
- **Direct Answer Placement**: Core answers MUST be in the first 1–2 sentences under an H2/H3 header.
- **Data Attributes**: Use `data-citation-unit="true"` and `data-answer-body="true"` on direct answer blocks to facilitate LLM parsing.
- **Dual-Path Referral Attribution**: Track AI traffic through HTTP Referrer + UTM parameters (`utm_source=chatgpt`, `ref_ai=perplexity`) + `sessionStorage` to recover >60% stripped referrer traffic.
