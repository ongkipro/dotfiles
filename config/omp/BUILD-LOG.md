# Build Log — OMP Orchestration

Record only durable configuration changes, validation evidence, and gotchas the next maintainer needs. Newest entry last. `STATUS.md` holds the current snapshot and links here for history.

## 2026-08-12 — Evidence baseline from `~/.omp/stats.db`

Routing was rebuilt from measured usage rather than list price. Source: 11,651 calls over roughly 70 hours (9–12 August 2026), all recorded under one working folder.

**The finding that drove every decision:** 95.8% of all tokens were `cache_read` — re-reading conversation history, not new work. Output tokens were 0.22% of the total. Reasoning effort is therefore almost irrelevant to cost; context size multiplied by turn count is the actual lever.

- Main session: 97.7% of tokens. Subagents: 4.3% of cost across 1,253 calls, because their contexts are bounded.
- Cost per call: `gpt-5.6-sol` $0.0953, `claude-opus-4-6` $0.0943, `gemini-3.6-flash` $0.0845, `gpt-5.3-codex-spark` $0.0215, `gemini-3.1-flash-lite` $0.0015.
- Cost per million tokens: `gemini-3.1-flash-lite` $0.079, `gemini-3.6-flash` $0.216, `gpt-5.3-codex-spark` $0.317, `gpt-5.6-sol` $0.679, `9router/cx/gpt-5.6-sol` $2.101.
- Quality signals: `gpt-5.6-sol` had the lowest tool-call error rate at 5.2% and the leanest loop at 1.00 tool calls per turn; `gemini-3.6-flash` 7.8%; `gpt-5.3-codex-spark` 10.2% and 1.99 calls per turn.

**Gotcha worth keeping:** Gemini 3.6 Flash looked like the cheap lane per token, yet ranked second in total cost. Its million-token window meant compaction never fired, so context grew to roughly 390K per call and was re-read every turn. Cheap per token is not cheap per call when nothing bounds the context.

## 2026-08-12 — Three capacity pools (`8167a5c`)

Each provider now carries the work it is measurably best at. Antigravity takes volume including the main session; Codex takes the two precision lanes; direct Anthropic is judgment only, tiered so Sonnet 5 handles ordinary review and Opus 5 is reserved for `xhigh` and `max`.

Compaction gained real limits for the first time — it had been enabled with no threshold at all, so it inherited a default scaled to the model window and effectively never ran: `thresholdTokens` 140000, `keepRecentTokens` 40000, `dropUseless`, `idleEnabled` at 100000.

Three configuration defects were found while auditing:

- The bundled `designer` agent referenced `@designer`, a role that did not exist. Added as an alias beside `vision`.
- `librarian` declares `thinkingLevel: minimal`, which Gemini 3.1 Pro does not support — it offers `low` and `high` only. The `research` role uses Gemini 3.6 Flash instead, which supports `minimal` and keeps the million-token context.
- `tiny` had no fallback path at all, neither role-keyed nor model-keyed. It is used for internal short-form work, so an Antigravity outage would have stalled it.

Inspect bundled agent definitions with `omp agents unpack --dir <tmp>`; they carry their own `model` and `thinkingLevel` declarations that interact with `agentModelOverrides`.

## 2026-08-12 — Recovery through directly connected providers only (`92119c2`)

9Router was removed from every fallback chain. It is a tunnelled transport, which makes it the wrong dependency in a recovery path — chains are invoked precisely when something has already failed — and its measured cost reached three times the direct route for an identical model. It remains configured as an optional manual route.

Chains were rebuilt from Antigravity, Codex, and Anthropic alone, still changing provider on the first hop. Recovery slots came out evenly balanced at twelve per provider.

A fourth defect surfaced here: `gpt-5.3-codex-spark` has a 128K context window, smaller than the new 140K compaction threshold, so a session falling back to it could exceed the model's window before compaction fired. Replaced with `gpt-5.4`, which carries a million-token window.

**Verification run and recorded as passing:** agent resolution, roster coverage, thinking-level support, context windows above threshold, first-hop provider change, per-role fallback coverage, zero 9Router in recovery, zero unknown model identifiers.

