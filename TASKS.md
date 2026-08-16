# Tasks — dotfiles

Updated: 2026-08-17

Every implementation task traces to one accepted requirement, declares its risk
class, defines explicit boundaries, and includes a runnable completion check.

**Requirement source.** This repository has no `PRD.md`; it is infrastructure,
not a product. Requirements here are stated **inline in each task and each Done
entry** — the `AUDIT-*` labels are internal handles for those statements, not
citations of an external document. Do not go looking for a file that defines
them; this file is self-contained by design.

The prior audit `docs/DOTFILES_REPOSITORY_AUDIT_2026-08-15.md` is an immutable
historical snapshot. A finding is live only when represented in this file;
dated audits and roadmaps do not own open or closed work.

**Authority.** This file is the sole owner of repository task state. Runtime
truth stays on disk; `ai-doctor`, `ai-policy-lint`, and discovered `bin/*-test`
fixtures determine whether the implementation still satisfies its contract.

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



### TASK-012: Measure real skill effectiveness
- **Requirement:** AUDIT-MON-01 — skill quality claims must distinguish structural review from observed delivery outcomes.
- **Risk Level:** R0
- **Job:** research
- **Capability:** `continuous-learning`, `delivery-skill-usage`, and `ai-skill-evolution`
- **Execution Class:** judgment
- **Model / Provider / Reasoning:** Resolve when real attribution evidence exists.
- **Scope:** Immutable, real `<repo>/.delivery/skill-usage/*.json` records produced by future delivery runs and the resulting `ai-skill-evolution` analysis.
- **Non-Scope:** Do not fabricate, backfill, or relabel synthetic fixtures as delivery evidence; do not rewrite routing or skills from a small sample.
- **Verification:** After at least five real attributed runs exist for a skill, run `ai-skill-evolution --repo <repo> --dotfiles ~/dotfiles --json` and review the evidence before changing that skill.
- **Escalation Condition:** Keep this task dormant while no real records exist; require human review before promotion, merge, disablement, or routing changes.

### TASK-013: Restore hosted GitHub Actions execution
- **Requirement:** AUDIT-CI-01 — the Ubuntu/macOS matrix must actually start runners; a workflow file plus local checks is not hosted portability evidence.
- **Risk Level:** R2
- **Job:** release
- **Capability:** GitHub account billing owner
- **Execution Class:** precision
- **Model / Provider / Reasoning:** Human-owned financial/account action; AI may only verify the resulting run.
- **Scope:** The GitHub billing or spending-limit condition blocking every `ongkipro/dotfiles` Actions job and a subsequent `development-spec-suite.yml` run.
- **Non-Scope:** Do not weaken or edit the workflow to hide the account block, dispatch paid work without approval, or treat local `ai-doctor --self-test` as hosted matrix evidence.
- **Verification:** A new `development-spec-suite.yml` run starts all four Ubuntu/macOS × Python 3.12/3.9 jobs with non-empty steps and reaches a normal pass/fail conclusion instead of GitHub's billing annotation.
- **Escalation Condition:** Any payment, plan, or spending-limit change requires Paduka Ongki's explicit billing approval.



---

## Done
- **2026-08-17 final remediation verification.** The original 53-skill audit baseline is fully reconciled; retiring `sandbox-sdk` in favor of `sandbox-stable` plus `sandbox-next` leaves 54 canonical skills. Final adversarial review found and closed two validator defects: fallback effort lists were word-split into a single invalid token, and tracked-overlay structural mode bypassed selector and effort checks. A negative overlay mutation now fails when an `xhigh` advisor has only `high` recovery, while valid Linux and real-Mac overlays pass. Shared/project memory was reduced to advisory repository pointers, accidental demo credentials were removed from tracked memory, and `ai-memory-hygiene --strict` reports zero issues. The complete `ai-doctor --self-test` passes every critical gate on Linux and in an isolated real-Mac fixture; Mac-only missing direct-provider catalogs remain explicit partial coverage rather than false failures.

