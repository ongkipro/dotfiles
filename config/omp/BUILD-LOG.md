# OMP Build Log

Updated: 2026-08-24

This hot log contains only current OMP operating decisions and reproducible
evidence. Full history through the start of TASK-015 is retained in
`docs/archive/OMP_BUILD_LOG_THROUGH_2026-08-17.md`.

## Current architecture

- `config/omp/config.yml` owns shared routing and runtime behavior.
- `config/omp/overlays/*.yml` owns opt-in device/session differences.
- Model selectors remain distributed across three direct provider pools; 9Router is reserve-only.
- Parent sessions own context and integration. Parallel child work is isolated,
  cannot auto-apply, and is integrated one verified patch at a time.
- `delivery-ledger` owns executable parent/child evidence and semantic-owner boundaries.
- `omp-routing-test` validates tracked/runtime configuration; `omp-effective-routing-test`
  validates active and tracked overlay behavior.

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

Reopen TASK-015 if isolation auto-apply returns, recursion exceeds one, child
LSP is disabled, yolo loses its deny floor, routing collapses across providers,
or overlay validation again claims runtime coverage from a manual YAML merge.
