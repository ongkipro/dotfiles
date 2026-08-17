---
name: github-actions
description: Engineers and reviews GitHub Actions CI workflows. Use for `.github/workflows`, Actions YAML, triggers, permissions, action pinning, jobs/needs, matrices, reusable workflows, composite actions, concurrency, caches, artifacts, secrets, OIDC, fork PR safety, environments, release gates, queued or failed jobs, runner/billing blockers, and workflow validation. Owns GitHub CI workflow architecture and evidence; not application deployment execution or non-GitHub CI.
---

# GitHub Actions workflow engineering

Build the smallest auditable workflow graph that proves the repository contract without moving untrusted code across a privileged boundary.

GitHub Actions syntax, runner images, action releases, security controls, plan limits, and CLI behavior change. Inspect installed tooling and current official documentation before relying on volatile details. Project scripts, lockfiles, repository settings, and observed runs win. Read `references/source-ledger.md` for primary sources.

## Scope and ownership

This skill owns:

- GitHub Actions events, permissions, job graphs, runner selection, matrices, reuse, concurrency, caches, artifacts, environments, and run diagnosis.
- Actions-specific trust boundaries: fork PRs, workflow events, `GITHUB_TOKEN`, action dependencies, OIDC, and privileged promotion gates.
- Static/local workflow checks and the hosted-run evidence needed to prove Actions behavior.

Handoffs:

- `testing-engineering` owns automated behavioral test strategy and the commands CI should execute.
- `application-security` owns cross-stack AppSec; this skill owns how workflow execution can expose or mutate trusted resources.
- `observability-engineering` owns application logs, metrics, traces, and SLOs; workflow logs and run diagnosis stay here.
- `full-stack-development` selects the end-to-end evidence gates; this skill implements their GitHub workflow graph.
- `nextjs-development`, `astro-development`, `workers-best-practices`, and other platform specialists own framework/platform build and validation commands.
- Deployment/release owners define product release policy and execute application deployment. This skill only engineers CI gates, protected environments, artifact promotion, and evidence around that execution.
- Use `native-first` before adding workflow-validation dependencies. Existing repository tooling wins.

Non-goals: product release policy, application deployment implementation, and CI systems other than GitHub Actions.

## Inspect first

Before editing:

1. Read every affected workflow in full, plus called workflows, local actions, composite actions, package scripts, lockfiles, and scripts invoked by `run`.
2. Map triggers, filters, required checks, permissions, environments, concurrency groups, runner labels, `needs`, outputs, artifacts, caches, and secret/OIDC consumers.
3. Trace callers before changing a reusable workflow or composite action. Search both `uses:` and workflow filenames. Do not introduce a second reuse convention.
4. Inspect repository/organization Actions settings, rulesets or branch protection, environment policies, fork approval settings, and runner availability when access permits. State what was not observable.
5. Treat existing workflows as repository-specific examples, not universal facts. Preserve intentional platform and matrix coverage unless the requested contract changes it.
6. Classify each job by trust level: untrusted validation, trusted CI, privileged publish, or protected production.

Record the expected event, ref/SHA, permissions, runner, inputs, outputs, and gate for each changed job.

## Threat model before YAML

The workflow file, event payload, checked-out ref, dependencies, caches, artifacts, runner, token, and secrets are all inputs.

- Use `pull_request` for building and testing fork contributions. Keep permissions read-only or empty and assume PR-controlled code is hostile.
- Avoid `pull_request_target`. If it is truly required, keep it metadata-only: never checkout, execute, source, import, package, or indirectly evaluate PR-head content; never consume PR-produced caches or artifacts in that privileged job.
- A later `workflow_run` can have secrets and write access even when the triggering workflow did not. Treat every artifact, cache, output, filename, and command derived from the untrusted run as hostile; do not execute it in the privileged run.
- Never run public-fork code on a persistent self-hosted runner. A runner can expose network reachability, credentials, tools, and state beyond the documented job inputs.
- Event fields such as PR titles, branch names, issue bodies, commit messages, and input values are untrusted. Do not splice expressions into shell source. Pass values through environment variables or action inputs and quote them in the receiving program.
- Third-party actions execute with the job's token, filesystem, network, and explicitly supplied secrets. Review and pin them as code dependencies.

Use the detailed review in `references/security-boundaries.md`.

## Workflow design method

### 1. Minimize events and authority

