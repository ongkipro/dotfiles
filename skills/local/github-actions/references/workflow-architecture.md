# Workflow architecture and data flow

Use this reference after classifying trust boundaries. It covers structure, not application test selection or deployment implementation.

## Choose the reuse primitive

| Primitive | Owns | Runs where | Use when | Avoid when |
|---|---|---|---|---|
| Repository script | Portable build/test/domain logic | Local machine and caller job | Logic must be reproducible outside Actions | The work is purely GitHub orchestration |
| Composite action | Repeated sequence of steps | Inside the caller's job, runner, workspace, and permissions | Several workflows repeat the same setup/step protocol | You need multiple jobs, runner selection, services, environment gates, or job permissions |
| Reusable workflow | One or more jobs and their CI contract | Its own declared jobs/runners | Callers need the same CI capability, matrices, outputs, or gates | Only a few steps within one existing job repeat |
| Workflow template | Starting point copied into repositories | Independent copied workflow | Organization bootstrap where later divergence is intentional | Central fixes must propagate; use a reusable workflow instead |

A composite action does not create a new trust boundary. It inherits the caller job's authority and sees the same workspace. Give secrets to it only as explicit inputs when necessary; do not assume implicit secret access is part of its contract.

A reusable workflow is called at job level. Define `workflow_call` inputs/secrets/outputs as a public interface. Callers should not depend on undocumented internal job names or implementation details.

## Reusable workflow contract checklist

- Inputs are typed, minimally required, named for semantics rather than caller internals, and have safe defaults only when a default is genuinely universal.
- Secret inputs are explicit and minimal. Blanket inheritance is exceptional because it hides the callable contract and enlarges exposure.
- Outputs are stable values a caller needs for orchestration. Large files belong in artifacts, not string outputs.
- Permissions are documented at the caller/callee boundary. A called workflow cannot be used as a reason to grant the caller broad workflow-wide authority.
- Cross-repository calls use a verified full commit SHA. Same-repository calls use the supported local workflow path rather than a branch alias.
- Nested calls are traced. Permissions can only remain the same or become more restrictive through the call chain, and secrets must follow GitHub's explicit passing rules.
- Every caller is migrated before removing a superseded workflow/action/script.

## Job graph design

Start from evidence and mutation nodes, then draw only real dependencies:

```text
validate metadata ─┐
unit/integration ──┼─> package exact artifact ─> attest/sign ─> protected promotion
compatibility ─────┘
```

Principles:

- Validation jobs may run in parallel when they do not consume one another.
- Packaging depends on every input whose success is required for the artifact claim.
- A privileged publish/promote job depends on all required evidence and independently checks its trusted event/ref.
- Cleanup/reporting may use a deliberate always-run condition, but no release/publish mutation may run after failed or skipped required evidence.
- `needs` exposes only direct dependencies' outputs. Add an edge when data or status is truly consumed; do not create a serial chain solely to make the UI orderly.
- A skipped upstream job normally causes dependents to skip. Check optional-job conditions against success, failure, skip, and cancellation—not only the happy path.

## Matrix design

Write down the support contract before writing axes.

- Use independent axes only when the Cartesian product is meaningful.
- Use `include` for a small supported exception or extra metadata, and `exclude` for invalid combinations.
- If only named combinations matter, use an `include` list rather than generating a large Cartesian product.
- Set `fail-fast: false` when all variant outcomes are required to diagnose compatibility. Use the default/true behavior when remaining variants add no evidence after one failure.
- Bound provider/API load and runner spend with `max-parallel` where required.
- Include matrix identity in job display names, artifact names, cache keys, and test report paths.
- Do not publish once per matrix leg unless each leg intentionally owns a distinct artifact. Aggregate or select exactly one publisher.

Dynamic matrices derived from event payloads or untrusted job outputs are untrusted input. Validate size and allowlisted values before they influence runner labels, commands, environments, or resource names.

## Concurrency design

Choose a group key from the resource/invariant:

| Work | Typical identity | Cancellation rule |
|---|---|---|
| PR validation | workflow + PR number or ref | Cancel superseded runs when no external mutation must finish |
| Branch validation | workflow + branch/ref | Cancel superseded runs if only newest evidence matters |
| Package publication | package/channel/version | Usually serialize; do not cancel after mutation begins |
| Environment deployment | application + environment/resource | Serialize; cancellation only if deployment owner proves it safe |

