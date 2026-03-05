import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDemoRequestSchema, insertNewsletterSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/demo-requests", async (req, res) => {
    const parsed = insertDemoRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const result = await storage.createDemoRequest(parsed.data);
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to submit demo request" });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    const parsed = insertNewsletterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const result = await storage.createNewsletterSubscription(parsed.data);
      return res.status(201).json(result ?? { message: "Already subscribed" });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  return httpServer;
}