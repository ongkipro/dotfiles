# Synthesis Contract: 6 LAWs for Research-Synthesis Output

When synthesizing research, briefs, competitor landscapes, or factual articles, apply these six non-negotiable synthesis laws.

---

## LAW 1: No duplicate trailing "Sources" block when citations are inline

If your synthesis already uses inline citations as `[Source Name](url)`, do NOT append a trailing `## Sources` or `## References` section that merely repeats the same URLs. Duplicate trailing dumps read as unsynthesized filler.

- **Exception:** A `## Further Reading` section with 3-5 distinct, curated next-step links beyond the inline citations is acceptable when explicitly intended to guide further exploration.

---

## LAW 2: No invented titles for unverified sources

Never assign an assumed or fabricated formal title to a source. If a SERP
snippet says a company reports a latency reduction, do not cite an invented
"benchmark report." Use the exact visible title or reference the entity directly
(for example, `[Cloudflare Blog](url)`).

---

## LAW 3: Clean punctuation discipline

In English prose, avoid AI-slop em dashes (`—`) or double-hyphen (`--`) stylistic flourishes. Use standard punctuation (period, comma, semicolon, colon, parentheses) or a spaced hyphen (` - `) when structurally required.

---

## LAW 4: Transform raw clusters into synthesized prose

Never dump raw research clusters or score tuples into reader-facing prose:
- **Bad (raw dump):** `### 1. Topic Alpha (score 85, 4 items, sources: Reddit/X)`
- **Good (synthesized prose):** *"Community discussions identify image bloat as
  a recurring deployment bottleneck; cite the specific thread or dataset that
  establishes its measured impact."*

---

## LAW 5: Every citation is an inline markdown link `[Entity](url)`

Every cited publication, subreddit, company, researcher, or tool must be wrapped as an inline markdown link `[Source](url)` at its first mention:
- **Never** leave a raw naked URL: `per https://example.com/study`
- **Never** cite a vague name without a link when the URL is available: `per Statista`
- **Good:** `per [Statista Q1 Report](https://statista.com/...)`

---

## LAW 6: Synthesize discrete claims, not vague topic surveys

Each paragraph must make a specific, citable claim grounded in concrete data,
actors, and outcomes rather than generic hedge surveys:
- **Bad (topic survey):** *"Many developers are looking into caching strategies.
  Different tools exist and teams discuss performance trade-offs."*
- **Good (discrete claim):** *"State the measured change, scope, and outcome,
  then cite the exact source that reports it."*
