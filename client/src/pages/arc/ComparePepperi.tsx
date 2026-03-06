import { Link } from "wouter";
import { Check, X, ArrowRight, Zap, Globe, Smartphone, Database, DollarSign, Clock, Users, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema } from "@/lib/structuredData";
import SiloVsConnected from "@/components/SiloVsConnected";

const features = [
  { category: "Ordering & Commerce", items: [
    { feature: "B2B Customer Portal", growmax: true, competitor: true },
    { feature: "Offline Mobile Order-Taking App", growmax: true, competitor: true },
    { feature: "Field Sales Rep App (iOS/Android)", growmax: true, competitor: true },
    { feature: "Customer-Specific Pricing", growmax: true, competitor: true },
    { feature: "Multi-Currency Support", growmax: true, competitor: true },
    { feature: "Re-Order Automation", growmax: true, competitor: true },
    { feature: "Quote-to-Order Workflow", growmax: true, competitor: true },
    { feature: "5-Minute Self-Service Setup", growmax: true, competitor: false },
    { feature: "Self-Service Reordering Portal", growmax: true, competitor: false },
  ]},
  { category: "Inventory & Warehouse", items: [
    { feature: "Real-Time Inventory Sync", growmax: true, competitor: true },
    { feature: "Multi-Warehouse Support", growmax: true, competitor: true },
    { feature: "Low Stock Threshold Alerts", growmax: true, competitor: false },
    { feature: "Inventory Allocation Logic", growmax: true, competitor: true },
    { feature: "Excel Bulk Import/Export", growmax: true, competitor: true },
    { feature: "Barcode/Scanner Integration", growmax: true, competitor: true },
  ]},
  { category: "Integrations", items: [
    { feature: "Native Zoho Integration", growmax: true, competitor: false },
    { feature: "QuickBooks Integration", growmax: true, competitor: false },
    { feature: "Xero Integration", growmax: true, competitor: false },
    { feature: "SAP Integration", growmax: true, competitor: true },
    { feature: "Salesforce Integration", growmax: false, competitor: true },
    { feature: "Microsoft Dynamics", growmax: false, competitor: true },
    { feature: "REST API Access", growmax: true, competitor: true },
  ]},
  { category: "Sales Operations", items: [
    { feature: "Opportunity Pipeline Management", growmax: true, competitor: false },
    { feature: "Visit Logging & Route Planning", growmax: true, competitor: true },
    { feature: "Partner/Dealer Portal", growmax: true, competitor: false },
    { feature: "AI-Powered Product Recommendations", growmax: true, competitor: false },
    { feature: "Reporting Dashboards", growmax: true, competitor: true },
    { feature: "Custom Forms & Surveys", growmax: false, competitor: true },
    { feature: "Merchandising / Planogram", growmax: false, competitor: true },
    { feature: "Retail Execution Module", growmax: false, competitor: true },
  ]},
  { category: "DSD & Route Operations", items: [
    { feature: "Route Accounting", growmax: false, competitor: true },
    { feature: "DSD Delivery Management", growmax: false, competitor: true },
    { feature: "In-Store Audit / Photo Capture", growmax: false, competitor: true },
    { feature: "Digital Order Taking for DSD Reps", growmax: true, competitor: true },
    { feature: "Multi-Channel Order Capture", growmax: true, competitor: false },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "$199/mo", competitor: "Custom (est. $500+/mo)" },
  { label: "Additional Users", growmax: "$29/user/mo", competitor: "Per-user enterprise pricing" },
  { label: "Free Trial", growmax: "14 days, self-service", competitor: "Demo only" },
  { label: "Setup Fee", growmax: "$0", competitor: "$5,000 – $25,000+" },
  { label: "Implementation Time", growmax: "Same day", competitor: "4–12 weeks" },
  { label: "Contract Minimum", growmax: "Monthly", competitor: "Annual (typically 2-year)" },
  { label: "Total Year 1 Cost (5 users)", growmax: "~$4,100", competitor: "~$15,000 – $50,000+" },
  { label: "Total Year 1 Cost (10 users)", growmax: "~$5,900", competitor: "~$30,000 – $75,000+" },
];

const faqItems = [
  {
    question: "Is Growmax ARC a good alternative to Pepperi for small distributors?",
    answer: "Yes. Growmax ARC delivers the core B2B commerce capabilities that Pepperi offers — customer-specific pricing, mobile order taking, field sales apps, and multi-warehouse inventory — at roughly 10% of Pepperi's cost. ARC is purpose-built for industrial and wholesale distributors with up to 100 employees, while Pepperi targets large enterprise CPG companies with complex merchandising and retail execution needs."
  },
  {
    question: "What does Pepperi offer that Growmax ARC doesn't?",
    answer: "Pepperi has specialized modules for retail execution (planogram compliance, in-store audits), DSD route accounting, and Salesforce/Microsoft Dynamics integration. If your business requires these specific capabilities — particularly retail merchandising or DSD route settlement — Pepperi is the stronger choice. However, most small and mid-size distributors don't need these features and end up paying enterprise prices for capabilities they never use."
  },
  {
    question: "Can I switch from Pepperi to Growmax ARC?",
    answer: "Yes. Growmax ARC supports bulk data import for products, customers, and pricing via Excel. Most businesses can migrate from Pepperi to ARC in under a week. ARC also integrates with QuickBooks, Zoho, and Xero, so if you're switching accounting systems at the same time, ARC supports the transition. There are no long-term contracts, so you can test ARC with a 14-day free trial before committing."
  },
  {
    question: "How does Growmax ARC pricing compare to Pepperi?",
    answer: "Growmax ARC starts at $199/month with $29/user for additional seats, no setup fees, and no contracts. Pepperi uses enterprise pricing that typically starts at $500+/month with $5,000–$25,000 in setup fees and requires annual or multi-year commitments. A 10-user ARC deployment costs roughly $5,900/year; the equivalent Pepperi deployment can cost $30,000–$75,000+ in year one."
  },
  {
    question: "Does Growmax ARC support DSD (Direct Store Delivery)?",
    answer: "Growmax ARC supports the ordering side of DSD — mobile order taking with offline capability, customer-specific pricing, and multi-channel order capture. However, ARC does not include Pepperi's specialized DSD modules for route accounting, load management, and in-store merchandising audits. If you need full DSD route accounting, Pepperi or a dedicated DSD platform may be a better fit."
  },
];

export default function ComparePepperi() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Growmax ARC vs Pepperi (2026) | Feature, Pricing & DSD Comparison"
        description="Detailed comparison of Growmax ARC and Pepperi for B2B distribution. Compare features, pricing, DSD capabilities, integrations, and deployment timelines. Enterprise power at $199/mo vs Pepperi's $15K+ year-one cost."
        path="/arc/compare/pepperi"
        structuredData={webPageSchema({
          title: "Growmax ARC vs Pepperi | SMB B2B Commerce Alternative",
          description: "Detailed comparison of Growmax ARC and Pepperi for B2B distribution. Compare features, pricing, DSD capabilities, integrations, and deployment timelines.",
          path: "/arc/compare/pepperi",
          keywords: ["Pepperi alternative", "Pepperi competitor", "Pepperi vs Growmax", "SMB B2B commerce", "B2B distribution platform", "field sales app comparison", "DSD software alternative", "Pepperi pricing"],
        })}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="pt-32 pb-24 border-b border-gray-200 bg-grid-pattern relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="mb-6">
              <Breadcrumbs items={[
                { label: "ARC", href: "/arc" },
                { label: "ARC vs Pepperi" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // ARC vs Pepperi
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Growmax ARC vs<br/>
              Pepperi.<br/>
              <span className="text-gray-400">Enterprise power,<br/>without enterprise cost.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              Pepperi is a complex enterprise CPG platform built for large consumer goods companies with DSD and retail execution needs. Growmax ARC delivers the same core B2B commerce capabilities — simpler, cheaper, and faster to deploy — purpose-built for industrial and wholesale distributors.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-12">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Quick Verdict</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Who Should Choose Which?</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-2 border-growmax-red p-8" data-testid="card-choose-arc">
              <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Choose Growmax ARC If</div>
              <ul className="space-y-4">
                {[
                  "You're a distributor with 10–100 employees",
                  "You use QuickBooks, Zoho, or Xero for accounting",
                  "You need a self-service portal + field sales app",
                  "Budget matters — you want enterprise features under $200/mo",
                  "You need to go live in days, not months",
                  "Your sales team needs offline mobile ordering",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-growmax-red flex-shrink-0 mt-0.5" />
                    <span className="font-mono text-sm text-growmax-black">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-gray-300 p-8 bg-gray-50" data-testid="card-choose-pepperi">
              <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4 font-bold">Choose Pepperi If</div>
              <ul className="space-y-4">
                {[
                  "You're a CPG brand with 200+ field reps",
                  "You need full DSD route accounting and settlement",
                  "Retail execution (planograms, audits) is core to your business",
                  "You use Salesforce or Microsoft Dynamics as your CRM",
                  "You need custom forms and in-store survey capabilities",
                  "Budget is secondary to specialized CPG features",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="font-mono text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Feature Matrix</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Complete Feature Comparison</h2>
            <p className="text-gray-400 font-light max-w-2xl">Side-by-side comparison across 30+ features including ordering, inventory, integrations, sales operations, and DSD capabilities.</p>
            <div className="w-16 h-1 bg-growmax-red mt-4"></div>
          </div>

          {features.map((group, gi) => (
            <div key={gi} className="mb-12" data-testid={`section-features-${gi}`}>
              <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">
                {group.category}
              </div>
              <div className="md:hidden font-mono text-xs text-gray-500 mb-2">Scroll to compare →</div>
              <div className="overflow-x-auto">
              <div className="border border-gray-800 min-w-[600px]">
                <div className="grid grid-cols-3 border-b border-gray-800 bg-gray-900">
                  <div className="p-4 font-mono text-xs text-gray-400 uppercase">Feature</div>
                  <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-gray-800">Growmax ARC</div>
                  <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Pepperi</div>
                </div>
                {group.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-3 border-b border-gray-800 last:border-b-0 hover:bg-gray-900/50 transition-colors" data-testid={`row-feature-${gi}-${i}`}>
                    <div className="p-4 font-mono text-sm text-gray-300">{item.feature}</div>
                    <div className="p-4 flex justify-center items-center border-l border-gray-800">
                      {item.growmax ? (
                        <Check className="w-5 h-5 text-growmax-red" />
                      ) : (
                        <X className="w-5 h-5 text-gray-700" />
                      )}
                    </div>
                    <div className="p-4 flex justify-center items-center border-l border-gray-800">
                      {item.competitor ? (
                        <Check className="w-5 h-5 text-gray-500" />
                      ) : (
                        <X className="w-5 h-5 text-gray-700" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          ))}
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
          <div className="border border-growmax-black min-w-[600px]" data-testid="section-pricing-comparison">
            <div className="grid grid-cols-3 border-b border-growmax-black bg-gray-50">
              <div className="p-4 font-mono text-xs text-gray-500 uppercase"></div>
              <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-growmax-black font-bold">Growmax ARC</div>
              <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Pepperi</div>
            </div>
            {pricingComparison.map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-gray-200 last:border-b-0" data-testid={`row-pricing-${i}`}>
                <div className="p-4 font-mono text-sm text-growmax-black font-bold">{row.label}</div>
                <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-growmax-black">{row.growmax}</div>
                <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.competitor}</div>
              </div>
            ))}
          </div>
          </div>

          <div className="mt-8 border border-growmax-red bg-red-50 p-6" data-testid="card-cost-highlight">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-2 font-bold">Total Cost of Ownership</div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Pepperi's enterprise pricing model typically requires a $5,000–$25,000 setup fee, annual contracts, and per-user licensing that scales rapidly. A 10-user Pepperi deployment can cost $30,000–$75,000 in year one. The equivalent Growmax ARC deployment costs under $6,000 annually with no setup fees, no contracts, and no hidden costs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Deployment Timeline</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Time to Value</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-growmax-black p-8" data-testid="card-timeline-growmax">
              <div className="font-mono text-xs text-growmax-red uppercase mb-4 tracking-widest font-bold">Growmax ARC</div>
              <div className="space-y-6">
                {[
                  { time: "Day 1", label: "Sign up, configure catalog" },
                  { time: "Day 2", label: "Import products & customers" },
                  { time: "Day 3", label: "Connect QuickBooks/Zoho/Xero" },
                  { time: "Day 5", label: "Train reps, go live" },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="font-mono text-xs text-growmax-red font-bold min-w-[60px]">{step.time}</div>
                    <div className="flex-1 border-b border-gray-100 pb-3">
                      <span className="font-mono text-sm text-growmax-black">{step.label}</span>
                    </div>
                  </div>
                ))}
                <div className="bg-growmax-black text-white p-4 font-mono text-sm text-center font-bold">
                  <Clock className="w-4 h-4 inline mr-2" /> LIVE IN 5 DAYS
                </div>
              </div>
            </div>

            <div className="border border-gray-300 p-8 bg-gray-50" data-testid="card-timeline-competitor">
              <div className="font-mono text-xs text-gray-500 uppercase mb-4 tracking-widest font-bold">Pepperi</div>
              <div className="space-y-6">
                {[
                  { time: "Week 1–2", label: "Scoping & requirements gathering" },
                  { time: "Week 3–4", label: "Solution design & architecture" },
                  { time: "Week 5–8", label: "Configuration & customization" },
                  { time: "Week 9–12", label: "UAT, training, go-live" },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="font-mono text-xs text-gray-400 font-bold min-w-[80px]">{step.time}</div>
                    <div className="flex-1 border-b border-gray-200 pb-3">
                      <span className="font-mono text-sm text-gray-500">{step.label}</span>
                    </div>
                  </div>
                ))}
                <div className="bg-gray-200 text-gray-500 p-4 font-mono text-sm text-center font-bold">
                  <Clock className="w-4 h-4 inline mr-2" /> LIVE IN 4–12 WEEKS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Deep Dive</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Pepperi vs Growmax ARC: Detailed Analysis</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-growmax-black mb-4">B2B Sales Platform Capabilities</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-4">
                  Both Growmax ARC and Pepperi provide B2B sales platform capabilities, but they approach the market from different angles. Pepperi was built for consumer packaged goods (CPG) brands with large field sales forces — think Coca-Cola's route drivers or Frito-Lay's merchandising teams. Its strength is managing hundreds of field reps who visit retail stores daily for <Link href="/blog/direct-store-delivery-dsd-guide" className="text-growmax-red hover:underline font-medium">direct store delivery (DSD)</Link>.
                </p>
                <p className="text-gray-600 font-light leading-relaxed">
                  Growmax ARC, by contrast, is purpose-built for industrial and wholesale distributors — electrical suppliers, building materials companies, fastener distributors, and automotive parts businesses. These companies need <Link href="/blog/b2b-sales-tips-strategies-distributors" className="text-growmax-red hover:underline font-medium">B2B sales tools</Link> focused on customer-specific pricing, quote-to-order workflows, and multi-warehouse inventory — not CPG merchandising features.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight text-growmax-black mb-4">DSD Software & Route Accounting</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-4">
                  Pepperi's strongest differentiator is its <Link href="/blog/direct-store-delivery-dsd-guide" className="text-growmax-red hover:underline font-medium">DSD software</Link> capabilities. If your business model centers on direct store delivery with route accounting, truck inventory management, and in-store merchandising audits, Pepperi provides purpose-built tools for this workflow.
                </p>
                <p className="text-gray-600 font-light leading-relaxed">
                  Growmax ARC supports the ordering side of DSD — offline mobile order taking, customer-specific pricing at the point of sale, and multi-channel order capture — but does not include route accounting or retail execution modules. For distributors who take orders in the field but don't need route settlement, ARC provides the right level of capability at a fraction of the cost.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight text-growmax-black mb-4">CRM & Sales Force Automation</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-4">
                  Pepperi integrates with Salesforce and Microsoft Dynamics for <Link href="/blog/crm-vs-sfa-sales-force-automation-guide" className="text-growmax-red hover:underline font-medium">CRM and sales force automation</Link>. If your organization already uses these enterprise CRM platforms, Pepperi's connectors are mature and well-tested.
                </p>
                <p className="text-gray-600 font-light leading-relaxed">
                  Growmax ARC takes a different approach: instead of integrating with external CRMs, it includes built-in SFA capabilities — opportunity pipeline management, visit logging, and account-level analytics. For distributors who don't already have a CRM, ARC provides the sales management tools they need without requiring a separate platform and integration project.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight text-growmax-black mb-4">Trade Promotions & Pricing</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-4">
                  Both platforms handle complex B2B pricing. Pepperi offers promotion management tools aligned with CPG <Link href="/blog/trade-promotions-guide-wholesale-distributors" className="text-growmax-red hover:underline font-medium">trade promotion</Link> workflows — display allowances, free goods, and tiered incentives designed for retail channel execution.
                </p>
                <p className="text-gray-600 font-light leading-relaxed">
                  Growmax ARC focuses on <Link href="/blog/implement-tiered-pricing-b2b-wholesale-distribution" className="text-growmax-red hover:underline font-medium">tiered pricing</Link>, customer-specific price lists, volume discounts, and contract pricing — the pricing models that industrial and wholesale distributors actually use. ARC's pricing engine is simpler to configure and doesn't require professional services to set up.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight text-growmax-black mb-4">Integration Ecosystem</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Pepperi integrates with SAP, Salesforce, and Microsoft Dynamics — the enterprise stack. Growmax ARC integrates with QuickBooks, Zoho, and Xero — the SMB accounting stack. This is the clearest signal of who each platform is built for. If you run SAP and Salesforce, Pepperi fits your ecosystem. If you run QuickBooks or Zoho, ARC is the only platform with <Link href="/blog/integrating-zoho-crm-b2b-ecommerce-guide" className="text-growmax-red hover:underline font-medium">native, real-time bidirectional sync</Link> designed for your accounting system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Verdict</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Distributors Choose ARC Over Pepperi</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-testid="section-why-growmax-wins">
            {[
              {
                number: "01",
                icon: <DollarSign className="w-8 h-8" />,
                title: "10x Lower Cost",
                description: "ARC starts at $199/mo with no setup fees. Pepperi's enterprise model means $15,000–$50,000+ in year one costs. For mid-market distributors, ARC delivers 90% of the value at 10% of the price."
              },
              {
                number: "02",
                icon: <Clock className="w-8 h-8" />,
                title: "Same-Day Deployment",
                description: "Pepperi requires weeks of scoping, configuration, and professional services. ARC is self-service — sign up, import your catalog, connect your accounting system, and go live in a single day."
              },
              {
                number: "03",
                icon: <Database className="w-8 h-8" />,
                title: "SMB Accounting Native",
                description: "Pepperi integrates with SAP and Salesforce but has no QuickBooks, Zoho, or Xero connectivity. If your business runs on SMB accounting software, ARC is the only platform with native, real-time sync."
              },
              {
                number: "04",
                icon: <Users className="w-8 h-8" />,
                title: "Built for Distributors",
                description: "Pepperi was designed for CPG brands and consumer goods companies. ARC was purpose-built for industrial distributors — multi-warehouse, partner portals, and B2B pricing logic are native, not bolt-ons."
              },
              {
                number: "05",
                icon: <Shield className="w-8 h-8" />,
                title: "No Vendor Lock-In",
                description: "ARC operates on monthly billing with full data export. No annual contracts, no proprietary data formats, no exit fees. Pepperi typically requires multi-year commitments."
              },
              {
                number: "06",
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Built-In Sales Intelligence",
                description: "ARC includes opportunity pipeline management, AI product recommendations, and partner portals out of the box. Pepperi's partner-facing features require additional modules and enterprise licensing."
              },
            ].map((item, i) => (
              <div key={i} className="border border-gray-800 p-8 hover:border-growmax-red transition-colors group" data-testid={`card-advantage-${i}`}>
                <div className="font-mono text-xs text-growmax-red mb-4 uppercase">{item.number}</div>
                <div className="text-white mb-6 group-hover:text-growmax-red transition-colors">{item.icon}</div>
                <h3 className="text-xl font-bold mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <SiloVsConnected competitorName="Pepperi" />
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
            {faqItems.map((item, i) => (
              <div key={i} className="border border-gray-200 p-8" data-testid={`card-faq-${i}`}>
                <h3 className="text-lg font-bold tracking-tight text-growmax-black mb-4">{item.question}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Related Resources</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Explore More</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-testid="section-related-links">
            <Link href="/arc/compare/b2b-wave">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-compare-b2bwave">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Comparison</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">ARC vs B2B Wave</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Feature-by-feature comparison against B2B Wave's QuickBooks-centric eCommerce platform.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Read Comparison <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/blog/direct-store-delivery-dsd-guide">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-blog-dsd">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Intelligence</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">DSD Guide for Distributors</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">The complete guide to Direct Store Delivery — when DSD makes sense and how to digitize it.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Read Article <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/blog/crm-vs-sfa-sales-force-automation-guide">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-blog-crm-sfa">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Intelligence</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">CRM vs SFA Guide</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Understanding the difference between CRM and Sales Force Automation — and which your business needs.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Read Article <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>
          </div>

          <div className="mt-8 border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4" data-testid="banner-industries">
            <div>
              <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-1">Industry Focus</div>
              <p className="text-sm text-gray-700">See how electrical distributors use Growmax to modernize their ordering operations.</p>
            </div>
            <Link href="/industries/electrical-distributors">
              <Button variant="outline" className="border-growmax-black text-growmax-black hover:bg-growmax-black hover:text-white rounded-none font-bold tracking-tight whitespace-nowrap" data-testid="button-industry-link">
                Electrical Distributors <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 text-center bg-white">
        <div className="container mx-auto px-4">
          <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-6 font-bold">Deploy Now</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter text-growmax-black" data-testid="text-cta-title">
            Enterprise features.<br/>Startup simplicity.<br/>$199/mo.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10">
            Stop paying enterprise prices for capabilities you can get at a fraction of the cost. Deploy ARC today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://app.growmaxai.com/register" target="_blank" rel="noopener noreferrer">
              <Button className="bg-growmax-red hover:bg-growmax-black text-white h-14 px-10 text-lg rounded-none transition-all font-bold" data-testid="button-cta-trial">
                Start Free Trial
              </Button>
            </a>
            <Link href="/demo">
              <Button className="bg-white hover:bg-growmax-black hover:text-white text-growmax-black h-14 px-10 text-lg rounded-none transition-all font-bold border-2 border-growmax-black" data-testid="button-cta-demo">
                Book a Demo <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
