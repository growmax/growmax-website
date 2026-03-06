import { Link } from "wouter";
import { Check, X, ArrowRight, Star, Users, Globe, Smartphone, DollarSign, Package, Zap, Building2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema } from "@/lib/structuredData";

const competitors = [
  {
    name: "Growmax Enterprise",
    tagline: "Multi-Party Revenue Ecosystem for Industrial Manufacturers",
    highlight: true,
    description: "The intelligent revenue operations platform that connects your sales reps, partners, dealers, and customers on one platform with full visibility. Native SAP ECC/S4HANA integration, multi-version quote workflows, partner commerce portals, and dealer management — without Oracle's complexity or cost.",
    pros: [
      "Multi-party ecosystem: Brand → Sales Reps → Partners → Customers with 100% visibility",
      "Native SAP ECC/S4HANA & Epicor integration",
      "Multi-version quote workflows with approval engine",
      "Partner commerce portal for dealer and channel networks",
      "Offline-capable mobile app for field sales reps",
      "2-4 week deployment (vs 12-24 months for Oracle)",
    ],
    cons: [
      "Focused on B2B industrial — not for B2C retail",
      "No native Oracle ERP integration (via API)",
    ],
    pricing: "Custom pricing",
    bestFor: "Industrial manufacturers with 100+ employees who need enterprise-grade revenue operations without enterprise-grade complexity",
    rating: "4.8",
  },
  {
    name: "Oracle Commerce Cloud",
    tagline: "Enterprise Commerce Suite",
    highlight: false,
    description: "Oracle's cloud commerce platform (formerly ATG Commerce) offering comprehensive B2B and B2C capabilities. Extremely powerful but requires massive investment and Oracle ecosystem commitment.",
    pros: [
      "Deep Oracle ERP integration (Fusion, E-Business Suite)",
      "Comprehensive enterprise feature set",
      "Multi-site, multi-brand capabilities",
      "Advanced search and merchandising",
    ],
    cons: [
      "Licensing starts at $200K+/year",
      "12-24 month implementation timeline",
      "Requires dedicated Oracle development team",
      "$750K-$3M+ total implementation cost",
      "Oracle ecosystem lock-in",
      "No offline mobile app for field sales",
    ],
    pricing: "Custom ($200K+/year licensing)",
    bestFor: "Large Oracle-committed enterprises ($1B+ revenue) with dedicated IT budgets exceeding $2M",
    rating: "3.6",
  },
  {
    name: "SAP Commerce Cloud",
    tagline: "SAP's B2B Commerce Platform",
    highlight: false,
    description: "SAP's flagship commerce platform (formerly Hybris). Comprehensive enterprise solution with strong SAP ERP integration but similar complexity and cost challenges as Oracle.",
    pros: [
      "Native SAP ERP integration",
      "Comprehensive B2B feature set",
      "Multi-region, multi-brand support",
      "Strong partner ecosystem",
    ],
    cons: [
      "Licensing starts at $100K+/year",
      "12-18 month implementation timeline",
      "Requires Java development team",
      "$500K-$2M+ implementation cost",
      "Complex upgrade path",
      "No offline mobile field sales app",
    ],
    pricing: "Custom ($100K+/year licensing)",
    bestFor: "Large SAP-committed enterprises with dedicated IT teams and big commerce budgets",
    rating: "3.8",
  },
  {
    name: "Sana Commerce",
    tagline: "ERP-Integrated B2B eCommerce",
    highlight: false,
    description: "B2B eCommerce platform with native ERP integration for SAP and Microsoft Dynamics. Simpler than Oracle but still requires significant investment.",
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
      "4-8 month implementation cycle",
    ],
    pricing: "Custom ($1,500+/mo + implementation)",
    bestFor: "Mid-to-large enterprises on SAP Business One or Microsoft Dynamics",
    rating: "4.2",
  },
  {
    name: "Salesforce Commerce Cloud",
    tagline: "CRM-First Commerce Platform",
    highlight: false,
    description: "Salesforce's commerce platform with deep CRM integration. Strong for Salesforce-invested companies but requires significant ecosystem commitment.",
    pros: [
      "Deep Salesforce CRM integration",
      "Strong B2B and B2C capabilities",
      "Einstein AI personalization",
      "Large partner ecosystem",
    ],
    cons: [
      "Enterprise pricing ($150K+/year)",
      "Requires Salesforce ecosystem investment",
      "No native Oracle ERP integration",
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
    { feature: "B2B Customer Self-Service Portal", growmax: true, oracle: true, sap: true, sana: true, sfcc: true },
    { feature: "Offline Mobile Order-Taking App", growmax: true, oracle: false, sap: false, sana: false, sfcc: false },
    { feature: "Field Sales Rep App (iOS/Android)", growmax: true, oracle: false, sap: false, sana: false, sfcc: false },
    { feature: "Customer-Specific Pricing", growmax: true, oracle: true, sap: true, sana: true, sfcc: true },
    { feature: "Multi-Currency Support", growmax: true, oracle: true, sap: true, sana: true, sfcc: true },
    { feature: "Re-Order Automation", growmax: true, oracle: true, sap: true, sana: true, sfcc: true },
    { feature: "Quote-to-Order Workflow", growmax: true, oracle: true, sap: true, sana: false, sfcc: true },
  ]},
  { category: "Inventory & Warehouse", items: [
    { feature: "Real-Time Inventory Sync", growmax: true, oracle: true, sap: true, sana: true, sfcc: true },
    { feature: "Multi-Warehouse Support", growmax: true, oracle: true, sap: true, sana: true, sfcc: true },
    { feature: "Low Stock Threshold Alerts", growmax: true, oracle: true, sap: true, sana: true, sfcc: true },
    { feature: "Inventory Allocation Logic", growmax: true, oracle: true, sap: true, sana: false, sfcc: false },
  ]},
  { category: "Integrations", items: [
    { feature: "Native Oracle ERP Integration", growmax: false, oracle: true, sap: false, sana: false, sfcc: false },
    { feature: "Native SAP ERP Integration", growmax: true, oracle: false, sap: true, sana: true, sfcc: false },
    { feature: "Native SAP ECC/S4HANA Integration", growmax: true, oracle: false, sap: true, sana: true, sfcc: false },
    { feature: "QuickBooks Integration", growmax: true, oracle: false, sap: false, sana: false, sfcc: false },
    { feature: "API Access", growmax: true, oracle: true, sap: true, sana: true, sfcc: true },
    { feature: "Self-Service Setup (No Code)", growmax: true, oracle: false, sap: false, sana: false, sfcc: false },
  ]},
  { category: "Sales & CRM", items: [
    { feature: "Partner Commerce Portal", growmax: true, oracle: true, sap: true, sana: false, sfcc: false },
    { feature: "Opportunity Pipeline Management", growmax: true, oracle: false, sap: false, sana: false, sfcc: true },
    { feature: "Visit Logging & Field Data Capture", growmax: true, oracle: false, sap: false, sana: false, sfcc: false },
    { feature: "Account-Level Price Matrices", growmax: true, oracle: true, sap: true, sana: true, sfcc: true },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "Custom pricing", oracle: "$200K+/year", sap: "$100K+/year", sana: "$1,500+/mo", sfcc: "$150K+/year" },
  { label: "Free Trial", growmax: "Request consultation", oracle: "No", sap: "No", sana: "No", sfcc: "No" },
  { label: "Setup Fee", growmax: "Custom", oracle: "$750K–$3M+", sap: "$500K–$2M+", sana: "$50K–$200K+", sfcc: "$200K–$500K+" },
  { label: "Mobile App Included", growmax: "Yes", oracle: "No", sap: "No", sana: "No", sfcc: "No" },
  { label: "Implementation Time", growmax: "2-4 weeks", oracle: "12-24 months", sap: "12-18 months", sana: "4-8 months", sfcc: "6-12 months" },
];

