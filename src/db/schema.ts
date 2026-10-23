import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").$type<"ADMIN_NAZHIR" | "WAKIF">().notNull().default("WAKIF"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  targetAmount: bigint("target_amount", { mode: "number" }).notNull(),
  collectedAmount: bigint("collected_amount", { mode: "number" }).notNull().default(0),
  physicalProgress: integer("physical_progress").notNull().default(0),
  status: text("status")
    .$type<"FUNDRAISING" | "IN_PROGRESS" | "COMPLETED" | "PAUSED">()
    .notNull()
    .default("FUNDRAISING"),
  location: text("location").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image").notNull(),
  gallery: jsonb("gallery").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  nazhirOrg: text("nazhir_org").notNull().default("Yayasan Wakaf Al-Amanah"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  donorName: text("donor_name").notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  certificateCode: text("certificate_code").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  status: text("status")
    .$type<"PENDING" | "IN_PROGRESS" | "COMPLETED">()
    .notNull()
    .default("PENDING"),
  targetCompletionDate: timestamp("target_completion_date", { withTimezone: true }),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const progressUpdates = pgTable("progress_updates", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  milestoneId: integer("milestone_id").references(() => milestones.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrls: jsonb("image_urls").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const financialLogs = pgTable("financial_logs", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  expenseDate: timestamp("expense_date", { withTimezone: true }).notNull(),
  receiptUrl: text("receipt_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: integer("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type Milestone = typeof milestones.$inferSelect;
export type ProgressUpdate = typeof progressUpdates.$inferSelect;
export type FinancialLog = typeof financialLogs.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
