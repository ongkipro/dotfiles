---
name: shadcn-ui
description: 'Use shadcn/ui components for React/Next.js — focused on component usage: charts (Recharts), sidebar, blocks, form patterns, data table, dark mode toggle, and customization via semantic tokens. Start from scratch with shadcn init. Triggers: ''shadcn'', ''shadcn/ui'', ''shadcn ui'', ''install component'', ''buat form shadcn'', ''build shadcn form'', ''data table'', ''chart recharts'', ''sidebar shadcn'', ''shadcn blocks'', ''dark mode toggle''. For custom CLI/registry or deep theming → official skill `vercel:shadcn` (Vercel plugin).'
---

# shadcn/ui Components

Install and use shadcn/ui components — including the latest charts, sidebar, and blocks.

**Prerequisite**: Tailwind CSS + CSS variables already set up. If not, run `pnpm dlx shadcn@latest init` (it sets everything up automatically).

## Init New Project

```bash
# Init shadcn in an existing project
pnpm dlx shadcn@latest init

# Choose when prompted:
# Style: Default or New York
# Base color: Neutral / Slate / Zinc / etc
# CSS variables: Yes (required for dark mode)
```

It creates: `components.json`, updates `tailwind.config.ts`, creates `src/lib/utils.ts` (cn helper), creates `src/components/ui/`.

## Installation Order

Install the foundation first, then feature components:

### Foundation (install first)

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input label
pnpm dlx shadcn@latest add card
```

### Feature Components

```bash
# Forms
pnpm dlx shadcn@latest add form textarea select checkbox switch radio-group

# Feedback
pnpm dlx shadcn@latest add sonner alert badge progress skeleton

# Overlay
pnpm dlx shadcn@latest add dialog sheet popover dropdown-menu tooltip hover-card

# Data Display
pnpm dlx shadcn@latest add table tabs separator avatar scroll-area

# Navigation
pnpm dlx shadcn@latest add navigation-menu breadcrumb command pagination

# Layout & New
pnpm dlx shadcn@latest add sidebar collapsible resizable
pnpm dlx shadcn@latest add chart

# Misc
pnpm dlx shadcn@latest add calendar date-picker slider toggle toggle-group
pnpm dlx shadcn@latest add accordion alert-dialog aspect-ratio
```

### External Dependencies

| Component | Requires |
|---|---|
| Form | `react-hook-form zod @hookform/resolvers` |
| Sonner (toast) | `sonner` |
| Data Table | `@tanstack/react-table` |
| Command | `cmdk` |
| Chart | `recharts` |
| Calendar | `react-day-picker date-fns` |
| Sidebar | `@radix-ui/react-slot` (usually already included) |

```bash
# Install everything at once if using the full feature set
pnpm add react-hook-form zod @hookform/resolvers sonner @tanstack/react-table recharts date-fns react-day-picker
```

## Charts (Recharts) — Latest

shadcn/ui now has a Recharts-based chart component with automatic theming via CSS variables.

```bash
pnpm dlx shadcn@latest add chart
pnpm add recharts
```

### Bar Chart

```tsx
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
]

const chartConfig = {
  desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
  mobile:  { label: 'Mobile',  color: 'hsl(var(--chart-2))' },
}

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
  chrome:  { label: 'Chrome',  color: 'hsl(var(--chart-1))' },
  firefox: { label: 'Firefox', color: 'hsl(var(--chart-2))' },
  safari:  { label: 'Safari',  color: 'hsl(var(--chart-3))' },
}

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

Add to `globals.css` if not already present:

```css
:root {
  --chart-1: 12 76% 61%;
  --chart-2: 173 58% 39%;
  --chart-3: 197 37% 24%;
  --chart-4: 43 74% 66%;
  --chart-5: 27 87% 67%;
}
.dark {
  --chart-1: 220 70% 50%;
  --chart-2: 160 60% 45%;
  --chart-3: 30 80% 55%;
  --chart-4: 280 65% 60%;
  --chart-5: 340 75% 55%;
}
```

## Sidebar — Latest

A new, complex sidebar component: collapsible, responsive, keyboard-accessible.

```bash
pnpm dlx shadcn@latest add sidebar
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

shadcn/ui Blocks are pre-built UI sections you can copy-paste directly.

```bash
# See all blocks at: https://ui.shadcn.com/blocks
# Copy code straight from the website, or use the CLI:
pnpm dlx shadcn@latest add [block-name]
```

### Available Block Categories

| Category | Example |
|---|---|
| Dashboard | Sidebar + stats cards + charts |
| Authentication | Login, Register, Forgot password |
| Sidebar | Various sidebar layouts |
| Login | Login forms with various layouts |

### How to Use Blocks

1. Open https://ui.shadcn.com/blocks
2. Pick a block that fits
3. Click "Copy" or install via CLI
4. Paste into the project, adjust data and routing

Blocks use components you have already installed — make sure all their dependencies are present.

## Known Gotchas

### Radix Select — No Empty Strings

```tsx
<SelectItem value="">All</SelectItem>           // BREAKS
<SelectItem value="__any__">All</SelectItem>    // WORKS
const actual = value === "__any__" ? "" : value
```

### React Hook Form — Null Values

```tsx
// Don't spread {...field} directly onto Input
<Input
  value={field.value ?? ''}
  onChange={field.onChange}
  onBlur={field.onBlur}
  name={field.name}
  ref={field.ref}
/>
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

## Dark Mode Toggle

```tsx
// components/mode-toggle.tsx
'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

```bash
pnpm add next-themes
```

```tsx
// app/layout.tsx — wrap with ThemeProvider
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

## References

- [Component Catalogue](references/component-catalogue.md) — all components + install commands + props
- [Recipes](references/recipes.md) — complete patterns: form, data table, modal CRUD, nav, settings