const whyOracleUsersSwitch = [
  {
    icon: DollarSign,
    title: "Oracle Commerce Costs Millions",
    description: "Between licensing ($200K+/year), implementation ($750K-$3M), and ongoing maintenance, Oracle Commerce Cloud is a multi-million dollar commitment. Growmax Enterprise delivers equivalent multi-party revenue operations at a fraction of the cost."
  },
  {
    icon: Zap,
    title: "24-Month Implementations Are a Dealbreaker",
    description: "Oracle Commerce Cloud implementations take 12-24 months. In that time, your competitors have launched, iterated, and captured market share. Growmax Enterprise deploys in 2-4 weeks."
  },
  {
    icon: Smartphone,
    title: "Your Field Reps Need Offline Mobile",
    description: "Oracle Commerce Cloud has no offline mobile app for field sales. Your reps visit customers in warehouses, factories, and job sites with poor connectivity — they need offline ordering."
  },
  {
    icon: Building2,
    title: "Oracle Ecosystem Lock-In",
    description: "Oracle Commerce Cloud requires deep Oracle ecosystem investment. Growmax Enterprise connects natively to SAP ECC/S4HANA, Epicor, and industry-specific ERPs — giving you flexibility without lock-in."
  },
  {
    icon: Package,
    title: "Mid-Market Doesn't Need Enterprise Bloat",
    description: "Oracle Commerce Cloud was built for $1B+ enterprises. If you're a manufacturer with 100-500+ employees, Growmax Enterprise is purpose-built for your scale — connecting your sales reps, partners, and customers in one ecosystem."
  },
  {
    icon: ShieldCheck,
    title: "No Developer Dependency",
    description: "Oracle Commerce Cloud requires a dedicated development team. Growmax Enterprise is self-service — configure catalogs, pricing, multi-version quotes, and partner workflows without writing code or hiring consultants."
  },
];

