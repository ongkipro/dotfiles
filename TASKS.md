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

### TASK-055: The registry is measured with the wrong ruler
- **Requirement:** REQ-GATE-INSTRUMENTS
- **Risk Level:** R1
- **Allowed Paths:** `skills/agents-bin/skill-check`, `bin/skill-check-test`, `TASKS.md`
- **Protected Paths:** `skills/local/**`
- **Canonical Contract Owners:** `skills.discovery`
- **Accepted Invariants:** the reported description-character total is counted from the parsed YAML when PyYAML is present, and says it is approximate when it is not; the existing loud degradation notice is unchanged
- **Regression Checks:** `skill-check-test`, `ai-policy-lint`
- **Runtime Evidence:** measured 2026-09-04 — awk counts 34,061 where PyYAML counts 33,873, over by 188 across 36 skills: +3 wherever a folded `>-` marker is counted as text, and +14 to +36 on `adr-record`, `mermaid-diagram`, `openapi-spec`, `supabase-stack`, whose single-quoted scalars keep their quotes and doubled `''` escapes
- **Reopen Conditions:** the two counts diverge again
- **Non-Scope:** any SKILL.md; the 1,024 guideline
- **Verification:** `bin/skill-check-test` covers a folded and a single-quoted fixture
- **Escalation Conditions:** PyYAML is unavailable on a device that must report an exact number

### TASK-056: A hygiene branch that cannot execute
- **Requirement:** REQ-GATE-INSTRUMENTS
- **Risk Level:** R1
- **Allowed Paths:** `bin/ai-memory-hygiene`, `bin/ai-memory-hygiene-test`, `config/ai/memory-hygiene.json`, `TASKS.md`
- **Protected Paths:** `config/ai/memory/**`, `config/ai/project-memory/**`
- **Canonical Contract Owners:** `memory.routing`
- **Accepted Invariants:** a memory file larger than `routerMaxBytes` is reported as never selectable even when it is under `projectMaxBytes`; the advisory-limit warning keeps its own wording
- **Regression Checks:** `ai-memory-hygiene-test`, `ai-policy-lint`
- **Runtime Evidence:** `check_size` returns at `size <= limit` with `limit = projectMaxBytes` (20,000) before `routerMaxBytes` (12,000) is consulted, so the "can NEVER be selected" branch is unreachable for any project file between the two. `tokophi-project.md` (15,573 B) and `pi-9router-setup.md` (14,671 B) are in that state and `ai-memory-hygiene` reports zero issues. The router names them at query time, but `ai-memory-access` — the command the hook actually runs — prints only files, never reasons, so nothing reaches a session
- **Reopen Conditions:** a file between the two limits passes the gate
- **Non-Scope:** splitting either file; changing either limit
- **Verification:** `bin/ai-memory-hygiene-test` fails on a 15,000-byte fixture before the fix
- **Escalation Conditions:** the two limits are found to be deliberately independent

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

