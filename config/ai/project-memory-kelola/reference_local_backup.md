---
name: local-backup-setup
description: Mac pulls kelola DB dumps + full uploads mirror 3x daily via launchd com.kelola.backup-fetch; log ~/kelola-backups/fetch.log
metadata: 
  node_type: memory
  type: reference
  originSessionId: 4f4914ea-7c75-4398-b8ed-ea2a10af6730
---

Backup lokal kelola di Mac user (setup 2026-07-29):

- **Script:** `kelola/scripts/backup-fetch.sh` (di repo, commit ea8ed50). Dua bagian: (1) pull dump DB `kelola-*.sql.gz.gpg` dari server `~/kelola-backups` (retensi lokal 30 file, `--all` untuk backfill); (2) **mirror uploads** `rsync -a` dari `server:/data/uploads/` → `~/kelola-backups/uploads/` — TANPA `--delete` (file terhapus di server tetap tersimpan lokal).
- **Jadwal:** launchd `~/Library/LaunchAgents/com.kelola.backup-fetch.plist`, label `com.kelola.backup-fetch`, jam **09:00 / 13:00 / 21:00** (3× supaya tak bolong saat Mac tidur; script idempoten).
- **Log:** `~/kelola-backups/fetch.log`. Server-side: cron `30 3 * * *` menjalankan `kelola/deploy/backup.sh` (pg_dump → gzip → GPG ke pubkey; private key di Mac user).
- **Gotcha:** error "cannot ssh (need passwordless key)" di log bisa berarti server yang bermasalah (2026-07-28/29 penyebabnya disk server 100% penuh, bukan kunci). Key `~/.ssh/id_ed25519` tanpa passphrase, batch mode OK.
- Mirror uploads = pengaman utama kalau volume `/data` (billing bulanan, expire 29 Aug 2026) lapse — lihat [[disk-uploads-growth]].
