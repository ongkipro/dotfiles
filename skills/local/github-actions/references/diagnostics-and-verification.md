# Diagnostics and verification

Diagnose from GitHub's control plane toward application commands. A workflow run, job, runner, and step are different lifecycle layers; do not call all non-success states “CI failed.”

## State model

```text
event occurs
  ├─ no matching/eligible workflow definition -> no run
  └─ run created
       ├─ job condition/dependency false -> skipped, never starts
       ├─ concurrency/environment/runner/policy/billing -> pending, waiting, queued, or cancelled before start
       └─ runner acquired
            ├─ step/action/runner/timeout/cancel error -> job fails/cancels
            └─ all required steps complete -> job succeeds
```

A required check can also remain pending because branch/path filters prevented its workflow from running. That is a trigger/ruleset design issue, not a failed test.

## Evidence sequence

### 1. Establish expected identity

Record:

- workflow filename and displayed name;
- expected event and activity type;
- repository, base/head refs, and exact SHA;
- actor/fork status;
- expected job/check name;
- whether the workflow must exist on the default branch for that event;
- expected environment and runner label.

Do not start from a screenshot of one red or spinning check without these identifiers.

### 2. Determine whether a run exists

With GitHub CLI authenticated to the relevant repository, narrow the server-side list rather than selecting “latest” blindly:

```bash
gh run list --workflow <workflow-file> --branch <branch> --event <event> --limit 20
```

`<workflow-file>`, `<branch>`, and `<event>` are values observed for the incident, not literals to paste. Also inspect the Actions UI when PR check-suite relationships or approvals are clearer there.

If no run exists, inspect:

- whether the workflow file is present and syntactically valid on the ref GitHub loads;
- event name/activity type and branch/tag/path filters;
- default-branch restrictions for the event (for example scheduled/manual availability rules);
- whether the workflow or Actions are disabled by repository/organization policy;
- fork/first-time-contributor approval settings;
- commit-message skip instructions;
- required-check/ruleset name and merge-queue expectations;
- webhook/event delivery only if the workflow is triggered through an integration path.

Do not add a broader trigger until one of these is shown to be the cause.

### 3. If a run exists, inspect its graph

```bash
gh run view <run-id>
gh run view <run-id> --json status,conclusion,event,headBranch,headSha,jobs,url
```

Use only JSON fields supported by the installed `gh` version; `gh run view --help` is authoritative. Compare the observed SHA/event to the expected identity.

For a job that never started, inspect:

- job-level `if` and expression inputs;
- direct `needs` conclusions, including skipped jobs;
- concurrency group and whether another member is running/pending/cancelled;
- environment wait/rejection and required reviewer availability;
- runner labels, online/idle state for self-hosted runners, and hosted-run capacity;
- repository/organization Actions policy and allowed-action policy;
- account usage, budgets/spending limits, payment state, and plan entitlement;
- fork approval queue;
- GitHub Status and runner-image incidents.

A queued job with no runner timestamps/logs has not failed its build command. Preserve that distinction in incident reports.

### 4. If a job started, inspect only the failing layer

```bash
gh run view <run-id> --log-failed
```

When reruns/attempts exist, select the observed attempt/job using the options supported by the installed `gh` version. Classify:

- command returned nonzero;
- action initialization/download failure;
- service container/startup failure;
- explicit timeout;
- cancellation/concurrency replacement;
- runner lost communication or was terminated;
- artifact/cache/API/provider error;
- application test/build failure.

Reproduce the exact underlying repository command locally when it is application-owned. A hosted network or runner incident is not fixed by weakening tests or adding unconditional retries.

## External hosted/billing blockers

Check current official sources because quotas, included usage, runner labels/images, and enforcement behavior change.

| Symptom | Evidence | Ownership |
|---|---|---|
| Run/job queued without runner | Queue text, runner label, runner group visibility, GitHub Status | GitHub-hosted capacity/incident or self-hosted operator |
| Workflow cannot start due to spending/usage | Repository/org/account billing and Actions usage controls | Account/organization administrator |
| Action disallowed | Repository/organization allowed-actions policy and annotation | Repository/organization administrator |
| Environment waiting | Deployment review UI and protection rules | Authorized environment reviewer/administrator |
| Fork run awaiting approval | Actions approval banner/audit trail | Maintainer under fork-approval policy |
| Runner image/tool unexpectedly changed | Job “Set up job” metadata and current runner-image manifest/release | Workflow owner adapts only after evidence; platform incident remains external |
| GitHub service degradation | Matching incident/component on `githubstatus.com` and job timestamps | External blocker; preserve evidence and retry after recovery if safe |

