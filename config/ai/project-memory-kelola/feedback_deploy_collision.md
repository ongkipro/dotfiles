---
name: deploy-collision-recovery
description: Deploy paralel (SSH + GH Actions) di dir server yang sama merusak node_modules → backend 502; cara pulih
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8f2da746-5aac-4aba-81b9-623041dc8131
  modified: 2026-07-29T05:50:06.644Z
---

deploy.sh jalan di satu direktori tetap (`~/kelola`). Kalau DUA deploy jalan bersamaan — mis. SSH manual + GH Actions auto-deploy, atau dua sesi agent — `npm ci` keduanya saling menimpa `node_modules` → error `ENOTEMPTY rmdir` / `TAR_ENTRY_ERROR ENOENT`, dan cache npm (`~/.npm/_cacache`) ikut korup. Akibat terburuk: backend crash-loop `ERR_MODULE_NOT_FOUND: node_modules/.bin/tsx` → PM2 "online" tapi `/api` balas **502** (web tetap 200, jadi seakan cuma API mati).

**Tanda lain (web/next korup, 2026-06-04):** `web/node_modules/next` ikut korup → `next build` gagal **`FATAL: TurbopackInternalError: Expected contexts directory to be a directory, found: node_modules/next/dist/server/route-modules/pages/vendored/contexts`**. GH deploy gagal terus walau `npm ci` "up to date in 4s" (npm kira sudah sinkron, padahal isinya rusak). Gejala server: `pm2 list` menunjukkan `kelola-web` & `kelola-backend` **crash-loop** (↺ ribuan, uptime detik) — tapi web tetap 200 karena yang dilayani build LAMA (pm2 reload cuma jalan setelah build sukses). Fix: hapus paksa `web/node_modules` + `web/.next` lalu clean reinstall (npm "up to date" tak akan benerin sendiri).

**Why:** Kejadian 2026-06-02 — push beruntun dari sesi paralel memicu banyak GH deploy yang saling cancel + SSH deploy manual bertabrakan. Disk/inode aman (bukan itu); akar masalahnya konkurensi + cache npm korup.

**How to apply:**
- JANGAN jalankan SSH `deploy.sh` manual kalau GH Actions kemungkinan juga deploy. Cek dulu: `gh run list --workflow=deploy.yml --limit 3` (tidak ada `in_progress`) DAN di server `pgrep -af "deploy.sh|npm ci|next build"` kosong.
- Recovery saat node_modules korup (502 / tsx not found / Turbopack contexts error), lakukan saat TIDAK ada proses lain. **JANGAN `pm2 stop all`** — server juga jalan `simantep` & `tatacuan-bot` yg TIDAK ada di ecosystem.config.cjs kelola, jadi deploy.sh gak akan nyalain ulang. Stop HANYA kelola:
  `pm2 stop kelola-web kelola-backend; rm -rf ~/kelola/backend/node_modules ~/kelola/web/node_modules ~/kelola/web/.next; cd ~/kelola && bash deploy.sh`
  (jangan sentuh `~/.npm/_cacache` kecuali memang lihat error `_cacache/content-v2` — `npm cache clean --force` separuh jalan malah bikin ENOENT. Lihat [[reference_deploy]].)
- Verifikasi pulih: `curl localhost:3101/health` (harus `{ok:true}`) + `curl -o/dev/null -w "%{http_code}" https://kelolatim.com/api/public/site-verification` (harus 200, bukan 502). (Domain lama kelola.simantep.id kini 301 → kelolatim.com, jangan dipakai untuk verifikasi.)
- Karena deploy `git reset --hard origin/main`, deploy sukses MANA PUN memuat semua commit di main — fix kita ikut terkirim begitu satu deploy hijau. Lihat [[feedback_auto_deploy]].