## 2026-08-12 — Single-provider session overlays (`68b79eb`)

`--model` cannot pin a session to one provider: specialist agents resolve through roles, so they keep their own providers and the session stays multi-model. Config overlays replace the whole role table for one run instead.

`overlays/codex-only.yml` and `overlays/antigravity-only.yml` each pin all twelve roles and confine recovery to the same provider, on the reasoning that a session deliberately pinned to one provider should fail inside it rather than quietly restoring the routing the operator just opted out of.

Verified by running each with `--mode json` and reading the actual provider and model off the response: `codex-only` resolved `openai-codex/gpt-5.6-sol`, `antigravity-only` resolved `google-antigravity/gemini-3.6-flash`.

**Known capability gap:** Antigravity's Claude Opus 4.6 stops at `high` reasoning, so an Antigravity-only session has no equivalent to the `xhigh` and `max` advisor tiers. Treat advisor output from such a session as one tier lower than requested.

A `codex-spark-only.yml` overlay was drafted and then dropped as unnecessary. Its constraints are worth remembering if it is ever revisited: Spark has no `minimal` or `max` reasoning level, accepts no images — so `vision` and `designer` cannot review screenshots — and its 128K window requires a lower compaction threshold than the main config uses.

## 2026-08-12 — Discovery separated from mechanical support (`704077e`)

`scout` and `sonic` both resolved to `smol`, which optimised the wrong thing. `scout` produces the compressed map the main session then makes decisions from, so a weak model there does not merely waste a call — it returns a confident, wrong map that the parent trusts, which is worse than no map. `sonic` only performs mechanical updates and data collection, where that failure mode does not exist.

`scout` now resolves to `research`, joining `librarian`: both read widely and return a grounded, compressed summary, so they want the same model rather than a new role. `sonic` keeps `smol`. All checks re-run and passing.

## 2026-08-12 — Documentation

`ROUTING.md` and the repository `README.md` were updated alongside every change above, so neither describes routing that no longer exists. A visual summary of the whole rebuild — evidence, pool diagram, escalation ladder, before-and-after comparison, and the five defects — was written to `~/Documents/work/notes/omp-orchestration-setup-2026-08-12.html`.

**Two facts were unverified on this device** at the time of writing: direct Anthropic and Antigravity Gemini 3.1 Pro each served zero calls across the entire history sampled above. Since `config.yml` describes intended routing while availability is device-local, a role pointing at an absent model degrades silently rather than failing loudly. Closed by the benchmark below.

## 2026-08-12 — Benchmark of the three unproven models

Five of the twelve roles pointed at models with no execution history on this device. Benchmarked with `omp bench --runs 1 --max-tokens 32 --par 1`.

| Model | Roles | Result | TTFT | Throughput |
|---|---|---|---|---|
| `anthropic/claude-opus-5` | `advisor-xhigh`, `advisor-max` | Serves | 1239 ms | 17.2 tok/s |
| `anthropic/claude-sonnet-5` | `advisor` | Serves | 786 ms | 18.7 tok/s |
| `google-antigravity/gemini-3.1-pro:high` | `vision`, `designer` | Serves | 4840 ms | 102.6 tok/s |

Direct Anthropic is available here, so the advisor tier is genuine rather than a silent degradation to Opus 4.6. Every role now points at a model proven to run on this device.

**The gotcha this exposed.** The first attempt benchmarked `google-antigravity/gemini-3.1-pro` as a bare selector and failed:

```
Cloud Code Assist API error (400): Budget 0 is invalid.
This model only works in thinking mode.
```

Gemini 3.1 Pro rejects a request carrying no thinking budget. A reference that omits its reasoning suffix therefore fails outright at call time — it does not quietly fall back to a default level. The configured routes were never affected, because they specify `:high`, and an audit of all 100 model references across `config.yml` and both overlays confirmed every one carries an explicit suffix. This is now invariant 7 in `STATUS.md`.

The same requirement applies to the rest of the Gemini Pro family, whose supported levels are `low` and `high` only, with no `minimal`. Treat a missing suffix on any of them as a runtime failure waiting to happen, not a stylistic omission.

