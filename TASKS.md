# Tasks — dotfiles

Updated: 2026-09-08

The sole executable queue. Completed contracts live under `docs/archive/`;
repository tests and runtime evidence outrank prose.

## Task contract

Fields and risk rules: `config/templates/TASKS.md`. R0 may infer one obvious file;
R1 stays bounded; R2 names its surface; R3/R4 add protected surfaces and review.
Only the dependency edge is human-authored; state is derived.

## In progress

_None._

## Recently completed

- **TASK-063 / REQ-OMP-UPDATE-SYNC (R2, reviewed).** Updated rich's native OMP
  from 18.1.10 to 18.1.13 and verified native routing, shared context, 66 skills,
  and local runtime health. CI fixtures now use a synthetic Claude profile and
  launcher, and normalize temporary paths for macOS. The full suite passed;
  the final launcher-isolation refinement passed its focused rerun. Independent
  negative deny/hook fixtures and symlinked-TMPDIR checks passed. TASK-062's
  previously reviewed changes were preserved for the authorized publication.
  Evidence: RUN-20260907T170125Z-c0d35e3d.

- **TASK-062 / REQ-MODEL-AGNOSTIC (R3).** Owner-authorized removal of model/provider
  eligibility locks from shared capability instructions, OMP orchestration,
  delivery-ledger and policy lint. Separate actual-agent review, truthful
  provenance, self-review rejection, stale-evidence checks and live-operation
  approvals remain. Same-route R3 approval/finish/verify and policy fixtures pass;
  canonical policy lint passes. Native runtime defaults and historical runs were
  not rewritten. Contract and retained TASK-058 history: [archive](docs/archive/DOTFILES_TASKS_2026-09-07_CONTEXT_RETENTION.md).
  Evidence: RUN-20260907T163715Z-9766f188.

- **TASK-061 / REQ-LOCAL-SYNC (R2, reviewed).** Added mise-managed ripgrep,
  verified it outside AI-injected PATH, corrected toolchain references, and
  refreshed rich's device snapshot. GNU timeout's SIGKILL exit 137 now reports
  ERROR in mutation-sweep; errors also fail the command. The doctor timeout
  fixture no longer scans the real repository. Replaced unavailable Codex-only
  selectors and checked overlay visual primaries/fallbacks for image support.
  Full repository self-test passed; independent negative visual fixtures passed.
  Evidence: RUN-20260907T160155Z-6c558cf6.

- **TASK-060 / REQ-RUNTIME-COMMAND-SYMLINK (R1).** After the 2026-09-04 pull,
  the newly installed `~/.local/bin/skill-map-test` link ran nine fixture cases
  successfully but failed its real-repository check because it derived `ROOT`
  from the symlink directory (`~/.local`) instead of the command target. Root
  discovery now follows relative and absolute symlinks. Both repository-direct
  and installed invocations pass all eleven cases; the full repository self-test
  and the live runtime-command manifest check also pass.

- **TASK-059 / REQ-CONTENT-POLICY (R1).** `shopify-content-helper meta-gen` shipped
  templates breaking two rules in `CLAUDE.md` before anyone typed a word: CTA text
  ("Buy Online at", "Shop … at", "order online today") and a `[Brand]` slot where
  brand-generic is the default. It also asserted "Free Shipping & Best Price" about a
  shop it knows nothing about. Six templates replaced with descriptive ones — materials,
  dimensions, variants — and the command now prints the rule it follows. The `≤60` and
  `≤155` headers turned out to be labels rather than checks: a 35-character keyword put
  every title at 63–73 while the header still claimed the limit. Each template now
  reports its own length and flags an overrun. Three mutations bite. The test that
  previously locked the broken state asserts the rule instead.

- **TASK-058:** completed test-efficacy history retained in
  [context archive](docs/archive/DOTFILES_TASKS_2026-09-07_CONTEXT_RETENTION.md).

