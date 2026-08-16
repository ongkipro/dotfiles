# Dotfiles Repository Audit

> [!CAUTION]
> **Immutable historical audit; superseded for current-state decisions.**
> Preserve the body as evidence for its named baseline and remediation
> worktree. “Open,” “resolved,” and working-tree statements below are not live
> task state. Use [`../TASKS.md`](../TASKS.md) for current work, disk plus
> executable checks for current behavior, and
> [`config/omp/config.yml`](../config/omp/config.yml) plus
> [`config/omp/STATUS.md`](../config/omp/STATUS.md) for current routing.

**Audit date:** 2026-08-15; refreshed 2026-08-16 after pulling 22 commits
**Repository:** `ongkipro/dotfiles`
**Branch inspected:** `main` at `90dd935` plus the uncommitted remediation working tree
**Scope:** repository structure, cross-CLI policy and memory, OMP routing, scripts,
installers, skills, documentation, security controls, CI, portability, and lean
maintenance opportunities
**Freshness boundary:** three unrelated OMP routing files changed concurrently
after the pull and were read but not edited or attributed to this audit

## Executive conclusion

Commit `90dd935` is not release-green by itself. It correctly repairs three
syntax/data defects in `ai-skill-evolution-test`, but the 22-commit subsystem
landed with incomplete integration and bypassable invariants:

1. the authoritative local suite now fails `ai-memory-hygiene-test`;
2. none of the fifteen new public commands is installed into `PATH` by either
   platform installer, while skills and templates invoke them by bare name;
3. the new Kelola memory root bypasses the canonical router, hygiene, lifecycle,
   and four of five supported CLIs, and some of its content attempts to grant
   standing commit/push/deploy authority;
4. several production gates accept assertions rather than evidence, and focused
   reproductions bypassed migration, rollback, verification, and review claims;
5. the latest GitHub Actions jobs never started because of account billing, so
   no current Ubuntu/macOS evidence exists. Older known CI portability defects
   remain unchanged in source.

The accompanying working-tree remediation closes the locally reproducible P0
and most P1 defects. All 26 discovered fixtures now pass. The repository still
cannot be called remotely release-green until these changes are committed and
the Ubuntu/macOS GitHub Actions matrix actually runs; the current base-commit
jobs were refused before checkout because of the account billing state.

The strongest parts remain worth preserving: the shared cross-CLI kernel,
append-only evidence intent, explicit state contracts, automatic fixture
discovery, reviewed promotion boundary, and SHA-pinned Actions dependencies.
The new subsystem should be described as implemented and extensively
fixture-tested, but installation, authority, privacy, concurrency, and semantic
validation required hardening rather than replacement.

### Remediation status

| Area | Working-tree result |
|---|---|
| Installer parity | RESOLVED — one fail-closed runtime command manifest serves Linux and macOS |
| Hygiene regression | RESOLVED — fixture passes and is now part of `ai-policy-lint` |
| Router scope/budget | RESOLVED — token boundaries, self-contained tasks, and hard byte limits have fixtures |
| Harvest provenance | RESOLVED — source verifier is mandatory and provenance is bound to run evidence |
| Ledger integrity | RESOLVED — serialized writers and monotonic PASS semantics |
| Migration/rollback | RESOLVED — added-line classification and structured fail-closed evidence |
| Release probes | RESOLVED — private-network targets blocked by default; expected HTTP errors supported |
| Kelola memory | PARTIAL — routed across CLIs and highest-risk content sanitized; compatibility namespace remains |
| Remote CI | BLOCKED EXTERNALLY — billing/spending-limit state prevents current cross-platform evidence |

### Canonical lifecycle encoded by the remediation

The repository now expresses one traceable operating chain:

`intent → repository specification → scoped context → resolved route → implementation → independent verification → delivery/release evidence → reviewed learning`

