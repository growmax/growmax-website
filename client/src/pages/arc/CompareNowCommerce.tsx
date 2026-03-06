import { Link } from "wouter";
import { Check, X, ArrowRight, Zap, Globe, Smartphone, Database, DollarSign, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema } from "@/lib/structuredData";

const features = [
  { category: "Ordering & Commerce", items: [
    { feature: "B2B Customer Portal", growmax: true, competitor: true },
    { feature: "Offline Mobile Order-Taking App", growmax: true, competitor: false },
    { feature: "Field Sales Rep App (iOS/Android)", growmax: true, competitor: false },
    { feature: "Customer-Specific Pricing", growmax: true, competitor: true },
    { feature: "Multi-Currency Support", growmax: true, competitor: false },
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
    { feature: "QuickBooks Desktop Integration", growmax: true, competitor: true },
    { feature: "QuickBooks Online Integration", growmax: true, competitor: false },
    { feature: "SAP / ERP Connectivity", growmax: true, competitor: false },
    { feature: "API Access", growmax: true, competitor: false },
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
  { label: "Starting Price", growmax: "$199/mo", competitor: "$99/mo" },
  { label: "Additional Users", growmax: "$29/user/mo", competitor: "$39/user/mo" },
  { label: "Free Trial", growmax: "14 days", competitor: "30 days" },
  { label: "Setup Fee", growmax: "$0", competitor: "$0" },
  { label: "Mobile App Included", growmax: "Yes", competitor: "No" },
  { label: "Enterprise Tier", growmax: "Custom", competitor: "N/A" },
];

export default function CompareNowCommerce() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Growmax ARC vs NowCommerce | B2B Ordering Platform Comparison"
        description="Compare Growmax ARC and NowCommerce feature-by-feature. See why distributors choose ARC for native Zoho integration, offline field sales, multi-warehouse intelligence, and beyond-QuickBooks ERP support."
        path="/arc/compare/nowcommerce"
        structuredData={webPageSchema({
          title: "Growmax ARC vs NowCommerce | B2B Ordering Platform Comparison",
          description: "Compare Growmax ARC and NowCommerce feature-by-feature. See why distributors choose ARC for native Zoho integration, offline field sales, and multi-warehouse intelligence.",
          path: "/arc/compare/nowcommerce",
          keywords: ["NowCommerce alternative", "NowCommerce vs Growmax", "B2B ordering platform comparison", "QuickBooks B2B ordering", "distributor commerce platform"],
        })}
      />
      <section className="pt-32 pb-24 border-b border-gray-200 bg-grid-pattern relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="mb-6">
              <Breadcrumbs items={[
                { label: "ARC", href: "/arc" },
                { label: "ARC vs NowCommerce" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // ARC vs NowCommerce
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Growmax ARC vs<br/>
              NowCommerce.<br/>
              <span className="text-gray-400">Feature-by-feature.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              NowCommerce is a lightweight QuickBooks Desktop ordering add-on. Growmax ARC delivers a complete distributor operating system — native Zoho sync, offline field sales app, multi-warehouse intelligence, and partner commerce. Here's how they compare.
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
                  <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">NowCommerce</div>
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
              <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">NowCommerce</div>
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
                  { icon: <DollarSign className="w-5 h-5" />, label: "QuickBooks — Desktop & Online sync" },
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
              <div className="font-mono text-xs text-gray-500 uppercase mb-4 tracking-widest font-bold">NowCommerce</div>
              <h3 className="text-xl font-bold tracking-tight mb-6 text-gray-600">QuickBooks Desktop Only</h3>
              <div className="space-y-4">
                {[
                  { icon: <DollarSign className="w-5 h-5" />, label: "QuickBooks Desktop — Primary integration" },
                  { icon: <X className="w-5 h-5" />, label: "No QuickBooks Online support" },
                  { icon: <X className="w-5 h-5" />, label: "No Zoho integration" },
                  { icon: <X className="w-5 h-5" />, label: "No SAP / ERP connectors" },
                  { icon: <X className="w-5 h-5" />, label: "No API access" },
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
                title: "Beyond QuickBooks Desktop",
                description: "NowCommerce is tied entirely to QuickBooks Desktop — a platform Microsoft is phasing out. ARC connects to Zoho, SAP, QuickBooks Online, and any ERP via REST API. Your commerce platform should outlive your accounting software."
              },
              {
                number: "02",
                title: "Offline Field Sales App",
                description: "NowCommerce has no mobile app. ARC gives your sales team native iOS/Android apps with offline order creation, customer-specific pricing, GPS visit logging, and route planning — even without internet connectivity."
              },
              {
                number: "03",
                title: "Multi-Warehouse Intelligence",
                description: "NowCommerce pulls inventory from a single QuickBooks file. ARC manages stock across multiple warehouses with intelligent allocation logic, regional routing, and automated low-stock alerts."
              },
              {
                number: "04",
                title: "Partner Commerce Portal",
                description: "ARC includes a full partner portal where channel partners, dealers, and resellers place orders, track shipments, and manage their accounts. NowCommerce has no partner or channel management features."
              },
              {
                number: "05",
                title: "Quote-to-Order Workflow",
                description: "ARC supports the full quotation lifecycle — create quotes, route for approval, convert to orders with margin tracking. NowCommerce only handles direct ordering with no quotation capabilities."
              },
              {
                number: "06",
                title: "Enterprise-Ready, SMB-Friendly",
                description: "NowCommerce caps out at basic ordering. ARC scales from 100 to 100,000 SKUs with complex pricing, custom workflows, and enterprise-grade security — while remaining simple enough for small teams to deploy in weeks."
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

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Related Architecture</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Explore More</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-testid="section-related-links">
            <Link href="/arc/compare/b2b-wave">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-compare-b2bwave">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Comparison</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">ARC vs B2B Wave</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">See how ARC compares to B2B Wave's QuickBooks-centric wholesale platform.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Read Comparison <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/arc/compare/pepperi">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-compare-pepperi">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Comparison</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">ARC vs Pepperi</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">See how ARC stacks up against Pepperi's enterprise CPG platform — at a fraction of the cost.</p>
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

      <section className="py-32 text-center bg-white">
        <div className="container mx-auto px-4">
          <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-6 font-bold">Deploy Now</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter text-growmax-black" data-testid="text-cta-title">
            Outgrow NowCommerce.<br/>Deploy ARC today.
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