# Account reporting runtime

This is the implemented CLI contract for scoped account reporting. Repository
code, tests and TASK-155 evidence own execution truth. The earlier
[revision 3 design](account-workspace-guide.md) remains a historical proposal;
its implementation-status wording does not describe this newer runtime.

Implemented paths have offline SDK, filesystem and CLI evidence. Actual Meta
account permissions, effective server version, field availability and real macOS
execution remain unverified until an authorized runtime trial supplies them.

## Ownership and access

Dotfiles owns the helper, skill and guides. Private reports/assets live under
`~/Documents/dotads-meta-report/`; repository pulls do not transfer them or their
credentials. The separate DotAds application has its own repository and tenant
authorization. Its documentation mirror grants no application capability.

Account reads need the operator's selected scope and approved token reference.
Never ask for a token value in chat. `--token-env META_ACCESS_TOKEN` names a local
key. The parent uses `secrets-env`; only the provider child's environment receives
`ACCESS_TOKEN`. SDK errors and credential-bearing outputs are sanitized/rejected.
No reporting command creates ads, activates spend or changes campaign budgets.

## Business Manager auto-setup

For device onboarding, use the AI-owned [env preparation checklist](setup-and-commands.md#0-ai-managed-env-preparation-the-operator-fills-one-token-line):
the AI prepares missing configuration after authorization and the operator fills
only a missing token line. Reuse confirmed local BM metadata; ask once if BM ID
is unknown. Preserve existing values and `token_env`, and stop on guard refusal.
This does not add automatic credential creation/editing to CLI setup or pulls.

One device-local env profile owns one BM namespace and one token reference:

```text
meta_ads_token_autolaris=<set locally; never paste in chat or Git>
meta_ads_bm_id_autolaris=123456789
meta_ads_bm_name_autolaris=AutoLaris
meta_ads_token_another=<set locally>
meta_ads_bm_id_another=987654321
```

The preferred token name is `meta_ads_token_<label>`; labels use lowercase
letters, digits and underscores, starting with a letter. The matching numeric
`meta_ads_bm_id_<label>` is required: setup never guesses identity from a label
or token. `meta_ads_bm_name_<label>` is optional and defaults to the local label,
not a verified Meta display name. Select `--bm autolaris` (case-insensitive;
internal keys remain uppercase).

Existing `META_ACCESS_TOKEN_<KEY>` names are also supported without renaming the
token or rewriting saved `token_env` references. Supply the explicit numeric
`META_BM_<KEY>_ID`; optional `META_BM_<KEY>_NAME` defaults to the key. For example:

```dotenv
META_ACCESS_TOKEN_AUTOLARIS=<keep the existing local value>
META_BM_AUTOLARIS_ID=<explicit numeric Business Manager ID>
META_BM_AUTOLARIS_NAME=AutoLaris
```

Select `--bm autolaris` (case-insensitive). A token suffix is a local label, not
an observed BM identity: AUTOLARIS is not an alias for AUTOKIRIM. A lone token
without a configured BM ID cannot safely create a BM namespace. Do not infer an
ID from a token, display name or ad account ID. This support does not migrate
existing saved bindings to another token reference. Defining both
`META_ACCESS_TOKEN_<KEY>` and `META_BM_<KEY>_ACCESS_TOKEN` is rejected even if one
is empty; conflicting lowercase profiles remain rejected too.

Legacy `META_BM_<KEY>_NAME`, `_ID`, `_ACCESS_TOKEN` profiles remain supported.
Distinct legacy and lowercase profiles may coexist, but two naming formats
claiming the same canonical key, duplicate BM IDs or reused tokens are rejected.
Do not define both formats for the same BM. Existing saved `bm.json`/brand token
references are not rewritten: switching a registered BM's format requires an
explicit reviewed migration; keep its existing format until then.

Store these through the existing `secrets-env` local file workflow (0600).
Values are literal data, not shell expressions: do not add shell quoting or
`export`. Already-injected process env profiles work too. Token presence means
nonempty local configuration, **not verified validity or Meta permissions**.
Missing/invalid BM IDs, invalid display names, duplicate BM IDs and conflicting token bindings fail closed.
Only metadata and token availability leave the short-lived secrets-env loader.

```bash
# Offline: reconcile every locally configured, nonempty-token BM
dotads-meta setup --workspace-only
# Optional: reconcile one selected profile
dotads-meta setup --workspace-only --bm autolaris
```

The existing `ai-memory-link` post-pull entry point runs this same offline
reconciliation, including on current `dotsync autopull` up-to-date retries.
It performs no installs, account discovery, uploads or network requests. Without
Node, the linker skips this step; install Node through normal device bootstrap
and rerun setup. No active profiles means no reporting folder is created by this
mode. An invalid profile reports failure instead of silently claiming setup.
A changed env file takes effect on the next setup, relevant CLI invocation or
post-pull reconciliation; there is no background env-file watcher.

Setup outcomes are explicit:
- An unknown selected label is **profile detection failure**, not proof that a
  token is missing or invalid. Do not overwrite/reissue a token based on it.
  Check the selected local configuration source and active literal key names
  (`NAME=VALUE`, no leading comment marker, shell `export`, or key indentation).
  The default source is `~/.config/ai-local/secrets.env`; `SECRETS_ENV_FILE` can
  override it. Without a file, already-injected process profiles are supported.
- A detected profile selected with `--bm` but lacking a nonblank named token
  fails before creating directories, even if another BM is configured/active.
- Unselected offline reconciliation with no active profiles exits successfully
  as an explicit **skipped/no-op**, not `workspaces ready: 0`; it creates no root.
- Successful offline setup prints each actual workspace path. Renaming a BM
  does not change its saved directory. A local workspace does not prove Meta
  authentication or contain account reports until explicitly collected/imported.

Never paste token values into chat or logs. A blocked credential inspection is
an inspection boundary, not permission to inspect the same data through another
command. These diagnostics do not repair or inspect real credentials.

One profile is selected automatically. With multiple profiles, use `--bm KEY`
on `accounts`, `sync`, `history`, `report`, `import-media`, `adopt`, `init`, `doctor`, `run`
and `deploy`. Reporting roots are BM-local; explicit token overrides that conflict
with the selected BM are rejected. Missing selected credentials never fall back
to the legacy token or another BM. Binding is local declared ownership, not a
claim that Meta verified a token's BM or that all token-visible accounts belong
to it. The operator still chooses authorized account IDs.

BM names become safe readable slugs with a BM-ID suffix. Saved IDs preserve
directories across name changes and token rotation. Profile keys/IDs are stable
identity: changing those needs explicit reconciliation. Old flat account folders
and operational state are never moved, copied or adopted automatically. Repeat
setup preserves operator files. Dotfiles pulls transfer code only: names, IDs,
tokens, reports and assets must be configured/transferred locally with approval.

## Commands

```bash
# Offline: inspect locally registered accounts without creating a root
dotads-meta accounts --local --json

# Authorized read: discover available accounts, then explicitly select one
dotads-meta accounts --token-env META_ACCESS_TOKEN --json

# Authorized read: explicit account, dates and reporting levels
dotads-meta sync --account act_123 --since 2026-09-01 --until 2026-09-30 \
  --levels account,campaign,adset,ad --token-env META_ACCESS_TOKEN --json

# Offline: import a selected collection envelope with the same explicit scope
dotads-meta sync --account act_123 --since 2026-09-01 --until 2026-09-30 \
  --levels ad --input ./collection.json --json

# Offline: use the selected scope's last complete snapshot
dotads-meta report --account act_123 --json

# Offline: explicitly choose a partial or historical snapshot / a saved scope
dotads-meta report --account act_123 --snapshot '<saved-snapshot-id>' --json
dotads-meta report --account act_123 --scope-key '<saved-scope-key>' --json

# Selected assets: copy by default; move requires explicit operator authorization
dotads-meta import-media --account act_123 ./selected-image.jpg --json
dotads-meta import-media --account act_123 ./selected-video.mp4 --move --json

# Selected external project: plan first; apply adds an operational reference only
dotads-meta adopt --account act_123 ./existing-project --json
dotads-meta adopt --account act_123 ./existing-project --apply --json
```

All IDs, dates, paths and saved keys above are examples. Replace them with
operator-selected facts; examples are never evidence of account access.
`init name` remains a separate local campaign-template scaffold. For actual
account work, reuse the registered account directory (or create one from an
explicit ID and display name):

```bash
dotads-meta init --bm autolaris --account act_123 --account-name 'Example Account'
# Once registered by init or sync, the name is optional:
dotads-meta init --bm autolaris --account act_123
```

This places `brand.json`, `campaigns/` and `memory/` in the canonical account
folder. The selected BM ID/token reference and account ID seed the template;
other example fields still need replacement. Locally supplied identity is marked
unverified. Neither scaffold nor directory naming proves API access.

When an existing initialized folder already occupies the report root, explicitly
select it with `sync ... --existing-directory /selected/contained/folder`. Its
brand, state, campaigns and memory must agree with the chosen account. Unknown,
mixed or conflicting ownership stops registration. Notes, state and operational
files stay in place. An account rename changes display metadata, not its registered
directory. Multiple unregistered same-ID folders require an explicit choice.

## Five-window account history

`history` is a separate, explicitly requested read. A sync suggests an offline
plan; neither sync nor post-pull reconciliation starts history automatically.
Use the selected account's saved timezone/currency from an observed sync. A
campaign scaffold without a timezone cannot substitute the device timezone.

```bash
# Offline plan; uses account-local dates, never the device timezone
dotads-meta history --bm autokirim --account act_123 --plan --json
# Authorized read only, after approving the selected account and plan
dotads-meta history --bm autokirim --account act_123 --json
# Offline import: yesterday.json, last_7d.json, last_30d.json,
# last_90d.json and this_month.json are authorized collection envelopes
dotads-meta history --bm autokirim --account act_123 \
  --as-of 2026-11-04T00:00:00Z --input-dir ./selected-exports --json
```

Names/IDs above are examples, not configured credentials or verified access.
`--as-of` is a strict UTC ISO timestamp used for planning, not a claim about
collection time; actual source timestamps are retained. `--input-dir` needs a
valid `yesterday.json` to establish account identity and timezone before planning.
Every imported period is checked against that account, timezone, currency and
scope, and explicitly marked as an import without authenticated-read proof.

The five windows are yesterday, the last 7/30/90 **completed calendar days**
ending yesterday, and this month through incomplete today. Calendar arithmetic
handles timezone midnight, DST, leap years and year rollover. Whole-period
queries are independent: never sum overlapping windows, daily reach or averaged
frequency. Reporting delays and attribution restatements remain limitations.

Each period collects accessible campaign/ad-set/ad/creative inventory and
account/campaign/ad-set/ad Insights, without breakdowns, with `all_days` and
requested conversion action-report time. Requested attribution is `{}`;
effective server settings remain unknown unless actually observed. Current
inventory cannot establish historical targeting or budgets. These are five
bounded synchronous collections (`--max-pages` per resource/query), not daily
time series, async jobs, complete lifetime recovery or cross-window totals.
Large-account truncation remains partial evidence rather than a success claim.

Account-local output is immutable `reports/history/h_<hash>/HISTORY.md` plus
`observations.json`, linking the existing immutable snapshot reports and hashes.
`history.json` records the latest attempt separately from the last complete
history. `ACCOUNT.md` links both with explicit stale/partial context. A partial
or failed period exits 2, preserves successful period evidence and cannot
replace the last complete history. Snapshot corruption fails closed.

`OBSERVATIONAL_REVIEW_ONLY` means rows exist, **not** that optimization is
justified. `NO_OBSERVED_HISTORY` means all five declared windows completed with
no observed Insights rows: missing data is not measured zero, and this does not
prove a new account. `INCOMPLETE_EVIDENCE` blocks a complete-history claim.
Metrics absent from returned rows remain unknown; an explicit zero stays zero.

Every period report also includes `INVENTORY.md` (all returned resource fields,
including creative copy/story/feed specifications, targeting and budgets) and
`QUERY-DETAILS.md` (all returned query fields, raw action types/values, coverage
and errors). Data is sanitized, rendered as quoted JSON evidence inside Markdown,
and hash-pinned with the report. This is complete **returned evidence**, not
unrestricted API access, downloaded media, historical settings or all lifetime
activity. Missing optional fields remain missing; do not fill them by inference.

History appends one account-scoped observation per saved period to
`memory/ads-memory.json`, with the readable `memory/MEMORY.md`. Existing brand
entries and unit economics are preserved. Repeating identical evidence does not
append another observation, even if a different period fails; deduplication uses
period-specific evidence, never sibling-window completeness. A different
snapshot/restatement remains a separate version, not independent replication. Partial evidence is labeled, and periods
without snapshots cannot become metric observations. The five-window report
remains the authority for collection completeness; imported memory cannot replace
that report or its complete-success pointer.

## Account learning and private cross-device handoff

There is one memory owner, `memory/ads-memory.json` (version 1, with additive
learning fields), not a global pool of all clients. New lifecycle records bind
BM ID (or explicit legacy null), account ID, currency, timezone and exact dates.
Legacy entries lacking that scope are retained but excluded from scoped listing,
reuse and portable bundles. Changing an existing memory binding fails closed.
Read `learn list --account act_ID` first, then retrieve only matching entity/query
and date evidence. Do not load every client's history into an AI prompt.

```bash
dotads-meta learn list --bm <KEY> --account act_ID --json
# Use actual evidence objects from the selected scoped observation, not these placeholders.
dotads-meta learn record --bm <KEY> --account act_ID --stage hypothesis \
  --since YYYY-MM-DD --until YYYY-MM-DD --title 'Working hypothesis' \
  --summary 'Unverified explanation with explicit uncertainty.' \
  --evidence '<JSON array of snapshot_id/snapshot_hash/query_id/entity_id>' \
  --parent '<actual observation learning_id>' \
  --protocol '{"prediction":"Testable prediction","alternatives":"Plausible alternatives","falsification":"Observation that would refute it"}'
```

Evidence must reference an existing local or verified imported snapshot, exact
query and (when supplied) entity. Its date interval must fit the record. Parent
stages must use the same BM/account/currency/timezone. Hypotheses and experiment
plans retain the parent's evidence interval; outcomes may cite a later measured
interval, so an actual follow-up is not forced into historical dates. Compare
query/event/attribution settings explicitly before interpreting any difference.
Recording is
append-only and content-addressed; identical records deduplicate. Records remain
`insight`, confidence `UNASSESSED`, replication `NOT_ESTABLISHED`—recording an
outcome does not certify the result or promote a winner/rule.

| Stage | Parent | Required protocol fields |
| --- | --- | --- |
| `observation` | none | No protocol required; summary is a user-recorded observation, not automatically verified. |
| `hypothesis` | observation | `prediction`, `alternatives`, `falsification` |
| `experiment` | hypothesis | `change`, `control`, `primary_metric`, `event_mapping`, `decision_threshold`, `duration`, `rollback`, positive integer `minimum_sample` |
| `outcome` | experiment | `observed_result`, `confounders`, `conclusion` |

All required protocol fields except `minimum_sample` are non-empty strings.
An experiment record is a plan, never permission to run it. If event mapping,
effective attribution, currency, dates, entity, coverage or merchant outcomes do
not support a comparison, state that limitation; do not manufacture thresholds,
causal explanations, fulfilled revenue or profit. Use `NOTES.md` for operator
notes; the helper does not rewrite them. This is external evidence memory, not
model fine-tuning or access to Meta's internal learning state.

Cross-device portability is explicit and **offline**, not a new cloud-sync daemon:

1. On the source device select the BM/account, inspect scoped memory, and choose
   an existing private export directory (mode 0700) outside the code checkout
   and live workspace. The helper creates a new mode-0600 JSON bundle; existing
   files are never overwritten.
2. `dotads-meta learn export --bm <KEY> --account act_ID --output /private/path/learning.json`.
   The bundle contains scoped lifecycle entries and only their referenced
   sanitized collection evidence. It excludes env/auth files, token values,
   unscoped claims, local unit economics, media, campaign/deployment state and
   operator notes. It reports SHA-256 and `transferred: false`.
3. Transfer that selected private file only through an operator-approved channel
   and destination. Copying it is a separate action. Do not put it in dotfiles,
   shared AI memory, a public repository, chat, or an automatically published
   artifact. SHA-256 checks integrity, **not** trusted identity or authenticity;
   verify the expected hash through the approved channel.
4. On the target device prepare/select the same BM and a locally registered
   account with matching currency/timezone. No credential value crosses devices;
   a live read later needs the target device's own authorized token.
5. `dotads-meta learn import --bm <KEY> --account act_ID --input /private/path/learning.json`.
   Validation precedes memory changes: schema, BM/account/currency/timezone,
   snapshot/content hashes, query/entity/date references, lifecycle parents and
   duplicate IDs. Same-ID conflicts stop without overwriting local entries.
6. Inspect `learn list --account act_ID` and `memory/MEMORY.md`. The imported
   immutable bundle and full Markdown evidence are saved under
   `memory/imports/<sha256>.{json,md}` and explicitly marked imported/unverified,
   with `authenticated_read_observed: false`. Reimports deduplicate. An imported
   account can re-export referenced evidence without the source device.

Both file directions are bounded to 128 MiB, refuse symlinks, unknown fixed-schema
bundle/evidence-wrapper/entry/reference fields, and unsanitized credential-bearing
values/URLs detected by the sanitizer. Returned provider fields remain flexible
inside hash-covered collection evidence. Storage operations make no provider or
network calls. The CLI's existing BM selection may still load local profile
metadata/availability through `secrets-env`; it does not export credentials or
perform an authentication test. Sanitization is not a universal secret or
personal-data detector: review
selected source material before sharing. Never place tokens in learning prose.
Import never modifies `history.json`, `sync.json`, complete-report pointers,
local unit economics, existing claims or notes. Concurrent changes use the
account lock; a partial filesystem failure is an error, not a transactional
success claim. Retry after inspecting the retained evidence, never delete locks
blindly. Existing `learn add/list --brand` and economics workflows remain supported;
they are not automatically promoted into scoped portable evidence.

### Commerce insight, superseded history and offline refresh

History observations, `observations.json`, `HISTORY.md` and `REPORT.md` carry a
deterministic `commerce` block (`commerce-insight/1`) derived only from the
saved snapshot: account-level funnel (landing-page views, view content,
add-to-cart, initiate checkout, purchases, purchase value; one preferred alias
per step — omni, then pixel, then standard — never summed), ROAS, cost per
purchase/add-to-cart/landing-page view, step rates and AOV; per-level outbound
clicks as `outbound_clicks_exact_sum` (null when any row omits the field) plus
`observed_outbound_clicks_sum` and `rows_with_outbound_clicks`; top-5 spend
concentration per campaign/ad set/ad joined to status, objective, optimization
goal and promoted-object kind; a frequency watch (ad sets at frequency ≥4, an
observation, not a fatigue diagnosis); inventory distribution; and CPAS status,
catalog lineage and `catalog_segment_*` values kept separate from ordinary
purchases. Values are platform-attributed; nothing here is profit, settlement
or incrementality.

When a `complete` observation exists for a history window (period, since,
until), older `partial`/`INCOMPLETE_EVIDENCE` observations and older complete
snapshots of that exact window move from `entries` to `superseded_entries`
(with `superseded_by` and reason), unless a lifecycle record uses them as
`parent_id`. Superseded IDs are excluded from listing and export and are
skipped on import, so an old bundle cannot resurrect them.

```bash
dotads-meta learn refresh --bm <KEY> --account act_ID --json          # dry run
dotads-meta learn refresh --bm <KEY> --account act_ID --apply --json  # backs up memory first
```

`learn refresh` rebuilds history observations from the saved history revisions
(`history.json` complete and latest) and re-verified snapshots, offline. It
never calls Meta and never modifies `data/snapshots/s_*` or snapshot hashes.
`--apply` writes `memory/backups/ads-memory.<time>.<hash>.json` before saving.
It does not re-render immutable report revisions; a new `history` run or
`report` renders them with the current renderer.

Opt-in `--metric-profile cpas_v1` on `sync`/`history` adds the five
`catalog_segment_*` Insights fields (see
[CPAS Collaborative Ads](cpas-collaborative-ads.md)). Without it the request,
scope and scope hashes are byte-identical to before. Product-level
`converted_product_*` reporting is not requested.

## Transport and scope

The official CLI (1.2.0 when designed; 1.3.1 verified 2026-11-04) does not expose the needed Insights level and
attribution controls. The read adapter uses its already-installed official
`facebook-business` SDK through a separate Python process. Native CLI writes and
the existing dry-run/PAUSED deployment path retain their own approval gates.

The helper resolves Python beside the real `meta` binary; an explicit
`DOTADS_META_PYTHON` path can select an existing compatible environment. It does
not install dependencies during reads or offline report rendering. Observed on
2026-11-04: SDK 26.0.2, requested API v26.0, used by real read-only collections.
v24.0 Marketing API support ends 2026-11-10; upgrade devices still on SDK 24.x. Check the [API source record](api-and-evidence.md)
and current official support dates before real use or upgrades.

An internal `--plan` validates and normalizes the request before credential
access. It shares the exact scope helper with collection, including inventory
field sets and status filters; failed refreshes retain that same request identity.
The provider uses explicit read-only SDK calls, cursor continuation and bounded
retries. It never follows arbitrary `paging.next` URLs. Page exhaustion, truncation,
denial, malformed responses and empty success remain distinct.

Defaults are four inventory resources (campaigns, ad sets, ads, creatives), all
four Insights levels, no breakdowns, `all_days`, and conversion action report
time. Dates are mandatory. The provider records exact effective-status filters,
requested/required/observed fields, account currency/timezone and collection
times. Campaign/ad-set/ad inventory explicitly excludes `DELETED` from requested
effective-status filters: live GET comparisons on v26.0 rejected that status
with 100/1815001 even when requested alone. `ARCHIVED` and the other declared
supported states remain requested; resource query metadata records
`excluded_statuses: ["DELETED"]`. This is a new, visibly different collection
scope, not a fallback that labels the old failed scope complete. Preserve all
prior snapshots/reports. An SDK enum value is not proof of server acceptance.
Completeness covers only this declared non-deleted inventory scope and the
server's visible records; it does not establish retained deleted objects or all
lifetime account history.

`--breakdowns age,gender`, `--attribution '{"action_attribution_windows":["7d_click"]}'`
and `--action-report-time conversion|impression|mixed` change measurement scope.
Conflicting attribution sources/windows fail locally. Unsupported combinations
fail visibly; controls are not silently dropped. Requested settings are saved;
unobserved effective attribution/API settings remain unknown.

The provider defaults to 100 pages per resource/query; `--max-pages` accepts
1–1000. Inventory pages normally request 100 rows, but full-field creatives use
25: live v26.0 rejected 100-row creative pages as too much data. A later page
can still reject 25. Only an explicit API1/HTTP500 reduce-data hint on creatives
reduces the same cursor request to 10, then 1 if needed, and keeps the smaller size
for subsequent pages. `page_size_reductions` records page/from/to/reason without
raw cursors or server error text. At most two reductions occur per resource;
size 1 failure stays partial/unavailable and ordinary errors retain bounded
retries. All requested fields remain unchanged; no rows are skipped. A page-limit
stop stays partial (100 creative pages cover at most 2,500 rows, fewer after a
reduction). Successful recovery is complete only after actual exhaustion.
A live `history` run reads inventory (campaigns, ad sets, ads, creatives) once,
with the first window, then requests only Insights for the other windows and
reuses that same inventory; each reusing snapshot records
`source.inventory_source`. Inventory is current state, not per-window history.
Meta throttling (API 4/17/32/613/80004 or HTTP 429) is not retried within
seconds: the provider stops further requests in that run, marks remaining
resources/queries `RATE_LIMITED_SKIPPED` and sets `source.rate_limited`, and
`history` skips the remaining windows. Retry later; a skipped window is missing
evidence, never empty history or zero spend.
CLI collection is bounded to 180 seconds and 128 MiB stdout. Hitting a
limit is not a complete empty result. Large asynchronous backfill and resumable
network checkpoints are not implemented; rerun a deliberate bounded scope.

## Files and publication

```text
dotads-meta-report/
  <bm-name>--bm_<id>/
    bm.json, GUIDE.md, accounts.json
    assets/
      ASSETS.md, index.json          # shared local asset provenance
      images/, videos/              # reusable across this BM's accounts
      temporary/                    # opt-in copies; no automatic deletion
        index.json, images/, videos/
    <Account Name> (act_<id>)/
      account.json, ACCOUNT.md, NOTES.md, sync.json
      brand.json, campaigns/         # when init --account is used
      memory/ads-memory.json, memory/MEMORY.md # scoped learning + retained legacy claims
      memory/imports/<sha256>.json, <sha256>.md # selected private handoffs
      data/snapshots/<snapshot-id>/
      reports/<period-and-scope>/<immutable-revision>/
        REPORT.md, campaigns.md, adsets.md, ads.md, insights.md
        INVENTORY.md, QUERY-DETAILS.md # full returned sanitized evidence
        metadata.json, inputs/      # internal machine-readable provenance
      media/index.json              # account-specific remote observations
      web/index.json
      operational-references.json   # when an adoption is explicitly applied
```

New BM account folders use a sanitized display name plus canonical `act_ID`.
Sync creates them automatically; repeated sync/init uses the saved ID mapping.
Unscoped legacy roots retain their previous directory and Markdown/CSV renderer;
existing reports are never rewritten. BM human-facing reports are Markdown-only;
JSON snapshots, indexes, state and hash metadata remain internal source evidence.

Registry identity is the account ID. Paths, registry/schema/identity conflicts,
symlinks and uncertain locks stop the operation; never delete locks blindly.
The root must have verified private permissions. Parent directories must remain
operator-controlled; hostile concurrent directory replacement is outside this
local bootstrap contract.

Each query has a deterministic identity covering its exact account, dates,
level, fields, breakdowns, attribution and definitions. Required inventory field
sets and filters participate in collection scope. Row identity also includes
entity, date bucket and returned breakdown dimensions. Different levels and
breakdown scopes are not added together into a fabricated account total.

Snapshots and their manifests publish before mutable pointers. `sync.json` tracks
the latest attempt and last complete success per scope. Partial/failed attempts
cannot replace complete-success pointers. After a failed different-period request,
default reporting cannot silently show a different period as current; select the
older scope explicitly if needed. Reports expose failed/partial latest attempts.

Markdown report revisions (legacy roots also retain CSV exports) pin snapshot bytes, queries, renderer/metric versions,
selection/freshness context, and exact media/web index hashes. Old revisions stay
immutable, including pinned enrichment records. A new restatement, selection or
enrichment creates a new revision. Corrupt saved inputs/artifacts fail clearly.
`NOTES.md` and deployment state remain human/operational authority.

## Interpretation and input provenance

Reports retain zero-spend inventory and unresolved historical entity references.
Missing conversions, unsupported fields and unknown costs are not measured zero.
Platform spend, clicks, purchases and ROAS do not establish net profit, causal
winners or authorization to change spend. Scoped economics remain an explicit
separate input through the existing analysis workflow; mixed-brand account costs
are never applied globally by these reports.

`--input` expects the collection envelope used by the SDK adapter, not arbitrary
Ads Manager CSV. It needs account identity/currency/timezone, explicit scope,
per-resource coverage/rows, query envelopes and source times. An AI may normalize
authorized exports only when those facts are actually known; mark unavailable
resources explicitly rather than inventing complete coverage. Input bytes are
hashed once and tagged `LOCAL_INPUT`; a declared SDK source is not proof of an
authenticated read on this device.

Indonesian market priors apply only to an explicitly selected ID market. Account
currency, timezone and conversation language do not establish target geography.

## Assets, destinations and recovery

With a selected BM, local import defaults to the **shared BM assets** store.
The selected `--account` must already be registered, but other accounts in the
same BM can reuse the returned permanent path without another copy. Hashes and
an import journal preserve provenance; the originating account is not a claim
that every account used that creative. This does not upload anything to Meta.

```bash
dotads-meta import-media --bm autolaris --account act_123 ./image.jpg --json
dotads-meta import-media --bm autolaris --account act_123 ./video.mp4 --temporary --json
# Explicit legacy/account-only storage remains available:
dotads-meta import-media --bm autolaris --account act_123 ./image.jpg --account-local --json
```

Temporary mode makes a copy under `assets/temporary/`; it cannot be combined
with `--move` or account-local mode. Nothing automatically expires/deletes these
files. Do not reference scratch paths in durable campaign manifests; use the
returned permanent path instead. No original images/videos are fetched merely
by sync/report. JSON/hash records remain durable even if future explicitly
approved cleanup removes scratch bytes.

Local import stores verified content-addressed bytes with source provenance.
Copies preserve the original. Explicit moves use a private source claim and
durable journal; destination bytes and index must be verified before cleanup.
Recreated source paths, changed bytes, conflicting journals and existing claims
stop cleanup or require reconciliation. Recovery never overwrites a recreated
source. Repeating a completed unchanged operation is idempotent.

Remote creative images/videos/thumbnails remain labeled references. The local
hash does not prove a Meta image hash or creative association. Destination metadata
includes multiple URLs/native destinations where returned; no page capture,
remote original download, transcription or creative-quality proof is implied.
URL credentials and CSV formula-leading strings are handled defensively.

`adopt` reads only the selected project's operational files, skips credentials,
checks structured account bindings, and hashes the plan. Apply requires that
unchanged plan and writes a reference/result in the reporting workspace. It never
copies deployment state, moves project media or changes the source project.
Full operational cutover, cross-device transfer and source cleanup remain separate
explicitly planned operations.
