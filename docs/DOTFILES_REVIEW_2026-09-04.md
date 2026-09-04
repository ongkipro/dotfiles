# Dotfiles Review — 2026-09-04

> **Dated review; not a status document.** Every finding was verified against
> disk and `git` on 2026-09-04 and seeded TASK-047 to TASK-054 in
> [`../TASKS.md`](../TASKS.md), which owns current work. Re-run the named
> commands before acting on anything here; do not read a finding as still true.

## Findings

### 1. The queue and the ledger disagree
`resume-brief` lists TASK-042 and TASK-043 as READY/BLOCKED candidates. Both
are finished: their runs (`RUN-20260901T053251Z-10d91849`,
`RUN-20260901T054645Z-803b2500`) ended `BLOCKED` under the pre-`3820a1e` rule
that refused any run containing a FAIL, and were never re-closed. TASK-045
(`REQ-CROSS-DEVICE-VERIFICATION`) and TASK-046 (`REQ-LEDGER-SEMANTICS`) both
ended PASS in `.delivery/runs/` and were never recorded in `TASKS.md`.
Separately, `resume-brief` only lists tasks that already have ledger evidence;
a contract with no run is invisible unless another task depends on it, so a
freshly accepted queue shows "0 ready to start".
Check: `resume-brief`; `grep -l TASK-04[56] .delivery/runs/*.jsonl`.

### 2. The public README is empty
`README.md` is 0 bytes on `origin/main` since `6e2bf36` (2026-08-30), a
memory-cleanup commit whose stat shows `README.md | 5 --`. The prior deliberate
version (`3d5fb69`) was 92 bytes; the last full one (`17021c1`) 17 KB and
repeated routing claims that `config/omp/STATUS.md` owns.
Check: `git cat-file -s origin/main:README.md`.

### 3. Memory routing reaches 26 of 69 project-memory files
`config/ai/memory-router.json` routes all 19 shared files, but `projects` maps
15 keys to one file each and `lessons` names 13 files. The remaining 43 are
unreachable through the `UserPromptSubmit` hook, and `~/.claude` memory says
never to scan the directory, so unrouted means invisible: five `tokophi-*.md`
beside the routed `tokophi.md`; all four `pixsgo-*.md` (no key); `ongki-pro-site.md`,
`rtqalhadi-project.md`, `autolaris-payment-integration.md`, `kiriminaja-*.md`;
and the convention lessons `git-identity-noreply.md`, `no-ai-commit-trailer.md`,
`bahasa-indonesia-not-malay.md`, `task-handoff-md-always.md`,
`title-separator-convention.md`. Key `petcue-theme` cannot match the checkout
`~/projects/petcue`. No gate checks coverage; `ai-memory-hygiene` checks size.
Check: compare `projects` values plus `lessons[].path` against
`config/ai/project-memory/*.md`.

### 4. Skill discovery has no map and a heavy registry
66 owned skills carry 35,237 description characters; the ten heaviest
(`ui-validation` 1006, `prd-taskbreaker` 900, `cloudflare` 882, `storefront-ux`
854, `seo-website-builder` 847, `storefront-development` 821, `native-first`
817, `design-taste` 783, `google-ads-signal-engine` 765, `content` 750) are
8,425 — 23 %. `skill-check` has warned since the guideline existed. 33/66 skills
reference another skill; 17 are isolated. `development-kit/references/
reference-map.md` names `stripe-best-practices` as the only payment owner while
no project uses Stripe and the providers in use — `doku-malaysia-integration`,
`autolaris-h2h`, `mengantar-api` — appear in no routing table. `memory/skills.md`
names 28 of 66 skills. `cloudflare` carries a `.local-fork` whose sole purpose
is its description's sibling-routing clause; a trim must keep that clause.
Check: `skills/agents-bin/skill-check`; `grep -c '' skills/local/*/SKILL.md`.

### 5. Audit leftovers nothing reads
`config/omp/config.yml.lock` (P2-13: 0 bytes, no reader, not ignored);
`docs/dev-setup.md` (P2-14: redirect with no inbound link); `docs/preview/`
(68 KB static site, no inbound reference since `d836864`).
Check: `grep -rn <path> bin/ install*.sh .github/ config/ docs/ skills/`.

## What was ruled out
`stripe-best-practices` looked removable and is not: five skills route to it.
`doku-malaysia-integration`, the eight `gsap-*` skills, `turnstile-spin`, and
`cloudflare-one` all have project evidence. Only `cloudflare-one-migrations`
had none and was removed in `7d3f2ba`.
