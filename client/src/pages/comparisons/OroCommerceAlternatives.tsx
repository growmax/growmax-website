import { Link } from "wouter";
import { Check, X, ArrowRight, Star, Globe, Smartphone, DollarSign, Package, Zap, Building2, ShieldCheck, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema, faqPageSchema } from "@/lib/structuredData";

const competitors = [
  {
    name: "Growmax Enterprise",
    tagline: "Multi-Party Revenue Ecosystem for Industrial Manufacturers",
    highlight: true,
    description: "The intelligent revenue operations platform that connects your sales reps, partners, dealers, and customers on one platform with full visibility. Deploy in weeks — not months — with native SAP ECC/S4HANA integration, multi-version quote workflows, and partner commerce portals. No development team required.",
    pros: [
      "Multi-party ecosystem: Brand → Sales Reps → Partners → Customers with 100% visibility",
      "Native SAP ECC/S4HANA & Epicor integration — no middleware",
      "Multi-version quote workflows with approval engine",
      "Partner commerce portal for dealer and channel networks",
      "Offline-capable mobile app for field sales reps",
      "No development team required — SaaS deployment",
    ],
    cons: [
      "Focused on B2B industrial — not ideal for DTC brands",
      "Less customizable than open-source solutions",
    ],
    pricing: "Custom pricing",
    bestFor: "Industrial manufacturers with 100+ employees who want multi-party revenue operations without hiring a development team",
    rating: "4.8",
  },
  {
    name: "OroCommerce",
    tagline: "Open-Source B2B eCommerce Platform",
    highlight: false,
    description: "Open-source B2B eCommerce platform with built-in CRM. Highly customizable but requires significant development resources and infrastructure management.",
    pros: [
      "Open-source flexibility and full code access",
      "Built-in CRM (OroCRM)",
      "Multi-organization and multi-website support",
      "Strong workflow automation engine",
    ],
    cons: [
      "Requires dedicated development team (PHP/Symfony)",
      "High total cost of ownership for hosting and maintenance",
      "No native mobile app for field sales",
      "6-12 month typical implementation timeline",
      "No native ERP connectors — custom development needed",
      "Infrastructure management burden",
    ],
    pricing: "Custom ($2,000+/mo for cloud edition)",
    bestFor: "Large enterprises with in-house PHP development teams wanting full platform control",
    rating: "4.0",
  },
  {
    name: "Sana Commerce",
    tagline: "ERP-Integrated B2B eCommerce",
    highlight: false,
    description: "B2B eCommerce platform tightly integrated with SAP and Microsoft Dynamics. Strong ERP connectivity but locked to specific ERP ecosystems.",
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
      "No native SAP/Epicor integration",
      "4-8 month implementation",
    ],
    pricing: "Custom (typically $1,500+/mo)",
    bestFor: "Enterprises committed to SAP or Microsoft Dynamics ERP",
    rating: "4.2",
  },
  {
    name: "Adobe Commerce (Magento)",
    tagline: "Enterprise eCommerce Platform",
    highlight: false,
    description: "The enterprise version of Magento with B2B features. Extremely powerful but complex, expensive, and requires significant development expertise.",
    pros: [
      "Massive extension marketplace",
      "Highly customizable architecture",
      "Strong multi-store capabilities",
      "Advanced catalog management",
    ],
    cons: [
      "Very high total cost of ownership",
      "Requires specialized Magento developers",
      "Complex infrastructure requirements",
      "No native mobile app for field sales",
      "Security patches and upgrades are burdensome",
    ],
    pricing: "Custom ($40K-$200K+/year)",
    bestFor: "Large enterprises with complex multi-brand, multi-store requirements and big development budgets",
    rating: "4.0",
  },
  {
    name: "Salesforce Commerce Cloud B2B",
    tagline: "Enterprise B2B Commerce on Salesforce",
    highlight: false,
    description: "B2B commerce solution built on the Salesforce platform. Deep CRM integration but extremely expensive and complex to implement.",
    pros: [
      "Native Salesforce CRM integration",
      "Strong account management features",
      "Einstein AI recommendations",
      "Large partner ecosystem",
    ],
    cons: [
      "Extremely expensive ($300K+/year typical)",
      "12-18 month implementations common",
      "Heavy dependency on SI partners",
      "No offline mobile ordering",
      "Complex licensing structure",
    ],
    pricing: "Custom ($300K+/year)",
    bestFor: "Large Salesforce-centric enterprises with deep pockets and long implementation timelines",
    rating: "3.9",
  },
];

