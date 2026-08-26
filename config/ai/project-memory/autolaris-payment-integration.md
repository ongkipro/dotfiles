---
name: autolaris-payment-integration
description: "AutoLaris payment gateway in TokoΦ — base/auth/create_payment contract, channels, key location, config-in-super-admin + storefront checkout flow"
metadata: 
  node_type: memory
  type: reference
  originSessionId: a3473a68-f7cb-4f46-aa14-c07821480525
---

AutoLaris = the single platform-managed **payment gateway** (PSP) in [[tokophi-project]], mirroring the [[kiriminaja-integration]] shipping pattern (config in super-admin, client just uses it). Docs repo: `ongkipro/autolaris-payment-gateway` (public — Create Payment VA/QRIS/DANA + callback).

**API:** base `https://api-h2h.autolaris.com` (same for prod/dev, use dev key). Auth `Authorization: Bearer <key>` + `Content-Type: application/json`. Key in **gitignored** `.env.local` as `AUTOLARIS_API_KEY` / `AUTOLARIS_BASE` (dev key not committed). Dashboard: seller.autolaris.com; prod needs IP whitelist.

**Create Payment** — `POST /api/h2h/create_payment`:
- Body: `{reff_id, channel_code, customer_id, customer_name, customer_phone, customer_email, expired (YYYYMMDDHHMMSS), amount (string), callback_url}`.
- Response: `{rc:"00", ket, data:{trx_id, virtual_account, qr, payment_code, url, amount, admin, total}}` — `total = amount + admin` (admin fee added by AutoLaris, e.g. Rp3000 QRIS / Rp6500 VA). Fill the non-empty field per channel: `VA*`→virtual_account, `QRIS`→qr, `DANA`→url/payment_code.
- Channels: `QRIS`, `VABCA`, `VAMANDIRI`, `VABNI`, `VABRI`, `VABSI`, `VAPERMATA`, `DANA`.
- Status lifecycle: PENDING → PAID (via callback) / EXPIRED. Callback = partner endpoint receives POST, match by trx_id/reff_id, reply 200.

**DONE (2026-07-08, commit 503e8bb):** `gateway_provider` enum += `autolaris` (migration 0016), seed = only AutoLaris (dropped Midtrans/Xendit/Duitku); `payments` table extended. `apps/admin/lib/autolaris.ts` client + super-admin "Test koneksi" (`alTestConnection`). Storefront checkout: channel picker → public no-auth `apps/admin/app/api/public/pay` (proxy, key server-side) → sukses page shows real VA/QRIS instruction. Callback `.../pay/callback` marks paid (needs public URL → prod). Verified E2E: VA BCA → real VA `15514...`, total incl. admin fee.

**Full commerce loop DONE (commit e1cf894):** storefront checkout `/api/public/order` creates a real order (upsert customer + `orders` + `order_line_items`) + a linked AutoLaris payment (`WEB-…` number); the order shows in the merchant admin; the `/api/public/pay/callback` marks the payment `berhasil` + syncs the order to `financialStatus=dibayar`. Admin order detail also has "Buat Tagihan" (`createOrderPayment`) + real payment display (`getOrderPayment`). **Still open:** callback signature verification; line-item `variantId` resolution; stock decrement on order.

**AL-ORDER (2026-08-24, owner ruling): payment creation moved to `POST /api/h2h/submit` (Create Order) with `courir_id: 1`** — a DIGITAL order in the AutoLaris CMS (AutoLaris = gateway only; all shipping = KiriminAja). Probed live: `channel_code` REQUIRED (without → rc=01); origin/dest/dims required even for digital (dummies OK, biaya_kirim 0); payment instruction in `payment_info` (`va`/`qr`/`url`); **`total` = `grand_total`** — provider admin fee (VABCA 6.500, QRIS 0,7%) nets against settlement, NOT added to the buyer total (create_payment behaved differently). Client fn `alCreateOrder()`; 3 callers switched (checkout, subscription billing, super-admin manual invoice); `pay/callback` accepts both id eras (`trx_id` ∥ `transaction_id`). Vendor field really is spelled `courir_id`.

