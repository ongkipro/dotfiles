# Memory: Token, prompt, and diff efficiency

> On-demand progressive-disclosure and minimal-diff protocol split from [long-task-system.md](long-task-system.md).

## 3. Token and prompt optimization

### Progressive disclosure

- Keep always-loaded policy short: invariant, trigger, and pointer. Put detailed reusable method in a matching skill `references/` file or this on-demand memory reference.
- Load the matching `SKILL.md` first, then only the named reference required for the current mode. Do not read an entire reference tree preemptively.
- Read code by symbol and bounded section. Search to locate; then read the complete relevant construct and its callers. Avoid whole-repository dumps.
- Link to canonical contracts instead of duplicating them. One rule has one owner; consumers carry a short pointer.
- Give delegated prompts only the slice contract: target, change, acceptance, constraints, and shared interface. Exclude unrelated conversation and speculative advice.
- GitHub-harvested architecture patterns belong in skill `references/`, not in memory. Current pattern references: `admin-dashboard/references/github-admin-patterns.md` and `next-shadcn-starter-patterns.md` (admin table/form/RBAC contracts from Refine, Payload CMS, Medusa, next-shadcn-dashboard-starter); `storefront-development/references/next-commerce-patterns.md` (commerce catalog/cart/checkout contracts from Next Commerce). These are loaded on demand by the owning skill; do not duplicate their content into memory or always-loaded policy.

### Minimal-diff discipline

Use the repository’s existing convention and stop at the first rung that holds: no change, existing helper, standard library, native platform, installed dependency, one line, then minimum new code.

- Prefer surgical or syntax-aware edits. Do not reformat untouched code, add wrappers with one caller, introduce configuration for fixed values, or scaffold hypothetical reuse.
- A small diff is only good after tracing the real flow. Migrate every affected caller and remove obsolete aliases, comments, and dead branches in the same cutover.
- Validate with the smallest executable evidence that would fail for the plausible bug. A broad suite cannot replace reproducing the changed behavior.
- Compress checkpoints into durable facts and paths. Do not preserve verbose tool output when the command, observed result, and causal conclusion are sufficient.
