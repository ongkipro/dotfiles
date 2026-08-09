# Component gotchas

This file is deliberately NOT a mirror of the official docs. The CLI now serves
that better than any checked-in copy, and a copy goes stale silently.

**Get current truth from the CLI, not from memory:**

```bash
shadcn search @shadcn -q <term>   # `list` is an alias
shadcn docs <item>                # canonical docs + example URLs
shadcn view <item>                # the ACTUAL current registry item, as JSON
shadcn add <item> --dry-run       # what would be written, and which deps
```

**The `@namespace` is required.** A bare `shadcn search button` fails with
*"Registry names must start with @"*, and omitting it only works when
`components.json` declares a `registries` key — most projects here don't.

**Run these inside the project directory.** `docs` and `view` resolve against
the project's `style`: in a `radix-nova` project `shadcn docs field` returns the
`/components/radix/field` page, outside any project it returns
`/components/base/field`. Same command, different answer — and the dependency
list in `view` shifts with it too.

Prefer the project's own binary when `shadcn` is in its `package.json`, so the
version matches the repo; otherwise a global install (`command -v shadcn` —
present on the Linux box at 4.16.2, verify per device).

**Package manager:** detect it from the lockfile. Our projects are mixed — most
are npm, some pnpm. Never hardcode `pnpm dlx` into a project that uses npm.

**Let the CLI install the deps it declares — but check which those are.**
`add <item>` installs whatever the registry item declares, and a hand-written
install often misses part of it: `add sonner` brings `sonner` **and**
`next-themes`; `add chart` pins `recharts@3.8.0`; `add command` brings `cmdk`;
`add calendar` brings `react-day-picker`.

**`add table` declares no npm dependency at all** — it is a plain styled
`<table>` wrapper. `@tanstack/react-table` is yours to install explicitly for
the data-table recipe. Verify with `add <item> --dry-run` rather than assuming
either way.

Below: only the things the docs won't warn you about.

---

## Registry items that don't exist (or no longer do)

- **`form` is emptied out on the current style.** Under `radix-nova` (verified),
  `form.json` returns 200 with `files: []` and the CLI reports "No files" — so
  `add form` is a silent no-op and `@/components/ui/form` never appears. Legacy
  styles (`default`, `new-york-v4`) still ship `form.tsx`, so existing code that
  imports it is not broken. **For new work use `field`** (`add field` →
  `field.tsx`, `label.tsx`, `separator.tsx`) with React Hook Form's
  `Controller`; see the form recipe in `recipes.md`. Check `components.json`
  `style` before concluding either way.
- **`date-picker` is not a registry item.** `add date-picker` hard-errors. It is
  a composition of Popover + Calendar; build it, don't install it.
- **`toast` is Base UI only.** On a Radix-based project `add toast` refuses and
  tells you to use `sonner`. So "toast was replaced by sonner" is true for our
  Radix projects, but is not a universal statement any more — check the project's
  `style` in `components.json` first.

## Dialog — width override needs a breakpoint prefix

```tsx
<DialogContent className="max-w-6xl">      // IGNORED
<DialogContent className="sm:max-w-6xl">   // WORKS
```

`DialogContent` hardcodes `sm:max-w-sm`, so an unprefixed `max-w-*` loses the
specificity contest at every width above `sm`.

## Select — empty string is not a legal value

```tsx
<SelectItem value="">All</SelectItem>          // THROWS
<SelectItem value="__any__">All</SelectItem>   // WORKS
const actual = value === '__any__' ? '' : value
```

Radix reserves `""` to mean "nothing selected".

## Tooltip — the provider is not automatic

`Tooltip` does not wrap itself in `TooltipProvider`. Mount one provider high in
the tree (root layout) rather than one per tooltip.

## Table — caption goes first

```tsx
<Table>
  <TableCaption>List of items.</TableCaption>   {/* FIRST child */}
  <TableHeader>…</TableHeader>
  <TableBody>…</TableBody>
</Table>
```

HTML requires `<caption>` to be the first child of `<table>`. Putting it after
`<TableBody>` is invalid markup and moves the caption for screen readers.

## Calendar — `initialFocus` was renamed

`react-day-picker` renamed it to `autoFocus` in **v9**, so anyone on v9 or later
hits it. The registry pins `@latest` (currently v10), so a fresh install always
gets the new name and TypeScript rejects the old prop.

```tsx
<Calendar mode="single" selected={date} onSelect={setDate} autoFocus />
```

## Command — `onSelect` receives a lowercased value

cmdk lowercases the value it hands back, so comparing it against a mixed-case
option fails silently. Close over the option instead of trusting the argument:

```tsx
<CommandItem
  key={o.value}
  value={o.value}
  onSelect={() => { setValue(o.value === value ? '' : o.value); setOpen(false) }}
>
```

## Sonner — one `<Toaster />`, at the root

```tsx
// root layout, once
import { Toaster } from '@/components/ui/sonner'
<Toaster richColors position="top-right" />
```

Then `import { toast } from 'sonner'` anywhere. `toast.promise(fn(), {loading,
success, error})` is the one worth remembering — it covers all three states
without hand-rolled state.

## Sidebar — don't hand-install `@radix-ui/react-slot`

Sidebar pulls its registry deps automatically (`button`, `input`, `separator`,
`sheet`, `skeleton`, `tooltip`, `use-mobile`), and on `radix-nova` declares no
npm dependency of its own — Slot arrives via the unified `radix-ui` package.
Other styles declare their own npm deps, so confirm with `--dry-run` rather
than assuming zero.

## Variant lists are longer than you remember

Don't write a variant from memory — `shadcn view button` prints the real `cva`
block. Two that commonly bite:

- **Button sizes** include `xs`, `icon-xs`, `icon-sm`, `icon-lg`, not just
  `default | sm | lg | icon`.
- **Badge variants** include `ghost` and `link` beyond the familiar four, and
  Badge renders a `<span>` and accepts `asChild`.

## Import style is mid-migration

Current registry components import from the unified `radix-ui` package:

```tsx
import { Label as LabelPrimitive } from 'radix-ui'
```

Components added to an older project still use `@radix-ui/react-*`. Newly added
files will therefore mix both styles in one codebase. That works, but pick one
direction deliberately if you touch a file, and don't "fix" a whole tree of
imports as a side quest.

## Lucide icons — no dynamic namespace import

```tsx
import * as Icons from 'lucide-react'
const Icon = Icons[name]     // breaks in prod, defeats tree-shaking

import { Home, Users, Settings, type LucideIcon } from 'lucide-react'
const ICON_MAP: Record<string, LucideIcon> = { Home, Users, Settings }
const Icon = ICON_MAP[name]  // correct
```