- **TASK-011 / AUDIT-DEV-01 — effective routing reconciliation.** `bin/omp-effective-routing-test` is now the canonical complement to `bin/omp-routing-test`: the canonical gate validates the tracked base graph, while the effective gate validates the resolved device overlay and every tracked overlay template. The provider-union scan now reads provider IDs rather than serialized JSON, and tracked overlays derive their expected provider order from their own declaration. The declared `yq` tool was synchronized on `ongkis-MacBook-Air`; Linux structural validation and the Mac `minimax-hosted.yml` live-catalog run both pass.

- **2026-08-17 audit remediation — authority and managed-fork reconciliation.** The authoritative current managed-fork inventory has eight entries: `cloudflare`, `gsap-scrolltrigger`, `wrangler`, `cloudflare-email-service`, `durable-objects`, `gsap-frameworks`, `gsap-plugins`, and `stripe-best-practices`. `cloudflare` is accepted as a permanent managed fork: its one-line discovery override prevents the broad gateway from capturing work owned by narrower Cloudflare skills, and preserving correct local routing is more important than byte-identical vendoring. The other seven ledgers retain explicit upstream correction or removal gates. Integration evidence for this remediation reports `ai-doctor --self-test` green, with the zsh fixture `PARTIAL` because zsh is unavailable. The macOS follow-up is closed in TASK-007 below.
- **TASK-007 — macOS installer and runtime portability verified on 2026-08-17.** A current repository fixture ran on `ongkis-MacBook-Air` under an isolated temporary `HOME`, so no live rc files, packages, or credentials were changed. `install-macos.sh` completed twice; the first run created three expected rc backups, the second created none, and the zsh, bash, and profile source lines each remained at exactly one. `bin/installer-link-test` and `bin/shell-wrapper-test` passed on Darwin. The full `ai-doctor --self-test` initially exposed three real cross-platform defects: `/tmp` and `/private/tmp` aliases duplicated Markdown corpus entries, BSD `mktemp` rejected a template whose `XXXXXX` was followed by `.md`, and a device using an overlay lacked two base providers in its local OMP catalog. The checker now canonicalizes physical Markdown paths, `ai-learn` uses Python's cross-platform `tempfile.mkstemp(..., suffix=".md")`, and `omp-routing-test` warns and skips capability claims only when an entire provider is unavailable while still failing a missing model inside an available provider. The repeated full Mac suite then passed every critical gate; only the unavailable direct `openai-codex` and `anthropic` capability checks were accurately reported as partial. The active MiniMax overlay parsed through OMP and exposed the expected `minimax-code`, `opencode-go`, and 9Router catalogs.

### Historical closure through `b179960`

Closed 2026-08-16 and recorded on `main` through
`b179960e629884a3b72cbe0fdfb176c1a6e05220`. At closure, every fixture discovered
by the repository gate plus the Git guard passed, as did the aggregate skill,
policy, memory, and security checks. Run those executable gates for the current
inventory and current result; this historical Done record is not a pass claim
for a later revision.

