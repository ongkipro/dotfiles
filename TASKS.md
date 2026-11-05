# Tasks — dotfiles

Updated: 2026-11-03

Queue rules: `config/templates/TASKS.md`; history: `docs/archive/`. Disk/tests win.

Done 2026-10-30: TASK-159 → [META_COPY](docs/archive/DOTFILES_TASKS_2026-10-30_META_COPY.md); TASK-091 superseded by TASK-160 → [record](docs/archive/TASKS-091-superseded.md); TASK-160/161 → [160-161](docs/archive/TASKS-160-161-completed.md).
Done 2026-10-31: TASK-162-165 → [162-166](docs/archive/TASKS-162-166-completed.md); TASK-167 → [167](docs/archive/TASKS-167-completed.md); TASK-168 → [168](docs/archive/TASKS-168-completed.md); TASK-169 → [169](docs/archive/TASKS-169-completed.md).
Done 2026-11-01 to 2026-11-03: TASK-170 → [170](docs/archive/TASKS-170-completed.md); TASK-171/172 → [171](docs/archive/TASKS-171-completed.md); TASK-173 → [173](docs/archive/TASKS-173-completed.md); TASK-174 → [174](docs/archive/TASKS-174-completed.md); TASK-176 → [176](docs/archive/TASKS-176-completed.md).

## Pending

### TASK-187: History request budget and rate-limit stop
- **Requirement:** REQ-META-HISTORY-REQUEST-BUDGET (owner: "rekomendasimu? kerjakan" — complete AUTOSTOCK history blocked by Meta request limits).
- **Risk / Surface:** R2; provider/CLI and their tests, runtime reference, TASKS and changelog.
- **Observed failure:** live history re-read identical inventory for all five windows (~690 creatives each), then hit API 17/80004; throttle errors were retried after 1–2 s, spending more quota.
- **Contract:** read inventory once per live history run and reuse it with recorded provenance; later windows request Insights only, keeping each window's full collect scope identity. Throttle codes are not retried in-run: stop further requests, mark skipped work, and skip later windows. Offline `--input-dir` behavior unchanged. No Meta mutations, credentials or private data in Git.
- **Done When:** SDK and CLI regressions prove one inventory read, Insights-only later windows, shared inventory, distinct scopes, and rate-limit stop; full gates and independent review pass; AUTOSTOCK recollected read-only and verified.
- **Scope expansion:** the first live run timed out after three windows. CPU profile: `references()` scanned growing media/web indexes with `canonical()` per candidate (quadratic), ~415–440 s per AUTOSTOCK snapshot. Set-based dedup produces byte-identical media/web/sync/manifest output on the same private copy and input in 1.2 s. Workspace regression covers in-snapshot/cross-snapshot dedup and byte-stable republication.
- **Evidence:** SDK 33/33, full CLI, workspace 45/45, syntax, skill/docs and security-check PASS; independent review APPROVE (request budget) and APPROVE (publication fix). Live read-only recollection of the affected account: all five windows complete (one inventory read reused by four Insights-only windows), 45 report hashes verified, complete-history pointer set. Closure authority: `.delivery/runs/` TASK-187 run.

