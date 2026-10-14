# Data Visualization Encoding & Print/Document UI Specifications

This reference owns quantitative chart encoding (mark specs, direct labels,
tooltip contracts, sequential/diverging ramps, and e-commerce/SaaS analytical
archetypes) and `@media print` / commercial document layouts (invoices, HRIS
payslips, and A6/100×150mm thermal waybills).

---

## 1. Quantitative Encoding, Axes & Tooltip Contracts

### Axis & Baseline Discipline

- **Bar, Column & Area Marks**: y-axis **must start at `0`**. Encoding magnitude
  by bar length/area with a truncated baseline visually falsifies ratios.
- **Line Marks (Rate, Margin %, AOV, Latency)**: may use a bounded non-zero
  y-axis range when small basis-point shifts matter, provided the y-axis ticks
  are explicitly labeled and at least 3 gridlines anchor the scale.
- **Axis Tick Formatting (`tabular-nums`)**:
  - Apply `font-variant-numeric: tabular-nums` to all axis labels, legends, and
    tooltip values.
  - Abbreviate axis ticks (`Rp 12,5 jt`, `Rp 1,4 M`, `RM 45k`, `12.4k`) so the
    y-axis column stays narrow (`<= 56px` on mobile), while showing the **exact
    unrounded figure** in the tooltip (`Rp 12.540.000`).
- **Time-Axis Timezone Contract**:
  - Label the reporting timezone once in the chart header or subtitle (`WIB /
    UTC+7` or `MYT / UTC+8`) and bucket daily series by the merchant's local
    midnight, never raw UTC midnight (`07:00 WIB`).

### Direct Labels, Legends & Secondary Non-Color Cues

- **1 Series**: no legend; the card title and subtitle state the metric and unit.
- **2–4 Series**: prefer **direct end-of-line labels** on desktop or a compact
  inline top-right legend (`flex items-center gap-3 text-xs`) so the eye does not
  shuttle between a bottom legend and the plot area.
- **Secondary Non-Color Cues (WCAG 1.4.1)**:
  - Current period = solid stroke (`strokeWidth={2}`); comparison/previous period
    = dashed stroke (`strokeDasharray="4 4"`, `strokeWidth={1.5}`) in muted ink.
  - Threshold/SLA target = horizontal `<ReferenceLine>` with an inline text label
    (`Target SLA 95%`), never an unlabeled colored line.

### Sequential & Diverging Color Ramps (Heatmaps & Cohorts)

When encoding density or retention % in a table heatmap or choropleth:
- **Sequential (0% → 100% Retention / Utilization)**: vary OKLCH lightness (`L`)
  monotonically (`L = 0.96 -> 0.38` in light mode; `L = 0.22 -> 0.72` in dark
  mode) along a single hue (`H = 250deg` blue or `H = 160deg` emerald).
- **Diverging (Negative vs Positive Margin / Variance vs Budget)**: use a neutral
  midpoint (`L = 0.96` light / `L = 0.20` dark at `0%`) stepping toward
  terracotta/red (`H = 25deg`) for negative and teal/blue (`H = 215deg`) for
  positive — never red-vs-green alone without `+`/`-` signs in every cell.
- **Cell Text Contrast Lock**: switch cell text color from `--foreground` to
  white/dark-canvas automatically once cell fill crosses `L = 0.58` so every
  number remains `>= 4.5:1` AA.

---

## 2. High-Signal Business Chart Archetypes

1. **COD Reconciliation & Cashflow Waterfall (Indonesian Commerce)**:
   - Visualizes how Gross GMV converts to Net Disbursed Cash:
     `Gross Order GMV` → `(-) Cancelled / Unconfirmed` → `(-) In-Transit COD` →
     `Delivered COD Collected` → `(-) Ongkir & COD Fee` → `(-) RTS Return Shipping Loss` →
     `(=) Net Cair ke Saldo`.
   - Each step shows both `Rp` nominal and `% of GMV`.
2. **Cohort Retention Matrix (HTML `<table>` Heatmap, Not Canvas)**:
   - Rows = Acquisition Cohort (`Jan 2026`, `Feb 2026`, …) + initial cohort size `N`.
   - Columns = `M0`, `M1`, `M2`, … with `%` primary text and `tabular-nums` count
     on hover/secondary line.
