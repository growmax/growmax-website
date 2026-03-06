import { Link } from "wouter";
import { Check, X, ArrowRight, Star, Globe, Smartphone, DollarSign, Package, Zap, Building2, ShieldCheck, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema, faqPageSchema } from "@/lib/structuredData";

const competitors = [
  {
    name: "Growmax",
    tagline: "Best for Industrial Distributors & Manufacturers",
    highlight: true,
    description: "The connected B2B revenue platform purpose-built for industrial distributors. While Magento requires teams of PHP developers and months of customization, Growmax delivers enterprise B2B commerce out of the box — with native ERP integration, offline mobile ordering, and partner portals.",
    pros: [
      "Purpose-built for B2B industrial distribution — not a B2C platform customized for B2B",
      "Native Zoho & SAP ERP integration — no middleware or custom connectors",
      "Offline-capable mobile app for field sales reps (iOS & Android)",
      "Multi-warehouse inventory with intelligent allocation logic",
      "Partner commerce portal for channel/dealer networks",
      "2-4 week implementation vs. Magento's 6-12 months",
    ],
    cons: [
      "Focused on B2B industrial — not designed for DTC retail",
      "No native Shopify or WooCommerce plugin marketplace",
    ],
    pricing: "From $199/mo",
    bestFor: "Mid-market industrial distributors, electrical wholesalers, building materials companies, manufacturers",
    rating: "4.8",
  },
  {
    name: "BigCommerce B2B",
    tagline: "SaaS Alternative to Magento's Complexity",
    highlight: false,
    description: "BigCommerce B2B Edition offers a hosted SaaS alternative to Magento with less complexity. Good for companies that need both B2C and B2B on one platform without managing infrastructure.",
    pros: [
      "SaaS — no server management or security patching",
      "Large app marketplace with 1,000+ integrations",
      "Good SEO capabilities and content management",
      "Simpler than Magento to administer",
    ],
    cons: [
      "B2B features are add-ons, not native — less flexible than Magento",
      "Limited ERP integration depth",
      "No offline mobile app for field sales",
      "Customer-specific pricing is basic compared to Magento's flexibility",
      "Multi-warehouse requires third-party apps",
    ],
    pricing: "From ~$400/mo",
    bestFor: "Companies wanting Magento-like capabilities without the infrastructure burden",
    rating: "4.3",
  },
  {
    name: "OroCommerce",
    tagline: "Open-Source B2B by Magento Co-Founders",
    highlight: false,
    description: "Built by Magento co-founder Yoav Kutner, OroCommerce is an open-source B2B-first platform. It shares Magento's PHP/Symfony DNA but was designed exclusively for B2B from day one.",
    pros: [
      "Purpose-built for B2B — not a B2C platform modified for wholesale",
      "Multi-organization architecture for complex enterprises",
      "Built-in CRM (OroCRM) with sales pipeline",
      "Flexible workflow engine for approval processes",
      "Open-source community edition available",
    ],
    cons: [
      "Requires PHP/Symfony developers — similar talent gap as Magento",
      "No native mobile app for field sales",
      "Limited out-of-box ERP integration",
      "Expensive enterprise edition",
      "Smaller ecosystem and community than Magento",
    ],
    pricing: "Custom (~$45K+/year enterprise)",
    bestFor: "Large enterprises with PHP development teams who want a B2B-native open-source platform",
    rating: "4.1",
  },
  {
    name: "Shopify Plus",
    tagline: "Simplest Migration from Magento",
    highlight: false,
    description: "Shopify Plus is the easiest migration path from Magento for companies that prioritize simplicity. The tradeoff is losing Magento's customization flexibility and B2B depth.",
    pros: [
      "World-class UX and ease of use",
      "Massive app ecosystem (8,000+ apps)",
      "Fastest migration from Magento",
      "Strong payment processing and checkout",
    ],
    cons: [
      "B2B features are basic — designed for DTC adding wholesale",
      "No customer-specific pricing with volume brackets",
      "No multi-warehouse inventory management",
      "No offline mobile app for field sales",
      "No native ERP integration (SAP, Zoho)",
      "Less customization flexibility than Magento",
      "Transaction fees on top of monthly costs",
    ],
    pricing: "From $2,300/mo",
    bestFor: "DTC brands on Magento who want simpler administration and don't need complex B2B",
    rating: "4.5",
  },
  {
    name: "Sana Commerce",
    tagline: "ERP-First B2B Commerce",
    highlight: false,
    description: "Sana Commerce integrates with SAP Business One and Microsoft Dynamics. A strong alternative if your Magento migration is ERP-driven and you're already on SAP B1 or Dynamics.",
    pros: [
      "Native SAP Business One integration",
      "Microsoft Dynamics 365 connector",
      "Real-time ERP data sync",
      "Self-service customer portal",
    ],
    cons: [
      "Requires SAP or Dynamics — no standalone mode",
      "High implementation costs ($50K-$200K+)",
      "No offline mobile app for field reps",
      "No Zoho ecosystem support",
      "Long implementation cycles (4-8 months)",
    ],
    pricing: "Custom (~$1,500+/mo + implementation)",
    bestFor: "Enterprises on SAP Business One or Dynamics who want deep ERP integration",
    rating: "4.2",
  },
];

