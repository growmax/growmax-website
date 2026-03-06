import { Link } from "wouter";
import { Check, X, ArrowRight, Star, Globe, Smartphone, DollarSign, Package, Zap, Building2, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema, faqPageSchema } from "@/lib/structuredData";

const competitors = [
  {
    name: "Growmax",
    tagline: "Best for Industrial Distributors & Manufacturers",
    highlight: true,
    description: "The connected B2B revenue platform purpose-built for industrial distributors. Native ERP integration, offline field sales app, multi-warehouse inventory, and partner commerce — designed for businesses where B2B is the core business, not an afterthought.",
    pros: [
      "Purpose-built for B2B — not a DTC platform with B2B bolted on",
      "Offline-capable mobile app for field sales reps",
      "Native Zoho & SAP ERP integration",
      "Multi-warehouse inventory with intelligent allocation",
      "Partner commerce portal for channel sales",
      "Quote-to-order workflow with approval engine",
    ],
    cons: [
      "No DTC storefront — pure B2B focus",
      "Smaller app marketplace than BigCommerce",
    ],
    pricing: "From $199/mo",
    bestFor: "Industrial distributors, wholesalers, and manufacturers where B2B is the primary business model",
    rating: "4.8",
  },
  {
    name: "BigCommerce B2B Edition",
    tagline: "SaaS B2B eCommerce Platform",
    highlight: false,
    description: "Enterprise B2B features built on BigCommerce's SaaS platform. Strong for hybrid B2B/DTC but lacks depth in industrial distribution features like offline ordering and field sales tools.",
    pros: [
      "Modern SaaS platform with strong uptime",
      "Headless commerce API (Stencil & Next.js)",
      "Good B2B buyer portal with company accounts",
      "Shared catalogs and price lists",
    ],
    cons: [
      "Revenue-based pricing — costs scale with sales volume",
      "No offline mobile app for field sales reps",
      "Limited native ERP integration depth",
      "No multi-warehouse allocation logic",
      "No partner commerce portal",
      "No quote-to-order workflow",
    ],
    pricing: "Custom (typically $1,000-$3,000+/mo)",
    bestFor: "Mid-market companies wanting hybrid B2B/DTC with modern headless commerce architecture",
    rating: "4.2",
  },
  {
    name: "Shopify Plus B2B",
    tagline: "B2B Features on Shopify Plus",
    highlight: false,
    description: "Shopify Plus now offers B2B wholesale features including company profiles and custom pricing. But it's fundamentally a DTC platform — B2B is secondary.",
    pros: [
      "Massive app ecosystem (8,000+ apps)",
      "Easy-to-use admin interface",
      "Strong payment processing",
      "Excellent storefront themes",
    ],
    cons: [
      "B2B is bolted onto a DTC platform",
      "No offline ordering capability",
      "No field sales rep tools",
      "Transaction fees on non-Shopify Payments",
      "Limited complex pricing (no volume brackets)",
      "No native SAP/Zoho integration",
    ],
    pricing: "From $2,300/mo",
    bestFor: "DTC-first brands adding a wholesale channel — not for pure B2B distributors",
    rating: "4.3",
  },
  {
    name: "OroCommerce",
    tagline: "Open-Source B2B eCommerce",
    highlight: false,
    description: "Open-source B2B platform with built-in CRM. Maximum flexibility but requires PHP development team and significant infrastructure investment.",
    pros: [
      "Open-source flexibility",
      "Built-in CRM (OroCRM)",
      "Multi-organization support",
      "Workflow automation engine",
    ],
    cons: [
      "Requires dedicated PHP development team",
      "High TCO for hosting and maintenance",
      "No native mobile app",
      "6-12 month implementation timeline",
      "No native ERP connectors",
    ],
    pricing: "Custom ($2,000+/mo for cloud)",
    bestFor: "Large enterprises with in-house development teams wanting full platform control",
    rating: "4.0",
  },
  {
    name: "Adobe Commerce (Magento)",
    tagline: "Enterprise eCommerce Platform",
    highlight: false,
    description: "Enterprise-grade eCommerce with B2B module. Extremely powerful and customizable but very expensive and requires specialized Magento development expertise.",
    pros: [
      "Massive extension marketplace",
      "Highly customizable architecture",
      "Strong multi-store capabilities",
      "Advanced catalog management with attributes",
    ],
    cons: [
      "Very high total cost of ownership ($100K+/year)",
      "Requires specialized Magento/PHP developers",
      "Complex infrastructure and hosting requirements",
      "No native mobile app for field sales",
      "Frequent security patches needed",
    ],
    pricing: "Custom ($40K-$200K+/year)",
    bestFor: "Large enterprises with complex multi-brand requirements and large development budgets",
    rating: "4.0",
  },
];

