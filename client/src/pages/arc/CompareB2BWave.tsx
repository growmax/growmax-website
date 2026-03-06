import { Link } from "wouter";
import { Check, X, ArrowRight, Zap, Globe, Smartphone, Database, DollarSign, Plug, TrendingUp, Shield, Users } from "lucide-react";
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
    { feature: "Multi-Channel Order Capture", growmax: true, competitor: false },
    { feature: "Barcode/QR Scanning", growmax: true, competitor: false },
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
    { feature: "Xero Integration", growmax: true, competitor: true },
    { feature: "SAP / ERP Connectivity", growmax: true, competitor: false },
    { feature: "API Access", growmax: true, competitor: true },
    { feature: "Webhook Support", growmax: true, competitor: false },
  ]},
  { category: "Sales & CRM", items: [
    { feature: "Opportunity Pipeline Management", growmax: true, competitor: false },
    { feature: "Visit Logging & Field Data Capture", growmax: true, competitor: false },
    { feature: "AI-Powered Product Recommendations", growmax: true, competitor: false },
    { feature: "Account-Level Price Matrices", growmax: true, competitor: false },
    { feature: "Partner/Dealer Portal", growmax: true, competitor: false },
    { feature: "Reporting Dashboards", growmax: true, competitor: true },
  ]},
  { category: "Marketing & Catalog", items: [
    { feature: "Wholesale Marketing Tools", growmax: true, competitor: true },
    { feature: "Customer-Specific Product Catalogs", growmax: true, competitor: true },
    { feature: "B2B Dropshipping Support", growmax: true, competitor: true },
    { feature: "Wholesale Website Builder", growmax: true, competitor: true },
    { feature: "Custom Branding / White-Label", growmax: true, competitor: true },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "$199/mo", competitor: "$249/mo" },
  { label: "Additional Users", growmax: "$29/user/mo", competitor: "$50/user/mo" },
  { label: "Free Trial", growmax: "14 days", competitor: "14 days" },
  { label: "Setup Fee", growmax: "$0", competitor: "$0" },
  { label: "Mobile App Included", growmax: "Yes", competitor: "No (add-on)" },
  { label: "Multi-Warehouse", growmax: "Included", competitor: "Not available" },
  { label: "Enterprise Tier", growmax: "Custom", competitor: "Custom" },
  { label: "Total Year 1 Cost (5 users)", growmax: "~$4,100", competitor: "~$5,990+" },
];

const faqItems = [
  {
    question: "Is Growmax ARC a good alternative to B2B Wave?",
    answer: "Yes. Growmax ARC provides everything B2B Wave offers — B2B eCommerce portal, customer-specific pricing, QuickBooks integration, and wholesale ordering — plus capabilities B2B Wave doesn't have: offline mobile ordering app, multi-warehouse inventory management, opportunity pipeline, partner portals, and AI-powered product recommendations. ARC also starts at $199/mo vs B2B Wave's $249/mo."
  },
  {
    question: "Can Growmax ARC integrate with QuickBooks like B2B Wave?",
    answer: "Yes. Growmax ARC provides native QuickBooks integration for order and invoice sync, just like B2B Wave. ARC additionally integrates with Zoho (full bidirectional sync) and Xero, giving you more accounting platform options. ARC also supports SAP and ERP connectivity for businesses that outgrow SMB accounting software."
  },
  {
    question: "Does Growmax ARC support wholesale marketing and branding?",
    answer: "Yes. ARC includes wholesale marketing tools, custom-branded portals, and customer-specific product catalogs. Unlike B2B Wave which focuses primarily on the ordering portal, ARC extends into sales force automation with pipeline management, field sales apps, and partner engagement — giving you marketing and sales capabilities in one platform."
  },
  {
    question: "What does Growmax ARC have that B2B Wave doesn't?",
    answer: "The biggest differences are: (1) Offline mobile ordering app for field sales reps — B2B Wave has no mobile app; (2) Multi-warehouse inventory management with allocation logic; (3) Opportunity pipeline management and visit logging; (4) Partner/dealer portal for channel commerce; (5) AI-powered product recommendations for cross-selling; (6) Native Zoho integration. These capabilities make ARC a complete distributor operating system rather than just an ordering portal."
  },
  {
    question: "Can I switch from B2B Wave to Growmax ARC?",
    answer: "Yes. Growmax ARC supports bulk data import for products, customers, pricing, and order history via Excel. Most businesses can migrate from B2B Wave to ARC within a few days. Since both platforms integrate with QuickBooks and offer monthly billing, you can run them in parallel during transition with no long-term commitment."
  },
  {
    question: "Is B2B Wave better for wholesale eCommerce?",
    answer: "B2B Wave is a solid choice for wholesale businesses that primarily need an online ordering portal connected to QuickBooks. However, if you also need field sales capabilities (mobile app, offline ordering), multi-warehouse management, or sales pipeline tools, Growmax ARC provides significantly more functionality at a lower price point. B2B Wave is a portal; ARC is a platform."
  },
];

