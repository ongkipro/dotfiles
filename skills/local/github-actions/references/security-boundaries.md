# Security and trust-boundary review

Use this review before changing an event, permission, runner, secret, cache, artifact, environment, or external action. GitHub's current documentation and repository settings override this reference.

## Event/ref trust matrix

| Path | Code/ref normally under test | Credential posture | Safe default |
|---|---|---|---|
| `pull_request` from same repository | PR merge/head content can be contributor-controlled | Minimize `GITHUB_TOKEN`; repository secrets only when repository policy intentionally permits them | Build/test only; no privileged side effects |
| `pull_request` from a fork | Untrusted fork contribution | Fork secrets are not passed; token is restricted by GitHub policy | Preferred fork validation path; read-only/empty permissions |
| `pull_request_target` | Base/default-branch workflow context, but event fields identify an untrusted PR | Can receive a privileged token and secrets | Metadata-only; do not checkout or execute PR content |
| `workflow_run` after untrusted CI | Trusted workflow definition can receive privilege, but predecessor outputs are untrusted | Can access secrets/write token independently of predecessor | Do not execute or trust predecessor artifacts/caches/outputs; use only a narrowly reviewed promotion protocol |
| `push` to a protected branch/tag | Repository content that passed the configured merge/ref controls | Add only permissions needed by the job | Trusted CI or release candidate, subject to actual ruleset settings |
| `workflow_dispatch` | Selected ref plus caller-supplied inputs | Depends on workflow permissions/environments | Operator convenience, not authorization; retain protected environment and ref checks |

The event name does not establish trust by itself. Confirm which workflow definition GitHub loads, which commit is checked out, who can update that ref, and what the job consumes.

## Untrusted PR invariant

A job that executes PR-controlled code must not have a path to repository writes, release/package publication, production credentials, trusted caches, sensitive artifacts, internal network services, or persistent runners.

Review all indirect execution:

- install/build/test hooks and package-manager lifecycle scripts;
- checked-in scripts, Makefiles, task runners, compiler plugins, and test configuration;
- local actions from the checked-out repository;
- generated filenames, archive paths, output values, and shell fragments;
- container build files and code-generation configuration;
- artifacts or caches later opened by a privileged job.

Checking out a PR and then “only running a safe script from main” is not safe if imports, configuration, tool resolution, PATH, package hooks, or workspace files remain PR-controlled.

## `pull_request_target` checklist

Prefer not to use it. If a metadata workflow genuinely requires it:

- leave checkout absent;
- do not download PR artifacts or restore PR-influenced caches;
- do not run a script, action, executable, configuration, or container from the PR;
- treat title, body, labels, branch names, author, comments, and changed filenames as data, never code;
- pass event data through typed action inputs or quoted environment variables rather than shell interpolation;
- grant only the single write scope required for the metadata operation;
- keep production/package/environment secrets out;
- test with adversarial strings and a fork PR.

A condition comparing the author, label, or repository name does not make PR content safe to execute.

## `workflow_run` promotion checklist

`workflow_run` is a privilege boundary, not a safe bridge by default. If a trusted follow-up must consume predecessor output:

1. Bind the predecessor by exact workflow identity, expected event, repository, head SHA/ref, and completed conclusion.
2. Fetch data only through a documented GitHub API path with minimum token permissions.
3. Treat archive paths, symlinks, filenames, manifests, metadata, and contents as attacker-controlled.
4. Verify a cryptographic digest or attestation created by a trusted build boundary. A digest supplied by the untrusted producer is not independent verification.
5. Never source, execute, import, install, deserialize unsafely, or interpolate the data into shell/SQL/template code.
6. Ensure the data cannot replace repository files, action code, PATH entries, configuration, credentials, or release metadata outside an allowlisted schema.
7. Prefer rebuilding in a trusted context from a reviewed immutable commit when no safe promotion design exists.

## Permission review

Start at top-level `permissions: {}` or the repository's minimum read baseline. For each job, list every operation and add only the documented scope it needs.

Common boundaries:

- `contents: read` for checkout/read access;
- repository writes only in a dedicated trusted job;
- `pull-requests: write` or `issues: write` only for the exact metadata mutation;
- `packages: write` only for the publisher;
- `attestations: write` only for attestation creation;
- `id-token: write` only for the job requesting an OIDC token.

