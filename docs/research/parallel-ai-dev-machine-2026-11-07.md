---
title: Parallel AI development machine — public research note
date: 2026-11-07
status: research input, not policy
---

> Public-source research behind `docs/parallel-ai-dev-machine.md`. Written in Indonesian by the owner's agent session and
> kept as-is. Section A is sourced from public pages (each labelled official, forum, blog or vendor; none is a controlled
> study). Section B lists the author's own assumptions, which are not findings. The comparison with the owner's machines
> and the decision list stay private and are not part of this note.


Dibuat 2026-11-07 atas permintaan owner. Aturan susun: **riset publik dulu, bukan dari kesimpulan agen dan bukan dari apa yang
sudah dimiliki mesin.** Catatan ini adalah kutipan publik dari dokumen kerja yang lebih panjang; ia hanya memuat dua bagian:
**A. Temuan publik (bersumber)** dan **B. Inferensi agen (tidak bersumber)**.

## Cara membaca label sumber
- **[resmi]** dokumentasi atau repo proyek tool itu sendiri. **[forum]** Reddit, Hacker News, GitHub issue. **[blog]** tulisan praktisi/individu. **[vendor]** ditulis penjual produk terkait, anggap bias.
- Tidak ada satu pun butir di bawah yang berasal dari studi terukur atau uji terkendali. Semuanya konsensus atau pengalaman praktisi.

---

## A. Temuan publik (bersumber)

### A1. Kenapa banyak agent terasa lambat di satu mesin
1. Worktree hanya mengisolasi kode. Port, database, cache, dan state tes tetap dipakai bersama; solusi yang konvergen: nama project Compose per worktree, port diturunkan dari nama branch, database sekali pakai yang di-seed dari fixture, teardown bagian dari tugas, satu perintah verifikasi yang bisa dibaca exit code-nya.
   - [forum] Reddit r/ClaudeAI, rangkuman ~60 jawaban, 2026-09-14: https://www.reddit.com/r/ClaudeAI/comments/1wg11ah/a_month_ago_i_asked_how_you_stop_parallel_ai/
   - [blog] "Four agents, one database", J-P Gassin, 2026-07-26: https://jeanpierregassin.substack.com/p/four-agents-one-database
   - [blog] "Worktrees isolate the code, not the runtime", RingMod, 2026-07-14: https://ringmod.ai/notes/dev-environments-for-parallel-ai-agents/
2. Dua run suite serentak pada satu database tampak "flaky": fixture ber-id tetap saling menghapus baris; sendirian lulus 196 tes tiga kali, dua run serentak gagal 9 dan 21 tes, dengan database per run 0 gagal.
   - [blog] "Running AI agents in parallel: 6 failures and their fixes", S. Verma, 2026-11-02: https://dev.to/ssv445/running-ai-agents-in-parallel-6-failures-and-their-fixes-3eg2
3. Antrean satu kunci untuk database tes membuat agent lain menganggur; penanya menyebut daftar tunggu memanjang saat skala naik. Kunci satu mesin untuk pekerjaan berat dipakai setelah load mencapai ~290 pada 5-7 build serentak di Mac 12 core.
   - [forum] Reddit r/AI_Agents, 2026-09-14: https://www.reddit.com/r/AI_Agents/comments/1wg00kf/parellel_agents_running_tests_on_a_single_database/
   - [blog] dev.to Verma (butir 2).
4. CPU laptop jadi hambatan saat banyak sub-agent menjalankan tes bersamaan; paralelisasi berat bisa lebih lama dari serial.
   - [forum] Reddit r/ClaudeCode, 2026-01-15: https://www.reddit.com/r/ClaudeCode/comments/1qd64xx/tdd_workflows_with_claude_code_whats_actually/
5. Tes yang mengukur waktu gagal pada load tinggi (54-66) tanpa perubahan kode; dipindah ke suite tersendiri yang jalan sekali per rilis di mesin tenang.
   - [blog] dev.to Verma (butir 2).

### A2. Batas jumlah agent dan pola kerja
1. Batas praktis adalah kapasitas review dan kuota langganan, bukan CPU; semua sesi satu akun berbagi limit yang sama. Saran umum mulai dari 2-3 agent; "titik manis" 3-5; di atas 5 biaya merge dan rate limit lebih besar dari untung.
   - [blog] cube.computer, 2026-09-26: https://cube.computer/guides/run-parallel-claude-code-agents/
   - [blog] agentools.sh, 2026-11-04: https://agentools.sh/articles/run-multiple-claude-code-agents/
   - [blog] AgentVera, 2026-10-08: https://agentvera.dev/en/blog/run-multiple-claude-code-agents/
   - [blog] Shuriken, 2026-10-26: https://shuriken.sh/guides/run-claude-code-agents-in-parallel
