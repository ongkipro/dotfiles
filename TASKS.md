# Tasks — dotfiles

Updated: 2026-08-16

Every implementation task traces to one accepted requirement, declares its risk
class, defines explicit boundaries, and includes a runnable completion check.

**Requirement source.** This repository has no `PRD.md`; it is infrastructure,
not a product. Requirements here are stated **inline in each task and each Done
entry** — the `AUDIT-*` labels are internal handles for those statements, not
citations of an external document. Do not go looking for a file that defines
them; this file is self-contained by design.

The prior audit `docs/DOTFILES_REPOSITORY_AUDIT_2026-08-15.md` uses its own
`P0-*`/`P1-*` scheme and remains the record for findings it triaged that are not
restated here. The two schemes are deliberately disjoint and there is no mapping
table; where an item appears in both, the entry below says so.

**Authority.** This file owns task state only. Runtime truth stays on disk;
`ai-doctor`, `ai-policy-lint`, and the `bin/*-test` suite are the arbiters of
whether a task is actually done.

---

## Task Execution Contract Template

```markdown
### TASK-000: [Short Task Title]
- **Requirement:** AUDIT-X-00
- **Risk Level:** R1 (R0=negligible, R1=low/bounded, R2=moderate, R3=correctness/sensitive, R4=architecture/critical)
- **Job:** implementation (or review, research, migration, release)
- **Capability:** [Owning skill or specialist capability]
- **Execution Class:** volume / precision / judgment
- **Model / Provider / Reasoning:** [Resolved route]
- **Scope:** [Exact files or components to touch]
- **Non-Scope:** [Explicitly untouched paths or systems]
- **Verification:** [Runnable check]
- **Escalation Condition:** [When to stop and ask]
```

---

## In progress

No task is in progress.

---

## Pending


