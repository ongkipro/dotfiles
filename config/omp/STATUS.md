# Status — OMP Orchestration

Updated: 2026-08-12
Status: Configured and verified; two provider availability checks outstanding

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

## Active work

None. The routing rebuild completed 2026-08-12 across five commits, ending at `704077e`.

## Blockers

None blocking, but two provider availability facts are unverified on this device and would degrade routing silently if wrong:

- **Direct Anthropic served zero calls** across the ~70 hours of `stats.db` history. Three advisor roles depend on it. If it is unavailable here, all three degrade to Antigravity Claude Opus 4.6, which stops at `high` reasoning — meaning `advisor-xhigh` and `advisor-max` would return work one tier below what was requested.
- **Antigravity Gemini 3.1 Pro served zero calls.** It now backs both `vision` and `designer`, so `designer` may never have actually executed.

`config/ai/memory/environment.md` records the general form of this hazard: `config.yml` describes intended routing, while actual model availability is device-local.

## Next verified action

```bash
omp bench --model anthropic/claude-opus-5
omp bench --model google-antigravity/gemini-3.1-pro
```

If either is unavailable on this device, record the fact in `BUILD-LOG.md` and re-point the affected roles to a model that is, rather than leaving a route that degrades without notice.

## Deliberately not wired

- `claude-fable-5` and `claude-mythos-5` are available and spec-comparable to Opus 5, but their tier positioning is unknown here. Not placed on any critical path without a benchmark.
- `gpt-5.6-terra` and `gpt-5.6-luna` are spec-identical to Sol, which has measured evidence behind it. Not substituted without a comparison.
- `minimax-code` served 14 calls at zero recorded cost and is otherwise unused.
- 9Router remains configured as an optional manual route only.
