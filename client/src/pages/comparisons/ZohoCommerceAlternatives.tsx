import { Link } from "wouter";
import { Check, X, ArrowRight, Star, Users, Globe, Smartphone, DollarSign, Package, Zap, Building2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema } from "@/lib/structuredData";
import SiloVsConnected from "@/components/SiloVsConnected";

const competitors = [
  {
    name: "Growmax ARC",
    tagline: "Best All-in-One Platform for SMB Distributors",
    highlight: true,
    description: "The all-in-one B2B distributor platform with self-service signup. Native Zoho integration with bidirectional real-time sync, plus QuickBooks and Xero support. Inventory management, customer portal, mobile sales rep app, and multi-warehouse inventory — ready in minutes.",
    pros: [
      "Native Zoho CRM, Books & Inventory integration — no middleware",
      "Offline-capable mobile app for field sales reps",
      "Multi-warehouse inventory with intelligent allocation",
      "Partner commerce portal for channel sales",
      "Quote-to-order workflow with approval engine",
      "Customer-specific pricing with volume brackets",
    ],
    cons: [
      "Focused on B2B industrial — not ideal for DTC brands",
      "No native Shopify or WooCommerce integration",
    ],
    pricing: "From $199/mo",
    bestFor: "Industrial distributors, electrical wholesalers, building materials companies using the Zoho ecosystem",
    rating: "4.8",
  },
  {
    name: "Zoho Commerce",
    tagline: "Zoho's Native eCommerce Builder",
    highlight: false,
    description: "Zoho's own eCommerce platform for building online stores. Tightly integrated with Zoho ecosystem but designed primarily for B2C retail, not B2B distribution.",
    pros: [
      "Native Zoho ecosystem integration",
      "Easy storefront builder with templates",
      "Built-in SEO and marketing tools",
      "Zoho One bundle pricing available",
    ],
    cons: [
      "Designed for B2C retail, not B2B distribution",
      "No offline mobile ordering for field reps",
      "Limited B2B pricing (no volume brackets or SPAs)",
      "No multi-warehouse inventory management",
      "No partner commerce portal",
      "No quote-to-order workflow",
    ],
    pricing: "From $25/mo (Starter)",
    bestFor: "Small B2C retailers already in the Zoho ecosystem who need a simple online store",
    rating: "3.9",
  },
  {
    name: "Shopify Plus",
    tagline: "Enterprise eCommerce Platform",
    highlight: false,
    description: "The enterprise tier of Shopify, offering B2B wholesale channel capabilities. Strong for DTC brands adding wholesale, but not purpose-built for industrial distribution.",
    pros: [
      "Massive app ecosystem",
      "Excellent DTC storefront capabilities",
      "B2B wholesale channel add-on",
      "Strong payment processing options",
    ],
    cons: [
      "Enterprise pricing from $2,000+/mo",
      "B2B features are add-ons, not native",
      "No field sales app or offline ordering",
      "No native Zoho integration",
      "No multi-warehouse allocation logic",
      "Transaction fees on third-party payments",
    ],
    pricing: "From $2,000/mo",
    bestFor: "DTC brands adding a wholesale channel, not distribution-first companies",
    rating: "4.4",
  },
  {
    name: "BigCommerce B2B",
    tagline: "B2B eCommerce Add-On",
    highlight: false,
    description: "BigCommerce's B2B edition adds wholesale features to their core eCommerce platform. Good for companies that need both B2C and B2B storefronts.",
    pros: [
      "Strong B2C + B2B hybrid capability",
      "Customer group pricing",
      "No transaction fees",
      "Good API and headless commerce options",
    ],
    cons: [
      "B2B features are bolt-on, not native",
      "No offline field sales app",
      "No native Zoho integration",
      "No multi-warehouse inventory logic",
      "No partner portal functionality",
      "Complex pricing tiers",
    ],
    pricing: "From $399/mo (B2B edition)",
    bestFor: "Mid-market companies running both B2C and B2B storefronts",
    rating: "4.2",
  },
  {
    name: "OroCommerce",
    tagline: "Open-Source B2B Commerce",
    highlight: false,
    description: "Open-source B2B eCommerce platform with a built-in CRM. Powerful but complex, requiring significant development resources for implementation.",
    pros: [
      "Open-source flexibility",
      "Built-in CRM (OroCRM)",
      "Multi-organization support",
      "Advanced workflow engine",
    ],
    cons: [
      "Requires dedicated development team",
      "6-12 month implementation timeline",
      "High total cost of ownership ($50K+)",
      "No Zoho ecosystem integration",
      "No mobile field sales app",
      "Steep learning curve",
    ],
    pricing: "Free (Community) / Custom (Enterprise)",
    bestFor: "Large enterprises with in-house dev teams who want full source code control",
    rating: "4.0",
  },
];

