# Sourced, never executed. One definition of where this machine's runtimes are,
# because there were three and they drifted: the bash copies picked different
# node versions from each other, and ai-doctor had no copy at all — so a dangling
# mise shim took out ai-learn and ai-memory-check on macOS while device-verify
# beside it resolved node correctly.
#
# Order is deliberate: the shim resolves the version mise is configured to use,
# installs are the fallback newest-first, and a candidate is only accepted if it
# actually answers --version. On 2026-09-01 the Mac's shim was dangling and mise
# could not repair it, because it wanted GitHub for a version lookup and GitHub
# had rate-limited it to 0/60.
toolchain_pick_node() {
  # Reuse an answer already found in this process tree. The probe runs a real
  # binary, and on macOS the failing shim can drag mise into a rate-limited
  # network lookup before it gives up — a per-invocation cost that turned a
  # 226-second self-test into 1031 seconds because every child re-probed.
  if [ -n "${TOOLCHAIN_NODE_BIN:-}" ] && [ -x "${TOOLCHAIN_NODE_BIN}/node" ]; then
    printf '%s\n' "$TOOLCHAIN_NODE_BIN"
    return 0
  fi
  local c timeout_bin="" perl_bin=""
  timeout_bin="$(command -v timeout 2>/dev/null || command -v gtimeout 2>/dev/null || true)"
  [ -n "$timeout_bin" ] || perl_bin="$(command -v perl 2>/dev/null || true)"
  local -a cands=("$HOME/.local/share/mise/shims/node")
  while IFS= read -r c; do [ -n "$c" ] && cands+=("$c"); done < <(
    find "$HOME/.local/share/mise/installs/node" -mindepth 3 -maxdepth 3 \
         -name node -type f 2>/dev/null | sort -Vr)
  # Probe under a SCRATCH HOME, because that is how the shim gets used. mise
  # resolves its tool versions from configuration under $HOME, so a shim that
  # answers fine here stops being valid inside any test that isolates HOME —
  # which is how ai-learn-test kept failing on macOS while ai-memory-check ran
  # perfectly when invoked directly. A candidate that only works in comfortable
  # conditions is not the one to pin.
  local probe_home="${TMPDIR:-/tmp}/toolchain-probe.$$"
  mkdir -p "$probe_home" 2>/dev/null
  for c in "${cands[@]}"; do
    [ -x "$c" ] || continue
    # `alarm; exec` is not a macOS timeout: exec replaces Perl and drops the
    # alarm. Keep Perl as the parent so it can terminate and reap a wedged mise
    # shim, then fall through to an installed Node binary.
    if {
      if [ -n "$timeout_bin" ]; then
        HOME="$probe_home" "$timeout_bin" 10 "$c" --version
      elif [ -n "$perl_bin" ]; then
        HOME="$probe_home" "$perl_bin" -e '
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
        ' 10 "$c" --version
      else
        HOME="$probe_home" "$c" --version
      fi
    } >/dev/null 2>&1; then
      rmdir "$probe_home" 2>/dev/null
      dirname "$c"; return 0
    fi
  done
  rmdir "$probe_home" 2>/dev/null
}

# Directories every owned command needs on PATH but a non-interactive shell has
# not been given: ~/.agents/bin holds the skill-* commands, and Homebrew is not
# on a stock macOS non-login PATH.
toolchain_export_path() {
  local node_bin
  export PATH="$HOME/.local/bin:$HOME/.agents/bin:$HOME/.local/share/mise/shims:/opt/homebrew/bin:/usr/local/bin:$PATH"
  node_bin="$(toolchain_pick_node)"
  if [ -n "$node_bin" ]; then
    export PATH="$node_bin:$PATH"
    # Exported so children skip the probe entirely rather than repeating it.
    export TOOLCHAIN_NODE_BIN="$node_bin"
  fi
}
