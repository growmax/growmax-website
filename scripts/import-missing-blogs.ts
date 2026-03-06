import { db } from "../server/db";
import { blogPosts } from "../shared/schema";
import { parse } from "csv-parse/sync";
import * as fs from "fs";

const CSV_PATH = "attached_assets/growmax_winning_project_-_Blog_Posts_-_5fbbe6a6724597b97ad5dcc_1772800764999.csv";

const CATEGORY_MAP: Record<string, string> = {
  "b2b-ecommerce": "B2B eCommerce",
  "sales": "Sales & Pipeline",
  "ai-insights": "AI Insights",
  "marketing": "B2B eCommerce",
  "": "B2B eCommerce",
};

const ALL_SLUGS = new Map<string, string>();

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function estimateReadTime(html: string): string {
  const words = stripHtml(html).split(/\s+/).length;
  const minutes = Math.max(3, Math.ceil(words / 200));
  return `${minutes} Min Read`;
}

function makeHeadingId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 60);
}

function cleanHtml(html: string): string {
  let cleaned = html;
  cleaned = cleaned.replace(/<a[^>]*href=["']https?:\/\/uploads-ssl\.webflow\.com[^"']*["'][^>]*>.*?<\/a>/gi, "");
  cleaned = cleaned.replace(/<img[^>]*src=["']https?:\/\/uploads-ssl\.webflow\.com[^"']*["'][^>]*\/?>/gi, "");
  cleaned = cleaned.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, "");
  cleaned = cleaned.replace(/<div[^>]*class=["'][^"']*w-embed[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "");
  cleaned = cleaned.replace(/\s*(class|style|id|data-[a-z-]+)=["'][^"']*["']/gi, "");
  cleaned = cleaned.replace(/<a[^>]*href=["']#[^"']*["'][^>]*>(.*?)<\/a>/gi, "$1");
  cleaned = cleaned.replace(/<h2>\s*‍?\s*<\/h2>/gi, "");
  cleaned = cleaned.replace(/<h3>\s*‍?\s*<\/h3>/gi, "");
  cleaned = cleaned.replace(/<p>\s*‍?\s*<\/p>/gi, "");
  cleaned = cleaned.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, "");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  return cleaned.trim();
}

