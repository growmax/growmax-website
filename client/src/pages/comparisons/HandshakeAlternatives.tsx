import { Link } from "wouter";
import { Check, X, ArrowRight, Star, Users, Globe, Smartphone, DollarSign, Package, Zap, Building2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema } from "@/lib/structuredData";

const competitors = [
  {
    name: "Growmax ARC",
    tagline: "Best All-in-One Platform for SMB Distributors",
    highlight: true,
    description: "The all-in-one B2B distributor platform with self-service signup. Inventory management, customer portal, and mobile sales rep app — ready in minutes. Native Zoho, QuickBooks & Xero integration, offline field sales app, and multi-warehouse inventory.",
    pros: [
      "Native Zoho & SAP ERP integration — no middleware",
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
    bestFor: "Industrial distributors, electrical wholesalers, building materials companies, manufacturers with complex pricing",
    rating: "4.8",
  },
  {
    name: "B2B Wave",
    tagline: "QuickBooks-Centric B2B eCommerce",
    highlight: false,
    description: "A wholesale ordering platform built primarily around QuickBooks integration. Good for small wholesalers who want a simple online catalog with QuickBooks sync.",
    pros: [
      "Strong QuickBooks Online integration",
      "Simple setup for basic wholesale catalogs",
      "Customer-specific pricing support",
      "Xero accounting integration",
    ],
    cons: [
      "No mobile app for field sales reps",
      "No offline ordering capability",
      "Limited to single-warehouse inventory",
      "No Zoho or SAP integration",
      "No quote management or CPQ features",
      "No partner portal functionality",
    ],
    pricing: "From $249/mo",
    bestFor: "Small wholesalers using QuickBooks who need a basic online catalog",
    rating: "4.3",
  },
  {
    name: "Pepperi",
    tagline: "Enterprise CPG & FMCG Platform",
    highlight: false,
    description: "Enterprise-grade B2B commerce platform designed for large CPG and FMCG companies. Feature-rich but complex and expensive to implement.",
    pros: [
      "Comprehensive enterprise feature set",
      "Strong mobile DSD capabilities",
      "Route accounting for delivery drivers",
      "Advanced trade promotion management",
    ],
    cons: [
      "Enterprise pricing — $500+/user/mo",
      "6-12 month implementation timeline",
      "Overkill for mid-market distributors",
      "Complex configuration requirements",
      "Heavy professional services dependency",
    ],
    pricing: "Custom (typically $500+/user/mo)",
    bestFor: "Large CPG enterprises with 500+ field reps and complex DSD operations",
    rating: "4.1",
  },
  {
    name: "NowCommerce",
    tagline: "QuickBooks B2B Ordering Add-on",
    highlight: false,
    description: "A lightweight B2B ordering portal that sits on top of QuickBooks. Designed as an add-on rather than a standalone platform.",
    pros: [
      "Deep QuickBooks Desktop integration",
      "Low learning curve for basic ordering",
      "Affordable entry point",
      "Simple customer portal",
    ],
    cons: [
      "Tied entirely to QuickBooks ecosystem",
      "Very limited feature set beyond ordering",
      "No mobile app or field sales tools",
      "No multi-warehouse support",
      "Minimal customization options",
      "No ERP integration beyond QuickBooks",
    ],
    pricing: "From $99/mo",
    bestFor: "Very small wholesalers who only need basic QuickBooks ordering",
    rating: "4.0",
  },
  {
    name: "Sana Commerce",
    tagline: "ERP-Integrated B2B eCommerce",
    highlight: false,
    description: "B2B eCommerce platform that integrates with SAP and Microsoft Dynamics. Strong ERP connectivity but high implementation costs.",
    pros: [
      "Native SAP Business One integration",
      "Microsoft Dynamics 365 connector",
      "Real-time ERP data sync",
      "Self-service customer portal",
    ],
    cons: [
      "High implementation costs ($50K-$200K+)",
      "Requires SAP or Dynamics — no standalone mode",
      "No offline mobile app for field reps",
      "No Zoho ecosystem support",
      "Complex pricing based on order volume",
      "Long implementation cycles (4-8 months)",
    ],
    pricing: "Custom (typically $1,500+/mo + implementation)",
    bestFor: "Mid-to-large enterprises already on SAP Business One or Microsoft Dynamics",
    rating: "4.2",
  },
];

const featureComparison = [
  { category: "Ordering & Commerce", items: [
    { feature: "B2B Customer Self-Service Portal", growmax: true, b2bwave: true, pepperi: true, nowcommerce: true, sana: true },
    { feature: "Offline Mobile Order-Taking App", growmax: true, b2bwave: false, pepperi: true, nowcommerce: false, sana: false },
    { feature: "Field Sales Rep App (iOS/Android)", growmax: true, b2bwave: false, pepperi: true, nowcommerce: false, sana: false },
    { feature: "Customer-Specific Pricing", growmax: true, b2bwave: true, pepperi: true, nowcommerce: true, sana: true },
    { feature: "Multi-Currency Support", growmax: true, b2bwave: true, pepperi: true, nowcommerce: false, sana: true },
    { feature: "Re-Order Automation", growmax: true, b2bwave: false, pepperi: true, nowcommerce: false, sana: true },
    { feature: "Quote-to-Order Workflow", growmax: true, b2bwave: false, pepperi: false, nowcommerce: false, sana: false },
  ]},
  { category: "Inventory & Warehouse", items: [
    { feature: "Real-Time Inventory Sync", growmax: true, b2bwave: true, pepperi: true, nowcommerce: true, sana: true },
    { feature: "Multi-Warehouse Support", growmax: true, b2bwave: false, pepperi: true, nowcommerce: false, sana: true },
    { feature: "Low Stock Threshold Alerts", growmax: true, b2bwave: false, pepperi: true, nowcommerce: false, sana: true },
    { feature: "Inventory Allocation Logic", growmax: true, b2bwave: false, pepperi: true, nowcommerce: false, sana: false },
  ]},
  { category: "Integrations", items: [
    { feature: "Native Zoho Integration", growmax: true, b2bwave: false, pepperi: false, nowcommerce: false, sana: false },
    { feature: "QuickBooks Integration", growmax: true, b2bwave: true, pepperi: false, nowcommerce: true, sana: false },
    { feature: "SAP / ERP Connectivity", growmax: true, b2bwave: false, pepperi: true, nowcommerce: false, sana: true },
    { feature: "API Access", growmax: true, b2bwave: true, pepperi: true, nowcommerce: false, sana: true },
    { feature: "Webhook Support", growmax: true, b2bwave: false, pepperi: true, nowcommerce: false, sana: true },
  ]},
  { category: "Sales & CRM", items: [
    { feature: "Partner Commerce Portal", growmax: true, b2bwave: false, pepperi: false, nowcommerce: false, sana: false },
    { feature: "Opportunity Pipeline Management", growmax: true, b2bwave: false, pepperi: false, nowcommerce: false, sana: false },
    { feature: "Visit Logging & Field Data Capture", growmax: true, b2bwave: false, pepperi: true, nowcommerce: false, sana: false },
    { feature: "Account-Level Price Matrices", growmax: true, b2bwave: false, pepperi: true, nowcommerce: false, sana: true },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "$199/mo", b2bwave: "$249/mo", pepperi: "Custom ($500+/user)", nowcommerce: "$99/mo", sana: "Custom ($1,500+/mo)" },
  { label: "Free Trial", growmax: "14 days", b2bwave: "14 days", pepperi: "No", nowcommerce: "30 days", sana: "No" },
  { label: "Setup Fee", growmax: "$0", b2bwave: "$0", pepperi: "$10K-$50K+", nowcommerce: "$0", sana: "$50K-$200K+" },
  { label: "Mobile App Included", growmax: "Yes", b2bwave: "No", pepperi: "Yes (add-on)", nowcommerce: "No", sana: "No" },
  { label: "Implementation Time", growmax: "2-4 weeks", b2bwave: "1-2 weeks", pepperi: "6-12 months", nowcommerce: "1 week", sana: "4-8 months" },
];

const whyHandshakeUsersSwitch = [
  {
    icon: Globe,
    title: "Handshake Was Acquired & Sunset",
    description: "Handshake was acquired and its B2B ordering platform has been wound down. If you're still on Handshake, you need a migration plan — not a band-aid."
  },
  {
    icon: Smartphone,
    title: "You Need Mobile-First Ordering",
    description: "Handshake's strength was mobile ordering for field reps. Growmax ARC delivers the same mobile-first experience with offline capability, GPS visit logging, and customer-specific pricing — all on iOS and Android."
  },
  {
    icon: Package,
    title: "Your Catalog Is Complex",
    description: "Industrial distributors with 10K-100K+ SKUs, complex pricing tiers, and multi-warehouse inventory need a platform built for that complexity. Not a generic eCommerce tool."
  },
  {
    icon: DollarSign,
    title: "You're Tired of Per-User Pricing",
    description: "Enterprise platforms like Pepperi charge $500+/user/month. Growmax ARC starts at $199/mo with unlimited portal users — your total cost doesn't scale with every new sales rep."
  },
  {
    icon: Building2,
    title: "Your ERP Is the Source of Truth",
    description: "Whether you run Zoho, QuickBooks, or Xero — your B2B platform should sync natively, not through fragile middleware. Growmax ARC connects directly to your accounting system with bidirectional real-time sync."
  },
  {
    icon: ShieldCheck,
    title: "You Need Partner Commerce",
    description: "Handshake had no partner portal. Growmax ARC includes a full customer self-service portal where buyers place orders, track deliveries, and manage their accounts independently."
  },
];

export default function HandshakeAlternatives() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Best Handshake Alternatives & Competitors in 2026 | Growmax"
        description="Compare the best Handshake alternatives for B2B ordering: Growmax ARC, B2B Wave, Pepperi, NowCommerce, and Sana Commerce. Feature comparison, pricing, and pros/cons for SMB distributors."
        path="/comparisons/handshake-alternatives"
        structuredData={webPageSchema({
          title: "Best Handshake Alternatives & Competitors in 2026",
          description: "Comprehensive comparison of Handshake alternatives for B2B wholesale ordering. Compare features, pricing, pros and cons of Growmax ARC, B2B Wave, Pepperi, NowCommerce, and Sana Commerce.",
          path: "/comparisons/handshake-alternatives",
          keywords: [
            "handshake alternatives",
            "handshake competitors",
            "handshake ai alternative",
            "sites like handshake",
            "handshake replacement",
            "B2B ordering platform",
            "wholesale ordering app alternative",
            "handshake app alternative",
            "best B2B commerce platform 2026",
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
                { label: "Handshake Alternatives" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // Handshake Alternatives 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Best Handshake<br/>
              Alternatives &<br/>
              <span className="text-gray-400">Competitors in 2026.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              Handshake's B2B ordering platform has been sunset. Whether you're migrating off Handshake or evaluating alternatives, here's the definitive comparison of the best B2B ordering platforms for wholesale distributors and manufacturers in 2026.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Why Switch</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Handshake Users Are Looking for Alternatives</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="section-why-switch">
            {whyHandshakeUsersSwitch.map((item, i) => (
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Top 5 Handshake Alternatives Compared</h2>
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
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">B2B Wave</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Pepperi</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">NowCommerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Sana Commerce</div>
                  </div>
                  {group.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-6 border-b border-gray-800 last:border-b-0 hover:bg-gray-900/50 transition-colors" data-testid={`row-feature-${gi}-${i}`}>
                      <div className="p-4 font-mono text-sm text-gray-300">{item.feature}</div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.growmax ? <Check className="w-5 h-5 text-growmax-red" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.b2bwave ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.pepperi ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.nowcommerce ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
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
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">B2B Wave</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Pepperi</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">NowCommerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Sana</div>
              </div>
              {pricingComparison.map((row, i) => (
                <div key={i} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0" data-testid={`row-pricing-${i}`}>
                  <div className="p-4 font-mono text-sm text-growmax-black font-bold">{row.label}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-growmax-black font-bold">{row.growmax}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.b2bwave}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.pepperi}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.nowcommerce}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.sana}</div>
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
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Growmax ARC Is the Best Handshake Alternative for SMB Distributors</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-testid="section-why-growmax-wins">
            {[
              {
                number: "01",
                title: "Mobile-First, Like Handshake Was",
                description: "Handshake was loved for its mobile ordering. Growmax ARC delivers the same mobile-first DNA — iOS and Android apps with offline ordering, GPS visit logging, and customer-specific pricing. No connectivity? No problem."
              },
              {
                number: "02",
                title: "Built for Industrial Complexity",
                description: "Unlike generic B2B platforms, Growmax ARC handles large SKU catalogs, multi-tier pricing matrices, volume brackets, and customer-specific discount structures natively."
              },
              {
                number: "03",
                title: "Native ERP Integration",
                description: "Zoho, QuickBooks, Xero — Growmax ARC connects directly to your accounting system with bidirectional real-time sync. No middleware, no Zapier chains, no data lag."
              },
              {
                number: "04",
                title: "Partner Commerce Portal",
                description: "Something Handshake never had: a full customer self-service portal where buyers independently place orders, track deliveries, and manage their accounts."
              },
              {
                number: "05",
                title: "Multi-Warehouse Intelligence",
                description: "Manage inventory across multiple warehouses with intelligent allocation logic. Growmax ARC ensures you never oversell, even when stock is distributed across multiple locations."
              },
              {
                number: "06",
                title: "2-4 Week Go-Live",
                description: "While enterprise alternatives take 6-12 months, Growmax ARC deploys in 2-4 weeks. Self-service signup, import your catalog, connect your accounting system, train your team, go live. Starting at $199/mo."
              },
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">How to Migrate from Handshake to Growmax ARC</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-6" data-testid="section-migration-steps">
            {[
              { step: "01", title: "Export Your Data", description: "Export your Handshake catalog, customer list, pricing, and order history. Our team provides migration templates." },
              { step: "02", title: "Connect Your Accounting", description: "Link Growmax ARC to your Zoho, QuickBooks, or Xero instance. Native connectors handle the heavy lifting — no middleware needed." },
              { step: "03", title: "Configure & Test", description: "Set up customer-specific pricing, multi-warehouse rules, and approval workflows. Our team runs parallel testing with your live data." },
              { step: "04", title: "Go Live", description: "Deploy mobile apps to your field reps, invite customers to the portal, and switch over. Typical go-live: 2-4 weeks from kickoff." },
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

            <Link href="/arc/compare/pepperi">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-compare-pepperi">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Comparison</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">ARC vs Pepperi</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">See how ARC stacks up against Pepperi's enterprise CPG platform — at a fraction of the cost.</p>
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

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Link href="/industries/electrical-distributors">
              <div className="border border-gray-200 p-6 flex items-center justify-between gap-4 hover:border-growmax-black transition-colors cursor-pointer" data-testid="link-industry-electrical">
                <div>
                  <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-1">Industry</div>
                  <p className="text-sm text-gray-700">B2B Commerce for Electrical Distributors — see the industry solution.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-growmax-red shrink-0" />
              </div>
            </Link>
            <Link href="/industries/building-materials">
              <div className="border border-gray-200 p-6 flex items-center justify-between gap-4 hover:border-growmax-black transition-colors cursor-pointer" data-testid="link-industry-building">
                <div>
                  <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-1">Industry</div>
                  <p className="text-sm text-gray-700">B2B Commerce for Building Materials — see the industry solution.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-growmax-red shrink-0" />
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
              "handshake alternatives",
              "handshake competitors",
              "handshake ai alternative",
              "sites like handshake",
              "handshake replacement",
              "best B2B ordering platform",
              "wholesale ordering app",
              "B2B commerce platform 2026",
              "handshake app alternative",
              "B2B ordering software",
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
            Ready to replace Handshake?<br/>Deploy Growmax ARC today.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10">
            Start your 14-day free trial. No credit card required. Migrate your catalog, connect your ERP, and go live in weeks — not months.
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