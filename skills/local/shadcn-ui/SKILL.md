---
name: shadcn-ui
description: >-
  Use shadcn/ui as the default component source for React-capable admin
  surfaces across Next.js, Vite, React Router, Astro, and other supported
  runtimes; also use for forms, data tables, charts, sidebars, blocks, themes,
  preset switches, namespaced registry items, semantic tokens, registry
  inspection, and component installation. Read
  components.json first because style, Tailwind configuration, aliases, base
  primitives, and prefixes change the generated code. Preserve native
  semantics and minimal hydration; shadcn is not a reason to render static
  markup through React. Use admin-product-ux and admin-dashboard for workflow
  and presentation decisions, and ui-validation for browser evidence.
---

# shadcn/ui Components

Install and use only the shadcn/ui components required by the accepted screen.
Read `components.json` (next section), `package.json`, and the existing
`src/components/ui` before anything else, and reuse what is already there.
Before emitting a CLI command or component API, verify it against the current
registry — the CLI, the copied source, and even *which items exist* change over
time and differ by style.

Do not use a block, registry example, or default component composition to choose
the product workflow or visual direction. Before component mapping, require an
accepted screen contract and presentation direction: `admin-product-ux` then
`admin-dashboard` for admin/CMS, `storefront-ux` plus the accepted storefront
direction for commerce, or `design-taste` for public/marketing surfaces. When a
suite is active, consume `UX-*` from
`17-UX-FLOWS-SCREEN-CONTRACTS.md` and `UI-*` from
`10-DESIGN-SYSTEM-WHITELABEL.md`.

For an accepted admin screen, shadcn/ui is the house default component source
when the selected runtime supports React. It is not a universal render layer:
native semantics remain underneath, and static Astro markup must not be
hydrated merely for visual consistency. Read
[Admin component system](references/admin-component-system.md) for the
cross-framework component, runtime, responsive, and performance contract.

After a browser-visible component change, use `ui-validation` for the smallest
viewport, keyboard, state, and accessibility evidence. Component compilation
alone is not UI proof.

For admin work, load `admin-product-ux` first when workflow, permissions, or
screen states are not explicit; then load `admin-dashboard` for hierarchy,
responsive behavior, and the clean-light visual baseline. Load the installed
framework skill for server/client/island boundaries. This skill owns the final
component mapping and copied component source.

**Prerequisite:** Tailwind CSS and the project's token strategy must already be
understood. For an accepted new shadcn setup, verify the current CLI help and
official installation guide first; do not assume generated paths or
configuration choices.

**On running the CLI at all:** `ui-validation` bans `npx`/`dlx` for QA tooling,
because a throwaway download must never sit between you and the evidence.
Component scaffolding is the deliberate exception — `shadcn` is a code generator
that copies source into the repo, not a runtime dependency. Prefer the
project-local binary whenever `shadcn` is already in `package.json`, and never
extend this exception to anything else.

## Read `components.json` first — it changes the answers

This is not a formality. The same `shadcn add` command produces different files
in different projects, and every field below silently rewrites the guidance in
the rest of this skill.

| Field | Why it changes what you write |
|---|---|
| `style` | Picks the registry variant. **This decides whether an item even exists** — on `radix-nova`, `add form` writes nothing, while `default` and `new-york-v4` still ship `form.tsx`. Hardcoded classes differ too (`DialogContent` is `sm:max-w-sm` on radix-nova). **Immutable after init.** |
| `tailwind.config` | Empty string = v4, CSS-first, no JS config. A path means a v3-era project and most of the next section does not apply. |
| `tailwind.css` | Where the tokens actually live. Do not assume `globals.css` — an Astro project may use `src/styles/global.css`. |
| `tailwind.cssVariables` | `false` means no semantic tokens; `bg-primary` won't exist and dark mode is not wired the way this skill assumes. **Immutable after init.** |
| `tailwind.baseColor` | The palette already chosen. Never overwrite an existing `--chart-*` / neutral ramp with the docs' defaults. **Immutable after init** — a wrong value is a re-init decision, not an edit. |
| `tailwind.prefix` | Non-empty ⇒ every utility in every snippet here needs it, and **on v4 the form is a colon variant** (`tw:flex`, `tw:hover:bg-primary`), not v3's `tw-flex`. v4's `prefix()` also renames theme variables (`--tw-color-*`), so the `--chart-*` guidance below shifts with it. |
| `aliases.*` | The real import paths — `ui`, `components`, `utils`, `lib`, `hooks`. `@/components/ui` is a default, not a guarantee. |
| `iconLibrary` | The project's one icon set. Keep one library across the surface; do not add a second set for a component or screen. |
| `rsc` | Whether the CLI stamps `"use client"` onto generated client components. `false` ⇒ it does not. In a non-RSC project (Astro, Vite, React Router) that is correct; in a Next App Router repo it means **you** add the directive by hand, and `admin-dashboard`'s server/client rules still apply. |
| `tsx` | `false` ⇒ `.jsx` output and no TS types; every typed snippet here needs stripping. |
| `registries` | Extra or private registries. Non-empty ⇒ `add <item>` may resolve outside shadcn's own registry, and nothing in this skill describes that source. Confirm where an item came from before trusting any guidance here. |