### TASK-005: Decide the four unvendorable skills
- **Requirement:** AUDIT-H-03 (residual). 14 of 51 skills now carry `.source` and refresh cleanly. Four do not; each now carries a `.local-fork` file recording why, so the reason survives the next session. What remains is the decision itself.
- **Risk Level:** R1
- **Job:** review
- **Execution Class:** judgment
- **Model / Provider / Reasoning:** user decision per skill.
- **The four:**
  - **`gsap-scrolltrigger`** — **decided and actioned.** Reported upstream 2026-08-16 as [greensock/gsap-skills#18](https://github.com/greensock/gsap-skills/issues/18); no duplicate existed. Stays a fork until upstream's snippet actually moves the element — writing the issue surfaced that a `Math.max` typo fix alone is *not* enough, because `Math.max(0, innerWidth - offsetWidth)` is `0` whenever content overflows, which is the only case this recipe is for. Re-diff before wiring `.source`; do not treat the issue closing as the signal. Recheck command is in `.local-fork`.
  - **`cloudflare`** — both files 248 lines, single-line divergence on the frontmatter `description`, which locally carries the sibling-routing clause. **Upstream the clause, or accept a permanent one-line fork.**
  - **`wrangler`** — **resolved 2026-08-16; now vendored.** It was never drift: local SKILL.md 1–281 is byte-identical to upstream 1–281, and upstream 282–922 is byte-identical to local `references/bindings-cli-reference.md` 8–648. Only a 10-line pointer stub and a 7-line header are ours. `_refresh-vendored.sh` now understands a `split_of:` declaration and *verifies* such a skill — reassembles the parts, compares to upstream, never writes — because where to cut is an editorial call a script would mangle. `.source` is wired and `.local-fork` is gone. Covered by `bin/vendored-refresh-test`.
  - **`sandbox-sdk`** — **resolved 2026-08-16; retired.** Upstream split it into a `sandbox-next` / `sandbox-stable` pair gated on the installed `@cloudflare/sandbox` npm tag, plus a migration guide. Both halves of the pair are adopted and vendored with `.source`, verified byte-identical. `sandbox-migrate-to-next` is deliberately **not** carried: it is a one-time porting guide for a migration not being done here, and it is the largest of the three, so it would spend registry description budget on a job that may never happen. Adopt it if a port to 1.0 is ever actually scheduled. The old local copy is deleted rather than kept — its `references/` held an API snapshot for a version that has since gone to 1.0 preview, and a stale API reference is worse than none. `cloudflare`'s sibling-routing clause was repointed in the same change; it named the retired skill.
- **Verification:** each of the four either gains a verified `.source` or keeps its `.local-fork` with a decision recorded.
- **Escalation Condition:** none — this task is entirely decisions.


### TASK-007: Verify the macOS installer changes on a Mac
- **Requirement:** AUDIT-M-05 (residual) — TASK-009's changes are correct by reading and pass every test runnable on Linux, but the macOS path itself has never been executed.
- **Risk Level:** R2
- **Job:** review
- **Execution Class:** precision
- **Model / Provider / Reasoning:** must run on `ongkis-MacBook-Air`, `irwansyahs-MacBook-Air`, or `Olans-MacBook-Pro`.
- **Scope:** run `install-macos.sh` twice on a real Mac; confirm it is idempotent, that a backup appears the first time an rc file is touched and not the second, and that the mise-absent branch prints instead of executing.
- **Verification:** `bin/installer-link-test`, `bin/shell-wrapper-test`, and `ai-doctor` all pass on that Mac.
- **Escalation Condition:** any rc file gains a duplicate line on the second run.

---

## Done

Closed 2026-08-16, verified by **31 suites, all passing** — 30 `bin/*-test`
plus `config/ai/hooks/git-guard.test.sh` (47 guard cases) — together with
`skill-check` (51 skills, 0 failures, 0 warnings) including a real PyYAML parse
of every frontmatter, `ai-policy-lint` PASSED, `ai-memory-check` OK, and
`security-check` clean. All changes are in the working tree, none committed.

- **TASK-006 — project memory routing is complete at 28/28.** `pi-src` looked unroutable because it has no permanent checkout, but the memory file states the repository is `earendil-works/pi`, and the router resolves a project by directory name *or* by the basename of `git remote get-url origin`. A default clone of that repo produces `pi` on both paths, so the key is derived from what the file already records rather than guessed. Verified against a simulated clone: the project resolves and `pi-src.md` is returned for "pi project reference", "known issue in pi", "what is pi", and an explicit `--scope project`. No orphans remain.
- **TASK-002 — every template in `config/templates/` is now rendered, and three were deleted rather than wired up.** `project-init` rendered 9 of 13 templates. The four it skipped were not an oversight to fix by adding them: `README.md` links to `./FLOW.md`, `./SPECS.md`, and `./NOTES.md`, so a repo that did get them would have had three dangling links, and a repo that did not got no README at all. Checking the placeholders settled it — `project-init` substitutes 16 names, and FLOW needs 33 of which 31 are unsubstituted, NOTES 12 of which 8 are, SPECS 22 of which 19 are. All three would have rendered as literal `{{PLACEHOLDER}}` text and tripped the suite's own `grep -Rqs '{{[^}]*}}'` assertion. They were speculative scaffolding, so they are deleted per the repo's own YAGNI rule. README is now rendered, its Quick Links point only at documents `project-init` actually creates, and its three unsubstituted `{{FEATURE_*}}` placeholders are gone — a feature list written before the feature exists is a promise, not documentation. Verified with a scratch init: ten files, zero unresolved placeholders, all nine README links resolve.
- **TASK-001 — fast-forwarded onto `42181a1` and the local work re-applied.** `git stash push -u` → `git merge --ff-only` → `git stash pop`, exactly as mapped; no force-push, no `reset --hard`. Three files conflicted, as predicted, and no others. `README.md` kept the local rewrite plus a new authority-table row for `docs/project-init.md`. `bin/project-init` took upstream's `bootstrap()` and its 9-parameter `render_contract()` signature while keeping the local root-level FILES contract, and dropped the now-redundant `mkdir -p docs` — the render loop already does `mkdir -p "$(dirname "$dst")"` per file. `bin/project-init-test` kept upstream's rewritten suite with its path lists corrected to root and the local decision-register assertion restored. Verified: 31/31 suites, and a scratch `project-init` run renders all nine root contract files with no stray `docs/` directory. Nothing lost — 27/27 untracked files and 84/84 tracked changes accounted for against a pre-merge snapshot.
- **TASK-004 — the learning loop is connected, and so is the guard it turned out to share a root cause with.** The telemetry chain had never received a record: `~/.config/ai-local/memory-usage/` did not exist. Investigating the caller gap surfaced a second, more serious instance of the same pattern — `~/.claude/settings.json` is device-local and nothing in the repo installed the `PreToolUse` entry that invokes `git-guard.sh`, while `ai-doctor` only ran the guard's *test script*. A fresh device could report a clean bill of health with the force-push guard entirely absent. Fixed together: `config/ai/claude-hooks.json` declares canonical wiring; `bin/ai-hooks-install` reconciles it into settings.json idempotently, refusing to write when the file is unparseable or `hooks` is the wrong shape, taking a backup, and leaving every device-local key untouched; `bin/ai-hooks-install-test` covers all of that and was proven non-vacuous against two sabotages; `ai-doctor` now checks wiring, and was proven to warn when pointed at a hookless settings file. `config/ai/hooks/memory-usage.sh` is wired as `UserPromptSubmit` and fails **open** — the opposite of git-guard, because observability must never block a turn. Verified end to end: a prompt about Shopify conventions routed `memory/shopify.md` and recorded it; run inside `~/Projects/kamus` the project resolved correctly; `ai-memory-lifecycle` now reads a real store and honestly reports `INSUFFICIENT_OBSERVATION` instead of advising from nothing.
- **TASK-008 — document-system precedence.** `config/ai/AGENTS.md` now resolves the three PRD producers and two architecture producers in one ordered rule: an existing file wins, then `prd-taskbreaker` for a feature, then `development-spec-suite` when the specification domains genuinely apply, with `config/templates/` explicitly producing neither.
- **TASK-009 — macOS installer parity.** `install-macos.sh` no longer executes `curl -fsSL https://mise.run | sh`; it prints it as a manual step in a heredoc, matching `install.sh`'s posture. `ensure_line()` now takes a timestamped backup before its first append to a non-empty rc file, and its pre-existing exact-line match keeps it idempotent for users whose rc files already carry the unmarked lines. Hardening `ensure_line` in place was chosen over porting `ensure_shell_source`: only 2 of the 6 macOS lines fit the "source one tracked file under a marker" shape, so a port would have needed a bespoke second path for the other 4.
- **TASK-010 — `skill-check` validates for real.** It parsed frontmatter with an awk line-scanner, so it passed a file PyYAML rejects outright. It now parses with PyYAML when available and degrades to the awk path with an explicit banner when not — proven by shimming a python3 that fails only on `import yaml`. Added a per-skill description-length warning beside the existing aggregate. Also fixed pre-existing misleading output: a skill that failed a check still printed `OK` afterwards, so the tool contradicted itself on the same line pair; `OK` is now conditional on that skill having no failures.
- **AUDIT-H-01 — the OMP routing swap is accepted, and its hidden consequence is documented.** `default` moves to Codex GPT-5.6 Sol High on the owner's stated criterion of development precision. The 2026-08-12 evidence baseline supports it on its own terms: `gpt-5.6-sol` measured a 5.2% tool-call error rate and a 1.00-call loop against Gemini's 7.8%, for ~13% more per call. The consequence nobody had flagged: `default`, `task`, `slow`, and `plan` now resolve to the identical model and tier, so escalating `default` → `slow` is a no-op — ROUTING.md had promised that escalation as "normal and expected" and has been rewritten to say escalation is cross-vendor now. Also corrected: the capacity-pool paragraph still claimed Antigravity carries the main session, and the R1 row still named the nonexistent `cheap-dev` lane. Recorded in `config/omp/BUILD-LOG.md`; `omp-routing-test` OK.
- **AUDIT-H-05 / AUDIT-L-05 — three git-guard holes closed, and one self-inflicted regression caught and fixed.** The forced-refspec rule now matches a bare `+ref`; the invocation matcher accepts a path-prefixed `git` and a backslash-escaped `\git`. Adversarial review then found the first fix over-matched: after quote-stripping, free text carried by `-o`/`-m` (`-o merge_request.title="Draft: +1 fix"`) looked exactly like a `+ref` and was wrongly prompted. The bare-`+` rule now skips segments carrying a free-text option while the unambiguous colon form always applies — a guard that cries wolf stops meaning anything. Suite grew 23 → 47 cases. `$(which git) push --force` remains uncovered, in the same class as the `bash -c` wrapper the header already discloses.
- **AUDIT-M-08 — direct tests for the deploy gates.** New `bin/production-gate-test` and `bin/rollback-check-test` cover reviewer-independence, review-head resolvability and ancestry, post-review content tampering, the mid-run HEAD-moved recheck, and rollback-ref validation. Every assertion was proven non-vacuous by neutering the corresponding guard in a throwaway sandbox — four probes, four catches, plus one independent re-probe.
- **AUDIT-H-03 — vendored skills are refreshable.** 14 of 51 carry `.source`, up from 1. Every URL was fetched and byte-compared before being written. `_refresh-vendored.sh gsap-core` ran end to end and reported "up-to-date" without rewriting anything. The four exceptions carry `.local-fork` files recording why; `.local-fork` was verified inert to the refresh script, which gates strictly on `.source`.
- **AUDIT-M-02 — memory routing.** Shared memory 9/13 → 13/13. Project memory 18 → 27 of 28, from explicit `~/Projects/<name>` paths stated in the memory files themselves. Overbroad `shopify.md` triggers (`theme`, `listing`) tightened after review showed they hijacked unrelated queries.
- **AUDIT-M-07 — English-only doctrine.** The reported violation was one skill; the sweep found six files across `memory/`, `project-memory/`, and `project-memory-kelola/`. All translated with every path, command, date, and version preserved verbatim.
- **AUDIT-M-03 / AUDIT-M-04 — environment memory matches disk.** `rich` added with a note that `devices/` outranks the list. Corrected: ripgrep is not installed at all — `command -v rg` is empty in a clean shell, and the only binary is one bundled inside another CLI — while `config/ripgreprc` is still linked. `jq` is declared in mise but missing; the guard survives on `/usr/bin/jq`.
- **AUDIT-M-01 — MASTER_BLUEPRINT corrected.** Thirteen roles, the missing `discovery` role documented, two stale Gemini 3.6 references fixed, `config.yml` named as authority, and `default`'s pool reconciled with a note about the pending TASK-003 decision. README's authority table now lists MASTER_BLUEPRINT and the 08-15 audit.
- **AUDIT-H-04 / AUDIT-L-01 — skill boundaries.** `cloudflare` defers to its seven siblings; `seo-website-builder` and `automated-traffic-pipeline` split programmatic SEO between page-set strategy and generation pipeline. The `cloudflare` clause initially broke YAML — caught, fixed, and the class of defect logged as TASK-010.
- **AUDIT-H-02 — `config/omp/config.yml`** cleaned to zero trailing-whitespace lines with its final newline restored; still valid YAML, 13 roles, `approvalMode: yolo`.
- **AUDIT-L-03 — `bin/tmux-clip`** gained `set -euo pipefail` and an explicit failure branch; it now exits 1 with a message instead of silently discarding stdin.
- **AUDIT-M-06 — `aussie-sawit-malaysia.md`** carries an authority header demoting its 32K body to a dated log and pointing at the repository's own `STATUS.md`.
