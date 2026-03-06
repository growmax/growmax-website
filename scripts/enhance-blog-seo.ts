import { db } from "../server/db";
import { blogPosts } from "../shared/schema";
import { eq, sql } from "drizzle-orm";

interface Section {
  heading: string;
  headingId: string;
  content: string;
}

interface PostRecord {
  id: number;
  slug: string;
  title: string;
  category: string;
  sections: Section[];
  relatedSlugs: string[];
  excerpt: string;
  date: string;
}

const KEYWORD_LINKS: [RegExp, string, string][] = [
  [/\bB2B eCommerce platform/i, "everything-you-need-to-know-about-b2b-ecommerce", "B2B eCommerce platform"],
  [/\bB2B eCommerce\b/i, "everything-you-need-to-know-about-b2b-ecommerce", "B2B eCommerce"],
  [/\bspare parts management\b/i, "what-is-spares-parts-management", "spare parts management"],
  [/\bspare parts inventory\b/i, "tips-for-managing-spare-parts-inventory", "spare parts inventory"],
  [/\bproduct catalog/i, "product-catalog-management-ecommerce", "product catalog"],
  [/\binventory management\b/i, "inventory-management-techniques", "inventory management"],
  [/\binventory control\b/i, "what-is-inventory-control", "inventory control"],
  [/\bsafety stock\b/i, "what-is-safety-stock", "safety stock"],
  [/\bjust[- ]in[- ]time/i, "just-in-time-inventory-jit", "just-in-time"],
  [/\bpurchase order/i, "what-is-purchase-order", "purchase order"],
  [/\border management\b/i, "what-is-order-management", "order management"],
  [/\border[- ]to[- ]cash/i, "what-is-order-to-cash-o2c", "order-to-cash"],
  [/\bwholesale distribut/i, "wholesale-distributors-guide", "wholesale distribution"],
  [/\bheadless commerce/i, "what-is-headless-commerce", "headless commerce"],
  [/\bbackorder/i, "what-is-backordering", "backordering"],
  [/\bdeadstock/i, "what-is-deadstock", "deadstock"],
  [/\bCRM\b/i, "what-is-ecommerce-crm", "CRM"],
  [/\bproduct description/i, "writing-product-description-guide", "product description"],
  [/\bPWA|progressive web app/i, "progressive-web-app-pwa-guide", "PWA"],
  [/\bShopify Plus/i, "shopify-plus-alternatives", "Shopify Plus"],
  [/\bTradeGecko|QuickBooks Commerce/i, "quickbooks-commerce-tradegecko-alternatives", "TradeGecko"],
  [/\bPepperi\b/i, "pepperi-alternatives-and-competitors", "Pepperi"],
  [/\bMOQ|minimum order quantity/i, "minimum-order-quantity", "MOQ"],
  [/\blead time\b/i, "what-is-lead-time", "lead time"],
  [/\bD2C|direct[- ]to[- ]consumer/i, "what-is-d2c", "D2C"],
  [/\bpartner engagement/i, "partner-engagement-strategy-industrial-brands", "partner engagement"],
  [/\bchannel partner/i, "channel-partner-management-spreadsheets-to-digital", "channel partner"],
  [/\bSAP (integration|connector|ECC)/i, "transforming-your-digital-landscape-integrating-third-party-applications-with-sap-ecc-through-sap-connector", "SAP integration"],
  [/\bZoho\b/i, "a-comprehensive-sales-order-booking-app-for-zoho-inventory", "Zoho"],
  [/\bautomotive aftermarket/i, "how-to-sell-automotive-accessories-online", "automotive aftermarket"],
  [/\bsales forecasting/i, "industrial-manufacturers-ai-sales-forecasting", "sales forecasting"],
  [/\bcross[- ]sell/i, "uncovering-hidden-customer-needs-for-cross-selling-and-upselling-through-a-recommendations-engine", "cross-selling"],
  [/\bpipeline management/i, "automating-sales-pipeline-industrial-distributors", "pipeline management"],
  [/\btiered pricing|volume[- ]based pricing/i, "implement-tiered-pricing-b2b-wholesale-distribution", "tiered pricing"],
  [/\bcustomer[- ]specific pricing/i, "complete-guide-b2b-customer-specific-pricing", "customer-specific pricing"],
  [/\bmulti[- ]warehouse/i, "multi-warehouse-b2b-ecommerce-platform-architecture", "multi-warehouse"],
  [/\bdealer portal/i, "dealer-portal-best-practices-industrial-equipment", "dealer portal"],
  [/\bCPQ\b/i, "the-ultimate-guide-to-cpq-software-for-small-and-medium-scale-industrial-businesses", "CPQ"],
  [/\bAI[- ]powered|artificial intelligence/i, "ai-reshaping-b2b-ecommerce-industrial-distributors", "AI-powered"],
  [/\bdigital transformation/i, "revamping-the-order-process-obo-bettermanns-digital-transformation", "digital transformation"],
  [/\bself[- ]ordering|self[- ]service portal/i, "spare-parts-ecommerce-self-service-portal", "self-service portal"],
  [/\boffline order/i, "offline-order-taking-app-industrial-b2b-sales", "offline ordering"],
  [/\bquotation[- ]to[- ]order/i, "quotation-to-order-process-converting-revenue", "quotation-to-order"],
  [/\bpartner portal/i, "independent-partner-portals-for-industrial-channels", "partner portal"],
  [/\bpartner performance/i, "partner-performance-analytics-channel-growth", "partner performance"],
  [/\bsales territory/i, "sales-territory-management-industrial-b2b", "sales territory"],
  [/\belectrical distribut/i, "electrical-distributor-order-processing-case-study", "electrical distribution"],
  [/\bperpetual inventory/i, "perpetual-inventory", "perpetual inventory"],
  [/\bproduct recommendation/i, "ai-powered-product-recommendations-spare-parts", "product recommendations"],
  [/\bmarketplace\b/i, "what-is-an-online-marketplace", "marketplace"],
];

