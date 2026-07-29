---
name: tatacuan-api-response-shape
description: "Real fields returned by Tatacuan metrics/ads summary endpoints + the net-profit \"biaya lain\" quirk"
metadata: 
  node_type: memory
  type: reference
  originSessionId: a2576a0d-1588-4926-b7b1-0be7126c716c
---

Tatacuan finance integration (base `https://tatacuan.com`, Bearer token in `workspace_integration.headersEncrypted`). Two endpoints, both `?from=YYYY-MM-DD&to=YYYY-MM-DD`, response shape `{ period, filters, metrics: {...} }`.

`/api/v1/metrics/summary` → `metrics`: `orders, quantitySold, revenue, cogs, platformFees, grossProfit, netProfit, averageOrderValue, adsCost, roas, grossMarginPct, netMarginPct`.

`/api/v1/ads/summary` → `metrics`: `campaigns, impressions, clicks, conversions, unitsSold, cost, gmv, ctr, cvr, cpc, cpa, roasFromGmv, roasFromOrders, orderRevenue, acos`.

`/api/v1/finance/pnl?from=&to=` → the PROPER profit-loss statement (response under `statement`, plus `counters`). Fields: `revenue, cogs, grossProfit, grossMarginPct, platformFees, marketing, operatingExpenses, totalOperatingExpenses, operatingProfit, operatingMarginPct, netProfit, netMarginPct`. This is the authoritative breakdown source — it has `operatingExpenses` (manual journal entries to expense accounts = gaji/sewa/operasional) which `/metrics/summary` lacks. Cascade is exact: `platformFees + marketing + operatingExpenses = totalOperatingExpenses`, and `grossProfit − totalOperatingExpenses = operatingProfit`. (Other candidate paths like `/finance/profit-and-loss` 404.) `netProfit` is computed at transaction-level (revenue−cogs−fees+adjustments) so it differs slightly from operatingProfit (May 2026: opProfit 522M vs netProfit 420M; the ~102M gap is retur/adjustments). For the FULLEST CoA-based report Tatacuan says use `/api/laporan` via session login — NOT available with the API token.

`/api/v1/geo/provinces?from=&to=` → sales-by-province list. Response: `{ period, filters, totals: {provinces, revenue}, provinces: [{province, orders, quantitySold, revenue, grossProfit, netProfit, revenueSharePct}] }` (sorted by revenue desc, ~50 provinces). Exposed to AI via `tatacuan_geo` tool (`fetchTatacuanGeo`, top-N default 10). No city-level endpoint found (`geo/cities`/`geo/city` 404).

`/api/v1/geo/rts?from=&to=` → RTS (Return to Sender / paket retur) per province. NOTE: this 404'd on first probe but became live shortly after (Tatacuan enabled it). Response: `{ period, filters: {groupBy:"province"}, totals: {orders, rts, rtsBerjalan, rtsTotal, rtsRevenue, rtsRatePct, rtsPengiriman, rtsPengirimanRevenue, rtsCancelResi, rtsCancelResiRevenue}, provinces: [{province, orders, rts, rtsBerjalan, rtsTotal, rtsRevenue, rtsRatePct, rtsRevenueSharePct}] }`. `rtsRatePct` = return rate; cause split in totals = cancelResi vs pengiriman. Exposed via `tatacuan_rts` tool (`fetchTatacuanRts`).

`/api/v1/live/sessions` → live-streaming (TikTok/Shopee Live) analytics: `{ period, filters:{creator,host,groupBy}, summary:{...~30 numeric fields: sessions, durasiMin, gmvTotal/gmvLive, gmvPerHour, avgGmvPerSession, produkTerjual, pemesanan, pembeliUnik, penonton, liveStreamDilihat, komentar, sukaPadaLive, liveDibagikan, pengikutBaru, klikProduk, ctrPct, ctorPct, adCost, adGmv, adRoas, gmvRoas...}, sessions:[{id, waktuLive, kreator, liveTitle, durasiMin, gmvTotal, produkTerjual, penonton, komentar, adRoas...}] }`. from/to DO filter; if omitted → all-time. Session list capped at 100 by API. Live data is sparse (May 2026 = 0 sessions, April = 160, all-time = 447). Exposed via `tatacuan_live` tool (`fetchTatacuanLive`) — defaults to all-time when no period given.

`/api/v1/runrate` → run-rate projection + the MOST COMPLETE P&L breakdown. `{ period:{from,to,days}, filters:{platform,storeId,brand,adType}, totals:{netSales, cogs, grossProfit, grossMarginPct, admin, adminRatioPct, affiliate, affiliateRatioPct, retur, returRatioPct, opex, opexRatioPct, marketingCost/actualMarketingCost/estimatedMarketingCost, marketingRatioPct, netProfit, netMarginPct}, projection:{basisDays, dailyAvg/monthly/annual each {netSales,grossProfit,netProfit}}, opex:{effectiveOpex,source,ratePct}, settings:{adminShopee,returShopee,affiliateShopee,adminTiktok,...,biayaOperasional,marketingTax,excludedStatuses}, daily:[per-day...] }`. This is the only endpoint that separates **affiliate** and **opex (operasional)** as explicit line items — finally answers the user's original "net profit udah dipotong admin/affiliate/operasional?" question. from/to filter; omit → all data (149-day basis). Exposed via `tatacuan_runrate` tool (`fetchTatacuanRunrate`) — defaults to all-data; daily[] array excluded from tool output to keep it compact.

Integration (as of Jun 2026): `tatacuan_summary` AI tool fetches `/finance/pnl` and prints the exact cascade (with operatingExpenses); `fetchTatacuanSummary` returns `pnl` (clean statement) + `raw` (full passthrough, `ads_*`/`pnl_*` prefixed). Curated `TATACUAN_METRICS` includes operatingExpenses/totalOperatingExpenses/operatingProfit/operatingMarginPct (urlTemplate=PNL, jsonPath=`statement.*`).

Earlier code had several WRONG jsonPaths (`metrics.totalCost`, `metrics.totalProducts`, `metrics.totalCustomers`, `metrics.newCustomers` — none exist); fixed to `cogs`/`quantitySold` and dropped the customer fields. Metric defs live in [[reference_deploy]] repo at `backend/src/lib/tatacuan.ts` (mirrored in `web/lib/integration-presets.ts`).
