import { Link } from "wouter";
import { Check, X, ArrowRight, Zap, Globe, Smartphone, Database, DollarSign, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { category: "Ordering & Commerce", items: [
    { feature: "B2B Customer Portal", growmax: true, competitor: true },
    { feature: "Offline Mobile Order-Taking App", growmax: true, competitor: false },
    { feature: "Field Sales Rep App (iOS/Android)", growmax: true, competitor: false },
    { feature: "Customer-Specific Pricing", growmax: true, competitor: true },
    { feature: "Multi-Currency Support", growmax: true, competitor: true },
    { feature: "Re-Order Automation", growmax: true, competitor: false },
    { feature: "Quote-to-Order Workflow", growmax: true, competitor: false },
  ]},
  { category: "Inventory & Warehouse", items: [
    { feature: "Real-Time Inventory Sync", growmax: true, competitor: true },
    { feature: "Multi-Warehouse Support", growmax: true, competitor: false },
    { feature: "Low Stock Threshold Alerts", growmax: true, competitor: false },
    { feature: "Inventory Allocation Logic", growmax: true, competitor: false },
    { feature: "Excel Bulk Import/Export", growmax: true, competitor: true },
  ]},
  { category: "Integrations", items: [
    { feature: "Native Zoho Integration", growmax: true, competitor: false },
    { feature: "QuickBooks Integration", growmax: true, competitor: true },
    { feature: "SAP / ERP Connectivity", growmax: true, competitor: false },
    { feature: "Xero Integration", growmax: false, competitor: true },
    { feature: "API Access", growmax: true, competitor: true },
    { feature: "Webhook Support", growmax: true, competitor: false },
  ]},
  { category: "Sales & CRM", items: [
    { feature: "Opportunity Pipeline Management", growmax: true, competitor: false },
    { feature: "Visit Logging & Field Data Capture", growmax: true, competitor: false },
    { feature: "Account-Level Price Matrices", growmax: true, competitor: false },
    { feature: "Partner Portal", growmax: true, competitor: false },
    { feature: "Reporting Dashboards", growmax: true, competitor: true },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "$199/mo", competitor: "$249/mo" },
  { label: "Additional Users", growmax: "$29/user/mo", competitor: "$50/user/mo" },
  { label: "Free Trial", growmax: "14 days", competitor: "14 days" },
  { label: "Setup Fee", growmax: "$0", competitor: "$0" },
  { label: "Mobile App Included", growmax: "Yes", competitor: "No (add-on)" },
  { label: "Enterprise Tier", growmax: "Custom", competitor: "Custom" },
];

export default function CompareB2BWave() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <section className="pt-32 pb-24 border-b border-gray-200 bg-grid-pattern relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // ARC vs B2B Wave
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Growmax ARC vs<br/>
              B2B Wave.<br/>
              <span className="text-gray-400">Feature-by-feature.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              B2B Wave focuses on QuickBooks-centric eCommerce. Growmax ARC delivers a complete distributor operating system — native Zoho sync, offline field sales app, multi-warehouse intelligence, and partner commerce.
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
                  <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">B2B Wave</div>
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
              <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">B2B Wave</div>
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
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Integration Architecture</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Integration Capabilities</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-growmax-black p-8" data-testid="card-integration-growmax">
              <div className="font-mono text-xs text-growmax-red uppercase mb-4 tracking-widest font-bold">Growmax ARC</div>
              <h3 className="text-xl font-bold tracking-tight mb-6 text-growmax-black">Multi-System Native Sync</h3>
              <div className="space-y-4">
                {[
                  { icon: <Database className="w-5 h-5" />, label: "Zoho Inventory — Native 2-way sync" },
                  { icon: <Plug className="w-5 h-5" />, label: "SAP / ERP — JCo connector available" },
                  { icon: <DollarSign className="w-5 h-5" />, label: "QuickBooks — Order & invoice sync" },
                  { icon: <Globe className="w-5 h-5" />, label: "REST API — Full programmatic access" },
                  { icon: <Zap className="w-5 h-5" />, label: "Webhooks — Real-time event triggers" },
                  { icon: <Smartphone className="w-5 h-5" />, label: "Mobile SDK — Offline-first architecture" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <span className="text-growmax-red">{item.icon}</span>
                    <span className="font-mono text-sm text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gray-300 p-8 bg-gray-50" data-testid="card-integration-competitor">
              <div className="font-mono text-xs text-gray-500 uppercase mb-4 tracking-widest font-bold">B2B Wave</div>
              <h3 className="text-xl font-bold tracking-tight mb-6 text-gray-600">QuickBooks-Centric</h3>
              <div className="space-y-4">
                {[
                  { icon: <DollarSign className="w-5 h-5" />, label: "QuickBooks Online — Primary integration" },
                  { icon: <DollarSign className="w-5 h-5" />, label: "Xero — Accounting sync" },
                  { icon: <Globe className="w-5 h-5" />, label: "Basic API — Limited endpoints" },
                  { icon: <X className="w-5 h-5" />, label: "No Zoho integration" },
                  { icon: <X className="w-5 h-5" />, label: "No SAP / ERP connectors" },
                  { icon: <X className="w-5 h-5" />, label: "No mobile SDK or offline support" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 border-b border-gray-200 pb-3">
                    <span className="text-gray-400">{item.icon}</span>
                    <span className="font-mono text-sm text-gray-500">{item.label}</span>
                  </div>
                ))}
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
                title: "Native Zoho Ecosystem",
                description: "B2B Wave was built around QuickBooks. If your operations run on Zoho, you'll always be fighting upstream. ARC was engineered for Zoho from day one — bidirectional, real-time, zero middleware."
              },
              {
                number: "02",
                title: "Offline Field Sales App",
                description: "B2B Wave has no mobile app for field reps. ARC gives your sales team iOS/Android apps with offline order creation, customer-specific pricing, and visit logging — even without connectivity."
              },
              {
                number: "03",
                title: "Multi-Warehouse Intelligence",
                description: "B2B Wave tracks inventory from a single source. ARC manages stock across multiple warehouses with intelligent allocation logic, ensuring you never oversell or misallocate."
              },
              {
                number: "04",
                title: "Partner Commerce Portal",
                description: "ARC includes a full partner engagement portal for channel partners to place orders, track deliveries, and manage their accounts. B2B Wave has no partner-specific functionality."
              },
              {
                number: "05",
                title: "Quote-to-Order Workflow",
                description: "ARC supports the full quotation lifecycle — create, approve, convert to order. B2B Wave only handles direct ordering with no quotation management capabilities."
              },
              {
                number: "06",
                title: "Lower Cost, More Value",
                description: "At $199/mo with a mobile app included, ARC delivers more functionality at a lower price point than B2B Wave's $249/mo base tier which charges extra for mobile capabilities."
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

      <section className="py-32 text-center bg-white">
        <div className="container mx-auto px-4">
          <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-6 font-bold">Deploy Now</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter text-growmax-black" data-testid="text-cta-title">
            Switch from B2B Wave.<br/>Deploy ARC today.
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