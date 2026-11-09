# TASK-177 to TASK-189 — completed (plus finished TASK-151, TASK-157)

Moved from `TASKS.md` on 2026-11-05 (TASK-191). The original text of each
record is unchanged; fields after it (Risk Level, Allowed Paths, owners,
Reopen/Escalation Conditions, Ledger) were added from the task's own delivery
run so every record carries the current contract fields. Relative links in
moved records are rebased from the repository root to this directory.

### TASK-189: Device update notice and meta-ads upgrade path
- **Requirement:** REQ-DEVICE-AUTO-UPDATE (owner: upgrade and improve notification to other devices for auto update).
- **Risk / Surface:** R2; dotsync/shell hook/tests, dotads-meta setup/doctor/tests, sync doc, TASKS, changelog.
- **Contract:** autopull keeps ff-only/no-commit/no-install behavior; after a pull it writes a bounded one-shot notice (range, ≤8 subjects) plus `NOTICE:` actions from reconciliation; the interactive shell shows it once (atomic claim). Pending actions repeat while up to date. `dotads-meta` default meta-ads 1.3.1; workspace-only setup and doctor detect facebook-business below major 26 offline and never install in the background.
- **Done When:** dotsync and dotads-meta regressions cover notice content, bound, repeat, once-only display, SDK outdated/current/missing; gates and independent review pass.
- **Risk Level:** R2.
- **Allowed Paths:** `bin/dotsync`, `bin/dotsync-test`, `config/shell-tools.sh`, `bin/dotads-meta`, `bin/dotads-meta-test`, `docs/ai-memory-sync.md`, `skills/local/meta-ads-cli/**`, `skills/local/meta-ads-signal-engine/**`, `TASKS.md`, `CHANGELOG.md`.
- **Canonical Contract Owners:** `dotsync` (autopull and notice); `config/shell-tools.sh` (interactive display); `dotads-meta` (SDK version check).
- **Accepted Invariants:** autopull stays ff-only, never commits, pushes or installs; notice content has no terminal control bytes; shown once across concurrent shells.
- **Regression Checks:** `dotads-meta-test`, `dotsync-test`, `ai-memory-link --check`, syntax, `skill-check`, `security-check`.
- **Reopen Conditions:** a background run installs a package, a notice shows twice or carries control bytes, or an outdated SDK passes silently.
- **Non-Scope:** installing packages in the background; other devices; commit/push.
- **Escalation Conditions:** an upgrade needs a live install from a background job.
- **Ledger:** RUN-20261105T080836Z-6356c346 PASS.

### TASK-188: Meta delivery, learning and Pixel 2026 guidance
- **Requirement:** REQ-META-ALGO-PIXEL-2026 (owner: update Meta algorithm in dotads-meta as learning considerations and ad improvement, including latest Pixel, how it works and requirements).
- **Risk / Surface:** R1 docs; `meta-ads-cli` and `meta-ads-signal-engine` skill files, TASKS, changelog.
- **Contract:** one new owner each — `algorithm-and-learning.md` (delivery stages, learning phase, measurement changes, evidence-to-hypothesis checks, improvement order) and `PIXEL_2026_CHANGES.md` (how Pixel/CAPI/datasets work, 2026 changes, requirements). Label Meta vs third-party vs local; no invented thresholds or guaranteed lifts. Refresh stale CLI/SDK/API version facts; no code change.
- **Done When:** skill-check, local link/anchor check and security-check pass; independent review.
- **Risk Level:** R1.
- **Allowed Paths:** `skills/local/meta-ads-cli/**`, `skills/local/meta-ads-signal-engine/**`, `TASKS.md`, `CHANGELOG.md`.
- **Canonical Contract Owners:** `meta-ads-cli/references/algorithm-and-learning.md`; `meta-ads-signal-engine/references/PIXEL_2026_CHANGES.md`.
- **Accepted Invariants:** every claim labeled Meta, third-party or local with a cited source; no invented thresholds or guaranteed lifts.
- **Regression Checks:** `skill-check` (both skills), local link/anchor check, `security-check`.
- **Reopen Conditions:** a cited Meta source changes or contradicts a stated fact.
- **Non-Scope:** code changes; live accounts; commit/push.
- **Escalation Conditions:** a claim cannot be sourced.
- **Ledger:** RUN-20261105T045822Z-66025ccb PASS.

