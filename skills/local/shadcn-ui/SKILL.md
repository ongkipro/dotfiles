---
name: shadcn-ui
description: >-
  Add, compose, and customize shadcn/ui components through the official CLI in React projects (Next.js, Vite, React Router, TanStack Start, Astro islands): components.json, registries, forms, data tables, charts. Not workflow, IA, or browser proof.
---

# shadcn/ui

Components are copied into the project as source. The CLI reads
`components.json` and generates code for *this* project, so the same command
yields different files elsewhere. Discover with the CLI; never recite
component APIs, registry items, or flags from memory.

**Minimum path for any task:** `shadcn info --json` → check installed →
`shadcn docs <component>` and read it → for anything missing, `add --dry-run`
then `add` and review the files → compose per §5 → `ui-validation`. Read §3 only when touching tokens,
§4 only when the project's `base` differs from the example you are adapting.

For a new screen or dashboard, component mapping comes **after** an accepted
screen and direction (`admin-product-ux` → `admin-dashboard` for admin,
`storefront-ux` for commerce, `design-taste` for public pages). A single form
or component inside an existing screen needs no new contract. A block never
chooses the workflow or the look. File upload, storage, and submit handlers
are the framework's and backend's; this skill maps the visible controls. Native semantics stay underneath; static Astro markup
is not hydrated for visual consistency
([admin-component-system.md](references/admin-component-system.md)). After a
visible change, `ui-validation`.

## 1. Project context first

Run the CLI through the project's package runner, chosen from
`packageManager`/lockfile: `npx shadcn@latest`, `pnpm dlx shadcn@latest`, or
`bunx --bun shadcn@latest`. Use only documented flags (`--help`); there is no
`--package-manager` flag. `ui-validation`'s ban on `npx`/`dlx` for QA tooling
does not apply to this code generator; do not extend the exception.

```bash
shadcn info --json      # framework, tailwindVersion, aliases, resolvedPaths, base, style, iconLibrary, isRSC, packageManager, installed components, preset
```

Use its fields, not folder names: `aliases` for import prefixes; `isRSC`
true ⇒ hooks/handlers/browser APIs need `"use client"`; `tailwindCssFile` is
the only CSS file to edit for tokens; `base` (`base` | `radix` | `aria`)
decides component APIs; `iconLibrary` decides icon imports (never assume
`lucide-react`); `packageManager` for any non-shadcn install.

`components.json` fields that silently change the answer: `style` (registry
variant; which items exist; immutable), `tailwind.config` (`""` = v4),
`tailwind.cssVariables` (`false` = no semantic tokens; immutable),
`tailwind.baseColor` (change only via `migrate base-color`),
`tailwind.prefix` (v4 form is `tw:flex`), `rsc`, `tsx`, `aliases`
(`tsconfig` paths or `package.json#imports`), `registries`.

## 2. Workflow

1. **Check installed components** in `info` / `resolvedPaths.ui` before
   `add`; do not import what is not installed or re-add what is.
2. **Find**: `shadcn search @shadcn -q <term>` (registry arg is `@name` or
   `owner/repo`; `list` is an alias). **Registry must be explicit** — if the
   user did not name one, ask; never default on their behalf.
3. **Read docs before writing**: `shadcn docs <component...>` returns doc,
   example, and API URLs — fetch them. `shadcn view <item>` for uninstalled
   registry metadata; `shadcn add <item> --dry-run | --diff [file] | --view
   [file]` for what would happen in this project.
4. **Install**: `shadcn add <items>`. `add` installs the npm and registry
   dependencies the item declares; `--dry-run` shows them (`table` declares
   none — `@tanstack/react-table` is yours). `--all` only for a design-system
   showcase app, never to "get everything".
5. **Review every added file**: missing sub-components, wrong composition,
   icons not from `iconLibrary`. Third-party registry items may hardcode
   `@/components/ui/...`; rewrite to the project's `ui` alias.
6. **Update** a customized component: `add <item> --dry-run`, then `--diff
   <file>` per file, merge by hand where local changes exist. `--overwrite`
   only with explicit user approval. Never fetch raw files from GitHub;
   `shadcn diff` is deprecated.
7. **Presets**: ask overwrite / partial / merge / skip first. Inspect with
   `preset resolve [--json]` (current) and `preset decode <code>` (incoming);
   never decode codes or build URLs by hand. Overwrite = `apply <code>`;
   partial = `apply <code> --only theme,font`; merge/skip = `init --preset
   <code> --force --no-reinstall` (merge then diffs each installed component).
   Run inside the project; codes do not encode the base, so pass `--base`
   in a scratch directory.

`init` (alias `create`): `--template next|vite|start|react-router|astro|laravel`,
`--base base|radix|aria`, `--preset <name|code|url>`, `--name`, `--monorepo`,
`--rtl`, `--pointer`, `--css-variables`, `--defaults` (= `--template=next
--preset=nova`). It installs `cn`, writes a one-line `lib/utils.ts`
(`export { cn } from "cn"`), and adds `@import "shadcn/tailwind.css"` to the
global CSS; `eject` inlines that import (irreversible). Migrations: `migrate
cn | icons | base-color | radix | rtl` (`migrate cn` needs Tailwind v4; v3
keeps `tailwind-merge` v2).

## 3. Tailwind v4 theming

