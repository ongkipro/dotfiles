#!/usr/bin/env bash
# shopify-memory scan: walk known project roots, detect Shopify footprint, emit table + JSON.
# Idempotent. Safe to re-run. Read-only — never modifies memory.
set -euo pipefail

JSON=0
PROJECT_FILTER=""
QUIET=0
EXTRA_ROOTS=()

while [ $# -gt 0 ]; do
  case "$1" in
    --json) JSON=1 ;;
    --project) PROJECT_FILTER="${2:-}"; shift ;;
    --root) EXTRA_ROOTS+=("${2:-}"); shift ;;
    --quiet) QUIET=1 ;;
    -h|--help)
      cat <<EOF
Usage: scan.sh [--json] [--project <name>] [--root <path>]... [--quiet]
  --json         emit machine-readable JSON instead of table
  --project      filter to projects matching <name> (case-insensitive substring)
  --root         add an extra project root to scan (repeatable)
  --quiet        suppress header / footer
EOF
      exit 0 ;;
    *) echo "Unknown flag: $1" >&2; exit 2 ;;
  esac
  shift
done

# ── Known roots ───────────────────────────────────────────────────────────────
ROOTS=(
  "$HOME/Projects"
  "$HOME/projects"
  "/home/fantastico/Projects"
  "/home/fantastico/projects"
)
ROOTS+=("${EXTRA_ROOTS[@]}")

# ── Helpers ───────────────────────────────────────────────────────────────────
say() { [ "$QUIET" -eq 1 ] || printf '%s\n' "$*"; }

# Detect Shopify markers in a project directory.
# Args: <project-dir>
# Output: <kind>\t<store>\t<brand>\t<stack>\t<status>  (tab-separated, 5 fields)
detect_shopify() {
  local p="$1"
  [ -d "$p" ] || return 0

  local kind="" store="" brand="" stack="" status=""
  local pkg="$p/package.json"
  local astro="$p/astro.config.mjs"
  local toml_app="$p/shopify.app.toml"
  local theme_liquid="$p/layout/theme.liquid"
  local settings_schema="$p/config/settings_schema.json"
  local wrangler="$p/wrangler.toml"

  # Kind + stack from file presence + package.json deps
  if [ -f "$toml_app" ]; then
    kind="app"
    stack="Shopify CLI app"
  elif [ -f "$theme_liquid" ] || [ -f "$settings_schema" ]; then
    kind="theme"
    stack="Liquid theme"
  elif [ -f "$pkg" ] && grep -qE '"@shopify/' "$pkg" 2>/dev/null; then
    if [ -f "$astro" ]; then
      kind="headless-storefront"
      stack="Astro + Shopify"
    elif grep -qE '"@shopify/cli"|"@shopify/app"' "$pkg" 2>/dev/null; then
      kind="app"
      stack="Shopify CLI app"
    elif grep -qE '"@shopify/storefront-api-client"|"shopify-buy"' "$pkg" 2>/dev/null; then
      kind="headless-storefront"
      stack="Storefront API client"
    else
      kind="shopify-touching"
      stack="Shopify lib"
    fi
  elif [ -f "$astro" ] && grep -qE '@astrojs/shopify' "$pkg" 2>/dev/null; then
    kind="headless-storefront"
    stack="Astro + Shopify"
  fi

  # Not a Shopify project — skip in non-filter mode
  if [ -z "$kind" ]; then
    printf 'other\t\t\t%s\t\n' "$( [ -d "$p/.git" ] && echo git || echo no-git )"
    return 0
  fi

  # Store domain: from .env*, README, or shopify.app.toml
  store=$( { grep -hoE '[a-z0-9-]+\.myshopify\.com' "$p/.env" "$p/.env.local" "$p/.env.example" "$p/README.md" "$p/shopify.app.toml" 2>/dev/null || true; } \
    | head -1 || true)

  # Brand guess: from <title> in HEAD of index.html, or package.json description
  if [ -f "$p/index.html" ]; then
    brand=$( { grep -ioE '<title>[^<]+</title>' "$p/index.html" 2>/dev/null || true; } \
      | head -1 | sed -E 's@</?title>@@g')
  fi
  if [ -z "$brand" ] && [ -f "$pkg" ]; then
    brand=$(python3 -c "
import json
try:
  d=json.load(open('$pkg'))
  print(d.get('description','') or d.get('name',''))
except Exception: pass
" 2>/dev/null | head -1 || true)
  fi

  # Deploy hint
  if [ -f "$wrangler" ]; then
    status="cloudflare"
  elif grep -qE '"next"' "$pkg" 2>/dev/null && grep -qE '"vercel"' "$pkg" 2>/dev/null; then
    status="vercel"
  else
    status="local"
  fi

  printf '%s\t%s\t%s\t%s\t%s\n' "$kind" "$store" "$brand" "$stack" "$status"
}

# ── Scan ──────────────────────────────────────────────────────────────────────
[ "$QUIET" -eq 1 ] || say "shopify-memory scan — $(date -Iseconds)"
[ "$QUIET" -eq 1 ] || say "Roots: ${ROOTS[*]}"
[ "$QUIET" -eq 1 ] || say ""

json_rows=()
found_any=0
for root in "${ROOTS[@]}"; do
  [ -d "$root" ] || continue
  while IFS= read -r -d '' proj; do
    name=$(basename "$proj")
    [ -n "$PROJECT_FILTER" ] && [[ "${name,,}" != *"${PROJECT_FILTER,,}"* ]] && continue

    # Use awk to split on tab — preserves empty fields (bash read collapses them).
    mapfile -t FIELDS < <(detect_shopify "$proj" | head -1 | awk -F'\t' '{for(i=1;i<=NF;i++) print $i}')
    kind="${FIELDS[0]:-}"
    store="${FIELDS[1]:-}"
    brand="${FIELDS[2]:-}"
    stack="${FIELDS[3]:-}"
    status="${FIELDS[4]:-}"

    [ "$kind" = "other" ] && [ -z "$PROJECT_FILTER" ] && continue   # hide non-Shopify unless filtered
    found_any=1

    # Last activity
    last=$(git -C "$proj" log -1 --format=%cs 2>/dev/null || stat -c %y "$proj" 2>/dev/null | cut -d' ' -f1)
    [ -z "$last" ] && last="—"

    if [ "$JSON" -eq 1 ]; then
      json_rows+=("$(printf '{"name":"%s","path":"%s","kind":"%s","store":"%s","brand":"%s","stack":"%s","status":"%s","last":"%s"}' \
        "$name" "$proj" "$kind" "$store" "$brand" "$stack" "$status" "$last")")
    else
      printf '%-22s %-13s %-30s %-22s %-22s %-10s %s\n' \
        "$name" "$kind" "${store:-—}" "${brand:-—}" "${stack:-—}" "$status" "$last"
    fi
  done < <(find "$root" -maxdepth 2 -mindepth 1 -type d \( -name node_modules -o -name .git -o -name dist -o -name .next -o -name .astro -o -name .vercel \) -prune -o -type d -print0 2>/dev/null)
done

if [ "$JSON" -eq 1 ]; then
  printf '['
  for i in "${!json_rows[@]}"; do
    [ "$i" -gt 0 ] && printf ','
    printf '%s' "${json_rows[$i]}"
  done
  printf ']\n'
else
  [ "$found_any" -eq 0 ] && say "(no Shopify projects found)"
fi

[ "$QUIET" -eq 1 ] || say ""
[ "$QUIET" -eq 1 ] || say "Tip: pair with shopify-listing (ops) or shopify-ai-toolkit-router (dev)."