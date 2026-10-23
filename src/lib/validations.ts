import { z } from "zod";

export const wakafSchema = z.object({
  projectId: z.number().int().positive(),
  donorName: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  amount: z
    .number()
    .int("Nominal harus bilangan bulat")
    .min(10_000, "Minimal wakaf Rp 10.000")
    .max(10_000_000_000, "Nominal melebihi batas"),
  isAnonymous: z.boolean(),
});

export const projectSchema = z.object({
  title: z.string().trim().min(5, "Judul terlalu singkat").max(120),
  category: z.string().trim().min(3),
  targetAmount: z.number().int().positive("Target dana harus lebih dari 0"),
  status: z.enum(["FUNDRAISING", "IN_PROGRESS", "COMPLETED", "PAUSED"]),
  location: z.string().trim().min(3),
  description: z.string().trim().min(20, "Uraikan proyek minimal 20 karakter"),
  coverImage: z.string().trim().min(1, "Cover wajib diisi"),
  gallery: z.array(z.string()).optional(),
  nazhirOrg: z.string().trim().min(3),
  physicalProgress: z.number().int().min(0).max(100).optional(),
});

export const milestoneSchema = z.object({
  projectId: z.number().int().positive(),
  title: z.string().trim().min(3),
  description: z.string().trim().optional().default(""),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).default("PENDING"),
  targetCompletionDate: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const milestonePatchSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(3).optional(),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  targetCompletionDate: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
});

export const progressSchema = z.object({
  projectId: z.number().int().positive(),
  milestoneId: z.number().int().positive().nullable().optional(),
  title: z.string().trim().min(3),
  description: z.string().trim().min(10, "Tuliskan ringkasan progres"),
  imageUrls: z.array(z.string()).default([]),
  physicalProgress: z.number().int().min(0).max(100).optional(),
  milestoneStatus: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
});

export const expenseSchema = z.object({
  projectId: z.number().int().positive(),
  title: z.string().trim().min(3),
  amount: z.number().int().positive("Nominal pengeluaran harus positif"),
  expenseDate: z.string().min(4, "Tanggal pengeluaran wajib"),
  receiptUrl: z.string().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Email tidak valid"),
});

export type WakafInput = z.infer<typeof wakafSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
