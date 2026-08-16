# Status — OMP Orchestration

Updated: 2026-08-17
Status: Shared routing is configured and structurally guarded. End-to-end
runtime readiness remains unverified in shared status because OMP version,
catalog, credentials, quota, and provider availability are device-local.

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

Any change to `config.yml` must keep all of these true:

1. Every agent override resolves to a defined role.
2. Every model reference carries an explicit reasoning suffix, and device-local capability validation must confirm that the model supports it.
3. Every model reachable from any role or fallback must have a context window larger than `compaction.thresholdTokens`.
4. Each normal route spans Antigravity, Codex, and Anthropic exactly once across its primary and first two fallback hops.
5. The `advisor*` and `discovery` primaries are independent from the Codex execution pool. Their first fallback remains outside Codex; Codex is allowed only as the final availability-over-independence hop, whose output is not independent review or discovery.
6. Every role has a fallback path, whether role-keyed or model-keyed.
7. Normal routing uses the three directly connected providers only. 9Router remains defined in `models.yml` as an explicit operator-selected reserve, but no shared role, fallback chain, or `modelProviderOrder` entry may name it.
8. Every single-provider overlay defines and confines every primary and fallback selector to its sole `modelProviderOrder` provider, with complete recovery coverage.
9. `vision` and `designer`, including every reachable fallback, advertise image input capability in the live model catalog.

## Active work

The shared fallback and reserve contract is reconciled. `omp-routing-test`
checks role and override wiring, three-provider route structure,
independent-lane fallback placement, and the 9Router reserve boundary without
relying on a device catalog. When OMP and its catalog are present, it also
validates selectors, reasoning levels, context windows, visual input
capabilities, agents, and each overlay's provider-confined fallback graph
through OMP's parser.

## Blockers

Runtime readiness is unresolved until the target device's installed OMP parser
and catalog accept the tracked selectors and the required providers serve them.
That result belongs in device-local evidence, not as a permanent claim here. A
missing executable or catalog produces `PARTIAL`/`WARNING`; neither is a clean
verification.

## Next verified action

After installing or updating OMP on any device, run `omp-routing-test` and
resolve every reported selector or catalog mismatch through that runtime's
normal update path. After introducing a selector, perform one bounded serving
check on the target device. Keep the observed result in device-local evidence;
do not turn it into permanent cross-device availability truth.

## Deliberately not wired

- 9Router is absent from `modelProviderOrder`, roles, and fallback chains. Direct providers already supply the normal route's three pools; 9Router adds another transport and its `ag/*` routes reuse Antigravity capacity. Its `models.yml` definition is retained only for deliberate operator selection and does not imply that the gateway or any listed model is available.
- `tools.approvalMode: yolo` is a kept decision, not drift. OMP prompts for nothing; `AGENTS.md`'s approval gates carry the boundary behaviourally, and `git-guard.sh` is the only mechanical backstop — Git-only, and wired in an untracked machine-local file. `ROUTING.md` records the full trade under "Enforcement boundary".
