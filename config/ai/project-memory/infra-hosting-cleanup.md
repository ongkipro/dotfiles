---
name: infra-hosting-cleanup
description: "Snapshot infra hosting ongki (2026-07-08) — Cloudflare = host utama de-facto, Vercel sekunder; 4 dashboard inventaris di ~/Documents; 2 Vercel yatim belum dihapus"
metadata: 
  node_type: memory
  type: project
  originSessionId: 794d2396-a1a0-4513-a72c-d3d6e3aa3c2c
---

Hasil audit + cleanup multi-host (2026-07-08). Angka = snapshot, bisa berubah.

## Host de-facto
- **Cloudflare = host utama** (~30 custom domain serve dari CF; akun `<cf-account-email>`, id `<cloudflare-account-id>`, workers.dev subdomain `ongki`). Storefront/campaign + situs commerce inti di sini (dealerhinoofficial.com, dealerfoton.com, jasawebsite.co, pixsgo.com, petcue.co, homelook.shop, petanisejahtera.com + subdomain campaign).
- **Vercel = sekunder** (~5 domain: ongki.pro, rtqalhadi.com, halotani.com, halonainaja.com, report apps). Akun scope `ongkipro`/team ongki-project.

## Angka pasca-cleanup 2026-07-08
- Vercel: **76 → 12** project. GitHub: **59 → 38** repo. Cloudflare: **44 → 34** unit (30 workers + 4 pages).

## Dashboard inventaris (HTML interaktif di ~/Documents)
`vercel-inventory-2026-07-07.html` (stale 13, aktual 12) · `github-repo-inventory-2026-07-08.html` · `cloudflare-inventory-2026-07-08.html` · **`domain-map-2026-07-08.html`** (peta domain→host→repo, capstone). Generator ada di scratchpad sesi; pola: fetch CLI/API → probe HTTP → HTML dark + generator perintah hapus.

## Belum beres (pending)
- **2 Vercel "split-brain" yatim** (domain dilayani Cloudflare, deploy Vercel mubazir): project `jwco` (jasawebsite.co) & `petanisejahtera` (petanisejahtera.com). Aman dihapus → Vercel jadi 10, domain-map 0 konflik. User minta tahan dulu.
- Portofolio front-door belum: profile README repo `ongkipro` (masih 1KB) + pin 6 repo (rencana di dotfiles `docs/github-account-cleanup-plan.md`).

## Catatan teknis
- wrangler tak punya perintah list-all-workers → pakai CF API. Token OAuth di `~/.config/.wrangler/config/default.toml` sempat expired; di-refresh via OAuth client wrangler (`54d11594-...`) & ditulis balik 2026-07-08. Kalau expired lagi, refresh ulang / `wrangler login`.
- Delete: Vercel `vercel project rm <name>` butuh `echo y |` (flag --yes tidak ada di v54). Wrangler `wrangler delete --name <w>` auto-yes non-interactive; pages `wrangler pages project delete <n> --yes`.