The real file can also carry keys the docs don't list (`rtl`, `menuColor`,
`menuAccent` all appear in our projects). Read it before the first command, not
after the first failure.

## Project-aware workflow

Apply this workflow when working on shadcn components, settings/forms,
dashboards, presets, or registry items in a project with `components.json`.
Its presence is a project-context signal, not a reason to initialize shadcn or
change unrelated code. A skill is guidance; automatic loading still depends on
the assistant's skill discovery rather than a hook installed by this file.

1. On each shadcn-related interaction, run the installed project CLI's
   `shadcn info --json` from the target application directory (for example,
   `pnpm exec shadcn info --json` in a pnpm project). Inspect `components.json`,
   the lockfile, and copied components alongside the result. If the command is
   unavailable or fails, use those files and disclose the missing context;
   do not install or upgrade a CLI just to perform inspection.
2. Use the returned framework, Tailwind version, aliases, resolved paths,
   installed components, icon library, and base library (`base`, `radix`, or
   `aria`). Read the matching base-specific docs and local component source;
   do not transfer composition APIs such as `asChild` between bases by memory.
   An inferred preset with fallback values is not proof of the app's actual
   font or rendered theme; inspect the CSS and layout before changing them.
3. Discover before generating: use `shadcn docs`, `shadcn search`, `shadcn view`,
   or an already configured shadcn MCP server. For a requested namespaced item
   such as `@tailark`, resolve the actual registry item and its dependencies
   before installation; do not invent registry URLs or item names.
4. Compose with existing primitives: `FieldGroup`/`Field` for related form
   fields, `ToggleGroup` for related toggle options, and semantic color tokens.
   Keep native form behavior, labels, validation, and the control semantics
   appropriate to the job; navigation is not a toggle group. Customize copied
   components and variants rather than duplicating parallel implementations.
5. For a requested preset switch, inspect the installed CLI help and current
   project configuration first, then use its supported preset workflow. Review
   the resulting diff for local component customizations and token changes;
   apply `ui-validation` to the rendered result. A successful CLI exit alone
   does not prove the requested appearance was applied.

## Official shadcn skill and references