const FAQ_TEMPLATES: Record<string, { q: string; a: string }[]> = {
  "B2B eCommerce": [
    { q: "What is B2B eCommerce and how does it differ from B2C?", a: "B2B eCommerce involves online transactions between businesses, characterized by bulk ordering, negotiated pricing, complex approval workflows, and longer sales cycles. Unlike B2C, B2B buyers expect customer-specific catalogs, tiered pricing, and integration with ERP systems like SAP or QuickBooks." },
    { q: "How can B2B eCommerce increase revenue for distributors?", a: "B2B eCommerce platforms can increase revenue by 30-50% through 24/7 order availability, automated reordering, cross-selling via product recommendations, and reduced order processing costs. Digital channels also expand geographic reach without proportional overhead increases." },
    { q: "What features should a B2B eCommerce platform include?", a: "Essential features include customer-specific pricing and catalogs, bulk ordering capabilities, purchase order and credit term support, ERP/accounting integration, multi-warehouse inventory visibility, quote-to-order workflows, and mobile-responsive self-service portals." },
  ],
  "Spare Parts": [
    { q: "How can manufacturers sell spare parts online effectively?", a: "Manufacturers can sell spare parts online by implementing visual part identification (exploded diagrams or AI-based lookup), maintaining real-time inventory visibility across warehouses, offering customer-specific pricing, and providing a self-service portal where buyers can identify, order, and track parts independently." },
    { q: "What is the ROI of digitizing spare parts sales?", a: "Digitizing spare parts sales typically delivers 2-3x ROI within the first year through reduced order processing costs (up to 60%), increased order frequency (24/7 availability), higher average order values via cross-selling, and improved customer retention through self-service convenience." },
    { q: "How do you manage spare parts inventory across multiple warehouses?", a: "Effective multi-warehouse spare parts management requires a centralized inventory system with real-time stock visibility, automated reorder points per location, intelligent routing to fulfill orders from the nearest warehouse, and predictive analytics to prevent stockouts of critical parts." },
  ],
  "AI Insights": [
    { q: "How is AI transforming B2B sales and distribution?", a: "AI transforms B2B sales through predictive demand forecasting (reducing stockouts by up to 40%), intelligent lead scoring that prioritizes high-value opportunities, automated product recommendations that increase average order value by 15-25%, and conversational AI chatbots that handle routine customer inquiries 24/7." },
    { q: "What are the key AI use cases for industrial distributors?", a: "Key AI use cases include predictive inventory management to prevent stockouts, AI-powered product recommendations for cross-selling and upselling, automated sales forecasting for better resource allocation, visual part identification for spare parts ordering, and intelligent pricing optimization based on market conditions." },
    { q: "How do I get started with AI in my B2B business?", a: "Start by digitizing your order data and customer interactions. Then implement AI in phases: begin with product recommendations and demand forecasting (highest ROI), then add predictive inventory management, and finally deploy conversational AI for customer service. Platforms like Growmax provide built-in AI capabilities that require no data science expertise." },
  ],
  "Sales & Pipeline": [
    { q: "How can digital tools improve B2B sales pipeline management?", a: "Digital sales tools improve pipeline management by providing real-time visibility into deal stages, automating follow-ups and quote generation, enabling data-driven forecasting with AI-powered win probability scoring, and reducing the sales cycle by 30-40% through streamlined quotation-to-order workflows." },
    { q: "What is quotation-to-order conversion and why does it matter?", a: "Quotation-to-order conversion is the process of turning sales quotes into confirmed orders. It matters because most B2B companies lose 20-40% of potential revenue due to slow quote follow-ups, manual processes, and lack of visibility. Automating this process can improve conversion rates by 25-35%." },
    { q: "How do sales target setting and automation boost performance?", a: "Smart target setting combined with automation allows sales managers to set data-driven goals by territory, product line, or customer segment. Automated tracking and alerts ensure reps stay focused on high-value activities, while real-time dashboards provide visibility for course correction, typically improving sales performance by 20-30%." },
  ],
  "Partner Engagement": [
    { q: "What is a channel partner portal and why do industrial brands need one?", a: "A channel partner portal is a dedicated digital platform where distributors and dealers can manage orders, access product information, view performance analytics, and collaborate with the brand. Industrial brands need them to maintain visibility across their distribution network, reduce channel conflict, and enable partners to self-serve rather than relying on manual processes." },
    { q: "How can brands improve partner engagement and sales performance?", a: "Brands can improve partner engagement by providing easy-to-use digital ordering tools, sharing real-time performance analytics and incentive tracking, offering training resources through the portal, enabling independent quotation-to-order workflows, and recognizing top performers. This typically increases partner sales by 20-40%." },
    { q: "What metrics should brands track for channel partner performance?", a: "Key metrics include order frequency and volume per partner, quotation-to-order conversion rates, average order value trends, product mix and cross-sell ratios, time-to-order (how quickly partners place orders), and partner satisfaction scores. Tracking these KPIs enables data-driven decisions about partner support and incentive programs." },
  ],
  "Channel Management": [
    { q: "How do you resolve channel conflict in multi-channel distribution?", a: "Channel conflict can be resolved through clear territory definitions, transparent pricing policies, partner-specific catalogs that prevent overlap, performance-based incentive programs, and a centralized digital platform that provides visibility to all parties. The key is ensuring each channel has a clear value proposition and equitable access to opportunities." },
    { q: "What is the difference between direct and indirect channel management?", a: "Direct channels involve selling straight to the end customer, while indirect channels use intermediaries like distributors, dealers, or resellers. Most industrial brands use a hybrid approach. Effective channel management requires digital tools that provide visibility across both, prevent conflict, and optimize for total revenue rather than favoring one channel over another." },
  ],
  "Case Studies": [
    { q: "How do B2B companies typically benefit from digital transformation?", a: "B2B companies implementing digital commerce solutions typically see 2-5x revenue growth, 40-60% reduction in order processing costs, 30% improvement in customer retention, and significant expansion of their active customer base. Results vary by industry, but the pattern is consistent: digitizing B2B sales processes drives measurable business outcomes." },
    { q: "How long does it take to see ROI from a B2B eCommerce implementation?", a: "Most B2B companies see initial ROI within 3-6 months of launching their digital commerce platform. Quick wins include reduced order processing costs and improved order accuracy. Full ROI, including increased revenue from new customers and cross-selling, typically materializes within 12-18 months." },
  ],
};