### TASK-186: Recover bounded oversized creative pages without losing evidence
- **Requirement:** REQ-META-CREATIVE-PAYLOAD (owner: continue the remaining read-only test, then commit/push only once completed and safe).
- **Risk / Surface:** R2; Python provider/tests, owning runtime reference, TASKS and changelog. Preserve all accepted dirty and private data.
- **Observed failure:** the fourth full-field creative page at limit25 returns API1/HTTP500 with an explicit reduce-data hint; the same cursor and complete fields succeed at limits10/5/1 in bounded SDK GET probes.
- **Contract:** only that explicit creative payload rejection may reduce the page size25 →10 →1, retaining the same cursor, account, full fields and existing page budget. Record safe adjustment metadata; never skip rows, follow server next URLs, relax identity checks, drop fields or relabel incomplete evidence complete. Ordinary failures retain bounded retry/partial behavior. No Meta mutations, credential changes, private data in Git or transfers.
- **Done When:** SDK regressions cover full-field continuation, size1 terminal failure, other errors and page-limit preservation; CLI/workspace/syntax/skill gates and required independent review pass. Recollect the affected account only and verify immutable reports, scoped learning and preserved earlier partial versions. Commit/push is a separate authorized step after task-owned staged diff/security review.
- **Scope expansion:** pre-commit review found brandless `run --bm` could keep an inherited business/account default from another BM. Selected BM now sets `BUSINESS_ID` and drops an unselected inherited `AD_ACCOUNT_ID`; regression in `bin/dotads-meta-test`. Synthetic fixtures renamed so `security-check` passes without allowlist changes.
- **Evidence:** SDK 31/31, full CLI, workspace 44/44, syntax, skill/docs and security-check PASS; independent review REQUEST_CHANGES then corrected APPROVE. Live read-only recollection recovered 693 creatives (was 75) with a recorded 25→10 reduction; remaining partial windows failed on Meta request limits (API 17/80004), not payload size. Closure authority: `.delivery/runs/` TASK-186 run.

### TASK-185: Repair live read-test inventory transport
- **Requirement:** REQ-META-LIVE-READ-TEST (owner: continue read-only tests on both operator-selected accounts, designated dummy/test subjects but not verified sandboxes).
- **Risk / Surface:** R2; Python provider/tests, owning runtime reference, TASKS and changelog. Preserve prior dirty work and all private data.
- **Observed failure:** same-SDK/API GET comparisons isolate `DELETED` effective-status rejection (100/1815001) and oversized full-field creative pages (100 rejected; 25 succeeds). Enum presence in the SDK is not proof of server acceptance.
- **Contract:** explicitly exclude unsupported DELETED inventory from new declared scopes without silently dropping fields or changing old evidence; keep ARCHIVED and other supported states; request creatives in pages of 25. Retain immutable failed snapshots, full provenance, cursor/budget/error distinctions, BM/account isolation and operator-owned test notes. No Meta mutations, credential/config changes, private data in Git, transfer or model training.
- **Done When:** actual installed-SDK synthetic regressions, complete CLI/workspace, syntax and skill checks pass with required independent review. Recollect both selected accounts read-only and verify their actual local coverage separately; partial/empty data is not optimization proof.

### TASK-184: Account-scoped history learning and private portable evidence
- **Requirement:** REQ-META-PORTABLE-LEARNING (owner: continue five-period Markdown evidence and complex learning across devices).
- **Risk / Surface:** R2; Meta workspace/CLI/tests, owning skill/runtime/Bahasa guide, TASKS and changelog. Preserve existing accepted changes and unrelated work.
- **Contract:** full returned inventory/Insights in Markdown; history adds scoped observational memory without promoting claims; observation → hypothesis → experiment → outcome with pinned evidence. Explicit-account offline export/import carries selected learning and its evidence only, checks identity/hashes/conflicts, preserves local notes/economics and complete-history pointers, never transports credentials/assets/state or sends data over a network. No automatic cloud sync, causal/profit claims, live access, guessed IDs or Git operations.
- **Done When:** synthetic lifecycle, idempotent history, portable round-trip/dedup/conflict/tamper/account/BM isolation and existing CLI/workspace regressions pass; skill/syntax checks and required independent review pass. Actual account reads/transfers need separately selected targets.
- **Evidence:** initial workspace 44/44, full CLI, syntax/skill/link gates PASS. Independent review found unknown evidence-wrapper data and sibling-failure deduplication bugs; both reproduced by two failing tests before fixes. Corrections add fixed-schema allowlists and period-only observation identity, plus regressions. Final executed checks, required re-review and closure authority: `.delivery/runs/RUN-20261104T155130Z-7631e32f.jsonl`. Source/route provenance is not upstream identity attestation; no live reads, real transfer, credential edits, commit or push.

