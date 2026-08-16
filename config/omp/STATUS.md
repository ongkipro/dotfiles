# Status — OMP Orchestration

Updated: 2026-08-15
Status: Configured and verified. Eleven agents resolved, nine directive files
tracked, and all model overrides verified. `scout` has its own role; 9Router is
last-resort recovery only.

## Current state

Routing is organised as three capacity pools across thirteen roles and eleven agents. `ROUTING.md` owns the policy, `config.yml` owns the executable selectors, and `overlays/` holds single-provider session escapes.

| Pool | Roles | Purpose |
|---|---|---|
| Antigravity | `vision`, `designer`, `research`, `smol`, `tiny` | Volume. Carries every context-hungry lane: visual work, source research, mechanical support. |
| Codex | `default`, `slow`, `task`, `plan` | Precision, and since 2026-08-16 the main session too. The lanes where a wrong edit costs the most rework. |
| Anthropic | `advisor`, `advisor-xhigh`, `advisor-max`, `discovery` | Judgment. Independent consultation, review, and the repository map `scout` returns. |

All eleven agents — seven bundled and four custom agents under `agents/`
(`architect`, `complex-developer`, `debugger`, `writer`) — have an explicit
override, so none silently resolves to `default`. Five bundled agents also have
tracked directive overrides where the upstream default does not match this
fleet; `ROUTING.md` records that distinction.

### Standing invariants

Any change to `config.yml` must keep all of these true. The check that verifies them is recorded in `BUILD-LOG.md` under 2026-08-12.

1. Every agent override resolves to a defined role.
2. Every reasoning suffix is a level the selected model actually supports.
3. Every model reachable from any role or fallback has a context window larger than `compaction.thresholdTokens`.
4. Every fallback chain changes provider on its first hop.
5. Every role has a fallback path, whether role-keyed or model-keyed.
6. 9Router appears only as the **last** hop of a chain, never earlier and never as a role. Its allowance is small, and its `ag/*` models draw on the same Antigravity account the primary pool already uses, so an early hop would spend the reserve without adding capacity.
7. Every model reference carries an explicit reasoning suffix. Gemini 3.1 Pro rejects a request with no thinking budget outright — `Budget 0 is invalid. This model only works in thinking mode.` — so a reference that merely omits its suffix fails at runtime rather than falling back to some default. All 100 references across `config.yml` and both overlays were checked and carry one.

## Active work

None. `omp-routing-test` was hardened on 2026-08-15 from a wiring test into a wiring **and capability** test. It now resolves every selector against OMP's model catalog and validates both overlays through OMP's own parser. Twelve fault classes that previously passed green are now rejected; the matrix is in `BUILD-LOG.md`.

One deliberate limitation remains: when `~/.omp/agent/models.db` is absent the capability half cannot run. The test then prints a `WARNING` naming exactly what went unverified rather than reporting a clean pass, and static-CI mode reports `PARTIAL` instead of `OK` for the same reason.

## Blockers

None. Every primary role selector, including `discovery`, and every unique
fallback/overlay selector was exercised successfully on this device on
2026-08-15. Catalog validation remains the deterministic gate; live serving is
device- and provider-dependent and must be rechecked after selector changes.

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
- 9Router is wired as the final hop of the `slow`, `plan`, and `default` chains only. It is not a role, and it is not an early fallback.
- `tools.approvalMode: yolo` is a kept decision, not drift. OMP prompts for nothing; `AGENTS.md`'s approval gates carry the boundary behaviourally, and `git-guard.sh` is the only mechanical backstop — Git-only, and wired in an untracked machine-local file. `ROUTING.md` records the full trade under "Enforcement boundary".
