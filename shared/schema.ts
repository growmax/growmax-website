import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const demoRequests = pgTable("demo_requests", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  companySize: text("company_size").notNull(),
  modules: text("modules").array().notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDemoRequestSchema = createInsertSchema(demoRequests).omit({
  id: true,
  createdAt: true,
});

export type InsertDemoRequest = z.infer<typeof insertDemoRequestSchema>;
export type DemoRequest = typeof demoRequests.$inferSelect;

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNewsletterSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  createdAt: true,
});

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type Newsletter = typeof newsletterSubscriptions.$inferSelect;

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  author: text("author").notNull(),
  authorTeam: text("author_team").notNull().default("Growmax Core Team"),
  readTime: text("read_time").notNull().default("5 Min Read"),
  excerpt: text("excerpt").notNull(),
  sections: jsonb("sections").$type<{ heading: string; headingId: string; content: string }[]>(),
  relatedSlugs: text("related_slugs").array().default(sql`'{}'::text[]`),
  published: boolean("published").notNull().default(false),
  legacyUrl: text("legacy_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export const blogRedirects = pgTable("blog_redirects", {
  id: serial("id").primaryKey(),
  oldPath: text("old_path").notNull().unique(),
  newPath: text("new_path").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBlogRedirectSchema = createInsertSchema(blogRedirects).omit({
  id: true,
  createdAt: true,
});

export type InsertBlogRedirect = z.infer<typeof insertBlogRedirectSchema>;
export type BlogRedirect = typeof blogRedirects.$inferSelect;
