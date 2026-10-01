# Liquid Themes (Online Store 2.0)

Hosted Shopify theme work: Liquid, JSON templates, sections, blocks, locales,
theme editor, and Shopify CLI. Limits, flags, and schema keys change; verify
against the installed Shopify CLI version and shopify.dev before relying on a
number or flag below.

## Shopify CLI workflow

Run the CLI through the project's pinned version (`npx --no-install shopify`
or the package script).

| Step | Command | Notes |
|---|---|---|
| Local preview | `shopify theme dev --store <store>` | Uploads to a development theme and serves a hot-reloading preview at `127.0.0.1:9292`. Checkout cannot be previewed. `--theme-editor-sync` writes editor changes back to local files. |
| Lint | `shopify theme check` | Run before every push and in CI; fix errors, triage warnings. |
| Pull merchant edits | `shopify theme pull --only templates/*.json --only config/settings_data.json` (scope to need) | Merchants edit JSON templates and settings in the editor; pull before changing them or you overwrite their work. |
| Stage | `shopify theme push --unpublished` or `--theme <id>` | Push to an unpublished/preview theme and share its preview link. |
| Live | `shopify theme push --live` (plus `--allow-live` in non-interactive runs) or `shopify theme publish` | **Approval-gated production action.** Never run without the user's explicit approval for that exact target. |

Push guardrails: prefer `--only` for scoped changes, use `--nodelete` when the
remote may hold files you did not author, and never `--ignore` your way past a
conflict in `templates/*.json` or `config/settings_data.json`.

## Theme architecture

- **JSON templates** (`templates/*.json`) list section instances in `sections`
  and their render `order`; optional `layout` and `wrapper`. Merchants own their
  contents after launch. Current cap: 25 sections per template, 50 blocks per
  section.
- **Section groups** (header/footer JSON in `sections/*.json`) hold
  merchant-composed global areas.
- **Sections** (`sections/*.liquid`) carry exactly one `{% schema %}` tag of
  valid JSON, not nested inside other Liquid. Key fields: `name`, `tag`,
  `class`, `limit`, `settings`, `blocks`, `max_blocks`, `presets`, `default`,
  `locales`, `enabled_on`/`disabled_on`. A section without `presets` cannot be
  added from the editor to JSON templates.
- **Blocks**: section-local blocks are defined in the schema; theme blocks live
  in `blocks/*.liquid` and are reusable across sections (referenced with
  `{"type": "@theme"}`). Add `{"type": "@app"}` to a section's `blocks` so
  merchants can insert **app blocks** from theme app extensions without code
  edits. Render app blocks with `{% render block %}` and never assume their
  markup or settings.
- **Settings**: read `section.settings` / `block.settings`; every setting may be
  blank, so render a sensible empty state. Use `block.shopify_attributes` on the
  block wrapper so the editor can select it.
- **Snippets** (`snippets/*.liquid`) via `{% render %}` (isolated scope); never
  the deprecated `{% include %}`.

## Locales

- `locales/<lang>.json` holds storefront strings (merchant-editable in the
  language editor); `locales/<lang>.schema.json` translates editor labels.
  Exactly one default file, e.g. `en.default.json` (and
  `en.default.schema.json`).
- Read strings with `{{ 'group.key' | t }}`, using interpolation arguments and
  `count` for plurals instead of string concatenation. Never hardcode visible
  copy in Liquid or JavaScript.
- Section-scoped strings can live in the schema `locales` object.
- Build Ajax/Section Rendering URLs from `window.Shopify.routes.root` so Markets
  and language prefixes survive.

## Theme editor integration

The editor re-renders sections in place, so page-load JavaScript does not run
again. Use custom elements (connected/disconnected callbacks) or listen for:

- `shopify:section:load` (re-initialize) and `shopify:section:unload` (remove
  listeners, observers, timers);
- `shopify:section:select`/`deselect`, `shopify:section:reorder`;
- `shopify:block:select`/`deselect` (for example, move a slider to the block);
- `Shopify.designMode` is `true` only inside the editor; use it to disable
  autoplay, popups, and analytics there.

## Section Rendering API

Fetch re-rendered section HTML instead of building markup in JavaScript:
`?sections=a,b` returns JSON keyed by section ID (current limit: five sections
per request); `?section_id=a` returns the HTML directly. Cart Ajax endpoints
accept a `sections` parameter for bundled rendering, so add/change/update
returns fresh cart drawer and count HTML in the same response. A failed section
comes back as `null`; keep the previous DOM and show an error instead of
emptying the region. Replace by parsing with `DOMParser`, never regex.

## Starting from or tracking Dawn

New Theme Store submissions currently start from Skeleton (see
`shopify-boundaries.md`). For a client theme built on Dawn:

1. Keep Dawn as a git `upstream` remote; record the Dawn version the fork is
   based on.
2. Isolate customizations: new sections/snippets/blocks and a project CSS/JS
   file over editing core files; when a core file must change, keep the diff
   small and comment why.
3. Merge upstream on a branch (`git fetch upstream` then merge the tagged
   release), resolve conflicts, run `shopify theme check`, preview with
   `theme dev`, and compare key templates in the browser.
4. Never merge upstream `templates/*.json` or `config/settings_data.json` over
   the live store's versions; pull the live JSON first and keep merchant data.
5. Ship through an unpublished theme for review; publishing stays
   approval-gated.

## Source notes

Verified 2026-10-02:
- CLI: https://shopify.dev/docs/api/shopify-cli/theme/theme-dev and
  https://shopify.dev/docs/api/shopify-cli/theme/theme-push (`--allow-live`
  required in non-interactive runs targeting the live theme).
- Section schema, `@app`/`@theme` blocks, single schema tag:
  https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema
- JSON template limits:
  https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates
- Locale file naming and default file:
  https://shopify.dev/docs/storefronts/themes/architecture/locales
- Editor events and `Shopify.designMode`:
  https://shopify.dev/docs/storefronts/themes/architecture/sections/integrate-sections-with-the-theme-editor
- Section Rendering API (five-section limit, `null` on failure):
  https://shopify.dev/docs/api/ajax/section-rendering
- Dawn upstream sync: https://github.com/Shopify/dawn (README)

Not independently re-verified today: `--nodelete`/`--only` behavior details
beyond flag names, presets requirement for adding sections, and `count`
pluralization syntax; confirm in shopify.dev before relying on them.