GitHub concurrency group names are case-insensitive. Across a group, at most one run/job is executing and one is pending; a newer pending member replaces the older pending member, and ordering is not guaranteed. Make event/workflow identity explicit when unrelated work must not collide.

`cancel-in-progress` is evaluated control flow, not rollback. If partially completed work needs recovery, the underlying command/deployment protocol must supply it. Hand that implementation to the deployment owner.

## Cache contract

A cache is an optimization. A correct workflow succeeds from a cold miss.

Key inputs normally include:

- operating system/architecture when artifacts are platform-dependent;
- package manager/tool and relevant version;
- runtime/ABI version;
- lockfile or dependency manifest hash;
- build flags that alter cached bytes;
- trust namespace when any producer is less trusted than a consumer.

Use restore prefixes only where every matching older entry remains safe and compatible. Never rely on a cache to transfer unique build output, reports, credentials, or release candidates. Do not save a cache when a failed or untrusted process may have corrupted its content.

GitHub cache visibility and eviction behavior are platform details, not security isolation to guess from memory. Recheck current docs for branch/default-branch and fork behavior.

## Artifact contract

An artifact handoff defines:

- trusted producer and intended consumers;
- deterministic name, with matrix identity where needed;
- exact included paths and explicit exclusions;
- expected file types, count, size, layout, and digest;
- retention appropriate to debugging/release needs;
- extraction/validation procedure;
- whether GitHub artifact attestation is required.

Do not upload an entire workspace by default: it may contain source credentials, tool configuration, caches, `.git`, or unrelated output. Do not use an artifact name or extraction path directly from untrusted event text.

Artifacts passed between matrix jobs need unique names or an explicit merge stage. Verify that a promotion job downloads exactly the intended artifact from the intended run/SHA, not merely “the newest” matching name.

## Artifact provenance and promotion

Separate three claims:

1. **Integrity:** bytes match an expected digest.
2. **Provenance:** an attestation binds bytes to a build identity and metadata.
3. **Trustworthiness:** source, dependencies, workflow, runner, and reviewers satisfy policy.

A digest alone can be supplied by a malicious producer. An attestation proves a statement was made by the identified workflow identity; it does not prove the workflow or inputs were benign.

For production promotion:

- build once from the trusted immutable commit;
- record artifact digest and relevant provenance;
- make every required validation operate on that commit/artifact or a clearly equivalent input;
- approve the protected environment;
- promote the same digest;
- let the deployment owner verify resulting application health.

Do not rebuild from a floating branch after approval.

## Event and required-check design

Branch/path/activity filters reduce work, but required checks must still have a conclusion for every merge path to which rules apply. GitHub documents that a workflow skipped by branch/path filtering can leave its associated check pending. Before adding filters:

1. identify the exact required check name and ruleset scope;
2. enumerate docs-only, source, generated, merge-queue, fork, and draft paths that must conclude;
3. choose a stable always-created gate or rules configuration supported by the repository;
4. verify actual PR behavior rather than assuming check-name matching.

Do not create a duplicate no-op workflow with the same job/check name; ambiguous status sources can weaken or deadlock protection.

## Hosted runners and reproducibility

- Select a runner image from the repository's supported OS contract. `*-latest` is a moving image and may migrate; an explicit image label still receives image updates.
- Pin/setup application runtime and package-manager versions through the repository's existing mechanism and lock dependencies.
- Inspect current runner image software manifests before assuming a preinstalled tool/version.
- Treat runner disk, CPU, architecture, network, and virtualization limits as volatile plan/platform facts.
- Use self-hosted labels that identify required capabilities, but do not schedule untrusted public code onto persistent infrastructure.
- Make external downloads retry only when the underlying command is idempotent and project policy permits it; retries must not conceal deterministic test failures.

## Clean cutover review

After centralizing duplicated automation:

- all callers use one canonical reusable workflow/composite action/script;
- old inputs, secrets, outputs, action paths, and workflow files are removed;
- rulesets/required checks reference the surviving stable check names;
- documentation and dependency-update configuration point at the canonical files;
- no compatibility alias or copied fallback remains;
- at least one real caller proves the shared path on GitHub-hosted execution.