TTFT is also worth reading carefully here: Gemini 3.1 Pro is by far the fastest at generating tokens yet the slowest to start, because thinking time lands inside time-to-first-token. Sonnet 5 starts in under a second. For interactive lanes, first-token latency is the number that shapes how the session feels.

## 2026-08-13 — Tracked `writer` agent & high-nuance prose routing

Added a fourth tracked custom agent `writer.md` under `config/omp/agents/` mapped to `writer: "@plan"` (`google-antigravity/claude-opus-4-6:high`).

**The finding:** Long-form prose, PRD synthesis, copy humanization, and brand-voice calibration require nuanced sentence structure and non-robotic flow. Routing these tasks to `default` (`gemini-3.6-flash`) risked AI-slop patterns. Routing prose to Claude Opus 4.6 via `@plan` ensures literary quality while keeping the main coding session fast and budget-efficient on Gemini Flash.

**Verification:** Ran `omp-routing-test` passing `OK (roles=12, overrides=11, async=8)`. Evaluated live `omp config list --json` and verified agent-to-model resolution for all 11 agents.
## 2026-08-13 — Audit & removal of legacy 9Router entries from fallback chains

Audited `config/omp/config.yml` fallback chains and removed remaining 9Router references across `default`, `task`, `slow`, `plan`, and `anthropic/claude-opus-5`.

**The finding:** Invariant 6 states that no recovery path uses 9Router because a tunnelled transport is unreliable during a provider outage. Cleaning these entries ensures recovery switches immediately to direct provider targets (`openai-codex`, `anthropic`, `google-antigravity`).

**Verification:** Ran `omp-routing-test` passing `OK (roles=12, overrides=11, async=8)`. Evaluated live `omp config list --json` and verified `.retry.fallbackChains` resolution across all roles.

## 2026-08-15 — `scout` split onto `discovery`, `plan` recovery repaired, 9Router reinstated as last hop

Four changes to `config/omp/`, plus one credential fix outside the repository.

**`scout` moved off the shared `research` role.** `scout` and `librarian` both resolved to `research` (Antigravity Gemini 3.6 Flash). A new `discovery` role (`anthropic/claude-sonnet-5:medium`) now serves `scout` alone; `librarian` keeps `research` unchanged. Role count 12 → 13, and both overlays gained the new role and its chain.

The two jobs share a shape but not a failure profile. `librarian` returns verbatim excerpts a reader can check against the source; `scout` returns an interpreted map the parent acts on without re-reading, so a confident wrong map propagates silently into every downstream decision — the hazard `ROUTING.md` already names. Sonnet 5 keeps the million-token window repository-wide reading needs, supports the `medium` level `scout` declares, and is a different vendor from the Codex and Antigravity workers whose output the map describes.

`librarian` deliberately did **not** move. It declares `thinkingLevel: minimal`, which among the other pools only Claude Haiku 4.5 supports and no Codex model supports at all, and Haiku's 200K window is a fifth of what evidence-heavy external reading needs. That constraint is now written into `ROUTING.md` so the next reader does not retry the move. The unavoidable consequence under `codex-only.yml` — `librarian` running above its declared floor because no Codex model exposes `minimal` — is documented in that overlay's header alongside the existing advisor-tier note.

**`plan` had no real recovery.** Its first fallback hop was `openai-codex/gpt-5.6-sol:high` — byte-identical to the primary selector. Retrying the same provider, model, and reasoning level after an auth failure, quota exhaustion, or outage recovers nothing; it spends a retry. This violated invariant 4 in `STATUS.md`, which every other role honours. The chain is now `anthropic/claude-opus-4-8:high` → `google-antigravity/claude-opus-4-6:high` → 9Router. A sweep of all thirteen roles across `config.yml` and both overlays found `plan` was the only instance.

**9Router reinstated — as the final hop only.** This reverses the 2026-08-13 removal, and the reasoning that motivated that removal still stands: a tunnelled transport is the least dependable leg in the set. What changed is the placement and the reason for it. 9Router now sits last in `slow`, `plan`, and `default`, reached only when all three primary pools have already failed — the one moment when an unreliable route still beats no route.

