# Shadcn UI Dashboard Architect Playbook

> **Deprecated capability snapshot. Do not use for implementation.** Current
> sources are `admin-product-ux` for domain/workflow correctness,
> `admin-dashboard` for dashboard IA, `shadcn-ui` for component APIs, and
> `astro-development` for Astro runtime boundaries. This file remains only
> until its eventual deletion is explicitly approved.

This playbook standardizes how we build Admin, SaaS, and internal dashboards using shadcn/ui across different frameworks. It bridges the gap between generic installation and real-world dashboard scaffolding.

## 1. Framework Selection Matrix

Before running `npx shadcn@latest init`, choose the right framework based on the dashboard's primary need:

| Framework | Best For | Architecture | Shadcn `rsc` flag | State Management |
|---|---|---|---|---|
| **Astro** | Static-heavy dashboards, CMS, Data-reading, SEO-needed public dashboards | MPA + Islands (`client:load`) | `false` | Pass state via props or Nano Stores. Use `ViewTransitions` for SPA feel. |
| **Next.js** | Complex SaaS, Multi-tenant Admin, Heavy server-mutations | App Router (RSC + Client boundaries) | `true` | Native React Context + Server Actions. |
| **Vite + React** | Pure internal tools, highly interactive drag-drop tools | SPA (Single Page App) | `false` | Zustand or native React Context. |

## 2. Installation & Initialization

**Do not install component-by-component by hand.** Use the CLI.

```bash
# 1. Initialize the project with your chosen framework (Astro/Next/Vite)
# 2. Add Tailwind CSS (Tailwind v4 is the current standard)
# 3. Initialize shadcn/ui
npx shadcn@latest init
```

### Framework-Specific Nuances for `components.json`:
- **Astro**: Set `"rsc": false` and `"tsx": true`. Ensure `tailwind.css` points to `src/styles/global.css` (or wherever your Astro global CSS is).
- **Next.js**: Set `"rsc": true` (App Router).
- **Vite**: Set `"rsc": false`.

## 3. The Canonical Dashboard Shell Pattern

Regardless of the framework, every dashboard must follow this core component hierarchy using the official `shadcn` Sidebar components.

**Command to scaffold foundation:**
```bash
npx shadcn@latest add sidebar button separator sheet tooltip
```

**The Layout Wrapper (React):**
Create an `AuthenticatedLayout` (or `AppShell`) that encapsulates the `SidebarProvider`.

```tsx
// src/components/layout/authenticated-layout.tsx
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### Adapting to Astro
If using Astro, you **cannot** share React Context across different `client:load` islands independently. You **must** wrap the entire shell in one island that yields a `<slot />`:

```astro
---
// src/layouts/AdminLayout.astro
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { ClientRouter } from 'astro:transitions';
---
<html>
  <head>
    <ClientRouter /> <!-- Crucial for SPA-like navigation in Astro -->
  </head>
  <body>
    <!-- Wrap the layout as a single React island -->
    <AuthenticatedLayout client:load>
      <slot />
    </AuthenticatedLayout>
  </body>
</html>
```

## 4. Navigation & Routing (The SPA Illusion)

- **Vite/React**: Use `@tanstack/react-router`. Replace all `<a>` tags with `<Link>`.
- **Next.js**: Use `next/link`.
- **Astro**: Use standard `<a href="...">` tags. Astro's `<ClientRouter />` will intercept the click and perform a seamless DOM swap, creating an SPA-like feel without the SPA JavaScript bloat.

## 5. Dashboard Data Patterns

1. **Overview KPI Cards**: Top row. Use `Card` + generic icons.
2. **Main Analytics**: Middle row. Use `Chart` (Recharts). Follow `admin-dashboard` rules (zero-baseline for bars, Okabe-Ito colors for accessibility).
3. **Recent Activity / Data Table**: Bottom row. Use `Table`. For large datasets, *always* use server-side pagination.

**Rule of Thumb:**
> "This skill decides HOW to wire the framework and components; the `admin-dashboard` skill decides WHAT UX/Data goes into it."
