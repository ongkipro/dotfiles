# TASKS: Meta Ads Scout

Project: Meta Ads Scout (Terminal AI Plugin)
Path: `~/dotfiles/skills/local/meta-ads-scout`

## Phase 1: Environment Setup
- [ ] 1.1 Inisialisasi Project Node.js (`npm init -y`).
- [ ] 1.2 Install dependency utama (`playwright`, `playwright-extra`, `puppeteer-extra-plugin-stealth`).

## Phase 2: Core Script Development
- [ ] 2.1 Buat file `scout.js`.
- [ ] 2.2 Tulis logika *Headless Browser* menggunakan `playwright-extra` dan injeksi *Stealth Plugin*.
- [ ] 2.3 Implementasi penerimaan argumen CLI (Keyword & Country Code).

## Phase 3: DOM Extraction & Failsafe
- [ ] 3.1 Tulis fungsi `page.evaluate()` untuk mengekstrak isi teks (*innerText*) dari komponen kartu iklan.
- [ ] 3.2 Buat *Failsafe/Fallback* jika DOM Facebook berubah kelasnya (ekstrak raw body).
- [ ] 3.3 Format *Standard Output* wajib JSON utuh agar tidak menyebabkan *Parsing Error* di sistem OMP.

## Phase 4: Testing & Verification
- [ ] 4.1 Jalankan skrip dengan *keyword* "Skincare Pria".
- [ ] 4.2 Verifikasi bahwa skrip berhasil memotong *loading* layar dan tidak terkena blokir Meta.