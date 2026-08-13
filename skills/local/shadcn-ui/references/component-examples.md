# Component examples

Full code examples for charts, sidebar, and theme toggle. The rules and
gotchas live in `SKILL.md`; recipes for forms, data tables, modal CRUD,
responsive nav, settings, date picker, and combobox are in `recipes.md`.

---

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

---

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
<Sidebar collapsible="offcanvas">  {/* default: slides out */}
<Sidebar collapsible="icon">      {/* shrinks to icon-only */}
<Sidebar collapsible="none">      {/* always open */}

// Side
<Sidebar side="left">    {/* default */}
<Sidebar side="right">

// Variant
<Sidebar variant="sidebar">   {/* default, has a border */}
<Sidebar variant="floating">  {/* floating, rounded */}
<Sidebar variant="inset">     {/* inset into the content */}
```

### Keyboard Shortcut Toggle

`SidebarProvider` automatically registers `Cmd/Ctrl+B` to toggle the sidebar.

```tsx
// Custom shortcut
<SidebarProvider defaultOpen={true}>
```

### Astro boundary

shadcn's Astro template installs React because shadcn components are React
components. Static components such as `Card` can render from an `.astro` page
without a client directive. Components that need event handlers, context, or
browser state must live inside a hydrated React root. Keep a context-dependent
composition together: hydrating `SidebarProvider` while rendering a consumer
as a separate island creates separate React roots and the context will not
cross between them.

```astro
---
import DashboardShell from '@/components/dashboard-shell'
---

<DashboardShell client:load />
```

Use `client:load` for navigation and controls needed immediately. Use
`client:visible` for independent below-the-fold charts. Do not hydrate
presentational cards, headings, or tables merely because their source is TSX.

---

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
