import {
  type DemoRequest,
  type InsertDemoRequest,
  type Newsletter,
  type InsertNewsletter,
  type BlogPost,
  type InsertBlogPost,
  type BlogRedirect,
  type InsertBlogRedirect,
  demoRequests,
  newsletterSubscriptions,
  blogPosts,
  blogRedirects,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  createDemoRequest(data: InsertDemoRequest): Promise<DemoRequest>;
  getDemoRequests(): Promise<DemoRequest[]>;
  createNewsletterSubscription(data: InsertNewsletter): Promise<Newsletter>;

  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(data: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  getRedirect(oldPath: string): Promise<BlogRedirect | undefined>;
  createRedirect(data: InsertBlogRedirect): Promise<BlogRedirect>;
  getAllRedirects(): Promise<BlogRedirect[]>;
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

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [result] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result;
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [result] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result;
  }

  async createBlogPost(data: InsertBlogPost): Promise<BlogPost> {
    const [result] = await db.insert(blogPosts).values({
      ...data,
      updatedAt: new Date(),
    }).returning();
    return result;
  }

  async updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [result] = await db
      .update(blogPosts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return result;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return result.length > 0;
  }

  async getRedirect(oldPath: string): Promise<BlogRedirect | undefined> {
    const [result] = await db.select().from(blogRedirects).where(eq(blogRedirects.oldPath, oldPath)).limit(1);
    return result;
  }

  async createRedirect(data: InsertBlogRedirect): Promise<BlogRedirect> {
    const [result] = await db.insert(blogRedirects).values(data).onConflictDoNothing().returning();
    return result;
  }

  async getAllRedirects(): Promise<BlogRedirect[]> {
    return db.select().from(blogRedirects);
  }
}

export const storage = new DatabaseStorage();
