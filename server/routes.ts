import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertDemoRequestSchema, insertNewsletterSchema, insertBlogPostSchema } from "@shared/schema";

const SITE_URL = "https://www.growmax.io";

const staticPages = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/revenue-platform", changefreq: "weekly", priority: "0.9" },
  { path: "/revenue-platform/compare", changefreq: "monthly", priority: "0.8" },
  { path: "/arc", changefreq: "weekly", priority: "0.9" },
  { path: "/arc/pricing", changefreq: "monthly", priority: "0.8" },
  { path: "/arc/compare/b2b-wave", changefreq: "monthly", priority: "0.7" },
  { path: "/arc/compare/pepperi", changefreq: "monthly", priority: "0.7" },
  { path: "/arc/compare/nowcommerce", changefreq: "monthly", priority: "0.7" },
  { path: "/arc/compare/cin7", changefreq: "monthly", priority: "0.7" },
  { path: "/arc/compare/unleashed", changefreq: "monthly", priority: "0.7" },
  { path: "/comparisons/handshake-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/comparisons/tradegecko-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/comparisons/sana-commerce-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/comparisons/orocommerce-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/comparisons/bigcommerce-b2b-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/comparisons/shopify-plus-b2b-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/comparisons/magento-b2b-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/comparisons/dynamics-365-commerce-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/comparisons/salesforce-commerce-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/comparisons/woocommerce-b2b-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/comparisons/zoho-commerce-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/comparisons/sap-commerce-cloud-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/comparisons/oracle-commerce-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/comparisons/netsuite-suitecommerce-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/electrical-distributors", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/building-materials", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/industrial-manufacturing", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/food-beverage", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/automotive-aftermarket", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/plumbing-hvac", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/janitorial-sanitation", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/safety-ppe", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/industrial-fasteners", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/pump-valve", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/chemical-distributors", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/packaging-distributors", changefreq: "monthly", priority: "0.8" },
  { path: "/solutions/spare-parts-ecommerce", changefreq: "monthly", priority: "0.8" },
  { path: "/demo", changefreq: "monthly", priority: "0.9" },
  { path: "/company/about", changefreq: "monthly", priority: "0.6" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/write-for-us", changefreq: "monthly", priority: "0.7" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms-of-service", changefreq: "yearly", priority: "0.3" },
];

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/sitemap.xml", async (_req, res) => {
    const today = new Date().toISOString().split("T")[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}${page.path}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    try {
      const posts = await storage.getPublishedBlogPosts();
      for (const post of posts) {
        xml += `  <url>\n`;
        xml += `    <loc>${SITE_URL}/blog/${post.slug}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.6</priority>\n`;
        xml += `  </url>\n`;
      }
    } catch {
      // fallback if DB unavailable
    }

    xml += `</urlset>`;
    res.set("Content-Type", "application/xml");
    res.send(xml);
  });

  app.get("/robots.txt", (_req, res) => {
    const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
    res.set("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  // 301 Redirects for old blog URLs
  app.get("/blog/:slug", async (req, res, next) => {
    try {
      const redirect = await storage.getRedirect(`/blog/${req.params.slug}`);
      if (redirect) {
        return res.redirect(301, redirect.newPath);
      }
    } catch {}
    next();
  });

  // === Public Blog API ===
  app.get("/api/blog", async (_req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      return res.json(posts);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.published) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.json(post);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // === Admin Auth ===
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
      req.session.isAdmin = true;
      req.session.save((err) => {
        if (err) {
          console.error("[admin] Session save error:", err);
          return res.status(500).json({ error: "Session error" });
        }
        return res.json({ success: true });
      });
    } else {
      return res.status(401).json({ error: "Invalid password" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: "Failed to logout" });
      res.clearCookie("connect.sid");
      return res.json({ success: true });
    });
  });

  app.get("/api/admin/session", (req, res) => {
    return res.json({ isAdmin: !!req.session?.isAdmin });
  });

  // === Admin Blog CRUD ===
  app.get("/api/admin/posts", requireAdmin, async (_req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      return res.json(posts);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/admin/posts/:id", requireAdmin, async (req, res) => {
    try {
      const post = await storage.getBlogPostById(parseInt(req.params.id));
      if (!post) return res.status(404).json({ error: "Post not found" });
      return res.json(post);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.post("/api/admin/posts", requireAdmin, async (req, res) => {
    const parsed = insertBlogPostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const result = await storage.createBlogPost(parsed.data);
      return res.status(201).json(result);
    } catch (err: any) {
      if (err.message?.includes("unique")) {
        return res.status(409).json({ error: "A post with this slug already exists" });
      }
      return res.status(500).json({ error: "Failed to create post" });
    }
  });

  app.put("/api/admin/posts/:id", requireAdmin, async (req, res) => {
    const parsed = insertBlogPostSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const result = await storage.updateBlogPost(parseInt(req.params.id), parsed.data);
      if (!result) return res.status(404).json({ error: "Post not found" });
      return res.json(result);
    } catch (err: any) {
      if (err.message?.includes("unique")) {
        return res.status(409).json({ error: "A post with this slug already exists" });
      }
      return res.status(500).json({ error: "Failed to update post" });
    }
  });

  app.delete("/api/admin/posts/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteBlogPost(parseInt(req.params.id));
      if (!deleted) return res.status(404).json({ error: "Post not found" });
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // === Demo Requests ===
  app.post("/api/demo-requests", async (req, res) => {
    const parsed = insertDemoRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const result = await storage.createDemoRequest(parsed.data);

      const webhookUrl = "https://chat.googleapis.com/v1/spaces/AAQAsJFg7Xs/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=68Ej0IZj6mUOe2Q5hMpkkmmIkWl8nnnyfHUymGvaesU";
      const data = parsed.data;
      const cardMessage = {
        text: `*New Demo Request*\n\n*Name:* ${data.firstName} ${data.lastName}\n*Email:* ${data.email}\n*Company:* ${data.company}\n*Company Size:* ${data.companySize}\n*Modules:* ${data.modules.join(", ")}\n*Message:* ${data.message || "N/A"}`,
      };
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardMessage),
      }).catch((err) => {
        console.error("[webhook] Failed to send demo request notification:", err.message);
      });

      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to submit demo request" });
    }
  });

  // === Newsletter ===
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
