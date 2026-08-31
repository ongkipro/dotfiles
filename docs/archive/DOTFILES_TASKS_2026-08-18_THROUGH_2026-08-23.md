# Archived Tasks — 2026-08-18 through 2026-08-23

These completed task contracts were retired from the root `TASKS.md` when its
enforced hot-context budget was reached. Detailed evidence remains in Git, the
repository build logs, and the named regression checks. This file is historical
evidence, not an active execution queue.

| Task | Outcome | Historical verification |
|---|---|---|
| TASK-017 | Made workflow and OMP overlay evidence executable. | `actionlint`, `ai-policy-lint`, installer and OMP regression checks passed locally and in the recorded hosted run. |
| TASK-018 | Audited routing, collision, and review-independence controls. | Delivery-ledger, routing, policy, project-init, benchmark, and doctor checks passed. |
| TASK-019 | Remediated OMP routing and parallel collision controls. | Routing and delivery-ledger regressions passed. |
| TASK-020 | Closed delivery-contract, routing, and task-scale gaps. | Delivery, risk, project, policy, installer, and doctor checks passed with independent review recorded at delivery time. |
| TASK-023 | Isolated OMP runtime state and added custom composition/update behavior. | Superseded by TASK-024 on 2026-08-24; its custom wrapper, routing, and updater architecture is no longer active. |

TASK-021 and TASK-022 were deferred after detecting unaccepted pre-existing
dirty overlap. They remain in the root `TASKS.md` pending queue.

---

Moved out of the hot `TASKS.md` on 2026-08-31 to stay inside its 12 KB
context budget. Unedited; its delivery runs remain the permanent record.