const featureComparison = [
  { category: "Ordering & Commerce", items: [
    { feature: "B2B Customer Self-Service Portal", growmax: true, oro: true, sana: true, magento: true, salesforce: true },
    { feature: "Offline Mobile Order-Taking App", growmax: true, oro: false, sana: false, magento: false, salesforce: false },
    { feature: "Field Sales Rep App (iOS/Android)", growmax: true, oro: false, sana: false, magento: false, salesforce: false },
    { feature: "Customer-Specific Pricing", growmax: true, oro: true, sana: true, magento: true, salesforce: true },
    { feature: "Multi-Currency Support", growmax: true, oro: true, sana: true, magento: true, salesforce: true },
    { feature: "Quote-to-Order Workflow", growmax: true, oro: true, sana: false, magento: false, salesforce: true },
    { feature: "Re-Order Automation", growmax: true, oro: false, sana: true, magento: false, salesforce: false },
  ]},
  { category: "Inventory & Warehouse", items: [
    { feature: "Real-Time Inventory Sync", growmax: true, oro: false, sana: true, magento: true, salesforce: false },
    { feature: "Multi-Warehouse Support", growmax: true, oro: true, sana: true, magento: true, salesforce: false },
    { feature: "Low Stock Threshold Alerts", growmax: true, oro: true, sana: true, magento: true, salesforce: false },
    { feature: "Inventory Allocation Logic", growmax: true, oro: false, sana: false, magento: false, salesforce: false },
  ]},
  { category: "Integrations", items: [
    { feature: "Native SAP ECC/S4HANA Integration", growmax: true, oro: false, sana: true, magento: false, salesforce: false },
    { feature: "SAP / ERP Connectivity", growmax: true, oro: false, sana: true, magento: false, salesforce: false },
    { feature: "QuickBooks Integration", growmax: true, oro: false, sana: false, magento: true, salesforce: false },
    { feature: "API Access", growmax: true, oro: true, sana: true, magento: true, salesforce: true },
    { feature: "No-Code ERP Connectors", growmax: true, oro: false, sana: true, magento: false, salesforce: false },
  ]},
  { category: "Sales & CRM", items: [
    { feature: "Partner Commerce Portal", growmax: true, oro: false, sana: false, magento: false, salesforce: false },
    { feature: "Built-in CRM", growmax: false, oro: true, sana: false, magento: false, salesforce: true },
    { feature: "Visit Logging & Field Data Capture", growmax: true, oro: false, sana: false, magento: false, salesforce: false },
    { feature: "Account-Level Price Matrices", growmax: true, oro: true, sana: true, magento: true, salesforce: true },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "Custom pricing", oro: "Custom ($2K+/mo)", sana: "Custom ($1.5K+/mo)", magento: "$40K+/year", salesforce: "$300K+/year" },
  { label: "Free Trial", growmax: "Request consultation", oro: "No", sana: "No", magento: "No", salesforce: "No" },
  { label: "Setup Fee", growmax: "Custom", oro: "$50K-$200K+", sana: "$50K-$200K+", magento: "$100K-$500K+", salesforce: "$200K-$1M+" },
  { label: "Dev Team Required", growmax: "No", oro: "Yes (PHP)", sana: "No", magento: "Yes", salesforce: "Yes" },
  { label: "Implementation Time", growmax: "2-4 weeks", oro: "6-12 months", sana: "4-8 months", magento: "6-12 months", salesforce: "12-18 months" },
];

const whyOroUsersSwitch = [
  {
    icon: Code,
    title: "Development Costs Are Unsustainable",
    description: "OroCommerce requires PHP/Symfony developers for implementation, customization, and ongoing maintenance. Growmax Enterprise is SaaS — no development team needed for multi-party revenue operations."
  },
  {
    icon: DollarSign,
    title: "Total Cost of Ownership Is Too High",
    description: "Between hosting, development, security patches, and upgrades, OroCommerce's TCO often exceeds $200K/year. Growmax Enterprise offers custom pricing with dramatically lower total cost of ownership."
  },
  {
    icon: Smartphone,
    title: "No Mobile App for Field Sales",
    description: "OroCommerce has no native mobile app. Growmax Enterprise includes iOS and Android apps with offline ordering, GPS visit logging, and real-time inventory."
  },
  {
    icon: Globe,
    title: "Implementation Takes Too Long",
    description: "OroCommerce implementations typically take 6-12 months. Growmax Enterprise goes live in 2-4 weeks with your existing catalog and SAP/Epicor connections."
  },
  {
    icon: Building2,
    title: "No Native ERP Connectors",
    description: "OroCommerce requires custom development for ERP integration. Growmax Enterprise offers native SAP ECC/S4HANA and Epicor connectors out of the box, plus open connectivity to industry-specific ERPs."
  },
  {
    icon: ShieldCheck,
    title: "Infrastructure Management Burden",
    description: "Self-hosted OroCommerce means managing servers, security, backups, and scaling. Growmax Enterprise is fully managed SaaS — we handle the infrastructure so you can focus on revenue operations."
  },
];

const faqs = [
  {
    question: "What is the best alternative to OroCommerce?",
    answer: "Growmax Enterprise is the best OroCommerce alternative for industrial manufacturers with 100+ employees who want multi-party revenue operations without hiring a development team. It offers native SAP/Epicor integration, multi-version quote workflows, partner commerce portals, and dealer management — all as a managed SaaS with 2-4 week deployment."
  },
  {
    question: "How does Growmax Enterprise compare to OroCommerce pricing?",
    answer: "Growmax Enterprise offers custom pricing tailored to your ecosystem needs. OroCommerce's cloud edition starts at $2,000+/month, with implementation costs of $50K-$200K+ and ongoing development costs. Growmax Enterprise's total cost of ownership is typically 80% lower than OroCommerce."
  },
  {
    question: "Can I migrate from OroCommerce to Growmax Enterprise?",
    answer: "Yes. Growmax Enterprise provides migration support for OroCommerce users. We help export your product catalog, customer pricing, and configuration. Most migrations complete within 2-4 weeks."
  },
  {
    question: "Do I need developers to use Growmax Enterprise?",
    answer: "No. Unlike OroCommerce, Growmax Enterprise is a fully managed SaaS platform. Configuration, SAP/Epicor integration, partner portal setup, and quote workflows are all done through the admin interface — no coding required."
  },
  {
    question: "Does Growmax Enterprise have CRM capabilities like OroCRM?",
    answer: "Growmax Enterprise includes built-in opportunity pipeline management, visit logging, and field data capture as part of its multi-party ecosystem. It also integrates with your existing CRM via API for a seamless experience across your revenue operations."
  },
  {
    question: "Is Growmax Enterprise suitable for multi-organization setups?",
    answer: "Yes. Growmax Enterprise supports multi-party ecosystems with partner commerce portals, dealer management, multi-warehouse operations, and account-level pricing matrices. For manufacturers with partner/dealer networks, Growmax Enterprise provides the structure without the development overhead of OroCommerce."
  },
];

export default function OroCommerceAlternatives() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Best OroCommerce Alternatives & Competitors in 2026 | Growmax"
        description="Compare the best OroCommerce alternatives for B2B eCommerce: Growmax, Sana Commerce, Adobe Commerce (Magento), and Salesforce Commerce. Feature comparison, pricing, and migration guide."
        path="/comparisons/orocommerce-alternatives"
        structuredData={[
          webPageSchema({
            title: "Best OroCommerce Alternatives & Competitors in 2026",
            description: "Comprehensive comparison of OroCommerce alternatives for B2B eCommerce. Compare features, pricing, pros and cons for industrial distributors.",
            path: "/comparisons/orocommerce-alternatives",
            keywords: [
              "orocommerce alternatives",
              "orocommerce competitors",
              "orocommerce replacement",
              "orocommerce vs growmax",
              "best orocommerce alternative",
              "open source B2B ecommerce",
              "B2B ecommerce platform",
              "orocommerce review",
            ],
          }),
          faqPageSchema({
            title: "OroCommerce Alternatives FAQ",
            path: "/comparisons/orocommerce-alternatives",
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
                { label: "OroCommerce Alternatives" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // OroCommerce Alternatives 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Best OroCommerce<br/>
              Alternatives &<br/>
              <span className="text-gray-400">Competitors in 2026.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              OroCommerce is a powerful open-source B2B platform — but it demands a dedicated development team, months of implementation, and ongoing infrastructure management. If you want B2B commerce without the development overhead, here are the best alternatives for 2026.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Why Switch</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why OroCommerce Users Are Looking for Alternatives</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="section-why-switch">
            {whyOroUsersSwitch.map((item, i) => (
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Top 5 OroCommerce Alternatives Compared</h2>
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
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Adobe Commerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Salesforce B2B</div>
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
                        {item.magento ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.salesforce ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
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
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">OroCommerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Sana Commerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Adobe Commerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Salesforce</div>
              </div>
              {pricingComparison.map((row, i) => (
                <div key={i} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0" data-testid={`row-pricing-${i}`}>
                  <div className="p-4 font-mono text-sm text-growmax-black font-bold">{row.label}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-growmax-black font-bold">{row.growmax}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.oro}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.sana}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.magento}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.salesforce}</div>
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
            <h2 className="text-3xl font-bold tracking-tight mb-4">How to Migrate from OroCommerce to Growmax Enterprise</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6" data-testid="section-migration-steps">
            {[
              { step: "01", title: "Export Your Data", description: "Export your OroCommerce product catalog, customer accounts, pricing tiers, and order history via the built-in export tools or API." },
              { step: "02", title: "Map & Import", description: "Our migration team maps your OroCommerce data model to Growmax Enterprise — products, customer-specific pricing, and inventory locations. Bulk import via Excel or API." },
              { step: "03", title: "Connect Your ERP", description: "Set up native SAP ECC/S4HANA or Epicor connectors. No custom development — most integrations go live within 24 hours." },
              { step: "04", title: "Go Live", description: "Deploy mobile apps, launch customer portal, train your team. Typical migration: 2-4 weeks. No more managing servers or patching code." },
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
              "orocommerce alternatives",
              "orocommerce competitors",
              "orocommerce replacement",
              "open source B2B ecommerce",
              "orocommerce vs growmax",
              "best B2B ecommerce platform",
              "B2B commerce without developers",
              "orocommerce review 2026",
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
            Ready to replace OroCommerce?<br/>Deploy Growmax Enterprise today.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10">
            Start your 14-day free trial. No developers required. No infrastructure to manage. Go live in weeks — not months.
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