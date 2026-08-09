---
name: shadcn-ui
description: 'Use shadcn/ui components in React/Next.js for charts, sidebars, forms, data tables, blocks, dark mode, and semantic-token customization. Assumes Tailwind v4 (CSS-first config, raw oklch tokens, no hsl() wrapper) unless the repo proves otherwise. Inspect and reuse the project setup before adding components. Use for shadcn, install component, shadcn form, data table, Recharts chart, shadcn sidebar, blocks, and dark-mode toggle. Reads components.json first because `style`, `tailwind.config`, aliases, and prefix change what every command produces. shadcn also publishes an official skill (`npx skills add shadcn/ui`) — prefer it for live project context, current CLI syntax, custom registries, and the shadcn MCP; check where it installs first, since ~/.claude/skills symlinks into dotfiles. Not for deciding which chart, layout, or screen to build (admin-dashboard, design-taste, storefront-ux), nor for browser evidence (ui-validation).'
---

# shadcn/ui Components

Install and use only the shadcn/ui components required by the accepted screen.
Read `components.json` (next section), `package.json`, and the existing
`src/components/ui` before anything else, and reuse what is already there.
Before emitting a CLI command or component API, verify it against the current
registry — the CLI, the copied source, and even *which items exist* change over
time and differ by style.

After a browser-visible component change, use `ui-validation` for the smallest
viewport, keyboard, state, and accessibility evidence. Component compilation
alone is not UI proof.

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
| `iconLibrary` | The project's one icon set. Adding a second violates `design-taste`'s one-library rule. |
| `rsc` | Whether the CLI stamps `"use client"` onto generated client components. `false` ⇒ it does not. In a non-RSC project (Astro, Vite, React Router) that is correct; in a Next App Router repo it means **you** add the directive by hand, and `admin-dashboard`'s server/client rules still apply. |
| `tsx` | `false` ⇒ `.jsx` output and no TS types; every typed snippet here needs stripping. |
| `registries` | Extra or private registries. Non-empty ⇒ `add <item>` may resolve outside shadcn's own registry, and nothing in this skill describes that source. Confirm where an item came from before trusting any guidance here. |

The real file can also carry keys the docs don't list (`rtl`, `menuColor`,
`menuAccent` all appear in our projects). Read it before the first command, not
after the first failure.

## Official shadcn skill

shadcn publishes its own agent skill (`ui.shadcn.com/docs/skills`), installed
through the skills.sh protocol:

```bash
npx skills add shadcn/ui      # telemetry is on by default; DISABLE_TELEMETRY=1 to opt out
```

It carries what a hand-maintained file drifts on: the current CLI reference,
registry authoring, and the shadcn MCP setup. It does **not** read
`components.json` for you — that is the agent's job either way (section above,
which stays authoritative; the official skill supersedes this file on CLI
syntax and registry work, not on the house rules).

**Before installing it, check where it writes.** `~/.claude/skills` is a symlink
to `~/dotfiles/skills/local`, so an installer aimed there drops an unvendored
third-party directory straight into the tracked dotfiles repo — it pollutes the
single source rather than sitting beside it. The CLI does not document its
target path: run it with `--help` first and read the install summary, or install
from inside a project so it lands in that repo's `.claude/skills`. To put it in
dotfiles deliberately, vendor it the way `stripe-best-practices` is — a
`.source` file carrying the upstream raw base URL so `_refresh-vendored.sh` can
re-fetch it.

This skill stays useful alongside it: it carries the house rules (package
manager per lockfile, `native-first` discipline), the verified drift traps
below, and the routing to `admin-dashboard` / `design-taste` / `storefront-ux`
for decisions that are not shadcn's to make.

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
2. A global install — `command -v shadcn`. Present on the Linux box (4.16.2);
   verify before relying on it elsewhere.
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

`init` creates `components.json`, `src/lib/utils.ts` (the `cn` helper), and
`src/components/ui/`, and writes the token block into your main CSS file. On v4
it does NOT write `tailwind.config.ts` — the config is the CSS, and dark mode is
a `@custom-variant dark (&:is(.dark *))` line rather than a `darkMode` key.

