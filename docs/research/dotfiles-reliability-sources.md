# Whole-system reliability: evidence and adoption

Reviewed: 2026-10-24. Implementation contract: TASK-135. Execution evidence:
`RUN-20261024T093836Z-08b11229`. The original detailed audit is retained at
`~/Documents/work/research/dotfiles-audit-2026-10-24.md`; this document records
adoption and operating limits, not a competing task queue.

## How external experience is used

Community reports provide failure scenarios, not proof that this repository has
the same defect. Technical changes below require an official reference or an
executable local reproduction. No third-party script was executed or adopted
from a thread. Source access date is 2026-10-24; upstream pages can change.

| Experience / source | Corroboration and decision | Repository consequence |
|---|---|---|
| [Self-hosting restore discussion](https://www.reddit.com/r/selfhosted/comments/1vgv73t/does_anyone_actually_test_their_restores/) reports apparently successful backups with unusable dump output. Anecdotal, not a measured failure rate. | PostgreSQL documents [dump and restoration](https://www.postgresql.org/docs/current/backup-dump.html) and [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html). Local fixtures reproduced duplicate database filenames and failed discovery returning success. | W1: namespace output by container, count discovery/dumps/checks, fail incomplete runs. Archive listing is not a restore drill; actual recovery still needs an isolated database and application checks. |
| [Chezmoi migration experience](https://ayydany.com/2026/07/28/my-dotfiles-outgrew-gnu-stow/) describes reviewing symlink replacement before migration. | [Official migration documentation](https://www.chezmoi.io/migrating-from-another-dotfile-manager/) distinguishes symlinks from their contents. Our installers already own migration; replacing the manager would add scope without fixing the reproduced bugs. | F4/F7/W2: validate legacy blocks and link ownership, preserve foreign launchers, resolve installed script links before deriving source paths. |
| [Dreams of Autonomy video](https://www.youtube.com/watch?v=y6XCebnB9gs), published 2024-02-01, covers Stow, version control, ignore files, adoption, and README maintenance. | Only the accessible description and chapter metadata were reviewed, not the video or a transcript. The [community tutorial index](https://dotfiles.github.io/tutorials/) links this material. | Retain the existing manifest and installer ownership model; document migration and recovery. The video is a navigation reference, not evidence of any specific command's safety. No switch to Stow is proposed. |
| [mise discussion #8611](https://github.com/jdx/mise/discussions/8611) reports surprising global lockfile changes; the discussion points to a subsequent fix. | [Official lockfile docs](https://mise.jdx.dev/dev-tools/mise-lock.html) distinguish project/global scope and symlink layouts. Old thread behavior cannot establish current behavior. | Pin the critical Node security update. Broad lockfile adoption remains a separate device-layout decision; do not run global lock generation across unrelated device configs as part of this repair. |
| [Pi issue #4246](https://github.com/earendil-works/pi/issues/4246) reports a broken session after compaction. It is not assumed to have our root cause. | Installed Pi API and the [official custom-compaction example](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/custom-compaction.ts), plus [message stop reasons](https://github.com/earendil-works/pi/blob/main/packages/ai/src/types.ts), establish completion semantics. Local mocks reproduced accepting error text as a summary. | W10: only complete successful text may replace context; auth/provider errors continue to the next existing model, then native fallback. Model order remains unchanged. |
| OWASP community guidance describes DNS validation races. | [OWASP SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) and our changing-DNS fixture support the finding. | W12: connect to a validated address, retain hostname/TLS verification, and prevent redirect or environment-proxy escape. |
| [Node 24.22.1 release](https://nodejs.org/en/blog/release/v24.22.1), dated 2026-10-21, is a security release. | Official archive SHA-256 checked before executing an isolated runtime. | U1: update the mise pin from 24.21.0 to 24.22.1; test without changing the device's selected Node installation. |

## Implemented findings and proof owners

The detailed original report preserves the reproduction and severity rationale.
The tests below contain the durable regression scenarios. Final execution status
belongs to the ledger, not this table.

| Findings | Invariant | Regression owner |
|---|---|---|
| F1–F3 | Account and parent identities cannot be silently reused across scopes; only one apply writer; effective keys are valid and unique. | `dotads-meta-test` |
| F4/F5/F7 | Malformed migration preserves the original; fresh Claude/Codex hooks are wired; foreign launchers survive. | `installer-link-test`, `shell-wrapper-test`, `ai-hooks-install-test` |
| F6 | A runtime collision is incomplete reconciliation, while other runtime links can still finish. | `ai-memory-link-test`, `dotsync-test` |
| F8 | Fatal Git search errors cannot become a clean security verdict. | `security-check-test` |
| F9 | Failed downloads preserve the previous skill set/date; transport failure differs from upstream absence. | `vendored-refresh-test` |
| W1–W5 | Backup names are collision-free; installed tmux paths resolve; sysfs links count; optional completion cannot hang startup; LSP mappings match file types. | `vps-pgdump-test`, `tmux-setup-test`, `tmux-battery-test`, `shell-wrapper-test` |
| W6–W9 | MCP fields/modes and parse failures are respected; promoted memory fits retrieval budgets; telemetry cannot follow foreign links; status requests retain repository references. | `ai-mcp-sync-test`, `ai-learn-test`, `ai-memory-access-test`, `ai-memory-route-test` |
| W10/W11 | Failed compaction cannot replace context; skill statistics count distinct verified evidence. | `pi-compact-test`, `ai-skill-evolution-test` |
| W12–W16 | Release probes use validated destinations and active declarations; UI requirements apply across stacks; resume claims require canonical evidence; missing GitHub CLI does not prevent local recovery. | `release-check-test`, `project-check-test`, `resume-brief-test` |
| CI coverage | Five existing design-tool suites are discoverable; missing dependencies are visible; dedicated CI requires complete coverage. Maintained Markdown triggers core checks. | `design-tools-test`, Core runtime workflow |

## Operator recovery and adoption

### Meta workspaces

A populated legacy `.meta-state.json` without `ad_account_id` is intentionally
refused. Back it up, verify every saved campaign/creative/ad set/ad ID and media
cache entry against the intended account, and explicitly add that account's
`ad_account_id`. Do not delete state just to make deployment proceed. Hashes
from the earlier implementation can show drift until reconciled; drift never
claims to update existing remote entities.

Use a separate workspace for another ad account. Changing a campaign identity
requires fresh ad set/ad keys; changing an ad set or creative parent requires a
fresh ad key. Review the dry-run before any separately authorized live apply.

`.dotads-meta.lock/owner.json` records PID, hostname, and start time. A concurrent
apply fails before credential lookup. Ordinary local failures release the lock;
a process crash or uncertain remote creation retains it. Confirm the old process
is stopped, compare remote objects with saved state, recover any missing IDs,
then remove only that verified stale lock. Age alone never authorizes reclaim.
The lock protects one local filesystem workspace, not separate devices/copies.

### Device migration

After publication, `dotsync pull` reconciles commands, context, and skills.
Fresh installers explicitly wire Claude and Codex hooks. Existing devices that
need hook bootstrap can run `ai-hooks-install --runtime claude` and
`ai-hooks-install --runtime codex`, then check each runtime. Codex still requires
trusting the exact hook definitions through `/hooks` interactively. Wiring checks
do not establish trust or prove that a runtime executed the hooks.

A preserved directory at a context-file destination is a reported failure.
Inspect the collision and rerun reconciliation after resolving it; the tool does
not delete foreign directories. Plain Git pulls require the documented
`ai-memory-link && skill-update` step.

### Node upgrades and npm globals

Changing the mise Node pin does not migrate npm global packages. The first
integrated run exposed this directly: a discoverable Shopify shim still belonged
to the old Node prefix and could not run under the new selection. Inventory
package names/versions and executable links before upgrading, retain the old
prefix, restore the same reviewed versions into the new user-local prefix, then
verify CLI execution and required native modules. Do not call `command -v` alone
proof of readiness or uninstall the old runtime before verification.

The [official mise Node guide](https://mise.jdx.dev/lang/node.html) describes
version-local globals and recommends the npm backend for CLIs that should live
independently of Node versions. Moving this repository's entire CLI ownership
model to that backend is a separate migration, not part of this repair.

On the audited device, all 21 original global package versions and 36 executable
names were restored under Node 24.22.1. Installs skipped lifecycle scripts; the
reviewed Claude local binary-placement script was then run explicitly. Selected
CLI version probes, the unchanged real Shopify Theme Check fixtures, three LSP
JSON-RPC probes, and a global SQLite in-memory query passed. The old prefix was
retained. No gateway service was restarted or private service database opened.

### Boundaries that remain explicit

- Linux fixtures are not hosted Linux/macOS CI evidence or a real fresh-device
  install. TASK-096 retains its hosted-CI requirement; TASK-097 retains its
  documented macOS mutation gap.
- Mock Meta commands do not validate a real account, Graph API behavior, spend,
  or provider credentials. No live ad operation was performed.
- Backup listing/integrity tests do not establish application restore readiness.
  Run a separately scoped restore drill with a disposable compatible database,
  expected schema/data checks, and application-level checks where required.
- Backup discovery selects postgres/pgvector candidates and uses line-delimited
  database names; unusual image names or newline-containing identifiers need an
  explicitly scoped backup procedure.
- Unsupported MCP TOML layouts fail closed without rewriting the file. Invalid
  canonical skill evidence excludes its affected collection and exits 2.
- Memory-hygiene advisories require verification in the owning project before
  curating historical references. Unrelated in-progress memory edits are
  preserved; local advisory counts can differ from a committed snapshot.
- Local Pi mocks establish extension behavior, not model availability or summary
  quality. Skill statistics are advisory counts, not causal effectiveness scores.
- Node was exercised from an isolated verified archive. CI image fixtures pin
  Pillow 13.0.0, verified against PyPI release metadata and a SHA-256-checked wheel. The device also
  reported the pinned version already installed; `mise exec node@24.22.1 --
  node --version` returned `v24.22.1`. Other devices use normal mise installation.
- Checkpoint/mobile access and Google/TikTok operations remain deferred. No new
  manager, scheduler service, or general orchestration layer was introduced.


## Hosted CI portability follow-up (TASK-136)

Remote run [40087062168](https://github.com/ongkipro/dotfiles/actions/runs/40087062168)
failed one Linux and five macOS gates. Repairs preserve the original behavioral
assertions and are covered by failing-before/passing-after scenarios:

- Missing ripgrep was a test dependency defect. Native `git grep` searches
  tracked/untracked maintained files, excludes immutable evidence and preserves
  no-match versus fatal-error exit semantics.
- macOS temporary aliases caused literal path expectation mismatches in linker
  and recall fixtures. Canonical fixture roots retain the same identity checks.
- Telemetry's first-create contention matches a documented Darwin `openat`
  create-or-open failure. Exclusive creation then existing-file append preserves
  no-follow, ownership and hardlink validation. See the [upstream fix and native
  reproduction](https://github.com/entireio/cli/commit/9c18f31b23a62749b804718125b17c236420a28a)
  and [Apple race-condition guidance](https://developer.apple.com/library/archive/documentation/Security/Conceptual/SecureCodingGuide/Articles/RaceConditions.html).
- `HTTPServer.server_bind` performs reverse DNS before startup readiness. The
  [runner issue](https://github.com/actions/setup-python/issues/1223) matches the
  timeout observed here. The synthetic fixture now binds numeric loopback without
  that lookup; forced DNS failure no longer prevents all behavioral assertions.
  The [CPython implementation](https://raw.githubusercontent.com/python/cpython/3.15/Lib/http/server.py)
  is the primary API reference. This remains a hosted-confirmation hypothesis
  until the repaired native macOS job is observed passing.
- SQLite context management commits/rolls back without closing the connection;
  the oracle now explicitly closes native handles while preserving seed commits.
  A native closed-handle regression catches the prior leak.

The inherited toolchain probe cleanup also now allocates its own unique private
scratch home instead of recursively removing a predictable pre-existing path.
No timeout, mutation assertion, tenant boundary, or filesystem guard was removed.
Local API/browser checks and simulated OS seams are distinct from hosted results.