2. Bagi pekerjaan per area (bukan per langkah); berkas bersama (lockfile, tabel rute, konfigurasi global) dikerjakan satu tugas; merge satu per satu setelah review dan rebase sisanya lebih awal.
   - [blog] VibeiDE di dev.to, 2026-11-05: https://dev.to/vibeidedev/run-multiple-claude-code-sessions-without-file-conflicts-3ak
3. Satu orang melaporkan ~4 GB memori per stack worktree; 6-10 agent memakai 16 dari 32 GB pada M1 Pro.
   - [blog] Oshri Cohen, 2026-06-09: https://www.oshricohen.me/blog/ten-coding-agents-one-laptop/
4. Komentar Reddit: dua agent mengedit repo yang sama adalah titik kegagalan; seorang komentator menyebut kualitas kode naik bila tanpa sub-agent karena tidak ada biaya komunikasi.
   - [forum] Reddit r/ClaudeAI, 2026-02-01: https://www.reddit.com/r/ClaudeAI/comments/1qsy2qw/do_you_run_multiple_agents_in_parallel/

### A3. Pemendekan pekerjaan berat (CI dan tes)
1. Agent tidak menunggu suite penuh: jalankan tes untuk kode yang berubah, suite penuh sesudah merge atau terjadwal, batasi putaran ke CI (Stripe: maksimal 2 per tugas). Disebut juga oleh contoh file instruksi Anthropic, Cursor, Factory.
   - [blog] dbggr.dev, 2026-10-17: https://dbggr.dev/articles/slow-test-suites-coding-agents/
2. Seleksi tes berdasar dependensi: perubahan lokal dari ~20 menit menjadi beberapa menit; suite penuh tetap tiap malam. Satu laporan: total CI ~21 -> ~13 menit, lajur E2E ~12 -> ~4 menit.
   - [blog] "When agents make CI the bottleneck", F. Dudzik, 2026-08-21: https://humansystems.dudzik.co/p/when-agents-make-ci-the-bottleneck
3. Volume job CI naik 25x di Anthropic; selektor tes per paket. [vendor-adjacent, ditulis Anthropic tentang sistem sendiri]
   - https://claude.com/resources/articles/agentic-coding-is-straining-ci-heres-how-we-scaled-test-impact-analysis-at-anthropic
4. Sebagian besar waktu CI Linear ada di setup (checkout, install, boot kontainer, job gerbang), bukan eksekusi tes.
   - [blog] dev.to (merangkum tulisan Linear), 2026-09-22: https://dev.to/jamilxt/ai-coding-agents-made-ci-the-bottleneck-here-is-the-fix-step-by-step-1koj

### A4. Tool CLI yang disarankan praktisi untuk agent
Konsensus lintas sumber (jumlah sumber yang menyebut, bukan bukti dampak): `rg`, `fd`, `jq`, `yq`, `gh`, `git-delta`, `fzf`, `tmux`; `shellcheck` (dan `shfmt`); `ast-grep`; `just`; `mise`; `uv` (Python); `bun`/`pnpm`; `htop`/`btop`; `ncdu`.
- [blog] shareallai.github.io, 2026-05-14: https://shareallai.github.io/familypro/en/blog/codex-cursor-claude-code-local-dev-tools-guide/
- [blog] batsov.com, 2026-02-17 (daftar 10 tool; ast-grep nomor satu): https://batsov.com/articles/2026/02/17/supercharging-claude-code-with-the-right-tools/
- [forum] Reddit r/ClaudeAI, diskusi tulisan di atas, 2026-06-20: https://www.reddit.com/r/ClaudeAI/comments/1ub11yd/supercharging_claude_code_with_the_right_cli_tools/
- [blog] nearform.com, 2026-08-06: https://nearform.com/digital-community/terminal-velocity-the-shell-tools-that-make-claude-code-fly/
- [blog] qiita.com/shiroiunagi (Ubuntu/macOS), 2025-12-17: https://qiita.com/shiroiunagi/items/7c99e7a02612986471a1
- [blog] Trail of Bits member setup (jq, rg, fd, ast-grep, shellcheck, shfmt, actionlint, zizmor, node, pnpm, uv), 2026-02-25: https://labs.secengai.com/p/how-trail-of-bits-member-sets-up-claude-code-for-security-research-development
- [blog/vendor-ish] ayautomate.com (12 pilihan; rtk untuk memotong token output), 2026-07-05: https://www.ayautomate.com/blog/best-claude-code-cli-tools
- Prinsip: pasang sedikit dan dipin per proyek, jangan banyak runtime global [blog] shareallai (butir pertama di atas).

