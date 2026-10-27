# Meta Ads Indonesia Implementation — 2026-10-27

### TASK-152: Indonesia baseline and trustworthy Meta diagnostics

- **Requirement:** REQ-META-ID-BASELINE (owner: implement the reviewed general Indonesia research in dotfiles, 2026-10-27).
- **Risk Level:** R3.
- **Job:** implementation.
- **Capability:** meta-ads-cli, skill-creator, testing-engineering.
- **Execution Class:** precision.
- **Allowed Paths:** `TASKS.md`, `bin/dotads-meta`, `bin/dotads-meta-test`, `skills/local/meta-ads-cli/SKILL.md`, `skills/local/meta-ads-cli/references/rules-and-tutorial.md`, `skills/local/meta-ads-cli/references/roas-cpr-profit-intelligence.md`, `skills/local/meta-ads-cli/references/api-and-evidence.md`, `skills/local/meta-ads-cli/references/indonesia-market.md`, `skills/local/meta-ads-cli/references/indonesia-baseline.json`.
- **Protected Paths:** `bin/dotads-meta`.
- **Canonical Contract Owners:** operations -> dotads-meta; country evidence and routing -> meta-ads-cli.
- **Accepted Invariants:** English technical artifacts; Bahasa Indonesia market content only for explicit ID scope; no product/account prerequisite for public baseline; preserve source dates, populations and geographic limits; no MY/global leakage; missing/invalid metrics cannot become zero diagnoses; unknown costs remain unknown; coherent COD basis; automatic observations never become proven winners/losers; deployment remains dry-run/paused/idempotent.
- **Regression Checks:** meta-regression, meta-skill, policy, diff; bind at run start.
- **Runtime Evidence:** offline public baseline queries and synthetic analyzer/filesystem cases; independent skill decision trial; no live account or secrets.
- **Visual Contract:** Not applicable.
- **Depends On:** None.
- **Reopen Conditions:** country leakage, numeric-basis regression, failed baseline/provenance validation or unsafe learning promotion.
- **Escalation Conditions:** stop for live-account changes, credentials, or overlap with unrelated edits.
- **Rollback/Migration State:** preserve existing per-brand records and manifest formats; document analysis-output changes.
- **Non-Scope:** live ads, upstream SDK migration, automatic spend changes, unrelated TASK-151 work, commit/push.
- **Verification:** `bin/dotads-meta-test`, `SKILL_SOURCE="$PWD/skills/local" skills/agents-bin/skill-check meta-ads-cli`, `bin/ai-policy-lint`, `git diff --check`; independent review and final boundary approval.

## Implementation and evidence

- Public offline `baseline --market ID` query: 38 BPS provinces, seven selected
  NEXT cities, and two BI Sulawesi Utara quarters. Province/city filters retain
  observed versus inherited context; other/unspecified markets fail explicitly.
- English technical documents and structured data; Bahasa Indonesia customer
  content only for explicitly selected Indonesian scope. The general baseline
  needs no product, account, brand history, credentials, or upstream CLI.
- Analysis version 2 preserves unknown/invalid values, exposes source/order/cost
  qualification, applies COD delivery once, and recomputes coherent thresholds.
  Saved economics and input rows must match account/currency scope; changing
  brand scope cannot silently reuse historical costs.
  Contribution after ads replaces the net-profit interpretation; unattainable
  targets remain unavailable. Legacy fields are deprecated without deleting data.
- Classifications are observational candidates. No generated spend-mutation
  commands or automatic winner/loser verdicts. Reanalysis deduplicates insights.
- References load on demand; source publication and measurement periods remain
  distinct, with correction/new-release triggers and explicit coverage gaps.

Executed checks include the full offline helper regression suite (public-baseline
country/filter/symlink/no-write cases, analysis fixtures, and preserved mocked
paused/idempotent deployment), skill validation, policy lint, and diff checks.
The COD regression produces 475, with target CPR 39.5 for a 20% expected-collected
revenue margin. These fixtures do not establish live account or business results.
Independent adversarial review reproduced and closed historical account/currency
cost reuse, rounded-CPR false target acceptance, and a positive sub-cent target
being rounded to zero. Decisions use unrounded values; unrepresentable local
cost-cap suggestions remain unavailable. Human memory/list output exposes the
stored scope and the need to match the current brand.

Separate source review by `/root/meta_official_status` matched all 38 BPS rows,
national/urban/rural figures, seven NEXT observations, and both BI periods to
original sources. A fresh `/root/meta_id_forward_trial` produced actual responses
to ID, MY-with-IDR-billing, and mixed-market requests. Parent assessment passed
country routing, denominator/coverage limits, conditional audience advice, and
rejection of fabricated local CPA/winner claims. These are declared review and
decision observations, distinct from executed checks and statistical reliability.

Final mandatory executed checks, independent code/boundary approval, runtime
integration checkpoint, and completion result are owned by
`RUN-20261027T055616Z-9761890b`. Verification was isolated at base
`437787270965b2a021733d0e1eb8353177bd27ae` to preserve concurrent TASK-151 work.
Its `.delivery/current.json` must not replace the concurrent main-worktree run.

## Limits

No account calls, secrets, installation, live spend, or commit/push were needed.
City coverage is incomplete; buyer-population size, category demand, city CPA,
statistical sufficiency, backend cohort reconciliation, currency history,
effective Meta controls, and profitable outcomes are not established. Source
refresh is review-driven, not an automatic algorithm-update engine. Future
releases must recheck source triggers and the separately documented CLI/SDK
compatibility limits.
