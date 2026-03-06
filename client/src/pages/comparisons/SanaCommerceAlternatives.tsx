import { Link } from "wouter";
import { Check, X, ArrowRight, Star, Globe, Smartphone, DollarSign, Package, Zap, Building2, ShieldCheck, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema, faqPageSchema } from "@/lib/structuredData";
import SiloVsConnected from "@/components/SiloVsConnected";

const competitors = [
  {
    name: "Growmax Enterprise",
    tagline: "Multi-Party Revenue Ecosystem for Industrial Manufacturers",
    highlight: true,
    description: "The intelligent revenue operations platform that connects your entire ecosystem — sales reps, partners, dealers, and customers — on one platform with full visibility from quote to fulfillment. Native SAP ECC/S4HANA integration, multi-version quote workflows, partner commerce portals, and dealer management — without the $100K+ implementation costs of Sana Commerce.",
    pros: [
      "Multi-party ecosystem: Brand → Sales Reps → Partners → Customers with 100% visibility",
      "Native SAP ECC/S4HANA integration with bidirectional sync",
      "Multi-version quote workflows with approval engine",
      "Partner commerce portal for dealer and channel networks",
      "Offline-capable mobile app for field sales reps",
      "2-4 week implementation — not 4-8 months",
    ],
    cons: [
      "Focused on B2B industrial — not ideal for DTC brands",
      "No native Microsoft Dynamics integration (API available)",
    ],
    pricing: "Custom pricing",
    bestFor: "Industrial manufacturers with 100+ employees, partner/dealer networks, and complex multi-party revenue operations",
    rating: "4.8",
  },
  {
    name: "Sana Commerce",
    tagline: "ERP-Integrated B2B eCommerce",
    highlight: false,
    description: "B2B eCommerce platform that integrates deeply with SAP and Microsoft Dynamics. Strong ERP connectivity but high implementation costs and long deployment timelines.",
    pros: [
      "Deep SAP Business One and S/4HANA integration",
      "Microsoft Dynamics 365 connector",
      "Real-time ERP data sync",
      "Self-service customer portal",
    ],
    cons: [
      "High implementation costs ($50K-$200K+)",
      "Requires SAP or Dynamics — no standalone mode",
      "No offline mobile app for field reps",
      "No multi-party ecosystem support",
      "Complex pricing based on order volume",
      "Long implementation cycles (4-8 months)",
    ],
    pricing: "Custom (typically $1,500+/mo + implementation)",
    bestFor: "Mid-to-large enterprises already on SAP Business One or Microsoft Dynamics",
    rating: "4.2",
  },
  {
    name: "OroCommerce",
    tagline: "Open-Source B2B eCommerce",
    highlight: false,
    description: "Open-source B2B eCommerce platform with flexible architecture. Powerful but requires significant development resources to implement and maintain.",
    pros: [
      "Open-source flexibility and customization",
      "Built-in CRM (OroCRM)",
      "Multi-organization support",
      "Strong workflow automation engine",
    ],
    cons: [
      "Requires dedicated development team",
      "High total cost of ownership for hosting/maintenance",
      "No native mobile app",
      "Steep learning curve",
      "No native ERP connectors included",
    ],
    pricing: "Custom ($2,000+/mo for cloud edition)",
    bestFor: "Large enterprises with in-house development teams wanting full platform control",
    rating: "4.0",
  },
  {
    name: "BigCommerce B2B Edition",
    tagline: "SaaS B2B eCommerce Platform",
    highlight: false,
    description: "Enterprise B2B features built on BigCommerce's SaaS platform. Good for companies wanting a hybrid B2B/DTC approach but limited industrial distribution features.",
    pros: [
      "Modern SaaS platform with good uptime",
      "Headless commerce API available",
      "Strong B2B buyer portal",
      "Good catalog management",
    ],
    cons: [
      "No offline mobile app for field sales",
      "Limited ERP integration depth",
      "No native multi-ERP connector",
      "No multi-warehouse allocation logic",
      "Revenue-based pricing can get expensive",
    ],
    pricing: "Custom (typically $1,000+/mo)",
    bestFor: "Mid-market companies wanting a hybrid B2B/DTC platform with modern web storefront",
    rating: "4.1",
  },
  {
    name: "Shopify Plus B2B",
    tagline: "B2B Features on Shopify Plus",
    highlight: false,
    description: "Shopify Plus now offers B2B features including wholesale channels and customer-specific pricing. However, it's fundamentally a DTC platform with B2B bolted on.",
    pros: [
      "Massive app ecosystem",
      "Easy-to-use admin interface",
      "Strong payment processing",
      "Good storefront themes",
    ],
    cons: [
      "B2B is an add-on to a DTC platform — not purpose-built",
      "No offline ordering capability",
      "No field sales rep tools",
      "Limited complex pricing structures",
      "No native SAP/Epicor integration",
      "Transaction fees on non-Shopify payments",
    ],
    pricing: "From $2,300/mo",
    bestFor: "DTC-first brands adding a wholesale channel — not ideal for pure B2B distributors",
    rating: "4.3",
  },
];

