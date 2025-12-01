import {
  users,
  apps,
  feedback,
  reports,
  downloads,
  type User,
  type UpsertUser,
  type App,
  type InsertApp,
  type Feedback,
  type InsertFeedback,
  type Report,
  type InsertReport,
  type Download,
  type InsertDownload,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // App operations
  getAllApps(): Promise<App[]>;
  getActiveApps(): Promise<App[]>;
  getApp(id: string): Promise<App | undefined>;
  createApp(app: InsertApp & { fileName: string; fileSize?: number }): Promise<App>;
  updateApp(id: string, data: Partial<App>): Promise<App | undefined>;
  deleteApp(id: string): Promise<void>;
  incrementDownloadCount(id: string): Promise<void>;
  
  // Feedback operations
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getUserFeedback(userId: string): Promise<Feedback[]>;
  
  // Report operations
  createReport(report: InsertReport): Promise<Report>;
  getUserReports(userId: string): Promise<Report[]>;
  
  // Download operations
  createDownload(download: InsertDownload): Promise<Download>;
  getUserDownloads(userId: string): Promise<Download[]>;
  getUserStats(userId: string): Promise<{ downloads: number; feedback: number; reports: number }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // App operations
  async getAllApps(): Promise<App[]> {
    return await db.select().from(apps).orderBy(desc(apps.createdAt));
  }

  async getActiveApps(): Promise<App[]> {
    return await db
      .select()
      .from(apps)
      .where(eq(apps.isActive, true))
      .orderBy(desc(apps.createdAt));
  }

  async getApp(id: string): Promise<App | undefined> {
    const [app] = await db.select().from(apps).where(eq(apps.id, id));
    return app;
  }

  async createApp(appData: InsertApp & { fileName: string; fileSize?: number }): Promise<App> {
    const [app] = await db
      .insert(apps)
      .values(appData)
      .returning();
    return app;
  }

  async updateApp(id: string, data: Partial<App>): Promise<App | undefined> {
    const [app] = await db
      .update(apps)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(apps.id, id))
      .returning();
    return app;
  }

  async deleteApp(id: string): Promise<void> {
    await db.delete(apps).where(eq(apps.id, id));
  }

  async incrementDownloadCount(id: string): Promise<void> {
    await db
      .update(apps)
      .set({ downloadCount: sql`${apps.downloadCount} + 1` })
      .where(eq(apps.id, id));
  }

  // Feedback operations
  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const [fb] = await db.insert(feedback).values(feedbackData).returning();
    return fb;
  }

  async getUserFeedback(userId: string): Promise<Feedback[]> {
    return await db
      .select()
      .from(feedback)
      .where(eq(feedback.userId, userId))
      .orderBy(desc(feedback.createdAt));
  }

  // Report operations
  async createReport(reportData: InsertReport): Promise<Report> {
    const [report] = await db.insert(reports).values(reportData).returning();
    return report;
  }

  async getUserReports(userId: string): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.userId, userId))
      .orderBy(desc(reports.createdAt));
  }

  // Download operations
  async createDownload(downloadData: InsertDownload): Promise<Download> {
    const [download] = await db.insert(downloads).values(downloadData).returning();
    return download;
  }

  async getUserDownloads(userId: string): Promise<Download[]> {
    return await db
      .select()
      .from(downloads)
      .where(eq(downloads.userId, userId))
      .orderBy(desc(downloads.downloadedAt));
  }

  async getUserStats(userId: string): Promise<{ downloads: number; feedback: number; reports: number }> {
    const [downloadCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(downloads)
      .where(eq(downloads.userId, userId));
    
    const [feedbackCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(feedback)
      .where(eq(feedback.userId, userId));
    
    const [reportCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(reports)
      .where(eq(reports.userId, userId));

    return {
      downloads: downloadCount?.count || 0,
      feedback: feedbackCount?.count || 0,
      reports: reportCount?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
