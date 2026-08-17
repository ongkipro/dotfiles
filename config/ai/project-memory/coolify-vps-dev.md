---
name: coolify-vps-dev
description: "Coolify self-hosted di VPS <coolify-vps>:8000 — akun, akses SSH, dan runbook reset password lewat CLI (SMTP sengaja tidak dipasang)"
metadata: 
  node_type: memory
  type: project
  originSessionId: ac79ed22-4790-4094-ac36-add0837db2d1
  modified: 2026-07-22T14:43:53.235Z
---

Coolify self-hosted jalan di `<coolify-vps>:8000` (VPS dev, kemungkinan Vultr Singapore — lihat [[tokophi-market-and-hosting]]). SSH `root@<coolify-vps>` sudah pakai key, `BatchMode=yes` tembus tanpa passphrase. Container: `coolify`, `coolify-db` (Postgres, user/db `coolify`), `coolify-proxy`, `coolify-redis`, `coolify-realtime`, `coolify-sentinel`.

Dua user (per 2026-07-22): id **0** = `<cf-account-email>` (root, owner Root Team), id **2** = `<personal-email>` (owner tim sendiri + **admin di Root Team**). Keduanya `email_verified_at = null`, dan itu **tidak** menghalangi login.

**Transactional email sengaja TIDAK dipasang** (`smtp_enabled=f`, `resend_enabled=f`) — keputusan user 2026-07-22, alasannya lebih aman & nol dependency eksternal. Konsekuensinya `/forgot-password` cuma nampilin banner "Email Not Configured"; recovery hanya lewat CLI.

**Why:** tanpa runbook ini, kekunci dari Coolify = buntu total, dan ada jebakan senyap yang bikin orang mengira sudah berhasil reset padahal password jadi kosong.

**How to apply:**
```bash
ssh root@<coolify-vps>
docker exec -ti coolify php artisan root:reset-password   # HANYA user id 0
docker exec -ti coolify php artisan root:change-email
```
- **`-ti` wajib.** `RootResetPassword.php` pakai `Laravel\Prompts\password()`; di non-TTY (mis. di-pipe lewat stdin) fungsi itu balikin **string kosong tanpa error**, command tetap print "Root password updated successfully", dan password root benar-benar jadi kosong. Terbukti kejadian 2026-07-22.
- Command itu hard-coded `User::find(0)` — untuk user non-root harus lewat tinker:
  `docker exec coolify php artisan tinker --execute='$u=App\Models\User::find(2); $u->forceFill(["password"=>Illuminate\Support\Facades\Hash::make("..."))->save();'`
- Verifikasi jangan cuma percaya output command: cek `Hash::check(...)` lalu tes login betulan (POST `/login` Fortify dengan `_token` dari GET `/login`; sukses = `302` ke `/`, gagal = balik ke `/login`).

Jangan simpan password instance ini di memori — ambil/rotate lewat UI (Profile → Update Password).

> `<coolify-vps>` is redacted: the host address, SSH access, and the CLI reset runbook live in `~/.config/ai-local/project-credentials.md`, which is device-local and never committed.
