import { Link } from "wouter";
import { Check, X, ArrowRight, Star, Globe, Smartphone, DollarSign, Package, Zap, Building2, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema } from "@/lib/structuredData";
import SiloVsConnected from "@/components/SiloVsConnected";

const competitors = [
  {
    name: "Growmax Enterprise",
    tagline: "Multi-Party Revenue Ecosystem for Industrial Manufacturers",
    highlight: true,
    description: "The intelligent revenue operations platform that connects your sales reps, partners, dealers, and customers on one platform with full visibility from quote to fulfillment. Native SAP ECC/S4HANA integration, multi-version quote workflows, partner commerce portals, and dealer management. Deploy in weeks, not months.",
    pros: [
      "Multi-party ecosystem: Brand → Sales Reps → Partners → Customers with 100% visibility",
      "Native SAP ECC/S4HANA integration with bidirectional sync",
      "Multi-version quote workflows with approval engine",
      "Partner commerce portal for dealer and channel networks",
      "Offline-capable mobile app for field sales reps",
      "Customer-specific pricing with volume brackets",
      "2-4 week implementation timeline",
    ],
    cons: [
      "Focused on B2B industrial — not ideal for DTC brands",
      "No native Shopify or WooCommerce integration",
    ],
    pricing: "Custom pricing",
    bestFor: "Industrial manufacturers with 100+ employees, electrical equipment companies, building materials manufacturers with partner networks",
    rating: "4.8",
  },
  {
    name: "Sana Commerce",
    tagline: "ERP-Integrated B2B eCommerce",
    highlight: false,
    description: "B2B eCommerce platform that integrates with SAP and Microsoft Dynamics. Strong ERP connectivity but high implementation costs and long deployment cycles.",
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
    tagline: "Open-Source Enterprise B2B Commerce",
    highlight: false,
    description: "Open-source enterprise B2B commerce platform with a built-in CRM. Highly customizable but requires significant development resources for deployment and maintenance.",
    pros: [
      "Open-source with full code access",
      "Built-in CRM functionality",
      "Multi-organization support",
      "Flexible workflow engine",
    ],
    cons: [
      "Requires dedicated development team",
      "6-12 month implementation for most deployments",
      "High total cost of ownership",
      "Self-hosted infrastructure burden",
      "No native mobile app",
      "Limited out-of-the-box ERP connectors",
    ],
    pricing: "Custom ($2,000+/mo + hosting + dev)",
    bestFor: "Large enterprises with in-house development teams who need full customization",
    rating: "4.0",
  },
  {
    name: "BigCommerce B2B Edition",
    tagline: "SaaS B2B Commerce Platform",
    highlight: false,
    description: "BigCommerce's B2B offering adds corporate account management, quote management, and buyer portals on top of their retail commerce engine. Best suited for B2B brands with a DTC component.",
    pros: [
      "Strong SaaS infrastructure and uptime",
      "Good for B2B + DTC hybrid models",
      "Corporate account management",
      "Quote management capabilities",
    ],
    cons: [
      "Originally built for DTC — B2B is bolted on",
      "No native ERP integration (relies on middleware)",
      "No offline field sales capabilities",
      "Limited multi-warehouse support",
      "No SAP/Epicor native connectors",
      "Transaction-based pricing can be expensive at scale",
    ],
    pricing: "Custom (typically $1,000+/mo)",
    bestFor: "Mid-market B2B brands that also sell DTC and need a single platform",
    rating: "4.1",
  },
  {
    name: "Shopify Plus B2B",
    tagline: "DTC Platform with B2B Features",
    highlight: false,
    description: "Shopify Plus has added B2B capabilities including wholesale channels, company accounts, and custom pricing. However, it remains a DTC-first platform with B2B as a secondary channel.",
    pros: [
      "Massive app ecosystem",
      "Easy to use admin interface",
      "Strong payment processing",
      "Good for B2B + DTC hybrid",
    ],
    cons: [
      "DTC-first architecture — B2B is an add-on",
      "No native ERP integration for industrial ERPs",
      "No offline mobile ordering for field reps",
      "Limited complex pricing (no volume brackets)",
      "No multi-warehouse allocation logic",
      "No partner commerce portal",
      "High transaction fees at scale",
    ],
    pricing: "From $2,300/mo",
    bestFor: "DTC brands adding a wholesale channel, not industrial distributors",
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
    { feature: "Quote-to-Order Workflow", growmax: true, sana: false, oro: true, bigcommerce: true, shopify: false },
    { feature: "Re-Order Automation", growmax: true, sana: true, oro: true, bigcommerce: false, shopify: false },
  ]},
  { category: "Inventory & Warehouse", items: [
    { feature: "Real-Time Inventory Sync", growmax: true, sana: true, oro: true, bigcommerce: true, shopify: true },
    { feature: "Multi-Warehouse Support", growmax: true, sana: true, oro: true, bigcommerce: false, shopify: false },
    { feature: "Low Stock Threshold Alerts", growmax: true, sana: true, oro: true, bigcommerce: true, shopify: true },
    { feature: "Inventory Allocation Logic", growmax: true, sana: false, oro: false, bigcommerce: false, shopify: false },
  ]},
  { category: "Integrations", items: [
    { feature: "Native SAP ECC/S4HANA Integration", growmax: true, sana: true, oro: false, bigcommerce: false, shopify: false },
    { feature: "Microsoft Dynamics 365", growmax: false, sana: true, oro: false, bigcommerce: false, shopify: false },
    { feature: "SAP / ERP Connectivity", growmax: true, sana: true, oro: false, bigcommerce: false, shopify: false },
    { feature: "API Access", growmax: true, sana: true, oro: true, bigcommerce: true, shopify: true },
    { feature: "Webhook Support", growmax: true, sana: true, oro: true, bigcommerce: true, shopify: true },
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
  { label: "Free Trial", growmax: "Request consultation", sana: "No", oro: "No", bigcommerce: "No", shopify: "No" },
  { label: "Setup Fee", growmax: "Custom", sana: "$50K-$200K+", oro: "$30K-$150K+", bigcommerce: "$5K-$25K", shopify: "$0" },
  { label: "Mobile App Included", growmax: "Yes", sana: "No", oro: "No", bigcommerce: "No", shopify: "No" },
  { label: "Implementation Time", growmax: "2-4 weeks", sana: "4-8 months", oro: "6-12 months", bigcommerce: "2-4 months", shopify: "1-3 months" },
];

const whyDynamicsUsersSwitch = [
  {
    icon: Clock,
    title: "12-Month Implementations Are Unacceptable",
    description: "Dynamics 365 Commerce implementations often take 6-12 months and cost $100K+. Growmax Enterprise deploys in 2-4 weeks — your team is taking orders before the Dynamics project even kicks off."
  },
  {
    icon: Smartphone,
    title: "Your Field Reps Need Mobile Ordering",
    description: "Dynamics 365 Commerce has no offline-capable mobile app for field sales reps. Growmax Enterprise puts a native iOS/Android app in their hands with offline ordering, GPS visit logging, and customer-specific pricing."
  },
  {
    icon: DollarSign,
    title: "TCO Is Spiraling Out of Control",
    description: "Between licensing, implementation, customization, and ongoing Microsoft partner fees, Dynamics 365 Commerce TCO often exceeds $200K/year. Growmax Enterprise delivers more multi-party revenue operations functionality at dramatically lower cost."
  },
  {
    icon: Package,
    title: "Industrial Pricing Is Too Complex for Dynamics",
    description: "Volume brackets, customer-specific price lists, multi-version quotes, and real-time margin calculations are core to Growmax Enterprise — not bolt-on modules that require expensive customization."
  },
  {
    icon: Building2,
    title: "You Need a Distributor Platform, Not an ERP Add-On",
    description: "Dynamics 365 Commerce is a module within the Dynamics ecosystem. Growmax Enterprise is purpose-built for manufacturers with partner networks — with multi-party visibility, partner portals, and multi-version quote workflows baked in."
  },
  {
    icon: ShieldCheck,
    title: "Partner Channel Management Is Missing",
    description: "Dynamics 365 Commerce has no partner commerce portal. Growmax Enterprise includes a full channel partner portal where dealers and resellers place orders, track shipments, and manage their accounts — with full visibility back to the brand."
  },
];

const faqs = [
  {
    question: "How does Growmax Enterprise compare to Dynamics 365 Commerce for B2B?",
    answer: "Growmax Enterprise is purpose-built for industrial manufacturers with multi-party ecosystems, while Dynamics 365 Commerce is a module within Microsoft's broader ERP ecosystem. Growmax Enterprise offers faster deployment (2-4 weeks vs 6-12 months), dramatically lower TCO, offline mobile ordering, multi-version quote workflows, and native partner commerce — features that require expensive customization in Dynamics."
  },
  {
    question: "Can Growmax Enterprise integrate with Microsoft Dynamics 365?",
    answer: "Yes, Growmax Enterprise offers API connectivity to Dynamics 365 and other ERPs. While Growmax Enterprise specializes in native SAP ECC/S4HANA and Epicor integration, it provides a more complete multi-party revenue experience with features like multi-version quote workflows, partner portals, and full ecosystem visibility that Dynamics Commerce lacks."
  },
  {
    question: "What's the total cost of ownership compared to Dynamics 365 Commerce?",
    answer: "Dynamics 365 Commerce typically costs $50K-$200K+ for implementation, $1,500+/mo in licensing, plus ongoing Microsoft partner support fees. Growmax Enterprise offers custom pricing with dramatically lower TCO and 2-4 week deployment — delivering 70-80% lower total cost for most industrial manufacturers."
  },
  {
    question: "Is Growmax Enterprise suitable for enterprises currently on Dynamics 365?",
    answer: "Absolutely. Many manufacturers find that Dynamics 365 Commerce is overly complex for their multi-party revenue needs. Growmax Enterprise can run alongside your existing ERP, handling the revenue operations layer — connecting sales reps, partners, and customers — while your ERP manages financials and operations."
  },
  {
    question: "How long does migration from Dynamics 365 Commerce take?",
    answer: "Most Dynamics 365 Commerce to Growmax Enterprise migrations complete in 4-6 weeks. Our implementation team handles catalog import, customer account migration, pricing setup, and SAP/Epicor integration. Your team can run both platforms in parallel during the transition."
  },
];

export default function Dynamics365Alternatives() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Best Dynamics 365 Commerce Alternatives & Competitors in 2026 | Growmax"
        description="Compare the best Dynamics 365 Commerce alternatives for B2B ordering: Growmax, Sana Commerce, OroCommerce, BigCommerce B2B, and Shopify Plus. Feature comparison, pricing, and migration guide."
        path="/comparisons/dynamics-365-commerce-alternatives"
        structuredData={webPageSchema({
          title: "Best Dynamics 365 Commerce Alternatives & Competitors in 2026",
          description: "Comprehensive comparison of Dynamics 365 Commerce alternatives for B2B wholesale ordering. Compare features, pricing, pros and cons of top platforms for industrial distributors.",
          path: "/comparisons/dynamics-365-commerce-alternatives",
          keywords: [
            "dynamics 365 commerce alternatives",
            "dynamics 365 commerce competitors",
            "microsoft dynamics b2b commerce alternative",
            "dynamics 365 replacement",
            "B2B commerce platform",
            "dynamics 365 commerce vs growmax",
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
                { label: "Dynamics 365 Commerce Alternatives" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // Dynamics 365 Commerce Alternatives 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Best Dynamics 365<br/>
              Commerce Alternatives &<br/>
              <span className="text-gray-400">Competitors in 2026.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              Dynamics 365 Commerce is powerful but expensive and complex. If you're an industrial distributor looking for a faster, more affordable B2B commerce platform, here's the definitive comparison of the best alternatives in 2026.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Why Switch</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Distributors Are Moving Away from Dynamics 365 Commerce</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="section-why-switch">
            {whyDynamicsUsersSwitch.map((item, i) => (
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Top 5 Dynamics 365 Commerce Alternatives Compared</h2>
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
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">BigCommerce</div>
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
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Sana</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Oro</div>
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

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Migration Guide</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Migrating from Dynamics 365 Commerce to Growmax Enterprise</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Audit & Plan", description: "We analyze your current Dynamics 365 Commerce setup, catalog structure, pricing rules, and integration points to create a migration roadmap." },
              { step: "02", title: "Data Migration", description: "Product catalogs, customer accounts, pricing matrices, and order history are migrated to Growmax Enterprise with full data integrity verification." },
              { step: "03", title: "Integration Setup", description: "Connect Growmax Enterprise to your ERP (SAP ECC/S4HANA, Epicor) with bidirectional sync. Configure webhooks and API integrations." },
              { step: "04", title: "Go Live & Support", description: "Launch with parallel running if needed. Dedicated support team ensures smooth transition with zero downtime for your customers." },
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

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <SiloVsConnected competitorName="Dynamics 365 Commerce" />
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
            Move beyond Dynamics 365 Commerce.<br/>Deploy Growmax Enterprise today.
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