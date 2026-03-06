import { Link } from "wouter";
import { Check, X, ArrowRight, Star, Globe, Smartphone, DollarSign, Package, Zap, Building2, ShieldCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema, faqPageSchema } from "@/lib/structuredData";

const competitors = [
  {
    name: "Growmax ARC",
    tagline: "Best All-in-One Platform for SMB Distributors",
    highlight: true,
    description: "The all-in-one B2B distributor platform with self-service signup. While Shopify Plus adds B2B features to a DTC platform, Growmax ARC was built from the ground up for B2B wholesale — with inventory management, customer portal, mobile sales rep app, and native Zoho/QuickBooks/Xero integration.",
    pros: [
      "Purpose-built for B2B — not a DTC platform with B2B bolted on",
      "Offline-capable mobile app for field sales reps",
      "Native Zoho & SAP ERP integration",
      "Multi-warehouse inventory with intelligent allocation",
      "Partner commerce portal for channel sales",
      "No transaction fees on any payment method",
    ],
    cons: [
      "No DTC storefront or consumer-facing themes",
      "Smaller app marketplace than Shopify",
    ],
    pricing: "From $199/mo",
    bestFor: "Industrial distributors, wholesalers, and manufacturers where B2B is the primary business model",
    rating: "4.8",
  },
  {
    name: "Shopify Plus B2B",
    tagline: "B2B Features Added to Shopify Plus",
    highlight: false,
    description: "Shopify Plus now includes B2B features like wholesale channels, company profiles, and custom catalogs. But fundamentally, it's a DTC platform with B2B functionality layered on top.",
    pros: [
      "Massive app ecosystem (8,000+ apps)",
      "Beautiful storefront themes",
      "Easy-to-use admin interface",
      "Strong payment processing (Shopify Payments)",
    ],
    cons: [
      "B2B is secondary to DTC — not purpose-built",
      "No offline ordering capability",
      "No field sales rep mobile app",
      "Transaction fees on non-Shopify Payments (0.15-0.5%)",
      "Limited complex pricing (no volume brackets, SPAs)",
      "No native SAP/Zoho/QuickBooks integration",
      "No partner commerce portal",
    ],
    pricing: "From $2,300/mo",
    bestFor: "DTC-first brands adding a wholesale channel — not for pure B2B distributors",
    rating: "4.3",
  },
  {
    name: "BigCommerce B2B Edition",
    tagline: "SaaS B2B eCommerce",
    highlight: false,
    description: "Enterprise B2B features on BigCommerce's SaaS platform. Better B2B depth than Shopify but still built on a retail-first architecture.",
    pros: [
      "Strong B2B buyer portal with company accounts",
      "Headless commerce with Next.js support",
      "No transaction fees on any payment gateway",
      "Good catalog management",
    ],
    cons: [
      "Revenue-based pricing scales with sales volume",
      "No offline mobile app",
      "No field sales rep tools",
      "Limited ERP integration depth",
      "No partner commerce portal",
    ],
    pricing: "Custom ($1,000-$3,000+/mo)",
    bestFor: "Mid-market companies wanting hybrid B2B/DTC with headless architecture",
    rating: "4.2",
  },
  {
    name: "WooCommerce B2B",
    tagline: "WordPress-Based B2B eCommerce",
    highlight: false,
    description: "B2B plugins for WooCommerce on WordPress. Highly customizable via plugins but requires technical expertise and ongoing maintenance.",
    pros: [
      "Low entry cost — open-source foundation",
      "Massive plugin ecosystem",
      "Full design control via WordPress",
      "Large developer community",
    ],
    cons: [
      "B2B features require multiple plugins ($$$)",
      "Security and maintenance burden",
      "No native mobile app",
      "Performance issues at scale",
      "No native ERP integration",
      "Plugin conflicts are common",
    ],
    pricing: "From $50/mo (hosting) + plugins",
    bestFor: "Small businesses with WordPress expertise wanting basic B2B functionality",
    rating: "3.8",
  },
  {
    name: "Sana Commerce",
    tagline: "ERP-Integrated B2B eCommerce",
    highlight: false,
    description: "B2B platform tightly integrated with SAP and Microsoft Dynamics. Excellent ERP connectivity but high implementation costs and limited to specific ERP ecosystems.",
    pros: [
      "Deep SAP and Dynamics integration",
      "Real-time ERP data sync",
      "Self-service customer portal",
      "Strong content management",
    ],
    cons: [
      "Locked to SAP or Dynamics only",
      "High implementation costs ($50K-$200K+)",
      "No offline mobile app",
      "4-8 month implementation",
      "No Zoho or QuickBooks support",
    ],
    pricing: "Custom ($1,500+/mo + implementation)",
    bestFor: "Enterprises on SAP or Microsoft Dynamics wanting deep ERP-connected commerce",
    rating: "4.2",
  },
];

