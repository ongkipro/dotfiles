# OMP Build Log

Updated: 2026-08-31

This hot log contains only current OMP operating decisions and reproducible
evidence. Full history through the start of TASK-015 is retained in
`docs/archive/OMP_BUILD_LOG_THROUGH_2026-08-17.md`.

## Current architecture

- OMP owns routing and runtime behavior through its native user/profile paths.
- Dotfiles provides one secret-free recommended role graph in
  `config/omp/config.yml`; it is an explicit reference overlay, not installed
  runtime state.
- `models.yml`, `agents/`, `overlays/`, and the old routing prose remain retired
  historical evidence and are not loaded by installers or shell startup.
- Device-local provider and model choices stay in native OMP state and are not
  treated as cross-device facts.
- Parent sessions own context and integration. Parallel child work is isolated,
  cannot auto-apply, and is integrated one verified patch at a time.
- `delivery-ledger` owns executable parent/child evidence and semantic-owner boundaries.
- `omp-routing-test` validates the native ownership boundary;
  `omp-effective-routing-test` proves both an isolated upstream profile and the
  explicit reference resolve through OMP's native loader.

## 2026-08-31 a routing guard that could not fail

- `omp-effective-routing-test`'s selector/thinking-level/visual validator had
  never been able to fail. Its `jq` ran **without `-e`**, so it printed `false`
  and exited 0 with the `|| { FAIL }` unreachable; and its `models.json` came
  from an isolated `PI_CODING_AGENT_DIR` with no authenticated provider, so the
  registry held **zero** models against 94 real ones and every lookup was null.
  Either alone made it useless; together they made it look rigorous.
- Fixed with `-e`, the ambient registry, and an explicit SKIP when no
  authenticated registry exists — CI has no provider auth and must say so rather
  than pass quietly. Mutation-proven in all three directions.
- That dead guard is why `designer: gemini-3.7-flash:auto` went unnoticed in both
  the tracked reference and the live native config. `auto` is not a level that
  model declares (`minimal, low, medium, high`).
- Visual lane settled as two roles rather than reverted. `designer` is
  `gemini-3.7-flash:high` — its top declared level — chosen on merit: it accepts
  image input at $0.75/$3.75 per Mtok against Opus 5's $5/$25, which matters
  while the Anthropic weekly allowance sits near two thirds spent. `vision` stays
  Opus 5 High for material redesign. Strongest designer *when required*.
- Its fallback chain stays `sol:high → terra:high`, deliberately stronger than
  the primary: that is a failure path, not a quality tier.
- The lane is pinned in **three** places — the routing test, `ai-policy-lint`,
  and `config/ai/AGENTS.md`. The third surfaced only because the policy lint
  failed on the AGENTS.md edit. The lint now anchors both roles, so the
  escalation cannot vanish quietly.
- Skill attribution was tamper-evident but not truth-evident: `skillsUsed` is
  agent-supplied and no gate enforced a required capability. `delivery-skill-usage
  verify` now refuses a PASS run whose boundary check saw a changed rendered
  surface unless `ui-validation` is recorded — triggered by observed paths, never
  by the agent's account of its own work.
- Evidence: `ai-doctor --self-test` passes; four mutations each fail exactly one
  intended assertion.
- Not done: the Mac's native `~/.omp/agent/config.yml` still carries the old
  designer value. OMP native config does not travel through Git.

## 2026-08-28 OMP 18.0.9 and autonomous goals

- Kept the always-loaded shared contract below 120 lines by moving the detailed
  Goal Mode procedure to `config/omp/GOAL-ORCHESTRATION.md`. Explicit repository
  goals load that playbook on demand; ordinary turns retain only the compact
  capability, evidence, review, approval, and Git-authority anchors.
- Updated the native Linux binary from OMP 18.0.8 to 18.0.9 through
  `omp update`; the updater verified the downloaded release checksum before
  replacing the executable.
- Re-verified after update that native configuration still matches the tracked
  secret-free reference semantically, `~/.omp/agent/AGENTS.md` still resolves
  to the shared dotfiles context, and `~/.omp/agent/skills` still resolves to
  the canonical owned-skill directory.
- Kept Terra Medium as the cost-aware default parent. Fable High is the native
  `plan` role; `orchestrator` is an explicit selectable alias for hard sessions,
  not an automatically dispatched bundled role. OMP cannot dynamically replace
  a running parent model from the task tool.
- Enabled native interactive Goal Mode continuation, visible goal status,
  preferred todo/task orchestration nudges, batch task dispatch, per-task
  effort control, and resolved-model badges. Child work remains isolated,
  cannot auto-apply, is capped at concurrency four and recursion depth one,
  and receives a soft eighty-request budget.
- Added an always-loaded OMP goal contract to shared context: an explicit goal
  in a repository with `TASKS.md` must route bounded work through bundled
  agents, integrate one isolated result at a time, run repository verification,
  require Opus review for non-trivial cross-module R2 work, and require
  independent Opus/security review plus delivery-ledger approval for R3/R4.
  Human approval gates remain mandatory.
- Confirmed live serving on OMP 18.0.9 for both the Terra default lane
  (`TERRA_OK`) and the explicit Fable escalation lane (`FABLE_OK`). Direct
  Anthropic authentication already existed; this task did not inspect, create,
  migrate, or change credentials.
- Confirmed with JSON-mode probes that `--model @orchestrator` resolves to
  `anthropic/claude-fable-5` and `--model @advisor` resolves to
  `anthropic/claude-opus-5` even while the passive advisor runtime is disabled.
  The aliases are selectable routing capabilities; they are not evidence of an
  automatic parent-model switch or a continuously running advisor.
