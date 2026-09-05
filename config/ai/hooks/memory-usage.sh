#!/usr/bin/env bash
# memory-usage — UserPromptSubmit hook. Feeds the memory learning loop.
#
# `ai-memory-access` routes the smallest useful set of durable memory for a
# request AND records which files were selected, privacy-minimally: paths and
# byte counts only, never the prompt, never a prompt hash, never file contents.
# `ai-memory-lifecycle` then turns that record into retention and merge advice.
#
# Without a caller none of that ever runs. AGENTS.md asks the model to consult
# memory, but an instruction is not a mechanism: as of 2026-08-16 the telemetry
# directory had never been created on this machine, so every tool downstream of
# it was advising from an empty set. This hook is the missing caller.
#
# FAIL-OPEN, deliberately, and the opposite of git-guard. That hook is a safety
# control, so it fails closed and asks when it cannot run. This one is
# observability: it must never block, delay, or interfere with a turn. Every
# failure path exits 0 silently.
set -u

# Never let telemetry cost a turn. The router is bounded (3 files, 12KB) but a
# wedged filesystem or a slow disk must not be felt by the user.
TIMEOUT_SECONDS=5

# Bound EVERY external command, not just the router. Until 2026-08-17 the two
# JSON readers ran unbounded, which made the promise above conditional on them:
# on a device where jq resolves through a version-manager shim, a shim that
# cannot find its installation falls back to the network and stalls for tens of
# seconds. This hook runs on every prompt in five CLIs, so that is a stalled
# turn. memory-usage-hook-test reproduces it — it isolates HOME, which is
# exactly what strands such a shim.
# `timeout` is GNU and absent from stock macOS, so this function was named
# `bounded` while running every command with no bound at all on exactly the
# platform where nobody would notice. On 2026-09-01 that turned a stall in the
# routing path into a hang that ran for 17 minutes inside device-verify and
# never ended. Perl ships with macOS and its alarm gives a real bound with no
# new dependency; an unbounded fallback now says so rather than pretending.
TIMEOUT_BIN=$(command -v timeout 2>/dev/null) || TIMEOUT_BIN=""
[ -n "$TIMEOUT_BIN" ] || TIMEOUT_BIN=$(command -v gtimeout 2>/dev/null) || TIMEOUT_BIN=""
PERL_BIN=""
[ -n "$TIMEOUT_BIN" ] || PERL_BIN=$(command -v perl 2>/dev/null) || PERL_BIN=""
bounded() {
  if [ -n "$TIMEOUT_BIN" ]; then
    "$TIMEOUT_BIN" "$TIMEOUT_SECONDS" "$@"
  elif [ -n "$PERL_BIN" ]; then
    # `alarm; exec` looks tempting, but exec replaces Perl and drops the alarm
    # on macOS. Keep Perl as the parent so it can terminate and reap the child.
    "$PERL_BIN" -e '
      my $seconds = shift;
      my $pid = fork;
      exit 127 unless defined $pid;
      if ($pid == 0) { setpgrp(0, 0); exec @ARGV; exit 127 }
      use POSIX qw(WNOHANG);
      sub wait_until {
        my ($child, $deadline) = @_;
        while (time < $deadline) {
          my $done = waitpid($child, WNOHANG);
          return $done if $done == $child;
          select undef, undef, undef, 0.1;
        }
        return 0;
      }
      my $done = wait_until($pid, time + $seconds);
      exit($? >> 8) if $done == $pid;
      kill "TERM", -$pid;
      $done = wait_until($pid, time + 2);
      kill "KILL", -$pid if $done != $pid;
      waitpid $pid, 0 if $done != $pid;
      exit 124;
    ' "$TIMEOUT_SECONDS" "$@"
  else
    echo "memory-usage hook: no timeout available; running unbounded" >&2
    "$@"
  fi
}

payload=$(cat) || exit 0
[ -n "$payload" ] || exit 0

access="$HOME/.local/bin/ai-memory-access"
[ -x "$access" ] || access="$HOME/dotfiles/bin/ai-memory-access"
[ -x "$access" ] || exit 0

# Read the prompt with jq if present, python3 otherwise — the same two-reader
# pattern git-guard uses, minus the fail-closed branch.
prompt=""
if command -v jq >/dev/null 2>&1; then
  prompt=$(printf '%s' "$payload" | bounded jq -r '.prompt // ""' 2>/dev/null) || prompt=""
fi
if [ -z "$prompt" ] && command -v python3 >/dev/null 2>&1; then
  prompt=$(printf '%s' "$payload" | bounded python3 -c 'import json,sys
try: print(json.load(sys.stdin).get("prompt","") or "")
except Exception: pass' 2>/dev/null) || prompt=""
fi
[ -n "$prompt" ] || exit 0

# A very long prompt adds nothing to routing — triggers are keyword-shaped — and
# argv has limits. The router only ever sees this truncated copy, and does not
# store it either way.
prompt=${prompt:0:2000}

# A prompt is data, never a flag. `ai-memory-access` takes the query as an
# argparse positional, so a user whose whole message is `-h` had argparse match
# the help flag and dump its full usage block into this hook's stdout — straight
# into the turn. Other flag-shaped prompts hit "arguments are required" instead
# and silently lost routing for that turn. A leading space fixes both: argparse
# sees a positional, and the router normalizes whitespace before matching, so
# routing is unaffected.
case "$prompt" in -*) prompt=" $prompt" ;; esac

cwd=$(pwd 2>/dev/null) || cwd=""
repo=""
if [ -n "$cwd" ] && command -v git >/dev/null 2>&1; then
  repo=$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null) || repo=""
fi

if [ -n "$repo" ]; then
  bounded "$access" "$prompt" --repo "$repo" 2>/dev/null || exit 0
else
  bounded "$access" "$prompt" 2>/dev/null || exit 0
fi

exit 0
