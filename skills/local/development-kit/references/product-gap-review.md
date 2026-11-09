# Product Gap Review

Use this when an owner asks to review an existing, already-built product
"against the market" and complete its PRD: a repository plus requirements
exist, and the question is what the product still lacks for its real users.
It is a routing and method contract, not market research methodology
(`product-intelligence` owns that) and not a PRD template (`prd-taskbreaker`
or `development-spec-suite` own those).

## Lane

1. Repository truth first: `STATUS.md`, `DECISIONS.md`, `ARCHITECTURE.md`,
   the canonical PRD, `TASKS.md`, then a route and keyword scan of the source.
   Run the repository's own spec or traceability check and record the result.
2. Market evidence second, through `product-intelligence`
   ([market intelligence contract](../../product-intelligence/references/market-intelligence.md)).
   Extend the repository's existing research note family; never overwrite an
   earlier dated note, add a new dated note that cites it.
3. Activated regional concerns through [market engineering](market-engineering.md);
   regulations are read at the official text, article by article.
4. Requirement delta through the PRD owner: `prd-taskbreaker` for a standalone
   `PRD.md`, `development-spec-suite` when the PRD lives in a suite pack.

## Method

Work from the user's jobs, not from the feature list.

1. **Job inventory.** List the jobs the target user performs, in the order
   they happen in a working day (for a counter: quote, weigh, check content,
   offer insurance, take payment, receipt, hand over, notify, track, returns,
   claims, close the day, see earnings). Each job cites market evidence:
   competitor documentation, regulation, or observed customer behavior.
2. **Coverage per job.** Mark each job against the build with a disk pointer:
   built, partial, absent. Absence is proved by a scan, not by memory.
3. **Severity.** Critical = without it the user keeps the old tool beside the
   new one; High = legal, money or dispute exposure; Medium = friction;
   Decision = strategic scope choice, not a defect.
4. **Competitor matrix.** Classify each claimed differentiator as table
   stakes (three or more competitors), common, candidate differentiator, or
   invisible-to-buyer. Vendor marketing is self-description, never a market
   fact; label it so.
5. **Unit economics.** Write the per-unit revenue formula from accepted
   decisions with documented provider terms, then the owner's hoped terms,
   then the competitive benchmark. If the accepted model yields zero or
   negative platform revenue, say so plainly and list options as proposals.
6. **Regulatory triggers.** Map each activated article to a product
   implication and name who carries the legal duty. A duty that sits with a
   licensed third party (courier, payment provider) still deserves truthful
   surfacing in the product; do not invent a duty for the platform.
7. **Internal contradictions.** List drift between the repository's own
   documents (stale status, superseded decisions still stated, requirement
   status that contradicts a completed task). Fix only those inside the
   requested scope; list the rest with their owning file.

## Deep pass (when asked for depth)

A single desk pass finds the gaps; a deep pass proves them. Split evidence into
independent lanes so no lane reuses another's assumptions, then integrate:

| Lane | Owner | Delivers |
|---|---|---|
| Official data and regulation | `product-intelligence` + [market engineering](market-engineering.md) | Statistics agency tables, central-bank data, statute/regulation articles with verbatim excerpts |
| Competitor programs | `product-intelligence` | Feature, cost and earning matrix from vendor pages; table stakes vs rare features |
| Public-surface extraction | `black-magic`, public surface only | App-store metadata and coded recent reviews, feature evidence from public JS bundles, public tracking/lookup field exposure |
| Provider facts vs repository | the provider skill (e.g. `mengantar-api`) | Each repository claim marked CONFIRMED / CHANGED / NEW / UNKNOWN |
| User voice | `product-intelligence` | First-hand accounts and surveys mapped to the job inventory; ranked pains; interview guide for what desk research cannot close |

Public-surface rules for the extraction lane: no login or account creation, no
credential use, no auth/paywall bypass, no write requests, robots respected,
rate-limited, no lookups of real third parties' identifiers (tracking numbers,
phones), and no key or token values reproduced in any report. Review counts are
keyword-coded and directional; say so.

Keep lane reports as dated evidence beside the research note (for example
`docs/research/evidence/<date>/`) after a secret-pattern scan; raw scraped data
stays outside the repository. The integrating session owns the merge,
contradiction handling and final verification.

## Output

- One dated research note: verdict table, repository review, evidence with a
  source register, job gap table, economics, regulatory map, contradictions,
  requirement delta, recommended order, executed verification.
- PRD additions as new IDs with Status **Proposed**, statement and
  Given/When/Then acceptance, constraints, evidence `Not implemented`, and a
  change-history line. Never mark them Accepted, never create tasks, and add
  the strategic questions to the PRD's open-decision table.
- Rerun the traceability/spec check after editing and record both results.

## Guards

- Research and planning do not authorize code, task creation, deployment or
  provider calls.
- Do not raise a candidate differentiator to a public claim before the
  repository's own proof gate passes.
- Search-tool summaries are discovery leads only; every cited number is read
  at its URL. Paywalled or unloaded sources are recorded as not used.
- Keep the note in the repository's documentation language even when the
  conversation is in another language.
