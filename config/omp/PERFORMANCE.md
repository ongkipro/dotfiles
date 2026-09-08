# OMP Performance Review

Reviewed: 2026-09-08. Device: rich. Runtime: OMP 18.1.13.
Requirement: REQ-OMP-PERFORMANCE; tasks: TASK-068 and TASK-069.

## Decision

Keep the native role graph and `tools.xdevDocs: builtins`. No measured result
justifies switching every role to a newer model, increasing reasoning effort,
enabling paid priority service, or installing a community prompt-replacement
plugin. The reference in this directory remains opt-in; runtime configuration
must not be overwritten by dotfiles synchronization.

The concrete diagnostic fixes are an empty-registry SKIP instead of a false OK,
reporting `task.isolation.enabled` rather than the legacy `task.isolation.mode`, and explicitly
separating registry validation from a live inference test. The delegation
playbook now requires an explicit `isolated: true` per editing task; enabling
the feature alone does not isolate a task.

## Community evidence

- [Local-model prompt experiment](https://www.reddit.com/r/PiCodingAgent/comments/1w0rm4e/cut_omps_oh_my_pi_system_prompt_from_226k_to_59k/):
  first-person OMP 18.0.7 fork experiment using a small-context local model.
  Smaller prompts helped some tasks, but the smallest was not consistently
  best; context overflow confounds some failures. Its `promptProfile` and
  `tools.xdevForceMount` settings do not exist in this installed schema.
- [Upstream prompt-size issue](https://github.com/can1357/oh-my-pi/issues/1734):
  confirms a real concern for local models, not a validated universal preset
  for the large-context remote models used here.
- [Composio Pi/OMP comparison](https://composio.dev/content/pi-vs-omp):
  an actual SaaS/MCP workflow experiment, but provider and reasoning-level
  differences prevent treating its headline as a controlled coding comparison.
- [DeepSeek routing experiments](https://github.com/E33EPUS/omp-ds-routing-suite):
  useful hypotheses, with small samples and a tool-catalog benefit later
  retracted. Thinking length and model-reported assertions are not independent
  correctness checks. A plugin that replaces the system prompt may discard
  shared instructions; it was not installed.

These findings informed local tests; they do not authorize copying fork-only
settings or establish the best model for every task. The installed CLI schema
and actual execution take precedence over a moving upstream `main` document.

## Local workspace experiment

Four fresh Git workspaces, one event-deduplication bug, fixed Sol/high route,
ABBA order: builtins, catalog, catalog, builtins. The only per-run overlay was
`tools.xdevDocs`. Native tools, shared context, and skills remained enabled.
The prompt authorized editing only `events.py`, prohibited delegation and
network use, and required running immutable smoke tests. All four runs exited
0, used the requested Sol provider/model in their JSON events, and completed
without tool errors.

| Trial | Docs | Wall seconds | First input tokens | Read/edit/bash calls | External checks |
|---|---|---:|---:|---|---|
| 1 | builtins | 41.19 | 28,481 | 3 / 1 / 1 | 112/112 |
| 2 | catalog | 48.85 | 27,048 | 4 / 1 / 1 | 112/112 |
| 3 | catalog | 48.61 | 27,047 | 5 / 1 / 1 | 112/112 |
| 4 | builtins | 46.87 | 28,479 | 3 / 1 / 1 | 112/112 |

Catalog removed approximately 1,433 first-request tokens (5%) but required
additional reads. It did not reduce observed wall time or uncached input over
the full task. This supports retaining builtins; it does not prove catalog is
always slower. Two runs per condition and one small fixture are exploratory.
Other bounded provider smoke probes overlapped part of the experiment; provider
queueing and cache state were not controlled. Do not advertise a speedup or use
these timings to rank models.

Checks were authored outside the model workspace: 100 seeded valid sequences
and 12 invalid records cover ordering, highest sequence selection, tie handling,
field preservation, and non-mutation, including exception paths. These are 112
checks of one task, not 112 independent tasks. Parent verification also checked
unchanged tests, no unexpected files outside Git/test bytecode artifacts, no
commit, and reran smoke tests. Candidate modules were inspected before execution.
The verifier rejects an empty or incomplete trial matrix.

## Role and capability evidence

- Initial pure-code probes: Terra medium and Sol medium each passed 21 parser
  checks. End-to-end times were 9.53 and 18.53 seconds, one sample each. This
  does not compare the production task role, which uses Sol high.
- Native text smoke requests succeeded for the configured primary model
  families and the Gemini 3.8 candidate. All seven follow-up JSON probes
  returned the expected response from the exact requested provider/model;
  no fallback appeared in their assistant events. These used low effort and
  establish reachability, not role-specific reasoning quality.
- Requested designer Gemini 3.7/high and vision Opus/high correctly identified
  both regions of a synthetic image. This proves basic image transport for
  those requests, not design quality or complete fallback behavior.
- The multi-model native transport benchmark emitted no report within roughly
  180 seconds and was stopped. No per-model failure or throughput ranking can
  be inferred from that aborted run.

## Native delegation and integration

A second synthetic repository contains two independent utility modules and an
immutable integration caller/test. A serial Terra/medium parent completed in
40.83 seconds. A parent explicitly asked to delegate two workers completed in
68.17 seconds. Both changed only the two owned modules and preserved the Git
baseline. This single pair is not a universal serial/parallel speed comparison.
The native parent selected Sol/low for both workers through per-task effort;
configured role suffixes alone do not describe the actual child effort.

The delegated run exposed a real boundary gap: it omitted `isolated` on both
task items. Workers edited the parent checkout directly, despite native
`task.isolation.enabled: true` and `task.isolation.apply: false`. There was no
parent patch application between child completion and the passing test.

This matches the [18.1.13 implementation](https://github.com/can1357/oh-my-pi/blob/v18.1.13/packages/coding-agent/src/task/structured-subagent.ts#L313):
isolation is selected only by an explicit true request; `enabled` permits it.
The [task dispatcher](https://github.com/can1357/oh-my-pi/blob/v18.1.13/packages/coding-agent/src/task/index.ts#L662)
preserves an omitted request. Tag `v18.1.13` resolved to
`a1b254047d12e143b7c6011536e918c6c35c5906` during the audit. This version-pinned
source and the actual trace outrank assumptions drawn from setting names or
[moving task documentation](https://github.com/can1357/oh-my-pi/blob/main/docs/tools/task.md).

[GOAL-ORCHESTRATION.md](GOAL-ORCHESTRATION.md) now requires the item flag,
inspection of emitted arguments and returned artifacts, parent-diff review,
and sequential integration. A failed isolation setup must not silently fall
back to an editing worker in the shared checkout. Read-only discovery need not
pay for a workspace copy. Workspace isolation is not an operating-system
sandbox or proof of semantic correctness.

The corrected explicit-isolation run completed in 212.07 seconds. Both task
items carried `isolated: true`; native results reported retained patches with
`apply=false` and `Not applied`. The parent inspected both artifacts and copied
only the intended source hunks through its edit tool, then ran the integration
test. The patches also contained generated Python bytecode, which the parent
did not integrate. This demonstrates why patch path review remains necessary.
The inspection snapshot was taken after parent integration, so it does not
independently prove a clean pre-integration parent diff; the emitted patch
metadata, parent tool sequence and final diff provide the observed evidence.

All three final parent workspaces passed 100 external contract checks plus
the immutable integration test. Only the two intended tracked files changed;
Git HEAD and immutable caller/test files stayed unchanged. The explicit run
used Sol/high workers rather than the earlier Sol/low workers, so its wall time
cannot isolate the cost of workspace isolation. One read of a nonexistent
`tests` directory failed and recovered. No universal latency claim follows.

Keep ordinary small fixes in the parent; use parallel workers for substantial
independent slices or required specialist/review capability. The native
`task.eager` upstream default is `default`; this device currently uses
`preferred`. These explicitly directed probes did not measure the effect of
that setting itself, so it was not changed on speculation. The correction is
the verified dispatch contract, not a model substitution or disabling isolation.

## Settings retained and limits

Terra medium remains the default/discovery route, Sol high the implementation
route, Fable high planning, Gemini 3.7 Flash the lightweight/designer route,
Opus the visual/review route, and Luna low commit generation. Gemini 3.8 being
present in the catalog alone is not evidence of a worthwhile migration.

Concurrency stays at four and recursion at one. Isolated task results are not
automatically applied. LSP remains available for delegated typed-code work;
this Python fixture does not justify disabling it globally. Passive advisor
and prewalk remain off, avoiding extra inference or automatic model switching
without demonstrated need. Built-in docs stay inline, MCP/extension docs stay
on demand. Native compaction remains enabled. No priority tier was purchased.

This review validates the tested local setup, not an absolute performance
maximum. Long-context compaction quality, sustained concurrency, complex
full-stack/visual quality, outage failover, and other devices were not benchmarked.
Revisit a setting when a real workload exposes a failure or when the runtime,
provider, or task distribution changes; preserve a comparable baseline first.

## Evidence and reproduction

Raw synthetic experiment inputs, generated candidates, JSON event streams,
verification scripts and metrics are retained device-locally under
`~/Documents/work/research/omp-performance-2026-09-08/`. These are supporting
artifacts; this repository document owns the decision. No credentials or real
session data were copied into the repository.

Existing evidence can be checked without provider requests:

```bash
python3 ~/Documents/work/research/omp-performance-2026-09-08/verify-candidates.py
python3 ~/Documents/work/research/omp-performance-2026-09-08/verify-workspaces.py
python3 ~/Documents/work/research/omp-performance-2026-09-08/verify-delegation.py
bin/omp-runtime-report-test
bin/omp-runtime-report
```

The Python verifiers execute the reviewed synthetic candidates and require
the retained workspaces. Do not execute replacement candidates without review.
Re-running a probe script makes new provider requests; do that only when new
comparative evidence is needed, not as a routine health check.
