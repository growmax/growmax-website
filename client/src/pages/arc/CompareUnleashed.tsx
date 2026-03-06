import { Link } from "wouter";
import { Check, X, ArrowRight, Zap, Globe, Smartphone, Database, DollarSign, Clock, Users } from "lucide-react";
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
    { feature: "Re-Order Automation", growmax: true, competitor: true },
    { feature: "Quote-to-Order Workflow", growmax: true, competitor: false },
    { feature: "5-Minute Self-Service Setup", growmax: true, competitor: false },
  ]},
  { category: "Inventory & Warehouse", items: [
    { feature: "Real-Time Inventory Sync", growmax: true, competitor: true },
    { feature: "Multi-Warehouse Support", growmax: true, competitor: true },
    { feature: "Low Stock Threshold Alerts", growmax: true, competitor: true },
    { feature: "Inventory Allocation Logic", growmax: true, competitor: true },
    { feature: "Serial & Batch Tracking", growmax: true, competitor: true },
    { feature: "BOM / Assembly Management", growmax: false, competitor: true },
  ]},
  { category: "Integrations", items: [
    { feature: "Native Zoho Integration", growmax: true, competitor: false },
    { feature: "Xero Accounting Integration", growmax: true, competitor: true },
    { feature: "QuickBooks Integration", growmax: true, competitor: true },
    { feature: "Shopify / eCommerce Connector", growmax: false, competitor: true },
    { feature: "SAP / ERP Connectivity", growmax: true, competitor: false },
    { feature: "REST API Access", growmax: true, competitor: true },
  ]},
  { category: "Sales Operations", items: [
    { feature: "Opportunity Pipeline Management", growmax: true, competitor: false },
    { feature: "Visit Logging & Route Planning", growmax: true, competitor: false },
    { feature: "Partner/Dealer Portal", growmax: true, competitor: false },
    { feature: "Reporting Dashboards", growmax: true, competitor: true },
    { feature: "Production Planning", growmax: false, competitor: true },
    { feature: "Purchase Order Management", growmax: true, competitor: true },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "$199/mo", competitor: "$349/mo (Medium plan)" },
  { label: "Additional Users", growmax: "$29/user/mo", competitor: "Included (plan-based)" },
  { label: "Free Trial", growmax: "14 days, self-service", competitor: "14 days" },
  { label: "Setup Fee", growmax: "$0", competitor: "$0" },
  { label: "Implementation Time", growmax: "Same day", competitor: "2–4 weeks" },
  { label: "Contract Minimum", growmax: "Monthly", competitor: "Annual" },
  { label: "Total Year 1 Cost (5 users)", growmax: "~$4,100", competitor: "~$5,500+" },
];

