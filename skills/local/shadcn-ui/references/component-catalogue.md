# Component Catalogue

Semua shadcn/ui component — install command, key props, dan gotchas. Lihat https://ui.shadcn.com/docs/components untuk list lengkap.

## Button

```bash
pnpm dlx shadcn@latest add button
```

**Variants**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Sizes**: `default`, `sm`, `lg`, `icon`

```tsx
<Button variant="outline" size="sm" onClick={handleClick}>Save</Button>
<Button variant="ghost" size="icon"><Trash className="h-4 w-4" /></Button>
<Button disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</Button>
<Button asChild><a href="/link">Link Button</a></Button>
```

## Input + Label

```bash
pnpm dlx shadcn@latest add input label
```

```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

**Note**: Saat pakai dengan react-hook-form, jangan spread `{...field}` langsung — pass props individual.

## Card

```bash
pnpm dlx shadcn@latest add card
```

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Body</CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

## Form

```bash
pnpm dlx shadcn@latest add form
pnpm add react-hook-form zod @hookform/resolvers
```

**Key exports**: `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`

Lihat recipes.md untuk contoh lengkap.

## Dialog

```bash
pnpm dlx shadcn@latest add dialog
```

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description text.</DialogDescription>
    </DialogHeader>
    {/* content */}
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={handleSave}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Gotcha**: Override width harus pakai `sm:max-w-*`, bukan `max-w-*`.

## Sheet

```bash
pnpm dlx shadcn@latest add sheet
```

Side panel — mobile navigation atau detail panel.

```tsx
<Sheet>
  <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu /></Button></SheetTrigger>
  <SheetContent side="left">
    <SheetHeader><SheetTitle>Navigation</SheetTitle></SheetHeader>
    {/* nav links */}
  </SheetContent>
</Sheet>
```

**Sides**: `left`, `right`, `top`, `bottom`

## Table

```bash
pnpm dlx shadcn@latest add table
```

Static table. Untuk sortable/filterable, tambah `@tanstack/react-table`.

```tsx
<Table>
  <TableHeader>
    <TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    {rows.map(r => (
      <TableRow key={r.id}>
        <TableCell className="font-medium">{r.name}</TableCell>
        <TableCell><Badge>{r.status}</Badge></TableCell>
      </TableRow>
    ))}
  </TableBody>
  <TableCaption>List of items.</TableCaption>
</Table>
```

## Select

```bash
pnpm dlx shadcn@latest add select
```

```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Choose..." />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Options</SelectLabel>
      <SelectItem value="opt1">Option 1</SelectItem>
      <SelectItem value="opt2">Option 2</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

**Gotcha**: Nilai tidak boleh empty string. Gunakan sentinel `"__any__"`.

## Sonner (Toast)

```bash
pnpm dlx shadcn@latest add sonner
pnpm add sonner
```

Tambah `<Toaster />` ke root layout:

```tsx
import { Toaster } from '@/components/ui/sonner'
// di layout.tsx:
<Toaster richColors position="top-right" />
```

Pakai di mana saja:

```tsx
import { toast } from 'sonner'

toast.success('Saved!')
toast.error('Failed to save')
toast.warning('Low storage')
toast.info('Update available')
toast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Failed.',
})
toast('Custom', { description: 'More detail here', action: { label: 'Undo', onClick: () => undo() } })
```

## Tabs

```bash
pnpm dlx shadcn@latest add tabs
```

```tsx
<Tabs defaultValue="account" className="w-full">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings.</TabsContent>
  <TabsContent value="password">Password settings.</TabsContent>
</Tabs>
```

## Dropdown Menu

```bash
pnpm dlx shadcn@latest add dropdown-menu
```

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleEdit}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
      <Trash className="mr-2 h-4 w-4" />Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Badge

```bash
pnpm dlx shadcn@latest add badge
```

**Variants**: `default`, `secondary`, `outline`, `destructive`

```tsx
<Badge>Active</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="destructive">Overdue</Badge>
<Badge variant="outline">Pending</Badge>
```

## Switch

```bash
pnpm dlx shadcn@latest add switch
```