Do not quote hard-coded minute quotas or runner specifications from memory. Link the current plan/billing and hosted-runner page in the report.

## Static and local verification

### Inspect repository-native tooling first

Look for workflow validation scripts, `actionlint`, security scanners, shell linting, and CI test scripts already declared in the repository. Use those exact commands. Do not install a validator solely because this reference names one.

If `actionlint` is installed/accepted, running it at repository root with no file arguments discovers workflows under `.github/workflows`:

```bash
actionlint
```

It can catch Actions-aware syntax, expression, matrix, reference, and embedded-shell issues. A generic YAML parser is weaker and may interpret YAML scalars such as `on` under an incompatible YAML version. Static validation cannot prove remote repository settings, effective token behavior, fork restrictions, OIDC exchange, hosted image contents, or environment approvals.

Run the exact repository script behind each changed `run` step using the supported runtime. Do not rewrite application test commands inside YAML to make local reproduction harder. Hand test selection/coverage to `testing-engineering`.

A local Actions emulator is optional only when already adopted by the repository. It is not evidence of GitHub-hosted permissions, event payload/ref behavior, fork secret isolation, OIDC claims, environment protection, runner image parity, billing, or concurrency.

## Hosted verification scenarios

Select the smallest safe scenario that exercises the changed contract:

| Change | Minimum hosted evidence |
|---|---|
| Trigger/filter | Expected event creates a run on the intended ref; excluded event/path behavior also observed when merge protection depends on it |
| `needs`/condition | Success plus relevant failure/skip/cancel transition; privileged downstream job remains blocked |
| Matrix | Expected combinations/jobs and collision-free reports/artifacts |
| Reusable workflow/composite action | At least one real caller receives expected inputs/outputs and permissions |
| Concurrency | Two safe overlapping runs show intended pending/cancel/serialization behavior |
| Fork boundary | Fork PR/adversarial input shows untrusted validation works and no privileged job/secret path executes |
| OIDC | Provider audit/claim evidence for the intended job/ref/environment and denial outside it, without exposing a token |
| Environment gate | Job waits before credentialed execution, authorized review releases it, disallowed ref/self-review behavior matches policy |
| Artifact promotion | Consumer selects exact producer run/SHA and verifies expected digest/provenance; promoted bytes are unchanged |
| Action pin update | Static check plus hosted job using the verified pinned SHA succeeds |

Triggering a workflow can mutate state or consume budget. Use an existing PR/push or an explicitly safe manual dispatch; never dispatch a production-capable workflow merely to validate syntax.

Useful remote inspection commands after choosing a safe run:

```bash
gh workflow view <workflow-file> --yaml
gh run watch <run-id> --exit-status
gh run view <run-id> --log-failed
```

Check `gh ... --help` against the installed version before using optional flags. The GitHub UI remains required for some environment, ruleset, billing, and approval evidence.

## Verification report contract

Report:

1. files/workflows changed and the invariant each protects;
2. static/local commands, versions where relevant, exit results, and exact project commands exercised;
3. hosted run URL/ID, event, head SHA/ref, and attempt;
4. each expected job conclusion, including intentionally skipped/cancelled/waiting jobs;
5. effective trust evidence: fork/source, permissions, secret/OIDC boundary, environment approval, and artifact digest/provenance where relevant;
6. external blockers or repository settings that could not be observed;
7. residual integration risk and the owner of any unverified deployment/application behavior.

Examples of precise conclusions:

- “Run was created, but `deploy` never acquired a runner because it was waiting for the `production` environment review.”
- “No run existed; the changed path was excluded by the workflow's path filter while the corresponding check remained required.”
- “`test` acquired `ubuntu-24.04` and failed in the repository's `npm test` command with exit 1.”
- “Static validation passed; fork token/secret behavior was not exercised, so fork safety remains unverified.”

Avoid “CI is broken,” “GitHub failed,” or “workflow passed” when the observed evidence supports only one narrower layer.
