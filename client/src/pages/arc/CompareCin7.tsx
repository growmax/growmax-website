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
    { feature: "Multi-Currency Support", growmax: true, competitor: true },
    { feature: "Re-Order Automation", growmax: true, competitor: false },
    { feature: "Quote-to-Order Workflow", growmax: true, competitor: false },
  ]},
  { category: "Inventory & Warehouse", items: [
    { feature: "Real-Time Inventory Sync", growmax: true, competitor: true },
    { feature: "Multi-Warehouse Support", growmax: true, competitor: true },
    { feature: "Low Stock Threshold Alerts", growmax: true, competitor: true },
    { feature: "Inventory Allocation Logic", growmax: true, competitor: true },
    { feature: "Stock Transfer Between Warehouses", growmax: true, competitor: true },
    { feature: "Batch / Lot Tracking", growmax: false, competitor: true },
  ]},
  { category: "Integrations", items: [
    { feature: "Native Zoho Integration", growmax: true, competitor: false },
    { feature: "QuickBooks Integration", growmax: true, competitor: true },
    { feature: "Xero Integration", growmax: false, competitor: true },
    { feature: "SAP / ERP Connectivity", growmax: true, competitor: false },
    { feature: "Shopify / WooCommerce Sync", growmax: false, competitor: true },
    { feature: "API Access", growmax: true, competitor: true },
    { feature: "Webhook Support", growmax: true, competitor: true },
  ]},
  { category: "Sales & CRM", items: [
    { feature: "Opportunity Pipeline Management", growmax: true, competitor: false },
    { feature: "Visit Logging & Field Data Capture", growmax: true, competitor: false },
    { feature: "Account-Level Price Matrices", growmax: true, competitor: true },
    { feature: "Partner Portal", growmax: true, competitor: false },
    { feature: "Reporting Dashboards", growmax: true, competitor: true },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "$199/mo", competitor: "$349/mo" },
  { label: "Additional Users", growmax: "$29/user/mo", competitor: "Included (limited)" },
  { label: "Free Trial", growmax: "14 days", competitor: "14 days" },
  { label: "Setup Fee", growmax: "$0", competitor: "$0" },
  { label: "Mobile App Included", growmax: "Yes", competitor: "No" },
  { label: "Enterprise Tier", growmax: "Custom", competitor: "$999/mo" },
];

export default function CompareCin7() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Growmax ARC vs Cin7 | B2B Commerce & Inventory Comparison"
        description="Compare Growmax ARC and Cin7 feature-by-feature. See why B2B distributors choose ARC for native Zoho integration, offline field sales, partner commerce, and purpose-built B2B ordering."
        path="/arc/compare/cin7"
        structuredData={webPageSchema({
          title: "Growmax ARC vs Cin7 | B2B Commerce & Inventory Comparison",
          description: "Compare Growmax ARC and Cin7 feature-by-feature. See why B2B distributors choose ARC for native Zoho integration, offline field sales, and partner commerce.",
          path: "/arc/compare/cin7",
          keywords: ["Cin7 alternative", "Cin7 vs Growmax", "B2B ordering platform comparison", "inventory management B2B", "distributor commerce platform"],
        })}
      />
      <section className="pt-32 pb-24 border-b border-gray-200 bg-grid-pattern relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="mb-6">
              <Breadcrumbs items={[
                { label: "ARC", href: "/arc" },
                { label: "ARC vs Cin7" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // ARC vs Cin7
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Growmax ARC vs<br/>
              Cin7.<br/>
              <span className="text-gray-400">Feature-by-feature.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              Cin7 is an inventory management platform with basic B2B ordering. Growmax ARC is a purpose-built B2B commerce platform with native ERP integration, offline field sales, and partner commerce. Here's how they compare for distributors.
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
              <div className="md:hidden font-mono text-xs text-gray-500 mb-2">Scroll to compare →</div>
              <div className="overflow-x-auto">
              <div className="border border-gray-800 min-w-[600px]">
                <div className="grid grid-cols-3 border-b border-gray-800 bg-gray-900">
                  <div className="p-4 font-mono text-xs text-gray-400 uppercase">Feature</div>
                  <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-gray-800">Growmax ARC</div>
                  <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Cin7</div>
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
              <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Cin7</div>
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
              <h3 className="text-xl font-bold tracking-tight mb-6 text-growmax-black">B2B Commerce-First Integration</h3>
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
              <div className="font-mono text-xs text-gray-500 uppercase mb-4 tracking-widest font-bold">Cin7</div>
              <h3 className="text-xl font-bold tracking-tight mb-6 text-gray-600">Inventory-Centric Integrations</h3>
              <div className="space-y-4">
                {[
                  { icon: <DollarSign className="w-5 h-5" />, label: "QuickBooks / Xero — Accounting sync" },
                  { icon: <Globe className="w-5 h-5" />, label: "Shopify / WooCommerce — DTC channel sync" },
                  { icon: <Globe className="w-5 h-5" />, label: "Amazon / eBay — Marketplace connectors" },
                  { icon: <Globe className="w-5 h-5" />, label: "API Access — Available on higher tiers" },
                  { icon: <X className="w-5 h-5" />, label: "No Zoho native integration" },
                  { icon: <X className="w-5 h-5" />, label: "No SAP / industrial ERP connectors" },
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
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Growmax ARC Wins for B2B Distribution</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-testid="section-why-growmax-wins">
            {[
              {
                number: "01",
                title: "B2B Commerce, Not Just Inventory",
                description: "Cin7 is an inventory management system that added a basic B2B portal. ARC is a purpose-built B2B commerce platform with customer-specific pricing, quote workflows, partner portals, and field sales tools. Commerce is the core, not an afterthought."
              },
              {
                number: "02",
                title: "Offline Field Sales App",
                description: "Cin7 has no mobile app for field sales reps. ARC provides native iOS/Android apps with offline ordering, GPS visit logging, customer-specific catalogs, and route planning — essential for distributors with road warriors."
              },
              {
                number: "03",
                title: "Native Zoho & SAP Integration",
                description: "Cin7 integrates well with Shopify and WooCommerce (DTC channels) but has no Zoho or SAP connectors. ARC connects natively to Zoho Inventory, SAP, and QuickBooks — the ERPs distributors actually use."
              },
              {
                number: "04",
                title: "Partner Commerce Portal",
                description: "ARC includes a full partner portal for dealers and resellers to self-serve: place orders, track shipments, view pricing, and manage their accounts. Cin7 has no partner or channel management capabilities."
              },
              {
                number: "05",
                title: "Quote-to-Order Workflow",
                description: "Industrial distributors live on quotes. ARC supports the full quotation lifecycle with approval routing, margin calculations, and one-click conversion to orders. Cin7 handles direct ordering only."
              },
              {
                number: "06",
                title: "Lower Cost for B2B Commerce",
                description: "Cin7 starts at $349/mo and focuses on inventory. ARC starts at $199/mo and delivers a complete B2B commerce experience. You get more B2B-specific functionality at a lower price point."
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
                <p className="text-sm text-gray-600 font-light leading-relaxed">See how ARC compares to B2B Wave's QuickBooks-centric wholesale ordering platform.</p>
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
            Go beyond Cin7.<br/>Deploy ARC today.
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