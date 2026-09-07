# Retained completed task history — 2026-09-07

Historical record only; TASKS.md remains the sole execution queue. Moved verbatim
to preserve the hot-context size limit during TASK-062.

- **TASK-058 / REQ-TEST-EFFICACY (R2).** Ten of the fourteen untested commands gained a
  test, ordered by blast radius: `9router-credential-migrate` (secrets — only refusal and
  misuse paths, no key read or written), `device-register` (via `--dry-run`), `ai-doctor`
  (658 lines, the health command every gate defers to), `ai-memory-check`, `migration-risk`,
  `release-manifest`, `inspect-project`, `shopify-content-helper`, `tmux-battery`,
  `tmux-clip`. `mutation-sweep`: 41 pairs, **39 BITES, 0 SURVIVED**, 2 UNSWEEPABLE.
  Scope expanded once, requirement-linked, onto `bin/mutation-sweep`: it gave a
  node-shebang subject a bash stub, so the stub could not run and the test was
  misclassified UNSWEEPABLE — a wrong answer wearing a cautious one, found because
  `ai-memory-check` is the only node command with a test.
  **Four remain untested:** `dotpush`, `vps-pgdump`, `tmux-setup`, `pi-update-safe`.
  I called them seamless; review showed that is false — each is testable behind a
  shim, and `pi-update-safe` already exposes `PI_RUNTIME_SKILL_DIRS`/`PI_ARCHIVE_ROOT`
  for exactly that. **Post-release review found a plausible bug escaping nine of the
  ten tests**, fixed in a follow-up run: `ai-doctor-test` pinned this machine's health
  rather than the subject's contract and failed unmutated in any relocated copy, so its
  sweep verdict was unearned; two assertions checked paths and patterns their subjects
  never use; three subcommands had no positive fixture, so a subject that rejected or
  dropped everything still passed.

## TASK-062 delivery contract

### TASK-062 — Remove model/provider eligibility locks
- **Requirement:** REQ-MODEL-AGNOSTIC — owner accepted: any available capable model/provider may implement or review; independent review uses a separate actual agent, not a forced vendor/model difference.
- **Risk Level:** R3; review-policy tooling.
- **Allowed Paths:** `TASKS.md`, `bin/delivery-ledger`, `bin/delivery-ledger-test`, `config/ai/AGENTS.md`, `config/omp/GOAL-ORCHESTRATION.md`, `docs/task-change-boundary.md`, `bin/ai-policy-lint`, `bin/ai-policy-lint-test`, `docs/archive/DOTFILES_TASKS_2026-09-07_CONTEXT_RETENTION.md`.
- **Protected Paths:** `bin/delivery-ledger` (R3).
- **Canonical Contract Owners:** `review.eligibility`.
- **Reopen Conditions:** a model-name eligibility lock or self-review bypass recurs.
- **Escalation Conditions:** an unrelated approval or boundary invariant changes.
- **Accepted Invariants:** reject implementer self-review, unknown provenance, stale evidence and unapproved boundaries; retain historical event chains. Same model/provider does not imply the same agent.
- **Non-Scope:** runtime model defaults/catalogs, approvals for live operations, historical run rewrites, commit/push.
- **Verification:** `bin/delivery-ledger-test`; independent correctness review of policy and guard; same-route distinct-agent R3 approval/finish/verify succeeds while self-review still fails.

Verification: delivery-ledger regressions, policy-lint regressions and the canonical
ai-policy-lint passed. Run RUN-20260907T163715Z-9766f188 records final review.

Canonical execution ID: TASK-064. The retained TASK-062 contract and run
use their original ID; another device independently allocated TASK-062 to
REQ-TEST-PORTABILITY. Historical delivery records are not rewritten.