const featureComparison = [
  { category: "Ordering & Commerce", items: [
    { feature: "B2B Customer Self-Service Portal", growmax: true, sana: true, oro: true, bigcommerce: true, shopify: true },
    { feature: "Offline Mobile Order-Taking App", growmax: true, sana: false, oro: false, bigcommerce: false, shopify: false },
    { feature: "Field Sales Rep App (iOS/Android)", growmax: true, sana: false, oro: false, bigcommerce: false, shopify: false },
    { feature: "Customer-Specific Pricing", growmax: true, sana: true, oro: true, bigcommerce: true, shopify: true },
    { feature: "Multi-Currency Support", growmax: true, sana: true, oro: true, bigcommerce: true, shopify: true },
    { feature: "Re-Order Automation", growmax: true, sana: true, oro: false, bigcommerce: false, shopify: false },
    { feature: "Quote-to-Order Workflow", growmax: true, sana: false, oro: true, bigcommerce: false, shopify: false },
  ]},
  { category: "Inventory & Warehouse", items: [
    { feature: "Real-Time Inventory Sync", growmax: true, sana: true, oro: false, bigcommerce: true, shopify: true },
    { feature: "Multi-Warehouse Support", growmax: true, sana: true, oro: true, bigcommerce: false, shopify: false },
    { feature: "Low Stock Threshold Alerts", growmax: true, sana: true, oro: true, bigcommerce: true, shopify: true },
    { feature: "Inventory Allocation Logic", growmax: true, sana: false, oro: false, bigcommerce: false, shopify: false },
  ]},
  { category: "Integrations", items: [
    { feature: "Native SAP ECC/S4HANA Integration", growmax: true, sana: true, oro: false, bigcommerce: false, shopify: false },
    { feature: "SAP Integration", growmax: true, sana: true, oro: false, bigcommerce: false, shopify: false },
    { feature: "Microsoft Dynamics Integration", growmax: false, sana: true, oro: false, bigcommerce: false, shopify: false },
    { feature: "QuickBooks Integration", growmax: true, sana: false, oro: false, bigcommerce: true, shopify: true },
    { feature: "API Access", growmax: true, sana: true, oro: true, bigcommerce: true, shopify: true },
  ]},
  { category: "Sales & CRM", items: [
    { feature: "Partner Commerce Portal", growmax: true, sana: false, oro: false, bigcommerce: false, shopify: false },
    { feature: "Opportunity Pipeline Management", growmax: true, sana: false, oro: true, bigcommerce: false, shopify: false },
    { feature: "Visit Logging & Field Data Capture", growmax: true, sana: false, oro: false, bigcommerce: false, shopify: false },
    { feature: "Account-Level Price Matrices", growmax: true, sana: true, oro: true, bigcommerce: true, shopify: false },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "Custom pricing", sana: "Custom ($1,500+/mo)", oro: "Custom ($2,000+/mo)", bigcommerce: "Custom ($1,000+/mo)", shopify: "$2,300/mo" },
  { label: "Free Trial", growmax: "Request consultation", sana: "No", oro: "No", bigcommerce: "Demo only", shopify: "No" },
  { label: "Setup Fee", growmax: "Custom", sana: "$50K-$200K+", oro: "$30K-$150K+", bigcommerce: "Custom", shopify: "$0" },
  { label: "Mobile App Included", growmax: "Yes", sana: "No", oro: "No", bigcommerce: "No", shopify: "No" },
  { label: "Implementation Time", growmax: "2-4 weeks", sana: "4-8 months", oro: "3-6 months", bigcommerce: "2-4 months", shopify: "1-3 months" },
];

const whySanaUsersSwitch = [
  {
    icon: DollarSign,
    title: "Implementation Costs Are Prohibitive",
    description: "Sana Commerce implementations typically cost $50K-$200K+ before you even go live. Growmax Enterprise deploys in 2-4 weeks with dramatically lower total cost of ownership."
  },
  {
    icon: Smartphone,
    title: "No Mobile App for Field Sales",
    description: "Sana Commerce has no native mobile app for field sales reps. Growmax Enterprise includes iOS and Android apps with offline ordering, GPS visit logging, and customer-specific pricing."
  },
  {
    icon: Server,
    title: "ERP Lock-In Is Risky",
    description: "Sana only works with SAP or Dynamics. If you switch ERPs, you lose your entire commerce platform. Growmax Enterprise connects to SAP ECC/S4HANA, Epicor, and industry-specific ERPs via native integrations."
  },
  {
    icon: Package,
    title: "Slow Time-to-Value",
    description: "4-8 month implementations mean you're paying for a platform you can't use. Growmax Enterprise goes live in weeks, so you start generating ROI immediately."
  },
  {
    icon: Building2,
    title: "No Partner Commerce",
    description: "Sana Commerce has no partner portal. Growmax Enterprise includes a full partner commerce portal where dealers and channel partners independently place orders, manage accounts, and track fulfillment — with full visibility back to the brand."
  },
  {
    icon: Zap,
    title: "Complex Pricing Model",
    description: "Sana's order-volume-based pricing makes costs unpredictable. Growmax Enterprise offers custom pricing tailored to your ecosystem — with unlimited portal users and no per-order fees."
  },
];

const faqs = [
  {
    question: "What is the best alternative to Sana Commerce?",
    answer: "Growmax Enterprise is the best Sana Commerce alternative for industrial manufacturers with 100+ employees. It offers a multi-party revenue ecosystem connecting sales reps, partners, and customers with native SAP ECC/S4HANA integration, multi-version quote workflows, and partner commerce portals — all with 2-4 week implementation."
  },
  {
    question: "How does Growmax Enterprise compare to Sana Commerce pricing?",
    answer: "Growmax Enterprise offers custom pricing tailored to your ecosystem needs with 2-4 week implementation. Sana Commerce typically costs $1,500+/month with $50K-$200K+ implementation fees and 4-8 month timelines. Growmax Enterprise provides deeper multi-party functionality at significantly lower total cost of ownership."
  },
  {
    question: "Can I migrate from Sana Commerce to Growmax Enterprise?",
    answer: "Yes. Growmax Enterprise provides a structured migration path from Sana Commerce. Our team helps export your product catalog, customer-specific pricing, and order history. Most Sana Commerce migrations complete within 2-4 weeks with zero data loss."
  },
  {
    question: "Does Growmax Enterprise integrate with SAP like Sana Commerce?",
    answer: "Yes. Growmax Enterprise offers native SAP ECC/S4HANA integration with bidirectional real-time sync, plus Epicor integration and open connectivity to industry-specific ERPs — so you're never locked into a single ERP vendor."
  },
  {
    question: "Does Growmax Enterprise have a mobile app?",
    answer: "Yes. Growmax Enterprise includes native iOS and Android apps for field sales reps with offline ordering capability, GPS visit logging, customer-specific pricing, and real-time inventory visibility — a feature Sana Commerce does not offer."
  },
  {
    question: "What industries does Growmax Enterprise serve?",
    answer: "Growmax Enterprise is purpose-built for industrial manufacturers with 100+ employees in sectors like electrical equipment, construction equipment, building materials, automotive aftermarket, and spares — companies with partner/dealer networks and complex multi-party revenue operations."
  },
];

export default function SanaCommerceAlternatives() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Best Sana Commerce Alternatives & Competitors in 2026 | Growmax"
        description="Compare the best Sana Commerce alternatives for B2B eCommerce: Growmax, OroCommerce, BigCommerce B2B, and Shopify Plus. Feature comparison, pricing, and migration guide for industrial distributors."
        path="/comparisons/sana-commerce-alternatives"
        structuredData={[
          webPageSchema({
            title: "Best Sana Commerce Alternatives & Competitors in 2026",
            description: "Comprehensive comparison of Sana Commerce alternatives for B2B eCommerce. Compare features, pricing, pros and cons of Growmax, OroCommerce, BigCommerce B2B, and Shopify Plus.",
            path: "/comparisons/sana-commerce-alternatives",
            keywords: [
              "sana commerce alternatives",
              "sana commerce competitors",
              "sana commerce replacement",
              "sana commerce vs growmax",
              "best sana commerce alternative",
              "B2B ecommerce platform",
              "ERP integrated ecommerce",
              "SAP B2B commerce alternative",
            ],
          }),
          faqPageSchema({
            title: "Sana Commerce Alternatives FAQ",
            path: "/comparisons/sana-commerce-alternatives",
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
                { label: "Sana Commerce Alternatives" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // Sana Commerce Alternatives 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Best Sana Commerce<br/>
              Alternatives &<br/>
              <span className="text-gray-400">Competitors in 2026.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              Sana Commerce is powerful but expensive, with lengthy implementations and ERP lock-in. Whether you're evaluating Sana or looking for a faster, more affordable alternative, here's the definitive comparison of B2B eCommerce platforms for industrial distributors in 2026.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Why Switch</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Sana Commerce Users Are Looking for Alternatives</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="section-why-switch">
            {whySanaUsersSwitch.map((item, i) => (
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Top 5 Sana Commerce Alternatives Compared</h2>
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
                    <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-gray-800 font-bold">Growmax Enterprise</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Sana Commerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">OroCommerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">BigCommerce B2B</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Shopify Plus</div>
                  </div>
                  {group.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-6 border-b border-gray-800 last:border-b-0 hover:bg-gray-900/50 transition-colors" data-testid={`row-feature-${gi}-${i}`}>
                      <div className="p-4 font-mono text-sm text-gray-300">{item.feature}</div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.growmax ? <Check className="w-5 h-5 text-growmax-red" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.sana ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.oro ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.bigcommerce ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.shopify ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
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
                <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-growmax-black font-bold">Growmax Enterprise</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Sana Commerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">OroCommerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">BigCommerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Shopify Plus</div>
              </div>
              {pricingComparison.map((row, i) => (
                <div key={i} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0" data-testid={`row-pricing-${i}`}>
                  <div className="p-4 font-mono text-sm text-growmax-black font-bold">{row.label}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-growmax-black font-bold">{row.growmax}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.sana}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.oro}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.bigcommerce}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.shopify}</div>
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
            <h2 className="text-3xl font-bold tracking-tight mb-4">How to Migrate from Sana Commerce to Growmax Enterprise</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6" data-testid="section-migration-steps">
            {[
              { step: "01", title: "Audit Your Setup", description: "We analyze your Sana Commerce configuration — ERP connectors, pricing rules, catalog structure, and customer segments." },
              { step: "02", title: "Export & Map Data", description: "Export your product catalog, customer pricing, and order history. Our migration team maps everything to the Growmax data model." },
              { step: "03", title: "Connect Your ERP", description: "Link Growmax Enterprise directly to your SAP ECC/S4HANA or Epicor instance. Native connectors — no middleware or custom development." },
              { step: "04", title: "Go Live in Weeks", description: "Deploy mobile apps to your field reps, launch the customer portal, and go live. Typical migration: 2-4 weeks from kickoff." },
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
        <div className="container mx-auto px-4 md:px-8">
          <SiloVsConnected competitorName="Sana Commerce" />
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
              "sana commerce alternatives",
              "sana commerce competitors",
              "sana commerce replacement",
              "sana commerce vs growmax",
              "best B2B ecommerce platform",
              "ERP integrated ecommerce",
              "SAP B2B commerce alternative",
              "B2B commerce platform 2026",
              "sana commerce pricing",
              "sana commerce review",
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
            Ready to replace Sana Commerce?<br/>Deploy Growmax Enterprise today.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10">
            Start your 14-day free trial. No credit card required. Go live in weeks — not months — at a fraction of the cost.
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