**Pandangan yang berbeda (penting, jangan diabaikan):**
- Satu pengguna menguji ast-grep pada codebase 964 berkas / ~287 ribu baris dan **menghapusnya**: berguna untuk lint struktural dan migrasi, tapi tidak meningkatkan pemahaman repo secara umum; LSP lebih kaya untuk simbol, ripgrep lebih sederhana untuk penemuan. Klaim "hemat 60% token" tidak terbukti pada kasusnya.
  - [blog] Scott Spence, LinkedIn, 2026-08-12: https://www.linkedin.com/posts/spences10_a-60-reduction-in-token-usage-for-coding-activity-7493337291269115904-gF5R
- Satu tulisan menyebut tiga mode pencarian (leksikal, struktural, graf) dan ast-grep tidak menyelesaikan nama lintas berkas. [blog/vendor, penulis menjual produk graf] https://zzet.org/gortex/grep-replacement-for-ai-agents/
- Saran bermusyawarah dari satu artikel: pasang semua lalu amati tool mana yang benar-benar dipakai agent selama 1-2 minggu, lalu pangkas. [blog] https://note.com/tepp_yama_blog/n/n2cc1f14179ea

### A5. Database untuk agent
1. `docker compose exec db psql ...` bekerja tanpa memasang psql di host; `-T` wajib untuk pipe/cron. [blog] https://oneuptime.com/blog/post/2026-02-08-how-to-use-docker-compose-exec-to-run-commands-in-services/view , https://www.itechguides.com/setting-up-postgresql-in-docker-a-step-by-step-guide/
2. Akses agent ke DB: role read-only, replika bukan primary, masking PII, batas baris; paling aman: dump skema saja untuk kerja migrasi. [blog] https://www.aifordatabase.com/blog/connect-claude-code-to-database-2026/ ; https://encore.dev/articles/best-database-setup-for-ai-coding-agents
3. Clone database sekali pakai dengan `pg_dump`/`pg_restore`, SQL tugas hanya di sandbox, dihapus setelah selesai; pilih bentuk data terkecil yang membuktikan tugas. [vendor] https://pgsandbox.dev/blog/how-to-clone-postgres-database-sandbox/

### A6. Backup volume dan database dev
1. Jangan menyalin direktori data database yang sedang berjalan; `pg_dump` dulu (`-Fc`, lewat `docker compose exec -T`), lalu berkas dan dump disalin ke luar mesin; retensi (contoh 7 harian / 4 mingguan / 6 bulanan) dan uji restore berkala; timer systemd dengan `Persistent=true` lebih baik dari cron.
   - [blog] codenx.com, 2026-04-02: https://codenx.com/docker/backup-docker-volumes-automatically/
   - [blog] jguillaumesio.com, 2026-07-30: https://jguillaumesio.com/blog/database-backups-that-actually-restore/
   - [blog] xermore.com (restic + rclone ke B2/R2), 2026-09-08: https://xermore.com/guides/self-host-backup-restic-rclone/
   - [blog] learnwithhasan.com (Duplicati vs restic vs Kopia), 2026-08-11: https://learnwithhasan.com/guide/docker-backups/
2. Volume bernama lebih aman dari bind mount; jangan jalankan `docker compose down -v` atau `docker system prune --volumes` pada mesin yang belum diaudit.
   - [blog] jguillaumesio (butir 1).

### A7. Observabilitas dan OOM pada mesin dev
1. Pressure Stall Information (`/proc/pressure/{cpu,memory,io}`, Linux >= 4.20, juga per-cgroup) menjawab "seberapa lama tugas menunggu"; `full` di atas nol yang berkelanjutan adalah sinyal "mesin diam menunggu". Lebih informatif dari penggunaan memori atau load average.
   - [blog] linuxdork.com, 2026-09-20: https://linuxdork.com/blog/memory-pressure-psi-oom-tuning/
   - [blog] pistack.xyz, 2026-05-27: https://www.pistack.xyz/posts/2026-05-27-self-hosted-linux-oom-prevention-earlyoom-systemd-oomd-psi-guide/
2. `systemd-oomd` bertindak pada tekanan dan penggunaan cgroup, **tidak membaca skor OOM kernel**; karena itu `OOMScoreAdjust` tidak melindungi dari oomd. earlyoom dan systemd-oomd sebaiknya tidak dijalankan bersamaan. Tekanan per-slice (`ManagedOOMMemoryPressure` pada slice) adalah cara mengarahkan korban.
   - [blog] linuxdork.com; pistack.xyz; mustafaerbay.com.tr (runbook cgroup v2 + oomd), 2026-04-13: https://mustafaerbay.com.tr/en/blog/tutorials/systemd-oomd-ile-cgroup-v2-memory-pressure-runbooku/
   - **[resmi, DIVERIFIKASI 2026-11-07]** Canonical, "Improving Ubuntu Desktop stability under memory pressure", Ubuntu Discourse, 2026-09-18: https://discourse.ubuntu.com/t/improving-ubuntu-desktop-stability-under-memory-pressure/87945
     Isi yang dikonfirmasi: pada Ubuntu 26.10 layanan desktop kritis diberi skor OOM lebih rendah, dan *systemd-oomd memory-pressure kill untuk seluruh sesi pengguna dinonaktifkan*, dengan alasan oomd tidak memakai skor OOM kernel dan bisa membunuh layanan desktop kritis hanya karena tekanan memori. Catatan resmi: ini langkah pertama, dan tidak membuat Ubuntu kebal OOM.
     Cakupan: **desktop Ubuntu 26.10**. Kebijakan itu tidak berlaku di rilis lain (misalnya 24.04) dan tidak boleh disalin begitu saja sebagai resep untuk mesin non-desktop.