### TASK-187: History request budget and rate-limit stop
- **Requirement:** REQ-META-HISTORY-REQUEST-BUDGET (owner: "rekomendasimu? kerjakan" — complete AUTOSTOCK history blocked by Meta request limits).
- **Risk / Surface:** R2; provider/CLI and their tests, runtime reference, TASKS and changelog.
- **Observed failure:** live history re-read identical inventory for all five windows (~690 creatives each), then hit API 17/80004; throttle errors were retried after 1–2 s, spending more quota.
- **Contract:** read inventory once per live history run and reuse it with recorded provenance; later windows request Insights only, keeping each window's full collect scope identity. Throttle codes are not retried in-run: stop further requests, mark skipped work, and skip later windows. Offline `--input-dir` behavior unchanged. No Meta mutations, credentials or private data in Git.
- **Done When:** SDK and CLI regressions prove one inventory read, Insights-only later windows, shared inventory, distinct scopes, and rate-limit stop; full gates and independent review pass; AUTOSTOCK recollected read-only and verified.
- **Scope expansion:** the first live run timed out after three windows. CPU profile: `references()` scanned growing media/web indexes with `canonical()` per candidate (quadratic), ~415–440 s per AUTOSTOCK snapshot. Set-based dedup produces byte-identical media/web/sync/manifest output on the same private copy and input in 1.2 s. Workspace regression covers in-snapshot/cross-snapshot dedup and byte-stable republication.
- **Evidence:** SDK 33/33, full CLI, workspace 45/45, syntax, skill/docs and security-check PASS; independent review APPROVE (request budget) and APPROVE (publication fix). Live read-only recollection of the affected account: all five windows complete (one inventory read reused by four Insights-only windows), 45 report hashes verified, complete-history pointer set. Closure authority: `.delivery/runs/` TASK-187 run.
- **Risk Level:** R2.
- **Allowed Paths:** `bin/_dotads-meta-provider.py`, `bin/_dotads-meta-provider-test.py`, `bin/dotads-meta`, `bin/dotads-meta-test`, `bin/_dotads-workspace.mjs`, `bin/_dotads-workspace-test.mjs`, `skills/local/meta-ads-cli/references/account-workspace-runtime.md`, `TASKS.md`, `CHANGELOG.md`.
- **Canonical Contract Owners:** Meta provider (request budget); `dotads-meta history`; workspace publication.
- **Accepted Invariants:** one inventory read per live history run; no in-run throttle retry; byte-identical index output.
- **Regression Checks:** SDK, CLI, workspace, syntax, skill, security.
- **Reopen Conditions:** a history run re-reads inventory per window or retries a throttle code.
- **Non-Scope:** Meta mutations; private data in Git.
- **Escalation Conditions:** a fix needs a live write.
- **Ledger:** RUN-20261105T031105Z-b4387983 PASS.

