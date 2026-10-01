#!/usr/bin/env bash
# session-restore.test.sh — regression check for the SessionStart restore hook.
# Self-contained: every fixture lives in a mktemp sandbox.
set -uo pipefail
HOOK="$(cd "$(dirname "$0")" && pwd)/session-restore.sh"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
TMP="$(cd "$TMP" && pwd -P)"
printf '[user]\n\tname = t\n\temail = t@example.invalid\n' > "$TMP/gitconfig"
export GIT_CONFIG_GLOBAL="$TMP/gitconfig" GIT_CONFIG_NOSYSTEM=1
fails=0
ok()  { printf '  ok   %s\n' "$1"; }
bad() { printf '  FAIL %s\n' "$1"; fails=$((fails + 1)); }
# The hook emits {"hookSpecificOutput":{"additionalContext":...}}; tests read the text.
ctx() { python3 -c 'import json,sys
raw=sys.stdin.read().strip()
if raw:
    d=json.loads(raw); h=d["hookSpecificOutput"]; assert h["hookEventName"]=="SessionStart"; print(h["additionalContext"])'; }
hook() { printf '%s' "$1" | HOME="$TMP/home" DOTFILES_DIR="${DOT:-$TMP/nodot}" python3 "$HOOK" | ctx; }
mkdir -p "$TMP/home"

# A plain repository: branch, HEAD and the uncommitted files are restored.
R="$TMP/repo"; mkdir -p "$R"; git -C "$R" init -q -b main
printf 'a\n' > "$R/a.txt"; git -C "$R" add a.txt; git -C "$R" commit -qm "first commit"
printf 'b\n' > "$R/b.txt"
OUT="$(hook "{\"cwd\":\"$R\",\"source\":\"compact\"}")"; rc=$?
[ "$rc" -eq 0 ] && ok "exits 0" || bad "exit code $rc"
grep -q 'session-restore: compact' <<<"$OUT" && ok "names the trigger" || bad "trigger missing"
grep -q 'HEAD: .* first commit' <<<"$OUT" && ok "restores HEAD" || bad "HEAD missing"
grep -q '?? b.txt' <<<"$OUT" && ok "restores uncommitted files" || bad "uncommitted files missing"
grep -q 'Disk and .delivery evidence outrank' <<<"$OUT" && ok "states that disk outranks the summary" || bad "authority note missing"

# A repository with TASKS.md uses resume-brief (stubbed here).
DOT="$TMP/dot"; mkdir -p "$DOT/bin"
printf '#!/bin/sh\necho "RESUME BRIEF stub for $1"\n' > "$DOT/bin/resume-brief"; chmod +x "$DOT/bin/resume-brief"
printf '# Tasks\n' > "$R/TASKS.md"
OUT="$(DOT="$DOT" hook "{\"cwd\":\"$R\",\"source\":\"resume\"}")"
grep -q "RESUME BRIEF stub for $R" <<<"$OUT" && ok "uses resume-brief when TASKS.md exists" || bad "resume-brief not used"

# Output is capped.
printf '#!/bin/sh\nyes x | head -c 20000\n' > "$DOT/bin/resume-brief"
OUT="$(DOT="$DOT" hook "{\"cwd\":\"$R\",\"source\":\"compact\"}")"
[ "${#OUT}" -lt 3600 ] && ok "output is capped" || bad "output is ${#OUT} chars"

# A hanging resume-brief is bounded and falls back to git state.
printf '#!/bin/sh\nsleep 30\n' > "$DOT/bin/resume-brief"
start=$(date +%s); OUT="$(DOT="$DOT" hook "{\"cwd\":\"$R\",\"source\":\"compact\"}")"; took=$(( $(date +%s) - start ))
[ "$took" -lt 10 ] && ok "a hanging resume-brief is bounded (${took}s)" || bad "took ${took}s"
grep -q 'Branch: main' <<<"$OUT" && ok "and falls back to git state" || bad "no fallback"

# Outside a repository, with garbage input, or at HOME: silent, exit 0.
OUT="$(hook "{\"cwd\":\"$TMP\"}")"; rc=$?
[ -z "$OUT" ] && [ "$rc" -eq 0 ] && ok "silent outside a repository" || bad "spoke outside a repository"
OUT="$(hook 'not json')"; rc=$?
[ "$rc" -eq 0 ] && ok "garbage input exits 0" || bad "garbage input exit $rc"
mkdir -p "$TMP/home"; git -C "$TMP/home" init -q
OUT="$(hook "{\"cwd\":\"$TMP/home\"}")"
[ -z "$OUT" ] && ok "silent in the accidental HOME repository" || bad "spoke at HOME"
ln -s "$TMP/home" "$TMP/home-link"
OUT="$(printf '%s' "{\"cwd\":\"$TMP/home\"}" | HOME="$TMP/home-link" DOTFILES_DIR="$TMP/nodot" python3 "$HOOK" | ctx)"
[ -z "$OUT" ] && ok "silent when HOME is reached through a symlink" || bad "spoke at a symlinked HOME"
# Two hanging steps still finish inside the 10s budget (manifest kills at 15s).
printf '#!/bin/sh\nsleep 30\n' > "$DOT/bin/resume-brief"
GIT_SLOW="$TMP/slowgit"; mkdir -p "$GIT_SLOW"
printf '#!/bin/sh\ncase "$*" in *log*|*status*) sleep 30;; esac\nexec %s "$@"\n' "$(command -v git)" > "$GIT_SLOW/git"; chmod +x "$GIT_SLOW/git"
start=$(date +%s); OUT="$(printf '%s' "{\"cwd\":\"$R\"}" | PATH="$GIT_SLOW:$PATH" HOME="$TMP/home" DOTFILES_DIR="$DOT" python3 "$HOOK" | ctx)"; took=$(( $(date +%s) - start ))
[ "$took" -le 11 ] && ok "whole hook stays within its budget (${took}s)" || bad "hook took ${took}s"

[ "$fails" -eq 0 ] && { echo "session-restore.test: PASS"; exit 0; }
echo "session-restore.test: $fails failed"; exit 1
