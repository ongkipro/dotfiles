# Shopify Memory Aggregator — Playbook

Common aggregations and the exact moves to make.

## 1. Onboarding a new Shopify task

```bash
# 1) Refresh the index
~/.agents/local-skills/shopify-memory/scripts/scan.sh --quiet

# 2) Pull canonical memory into the prompt (selective)
#    Read these in order, stop when the user's task is fully scoped:
#      ~/.config/ai/memory/shopify.md       (global rules)
#      ~/.config/ai/memory/projects.md      (search `### <store-or-project>`)
#      ~/.config/claude-memory/<project>.md (auto-memory snapshot if present)
```

Then route:

| Task shape | Hand off to |
|---|---|
| Rewrite titles/descriptions/meta/collections/ALT/variants | `shopify-listing` |
| Apps, theme, extension, function, hydrogen, Polaris | `shopify-ai-toolkit-router` |
| SEO-only audit or build | `seo-website-builder` (load `references/SHOPIFY_SEO_PLAYBOOK.md`) |
| Content/copy only | `copywriting` (and `shopify-listing/references/copywriting.md`) |

## 2. Cross-store audit

```bash
~/.agents/local-skills/shopify-memory/scripts/scan.sh --json > /tmp/shopify-footprint.json
# Then in the prompt:
jq -r '.[] | "\(.name)\t\(.store)\t\(.brand)\t\(.stack)\t\(.status)"' /tmp/shopify-footprint.json
```

Produce `~/Documents/Shopify/_audits/<date>.md` with:

- Active projects count + names
- Stores (myshopify domains) + brand head
- Per-store: latest gotchas from `projects.md` / `claude-memory/`
- Open conflicts (e.g. two stores with the same handle pattern, brand policy drift)
- Recommended next action per store

## 3. Before-listing-check

Run before any bulk `productUpdate` campaign:

1. Confirm market/language/brand policy with the user (one question, don't guess).
2. Confirm token scope: `shopify store auth --store <store> --scopes write_products,write_files,read_products`.
3. Pull the last 5 lines of `<store>` block in `projects.md` for context.
4. Confirm SKUs of kept variants must stay unchanged.
5. Run a pilot on 1 product; checkpoint before batching.

## 4. Adding a new store / project to memory

After the project is live (deployed, has a myshopify domain):

1. Append a `### <project>` block to `~/.config/ai/memory/projects.md` with: path,
   stack, brand, store domain, deploy target, status, latest gotcha.
2. (Optional) Create `~/.config/claude-memory/<project>-shopify-store.md` for a
   detailed auto-memory snapshot.
3. If SEO is in scope, link to the matching `seo-website-builder` playbooks.
4. Re-run `scan.sh` to confirm the index picks it up.

## 5. Conflict resolution

- Two stores with overlapping handles → standardize handle patterns per
  `seo-website-builder/references/SHOPIFY_SEO_PLAYBOOK.md`; use a per-store prefix.
- Brand policy drift between stores → keep `~/.config/ai/memory/shopify.md` as the
  global default, override per-store in `projects.md` block.
- macOS-only or Linux-only paths → note machine in `projects.md`; do not invent
  local copies.

## 6. Token-safe patterns

- Prefer `scan.sh --json` then `jq` over dumping the full table.
- Read `projects.md` with `grep -nE "^### <name>" -A 25` instead of `cat`.
- Load `claude-memory/<project>.md` only for the project in scope.
- Skip memory files that don't match the active task; never blanket-read all of
  `~/.config/ai/memory/`.

## 7. When the answer is "I don't know"

If a fact is missing or stale in memory, say so explicitly and propose the
edit — do not invent. After user confirms, update the canonical file (which is
symlinked to the dotfiles repo, so `dotsync sync` will commit it later).