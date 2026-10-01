# TASK-100 to TASK-105 — completed 2026-10-02

Each ran under `delivery-ledger` with tests and a cross-vendor review through `ai-ask agy`.

## TASK-100 — RUN-20261001T172614Z-0e103591 (PASS)

### TASK-100: Restore repository context after compaction

- **Requirement:** REQ-LONG-HORIZON-CONTEXT (gap G1, `~/Documents/work/research/ai-cli-system-gap-analysis-2026-10-02.md`).
- **Risk Level:** R2.
- **Allowed Paths:** `config/ai/hooks/session-restore.sh`, `config/ai/hooks/session-restore.test.sh`, `config/ai/claude-hooks.json`, `bin/ai-doctor`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `config/ai/hooks/git-guard.sh`, `config/ai/CORE.md`.
- **Canonical Contract Owners:** `runtime.context-restore`.
- **Accepted Invariants:** fail-open, bounded, read-only; prints only repository state (never memory contents beyond routed paths, never secrets); output capped.
- **Regression Checks:** `config/ai/hooks/session-restore.test.sh`, `ai-hooks-install --check`.
- **Reopen Conditions:** a check above regresses or the invariant is violated.
- **Non-Scope:** other runtimes' hook systems (documented as a gap).
- **Escalation Conditions:** the change needs a protected path or a live side effect.

## TASK-101 — RUN-20261001T173829Z-604726f6 (PASS)

### TASK-101: Import phone-captured knowledge into the ai-learn inbox

- **Requirement:** REQ-KNOWLEDGE-CAPTURE (owner 2026-10-02: knowledge is captured on the phone in ChatGPT).
- **Risk Level:** R1.
- **Allowed Paths:** `bin/ai-learn`, `bin/ai-learn-test`, `docs/chatgpt-inbox.md`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `config/ai/memory/**`.
- **Canonical Contract Owners:** `memory.learning-loop`.
- **Accepted Invariants:** import only creates a device-local candidate; promotion stays a separate reviewed step; sensitive-text rejection still applies.
- **Regression Checks:** `ai-learn-test`.
- **Reopen Conditions:** a check above regresses or the invariant is violated.
- **Non-Scope:** automatic promotion; any network call.
- **Escalation Conditions:** the change needs a protected path or a live side effect.

## TASK-102 — RUN-20261001T174409Z-7902c165 (PASS)

### TASK-102: Cross-CLI lanes and read-only delegation

- **Requirement:** REQ-CROSS-CLI (gap G2): every CLI works alone at full capability and can hand a lane to another CLI.
- **Risk Level:** R2.
- **Allowed Paths:** `skills/local/cross-cli/**`, `bin/ai-ask`, `bin/ai-ask-test`, `skills/local/README.md`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `config/omp/config.yml`, `config/ai/CORE.md`.
- **Canonical Contract Owners:** `runtime.cross-cli`.
- **Accepted Invariants:** no lane is bound to a CLI; delegated runs are read-only (plan/sandbox) with a timeout unless an isolated worktree is given; output is a proposal.
- **Regression Checks:** `ai-ask-test`, `skill-check`, `ai-policy-lint`.
- **Reopen Conditions:** a check above regresses or the invariant is violated.
- **Non-Scope:** installing OMP routing or agents; proxies.
- **Escalation Conditions:** the change needs a protected path or a live side effect.

## TASK-103 — RUN-20261001T181901Z-f79f5029 (PASS)

### TASK-103: Reference-to-build UI pipeline with measured fidelity

- **Requirement:** REQ-UI-FIDELITY (owner 2026-10-02: research matching sites, reproduce the chosen reference precisely, then improve; current output is often generic or rigid).
- **Risk Level:** R2.
- **Allowed Paths:** `skills/local/design-taste/**`, `skills/local/ui-validation/**`, `skills/local/README.md`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `skills/local/impeccable/**` beyond pointer lines.
- **Canonical Contract Owners:** `design.reference-fidelity`.
- **Accepted Invariants:** reference capture and comparison are read-only; no copying of third-party brand assets; fidelity is measured, not asserted.
- **Regression Checks:** script tests under the skill, `skill-check`, `ai-policy-lint`.
- **Reopen Conditions:** a check above regresses or the invariant is violated.
- **Non-Scope:** new dependencies in user projects without approval.
- **Escalation Conditions:** the change needs a protected path or a live side effect.

## TASK-104 — RUN-20261001T183406Z-21d979b7 (PASS)

### TASK-104: CMS decision and implementation skill

- **Requirement:** REQ-CMS (owner 2026-10-02: clients edit their own content).
- **Risk Level:** R1.
- **Allowed Paths:** `skills/local/cms-content/**`, `skills/local/README.md`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `config/ai/CORE.md`.
- **Canonical Contract Owners:** `skills.cms`.
- **Accepted Invariants:** vendor facts verified against current official docs at authoring time.
- **Regression Checks:** `skill-check`, `ai-policy-lint`.
- **Reopen Conditions:** a check above regresses or the invariant is violated.
- **Non-Scope:** installing any CMS.
- **Escalation Conditions:** the change needs a protected path or a live side effect.

## TASK-105 — RUN-20261001T183648Z-f44fc6b9 (PASS)

### TASK-105: VPS deploy skill (Docker/Coolify, backup, rollback)

- **Requirement:** REQ-VPS-DEPLOY (very-high tier gap).
- **Risk Level:** R1.
- **Allowed Paths:** `skills/local/vps-deploy/**`, `skills/local/README.md`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `bin/vps-pgdump`.
- **Canonical Contract Owners:** `skills.vps-deploy`.
- **Accepted Invariants:** production actions stay behind approval gates; facts verified against official docs.
- **Regression Checks:** `skill-check`, `ai-policy-lint`.
- **Reopen Conditions:** a check above regresses or the invariant is violated.
- **Non-Scope:** touching any live server.
- **Escalation Conditions:** the change needs a protected path or a live side effect.
