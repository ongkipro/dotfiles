#!/usr/bin/env bash
# git-guard — PreToolUse(Bash) hook.
#
# Bash(git add|commit|push:*) in ~/.claude/settings.json is a *prefix* rule, so
# it silently waves through `git push --force`, `--mirror`, `--delete`, forced
# refspecs, and `git commit --amend`. AGENTS.md forbids those, but text does not
# bind. This restores the boundary mechanically.
#
# Reads the hook payload on stdin, emits a PreToolUse decision on stdout.
# Anything it does not recognise falls through silently (exit 0 = no opinion).
#
# lazy: matches command text, it does not parse shell. Heredoc bodies are
# dropped and a match must sit in command position, which covers ordinary use.
# What still slips past is an invocation wrapped in another interpreter
# (`bash -c "git push --force"`) or hidden behind an alias. This guards against
# our own slips, not against someone deliberately routing around it; the
# upgrade path is a real shell parser, which is not worth the cost here.
set -u

decide() { # <allow|deny|ask> <reason>
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"%s","permissionDecisionReason":"%s"}}\n' "$1" "$2"
  exit 0
}

# Read the payload with jq if present, otherwise python3.
#
# This used to be `cmd=$(jq …) || exit 0`, which failed OPEN: with jq missing the
# guard emitted no decision and exited 0, so every destructive git command was
# waved through in silence. jq is in neither installer and neither is it in the
# shared mise toolchain, so that was the state on any machine that skipped a
# manual `apt install jq`. python3 is already a hard dependency of this repo
# (omp-routing-test, ai-doctor, dotsync), which makes it a safe second reader.
#
# If neither parser exists the guard asks rather than allowing. A prompt on every
# git command is loud and annoying, which is the point: a security control that
# cannot run should be visible, not absent.
payload=$(cat)
[ -n "$payload" ] || exit 0

cmd=""
parsed=0
if command -v jq >/dev/null 2>&1 \
  && cmd=$(printf '%s' "$payload" | jq -r '.tool_input.command // ""' 2>/dev/null); then
  parsed=1
fi
# A jq that is present but broken must not count as a successful read — that was
# the same fail-open in a different coat. Retry with python3 whenever the first
# reader did not return cleanly.
if [ "$parsed" -eq 0 ] && command -v python3 >/dev/null 2>&1 \
  && cmd=$(printf '%s' "$payload" | python3 -c 'import json,sys
print(json.load(sys.stdin).get("tool_input", {}).get("command", "") or "")' 2>/dev/null); then
  parsed=1
fi
if [ "$parsed" -eq 0 ]; then
  decide ask "git-guard could not read the hook payload: no working jq or python3, so destructive-git protection is OFF on this machine. Verify the command yourself."
fi
[ -n "$cmd" ] || exit 0

# Drop heredoc bodies first: a commit message that *describes* a forbidden
# command (`git commit -F - <<'EOF' ... git push --force ... EOF`) is data, not
# an invocation, and must not trip the guard.
cmd=$(printf '%s\n' "$cmd" | awk '
  skip { if ($0 == marker) skip=0; next }
  {
    if (match($0, /<<-?[[:space:]]*'"'"'?[A-Za-z_][A-Za-z0-9_]*'"'"'?/)) {
      m = substr($0, RSTART, RLENGTH)
      sub(/^<<-?[[:space:]]*/, "", m); gsub(/'"'"'/, "", m)
      marker = m; skip = 1
    }
    print
  }')

# Evaluate each shell segment on its own so an unrelated `rm -f` later in a
# chained command cannot be mistaken for `git push -f`.
segments=$(printf '%s\n' "$cmd" | sed -E 's/(\|\||&&|[;&|])/\n/g')

while IFS= read -r seg; do
  [ -n "$seg" ] || continue
  # Drop the global options that carry a value (`git -C <dir> push`, `git -c k=v
  # commit`) so the subcommand sits directly after `git`.
  seg=$(printf '%s' "$seg" | sed -E 's/(^|[[:space:]])-(C|c)[[:space:]]+[^[:space:]]+//g')
  # Strip whatever can legitimately precede a command: subshell/substitution
  # openers and leading whitespace. What remains must START with git, so a
  # mere mention of the command as an argument is not treated as running it.
  seg=$(printf '%s' "$seg" | sed -E 's/^[[:space:]]*(\$\(|\(|`)*[[:space:]]*//; s/[[:space:]]*(\)|`)+[[:space:]]*$//')
  # Quoting must not hide an argument: `git push origin '+main:main'` slipped the
  # refspec rule because the quote sat where a space was expected.
  seg=$(printf '%s' "$seg" | tr -d "'\"")
  has() { printf '%s' "$seg" | grep -Eq "$1"; }
  git_sub() { # <subcommand> — true when the segment actually invokes it
    # A `NAME=value` prefix is still a git invocation: `GIT_DIR=.git git push
    # --force` ran unguarded before this alternative existed.
    has "^(([A-Za-z_][A-Za-z0-9_]*=[^[:space:]]*|sudo|env|command|nice|time)[[:space:]]+)*git([[:space:]]+-[^[:space:]]+)*[[:space:]]+$1([[:space:]]|\$)"
  }

  if git_sub push; then
    # `-f` may arrive bundled: `git push -fu origin main` is a force-push that
    # a standalone-token match never saw.
    has '(^|[[:space:]])(--force|--force-with-lease|--force-if-includes)([=[:space:]]|$)|(^|[[:space:]])-[A-Za-z]*f[A-Za-z]*([=[:space:]]|$)' &&
      decide deny 'Force-push is off-limits (AGENTS.md: additive commits, no history rewrite). Push without --force, or have the user do it.'
    has '(^|[[:space:]])(--mirror|--prune)([=[:space:]]|$)' &&
      decide ask 'git push --mirror/--prune can delete remote refs.'
    has '(^|[[:space:]])(--delete|-d)([=[:space:]]|$)' &&
      decide ask 'This deletes a remote branch.'
    has '[[:space:]]\+[^[:space:]]+:' &&
      decide ask 'A refspec starting with + is a forced update.'
    # `git push origin :feature` deletes the remote branch and was matched by
    # nothing: the rule above only looked for a leading +.
    has '[[:space:]]:[^[:space:]]+' &&
      decide ask 'An empty source refspec (:branch) deletes a remote branch.'
  fi

  if git_sub commit && has '(^|[[:space:]])--amend([=[:space:]]|$)'; then
    decide deny 'git commit --amend rewrites history (AGENTS.md: additive commits only).'
  fi
done <<EOF
$segments
EOF

exit 0
