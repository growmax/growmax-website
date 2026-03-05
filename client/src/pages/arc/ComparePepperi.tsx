import { Link } from "wouter";
import { Check, X, ArrowRight, Zap, Globe, Smartphone, Database, DollarSign, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    { feature: "SAP Integration", growmax: true, competitor: true },
    { feature: "Salesforce Integration", growmax: false, competitor: true },
    { feature: "Microsoft Dynamics", growmax: false, competitor: true },
    { feature: "QuickBooks Integration", growmax: true, competitor: false },
    { feature: "REST API Access", growmax: true, competitor: true },
  ]},
  { category: "Sales Operations", items: [
    { feature: "Opportunity Pipeline Management", growmax: true, competitor: false },
    { feature: "Visit Logging & Route Planning", growmax: true, competitor: true },
    { feature: "Partner/Dealer Portal", growmax: true, competitor: false },
    { feature: "Reporting Dashboards", growmax: true, competitor: true },
    { feature: "Custom Forms & Surveys", growmax: false, competitor: true },
    { feature: "Merchandising / Planogram", growmax: false, competitor: true },
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
];

export default function ComparePepperi() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <section className="pt-32 pb-24 border-b border-gray-200 bg-grid-pattern relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl">
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
              Pepperi is a complex enterprise CPG platform built for large consumer goods companies. Growmax ARC delivers the same core capabilities — simpler, cheaper, and faster to deploy — purpose-built for industrial distributors.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Feature Matrix</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Complete Comparison</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          {features.map((group, gi) => (
            <div key={gi} className="mb-12" data-testid={`section-features-${gi}`}>
              <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">
                {group.category}
              </div>
              <div className="border border-gray-800">
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

          <div className="border border-growmax-black" data-testid="section-pricing-comparison">
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
                  { time: "Day 3", label: "Connect Zoho integration" },
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

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Verdict</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Growmax ARC Wins</h2>
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
                description: "Pepperi requires weeks of scoping, configuration, and professional services. ARC is self-service — sign up, import your catalog, connect Zoho, and go live in a single day."
              },
              {
                number: "03",
                icon: <Database className="w-8 h-8" />,
                title: "Native Zoho Ecosystem",
                description: "Pepperi integrates with Salesforce and SAP but has no Zoho connectivity. If your business runs on Zoho, ARC is the only platform with native, real-time bidirectional sync."
              },
              {
                number: "04",
                icon: <Users className="w-8 h-8" />,
                title: "Built for Distributors",
                description: "Pepperi was designed for CPG brands and consumer goods companies. ARC was purpose-built for industrial distributors — multi-warehouse, partner portals, and B2B pricing logic are native, not bolt-ons."
              },
              {
                number: "05",
                icon: <Zap className="w-8 h-8" />,
                title: "No Vendor Lock-In",
                description: "ARC operates on monthly billing with full data export. No annual contracts, no proprietary data formats, no exit fees. Pepperi typically requires multi-year commitments."
              },
              {
                number: "06",
                icon: <Globe className="w-8 h-8" />,
                title: "Partner Commerce Included",
                description: "ARC includes a full partner/dealer portal for channel commerce out of the box. Pepperi's partner-facing features require additional modules and enterprise licensing."
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