3. **Fulfilment & Funnel Step-Down**:
   - Horizontal or step bar showing `stage count`, `step conversion %` (from
     previous step), and `cumulative conversion %` (from top of funnel) so
     operators immediately spot the leaking stage.

---

## 3. Print, PDF, Invoice, Payslip & Thermal Waybill UI (`@media print`)

Admin systems (`kelola` HRIS, ERP, B2B invoicing, logistics consoles) routinely
print or save-to-PDF directly from the browser (`window.print()`).

### Global `@media print` Stylesheet Rules

1. **Hide Application Chrome (`print:hidden`)**:
   - Sidebar, topbar, breadcrumbs, filter toolbars, pagination controls, toast
     containers, floating chat widgets, and action buttons (`Cetak`, `Export`,
     `Edit`) must have `print:hidden` (`@media print { display: none !important; }`).
2. **Ink & Surface Reset (No Dark Mode on Paper)**:
   - Force `:root` print surface to pure white (`#ffffff`) and primary text to
     pure black (`#000000`) with `#d4d4d8` hairline borders.
   - Remove `box-shadow`, `backdrop-filter`, and decorative background fills so
     ink/toner is not wasted and thermal printers do not dither grey backgrounds.
3. **Pagination & Page-Break Integrity**:
   - Repeat table headers across page breaks: `thead { display: table-header-group; }`
     and `tfoot { display: table-footer-group; }`.
   - Prevent awkward splits: `tr, .print-keep-together, .signature-block, .invoice-totals { break-inside: avoid; page-break-inside: avoid; }`.
   - Expand scroll containers: override `overflow-x: auto` / `max-height` to
     `overflow: visible !important; height: auto !important;` in `@media print` so
     scrollable tables are not clipped to the viewport height.

### Indonesian Commercial Document Layouts

| Document Type | `@page` Geometry | Mandatory Layout & Field Hierarchy |
| :--- | :--- | :--- |
| **B2B Invoice / Faktur Tagihan** (`A4`) | `@page { size: A4 portrait; margin: 12mm; }` | Header: Seller logo, legal entity (`PT/CV`), address, `NPWP`. Metadata: `No. Invoice`, `Tanggal Terbit`, `Jatuh Tempo`, `Status (LUNAS / BELUM BAYAR)`. Line table: `No`, `Deskripsi / SKU`, `Qty`, `Harga Satuan`, `Diskon`, `Subtotal` (`tabular-nums`). Totals box: `DPP`, `PPN 11%` (when PKP), `Biaya Pengiriman`, **Grand Total** + *Terbilang* line + Bank VA/Rekening & signature block (`break-inside: avoid`). |
| **HRIS Payslip / Slip Gaji** (`A4` or `A5`) | `@page { size: A4 portrait; margin: 10mm; }` | Employee header: `Nama`, `NIK/NIP`, `Jabatan`, `Departemen`, `Periode Gaji`, `Status PTKP (TK/0, K/1, …)`. Two-column split: **Pendapatan** (`Gaji Pokok`, `Tunjangan Tetap/Kehadiran`, `Lembur`) vs **Potongan** (`BPJS Kesehatan 1%`, `BPJS Ketenagakerjaan JHT 2% + JP 1%`, `PPh 21`, `Kasbon/Absensi`). Prominent **Take Home Pay (THP)** bar + digital verification timestamp. |
| **Shipping Thermal Waybill / Label Resi** (`A6` / `100×150mm`) | `@page { size: 100mm 150mm; margin: 3mm; }` | High-contrast monochrome (`100% black #000 on #fff`, zero grey shading that blurs thermal heads). Top zone: Courier code + Service (`REG`/`CARGO`) + 1D/2D Barcode (`Nomor Resi / AWB` in `14pt+` mono). **COD Callout Box**: if COD, render a thick `2.5px solid #000` box reading **`COD: Rp XX.XXX`** in `18pt–22pt` bold; if Non-COD, render **`NON-COD (SUDAH DIBAYAR)`**. Address zone: Recipient `Nama + No. HP` (`12pt bold`), `Kecamatan, Kab/Kota, Kode Pos` in uppercase bold, full street + `Patokan`. Bottom zone: Compact item list (`SKU × Qty`), weight (`gr/kg`), and `Order ID`. |