Two facts pin it there rather than earlier. Its allowance is small, so an early hop would spend the reserve on the most frequent failures instead of saving it for the ones with nowhere else to go. And its `ag/*` models draw on the same Antigravity account the primary pool already uses, so routing an Antigravity model through 9Router adds no capacity whatsoever — only the `cx/*` models represent separate headroom. Invariant 6 in `STATUS.md` was rewritten from "no recovery path uses 9Router" to "9Router appears only as the last hop".

**Credential.** `~/.config/ai-local/credentials/9router-remote-key` did not exist, so the `omp()` wrapper injected nothing and every 9Router route would have failed on auth. Created at mode 600 in a 700 directory. Verified against the live gateway: `/v1/chat/completions` returns 200 through the tunnel and 401 through `http://127.0.0.1:20128` — the local instance carries 679 federated models but an empty `apiKeys` table, so it cannot serve inference. The tunnel is a separate instance whose 29-model catalog matches `models.yml` exactly. `models.yml` was briefly repointed at localhost during diagnosis and restored; it is unchanged.

**Verification:** `omp-routing-test` passing `OK (roles=13, overrides=11, async=8)` — it caught the `scout.md` frontmatter still naming `@research` before the override was aligned. `ai-doctor --self-test` 15/15. YAML parse clean on `config.yml` and both overlays. Role coverage checked programmatically: config 13, antigravity-only 13, codex-only 13, no gaps. Both 9Router selectors confirmed against the live catalog via `omp models`: `cx/gpt-5.6-sol` 372K context with `high` supported, `cx/gpt-5.4` 400K with `medium` supported — both clear the 140K compaction threshold.

## 2026-08-15 — Validator strictness audit: `omp-routing-test` is a wiring test, not a capability test

Drove 26 deliberate faults through `omp-routing-test` against a scratchpad copy of the tree. **20 passed green.**

**The finding:** the validator proves the routing graph is internally consistent and that OMP's parser accepts the file. It proves nothing about whether the models named in that graph exist, can take the reasoning level asked of them, or can hold the context the compaction settings assume.

Faults that pass green today:

- `research: google-antigravity/gemini-3.1-pro:minimal` — 3.1 Pro supports `low` and `high` only. Reasoning suffixes are never checked against the catalog.
- `slow: openai-codex/gpt-5.3-codex-spark:high` — 128K context, below `compaction.thresholdTokens`. Deleting the entire `compaction:` block also passes; `thresholdTokens` is never read.
- `default: notaprovider/notamodel:banana` — model IDs are never resolved. The validator never opens `~/.omp/agent/models.db`; its only membership check runs against the hand-written `models.yml`, which covers `9router-fantastico` alone.
- Deleting a role from an overlay, deleting the whole `overlays/` directory, or replacing an overlay with invalid YAML. `overlays/` is not referenced anywhere in the script — half the routing surface is unvalidated, while both overlay headers claim these exact invariants are honoured.
- Deleting the entire `retry:` block. No role is required to have a chain.
- Agent frontmatter `thinkingLevel: hyperultra`. Only `name` and `model` are ever read.

Two structural amplifiers: the `continue` at line 330 exempts every provider absent from `models.yml` — anthropic, google-antigravity, openai-codex, the three carrying all real traffic — from the one membership check that exists. And the `or "*" in key` escape at line 316 disables the fallback-key role check for any key containing a slash or a star.

Static-CI mode is weaker still. With `omp` off PATH and `CI=true` the entire runtime half vanishes, and `OK (static CI; …)` is textually indistinguishable from a real pass.

What it does catch is genuine and worth preserving: missing provider prefix, `cycleOrder` naming a dead role, a custom-provider fallback absent from `models.yml`, agent frontmatter disagreeing with its override, and a bad `@role` reference. Role→agent→override→installer wiring is airtight.

**Ranked fixes, highest value first:** load `models.db` and resolve every selector against it, which closes the missing-model, unsupported-effort, and context-window gaps at once; validate `overlays/*.yml` through the same path as `config.yml`; assert every role has a non-empty chain; read `compaction.thresholdTokens` from config and add it to the required-paths set; derive the required-role set from what agents and `cycleOrder` actually reference rather than the frozen eight-name literal.