function generateFaqForPost(post: PostRecord, allPosts: PostRecord[]): Section {
  const baseFaqs = FAQ_TEMPLATES[post.category] || FAQ_TEMPLATES["B2B eCommerce"];
  const titleLower = post.title.toLowerCase();
  const contentText = post.sections.map(s => s.content).join(" ").toLowerCase();

  const customFaqs: { q: string; a: string }[] = [];

  if (titleLower.includes("spare part") || contentText.includes("spare part")) {
    customFaqs.push({
      q: `How does ${post.title.split(":")[0].trim()} impact business growth?`,
      a: `${post.title.split(":")[0].trim()} directly impacts business growth by enabling faster order processing, reducing manual errors, improving customer satisfaction through self-service capabilities, and freeing up sales teams to focus on high-value activities rather than routine order taking.`
    });
  }

  if (titleLower.includes("alternative") || titleLower.includes("competitor")) {
    customFaqs.push({
      q: "What should I look for when evaluating B2B eCommerce alternatives?",
      a: "When evaluating alternatives, focus on industry-specific features (B2B pricing, catalog management), integration capabilities with your existing ERP/accounting software, total cost of ownership including implementation, scalability as your business grows, and vendor support quality. Avoid solutions designed primarily for B2C that bolt on B2B features."
    });
  }

  if (titleLower.includes("wholesale") || contentText.includes("wholesale")) {
    customFaqs.push({
      q: "What are the key challenges in wholesale distribution today?",
      a: "Key challenges include managing complex pricing across customer tiers, maintaining real-time inventory visibility across locations, competing with Amazon Business and other digital marketplaces, retaining customer loyalty, and digitizing traditional sales processes without disrupting existing relationships."
    });
  }

  if (titleLower.includes("ai") || titleLower.includes("artificial intelligence")) {
    customFaqs.push({
      q: "Is AI practical for small and mid-size B2B businesses?",
      a: "Yes. Modern B2B platforms like Growmax ARC embed AI capabilities that work out of the box without data science expertise. Start with product recommendations and demand forecasting — these deliver the highest ROI with minimal setup and work effectively even with modest data volumes."
    });
  }

  const selectedFaqs = [...customFaqs, ...baseFaqs].slice(0, 5);

  let faqHtml = '<div itemscope itemtype="https://schema.org/FAQPage">';
  for (const faq of selectedFaqs) {
    faqHtml += `<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">`;
    faqHtml += `<h3 itemprop="name">${faq.q}</h3>`;
    faqHtml += `<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">`;
    faqHtml += `<p itemprop="text">${faq.a}</p>`;
    faqHtml += `</div></div>`;
  }
  faqHtml += "</div>";

  return {
    heading: "Frequently Asked Questions",
    headingId: "faq",
    content: faqHtml,
  };
}

