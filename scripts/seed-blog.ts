import { db } from "../server/db";
import { blogPosts, blogRedirects } from "../shared/schema";
import { blogPostsData } from "../client/src/data/blogPosts";

const oldToNewRedirects: Record<string, string> = {
  "/blog/how-to-boost-spare-parts-sales": "/blog/spare-parts-ecommerce-self-service-portal",
  "/blog/how-can-you-grow-your-bike-spare-parts-business": "/blog/spare-parts-ecommerce-self-service-portal",
  "/blog/transforming-your-digital-landscape-integrating-third-party-applications-with-sap-ecc-through-sap-connector": "/blog/integrating-third-party-apps-sap-ecc",
  "/blog/sell-machine-spare-parts-online": "/blog/manufacturers-dedicated-spare-parts-ordering-system",
  "/blog/best-competitors-and-alternatives-to-handshake": "/comparisons/handshake-alternatives",
  "/blog/heavy-equipment-spare-parts-sales": "/blog/spare-parts-pricing-strategy-margin-retention",
  "/blog/pepperi-alternatives-and-competitors": "/arc/compare/pepperi",
  "/blog/wholesale-marketing": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/how-to-sell-automotive-accessories-online": "/industries/automotive-aftermarket",
  "/blog/increase-construction-equipment-spare-parts-sales": "/blog/spare-parts-ecommerce-self-service-portal",
  "/blog/managing-spare-parts-business-for-an-industrial-oem": "/blog/manufacturers-dedicated-spare-parts-ordering-system",
  "/blog/just-in-time-inventory-jit": "/blog/ai-predictive-inventory-management-distributors",
  "/blog/quickbooks-commerce-tradegecko-alternatives": "/comparisons/tradegecko-alternatives",
  "/blog/ai-powered-ordering-apps-the-future-of-b2b-sales": "/blog/ai-reshaping-b2b-ecommerce-industrial-distributors",
  "/blog/how-to-sell-car-spare-parts": "/industries/automotive-aftermarket",
  "/blog/winning-the-aftermarket-sales": "/blog/spare-parts-pricing-strategy-margin-retention",
  "/blog/digital-enabled-fmcg-wholesale-benefits-of-launching-self-ordering-apps-for-b2b-and-horeca-customers": "/blog/digital-enabled-fmcg-wholesale-self-ordering-apps",
  "/blog/boost-efficiency-in-f-b-fmcg-wholesale-with-a-zoho-integrated-order-booking-sales-app": "/blog/sales-order-booking-app-zoho-inventory",
  "/blog/advantages-of-ecommerce": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/how-textile-machinery-spare-parts-manufacturers-can-move-online": "/blog/manufacturers-dedicated-spare-parts-ordering-system",
  "/blog/what-is-order-to-cash-o2c": "/blog/quotation-to-order-process-converting-revenue",
  "/blog/reckitt-pro-solution-india-revolutionizing-b2b-with-e-commerce": "/blog/chemical-distributor-increased-online-orders-case-study",
  "/blog/what-is-deadstock": "/blog/ai-predictive-inventory-management-distributors",
  "/blog/boost-your-industrial-sales-performance-with-smart-target-setting-and-automation": "/blog/automating-sales-pipeline-industrial-distributors",
  "/blog/what-is-purchase-order": "/blog/quotation-to-order-process-converting-revenue",
  "/blog/minimum-order-quantity": "/blog/complete-guide-b2b-customer-specific-pricing",
  "/blog/your-traditional-competitors-are-not-your-threats": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/the-digital-partner-engagement-revolution-how-industrial-brands-can-transform-channel-sales": "/blog/digital-partner-engagement-revolution-manufacturing",
  "/blog/b2b-ecommerce-for-soare-parts-businesses": "/blog/spare-parts-ecommerce-self-service-portal",
  "/blog/tips-for-managing-spare-parts-inventory": "/blog/spare-parts-pricing-strategy-margin-retention",
  "/blog/what-is-b2b-marketplace": "/blog/b2b-marketplace-industrial-mro-supplies",
  "/blog/boost-sales-product-recommendations": "/blog/ai-powered-product-recommendations-spare-parts",
  "/blog/b2b-wholesale": "/blog/implement-tiered-pricing-b2b-wholesale-distribution",
  "/blog/a-comprehensive-sales-order-booking-app-for-zoho-inventory": "/blog/sales-order-booking-app-zoho-inventory",
  "/blog/enhancing-industry-collaboration-a-case-study-from-a-leading-paint-manufacturer-in-india": "/blog/chemical-distributor-increased-online-orders-case-study",
  "/blog/what-is-lead-time": "/blog/ai-predictive-inventory-management-distributors",
  "/blog/what-is-spares-parts-management": "/solutions/spare-parts-ecommerce",
  "/blog/maximizing-growth-through-partner-sales-management-a-comprehensive-guide": "/blog/partner-engagement-strategy-industrial-brands",
  "/blog/why-an-offline-order-taking-app-is-essential-for-fmcg-and-industrial-b2b-sales": "/blog/offline-order-taking-app-industrial-b2b-sales",
  "/blog/how-to-write-invoice-email-for-ecommerce": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/unlocking-growth-for-industrial-distributors-how-opportunity-management-drives-sales-success": "/blog/opportunity-pipeline-management-predictable-revenue",
  "/blog/what-is-d2c": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/everything-you-need-to-know-about-b2b-ecommerce": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/inventory-stockout-risk-insight-the-modern-manufacturers-guide-to-preventing-revenue-loss": "/blog/ai-predictive-inventory-management-distributors",
  "/blog/perpetual-inventory": "/blog/ai-predictive-inventory-management-distributors",
  "/blog/harnessing-the-power-of-ai-unlocking-insights-from-historical-data": "/blog/industrial-manufacturers-ai-sales-forecasting",
  "/blog/product-catalog-management-ecommerce": "/blog/customer-specific-product-catalogs-b2b-commerce",
  "/blog/calculate-finished-goods-inventory": "/blog/ai-predictive-inventory-management-distributors",
  "/blog/what-is-an-online-marketplace": "/blog/b2b-marketplace-industrial-mro-supplies",
  "/blog/how-to-migrate-from-tradgecko": "/comparisons/tradegecko-alternatives",
  "/blog/increase-b2b-sales": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/the-crucial-role-of-manufacturers-in-the-supply-chain-tailoring-b2b-ecommerce-to-meet-their-unique-needs": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/opportunity-pipeline-management-for-industrial-businesses-your-data-driven-path-to-predictable-revenue": "/blog/opportunity-pipeline-management-predictable-revenue",
  "/blog/revamping-the-order-process-obo-bettermanns-digital-transformation": "/blog/obo-bettermann-digital-transformation-case-study",
  "/blog/inventory-management-techniques": "/blog/ai-predictive-inventory-management-distributors",
  "/blog/best-ecommerce-software": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/b2b-buying-process": "/blog/quotation-to-order-process-converting-revenue",
  "/blog/set-up-b2b-ecommerce-website": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/what-is-backordering": "/blog/ai-predictive-inventory-management-distributors",
  "/blog/the-ultimate-guide-to-cpq-software-for-small-and-medium-scale-industrial-businesses": "/blog/cpq-software-guide-small-medium-industrial-businesses",
  "/blog/what-are-the-new-trends-in-b2b-sales-for-150-growth-in-revenue": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/effective-management-of-moq-and-volume-based-pricing-is-essential-for-food-and-personal-care-wholesalers": "/blog/complete-guide-b2b-customer-specific-pricing",
  "/blog/wholesale-distributors-guide": "/blog/implement-tiered-pricing-b2b-wholesale-distribution",
  "/blog/uncovering-hidden-customer-needs-for-cross-selling-and-upselling-through-a-recommendations-engine": "/blog/ai-powered-product-recommendations-spare-parts",
  "/blog/stop-losing-deals-streamline-your-industrial-sales-with-growmax": "/blog/automating-sales-pipeline-industrial-distributors",
  "/blog/receive-customer-orders-through-multiple-channels-transforming-your-b2b-sales-experience": "/blog/offline-order-taking-app-industrial-b2b-sales",
  "/blog/why-a-channel-partner-hub-with-performance-analytics-is-essential-for-business-growth": "/blog/partner-performance-analytics-channel-growth",
  "/blog/bridging-the-partner-visibility-gap-streamlining-the-quotation-to-order-process-for-industrial-brands": "/blog/bridging-partner-visibility-gap-quotation-order",
  "/blog/independent-partner-portals-for-industrial-channels": "/blog/partner-engagement-strategy-industrial-brands",
  "/blog/make-2x-faster-decisions-in-your-sales-cycle": "/blog/automating-sales-pipeline-industrial-distributors",
  "/blog/what-is-order-management": "/blog/quotation-to-order-process-converting-revenue",
  "/blog/what-is-ecommerce-crm": "/blog/integrating-zoho-crm-b2b-ecommerce-guide",
  "/blog/ecommerce-terms-glossary": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/top-b2b-software": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/shopify-vs-woocommerce-vs-magento-vs-bigcommerce": "/blog/future-b2b-commerce-headless-architecture-manufacturers",
  "/blog/what-is-the-difference-between-b2c-b2b-ecommerce-platforms": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/why-product-categorization-matters-in-sales-self-ordering-apps": "/blog/customer-specific-product-catalogs-b2b-commerce",
  "/blog/progressive-web-app-pwa-guide": "/blog/future-b2b-commerce-headless-architecture-manufacturers",
  "/blog/why-b2b-marketers-should-invest-in-b2b-ecommerce-a-hybrid-approach-for-competitive-advantage": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/reduce-sales-costs-in-f-b-wholesale-with-a-zoho-integrated-self-order-booking-app": "/blog/sales-order-booking-app-zoho-inventory",
  "/blog/from-data-to-decisions-how-kpis-and-opportunity-management-drive-growth-for-industrial-distributors": "/blog/opportunity-pipeline-management-predictable-revenue",
  "/blog/maximize-automotive-aftermarket-sales-with-growmaxs-channel-partner-hub": "/industries/automotive-aftermarket",
  "/blog/what-is-inventory-control": "/blog/ai-predictive-inventory-management-distributors",
  "/blog/ecommerce-personalization": "/blog/ai-powered-product-recommendations-spare-parts",
  "/blog/ecommerce-shipping-method": "/blog/multi-warehouse-b2b-ecommerce-platform-architecture",
  "/blog/writing-product-description-guide": "/blog/customer-specific-product-catalogs-b2b-commerce",
  "/blog/what-is-product-experience-management": "/blog/customer-specific-product-catalogs-b2b-commerce",
  "/blog/what-is-safety-stock": "/blog/ai-predictive-inventory-management-distributors",
  "/blog/shopify-plus-alternatives": "/comparisons/tradegecko-alternatives",
  "/blog/empower-your-business-with-advantage-of-b2b-ecommerce": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/empower-sales-rep-with-digital-commerce": "/blog/offline-order-taking-app-industrial-b2b-sales",
  "/blog/b2b-ecommerce-a-new-sales-channel-for-b2b-manufacturers-wholesalers-distributors": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/what-is-headless-commerce": "/blog/future-b2b-commerce-headless-architecture-manufacturers",
  "/blog/4-critical-features-to-win-digital-customer-experience-with-b2b-ecommerce": "/blog/b2b-ecommerce-strategy-industrial-manufacturers",
  "/blog/transform-your-digital-landscape-by-building-an-integration-layer-to-interact-with-new-age-applications": "/blog/integrating-third-party-apps-sap-ecc",
};