- Kept `advisor.enabled` off because the passive advisor runtime would invoke a
  separate model after each turn. This does not disable bundled reviewer agents:
  `reviewer` resolves through `@advisor` to Opus 5 High and
  `security-reviewer` resolves through `@advisor-xhigh` to Opus 5 XHigh.
- Re-applied the repository-native Linux installer after the final audit. Shared
  context, owned skills, runtime commands, Claude hooks, shell startup, and tmux
  integration reconciled successfully; the refreshed device inventory records
  that OMP configuration remains a native local file rather than a dotfiles
  symlink.
- The deploy exposed a pre-existing tmux portability warning: Ubuntu's tmux 3.4
  does not support `extended-keys-format`, which upstream added in 3.5. Because
  `csi-u` is already the newer versions' default, the redundant option was
  removed while `extended-keys` remains enabled everywhere.

## 2026-08-28 capability-tier orchestration

- Restricted Gemini 3.7 Flash to the lightweight `smol`, `tiny`, and `title`
  roles; only the bundled `sonic` agent inherits that lane.
- Kept GPT-5.6 Terra Medium as the normal interactive, research, and discovery
  model. Generic delegated implementation and the `slow` lane now use GPT-5.6
  Sol High.
- Assigned Claude Opus 5 to vision, design, review, and high-risk review.
  Fable 5 High is limited to the `plan` and custom `orchestrator` roles; it is
  not a worker, advisor, or fallback for either role class.
- Disabled the passive main-session advisor to avoid continuous duplicate model
  usage. Disabled both main/task prewalk so execution cannot silently hand off
  from Fable, Sol, or Opus to the Gemini `smol` lane.
- Bounded native task fan-out with automatic isolation, no automatic patch
  application, concurrency four, recursion depth one, and LSP enabled.
- Applied the same secret-free graph to the native device config by explicit
  user request without linking or auto-loading the tracked reference. OMP
  18.0.8 parsed both files, all fifteen unique selectors resolved, and a
  no-session/no-tools Fable High serving probe returned `FABLE_OK`.

## 2026-08-27 cross-device default reference

- Promoted the validated device role graph into the secret-free
  `config/omp/config.yml` reference without restoring installer links, command
  wrappers, `PI_CONFIG_FILES`, shared authentication, or shared session state.
- Kept Codex Terra/Sol as the normal and complex development lanes, Gemini 3.7
  Flash as the high-volume support lane, and direct Anthropic Claude 5 as the
  independent judgment lane.
- Set `vision` and `designer` to Claude Opus 5 High by explicit user choice.
- Kept `smol` on Gemini 3.7 Flash Medium, `discovery` on Flash High, and
  `research` on Flash Medium, with cross-provider fallbacks.
- Limited deterministic agent overrides to the seven agents bundled by OMP
  18.0.6; no retired custom agent definition was restored.

## TASK-015 decisions

- Set `task.isolation.apply: false`, `task.maxRecursionDepth: 1`, and
  `task.enableLsp: true`. This prevents silent isolated patch application,
  bounds delegation depth, and gives child agents the existing shared LSP.
- Keep `tools.approvalMode: yolo` only behind ordered `bash.patterns` deny rules
  for destructive Git, filesystem, privilege, and deployment commands.
- Keep routing models unchanged: the observed failure is integration and
  evidence control, not selector quality.
- OMP configuration composition uses `PI_CONFIG_FILES` for both interactive
  sessions and subcommands. Local tests compare resolved runtime output so an
  ignored overlay is a hard failure rather than a YAML-only claim.

## Verification state

- Linux: `omp-routing-test`, `delivery-ledger-test`, `project-init-test`,
  `ai-policy-lint`, and the complete `ai-doctor --self-test` critical gate pass.
- OMP overlay loader: `PI_CONFIG_FILES` is exercised against `config list` and
  `models` for every tracked overlay.
- macOS: not executed for TASK-015.
- Hosted GitHub Actions: externally blocked by TASK-013; workflow presence is
  not hosted execution evidence.

## TASK-023 decisions

- Keep `config/omp/config.yml` immutable at runtime. OMP settings writes belong
  in `~/.omp/agent/config.yml`; device-only routing belongs in
  `~/.config/ai-local/omp-overlay.yml`.
- Compose the tracked baseline, runtime state, and optional device overlay in
  that order through `PI_CONFIG_FILES`. Explicit caller composition remains
  authoritative.
- Force `omp update` to the native binary distribution and stage it beside the
  active executable before atomic replacement. This avoids Bun/PATH shadowing
  and Linux `ETXTBSY` failures when OMP updates itself.
- Preserve the recorded thirteen-role model graph. Provider credentials remain
  device-local and are never inferred from selector presence.

## TASK-024 decisions

- Retire TASK-023's custom runtime composition before it is committed. OMP now
  owns configuration, models, bundled agents, routing, updates, and workspace
  behavior through its native paths.
- Keep only shared memory and owned skills wired from dotfiles. Do not add a
  shared MCP file until a real secret-free cross-device configuration exists.
- Preserve historical routing files for review while removing every runtime
  reference. A later cleanup may archive or delete them separately.

## Reopen conditions

Reopen the native-ownership work if dotfiles again wraps `omp`, injects
`PI_CONFIG_FILES`, installs runtime config/models/agents, or claims a
device-local provider graph is shared repository truth.
