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
    description: "The intelligent revenue operations platform that connects your sales reps, partners, dealers, and customers on one platform with full visibility from quote to fulfillment. Native SAP ECC/S4HANA integration, multi-version quote workflows, partner commerce portals, and dealer management. Deploy in weeks, not quarters.",
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
    name: "OroCommerce",
    tagline: "Open-Source Enterprise B2B Commerce",
    highlight: false,
    description: "Open-source enterprise B2B commerce platform with a built-in CRM. Highly customizable but requires significant development resources for deployment and maintenance.",
    pros: [
      "Open-source with full code access",
      "Built-in CRM functionality (OroCRM)",
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
    name: "Sana Commerce",
    tagline: "ERP-Integrated B2B eCommerce",
    highlight: false,
    description: "B2B eCommerce platform built around SAP and Microsoft Dynamics integration. Strong ERP connectivity but locked into those ecosystems with high implementation costs.",
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
    name: "BigCommerce B2B Edition",
    tagline: "SaaS B2B Commerce Platform",
    highlight: false,
    description: "BigCommerce's B2B offering adds corporate account management, quote management, and buyer portals. Good for hybrid B2B/DTC models but limited for complex industrial distribution.",
    pros: [
      "Strong SaaS infrastructure and uptime",
      "Good for B2B + DTC hybrid models",
      "Corporate account management",
      "Extensive app marketplace",
    ],
    cons: [
      "Originally built for DTC — B2B is bolted on",
      "No native ERP integration for SAP/Epicor",
      "No offline field sales capabilities",
      "Limited multi-warehouse support",
      "Transaction-based pricing at scale",
      "No partner commerce portal",
    ],
    pricing: "Custom (typically $1,000+/mo)",
    bestFor: "Mid-market B2B brands that also sell DTC and need a single platform",
    rating: "4.1",
  },
  {
    name: "Magento / Adobe Commerce",
    tagline: "Enterprise Open-Source Commerce",
    highlight: false,
    description: "Adobe Commerce (formerly Magento) is a powerful open-source commerce platform. Feature-rich but complex, expensive, and requires significant development investment.",
    pros: [
      "Highly customizable open-source platform",
      "Large developer community",
      "Strong B2B module with shared catalogs",
      "Multi-store capabilities",
    ],
    cons: [
      "Extremely high TCO ($100K+/year)",
      "Requires dedicated development team",
      "6-12 month implementation timeline",
      "Performance issues without optimization",
      "No native mobile app for field reps",
      "Complex upgrade path between versions",
    ],
    pricing: "Custom ($40K-$200K+/year)",
    bestFor: "Large enterprises with dedicated development teams and complex multi-store requirements",
    rating: "4.0",
  },
];

