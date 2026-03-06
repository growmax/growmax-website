import { Link } from "wouter";
import { Check, X, ArrowRight, Star, Globe, Smartphone, DollarSign, Package, Building2, ShieldCheck, Clock, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema } from "@/lib/structuredData";

const competitors = [
  {
    name: "Growmax ARC",
    tagline: "Best All-in-One Platform for SMB Distributors",
    highlight: true,
    description: "The all-in-one B2B distributor platform with self-service signup. Inventory management, customer portal, and mobile sales rep app — ready in minutes. Native Zoho, QuickBooks & Xero integration, offline field sales, and multi-warehouse inventory — no plugins required.",
    pros: [
      "Native Zoho & SAP ERP integration — no middleware",
      "Offline-capable mobile app for field sales reps",
      "Multi-warehouse inventory with intelligent allocation",
      "Partner commerce portal for channel sales",
      "Quote-to-order workflow with approval engine",
      "Customer-specific pricing with volume brackets",
      "Managed SaaS — no hosting or maintenance burden",
    ],
    cons: [
      "Focused on B2B industrial — not ideal for DTC brands",
      "No native WordPress or WooCommerce plugin",
    ],
    pricing: "From $199/mo",
    bestFor: "Industrial distributors, electrical wholesalers, building materials companies, manufacturers with complex pricing",
    rating: "4.8",
  },
  {
    name: "BigCommerce B2B Edition",
    tagline: "SaaS B2B Commerce Platform",
    highlight: false,
    description: "BigCommerce's B2B offering adds corporate account management, quote management, and buyer portals. A solid SaaS alternative to WooCommerce's plugin approach.",
    pros: [
      "Managed SaaS — no hosting burden",
      "Good for B2B + DTC hybrid models",
      "Corporate account management",
      "Native quote management",
    ],
    cons: [
      "Originally built for DTC — B2B is secondary",
      "No native ERP integration for SAP/Zoho",
      "No offline field sales capabilities",
      "Limited multi-warehouse support",
      "Transaction-based pricing at scale",
      "No partner commerce portal",
    ],
    pricing: "Custom (typically $1,000+/mo)",
    bestFor: "Mid-market B2B brands that also sell DTC and want a managed SaaS platform",
    rating: "4.1",
  },
  {
    name: "Shopify Plus B2B",
    tagline: "DTC Platform with B2B Channel",
    highlight: false,
    description: "Shopify Plus has added B2B capabilities including wholesale channels, company accounts, and custom pricing. Easy to use but limited for complex B2B distribution.",
    pros: [
      "Massive app ecosystem",
      "Easy admin interface",
      "Strong payment processing",
      "Good for B2B + DTC hybrid",
    ],
    cons: [
      "DTC-first architecture — B2B is an add-on",
      "No native ERP integration for industrial ERPs",
      "No offline mobile ordering for field reps",
      "Limited complex pricing capabilities",
      "No multi-warehouse allocation logic",
      "High monthly cost ($2,300/mo)",
    ],
    pricing: "From $2,300/mo",
    bestFor: "DTC brands adding a wholesale channel, not industrial distributors",
    rating: "4.3",
  },
  {
    name: "OroCommerce",
    tagline: "Open-Source Enterprise B2B Commerce",
    highlight: false,
    description: "Open-source enterprise B2B commerce platform with a built-in CRM. More B2B-native than WooCommerce but requires significant development resources.",
    pros: [
      "Purpose-built for B2B commerce",
      "Open-source with full code access",
      "Built-in CRM functionality",
      "Multi-organization support",
    ],
    cons: [
      "Requires dedicated development team",
      "6-12 month implementation typical",
      "High total cost of ownership",
      "Self-hosted infrastructure burden",
      "No native mobile app",
      "Steep learning curve",
    ],
    pricing: "Custom ($2,000+/mo + hosting + dev)",
    bestFor: "Large enterprises with in-house development teams and complex multi-org requirements",
    rating: "4.0",
  },
  {
    name: "PrestaShop B2B",
    tagline: "Open-Source eCommerce with B2B Modules",
    highlight: false,
    description: "PrestaShop offers B2B capabilities through its module marketplace, similar to WooCommerce's plugin approach but on a different PHP framework. Free core with paid add-ons.",
    pros: [
      "Free open-source core",
      "Large module marketplace",
      "Multi-language support built-in",
      "Active community",
    ],
    cons: [
      "B2B features require multiple paid modules",
      "Plugin compatibility issues",
      "No native mobile app for field sales",
      "No ERP integration out of the box",
      "Self-hosted with maintenance burden",
      "Limited scalability for large catalogs",
    ],
    pricing: "Free core + $50-$500/mo in modules + hosting",
    bestFor: "Small European wholesalers who want an open-source alternative to WooCommerce",
    rating: "3.8",
  },
];

