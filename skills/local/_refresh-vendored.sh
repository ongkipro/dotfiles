#!/usr/bin/env bash
# Refresh vendored Agent Skills (single-source dotfiles contract: no plugins).
#
# Any skill dir under ~/dotfiles/skills/local/<name>/ that contains a `.source`
# file is treated as vendored-from-upstream. This re-fetches every file already
# present in that dir from its recorded `source:` base, byte-for-byte, and warns
# if upstream's index now lists files we don't have (drift).
#
# Usage:
#   _refresh-vendored.sh            # refresh every vendored skill
#   _refresh-vendored.sh stripe-best-practices   # just one
#
# After running: review `git diff` in ~/dotfiles, then commit via lazygit.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TODAY="$(date +%Y-%m-%d)"

refresh_one() {
  local dir="$1" name; name="$(basename "$dir")"
  [ -f "$dir/.source" ] || { echo "skip $name (no .source — not vendored)"; return 0; }

  local base index
  base="$(sed -n 's/^source: //p'  "$dir/.source" | head -1)"
  index="$(sed -n 's/^index: //p'   "$dir/.source" | head -1)"
  [ -n "$base" ] || { echo "!! $name: no source: in .source"; return 1; }

  echo "== $name  <-  $base"
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
  for d in "$ROOT"/*/; do [ -f "$d/.source" ] && refresh_one "${d%/}"; done
fi

echo
echo "Review changes:  git -C \"$(cd "$ROOT/../.." && pwd)\" diff"
echo "Then commit via lazygit (lg)."