**Verification:** each fault injected one at a time into a scratchpad copy driven through the script's `argv[1]` ROOT override, restored to baseline green between runs. Real `omp` 17.3.4 on PATH, so the runtime path executed. No file under `~/dotfiles` was written by the audit.

## 2026-08-15 — `omp-routing-test` hardened from a wiring test into a capability test

The audit earlier today found 20 of 26 injected faults passing green. The validator proved the routing graph referred to itself consistently and that OMP's parser accepted the file; it proved nothing about whether the models in that graph exist, accept the reasoning level asked of them, or hold the context `compaction` assumes — and it never opened `overlays/` at all.

**What changed.**

*Capability validation.* The test now loads `~/.omp/agent/models.db` — OMP's own catalog, the only source that knows what a model can do — into `{(provider, model_id): {context, efforts}}`, and resolves every selector in `modelRoles` and every entry in `retry.fallbackChains` against it. A selector must name a model the catalog knows, carry a reasoning suffix that model exposes, and sit above `compaction.thresholdTokens`. `split_selector` splits on the *last* colon so ids that themselves contain a slash, like `9router-fantastico/cx/gpt-5.6-sol`, resolve correctly.

*Overlays.* Previously unread. `omp config list` rejects `--config`, so each overlay is instead handed to OMP as a `config.yml` of its own inside a temporary `PI_CODING_AGENT_DIR` and resolved by the same parser as the tracked config. Every role defined in `config.yml` must exist in every overlay — a role missing there cannot resolve in a single-provider session, so any agent mapped to it fails the moment it is dispatched — and every overlay selector goes through the same capability check.

*Fallback coverage.* Every role must now have a recovery path, role-keyed or model-keyed, and no chain may be empty. A chain whose first hop repeats the primary selector is rejected outright: retrying an identical provider, model, and level after an auth failure or outage recovers nothing. A model-keyed chain matching no configured role model is also rejected, since a typo there fails silently forever.

*Required paths.* `compaction.thresholdTokens` and `retry.fallbackChains` joined the explicit-path set, so neither block can be deleted unnoticed. The threshold is read from config rather than hardcoded.

*Agent frontmatter.* A declared `thinkingLevel` is now checked against the resolved role model's supported efforts. This is what pins `research` to a model offering `minimal`.

*Honest degradation.* Static-CI mode reports `PARTIAL`, not `OK`, and names on stderr what it skipped — previously it was textually indistinguishable from a full pass. If the catalog is missing the run prints a `WARNING` naming the unverified dimensions rather than passing clean.

**Verification.** Twelve fault classes injected one at a time into a scratchpad copy driven through the `argv[1]` ROOT override, each previously green, each now rejected:

| Fault | Result |
|---|---|
| `gemini-3.1-pro:minimal` — level the model lacks | rejected |
| `gpt-5.3-codex-spark:high` — 128K, below threshold | rejected |
| `anthropic/claude-nonexistent-9:high` | rejected |
| `notaprovider/notamodel:banana` | rejected |
| `compaction:` block deleted | rejected |
| `retry:` block deleted | rejected |
| role removed from an overlay | rejected |
| overlay replaced with invalid YAML | rejected |
| `overlays/` directory deleted | rejected |
| fallback `[0]` identical to the primary | rejected |
| `claude-sonnet-4-6:max` in a chain | rejected |
| agent `thinkingLevel: hyperultra` | rejected |

Against the tracked configuration: `omp-routing-test: OK (roles=13, overrides=11, async=8, overlays=2, catalog=790 models)`. `ai-doctor --self-test` 15/15. The summary line now reports overlay and catalog coverage so a degraded run is visible at a glance rather than hiding behind the word `OK`.

## 2026-08-15 — Declared context windows now override a generous catalog

`models.yml` and OMP's cached catalog disagree: the tracked file declares 372000 for `cx/gpt-5.6-sol` and 400000 for `cx/gpt-5.4`, while `~/.omp/agent/models.db` reports **1050000 for both**. Harmless today — every 9Router selector clears the 140K threshold either way — but the validator was reading only the cache, so the looser number was the one being enforced.

