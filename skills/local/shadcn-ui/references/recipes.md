# Component Recipes

Ready-made patterns — copy, then swap the data. Install with the project's own
package manager (check the lockfile); `add` pulls its npm deps itself.

Composition is **Base UI** (`render`, `nativeButton`, Select `items`); on a
Radix project swap per the table in `SKILL.md` → "Base UI vs Radix". Toasts
use `sonner`, which is the Radix/Aria choice; a Base UI project uses its
`toast` component instead.

## Contact Form (Field + React Hook Form)

On current styles `add form` writes no files; `field` + RHF `Controller` is the
documented path (https://ui.shadcn.com/docs/forms/react-hook-form). Legacy
styles still ship `form.tsx`, so existing imports keep working.

```bash
shadcn add field input textarea button
```

```tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// zod v4 syntax (zod `latest` is 4.x; Astro 6+ also ships Zod 4). On a v3
// lockfile use z.string().email() instead; v4 deprecates that form.
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  message: z.string().min(10, 'At least 10 characters'),
})

export function ContactForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', message: '' },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      // fetch does NOT reject on 4xx/5xx — check res.ok or you toast success on failure
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Message sent!')
      form.reset()
    } catch {
      toast.error('Failed to send message')
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input {...field} id={field.name} type="email" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Message</FieldLabel>
              <Textarea {...field} id={field.name} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Sending...' : 'Send'}
        </Button>
      </FieldGroup>
    </form>
  )
}
```

Spreading `{...field}` is correct here — that is what the official example does.
The only case needing `value={field.value ?? ''}` is a field whose value can be
`null`/`undefined`, which would flip the input from controlled to uncontrolled.

## Data Table (Sortable + Filter + Pagination)

```bash
shadcn add table                          # styled <table> wrapper, no npm deps
<pkg-manager> add @tanstack/react-table   # not pulled by the CLI; the docs guide uses v9
```

TanStack Table v9 is feature-based: register the features and row models the
table uses with `tableFeatures()`; unregistered ones are tree-shaken, including
filter/sort functions. The core row model is always included. Source:
https://ui.shadcn.com/docs/components/base/data-table (v9 guide). If the
lockfile pins v8 (`useReactTable`, `getCoreRowModel`), keep the v8 dialect
and read `node_modules/@tanstack/react-table/skills/` before migrating.

```tsx
// data-table-features.ts
import {
  columnFilteringFeature, rowPaginationFeature, rowSortingFeature,
  createFilteredRowModel, createPaginatedRowModel, createSortedRowModel,
  filterFn_includesString, sortFn_alphanumeric, sortFn_text, tableFeatures,
} from '@tanstack/react-table'

export const features = tableFeatures({
  columnFilteringFeature, rowPaginationFeature, rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})
export type DataTableFeatures = typeof features
```

```tsx
// data-table.tsx
'use client'
import * as React from 'react'
import { useTable, type ColumnDef, type ColumnFiltersState, type RowData, type SortingState } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { features, type DataTableFeatures } from './data-table-features'

export function DataTable<TData extends RowData>({ columns, data, filterColumn }: {
  columns: ColumnDef<DataTableFeatures, TData>[]; data: TData[]; filterColumn: string
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const table = useTable({
    features, data, columns,
    onSortingChange: setSorting, onColumnFiltersChange: setColumnFilters,
    state: { sorting, columnFilters },
  })

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Filter…"
        value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''}
        onChange={(e) => table.getColumn(filterColumn)?.setFilterValue(e.target.value)}
        className="max-w-sm"
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>{h.isPlaceholder ? null : <table.FlexRender header={h} />}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}><table.FlexRender cell={cell} /></TableCell>
                ))}
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
      </div>
    </div>
  )
}
```

Columns use `createColumnHelper<DataTableFeatures, T>()` with `accessor()` for
data and `display()` for select/actions; a sortable header is a `ghost`
`Button` calling `column.toggleSorting(column.getIsSorted() === 'asc')` with
`<ArrowUpDown data-icon="inline-end" />`. Server-side pagination, sorting, and
filtering (`manualPagination`, `rowCount`) and the URL-as-state pattern belong
to `admin-dashboard`.

## Modal CRUD (Create + Edit)

**Mount it with a `key`.** `useState(item?.name ?? '')` only initialises once, so
reopening the modal on a different row would keep the previous row's values. The
one-line fix lives at the call site:

```tsx
<CrudModal key={editing?.id ?? 'new'} item={editing} open={open} onOpenChange={setOpen} onSave={save} />
```

```tsx
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface Item { id: string; name: string; email: string }

export function CrudModal({ item, open, onOpenChange, onSave }: {
  item?: Item
  open: boolean
  onOpenChange: (v: boolean) => void
  onSave: (data: Omit<Item, 'id'>) => Promise<void>
}) {
  const [name, setName] = useState(item?.name ?? '')
  const [email, setEmail] = useState(item?.email ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await onSave({ name, email })
      toast.success(item ? 'Updated!' : 'Created!')
      onOpenChange(false)
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{item ? 'Edit' : 'Create'} Item</DialogTitle></DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

## Responsive Navigation

```tsx
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ModeToggle } from '@/components/mode-toggle'

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      {/* Tailwind v4 dropped container's center/padding config — be explicit */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <span className="font-bold">Logo</span>
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</a>)}
          <ModeToggle />
        </nav>
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open menu" />}><Menu /></SheetTrigger>
            <SheetContent side="right">
              <SheetHeader><SheetTitle>Menu</SheetTitle></SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                {links.map(l => <a key={l.href} href={l.href} className="text-lg font-medium">{l.label}</a>)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
```

## Settings Page

```tsx
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Base UI Select needs `items` on the root to render the selected label.
const timezones = [
  { label: 'Asia/Jakarta', value: 'asia-jakarta' },
  { label: 'UTC', value: 'utc' },
  { label: 'US/Eastern', value: 'us-eastern' },
]

export function SettingsPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-4 flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Update your display name.</CardDescription></CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Display Name</FieldLabel>
                  <Input id="name" defaultValue="Alex" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                  <Select items={timezones} defaultValue="utc">
                    <SelectTrigger id="timezone"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {timezones.map(tz => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
          <Button onClick={() => toast.success('Settings saved')}>Save changes</Button>
        </TabsContent>
        <TabsContent value="notifications" className="mt-4 flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              {[
                { id: 'email', label: 'Email notifications', desc: 'Receive email updates', default: true },
                { id: 'marketing', label: 'Marketing emails', desc: 'Receive promotional content', default: false },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={item.id}>{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch id={item.id} defaultChecked={item.default} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

## Stats Dashboard Cards

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from 'cn'
import { Users, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react'

const stats = [
  { title: 'Total Users', value: '12,345', change: '+12%', good: true, icon: Users },
  { title: 'Revenue', value: 'Rp 45.6M', change: '+8%', good: true, icon: DollarSign },
  { title: 'Refund rate', value: '2.3%', change: '+0.4%', good: false, icon: TrendingUp },
  { title: 'Orders', value: '1,234', change: '+18%', good: true, icon: ShoppingCart },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
            {/* Colour the delta by the DESIRED direction (refund rate rising is
                bad), keep the +/- sign so the cue is not colour-only, and use
                semantic tokens: define `--success` (light + dark) beside the
                existing `--destructive` and map it in `@theme inline` as
                `--color-success`. No raw palette or manual `dark:`. See
                admin-dashboard §5. */}
            <p className="text-xs text-muted-foreground mt-1">
              <span className={cn('tabular-nums', stat.good ? 'text-success' : 'text-destructive')}>{stat.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

## Date Picker

There is no `date-picker` registry item — `add date-picker` errors out. Compose
it from Popover + Calendar:

```bash
shadcn add calendar popover button   # pulls react-day-picker itself
```

```tsx
'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from 'cn'

export function DatePicker() {
  const [date, setDate] = useState<Date>()

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" className={cn('w-[240px] justify-start text-left font-normal', !date && 'text-muted-foreground')} />}>
        <CalendarIcon data-icon="inline-start" />
        {date ? format(date, 'PPP') : 'Pick a date'}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {/* react-day-picker renamed initialFocus → autoFocus in v9 */}
        <Calendar mode="single" selected={date} onSelect={setDate} autoFocus />
      </PopoverContent>
    </Popover>
  )
}
```

## Combobox (Command + Popover)

The registry ships a dedicated `combobox` item. Run `shadcn docs combobox` and
`shadcn add combobox --dry-run` before choosing; the composition below remains
valid when the project already has `command` + `popover` and no reason to add
Base UI. Whichever you ship, check it against the WAI-ARIA APG combobox
keyboard contract (`ui-validation` references/playwright-checks.md).

```tsx
'use client'
import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from 'cn'

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
]

export function Combobox() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline" role="combobox" className="w-[200px] justify-between" />}>
        {value ? options.find(o => o.value === value)?.label : 'Select framework...'}
        <ChevronsUpDown data-icon="inline-end" className="opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {/* onSelect's argument is lowercased by cmdk, so a mixed-case
                  option value would never match — close over `o` instead. */}
              {options.map(o => (
                <CommandItem key={o.value} value={o.value} onSelect={() => { setValue(o.value === value ? '' : o.value); setOpen(false) }}>
                  <Check className={cn('mr-2 h-4 w-4', value === o.value ? 'opacity-100' : 'opacity-0')} />
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```
