# TASK-095 — completed 2026-10-01

Run: see `.delivery/runs/` (RUN-20261001T163813Z-c3db371a).

**Outcome:** `secrets-env check` now fails for any secrets file inside a git work tree, ignored or not. The one accepted exception is the empty accidental repository at `$HOME` (no commits, no remote). Verified by `bin/secrets-env-test` and `mutation-sweep --subject secrets-env` (9/9 killed).

## Original contract

### TASK-095: `secrets-env check` accepts an ignored in-repo secrets file

- **Requirement:** REQ-SECRET-LOCATION (CORE.md and the `secrets-env` header: 0600, outside every repository; `bin/secrets-env:174-175` prints OK for a gitignored in-repo file — found by the TASK-080 review).
- **Risk Level:** R3 — secret handling.
- **Allowed Paths:** `bin/secrets-env`, `bin/secrets-env-test`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `bin/secrets-env`.
- **Canonical Contract Owners:** `security.secrets-location`.
- **Accepted Invariants:** never prints a secret value; a file outside every repository with mode 600 still passes.
- **Regression Checks:** `secrets-env-test`, `mutation-sweep --subject secrets-env`.
- **Reopen Conditions:** `check` passes any secrets file inside a git work tree.
- **Non-Scope:** moving existing secret files on any device.
- **Escalation Conditions:** a supported device keeps its secrets file inside a repository today.
