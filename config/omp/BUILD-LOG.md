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
