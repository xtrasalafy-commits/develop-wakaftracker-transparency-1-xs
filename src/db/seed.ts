import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  financialLogs,
  milestones,
  notifications,
  progressUpdates,
  projects,
  transactions,
  users,
} from "@/db/schema";
import { generateCertificateCode } from "@/lib/certificates";

function at(iso: string) {
  return new Date(iso);
}

export async function seedDatabase() {
  const insertedUsers = await db
    .insert(users)
    .values([
      {
        name: "Ahmad Fauzi",
        email: "nazhir@wakaftracker.id",
        role: "ADMIN_NAZHIR",
        createdAt: at("2024-06-01T01:00:00Z"),
      },
      {
        name: "Siti Nurhaliza",
        email: "siti@wakaftracker.id",
        role: "WAKIF",
        createdAt: at("2025-01-12T04:00:00Z"),
      },
      {
        name: "Budi Santoso",
        email: "budi@wakaftracker.id",
        role: "WAKIF",
        createdAt: at("2025-02-03T04:00:00Z"),
      },
      {
        name: "Fatimah Zahra",
        email: "fatimah@wakaftracker.id",
        role: "WAKIF",
        createdAt: at("2025-03-18T04:00:00Z"),
      },
      {
        name: "Abdullah Rahman",
        email: "abdullah@wakaftracker.id",
        role: "WAKIF",
        createdAt: at("2025-04-09T04:00:00Z"),
      },
      {
        name: "Aisyah Putri",
        email: "aisyah@wakaftracker.id",
        role: "WAKIF",
        createdAt: at("2025-05-21T04:00:00Z"),
      },
    ])
    .returning();

  const byEmail = Object.fromEntries(insertedUsers.map((u) => [u.email, u]));

  const insertedProjects = await db
    .insert(projects)
    .values([
      {
        title: "Pembangunan Masjid Al-Hikmah",
        category: "Masjid",
        targetAmount: 2_500_000_000,
        collectedAmount: 0,
        physicalProgress: 58,
        status: "IN_PROGRESS",
        location: "Cipete, Jakarta Selatan",
        nazhirOrg: "Yayasan Wakaf Al-Amanah",
        coverImage: "/images/project-masjid.jpg",
        gallery: [
          "/images/project-masjid.jpg",
          "/images/progress-construction.jpg",
          "/images/hero-mosque.jpg",
          "/images/community-prayer.jpg",
        ],
        description:
          "Masjid Al-Hikmah dibangun sebagai pusat ibadah, tahfidz, dan layanan sosial bagi 1.200 keluarga di sekitar Cipete. Desain hemat energi, ruang wudhu ramah disabilitas, serta aula serbaguna untuk kajian dan dapur jemaah. Setiap rupiah wakaf tercatat dan dipasangkan dengan foto progres lapangan.",
        createdAt: at("2025-08-01T02:00:00Z"),
      },
      {
        title: "Sumur Wakaf Desa Sukamaju",
        category: "Air Bersih",
        targetAmount: 150_000_000,
        collectedAmount: 0,
        physicalProgress: 100,
        status: "COMPLETED",
        location: "Sukamaju, Kabupaten Bogor",
        nazhirOrg: "Yayasan Wakaf Al-Amanah",
        coverImage: "/images/project-sumur.jpg",
        gallery: ["/images/project-sumur.jpg", "/images/community-prayer.jpg"],
        description:
          "Satu sumur bor sedalam 80 meter, menara tandon, dan 12 kran komunal yang menyuplai air bersih bagi 340 KK. Proyek ini selesai tepat waktu dan kini dikelola badan kemakmuran desa dengan laporan pemakaian bulanan.",
        createdAt: at("2025-03-10T02:00:00Z"),
      },
      {
        title: "Sekolah Tahfidz Nurul Quran",
        category: "Pendidikan",
        targetAmount: 800_000_000,
        collectedAmount: 0,
        physicalProgress: 36,
        status: "IN_PROGRESS",
        location: "Kotagede, Yogyakarta",
        nazhirOrg: "Yayasan Wakaf Al-Amanah",
        coverImage: "/images/project-sekolah.jpg",
        gallery: ["/images/project-sekolah.jpg", "/images/progress-construction.jpg"],
        description:
          "Pembangunan asrama putra-putri, ruang tahfidz ber-AC hemat daya, perpustakaan, dan laboratorium komputer untuk 180 santri. Kurikulum memadukan hafalan, sains dasar, dan keterampilan hidup.",
        createdAt: at("2025-09-14T02:00:00Z"),
      },
      {
        title: "Klinik Kesehatan Umat",
        category: "Kesehatan",
        targetAmount: 1_200_000_000,
        collectedAmount: 0,
        physicalProgress: 72,
        status: "IN_PROGRESS",
        location: "Wonokromo, Surabaya",
        nazhirOrg: "Yayasan Wakaf Al-Amanah",
        coverImage: "/images/project-klinik.jpg",
        gallery: ["/images/project-klinik.jpg", "/images/progress-construction.jpg"],
        description:
          "Klinik pratama dengan layanan umum, KIA, farmasi, dan ambulans desa. Target 80 pasien per hari dengan skema biaya sukarela bagi dhuafa. Ruang tindakan dan cold-chain obat sudah dalam tahap instalasi.",
        createdAt: at("2025-07-07T02:00:00Z"),
      },
      {
        title: "Wakaf Produktif Kebun Kurma Madura",
        category: "Produktif",
        targetAmount: 500_000_000,
        collectedAmount: 0,
        physicalProgress: 22,
        status: "FUNDRAISING",
        location: "Pamekasan, Madura",
        nazhirOrg: "Yayasan Wakaf Al-Amanah",
        coverImage: "/images/project-kebun.jpg",
        gallery: ["/images/project-kebun.jpg"],
        description:
          "Lahan 2,4 hektare untuk kebun kurma dan tanaman sela. Hasil panen dialokasikan 70% untuk operasional masjid binaan dan beasiswa tahfidz, 30% untuk perawatan kebun. Model wakaf produktif yang transparan setiap musim panen.",
        createdAt: at("2026-01-08T02:00:00Z"),
      },
      {
        title: "Panti Asuhan Yatim Al-Ikhlas",
        category: "Sosial",
        targetAmount: 600_000_000,
        collectedAmount: 0,
        physicalProgress: 100,
        status: "COMPLETED",
        location: "Cibiru, Bandung",
        nazhirOrg: "Yayasan Wakaf Al-Amanah",
        coverImage: "/images/project-panti.jpg",
        gallery: ["/images/project-panti.jpg", "/images/project-sekolah.jpg"],
        description:
          "Renovasi asrama, ruang belajar, dapur gizi, dan perpustakaan untuk 48 anak yatim. Proyek telah diserahterimakan dan kini memasuki fase operasional dengan laporan pengasuhan bulanan.",
        createdAt: at("2025-02-20T02:00:00Z"),
      },
    ])
    .returning();

  const p = Object.fromEntries(insertedProjects.map((row) => [row.title, row]));
  const masjid = p["Pembangunan Masjid Al-Hikmah"]!;
  const sumur = p["Sumur Wakaf Desa Sukamaju"]!;
  const sekolah = p["Sekolah Tahfidz Nurul Quran"]!;
  const klinik = p["Klinik Kesehatan Umat"]!;
  const kebun = p["Wakaf Produktif Kebun Kurma Madura"]!;
  const panti = p["Panti Asuhan Yatim Al-Ikhlas"]!;

  const siti = byEmail["siti@wakaftracker.id"]!;
  const budi = byEmail["budi@wakaftracker.id"]!;
  const fatimah = byEmail["fatimah@wakaftracker.id"]!;
  const abdullah = byEmail["abdullah@wakaftracker.id"]!;
  const aisyah = byEmail["aisyah@wakaftracker.id"]!;

  const donationSeed: Array<{
    projectId: number;
    userId: number | null;
    donorName: string;
    amount: number;
    isAnonymous: boolean;
    createdAt: Date;
    title: string;
  }> = [
    {
      projectId: masjid.id,
      userId: siti.id,
      donorName: siti.name,
      amount: 25_000_000,
      isAnonymous: false,
      createdAt: at("2025-08-12T03:10:00Z"),
      title: masjid.title,
    },
    {
      projectId: masjid.id,
      userId: budi.id,
      donorName: budi.name,
      amount: 50_000_000,
      isAnonymous: false,
      createdAt: at("2025-09-02T06:20:00Z"),
      title: masjid.title,
    },
    {
      projectId: masjid.id,
      userId: fatimah.id,
      donorName: fatimah.name,
      amount: 10_000_000,
      isAnonymous: true,
      createdAt: at("2025-10-01T08:00:00Z"),
      title: masjid.title,
    },
    {
      projectId: masjid.id,
      userId: abdullah.id,
      donorName: abdullah.name,
      amount: 100_000_000,
      isAnonymous: false,
      createdAt: at("2025-11-11T02:40:00Z"),
      title: masjid.title,
    },
    {
      projectId: masjid.id,
      userId: null,
      donorName: "Hamba Allah",
      amount: 1_662_500_000,
      isAnonymous: true,
      createdAt: at("2025-12-20T09:00:00Z"),
      title: masjid.title,
    },
    {
      projectId: sumur.id,
      userId: aisyah.id,
      donorName: aisyah.name,
      amount: 15_000_000,
      isAnonymous: false,
      createdAt: at("2025-03-22T04:00:00Z"),
      title: sumur.title,
    },
    {
      projectId: sumur.id,
      userId: budi.id,
      donorName: budi.name,
      amount: 20_000_000,
      isAnonymous: false,
      createdAt: at("2025-04-04T04:00:00Z"),
      title: sumur.title,
    },
    {
      projectId: sumur.id,
      userId: null,
      donorName: "Komunitas Subuh Bogor",
      amount: 115_000_000,
      isAnonymous: false,
      createdAt: at("2025-05-18T04:00:00Z"),
      title: sumur.title,
    },
    {
      projectId: sekolah.id,
      userId: siti.id,
      donorName: siti.name,
      amount: 8_000_000,
      isAnonymous: false,
      createdAt: at("2025-09-20T04:00:00Z"),
      title: sekolah.title,
    },
    {
      projectId: sekolah.id,
      userId: fatimah.id,
      donorName: fatimah.name,
      amount: 12_000_000,
      isAnonymous: false,
      createdAt: at("2025-10-12T04:00:00Z"),
      title: sekolah.title,
    },
    {
      projectId: sekolah.id,
      userId: abdullah.id,
      donorName: abdullah.name,
      amount: 400_000_000,
      isAnonymous: false,
      createdAt: at("2025-12-01T04:00:00Z"),
      title: sekolah.title,
    },
    {
      projectId: klinik.id,
      userId: aisyah.id,
      donorName: aisyah.name,
      amount: 30_000_000,
      isAnonymous: false,
      createdAt: at("2025-07-21T04:00:00Z"),
      title: klinik.title,
    },
    {
      projectId: klinik.id,
      userId: budi.id,
      donorName: budi.name,
      amount: 75_000_000,
      isAnonymous: false,
      createdAt: at("2025-08-30T04:00:00Z"),
      title: klinik.title,
    },
    {
      projectId: klinik.id,
      userId: siti.id,
      donorName: siti.name,
      amount: 785_000_000,
      isAnonymous: true,
      createdAt: at("2025-11-05T04:00:00Z"),
      title: klinik.title,
    },
    {
      projectId: kebun.id,
      userId: fatimah.id,
      donorName: fatimah.name,
      amount: 25_000_000,
      isAnonymous: false,
      createdAt: at("2026-01-20T04:00:00Z"),
      title: kebun.title,
    },
    {
      projectId: kebun.id,
      userId: abdullah.id,
      donorName: abdullah.name,
      amount: 150_000_000,
      isAnonymous: false,
      createdAt: at("2026-02-02T04:00:00Z"),
      title: kebun.title,
    },
    {
      projectId: panti.id,
      userId: aisyah.id,
      donorName: aisyah.name,
      amount: 40_000_000,
      isAnonymous: false,
      createdAt: at("2025-03-01T04:00:00Z"),
      title: panti.title,
    },
    {
      projectId: panti.id,
      userId: siti.id,
      donorName: siti.name,
      amount: 20_000_000,
      isAnonymous: false,
      createdAt: at("2025-03-15T04:00:00Z"),
      title: panti.title,
    },
    {
      projectId: panti.id,
      userId: null,
      donorName: "Keluarga Al-Ikhlas",
      amount: 540_000_000,
      isAnonymous: false,
      createdAt: at("2025-06-09T04:00:00Z"),
      title: panti.title,
    },
  ];

  await db.insert(transactions).values(
    donationSeed.map((row) => ({
      projectId: row.projectId,
      userId: row.userId,
      donorName: row.donorName,
      amount: row.amount,
      isAnonymous: row.isAnonymous,
      certificateCode: generateCertificateCode(row.title),
      createdAt: row.createdAt,
    })),
  );

  const totals = new Map<number, number>();
  for (const row of donationSeed) {
    totals.set(row.projectId, (totals.get(row.projectId) || 0) + row.amount);
  }
  for (const [projectId, total] of totals) {
    await db.update(projects).set({ collectedAmount: total }).where(eq(projects.id, projectId));
  }

  const insertedMilestones = await db
    .insert(milestones)
    .values([
      {
        projectId: masjid.id,
        title: "Pematangan lahan & perizinan",
        description: "Ukur ulang, cut and fill, IMB, dan pagar kerja.",
        status: "COMPLETED",
        sortOrder: 1,
        targetCompletionDate: at("2025-09-30T00:00:00Z"),
      },
      {
        projectId: masjid.id,
        title: "Pondasi dan struktur",
        description: "Pondasi tiang, sloof, dan kolom lantai 1-2.",
        status: "COMPLETED",
        sortOrder: 2,
        targetCompletionDate: at("2025-12-15T00:00:00Z"),
      },
      {
        projectId: masjid.id,
        title: "Dinding, kubah, dan atap",
        description: "Pasangan bata, rangka kubah, genteng metal.",
        status: "IN_PROGRESS",
        sortOrder: 3,
        targetCompletionDate: at("2026-04-30T00:00:00Z"),
      },
      {
        projectId: masjid.id,
        title: "Finishing interior & MEP",
        description: "Listrik, audio, AC, karpet, dan mihrab.",
        status: "PENDING",
        sortOrder: 4,
        targetCompletionDate: at("2026-08-31T00:00:00Z"),
      },
      {
        projectId: masjid.id,
        title: "Serah terima dan peresmian",
        description: "SNI, sertifikat laik fungsi, dan inaugurasi.",
        status: "PENDING",
        sortOrder: 5,
        targetCompletionDate: at("2026-10-15T00:00:00Z"),
      },
      {
        projectId: sumur.id,
        title: "Survei geolistrik",
        description: "Penentuan titik air tanah.",
        status: "COMPLETED",
        sortOrder: 1,
        targetCompletionDate: at("2025-03-20T00:00:00Z"),
      },
      {
        projectId: sumur.id,
        title: "Pengeboran dan instalasi pompa",
        description: "Bor 80m, pompa submersible, panel surya.",
        status: "COMPLETED",
        sortOrder: 2,
        targetCompletionDate: at("2025-05-10T00:00:00Z"),
      },
      {
        projectId: sumur.id,
        title: "Jaringan kran komunal",
        description: "12 kran, tandon 5.000 liter, pelatihan operator.",
        status: "COMPLETED",
        sortOrder: 3,
        targetCompletionDate: at("2025-06-20T00:00:00Z"),
      },
      {
        projectId: sekolah.id,
        title: "Pondasi asrama",
        description: "Galian dan cor pondasi sayap putra.",
        status: "COMPLETED",
        sortOrder: 1,
        targetCompletionDate: at("2025-11-01T00:00:00Z"),
      },
      {
        projectId: sekolah.id,
        title: "Struktur ruang tahfidz",
        description: "Kolom dan plat lantai 2.",
        status: "IN_PROGRESS",
        sortOrder: 2,
        targetCompletionDate: at("2026-03-15T00:00:00Z"),
      },
      {
        projectId: sekolah.id,
        title: "Fit-out kelas dan perpustakaan",
        description: "Partisi, rak, dan jaringan.",
        status: "PENDING",
        sortOrder: 3,
        targetCompletionDate: at("2026-07-01T00:00:00Z"),
      },
      {
        projectId: klinik.id,
        title: "Struktur bangunan klinik",
        description: "Rangka baja ringan dan dinding hebel.",
        status: "COMPLETED",
        sortOrder: 1,
        targetCompletionDate: at("2025-10-01T00:00:00Z"),
      },
      {
        projectId: klinik.id,
        title: "Instalasi medis & farmasi",
        description: "Cold chain, ruang tindakan, gas medis.",
        status: "IN_PROGRESS",
        sortOrder: 2,
        targetCompletionDate: at("2026-03-01T00:00:00Z"),
      },
      {
        projectId: klinik.id,
        title: "Uji fungsi dan izin operasional",
        description: "Izin Dinkes dan akreditasi awal.",
        status: "PENDING",
        sortOrder: 3,
        targetCompletionDate: at("2026-05-20T00:00:00Z"),
      },
      {
        projectId: kebun.id,
        title: "Pembersihan lahan dan irigasi",
        description: "Terasering dan tetes irigasi.",
        status: "IN_PROGRESS",
        sortOrder: 1,
        targetCompletionDate: at("2026-04-01T00:00:00Z"),
      },
      {
        projectId: kebun.id,
        title: "Penanaman bibit kurma",
        description: "800 bibit unggul dan tanaman sela.",
        status: "PENDING",
        sortOrder: 2,
        targetCompletionDate: at("2026-06-15T00:00:00Z"),
      },
      {
        projectId: panti.id,
        title: "Renovasi asrama",
        description: "Atap, kamar, dan kamar mandi.",
        status: "COMPLETED",
        sortOrder: 1,
        targetCompletionDate: at("2025-05-01T00:00:00Z"),
      },
      {
        projectId: panti.id,
        title: "Dapur gizi & ruang belajar",
        description: "Peralatan masak dan perpustakaan.",
        status: "COMPLETED",
        sortOrder: 2,
        targetCompletionDate: at("2025-07-15T00:00:00Z"),
      },
    ])
    .returning();

  const msMasjid3 = insertedMilestones.find((m) => m.title === "Dinding, kubah, dan atap")!;
  const msSumur3 = insertedMilestones.find((m) => m.title === "Jaringan kran komunal")!;
  const msKlinik2 = insertedMilestones.find((m) => m.title === "Instalasi medis & farmasi")!;
  const msSekolah2 = insertedMilestones.find((m) => m.title === "Struktur ruang tahfidz")!;
  const msPanti2 = insertedMilestones.find((m) => m.title === "Dapur gizi & ruang belajar")!;

  await db.insert(progressUpdates).values([
    {
      projectId: masjid.id,
      milestoneId: msMasjid3.id,
      title: "Pemasangan rangka kubah 70%",
      description:
        "Rangka baja kubah utama terpasang. Tim las menyelesaikan 12 rusuk dari 16. Cuaca mendukung, target closing kubah minggu ke-3 April.",
      imageUrls: ["/images/progress-construction.jpg", "/images/project-masjid.jpg"],
      createdAt: at("2026-03-02T07:00:00Z"),
    },
    {
      projectId: masjid.id,
      milestoneId: msMasjid3.id,
      title: "Dinding lantai 2 rampung",
      description:
        "Pasangan bata ringan lantai 2 selesai, plesteran luar dimulai dari sisi kiblat. Dilakukan uji kelurusan mihrab.",
      imageUrls: ["/images/project-masjid.jpg"],
      createdAt: at("2026-02-14T07:00:00Z"),
    },
    {
      projectId: sumur.id,
      milestoneId: msSumur3.id,
      title: "Sumur diresmikan bersama warga",
      description:
        "Debit terukur 1,8 liter/detik. Panitia desa menerima SOP perawatan pompa dan jadwal giliran pengisian tandon.",
      imageUrls: ["/images/project-sumur.jpg"],
      createdAt: at("2025-06-22T02:00:00Z"),
    },
    {
      projectId: sekolah.id,
      milestoneId: msSekolah2.id,
      title: "Cor plat lantai 2",
      description:
        "Casting plat 180 m² berjalan 14 jam. Sample kubus beton dikirim ke lab untuk uji kuat tekan 14 hari.",
      imageUrls: ["/images/progress-construction.jpg", "/images/project-sekolah.jpg"],
      createdAt: at("2026-02-28T07:00:00Z"),
    },
    {
      projectId: klinik.id,
      milestoneId: msKlinik2.id,
      title: "Instalasi cold-chain farmasi",
      description:
        "Lemari vaksin dan logger suhu terpasang. Kalibrasi awal menunjukkan deviasi 0,3°C — dalam ambang aman.",
      imageUrls: ["/images/project-klinik.jpg"],
      createdAt: at("2026-03-08T03:00:00Z"),
    },
    {
      projectId: panti.id,
      milestoneId: msPanti2.id,
      title: "Serah terima kunci asrama",
      description:
        "48 tempat tidur, dapur gizi, dan perpustakaan siap pakai. Pengasuh menerima daftar inventaris lengkap.",
      imageUrls: ["/images/project-panti.jpg"],
      createdAt: at("2025-07-20T03:00:00Z"),
    },
    {
      projectId: kebun.id,
      milestoneId: null,
      title: "Pembersihan lahan tahap 1",
      description:
        "1,1 hektare telah dibersihkan dan saluran air tepi dibuat. Bibit kurma dalam masa karantina nursery.",
      imageUrls: ["/images/project-kebun.jpg"],
      createdAt: at("2026-02-18T03:00:00Z"),
    },
  ]);

  await db.insert(financialLogs).values([
    {
      projectId: masjid.id,
      title: "Besi beton ulir 12–16 mm (12 ton)",
      amount: 186_000_000,
      expenseDate: at("2025-10-12T00:00:00Z"),
      receiptUrl: "/images/progress-construction.jpg",
    },
    {
      projectId: masjid.id,
      title: "Upah tukang & mandor Oktober–Desember",
      amount: 142_500_000,
      expenseDate: at("2025-12-28T00:00:00Z"),
      receiptUrl: "/images/progress-construction.jpg",
    },
    {
      projectId: masjid.id,
      title: "Rangka baja kubah dan scaffolding",
      amount: 210_000_000,
      expenseDate: at("2026-02-20T00:00:00Z"),
      receiptUrl: "/images/project-masjid.jpg",
    },
    {
      projectId: sumur.id,
      title: "Jasa bor dan casing 80 meter",
      amount: 68_000_000,
      expenseDate: at("2025-04-18T00:00:00Z"),
      receiptUrl: "/images/project-sumur.jpg",
    },
    {
      projectId: sumur.id,
      title: "Pompa submersible + panel surya",
      amount: 41_000_000,
      expenseDate: at("2025-05-09T00:00:00Z"),
      receiptUrl: "/images/project-sumur.jpg",
    },
    {
      projectId: sekolah.id,
      title: "Ready mix beton plat lantai 2",
      amount: 97_000_000,
      expenseDate: at("2026-02-27T00:00:00Z"),
      receiptUrl: "/images/progress-construction.jpg",
    },
    {
      projectId: klinik.id,
      title: "Peralatan cold-chain dan logger",
      amount: 64_800_000,
      expenseDate: at("2026-03-05T00:00:00Z"),
      receiptUrl: "/images/project-klinik.jpg",
    },
    {
      projectId: kebun.id,
      title: "Sewa alat berat pembersihan lahan",
      amount: 18_500_000,
      expenseDate: at("2026-02-10T00:00:00Z"),
      receiptUrl: "/images/project-kebun.jpg",
    },
    {
      projectId: panti.id,
      title: "Kasur, lemari, dan peralatan dapur",
      amount: 52_000_000,
      expenseDate: at("2025-07-02T00:00:00Z"),
      receiptUrl: "/images/project-panti.jpg",
    },
  ]);

  await db.insert(notifications).values([
    {
      userId: siti.id,
      projectId: masjid.id,
      title: "Update Masjid Al-Hikmah",
      message: "Rangka kubah utama sudah 70% terpasang. Lihat foto lapangan terbaru.",
      isRead: false,
      createdAt: at("2026-03-02T07:05:00Z"),
    },
    {
      userId: budi.id,
      projectId: masjid.id,
      title: "Update Masjid Al-Hikmah",
      message: "Rangka kubah utama sudah 70% terpasang. Lihat foto lapangan terbaru.",
      isRead: false,
      createdAt: at("2026-03-02T07:05:00Z"),
    },
    {
      userId: abdullah.id,
      projectId: sekolah.id,
      title: "Update Sekolah Tahfidz",
      message: "Cor plat lantai 2 selesai. Sample beton dikirim ke laboratorium.",
      isRead: true,
      createdAt: at("2026-02-28T07:10:00Z"),
    },
    {
      userId: aisyah.id,
      projectId: klinik.id,
      title: "Update Klinik Umat",
      message: "Cold-chain farmasi terpasang dan lulus kalibrasi awal.",
      isRead: false,
      createdAt: at("2026-03-08T03:10:00Z"),
    },
  ]);
}
