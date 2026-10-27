# Runtime activation and evidence — completed contracts

Archived verbatim from TASKS.md after verified execution and independent review.
Evidence: RUN-20261026T150445Z-aece36f1 and RUN-20261026T154909Z-c335be63;
failed revalidation retained as RUN-20261026T154457Z-f8b80a09.

### TASK-147: Runtime activation and trustworthy verification

- **Requirement:** REQ-RUNTIME-EVIDENCE-HARDENING (owner priorities 2026-10-26; separate defects, unknowns, and proposals).
- **Risk Level:** R3.
- **Allowed Paths:** `config/ai/claude-hooks.json`, `bin/ai-hooks-install*`, `bin/delivery-ledger*`, `bin/delivery-benchmark*`, `bin/ai-memory-route*`, `config/templates/TASKS.md`, `docs/task-change-boundary.md`, `docs/DOTFILES_SITEMAP.md`, `docs/ai-memory-sync.md`, `docs/research/development-kit-audit-2026-10-25.md`, `TASKS.md`.
- **Protected Paths:** hook manifest, delivery ledger.
- **Canonical Contract Owners:** runtime.hooks, delivery.evidence, delivery.metrics, memory.routing.
- **Accepted Invariants:** missing guard denies explicitly; checks need stable source; required PASS is fresh/executed; unknown cost differs from zero; Indonesian continuation uses repository truth; no runtime parity claim without evidence.
- **Regression Checks:** `ai-hooks-install-test`, `delivery-ledger-test`, `delivery-benchmark-test`, `ai-memory-route-test`, `ai-policy-lint`, `git diff --check`.
- **Runtime Evidence:** safe hook payloads, local discovery, independent review; remote/product evidence needs targets.
- **Reopen Conditions:** a verified guard/evidence/routing regression.
- **Escalation Conditions:** credentials or live access required.
- **Non-Scope:** credentials, live changes, trust decisions, consolidation, commit/push.
