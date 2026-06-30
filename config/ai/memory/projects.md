# Memori: Projects — fakta per-project
> Bagian dari memori bersama. Tambah/aktualkan saat kerja di sebuah project.
> Format: `## <nama project>` lalu bullet fakta penting (path, stack, catatan, jangan-lupa).

## dotfiles
- `~/dotfiles` → backup semua config, repo private `github.com/ongkipro/dotfiles`.
- `install.sh` untuk setup device baru (idempotent).
- `bin/dotsync` = helper semi-auto sync lintas Linux/macOS untuk review → commit → push opsional pada shared memory/config.
- `install-macos.sh` = bootstrap ringan macOS untuk shared memory, skill linking, dan workflow sync dasar.
- GSAP skills resmi dari `greensock/gsap-skills` telah di-vendor ke `~/dotfiles/skills/local/` sebagai: `gsap-core`, `gsap-frameworks`, `gsap-performance`, `gsap-plugins`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-utils`, lalu disebarkan lintas CLI via `skill-update`.

## pixsgo
- path: `/home/fantastico/Projects/pixsgo`
- stack: Astro, TailwindCSS, Shopify Storefront API, Cloudflare Workers / Wrangler
- catatan: Rebranded to "Play & Go" (Toys & Hobbies). Visual guidelines are Playful, Minimalist, Modern, and Fun. Avoid retro arcade, console hacking, or brutalist boxes. Ensure senior accessibility (font >= 16px, labels on icons).
- Rethemed all pages and layout components (Header, Footer, 404, FAQ, cart, filter sidebar) to sand borders (`border-border`) and soft rounded elements, eliminating all retro slate/gray borders and brutalist shadows.
- Updated `getStaticPaths` in `src/pages/products/[handle].astro` to combine live Shopify handles with mock fallback handles, resolving the isolated scope build constraint in Astro and preventing 404 errors on internal fallback links.
- Rethemed and modernized the homepage categories grid (`src/components/home/Categories.astro`) to render collections dynamically from Shopify, utilizing curated badge mappings (emojis, warm colors, short labels), and added desktop & mobile "View All Collections" call-to-actions.
- Replaced all raw inline SVGs on the homepage sections (Hero sliders, category icons, features, verified buyer tags) with `@lucide/astro` utility components (Activity, ShieldCheck, ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight).
- Confirmed that `@lucide/astro` v1.x has dropped brand/social icons (Facebook, Instagram, GitHub) to focus on utility icons. Handled brand links using raw inline SVGs in `Footer.astro` to ensure successful compilation.
- Standardized all contact form borders (`src/pages/contact.astro`), dynamic cart shimmers (`src/components/Header.astro`), and product detail thumbnail outlines (`src/pages/products/[handle].astro`) to design system border tokens (`border-border`).
- Locked the homepage categories grid (`src/components/home/Categories.astro`) and collection hero banners (`src/pages/collections/[handle].astro`) strictly to a `3:2` aspect ratio (landscape), fixing the `静态src` typo.

## aussie-malaysia (Astro 6 + Cloudflare Workers, aussiesawit.my)
- Deploy: Cloudflare Workers via `@astrojs/cloudflare` (adapter hanya saat build; `astro dev` pakai adapter `undefined` → tak ada `locals.runtime`).
- Env API Scalev/Meta: production via `locals.runtime.env` (fallback `process.env` nodejs_compat). DEV tak ada `.env` auto → export shell: `SCALEV_API_KEY=... SCALEV_STORE_UNIQUE_ID=... npm run dev`. JANGAN pakai `import.meta.env` dinamis (crash di Vite dev module-runner).
- API `src/pages/api/submit-lead.ts` POST → buat order Scalev v2 (`/v2/order`) + Meta CAPI Purchase. Uji curl: UA mengandung "curl" mem-bypass submit_token. Tanpa creds → `STORE_CONFIG_MISSING`; creds invalid → `UPSTREAM_ERROR` 401 (pipa terbukti tersambung).
- Rate limiter `ORDER_SUBMIT_LIMITER` dideklarasi di `wrangler.jsonc` (`ratelimits`, limit 8/60s), diakses via `locals.runtime.env` di `src/middleware.ts` (bukan globalThis).
- Script live ada di `public/scripts/` (di-load via `/scripts/...`). Duplikat stale di `src/scripts/` sudah dihapus — jangan dibuat lagi.

## pesantren-tholabie (pesantrentholabie.com) — Pondok Pesantren THOLABIE CIBS (Malang)
- Site live sekarang: HTML5, Tailwind CSS (via CDN), Lucide Icons, Google Fonts. Landing page; menawarkan beasiswa penuh D3 di Politeknik Kota Malang. Dikembangkan oleh ongki.pro.
- Rencana rebuild company profile: `~/Projects/pesantren-tholabie-compro` — stack Astro + TailwindCSS + Lucide Icons. Niche: Islamic modern tech education. Fokus: green-gold design system, high-conversion landing (WhatsApp CTAs), integrasi beasiswa D3 Politeknik Malang, highlight kurikulum digital skills.
- Scraped content: `~/Documents/ai-artifacts/scrapes/2026-06-29-scrape-pesantrentholabie.md`.
- PRD & Rebuild Plan: `~/Documents/ai-artifacts/prd/2026-06-29-prd-pesantren-tholabie-compro.md`.
- Transformasi Visual: Desain diubah sepenuhnya menjadi Makkah & Madinah Theme (kombinasi warna hijau kubah Madinah, hitam kiswah Makkah, aksen emas metalik, dan warna dasar pasir/ivory). Menambahkan komponen modular `Ornament.astro` (bintang 8-penjuru/Rub el Hizb, pembatas emas) serta pola geometris latar belakang `.bg-islamic-pattern` pada seluruh section beranda.
- Restrukturisasi Astro: Memisahkan cangkang HTML, tag SEO, skema LD-JSON, dan skrip klien-side global dari `index.astro` ke dalam komponen tata letak mandiri `Layout.astro`.
- Latar Belakang Hero: Menambahkan siluet garis luar Gerbang Mihrab Besar (Mihrab Arch Outline) yang membingkai area Hero untuk memperkuat konsep portal klasik-modern bernuansa Masjid Nabawi.
- Ornamen Latar Belakang: Menambahkan siluet detail komplek kubah dan menara Masjid Nabawi Madinah di dasar Hero section serta 3 ornamen bintang 8-penjuru mengambang dinamis (.animate-float) untuk memperkuat kesan estetik modern.
- Testimoni & Pembina: Menambahkan foto profil realistis untuk Dewan Pembina dan melipatgandakan jumlah testimoni menjadi 6 kartu lengkap dengan foto profil asli yang representatif (close-up santri dan wali murid Indonesia) untuk memperkuat bukti sosial.
- Sistem Tombol (CTA): Menyelaraskan seluruh tombol di website ke dalam satu pakem desain minimalis (rounded-full dengan padding px-8 py-3.5, border accent emas tipis, transisi melayang hover:-translate-y-0.5, dan efek tekan active:scale-98) untuk konsistensi UI/UX.
- Optimasi Konversi & Tombol: Menerapkan tata letak split sticky bar bergaya mobile web app (tombol telepon langsung di kiri + tombol WhatsApp lebar di kanan). Mengurangi button fatigue dengan membatasi jumlah tombol fisik di halaman menjadi tepat 3 tombol saja (2 di Hero, 1 di Navbar, dan 0 di section body lainnya), sedangkan CTA lainnya diubah menjadi teks link minimalis yang elegan.
- Penyempurnaan Mobile UI/UX: Mengurangi tinggi padding section dari py-24 menjadi py-16 di layar seluler (md:py-24 tetap dipertahankan) untuk mengurangi panjang gulir halaman. Mengonfigurasi caption overlay galeri agar selalu tampil secara default di layar sentuh/seluler (opacity-100) dan hanya menggunakan efek hover di layar desktop (md:opacity-0 md:group-hover:opacity-100) untuk aksesibilitas yang optimal.
- Menu Burger & Navigasi Mobile: Mengubah tombol menu burger menjadi animasi 3-garis murni (pure CSS morphing hamburger) dan melengkapi daftar navigasi mobile dengan ikon Lucide bertema di tiap baris (Informasi, Beasiswa, Asrama, Keahlian, Testimoni, FAQ) dengan transisi gold left-border yang mewah.
- Ekspansi Multi-Page Company Profile: Memisahkan website menjadi 6 halaman terpadu: Beranda (/), Profil & Visi Misi (/tentang), Program Beasiswa (/beasiswa), Kehidupan Asrama (/asrama), Kurikulum Keahlian Digital (/kurikulum), dan Hubungi Kami & FAQ (/kontak). Menyinkronkan menu navigasi di Navbar dan mobile menu burger agar mengarah ke halaman-halaman tersebut secara responsif serta menambahkan penanda aktif (active link state) berbasis URL pathname saat halaman dimuat.
- Screening & Finalisasi Tautan: Mengubah seluruh tautan jangkar lama di footer halaman (Footer.astro) agar mengarah ke halaman baru (/tentang, /beasiswa, /asrama, /kontak) serta memverifikasi nihilnya tautan rusak (#) di seluruh halaman untuk keandalan navigasi yang sempurna.
- Optimasi Daftar Beasiswa: Mengubah penyajian daftar keuntungan beasiswa harian (beasiswa.astro) dari bentuk daftar baris biasa dengan titik dua menjadi kartu-kartu premium yang diapit bingkai bulat hijau emerald (untuk ikon centang) dengan judul hitam tebal dan deskripsi abu-abu yang teratur rapi.
- Perombakan Halaman Kontak Tanpa Formulir: Menghapus input formulir dari halaman kontak (kontak.astro) dan menggantinya dengan layout split modern: kolom kiri memuat kartu WhatsApp Pendaftaran (respons cepat), nomor telepon, email, dan jam operasional; kolom kanan menampilkan alamat fisik detail serta bingkai peta interaktif Google Maps embed yang dihiasi bayangan premium dan tombol pintasan eksternal.
- Dinamisasi Tag Meta SEO: Mengonfigurasi properti canonical URL, Facebook og:url, dan Twitter url di dalam Layout.astro agar dievaluasi secara dinamis menggunakan Astro.url.pathname (menggantikan tautan statis beranda) guna menjamin validitas indeksasi mesin pencari di seluruh sub-halaman.
- Penyelarasan Alamat & Peta Google Maps Resmi: Menyesuaikan seluruh penyebutan alamat fisik di dalam kontak.astro, asrama.astro, dan Footer.astro dengan alamat resmi yang presisi (Jalan Kyai Malik Dalam Jl. Dukuh Baran, RT.01/RW.07, Buring, Kedungkandang, Malang 65136). Menyisipkan peta Google Maps dengan parameter koordinat presisi (-8.0145011, 112.6611340) serta menyinkronkan tombol eksternal ke URL maps.app.goo.gl yang diberikan.
- Unifikasi Meta Deskripsi Unik per Halaman: Menambahkan deskripsi meta spesifik dan relevan pada deklarasi Layout untuk kelima sub-halaman baru guna mengeliminasi peringatan duplikasi deskripsi di Google Search Console dan menaikkan rasio CTR hasil pencarian.
- Penyempurnaan Rute Peta di Halaman Asrama: Menambahkan tombol aksi 'Buka Rute Google Maps' langsung ke kartu alamat di halaman asrama.astro guna menjamin akses rute peta yang seragam dan mudah dijangkau di seluruh sub-halaman.
- Finalisasi Peta Situs & Aset Pemasaran SEO: Menyelaraskan sitemap.xml di folder publik dengan memasukkan keenam sub-halaman baru secara tertib (priority & weekly change frequency). Memperbarui Layout.astro untuk memicu absolute URL untuk og:image dan twitter:image (menggunakan properti domain resmi pesantrentholabie.com) serta menyisipkan tag meta author, publisher, dan copyright.
- Integrasi Navigasi Breadcrumbs (Rekam Jejak): Menyisipkan elemen navigasi visual breadcrumbs berbentuk kapsul transparan melayang (Beranda > Nama Sub-halaman) di bagian atas header kelima sub-halaman baru untuk mempermudah navigasi balik, serta mengonfigurasi skema terstruktur JSON-LD BreadcrumbList secara dinamis di Layout.astro agar terbaca sempurna oleh mesin pencari Google.
- Finalisasi Menu Mobile & CTA WhatsApp: Menyisipkan tombol aksi utama (WhatsApp CTA) dan informasi ringkas kontak pesantren (Malang, Jawa Timur & nomor WhatsApp) ke dalam menu drawer seluler (Navbar.astro). Mengonfigurasi properti .mobile-nav-link.active di global.css agar memberikan efek visual hijau-emas yang presisi pada tautan aktif saat laci menu dibuka di layar ponsel.
- Overhaul Total Desain Menu Mobile: Merombak tombol burger seluler menjadi berbentuk lingkaran kartu kaca (glass circle wrapper) yang estetik. Mengubah container menu dropdown dari berukuran lebar penuh (full-width) menjadi kartu melayang (floating rounded-2xl glass card) dengan jarak simetris di sisi layar. Menyempurnakan baris item menu dengan menambahkan kotak pembungkus ikon (icon wrapper box), font serif, serta panah penunjuk (ChevronRight) di sisi kanan yang bergeser dinamis ketika disentuh/disorot.
- Ekspansi Modul FAQ Hubungi Kami: Menambahkan 4 pertanyaan baru yang krusial pada FAQ.astro mengenai durasi program, kebutuhan laptop, kepemilikan smartphone, perihal ketiadaan ikatan dinas pasca kelulusan, dan kelayakan pendaftar dari luar Kota Malang, guna melengkapi kebutuhan informasi mandiri bagi calon wali santri.
- Sinkronisasi dan Push GitHub Sukses: Menyelesaikan konflik dengan pembaruan upstream (yang menambahkan fitur blog baru dan pembagian komponen atomic). Menyetel sitemap.xml dan Layout.astro agar selaras dengan rute blog baru dan Plus Jakarta Sans sebagai font default, diikuti dengan push sukses ke repository GitHub utama.
- Finalisasi README.md Publik: Menulis ulang berkas dokumentasi utama (README.md) dengan standar kualitas repositori publik yang lengkap. Menyertakan lencana status (badges), daftar rincian fitur 6 sub-halaman + blog, peta struktur pohon direktori proyek, dan melampirkan kredensial resmi dari Paduka Ongki (ongki.pro) selaku pengembang utama serta Antigravity (Google DeepMind Team) selaku AI Co-Developer partner.
- Pemutakhiran Email Profil Pengguna: Menyimpan email resmi baru pengguna (get@ongki.pro) ke dalam berkas memori identitas global (identity.md) sebagai fakta durable lintas sesi.
- Optimasi Aksesibilitas Font & Push Final: Melakukan penyesuaian ukuran font minimum 13px (0.8125rem) di seluruh komponen dan halaman blog untuk kepatuhan standar pembacaan ramah pengguna (accessibility). Menyembunyikan gambar verifikasi visual di .gitignore, diikuti dengan push sukses final ke repositori GitHub utama.
- Koreksi Kredensial Email README: Memperbarui alamat email pengembang utama di berkas README.md dari placeholder halo@ongki.pro menjadi get@ongki.pro, dan melakukan push pembaruan tersebut ke repositori GitHub tholabie.
- Dedikasi & Doa pada README.md: Menyisipkan kalimat basmalah, hauqalah, serta doa kebermanfaatan website sebagai wasilah kebaikan dan amal jariyah bagi semua pihak di bagian atas berkas README.md, dan melakukan push ke repositori GitHub.
- Penambahan Lencana Developer & Pernyataan Khidmah: Menambahkan lencana (badges) kredensial pengembang (ongki.pro) dan AI Co-Developer partner (Antigravity/DeepMind) di bagian paling atas README.md, serta menyisipkan maklumat dedikasi bahwa kode sumber ini GRATIS untuk masjid, TPQ, pesantren, madrasah, dan lembaga dakwah sebagai bentuk khidmah lillāhi ta'ālā.
- Migrasi Peta Situs Ke sitemap.xml Tunggal: Membuat rute API kustom (sitemap.xml.ts) untuk menghasilkan berkas sitemap.xml secara langsung tanpa pembagian berkas index, dan memperbarui robots.txt untuk merujuk langsung ke berkas tersebut. Perubahan ini telah diuji build dengan sukses dan di-push ke GitHub.
- Pembersihan Fitur Blog & Sitemap: Menghapus modul blog (src/pages/blog/) secara menyeluruh, membersihkan referensi artikel blog dari berkas sitemap.xml.ts dan README.md, serta memverifikasi kesuksesan kompilasi 6 halaman inti statis sebelum di-push ke GitHub.

































## petanisejahtera (Astro + Cloudflare Workers, petanisejahtera.com)
- Path: `/home/fantastico/projects/petanisejahtera`
- Memisahkan halaman indexable dan non-indexable secara ketat:
  - Halaman legal/kebijakan (`/kebijakan-privasi`, `/kebijakan-cookie`, `/pengiriman`, `/syarat-ketentuan`, `/disclaimer`), sitemap HTML (`/sitemap`), checkout (`/geoipform`, `/form-middle`, `/form-hybrid`), serta terima kasih (`/thanks`) ditandai `noindex={true}`.
  - Halaman noindex dihapus dari dynamic sitemap (`src/pages/sitemap.xml.ts`) dan diblokir melalui `robots.txt.ts`.
- Custom dynamic sitemap menggantikan modul bawaan `@astrojs/sitemap` yang dimatikan agar menghindari pembuatan berkas index redundan. Sitemap kini langsung mengarah ke `/sitemap.xml` yang rapi.
- Menambahkan skema `BreadcrumbList` dinamis secara otomatis via `BaseLayout.astro` yang diinjeksi jika properti `breadcrumbs` dikirim dari masing-masing halaman.

## mahad-nurul-haromain-lin-nisa
- Path MD: `/home/fantastico/Documents/Development/mahad-nurul-haromain-lin-nisa`
- Path Compro: `/home/fantastico/projects/mahad-nurul-haromain-lin-nisa-compro`
- Stack: Astro, Tailwind v4 (@tailwindcss/vite), TypeScript, @lucide/astro.
- Catatan: Website Company Profile (Compro) pesantren putri. Profil pengurus telah di-crop & dioptimalkan (WebP 500x500) di `public/images/`. Link sosial menggunakan inline SVG karena @lucide/astro v1.x tidak lagi mengekspor ikon brand (Facebook/Instagram/Youtube).

## SEO Knowledge Base
- Path: `/home/fantastico/Documents/SEO` — SEO Website Builder Skill/SEO OS canonical research/archive base. On 2026-06-30 created active local skill `seo-website-builder` at `/home/fantastico/dotfiles/skills/local/seo-website-builder` and synced via `skill-update` to pi/agents/claude/codex/gemini. Skill uses compact references copied from Documents/SEO; original 100+ SEO OS export remains in Documents for deep reference. Existing skills mined into the playbooks: `seo-local-business`, `shopify-listing`, and `astro-development`. Multi-engine docs cover Google/Bing/Yandex/Pinterest/AI search using official/trusted sources.