### TASK-183: One-line operator token onboarding
- **Requirement:** REQ-META-ONE-LINE-ONBOARDING (owner: improve dotads MD across devices; AI prepares env, operator only fills the token line).
- **Risk / Surface:** R1; Meta skill, operator guide, setup/runtime/terminal references and TASKS.md; preserve accepted existing changes and all private configuration.
- **Contract:** one AI-owned onboarding checklist; create missing env safely after authorization, preserve existing keys/values/token_env, prefill only confirmed BM metadata, ask once if BM ID is unknown, then verify actual folder. No new CLI bootstrap command, automatic secret writes on pull, guessed IDs, hardcoded private IDs or guard bypass. Operator example: `META_ACCESS_TOKEN_AUTOLARIS=<masukanTOKEN>`; never write an active placeholder as a real token.
- **Done When:** owning English/Bahasa guides agree with actual CLI, link/skill checks and independent review pass. No actual credential-file edit is needed on this already-working device.
- **Evidence:** skill check 0 failures/warnings; five documents, 17 local links/anchors and balanced fences PASS; whitespace PASS. Docs-only: no new behavioral regression test; runtime unchanged. Independent review `574c5b8e-c161-49e8-814a-475dfc612d2e` APPROVE (configured `9router-fantastico/cx/gpt-6.1-sol:high`, not attested upstream identity); final result authority `.delivery/runs/RUN-20261104T134944Z-7200cbea.jsonl`.

### TASK-182: Preserve existing named Meta token references
- **Requirement:** REQ-META-LEGACY-TOKEN (owner: support existing `META_ACCESS_TOKEN_AUTOLARIS` and fix its callers without unnecessary env renaming).
- **Risk Level:** R2; accept current Meta-task changes and preserve unrelated work.
- **Allowed Paths:** `bin/dotads-meta`, `bin/dotads-meta-test`, Meta skill/setup/runtime references, `TASKS.md`, local `.pi/tasks/` receipts.
- **Accepted Invariants:** `META_ACCESS_TOKEN_<KEY>` is a named token with explicit `META_BM_<KEY>_ID` and optional `_NAME`; preserve exact `token_env`; conflicting naming formats or multiple token references for a key fail closed; case-insensitive selection does not alias different labels; no generic/cross-BM fallback, guessed IDs, credential exposure, saved-binding migration or extra API calls.
- **Done When:** synthetic setup, saved binding, campaign/run caller and conflict tests pass along with existing regressions and required independent review. Actual secret file remains untouched while its inspection is guard-blocked.
- **Executed Evidence:** full CLI and filesystem 40/40, Node/Bash syntax and whitespace PASS on synthetic inputs. Separate review run `a2bbe237-06e4-419d-8ffb-9d57131e803b` APPROVE (read-only source/test review); configured route `9router-fantastico/cx/gpt-6.1-sol:high` is not independently attested upstream identity. Final gate/approval/closure authority: `.delivery/runs/RUN-20261104T132416Z-104480e8.jsonl`. No claim of real env migration or actual folder creation.
- **Non-Scope:** bypassing blocked secret inspection, actual env value reads/edits, mapping AUTOLARIS to AUTOKIRIM, inferring BM identity from a token, live Meta access, HOME Git changes, ledger repair, commit/push.

### TASK-181: Honest Meta workspace setup and safe diagnostics
- **Requirement:** REQ-META-SETUP-DIAGNOSTICS (owner: fix bugs and improve the failed local setup experience).
- **Risk Level:** R2; existing Meta-task changes are accepted and preserved, not relabeled as this task's changes.
- **Allowed Paths:** `bin/dotads-meta`, `bin/dotads-meta-test`, `skills/local/meta-ads-cli/references/account-workspace-runtime.md`, `TASKS.md`, local `.pi/tasks/` receipts.
- **Accepted Invariants:** explicit BM selection never falls back; unknown labels are detection failures, not token-validity diagnoses; explicitly selected unavailable tokens fail before creating any directory; unattended setup without active profiles remains an offline no-op; successful setup reports its actual verified directory; no secret values, guessed IDs, live Meta requests or implicit migrations.
- **Done When:** synthetic regressions prove honest zero-work behavior, actionable non-secret unknown-profile errors and stable reported workspace paths; existing CLI/syntax gates and required independent boundary review pass.
- **Reproduced Baseline:** selected synthetic profile with a blank token exits 0 with `local BM workspaces ready: 0`, while the reporting directory does not exist. This is not a diagnosis of the owner's actual configuration.
- **Executed Evidence:** full synthetic CLI regression, filesystem 40/40, Node/Bash syntax and whitespace PASS. Final required executed checks, independent approval and closure are owned by `.delivery/runs/RUN-20261104T130439Z-69a3e02d.jsonl`. Separate reviewer run: `773d6edf-0dd6-4959-8fd6-811feb4d43fb` APPROVE (read-only source/test/receipt inspection); configured route `9router-fantastico/cx/gpt-6.1-sol:high` is not independently attested upstream identity. The actual local profile-detection cause remains unverified; no claim that the real reporting folder was created.
- **Non-Scope:** reading/altering real credentials, bypassing the blocked secrets inspection, shared secrets-loader parser changes, automatic alias/token discovery, HOME Git repair, real workspace setup/Meta access, commit/push.