- **TASK-057 / REQ-TEST-EFFICACY (R1).** `mutation-sweep` stubs `bin/<name>` to exit 0 and
  runs `bin/<name>-test` against a scratch copy, honouring both root conventions (first
  argument and `DOTFILES_DIR`). The stub records its own invocation, so a test that passes
  without ever running it is UNSWEEPABLE by name rather than counted healthy. Against the
  real repository: 30 pairs, **28 BITES, 0 SURVIVED**, 2 UNSWEEPABLE (`ai-hooks-install`,
  `secrets-env`), 15 tests unpaired by name and listed. **The honest limit, recorded rather
  than buried under the 28:** this operator would not have caught the defect that motivated
  it. TASK-054 fixed four cases in `resume-brief-test` keyed on a heading string no longer
  emitted — vacuous cases inside a test that still exercises its subject and still bites.
  Wholly empty tests: none exist. Partially vacuous cases need a finer operator.

- **TASK-056 / REQ-GATE-INSTRUMENTS (R1).** `ai-memory-hygiene`'s size check returned at
  the advisory limit (`projectMaxBytes` 20,000) before reaching the router comparison
  (`routerMaxBytes` 12,000), so its "can NEVER be selected" branch could not execute for
  any project file between them. Two were in that gap while the gate reported zero
  issues: `tokophi-project.md` (15,573 B) and `pi-9router-setup.md` (14,671 B), both now
  reported as UNROUTABLE rather than as a size complaint. `MEMORY.md` is exempt — it is
  the hand-read index, never a router candidate, and the coverage gate excludes it for
  the same reason. Both mutations bite.

- **TASK-055 / REQ-GATE-INSTRUMENTS (R1).** `skill-check` reported the registry total
  from an awk line-scan, over by 188 characters across 36 skills: it counted the folded
  `>-` marker as description text and kept the quotes and doubled `''` escapes of
  single-quoted scalars. It now counts the parsed value when PyYAML is present — 33,955,
  matching PyYAML exactly — and labels the number approximate when it is not. This is the
  one figure a task can be held to; TASK-049's verification used it.

- **TASK-054 / REQ-TASK-LEDGER-CONSISTENCY (R1).** `resume-brief` built its candidate
  list from `.delivery/runs`, so a contract nobody had started was not in it at all: the
  eight tasks accepted on 2026-09-04 produced "0 ready to start". An accepted `###`
  contract with no run now reads `READY / no run`; a bullet does not, because
  `TASK-012` is dormant by design and listing it would be noise dressed as a queue.
  Two headings that claimed every listed row had evidence are corrected. Three
  mutations bite, and four existing cases that keyed on the old heading were updated
  rather than left to pass on a string that no longer appears.

- **TASK-053 / REQ-DEAD-ARTIFACTS (R0).** Removed `config/omp/config.yml.lock` (0 bytes,
  no reader, covered by no ignore rule — 2026-08-15 audit P2-13), `docs/dev-setup.md`
  (a redirect nothing linked to; the `dev-setup.md` hits in a naive grep are all
  `linux-dev-setup.md`, a different file that stays), and `docs/preview/` (68 KB, six
  files; its only inbound link was a README line removed in `3d5fb69`). `config/omp/*.lock`
  is now ignored, and the rule was proven by recreating the file and watching `git`
  ignore it. Review confirmed independently that OMP 18.1.5 creates no lock on either
  the read or the write path, and that `docs/preview/` was never published: no Pages,
  no `CNAME`, no deploying workflow.