The old "Style: Default or New York" / "Base color" prompts are gone. `init` now
takes `--template` (`next|start|vite|react-router|laravel|astro`), `--base`
(`base` for Base UI, `radix` for Radix, `aria` for React Aria), `--preset`,
`--css-variables` (default true), `--monorepo`, `--rtl`, `--defaults`, `--force`.
Verify with `--help`; treat this list as a snapshot, not a contract.

## Installation Order

Install the foundation first, then only the components the accepted screen needs.

```bash
shadcn add button input label card          # foundation

shadcn add field textarea select checkbox switch radio-group   # forms
shadcn add sonner alert badge progress skeleton                # feedback
shadcn add dialog sheet popover dropdown-menu tooltip hover-card
shadcn add table tabs separator avatar scroll-area
shadcn add navigation-menu breadcrumb command pagination
shadcn add sidebar collapsible resizable chart
shadcn add calendar slider toggle toggle-group
shadcn add accordion alert-dialog aspect-ratio
```

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

## Charts (Recharts)

A Recharts-based chart component with automatic theming via CSS variables.

```bash
shadcn add chart
```

The registry pins **Recharts v3**, so `add chart` pulls the right version — let
it, instead of installing `recharts` by hand. Recharts v2 examples found online
can break on the v3 API.

Which chart to use for which question is NOT this skill's call — that belongs to
`admin-dashboard` (chart selection, zero-baseline rules, colourblind-safe
palettes). This skill only shows how to wire the one already chosen.

### Bar Chart

```tsx
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
]

// v4: bare var(), NEVER hsl(var(...)) — that double-wraps an oklch value
const chartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile:  { label: 'Mobile',  color: 'var(--chart-2)' },
} satisfies ChartConfig

export function BarChartExample() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile"  fill="var(--color-mobile)"  radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
```

### Line Chart

```tsx
import { Line, LineChart, CartesianGrid, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'

export function LineChartExample() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line type="monotone" dataKey="desktop" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="mobile"  stroke="var(--color-mobile)"  strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  )
}
```

### Pie / Donut Chart

```tsx
import { Pie, PieChart } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'

const pieData = [
  { browser: 'chrome',  visitors: 275, fill: 'var(--color-chrome)'  },
  { browser: 'firefox', visitors: 200, fill: 'var(--color-firefox)' },
  { browser: 'safari',  visitors: 187, fill: 'var(--color-safari)'  },
]

const pieConfig = {
  chrome:  { label: 'Chrome',  color: 'var(--chart-1)' },
  firefox: { label: 'Firefox', color: 'var(--chart-2)' },
  safari:  { label: 'Safari',  color: 'var(--chart-3)' },
} satisfies ChartConfig

export function DonutChart() {
  return (
    <ChartContainer config={pieConfig} className="min-h-[200px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={pieData} dataKey="visitors" nameKey="browser" innerRadius={60} />
        <ChartLegend content={<ChartLegendContent nameKey="browser" />} />
      </PieChart>
    </ChartContainer>
  )
}
```

### CSS Variables Chart Colors

**Check the project's CSS first — do not paste this over an existing palette.**
A project initialised with a different base colour or style has its own
`--chart-*` values (they may even be greyscale, and identical in both themes).
Those are the brand; only add what is genuinely missing.

Raw `oklch()`, top-level, outside `@layer base`:

```css
:root {
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
}

.dark {
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
}
```

The `@theme inline` mapping is separate and is NOT shipped by
`shadcn/tailwind.css` — verified absent from the package. Add it yourself:

```css
@theme inline {
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
}
```

Two different things, often confused:

- `chartConfig` resolves `var(--chart-1)` directly; it does **not** need the
  `@theme` block. The mapping exists so Tailwind *utilities* — `bg-chart-1`,
  `fill-chart-2` — exist at all. Without it those classes are undefined.
- `var(--color-desktop)` is neither. `ChartContainer` renders a `<ChartStyle>`
  that injects `--color-<key>` per theme, scoped to `[data-chart=<id>]`, derived
  from your `chartConfig` keys at runtime. It is not a theme token and needs no
  `@theme` entry.
