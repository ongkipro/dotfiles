---
name: volumform-id-market-ux
description: Volumform DR-funnel SaaS — Indonesian COD market UX conventions + deferred features
metadata: 
  node_type: memory
  type: project
  originSessionId: 49b7b3fa-2042-4904-b100-c5baa31f11dc
---

Volumform = multi-tenant SaaS untuk direct-response funnel Indonesia (landing + order form + CRM + Meta tracking + shipping KiriminAja/Mengantar). Repo `~/Projects/volumform` (pnpm monorepo: apps/{admin,superadmin,edge} + packages). Client admin & super admin = 2 SPA terpisah.

Riset pasar (2026-07-09, sumber: Scalev, OrderOnline.id, KiriminAja, Mengantar, Toko Order) menetapkan konvensi UX COD Indonesia yang sudah/akan diterapkan:
- **WhatsApp = aksi #1** — `lib/wa.ts` + `<WaButton>` sudah ada (wa.me `62…`, template Konfirmasi/Follow-up/Dikirim+resi/COD). Terpasang di Pesanan/Pelanggan/OrderDetail.
- **Label status Bahasa Indonesia** — `statusLabel` di `lib/format.tsx` (Baru/Dihubungi/Dikonfirmasi/Diproses/Dikirim/Selesai/Batal). Ubah status 1-klik inline di baris Pesanan.

**Sudah dibangun (migrasi 0002, verified live):**
- **Status Bayar terpisah** (`orders.payment_status` unpaid/paid) — toggle 1-klik; COD **auto-lunas** saat status→delivered (server-side).
- **Status `retur`** (COD gagal) di enum ORDER_STATUS + tab + dropdown.
- **Assign order ke CS** — kolom CS + dropdown anggota (admin), filter "Pesanan saya" (`GET /orders?assigned=me`). `PATCH /orders/:id` terima status·paymentStatus·assignedUserId.

**Sudah (migrasi 0003):** Template pesan WA **editable per tenant** (`tenants.wa_templates_json`, Pengaturan → Pesan WA) dengan placeholder `{nama}{order}{total}{items}{resi}{kurir}{toko}`; `lib/wa.ts` = `renderTemplate` + `DEFAULT_WA_TEMPLATES`; `<WaButton>` baca via `useTenant`. PageEditor bisa tambah/hapus section. Super admin Audit → DataTable.

**Sudah (migrasi 0004):** `orders.shipping_address` (order manual & funnel simpan alamat; detail fallback dari submission). **Cetak label** thermal 100×150mm (`lib/print-label.ts`, tombol di OrderDetail). Dashboard chip **COD belum lunas** (Rp + jumlah).

**Sudah:** Halaman **Follow-up** (`/followup`) — worklist grup Belum dihubungi/Menunggu konfirmasi/Belum bayar-COD, aksi WA + 1-klik, tanpa scheduler (dari data order). Menu "Follow Up" (WAJIB riset) beres.

**Deferred (belum dibangun, bernilai tinggi):**
- Auto follow-up WA **otomatis/terjadwal** (FU1–4 kirim sendiri) — butuh scheduler/queue + WABA (`job_runs` ada, worker belum). Halaman Follow-up manual sudah ada.
- Settlement/pencairan COD real (tarik dari API KiriminAja/Mengantar), laporan keuangan.
- Retur belum auto-set payment (retur = barang balik; payment tetap unpaid — sudah benar).

Aturan: jangan mengarang API shipping — verifikasi ke docs resmi. Rotate token KiriminAja/Mengantar saat deploy.