- Tokens are raw `oklch()` on top-level `:root` and `.dark`, exposed through
  `@theme inline` (`--color-primary: var(--primary)`); keep them outside
  `@layer base`. New token = define in both, map in `@theme inline`, then use
  `bg-warning`.
- `--radius` seeds the whole radius scale (`--radius-sm … --radius-4xl`);
  change the seed, not individual radii.
- Dark mode: `@custom-variant dark (&:is(.dark *))` — one variant, not also
  the media strategy. No manual `dark:` color overrides in components.
- No `hsl(var(--token))` wrapper (v3 habit; produces an invalid color).
  Arbitrary CSS-variable utilities use parentheses: `fill-(--color-desktop)`.
- v3 projects (`tailwind.config` set) use `tailwind.config.js`; the rules
  above do not apply unchanged.

## 4. Base UI vs Radix — `base` decides the API

| Concern | Radix | Base UI |
|---|---|---|
| Custom trigger / close | `<DialogTrigger asChild><Button/></DialogTrigger>` | `<DialogTrigger render={<Button />}>` |
| Non-button element | `<Button asChild><a/></Button>` | `<Button render={<a/>} nativeButton={false}>` |
| Select | inline items, `<SelectValue placeholder>`, `position="popper"` | `items` prop, placeholder `{ value: null }`, `alignItemWithTrigger`; supports `multiple`, object values |
| ToggleGroup / Accordion | `type="single|multiple"`, string value | `multiple` boolean, array value |
| Slider (one thumb) | `defaultValue={[50]}` | `defaultValue={50}` |
| Toast | `toast()` from `sonner` (also Aria) | `toast` component |

Applies to every trigger/close part plus `NavigationMenuLink`,
`BreadcrumbLink`, `SidebarMenuButton`, `Badge`, `Item`. Full pairs: vendor
`skills/shadcn/rules/base-vs-radix.md`. References here are Base UI unless
labelled.

## 5. Composition rules (vendor skill)

- Existing components and built-in variants before custom markup or styles:
  `Alert`, `Empty`, `Skeleton`, `Separator`, `Badge`, `Spinner`, `Avatar`
  (+ `AvatarFallback`), `variant=`/`size=`.
- `className` sets layout only — never component color or typography.
  Semantic tokens only (`bg-primary`, `text-muted-foreground`); no raw
  palette classes; status via `Badge` variants or a project token.
- `flex flex-col gap-*`, never `space-y-*`/`space-x-*`; `size-*` for equal
  dimensions; `truncate`; `cn()` for conditionals; no manual `z-index` on
  overlays.
- Forms: `FieldGroup` + `Field` (+ `FieldLabel`, `FieldDescription`);
  `FieldSet` + `FieldLegend` for grouped checks/radios; `InputGroup` +
  `InputGroupInput`/`InputGroupAddon` for buttons inside inputs; 2–7 options
  = `ToggleGroup`. Validation: `data-invalid` on `Field`, `aria-invalid` on
  the control; `data-disabled` / `disabled` likewise. React Hook Form via
  `Controller` ([recipes.md](references/recipes.md)); nullable values need
  `value={field.value ?? ''}`.
- Items inside their Group (`SelectGroup`, `DropdownMenuGroup`,
  `CommandGroup`); `TabsTrigger` inside `TabsList`; full `Card` composition;
  `Dialog`/`Sheet`/`Drawer` always carry a Title (`sr-only` if hidden);
  `Button` has no `isLoading` — compose `Spinner` + `data-icon` + `disabled`.
- Icons in `Button`: `data-icon="inline-start|inline-end"`, no size classes;
  pass icons as objects, from `iconLibrary`.
- Chat UI composes `MessageScroller`, `Message`, `Bubble`, `Attachment`,
  `Marker`, `Trace` — no hand-rolled bubbles or scroll hooks.
- Charts: `Chart` wraps Recharts; colors via bare `var(--chart-n)`; `min-h`
  on `ChartContainer`. Chart *selection* is `admin-dashboard`'s. Sidebar in
  Astro: `SidebarProvider` and consumers in one hydrated root. Theme toggle
  only when the accepted system has dark mode (Light/Dark/System,
  `color-scheme`, resolve before first paint).

Style and preset are chosen at init and rewrite component code; compare
candidates with `preset decode` or the preset builder rather than adjectives.
Never ship the untouched default preset as the product's look — pair it with
the project's token set first.

## 6. Blocks

`shadcn add <block>` after `search`. A block is implementation material with
demo data and demo composition: map it only after the accepted contract,
replace its hierarchy and states, keep the primitives that fit.

## References

- [admin-component-system.md](references/admin-component-system.md) — admin
  component selection, framework boundaries, responsive transformations.
- [component-examples.md](references/component-examples.md) — charts,
  sidebar, theme toggle code.
- [component-catalogue.md](references/component-catalogue.md) — gotchas the
  docs do not warn about.
- [recipes.md](references/recipes.md) — Field + RHF form, data table, modal
  CRUD, responsive nav, settings, date picker, combobox.
- Official: [CLI](https://ui.shadcn.com/docs/cli),
  [components.json](https://ui.shadcn.com/docs/components-json),
  [Theming](https://ui.shadcn.com/docs/theming),
  [Changelog](https://ui.shadcn.com/docs/changelog), vendor skill
  `shadcn-ui/ui` `skills/shadcn/` (MIT; `rules/*.md`, `cli.md`,
  `design-system.md`). Checked 2026-10-29 (CLI docs show `shadcn@4.8.3`).