const featureComparison = [
  { category: "Ordering & Commerce", items: [
    { feature: "B2B Customer Self-Service Portal", growmax: true, bigcommerce: true, shopify: true, oro: true, magento: true },
    { feature: "Offline Mobile Order-Taking App", growmax: true, bigcommerce: false, shopify: false, oro: false, magento: false },
    { feature: "Field Sales Rep App (iOS/Android)", growmax: true, bigcommerce: false, shopify: false, oro: false, magento: false },
    { feature: "Customer-Specific Pricing", growmax: true, bigcommerce: true, shopify: true, oro: true, magento: true },
    { feature: "Volume Bracket Pricing", growmax: true, bigcommerce: false, shopify: false, oro: true, magento: true },
    { feature: "Quote-to-Order Workflow", growmax: true, bigcommerce: false, shopify: false, oro: true, magento: false },
    { feature: "Re-Order Automation", growmax: true, bigcommerce: false, shopify: false, oro: false, magento: false },
  ]},
  { category: "Inventory & Warehouse", items: [
    { feature: "Real-Time Inventory Sync", growmax: true, bigcommerce: true, shopify: true, oro: false, magento: true },
    { feature: "Multi-Warehouse Support", growmax: true, bigcommerce: false, shopify: false, oro: true, magento: true },
    { feature: "Inventory Allocation Logic", growmax: true, bigcommerce: false, shopify: false, oro: false, magento: false },
    { feature: "Low Stock Alerts", growmax: true, bigcommerce: true, shopify: true, oro: true, magento: true },
  ]},
  { category: "Integrations", items: [
    { feature: "Native Zoho Integration", growmax: true, bigcommerce: false, shopify: false, oro: false, magento: false },
    { feature: "SAP / ERP Connectivity", growmax: true, bigcommerce: false, shopify: false, oro: false, magento: false },
    { feature: "QuickBooks Integration", growmax: true, bigcommerce: true, shopify: true, oro: false, magento: true },
    { feature: "API Access", growmax: true, bigcommerce: true, shopify: true, oro: true, magento: true },
    { feature: "Headless Commerce API", growmax: false, bigcommerce: true, shopify: true, oro: true, magento: true },
  ]},
  { category: "Sales & CRM", items: [
    { feature: "Partner Commerce Portal", growmax: true, bigcommerce: false, shopify: false, oro: false, magento: false },
    { feature: "Company Accounts & Roles", growmax: true, bigcommerce: true, shopify: true, oro: true, magento: true },
    { feature: "Visit Logging & Field Data", growmax: true, bigcommerce: false, shopify: false, oro: false, magento: false },
    { feature: "Account-Level Price Matrices", growmax: true, bigcommerce: true, shopify: false, oro: true, magento: true },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "$199/mo", bigcommerce: "Custom ($1K+/mo)", shopify: "$2,300/mo", oro: "Custom ($2K+/mo)", magento: "$40K+/year" },
  { label: "Revenue-Based Pricing", growmax: "No", bigcommerce: "Yes", shopify: "No", oro: "No", magento: "Yes" },
  { label: "Free Trial", growmax: "14 days", bigcommerce: "Demo only", shopify: "No", oro: "No", magento: "No" },
  { label: "Setup Fee", growmax: "$0", bigcommerce: "Custom", shopify: "$0", oro: "$50K+", magento: "$100K+" },
  { label: "Mobile App Included", growmax: "Yes", bigcommerce: "No", shopify: "No", oro: "No", magento: "No" },
  { label: "Implementation Time", growmax: "2-4 weeks", bigcommerce: "2-4 months", shopify: "1-3 months", oro: "6-12 months", magento: "6-12 months" },
];

const whyBigCommerceUsersSwitch = [
  {
    icon: Building2,
    title: "B2B Is an Afterthought",
    description: "BigCommerce was built for DTC. Its B2B features are additions to a retail-first architecture. When B2B is your core business, you need a platform built for B2B from day one."
  },
  {
    icon: Smartphone,
    title: "No Mobile App for Field Sales",
    description: "BigCommerce has no native mobile app for field sales reps. Growmax includes iOS and Android apps with offline ordering, customer-specific pricing, and GPS visit logging."
  },
  {
    icon: TrendingUp,
    title: "Revenue-Based Pricing Hurts Growth",
    description: "BigCommerce charges based on your revenue. As your B2B sales grow, so does your platform cost. Growmax offers flat pricing — your success doesn't come with a penalty."
  },
  {
    icon: Package,
    title: "No Multi-Warehouse Intelligence",
    description: "BigCommerce doesn't support multi-warehouse allocation logic. Industrial distributors with multiple warehouses need intelligent inventory routing — Growmax delivers it natively."
  },
  {
    icon: Globe,
    title: "Limited ERP Integration",
    description: "BigCommerce relies on third-party apps for ERP integration. Growmax connects natively to Zoho, SAP, and QuickBooks — no middleware, no sync delays."
  },
  {
    icon: ShieldCheck,
    title: "No Partner Commerce Portal",
    description: "BigCommerce has no partner portal for channel sales. Growmax includes a full partner commerce portal where channel partners place orders and manage accounts independently."
  },
];

const faqs = [
  {
    question: "What is the best alternative to BigCommerce B2B?",
    answer: "Growmax is the best BigCommerce B2B alternative for industrial distributors and manufacturers. Unlike BigCommerce (a DTC platform with B2B features added), Growmax is purpose-built for B2B with native ERP integration, offline mobile ordering, multi-warehouse inventory, and partner commerce."
  },
  {
    question: "How does Growmax compare to BigCommerce B2B pricing?",
    answer: "Growmax starts at $199/month with flat pricing — no revenue-based fees. BigCommerce B2B typically costs $1,000-$3,000+/month and charges based on your annual revenue. As your B2B sales grow, BigCommerce gets more expensive while Growmax stays predictable."
  },
  {
    question: "Can I migrate from BigCommerce to Growmax?",
    answer: "Yes. Growmax provides a structured migration path from BigCommerce. We help export your product catalog, customer accounts, and pricing data. Most BigCommerce migrations complete within 2-4 weeks."
  },
  {
    question: "Does Growmax support headless commerce like BigCommerce?",
    answer: "Growmax focuses on providing a complete B2B commerce experience out of the box, including customer portal, mobile app, and ERP integration. For custom frontend needs, Growmax offers a comprehensive API. However, if headless DTC storefront is your primary need, BigCommerce may be more suitable."
  },
  {
    question: "Is BigCommerce or Growmax better for wholesale distribution?",
    answer: "Growmax is significantly better for wholesale distribution. It includes offline field sales apps, multi-warehouse inventory allocation, quote-to-order workflows, partner commerce portals, and native ERP integration — none of which BigCommerce B2B offers natively."
  },
  {
    question: "Does Growmax support DTC and B2B together?",
    answer: "Growmax is focused exclusively on B2B commerce. If you need a hybrid B2B/DTC platform, BigCommerce or Shopify Plus may be better options. But if B2B is your core business, Growmax delivers significantly more depth and value."
  },
];

export default function BigCommerceB2BAlternatives() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Best BigCommerce B2B Alternatives & Competitors in 2026 | Growmax"
        description="Compare the best BigCommerce B2B alternatives for wholesale distributors: Growmax, Shopify Plus, OroCommerce, and Adobe Commerce. Feature comparison, pricing, and migration guide."
        path="/comparisons/bigcommerce-b2b-alternatives"
        structuredData={[
          webPageSchema({
            title: "Best BigCommerce B2B Alternatives & Competitors in 2026",
            description: "Comprehensive comparison of BigCommerce B2B alternatives for wholesale distributors and manufacturers.",
            path: "/comparisons/bigcommerce-b2b-alternatives",
            keywords: [
              "bigcommerce b2b alternatives",
              "bigcommerce b2b competitors",
              "bigcommerce b2b replacement",
              "bigcommerce b2b vs growmax",
              "best bigcommerce b2b alternative",
              "B2B ecommerce platform",
              "wholesale ecommerce platform",
              "bigcommerce b2b edition review",
            ],
          }),
          faqPageSchema({
            title: "BigCommerce B2B Alternatives FAQ",
            path: "/comparisons/bigcommerce-b2b-alternatives",
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
                { label: "BigCommerce B2B Alternatives" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // BigCommerce B2B Alternatives 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Best BigCommerce<br/>
              B2B Alternatives &<br/>
              <span className="text-gray-400">Competitors in 2026.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              BigCommerce B2B Edition adds wholesale features to a retail-first platform. If B2B is your core business — not a secondary channel — here's why purpose-built B2B platforms deliver more value for industrial distributors and manufacturers.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Why Switch</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why BigCommerce B2B Users Are Looking for Alternatives</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="section-why-switch">
            {whyBigCommerceUsersSwitch.map((item, i) => (
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Top 5 BigCommerce B2B Alternatives Compared</h2>
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
                    <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-gray-800 font-bold">Growmax</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">BigCommerce B2B</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Shopify Plus</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">OroCommerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Adobe Commerce</div>
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
                        {item.magento ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
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
                <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-growmax-black font-bold">Growmax</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">BigCommerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Shopify Plus</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">OroCommerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Adobe Commerce</div>
              </div>
              {pricingComparison.map((row, i) => (
                <div key={i} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0" data-testid={`row-pricing-${i}`}>
                  <div className="p-4 font-mono text-sm text-growmax-black font-bold">{row.label}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-growmax-black font-bold">{row.growmax}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.bigcommerce}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.shopify}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.oro}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.magento}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Migration Guide</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">How to Migrate from BigCommerce B2B to Growmax</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-6" data-testid="section-migration-steps">
            {[
              { step: "01", title: "Export Your Data", description: "Export your BigCommerce product catalog, customer accounts, price lists, and order history via CSV or API." },
              { step: "02", title: "Map & Import", description: "Our team maps your BigCommerce data to Growmax — products, pricing tiers, customer segments, and inventory." },
              { step: "03", title: "Connect Your ERP", description: "Link Growmax to your Zoho, SAP, or QuickBooks instance with native connectors. No middleware needed." },
              { step: "04", title: "Go Live", description: "Deploy mobile apps, launch customer portal, train your team. Typical migration: 2-4 weeks from kickoff." },
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
              "bigcommerce b2b alternatives",
              "bigcommerce b2b competitors",
              "bigcommerce b2b edition review",
              "bigcommerce b2b vs growmax",
              "best B2B ecommerce platform",
              "wholesale ecommerce platform",
              "B2B ordering platform 2026",
              "bigcommerce b2b pricing",
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
            Ready for purpose-built B2B?<br/>Deploy Growmax today.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10">
            Start your 14-day free trial. No credit card required. No revenue-based pricing. Go live in weeks — not months.
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