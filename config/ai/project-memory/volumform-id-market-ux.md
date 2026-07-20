---
name: volumform-id-market-ux
description: Volumform DR-funnel SaaS — Indonesian COD market UX conventions + deferred features
metadata: 
  node_type: memory
  type: project
  originSessionId: 49b7b3fa-2042-4904-b100-c5baa31f11dc
---

Volumform = multi-tenant SaaS for Indonesian direct-response funnels (landing + order form + CRM + Meta tracking + KiriminAja/Mengantar shipping). Repo `~/Projects/volumform` (pnpm monorepo: apps/{admin,superadmin,edge} + packages). Admin client & super admin = 2 separate SPAs.

Market research (2026-07-09, sources: Scalev, OrderOnline.id, KiriminAja, Mengantar, Toko Order) established the Indonesian COD UX conventions that are/will be applied:
- **WhatsApp = action #1** — `lib/wa.ts` + `<WaButton>` already exist (wa.me `62…`, templates Konfirmasi/Follow-up/Dikirim+resi/COD). Installed on Pesanan/Pelanggan/OrderDetail.
- **Indonesian status labels** — `statusLabel` in `lib/format.tsx` (Baru/Dihubungi/Dikonfirmasi/Diproses/Dikirim/Selesai/Batal). Change status inline with 1 click on the Pesanan row.

**Already built (migration 0002, verified live):**
- **Separate payment status** (`orders.payment_status` unpaid/paid) — 1-click toggle; COD **auto-settles** when status→delivered (server-side).
- **`retur` status** (COD failed) in the ORDER_STATUS enum + tab + dropdown.
- **Assign an order to CS** — CS column + member dropdown (admin), "Pesanan saya" filter (`GET /orders?assigned=me`). `PATCH /orders/:id` accepts status·paymentStatus·assignedUserId.

**Done (migration 0003):** WA message templates **editable per tenant** (`tenants.wa_templates_json`, Pengaturan → Pesan WA) with placeholders `{nama}{order}{total}{items}{resi}{kurir}{toko}`; `lib/wa.ts` = `renderTemplate` + `DEFAULT_WA_TEMPLATES`; `<WaButton>` reads via `useTenant`. PageEditor can add/remove sections. Super admin Audit → DataTable.

**Done (migration 0004):** `orders.shipping_address` (manual orders & funnel store the address; detail falls back from the submission). **Thermal label print** 100×150mm (`lib/print-label.ts`, button in OrderDetail). Dashboard chip **COD belum lunas** (Rp + count).

**Done:** **Follow-up** page (`/followup`) — worklist grouped by Belum dihubungi/Menunggu konfirmasi/Belum bayar-COD, WA + 1-click actions, no scheduler (from order data). The "Follow Up" menu (research REQUIRED) is done.

**Deferred (not built yet, high value):**
- **Automatic/scheduled** WA auto follow-up (FU1–4 send themselves) — needs a scheduler/queue + WABA (`job_runs` exists, worker doesn't yet). The manual Follow-up page already exists.
- Real COD settlement/disbursement (pull from the KiriminAja/Mengantar API), financial reports.
- Retur doesn't auto-set payment yet (retur = goods returned; payment stays unpaid — which is correct).

Rule: don't invent the shipping API — verify against official docs. Rotate the KiriminAja/Mengantar token on deploy.