const featureComparison = [
  { category: "Ordering & Commerce", items: [
    { feature: "B2B Customer Self-Service Portal", growmax: true, shopify: true, bigcommerce: true, woocommerce: true, sana: true },
    { feature: "Offline Mobile Order-Taking App", growmax: true, shopify: false, bigcommerce: false, woocommerce: false, sana: false },
    { feature: "Field Sales Rep App (iOS/Android)", growmax: true, shopify: false, bigcommerce: false, woocommerce: false, sana: false },
    { feature: "Customer-Specific Pricing", growmax: true, shopify: true, bigcommerce: true, woocommerce: true, sana: true },
    { feature: "Volume Bracket Pricing", growmax: true, shopify: false, bigcommerce: false, woocommerce: true, sana: true },
    { feature: "Quote-to-Order Workflow", growmax: true, shopify: false, bigcommerce: false, woocommerce: false, sana: false },
    { feature: "Company Accounts & Roles", growmax: true, shopify: true, bigcommerce: true, woocommerce: false, sana: true },
  ]},
  { category: "Inventory & Warehouse", items: [
    { feature: "Real-Time Inventory Sync", growmax: true, shopify: true, bigcommerce: true, woocommerce: true, sana: true },
    { feature: "Multi-Warehouse Support", growmax: true, shopify: false, bigcommerce: false, woocommerce: false, sana: true },
    { feature: "Inventory Allocation Logic", growmax: true, shopify: false, bigcommerce: false, woocommerce: false, sana: false },
    { feature: "Low Stock Alerts", growmax: true, shopify: true, bigcommerce: true, woocommerce: true, sana: true },
  ]},
  { category: "Integrations", items: [
    { feature: "Native Zoho Integration", growmax: true, shopify: false, bigcommerce: false, woocommerce: false, sana: false },
    { feature: "SAP / ERP Connectivity", growmax: true, shopify: false, bigcommerce: false, woocommerce: false, sana: true },
    { feature: "QuickBooks Integration", growmax: true, shopify: true, bigcommerce: true, woocommerce: true, sana: false },
    { feature: "API Access", growmax: true, shopify: true, bigcommerce: true, woocommerce: true, sana: true },
    { feature: "No Transaction Fees", growmax: true, shopify: false, bigcommerce: true, woocommerce: true, sana: true },
  ]},
  { category: "Sales & CRM", items: [
    { feature: "Partner Commerce Portal", growmax: true, shopify: false, bigcommerce: false, woocommerce: false, sana: false },
    { feature: "Visit Logging & Field Data", growmax: true, shopify: false, bigcommerce: false, woocommerce: false, sana: false },
    { feature: "Account-Level Price Matrices", growmax: true, shopify: false, bigcommerce: true, woocommerce: false, sana: true },
    { feature: "Opportunity Pipeline", growmax: true, shopify: false, bigcommerce: false, woocommerce: false, sana: false },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "$199/mo", shopify: "$2,300/mo", bigcommerce: "Custom ($1K+/mo)", woocommerce: "~$50/mo + plugins", sana: "Custom ($1.5K+/mo)" },
  { label: "Transaction Fees", growmax: "None", shopify: "0.15-0.5%*", bigcommerce: "None", woocommerce: "Varies", sana: "None" },
  { label: "Free Trial", growmax: "14 days", shopify: "No", bigcommerce: "Demo only", woocommerce: "N/A", sana: "No" },
  { label: "Setup Fee", growmax: "$0", shopify: "$0", bigcommerce: "Custom", woocommerce: "$0", sana: "$50K-$200K+" },
  { label: "Mobile App Included", growmax: "Yes", shopify: "No", bigcommerce: "No", woocommerce: "No", sana: "No" },
  { label: "Implementation Time", growmax: "2-4 weeks", shopify: "1-3 months", bigcommerce: "2-4 months", woocommerce: "1-3 months", sana: "4-8 months" },
];

const whyShopifyUsersSwitch = [
  {
    icon: Building2,
    title: "B2B Is an Add-On, Not the Foundation",
    description: "Shopify Plus B2B is built on top of a DTC platform. The B2B features are limited compared to purpose-built solutions — no offline ordering, no field sales app, no customer self-service portal."
  },
  {
    icon: CreditCard,
    title: "Transaction Fees Eat Your Margins",
    description: "Shopify charges 0.15-0.5% on every transaction if you don't use Shopify Payments. For high-volume B2B distributors, this adds up to thousands per month. Growmax ARC has zero transaction fees."
  },
  {
    icon: Smartphone,
    title: "No Mobile App for Field Sales",
    description: "Shopify has no native mobile app for field sales reps. Growmax ARC includes iOS and Android apps with offline ordering, GPS visit logging, and customer-specific pricing."
  },
  {
    icon: DollarSign,
    title: "Limited Complex Pricing",
    description: "Shopify Plus B2B supports basic price lists but can't handle volume brackets, SPAs, tiered discounts, or account-level pricing matrices that industrial distributors need."
  },
  {
    icon: Globe,
    title: "No Native ERP Integration",
    description: "Shopify relies on third-party apps for ERP integration. Growmax ARC connects natively to Zoho, QuickBooks, and Xero with bidirectional real-time sync."
  },
  {
    icon: Package,
    title: "No Multi-Warehouse Intelligence",
    description: "Shopify doesn't support multi-warehouse allocation logic. Distributors need intelligent inventory routing across multiple locations — Growmax ARC handles this natively."
  },
];

const faqs = [
  {
    question: "What is the best alternative to Shopify Plus for B2B?",
    answer: "Growmax ARC is the best Shopify Plus B2B alternative for SMB distributors. Unlike Shopify Plus (a DTC platform with B2B added), Growmax ARC is purpose-built for B2B with offline mobile ordering, native Zoho/QuickBooks/Xero integration, multi-warehouse inventory, customer self-service portal, and zero transaction fees — all for $199/mo."
  },
  {
    question: "How does Growmax ARC compare to Shopify Plus B2B pricing?",
    answer: "Growmax ARC starts at $199/month with no transaction fees. Shopify Plus starts at $2,300/month and charges 0.15-0.5% transaction fees on non-Shopify Payments orders. For a distributor processing $500K/month, Shopify's transaction fees alone can cost $750-$2,500/month."
  },
  {
    question: "Can I use Shopify Plus for B2B wholesale distribution?",
    answer: "While Shopify Plus has added B2B features, it lacks critical capabilities for wholesale distribution: no offline ordering, no field sales apps, no multi-warehouse allocation, no customer self-service portal, and limited complex pricing. For pure B2B distribution, purpose-built platforms like Growmax ARC are significantly more capable."
  },
  {
    question: "Does Growmax ARC have an app marketplace like Shopify?",
    answer: "Growmax ARC focuses on providing complete B2B functionality out of the box rather than relying on third-party apps. Features like accounting integration, mobile ordering, customer portal, and inventory management are all native — no additional apps or plugins needed."
  },
  {
    question: "Can I migrate from Shopify Plus to Growmax ARC?",
    answer: "Yes. Growmax ARC provides structured migration support from Shopify Plus. We help export your product catalog, customer accounts, and pricing data. Most migrations complete within 2-4 weeks with zero data loss."
  },
  {
    question: "Should I use Shopify Plus or Growmax ARC for B2B?",
    answer: "If your business is primarily DTC with a secondary wholesale channel, Shopify Plus may work. If B2B is your core business — especially if you're a distributor — Growmax ARC delivers significantly more depth at $199/mo: offline ordering, field sales tools, accounting integration, multi-warehouse intelligence, and customer self-service portal."
  },
];

export default function ShopifyPlusB2BAlternatives() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Best Shopify Plus B2B Alternatives & Competitors in 2026 | Growmax"
        description="Compare the best Shopify Plus B2B alternatives for wholesale distributors: Growmax ARC, BigCommerce B2B, WooCommerce, and Sana Commerce. Feature comparison, pricing, and migration guide."
        path="/comparisons/shopify-plus-b2b-alternatives"
        structuredData={[
          webPageSchema({
            title: "Best Shopify Plus B2B Alternatives & Competitors in 2026",
            description: "Comprehensive comparison of Shopify Plus B2B alternatives for wholesale distributors and manufacturers.",
            path: "/comparisons/shopify-plus-b2b-alternatives",
            keywords: [
              "shopify plus b2b alternatives",
              "shopify plus b2b competitors",
              "shopify plus wholesale alternative",
              "shopify plus b2b vs growmax",
              "best shopify plus b2b alternative",
              "B2B ecommerce platform",
              "shopify plus b2b review",
              "shopify b2b limitations",
            ],
          }),
          faqPageSchema({
            title: "Shopify Plus B2B Alternatives FAQ",
            path: "/comparisons/shopify-plus-b2b-alternatives",
            faqs,
          }),
        ]}
      />

      <section className="pt-32 pb-24 border-b border-gray-200 bg-grid-pattern relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="mb-6">
              <Breadcrumbs items={[
                { label: "Comparisons" },
                { label: "Shopify Plus B2B Alternatives" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // Shopify Plus B2B Alternatives 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Best Shopify Plus<br/>
              B2B Alternatives &<br/>
              <span className="text-gray-400">Competitors in 2026.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              Shopify Plus now offers B2B features — but it's still a DTC platform at heart. For industrial distributors and manufacturers where B2B is the core business, purpose-built platforms deliver significantly more value. Here's the definitive comparison for 2026.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Why Switch</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Shopify Plus Users Are Looking for B2B Alternatives</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="section-why-switch">
            {whyShopifyUsersSwitch.map((item, i) => (
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Top 5 Shopify Plus B2B Alternatives Compared</h2>
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
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Shopify Plus</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">BigCommerce B2B</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">WooCommerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Sana Commerce</div>
                  </div>
                  {group.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-6 border-b border-gray-800 last:border-b-0 hover:bg-gray-900/50 transition-colors" data-testid={`row-feature-${gi}-${i}`}>
                      <div className="p-4 font-mono text-sm text-gray-300">{item.feature}</div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.growmax ? <Check className="w-5 h-5 text-growmax-red" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.shopify ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.bigcommerce ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.woocommerce ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.sana ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
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

          <div className="overflow-x-auto">
            <div className="border border-growmax-black min-w-[800px]" data-testid="section-pricing-comparison">
              <div className="grid grid-cols-6 border-b border-growmax-black bg-gray-50">
                <div className="p-4 font-mono text-xs text-gray-500 uppercase"></div>
                <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-growmax-black font-bold">Growmax ARC</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Shopify Plus</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">BigCommerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">WooCommerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Sana Commerce</div>
              </div>
              {pricingComparison.map((row, i) => (
                <div key={i} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0" data-testid={`row-pricing-${i}`}>
                  <div className="p-4 font-mono text-sm text-growmax-black font-bold">{row.label}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-growmax-black font-bold">{row.growmax}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.shopify}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.bigcommerce}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.woocommerce}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.sana}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 font-mono">* Shopify Plus charges 0.15-0.5% transaction fee on orders not processed through Shopify Payments.</p>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Migration Guide</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">How to Migrate from Shopify Plus to Growmax ARC</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-6" data-testid="section-migration-steps">
            {[
              { step: "01", title: "Export Your Data", description: "Export your Shopify product catalog, customer accounts, B2B price lists, and order history via CSV or Shopify API." },
              { step: "02", title: "Map & Import", description: "Our team maps your Shopify data to Growmax ARC — products, customer-specific pricing, inventory, and company accounts." },
              { step: "03", title: "Connect Your Accounting", description: "Set up native Zoho, QuickBooks, or Xero integration. No third-party apps — direct bidirectional sync." },
              { step: "04", title: "Go Live", description: "Deploy field sales apps, launch B2B portal, train your team. Go live in 2-4 weeks — zero transaction fees from day one." },
            ].map((item, i) => (
              <div key={i} className="border border-gray-800 p-6 hover:border-growmax-red transition-colors" data-testid={`card-step-${i}`}>
                <div className="font-mono text-3xl font-bold text-growmax-red mb-4">{item.step}</div>
                <h3 className="font-bold text-lg tracking-tight mb-3 uppercase">{item.title}</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">FAQ</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Frequently Asked Questions</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="space-y-8" data-testid="section-faq">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-200 pb-8" data-testid={`faq-item-${i}`}>
                <h3 className="text-lg font-bold text-growmax-black mb-3">{faq.question}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest text-center">Target Keywords</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" data-testid="text-seo-keywords">
            {[
              "shopify plus b2b alternatives",
              "shopify plus b2b competitors",
              "shopify plus wholesale alternative",
              "shopify b2b limitations",
              "shopify plus b2b review",
              "best B2B ecommerce platform",
              "shopify plus b2b pricing",
              "B2B ordering platform 2026",
            ].map((keyword, i) => (
              <span key={i} className="border border-growmax-black px-3 py-1 font-mono text-xs uppercase tracking-widest text-gray-600 hover:bg-growmax-black hover:text-white transition-colors cursor-default">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 text-center bg-white">
        <div className="container mx-auto px-4">
          <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-6 font-bold">Deploy Now</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter text-growmax-black" data-testid="text-cta-title">
            Ready for real B2B commerce?<br/>Deploy Growmax ARC today.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10">
            Start your 14-day free trial. No transaction fees. No credit card required. Purpose-built B2B commerce in weeks.
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