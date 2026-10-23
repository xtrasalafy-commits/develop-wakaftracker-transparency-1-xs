export const CATEGORIES = [
  "Masjid",
  "Air Bersih",
  "Pendidikan",
  "Kesehatan",
  "Produktif",
  "Sosial",
] as const;

export const PROJECT_STATUS_LABEL: Record<string, string> = {
  FUNDRAISING: "Penggalangan Dana",
  IN_PROGRESS: "Pembangunan",
  COMPLETED: "Selesai",
  PAUSED: "Ditunda",
};

export const MILESTONE_STATUS_LABEL: Record<string, string> = {
  PENDING: "Belum dimulai",
  IN_PROGRESS: "Berjalan",
  COMPLETED: "Selesai",
};

export const NAZHIR_ORG = "Yayasan Wakaf Al-Amanah";

export const DEMO_ACCOUNTS = [
  {
    email: "nazhir@wakaftracker.id",
    name: "Ahmad Fauzi",
    role: "ADMIN_NAZHIR" as const,
    title: "Nazhir",
  },
  {
    email: "siti@wakaftracker.id",
    name: "Siti Nurhaliza",
    role: "WAKIF" as const,
    title: "Wakif",
  },
  {
    email: "budi@wakaftracker.id",
    name: "Budi Santoso",
    role: "WAKIF" as const,
    title: "Wakif",
  },
  {
    email: "fatimah@wakaftracker.id",
    name: "Fatimah Zahra",
    role: "WAKIF" as const,
    title: "Wakif",
  },
];

export const WAKAF_PRESETS = [100_000, 250_000, 500_000, 1_000_000, 2_500_000, 5_000_000];