export default function CompareUnleashed() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Growmax ARC vs Unleashed | B2B Commerce Alternative"
        description="Compare Growmax ARC and Unleashed for B2B distribution. Purpose-built distributor commerce with field sales apps, offline ordering, and native Zoho integration vs inventory-focused platform."
        path="/arc/compare/unleashed"
        structuredData={webPageSchema({
          title: "Growmax ARC vs Unleashed | B2B Commerce Alternative",
          description: "Compare Growmax ARC and Unleashed for B2B distribution. Purpose-built distributor commerce with field sales apps, offline ordering, and native Zoho integration vs inventory-focused platform.",
          path: "/arc/compare/unleashed",
          keywords: ["Unleashed alternative", "Unleashed competitor", "B2B distribution platform", "inventory management alternative", "Unleashed vs Growmax"],
        })}
      />
      <section className="pt-32 pb-24 border-b border-gray-200 bg-grid-pattern relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="mb-6">
              <Breadcrumbs items={[
                { label: "ARC", href: "/arc" },
                { label: "ARC vs Unleashed" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // ARC vs Unleashed
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Growmax ARC vs<br/>
              Unleashed.<br/>
              <span className="text-gray-400">Commerce-first,<br/>not inventory-first.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              Unleashed is a powerful inventory management platform designed for product businesses. Growmax ARC is a purpose-built B2B commerce platform for industrial distributors — with field sales apps, offline ordering, and native ERP integration that Unleashed simply doesn't offer.
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
                  <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Unleashed</div>
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
              <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Unleashed</div>
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
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-2 font-bold">Key Difference</div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Unleashed is primarily an inventory management system that requires additional tools (like Shopify or a separate B2B portal) for commerce. Growmax ARC is an all-in-one B2B commerce platform with built-in inventory sync, field sales apps, and customer portals — eliminating the need for multiple subscriptions.
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
              <div className="font-mono text-xs text-gray-500 uppercase mb-4 tracking-widest font-bold">Unleashed</div>
              <div className="space-y-6">
                {[
                  { time: "Week 1", label: "Account setup & data mapping" },
                  { time: "Week 2", label: "Product & inventory import" },
                  { time: "Week 3", label: "Integration configuration (Xero, Shopify, etc.)" },
                  { time: "Week 4", label: "Testing, training & go-live" },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="font-mono text-xs text-gray-400 font-bold min-w-[80px]">{step.time}</div>
                    <div className="flex-1 border-b border-gray-200 pb-3">
                      <span className="font-mono text-sm text-gray-500">{step.label}</span>
                    </div>
                  </div>
                ))}
                <div className="bg-gray-200 text-gray-500 p-4 font-mono text-sm text-center font-bold">
                  <Clock className="w-4 h-4 inline mr-2" /> LIVE IN 2–4 WEEKS
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
                icon: <Smartphone className="w-8 h-8" />,
                title: "Mobile Field Sales App",
                description: "Unleashed has no mobile app for field sales reps. ARC includes iOS and Android apps with offline ordering, GPS visit logging, and customer-specific pricing — essential for distributors with outside sales teams."
              },
              {
                number: "02",
                icon: <Globe className="w-8 h-8" />,
                title: "All-In-One B2B Commerce",
                description: "Unleashed focuses on inventory management and requires Shopify or other platforms for B2B commerce. ARC is a complete B2B commerce platform with built-in customer portals, ordering, and inventory — one subscription, one login."
              },
              {
                number: "03",
                icon: <Database className="w-8 h-8" />,
                title: "Native Zoho & SAP Integration",
                description: "Unleashed integrates primarily with Xero and QuickBooks. If your business runs on Zoho or SAP, ARC is the only platform with native, real-time bidirectional sync — no middleware needed."
              },
              {
                number: "04",
                icon: <Users className="w-8 h-8" />,
                title: "Partner Commerce Portal",
                description: "ARC includes a full partner/dealer portal where channel partners place orders, track deliveries, and manage accounts independently. Unleashed has no partner-facing commerce capabilities."
              },
              {
                number: "05",
                icon: <DollarSign className="w-8 h-8" />,
                title: "Complex B2B Pricing",
                description: "ARC handles multi-tier pricing matrices, volume brackets, SPAs, and customer-specific discount structures natively. Unleashed's pricing engine is designed for simpler product businesses, not industrial distribution."
              },
              {
                number: "06",
                icon: <Zap className="w-8 h-8" />,
                title: "Quote-to-Order Workflows",
                description: "ARC includes a full quote management system with approval workflows, revision tracking, and automatic order conversion. Unleashed requires third-party tools for quoting and CPQ functionality."
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
                <p className="text-sm text-gray-600 font-light leading-relaxed">Feature-by-feature comparison against B2B Wave's QuickBooks-centric eCommerce platform.</p>
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

            <Link href="/comparisons/tradegecko-alternatives">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-tradegecko-alternatives">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Alternatives</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">TradeGecko Alternatives</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Compare the best TradeGecko alternatives for inventory and B2B commerce.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Read Comparison <ArrowRight className="w-3 h-3" /></div>
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
            Commerce-first.<br/>Not inventory-first.<br/>$199/mo.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10">
            Stop stitching together inventory tools and commerce add-ons. Deploy ARC — a complete B2B commerce platform — today.
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