### TASK-180: Evidence-led account history and delivery re-verification
- **Requirement:** REQ-META-HISTORY (owner: execute unfinished history/reporting and formal-review todos).
- **Risk Level:** R3; accept existing Meta-task changes without replacing unrelated user work.
- **Allowed Paths:** TASK-177/179 implementation/docs/tests, `TASKS.md`, and local `.pi/tasks/` receipts; ledger implementation is excluded.
- **Accepted Invariants:** explicit account/BM; account-timezone calendar dates; yesterday and last 7/30/90 completed days end yesterday; month-to-date includes incomplete today; independent whole-period metrics, no summing overlapping windows; preserve partial/error/missing/zero distinctions and snapshot provenance; observational evidence never establishes causality or changes spend; no live access, credentials inspection, HOME Git changes, or automatic API calls on pull.
- **Done When:** five-period planning/authorized collection/offline imports produce account-local immutable Markdown evidence; partial refresh cannot replace the last complete history; experiment records remain operator-owned; synthetic regressions and independent review pass. Historical BLOCKED runs stay unchanged; a new run verifies the current combined Meta surface.
- **Regression Checks:** `dotads-meta-test`; workspace filesystem tests; installed SDK contract tests; syntax/whitespace; existing sync/rule-lock regressions.
- **Non-Scope:** ledger repair, live Meta reads/writes, daily time-series/async API jobs, profit decisions without merchant outcomes, commit/push.
- **Executed evidence:** filesystem 40/40 and full CLI PASS after correcting an old fixture that expected silent BM-ID rebinding; installed SDK 26/26, device sync/rule-lock, syntax and whitespace PASS on synthetic inputs. No real credentials or Meta accounts were accessed.
- **Independent review:** separate reviewer cleared all three requested corrections: stable saved BM-ID/token bindings, loader-owned import provenance precedence, and exact whole-period row grains. Actual reviewer runs: `550acce2-8382-4fd1-8cc3-ea063576c1b3` (REQUEST_CHANGES), `fa8cbe78-b590-4a90-8790-fa8cd8996f5b` (APPROVE); configured route `9router-fantastico/cx/gpt-6.1-sol:high`, not independently attested upstream identity. Final fixture-only follow-up: `43eb2e41-8b36-48f2-be94-924d5e168a5a`.
- **Formal closure authority:** `.delivery/runs/RUN-20261104T123148Z-d5fefb6a.jsonl` owns final re-executed gates, bound independent approval and result for TASK-180 plus current TASK-177/179 implementation. Prior BLOCKED runs remain unchanged; this does not repair the ledger. The initial CLI event is retained as UNVERIFIED because a background receipt changed during capture; final execution must use stable receipts and external process logs.
- **Diagnostics limitation:** configured TypeScript LSP cannot initialize without a valid TypeScript installation/`tsserver.path`; no dependency installed to hide that configuration issue. Node/Bash executable checks remain separate evidence.