`id-token: write` permits requesting an identity token; the external provider's trust policy determines what that identity can do. Do not place it in a workflow-wide permission block.

Actions can obtain `github.token` even when it is not passed as an explicit input. Every action in the job therefore belongs in the permission review. When one or more permission scopes are specified, verify the effective value of every other required scope rather than assuming defaults.

## External action dependency review

For each `uses: owner/repository@ref` or cross-repository workflow:

1. Open the canonical repository, not a similarly named fork.
2. Confirm ownership, maintenance, security posture, license where relevant, and the current release.
3. Resolve the intended release tag to its full commit SHA using GitHub/upstream evidence.
4. Review release notes and the changed source/build output for the version transition.
5. Pin the 40-character SHA and retain the release label in a comment for update readability.
6. Inspect whether a JavaScript/composite action invokes further executables, images, scripts, or actions.
7. Let dependency automation propose future SHA updates; require normal review and verification.

A full SHA makes the selected Git object immutable. It does not establish that the repository owner, source, generated distribution, or release process is trustworthy.

## Script-injection review

Unsafe:

```yaml
run: echo "${{ github.event.pull_request.title }}"
```

The expression is substituted before the shell parses the script. Quotes already present in attacker-controlled data can change the program.

Safer boundary:

```yaml
env:
  PR_TITLE: ${{ github.event.pull_request.title }}
run: printf '%s\n' "$PR_TITLE"
```

Environment variables prevent the event value from becoming shell source, but the receiving command must still quote and validate it for its destination. Prefer an action input or structured program argument when available. Apply the same rule to branch names, issue bodies, commit text, manual inputs, matrix values influenced by external data, artifact names, and outputs.

## Secrets and log handling

- Use separate least-privilege credentials rather than a structured multi-secret blob.
- Prefer environment-level secrets for protected operations and OIDC for cloud access.
- Do not echo secrets, enable shell tracing around them, include them in URLs/command arguments, or upload logs/configuration that contains them.
- Mask generated sensitive values before a command might print them. GitHub redaction is not a proof that every encoding or transformation is hidden.
- Test both success and failure logs. Tools often print arguments, headers, environment fragments, or provider responses only on failure.
- If exposure occurs, delete accessible logs/artifacts as appropriate and rotate/revoke the credential. Masking after exposure is not remediation.

## OIDC trust policy

The workflow and cloud/provider policy form one control:

- job permissions: `id-token: write` only where used;
- audience: exact provider-expected value;
- subject/claims: restrict to the expected GitHub organization/owner, repository, environment or protected ref/tag, and workflow identity as supported by the provider;
- provider role: minimum resource permissions and short session duration;
- environment: required reviewers and deployment branch/tag controls for production;
- logs: no token or exchanged credential output.

Recheck GitHub's and the provider's current claim formats before writing a policy. Do not derive a trust policy from remembered example strings.

## Protected production gate review

Confirm in both YAML and repository settings:

- protected branch/tag or ruleset identifies the trusted source;
- verification jobs are explicit `needs` predecessors;
- deployment job references the correct environment;
- environment has required reviewers, self-review policy, branch/tag restrictions, and scoped secrets configured as intended;
- only the deployment job receives OIDC/secrets/write permissions;
- approved input is the exact verified artifact/digest;
- concurrency protects the target resource without unsafe cancellation;
- application deployment owner defines health evidence and rollback behavior.

The workflow must not copy production secrets into an earlier job output or artifact. Environment approval gates the job, not arbitrary steps inside an already privileged job.

## Cache and artifact poisoning

Do not share a cache namespace from untrusted jobs into trusted/privileged jobs. Cache keys and restore prefixes must include all compatibility and trust dimensions; a more specific save key does not help if a broad restore prefix accepts attacker-influenced entries.

Artifacts cross job/run boundaries explicitly but remain data from their producer. Apply allowlisted filenames, traversal-safe extraction, type/size limits, digest/provenance checks, and non-execution. Never place downloaded tools or scripts on PATH in a privileged job unless the producer is itself trusted and verified.

## Review evidence

A security review should identify:

- event and exact checked-out ref/SHA;
- whether fork-controlled code runs;
- effective job permissions and secret availability;
- runner persistence/network boundary;
- every external action with full SHA and reviewed release;
- cache/artifact producers and consumers by trust class;
- OIDC provider restrictions and protected environment settings;
- adversarial fork/event-string execution evidence or the precise unverified gap.
