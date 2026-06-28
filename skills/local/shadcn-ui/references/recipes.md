# Component Recipes

Pola lengkap siap pakai — copy, sesuaikan data.

## Contact Form

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'At least 10 characters'),
})

export function ContactForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', message: '' },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
      toast.success('Message sent!')
      form.reset()
    } catch {
      toast.error('Failed to send message')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl><Input value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input type="email" value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="message" render={({ field }) => (
          <FormItem>
            <FormLabel>Message</FormLabel>
            <FormControl><Textarea value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </Form>
  )
}
```

## Data Table (Sortable + Filter + Pagination)

```bash
pnpm dlx shadcn@latest add table
pnpm add @tanstack/react-table
```

```tsx
import { useState } from 'react'
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, getPaginationRowModel,
  flexRender, type ColumnDef, type SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function DataTable<T>({ columns, data }: { columns: ColumnDef<T>[]; data: T[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data, columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className="space-y-4">
      <Input placeholder="Search..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id}>
                {hg.headers.map(h => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : (
                      <Button variant="ghost" size="sm" onClick={h.column.getToggleSortingHandler()} className="-ml-3">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={columns.length} className="text-center h-24 text-muted-foreground">No results.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{table.getFilteredRowModel().rows.length} result(s)</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
          <span className="flex items-center px-2">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
        </div>
      </div>
    </div>
  )
}
```

## Modal CRUD (Create + Edit)

```tsx
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
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
      <div className="container flex h-14 items-center justify-between">
        <span className="font-bold">Logo</span>
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</a>)}
          <ModeToggle />
        </nav>
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button></SheetTrigger>
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Update your display name.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" defaultValue="Alex" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asia-jakarta">Asia/Jakarta</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="us-eastern">US/Eastern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <Button onClick={() => toast.success('Settings saved')}>Save changes</Button>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-4">
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
import { Users, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react'

const stats = [
  { title: 'Total Users', value: '12,345', change: '+12%', icon: Users },
  { title: 'Revenue', value: 'Rp 45.6M', change: '+8%', icon: DollarSign },
  { title: 'Growth', value: '23%', change: '+4%', icon: TrendingUp },
  { title: 'Orders', value: '1,234', change: '+18%', icon: ShoppingCart },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">{stat.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

## Date Picker

```bash
pnpm dlx shadcn@latest add calendar popover button
pnpm add react-day-picker date-fns
```

```tsx
'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function DatePicker() {
  const [date, setDate] = useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('w-[240px] justify-start text-left font-normal', !date && 'text-muted-foreground')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : 'Pick a date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
```

## Combobox (Command + Popover)

```tsx
'use client'
import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

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
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-[200px] justify-between">
          {value ? options.find(o => o.value === value)?.label : 'Select framework...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options.map(o => (
                <CommandItem key={o.value} value={o.value} onSelect={(v) => { setValue(v === value ? '' : v); setOpen(false) }}>
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