### TASK-179: Lowercase named Meta env profiles
- **Requirement:** REQ-META-ENV-NAMING (owner: use `meta_ads_token_autolaris` naming).
- **Risk Level:** R2; existing dirty task-owned BM implementation is explicitly accepted, not replaced or relabeled as new work.
- **Allowed Paths:** `bin/dotads-meta`, `bin/dotads-meta-test`, `skills/local/meta-ads-cli/SKILL.md`, `skills/local/meta-ads-cli/references/account-workspace-runtime.md`, `skills/local/meta-ads-cli/references/setup-and-commands.md`, `TASKS.md`; native task receipts under this session's `.pi/tasks/` are local verification artifacts only.
- **Accepted Invariants:** preferred `meta_ads_token_<label>` plus explicit numeric `meta_ads_bm_id_<label>`; optional display name defaults to local label; BM selection is case-insensitive; legacy profiles remain supported; duplicate keys/IDs/tokens fail; missing credentials never fall back across BMs; saved token bindings are not silently migrated.
- **Regression Checks:** isolated CLI/BM profile fixtures; existing filesystem contracts; installed SDK contracts; syntax/whitespace. No actual secret file is read or changed.
- **Non-Scope:** live account access, migration of real profiles/credentials, history-period implementation, commit/push, or repair of the prior ledger guard.
- **Executed Evidence:** `RUN-20261104T114725Z-97abc39d`: lowercase/legacy CLI fixtures PASS; existing filesystem contracts PASS; installed SDK contracts PASS; Node/Bash syntax and whitespace PASS. Actual secret files were not read or edited; no live account calls occurred.
- **Historical closure:** original env-format run was offline-verified but lacked independent approval. TASK-180 re-verifies the current combined source and owns follow-up review/closure; read its final ledger result, not this historical BLOCKED run, for current formal acceptance.

### TASK-177: BM-scoped automatic Meta reporting setup
- **Requirement:** REQ-DOTADS-BM-AUTOSETUP (owner: one token per Business Manager, env-provided BM names, automatic local structure and device-pull reconciliation).
- **Risk Level:** R2; escalate from observed diff risk.
- **Allowed Paths:** `bin/dotads-meta`, `bin/dotads-meta-test`, `bin/_dotads-workspace.mjs`, `bin/_dotads-workspace-test.mjs`, `bin/ai-memory-link`, `skills/local/meta-ads-cli/**`, `TASKS.md`, `docs/ai-memory-sync.md`, `docs/DOTFILES_SITEMAP.md`, `CHANGELOG.md`.
- **Canonical Contract Owners:** dotads-meta (BM selection and setup); account-workspace-runtime.md (local layout); ai-memory-link (post-pull reconciliation).
- **Accepted Invariants:** named local env profiles bind one token reference to one BM ID; ambiguous selection fails; BM data stays private and isolated; setup is offline/idempotent; legacy folders remain untouched; no secrets in tracked data; no automatic API calls, dependency installs or spend on pull. Follow-up: new BM account folders use Name (act_ID); campaign work reuses the selected account; human reports are Markdown; reusable assets belong to the BM, optional temporary copies never trigger automatic deletion.
- **Regression Checks:** dotads-meta-test; workspace filesystem tests; bash syntax; diff whitespace; device reconciliation fixtures.
- **Non-Scope:** moving legacy reports, transferring credentials/reports, live Meta access, commit/push.
- **Reopen Conditions:** cross-BM credential fallback, folder collisions, or a pull overwrites operator files.
- **Executed Evidence:** `RUN-20261104T103638Z-27676dc8`: latest CLI regression PASS; filesystem 34/34 PASS; device `dotsync-test` and `ai-rule-lock-test` PASS; Node/Bash syntax and whitespace PASS. All tests use synthetic/local fixtures; no live Meta access or real macOS proof. TypeScript LSP could not initialize because no valid TypeScript installation was configured.
- **Closure Blockers:** boundary escalates to R3/independent review for scope expansion; no independent-agent review was authorized. The boundary guard also counts historical failed verification records when checking scope-expansion evidence, despite the same checks later passing. Do not rewrite evidence or fix the ledger outside this task's scope. Source implementation is offline-verified; formal PASS remains blocked.
- **Follow-up:** TASK-180 provides a new declared combined surface, corrective regressions and actual independent review. Its final ledger result owns current acceptance; neither old BLOCKED evidence nor the scope-expansion guard is rewritten.
- **Escalation Conditions:** secret transport change or sensitive sync wiring requires independent review before PASS.