export default function CompareB2BWave() {
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
        title="Growmax ARC vs B2B Wave (2026) | Feature, Pricing & Integration Comparison"
        description="Detailed comparison of Growmax ARC and B2B Wave for wholesale B2B eCommerce. Compare features, pricing, integrations, and mobile capabilities. See why distributors switch from B2B Wave to ARC."
        path="/arc/compare/b2b-wave"
        structuredData={webPageSchema({
          title: "Growmax ARC vs B2B Wave | B2B Ordering Platform Comparison",
          description: "Detailed comparison of Growmax ARC and B2B Wave for wholesale B2B eCommerce. Compare features, pricing, integrations, and mobile capabilities.",
          path: "/arc/compare/b2b-wave",
          keywords: ["B2B Wave alternative", "B2B Wave competitor", "B2B Wave vs Growmax", "B2B ordering platform comparison", "wholesale ecommerce platform", "B2B ecommerce website", "wholesale website builder", "B2B sales platform"],
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
                { label: "ARC vs B2B Wave" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // ARC vs B2B Wave
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Growmax ARC vs<br/>
              B2B Wave.<br/>
              <span className="text-gray-400">Portal vs Platform.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              B2B Wave is a solid wholesale ordering portal. Growmax ARC is a complete distributor operating system — self-service portal, offline field sales app, multi-warehouse inventory, partner commerce, and AI-powered sales intelligence. Same price range. Vastly different capabilities.
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
                  "You need field sales reps with mobile ordering (offline capable)",
                  "You manage inventory across multiple warehouses",
                  "You want pipeline management and sales intelligence built in",
                  "You sell through channel partners or dealers",
                  "You need quote-to-order workflows, not just direct ordering",
                  "You want to pay less and get more features",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-growmax-red flex-shrink-0 mt-0.5" />
                    <span className="font-mono text-sm text-growmax-black">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-gray-300 p-8 bg-gray-50" data-testid="card-choose-b2bwave">
              <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4 font-bold">Choose B2B Wave If</div>
              <ul className="space-y-4">
                {[
                  "You only need a basic online ordering portal (no field sales)",
                  "Your inventory is in a single warehouse location",
                  "QuickBooks Online is your primary system and you want simple sync",
                  "You don't need sales pipeline or opportunity management",
                  "You want the simplest possible B2B storefront setup",
                  "B2B dropshipping is your primary business model",
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
            <p className="text-gray-400 font-light max-w-2xl">Side-by-side comparison across 30+ features including ordering, inventory, integrations, sales tools, and marketing capabilities.</p>
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

          <div className="mt-8 border border-growmax-red bg-red-50 p-6" data-testid="card-cost-highlight">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-2 font-bold">Value Analysis</div>
            <p className="text-sm text-gray-700 leading-relaxed">
              At $199/mo vs B2B Wave's $249/mo, Growmax ARC is $50/month cheaper at the base tier. But the real value gap is in what's included: ARC's base plan includes the mobile field sales app, multi-warehouse inventory, pipeline management, and partner portals — capabilities B2B Wave either charges extra for or doesn't offer at all. A 5-user ARC deployment saves approximately $1,900/year compared to the equivalent B2B Wave setup.
            </p>
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
                  { icon: <DollarSign className="w-5 h-5" />, label: "Xero — Full accounting integration" },
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
                  { icon: <X className="w-5 h-5" />, label: "No webhook event system" },
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

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Deep Dive</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">B2B Wave vs Growmax ARC: Detailed Analysis</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-growmax-black mb-4">B2B eCommerce Platform Approach</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-4">
                  B2B Wave positions itself as a <Link href="/blog/edi-vs-b2b-ecommerce-differences" className="text-growmax-red hover:underline font-medium">B2B eCommerce website</Link> builder — an online storefront where your wholesale customers log in and place orders. It does this well, with clean catalog management, customer-specific pricing, and QuickBooks sync.
                </p>
                <p className="text-gray-600 font-light leading-relaxed">
                  Growmax ARC goes further. Beyond the customer-facing portal, ARC includes tools your internal sales team needs: a mobile app for field reps, pipeline management for sales leadership, partner portals for channel commerce, and multi-warehouse inventory intelligence. It's the difference between giving your customers a website and giving your entire sales operation a platform.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight text-growmax-black mb-4">Wholesale Marketing & Customer Acquisition</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-4">
                  B2B Wave has strong <Link href="/blog/wholesale-marketing" className="text-growmax-red hover:underline font-medium">wholesale marketing</Link> positioning — they rank well for wholesale marketing keywords and provide content around marketing strategies for wholesalers. Their platform includes branded storefronts and basic B2B website builder functionality.
                </p>
                <p className="text-gray-600 font-light leading-relaxed">
                  Growmax ARC takes a <Link href="/blog/push-vs-pull-marketing-b2b-strategy" className="text-growmax-red hover:underline font-medium">push and pull marketing</Link> approach: the self-service portal serves as your pull channel (customers find and order from you online), while the mobile field sales app powers your push channel (reps take orders at customer sites). Combined with <Link href="/blog/ai-powered-product-recommendations-spare-parts" className="text-growmax-red hover:underline font-medium">AI-powered product recommendations</Link>, ARC drives both customer acquisition and order value growth.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight text-growmax-black mb-4">B2B Sales Platform Capabilities</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-4">
                  This is where the gap between B2B Wave and Growmax ARC is widest. B2B Wave is an ordering portal — customers place orders. ARC is a <Link href="/blog/b2b-sales-tips-strategies-distributors" className="text-growmax-red hover:underline font-medium">B2B sales platform</Link> — it manages the entire sales process from lead to order to fulfillment.
                </p>
                <p className="text-gray-600 font-light leading-relaxed">
                  ARC includes opportunity pipeline management, <Link href="/blog/automating-sales-pipeline-industrial-distributors" className="text-growmax-red hover:underline font-medium">sales pipeline automation</Link>, visit logging for field reps, and <Link href="/blog/crm-vs-sfa-sales-force-automation-guide" className="text-growmax-red hover:underline font-medium">sales force automation</Link> capabilities that B2B Wave doesn't offer. For distributors who need both customer-facing ordering and internal sales management, ARC eliminates the need for a separate CRM.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight text-growmax-black mb-4">B2B Order Management</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-4">
                  Both platforms handle <Link href="/blog/what-is-order-management" className="text-growmax-red hover:underline font-medium">B2B order management</Link>, but at different levels of sophistication. B2B Wave processes orders from its web portal and syncs them to QuickBooks. Growmax ARC processes orders from multiple channels — web portal, mobile app, field rep entry, and partner portal — and syncs them to QuickBooks, Zoho, Xero, or SAP.
                </p>
                <p className="text-gray-600 font-light leading-relaxed">
                  ARC also adds <Link href="/blog/quotation-to-order-process-converting-revenue" className="text-growmax-red hover:underline font-medium">quote-to-order workflows</Link> — critical for distributors who need to generate quotes before converting them to orders. B2B Wave only handles direct ordering with no quotation management.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight text-growmax-black mb-4">Wholesale Inventory Management</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  B2B Wave syncs inventory from a single source (typically QuickBooks). Growmax ARC manages <Link href="/blog/multi-warehouse-b2b-ecommerce-platform-architecture" className="text-growmax-red hover:underline font-medium">multi-warehouse inventory</Link> with intelligent allocation logic, low-stock alerts, and real-time visibility across all locations. For distributors with multiple warehouse or branch locations, this is a fundamental capability gap that B2B Wave cannot address.
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
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Distributors Choose ARC Over B2B Wave</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-testid="section-why-growmax-wins">
            {[
              {
                number: "01",
                icon: <Smartphone className="w-8 h-8" />,
                title: "Offline Field Sales App",
                description: "B2B Wave has no mobile app for field reps. ARC gives your sales team iOS/Android apps with offline order creation, customer-specific pricing, and visit logging — even without connectivity."
              },
              {
                number: "02",
                icon: <Database className="w-8 h-8" />,
                title: "Multi-Warehouse Intelligence",
                description: "B2B Wave tracks inventory from a single source. ARC manages stock across multiple warehouses with intelligent allocation logic, ensuring you never oversell or misallocate."
              },
              {
                number: "03",
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Built-In Sales Pipeline",
                description: "ARC includes opportunity management, visit logging, and pipeline analytics. B2B Wave is an ordering portal with no sales management capabilities — you'd need a separate CRM."
              },
              {
                number: "04",
                icon: <Users className="w-8 h-8" />,
                title: "Partner Commerce Portal",
                description: "ARC includes a full partner engagement portal for channel partners to place orders, track deliveries, and manage their accounts. B2B Wave has no partner-specific functionality."
              },
              {
                number: "05",
                icon: <Globe className="w-8 h-8" />,
                title: "Native Zoho + QuickBooks + Xero",
                description: "B2B Wave was built around QuickBooks. ARC connects natively to Zoho, QuickBooks, and Xero — plus SAP for businesses that outgrow SMB accounting. More integration options, more flexibility."
              },
              {
                number: "06",
                icon: <DollarSign className="w-8 h-8" />,
                title: "Lower Cost, More Value",
                description: "At $199/mo with a mobile app included, ARC delivers more functionality at a lower price point than B2B Wave's $249/mo base tier which lacks mobile capabilities entirely."
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
            <Link href="/arc/compare/pepperi">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-compare-pepperi">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Comparison</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">ARC vs Pepperi</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">See how ARC stacks up against Pepperi's enterprise CPG platform — at a fraction of the cost.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Read Comparison <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/blog/b2b-sales-tips-strategies-distributors">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-blog-sales-tips">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Intelligence</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">B2B Sales Tips for Distributors</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">12 proven sales strategies that top-performing wholesale distributors use to close more deals.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Read Article <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/blog/push-vs-pull-marketing-b2b-strategy">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-blog-push-pull">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Intelligence</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Push vs Pull Marketing</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Which marketing strategy works for B2B distributors — and how to combine both for maximum growth.</p>
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
            More features.<br/>Lower price.<br/>Deploy ARC today.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10">
            Start your 14-day free trial. No credit card required. Full platform access from day one.
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
