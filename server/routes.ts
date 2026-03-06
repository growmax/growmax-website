import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDemoRequestSchema, insertNewsletterSchema } from "@shared/schema";

const SITE_URL = "https://www.growmax.io";

const staticPages = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/revenue-platform", changefreq: "weekly", priority: "0.9" },
  { path: "/revenue-platform/compare", changefreq: "monthly", priority: "0.8" },
  { path: "/arc", changefreq: "weekly", priority: "0.9" },
  { path: "/arc/pricing", changefreq: "monthly", priority: "0.8" },
  { path: "/arc/compare/b2b-wave", changefreq: "monthly", priority: "0.7" },
  { path: "/arc/compare/pepperi", changefreq: "monthly", priority: "0.7" },
  { path: "/industries/electrical-distributors", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/industrial-manufacturing", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/building-materials", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/food-beverage", changefreq: "monthly", priority: "0.8" },
  { path: "/industries/automotive-aftermarket", changefreq: "monthly", priority: "0.8" },
  { path: "/comparisons/handshake-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/comparisons/tradegecko-alternatives", changefreq: "monthly", priority: "0.8" },
  { path: "/solutions/spare-parts-ecommerce", changefreq: "monthly", priority: "0.8" },
  { path: "/demo", changefreq: "monthly", priority: "0.9" },
  { path: "/company/about", changefreq: "monthly", priority: "0.6" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms-of-service", changefreq: "yearly", priority: "0.3" },
];

const blogSlugs = [
  "partner-engagement-strategy-industrial-brands",
  "opportunity-pipeline-management-predictable-revenue",
  "offline-order-taking-app-industrial-b2b-sales",
  "obo-bettermann-digital-transformation-case-study",
  "multi-tier-b2b-pricing-modeling",
  "digital-enabled-fmcg-wholesale-self-ordering-apps",
  "sales-order-booking-app-zoho-inventory",
  "integrating-third-party-apps-sap-ecc",
  "quotation-to-order-process-converting-revenue",
  "digital-partner-engagement-revolution-manufacturing",
  "cpq-software-guide-small-medium-industrial-businesses",
  "bridging-partner-visibility-gap-quotation-order",
  "ai-reshaping-b2b-ecommerce-industrial-distributors",
  "ai-powered-product-recommendations-spare-parts",
  "spare-parts-ecommerce-self-service-portal",
  "manufacturers-dedicated-spare-parts-ordering-system",
  "b2b-ecommerce-strategy-industrial-manufacturers",
  "channel-partner-management-spreadsheets-to-digital",
  "ai-predictive-inventory-management-distributors",
  "multi-warehouse-b2b-ecommerce-platform-architecture",
  "industrial-manufacturers-ai-sales-forecasting",
  "complete-guide-b2b-customer-specific-pricing",
  "dealer-portal-best-practices-industrial-equipment",
  "chemical-distributor-increased-online-orders-case-study",
  "automating-sales-pipeline-industrial-distributors",
  "partner-onboarding-automation-time-to-revenue",
  "spare-parts-identification-ai-visual-lookup",
  "b2b-marketplace-industrial-mro-supplies",
  "migrate-legacy-edi-modern-b2b-commerce",
  "ai-chatbots-b2b-customer-service-industrial",
  "roi-digital-channel-management-building-materials",
  "electrical-distributor-order-processing-case-study",
  "sales-territory-management-industrial-b2b",
  "customer-specific-product-catalogs-b2b-commerce",
  "partner-performance-analytics-channel-growth",
  "spare-parts-pricing-strategy-margin-retention",
  "implement-tiered-pricing-b2b-wholesale-distribution",
  "ai-driven-lead-scoring-industrial-sales",
  "channel-conflict-resolution-multi-channel-industrial",
  "fastener-distributor-revenue-growth-case-study",
  "integrating-zoho-crm-b2b-ecommerce-guide",
  "future-b2b-commerce-headless-architecture-manufacturers",
  "ai-transforms-after-sales-service-manufacturing",
];

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/sitemap.xml", (_req, res) => {
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

    for (const slug of blogSlugs) {
      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}/blog/${slug}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
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