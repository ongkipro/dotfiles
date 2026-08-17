---
name: local-skills-registry
description: Daftar skill lokal di ~/dotfiles/skills/local/ yang ter-link ke semua AI CLI (claude/codex/agy/pi). Cek ini sebelum menyarankan install tool atau membuat skill baru agar tidak duplikat.
metadata:
  node_type: memory
  type: project
  originSessionId: af118496-2521-425e-a47b-d86f78516085
  modified: 2026-08-05T16:04:00.204Z
---

# Local Skills Registry

Skill lokal tersimpan di `~/dotfiles/skills/local/` dan di-symlink ke semua CLI via `skill-update`.

**Total per 2026-08-05: 41 direktori skill** (hitung ulang dari disk; catatan lama "30 per 2026-07-05"
sudah usang). Angka ini bergerak — **selalu `ls ~/dotfiles/skills/local/` sebelum mengutipnya**.

## ⚠️ TIDAK ADA skill tokophi, dan itu memang benar

`grep -ril tokophi ~/dotfiles/skills/local/` → **nol berkas** (2026-08-05). Jangan buat satu.
Pengetahuan tokophi tinggal di repo-nya sendiri: `AGENTS.md` (+ symlink `CLAUDE.md`) dan `specs/docs/`.
Skill tokophi = sumber kebenaran kedua — persis yang dilarang `development-spec-suite` sendiri
("one owner per canonical fact") dan oleh CLAUDE.md tokophi. Absennya desain, bukan celah.

## `development-spec-suite` — diuji 2026-08-05, lulus, dengan satu cacat

Skill terbesar untuk pekerjaan spec (16 template dokumen, 4 script Python, 5 reference). Ia menetapkan
gerbang kelayakannya sendiri di `SKILL.md`, jadi **jalankan, jangan dibaca**:

```bash
cd ~/dotfiles/skills/local/development-spec-suite
python3 -m py_compile scripts/*.py
python3 scripts/test-suite.py      # 19 fixtures — gerbang klaim "v2 audit-ready"
python3 scripts/audit-sources.py   # ledger sumber hukum, offline
```

Hasil 2026-08-05: py_compile bersih · **19/19 OK** · audit-sources `PASS records=11 findings=0`.
Smoke end-to-end sesuai perintah di SKILL.md jalan; `--dry-run` menulis **0 berkas** (sempat tampak
seperti bug karena `tail` memotong daftar WRITE — verifikasi dulu sebelum melapor).

🔴 **Cacat: sitasi bukti CI sudah drift**, di 5 baris `references/implementation-tasks.md`
(47, 128, 140, 141, 190). Semua menunjuk run `30941439300` yang menguji commit **`bccc7d2`** — padahal
sejak itu ada **3 commit lagi** (`ce43f6d`, `f4e8ebe`, `53d71fd`; yang terakhir berjudul "enforce
specification ownership boundaries"). Kode saat ini **hijau**, tapi buktinya ada di run lain:
**`30966928304`** (main @ `53d71fd`, matrix ubuntu/macos × py3.9/3.12, semua success). SKILL.md:117
sendiri bilang berkas workflow saja bukan bukti — **run**-nya yang bukti — jadi sitasi basi itu tidak
lagi membuktikan klaimnya. Perbaikan: ganti id run di 5 baris tersebut.

## Cara update

```bash
skill-update   # re-link direktori skill ke tiap runtime (tidak menarik dari upstream mana pun)
skill-list     # list semua skill (dipakai codex/agy untuk menemukan skill)
skill-new      # buat skill baru
ai-doctor      # cek kesehatan rantai symlink
```

**Why:** local override repo — skill custom di `~/dotfiles/skills/local/` tidak ketimpa saat
`skill-update` hanya merekonsiliasi link runtime — upstream jezweb dan `skill-sync` sudah tidak ada di disk (dicek 2026-08-17).

**How to apply:** sebelum bikin skill baru, cek direktori ini + `skill-list`. Sebelum mengklaim sebuah
skill "sudah beres", jalankan gerbang miliknya sendiri — jangan membaca deskripsinya. Lihat juga
[[dev-toolchain-mise]].
