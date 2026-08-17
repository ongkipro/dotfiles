# Source ledger

Reviewed 2026-08-17. Prefer these primary sources over remembered syntax or third-party tutorials. GitHub documentation routes, Actions syntax, action inputs/releases, runner images, plan limits, billing, and security features are volatile: recheck the installed tool/action version and current official documentation before implementation. A source's example is not automatically appropriate for a repository's trust model.

## GitHub platform documentation

| Primary source | Use | Boundary |
|---|---|---|
| [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax) | `on`, filters, permissions, jobs, `needs`, matrices, conditions, environments, defaults, timeouts | Recheck expression/context availability at the exact key and event |
| [Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows) | Event activity, ref/SHA behavior, default-branch restrictions, `pull_request`, `pull_request_target`, `workflow_run` | Event semantics are security-critical; do not infer ref behavior |
| [Contexts reference](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts) | Context fields and where expressions are allowed | Event/context values can be attacker-controlled even when documented |
| [Use `GITHUB_TOKEN` for authentication](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token) | Token behavior and job/workflow permissions | Repository/org defaults and fork policy affect effective authority |
| [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use) | Least privilege, full-SHA action pinning, script injection, secrets, third-party action review, self-hosted runner risks | Security baseline; repository-specific threat model still required |
| [Reusing workflow configurations](https://docs.github.com/en/actions/concepts/workflows-and-actions/reusing-workflow-configurations) | Reusable workflows, composite actions, templates, duplication choices | Follow current linked how-to pages for detailed syntax |
| [Reuse workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows) | `workflow_call`, inputs, secrets, outputs, matrices, nesting, caller/callee permissions | Trace all callers and nested permission/secret flow |
| [Create a composite action](https://docs.github.com/en/actions/tutorials/create-actions/create-a-composite-action) | Composite metadata and step contract | Composite actions run in caller job authority/workspace |
| [Control workflow concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency) | Group behavior, pending replacement, cancellation expressions | Concurrency is not approval, authorization, ordering, or rollback |
| [Dependency caching reference](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching) | Cache matching, keys, restore keys, access restrictions | Cache is an optimization and poisoning boundary, not artifact transfer |
| [Store and share data with workflow artifacts](https://docs.github.com/en/actions/tutorials/store-and-share-data) | Upload/download, job handoff, retention, artifact digest behavior | Artifacts from untrusted producers remain untrusted |
| [Use secrets in GitHub Actions](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets) | Repository/org/environment secrets, fork behavior, masking | Redaction is not guaranteed for all transformed values |
| [OpenID Connect](https://docs.github.com/en/actions/concepts/security/openid-connect) | OIDC model and short-lived cloud authentication | Recheck provider-specific claims/audience and provider trust policy |
| [OIDC reference](https://docs.github.com/en/actions/reference/security/oidc) | Token claims, subject customization, request environment variables | Never construct claim conditions from memory |
| [Deployments and environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments) | Protection rules, reviewers, branch/tag policy, secrets | Available rules depend on plan/repository; YAML name alone proves nothing |
| [Managing environments for deployment](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments) | Configuration and approvals | Repository settings are authoritative evidence |
| [Artifact attestations](https://docs.github.com/en/actions/concepts/security/artifact-attestations) | Provenance model and permission boundary | Attestation establishes provenance/integrity claims, not benign source |
| [Use artifact attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations) | Current generation/verification workflow | Recheck current action inputs, permissions, and plan/public availability |
| [GitHub-hosted runners reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners) | Labels, images, privileges, networking, limits, manifests | Images/specifications are moving platform facts |
| [Approving workflow runs from public forks](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/approve-runs-from-forks) | Fork approval queue and maintainer risk | Approval allows untrusted code to run; inspect changes first |
| [Monitoring and troubleshooting workflows](https://docs.github.com/en/actions/how-tos/monitor-workflows) | Run history, graph, logs, reruns, status | Distinguish no run, never-started job, cancellation, and step failure |
| [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions) | Current usage, storage, budgets, and blocking behavior | Never copy plan amounts/prices into durable guidance; they change |
| [GitHub Status](https://www.githubstatus.com/) | Current Actions/service incidents | Correlate incident window/component with observed run timestamps |
| [Dependabot options reference](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference) | `github-actions` package ecosystem and update proposals for pinned action references | Automation proposes updates; human review establishes trust |

## Official GitHub-maintained action and runner repositories

Always inspect the repository's current release and documentation before using an input. Pin workflow references to a verified full commit SHA even when the action is GitHub-maintained.

| Repository | Use |
|---|---|
| [actions/checkout](https://github.com/actions/checkout) | Checkout behavior, credential persistence, fetch depth, ref inputs |
| [actions/setup-node](https://github.com/actions/setup-node) | Node setup and built-in dependency caching behavior |
| [actions/setup-python](https://github.com/actions/setup-python) | Python setup and cache behavior |
| [actions/cache](https://github.com/actions/cache) | Cache action releases, inputs, outputs, and backend migrations |
| [actions/upload-artifact](https://github.com/actions/upload-artifact) | Artifact upload behavior, digest output, hidden files, release compatibility |
| [actions/download-artifact](https://github.com/actions/download-artifact) | Download/extraction behavior and artifact selection |
| [actions/attest-build-provenance](https://github.com/actions/attest-build-provenance) | Build provenance attestation action and current permissions/inputs |
| [actions/runner-images](https://github.com/actions/runner-images) | Hosted image software manifests and rollout notices |
| [actions/runner](https://github.com/actions/runner) | Runner releases and issue evidence; platform docs remain the behavioral contract |

## Official GitHub CLI documentation

| Source | Use |
|---|---|
| [`gh workflow view`](https://cli.github.com/manual/gh_workflow_view) | Inspect the registered remote workflow |
| [`gh workflow run`](https://cli.github.com/manual/gh_workflow_run) | Deliberately dispatch a safe manual workflow |
| [`gh run list`](https://cli.github.com/manual/gh_run_list) | Find runs by workflow/event/ref/status |
| [`gh run view`](https://cli.github.com/manual/gh_run_view) | Inspect graph, fields, jobs, attempts, and failed logs |
| [`gh run watch`](https://cli.github.com/manual/gh_run_watch) | Observe a selected run and return its status |

The installed `gh ... --help` wins for flags supported by that local version.

## Third-party primary tooling

| Source | Use | Boundary |
|---|---|---|
| [rhysd/actionlint](https://github.com/rhysd/actionlint) | Actions-aware local/static workflow validation | Not GitHub-maintained and not hosted-behavior proof; use only if installed or accepted by project |

## Local examples inspected

These are point-in-time repository examples, not universal recommendations:

| File | Observed pattern | Do not infer |
|---|---|---|
| `.github/workflows/core-runtime.yml` | Narrow path triggers, read-only contents, SHA-pinned checkout with persisted credentials disabled, OS matrix | That every repository needs the same paths, OS set, action version, or no concurrency |
| `.github/workflows/development-spec-suite.yml` | Path triggers, read-only contents, ref-scoped cancellation, OS/runtime matrix, SHA-pinned official actions | That every job is safely cancellable, every matrix needs all combinations, or these versions remain current |

Project scripts, supported platforms, repository Actions settings, rulesets, environments, runner inventory, and observed hosted runs remain the source of truth.
