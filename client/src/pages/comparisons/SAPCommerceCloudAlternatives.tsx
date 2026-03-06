import { Link } from "wouter";
import { Check, X, ArrowRight, Star, Users, Globe, Smartphone, DollarSign, Package, Zap, Building2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema } from "@/lib/structuredData";

const competitors = [
  {
    name: "Growmax",
    tagline: "Best for Mid-Market Industrial Distributors",
    highlight: true,
    description: "The connected B2B revenue platform purpose-built for industrial distributors. Native SAP & Zoho integration, offline field sales app, multi-warehouse inventory, and partner commerce portal — at a fraction of SAP Commerce Cloud's cost.",
    pros: [
      "Native SAP integration with bidirectional sync",
      "Offline-capable mobile app for field sales reps",
      "Multi-warehouse inventory with intelligent allocation",
      "Partner commerce portal for channel sales",
      "Quote-to-order workflow with approval engine",
      "2-4 week deployment (vs 12-18 months for SAP)",
    ],
    cons: [
      "Focused on B2B industrial — not for B2C retail",
      "Fewer enterprise customization options than SAP",
    ],
    pricing: "From $199/mo",
    bestFor: "Mid-market industrial distributors who need SAP-grade capabilities without SAP-grade complexity and cost",
    rating: "4.8",
  },
  {
    name: "SAP Commerce Cloud",
    tagline: "Enterprise B2B/B2C Commerce Suite",
    highlight: false,
    description: "SAP's flagship digital commerce platform (formerly Hybris). Extremely comprehensive but requires massive investment in licensing, implementation, and ongoing maintenance.",
    pros: [
      "Deep SAP ERP integration (S/4HANA, ECC)",
      "Comprehensive enterprise feature set",
      "Multi-site, multi-brand, multi-region support",
      "Advanced personalization engine",
    ],
    cons: [
      "Licensing starts at $100K+/year",
      "12-18 month implementation timeline",
      "Requires dedicated development team (Java/Spring)",
      "$500K-$2M+ total implementation cost",
      "Complex upgrade path between versions",
      "No offline mobile app for field sales",
    ],
    pricing: "Custom ($100K+/year licensing)",
    bestFor: "Large enterprises ($500M+ revenue) with dedicated IT teams and budgets exceeding $1M for commerce",
    rating: "3.8",
  },
  {
    name: "Sana Commerce",
    tagline: "ERP-Integrated B2B eCommerce",
    highlight: false,
    description: "B2B eCommerce platform that integrates natively with SAP Business One and Microsoft Dynamics. Simpler than SAP Commerce Cloud but still requires significant investment.",
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
      "4-8 month implementation cycle",
    ],
    pricing: "Custom ($1,500+/mo + implementation)",
    bestFor: "Mid-to-large enterprises on SAP Business One or Microsoft Dynamics who need B2B self-service",
    rating: "4.2",
  },
  {
    name: "OroCommerce",
    tagline: "Open-Source B2B Commerce",
    highlight: false,
    description: "Open-source B2B eCommerce platform with built-in CRM. Powerful and flexible but requires significant development resources.",
    pros: [
      "Open-source with full code access",
      "Built-in CRM (OroCRM)",
      "Multi-organization support",
      "Advanced workflow engine",
    ],
    cons: [
      "Requires dedicated development team",
      "6-12 month implementation timeline",
      "No native SAP integration",
      "High total cost of ownership ($50K+)",
      "No mobile field sales app",
      "Steep learning curve",
    ],
    pricing: "Free (Community) / Custom (Enterprise)",
    bestFor: "Large enterprises with in-house dev teams who want open-source flexibility",
    rating: "4.0",
  },
  {
    name: "Salesforce Commerce Cloud",
    tagline: "CRM-First B2B Commerce",
    highlight: false,
    description: "Salesforce's commerce platform, deeply integrated with Salesforce CRM. Strong for companies already invested in the Salesforce ecosystem.",
    pros: [
      "Deep Salesforce CRM integration",
      "Strong B2B and B2C capabilities",
      "Einstein AI-powered personalization",
      "Large partner ecosystem",
    ],
    cons: [
      "Enterprise pricing ($150K+/year)",
      "Requires Salesforce ecosystem investment",
      "No native SAP integration",
      "6-12 month implementation",
      "No offline mobile field sales app",
      "Complex multi-cloud licensing model",
    ],
    pricing: "Custom ($150K+/year)",
    bestFor: "Companies deeply invested in Salesforce CRM who need unified commerce",
    rating: "4.1",
  },
];

