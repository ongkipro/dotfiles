---
name: adr-record
description: 'Membuat dokumen Architecture Decision Record (ADR) terstruktur untuk mencatat keputusan teknis, arsitektur, stack, dan konsekuensinya. Triggers: ''buat ADR'', ''architecture decision record'', ''adr-record'', ''adr'', ''write adr'', ''record decision''.'
---

# Architecture Decision Record (ADR) Skill

Membantu arsitek/developer merekam keputusan arsitektur penting beserta konteks, status, dan dampaknya.

## Alur Pembuatan ADR

1. **Identifikasi Kebutuhan:** Saat ada perubahan stack, pilihan library, desain database, atau pola integrasi.
2. **Klarifikasi Pilihan:** Menganalisis alternatif solusi yang ada.
3. **Penyusunan ADR:** Menulis dokumen markdown terstruktur dengan nomor ID berurutan.
4. **Pembaruan Keputusan:** Jika keputusan digantikan, status diubah menjadi *Superseded* dengan referensi ke ADR baru.

## Format Standar ADR

Setiap file ADR disimpan dengan penamaan `ADR-[ID]-[judul-slug].md` (contoh: `ADR-001-d1-drizzle-orm.md`). Struktur konten wajib mengikuti template berikut:

```markdown
# ADR-[Nomor ID]: [Judul Keputusan]

- **Status:** [Proposed | Accepted | Rejected | Superseded by ADR-XXX]
- **Tanggal:** [YYYY-MM-DD]
- **Penulis:** [Nama Penulis]
- **Deciders:** [Daftar Pengambil Keputusan]

## 1. Konteks (Context)
Jelaskan latar belakang masalah teknis atau kebutuhan bisnis yang melatarbelakangi keputusan ini.
- Apa kendala saat ini?
- Apa saja faktor pembatas (constraints)?
- Opsi alternatif apa saja yang sempat dipertimbangkan?

## 2. Keputusan (Decision)
Jelaskan keputusan teknologi atau arsitektur yang diambil secara eksplisit dan definitif.
- Mengapa opsi ini yang dipilih dibanding alternatif lain?
- Komponen atau modul apa saja yang terpengaruh?

## 3. Konsekuensi (Consequences)
Jelaskan dampak dari keputusan ini baik secara positif (benefit) maupun negatif (trade-off/risiko).
- **Positif (+):** Keuntungan teknis, peningkatan kecepatan, kemudahan maintenance.
- **Negatif (-):** Kurva belajar baru, utang teknis (technical debt), ketergantungan library, batasan skalabilitas.
- **Netral:** Hal-hal yang tidak berubah tetapi perlu diwaspadai.
```

## Lokasi Penyimpanan
* Secara default, simpan dokumen di dalam folder proyek pada jalur `docs/adr/` atau `adr/`.
* Jika proyek belum diinisiasi, simpan di `~/Documents/work/prd/` sebagai dokumen perencanaan awal.