The repository contract pack is `AGENTS.md`, `PRD.md`, `TASKS.md`, `STATUS.md`,
`BUILD-LOG.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `OBSERVABILITY.md`, and
`RELEASE.md`. A delivery run records task, requirement, job, risk, capability,
worker, model, provider, reasoning effort, verification, result, and provenance.
`delivery-benchmark` evaluates observed outcomes; it never rewrites routing.
Memory routing and harvested learning remain advisory and cannot outrank repository
state or executable evidence.

## Repository inventory

| Area | Observed state |
|---|---:|
| Tracked files | 829 |
| `bin/` files | 65 |
| Discovered `bin/*-test` fixtures | 26 |
| Owned skills | 51 |
| Shared memory files | 13 |
| Project-reference memory files | 29 |
| Kelola special-root memory files | 18 |
| Tracked OMP directive files | 9 |
| OMP roles / explicit agent overrides | 13 / 11 |
| YAML files | 19 |
| JSON and TOML files | 17 |

## README remediation completed

The previous root README duplicated volatile state and had already drifted from
the executable configuration. It named Gemini 3.6 as the default after the
runtime moved to Gemini 3.7, mixed roles with agent counts, claimed 100% OS
parity, and implied that `diff-risk` automatically selected task routing.

The rewritten [`README.md`](../README.md):

- removes the manually maintained release badge and unsupported parity claims;
- derives its routing description from current `config/omp` sources;
- distinguishes OMP orchestration from the runtime-neutral shared kernel;
- documents all cross-CLI policy paths, including OMP and the Pi wrapper;
- documents the `ai-learn` capture, review, and promotion boundary;
- distinguishes direct capture from evidence-backed delivery learning;
- documents the new delivery/release state contracts without claiming they
  grant deployment authority;
- removes the volatile model-selector table after concurrent routing changes
  proved that duplicating current selectors in a general README drifts within hours;
- explicitly warns that the pulled subsystem is not fresh-install complete and
  that the current local/remote validation state is red;
- provides one concise repository map, installation path, daily command list,
  safety section, validation contract, and documentation authority table;
- labels the large architecture and dated audit documents as baselines rather
  than current executable truth.

## Validation results

| Validation | Result | Evidence |
|---|---|---|
| `bin/ai-doctor --self-test` before pull | PASS | All 18 earlier gates passed at `11f504b` |
| `bin/ai-doctor --self-test` immediately after pull | **FAIL** | `ai-memory-hygiene-test` assertion failure |
| All discovered `bin/*-test` after remediation | **PASS** | 26/26 fixtures passed |
| `ai-memory-check` | PASS | Canonical and repository Markdown graph accepted |
| `ai-policy-lint` locally | PASS | Routing, skills, memory, and templates accepted |
| `omp-routing-test` locally | PASS | 13 roles, 11 overrides, 2 overlays, 790 catalog models |
| Security scan | PASS with residual risk | No obvious secret patterns found |
| Shell parser sweep | PASS | Every tracked shell-shebang file passed `bash -n` |
| JavaScript parser sweep | PASS | Every tracked `.js` and `.mjs` passed `node --check` |
| New memory fixtures after remediation | PASS | Access, harvest, hygiene, lifecycle, route, and skill evolution passed |
| Delivery/release focused fixtures after remediation | PASS | Adversarial migration, rollback, provenance, sensitive-input, ledger, SSRF, and HTTP-error cases covered |
| Development specification suite | PASS | 24 tests passed |
| Source ledger | PASS | 11 records, zero findings as of 2026-08-04 |
| Git object integrity | PASS | No corrupt objects; unreachable objects were informational only |
| Gemini 3.7 Flash High live serving, 32-token budget | FAIL | Thought-only response without final output |
| Gemini 3.7 Flash High live serving, 256-token budget | PASS | TTFT 1.6s, 150 tok/s, 252 tokens |
| GitHub Actions at `90dd935` | **BLOCKED** | Both OS jobs were refused before checkout because account payment/spending limit failed |
| ShellCheck | NOT RUN | Binary is not installed and CI does not provide it |
| actionlint | NOT RUN | Binary is not installed and CI does not provide it |
| PowerShell parser | NOT RUN | `pwsh` is unavailable on the audited device |

Remote evidence:

- [`90dd935` Core runtime blocked before execution](https://github.com/ongkipro/dotfiles/actions/runs/31897264234)
- [`11f504b` Core runtime failure](https://github.com/ongkipro/dotfiles/actions/runs/31880285361)
- [`9dfc0bb` Core runtime failure](https://github.com/ongkipro/dotfiles/actions/runs/31880226252)

## Findings

### P0-01 — Fifteen documented public commands are not installed — RESOLVED IN WORKTREE

`install.sh:117` and `install-macos.sh:43-64` maintain old explicit command
lists. They omit every new delivery/release/learning executable:

```text
ai-memory-access, ai-memory-harvest, ai-memory-hygiene,
ai-memory-lifecycle, ai-memory-route, ai-skill-evolution,
delivery-benchmark, delivery-learning, delivery-ledger,
delivery-skill-usage, migration-risk, production-gate,
release-check, release-manifest, rollback-check
```

All fifteen returned `MISSING` from `command -v` on the installed device.
`skills/local/continuous-learning/SKILL.md:14-98` and
`config/templates/AGENTS.md:24-28` invoke them by bare command, so the shared
skill can be discovered by every CLI while its required runtime fails.
`bin/installer-link-test:121-124` tests the link helper only and cannot detect
manifest omissions.

**Required correction:** use one canonical public-command manifest in both
installers and add a completeness test that checks every command referenced by
templates and skills.

### P0-02 — Kelola memory bypasses the memory boundary and attempts to grant production authority — PARTIALLY RESOLVED

`config/ai/project-memory-kelola/` is a second project-memory root. The router,
hygiene, harvest, and lifecycle tools scan only `config/ai/memory` and
`config/ai/project-memory` (`bin/ai-memory-hygiene:46-52`,
`bin/ai-memory-lifecycle:11-16`, `bin/ai-memory-harvest:28-39`).
`bin/ai-memory-link:109-118` special-links the second root only into Claude Code,
so Codex, Pi, Antigravity, OMP, routing, and quality checks omit all eighteen
files.

More seriously, `project_dotfiles_memory_sync.md:16-17`, `MEMORY.md:16`, and
`project_parallel_dev.md:15` claim standing permission to commit, push to main,
and trigger production deploys. Memory is advisory and cannot expand the global
approval gates. Other files contain a customer workspace identifier, production
record counts, SSH host/user, service topology, backup tables, disk state, and
an unencrypted private-key location. No credential value was detected, but the
material does not belong in Git-synced advisory memory.

**Required correction:** remove authority-granting statements and sensitive
operational/customer facts; move durable non-sensitive Kelola references under
the canonical project-memory namespace; keep live topology and deploy truth in
the Kelola repository.

### P0-03 — Migration and rollback gates accept false safety evidence — RESOLVED IN WORKTREE

`bin/migration-risk:17-19` misses PostgreSQL
`ALTER TABLE ... RENAME TO`, `DROP TYPE`, `DROP VIEW`, and `DROP CONSTRAINT`.
The first was reproduced as `M1`, so `rollback-check` did not require the backup
proof reserved for M3/M4. The classifier also scans unrelated removed/context
patch text, so a non-migration string containing `DROP TABLE` reproduced a false
M3.

`bin/rollback-check:20-32` accepts any non-empty values as rollback and backup
proof. `Rollback-Command: true` plus `Backup-Proof: trust-me` returned PASS for
M4.

**Required correction:** inspect added lines from migration files by dialect,
cover common destructive/compatibility syntax, and require typed, independently
verifiable backup/rollback evidence bound to the release commit.

### P0-04 — Delivery evidence can certify a failed or corrupted run — RESOLVED IN WORKTREE

`bin/delivery-ledger:250-262` allows `finish --result PASS` after a recorded FAIL
or with no verification. `delivery-benchmark:113-142` then treats the finish
result as success independently of `verificationFailureRate`. A reproduced run
with a failed test produced `successRate=1.0`, `verificationFailureRate=1.0`, and
recommendation `PREFER`.

`delivery-ledger:98-111` also appends hash-chained events without a repository
lock. Eight parallel record commands produced sibling events and a broken chain;
`verify` exited 2.

**Required correction:** enforce lifecycle semantics as well as hashes, forbid
PASS unless required verification exists and all checks pass, exclude failed or
unverified runs from positive benchmark recommendations, and serialize event
append plus `current.json` updates.

### P0-05 — The merged authoritative local suite is red — RESOLVED IN WORKTREE

`bin/ai-memory-hygiene-test:58-66` expects the candidate to be a semantic
duplicate, but its Jaccard similarity falls below the configured threshold after
adding three qualifier tokens. The direct test and `ai-doctor --self-test` both
fail with `AssertionError`. The implementation is lexical token-set overlap,
not semantic comparison, so its name and guarantees overstate what it proves.

The live advisory scan also reports 23 issues: one duplicate index entry, four
oversize files, one scope violation, one semantic duplicate, and sixteen
volatile project-state findings. `ai-policy-lint` still passes because it runs
`ai-memory-check`, not canonical hygiene or the hygiene fixture.

**Required correction:** fix the fixture/algorithm contract, decide whether the
gate is lexical or genuinely semantic, run canonical hygiene from the policy
gate, and resolve or explicitly waive the existing findings.

### P0-06 — The authoritative cross-platform CI gate is red or unavailable — REMOTE VALIDATION PENDING

**Impact:** changes can pass locally and still be broken in every clean GitHub
Actions checkout. The README's new status badge will correctly show the failure.

**Ubuntu and macOS root cause:** `.github/workflows/core-runtime.yml:58` exports
`DOTFILES_DIR`, and `bin/ai-policy-lint:13-22` correctly finds its own checkout,
but `bin/ai-policy-lint:90` launches `skill-check` without a `SKILL_SOURCE`.
`skills/agents-bin/skill-check:5` therefore falls back to
`$HOME/dotfiles/skills/local`, which does not exist on either runner.

**Additional macOS root cause:** `skills/agents-bin/skill-remove:16-18`
normalizes the selected directory with `pwd -P` but compares its parent against
the unnormalized `SKILL_SOURCE`. macOS runner `TMPDIR` produced a path containing
`/T//skill-remove-test...`; the safe containment check rejected the legitimate
fixture because the two equivalent paths were not textually identical.

**Required correction:** pass the canonical source from `ai-policy-lint` into
`skill-check`, normalize `SKILL_SOURCE` once inside `skill-remove`, add a fixture
whose source contains redundant separators, and require both OS jobs to pass
before treating the repository as release-green. At `90dd935`, both jobs were
blocked before execution by GitHub account billing/spending limits, so the
current commit has no clean Ubuntu/macOS result at all.

### P1-01 — Production readiness is checked before project commands mutate the tree — RESOLVED IN WORKTREE

`bin/production-gate:74` records cleanliness, then runs repository test/build
scripts through `project-check` at lines 75-78 and never checks cleanliness
again before the final decision. Generated or modified release files can appear
after the clean gate while the result still says `clean_tree=PASS`.

**Required correction:** execute checks first and require cleanliness immediately
before the final result, preferably against a detached worktree at the exact
release HEAD.

### P1-02 — `project-check` can verify only part of a multi-stack repository — RESOLVED IN WORKTREE

`bin/project-check:71-79` contributes zero checks for Python when Ruff/Pytest is
missing. Another stack's passing check can mask that absence and yield VERIFIED;
the same shape exists for PHP without recognized Composer scripts. It also
falls back from a `pnpm-lock.yaml` repository to npm when pnpm is unavailable
and ignores `packageManager`.

**Required correction:** every detected stack must contribute an adequate check
or make the result UNVERIFIED; honor `packageManager` and the unique lockfile,
and refuse conflicting or unavailable package managers.

### P1-03 — Repository-controlled observability probes can reach private networks — RESOLVED IN WORKTREE

`bin/release-check:49-90` accepts arbitrary HTTP(S) URLs from
`OBSERVABILITY.md` and follows normal proxy/redirect behavior. A repository
change can issue GETs to loopback, RFC1918, link-local/cloud-metadata targets, or
redirect into them.

**Required correction:** require an explicit deployment-origin allowlist,
resolve and reject private/link-local/loopback destinations before and after
redirects, or execute probes from a constrained external monitor.

### P1-04 — Independent review and release environment are self-asserted — HARDENED IN WORKTREE

`bin/production-gate:97-105` accepts `Independent-Review: PASS` from the same
mutable `STATUS.md`; it is not bound to a reviewer, distinct actor, artifact, or
commit. `bin/release-manifest:13-15` calls Environment required, but lines 41-62
accept arbitrary values; `Environment: definitely-not-production` reproduced as
VALID.

**Required correction:** bind review evidence to HEAD and a distinct reviewer,
and restrict production-gate to an explicit production environment.

### P1-05 — Learning capture has competing authorities and weaker sensitive-data checks — PARTIALLY RESOLVED

`config/ai/AGENTS.md:57` directs `ai-learn capture`, while continuous learning
directs PASS delivery -> `delivery-learning` -> harvest. The same fix can create
two candidates with different provenance. `delivery-learning:60-79` accepts
arbitrary non-empty lesson text, while `ai-learn` rejects obvious secret forms;
the new hygiene checker has no secret/customer-data gate. `ai-learn promote`
runs link checking but not hygiene.

**Required correction:** choose one capture authority, reuse the same sensitive
data boundary, and make reviewed promotion run hygiene mechanically.

### P1-06 — Memory routing violates self-contained-task and byte-budget contracts — RESOLVED IN WORKTREE

`ai-memory-route:94-101` selects project memory from repository identity even
for a self-contained request; `what is 2 + 2?` in the Tokophi repo returned
`needed:true`. At lines 127-141 the byte guard is skipped for the first selected
file, so `--max-bytes 1000` selected a 20,159-byte file.

Substring matching at lines 39-46 also matched `git` inside `digital painting`.

**Required correction:** tokenize triggers, require material request relevance,
and enforce the budget before every selection, including the first.

### P1-07 — Harvest can skip source-run verification — RESOLVED IN WORKTREE

`ai-memory-harvest:66-70` verifies the source run only when
`delivery-learning` is discoverable; otherwise it trusts a self-hashed signal.
The fixture succeeds in that bypass configuration even though the skill says
source verification is mandatory.

**Required correction:** resolve the canonical verifier by repository path and
fail closed when it is unavailable.

### P1-08 — Lifecycle and skill-evolution conclusions use incomplete evidence — PARTIALLY RESOLVED

`ai-memory-lifecycle:36-55` labels Git-synced memory COLD/NEVER_USED from one
device's routed-access telemetry. It cannot see native auto-load/manual reads,
other devices, or Kelola memory. `ai-skill-evolution:65-69` counts BLOCKED as a
skill failure, and lines 27-42 validate sidecar self-hashes without binding them
to the delivery ledger.

**Required correction:** label lifecycle states `ON_THIS_DEVICE`, exclude
external BLOCKED outcomes from failure rate, and verify every metric source
against the ledger.

### P1-09 — Release probes cannot validate expected error responses — RESOLVED IN WORKTREE

`release-check:35-46` accepts expected 4xx/5xx values, but `urlopen` raises
`HTTPError` before the status comparison. A local expected-404 probe reproduced
as FAILED.

**Required correction:** treat `HTTPError` as a response with status/body when
the configured expectation includes that status.

### P1-10 — Benchmark records invalid numbers and is not immutable under concurrency — RESOLVED IN WORKTREE

`delivery-benchmark:59-83` accepts NaN/infinity and uses an `exists()` then
`write_text()` TOCTOU sequence. A NaN duration/cost emitted non-standard JSON
and still produced PREFER; concurrent/crashed writes can truncate or block the
claimed immutable record.

**Required correction:** require finite values, serialize with
`allow_nan=False`, and use exclusive atomic creation under the repository lock.

### P1-11 — Standalone `diff-risk` misclassifies untracked and sample-env changes — RESOLVED IN WORKTREE

`diff-risk:109-121` includes untracked names but not their content or line count;
a 1,000-line untracked Python file reproduced as `lines=0`, R1. Pattern
`\.env(?:\..*)?` also classifies `.env.example` as R4.

**Required correction:** inspect bounded untracked text content and distinguish
known templates from live environment files.

### P1-12 — New release templates are not fully governed — RESOLVED IN WORKTREE

The core workflow still omits `config/templates/**`. `ai-policy-lint:78-81`
requires only the six old templates, not `RELEASE.md` or `OBSERVABILITY.md`.
`config/templates/OBSERVABILITY.md:6-9` uses four `#` lines as comments, creating
multiple H1 headings.

**Required correction:** include template changes in CI, require every canonical
template in policy lint, and express probe instructions as prose or fenced text.

### P1-16 — Documents labeled definitive/current contradict executable state

`docs/DOTFILES_AI_ENGINEERING_CONTROL_PLANE.md:20-22` says there are twelve
roles and that `project-check` and `diff-risk` do not exist. The repository now
has thirteen roles and both tools. `docs/DOTFILES_AI_ENGINEERING_MASTER_BLUEPRINT.md:4`
calls itself definitive while lines 22, 43, and 47 still describe Gemini 3.6
and twelve roles.

This is an authority defect: an agent can follow a polished but obsolete
document instead of disk. The root README now labels these as baselines, but
each source document still needs a visible status banner or archival move.

**Required correction:** designate one current architecture document, mark the
others historical with supersession links, and avoid repeating live model
selectors outside `config/omp/ROUTING.md`, `config.yml`, and `STATUS.md`.

### P1-17 — `ai-doctor` can silently miss absent Claude project memory

`bin/ai-doctor:285-295` handles a correct symlink and an incorrect real
directory but has no final `else`. If the expected path does not exist at all,
the doctor reports neither failure nor warning even though the comments state
that losing this link silently removes project context.

**Required correction:** when Claude is installed, treat an absent project
memory path as a repairable failure and point to `ai-memory-link`. Add a fixture
for absent, real-directory, broken-link, and correct-link states.

### P1-18 — The documented live-model smoke test can produce a false failure

`config/omp/STATUS.md:53-57` recommends `omp bench ... --max-tokens 32` after a
selector change. Gemini 3.7 Flash High consumed that budget as reasoning and
returned no final output. The same selector passed immediately at 256 tokens.

**Required correction:** raise the documented smoke-test output budget or use a
minimal prompt and assertion designed for thinking models. Record catalog
validation and live-serving validation as separate evidence.

### P1-19 — Bootstrap is not reproducible and suppresses plugin failures

`install-macos.sh:86-90` executes the moving `https://mise.run` installer
directly. `config/mise-config.toml:2-17` pins sixteen tools to `latest`, so a new
device cannot reproduce an earlier device deterministically. `bin/tmux-setup:70`
clones TPM without a revision, while lines 73 and 78-79 suppress update and
plugin-install failures.

**Required correction:** pin security- and workflow-critical bootstrap inputs,
record deliberate rolling tools separately, and report failed TPM/plugin
updates as warnings with a non-zero strict verification mode. Do not silently
claim setup success after a required plugin operation fails.

### P1-20 — Core CI path filters omit files checked by the core suite — RESOLVED IN WORKTREE

`.github/workflows/core-runtime.yml:5-31` watches selected AI, OMP, shell, skill,
and installer paths but omits `config/templates/**`, even though
`ai-policy-lint` validates those templates. It also omits several linked runtime
configs and root policy-adjacent files. A template regression can therefore be
merged without starting the suite that is designed to catch it.

**Required correction:** either run the small core suite on every push/PR or
align the path list with every input read by `ai-doctor --self-test`. Add workflow
concurrency cancellation to avoid wasting duplicate matrix runs.

### P2-01 — Query telemetry is pseudonymous but guessable — RESOLVED IN WORKTREE

`ai-memory-access:9-10,51` logs an unsalted deterministic SHA-256 of normalized
queries. It correctly omits raw content and uses mode 0600, but low-entropy
prompts remain dictionary-guessable and events remain cross-linkable.

**Required correction:** use a keyed device-local HMAC or omit the query
fingerprint when path-selection telemetry is sufficient.

### P2-02 — Kelola linking is path-specific and reports completion after warnings — RESOLVED IN WORKTREE

`ai-memory-link:109-118` hardcodes one clone path containing spaces. Other clone
locations silently skip the mapping. A real destination directory produces a
warning but the command still returns success and prints completion;
`ai-doctor` checks only the HOME-level project-memory link.

**Required correction:** remove the special namespace, use declarative project
registration, and make doctor/link fixtures cover every configured mapping.

### P2-03 — Project-specific deploy truth is stored in global skills

`skills/local/kelola-deploy/SKILL.md:12-53` stores mutable server identity,
domain, ports, process topology, deployment mechanism, health endpoints, and
destructive recovery commands. This belongs to the Kelola repository, not a
globally synced methodology skill.

`skills/local/better-auth-security/SKILL.md` is a 432-line copied vendor manual
without source links, verified version, or freshness boundary, creating an auth
correctness maintenance risk.

**Required correction:** make Kelola deploy a thin router to a repository-owned
runbook, and reduce Better Auth guidance to stable security invariants plus
retrieval from current official documentation.

### P2-04 — New device records extend the language-policy violation

The global policy requires English system artifacts, but the new generated
`devices/irwansyahs-MacBook-Air.md` and its registry entry use Indonesian labels
and prose. The special Kelola memory explicitly permits Indonesian, contradicting
the higher-level rule.

**Required correction:** generate device/system records in English and reserve
Indonesian for conversation and intentional localized content examples.

### P2-11 — Repository language policy is not yet enforced

`config/ai/AGENTS.md:11` requires dotfiles skills, memory, and system documents
to be English. A conservative phrase scan found mixed or Indonesian prose in
6 of 13 shared-memory files, 9 of 29 project-memory files, and 3 of 12 top-level
system documents. Some skill references legitimately contain Indonesian output
examples, so automatic translation must not rewrite examples or localization
contracts blindly.

**Required correction:** migrate operating prose incrementally and add a narrow
lint for newly introduced Indonesian prose in English-only directories, with
explicit exclusions for localized examples and Kamus content.

### P2-12 — Static-analysis coverage has known blind spots

The repository-level gate discovers fixture tests but does not parse every
shell file, lint GitHub Actions semantics, or parse the PowerShell script. The
manual audit passed `bash -n`, Node parsing, Python compilation, JSON, TOML, and
YAML parsing, but ShellCheck, actionlint, and PowerShell parsing were unavailable.

**Required correction:** add dependency-free parser sweeps already available on
runners. Add optional ShellCheck/actionlint jobs only if their maintenance cost
is accepted; validate `docs/win-debloat.ps1` on a Windows runner or with `pwsh`.

### P2-13 — A runtime lock artifact is tracked but unused

`config/omp/config.yml.lock` is a zero-byte tracked file. Repository search found
no reader or writer. It entered in an unrelated historical commit and is not
ignored.

**Required correction:** confirm OMP does not require a pre-created lock, then
delete it and ignore the runtime lock pattern.

### P2-14 — Historical documentation creates avoidable maintenance surface

The control-plane roadmap and dated audit total 3,820 lines, while the master
blueprint adds another 113 lines and duplicates current routing claims. The
18-line `docs/dev-setup.md` is an unreferenced legacy redirect.

**Required correction:** keep historical evidence, but move it under an archive
namespace with explicit immutable dates. Retain one current architecture index.
Delete the unused redirect after confirming there are no external bookmarks
that need preserving.

### P2-15 — Secret detection intentionally misses opaque credentials

`.gitignore:32-38` correctly documents that an opaque credential without a
known prefix or assignment shape can pass both ignore rules and
`security-check`. The approval and diff-review rules mitigate this, but the
scanner's green result must never be described as comprehensive secret proof.

**Required correction:** keep manual staged-diff review mandatory. If false
positive tolerance permits, add a history-aware secret scanner in CI rather
than expanding an increasingly complex custom regex indefinitely.

## Lean-code findings

The following are the defensible simplifications from the repository-wide lean
review. Small standalone shell helpers are not listed: duplicating a three-line
`die` or `resolve_path` function is cheaper and more portable than introducing a
shared sourced library with path and bootstrap coupling.

```text
install.sh:112 — consolidate: generate both installer command lists from one canonical executable manifest and test that every public command referenced by skills or templates is included.
config/ai/project-memory-kelola/:1 — consolidate: remove the second memory namespace and register Kelola under the canonical project-memory router, lifecycle, hygiene, and cross-CLI link model.
config/ai/project-memory-kelola/project_dotfiles_memory_sync.md:1 — delete: meta-memory about memory-system wiring is not Kelola domain knowledge and attempts to grant authority that memory cannot own.
config/ai/project-memory-kelola/reference_deploy.md:1 — delete: move mutable deployment topology and sensitive operational detail to a repository-owned, access-controlled runbook; retain only a non-sensitive pointer.
config/ai/AGENTS.md:57 — consolidate: choose one capture authority; make ai-learn delegate to the verified delivery-learning/harvest path or retire the parallel pipeline.
bin/delivery-ledger:1 — consolidate: share canonical hashing, locking, atomic-write, and verification primitives across the delivery evidence commands instead of maintaining incompatible copies.
bin/rollback-check:1 — consolidate: parse release evidence once with strict typed fields and reuse it in rollback-check, release-check, production-gate, and release-manifest.
skills/local/better-auth-security/SKILL.md:1 — shrink: keep stable security invariants and retrieve version-sensitive behavior from current official documentation instead of carrying a 432-line vendor snapshot.
config/omp/config.yml.lock:1 — delete: remove the zero-byte unreferenced runtime lock artifact. Replace with an ignore rule if OMP recreates it.
docs/dev-setup.md:1 — delete: remove the unreferenced 18-line legacy redirect after checking external bookmarks. The root README and platform runbooks already own its content.
docs/DOTFILES_AI_ENGINEERING_MASTER_BLUEPRINT.md:1 — shrink: stop maintaining current model and role claims in a second architecture summary. Replace with an immutable baseline banner and links to ROUTING.md and STATUS.md.
docs/DOTFILES_AI_ENGINEERING_CONTROL_PLANE.md:1 — shrink: archive the implemented roadmap instead of maintaining it as current architecture. Replace current-state claims with a short supersession notice.
```

## Strengths to preserve

- One canonical policy reaches Claude, Codex, Pi, Antigravity, and OMP.
- Owned skills have one tracked source and runtime-specific adapters rather than
  copied methodology.
- Project-reference memory is explicitly separated from repository build truth.
- The reviewed `ai-learn` inbox prevents raw session logs from silently becoming
  canonical memory.
- The new delivery ledger, learning harvest, lifecycle, benchmark, release, and
  rollback commands establish a useful evidence-oriented direction once their
  trust boundaries and installation path are corrected.
- GitHub Actions dependencies are pinned by commit SHA and checkout credentials
  are disabled in the core workflow.
- The fixture suite covers destructive-path guards, secret handling, installer
  links, routing invariants, skill lifecycle, and memory links.
- OMP fallback and model capability validation is materially stronger than a
  schema-only check.
- The repository was free of obvious credentials during this audit.

## Recommended execution order

1. Commit the isolated remediation without staging the concurrent OMP changes.
2. Restore GitHub Actions billing and run the Ubuntu/macOS matrix at the new commit.
3. Move the remaining Kelola compatibility namespace under canonical
   `project-memory/` in a separately reviewed migration and continue sanitizing
   older localized/operational entries.
4. Unify direct `ai-learn` capture with the verified delivery-learning pipeline
   without making trivial lessons require a delivery run.
5. Add cross-device/native-read observations before using lifecycle telemetry for
   archival recommendations.
6. Establish one current architecture authority and archive obsolete blueprints.
7. Address the remaining bootstrap reproducibility, parser-coverage, global
   project-skill, and dead-artifact backlog.

## Release decision

**Current decision: locally validated remediation; remote release evidence pending.**

All 26 discovered fixture tests pass in the remediation working tree, including
the previously failing hygiene fixture and adversarial release/evidence cases.
Both installers now share a fail-closed command manifest, and the clean-runner
portability defects identified in older CI logs are corrected in source.

The worktree is not yet a release artifact: it is uncommitted, three concurrent
OMP files remain outside this audit's ownership, and GitHub Actions cannot start
until the account billing/spending-limit issue is resolved. Release confidence
therefore requires an isolated commit and successful Ubuntu and macOS runs at
that exact commit.
