# SEO Skill Validation Report

Historical report date: 2026-06-30. See the 2026-10-26 review below for current
source checks, observed trials, and remaining validation limits.
Scope: public `seo-website-builder` Agent Skill repository.

## Files validated

- `SKILL.md`
- `README.md`
- `LICENSE`
- `COMPACT_SKILL_REFERENCES.md`
- `PLAYBOOK.md`
- `PAGE_COMPLETENESS_FORMULA.md`
- `ASTRO_SEO_PLAYBOOK.md`
- `NEXTJS_SEO_PLAYBOOK.md`
- `SHOPIFY_SEO_PLAYBOOK.md`
- `LOCAL_BUSINESS_SEO_PLAYBOOK.md`
- `SEARCH_ENGINE_ALGORITHM_BRIEF.md`
- `SEARCH_ENGINE_SOURCE_INDEX.md`
- `ALGORITHM_UPDATE_LOG.md`
- `OUTPUT_TEMPLATES.md`
- `TEST_CASES.md`
- `REFERENCE_MANIFEST.md`
- `CHANGELOG.md`

## Existing skill patterns integrated

### Local business SEO

Integrated patterns:

- required/optional business info matrix
- local head tag template
- LocalBusiness subtype mapping
- LocalBusiness required/recommended fields
- Service schema
- FAQ schema rules
- validation errors
- phone formatting patterns

Applied to:

- `LOCAL_BUSINESS_SEO_PLAYBOOK.md`
- `SKILL.md`

### Shopify listing SEO

Integrated patterns:

- scan → pilot → approval → batch workflow
- listing limits for title/meta/handle/ALT
- hard rules against invented facts/supplier junk
- variant cleanup rules
- image ALT patterns
- final QA target

Applied to:

- `SHOPIFY_SEO_PLAYBOOK.md`
- `SKILL.md`

### Astro development SEO

Integrated patterns:

- project classification
- static-first rendering strategy
- smallest island principle
- content in initial HTML
- Astro-native SEO defaults

Applied to:

- `ASTRO_SEO_PLAYBOOK.md`
- `SKILL.md`

### Next.js frontend SEO

Integrated patterns:

- App Router Metadata API
- `generateMetadata()` for dynamic routes
- Pages Router `next/head`
- `app/sitemap.ts` and `app/robots.ts`
- SSG/SSR/ISR rendering decisions
- Client Component SEO boundaries
- JSON-LD in rendered HTML
- `next/image` ALT/LCP handling
- crawlable `next/link` navigation

Applied to:

- `NEXTJS_SEO_PLAYBOOK.md`
- `SKILL.md`

## Validation checks

| Check | Status |
| --- | --- |
| `SKILL.md` exists | PASS |
| required frontmatter exists | PASS |
| references folder exists | PASS |
| core references exist | PASS |
| local markdown links | PASS |
| obvious secret/token scan | PASS |
| dry-run test cases | PASS |
| public README | PASS |
| English public docs | PASS |

## Dry-run coverage

The skill has dry-run scenarios for:

- local business company profile
- Astro static website
- Next.js frontend SEO
- Shopify product listing optimisation
- ecommerce category SEO
- existing website SEO audit
- algorithm update review
- Pinterest visual discovery page
- programmatic SEO quality control

## Public safety statement

The public skill repository intentionally contains no private credentials, API keys, auth sessions, client secrets, or private customer data.

## Final verdict

Status: **production-ready public Agent Skill**

The skill is suitable for AI coding agents that support Agent Skills-style workflows or manual skill loading.


## 2026-10-26 — Adaptive guidance and source-backed audit (TASK-149)

Run: `RUN-20261026T163737Z-54b6f99f`. This updates the existing owner, not a new
SEO skill or installed bundle. The current frontmatter/discovery metadata is
preserved; only relevant body/reference guidance and a validation helper change.
Source-access dates use UTC; work continued on 2026-10-27 in Asia/Jakarta.

### Official-source findings

Google Search Central and Help pages were retrieved on 2026-10-26. The source
index and algorithm update log retain exact URLs and scope. Material corrections:

- Generative-AI reports now have dedicated visibility views alongside overall
  reporting; only documented metrics/dimensions may be claimed. Missing reports
  or authorization are unknown, not measured zero or active integration.
- Book Actions is not blanket-retired; feature-specific provider eligibility
  matters. The former FAQ guide redirects to the update log, which records its
  rich-result retirement. A missing gallery row is not retirement proof.
- Original HTML noindex may prevent JavaScript rendering. Canonical, readable
  exclusion, crawl control, and server privacy are separate decisions.
- Google supports appropriate permanent 301 and 308 redirects. Core-update
  analysis requires confirmed rollout completion, the documented wait, scoped
  comparisons, and alternate-cause assessment.
- Title/meta counts and separators remain owner conventions with project
  overrides. Next.js examples now follow them and await route params; official
  framework APIs were checked at https://nextjs.org/docs/app/api-reference/functions/generate-metadata.

The smallest sibling dependency updates the AI owner's stale reporting/control
paragraph and related references. No other vendor crawler identity or API was
re-certified. No Search Console property, live account control, ranking, or
conversion effect was inspected.

### Pinned GitHub comparison and adoption decisions

These are the best fits among four inspected candidates, not a universal ranking.
All four licenses were verified as MIT at the listed revision. Upstream tests
were inspected as evidence of their design, not executed or counted as passing.
Adaptations use local wording/code; no upstream installer, global CLI, agents,
hooks, or credentials were adopted.