function addInternalLinksToSection(content: string, currentSlug: string, existingSlugs: Set<string>, maxLinks: number = 3): { content: string; addedSlugs: string[] } {
  let result = content;
  const addedSlugs: string[] = [];
  const usedSlugs = new Set<string>();

  const existingLinks = content.match(/href="\/blog\/([^"]+)"/g) || [];
  for (const link of existingLinks) {
    const match = link.match(/href="\/blog\/([^"]+)"/);
    if (match) usedSlugs.add(match[1]);
  }

  let linkCount = 0;

  for (const [pattern, targetSlug, displayText] of KEYWORD_LINKS) {
    if (linkCount >= maxLinks) break;
    if (targetSlug === currentSlug) continue;
    if (usedSlugs.has(targetSlug)) continue;
    if (!existingSlugs.has(targetSlug)) continue;

    const plainTextMatch = result.match(new RegExp(`(?<![<\\/a-zA-Z"=])${pattern.source}(?![^<]*>|[^<]*<\\/a>)`, pattern.flags));
    if (plainTextMatch && plainTextMatch.index !== undefined) {
      const before = result.substring(0, plainTextMatch.index);
      const after = result.substring(plainTextMatch.index + plainTextMatch[0].length);

      let openTags = 0;
      for (let i = before.length - 1; i >= 0; i--) {
        if (before[i] === ">") break;
        if (before[i] === "<") { openTags++; break; }
      }
      if (openTags > 0) continue;

      result = before + `<a href="/blog/${targetSlug}">${plainTextMatch[0]}</a>` + after;
      usedSlugs.add(targetSlug);
      addedSlugs.push(targetSlug);
      linkCount++;
    }
  }

  return { content: result, addedSlugs };
}

function generateRelatedPostsSection(post: PostRecord, allPosts: PostRecord[]): Section {
  const related = allPosts
    .filter(p => p.slug !== post.slug && p.category === post.category)
    .slice(0, 4);

  if (related.length === 0) return null as any;

  let html = "<p>Continue your learning with these related articles:</p><ul>";
  for (const r of related) {
    html += `<li><a href="/blog/${r.slug}">${r.title}</a></li>`;
  }
  html += "</ul>";

  return {
    heading: "Related Articles",
    headingId: "related-articles",
    content: html,
  };
}

function generateCtaSection(post: PostRecord): Section {
  const isEnterprise = post.category === "Partner Engagement" ||
    post.category === "Channel Management" ||
    post.title.toLowerCase().includes("sap") ||
    post.title.toLowerCase().includes("enterprise") ||
    post.title.toLowerCase().includes("partner");

  if (isEnterprise) {
    return {
      heading: "Ready to Transform Your Channel Sales?",
      headingId: "cta",
      content: `<p>Growmax Enterprise provides industrial manufacturers and distributors with a complete multi-party commerce ecosystem. From partner portals to quotation-to-order workflows, SAP/Epicor integration, and AI-powered analytics — everything you need to digitize your B2B sales channels.</p><p><strong><a href="/enterprise">Explore Growmax Enterprise</a></strong> | <strong><a href="/demo">Schedule a Demo</a></strong></p>`,
    };
  }

  return {
    heading: "Start Selling Online Today",
    headingId: "cta",
    content: `<p>Growmax ARC is the all-in-one B2B commerce platform built for small and mid-size distributors. Get up and running in days with built-in QuickBooks/Zoho/Xero integration, customer-specific pricing, and a self-service ordering portal — all for $199/month.</p><p><strong><a href="https://app.growmaxai.com/register">Start Your Free Trial</a></strong> | <strong><a href="/arc">Learn More About Growmax ARC</a></strong></p>`,
  };
}

