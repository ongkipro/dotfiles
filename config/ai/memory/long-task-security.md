# Memory: Security enforcement for development tasks

> On-demand secret-isolation, Git-guard, and non-destructive safety protocol split from [long-task-system.md](long-task-system.md). Repository policy and explicit approval gates remain authoritative.

## 4. Security enforcement

### Secret isolation

- Detect secret-bearing files by name or metadata only; do not read `.env*`, private keys, tokens, auth sessions, payment/customer exports, or secret backups without explicit approval.
- Never place secret values in prompts, task payloads, logs, memory, screenshots, fixtures, commits, or generated documentation. Use placeholders and existing secret bindings.
- Keep private keys and secret archives outside dotfiles. Global ignore rules are defense in depth, not proof that a credential is absent from Git history.
- Before an authorized commit, run [`security-check`](../../../bin/security-check) against the intended repository/staged content. A removed leaked credential still requires rotation and history assessment.

### Deny rules and Git guard

- Permission allowlists express capability, not approval. The approval gates in [AGENTS.md](../AGENTS.md) still govern secrets, destructive operations, system-wide changes, production, and scope expansion.
- Keep sensitive directories denied as whole paths. Claude permission denies take precedence over allows and cannot safely carve exceptions from a protected directory; use a non-secret interface such as `ssh -G <host>` instead of reading `~/.ssh/**`.
- Prefix allow rules cannot distinguish dangerous Git flags. [`git-guard.sh`](../hooks/git-guard.sh) is the Claude `PreToolUse` boundary: it denies force-push and amend, and asks before mirror/prune, ref deletion, or forced refspecs.
- The hook does not inspect Git subprocesses launched inside Lazygit and does not protect other CLIs by itself. All agents must still obey additive-history and approval policy. Run [`git-guard.test.sh`](../hooks/git-guard.test.sh) after changing the hook.

### Non-destructive safety gates

1. Begin with read-only inspection and the smallest target scope.
2. Show or inspect the affected set before bulk mutation; prefer dry-run or reversible operations when the platform provides them.
3. Preserve unrelated worktree changes. Never use destructive Git reset/clean, mass deletion, or history rewrite as cleanup.
4. Require explicit user approval immediately before secrets access, destructive action, system-wide change, production/live mutation, or expanded scope. Prior broad permission does not satisfy this gate.
5. Verify backup/rollback viability before an approved destructive migration; a command that merely claims to create a backup is not proof it can be restored.
6. After the change, run the focused security/integrity check and report the exact observed result. Do not weaken a gate to make the check green.