`parse_custom_provider_models` now captures each model's declared `contextWindow` alongside its id, and `check_selector` takes the **smaller** of declared and cached. A generous cache entry can no longer mask a model that is genuinely too small for `compaction.thresholdTokens`.

**Verification:** lowering `cx/gpt-5.6-sol` to 100000 in a scratchpad `models.yml` — while the cache still reported 1050000 — produced `FAIL: fallback slow[2]: 9router-fantastico/cx/gpt-5.6-sol holds 100000 tokens, at or below compaction.thresholdTokens (140000)`. Tracked config remains `OK (roles=13, overrides=11, async=8, overlays=2, catalog=790 models)`; `ai-doctor --self-test` 15/15.

## 2026-08-15 — Tracked agent definitions audited against the bundled roster

Diffed all seven bundled-and-tracked agents against `omp agents unpack` output. Five are load-bearing; two changed nothing.

| Agent | Bundled | Tracked | Verdict |
|---|---|---|---|
| `reviewer` | `@slow` | `@advisor` | real — and the most consequential |
| `security-reviewer` | *(no model)* | `@advisor-xhigh` | real |
| `librarian` | `@smol` | `@research` | real |
| `scout` | `@smol` | `@discovery` | real |
| `designer` | `@designer` | `@vision` | real |
| `sonic` | `@smol` | `@smol` | **no-op** |
| `task` | `@task` | `@task` | **no-op** |

**The finding worth remembering:** OMP's bundled `reviewer` runs on `@slow` — Codex. Without the tracked override, the reviewer would be reviewing the same pool that produced the work, and `ROUTING.md`'s claim that "every advisor model is from a different vendor than the workers it reviews" would be false in practice while remaining true on paper. Three others (`librarian`, `scout`) default to `@smol`, i.e. Flash Lite, for jobs that cannot survive a weak model. These overrides are not stylistic.

`sonic.md` and `task.md` were removed. Their tracked copies duplicated the bundled definitions verbatim apart from the YAML shape of `model:` (scalar rather than a single-item list), so they changed nothing while shadowing any future upstream improvement to their directives. `task.agentModelOverrides` pins both deterministically regardless of whether a file exists, and the validator still catches an override naming an agent that is neither bundled nor tracked.

**Not changed: `sonic`'s tool scope.** It holds unrestricted access — `edit`, `write`, `bash` — on the cheapest model in the fleet while carrying the busiest subagent lane, and its own description says "strictly mechanical updates or data collection only" with nothing enforcing "only". That reads like over-privilege, but the bundled definition is byte-identical: this is upstream's design for a mechanical worker, not local drift, and `librarian` and `reviewer` carry `bash` too. Narrowing it would be a local divergence on the highest-volume lane based on a concern that was never demonstrated to cause a failure. Recorded here so the question is not re-litigated from scratch; revisit if a sonic run is ever observed acting outside its brief.

## 2026-08-15 — Upgrade default volume roles to Gemini 3.7 Flash

`gemini-3.7-flash` was verified available in `agy models` and cataloged in OMP (`google-antigravity/gemini-3.7-flash`). Live serving benchmark passed cleanly (`omp bench google-antigravity/gemini-3.7-flash:medium` TTFT 2.8s, 160 tok/s).

**What changed:**

* `models.yml`: Added `ag/gemini-3.7-flash-high`, `ag/gemini-3.7-flash-medium`, and `ag/gemini-3.7-flash-low` to the 9Router metadata catalog.
* `config.yml`: Upgraded `default` to `google-antigravity/gemini-3.7-flash:medium` and `research` to `google-antigravity/gemini-3.7-flash:high`. Updated `task` and `discovery` fallback chains to use Gemini 3.7 Flash. Mapped subagent `sonic` to `@default` (`google-antigravity/gemini-3.7-flash:medium`).
* `overlays/antigravity-only.yml`: Upgraded `default`, `task`, `research`, and `discovery` roles to Gemini 3.7 Flash. Cascaded 3.6 Flash down into the fallback chains.

**Verification:** `omp-routing-test` passing `OK (roles=13, overrides=11, async=8, overlays=2, catalog=790 models)`. `ai-doctor` 100% sound.

## 2026-08-16 — A foreign device collapsed the routing design, and the test now defends it

