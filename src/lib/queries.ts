import { and, desc, eq, inArray, sql } from "drizzle-orm";
import {
  db,
  financialLogs,
  milestones,
  notifications,
  progressUpdates,
  projects,
  transactions,
  users,
} from "@/db";
import { fundingPercent } from "@/lib/utils";

export async function refreshCollectedAmount(projectId: number) {
  const [row] = await db
    .select({
      total: sql<number>`coalesce(sum(${transactions.amount}), 0)::bigint`,
    })
    .from(transactions)
    .where(eq(transactions.projectId, projectId));

  const total = Number(row?.total ?? 0);
  await db
    .update(projects)
    .set({ collectedAmount: total })
    .where(eq(projects.id, projectId));
  return total;
}

export async function getDashboardStats() {
  const [projectStats] = await db
    .select({
      count: sql<number>`count(*)::int`,
      collected: sql<number>`coalesce(sum(${projects.collectedAmount}), 0)::bigint`,
      target: sql<number>`coalesce(sum(${projects.targetAmount}), 0)::bigint`,
    })
    .from(projects);

  const [wakifStats] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(eq(users.role, "WAKIF"));

  const [txStats] = await db
    .select({
      count: sql<number>`count(*)::int`,
      total: sql<number>`coalesce(sum(${transactions.amount}), 0)::bigint`,
    })
    .from(transactions);

  const [expenseStats] = await db
    .select({
      total: sql<number>`coalesce(sum(${financialLogs.amount}), 0)::bigint`,
    })
    .from(financialLogs);

  return {
    projectCount: Number(projectStats?.count ?? 0),
    collected: Number(projectStats?.collected ?? 0),
    target: Number(projectStats?.target ?? 0),
    wakifCount: Number(wakifStats?.count ?? 0),
    transactionCount: Number(txStats?.count ?? 0),
    transactionTotal: Number(txStats?.total ?? 0),
    expenseTotal: Number(expenseStats?.total ?? 0),
  };
}

export async function listProjects() {
  return db.select().from(projects).orderBy(desc(projects.createdAt));
}

export async function getProjectDetail(id: number) {
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!project) return null;

  const [ms, txs, logs, updates] = await Promise.all([
    db
      .select()
      .from(milestones)
      .where(eq(milestones.projectId, id))
      .orderBy(milestones.sortOrder, milestones.id),
    db
      .select()
      .from(transactions)
      .where(eq(transactions.projectId, id))
      .orderBy(desc(transactions.createdAt)),
    db
      .select()
      .from(financialLogs)
      .where(eq(financialLogs.projectId, id))
      .orderBy(desc(financialLogs.expenseDate)),
    db
      .select()
      .from(progressUpdates)
      .where(eq(progressUpdates.projectId, id))
      .orderBy(desc(progressUpdates.createdAt)),
  ]);

  const expenseTotal = logs.reduce((sum, row) => sum + Number(row.amount), 0);

  return {
    project,
    milestones: ms,
    transactions: txs,
    financialLogs: logs,
    progressUpdates: updates,
    expenseTotal,
    fundingPct: fundingPercent(project.collectedAmount, project.targetAmount),
    remaining: Math.max(0, project.targetAmount - project.collectedAmount),
  };
}

export async function getWakifPortal(userId: number) {
  const myTx = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.createdAt));

  const projectIds = [...new Set(myTx.map((row) => row.projectId))];
  const fundedProjects =
    projectIds.length > 0
      ? await db.select().from(projects).where(inArray(projects.id, projectIds))
      : [];

  const feed =
    projectIds.length > 0
      ? await db
          .select()
          .from(progressUpdates)
          .where(inArray(progressUpdates.projectId, projectIds))
          .orderBy(desc(progressUpdates.createdAt))
          .limit(20)
      : [];

  const notes = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(12);

  const totalGiven = myTx.reduce((sum, row) => sum + Number(row.amount), 0);

  return {
    transactions: myTx,
    fundedProjects,
    feed,
    notifications: notes,
    totalGiven,
    certificateCount: myTx.length,
  };
}

export async function getCertificate(code: string) {
  const [tx] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.certificateCode, code))
    .limit(1);
  if (!tx) return null;
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, tx.projectId))
    .limit(1);
  return { transaction: tx, project: project ?? null };
}

export async function listRecentUpdates(limit = 4) {
  return db
    .select({
      id: progressUpdates.id,
      title: progressUpdates.title,
      description: progressUpdates.description,
      imageUrls: progressUpdates.imageUrls,
      createdAt: progressUpdates.createdAt,
      projectId: progressUpdates.projectId,
      projectTitle: projects.title,
    })
    .from(progressUpdates)
    .innerJoin(projects, eq(progressUpdates.projectId, projects.id))
    .orderBy(desc(progressUpdates.createdAt))
    .limit(limit);
}

export async function markNotificationsRead(userId: number) {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
}
