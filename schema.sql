-- WakafTracker Neon PostgreSQL Schema
-- Connect using: DATABASE_URL from .env (Neon connection string)
-- Run: psql "$DATABASE_URL" -f schema.sql

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'WAKIF' CHECK (role IN ('ADMIN_NAZHIR', 'WAKIF')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  target_amount BIGINT NOT NULL,
  collected_amount BIGINT NOT NULL DEFAULT 0,
  physical_progress INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'FUNDRAISING' CHECK (status IN ('FUNDRAISING', 'IN_PROGRESS', 'COMPLETED', 'PAUSED')),
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  nazhir_org TEXT NOT NULL DEFAULT 'Yayasan Wakaf Al-Amanah',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  donor_name TEXT NOT NULL,
  amount BIGINT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  certificate_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS milestones (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')),
  target_completion_date TIMESTAMP WITH TIME ZONE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS progress_updates (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id INTEGER REFERENCES milestones(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_logs (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount BIGINT NOT NULL,
  expense_date TIMESTAMP WITH TIME ZONE NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_certificate_code ON transactions(certificate_code);
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_progress_updates_project_id ON progress_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_progress_updates_milestone_id ON progress_updates(milestone_id);
CREATE INDEX IF NOT EXISTS idx_financial_logs_project_id ON financial_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_project_id ON notifications(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- ============================================
-- SEED DATA: USERS
-- ============================================

INSERT INTO users (name, email, role, created_at) VALUES
  ('Ahmad Fauzi', 'nazhir@wakaftracker.id', 'ADMIN_NAZHIR', '2024-06-01T01:00:00Z'),
  ('Siti Nurhaliza', 'siti@wakaftracker.id', 'WAKIF', '2025-01-12T04:00:00Z'),
  ('Budi Santoso', 'budi@wakaftracker.id', 'WAKIF', '2025-02-03T04:00:00Z'),
  ('Fatimah Zahra', 'fatimah@wakaftracker.id', 'WAKIF', '2025-03-18T04:00:00Z'),
  ('Abdullah Rahman', 'abdullah@wakaftracker.id', 'WAKIF', '2025-04-09T04:00:00Z'),
  ('Aisyah Putri', 'aisyah@wakaftracker.id', 'WAKIF', '2025-05-21T04:00:00Z')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- SEED DATA: PROJECTS
-- ============================================

INSERT INTO projects (title, category, target_amount, collected_amount, physical_progress, status, location, nazhir_org, cover_image, gallery, description, created_at) VALUES
  ('Pembangunan Masjid Al-Hikmah', 'Masjid', 2500000000, 0, 58, 'IN_PROGRESS', 'Cipete, Jakarta Selatan', 'Yayasan Wakaf Al-Amanah', '/images/project-masjid.jpg', '["/images/project-masjid.jpg","/images/progress-construction.jpg","/images/hero-mosque.jpg","/images/community-prayer.jpg"]', 'Masjid Al-Hikmah dibangun sebagai pusat ibadah, tahfidz, dan layanan sosial bagi 1.200 keluarga di sekitar Cipete. Desain hemat energi, ruang wudhu ramah disabilitas, serta aula serbaguna untuk kajian dan dapur jemaah. Setiap rupiah wakaf tercatat dan dipasangkan dengan foto progres lapangan.', '2025-08-01T02:00:00Z'),
  ('Sumur Wakaf Desa Sukamaju', 'Air Bersih', 150000000, 0, 100, 'COMPLETED', 'Sukamaju, Kabupaten Bogor', 'Yayasan Wakaf Al-Amanah', '/images/project-sumur.jpg', '["/images/project-sumur.jpg","/images/community-prayer.jpg"]', 'Satu sumur bor sedalam 80 meter, menara tandon, dan 12 kran komunal yang menyuplai air bersih bagi 340 KK. Proyek ini selesai tepat waktu dan kini dikelola badan kemakmuran desa dengan laporan pemakaian bulanan.', '2025-03-10T02:00:00Z'),
  ('Sekolah Tahfidz Nurul Quran', 'Pendidikan', 800000000, 0, 36, 'IN_PROGRESS', 'Kotagede, Yogyakarta', 'Yayasan Wakaf Al-Amanah', '/images/project-sekolah.jpg', '["/images/project-sekolah.jpg","/images/progress-construction.jpg"]', 'Pembangunan asrama putra-putri, ruang tahfidz ber-AC hemat daya, perpustakaan, dan laboratorium komputer untuk 180 santri. Kurikulum memadukan hafalan, sains dasar, dan keterampilan hidup.', '2025-09-14T02:00:00Z'),
  ('Klinik Kesehatan Umat', 'Kesehatan', 1200000000, 0, 72, 'IN_PROGRESS', 'Wonokromo, Surabaya', 'Yayasan Wakaf Al-Amanah', '/images/project-klinik.jpg', '["/images/project-klinik.jpg","/images/progress-construction.jpg"]', 'Klinik pratama dengan layanan umum, KIA, farmasi, dan ambulans desa. Target 80 pasien per hari dengan skema biaya sukarela bagi dhuafa. Ruang tindakan dan cold-chain obat sudah dalam tahap instalasi.', '2025-07-07T02:00:00Z'),
  ('Wakaf Produktif Kebun Kurma Madura', 'Produktif', 500000000, 0, 22, 'FUNDRAISING', 'Pamekasan, Madura', 'Yayasan Wakaf Al-Amanah', '/images/project-kebun.jpg', '["/images/project-kebun.jpg"]', 'Lahan 2,4 hektare untuk kebun kurma dan tanaman sela. Hasil panen dialokasikan 70% untuk operasional masjid binaan dan beasiswa tahfidz, 30% untuk perawatan kebun. Model wakaf produktif yang transparan setiap musim panen.', '2026-01-08T02:00:00Z'),
  ('Panti Asuhan Yatim Al-Ikhlas', 'Sosial', 600000000, 0, 100, 'COMPLETED', 'Cibiru, Bandung', 'Yayasan Wakaf Al-Amanah', '/images/project-panti.jpg', '["/images/project-panti.jpg","/images/project-sekolah.jpg"]', 'Renovasi asrama, ruang belajar, dapur gizi, dan perpustakaan untuk 48 anak yatim. Proyek telah diserahterimakan dan kini memasuki fase operasional dengan laporan pengasuhan bulanan.', '2025-02-20T02:00:00Z')
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA: TRANSACTIONS
-- ============================================

-- Helper: get IDs via CTE for consistent references
WITH user_ids AS (
  SELECT id, email FROM users
),
project_ids AS (
  SELECT id, title FROM projects
)
INSERT INTO transactions (project_id, user_id, donor_name, amount, is_anonymous, certificate_code, created_at)
SELECT
  p.id,
  u.id,
  u.name,
  25000000,
  FALSE,
  'WKF-2025-MAS-ABC123',
  '2025-08-12T03:10:00Z'
FROM project_ids p, user_ids u
WHERE p.title = 'Pembangunan Masjid Al-Hikmah' AND u.email = 'siti@wakaftracker.id'
ON CONFLICT (certificate_code) DO NOTHING;

-- ============================================
-- SEED DATA: MILESTONES
-- ============================================

WITH project_ids AS (SELECT id, title FROM projects)
INSERT INTO milestones (project_id, title, description, status, sort_order, target_completion_date)
SELECT
  p.id,
  'Pematangan lahan & perizinan',
  'Ukur ulang, cut and fill, IMB, dan pagar kerja.',
  'COMPLETED',
  1,
  '2025-09-30T00:00:00Z'
FROM project_ids p WHERE p.title = 'Pembangunan Masjid Al-Hikmah'
ON CONFLICT DO NOTHING;

WITH project_ids AS (SELECT id, title FROM projects)
INSERT INTO milestones (project_id, title, description, status, sort_order, target_completion_date)
SELECT
  p.id,
  'Pondasi dan struktur',
  'Pondasi tiang, sloof, dan kolom lantai 1-2.',
  'COMPLETED',
  2,
  '2025-12-15T00:00:00Z'
FROM project_ids p WHERE p.title = 'Pembangunan Masjid Al-Hikmah'
ON CONFLICT DO NOTHING;

WITH project_ids AS (SELECT id, title FROM projects)
INSERT INTO milestones (project_id, title, description, status, sort_order, target_completion_date)
SELECT
  p.id,
  'Dinding, kubah, dan atap',
  'Pasangan bata, rangka kubah, genteng metal.',
  'IN_PROGRESS',
  3,
  '2026-04-30T00:00:00Z'
FROM project_ids p WHERE p.title = 'Pembangunan Masjid Al-Hikmah'
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA: PROGRESS UPDATES
-- ============================================

WITH project_ids AS (SELECT id, title FROM projects)
INSERT INTO progress_updates (project_id, milestone_id, title, description, image_urls, created_at)
SELECT
  p.id,
  NULL,
  'Pembersihan lahan tahap 1',
  '1,1 hektare telah dibersihkan dan saluran air tepi dibuat. Bibit kurma dalam masa karantina nursery.',
  '["/images/project-kebun.jpg"]',
  '2026-02-18T03:00:00Z'
FROM project_ids p WHERE p.title = 'Wakaf Produktif Kebun Kurma Madura'
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA: FINANCIAL LOGS
-- ============================================

WITH project_ids AS (SELECT id, title FROM projects)
INSERT INTO financial_logs (project_id, title, amount, expense_date, receipt_url)
SELECT
  p.id,
  'Besi beton ulir 12–16 mm (12 ton)',
  186000000,
  '2025-10-12T00:00:00Z',
  '/images/progress-construction.jpg'
FROM project_ids p WHERE p.title = 'Pembangunan Masjid Al-Hikmah'
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA: NOTIFICATIONS
-- ============================================

WITH user_ids AS (SELECT id, email FROM users),
     project_ids AS (SELECT id, title FROM projects)
INSERT INTO notifications (user_id, project_id, title, message, is_read, created_at)
SELECT
  u.id,
  p.id,
  'Update Masjid Al-Hikmah',
  'Rangka kubah utama sudah 70% terpasang. Lihat foto lapangan terbaru.',
  FALSE,
  '2026-03-02T07:05:00Z'
FROM user_ids u, project_ids p
WHERE u.email = 'siti@wakaftracker.id' AND p.title = 'Pembangunan Masjid Al-Hikmah'
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- SELECT count(*) AS total_users FROM users;
-- SELECT count(*) AS total_projects FROM projects;
-- SELECT count(*) AS total_transactions FROM transactions;
-- SELECT count(*) AS total_milestones FROM milestones;
-- SELECT count(*) AS total_financial_logs FROM financial_logs;
