---
name: volumx-writer
description: Create, rewrite, humanize, localize, optimize, audit, or score English and Indonesian writing while preserving meaning, qualifiers, citations, keywords, conversion intent, compliance language, technical accuracy, structure, and brand voice. Use for articles, SEO content, landing pages, ads, emails, social posts, ecommerce copy, founder or investor materials, PRDs, technical docs, API docs, READMEs, prompts, AI-slop removal, tone adaptation, and substantial rewrites where silent claim drift would be costly.
---

# VolumX Writer

Improve writing without silently changing what it claims, promises, targets, or requires.

## Workflow

1. Classify the task: create, rewrite, humanize, optimize, shorten, expand, localize, audit, or score.
2. Identify the primary content mode, audience, language, goal, and output constraints. Load only the relevant references.
3. Before editing factual or constrained text, build a protected-content ledger from `references/preservation.md`.
4. Choose the least destructive editing level that satisfies the request.
5. Draft or revise for clarity, natural rhythm, specificity, credibility, and channel fit.
6. Run the preservation and anti-hallucination checks.
7. Run the channel-specific quality gate and deliver in the requested format.

## Editing levels

- `light`: correct friction, filler, repetition, and obvious clichés.
- `standard`: improve structure, flow, specificity, and voice while preserving the original architecture.
- `strong`: rebuild weak passages or the full composition while preserving protected meaning and constraints.
- `audit-only`: report issues without rewriting.

Default to `standard`. Use `light` for legal, compliance, medical, financial, contractual, or highly technical wording unless the user explicitly requests stronger editing.

## Non-negotiable rules

- Never invent facts, evidence, quotes, testimonials, numbers, product capabilities, legal conclusions, citations, or customer outcomes.
- Never turn possibility into certainty, correlation into causation, aspiration into proof, or a conditional offer into an unconditional promise.
- Preserve names, numbers, dates, prices, links, citations, terminology, required keywords, disclaimers, commands, code, schemas, and formatting constraints unless the user requests changes.
- Preserve the intended language. Translate or localize only when requested.
- Judge passive voice, adverbs, em dashes, short sentences, rhetorical questions, lists, and contrast structures by function and frequency; do not ban them mechanically.
- Do not remove a deliberate conversion device merely because it resembles an AI-writing pattern.
- Prefer concrete language. When evidence is absent, mark `[evidence needed]` rather than fabricating specificity.
- Do not claim text is human-written or assign an AI-detection probability. Evaluate observable writing characteristics.
- Treat user-provided voice samples and terminology as higher priority than generic style preferences.
- Apply shared `AGENTS.md` policies before channel conventions. In particular, keep Shopify descriptions and metadata CTA-free and brand-generic unless the user explicitly opts in.

## Default quality gate

Confirm before delivery:

1. The main message and intended action remain intact.
2. No fact, qualifier, attribution, condition, or requirement was added, removed, or strengthened without disclosure.
3. The opening earns attention without misleading.
4. Each paragraph has one dominant job and transitions logically.
5. Sentence length and syntax vary naturally without forced randomness.
6. Repetition is purposeful rather than accidental.
7. The wording fits the audience, channel, language, and brand.
8. The ending completes the task without generic filler.

## Output policy

- For straightforward writing, return the finished text directly.
- For a high-stakes or substantial rewrite, add a compact preservation note after the text.
- For an audit, report only material issues ranked by severity.
- For scoring, use `references/scoring.md` and explain deductions with evidence.
- Preserve requested structure, schema, Markdown, JSON, XML, code fences, and character limits.

## Reference routing

Load only what the task needs:

- Meaning and constraints: `references/preservation.md`
- Hallucination and claim safety: `references/anti-hallucination.md`
- Humanization and AI-slop removal: `references/human-writing.md`
- Indonesian: `references/indonesian.md`
- English: `references/english.md`
- Brand voice: `references/brand-voice.md`
- SEO writing: `references/seo.md`
- Landing pages and sales copy: `references/conversion.md`
- Paid and social ads: `references/ads.md`
- Ecommerce and product copy: `references/ecommerce.md`
- Technical, product, PRD, and developer docs: `references/technical.md`
- Prompts and agent instructions: `references/prompt-writing.md`
- Founder, corporate, proposal, and investor writing: `references/business-writing.md`
- Channel selection: `references/modes.md`
- Scoring: `references/scoring.md`
- Worked patterns: `references/examples.md`

## Pair with existing skills

- Use `content` for production workflow, batching, calendars, publishing, and asset handling.
- Use `copywriting` for house rules, field limits, and reusable channel templates.
- Use `shopify-listing` for Shopify catalog operations and mutation safety.
- Use `seo-website-builder` for technical SEO, schema, indexing, and page-level QA.

When paired, this skill owns meaning preservation, naturalness, and claim integrity; the domain skill owns its operational workflow and platform constraints.
