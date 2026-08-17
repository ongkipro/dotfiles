# Memory: Advanced system debugging

> On-demand root-cause, DAP, LSP, and `ai-doctor` protocol split from [long-task-system.md](long-task-system.md).

## 2. Advanced system debugging

### Root-cause protocol

Use this sequence for a defect, regression, or failing system check:

1. **Reproduce.** Capture the smallest deterministic command or user flow, actual result, expected result, environment boundary, and first observable failure. If the defect cannot be reproduced, gather evidence; do not patch a guess.
2. **Map the flow.** Use LSP definition, references, implementations, type information, and call hierarchy when supported. Search text only for configuration, dynamic registration, generated names, or languages without a usable server. Trace all callers before editing shared behavior.
3. **Locate the earliest divergence.** Follow input → transformation → state → output. Compare a working path or invariant and identify where state first becomes wrong, not where the final error is displayed.
4. **Test one hypothesis at a time.** Prefer a targeted observation, breakpoint, existing diagnostic, or temporary local instrumentation. Remove temporary instrumentation after proof.
5. **Fix the owning boundary.** Change the smallest shared source that restores the invariant. Do not scatter guards across callers, suppress the exception, weaken validation, or special-case only the reported input.
6. **Prove the repair.** Re-run the original reproduction, then the smallest existing changed-contract check. Add a permanent test only when the observable regression was previously uncovered and repository conventions support it.
7. **Escalate deliberately.** After one reasonable path fails or evidence shows a hard defect, route a bounded reproduction and collected evidence to the OMP `debugger`; do not make it rediscover the entire project.

### DAP with `xd://debug`

Use the Debug Adapter Protocol when runtime state, timing, stack flow, or mutation order cannot be established cheaply from code and deterministic output.

1. Prefer `launch` for a controlled reproduction; use `attach` only to a verified process. Only one debug session is active at a time.
2. Set the first breakpoint at the earliest suspected invariant boundary, not at the final exception handler. Conditional and hit-count breakpoints reduce noise in loops or high-traffic paths.
3. Inspect `stack_trace`, then the relevant `scopes` and `variables`. Use `evaluate` for non-mutating observations. Use data breakpoints/watchpoints when the question is “who changed this value?” and the adapter supports them.
4. Step over known framework code, step in only at the suspected boundary, and compare actual state with the expected invariant.
5. Never modify live/production state, write process memory, or attach to a sensitive process without the applicable approval. Do not print secrets while inspecting variables.
6. Terminate the session after the reproduction. Record the causal finding and verification, not raw debugger dumps.

### LSP navigation

- Start with symbol definition and references; it preserves semantic identity better than filename guessing or global text replacement.
- Inspect implementations for interfaces/traits and all references before signature or behavior changes.
- Use semantic rename only after reviewing its scope; generated code, string keys, templates, and external consumers may still require targeted search.
- If navigation is empty or suspicious, run `hx --health` and verify the language server from `config/helix/languages.toml`. Do not interpret an unavailable LSP as “no callers.”

### `ai-doctor` diagnosis and recovery

[`ai-doctor`](../../../bin/ai-doctor) is read-only in default mode. `ai-doctor --self-test` adds isolated repository regression fixtures; neither mode is a blanket auto-repair command.

1. Run `ai-doctor` and classify each result as repository defect, broken runtime link, device drift, missing optional runtime, or external auth/provider failure.
2. Follow the named narrow repair path in its output (for example `ai-memory-link`, `skill-update`, or the installer) only when it matches the diagnosed class. Inspect scripts before any system-affecting action.
3. Re-run the failed focused check first, then `ai-doctor`. Use `ai-doctor --self-test` after changing runtime wiring, memory links, hooks, or their validation logic.
4. Never “heal” by deleting unknown files, overwriting regular files, weakening a deny rule, installing unrequested software, or copying secrets into managed paths.
5. A warning is not automatically a failure. Report optional-runtime or unrelated worktree warnings accurately; do not claim a clean device unless the observed output is clean.