### TASK-186: Recover bounded oversized creative pages without losing evidence
- **Requirement:** REQ-META-CREATIVE-PAYLOAD (owner: continue the remaining read-only test, then commit/push only once completed and safe).
- **Risk / Surface:** R2; Python provider/tests, owning runtime reference, TASKS and changelog. Preserve all accepted dirty and private data.
- **Observed failure:** the fourth full-field creative page at limit25 returns API1/HTTP500 with an explicit reduce-data hint; the same cursor and complete fields succeed at limits10/5/1 in bounded SDK GET probes.
- **Contract:** only that explicit creative payload rejection may reduce the page size25 →10 →1, retaining the same cursor, account, full fields and existing page budget. Record safe adjustment metadata; never skip rows, follow server next URLs, relax identity checks, drop fields or relabel incomplete evidence complete. Ordinary failures retain bounded retry/partial behavior. No Meta mutations, credential changes, private data in Git or transfers.
- **Done When:** SDK regressions cover full-field continuation, size1 terminal failure, other errors and page-limit preservation; CLI/workspace/syntax/skill gates and required independent review pass. Recollect the affected account only and verify immutable reports, scoped learning and preserved earlier partial versions. Commit/push is a separate authorized step after task-owned staged diff/security review.
- **Scope expansion:** pre-commit review found brandless `run --bm` could keep an inherited business/account default from another BM. Selected BM now sets `BUSINESS_ID` and drops an unselected inherited `AD_ACCOUNT_ID`; regression in `bin/dotads-meta-test`. Synthetic fixtures renamed so `security-check` passes without allowlist changes.
- **Evidence:** SDK 31/31, full CLI, workspace 44/44, syntax, skill/docs and security-check PASS; independent review REQUEST_CHANGES then corrected APPROVE. Live read-only recollection recovered 693 creatives (was 75) with a recorded 25→10 reduction; remaining partial windows failed on Meta request limits (API 17/80004), not payload size. Closure authority: `.delivery/runs/` TASK-186 run.
- **Risk Level:** R2.
- **Allowed Paths:** `bin/_dotads-meta-provider.py`, `bin/_dotads-meta-provider-test.py`, `bin/dotads-meta`, `bin/dotads-meta-test`, `skills/local/meta-ads-cli/references/account-workspace-runtime.md`, `TASKS.md`, `CHANGELOG.md`.
- **Canonical Contract Owners:** Meta provider (creative pagination); `dotads-meta run` (BM identity).
- **Accepted Invariants:** payload reduction keeps cursor, account and fields; no skipped rows; selected BM identity wins over ambient defaults.
- **Regression Checks:** SDK, CLI, workspace, syntax, skill, security.
- **Reopen Conditions:** a reduced page drops rows or fields.
- **Non-Scope:** Meta mutations.
- **Escalation Conditions:** a fix needs a live write.
- **Ledger:** RUN-20261104T214530Z-ef43d045 PASS (RUN-20261104T212207Z-40c64492 BLOCKED, superseded).

### TASK-185: Repair live read-test inventory transport
- **Requirement:** REQ-META-LIVE-READ-TEST (owner: continue read-only tests on both operator-selected accounts, designated dummy/test subjects but not verified sandboxes).
- **Risk / Surface:** R2; Python provider/tests, owning runtime reference, TASKS and changelog. Preserve prior dirty work and all private data.
- **Observed failure:** same-SDK/API GET comparisons isolate `DELETED` effective-status rejection (100/1815001) and oversized full-field creative pages (100 rejected; 25 succeeds). Enum presence in the SDK is not proof of server acceptance.
- **Contract:** explicitly exclude unsupported DELETED inventory from new declared scopes without silently dropping fields or changing old evidence; keep ARCHIVED and other supported states; request creatives in pages of 25. Retain immutable failed snapshots, full provenance, cursor/budget/error distinctions, BM/account isolation and operator-owned test notes. No Meta mutations, credential/config changes, private data in Git, transfer or model training.
- **Done When:** actual installed-SDK synthetic regressions, complete CLI/workspace, syntax and skill checks pass with required independent review. Recollect both selected accounts read-only and verify their actual local coverage separately; partial/empty data is not optimization proof.
- **Risk Level:** R2.
- **Allowed Paths:** `bin/_dotads-meta-provider.py`, `bin/_dotads-meta-provider-test.py`, `skills/local/meta-ads-cli/references/account-workspace-runtime.md`, `TASKS.md`, `CHANGELOG.md`.
- **Canonical Contract Owners:** Meta provider (inventory scope).
- **Accepted Invariants:** DELETED excluded explicitly and recorded; prior snapshots unchanged.
- **Regression Checks:** SDK, CLI, workspace, syntax, skill.
- **Reopen Conditions:** a new scope silently relabels old failed evidence.
- **Non-Scope:** Meta mutations; transfers.
- **Escalation Conditions:** a fix needs a live write.
- **Ledger:** RUN-20261104T202736Z-2d27d193 PASS.