const featureComparison = [
  { category: "Ordering & Commerce", items: [
    { feature: "B2B Customer Self-Service Portal", growmax: true, oro: true, sana: true, bigcommerce: true, magento: true },
    { feature: "Offline Mobile Order-Taking App", growmax: true, oro: false, sana: false, bigcommerce: false, magento: false },
    { feature: "Field Sales Rep App (iOS/Android)", growmax: true, oro: false, sana: false, bigcommerce: false, magento: false },
    { feature: "Customer-Specific Pricing", growmax: true, oro: true, sana: true, bigcommerce: true, magento: true },
    { feature: "Multi-Currency Support", growmax: true, oro: true, sana: true, bigcommerce: true, magento: true },
    { feature: "Quote-to-Order Workflow", growmax: true, oro: true, sana: false, bigcommerce: true, magento: true },
    { feature: "Re-Order Automation", growmax: true, oro: true, sana: true, bigcommerce: false, magento: false },
  ]},
  { category: "Inventory & Warehouse", items: [
    { feature: "Real-Time Inventory Sync", growmax: true, oro: true, sana: true, bigcommerce: true, magento: true },
    { feature: "Multi-Warehouse Support", growmax: true, oro: true, sana: true, bigcommerce: false, magento: true },
    { feature: "Low Stock Threshold Alerts", growmax: true, oro: true, sana: true, bigcommerce: true, magento: true },
    { feature: "Inventory Allocation Logic", growmax: true, oro: false, sana: false, bigcommerce: false, magento: false },
  ]},
  { category: "Integrations", items: [
    { feature: "Native SAP ECC/S4HANA Integration", growmax: true, oro: false, sana: true, bigcommerce: false, magento: false },
    { feature: "Salesforce CRM Integration", growmax: false, oro: true, sana: false, bigcommerce: false, magento: false },
    { feature: "SAP / ERP Connectivity", growmax: true, oro: false, sana: true, bigcommerce: false, magento: false },
    { feature: "API Access", growmax: true, oro: true, sana: true, bigcommerce: true, magento: true },
    { feature: "Webhook Support", growmax: true, oro: true, sana: true, bigcommerce: true, magento: true },
  ]},
  { category: "Sales & CRM", items: [
    { feature: "Partner Commerce Portal", growmax: true, oro: false, sana: false, bigcommerce: false, magento: false },
    { feature: "Opportunity Pipeline Management", growmax: true, oro: true, sana: false, bigcommerce: false, magento: false },
    { feature: "Visit Logging & Field Data Capture", growmax: true, oro: false, sana: false, bigcommerce: false, magento: false },
    { feature: "Account-Level Price Matrices", growmax: true, oro: true, sana: true, bigcommerce: true, magento: true },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "Custom pricing", oro: "Custom ($2,000+/mo)", sana: "Custom ($1,500+/mo)", bigcommerce: "Custom ($1,000+/mo)", magento: "Custom ($40K+/yr)" },
  { label: "Free Trial", growmax: "Request consultation", oro: "No", sana: "No", bigcommerce: "No", magento: "No" },
  { label: "Setup Fee", growmax: "Custom", oro: "$30K-$150K+", sana: "$50K-$200K+", bigcommerce: "$5K-$25K", magento: "$50K-$300K+" },
  { label: "Mobile App Included", growmax: "Yes", oro: "No", sana: "No", bigcommerce: "No", magento: "No" },
  { label: "Implementation Time", growmax: "2-4 weeks", oro: "6-12 months", sana: "4-8 months", bigcommerce: "2-4 months", magento: "6-12 months" },
];

const whySalesforceUsersSwitch = [
  {
    icon: DollarSign,
    title: "Salesforce Commerce Cloud Is Prohibitively Expensive",
    description: "Salesforce Commerce Cloud licensing starts at $150K+/year with implementation costs often exceeding $500K. Growmax Enterprise delivers purpose-built multi-party revenue operations at a fraction of the cost with custom pricing tailored to your ecosystem."
  },
  {
    icon: Clock,
    title: "Implementation Takes 12-18 Months",
    description: "Salesforce Commerce Cloud projects routinely take 12-18 months to go live. Growmax Enterprise deploys in 2-4 weeks. Your team is processing B2B orders before the Salesforce project completes its discovery phase."
  },
  {
    icon: Smartphone,
    title: "No Offline Mobile App for Field Sales",
    description: "Salesforce Commerce Cloud doesn't include an offline-capable mobile ordering app for field reps. Growmax Enterprise provides native iOS/Android apps with offline order creation, GPS visit logging, and customer-specific pricing."
  },
  {
    icon: Package,
    title: "Built for Retail, Not Distribution",
    description: "Salesforce Commerce Cloud was designed for B2C retail. Its B2B capabilities require extensive customization. Growmax Enterprise was purpose-built for industrial manufacturers with multi-party ecosystems — connecting sales reps, partners, and customers."
  },
  {
    icon: Building2,
    title: "You Don't Need the Full Salesforce Stack",
    description: "Salesforce Commerce Cloud works best when you're all-in on the Salesforce ecosystem. If you run SAP or Epicor, Growmax Enterprise integrates natively without forcing an ecosystem migration."
  },
  {
    icon: ShieldCheck,
    title: "Partner Commerce Requires Separate Licensing",
    description: "In Salesforce, partner and channel management requires additional clouds and licensing. Growmax Enterprise includes a full partner commerce portal — dealers and channel partners place orders, track deliveries, and manage accounts with full visibility back to the brand."
  },
];

const faqs = [
  {
    question: "How does Growmax Enterprise compare to Salesforce Commerce Cloud for B2B?",
    answer: "Growmax Enterprise is purpose-built for B2B industrial manufacturers with multi-party ecosystems, while Salesforce Commerce Cloud is primarily a retail commerce platform with B2B capabilities added. Growmax Enterprise offers faster deployment (2-4 weeks vs 12-18 months), dramatically lower TCO, offline mobile ordering, and native partner commerce — features that require extensive customization in Salesforce."
  },
  {
    question: "Can I keep using Salesforce CRM while switching to Growmax Enterprise?",
    answer: "Yes. Growmax Enterprise doesn't require you to abandon your CRM. It can connect to Salesforce CRM via API for bidirectional data sync of contacts, accounts, and opportunities while providing its own multi-party ecosystem management."
  },
  {
    question: "What's the real cost difference between Salesforce Commerce and Growmax Enterprise?",
    answer: "Salesforce Commerce Cloud typically costs $150K-$500K+ per year including licensing, implementation, and ongoing partner support. Growmax Enterprise offers custom pricing with dramatically lower total cost of ownership and 2-4 week deployment. Over 3 years, Growmax Enterprise can save you $300K-$1M+ compared to Salesforce Commerce Cloud."
  },
  {
    question: "Is Growmax Enterprise truly enterprise-grade?",
    answer: "Absolutely. Growmax Enterprise serves industrial manufacturers with 100+ employees, connecting their sales reps, partners, dealers, and customers in one ecosystem. It handles 10K-100K+ SKUs, complex multi-version quote workflows, partner commerce, and SAP/Epicor integration — without enterprise-scale complexity or cost."
  },
  {
    question: "How long does migration from Salesforce Commerce Cloud take?",
    answer: "Most Salesforce Commerce Cloud to Growmax Enterprise migrations complete in 4-8 weeks. Our implementation team handles catalog migration, customer data transfer, pricing rule configuration, and SAP/Epicor integration. Parallel running is available during the transition period."
  },
];

export default function SalesforceCommerceAlternatives() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Best Salesforce Commerce Cloud Alternatives & Competitors in 2026 | Growmax"
        description="Compare the best Salesforce Commerce Cloud alternatives for B2B ordering: Growmax, OroCommerce, Sana Commerce, BigCommerce B2B, and Magento. Feature comparison, pricing, and migration guide."
        path="/comparisons/salesforce-commerce-alternatives"
        structuredData={webPageSchema({
          title: "Best Salesforce Commerce Cloud Alternatives & Competitors in 2026",
          description: "Comprehensive comparison of Salesforce Commerce Cloud alternatives for B2B wholesale ordering. Compare features, pricing, pros and cons of top platforms for industrial distributors.",
          path: "/comparisons/salesforce-commerce-alternatives",
          keywords: [
            "salesforce commerce cloud alternatives",
            "salesforce commerce competitors",
            "salesforce b2b commerce alternative",
            "salesforce commerce replacement",
            "B2B commerce platform",
            "salesforce commerce cloud vs growmax",
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
                { label: "Salesforce Commerce Alternatives" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // Salesforce Commerce Alternatives 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Best Salesforce Commerce<br/>
              Alternatives &<br/>
              <span className="text-gray-400">Competitors in 2026.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              Salesforce Commerce Cloud is powerful but comes with enterprise pricing and complexity that mid-market distributors don't need. Here's the definitive comparison of the best B2B commerce alternatives for wholesale distributors and manufacturers in 2026.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Why Switch</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Distributors Are Looking Beyond Salesforce Commerce</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="section-why-switch">
            {whySalesforceUsersSwitch.map((item, i) => (
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Top 5 Salesforce Commerce Alternatives Compared</h2>
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
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">OroCommerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Sana Commerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">BigCommerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Magento</div>
                  </div>
                  {group.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-6 border-b border-gray-800 last:border-b-0 hover:bg-gray-900/50 transition-colors" data-testid={`row-feature-${gi}-${i}`}>
                      <div className="p-4 font-mono text-sm text-gray-300">{item.feature}</div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.growmax ? <Check className="w-5 h-5 text-growmax-red" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.oro ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.sana ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.bigcommerce ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
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

          <div className="md:hidden font-mono text-xs text-gray-500 mb-2">Scroll to compare →</div>
          <div className="overflow-x-auto">
            <div className="border border-growmax-black min-w-[800px]" data-testid="section-pricing-comparison">
              <div className="grid grid-cols-6 border-b border-growmax-black bg-gray-50">
                <div className="p-4 font-mono text-xs text-gray-500 uppercase"></div>
                <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-growmax-black font-bold">Growmax Enterprise</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Oro</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Sana</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">BigCommerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Magento</div>
              </div>
              {pricingComparison.map((row, i) => (
                <div key={i} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0" data-testid={`row-pricing-${i}`}>
                  <div className="p-4 font-mono text-sm text-growmax-black font-bold">{row.label}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-growmax-black font-bold">{row.growmax}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.oro}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.sana}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.bigcommerce}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.magento}</div>
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Migrating from Salesforce Commerce Cloud to Growmax Enterprise</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery & Audit", description: "We analyze your current Salesforce Commerce setup, catalog structure, pricing rules, customer segments, and integration points to build a complete migration plan." },
              { step: "02", title: "Data Migration", description: "Product catalogs, customer accounts, pricing matrices, order history, and custom fields are migrated to Growmax Enterprise with full data validation and integrity checks." },
              { step: "03", title: "Integration Config", description: "Connect Growmax Enterprise to your ERP (SAP ECC/S4HANA, Epicor) with bidirectional sync. Set up API connections to your existing CRM if needed." },
              { step: "04", title: "Launch & Optimize", description: "Go live with parallel running available. Dedicated success team ensures smooth transition, user training, and ongoing optimization support." },
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
          <SiloVsConnected competitorName="Salesforce Commerce Cloud" />
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
            Move beyond Salesforce Commerce.<br/>Deploy Growmax Enterprise today.
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