```tsx
<div className="flex items-center space-x-2">
  <Switch id="notifications" checked={enabled} onCheckedChange={setEnabled} />
  <Label htmlFor="notifications">Enable notifications</Label>
</div>
```

## Skeleton

```bash
pnpm dlx shadcn@latest add skeleton
```

Loading placeholder — pakai shape yang sama dengan konten:

```tsx
// Card skeleton
<div className="flex flex-col space-y-3">
  <Skeleton className="h-[125px] w-full rounded-xl" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-4/5" />
  </div>
</div>
```

## Progress

```bash
pnpm dlx shadcn@latest add progress
```

```tsx
<Progress value={60} className="w-full" />
```

## Popover

```bash
pnpm dlx shadcn@latest add popover
```

```tsx
<Popover>
  <PopoverTrigger asChild><Button variant="outline">Open</Button></PopoverTrigger>
  <PopoverContent className="w-80">
    <p>Popover content here.</p>
  </PopoverContent>
</Popover>
```

## Tooltip

```bash
pnpm dlx shadcn@latest add tooltip
```

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon"><Info className="h-4 w-4" /></Button>
    </TooltipTrigger>
    <TooltipContent><p>Helpful info</p></TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Avatar

```bash
pnpm dlx shadcn@latest add avatar
```

```tsx
<Avatar>
  <AvatarImage src={user.avatarUrl} alt={user.name} />
  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
</Avatar>
```

## Accordion

```bash
pnpm dlx shadcn@latest add accordion
```

```tsx
<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. It follows WAI-ARIA patterns.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it styled?</AccordionTrigger>
    <AccordionContent>Yes. Uses semantic tokens.</AccordionContent>
  </AccordionItem>
</Accordion>
```

## Command (Command Palette)

```bash
pnpm dlx shadcn@latest add command
pnpm add cmdk
```

```tsx
<Command className="rounded-lg border shadow-md">
  <CommandInput placeholder="Type a command..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem><Home className="mr-2 h-4 w-4" />Dashboard</CommandItem>
      <CommandItem><Settings className="mr-2 h-4 w-4" />Settings</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

Biasanya dipakai di dalam Dialog:

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="p-0">
    <Command>...</Command>
  </DialogContent>
</Dialog>
```

## Calendar + Date Picker

```bash
pnpm dlx shadcn@latest add calendar
pnpm add react-day-picker date-fns
```

```tsx
const [date, setDate] = useState<Date>()

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
/>
```

Untuk date picker (Calendar dalam Popover) lihat recipes.md.

## Scroll Area

```bash
pnpm dlx shadcn@latest add scroll-area
```

Scroll dengan custom scrollbar yang konsisten di semua OS:

```tsx
<ScrollArea className="h-72 w-48 rounded-md border p-4">
  {items.map(i => <div key={i} className="py-1">{i}</div>)}
</ScrollArea>
```

## Separator

```bash
pnpm dlx shadcn@latest add separator
```

```tsx
<Separator />
<Separator orientation="vertical" className="h-6" />
```

## Collapsible

```bash
pnpm dlx shadcn@latest add collapsible
```

```tsx
<Collapsible open={isOpen} onOpenChange={setIsOpen}>
  <CollapsibleTrigger asChild>
    <Button variant="ghost">Toggle <ChevronsUpDown className="ml-2 h-4 w-4" /></Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <p>Hidden content here.</p>
  </CollapsibleContent>
</Collapsible>
```

## Resizable

```bash
pnpm dlx shadcn@latest add resizable
```

Resizable panels — cocok untuk split view / IDE-like layout:

```tsx
<ResizablePanelGroup direction="horizontal" className="min-h-[200px] rounded-lg border">
  <ResizablePanel defaultSize={50}>
    <div className="p-4">Left panel</div>
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={50}>
    <div className="p-4">Right panel</div>
  </ResizablePanel>
</ResizablePanelGroup>
```

## Breadcrumb

```bash
pnpm dlx shadcn@latest add breadcrumb
```

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="/docs">Docs</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Components</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Pagination

```bash
pnpm dlx shadcn@latest add pagination
```

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
    <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationEllipsis /></PaginationItem>
    <PaginationItem><PaginationNext href="#" /></PaginationItem>
  </PaginationContent>
</Pagination>
```