Recorded here because it is the incident the "do not restructure" rule in
`config/ai/AGENTS.md` exists for, and a rule without its case is easy to talk
past.

A device pushed its own single-provider preference straight into
`config/omp/config.yml` instead of using an overlay. Ten of the thirteen roles
collapsed onto one vendor. The whole advisor tier lost the vendor independence
that is the entire reason a review is worth anything — a reviewer drawn from the
same pool as the worker reviews its own blind spots. `anthropic` disappeared
from `modelProviderOrder` while roles still pointed at it, and `cycleOrder`
vanished.

**Why nothing caught it:** every individual selector was still valid. The config
parsed, the roles resolved, `omp` ran. Nothing failed until a fallback happened
to name a model this machine's catalog did not hold. A validator that checks
"does each model exist" cannot see a design being dismantled one valid line at a
time.

**What `bin/omp-routing-test` asserts now** — structure, not a model list:

- an advisor role may not share a provider with the worker roles it reviews
- every role's provider must appear in `modelProviderOrder`
- the role set must span at least three providers
- required keys are checked against the **tracked file**, not OMP's resolved
  runtime config, because reading the runtime value let a deleted
  `defaultThinkingLevel` pass on the strength of OMP's own default

Swapping a model is fine. Collapsing the design fails.

The mechanism for a machine that wants different models already existed and was
not used: `config/omp/overlays/*.yml`, invoked as
`omp --config ~/dotfiles/config/omp/overlays/<name>.yml`.

> A `9router` clause was part of this guard when written — it had to stay last in
> `modelProviderOrder` as the reserve. 9Router was removed from routing entirely
> later the same day, so that assertion is now conditional on its presence.

## 2026-08-16 — Main session moves to Codex; the Codex escalation ladder collapses

Accepted the pending `config.yml` change after review. Decision criterion given by
the owner: precision for full-stack development, not allowance conservation.

- `default`: `google-antigravity/gemini-3.7-flash:medium` → `openai-codex/gpt-5.6-sol:high`
- `smol`: `gemini-3.1-flash-lite:medium` → `gemini-3.7-flash:medium`
- `sonic` agent: `@default` → `@smol`
- `default` fallback #1: `openai-codex/gpt-5.4:medium` → `google-antigravity/gemini-3.7-flash:medium`

Read together these are one move, not four: `default` and its own fallback trade
places, mechanical work is pushed off the main lane onto `smol`, and `smol` is
raised so that mechanical work does not regress in the move.

**The 2026-08-12 evidence baseline supports this on its own terms.** That measurement
found `gpt-5.6-sol` had the lowest tool-call error rate at 5.2% and the leanest loop
at 1.00 tool calls per turn, against 7.8% for `gemini-3.6-flash`. Cost per call was
$0.0953 versus $0.0845 — roughly 13% more per call for roughly a third fewer tool-call
errors, because Gemini's cheaper per-token rate was cancelled by a context its
million-token window never compacted. For the highest-frequency lane on this setup,
that trade is the right way round.

Two consequences worth stating rather than discovering later:

1. **The main session is 97.7% of tokens** per that same baseline, so this is the
   largest possible change to allowance pressure. It is deliberate. `default` falls
   back to Gemini 3.7 Flash, so exhausting the Codex allowance degrades routing to
   the previous arrangement rather than failing.
2. **`default`, `task`, `slow`, and `plan` now resolve to the identical model at the
   identical reasoning level.** Escalating `default` → `slow` changes the routing
   label and nothing else. ROUTING.md previously promised that escalation as "a
   normal and expected move"; that text was wrong the moment this landed and has
   been rewritten. Real escalation is now cross-vendor to the advisor lane, which is
   a different model from a different vendor. The four roles still differ by who
   runs them and under what contract, which is what the ledger attributes on.

Also corrected in ROUTING.md: the capacity-pool paragraph still said Antigravity
"carries the main session", and the R1 row still named `cheap-dev`, a lane that no
longer describes anything — `@task` is precision now, not a cheap tier.

Compaction is unchanged and matters more here, not less: `thresholdTokens` 140000
against Codex's 272000 window means compaction actually fires, which is
precisely what did not happen under Gemini's million-token window.