### A8. Isolasi runtime per worktree (alat yang ada)
Pola yang sama di semua alat: port diturunkan dari nama branch atau registri (sering offset), `COMPOSE_PROJECT_NAME` per worktree, `.env` per worktree, database per worktree, teardown saat selesai.
- [forum/repo] billbillington/worktree-compose (`wtc`): https://github.com/billbillington/worktree-compose (2026-03-11)
- [blog] "workz", dev.to, 2026-03-03: https://dev.to/rohansx/i-got-tired-of-writing-the-same-80-line-setup-script-for-every-ai-worktree-4hj9
- [blog] Docktree (override file per worktree, registri port berstatus), 2026-05-20: https://bnjoroge.com/posts/run-multiple-docker-compose-instances-for-your-agents/
- Peringatan dari penulis Docktree: secret manager yang membangun connection string saat runtime adalah jebakan; registri port harus tahan balapan dan crash.
- Satu artikel menyebut belum ada alat standar yang menang (RingMod, A1).

### A9. Biaya CI GitHub untuk repo publik vs privat (DIVERIFIKASI ke dokumen resmi, 2026-11-07)
- **[resmi]** Runner standar GitHub-hosted **gratis dan tanpa batas untuk repo publik**: https://docs.github.com/en/actions/reference/runners/github-hosted-runners
- **[resmi]** Untuk repo privat/internal, pemakaian menarik dari "included compute usage" bulanan yang **dinyatakan dalam dolar, bukan menit**: GitHub Free **$12 USD/bulan**, Pro $18, Team $18, Enterprise Cloud $300; setelah habis ditagih kecuali anggaran dibatasi: https://docs.github.com/en/billing/reference/product-usage-included dan https://docs.github.com/en/billing/concepts/product-billing/github-actions
- **[blog, bukan resmi]** Tarif per menit: Linux $0,006, Windows $0,010, macOS $0,062 (per 12 Oktober 2026): https://caprock.dev/guides/github-actions-pricing/
- **Koreksi atas ucapan agen sebelumnya** ("repo privat punya kuota menit per bulan"): angka resminya **$12/bulan di plan Free**, bukan jumlah menit. Dengan tarif Linux di atas itu setara sekitar 2.000 menit, tetapi konversi itu hitungan dari blog, bukan dari dokumen GitHub.
- Implikasi untuk rencana "jadikan repo privat nanti": CI di repo privat mulai memakan jatah $12/bulan; di repo publik gratis. Berapa menit CI kita sebenarnya (belum diukur) menentukan apakah cukup.

---

## B. Inferensi agen (TIDAK bersumber, perlu diriset atau diputuskan owner)
1. Perkiraan bahwa "empat proyek hampir tidak saling menunggu bila porsi slot berat per agent turun ke 20-25%" (hitungan agen, bukan data).
2. "Slot ketiga membuat semuanya lebih lambat" untuk 4 core / 8 thread: dasar hanya pengamatan load 6-8 pada dua pekerjaan berat di mesin ini.
3. Daftar "tidak perlu dipasang" (eslint/vitest/prettier global, redis-cli, mysql, go, rust, deno, nmap, nginx, caddy): hanya prinsip "jangan pasang terlalu banyak runtime global" yang bersumber (A4); daftar spesifiknya dari kebutuhan empat proyek kita.
4. Urutan peningkatan perangkat keras (NVMe berDRAM dulu, lalu CPU, lalu RAM): tidak ada sumber yang saya baca; dasarnya spesifikasi mesin dan pengamatan I/O.
5. "Pindahkan suite penuh ke CI untuk menambah kapasitas": sumber (A3) membahas CI yang kewalahan oleh agent, bukan memindahkan beban dari mesin lokal. Kuota GitHub sekarang **sudah diverifikasi ke dokumen resmi** (lihat A9 di bawah); klaim kapasitasnya tetap inferensi agen.
6. "Hanya 2 pekerjaan berat sekaligus untuk mesin ini": hasil ukur lokal sementara, belum diuji sistematis.
