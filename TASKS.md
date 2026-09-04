# Tasks — dotfiles

Updated: 2026-09-04

The sole executable queue. Completed contracts live under `docs/archive/`;
repository tests and runtime evidence outrank prose.

## Task contract

Fields and risk rules: `config/templates/TASKS.md`. R0 may infer one obvious file;
R1 stays bounded; R2 names its surface; R3/R4 add protected surfaces and review.
Only the dependency edge is human-authored; state is derived.

## In progress

_None._

## Recently completed

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

Seeded by `docs/DOTFILES_REVIEW_2026-09-04.md`; run in order.

### TASK-047: Record what the ledger already knows
- **Requirement:** REQ-TASK-LEDGER-CONSISTENCY
- **Risk Level:** R1
- **Allowed Paths:** `TASKS.md`, `.delivery/**`
- **Protected Paths:** `bin/delivery-ledger`
- **Canonical Contract Owners:** `runtime.ledger`
- **Accepted Invariants:** every completed task here ends in PASS and every PASS run has a record here; closure runs re-execute checks
- **Regression Checks:** `resume-brief-test`, `ai-policy-lint`
- **Runtime Evidence:** TASK-042/043 closed the `d479ceb` way — a new run each re-running `toolchain-path-test` and `device-verify-test`; TASK-045/046 recorded
- **Reopen Conditions:** a completed task's latest run is not PASS
- **Non-Scope:** rewriting `.delivery/runs/*`; PASS semantics
- **Verification:** `bin/resume-brief` shows no live task whose evidence is not PASS
- **Escalation Conditions:** a re-executed check fails

### TASK-049: Trim the ten heaviest discovery descriptions
- **Requirement:** REQ-SKILL-DISCOVERY
- **Risk Level:** R2
- **Depends On:** TASK-048
- **Allowed Paths:** `skills/local/ui-validation/SKILL.md`, `skills/local/prd-taskbreaker/SKILL.md`, `skills/local/cloudflare/SKILL.md`, `skills/local/cloudflare/.local-fork`, `skills/local/storefront-ux/SKILL.md`, `skills/local/seo-website-builder/SKILL.md`, `skills/local/storefront-development/SKILL.md`, `skills/local/native-first/SKILL.md`, `skills/local/design-taste/SKILL.md`, `skills/local/google-ads-signal-engine/SKILL.md`, `skills/local/content/SKILL.md`, `skills/local/README.md`, `TASKS.md`
- **Protected Paths:** every other `skills/local/**` path
- **Canonical Contract Owners:** `skills.discovery`
- **Accepted Invariants:** only `description:` changes; every trigger phrase, named sibling, and hand-off present on 2026-09-04 survives; each ends ≤ 600 characters; registry total falls ≥ 3,000; `cloudflare` keeps the sibling-routing clause its `.local-fork` protects, with that note updated
- **Regression Checks:** `skill-check-test`, `skill-map-test`, `ai-policy-lint`, `vendored-refresh-test`
- **Runtime Evidence:** before/after per skill recorded in the run, triggers enumerated; independent review of the ten diffs
- **Reopen Conditions:** a 2026-09-04 routing phrase is missing, or a runtime stops surfacing a trimmed skill for a prompt that did
- **Non-Scope:** body text; the other 56 skills; the 1,024 guideline
- **Verification:** `skills/agents-bin/skill-check` reports ≤ 32,200 description characters
- **Escalation Conditions:** 600 needs dropping a hand-off another skill depends on

### TASK-050: Route payments and traffic to the owners that exist
- **Requirement:** REQ-SKILL-DISCOVERY
- **Risk Level:** R1
- **Depends On:** TASK-048
- **Allowed Paths:** `skills/local/development-kit/references/reference-map.md`, `skills/local/development-spec-suite/SKILL.md`, `skills/local/full-stack-development/SKILL.md`, `skills/local/ai-traffic-os/SKILL.md`, `skills/local/automated-traffic-pipeline/SKILL.md`, `skills/local/README.md`, `TASKS.md`
- **Protected Paths:** `skills/local/stripe-best-practices/**`
- **Canonical Contract Owners:** `skills.routing`
- **Accepted Invariants:** "Billing and payments" names `doku-malaysia-integration`, `autolaris-h2h`, `mengantar-api` beside `stripe-best-practices`; `ai-traffic-os` and `automated-traffic-pipeline` name each other and `seo-website-builder`; new references resolve under the routing-graph check
- **Regression Checks:** `ai-policy-lint`, `skill-map-test`
- **Runtime Evidence:** the map's isolated count falls from 17 — the mention rule (a code span anywhere in SKILL.md, 256 edges), not the stricter routing-table rule `ai-policy-lint` resolves; no provider skill remains in it
- **Reopen Conditions:** a provider skill lands with no row routing to it
- **Non-Scope:** removing `stripe-best-practices`; traffic skills beyond the hand-off sentence
- **Verification:** `bin/ai-policy-lint`
- **Escalation Conditions:** two skills claim one provider

