---
name: github-actions
description: >-
  Engineer and review GitHub Actions workflows and run evidence: triggers, permissions, SHA pinning, matrices, reusable workflows, caches, artifacts, secrets, OIDC, fork safety, failed jobs. Not deploy execution, test strategy, or non-GitHub CI.
---

# GitHub Actions

Build the smallest auditable workflow graph that proves the repository
contract without moving untrusted code across a privileged boundary. Actions
syntax, runner images, action releases, and plan limits change: project
scripts, lockfiles, repository settings, and observed runs win; current
official docs (`references/source-ledger.md`) beat memory.

Hand-offs: test commands and strategy → `testing-engineering`; cross-stack
AppSec → `application-security`; app telemetry → `observability-engineering`;
build/validation commands → the platform skill; release policy and the deploy
itself → the deployment owner. This skill owns the workflow graph, its trust
boundaries, and run evidence.

Read only this file up front; open a reference when a step names it.

**Pick the path first:**
- A run failed or never started → §3 → `references/diagnostics-and-verification.md`.
- Edit an existing workflow → §1 → the matching step in
  `references/workflow-architecture.md` → §4.
- New workflow or reusable workflow → §1 → §2 → `workflow-architecture.md`
  (seven design steps) → §4.
- Anything touching fork PRs, `pull_request_target`, `workflow_run`,
  self-hosted runners, OIDC, or environments → also
  `references/security-boundaries.md`.

## 1. Inspect first

1. Read every affected workflow in full, plus called workflows, local and
   composite actions, package scripts, lockfiles, and scripts behind `run`.
2. Map triggers, filters, required checks, permissions, environments,
   concurrency, runner labels, `needs`, outputs, artifacts, caches,
   secret/OIDC consumers.
3. Trace callers before changing a reusable workflow or composite action
   (search `uses:` and filenames). One reuse convention.
4. Inspect repository/org Actions settings, rulesets, environment policies,
   fork approval, runner availability when access permits; state what was
   not observable.
5. Classify each job: untrusted validation, trusted CI, privileged publish,
   protected production.

## 2. Threat model before YAML

The workflow file, event payload, checked-out ref, dependencies, caches,
artifacts, runner, token, and secrets are all inputs.

- `pull_request` for fork contributions, read-only or empty permissions,
  PR code is hostile.
- Avoid `pull_request_target`; if required, metadata-only: never checkout,
  execute, or consume PR-head content, caches, or artifacts. `actions/checkout`
  v7+ refuses fork-PR checkout there unless `allow-unsafe-pr-checkout: true`
  — that input is a blocking finding, not a fix.
- `workflow_run` can have secrets and write access the trigger lacked; every
  artifact, cache, output, filename, and command from the untrusted run is
  hostile.
- Never run public-fork code on a persistent self-hosted runner.
- Event fields (titles, branch names, bodies, inputs) are untrusted: pass
  through `env`/inputs and quote in the receiving program; never splice
  expressions into shell.
- Third-party actions run with the job's token, filesystem, network, and
  supplied secrets: review and pin to a verified full SHA; keep the reviewed
  tag in a comment. Node 20 left hosted runners 2026-09-23 — a failing old
  action needs a `runs.using: node24` release.
- `id-token: write`, publishing, releases, attestations, and repository
  writes stay out of build/test jobs; top-level `permissions: {}` and
  job-level grants.

**Production gate invariant.** A production-capable job requires: the exact
trusted ref/SHA and event; successful required verification via explicit
`needs`; the exact verified artifact/digest (no rebuild after approval);
job-scoped minimum token/OIDC; the protected environment with its
reviewer/branch rules; concurrency fitting the target resource; post-action
evidence from the deployment owner. An environment name in YAML is not proof
reviewers are configured — verify settings.

## 3. Diagnose from the control plane inward

Distinguish first: **no run exists** (event/filter mismatch, invalid or absent
workflow on the ref, disabled, fork approval, required-check mismatch) ·
**run exists, job never started** (`if`, skipped `needs`, concurrency,
environment approval, runner label/capacity, policy, billing, incident) ·
**job started and failed** (step nonzero, timeout, lost runner, cancelled,
download/service failure). Do not patch YAML until evidence names the state.
Hosted capacity, image incidents, and billing locks are external blockers,
not test failures.

## 4. Smallest executable verification

1. Repository's existing workflow/static checks.
2. `actionlint` from the root when installed/accepted (syntax, expressions,
   matrices, shell embedding — not permissions or hosted behavior). CodeQL or
   `zizmor` only if the project already uses them; review input, not proof.
3. The exact underlying project command locally for each changed `run`.
4. The smallest safe hosted event when the change depends on GitHub
   contexts, permissions, reusable wiring, OIDC, environments, or runners.
5. Record run URL/ID, event, ref/SHA, jobs observed, expected skip/cancel/
   approval behavior, artifact identity. A queued run is not evidence.

Fork safety is claimed only after a fork-equivalent event or a proof that no
privileged path consumes PR content; a production gate only after observing
the job wait for and pass the environment review (or an explicit access gap).

## Anti-patterns

Broad `on` + broad write permissions · `pull_request_target` that checks out
the PR head · privileged `workflow_run` consuming untrusted artifacts ·
mutable action tags, or a SHA copied without verifying its source · secrets
or OIDC in matrix build/test jobs · self-hosted runners for public forks ·
context expressions inside `run` · cache as artifact transfer or keys that
cross trust boundaries.