const featureComparison = [
  { category: "Ordering & Commerce", items: [
    { feature: "B2B Customer Self-Service Portal", growmax: true, sap: true, sana: true, oro: true, sfcc: true },
    { feature: "Offline Mobile Order-Taking App", growmax: true, sap: false, sana: false, oro: false, sfcc: false },
    { feature: "Field Sales Rep App (iOS/Android)", growmax: true, sap: false, sana: false, oro: false, sfcc: false },
    { feature: "Customer-Specific Pricing", growmax: true, sap: true, sana: true, oro: true, sfcc: true },
    { feature: "Multi-Currency Support", growmax: true, sap: true, sana: true, oro: true, sfcc: true },
    { feature: "Re-Order Automation", growmax: true, sap: true, sana: true, oro: true, sfcc: true },
    { feature: "Quote-to-Order Workflow", growmax: true, sap: true, sana: false, oro: true, sfcc: true },
  ]},
  { category: "Inventory & Warehouse", items: [
    { feature: "Real-Time Inventory Sync", growmax: true, sap: true, sana: true, oro: false, sfcc: true },
    { feature: "Multi-Warehouse Support", growmax: true, sap: true, sana: true, oro: true, sfcc: true },
    { feature: "Low Stock Threshold Alerts", growmax: true, sap: true, sana: true, oro: false, sfcc: true },
    { feature: "Inventory Allocation Logic", growmax: true, sap: true, sana: false, oro: false, sfcc: false },
  ]},
  { category: "Integrations", items: [
    { feature: "Native SAP S/4HANA Integration", growmax: true, sap: true, sana: false, oro: false, sfcc: false },
    { feature: "Native Zoho Integration", growmax: true, sap: false, sana: false, oro: false, sfcc: false },
    { feature: "QuickBooks Integration", growmax: true, sap: false, sana: false, oro: false, sfcc: false },
    { feature: "Salesforce CRM Integration", growmax: false, sap: false, sana: false, oro: true, sfcc: true },
    { feature: "API Access", growmax: true, sap: true, sana: true, oro: true, sfcc: true },
    { feature: "Self-Service Setup (No Code)", growmax: true, sap: false, sana: false, oro: false, sfcc: false },
  ]},
  { category: "Sales & CRM", items: [
    { feature: "Partner Commerce Portal", growmax: true, sap: true, sana: false, oro: false, sfcc: false },
    { feature: "Opportunity Pipeline Management", growmax: true, sap: false, sana: false, oro: true, sfcc: true },
    { feature: "Visit Logging & Field Data Capture", growmax: true, sap: false, sana: false, oro: false, sfcc: false },
    { feature: "Account-Level Price Matrices", growmax: true, sap: true, sana: true, oro: true, sfcc: true },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "$199/mo", sap: "$100K+/year", sana: "$1,500+/mo", oro: "Free / Custom", sfcc: "$150K+/year" },
  { label: "Free Trial", growmax: "14 days", sap: "No", sana: "No", oro: "Community edition", sfcc: "No" },
  { label: "Setup Fee", growmax: "$0", sap: "$500K–$2M+", sana: "$50K–$200K+", oro: "$50K–$200K+", sfcc: "$200K–$500K+" },
  { label: "Mobile App Included", growmax: "Yes", sap: "No", sana: "No", oro: "No", sfcc: "No" },
  { label: "Implementation Time", growmax: "2-4 weeks", sap: "12-18 months", sana: "4-8 months", oro: "6-12 months", sfcc: "6-12 months" },
];

const whySAPUsersSwitch = [
  {
    icon: DollarSign,
    title: "SAP Commerce Cloud Costs $1M+",
    description: "Between licensing ($100K+/year), implementation ($500K-$2M), and ongoing maintenance, SAP Commerce Cloud is a multi-million dollar commitment. Growmax delivers 90% of the value at 1% of the cost."
  },
  {
    icon: Zap,
    title: "18-Month Implementations Are Unacceptable",
    description: "By the time SAP Commerce Cloud goes live, your market has moved on. Growmax deploys in 2-4 weeks — start taking orders while competitors are still in requirements gathering."
  },
  {
    icon: Smartphone,
    title: "Your Field Reps Need Mobile",
    description: "SAP Commerce Cloud has no offline mobile app for field sales. Your reps visit customers in warehouses and factories with poor connectivity. Growmax works offline and syncs when connected."
  },
  {
    icon: Building2,
    title: "You Don't Need Enterprise Bloat",
    description: "SAP Commerce Cloud was built for $1B+ enterprises. If you're a $10M-$500M distributor, you don't need 90% of what SAP offers — but you're paying for all of it."
  },
  {
    icon: Package,
    title: "You Still Need SAP Integration",
    description: "Switching away from SAP Commerce Cloud doesn't mean abandoning SAP ERP. Growmax connects natively to SAP S/4HANA and ECC with bidirectional real-time sync."
  },
  {
    icon: ShieldCheck,
    title: "You Need Partner Commerce",
    description: "Growmax includes a full partner commerce portal out of the box. On SAP Commerce Cloud, partner portals require additional licensing and custom development."
  },
];

export default function SAPCommerceCloudAlternatives() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Best SAP Commerce Cloud Alternatives in 2026 | Growmax"
        description="Compare the best SAP Commerce Cloud (Hybris) alternatives: Growmax, Sana Commerce, OroCommerce, and Salesforce Commerce Cloud. Feature comparison, pricing, and migration guide."
        path="/comparisons/sap-commerce-cloud-alternatives"
        structuredData={webPageSchema({
          title: "Best SAP Commerce Cloud Alternatives in 2026",
          description: "Comprehensive comparison of SAP Commerce Cloud (Hybris) alternatives for B2B distribution. Compare features, pricing, and implementation timelines.",
          path: "/comparisons/sap-commerce-cloud-alternatives",
          keywords: [
            "SAP Commerce Cloud alternatives",
            "SAP Hybris alternatives",
            "SAP Commerce competitors",
            "SAP B2B commerce replacement",
            "cheaper than SAP Commerce",
            "SAP Commerce Cloud vs Growmax",
            "B2B ecommerce platform SAP integration",
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
                { label: "SAP Commerce Cloud Alternatives" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // SAP Commerce Cloud Alternatives 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Best SAP Commerce<br/>
              Cloud Alternatives<br/>
              <span className="text-gray-400">in 2026.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              SAP Commerce Cloud (formerly Hybris) is the gold standard for enterprise B2B commerce — but at $1M+ total cost, 18-month implementations, and no mobile field sales app, mid-market distributors are looking for alternatives that deliver similar value at a fraction of the investment.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Why Switch</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Distributors Are Looking Beyond SAP Commerce Cloud</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="section-why-switch">
            {whySAPUsersSwitch.map((item, i) => (
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Top 5 SAP Commerce Cloud Alternatives Compared</h2>
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
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">SAP Commerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Sana Commerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">OroCommerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Salesforce CC</div>
                  </div>
                  {group.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-6 border-b border-gray-800 last:border-b-0 hover:bg-gray-900/50 transition-colors" data-testid={`row-feature-${gi}-${i}`}>
                      <div className="p-4 font-mono text-sm text-gray-300">{item.feature}</div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.growmax ? <Check className="w-5 h-5 text-growmax-red" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.sap ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.sana ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.oro ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.sfcc ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
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
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">SAP Commerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Sana</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Oro</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Salesforce</div>
              </div>
              {pricingComparison.map((row, i) => (
                <div key={i} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0" data-testid={`row-pricing-${i}`}>
                  <div className="p-4 font-mono text-sm text-growmax-black font-bold">{row.label}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-growmax-black font-bold">{row.growmax}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.sap}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.sana}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.oro}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.sfcc}</div>
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
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Growmax Is the Best SAP Commerce Cloud Alternative for Mid-Market Distributors</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-testid="section-why-growmax-wins">
            {[
              { number: "01", title: "100x Lower Cost", description: "Growmax starts at $199/mo with no setup fees. SAP Commerce Cloud typically requires $500K-$2M+ in implementation alone, plus $100K+/year in licensing. For mid-market distributors, the math is simple." },
              { number: "02", title: "2-4 Weeks vs 18 Months", description: "Deploy Growmax in weeks. SAP Commerce Cloud implementations take 12-18 months on average. Your competitors will have launched, iterated, and captured market share before SAP goes live." },
              { number: "03", title: "Mobile Field Sales App", description: "SAP Commerce Cloud has no offline mobile app for field sales reps. Growmax includes iOS and Android apps with offline ordering, GPS visit logging, and customer-specific pricing." },
              { number: "04", title: "Keep Your SAP ERP", description: "Moving away from SAP Commerce Cloud doesn't mean abandoning SAP ERP. Growmax connects natively to SAP S/4HANA and ECC with bidirectional real-time sync — no middleware required." },
              { number: "05", title: "No Developer Dependency", description: "SAP Commerce Cloud requires Java developers for customization. Growmax is self-service — configure pricing, catalogs, and workflows without writing a single line of code." },
              { number: "06", title: "Partner Commerce Included", description: "Growmax includes a partner commerce portal at no extra cost. On SAP Commerce Cloud, partner-facing capabilities require additional licensing and custom development." },
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">How to Migrate from SAP Commerce Cloud to Growmax</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-6" data-testid="section-migration-steps">
            {[
              { step: "01", title: "Audit & Export", description: "Audit your SAP Commerce Cloud catalog, pricing rules, and customer data. Export to migration templates provided by Growmax." },
              { step: "02", title: "Connect SAP ERP", description: "Link Growmax directly to your SAP S/4HANA or ECC instance. Native connectors handle bidirectional sync automatically." },
              { step: "03", title: "Configure & Test", description: "Set up customer-specific pricing, multi-warehouse rules, partner portals, and approval workflows. Run parallel testing with live data." },
              { step: "04", title: "Go Live", description: "Deploy mobile apps to field reps, invite customers to the portal, and switch over. Typical go-live: 2-4 weeks from kickoff." },
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
            <Link href="/comparisons/oracle-commerce-alternatives">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-oracle-alternatives">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Alternatives</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Oracle Commerce Alternatives</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Compare alternatives to Oracle Commerce Cloud for B2B distribution.</p>
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
              "SAP Commerce Cloud alternatives",
              "SAP Hybris alternatives",
              "SAP Commerce competitors",
              "cheaper than SAP Commerce",
              "SAP B2B commerce replacement",
              "SAP Commerce Cloud pricing",
              "B2B ecommerce SAP integration",
              "mid-market SAP commerce",
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
            SAP-grade commerce.<br/>Without the SAP price tag.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10">
            Start your 14-day free trial. No credit card required. Native SAP integration, field sales apps, and partner portals — deployed in weeks, not years.
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