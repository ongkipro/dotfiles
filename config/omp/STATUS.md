# Status — OMP Orchestration

Updated: 2026-08-12
Status: Configured, verified, and benchmarked. No outstanding checks.

## Current state

Routing is organised as three capacity pools across twelve roles and ten agents. `ROUTING.md` owns the policy, `config.yml` owns the executable selectors, and `overlays/` holds single-provider session escapes.

| Pool | Roles | Purpose |
|---|---|---|
| Antigravity | `default`, `plan`, `vision`, `designer`, `research`, `smol`, `tiny` | Volume. Carries the main session and every context-hungry lane. |
| Codex | `slow`, `task` | Precision. The two lanes where a wrong edit costs the most rework. |
| Anthropic | `advisor`, `advisor-xhigh`, `advisor-max` | Judgment. Independent consultation and review. |

All ten agents — seven bundled, three tracked under `agents/` — have an explicit override, so none silently resolves to `default`.

### Standing invariants

Any change to `config.yml` must keep all of these true. The check that verifies them is recorded in `BUILD-LOG.md` under 2026-08-12.

1. Every agent override resolves to a defined role.
2. Every reasoning suffix is a level the selected model actually supports.
3. Every model reachable from any role or fallback has a context window larger than `compaction.thresholdTokens`.
4. Every fallback chain changes provider on its first hop.
5. Every role has a fallback path, whether role-keyed or model-keyed.
6. No recovery path uses 9Router.
7. Every model reference carries an explicit reasoning suffix. Gemini 3.1 Pro rejects a request with no thinking budget outright — `Budget 0 is invalid. This model only works in thinking mode.` — so a reference that merely omits its suffix fails at runtime rather than falling back to some default. All 100 references across `config.yml` and both overlays were checked and carry one.

## Active work

None. The routing rebuild completed 2026-08-12 across five commits, ending at `704077e`.

## Blockers

None. The three models that had never executed on this device were benchmarked on 2026-08-12 and all serve correctly; results are in `BUILD-LOG.md`. Every one of the twelve roles now points at a model proven to run here.

`config/ai/memory/environment.md` records the general hazard this closed: `config.yml` describes intended routing, while actual model availability is device-local. Re-run the benchmark below after any change that introduces a model not already in use.

## Next verified action

None required. When adding a model to `config.yml`, prove it runs on this device first:

```bash
omp bench <provider>/<model>:<effort> --runs 1 --max-tokens 32
```

Always include the reasoning suffix. A bare selector is not a valid test of a configured route and will fail outright on models that require thinking mode.

## Deliberately not wired

- `claude-fable-5` and `claude-mythos-5` are available and spec-comparable to Opus 5, but their tier positioning is unknown here. Not placed on any critical path without a benchmark.
- `gpt-5.6-terra` and `gpt-5.6-luna` are spec-identical to Sol, which has measured evidence behind it. Not substituted without a comparison.
- `minimax-code` served 14 calls at zero recorded cost and is otherwise unused.
- 9Router remains configured as an optional manual route only.
