import {
  type DemoRequest,
  type InsertDemoRequest,
  type Newsletter,
  type InsertNewsletter,
  demoRequests,
  newsletterSubscriptions,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createDemoRequest(data: InsertDemoRequest): Promise<DemoRequest>;
  getDemoRequests(): Promise<DemoRequest[]>;
  createNewsletterSubscription(data: InsertNewsletter): Promise<Newsletter>;
}

export class DatabaseStorage implements IStorage {
  async createDemoRequest(data: InsertDemoRequest): Promise<DemoRequest> {
    const [result] = await db.insert(demoRequests).values(data).returning();
    return result;
  }

  async getDemoRequests(): Promise<DemoRequest[]> {
    return db.select().from(demoRequests);
  }

  async createNewsletterSubscription(data: InsertNewsletter): Promise<Newsletter> {
    const [result] = await db
      .insert(newsletterSubscriptions)
      .values(data)
      .onConflictDoNothing()
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();