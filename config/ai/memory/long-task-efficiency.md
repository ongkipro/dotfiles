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

## 4. Zero-waste supervised verification & review pipeline (Owner mandate 2026-11-19)

Eliminate multi-round review ping-pong, duplicate full-suite runs, `workerd`/Playwright CPU thrashing, and subagent context duplication:

1. **Supervisor pre-review BEFORE external review:** Before invoking an independent `reviewer` subagent, the Supervisor MUST inspect the git diff and screenshots directly against domain invariants (money/fee rules, masking/privacy ADRs, keyboard/ARIA contracts, input validation, mobile/desktop overflow). Fix obvious gaps in one fast pass before spending an external review round.
2. **Risk-proportional review (`R0–R2` vs `R3–R4`):**
   - **R0 / R1 / R2** (copy, CSS, marketing layout, SVG/logo, animations, docs, dev tooling): Supervisor direct code + screenshot review is sufficient — do NOT run multi-round external reviewer loops.
   - **R3 / R4** (auth/session, money/ledger, tenant isolation, DB/DO migrations, security boundaries): run independent cross-family review (`reviewer` / GPT-6.2 Sol) AFTER Supervisor pre-review, aiming for single-round `APPROVE`.
3. **Focused checks during iteration, full gate ONCE at the end:**
   - While building or fixing review items, run ONLY `typecheck` + touched unit/worker test files + touched Playwright spec (`GX_SKIP_BUILD=1` / server reuse after one build).
   - NEVER run `pnpm test:worker` and `pnpm check` separately on the same tree when `pnpm check` already includes `test:unit` + `test:worker`.
   - NEVER run a full `delivery-ledger` suite *before* review if the run must close `BLOCKED` pending review and then re-run everything in a "release run" afterward. Keep iteration checks focused; run ONE final `delivery-ledger` gate (`PASS`) right before merge & deploy.
4. **No heavy parallel subagents fighting one lock:** Inside an Executor session, do not spawn multiple `general-purpose` subagents that each re-read 200k–300k tokens of repo context only to queue behind the same `heavy-run` lock. Execute edits sequentially in the main thread and run one combined verification pass. Cap local `workerd`/Vitest concurrency (`maxWorkers: 3`) on shared multi-project hosts to prevent port/teardown flakes.
