# WakafTracker

Dashboard transparansi proyek wakaf untuk nazhir dan wakif. Dual progress pendanaan dan fisik, arus kas bernota, serta e-sertifikat yang bisa diverifikasi.

## Fitur

- **Katalog Proyek** — Lihat daftar proyek wakaf dengan dual progress (pendanaan dan fisik)
- **Detail Proyek** — Timeline milestone, transparansi arus kas, dan formulir wakaf
- **Portal Wakif** — Riwayat wakaf, e-sertifikat, dan umpan progres lapangan
- **Dashboard Nazhir** — Kelola proyek, milestone, arus kas, dan logger progres
- **E-Sertifikat** — Sertifikat digital unik dengan kode verifikasi publik
- **Trakteer Widget** — Dukungi biaya server dengan traktir kopi (floating widget sudut kanan bawah)
- **Open Source** oleh MZF · 2026

## Teknologi

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Drizzle ORM + PostgreSQL (Neon)
- Lucide React
- Zod (validasi)

## Struktur Direktori

```
src/
├── app/                    # Next.js App Router routes
│   ├── api/                # API routes (auth, projects, transactions, etc.)
│   ├── admin/              # Halaman admin nazhir
│   ├── masuk/              # Halaman login
│   ├── proyek/             # Katalog & detail proyek
│   ├── wakif/              # Portal wakif
│   ├── sertifikat/         # Halaman verifikasi e-sertifikat
│   ├── tentang/            # Halaman tentang
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Halaman beranda
│   └── not-found.tsx       # 404 page
├── components/             # React components
│   ├── admin/              # Admin form components
│   ├── trakteer/           # Floating Trakteer widget & modal
│   ├── *.tsx               # Shared components
├── db/                     # Database (Drizzle)
│   ├── index.ts            # DB connection (Pool)
│   ├── schema.ts           # Drizzle schema
│   └── seed.ts             # Seed data
└── lib/                    # Utilities
    ├── auth.ts             # Session & auth helpers
    ├── queries.ts          # Database queries
    ├── validations.ts      # Zod schemas
    ├── format.ts           # Format helpers
    ├── certificates.ts     # Certificate code generation
    ├── api-guard.ts        # API route guards
    ├── ensure-seed.ts      # Auto seed on startup
    ├── storage.ts          # Image upload (Cloudinary/local)
    ├── email.ts            # Resend email broadcast
    └── constants.ts        # App constants
```

## Instalasi Lokal

### Prasyarat

- Node.js 18+
- PostgreSQL database (Neon disarankan)
- npm atau yarn

### Langkah-langkah

1. **Clone repository**

```bash
git clone https://github.com/username/wakaftracker.git
cd wakaftracker
```

2. **Install dependensi**

```bash
npm install
```

3. **Konfigurasi environment**

Salin `.env.example` menjadi `.env` dan isi nilai yang sesuai:

```bash
cp .env.example .env
```

Isi `DATABASE_URL` dengan connection string Neon Anda, serta opsi `CLOUDINARY_*` dan `RESEND_API_KEY` jika diperlukan.

4. **Migrasi skema database**

```bash
npm run db:push
```

Ini akan membuat semua tabel di database Neon berdasarkan skema Drizzle.

5. **Jalankan development server**

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Akun Demo

Setelah database di-seed, gunakan email berikut untuk login (tidak perlu kata sandi):

| Email | Peran |
|-------|-------|
| nazhir@wakaftracker.id | ADMIN_NAZHIR |
| siti@wakaftracker.id | WAKIF |
| budi@wakaftracker.id | WAKIF |
| fatimah@wakaftracker.id | WAKIF |
| abdullah@wakaftracker.id | WAKIF |
| aisyah@wakaftracker.id | WAKIF |

## Skrip Tersedia

| Skrip | Keterangan |
|-------|------------|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build produksi (webpack) |
| `npm run db:push` | Push skema Drizzle ke database |
| `npm run start` | Menjalankan production server |
| `npm run lint` | Menjalankan ESLint |
| `npm run typecheck` | Menjalankan TypeScript typecheck |

## Deploy ke Vercel

1. Push kode ke GitHub
2. Import repository di [Vercel](https://vercel.com)
3. Tambahkan Environment Variables:
   - `DATABASE_URL` — connection string Neon
   - `CLOUDINARY_CLOUD_NAME` (opsional)
   - `CLOUDINARY_UPLOAD_PRESET` (opsional)
   - `RESEND_API_KEY` (opsional, untuk notifikasi email)
   - `RESEND_FROM` (opsional)
4. `vercel.json` sudah mengatur `db:push` sebelum build, sehingga skema otomatis dibuat di Neon saat deploy.

## Database Schema (Neon PostgreSQL)

Skema lengkap tersedia di `schema.sql` dan `src/db/schema.ts`. Tabel utama:

- `users` — Pengguna (nazhir & wakif)
- `projects` — Proyek wakaf
- `transactions` — Transaksi wakaf / donasi
- `milestones` — Tahapan pembangunan fisik
- `progress_updates` — Laporan progres lapangan
- `financial_logs` — Catatan pengeluaran
- `notifications` — Notifikasi ke wakif

## Trakteer Widget

Widget floating di sudut kanan bawah layar dengan tulisan:

> "Web app ini gratis & bebas iklan. Traktir kopi untuk bantu biaya server?"

Ketika diklik, modal menampilkan pilihan nominal (Rp6.000 dan kelipatannya), QR Code langsung di dalam web app, dan tautan ke [trakteer.id/perpus_opera/](https://trakteer.id/perpus_opera/) tanpa membuat pengguna berpindah halaman.

## Lisensi

Open Source oleh **MZF - 2026**

Dibangun dengan amanah dan transparansi untuk komunitas wakaf.
