#!/usr/bin/env python3
"""session-restore — SessionStart hook (matcher: compact|resume). TASK-100.

Compaction summarizes the conversation and loses exact state: which task is
open, what changed, which checks passed. That state already lives on disk
(TASKS.md, .delivery/, git), so after compaction or resume this prints a short
brief from the repository itself into the new context. Claude Code adds a
SessionStart hook's stdout to the model's context.

Read-only and FAIL-OPEN: any error prints nothing and exits 0. Every external
command is bounded. Output is capped so it can never crowd the context.
It never reads memory contents, secrets, or transcripts.
"""
import json
import os
import subprocess
import sys
import time

CAP = 3000          # characters of brief injected into context
STEP_TIMEOUT = 4    # seconds per external command
BUDGET = 10         # seconds for the whole hook; the manifest kills it at 15
DEADLINE = time.monotonic() + BUDGET


def run(args, cwd):
    left = min(STEP_TIMEOUT, DEADLINE - time.monotonic())
    if left <= 0.2:
        return ""
    try:
        out = subprocess.run(args, cwd=cwd, capture_output=True, text=True,
                             timeout=left, stdin=subprocess.DEVNULL)
        return out.stdout if out.returncode == 0 else ""
    except (OSError, subprocess.SubprocessError):
        return ""


def main():
    try:
        payload = json.loads(sys.stdin.read() or "{}")
    except (ValueError, OSError):
        payload = {}
    cwd = payload.get("cwd") or os.getcwd()
    source = payload.get("source", "")
    if not os.path.isdir(cwd):
        return
    top = run(["git", "rev-parse", "--show-toplevel"], cwd).strip()
    if not top or os.path.realpath(top) == os.path.realpath(os.path.expanduser("~")):
        return

    parts = []
    dot = os.environ.get("DOTFILES_DIR", os.path.expanduser("~/dotfiles"))
    brief_bin = os.path.join(dot, "bin", "resume-brief")
    if (os.path.isfile(os.path.join(top, "TASKS.md")) or os.path.isdir(os.path.join(top, ".delivery"))) \
            and os.access(brief_bin, os.X_OK):
        parts.append(run([brief_bin, top], top).strip())
    if not parts or not parts[0]:
        branch = run(["git", "rev-parse", "--abbrev-ref", "HEAD"], top).strip()
        head = run(["git", "log", "-1", "--format=%h %s"], top).strip()
        status = run(["git", "status", "--short"], top).splitlines()
        lines = [f"Repository: {top}", f"Branch: {branch}", f"HEAD: {head}"]
        if status:
            lines.append(f"Uncommitted ({len(status)}):")
            lines += ["  " + s for s in status[:15]]
            if len(status) > 15:
                lines.append(f"  ... {len(status) - 15} more")
        else:
            lines.append("Worktree: clean")
        parts = ["\n".join(lines)]

    brief = parts[0]
    if len(brief) > CAP:
        brief = brief[:CAP] + "\n... (truncated; run resume-brief for the full brief)"
    text = (f"[session-restore: {source or 'start'}] Repository state read from disk. "
            "Disk and .delivery evidence outrank the compacted summary; re-check "
            "STATUS.md/TASKS.md before acting on anything remembered.\n" + brief)
    # JSON additionalContext is understood by both Claude Code and Codex;
    # Codex ignores plain stdout from hooks (TASK-106).
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "SessionStart",
                                             "additionalContext": text}}))


if __name__ == "__main__":
    try:
        main()
    except Exception:  # fail-open: a broken brief must never break a session
        pass
    sys.exit(0)
