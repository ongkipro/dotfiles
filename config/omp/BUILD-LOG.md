# OMP Build Log

Updated: 2026-08-28

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

## 2026-08-26 runtime maintenance

- Updated the native OMP binary from 18.0.4 to 18.0.5 with `omp update`.
- Confirmed from upstream OMP documentation that built-in resolution remains
  separate from persistent user configuration. The upstream defaults were not
  changed.
- While direct Anthropic authentication is unavailable, the native device-local
  user config routes every configured model role and fallback through Google
  Antigravity or OpenAI Codex. No credential, account identifier, or selector
  graph was copied into dotfiles.
- Corrected the device-local `vision` and `designer` roles from Gemini 3.1 Pro
  to Gemini 3.7 Flash High after checking current Google evidence rather than
  inferring capability from the Pro/Flash labels. Google's 3.7 guidance names
  web development, design adherence, mock-to-code fidelity, and migration from
  3.1 Pro explicitly; the live OMP catalog and serving path were then verified.
- Reconciled the complete temporary role graph against OMP 18.0.5 rather than
  the retired tracked agent set: covered all ten built-in roles, retained four
  support roles used by bundled agents, limited overrides to the seven agents
  actually shipped by the runtime, and removed stale overrides for four
  retired custom agents.
- Preserved Anthropic capability without routing into a disconnected direct
  provider. Direct `anthropic` remains first in provider precedence for future
  recovery; the active `slow` and `plan` lanes use Claude Opus 4.6 High through
  connected Antigravity, while normal review uses Claude Sonnet 4.6 High.
  Both Claude serving paths passed live probes after a catalog refresh.
- Security review remains on Codex GPT-5.6 Sol XHigh, the strongest connected
  reasoning lane with an `xhigh` tier. Its fallbacks cross first to Claude Opus
  and then Gemini rather than silently reducing the primary effort tier.
- Aligned support effort with workload: Gemini 3.7 Flash Medium for research
  and discovery, Flash Low for tiny/title work, and Codex Luna Low for commit
  generation. The complete graph contains fourteen roles and twenty-five
  fallbacks; all thirty-nine selectors and effort suffixes were checked against
  the refreshed live catalog with zero resolution errors.
- Validated OMP's 18.x native memory implementation, then left it disabled
  because enabling it would create a second memory system rather than sync the
  existing cross-CLI source. The empty-payload warning refers only to that
  native backend.
- Preserved one cross-device lifecycle: OMP reads curated dotfiles memory
  through the shared `AGENTS.md`; verified reusable outcomes from OMP return
  through `ai-learn capture`, review, and explicit
  `ai-learn promote ... --yes`. Raw rollouts are never auto-ingested.

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