### TASK-184: Account-scoped history learning and private portable evidence
- **Requirement:** REQ-META-PORTABLE-LEARNING (owner: continue five-period Markdown evidence and complex learning across devices).
- **Risk / Surface:** R2; Meta workspace/CLI/tests, owning skill/runtime/Bahasa guide, TASKS and changelog. Preserve existing accepted changes and unrelated work.
- **Contract:** full returned inventory/Insights in Markdown; history adds scoped observational memory without promoting claims; observation → hypothesis → experiment → outcome with pinned evidence. Explicit-account offline export/import carries selected learning and its evidence only, checks identity/hashes/conflicts, preserves local notes/economics and complete-history pointers, never transports credentials/assets/state or sends data over a network. No automatic cloud sync, causal/profit claims, live access, guessed IDs or Git operations.
- **Done When:** synthetic lifecycle, idempotent history, portable round-trip/dedup/conflict/tamper/account/BM isolation and existing CLI/workspace regressions pass; skill/syntax checks and required independent review pass. Actual account reads/transfers need separately selected targets.
- **Evidence:** initial workspace 44/44, full CLI, syntax/skill/link gates PASS. Independent review found unknown evidence-wrapper data and sibling-failure deduplication bugs; both reproduced by two failing tests before fixes. Corrections add fixed-schema allowlists and period-only observation identity, plus regressions. Final executed checks, required re-review and closure authority: `.delivery/runs/RUN-20261104T155130Z-7631e32f.jsonl`. Source/route provenance is not upstream identity attestation; no live reads, real transfer, credential edits, commit or push.
- **Risk Level:** R2.
- **Allowed Paths:** `bin/dotads-meta`, `bin/dotads-meta-test`, `bin/_dotads-workspace.mjs`, `bin/_dotads-workspace-test.mjs`, `skills/local/meta-ads-cli/**`, `TASKS.md`, `CHANGELOG.md`.
- **Canonical Contract Owners:** `memory/ads-memory.json` (account learning); `learn export/import`.
- **Accepted Invariants:** scoped learning only; hashes and identities verified; no network transfer.
- **Regression Checks:** workspace, CLI, syntax, skill.
- **Reopen Conditions:** learning crosses accounts or BMs, or import accepts tampered evidence.
- **Non-Scope:** live access; transfers; model training.
- **Escalation Conditions:** a change needs credential transport.
- **Ledger:** RUN-20261104T155130Z-7631e32f PASS.

### TASK-183: One-line operator token onboarding
- **Requirement:** REQ-META-ONE-LINE-ONBOARDING (owner: improve dotads MD across devices; AI prepares env, operator only fills the token line).
- **Risk / Surface:** R1; Meta skill, operator guide, setup/runtime/terminal references and TASKS.md; preserve accepted existing changes and all private configuration.
- **Contract:** one AI-owned onboarding checklist; create missing env safely after authorization, preserve existing keys/values/token_env, prefill only confirmed BM metadata, ask once if BM ID is unknown, then verify actual folder. No new CLI bootstrap command, automatic secret writes on pull, guessed IDs, hardcoded private IDs or guard bypass. Operator example: `META_ACCESS_TOKEN_AUTOLARIS=<masukanTOKEN>`; never write an active placeholder as a real token.
- **Done When:** owning English/Bahasa guides agree with actual CLI, link/skill checks and independent review pass. No actual credential-file edit is needed on this already-working device.
- **Evidence:** skill check 0 failures/warnings; five documents, 17 local links/anchors and balanced fences PASS; whitespace PASS. Docs-only: no new behavioral regression test; runtime unchanged. Independent review `574c5b8e-c161-49e8-814a-475dfc612d2e` APPROVE (configured `9router-fantastico/cx/gpt-6.1-sol:high`, not attested upstream identity); final result authority `.delivery/runs/RUN-20261104T134944Z-7200cbea.jsonl`.
- **Risk Level:** R1.
- **Allowed Paths:** `skills/local/meta-ads-cli/**`, `TASKS.md`.
- **Canonical Contract Owners:** `setup-and-commands.md` §0 (onboarding); `GUIDE.id.md`.
- **Accepted Invariants:** operator fills only the token line; no secret writes on pull.
- **Regression Checks:** `skill-check`, link/fence check.
- **Reopen Conditions:** onboarding asks the operator to rebuild configuration.
- **Non-Scope:** credential file edits; new CLI commands.
- **Escalation Conditions:** onboarding needs an automatic secret write.
- **Ledger:** RUN-20261104T134944Z-7200cbea PASS.

