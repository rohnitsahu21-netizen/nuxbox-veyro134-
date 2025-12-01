import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { insertFeedbackSchema, insertReportSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure downloads directory exists
const uploadsDir = path.join(process.cwd(), "downloads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith(".zip")) {
      cb(null, true);
    } else {
      cb(new Error("Only ZIP files are allowed"));
    }
  },
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User stats
  app.get("/api/user/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // User downloads
  app.get("/api/user/downloads", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userDownloads = await storage.getUserDownloads(userId);
      
      // Fetch app details for each download
      const downloadsWithApps = await Promise.all(
        userDownloads.map(async (download) => {
          const app = await storage.getApp(download.appId);
          return { ...download, app };
        })
      );
      
      res.json(downloadsWithApps);
    } catch (error) {
      console.error("Error fetching downloads:", error);
      res.status(500).json({ message: "Failed to fetch downloads" });
    }
  });

  // User feedback
  app.get("/api/user/feedback", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userFeedback = await storage.getUserFeedback(userId);
      res.json(userFeedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  // User reports
  app.get("/api/user/reports", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userReports = await storage.getUserReports(userId);
      
      // Fetch app details for each report
      const reportsWithApps = await Promise.all(
        userReports.map(async (report) => {
          const app = report.appId ? await storage.getApp(report.appId) : null;
          return { ...report, app };
        })
      );
      
      res.json(reportsWithApps);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // Public apps list
  app.get("/api/apps", async (req, res) => {
    try {
      const appsList = await storage.getActiveApps();
      res.json(appsList);
    } catch (error) {
      console.error("Error fetching apps:", error);
      res.status(500).json({ message: "Failed to fetch apps" });
    }
  });

  // Get single app
  app.get("/api/apps/:id", async (req, res) => {
    try {
      const app = await storage.getApp(req.params.id);
      if (!app) {
        return res.status(404).json({ message: "App not found" });
      }
      res.json(app);
    } catch (error) {
      console.error("Error fetching app:", error);
      res.status(500).json({ message: "Failed to fetch app" });
    }
  });

  // Download app file
  app.get("/api/apps/:id/download", async (req, res) => {
    try {
      const app = await storage.getApp(req.params.id);
      if (!app) {
        return res.status(404).json({ message: "App not found" });
      }
      
      const filePath = path.join(uploadsDir, app.fileName);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }
      
      res.download(filePath, app.name + ".zip");
    } catch (error) {
      console.error("Error downloading app:", error);
      res.status(500).json({ message: "Failed to download app" });
    }
  });

  // Record download
  app.post("/api/downloads", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { appId } = req.body;
      
      if (!appId) {
        return res.status(400).json({ message: "App ID is required" });
      }
      
      await storage.createDownload({ userId, appId });
      await storage.incrementDownloadCount(appId);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error recording download:", error);
      res.status(500).json({ message: "Failed to record download" });
    }
  });

  // Submit feedback
  app.post("/api/feedback", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = insertFeedbackSchema.safeParse({ ...req.body, userId });
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid feedback data" });
      }
      
      const feedbackItem = await storage.createFeedback(parsed.data);
      res.json(feedbackItem);
    } catch (error) {
      console.error("Error creating feedback:", error);
      res.status(500).json({ message: "Failed to submit feedback" });
    }
  });

  // Submit report
  app.post("/api/reports", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = insertReportSchema.safeParse({ ...req.body, userId });
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid report data" });
      }
      
      const report = await storage.createReport(parsed.data);
      res.json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ message: "Failed to submit report" });
    }
  });

  return httpServer;
}
