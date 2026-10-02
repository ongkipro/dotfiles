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


---


## Lesson: Skill artifact examples must parse in the repository's own tooling

### Symptom
prd-taskbreaker emitted '- [ ] **T1**' tasks and plain 'Primary requirement:' suite lines; resume-brief, ai-policy-lint and check-traceability silently saw zero tasks or zero primaries.

### Root cause
Skill examples were written as prose conventions and never executed against the parsers (resume-brief TASK_ID/Depends On regex, suite metadata parser) that consume the generated files.

### Durable invariant
Any Markdown example a skill tells agents to emit is parsed by every repository tool that reads that artifact, with zero findings, before the skill change is accepted.

### Fix
Standalone tasks use '### TASK-NNN:' + canonical bold bullet fields; suite tasks use bold bullets; one complete lint-passing example contract.

### Regression check
Extract the fenced example from SKILL.md and run resume-brief parse_task_graph, ai-policy-lint lint_task_contracts, and check-traceability.py on it (TASK-090 run evidence prd-example-parses).

> Promoted from a reviewed local candidate on 2026-10-01.


---


## Lesson: pkill -f / pgrep -f can kill the agent's own shell

### Symptom
Stopping a background sweep with pkill -f 'sweep080' (and later pgrep -f with the same pattern) exited the agent's Bash tool with 144/1 and left the real child processes running.

### Root cause
The harness runs each command via bash -c '<full command text>', so the pattern also matches the invoking shell's own argv; the shell is killed first, before the targets.

### Durable invariant
Never pass a pattern to pkill -f or pgrep -f from a shell whose own command line contains that pattern.

### Fix
List candidates with ps -eo pid,args | grep '[p]attern' (bracket trick excludes the grep and shell text), review the PIDs, then kill those PIDs explicitly.

### Regression check
ps -eo pid,args | grep '[m]utation-sweep' shows only the intended targets before any kill; ledger verify stays clean afterwards.

> Promoted from a reviewed local candidate on 2026-10-01.


---


## Lesson: Execute generated hook commands in tests, never just inspect their text

### Symptom
A Codex PreToolUse hook installed as 'env AI_HOOK_RUNTIME=codex g=...; [ -x "$g" ] && exec "$g"' passed its test, yet a live session ran git push --mirror unguarded.

### Root cause
env treats every leading NAME=value as an environment assignment, so it swallowed the shell assignment g=..., ran no command and exited; the guard was never invoked. The test only checked the command prefix string.

### Durable invariant
A generated hook or wrapper command is verified by executing it through the same shell with a realistic payload and asserting the guarded outcome.

### Fix
Prefix with 'export VAR=value;' instead of 'env VAR=value', and add a test that runs the installed command via sh -c and requires a deny for a dangerous command and silence for a safe one.

### Regression check
Revert the fix and confirm the execution test fails; with the fix, a live 'codex exec' probe reports 'Command blocked by PreToolUse hook'.

> Promoted from a reviewed local candidate on 2026-10-02.