async function main() {
  console.log("Fetching all posts...");
  const allRows = await db.select().from(blogPosts);
  const existingSlugs = new Set(allRows.map(r => r.slug));

  const posts: PostRecord[] = allRows.map(r => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    sections: (r.sections as Section[]) || [],
    relatedSlugs: r.relatedSlugs || [],
    excerpt: r.excerpt || "",
    date: r.date || "",
  }));

  console.log(`Processing ${posts.length} posts...`);

  let enhanced = 0;
  let faqsAdded = 0;
  let linksAdded = 0;
  let ctasAdded = 0;
  let relatedAdded = 0;

  for (const post of posts) {
    let modified = false;
    let sections = [...post.sections];

    const hasFaq = sections.some(s =>
      s.heading.toLowerCase().includes("faq") ||
      s.heading.toLowerCase().includes("frequently")
    );
    const hasCta = sections.some(s =>
      s.headingId === "cta" ||
      s.heading.toLowerCase().includes("ready to transform") ||
      s.heading.toLowerCase().includes("start selling")
    );
    const hasRelated = sections.some(s =>
      s.headingId === "related-articles"
    );

    let totalNewLinks = 0;
    const newSections: Section[] = [];
    for (const section of sections) {
      if (section.headingId === "faq" || section.headingId === "cta" || section.headingId === "related-articles") {
        newSections.push(section);
        continue;
      }

      const { content: linkedContent, addedSlugs } = addInternalLinksToSection(
        section.content, post.slug, existingSlugs, 2
      );

      if (addedSlugs.length > 0) {
        totalNewLinks += addedSlugs.length;
        newSections.push({ ...section, content: linkedContent });
        modified = true;
      } else {
        newSections.push(section);
      }
    }

    sections = newSections;

    if (totalNewLinks > 0) linksAdded++;

    if (!hasFaq) {
      const faqSection = generateFaqForPost(post, posts);
      sections.push(faqSection);
      faqsAdded++;
      modified = true;
    }

    if (!hasCta && sections.length > 2) {
      const ctaSection = generateCtaSection(post);
      const conclusionIdx = sections.findIndex(s =>
        s.heading.toLowerCase() === "conclusion" ||
        s.heading.toLowerCase().includes("final thought") ||
        s.heading.toLowerCase().includes("wrapping up")
      );

      if (conclusionIdx > -1) {
        sections.splice(conclusionIdx + 1, 0, ctaSection);
      } else {
        const faqIdx = sections.findIndex(s => s.headingId === "faq");
        if (faqIdx > -1) {
          sections.splice(faqIdx, 0, ctaSection);
        } else {
          sections.push(ctaSection);
        }
      }
      ctasAdded++;
      modified = true;
    }

    if (!hasRelated) {
      const relatedSection = generateRelatedPostsSection(post, posts);
      if (relatedSection) {
        const faqIdx = sections.findIndex(s => s.headingId === "faq");
        if (faqIdx > -1) {
          sections.splice(faqIdx, 0, relatedSection);
        } else {
          sections.push(relatedSection);
        }
        relatedAdded++;
        modified = true;
      }
    }

    if (modified) {
      await db.update(blogPosts)
        .set({ sections })
        .where(eq(blogPosts.id, post.id));
      enhanced++;
    }
  }

  console.log(`\nEnhancement complete:`);
  console.log(`  Posts enhanced: ${enhanced}/${posts.length}`);
  console.log(`  FAQ sections added: ${faqsAdded}`);
  console.log(`  CTA sections added: ${ctasAdded}`);
  console.log(`  Related article sections added: ${relatedAdded}`);
  console.log(`  Posts with new internal links: ${linksAdded}`);

  console.log("\nUpdating createdAt timestamps to match display dates...");
  let dateUpdates = 0;
  for (const post of posts) {
    if (!post.date) continue;
    const parsed = new Date(post.date);
    if (isNaN(parsed.getTime())) continue;
    await db.update(blogPosts)
      .set({ createdAt: parsed })
      .where(eq(blogPosts.id, post.id));
    dateUpdates++;
  }
  console.log(`  Updated ${dateUpdates} timestamps`);

  process.exit(0);
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