- **TASK-052 / REQ-PUBLIC-README (R1) — superseded 2026-09-04 by owner decision.** The
  72-line version described the whole AI engineering setup on a repository `gh api` reports
  public. The owner replaced it with a three-line placeholder; the contract's own Escalation
  Condition anticipated exactly this ("the owner prefers the short version — valid, and
  closes this task"). Original entry follows.
- **TASK-052 (original).** `README.md` had been 0 bytes on `origin/main`
  since `6e2bf36`, a memory-cleanup commit whose stat reads `README.md | 5 --`. The
  commit message calls the repository public; `gh api` says `private` as of 2026-09-04,
  and I had trusted `dev-toolchain-mise.md` instead of the check CLAUDE.md names for
  exactly this claim. The README itself never asserted visibility. 72 lines: what the repository owns, what it deliberately does not
  (OMP runtime config, secrets, device facts, repository truth), install, the three
  daily commands, where authority lives, and the safety boundary. Every command, path
  and link verified against disk; no model selector or version string to chase.

- **TASK-051 / REQ-MEMORY-ROUTING-COVERAGE (R2, reviewed).** 26 of 69 project-memory
  files were reachable through the router; now 69, with `ai-policy-lint` failing by
  name on an unrouted file, a dangling route, or an `unrouted` entry with no reason.
  A project key may name a list, each entry able to carry triggers. Review caught two
  defects I did not see: a flat +20 trigger bonus put project memory at 110 and
  displaced `.delivery/current.json` and `STATUS.md` from real queries — inverting
  this router's own rule that repository evidence is authoritative, now banded under
  94; and the runtime-evidence command in the contract returned no project file at
  all, because a bare "deploy" does not make `project_needed` true.

- **TASK-049 / REQ-SKILL-DISCOVERY (R2, escalated R3, two reviews).** Ten heaviest descriptions
  8,398 -> 7,155 characters; registry 35,288 -> 34,045; longest 760. Sixteen terms and clauses were
  cut and restored across four rounds, each found by a check the previous round had passed: a
  quoted-string diff missed unquoted capability names, a token diff missed meaning changes inside
  a preserved sentence. The original targets (≤600 each, −3,000 total) were unmeasured guesses,
  dropped rather than renegotiated. Value is modest and recorded as such: 3.5 % crosses no
  truncation threshold, and `content`, `design-taste`, `native-first` and `google-ads-signal-engine`
  were touched for 299 characters combined — churn a future trim should skip.

- **TASK-050 / REQ-SKILL-DISCOVERY (R1).** The payment row named only Stripe, which no
  project uses. `development-kit`, `development-spec-suite` and `full-stack-development`
  now route to `stripe-best-practices`, `doku-malaysia-integration`, `autolaris-h2h` and
  `mengantar-api`. Only the `full-stack-development` owner matrix is gate-validated — the
  lint reads `skills/local/*/SKILL.md`, so `references/` files and bullets are not — and all
  four of the 65 -> 69 new references come from it. `ai-traffic-os` and
  `automated-traffic-pipeline` name each other and `seo-website-builder` in code spans.
  Mention-rule isolated skills: 17 -> 13.

- **TASK-048 / REQ-SKILL-DISCOVERY (R1).** `skill-map` renders `skills/local/README.md`
  from frontmatter — 66 skills in 11 domains, each row carrying its first registry
  sentence, vendored/fork mark, and the siblings it routes to. `--check` fails a stale
  map by name and `ai-policy-lint` runs it. `skill-map-test` is 10 cases, 7 of them
  mutations; the first run found three real defects. `memory/skills.md` points at the
  map (9,468 bytes, under the 12,000 router budget). The map records 17 skills nothing
  routes to — the input TASK-050 acts on.

- **TASK-047 / REQ-TASK-LEDGER-CONSISTENCY (R1).** TASK-042 and TASK-043 closed by
  re-executing the checks their contracts name, not by assertion; both had been
  `BLOCKED` since 2026-09-01 under the rule `3820a1e` relaxed. TASK-045
  (`REQ-CROSS-DEVICE-VERIFICATION`) and TASK-046 (`REQ-LEDGER-SEMANTICS`) ended PASS
  in `.delivery/runs/` on 2026-09-01 and had no record here; they are recorded now.
  `resume-brief`: every live task with recorded evidence ends in PASS.

## Done

Archived under `docs/archive/`, newest `DOTFILES_TASKS_2026-09-01_DEVICE_VERIFICATION.md`
(TASK-038–041, 044; prose closures for TASK-013/022/027/028).

## Pending

The 2026-09-04 queue (TASK-047..056) is complete; see Recently completed.

- **TASK-012 / AUDIT-MON-01 — measure real skill effectiveness (R0).** Dormant until five immutable delivery records exist for one skill; then `ai-skill-evolution --repo <repo> --dotfiles ~/dotfiles --json`. Never fabricate attribution.