function addInternalLinks(html: string, currentSlug: string): { html: string; linkedSlugs: string[] } {
  const linkedSlugs: string[] = [];

  const KEYWORD_SLUG_MAP: [RegExp, string][] = [
    [/\bB2B eCommerce platform\b/i, "everything-you-need-to-know-about-b2b-ecommerce"],
    [/\bB2B eCommerce\b/i, "everything-you-need-to-know-about-b2b-ecommerce"],
    [/\bspare parts management\b/i, "what-is-spares-parts-management"],
    [/\bspare parts inventory\b/i, "tips-for-managing-spare-parts-inventory"],
    [/\bspare parts (business|sales)\b/i, "how-to-boost-spare-parts-sales"],
    [/\bproduct catalog management\b/i, "product-catalog-management-ecommerce"],
    [/\binventory management\b/i, "inventory-management-techniques"],
    [/\bsafety stock\b/i, "what-is-safety-stock"],
    [/\bjust.in.time\b/i, "just-in-time-inventory-jit"],
    [/\bpurchase order\b/i, "what-is-purchase-order"],
    [/\border management\b/i, "what-is-order-management"],
    [/\border.to.cash\b/i, "what-is-order-to-cash-o2c"],
    [/\binventory control\b/i, "what-is-inventory-control"],
    [/\bwholesale (distribution|marketing)\b/i, "wholesale-marketing"],
    [/\bheadless commerce\b/i, "what-is-headless-commerce"],
    [/\bbackorder(ing)?\b/i, "what-is-backordering"],
    [/\bdeadstock\b/i, "what-is-deadstock"],
    [/\bCRM\b/i, "what-is-ecommerce-crm"],
    [/\bproduct description\b/i, "writing-product-description-guide"],
    [/\bproduct experience management\b/i, "what-is-product-experience-management"],
    [/\bPWA\b/i, "progressive-web-app-pwa-guide"],
    [/\bShopify Plus\b/i, "shopify-plus-alternatives"],
    [/\bTradeGecko\b/i, "quickbooks-commerce-tradegecko-alternatives"],
    [/\bPepperi\b/i, "pepperi-alternatives-and-competitors"],
    [/\bMOQ|minimum order quantity\b/i, "minimum-order-quantity"],
    [/\blead time\b/i, "what-is-lead-time"],
    [/\bD2C|direct.to.consumer\b/i, "what-is-d2c"],
    [/\bpartner (engagement|portal)\b/i, "partner-engagement-strategy-industrial-brands"],
    [/\bchannel partner\b/i, "channel-partner-management-spreadsheets-to-digital"],
    [/\bSAP (integration|connector|ECC)\b/i, "transforming-your-digital-landscape-integrating-third-party-applications-with-sap-ecc-through-sap-connector"],
    [/\bZoho (Inventory|integration)\b/i, "a-comprehensive-sales-order-booking-app-for-zoho-inventory"],
    [/\bautomotive (aftermarket|accessories|spare)\b/i, "how-to-sell-automotive-accessories-online"],
    [/\bcar spare parts\b/i, "how-to-sell-car-spare-parts"],
    [/\bconstruction equipment\b/i, "increase-construction-equipment-spare-parts-sales"],
    [/\bAI.powered\b/i, "ai-reshaping-b2b-ecommerce-industrial-distributors"],
    [/\bsales forecasting\b/i, "industrial-manufacturers-ai-sales-forecasting"],
    [/\bcross.selling|upselling\b/i, "uncovering-hidden-customer-needs-for-cross-selling-and-upselling-through-a-recommendations-engine"],
    [/\bpipeline management\b/i, "automating-sales-pipeline-industrial-distributors"],
    [/\bGrowmax Enterprise\b/i, "b2b-ecommerce-strategy-industrial-manufacturers"],
    [/\bGrowmax ARC\b/i, "sales-order-booking-app-zoho-inventory"],
  ];

  let result = html;
  const usedSlugs = new Set<string>();
  let linkCount = 0;
  const MAX_LINKS = 5;

  for (const [pattern, slug] of KEYWORD_SLUG_MAP) {
    if (linkCount >= MAX_LINKS) break;
    if (slug === currentSlug) continue;
    if (usedSlugs.has(slug)) continue;
    if (!ALL_SLUGS.has(slug)) continue;

    const match = result.match(new RegExp(`(?!<[^>]*)(${pattern.source})(?![^<]*>)`, pattern.flags));
    if (match) {
      const fullMatch = match[0];
      const idx = result.indexOf(fullMatch);
      if (idx > -1 && !isInsideTag(result, idx)) {
        result = result.substring(0, idx) +
          `<a href="/blog/${slug}">${fullMatch}</a>` +
          result.substring(idx + fullMatch.length);
        usedSlugs.add(slug);
        linkedSlugs.push(slug);
        linkCount++;
      }
    }
  }

  return { html: result, linkedSlugs };
}

function isInsideTag(html: string, pos: number): boolean {
  let inTag = false;
  for (let i = 0; i < pos; i++) {
    if (html[i] === "<") inTag = true;
    if (html[i] === ">") inTag = false;
  }
  return inTag;
}

function parseContentToSections(html: string, currentSlug: string): { sections: any[]; linkedSlugs: string[] } {
  const cleaned = cleanHtml(html);
  const allLinkedSlugs: string[] = [];

  const headingRegex = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
  const headings: { level: number; text: string; index: number; rawMatch: string }[] = [];
  let match;

  while ((match = headingRegex.exec(cleaned)) !== null) {
    const text = stripHtml(match[2]).trim();
    if (text.length > 2) {
      headings.push({
        level: parseInt(match[1]),
        text,
        index: match.index,
        rawMatch: match[0],
      });
    }
  }

  if (headings.length === 0) {
    const { html: linkedHtml, linkedSlugs } = addInternalLinks(cleaned, currentSlug);
    allLinkedSlugs.push(...linkedSlugs);
    return {
      sections: [{
        heading: "Overview",
        headingId: "overview",
        content: linkedHtml,
      }],
      linkedSlugs: allLinkedSlugs,
    };
  }

  const sections: any[] = [];
  const introContent = cleaned.substring(0, headings[0].index).trim();
  if (introContent.length > 20) {
    const { html: linkedIntro, linkedSlugs } = addInternalLinks(introContent, currentSlug);
    allLinkedSlugs.push(...linkedSlugs);
    sections.push({
      heading: "Overview",
      headingId: "overview",
      content: linkedIntro,
    });
  }

  for (let i = 0; i < headings.length; i++) {
    const start = headings[i].index + headings[i].rawMatch.length;
    const end = i + 1 < headings.length ? headings[i + 1].index : cleaned.length;
    let sectionContent = cleaned.substring(start, end).trim();

    if (sectionContent.length < 10 && headings[i].text.toLowerCase().includes("table of contents")) continue;
    if (headings[i].text.toLowerCase() === "conclusion" && sectionContent.length < 20) continue;

    const { html: linkedContent, linkedSlugs } = addInternalLinks(sectionContent, currentSlug);
    allLinkedSlugs.push(...linkedSlugs);

    sections.push({
      heading: headings[i].text,
      headingId: makeHeadingId(headings[i].text),
      content: linkedContent,
    });
  }

  if (sections.length === 0) {
    const { html: linkedHtml, linkedSlugs } = addInternalLinks(cleaned, currentSlug);
    allLinkedSlugs.push(...linkedSlugs);
    return {
      sections: [{
        heading: "Overview",
        headingId: "overview",
        content: linkedHtml,
      }],
      linkedSlugs: allLinkedSlugs,
    };
  }

  return { sections, linkedSlugs: [...new Set(allLinkedSlugs)] };
}

