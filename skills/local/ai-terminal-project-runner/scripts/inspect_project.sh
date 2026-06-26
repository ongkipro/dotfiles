#!/usr/bin/env bash
set -euo pipefail

printf '== Project Inspection ==\n'
printf 'PWD: %s\n' "$(pwd)"

printf '\n== Git ==\n'
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  printf 'Repo root: %s\n' "$(git rev-parse --show-toplevel)"
  git status --short
else
  printf 'Not a git repo\n'
fi

printf '\n== Important markers (depth 3) ==\n'
if command -v fd >/dev/null 2>&1; then
  fd '^(AGENTS|CLAUDE)\.md$|package\.json|pnpm-lock\.yaml|package-lock\.json|yarn\.lock|bun\.lockb|deno\.(json|jsonc)|astro\.config\.|vite\.config\.|next\.config\.|wrangler\.(jsonc|toml)|shopify\..*toml|tsconfig\.json|vitest\.config\.|tailwind\.config\.' -H -t f -d 3 || true
else
  find . -maxdepth 3 -type f \( -name 'package.json' -o -name 'AGENTS.md' -o -name 'CLAUDE.md' -o -name 'wrangler.toml' -o -name 'wrangler.jsonc' -o -name 'astro.config.*' \) 2>/dev/null || true
fi

printf '\n== Package scripts ==\n'
if [ -f package.json ]; then
  if command -v node >/dev/null 2>&1; then
    node -e 'const p=require("./package.json"); for (const [k,v] of Object.entries(p.scripts||{})) console.log(`${k}: ${v}`)'
  else
    printf 'package.json present; node unavailable\n'
  fi
else
  printf 'No package.json in current directory\n'
fi

printf '\n== Framework hints ==\n'
if command -v rg >/dev/null 2>&1; then
  rg -n '"astro"|"vite"|"next"|"react"|"@shopify"|"wrangler"|"hono"|"drizzle"|"vitest"|tailwind' package.json wrangler.* astro.config.* vite.config.* tsconfig.json 2>/dev/null || true
else
  printf 'ripgrep unavailable\n'
fi

printf '\n== Env files present (names only; contents intentionally hidden) ==\n'
if command -v fd >/dev/null 2>&1; then
  fd '^\.env' -H -t f -d 3 || true
else
  find . -maxdepth 3 -type f -name '.env*' 2>/dev/null || true
fi
