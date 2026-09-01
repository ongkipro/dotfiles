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
  local c t=""
  command -v timeout >/dev/null 2>&1 && t="timeout 10"
  local -a cands=("$HOME/.local/share/mise/shims/node")
  while IFS= read -r c; do [ -n "$c" ] && cands+=("$c"); done < <(
    find "$HOME/.local/share/mise/installs/node" -mindepth 3 -maxdepth 3 \
         -name node -type f 2>/dev/null | sort -Vr)
  for c in "${cands[@]}"; do
    [ -x "$c" ] || continue
    $t "$c" --version >/dev/null 2>&1 && { dirname "$c"; return 0; }
  done
}

# Directories every owned command needs on PATH but a non-interactive shell has
# not been given: ~/.agents/bin holds the skill-* commands, and Homebrew is not
# on a stock macOS non-login PATH.
toolchain_export_path() {
  local node_bin
  export PATH="$HOME/.local/bin:$HOME/.agents/bin:$HOME/.local/share/mise/shims:/opt/homebrew/bin:/usr/local/bin:$PATH"
  node_bin="$(toolchain_pick_node)"
  [ -n "$node_bin" ] && export PATH="$node_bin:$PATH"
}