Validation: `omp-routing-test` OK (roles=13, overrides=11, async=8, overlays=2,
catalog=790 models); `ai-policy-lint` PASSED.

**Correction 2026-08-16:** this entry first cited a 372000 window. That figure
belongs to the 9Router transport variant `cx/gpt-5.6-sol`; the model `default`
actually resolves to is `openai-codex/gpt-5.6-sol`, whose live catalog window is
272000. The conclusion is unchanged — 140000 against 272000 is still a 51%
margin, so compaction fires well before the window — but the number was wrong.

## 2026-08-16 — Fallback independence and reserve semantics reconciled

The routing audit found a contract gap rather than a broken selector: the
validator protected advisor and discovery **primaries** from the Codex execution
pool, but said nothing about their fallback hops. Both routes intentionally end
on Codex after direct Anthropic and Antigravity have failed. That last hop is
kept for availability, but it cannot produce independent review or discovery.
Leaving the prose absolute while the executable chain was conditional made a
normal fallback look like an invariant violation.

The accepted base-route contract is now explicit and structural:

- every normal route spans Antigravity, Codex, and Anthropic exactly once across
  its primary and first two fallback hops;
- `advisor*` and `discovery` use a primary outside the Codex execution pool and
  keep their first recovery hop outside Codex;
- Codex may appear for those independent lanes only as the final
  availability-over-independence hop, and output from that hop must not be
  represented as independent;
- 9Router remains outside `modelProviderOrder`, roles, and fallback chains. Its
  provider definition is retained only for explicit operator selection.

The 9Router decision is based on routing structure, not claimed availability.
Its `ag/*` routes consume the same Antigravity capacity already represented by a
direct pool, while every 9Router call adds a transport and failure mode. The
three direct providers already supply the required normal-route diversity, so a
silent 9Router hop adds no structural recovery value. Retaining its provider
definition preserves an explicit reserve without asserting that a gateway,
credential, account, or listed model works on a particular device.

`omp-routing-test` now parses the tracked fallback graph before invoking OMP, so
static-CI mode also rejects provider collapse, an early Codex hop in an
independent lane, a normal-path 9Router selector, or removal of the explicit
reserve definition. `ROUTING.md`'s stale Gemini 3.6 description of `research`
was corrected to the Gemini 3.7 selector already present in `config.yml`.
`STATUS.md` no longer promotes one device's catalog or serving observations into
shared availability truth.

No test, catalog probe, or serving probe was run for this reconciliation; the
audit assignment required integration validation to run once after all slices
land.

## 2026-08-17 — Policy contradictions and overlay capability gaps closed

The routing policy now classifies R0–R2 by semantic complexity and invariants,
not file extension or diff size. PRD and high-nuance prose remain owned by
`writer` / `plan`. R3 correctness review resolves to `reviewer` / `advisor`;
security-sensitive review resolves to `security-reviewer` /
`advisor-xhigh`. The stale GPT-5.4 overflow statement was replaced with the
actual `default` recovery chain: Antigravity Gemini 3.7 Flash, then direct
Anthropic Claude Sonnet 4.6. The Codex-only overlay comment now names the
current Gemini 3.7 research model.

`omp-routing-test` now applies one fallback-graph validator to the base config
and every overlay. Single-provider overlays must expose a non-empty fallback
map, keep every primary and fallback on their sole configured provider, use
catalog-valid selectors above the compaction threshold, provide recovery for
every role, and avoid repeating a primary as the first fallback. Visual
primaries and every fallback reachable from `vision` or `designer` must
advertise image input in the live model catalog; missing modality metadata
fails that visual route.

The integrated validator passed with 13 roles, 11 overrides, eight async jobs,
two overlays, and 1,414 catalog models. Ten isolated mutations then proved
rejection of a missing overlay retry block, missing model-keyed recovery,
foreign provider, repeated primary, unsupported effort, nonexistent model,
sub-threshold context, and text-only visual primary and fallback. A text-only
non-visual primary remained accepted, proving the image guard is scoped to the
visual roles. No provider serving probe was run; shared status does not claim
device-specific availability.