### TASK-051: Every memory file is reachable, or says why not
- **Requirement:** REQ-MEMORY-ROUTING-COVERAGE
- **Risk Level:** R2
- **Allowed Paths:** `config/ai/memory-router.json`, `bin/ai-memory-route`, `bin/ai-memory-route-test`, `bin/ai-policy-lint`, `config/ai/project-memory/MEMORY.md`, `TASKS.md`
- **Protected Paths:** `config/ai/memory/**`, `config/ai/project-memory/*.md`, `config/ai/hooks/memory-usage.sh`
- **Canonical Contract Owners:** `memory.routing`
- **Accepted Invariants:** a project key may route several files or a filename prefix, by priority within the unchanged 3-file/12,000-byte budget; every `project-memory/*.md` is reachable via a key or lesson trigger, or sits in one `unrouted` array with a reason, and `ai-policy-lint` fails any file in none; keys resolve; the hook stays fail-open
- **Regression Checks:** `ai-memory-route-test`, `ai-memory-access-test`, `memory-usage-hook-test`, `ai-policy-lint`
- **Runtime Evidence:** `ai-memory-access --repo ~/projects/tokophi "deploy"` selects a deploy-specific file; an unrouted fixture fails the lint by name; `petcue-theme` resolves `petcue`
- **Reopen Conditions:** a memory file lands unrouted and the lint stays green
- **Non-Scope:** memory content; `maxFiles`/`maxBytes`; `project-memory-kelola/**`
- **Verification:** `bin/ai-memory-route-test`
- **Escalation Conditions:** a project's top files cannot fit the budget

### TASK-052: A public repository with a README
- **Requirement:** REQ-PUBLIC-README
- **Risk Level:** R1
- **Allowed Paths:** `README.md`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `docs.entrypoint`
- **Accepted Invariants:** English, under 120 lines: what the repository is, what it owns and deliberately does not, how a device installs it, daily commands (`ai-doctor`, `dotsync`, `resume-brief`), where authority lives; no model selector or version string
- **Regression Checks:** `ai-memory-check`, `ai-policy-lint`
- **Runtime Evidence:** `git cat-file -s origin/main:README.md` non-zero after push; links resolve
- **Reopen Conditions:** it names a command absent from `runtime-commands.txt` or a missing document
- **Non-Scope:** restoring `17021c1` wholesale (P1-16)
- **Verification:** `bin/ai-memory-check .`
- **Escalation Conditions:** the owner prefers the 92-byte `3d5fb69` version — valid, and closes this task

### TASK-053: Delete what nothing reads
- **Requirement:** REQ-DEAD-ARTIFACTS
- **Risk Level:** R0
- **Allowed Paths:** `config/omp/config.yml.lock`, `.gitignore`, `docs/dev-setup.md`, `docs/preview/**`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `docs.hygiene`
- **Accepted Invariants:** each deletion follows a fresh search proving no reader, link, or installer reference; `config/omp/*.lock` is ignored afterwards; `ai-memory-check .` stays green
- **Regression Checks:** `ai-memory-check`, `ai-policy-lint`, `omp-effective-routing-test`
- **Runtime Evidence:** `grep -rn` per removed path over `bin/ install*.sh .github/ config/ docs/ skills/` hits only the audit
- **Reopen Conditions:** any of the three returns
- **Non-Scope:** the four `docs/DOTFILES_*.md` (P1-16/P2-14 move is a separate decision)
- **Verification:** `bin/ai-policy-lint`
- **Escalation Conditions:** `docs/preview/` is published or bookmarked elsewhere

### TASK-054: A contract with no run is a candidate too
- **Requirement:** REQ-TASK-LEDGER-CONSISTENCY
- **Risk Level:** R1
- **Depends On:** TASK-047
- **Allowed Paths:** `bin/resume-brief`, `bin/resume-brief-test`, `TASKS.md`
- **Protected Paths:** `bin/delivery-ledger`
- **Canonical Contract Owners:** `runtime.resume`
- **Accepted Invariants:** a live `###` contract with no ledger run lists as `READY` / `no run`, or `waiting` when a dependency lacks PASS — distinct from BLOCKED; archived tasks stay retired
- **Regression Checks:** `resume-brief-test`, `ai-policy-lint`
- **Runtime Evidence:** on this file TASK-048/051/052/053 show ready, TASK-049/050/054 waiting
- **Reopen Conditions:** an accepted contract is missing from the brief
- **Non-Scope:** picking the next task; ledger semantics
- **Verification:** `bin/resume-brief-test`
- **Escalation Conditions:** a no-run task is indistinguishable from a fenced example

- **TASK-012 / AUDIT-MON-01 — measure real skill effectiveness (R0).** Dormant until five immutable delivery records exist for one skill; then `ai-skill-evolution --repo <repo> --dotfiles ~/dotfiles --json`. Never fabricate attribution.