const featureComparison = [
  { category: "Ordering & Commerce", items: [
    { feature: "B2B Customer Self-Service Portal", growmax: true, zoho: true, shopify: true, bigcommerce: true, oro: true },
    { feature: "Offline Mobile Order-Taking App", growmax: true, zoho: false, shopify: false, bigcommerce: false, oro: false },
    { feature: "Field Sales Rep App (iOS/Android)", growmax: true, zoho: false, shopify: false, bigcommerce: false, oro: false },
    { feature: "Customer-Specific Pricing", growmax: true, zoho: false, shopify: true, bigcommerce: true, oro: true },
    { feature: "Multi-Currency Support", growmax: true, zoho: true, shopify: true, bigcommerce: true, oro: true },
    { feature: "Re-Order Automation", growmax: true, zoho: false, shopify: false, bigcommerce: false, oro: true },
    { feature: "Quote-to-Order Workflow", growmax: true, zoho: false, shopify: false, bigcommerce: false, oro: true },
  ]},
  { category: "Inventory & Warehouse", items: [
    { feature: "Real-Time Inventory Sync", growmax: true, zoho: true, shopify: true, bigcommerce: true, oro: false },
    { feature: "Multi-Warehouse Support", growmax: true, zoho: false, shopify: true, bigcommerce: false, oro: true },
    { feature: "Low Stock Threshold Alerts", growmax: true, zoho: true, shopify: true, bigcommerce: true, oro: false },
    { feature: "Inventory Allocation Logic", growmax: true, zoho: false, shopify: false, bigcommerce: false, oro: false },
  ]},
  { category: "Zoho Ecosystem", items: [
    { feature: "Native Zoho CRM Integration", growmax: true, zoho: true, shopify: false, bigcommerce: false, oro: false },
    { feature: "Zoho Books Sync", growmax: true, zoho: true, shopify: false, bigcommerce: false, oro: false },
    { feature: "Zoho Inventory Sync", growmax: true, zoho: true, shopify: false, bigcommerce: false, oro: false },
    { feature: "Bidirectional Real-Time Sync", growmax: true, zoho: true, shopify: false, bigcommerce: false, oro: false },
    { feature: "SAP / ERP Connectivity", growmax: true, zoho: false, shopify: false, bigcommerce: false, oro: true },
    { feature: "QuickBooks Integration", growmax: true, zoho: false, shopify: true, bigcommerce: true, oro: false },
  ]},
  { category: "Sales & CRM", items: [
    { feature: "Partner Commerce Portal", growmax: true, zoho: false, shopify: false, bigcommerce: false, oro: false },
    { feature: "Opportunity Pipeline Management", growmax: true, zoho: false, shopify: false, bigcommerce: false, oro: true },
    { feature: "Visit Logging & Field Data Capture", growmax: true, zoho: false, shopify: false, bigcommerce: false, oro: false },
    { feature: "Account-Level Price Matrices", growmax: true, zoho: false, shopify: true, bigcommerce: true, oro: true },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "$199/mo", zoho: "$25/mo", shopify: "$2,000/mo", bigcommerce: "$399/mo", oro: "Free / Custom" },
  { label: "Free Trial", growmax: "14 days", zoho: "15 days", shopify: "3 days", bigcommerce: "15 days", oro: "Community edition" },
  { label: "Setup Fee", growmax: "$0", zoho: "$0", shopify: "$0", bigcommerce: "$0", oro: "$50K–$200K+" },
  { label: "Mobile App Included", growmax: "Yes", zoho: "No", shopify: "No", bigcommerce: "No", oro: "No" },
  { label: "Implementation Time", growmax: "2-4 weeks", zoho: "1-2 weeks", shopify: "2-4 weeks", bigcommerce: "4-8 weeks", oro: "6-12 months" },
];

const whyZohoUsersSwitch = [
  {
    icon: Building2,
    title: "Zoho Commerce Isn't Built for B2B",
    description: "Zoho Commerce is a B2C storefront builder. It lacks customer-specific pricing, volume brackets, quote workflows, and multi-warehouse inventory that B2B distributors need."
  },
  {
    icon: Smartphone,
    title: "You Need Mobile Field Sales",
    description: "Your field reps need an offline-capable mobile app to take orders at customer sites. Zoho Commerce has no field sales app — Growmax ARC does, with GPS visit logging and customer-specific pricing."
  },
  {
    icon: Package,
    title: "Your Catalog Is Complex",
    description: "Industrial distributors with 10K-100K+ SKUs, complex pricing tiers, and multi-warehouse inventory need a platform built for that complexity, not a B2C storefront."
  },
  {
    icon: Globe,
    title: "You Want to Stay in Zoho",
    description: "You love the Zoho ecosystem. Growmax ARC gives you everything Zoho Commerce can't — B2B commerce, field sales, customer portals — while maintaining native bidirectional Zoho sync."
  },
  {
    icon: DollarSign,
    title: "You Need Partner Commerce",
    description: "Your customers need their own portal to place orders, track deliveries, and manage accounts. Zoho Commerce has no B2B portal. Growmax ARC includes one out of the box."
  },
  {
    icon: ShieldCheck,
    title: "You Need Quote Management",
    description: "B2B sales require quote-to-order workflows with approval chains, revision tracking, and automatic conversion. Zoho Commerce doesn't support this. Growmax ARC does natively."
  },
];

export default function ZohoCommerceAlternatives() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Best Zoho Commerce Alternatives for B2B in 2026 | Growmax"
        description="Compare the best Zoho Commerce alternatives for B2B distribution: Growmax ARC, Shopify Plus, BigCommerce B2B, and OroCommerce. Feature comparison, pricing, and pros/cons for Zoho ecosystem users."
        path="/comparisons/zoho-commerce-alternatives"
        structuredData={webPageSchema({
          title: "Best Zoho Commerce Alternatives for B2B in 2026",
          description: "Comprehensive comparison of Zoho Commerce alternatives for B2B wholesale ordering. Compare features, pricing, pros and cons of Growmax ARC, Shopify Plus, BigCommerce B2B, and OroCommerce.",
          path: "/comparisons/zoho-commerce-alternatives",
          keywords: [
            "zoho commerce alternatives",
            "zoho commerce competitors",
            "zoho commerce B2B",
            "zoho ecommerce alternative",
            "B2B ecommerce for Zoho users",
            "zoho commerce replacement",
            "best Zoho B2B commerce platform",
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
                { label: "Zoho Commerce Alternatives" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // Zoho Commerce Alternatives 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Best Zoho Commerce<br/>
              Alternatives for<br/>
              <span className="text-gray-400">B2B Distribution.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              Zoho Commerce is great for B2C storefronts, but it wasn't built for B2B distribution. If you're a Zoho ecosystem user who needs B2B commerce with field sales apps, partner portals, and complex pricing — here are the best alternatives in 2026.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Why Switch</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Zoho Users Need a B2B Commerce Alternative</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="section-why-switch">
            {whyZohoUsersSwitch.map((item, i) => (
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Top 5 Zoho Commerce Alternatives Compared</h2>
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
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Zoho Commerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Shopify Plus</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">BigCommerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">OroCommerce</div>
                  </div>
                  {group.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-6 border-b border-gray-800 last:border-b-0 hover:bg-gray-900/50 transition-colors" data-testid={`row-feature-${gi}-${i}`}>
                      <div className="p-4 font-mono text-sm text-gray-300">{item.feature}</div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.growmax ? <Check className="w-5 h-5 text-growmax-red" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.zoho ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.shopify ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.bigcommerce ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.oro ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
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
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Zoho Commerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Shopify Plus</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">BigCommerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Oro</div>
              </div>
              {pricingComparison.map((row, i) => (
                <div key={i} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0" data-testid={`row-pricing-${i}`}>
                  <div className="p-4 font-mono text-sm text-growmax-black font-bold">{row.label}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-growmax-black font-bold">{row.growmax}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.zoho}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.shopify}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.bigcommerce}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.oro}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Verdict</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Growmax ARC Is the Best Zoho Commerce Alternative for B2B</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-testid="section-why-growmax-wins">
            {[
              { number: "01", title: "Stay in the Zoho Ecosystem", description: "Growmax ARC offers native bidirectional sync with Zoho CRM, Books, and Inventory. You get purpose-built B2B commerce without leaving the ecosystem you already know and love." },
              { number: "02", title: "Built for B2B, Not B2C", description: "Unlike Zoho Commerce (built for retail storefronts), Growmax ARC handles customer-specific pricing, volume brackets, quote-to-order workflows, and multi-warehouse inventory natively." },
              { number: "03", title: "Mobile Field Sales App", description: "Growmax ARC includes iOS and Android apps with offline ordering, GPS visit logging, and customer-specific pricing. No other Zoho-compatible platform offers this." },
              { number: "04", title: "Customer Self-Service Portal", description: "Give customers their own portal to place orders, track deliveries, and manage accounts independently. Zoho Commerce has no B2B customer portal functionality." },
              { number: "05", title: "Multi-Warehouse Intelligence", description: "Manage inventory across multiple warehouses with intelligent allocation logic. Ensure you never oversell, even when stock is distributed across multiple locations." },
              { number: "06", title: "2-4 Week Go-Live", description: "Deploy Growmax ARC in weeks, not months. Self-service signup, import your catalog, connect your Zoho instance, train your team, and go live — starting at $199/mo." },
            ].map((item, i) => (
              <div key={i} className="border border-gray-800 p-8 hover:border-growmax-red transition-colors group" data-testid={`card-advantage-${i}`}>
                <div className="font-mono text-xs text-growmax-red mb-4 uppercase">{item.number}</div>
                <h3 className="text-xl font-bold mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Migration Guide</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">How to Switch from Zoho Commerce to Growmax ARC</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6" data-testid="section-migration-steps">
            {[
              { step: "01", title: "Export Your Data", description: "Export your Zoho Commerce catalog, customer list, and order history. Growmax ARC provides migration templates and import tools." },
              { step: "02", title: "Connect Zoho CRM", description: "Link Growmax ARC to your Zoho CRM, Books, and Inventory. Native connectors handle bidirectional sync automatically." },
              { step: "03", title: "Configure B2B Features", description: "Set up customer-specific pricing, multi-warehouse rules, partner portals, and quote workflows that Zoho Commerce couldn't support." },
              { step: "04", title: "Go Live", description: "Deploy mobile apps to your field reps, invite customers to the portal, and launch. Typical go-live: 2-4 weeks from kickoff." },
            ].map((item, i) => (
              <div key={i} className="border-2 border-growmax-black p-6 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300" data-testid={`card-step-${i}`}>
                <div className="font-mono text-3xl font-bold text-growmax-red mb-4">{item.step}</div>
                <h3 className="font-bold text-lg tracking-tight mb-3 text-growmax-black uppercase">{item.title}</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Related Architecture</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Explore More</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-testid="section-related-links">
            <Link href="/arc/compare/b2b-wave">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-compare-b2bwave">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Comparison</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">ARC vs B2B Wave</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Feature-by-feature comparison of Growmax ARC and B2B Wave for wholesale distributors.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Read Comparison <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/comparisons/handshake-alternatives">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-handshake-alternatives">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Alternatives</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Handshake Alternatives</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Compare the best Handshake alternatives for B2B wholesale ordering platforms.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Read Comparison <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/arc">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-arc-platform">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Product</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Growmax ARC Platform</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">The connected distributor platform — ordering portal, field sales app, and real-time inventory.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Explore ARC <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest text-center">Target Keywords</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" data-testid="text-seo-keywords">
            {[
              "zoho commerce alternatives",
              "zoho commerce competitors",
              "zoho ecommerce B2B",
              "zoho commerce replacement",
              "B2B commerce for Zoho",
              "zoho commerce vs growmax",
              "best B2B platform for Zoho users",
              "zoho wholesale ordering",
            ].map((keyword, i) => (
              <span key={i} className="border border-growmax-black px-3 py-1 font-mono text-xs uppercase tracking-widest text-gray-600 hover:bg-growmax-black hover:text-white transition-colors cursor-default">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <SiloVsConnected competitorName="Zoho Commerce" />
        </div>
      </section>

      <section className="py-32 text-center bg-white">
        <div className="container mx-auto px-4">
          <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-6 font-bold">Deploy Now</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter text-growmax-black" data-testid="text-cta-title">
            B2B Commerce that<br/>loves your Zoho stack.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10">
            Start your 14-day free trial. No credit card required. Native Zoho integration, field sales apps, and partner portals — deployed in weeks.
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