### TASK-182: Preserve existing named Meta token references
- **Requirement:** REQ-META-LEGACY-TOKEN (owner: support existing `META_ACCESS_TOKEN_AUTOLARIS` and fix its callers without unnecessary env renaming).
- **Risk Level:** R2; accept current Meta-task changes and preserve unrelated work.
- **Allowed Paths:** `bin/dotads-meta`, `bin/dotads-meta-test`, Meta skill/setup/runtime references, `TASKS.md`, local `.pi/tasks/` receipts.
- **Accepted Invariants:** `META_ACCESS_TOKEN_<KEY>` is a named token with explicit `META_BM_<KEY>_ID` and optional `_NAME`; preserve exact `token_env`; conflicting naming formats or multiple token references for a key fail closed; case-insensitive selection does not alias different labels; no generic/cross-BM fallback, guessed IDs, credential exposure, saved-binding migration or extra API calls.
- **Done When:** synthetic setup, saved binding, campaign/run caller and conflict tests pass along with existing regressions and required independent review. Actual secret file remains untouched while its inspection is guard-blocked.
- **Executed Evidence:** full CLI and filesystem 40/40, Node/Bash syntax and whitespace PASS on synthetic inputs. Separate review run `a2bbe237-06e4-419d-8ffb-9d57131e803b` APPROVE (read-only source/test review); configured route `9router-fantastico/cx/gpt-6.1-sol:high` is not independently attested upstream identity. Final gate/approval/closure authority: `.delivery/runs/RUN-20261104T132416Z-104480e8.jsonl`. No claim of real env migration or actual folder creation.
- **Non-Scope:** bypassing blocked secret inspection, actual env value reads/edits, mapping AUTOLARIS to AUTOKIRIM, inferring BM identity from a token, live Meta access, HOME Git changes, ledger repair, commit/push.
- **Canonical Contract Owners:** `dotads-meta` (BM token reference resolution).
- **Regression Checks:** CLI, filesystem, syntax, review.
- **Reopen Conditions:** an existing `META_ACCESS_TOKEN_<KEY>` binding is renamed or falls back across BMs.
- **Escalation Conditions:** a fix needs reading or editing a real secret file.
- **Ledger:** RUN-20261104T132416Z-104480e8 PASS.

### TASK-181: Honest Meta workspace setup and safe diagnostics
- **Requirement:** REQ-META-SETUP-DIAGNOSTICS (owner: fix bugs and improve the failed local setup experience).
- **Risk Level:** R2; existing Meta-task changes are accepted and preserved, not relabeled as this task's changes.
- **Allowed Paths:** `bin/dotads-meta`, `bin/dotads-meta-test`, `skills/local/meta-ads-cli/references/account-workspace-runtime.md`, `TASKS.md`, local `.pi/tasks/` receipts.
- **Accepted Invariants:** explicit BM selection never falls back; unknown labels are detection failures, not token-validity diagnoses; explicitly selected unavailable tokens fail before creating any directory; unattended setup without active profiles remains an offline no-op; successful setup reports its actual verified directory; no secret values, guessed IDs, live Meta requests or implicit migrations.
- **Done When:** synthetic regressions prove honest zero-work behavior, actionable non-secret unknown-profile errors and stable reported workspace paths; existing CLI/syntax gates and required independent boundary review pass.
- **Reproduced Baseline:** selected synthetic profile with a blank token exits 0 with `local BM workspaces ready: 0`, while the reporting directory does not exist. This is not a diagnosis of the owner's actual configuration.
- **Executed Evidence:** full synthetic CLI regression, filesystem 40/40, Node/Bash syntax and whitespace PASS. Final required executed checks, independent approval and closure are owned by `.delivery/runs/RUN-20261104T130439Z-69a3e02d.jsonl`. Separate reviewer run: `773d6edf-0dd6-4959-8fd6-811feb4d43fb` APPROVE (read-only source/test/receipt inspection); configured route `9router-fantastico/cx/gpt-6.1-sol:high` is not independently attested upstream identity. The actual local profile-detection cause remains unverified; no claim that the real reporting folder was created.
- **Non-Scope:** reading/altering real credentials, bypassing the blocked secrets inspection, shared secrets-loader parser changes, automatic alias/token discovery, HOME Git repair, real workspace setup/Meta access, commit/push.
- **Canonical Contract Owners:** `dotads-meta setup` diagnostics.
- **Regression Checks:** CLI, filesystem, syntax, review.
- **Reopen Conditions:** setup reports token validity from local presence.
- **Escalation Conditions:** a fix needs a live token check.
- **Ledger:** RUN-20261104T130439Z-69a3e02d PASS.

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
- **Canonical Contract Owners:** `dotads-meta history`; workspace history publication.
- **Protected Paths:** `bin/delivery-ledger`.
- **Reopen Conditions:** overlapping windows are summed or a partial history replaces the complete pointer.
- **Escalation Conditions:** a change needs live writes or ledger repair.
- **Ledger:** RUN-20261104T123148Z-d5fefb6a PASS.

