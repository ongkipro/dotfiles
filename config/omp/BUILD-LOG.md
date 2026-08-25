# OMP Build Log

Updated: 2026-08-26

This hot log contains only current OMP operating decisions and reproducible
evidence. Full history through the start of TASK-015 is retained in
`docs/archive/OMP_BUILD_LOG_THROUGH_2026-08-17.md`.

## Current architecture

- OMP owns routing and runtime behavior through its native user/profile paths.
- Dotfiles does not provide a baseline config, model catalog, provider order,
  fallback graph, agent override, or runtime overlay.
- `config/omp/config.yml`, `models.yml`, `agents/`, and `overlays/` are retired
  historical evidence and are not loaded by installers or shell startup.
- Device-local provider and model choices stay in native OMP state and are not
  treated as cross-device facts.
- Parent sessions own context and integration. Parallel child work is isolated,
  cannot auto-apply, and is integrated one verified patch at a time.
- `delivery-ledger` owns executable parent/child evidence and semantic-owner boundaries.
- `omp-routing-test` validates the native ownership boundary;
  `omp-effective-routing-test` proves an isolated upstream profile resolves the
  expected native schema.

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