function findRelatedSlugs(currentSlug: string, category: string, linkedSlugs: string[]): string[] {
  const related = new Set(linkedSlugs.slice(0, 2));

  const allByCategory = [...ALL_SLUGS.entries()]
    .filter(([slug, cat]) => cat === category && slug !== currentSlug)
    .map(([slug]) => slug);

  for (const slug of allByCategory) {
    if (related.size >= 3) break;
    if (!related.has(slug)) related.add(slug);
  }

  if (related.size < 3) {
    const remaining = [...ALL_SLUGS.keys()].filter(s => s !== currentSlug && !related.has(s));
    for (const slug of remaining) {
      if (related.size >= 3) break;
      related.add(slug);
    }
  }

  return [...related].slice(0, 3);
}

function generateExcerpt(summary: string, content: string): string {
  if (summary && summary.length > 30) {
    let cleaned = stripHtml(summary).trim();
    if (cleaned.length > 160) cleaned = cleaned.substring(0, 157) + "...";
    return cleaned;
  }
  const plain = stripHtml(content);
  const first = plain.substring(0, 157);
  return first + "...";
}

async function main() {
  console.log("Reading CSV...");
  const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
  const records = parse(csvContent, { columns: true, skip_empty_lines: true, relax_column_count: true });

  console.log("Fetching existing DB posts...");
  const existing = await db.select({ slug: blogPosts.slug, category: blogPosts.category }).from(blogPosts);
  const existingSlugs = new Set(existing.map(p => p.slug));
  existing.forEach(p => ALL_SLUGS.set(p.slug, p.category));

  const csvPosts = records.filter((r: any) =>
    r["Draft"]?.trim() !== "true" &&
    (r["Blog Post"]?.trim().length || 0) > 50
  );

  csvPosts.forEach((r: any) => {
    const slug = r["Slug"]?.trim();
    const cat = r["Category"]?.trim();
    if (slug) ALL_SLUGS.set(slug, CATEGORY_MAP[cat] || "B2B eCommerce");
  });

  const missing = csvPosts.filter((r: any) => !existingSlugs.has(r["Slug"]?.trim()));
  console.log(`Found ${missing.length} posts to import.`);

  let imported = 0;

  for (const record of missing) {
    const slug = record["Slug"]?.trim();
    const title = record["Title"]?.trim();
    const rawContent = record["Blog Post"]?.trim();
    const summary = record["Blog Summary"]?.trim();
    const csvCategory = record["Category"]?.trim();
    const category = CATEGORY_MAP[csvCategory] || "B2B eCommerce";

    if (!slug || !title || !rawContent) {
      console.log(`Skipping ${slug}: missing data`);
      continue;
    }

    const { sections, linkedSlugs } = parseContentToSections(rawContent, slug);
    const relatedSlugs = findRelatedSlugs(slug, category, linkedSlugs);
    const readTime = estimateReadTime(rawContent);
    const excerpt = generateExcerpt(summary, rawContent);

    try {
      await db.insert(blogPosts).values({
        slug,
        title,
        category,
        date: "Mar 6, 2026",
        author: "Growmax Team",
        authorTeam: "Growmax Core Team",
        readTime,
        excerpt,
        sections,
        relatedSlugs,
        published: true,
      });
      imported++;
      console.log(`[${imported}/${missing.length}] Imported: ${slug} (${sections.length} sections, ${linkedSlugs.length} internal links)`);
    } catch (err: any) {
      console.error(`Failed to import ${slug}:`, err.message);
    }
  }

  console.log(`\nDone! Imported ${imported} posts. Total posts now: ${existingSlugs.size + imported}`);
  process.exit(0);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