export default function OracleCommerceAlternatives() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Best Oracle Commerce Cloud Alternatives in 2026 | Growmax"
        description="Compare the best Oracle Commerce Cloud (ATG) alternatives: Growmax, SAP Commerce Cloud, Sana Commerce, and Salesforce Commerce Cloud. Features, pricing, and migration guide."
        path="/comparisons/oracle-commerce-alternatives"
        structuredData={webPageSchema({
          title: "Best Oracle Commerce Cloud Alternatives in 2026",
          description: "Comprehensive comparison of Oracle Commerce Cloud alternatives for B2B distribution. Compare features, pricing, and implementation timelines.",
          path: "/comparisons/oracle-commerce-alternatives",
          keywords: [
            "Oracle Commerce alternatives",
            "Oracle ATG alternatives",
            "Oracle Commerce competitors",
            "Oracle Commerce Cloud replacement",
            "cheaper than Oracle Commerce",
            "Oracle B2B commerce alternative",
            "B2B ecommerce platform",
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
                { label: "Oracle Commerce Alternatives" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // Oracle Commerce Alternatives 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Best Oracle Commerce<br/>
              Cloud Alternatives<br/>
              <span className="text-gray-400">in 2026.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              Oracle Commerce Cloud (formerly ATG) is one of the most powerful enterprise commerce platforms — but at $2M+ total cost, 24-month implementations, and deep Oracle lock-in, mid-market distributors are seeking alternatives that deliver similar B2B capabilities at a fraction of the investment.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Why Switch</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Distributors Are Moving Beyond Oracle Commerce Cloud</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="section-why-switch">
            {whyOracleUsersSwitch.map((item, i) => (
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Top 5 Oracle Commerce Alternatives Compared</h2>
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
                    <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-gray-800 font-bold">Growmax Enterprise</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Oracle Commerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">SAP Commerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Sana Commerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Salesforce CC</div>
                  </div>
                  {group.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-6 border-b border-gray-800 last:border-b-0 hover:bg-gray-900/50 transition-colors" data-testid={`row-feature-${gi}-${i}`}>
                      <div className="p-4 font-mono text-sm text-gray-300">{item.feature}</div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.growmax ? <Check className="w-5 h-5 text-growmax-red" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.oracle ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.sap ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.sana ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
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
                <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-growmax-black font-bold">Growmax Enterprise</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Oracle Commerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">SAP Commerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Sana</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Salesforce</div>
              </div>
              {pricingComparison.map((row, i) => (
                <div key={i} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0" data-testid={`row-pricing-${i}`}>
                  <div className="p-4 font-mono text-sm text-growmax-black font-bold">{row.label}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-growmax-black font-bold">{row.growmax}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.oracle}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.sap}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.sana}</div>
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
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Growmax Enterprise Is the Best Oracle Commerce Alternative for Industrial Manufacturers</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-testid="section-why-growmax-wins">
            {[
              { number: "01", title: "Dramatically Lower Cost", description: "Growmax Enterprise offers custom pricing with rapid deployment. Oracle Commerce Cloud typically requires $750K-$3M+ in implementation alone, plus $200K+/year in licensing. For industrial manufacturers, the ROI is immediate." },
              { number: "02", title: "2-4 Weeks vs 24 Months", description: "Deploy Growmax Enterprise in weeks. Oracle Commerce Cloud implementations average 12-24 months. Your market opportunity won't wait for a 2-year implementation project." },
              { number: "03", title: "Mobile Field Sales App", description: "Oracle Commerce Cloud has no offline mobile app for field sales reps. Growmax Enterprise includes iOS and Android apps with offline ordering, GPS visit logging, and customer-specific pricing." },
              { number: "04", title: "No Vendor Lock-In", description: "Oracle Commerce Cloud locks you into the Oracle ecosystem. Growmax Enterprise integrates natively with SAP ECC/S4HANA, Epicor, and industry-specific ERPs — switch ERPs without switching your commerce platform." },
              { number: "05", title: "Self-Service Configuration", description: "Oracle Commerce Cloud requires Java developers for customization. Growmax Enterprise is self-service — configure pricing, catalogs, partner portals, and workflows without writing code." },
              { number: "06", title: "Partner Commerce Included", description: "Growmax Enterprise includes a partner commerce portal at no extra cost. On Oracle Commerce Cloud, partner-facing capabilities require additional licensing and custom development." },
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">How to Migrate from Oracle Commerce to Growmax Enterprise</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-6" data-testid="section-migration-steps">
            {[
              { step: "01", title: "Audit & Export", description: "Audit your Oracle Commerce catalog, pricing rules, and customer data. Export to migration templates provided by Growmax Enterprise." },
              { step: "02", title: "Connect Your ERP", description: "Link Growmax Enterprise to your ERP (SAP ECC/S4HANA, Epicor, or via API). Native connectors handle bidirectional sync automatically." },
              { step: "03", title: "Configure & Test", description: "Set up customer-specific pricing, multi-warehouse rules, partner portals, and approval workflows. Run parallel testing." },
              { step: "04", title: "Go Live", description: "Deploy mobile apps to field reps, invite customers to the portal, and switch over. Typical go-live: 2-4 weeks." },
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
            <Link href="/comparisons/sap-commerce-cloud-alternatives">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-sap-alternatives">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Alternatives</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">SAP Commerce Alternatives</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Compare alternatives to SAP Commerce Cloud for B2B distribution.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Read Comparison <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/comparisons/netsuite-suitecommerce-alternatives">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-netsuite-alternatives">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Alternatives</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">NetSuite SuiteCommerce Alternatives</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Compare alternatives to NetSuite SuiteCommerce for B2B distribution.</p>
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
              "Oracle Commerce alternatives",
              "Oracle ATG alternatives",
              "Oracle Commerce competitors",
              "Oracle Commerce replacement",
              "cheaper than Oracle Commerce",
              "Oracle B2B commerce alternative",
              "Oracle Commerce Cloud pricing",
              "mid-market commerce platform",
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
            Enterprise commerce.<br/>Without enterprise complexity.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10">
            Start your 14-day free trial. No credit card required. Deploy B2B commerce in weeks — not years — at a fraction of Oracle's cost.
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