### TASK-024: Restore upstream-native OMP ownership and autonomous goal orchestration
- **Status:** DONE (2026-08-28)
- **Requirement:** REQ-OMP-UPSTREAM-DEFAULT, REQ-OMP-AUTO-ORCHESTRATION
- **Risk Level:** R3
- **Job:** implementation
- **Capability:** `continuous-learning`, `testing-engineering`
- **Execution Class:** precision
- **Model / Provider / Reasoning:** root-codex, codex-runtime, openai, adaptive.
- **Allowed Paths:** `config/shell-tools.sh`, `config/tmux.conf`, `install.sh`, `install-macos.sh`, `bin/{ai-doctor,ai-policy-lint,installer-link-test,shell-wrapper-test,omp-workspace-test,omp-routing-test,omp-effective-routing-test}`, `config/ai/{AGENTS.md,README.md,runtime-commands.txt,memory/skills.md,memory/environment-ai-runtimes.md,memory/decisions.md}`, `config/pi/README.md`, `config/omp/**`, `devices/{README.md,rich.md}`, `docs/{linux-dev-setup.md,DOTFILES_AI_ENGINEERING_MASTER_BLUEPRINT.md,DOTFILES_AI_ENGINEERING_CONTROL_PLANE.md}`, `TASKS.md`
- **Protected Paths:** `config/ai/AGENTS.md`, `config/shell-tools.sh`
- **Canonical Contract Owners:** `operations.omp-native-runtime`, `operations.shared-context`, `operations.omp-regression`
- **Producers:** installers, shared context/skill adapters, and OMP boundary checks.
- **Consumers:** native OMP sessions, fresh-device installs, and repository health checks.
- **Depends On:** TASK-023 (superseded by this task).
- **Runtime Evidence:** native OMP 18.0.9 installed with release checksum verification; no dotfiles `PI_CONFIG_FILES`; no live links to retired `config/omp/{config.yml,models.yml,agents}`; native config and the tracked reference are semantically equal after update; shared `AGENTS.md` and owned-skill links still resolve to dotfiles; every role and fallback selector resolves; live JSON probes show `@orchestrator` selecting Fable 5 and `@advisor` selecting Opus 5; existing direct Anthropic authentication was used without reading or changing credentials; Terra is the default parent, Fable is the native planning model plus an explicit orchestration alias, Gemini only handles lightweight work, Sol owns all development and database implementation, and Opus owns visual/review judgment; the passive advisor runtime is off while reviewer agents still resolve independently to Opus High/XHigh; interactive Goal Mode auto-continuation, preferred task/todo orchestration, batch dispatch, per-task effort, model badges, bounded isolated children, and the shared autonomous-goal contract are active.
- **Accepted Invariants:** OMP owns its command, runtime config, bundled agents, model/provider catalog, routing, updates, workspace behavior, authentication, and session state; the secret-free dotfiles reference records capability tiers without becoming an installed runtime override; explicit repository goals use `TASKS.md` as the execution queue and repository evidence as completion authority; Terra is the default conductor, Fable is explicit escalation for hard long-horizon planning/orchestration, Gemini is restricted to lightweight work, Sol owns implementation, and Opus owns expert judgment; non-trivial cross-module R2 gets Opus review and R3/R4 requires independent Opus/security review plus ledger approval; parent sessions own integration; child isolation is automatic, patches do not auto-apply, concurrency is four, recursion depth is one, and prewalk cannot silently downgrade an executor to Gemini; approval gates remain mandatory; dotfiles supplies OMP with shared `AGENTS.md` context and owned skills; no credential is read or changed.
- **Regression Checks:** `bin/shell-wrapper-test`, `bin/omp-workspace-test`, `bin/omp-routing-test`, `bin/omp-effective-routing-test`, `bin/installer-link-test`, `bin/ai-policy-lint`, `bin/ai-doctor --self-test`, `git diff --check`
- **Reopen Conditions:** a shell wrapper or `PI_CONFIG_FILES` injection returns, an installer links tracked OMP runtime state, a live runtime path points into retired `config/omp/` state, or memory/docs again claim dotfiles owns OMP routing.
- **Rollback/Migration State:** exact legacy OMP model/agent links are retired; native config, auth, sessions, cache, and unmanaged files are preserved. Historical routing artifacts are not linked or auto-loaded; `config/omp/config.yml` remains the maintained secret-free reference used only when explicitly requested and by regression tests.
- **Non-Scope:** Anthropic login, credential inspection or migration, creating MCP configuration without a concrete requirement, deleting historical evidence, production actions, commits, and pushes.
- **Verification:** PASS — OMP 18.0.9 update, post-update links, configuration
  parity, model selectors, native goal/task settings, focused regressions, live
  Terra/Fable probes, full repository self-test, independent Opus review, and
  the final R3 delivery boundary all passed.
- **Escalation Conditions:** native OMP differs from a pristine upstream config, or final boundary review is required for the protected/pre-existing change surface.

---

Moved out of the hot `TASKS.md` on 2026-09-01 to stay inside its 12 KB
context budget. Unedited; its delivery run remains the permanent record.

### TASK-022: Register every owned test command in the runtime manifest
- **Requirement:** REQ-DELIVERY-CONTRACT-GAPS
- **Risk Level:** R1
- **Allowed Paths:** `config/ai/runtime-commands.txt`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.command-manifest`
- **Accepted Invariants:** every manifest entry resolves to an executable under `bin/`
- **Regression Checks:** `installer-link-test`, `ai-policy-lint`, `skill-surface-check`
- **Runtime Evidence:** `installer-link-test` reports "runtime command manifest and hook wiring"
- **Reopen Conditions:** a `bin/*-test` exists that the manifest does not list
- **Non-Scope:** installer behaviour, hook wiring
- **Verification:** `installer-link-test`
- **Escalation Conditions:** manifest and `bin/` disagree after one repair attempt

Four commands were unregistered, not the one the pending entry named:
`ai-memory-link-test`, `project-check-test`, `vendored-refresh-test`, and
`omp-runtime-report-test` — the last added earlier the same day by the session
that then found the gap. `ai-doctor --self-test` discovers tests through its own
`bin/*-test` glob, so nothing was broken; the manifest is what every installer
links into `~/.local/bin`, so an unregistered command simply never arrives on a
new device.