async function seed() {
  console.log("Seeding blog posts...");

  const entries = Object.values(blogPostsData);
  let inserted = 0;
  let skipped = 0;

  for (const post of entries) {
    try {
      await db.insert(blogPosts).values({
        slug: post.slug,
        title: post.title,
        category: post.category,
        date: post.date,
        author: post.author,
        authorTeam: post.authorTeam,
        readTime: post.readTime,
        excerpt: post.excerpt,
        sections: post.sections,
        relatedSlugs: post.relatedIds || [],
        published: true,
        legacyUrl: null,
      }).onConflictDoNothing();
      inserted++;
    } catch (err: any) {
      if (err.message?.includes("unique") || err.message?.includes("duplicate")) {
        skipped++;
      } else {
        console.error(`Failed to insert post "${post.slug}":`, err.message);
      }
    }
  }

  console.log(`Blog posts: ${inserted} inserted, ${skipped} skipped (already exist)`);

  console.log("Seeding redirects...");
  let redirectsInserted = 0;

  for (const [oldPath, newPath] of Object.entries(oldToNewRedirects)) {
    try {
      await db.insert(blogRedirects).values({
        oldPath,
        newPath,
      }).onConflictDoNothing();
      redirectsInserted++;
    } catch {}
  }

  console.log(`Redirects: ${redirectsInserted} processed`);
  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