### TASK-179: Lowercase named Meta env profiles
- **Requirement:** REQ-META-ENV-NAMING (owner: use `meta_ads_token_autolaris` naming).
- **Risk Level:** R2; existing dirty task-owned BM implementation is explicitly accepted, not replaced or relabeled as new work.
- **Allowed Paths:** `bin/dotads-meta`, `bin/dotads-meta-test`, `skills/local/meta-ads-cli/SKILL.md`, `skills/local/meta-ads-cli/references/account-workspace-runtime.md`, `skills/local/meta-ads-cli/references/setup-and-commands.md`, `TASKS.md`; native task receipts under this session's `.pi/tasks/` are local verification artifacts only.
- **Accepted Invariants:** preferred `meta_ads_token_<label>` plus explicit numeric `meta_ads_bm_id_<label>`; optional display name defaults to local label; BM selection is case-insensitive; legacy profiles remain supported; duplicate keys/IDs/tokens fail; missing credentials never fall back across BMs; saved token bindings are not silently migrated.
- **Regression Checks:** isolated CLI/BM profile fixtures; existing filesystem contracts; installed SDK contracts; syntax/whitespace. No actual secret file is read or changed.
- **Non-Scope:** live account access, migration of real profiles/credentials, history-period implementation, commit/push, or repair of the prior ledger guard.
- **Executed Evidence:** `RUN-20261104T114725Z-97abc39d`: lowercase/legacy CLI fixtures PASS; existing filesystem contracts PASS; installed SDK contracts PASS; Node/Bash syntax and whitespace PASS. Actual secret files were not read or edited; no live account calls occurred.
- **Historical closure:** original env-format run was offline-verified but lacked independent approval. TASK-180 re-verifies the current combined source and owns follow-up review/closure; read its final ledger result, not this historical BLOCKED run, for current formal acceptance.
- **Canonical Contract Owners:** `dotads-meta` (BM profile parsing).
- **Reopen Conditions:** a lowercase profile aliases another label.
- **Escalation Conditions:** a fix needs real profile migration.
- **Ledger:** RUN-20261104T114725Z-97abc39d BLOCKED; acceptance by TASK-180.

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
- **Ledger:** RUN-20261104T103638Z-27676dc8 BLOCKED; acceptance by TASK-180.

### TASK-157: Session focus
- **Requirement:** REQ-FOCUS.
- **Risk Level:** R2.
- **Allowed Paths:** run-bound focus, resume/router/access/ledger and tests, manifest/CORE/context/docs; [contract](../research/memory-focus-architecture-2026-10-29.md#accepted-delivery-contracts).
- **Canonical Contract Owners:** focus.state; ledger completion.
- **Accepted Invariants:** isolated expiring claims; captured boundaries persist; explicit references; no rival task authority.
- **Regression Checks:** focus/route/access/resume/ledger tests, context, policy lint.
- **Runtime Evidence:** concurrent claims and boundary probes.
- **Reopen Conditions:** leakage/overwrite/bypass.
- **Non-Scope:** write interception, commit/push.
- **Escalation Conditions:** budget/authority change.
- **Ledger:** RUN-20261030T064044Z-48745001 PASS (archived with TASK-191).

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
- **Ledger:** RUN-20261027T053300Z-80f31e76 PASS (archived with TASK-191).