- Select only necessary events, activity types, branches/tags, and paths. Coordinate path filters with required-check configuration: a skipped required workflow can remain pending and block merge.
- Do not treat `workflow_dispatch` inputs, actor names, labels, or branch naming alone as authorization.
- Start with top-level `permissions: {}` or the narrowest repository-wide read grant. Add permissions at the consuming job only. When any permissions are specified, make every required scope explicit.
- Keep `id-token: write`, package publishing, releases, attestations, and repository writes out of build/test jobs.
- Set timeouts for jobs that can hang. Make shell failure behavior explicit where repository conventions do not already do so.

### 2. Build an explicit job DAG

- Give each job one evidence or trust-boundary responsibility. Use `needs` for actual dependencies, not visual ordering.
- Remember that jobs do not share a filesystem. Pass small scalar data as job outputs and files as artifacts. A cache is not a job-output channel.
- Downstream jobs are skipped when a required predecessor fails or is skipped unless their condition deliberately changes that behavior. Use `always()` narrowly; it can make cleanup/reporting run after failure but must not bypass a security or release gate.
- Keep privileged jobs downstream of every required verification job. Conditions supplement `needs`; they do not replace the dependency edge.

### 3. Control matrices and cost

- Derive matrix axes from supported runtime/OS contracts, not “more coverage is better.” Use `include`/`exclude` for real exceptions.
- Choose `fail-fast` intentionally: fast feedback for redundant variants, or `false` when every compatibility result is required evidence.
- Use `max-parallel` when providers, self-hosted capacity, or budgets require it.
- Give matrix artifacts and reports collision-free names. Do not let multiple variants overwrite a shared output.

### 4. Reuse at the correct level

- A reusable workflow (`workflow_call`) owns a multi-job CI capability, runner choices, permissions, outputs, and a typed caller contract.
- A composite action owns repeated steps that must run inside the caller's existing job and filesystem.
- Prefer a repository script when the logic must also run locally. Keep Actions YAML as orchestration, not an embedded application.
- Make reusable workflow inputs, outputs, and secrets explicit. Avoid blanket secret inheritance unless the repository boundary and least-privilege review justify it.
- Pin cross-repository reusable workflows to a verified full commit SHA. Same-repository reusable workflows should use the local workflow path supported by GitHub.
- Migrate every caller and delete superseded copies in one cutover; do not leave aliases or parallel templates.

See `references/workflow-architecture.md` for reuse, concurrency, and data-flow rules.

### 5. Bound concurrency and cancellation

- Derive concurrency groups from the resource being protected: PR/ref for redundant validation, or target environment/resource for serialized mutation.
- Use `cancel-in-progress` only when replacing an older run is safe. Do not cancel a migration, release mutation, or non-idempotent deploy merely because a newer commit exists.
- Avoid accidental group collisions across unrelated events or workflows. A concurrency group has at most one running and one pending member, and execution order is not guaranteed.
- Concurrency prevents overlap; it is not an authorization or approval gate.

### 6. Separate cache, artifact, and provenance boundaries

- Cache only regenerable dependencies or tool state. Keys must bind to relevant OS, tool/runtime version, lockfile, and other compatibility inputs. Restore prefixes must not cross trust or ABI boundaries.
- Never put secrets in caches or artifacts. Never let a privileged workflow restore a cache an untrusted workflow can influence.
- Use artifacts for explicit immutable-by-convention handoff between jobs/runs. Set deliberate names and retention, validate expected contents, and treat artifacts from untrusted runs as untrusted input.
- Publish or deploy the exact verified artifact/digest rather than rebuilding different bytes after approval.
- When provenance is required, use GitHub artifact attestations with job-scoped permissions and verify the attestation in the consumer/release process. Attestation does not make malicious source or a compromised build trustworthy.

### 7. Pin and review action dependencies

- Pin every external action and cross-repository reusable workflow to a verified full-length commit SHA. A tag or branch is human-readable but mutable; keep the reviewed release tag/version in a comment.
- Verify repository ownership, source, release notes, maintenance state, and the tag-to-SHA mapping from upstream. Review dependency updates; use Dependabot/Renovate only as an update proposal mechanism, never automatic trust.
- Recheck current official action documentation and repository releases before changing versions or inputs. Do not invent action inputs from memory.
- Local actions are still code from the checked-out ref. Their safety matches that ref's trust level.

## Secrets, OIDC, and protected environments

