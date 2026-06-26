# Project Inspection

Minimum scan:

```bash
pwd
git status --short 2>/dev/null || true
fd '^(AGENTS|CLAUDE)\.md$|package\.json|pnpm-lock\.yaml|package-lock\.json|yarn\.lock|bun\.lockb|astro\.config\.|vite\.config\.|wrangler\.(jsonc|toml)|shopify\..*toml|tsconfig\.json|vitest\.config\.' -H -t f -d 3
```

Read relevant files only. Avoid dumping large files and secrets.