### TASK-175: Cloudflare Asia-Pacific placement default
- **Requirement:** REQ-CLOUDFLARE-APAC (owner 2026-11-02: web projects for Indonesia/Asia use Cloudflare SEA/Asia/Singapore; understand the breakdown and improve the skill).
- **Risk Level:** R1.
- **Allowed Paths:** `skills/local/cloudflare/SKILL.md`, `skills/local/cloudflare/.local-fork`, `skills/local/cloudflare/references/apac-placement.md`, `config/ai/memory/preferences.md`, `CHANGELOG.md`, `TASKS.md`, `docs/DOTFILES_SITEMAP.md`.
- **Canonical Contract Owners:** `cloudflare` skill (product guidance); `memory/preferences.md` (owner default).
- **Accepted Invariants:** facts from current Cloudflare docs only; hints never presented as residency; no remote resource changed.
- **Regression Checks:** `skill-check`; `bin/system-map --check`; `ai-policy-lint`.
- **Reopen Conditions:** Cloudflare adds a finer Asian hint or an Asian jurisdiction; a project created with `--location apac` is found outside APAC.
- **Non-Scope:** migrating existing D1/R2 resources; deploys; commit/push.
- **Escalation Conditions:** any change to a live D1/R2/DO resource or deploy.

### TASK-156: Memory precision
- **Requirement:** REQ-MEMORY-PRECISION.
- **Risk Level:** R2.
- **Allowed Paths:** run-bound router/access/lifecycle, tests, manifest, lesson/docs paths; [contract](docs/research/memory-focus-architecture-2026-10-29.md#accepted-delivery-contracts).
- **Canonical Contract Owners:** memory.routing/access/lifecycle.
- **Accepted Invariants:** execution first; explicit foreign references; path-only ≤1 file/40%; no inferred usage.
- **Regression Checks:** route/access/lifecycle/hook tests; policy lint.
- **Runtime Evidence:** slug/negative-reference probes.
- **Reopen Conditions:** isolation regression.
- **Non-Scope:** deletion, commit/push.
- **Escalation Conditions:** schema/authority change.

### TASK-157: Session focus
- **Requirement:** REQ-FOCUS.
- **Risk Level:** R2.
- **Allowed Paths:** run-bound focus, resume/router/access/ledger and tests, manifest/CORE/context/docs; [contract](docs/research/memory-focus-architecture-2026-10-29.md#accepted-delivery-contracts).
- **Canonical Contract Owners:** focus.state; ledger completion.
- **Accepted Invariants:** isolated expiring claims; captured boundaries persist; explicit references; no rival task authority.
- **Regression Checks:** focus/route/access/resume/ledger tests, context, policy lint.
- **Runtime Evidence:** concurrent claims and boundary probes.
- **Reopen Conditions:** leakage/overwrite/bypass.
- **Non-Scope:** write interception, commit/push.
- **Escalation Conditions:** budget/authority change.

### TASK-158: Writer and two-way language
- **Requirement:** REQ-TWO-WAY-LANGUAGE.
- **Risk Level:** R2.
- **Allowed Paths:** run-bound writer migration/references, communication memory/router, CORE/context/evals/maps/docs; [contract](docs/research/memory-focus-architecture-2026-10-29.md#accepted-delivery-contracts).
- **Canonical Contract Owners:** writer; communication memory.
- **Accepted Invariants:** preserve meaning/locale/history and parallel edits; no universal fluency claims.
- **Regression Checks:** metadata/map/links/workflow/context/hygiene, routing, dialogue review.
- **Runtime Evidence:** five-runtime discovery; semantic cases.
- **Reopen Conditions:** intent/register regression.
- **Non-Scope:** auto-promotion, commit/push.
- **Escalation Conditions:** new CORE methodology.

### TASK-151: Upstream watch registry and deduplicated skill evidence

- **Requirement:** REQ-SKILL-UPSTREAM-WATCH (owner: build a skill/upstream reference so upstream changes can refine skills, and repair usage evidence, 2026-10-27).
- **Risk Level:** R2.
- **Allowed Paths:** `TASKS.md`, `bin/skill-upstream`, `bin/skill-upstream-test`, `bin/ai-skill-evolution`, `bin/ai-skill-evolution-test`, `config/ai/runtime-commands.txt`, `docs/DOTFILES_SITEMAP.md`, `skills/local/*/.upstream`, `skills/local/development-kit/references/ecosystem-adoption.md`.
- **Canonical Contract Owners:** skills.provenance -> `.source`/`.local-fork` (vendored) and `.upstream` (watch-only); skills.evidence -> `ai-skill-evolution`; adoption -> `development-kit`.
- **Accepted Invariants:** `.upstream` never triggers a fetch or write; vendored refresh semantics unchanged; the report is read-only and never edits skills; one delivery run counts once however many checkouts carry it.
- **Regression Checks:** bind skills, maps, links, policy, security, diff, evolution-regression, upstream-regression at run start.
- **Runtime Evidence:** live `skill-upstream` report over all registered watches; `ai-skill-evolution --repos-root ~/Projects` sample counts equal unique runs.
- **Non-Scope:** refreshing or reconciling vendored skills, adopting new upstream skills, scheduling, commit/push.
- **Reopen Conditions:** a watch resolves to a missing repository, or duplicated checkouts inflate evidence again.
- **Escalation Conditions:** a change to vendored refresh semantics or skill frontmatter is required.

### TASK-148: Scope remaining owner priorities

- **Requirement:** REQ-RUNTIME-EVIDENCE-FOLLOWUP (2026-10-26 audit).
- **Risk Level:** R0 planning.
- **Allowed Paths:** `TASKS.md`, `docs/research/development-kit-audit-2026-10-25.md`.
- **Verification:** select device/project targets and bind required checks before implementation; preserve deferred tasks.

### Deferred: TASK-140 (from 2026-10-31), TASK-142
- Full records: [docs/archive/TASKS-140-142-deferred.md](docs/archive/TASKS-140-142-deferred.md). Both stay open; copy a record back into Pending before starting its run.

### TASK-143: `ai-memory-harvest-test` intermittent macOS failure

- **Requirement:** REQ-PORTABLE-CHECKS (owner 2026-10-25: investigate the intermittent macOS failure).
- **Risk Level:** R1.
- **Allowed Paths:** `bin/ai-memory-harvest-test`, `bin/ai-memory-harvest`, `TASKS.md`.
- **Canonical Contract Owners:** memory.harvest -> `ai-memory-harvest`.
- **Accepted Invariants:** investigation first; record the reproduced cause before any fix; Linux behavior unchanged.
- **Regression Checks:** `ai-memory-harvest-test` on Linux and on the hosted macOS runner.
- **Runtime Evidence:** a failing macOS run log and the passing rerun after the fix.
- **Non-Scope:** other macOS checks; CI workflow changes unless the cause lives there; commit/push.
- **Reopen Conditions:** the test fails again on macOS after the fix.
- **Escalation Conditions:** the failure cannot be reproduced after repeated macOS runs.

### TASK-097: Mutation gaps left after TASK-080

- **Requirement:** REQ-MUTATION-COVERAGE (TASK-080 final sweep 2026-09-24, `RUN-20260924T134257Z-432ea5cf`).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/*-test`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** every non-test path under `bin/`.
- **Canonical Contract Owners:** `runtime.readiness`.
- **Accepted Invariants:** as TASK-080. Accepted open gap: `bin/vps-pgdump:45` guard-off survives on Linux because bash >= 4.4 expands an empty array under nounset; it is killed only under bash < 4.4 (macOS `/bin/bash`) and is NOT an equivalent mutant.
- **Regression Checks:** `mutation-sweep --subject <name>`, touched `bin/*-test`.
- **Runtime Evidence:** open: `vps-pgdump:45` (confirm the kill with a macOS sweep); `secrets-env:174` was closed by TASK-095 (2026-10-01); `dotsync` 3 and `mutation-sweep` 18 statements beyond the cap; `pi-9router-restore` deferred by the owner (`9router-credential-migrate` removed 2026-11-02).
- **Reopen Conditions:** a subject claimed fully covered regresses.
- **Non-Scope:** raising the cap; changing subjects.
- **Verification:** each claimed subject reports zero survivors and no CAPPED row.
- **Escalation Conditions:** a gap needs a subject change or a live side effect.

### TASK-096: TASK-080 tests depend on the caller's environment

- **Requirement:** REQ-CI-DETERMINISM (`5c6c1fb`: dotpush identity and macOS `/var`/`/private/var` fixture mismatch).
- **Risk Level:** R1.
- **Allowed Paths:** `bin/dotpush-test`, `bin/dotsync-test`, `TASKS.md`, `.delivery/**`.
- **Canonical Contract Owners:** `runtime.readiness`.
- **Accepted Invariants:** assertions unchanged; `dotpush` still sees its own managed `home/gitconfig` (a file-wide `GIT_CONFIG_GLOBAL` broke three cases).
- **Regression Checks:** `dotpush-test` and `dotsync-test`, each also run with an empty `HOME`; Core runtime CI on both OSes.
- **Runtime Evidence:** implementation complete; local run `RUN-20260924T162918Z-e96c87ba` passed. Hosted Linux/macOS CI evidence remains pending.
- **Reopen Conditions:** a caller's global git config or temp-dir symlink changes a verdict.
- **Non-Scope:** `bin/dotpush`, `bin/dotsync`.
- **Escalation Conditions:** isolation needs a subject change.

### TASK-089: Control-plane integrity and adaptive routing

- **Requirement:** REQ-DOTFILES-CONTROL-PLANE-HARDENING (2026-09-18).
- **Risk Level:** R3 — protected runtime, delivery, and security-methodology surfaces.
- **Allowed Paths:** `STATUS.md`, `.delivery/current.json`, `TASKS.md`, `docs/archive/TASKS-077-087-completed.md`, `bin/delivery-ledger`, `bin/delivery-ledger-test`, `bin/dev-ready`, `bin/dev-ready-test`, `bin/project-init-test`, `bin/resume-brief-test`, `bin/ai-memory-hygiene`, `bin/ai-memory-hygiene-test`, `bin/ai-learn`, `bin/ai-learn-test`, `config/ai/README.md`, `config/ai/memory/identity.md`, `config/ai/memory-hygiene.json`, `config/ai/adapters/omp.md`, `config/ai/context/omp.md`, `config/omp/GOAL-ORCHESTRATION.md`, `config/omp/STATUS.md`, `skills/local/better-auth-security/SKILL.md`.
- **Protected Paths:** `bin/delivery-ledger`, `config/ai/adapters/omp.md`, `skills/local/better-auth-security/SKILL.md`.
- **Canonical Contract Owners:** STATUS/ledger; OMP adapter; memory hygiene/learn; better-auth-security.
- **Accepted Invariants:** no new agent/orchestrator; small accepted-system UI maintenance may stay local but browser-visible work remains validated; material/reference UI still uses designer/vision capability; ledger authority fails visibly when `STATUS.md` is absent/invalid; finished runs do not leak stale checkpoints into current projection; tracked memory must be safe under public visibility; Better Auth guidance fails closed on unknown hosts and treats cached sessions/proxy headers according to current documented behavior.
- **Regression Checks:** `delivery-ledger-test`, `dev-ready-test`, `project-init-test`, `resume-brief-test`, `ai-memory-hygiene-test`, `ai-learn-test`, `omp-routing-test`, `omp-effective-routing-test`, `skill-check better-auth-security`, `ai-policy-lint`, `ai-doctor --self-test`, `git diff --check`.
- **Runtime Evidence:** exact-head Core runtime CI remains required before this task may be archived.
- **Reopen Conditions:** stale state passes, UI routing over-orchestrates, private facts enter memory, or Better Auth multi-domain/session/proxy guidance regresses.
- **Non-Scope:** model/provider selection, new agents/skills, repository visibility mutation, history rewrite, broad historical memory scrubbing, live deployment.
- **Escalation Conditions:** a fix requires rewriting Git history, changing repository visibility, weakening independent review, or removing operational history beyond the targeted public-safety cleanup.

