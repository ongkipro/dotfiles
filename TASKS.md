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

- **TASK-052 / REQ-PUBLIC-README (R1).** `README.md` had been 0 bytes on `origin/main`
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

### TASK-057: A sweep that asks every test whether it would notice
- **Requirement:** REQ-TEST-EFFICACY
- **Risk Level:** R1
- **Allowed Paths:** `bin/mutation-sweep`, `bin/mutation-sweep-test`, `config/ai/runtime-commands.txt`, `TASKS.md`
- **Protected Paths:** `bin/*-test`, `bin/ai-doctor`, `bin/delivery-ledger`
- **Canonical Contract Owners:** `runtime.readiness`
- **Accepted Invariants:** for every `bin/<name>` with a `bin/<name>-test`, the sweep copies tracked files to a scratch root, replaces the subject with a stub that exits 0 (`exit 0` / `sys.exit(0)` after the shebang), runs `<name>-test <scratch-root>`, and reports one line per test: `BITES` (the test failed), `SURVIVED` (it passed — it asserts nothing about behaviour), or `UNSWEEPABLE` (the test resolves its subject from `$HOME/dotfiles` or its own path, so the stub was never exercised — 12 such tests on 2026-09-04, `skill-check-test`, `secrets-env-test`, `vendored-refresh-test` among them); exit 1 if any test SURVIVED; never writes outside the scratch root; never touches `~/dotfiles` or the working tree; the operator list is one explicit table in the script, and a second operator is added only with a case showing what the first one missed
- **Depends On:** TASK-056
- **Regression Checks:** `mutation-sweep-test`, `ai-policy-lint`, `installer-link-test`
- **Runtime Evidence:** the sweep's own fixture holds one test that bites, one that survives a stub, and one that hardcodes its subject path, and classifies each correctly; run against the real repository once and the table committed in the run's verification detail — this is the ranking the next queue is built from, so it is evidence, not a claim
- **Reopen Conditions:** a test classified BITES passes against a stubbed subject; a test the sweep calls UNSWEEPABLE actually reads `ROOT/bin`
- **Non-Scope:** fixing any surviving test; making an unsweepable test sweepable; per-guard mutations, which stay the in-test idiom (`make_mutant`); running under CI
- **Verification:** `bin/mutation-sweep-test`
- **Escalation Conditions:** a subject cannot be stubbed without also stubbing a helper the test needs

### TASK-058: Fourteen commands nothing tests
- **Requirement:** REQ-TEST-EFFICACY
- **Risk Level:** R2
- **Depends On:** TASK-057
- **Allowed Paths:** `bin/*-test`, `config/ai/runtime-commands.txt`, `TASKS.md`
- **Protected Paths:** `bin/dotpush`, `bin/vps-pgdump`, `bin/9router-credential-migrate`, `bin/tmux-setup`, `bin/device-register`, `bin/pi-update-safe`, `bin/ai-doctor`
- **Canonical Contract Owners:** `runtime.readiness`
- **Accepted Invariants:** each command gains a `bin/<name>-test` that resolves its subject via `ROOT/bin/<name>` so TASK-057 can sweep it; each first test carries at least one mutation that bites; no test performs a live push, ssh, package install, or secret read — side effects are proven against a fixture repo, a fake remote, or a dry-run flag, and a command with no such seam gets the seam first (as `--dry-run`), in a separate reviewed run; order is blast radius, not convenience: `dotpush` (commit+push), `vps-pgdump` (ssh, pg_dump, backups), `9router-credential-migrate` (secrets), `tmux-setup` (installs), `device-register` (writes committed files), `pi-update-safe`, `ai-doctor` (658 lines, the health command every other gate defers to, itself judged by nothing), then the read-only seven
- **Regression Checks:** `mutation-sweep`, `ai-policy-lint`, `installer-link-test`
- **Runtime Evidence:** `mutation-sweep` reports BITES for every new test; `ai-doctor --self-test` discovers all of them through its `bin/*-test` glob
- **Reopen Conditions:** a listed command regains a test-less state; a new `bin/` command lands without one and `ai-policy-lint` stays green — that gap is deliberate scope for a later task, not this one
- **Non-Scope:** behaviour changes to any command beyond adding a dry-run seam; the `-test` suffix convention
- **Verification:** `bin/mutation-sweep` exits 0 with the fourteen present
- **Escalation Conditions:** a command's only observable behaviour is the live side effect

- **TASK-012 / AUDIT-MON-01 — measure real skill effectiveness (R0).** Dormant until five immutable delivery records exist for one skill; then `ai-skill-evolution --repo <repo> --dotfiles ~/dotfiles --json`. Never fabricate attribution.