- `inline` (not bare `@theme`) is required: it makes Tailwind emit the `var()`
  reference instead of a resolved copy, which is what lets `.dark` re-point the
  token at runtime.

## Sidebar

A new, complex sidebar component: collapsible, responsive, keyboard-accessible.

```bash
shadcn add sidebar
```

### Setup Provider

```tsx
// app/layout.tsx or root layout
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
```

### AppSidebar Component

```tsx
// components/app-sidebar.tsx
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Home, Settings, Users, BarChart3, type LucideIcon } from 'lucide-react'

const navItems: { title: string; url: string; icon: LucideIcon }[] = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Users',     url: '/users',     icon: Users },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Settings',  url: '/settings',  icon: Settings },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1.5 text-lg font-semibold">App Name</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* user profile / logout */}
      </SidebarFooter>
    </Sidebar>
  )
}
```

### Sidebar Variants

```tsx
// Collapsible modes
<Sidebar collapsible="offcanvas"> {/* default: slides out */}
<Sidebar collapsible="icon">     {/* shrinks to icon-only */}
<Sidebar collapsible="none">     {/* always open */}

// Side
<Sidebar side="left">   {/* default */}
<Sidebar side="right">

// Variant
<Sidebar variant="sidebar">  {/* default, has a border */}
<Sidebar variant="floating"> {/* floating, rounded */}
<Sidebar variant="inset">    {/* inset into the content */}
```

### Keyboard Shortcut Toggle

`SidebarProvider` automatically registers `Cmd/Ctrl+B` to toggle the sidebar.

```tsx
// Custom shortcut
<SidebarProvider defaultOpen={true}>
```

## Blocks

Pre-built sections (dashboards, auth screens, sidebars) installed like any other
registry item: `shadcn add <block>`. Browse them at https://ui.shadcn.com/blocks
or list them with `shadcn search`. Don't keep a category table here — it goes
stale, and the CLI already answers the question.

A block is a starting point, not a screen. It arrives with placeholder data and
generic copy; the IA decision behind it is still `admin-dashboard`'s call.

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
// Add 'use client' in the layout that uses SidebarProvider
'use client'
import { SidebarProvider } from '@/components/ui/sidebar'
// SidebarProvider needs client context (cookies for state)
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

## Theme Toggle

Policy lives in `design-taste` §4.2.1: **light is the canonical theme**, dark
ships only when it is actually designed, and the control is **three-state —
Light / Dark / System** — because a two-state switch cannot express "follow my
OS" and strands anyone whose system already auto-schedules.

```tsx
// components/mode-toggle.tsx
'use client'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const MODES = [
  { value: 'light',  label: 'Light',  icon: Sun },
  { value: 'dark',   label: 'Dark',   icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change theme">
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="hidden h-4 w-4 dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {MODES.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)} aria-current={theme === value}>
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

If the project has no theme state yet and `next-themes` is the accepted
implementation, add it with the project's package manager. Do not install it
merely because this example exists.

```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

// suppressHydrationWarning is REQUIRED on <html>: next-themes stamps the class
// before React hydrates, so server and client markup deliberately differ.
<html lang="en" suppressHydrationWarning>
  <body>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  </body>
</html>
```

`next-themes` injects its own blocking script to resolve the theme before first
paint — that is the FOUC fix, so don't add a second one. Outside Next (Astro,
plain Vite) there is no provider doing this for you: write the small inline
`<head>` script yourself, or SSR the class from a cookie. A dark mode that
flashes white on load is not finished.

Also set `color-scheme` per theme in CSS so native controls, scrollbars, and
date pickers follow the theme instead of staying light:

```css
:root { color-scheme: light; }
.dark { color-scheme: dark; }
```

## References

- [Component gotchas](references/component-catalogue.md) — only what the docs
  won't warn you about: dead registry items, breakpoint-prefixed Dialog widths,
  Select's empty-string ban, caption order, removed props. For anything routine,
  `shadcn docs <item>` and `shadcn view <item>` beat a checked-in copy.
- [Recipes](references/recipes.md) — full patterns: Field + RHF form, data
  table, modal CRUD, responsive nav, settings, date picker, combobox.