const featureComparison = [
  { category: "Ordering & Commerce", items: [
    { feature: "B2B Customer Self-Service Portal", growmax: true, bigcommerce: true, shopify: true, oro: true, prestashop: true },
    { feature: "Offline Mobile Order-Taking App", growmax: true, bigcommerce: false, shopify: false, oro: false, prestashop: false },
    { feature: "Field Sales Rep App (iOS/Android)", growmax: true, bigcommerce: false, shopify: false, oro: false, prestashop: false },
    { feature: "Customer-Specific Pricing", growmax: true, bigcommerce: true, shopify: true, oro: true, prestashop: true },
    { feature: "Multi-Currency Support", growmax: true, bigcommerce: true, shopify: true, oro: true, prestashop: true },
    { feature: "Quote-to-Order Workflow", growmax: true, bigcommerce: true, shopify: false, oro: true, prestashop: false },
    { feature: "Re-Order Automation", growmax: true, bigcommerce: false, shopify: false, oro: true, prestashop: false },
  ]},
  { category: "Inventory & Warehouse", items: [
    { feature: "Real-Time Inventory Sync", growmax: true, bigcommerce: true, shopify: true, oro: true, prestashop: true },
    { feature: "Multi-Warehouse Support", growmax: true, bigcommerce: false, shopify: false, oro: true, prestashop: false },
    { feature: "Low Stock Threshold Alerts", growmax: true, bigcommerce: true, shopify: true, oro: true, prestashop: true },
    { feature: "Inventory Allocation Logic", growmax: true, bigcommerce: false, shopify: false, oro: false, prestashop: false },
  ]},
  { category: "Integrations", items: [
    { feature: "Native Zoho Integration", growmax: true, bigcommerce: false, shopify: false, oro: false, prestashop: false },
    { feature: "QuickBooks Integration", growmax: true, bigcommerce: true, shopify: true, oro: false, prestashop: false },
    { feature: "SAP / ERP Connectivity", growmax: true, bigcommerce: false, shopify: false, oro: false, prestashop: false },
    { feature: "API Access", growmax: true, bigcommerce: true, shopify: true, oro: true, prestashop: true },
    { feature: "Webhook Support", growmax: true, bigcommerce: true, shopify: true, oro: true, prestashop: false },
  ]},
  { category: "Sales & CRM", items: [
    { feature: "Partner Commerce Portal", growmax: true, bigcommerce: false, shopify: false, oro: false, prestashop: false },
    { feature: "Opportunity Pipeline Management", growmax: true, bigcommerce: false, shopify: false, oro: true, prestashop: false },
    { feature: "Visit Logging & Field Data Capture", growmax: true, bigcommerce: false, shopify: false, oro: false, prestashop: false },
    { feature: "Account-Level Price Matrices", growmax: true, bigcommerce: true, shopify: false, oro: true, prestashop: false },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "$199/mo", bigcommerce: "Custom ($1,000+/mo)", shopify: "$2,300/mo", oro: "Custom ($2,000+/mo)", prestashop: "Free + modules" },
  { label: "Free Trial", growmax: "14 days", bigcommerce: "No", shopify: "No", oro: "No", prestashop: "N/A (self-hosted)" },
  { label: "Setup Fee", growmax: "$0", bigcommerce: "$5K-$25K", shopify: "$0", oro: "$30K-$150K+", prestashop: "DIY or $5K-$20K" },
  { label: "Mobile App Included", growmax: "Yes", bigcommerce: "No", shopify: "No", oro: "No", prestashop: "No" },
  { label: "Implementation Time", growmax: "2-4 weeks", bigcommerce: "2-4 months", shopify: "1-3 months", oro: "6-12 months", prestashop: "2-6 months" },
];

const whyWooCommerceUsersSwitch = [
  {
    icon: Wrench,
    title: "Plugin Fatigue Is Real",
    description: "Running B2B on WooCommerce means juggling 10-20 plugins for pricing, quoting, inventory, and customer groups. One update breaks another. Growmax ARC delivers all B2B features natively — no plugins, no conflicts, no fragility."
  },
  {
    icon: Clock,
    title: "Maintenance Is Consuming Your Team",
    description: "WordPress core updates, WooCommerce updates, plugin updates, PHP version changes, security patches, hosting management — your team spends more time maintaining the platform than growing the business. Growmax ARC is fully managed SaaS."
  },
  {
    icon: Smartphone,
    title: "Your Field Reps Need Mobile Ordering",
    description: "WooCommerce has no mobile app for field sales reps. Your reps are using a responsive website on their phones — if they even have signal. Growmax ARC provides offline-capable native iOS/Android apps with GPS visit logging."
  },
  {
    icon: Package,
    title: "Scaling Past 10K SKUs Is Painful",
    description: "WooCommerce performance degrades significantly with large catalogs. Growmax ARC is built for distributors with large SKU catalogs, handling complex pricing matrices, variant management, and real-time inventory without performance issues."
  },
  {
    icon: Building2,
    title: "ERP Integration Is Held Together with Duct Tape",
    description: "WooCommerce ERP integrations rely on third-party plugins or custom middleware. One API change breaks the sync. Growmax ARC connects natively to Zoho, QuickBooks, and Xero with bidirectional real-time sync — built into the platform."
  },
  {
    icon: ShieldCheck,
    title: "Security Is Your Responsibility",
    description: "WooCommerce sites are high-value targets for hackers. You're responsible for security patches, SSL, PCI compliance, and server hardening. Growmax ARC handles all security, compliance, and infrastructure — so you don't have to."
  },
];

const faqs = [
  {
    question: "Why switch from WooCommerce to a dedicated B2B platform?",
    answer: "WooCommerce is a WordPress plugin designed for DTC retail. B2B features like customer-specific pricing, quote management, multi-warehouse inventory, and field sales apps require multiple plugins that create fragility, performance issues, and maintenance burden. A purpose-built B2B platform like Growmax ARC delivers all these features natively with better performance, security, and reliability — starting at $199/mo."
  },
  {
    question: "Can I migrate my WooCommerce catalog to Growmax ARC?",
    answer: "Yes. Growmax ARC's migration team handles full catalog transfer including products, categories, images, pricing, customer accounts, and order history. Most WooCommerce to Growmax ARC migrations complete in 2-4 weeks with zero data loss."
  },
  {
    question: "What about my WordPress blog content?",
    answer: "Your WordPress blog can continue running independently. Many distributors keep their WordPress site for content marketing and SEO while using Growmax ARC as their B2B commerce platform. The two systems can be linked seamlessly."
  },
  {
    question: "Is Growmax ARC more expensive than WooCommerce?",
    answer: "While WooCommerce itself is free, the total cost of B2B WooCommerce includes premium plugins ($500-$2,000/year), hosting ($100-$500/mo for performance), developer maintenance ($2,000-$5,000/mo), and security management. Growmax ARC at $199/mo with zero maintenance overhead is typically 40-60% cheaper in total cost of ownership."
  },
  {
    question: "How does Growmax ARC handle complex B2B pricing vs WooCommerce?",
    answer: "WooCommerce requires plugins like B2B King or Wholesale Suite for customer-specific pricing, and they often conflict with each other. Growmax ARC handles customer-specific price lists, volume brackets, contract pricing, tiered discounts, and real-time margin calculations natively — no plugins needed."
  },
];

export default function WooCommerceB2BAlternatives() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Best WooCommerce B2B Alternatives & Competitors in 2026 | Growmax"
        description="Compare the best WooCommerce B2B alternatives: Growmax ARC, BigCommerce B2B, Shopify Plus, OroCommerce, and PrestaShop. Feature comparison, pricing, and migration guide for distributors."
        path="/comparisons/woocommerce-b2b-alternatives"
        structuredData={webPageSchema({
          title: "Best WooCommerce B2B Alternatives & Competitors in 2026",
          description: "Comprehensive comparison of WooCommerce B2B alternatives for wholesale ordering. Compare features, pricing, pros and cons of top B2B commerce platforms for industrial distributors.",
          path: "/comparisons/woocommerce-b2b-alternatives",
          keywords: [
            "woocommerce b2b alternatives",
            "woocommerce b2b competitors",
            "woocommerce wholesale alternative",
            "woocommerce b2b replacement",
            "B2B commerce platform",
            "woocommerce vs growmax",
            "best B2B ordering platform 2026",
          ],
        })}
      />

      <section className="pt-32 pb-24 border-b border-gray-200 bg-grid-pattern relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="mb-6">
              <Breadcrumbs items={[
                { label: "Comparisons" },
                { label: "WooCommerce B2B Alternatives" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // WooCommerce B2B Alternatives 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Best WooCommerce B2B<br/>
              Alternatives &<br/>
              <span className="text-gray-400">Competitors in 2026.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              WooCommerce is great for DTC retail, but using it for B2B wholesale means juggling dozens of plugins, fighting performance issues, and managing your own infrastructure. Here are the best purpose-built B2B commerce alternatives in 2026.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Why Switch</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why B2B Distributors Are Outgrowing WooCommerce</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="section-why-switch">
            {whyWooCommerceUsersSwitch.map((item, i) => (
              <div key={i} className="border border-gray-800 p-8 hover:border-growmax-red transition-colors group" data-testid={`card-reason-${i}`}>
                <item.icon className="w-10 h-10 text-growmax-red mb-6" />
                <h3 className="text-xl font-bold mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Platform Reviews</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Top 5 WooCommerce B2B Alternatives Compared</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="space-y-8" data-testid="section-competitor-cards">
            {competitors.map((comp, i) => (
              <div
                key={i}
                className={`border-2 p-8 md:p-10 ${comp.highlight ? "border-growmax-red shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "border-gray-200"}`}
                data-testid={`card-competitor-${i}`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold tracking-tight text-growmax-black">{comp.name}</h3>
                      {comp.highlight && (
                        <span className="bg-growmax-red text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1 font-bold" data-testid="badge-recommended">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-3">{comp.tagline}</div>
                    <p className="text-gray-600 font-light leading-relaxed max-w-2xl">{comp.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1 justify-end mb-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-mono text-sm font-bold text-growmax-black">{comp.rating}/5</span>
                    </div>
                    <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">{comp.pricing}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="font-mono text-xs text-green-700 uppercase tracking-widest font-bold mb-4">Pros</div>
                    <div className="space-y-3">
                      {comp.pros.map((pro, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{pro}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-xs text-red-700 uppercase tracking-widest font-bold mb-4">Cons</div>
                    <div className="space-y-3">
                      {comp.cons.map((con, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{con}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Best For</div>
                  <p className="text-sm text-gray-600 font-light">{comp.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Feature Matrix</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Feature-by-Feature Comparison</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="md:hidden font-mono text-xs text-gray-500 mb-2">Scroll to compare →</div>
          <div className="overflow-x-auto">
            {featureComparison.map((group, gi) => (
              <div key={gi} className="mb-12" data-testid={`section-features-${gi}`}>
                <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">
                  {group.category}
                </div>
                <div className="border border-gray-800 min-w-[800px]">
                  <div className="grid grid-cols-6 border-b border-gray-800 bg-gray-900">
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase">Feature</div>
                    <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-gray-800 font-bold">Growmax ARC</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">BigCommerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Shopify Plus</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">OroCommerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">PrestaShop</div>
                  </div>
                  {group.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-6 border-b border-gray-800 last:border-b-0 hover:bg-gray-900/50 transition-colors" data-testid={`row-feature-${gi}-${i}`}>
                      <div className="p-4 font-mono text-sm text-gray-300">{item.feature}</div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.growmax ? <Check className="w-5 h-5 text-growmax-red" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.bigcommerce ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.shopify ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.oro ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.prestashop ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Commercials</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Pricing Comparison</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="md:hidden font-mono text-xs text-gray-500 mb-2">Scroll to compare →</div>
          <div className="overflow-x-auto">
            <div className="border border-growmax-black min-w-[800px]" data-testid="section-pricing-comparison">
              <div className="grid grid-cols-6 border-b border-growmax-black bg-gray-50">
                <div className="p-4 font-mono text-xs text-gray-500 uppercase"></div>
                <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-growmax-black font-bold">Growmax ARC</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">BigCommerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Shopify Plus</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Oro</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">PrestaShop</div>
              </div>
              {pricingComparison.map((row, i) => (
                <div key={i} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0" data-testid={`row-pricing-${i}`}>
                  <div className="p-4 font-mono text-sm text-growmax-black font-bold">{row.label}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-growmax-black font-bold">{row.growmax}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.bigcommerce}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.shopify}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.oro}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.prestashop}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Migration Guide</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Migrating from WooCommerce to Growmax ARC</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Plugin Audit", description: "We map your WooCommerce plugins to native Growmax ARC features. Most distributors replace 10-15 plugins with built-in Growmax ARC functionality — eliminating complexity and conflicts." },
              { step: "02", title: "Data Migration", description: "Products, categories, images, customer accounts, pricing rules, and order history are migrated via our WooCommerce export tool. Full data validation included." },
              { step: "03", title: "Accounting Connection", description: "Connect Growmax ARC directly to your accounting system (Zoho, QuickBooks, Xero) — no more fragile WooCommerce middleware. Bidirectional sync configured and tested." },
              { step: "04", title: "Go Live", description: "Launch Growmax ARC with your team trained and ready. Keep your WordPress blog running independently. Zero downtime migration with parallel running available." },
            ].map((item, i) => (
              <div key={i} className="border-2 border-growmax-black p-6" data-testid={`card-migration-step-${i}`}>
                <div className="font-mono text-xs text-growmax-red mb-3 uppercase font-bold">{item.step}</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 text-growmax-black">{item.title}</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">FAQ</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Frequently Asked Questions</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="space-y-6" data-testid="section-faq">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 bg-white p-8" data-testid={`faq-item-${i}`}>
                <h3 className="text-lg font-bold tracking-tight mb-3 text-growmax-black">{faq.question}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 text-center bg-white">
        <div className="container mx-auto px-4">
          <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-6 font-bold">Deploy Now</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter text-growmax-black" data-testid="text-cta-title">
            Outgrow WooCommerce.<br/>Deploy Growmax ARC today.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10">
            Start your 14-day free trial. No credit card required. Full platform access from day one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/demo">
              <Button className="bg-growmax-red hover:bg-growmax-black text-white h-14 px-10 text-lg rounded-none transition-all duration-300 font-bold tracking-tight" data-testid="button-cta-demo">
                Book a Demo <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/arc/pricing">
              <Button variant="outline" className="border-growmax-black text-growmax-black hover:bg-growmax-black hover:text-white h-14 px-10 text-lg rounded-none transition-all duration-300 font-bold tracking-tight" data-testid="button-cta-pricing">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}