| Source / pinned revision | Inspected material | Adopted fit | Deliberate non-adoption |
| --- | --- | --- | --- |
| [mblode/agent-skills](https://github.com/mblode/agent-skills/tree/193fa28cba62506457a815141f37b41396b0ad91), MIT | LICENSE.md; SEO SKILL.md; validation-evidence/sources references; eight declarative evals | Best workflow fit: selective loading, property/path/date boundaries, missing data, and evidence levels | Combined ownership across all SEO/AEO, local commit rules, or source claims without Google recheck |
| [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills/tree/afa8da942115f2961fdbfa80807ea0b232ff6c00), MIT | LICENSE; README; SEO SKILL.md; no eval paths observed | Technical measurement: HTTP/source plus rendered checks, comparable reruns, scores do not predict rankings | Mandatory tools, illustrative recipes as engine laws, CTA defaults, or calling this unofficial repo a Google product |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills/tree/e85f3cbc2e4a79bf33b2a12e9bdd9087d414735b), MIT | LICENSE; README; seo-audit SKILL.md; 13 declarative evals | Business scope and evidence/impact/fix finding structure; fetched content stays untrusted | Conflicting metadata/CTA ranges, click-depth quotas, blanket canonical rules, retired tool recommendations |
| [seo-skills/seo-audit-skill](https://github.com/seo-skills/seo-audit-skill/tree/fac4b75f2059b6d74bb05a865fe1b0ca5de3ba66), MIT | LICENSE; README; SKILL.md; Vitest machine-error and rendered-crawler test sources | Unmeasured is not PASS; tool failure differs from score; raw HTML differs from DOM | Global install/init, .env scanning, score weights as Google weights, claimed token savings, or its CLI dependency |

The old aaron-he-zhu standalone repository was a moved/signpost source at the
inspected revision, so it was not selected for active adoption. Popularity was
used for discovery only; no upstream reliability or ranking-effect claim is made.

### Capability and regression evidence

The existing entrypoint previously mandated both COMPACT and PLAYBOOK before
routing. Bounded repairs now reuse accepted context and read only a relevant
reference when needed. Substantial audits retain business/measurement context.
This changes the loading contract; billed token or end-to-end cost savings were
not measured.

An independent before trial used a copied pre-change skill and repaired the
canonical-only fixture successfully. It opened five SEO guidance files: main,
COMPACT, PLAYBOOK, ASTRO, and LOCAL_BUSINESS. A separate after trial used the
updated skill for two artifact repairs plus Shopify and traffic-drop advice;
it opened main, SHOPIFY, and ALGORITHM references, plus the relevant native-first
verification guidance. Different workloads mean these counts are not a controlled
cost comparison or a reliability estimate. The baseline canonical behavior
already worked; no invented baseline failure or success-rate gain is claimed.

Observed after-trial outcomes, independently checked by the parent:

| Scenario | Observed result and scope |
| --- | --- |
| Canonical-only service-page fix | One correct intended canonical; all other page semantics/content preserved; no analytics/strategy prerequisite |
| Public indexability repair | Original noindex removed, JS removal workaround removed, public crawl access restored, private account bytes/exclusion retained, sitemap contains only public canonical |
| Shopify 200-product request with one sparse sample | Read-only one-product pilot before bulk mutation; SKU retained; owner title/meta/no-CTA/brand constraints retained; no fabricated facts |
| Small decline during ongoing suspected core update, no scoped export | No invented causal conclusion or real rollout; independent technical checks may proceed; proper property/period/rollout evidence requested before content decisions |

Parent artifact checks use `scripts/evaluate-fixture.py`, outside the worker's
editable surface; its baseline sits beside the exported workspace. Both repaired
fixtures passed. Its self-test rejected intentionally defective fixtures and
accepted reference repairs. This is a real local raw-artifact trial, not a live
HTTP/browser/Google indexing or business-outcome test.

Independent review found the first oracle did not reject unrelated public
content/schema or robots-policy changes and used a stdlib rule-order behavior
that does not match Google's specificity rules. The checker now preserves those
artifacts and supports the fixture's bounded directive grammar, accepting the
specific Allow in either order. Negative self-tests reject content/schema loss
and broader crawl-policy changes. The actual worker artifacts were unchanged
and passed again with the stronger oracle. General robots patterns, HTTP, and
engine behavior remain outside this helper's acceptance claim.

Trial workspaces were under `/tmp/seo-skill-trial-s7tresw3/`; these are local,
ephemeral attachments, not cross-device authority. The helper can regenerate
fresh fixtures and TEST_CASES.md specifies allowed edits and acceptance. Agent
identities were `/root/seo_before_trial` and `/root/seo_after_trial`; exact model
IDs were not exposed and are not invented.

### Repository boundary and outstanding global baseline

At start, unrelated local work had removed 9Router and edited the shared skill
map. Those paths were left unchanged. Baseline global policy/link checks already
failed on two references to the removed 9Router skill and a stale generated
skill map. Focused SEO checks must be reported separately; a passing metadata
validator or fixture cannot turn that pre-existing global state into PASS.
Final command results and independent approval belong to the delivery run.

Independent scoped review: `/root/seo_final_review` returned APPROVE after
fetching the Google sources and pinned licenses and exercising oracle negatives,
rule ordering, the three actual trial artifacts, metadata, skill-creator
validation, focused links, and scoped whitespace checks. Provider: OpenAI; exact
model ID and reasoning configuration were not exposed. The approval explicitly
excludes the pre-existing global link/map failures and all unobserved live,
browser, indexing, ranking, reliability, and token-saving outcomes.
