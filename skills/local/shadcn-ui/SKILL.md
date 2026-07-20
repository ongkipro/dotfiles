---
name: shadcn-ui
description: 'Pakai shadcn/ui components untuk React/Next.js — fokus ke pemakaian komponen: charts (Recharts), sidebar, blocks, form patterns, data table, dark mode toggle, dan customisasi lewat semantic tokens. Mulai dari nol dengan shadcn init. Triggers: ''shadcn'', ''shadcn/ui'', ''shadcn ui'', ''install component'', ''buat form shadcn'', ''data table'', ''chart recharts'', ''sidebar shadcn'', ''shadcn blocks'', ''dark mode toggle''. Untuk CLI/registry kustom/theming mendalam → skill resmi `vercel:shadcn` (plugin Vercel).'
---

# shadcn/ui Components

Install dan pakai shadcn/ui components — termasuk charts, sidebar, dan blocks terbaru.

**Prerequisite**: Tailwind CSS + CSS variables sudah setup. Kalau belum, jalankan `pnpm dlx shadcn@latest init` (akan setup semuanya otomatis).

## Init Project Baru

```bash
# Init shadcn di project yang sudah ada
pnpm dlx shadcn@latest init

# Pilih saat ditanya:
# Style: Default atau New York
# Base color: Neutral / Slate / Zinc / dst
# CSS variables: Yes (wajib untuk dark mode)
```

Akan membuat: `components.json`, update `tailwind.config.ts`, buat `src/lib/utils.ts` (cn helper), buat `src/components/ui/`.

## Installation Order

Install foundation dulu, baru feature components:

### Foundation (install pertama)

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
| Sidebar | `@radix-ui/react-slot` (biasanya sudah ikut) |

```bash
# Install semua sekaligus kalau pakai fitur lengkap
pnpm add react-hook-form zod @hookform/resolvers sonner @tanstack/react-table recharts date-fns react-day-picker
```

## Charts (Recharts) — Terbaru

shadcn/ui sekarang punya chart component berbasis Recharts dengan theming otomatis via CSS variables.

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

Tambahkan ke `globals.css` kalau belum ada:

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

## Sidebar — Terbaru

Sidebar component baru yang kompleks: collapsible, responsive, keyboard-accessible.

```bash
pnpm dlx shadcn@latest add sidebar
```

### Setup Provider

```tsx
// app/layout.tsx atau root layout
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
<Sidebar collapsible="offcanvas"> {/* default: geser keluar */}
<Sidebar collapsible="icon">     {/* menyusut jadi icon-only */}
<Sidebar collapsible="none">     {/* selalu terbuka */}

// Side
<Sidebar side="left">   {/* default */}
<Sidebar side="right">

// Variant
<Sidebar variant="sidebar">  {/* default, punya border */}
<Sidebar variant="floating"> {/* mengambang, rounded */}
<Sidebar variant="inset">    {/* inset ke dalam konten */}
```

### Keyboard Shortcut Toggle

`SidebarProvider` otomatis daftarkan `Cmd/Ctrl+B` untuk toggle sidebar.

```tsx
// Custom shortcut
<SidebarProvider defaultOpen={true}>
```

## Blocks

shadcn/ui Blocks adalah pre-built UI sections yang bisa langsung di-copy-paste.

```bash
# Lihat semua blocks di: https://ui.shadcn.com/blocks
# Copy kode langsung dari website, atau pakai CLI:
pnpm dlx shadcn@latest add [block-name]
```

### Block Categories yang Tersedia

| Kategori | Contoh |
|---|---|
| Dashboard | Sidebar + stats cards + charts |
| Authentication | Login, Register, Forgot password |
| Sidebar | Berbagai layout sidebar |
| Login | Login forms dengan berbagai layout |

### Cara Pakai Blocks

1. Buka https://ui.shadcn.com/blocks
2. Pilih block yang cocok
3. Klik "Copy" atau install via CLI
4. Paste ke project, sesuaikan data dan routing

Blocks menggunakan component yang sudah kamu install — pastikan semua dependency-nya ada.

## Known Gotchas

### Radix Select — No Empty Strings

```tsx
<SelectItem value="">All</SelectItem>           // BREAKS
<SelectItem value="__any__">All</SelectItem>    // WORKS
const actual = value === "__any__" ? "" : value
```

### React Hook Form — Null Values

```tsx
// Jangan spread {...field} langsung ke Input
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
// Jangan dynamic import
import * as Icons from 'lucide-react'
const Icon = Icons[name]  // BREAKS di prod

// Pakai explicit map
import { Home, Users, Settings, type LucideIcon } from 'lucide-react'
const ICON_MAP: Record<string, LucideIcon> = { Home, Users, Settings }
const Icon = ICON_MAP[name]
```

### Dialog Width Override

```tsx
<DialogContent className="max-w-6xl">       // TIDAK WORKS
<DialogContent className="sm:max-w-6xl">    // WORKS — harus pakai breakpoint prefix
```

### Sidebar + Next.js App Router

```tsx
// Tambahkan 'use client' di layout yang pakai SidebarProvider
'use client'
import { SidebarProvider } from '@/components/ui/sidebar'
// SidebarProvider butuh client context (cookies untuk state)
```

### Chart Container Height

```tsx
// Selalu set min-h di ChartContainer, bukan di chart itu sendiri
<ChartContainer className="min-h-[200px] w-full">  // CORRECT
```

## Customising Components

```tsx
// Tambah variant di component file (src/components/ui/button.tsx)
const buttonVariants = cva("...", {
  variants: {
    variant: {
      brand: "bg-brand text-brand-foreground hover:bg-brand/90",
      // tambah di sini
    },
  },
})

// Selalu pakai semantic tokens, bukan raw color
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
// app/layout.tsx — wrap dengan ThemeProvider
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

## Referensi

- [Component Catalogue](references/component-catalogue.md) — semua component + install command + props
- [Recipes](references/recipes.md) — pola lengkap: form, data table, modal CRUD, nav, settings