- Prefer the job-scoped `GITHUB_TOKEN` over personal access tokens, and short-lived OIDC federation over stored cloud credentials.
- Grant `id-token: write` only to the job that exchanges the token. Restrict the cloud trust policy by issuer and applicable repository, owner, ref/tag, environment, workflow, and audience claims. GitHub permission alone does not constrain the cloud role.
- Secrets are not supplied to normal fork PR runs (except GitHub's separate token behavior). Do not add a privileged event to “fix” missing fork secrets.
- Scope production credentials to a protected environment. Require appropriate reviewers, prevent self-review when the plan supports it, and restrict deployment branches/tags. Environment secrets become available only after the job passes protection rules.
- Never print secrets or place them in command arguments when safer input channels exist. Mask generated sensitive values before any possible log output; rotate anything exposed.

## Release and production gate invariant

A production-capable job must require all of the following:

1. the exact trusted ref/SHA and event allowed by repository policy;
2. successful required verification through explicit `needs` edges;
3. the exact verified artifact/digest, not a fresh unreviewed rebuild;
4. job-scoped minimum token/OIDC permissions;
5. the protected GitHub environment and its approval/branch rules;
6. concurrency appropriate to the target resource; and
7. post-action evidence defined by the deployment owner.

An environment name in YAML is not proof that reviewers or branch restrictions are configured. Verify repository settings. A green build is not proof that a deployment ran or that the application is healthy.

## Diagnose from the control plane inward

First distinguish these states:

- **No workflow run exists:** event/filter mismatch, workflow absent or invalid on the relevant ref, default-branch requirement, disabled workflow, fork approval policy, or required-check configuration mismatch.
- **Run exists but job never started:** job-level `if`, skipped/failed `needs`, concurrency pending/cancellation, waiting environment approval, unavailable runner label/capacity, Actions policy, billing/spending limit, or hosted service incident.
- **Job started and failed:** a step/action exited nonzero, timed out, lost its runner, was cancelled, or failed during service/download execution.

Do not patch YAML until evidence identifies the state. Inspect the event/ref/SHA, annotations, dependency graph, job conditions, environment review, runner labels, concurrency, repository Actions settings, billing/usage controls, and GitHub Status. Hosted capacity, image incidents, and billing locks are external blockers, not application test failures. Runner images and plan limits are volatile; recheck official docs.

Use `references/diagnostics-and-verification.md` for a concrete evidence sequence.

## Smallest executable verification

1. Run the repository's existing workflow/static checks.
2. If installed or accepted by the project, run `actionlint` from repository root. It validates syntax and many expressions, references, matrices, and shell embeddings; it does not prove permissions, settings, hosted runners, or environment gates.
3. Run the exact underlying project command locally for each changed `run` path, using the repository's supported runtime. Hand behavioral-test design to `testing-engineering`.
4. Inspect the remote registered workflow and execute the smallest safe hosted event when the change depends on GitHub contexts, permissions, reusable-workflow wiring, OIDC, environments, or runner behavior.
5. Record workflow/run URL or ID, event, ref and SHA, jobs observed, expected skip/cancel/approval behavior, artifact identity where relevant, and final conclusion. A merely queued run is not passing evidence.

Do not claim fork safety without exercising a fork-equivalent event or proving no privileged path consumes PR-controlled content. Do not claim a production approval gate without observing the job wait for and pass the configured environment review, unless access prevents it—then report that gap explicitly.

## Anti-patterns

- Broad `on` plus broad write permissions “for convenience.”
- `pull_request_target` that checks out or executes the PR head.
- Privileged `workflow_run` consuming untrusted artifacts, caches, filenames, or scripts.
- Mutable action tags/branches, or a full SHA copied without verifying its source/release.
- Secrets or OIDC in matrix build/test jobs.
- Self-hosted runners for public fork code.
- Context expressions interpolated directly into `run` scripts.
- Cache as artifact transfer, cache keys that cross trust boundaries, or secret-bearing artifacts.
- A deploy job guarded only by `if`, actor, label, or manual input.
- Environment named in YAML but no verified protection configuration.
- Copy-pasted workflows when one reusable workflow, composite action, or repository script owns the repeated contract.
- `continue-on-error` on required evidence, or `always()` that bypasses a failed gate.
- Unbounded matrices, floating runner/tool versions where reproducibility matters, and accidental artifact-name collisions.
- Treating a local emulator as proof of GitHub permissions, OIDC, fork behavior, or environment approvals.
- Calling a job “failed” when it never acquired a runner or was skipped upstream.
