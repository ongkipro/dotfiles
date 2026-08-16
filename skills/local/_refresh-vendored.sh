#!/usr/bin/env bash
# Refresh vendored Agent Skills (single-source dotfiles contract: no plugins).
#
# Any skill dir under ~/dotfiles/skills/local/<name>/ that contains a
# `.local-fork` ledger is a managed fork. Refresh reports and preserves the
# entire directory without fetching or writing. Otherwise, a `.source` file
# marks a vendored upstream: every existing file is re-fetched byte-for-byte,
# with index drift reported when the source provides an index.
#
# A skill whose `.source` declares `split_of:` is also handled specially — see
# "Split skills" below. Those are verified, never overwritten.
#
# Usage:
#   _refresh-vendored.sh            # refresh every vendored skill
#   _refresh-vendored.sh stripe-best-practices   # just one
#
# Exit status is non-zero if any split skill no longer reassembles to upstream,
# so this is usable as a check and not only as a fetch.
#
# After running: review `git diff` in ~/dotfiles, then commit via lazygit.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TODAY="$(date +%Y-%m-%d)"
DRIFT=0
SPLIT_TMPS=""
trap 'rm -f $SPLIT_TMPS' EXIT

# --- Split skills -------------------------------------------------------------
# One upstream file that we store as several local files. The plain path above
# would destroy such a skill: it fetches base/<rel> per local file, so it pulls
# the monolith back over our first part and 404s on parts upstream has no path
# for.
#
# Re-splitting automatically is the wrong fix. Where to cut is an editorial
# judgement, and a script that guesses it would silently mangle a working skill
# the first time upstream reorganised. What actually has to be prevented is
# missing an upstream change, so this verifies instead: reassemble the parts,
# compare to upstream, and report. It never writes.
#
# `.source` declares the shape, e.g.
#   split_of: SKILL.md
#   part: SKILL.md trim-tail 10
#   part: references/bindings-cli-reference.md trim-head 7
#
# The trims describe our own additions — a pointer stub, a reference header —
# not upstream's structure. Upstream can grow without invalidating them, which
# is why they are counts of local text rather than line ranges into upstream.
verify_split() {
  local dir="$1" name="$2" base="$3" upstream_rel="$4"
  # Script-scoped rather than local, with a single EXIT trap: a RETURN trap is
  # not scoped to the function that sets it, so it fires again on a later
  # return with the names already out of scope.
  tmp="$(mktemp)"; asm="$(mktemp)"
  SPLIT_TMPS="$SPLIT_TMPS $tmp $asm"

  if ! curl -fsSL "$base/$upstream_rel" -o "$tmp"; then
    echo "   !! fetch failed: $base/$upstream_rel"; DRIFT=1; return 0
  fi

  local rel head tail missing=0
  while read -r rel head tail; do
    [ -n "$rel" ] || continue
    if [ ! -f "$dir/$rel" ]; then
      echo "   !! declared part is missing: $rel"; missing=1; continue
    fi
    # tail -n +N is 1-indexed, so skipping H lines starts at H+1. Dropping the
    # last T lines is done by counting rather than `head -n -T`, which is a GNU
    # extension BSD head on macOS does not have.
    local total keep
    total="$(wc -l <"$dir/$rel")"
    keep=$((total - head - tail))
    [ "$keep" -gt 0 ] || { echo "   !! trims exceed the file: $rel"; missing=1; continue; }
    tail -n "+$((head + 1))" "$dir/$rel" | head -n "$keep" >>"$asm"
  done < <(sed -n 's/^part: //p' "$dir/.source" | awk '
    { h=0; t=0
      for (i=2; i<NF; i++) {
        if ($i == "trim-head") h=$(i+1)
        if ($i == "trim-tail") t=$(i+1)
      }
      print $1, h, t }')

  if [ "$missing" = 1 ]; then DRIFT=1; return 0; fi

  if cmp -s "$tmp" "$asm"; then
    echo "   split verified: parts reassemble to upstream $upstream_rel exactly"
    echo "   done (up-to-date)"
  else
    DRIFT=1
    echo "   !! upstream changed — the parts no longer reassemble to $upstream_rel"
    echo "      upstream $(wc -l <"$tmp") lines, reassembled $(wc -l <"$asm") lines"
    echo "      re-split by hand, then update the trim counts in .source:"
    diff "$tmp" "$asm" | head -20 | sed 's/^/      /'
  fi
}

refresh_one() {
  local dir="$1" name; name="$(basename "$dir")"
  if [ -f "$dir/.local-fork" ]; then
    echo "skip $name (managed local fork)"
    return 0
  fi
  [ -f "$dir/.source" ] || { echo "skip $name (no .source — not vendored)"; return 0; }

  local base index split_of
  base="$(sed -n 's/^source: //p'  "$dir/.source" | head -1)"
  index="$(sed -n 's/^index: //p'   "$dir/.source" | head -1)"
  split_of="$(sed -n 's/^split_of: //p' "$dir/.source" | head -1)"
  [ -n "$base" ] || { echo "!! $name: no source: in .source"; return 1; }

  echo "== $name  <-  $base"

  if [ -n "$split_of" ]; then
    verify_split "$dir" "$name" "$base" "$split_of"
    return 0
  fi
  local changed=0 f rel url
  # Re-fetch every file we already vendor (SKILL.md + references/*), preserving layout.
  while IFS= read -r f; do
    rel="${f#"$dir"/}"
    [ "$rel" = ".source" ] && continue
    url="$base/$rel"
    if curl -fsSL "$url" -o "$f.tmp"; then
      if cmp -s "$f" "$f.tmp"; then rm -f "$f.tmp";
      else mv "$f.tmp" "$f"; echo "   updated: $rel"; changed=1; fi
    else
      rm -f "$f.tmp"; echo "   !! fetch failed (gone upstream?): $rel"
    fi
  done < <(find "$dir" -type f ! -name '.source' | sort)

  # Drift check: does upstream's index list files we don't have?
  if [ -n "$index" ] && command -v jq >/dev/null 2>&1; then
    local want
    want="$(curl -fsSL "$index" 2>/dev/null \
      | jq -r --arg n "$name" '.skills[] | select(.name==$n) | .files[]' 2>/dev/null || true)"
    if [ -n "$want" ]; then
      while IFS= read -r rel; do
        [ -f "$dir/$rel" ] || echo "   ++ upstream added (not vendored): $rel"
      done <<< "$want"
    fi
  fi

  [ "$changed" = 1 ] && sed -i.bak "s/^vendored: .*/vendored: $TODAY/" "$dir/.source" && rm -f "$dir/.source.bak"
  echo "   done ($([ "$changed" = 1 ] && echo changed || echo up-to-date))"
}

if [ "${1:-}" != "" ]; then
  refresh_one "$ROOT/$1"
else
  for d in "$ROOT"/*/; do
    if [ -f "$d/.source" ] || [ -f "$d/.local-fork" ]; then
      refresh_one "${d%/}"
    fi
  done
fi

echo
echo "Review changes:  git -C \"$(cd "$ROOT/../.." && pwd)\" diff"
echo "Then commit via lazygit (lg)."

# A split skill that no longer reassembles is the one failure this script can
# detect but not repair, so it has to leave a trace something else can act on.
[ "$DRIFT" = 0 ] || { echo; echo "!! a split skill needs a manual re-split (see above)"; exit 1; }
