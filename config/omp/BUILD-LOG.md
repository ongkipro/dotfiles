# OMP Build Log

Updated: 2026-08-17

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
- OMP 17.3.5 documents `--config` globally and accepts it for `models`, but
  `omp --config <overlay> config list --json` rejects the flag. Automated OMP QA
  owns the upstream parser defect; local tests must expose this as partial
  runtime coverage instead of replacing it with a silent YAML-only claim.

## Verification state

- Linux: `omp-routing-test`, `delivery-ledger-test`, `project-init-test`,
  `ai-policy-lint`, and the complete `ai-doctor --self-test` critical gate pass.
- OMP overlay loader: `models --config` passes for both tracked templates;
  the global flag on `config list` remains explicit `PARTIAL` on OMP 17.3.5.
- macOS: not executed for TASK-015.
- Hosted GitHub Actions: externally blocked by TASK-013; workflow presence is
  not hosted execution evidence.

## Reopen conditions

Reopen TASK-015 if isolation auto-apply returns, recursion exceeds one, child
LSP is disabled, yolo loses its deny floor, routing collapses across providers,
or overlay validation again claims runtime coverage from a manual YAML merge.