- **TASK-006 — project memory routing is complete at 28/28.** `pi-src` looked unroutable because it has no permanent checkout, but the memory file states the repository is `earendil-works/pi`, and the router resolves a project by directory name *or* by the basename of `git remote get-url origin`. A default clone of that repo produces `pi` on both paths, so the key is derived from what the file already records rather than guessed. Verified against a simulated clone: the project resolves and `pi-src.md` is returned for "pi project reference", "known issue in pi", "what is pi", and an explicit `--scope project`. No orphans remain.
- **TASK-002 — every template in `config/templates/` is now rendered, and three were deleted rather than wired up.** `project-init` rendered 9 of 13 templates. The four it skipped were not an oversight to fix by adding them: `README.md` links to `./FLOW.md`, `./SPECS.md`, and `./NOTES.md`, so a repo that did get them would have had three dangling links, and a repo that did not got no README at all. Checking the placeholders settled it — `project-init` substitutes 16 names, and FLOW needs 33 of which 31 are unsubstituted, NOTES 12 of which 8 are, SPECS 22 of which 19 are. All three would have rendered as literal `{{PLACEHOLDER}}` text and tripped the suite's own `grep -Rqs '{{[^}]*}}'` assertion. They were speculative scaffolding, so they are deleted per the repo's own YAGNI rule. README is now rendered, its Quick Links point only at documents `project-init` actually creates, and its three unsubstituted `{{FEATURE_*}}` placeholders are gone — a feature list written before the feature exists is a promise, not documentation. Verified with a scratch init: ten files, zero unresolved placeholders, all nine README links resolve.
- **TASK-001 — fast-forwarded onto `42181a1` and the local work re-applied.** `git stash push -u` → `git merge --ff-only` → `git stash pop`, exactly as mapped; no force-push, no `reset --hard`. Three files conflicted, as predicted, and no others. `README.md` kept the local rewrite plus a new authority-table row for `docs/project-init.md`. `bin/project-init` took upstream's `bootstrap()` and its 9-parameter `render_contract()` signature while keeping the local root-level FILES contract, and dropped the now-redundant `mkdir -p docs` — the render loop already does `mkdir -p "$(dirname "$dst")"` per file. `bin/project-init-test` kept upstream's rewritten suite with its path lists corrected to root and the local decision-register assertion restored. Every fixture discovered by the gate passed at closure, and a scratch `project-init` run rendered the expected root contract with no stray `docs/` directory. Nothing was lost: the pre-merge snapshot accounted for every tracked and untracked path.
- **TASK-004 — the learning loop is connected, and so is the guard it turned out to share a root cause with.** The telemetry chain had never received a record: `~/.config/ai-local/memory-usage/` did not exist. Investigating the caller gap surfaced a second, more serious instance of the same pattern — `~/.claude/settings.json` is device-local and nothing in the repo installed the `PreToolUse` entry that invokes `git-guard.sh`, while `ai-doctor` only ran the guard's *test script*. A fresh device could report a clean bill of health with the force-push guard entirely absent. Fixed together: `config/ai/claude-hooks.json` declares canonical wiring; `bin/ai-hooks-install` reconciles it into settings.json idempotently, refusing to write when the file is unparseable or `hooks` is the wrong shape, taking a backup, and leaving every device-local key untouched; `bin/ai-hooks-install-test` covers all of that and was proven non-vacuous against two sabotages; `ai-doctor` now checks wiring, and was proven to warn when pointed at a hookless settings file. `config/ai/hooks/memory-usage.sh` is wired as `UserPromptSubmit` and fails **open** — the opposite of git-guard, because observability must never block a turn. Verified end to end: a prompt about Shopify conventions routed `memory/shopify.md` and recorded it; run inside `~/Projects/kamus` the project resolved correctly; `ai-memory-lifecycle` now reads a real store and honestly reports `INSUFFICIENT_OBSERVATION` instead of advising from nothing.
- **TASK-008 — document-system precedence.** `config/ai/AGENTS.md` now resolves the three PRD producers and two architecture producers in one ordered rule: an existing file wins, then `prd-taskbreaker` for a feature, then `development-spec-suite` when the specification domains genuinely apply, with `config/templates/` explicitly producing neither.
- **TASK-009 — macOS installer parity.** `install-macos.sh` no longer executes `curl -fsSL https://mise.run | sh`; it prints it as a manual step in a heredoc, matching `install.sh`'s posture. `ensure_line()` now takes a timestamped backup before its first append to a non-empty rc file, and its pre-existing exact-line match keeps it idempotent for users whose rc files already carry the unmarked lines. Hardening `ensure_line` in place was chosen over porting `ensure_shell_source`: only 2 of the 6 macOS lines fit the "source one tracked file under a marker" shape, so a port would have needed a bespoke second path for the other 4.
- **TASK-010 — `skill-check` validates for real.** It parsed frontmatter with an awk line-scanner, so it passed a file PyYAML rejects outright. It now parses with PyYAML when available and degrades to the awk path with an explicit banner when not — proven by shimming a python3 that fails only on `import yaml`. Added a per-skill description-length warning beside the existing aggregate. Also fixed pre-existing misleading output: a skill that failed a check still printed `OK` afterwards, so the tool contradicted itself on the same line pair; `OK` is now conditional on that skill having no failures.
- **AUDIT-H-01 — the OMP routing swap is accepted, and its hidden consequence is documented.** `default` moves to Codex GPT-5.6 Sol High on the owner's stated criterion of development precision. The 2026-08-12 evidence baseline supports it on its own terms: `gpt-5.6-sol` measured a 5.2% tool-call error rate and a 1.00-call loop against Gemini's 7.8%, for ~13% more per call. The consequence nobody had flagged: `default`, `task`, `slow`, and `plan` now resolve to the identical model and tier, so escalating `default` → `slow` is a no-op — ROUTING.md had promised that escalation as "normal and expected" and has been rewritten to say escalation is cross-vendor now. Also corrected: the capacity-pool paragraph still claimed Antigravity carries the main session, and the R1 row still named the nonexistent `cheap-dev` lane. Recorded in `config/omp/BUILD-LOG.md`; `omp-routing-test` OK.
- **AUDIT-H-05 / AUDIT-L-05 — three git-guard holes closed, and one self-inflicted regression caught and fixed.** The forced-refspec rule now matches a bare `+ref`; the invocation matcher accepts a path-prefixed `git` and a backslash-escaped `\git`. Adversarial review then found the first fix over-matched: after quote-stripping, free text carried by `-o`/`-m` (`-o merge_request.title="Draft: +1 fix"`) looked exactly like a `+ref` and was wrongly prompted. The bare-`+` rule now skips segments carrying a free-text option while the unambiguous colon form always applies — a guard that cries wolf stops meaning anything. Suite grew 23 → 47 cases. `$(which git) push --force` remains uncovered, in the same class as the `bash -c` wrapper the header already discloses.
- **AUDIT-M-08 — direct tests for the deploy gates.** New `bin/production-gate-test` and `bin/rollback-check-test` cover reviewer-independence, review-head resolvability and ancestry, post-review content tampering, the mid-run HEAD-moved recheck, and rollback-ref validation. Every assertion was proven non-vacuous by neutering the corresponding guard in a throwaway sandbox — four probes, four catches, plus one independent re-probe.
- **AUDIT-H-03 — vendored skills are refreshable.** The vendored set increased substantially at closure. Every URL was fetched and byte-compared before being written. `_refresh-vendored.sh gsap-core` ran end to end and reported "up-to-date" without rewriting anything. The four exceptions carried `.local-fork` files recording why; `.local-fork` was verified inert to the refresh script, which gates strictly on `.source`.
- **AUDIT-M-02 — memory routing.** Shared memory 9/13 → 13/13. Project memory 18 → 27 of 28, from explicit `~/Projects/<name>` paths stated in the memory files themselves. Overbroad `shopify.md` triggers (`theme`, `listing`) tightened after review showed they hijacked unrelated queries.
- **AUDIT-M-07 — English-only doctrine.** The reported violation was one skill; the sweep found six files across `memory/`, `project-memory/`, and `project-memory-kelola/`. All translated with every path, command, date, and version preserved verbatim.
- **AUDIT-M-03 / AUDIT-M-04 — environment memory matches disk.** `rich` added with a note that `devices/` outranks the list. Corrected: ripgrep is not installed at all — `command -v rg` is empty in a clean shell, and the only binary is one bundled inside another CLI — while `config/ripgreprc` is still linked. `jq` is declared in mise but missing; the guard survives on `/usr/bin/jq`.
- **AUDIT-M-01 — MASTER_BLUEPRINT corrected.** Thirteen roles, the missing `discovery` role documented, two stale Gemini 3.6 references fixed, `config.yml` named as authority, and `default`'s pool reconciled with the accepted AUDIT-H-01 routing decision. README's authority table now lists MASTER_BLUEPRINT and the 08-15 audit.
- **AUDIT-H-04 / AUDIT-L-01 — skill boundaries.** `cloudflare` defers to its seven siblings; `seo-website-builder` and `automated-traffic-pipeline` split programmatic SEO between page-set strategy and generation pipeline. The `cloudflare` clause initially broke YAML — caught, fixed, and the class of defect logged as TASK-010.
- **AUDIT-H-02 — `config/omp/config.yml`** cleaned to zero trailing-whitespace lines with its final newline restored; still valid YAML, 13 roles, `approvalMode: yolo`.
- **AUDIT-L-03 — `bin/tmux-clip`** gained `set -euo pipefail` and an explicit failure branch; it now exits 1 with a message instead of silently discarding stdin.
- **AUDIT-M-06 — `aussie-sawit-malaysia.md`** carries an authority header demoting its 32K body to a dated log and pointing at the repository's own `STATUS.md`.