The [official Skills guide](https://ui.shadcn.com/docs/skills) describes project
context, CLI commands, theme customization, registry authoring, and MCP access.
Verified against that guide on 2026-09-14. It documents project installation with:

```bash
npx skills add shadcn/ui
```

This is an optional skill-installation workflow, separate from component
scaffolding or QA tools. Do not run it merely because an existing project uses
shadcn. On this setup, update the owned skill at
`~/dotfiles/skills/local/shadcn-ui` rather than creating a competing local copy.
If installing the upstream skill is explicitly requested, inspect the
installer's current help and destination first: runtime skill directories may
resolve into the tracked owned-skill tree. Do not overwrite that tree with
unreviewed upstream files; deliberate vendoring uses the existing `.source`
and `_refresh-vendored.sh` convention.

Load the relevant official reference for the requested operation:

- [CLI](https://ui.shadcn.com/docs/cli): `init`, `add`, `search`, `view`, `docs`,
  `diff`, `info`, and `build`; verify installed help for flags, dry runs,
  merge behavior, templates, and preset support.
- [Theming](https://ui.shadcn.com/docs/theming): CSS variables, OKLCH, custom
  colors, radius, variants, and the appropriate Tailwind v3/v4 conventions.
- [Registry](https://ui.shadcn.com/docs/registry): `registry.json`, item types,
  file objects, dependencies, CSS variables, building, hosting, and user config.
- [MCP](https://ui.shadcn.com/docs/mcp): registry discovery and installation
  tools. Reuse configured tools; MCP setup is a separate requested change.
- [skills.sh](https://skills.sh): skill distribution and installation.

Current official documentation and installed code own API/CLI details. This
owned skill adds project package-manager conventions, native-first decisions,
product/design routing, and browser verification. Preserve explicit user choices
and local customizations when combining them.

## Tailwind v4 baseline (verified 2026-08-09)

The user's projects are on Tailwind v4. Assume v4 unless the repo proves
otherwise, and check `components.json` + the main CSS file before writing code.

- **CSS-first config.** `tailwind.config.ts` is no longer auto-detected;
  `components.json` carries `"tailwind": { "config": "" }`. A JS config only
  loads via an explicit `@config` directive, and `corePlugins`, `safelist`, and
  `separator` are unsupported. Colors defined in a v3 `theme.extend.colors`
  simply do not register.
- **Class-based dark needs a custom variant.** `dark:` defaults to the media
  strategy; `init` writes `@custom-variant dark (&:is(.dark *));`. Tailwind's own
  documented form is `&:where(.dark, .dark *)`, which also matches the element
  carrying the class and adds no specificity. Either works — don't run both.
- **Tokens are raw `oklch()`**, declared on top-level `:root` and `.dark`.
  Keep them OUT of `@layer base` — inside a layer they lose to unlayered author
  styles. (The official chart docs page still shows the `@layer base` form; the
  v4 migration guide overrides it.)
- **No `hsl()` wrapper.** v3's `hsl(var(--token))` double-wraps an oklch value
  into an invalid color and renders unstyled.
- **Arbitrary CSS-variable classes use parentheses, not brackets:**
  `fill-(--color-desktop)`, not `fill-[--color-desktop]`. The bracket form
  silently emits nothing. A `fill="var(--color-desktop)"` *prop* is a plain SVG
  attribute and is unaffected — only the `className` form changed.
- `tailwindcss-animate` was replaced by `tw-animate-css`. Components dropped
  `forwardRef` for `React.ComponentProps<…>` plus a `data-slot` attribute, so
  v3-era component bodies won't match current styling hooks.

## Commands and package manager

**Use the project's own package manager** — check the lockfile, don't assume.
Our projects are mixed: most are npm, a few pnpm.

Resolution order, and **check rather than assume** — global installs are
per-device:

1. The project's own binary when `shadcn` is in its `package.json`. Its pinned
   version wins inside an established repo.
2. A global install when `command -v shadcn` succeeds; verify its version before
   relying on it.
3. `npx shadcn@latest`, only to scaffold a project that has neither.

```bash
shadcn init                 # new setup (npx shadcn@latest init if not installed)
shadcn add <item>           # inside the project
```

Discovery beats memory — these subcommands did not exist when most shadcn
examples online were written:

```bash
shadcn search @shadcn -q <term>   # `list` is an alias
shadcn docs <item>                # canonical docs + example URLs
shadcn view <item>                # the ACTUAL current registry item, as JSON
shadcn add <item> --dry-run       # what would be written, and which deps
```

Two traps: the **`@namespace` is required** (a bare `shadcn search button`
errors out), and these must be **run inside the project** — `docs` and `view`
resolve against its `style`, so the same command returns the `radix` page in one
project and the `base` page in another.

For an installed project, prefer one machine-readable context command before
planning components:

```bash
shadcn info --json
```

Do not infer framework, aliases, base library, or installed items from folder
names when this command can resolve them.

`init` creates `components.json`, `src/lib/utils.ts` (the `cn` helper), and
`src/components/ui/`, and writes the token block into your main CSS file. On v4
it does NOT write `tailwind.config.ts` — the config is the CSS, and dark mode is
a `@custom-variant dark (&:is(.dark *))` line rather than a `darkMode` key.

The old "Style: Default or New York" / "Base color" prompts are gone. `init` now
takes `--template` (`next|start|vite|react-router|laravel|astro`), `--base`
(`base` for Base UI, `radix` for Radix, `aria` for React Aria), `--preset`,
`--css-variables` (default true), `--monorepo`, `--rtl`, `--defaults`, `--force`.
Verify with `--help`; treat this list as a snapshot, not a contract.

## Select components from the accepted screen

Do not install a foundation pack or a category bundle. Map the accepted
screen's regions to the smallest component set, reuse copied source first, then
inspect each new registry item:

```bash
shadcn view button
shadcn add button --dry-run
shadcn add button
```

For admin work, use
[Admin component system](references/admin-component-system.md) as the decision
inventory. It covers foundation, navigation, forms, data operations, overlays,
analytics, responsive transformations, and runtime cost without turning that
inventory into an install command.

Two registry items people still reach for won't give you what they expect:

- **`form`** is emptied out on the current style. Verified on `radix-nova`:
  `form.json` returns 200 with `files: []` and the CLI prints "No files", so
  `add form` is a **silent no-op** and `@/components/ui/form` never appears.
  Legacy styles (`default`, `new-york-v4`) still ship `form.tsx`, so existing
  imports aren't broken. For new work use **`field`** with React Hook Form's
  `Controller` — full recipe in `recipes.md`. Check `components.json` `style`
  before concluding either way.
- **`date-picker`** hard-errors. It is a Popover + Calendar composition.

### External dependencies — check what the item declares

`add <item>` installs the npm and registry deps that item declares, and a
hand-written install often misses part of that (`add sonner` also brings
`next-themes`; `add chart` pins `recharts@3.8.0`).

But it is not universal: **`add table` declares no npm dependency** — it is a
styled `<table>` wrapper, and `@tanstack/react-table` is yours to install.
`add <item> --dry-run` answers this in one command; assume nothing in either
direction.

Do not hand-install `@radix-ui/react-slot` for Sidebar — Slot arrives via the
unified `radix-ui` package, and Sidebar pulls `button`, `input`, `separator`,
`sheet`, `skeleton`, `tooltip`, and `use-mobile` from the registry itself.

Follow `native-first`: a component you don't render is a dependency you don't
need. Never install a whole category as a bundle.

## Charts, Sidebar, and Theme Toggle

Full code examples for these components (bar/line/pie charts with CSS variable
theming, sidebar provider + variants + Astro boundary, three-state theme
toggle with `next-themes`) are in
[component-examples.md](references/component-examples.md).

Key points kept inline:

- **Charts:** `shadcn add chart` pins Recharts v3. Use bare `var()` for colors,
  NEVER `hsl(var(...))`. Set `min-h` on `ChartContainer`, not the chart itself.
  Chart *selection* belongs to `admin-dashboard`.
- **Sidebar:** `shadcn add sidebar` pulls its registry deps automatically.
  In Astro, keep `SidebarProvider` and consumers in the same hydrated React
  root — separate islands create separate contexts.
- **Theme toggle:** add one only when the accepted visual system includes dark
  mode. Use Light / Dark / System when all three modes are supported.
  `next-themes` handles FOUC in Next; outside Next use the installed framework's
  proven pre-paint strategy. Set `color-scheme` per theme in CSS and verify both
  themes in a browser.

## Blocks

Pre-built sections (dashboards, auth screens, sidebars) installed like any other
registry item: `shadcn add <block>`. Browse them at https://ui.shadcn.com/blocks
or list them with `shadcn search`. Don't keep a category table here — it goes
stale, and the CLI already answers the question.

A block is implementation material, not a screen or a design direction. It
arrives with placeholder data, generic copy, and a composition optimized for a
demo. Map it only after the accepted contract, replace its information
hierarchy and states, and preserve just the primitives that fit.

## Known Gotchas

### Radix Select — No Empty Strings

```tsx
<SelectItem value="">All</SelectItem>           // BREAKS
<SelectItem value="__any__">All</SelectItem>    // WORKS
const actual = value === "__any__" ? "" : value
```

### React Hook Form — nullable values only

Spreading `{...field}` is correct and is what the official example does. The
narrow failure case is a value that can be `null`/`undefined`, which flips the
input from controlled to uncontrolled mid-life. Override just that one prop:

```tsx
<Input {...field} value={field.value ?? ''} />
```

### Lucide Icons — Tree-Shaking

```tsx
// Don't dynamic import
import * as Icons from 'lucide-react'
const Icon = Icons[name]  // BREAKS in prod

// Use an explicit map
import { Home, Users, Settings, type LucideIcon } from 'lucide-react'
const ICON_MAP: Record<string, LucideIcon> = { Home, Users, Settings }
const Icon = ICON_MAP[name]
```

### Dialog Width Override

```tsx
<DialogContent className="max-w-6xl">       // DOESN'T WORK
<DialogContent className="sm:max-w-6xl">    // WORKS — must use a breakpoint prefix
```

### Sidebar + Next.js App Router

```tsx
// Keep the provider in the smallest client boundary shared by its consumers.
'use client'
import { SidebarProvider } from '@/components/ui/sidebar'
// Context requires a client boundary; cookie persistence is optional policy.
```

### Chart Container Height

```tsx
// Always set min-h on ChartContainer, not on the chart itself
<ChartContainer className="min-h-[200px] w-full">  // CORRECT
```

## Customising Components

```tsx
// Add a variant in the component file (src/components/ui/button.tsx)
const buttonVariants = cva("...", {
  variants: {
    variant: {
      brand: "bg-brand text-brand-foreground hover:bg-brand/90",
      // add here
    },
  },
})

// Always use semantic tokens, not raw colors
<Button className="bg-primary">     // CORRECT
<Button className="bg-blue-500">    // WRONG
```

## References

- [Admin component system](references/admin-component-system.md) — canonical
  admin component selection, framework boundaries, responsive transformations,
  performance prevention, and browser acceptance contract.
- [Component examples](references/component-examples.md) — full code: charts
  (bar, line, pie, CSS variables), sidebar (provider, variants, Astro boundary),
  theme toggle (three-state, next-themes, color-scheme).
- [Component gotchas](references/component-catalogue.md) — only what the docs
  won't warn you about: dead registry items, breakpoint-prefixed Dialog widths,
  Select's empty-string ban, caption order, removed props. For anything routine,
  `shadcn docs <item>` and `shadcn view <item>` beat a checked-in copy.
- [Recipes](references/recipes.md) — full patterns: Field + RHF form, data
  table, modal CRUD, responsive nav, settings, date picker, combobox.