const featureComparison = [
  { category: "B2B Commerce Core", items: [
    { feature: "B2B Customer Self-Service Portal", growmax: true, bigcommerce: true, oro: true, shopify: true, sana: true },
    { feature: "Customer-Specific Pricing", growmax: true, bigcommerce: true, oro: true, shopify: false, sana: true },
    { feature: "Volume Bracket Pricing", growmax: true, bigcommerce: false, oro: true, shopify: false, sana: true },
    { feature: "Multi-Currency Support", growmax: true, bigcommerce: true, oro: true, shopify: true, sana: true },
    { feature: "Quote-to-Order Workflow", growmax: true, bigcommerce: false, oro: true, shopify: false, sana: false },
    { feature: "Purchase Order Support", growmax: true, bigcommerce: true, oro: true, shopify: true, sana: true },
  ]},
  { category: "Mobile & Field Sales", items: [
    { feature: "Native Mobile App (iOS/Android)", growmax: true, bigcommerce: false, oro: false, shopify: false, sana: false },
    { feature: "Offline Ordering Capability", growmax: true, bigcommerce: false, oro: false, shopify: false, sana: false },
    { feature: "GPS Visit Logging", growmax: true, bigcommerce: false, oro: false, shopify: false, sana: false },
    { feature: "Field Sales Rep Dashboard", growmax: true, bigcommerce: false, oro: false, shopify: false, sana: false },
  ]},
  { category: "Inventory & Fulfillment", items: [
    { feature: "Multi-Warehouse Inventory", growmax: true, bigcommerce: false, oro: true, shopify: false, sana: true },
    { feature: "Real-Time ATP", growmax: true, bigcommerce: false, oro: true, shopify: false, sana: true },
    { feature: "Inventory Allocation Logic", growmax: true, bigcommerce: false, oro: false, shopify: false, sana: false },
    { feature: "Low Stock Alerts", growmax: true, bigcommerce: true, oro: true, shopify: true, sana: true },
  ]},
  { category: "Integrations & Ecosystem", items: [
    { feature: "Native Zoho Integration", growmax: true, bigcommerce: false, oro: false, shopify: false, sana: false },
    { feature: "Native SAP Integration", growmax: true, bigcommerce: false, oro: false, shopify: false, sana: true },
    { feature: "QuickBooks Integration", growmax: true, bigcommerce: true, oro: false, shopify: true, sana: false },
    { feature: "API Access", growmax: true, bigcommerce: true, oro: true, shopify: true, sana: true },
    { feature: "Partner Commerce Portal", growmax: true, bigcommerce: false, oro: false, shopify: false, sana: false },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "$199/mo", bigcommerce: "~$400/mo", oro: "Custom ($45K+/yr)", shopify: "$2,300/mo", sana: "~$1,500+/mo" },
  { label: "Free Trial", growmax: "14 days", bigcommerce: "15 days", oro: "Demo only", shopify: "Demo only", sana: "Demo only" },
  { label: "Setup Fee", growmax: "$0", bigcommerce: "$0", oro: "$20K-$100K+", shopify: "$0", sana: "$50K-$200K+" },
  { label: "Mobile App Included", growmax: "Yes", bigcommerce: "No", oro: "No", shopify: "No", sana: "No" },
  { label: "Implementation Time", growmax: "2-4 weeks", bigcommerce: "2-4 months", oro: "6-12 months", shopify: "1-3 months", sana: "4-8 months" },
  { label: "Developers Required", growmax: "No", bigcommerce: "Optional", oro: "Yes (PHP)", shopify: "Optional", sana: "Yes" },
];

const whyMagentoUsersSwitch = [
  {
    icon: Code,
    title: "Developer Dependency Is Unsustainable",
    description: "Magento requires specialized PHP developers for every change — pricing rules, catalog updates, integrations. Finding and retaining Magento developers is increasingly difficult and expensive as the talent pool shrinks."
  },
  {
    icon: DollarSign,
    title: "Total Cost of Ownership Is Exploding",
    description: "Adobe Commerce (Magento 2) licensing starts at $22K+/year, but the real cost is infrastructure ($2-5K/mo), developers ($150K+/year), security patches, and extensions. TCO often exceeds $200K/year."
  },
  {
    icon: ShieldCheck,
    title: "Security Patching Is a Full-Time Job",
    description: "Self-hosted Magento requires constant security patches. Every patch risks breaking customizations. PCI compliance adds another layer of complexity and cost that SaaS platforms handle for you."
  },
  {
    icon: Zap,
    title: "Adobe's Roadmap Doesn't Prioritize B2B",
    description: "Adobe's acquisition of Magento shifted focus to B2C experience management. B2B features get incremental updates while competitors build purpose-built B2B functionality."
  },
  {
    icon: Smartphone,
    title: "No Mobile-First B2B Experience",
    description: "Magento offers responsive web design but no native mobile app for field sales. Industrial distributors need offline-capable mobile ordering — not a responsive website."
  },
  {
    icon: Building2,
    title: "ERP Integration Requires Expensive Middleware",
    description: "Connecting Magento to SAP, Zoho, or other ERPs requires middleware (Celigo, MuleSoft, Boomi) that adds $20-50K+ in costs and ongoing maintenance."
  },
];

const faqs = [
  {
    question: "What is the best alternative to Magento B2B for industrial distributors?",
    answer: "Growmax is the best Magento B2B alternative for industrial distributors. It provides customer-specific pricing, multi-warehouse inventory, offline mobile ordering, and native SAP/Zoho integration out of the box — features that require extensive customization on Magento. Implementation takes 2-4 weeks vs. Magento's 6-12 months."
  },
  {
    question: "How much does it cost to migrate from Magento to a B2B platform?",
    answer: "Migration costs depend on your target platform. Migrating to Growmax typically costs $0 in setup fees with implementation in 2-4 weeks. Migrating to BigCommerce or Shopify Plus costs $10-50K for data migration and theme development. Migrating to OroCommerce or Sana Commerce can cost $50-200K+ due to complex implementation requirements."
  },
  {
    question: "Is Adobe Commerce (Magento 2) still worth using for B2B?",
    answer: "Adobe Commerce remains viable for large enterprises with dedicated development teams and complex B2C+B2B hybrid requirements. However, for pure B2B distributors, purpose-built platforms like Growmax deliver more B2B functionality at 1/10th the total cost of ownership, without requiring PHP developers or managing infrastructure."
  },
  {
    question: "Can I migrate from Magento without losing SEO rankings?",
    answer: "Yes, with proper 301 redirect mapping. Most B2B platforms support URL redirect imports. The key is mapping every Magento URL to its equivalent on the new platform before migration, including product pages, category pages, and blog content."
  },
];

export default function MagentoB2BAlternatives() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Best Magento B2B Alternatives & Competitors in 2026 | Growmax"
        description="Compare the best Magento B2B alternatives for industrial distributors: Growmax, BigCommerce B2B, OroCommerce, Shopify Plus, and Sana Commerce. Feature comparison, pricing, and migration guide."
        path="/comparisons/magento-b2b-alternatives"
        structuredData={[
          webPageSchema({
            title: "Best Magento B2B Alternatives & Competitors in 2026",
            description: "Comprehensive comparison of Magento B2B (Adobe Commerce) alternatives for industrial distributors. Compare features, pricing, and migration paths.",
            path: "/comparisons/magento-b2b-alternatives",
            keywords: ["magento b2b alternative", "magento alternatives", "adobe commerce alternative", "magento b2b competitors", "magento replacement"],
          }),
          faqPageSchema({
            title: "Magento B2B Alternatives FAQ",
            path: "/comparisons/magento-b2b-alternatives",
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
                { label: "Magento B2B Alternatives" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // Magento B2B Alternatives 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Best Magento B2B<br/>
              Alternatives &<br/>
              <span className="text-gray-400">Competitors in 2026.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              Magento (Adobe Commerce) was once the default for B2B eCommerce. But rising TCO, developer shortages, and purpose-built B2B platforms have changed the equation. Here's how the top alternatives compare for industrial distributors in 2026.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Why Switch</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Magento B2B Users Are Looking for Alternatives</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="section-why-switch">
            {whyMagentoUsersSwitch.map((item, i) => (
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Top 5 Magento B2B Alternatives Compared</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>
          <div className="space-y-8" data-testid="section-competitor-cards">
            {competitors.map((comp, i) => (
              <div key={i} className={`border-2 p-8 md:p-10 ${comp.highlight ? "border-growmax-red shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "border-gray-200"}`} data-testid={`card-competitor-${i}`}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold tracking-tight text-growmax-black">{comp.name}</h3>
                      {comp.highlight && (
                        <span className="bg-growmax-red text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1 font-bold" data-testid="badge-recommended">Recommended</span>
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
                <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">{group.category}</div>
                <div className="border border-gray-800 min-w-[800px]">
                  <div className="grid grid-cols-6 border-b border-gray-800 bg-gray-900">
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase">Feature</div>
                    <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-gray-800 font-bold">Growmax</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">BigCommerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">OroCommerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Shopify Plus</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Sana</div>
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
                        {item.oro ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.shopify ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
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
                <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-growmax-black font-bold">Growmax</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">BigCommerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">OroCommerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Shopify Plus</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Sana</div>
              </div>
              {pricingComparison.map((row, i) => (
                <div key={i} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0" data-testid={`row-pricing-${i}`}>
                  <div className="p-4 font-mono text-sm text-growmax-black font-bold">{row.label}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-growmax-black font-bold">{row.growmax}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.bigcommerce}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.oro}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.shopify}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.sana}</div>
                </div>
              ))}
            </div>
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

      <section className="py-24 bg-growmax-red text-white">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <h2 className="text-4xl font-bold tracking-tighter mb-6">Ready to Move Beyond Magento?</h2>
          <p className="text-xl font-light mb-8 opacity-90 max-w-2xl mx-auto">
            See why industrial distributors are choosing Growmax over Magento. Deploy in 2-4 weeks — not 6-12 months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-white text-growmax-red hover:bg-gray-100 rounded-none font-bold px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]" data-testid="button-cta-demo">
                Schedule a Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/arc">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-none font-bold px-8" data-testid="button-cta-arc">
                Explore Growmax ARC
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
